import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addShortList, sendRequest} from '../../actions/homeActions';
import {icons, images} from '../../assets';
import {fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const PremiumMatchesComponent = ({isOnline}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const dispatch = useDispatch();

  console.log(' === PremiumMatchesComponent_______ ===> ', user);

  console.log(' === accessToken ===> ', accessToken);

  // USER ALL DATA FETCH API
  const fetchData = async (pageNumber = 1) => {
    if (!hasMoreData) {
      return;
    }

    try {
      console.log('Fetching data for page:', pageNumber);
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/user/getUserByGender?page=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const json = await response.json();
      const newData = json?.data[0]?.paginatedResults || [];

      if (newData.length === 0) {
        setHasMoreData(false);
      } else {
        setData(prevData => [...prevData, ...newData]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // SEND REQUEST FUNCTION
  const onFriendRequestButtonPress = item => {
    const token = user?.tokens?.access?.token;
    dispatch(sendRequest({friend: item?._id, user: user.user.id}));
  };

  // LIKE & DISLIKE FUNCTION
  const handleLikePress = async item => {
    // console.log(' === var ===> ', item?.userLikeDetails?._id);
    const deleteId = item?.userLikeDetails?._id;
    const isAlreadyLiked = item?.userLikeDetails?.isLike || false;
    const success = await likeOrUnlikeUser(
      item._id || item.id,
      isAlreadyLiked,
      deleteId,
    );

    // Update state if the API call is successful
    if (success !== null) {
      setData(prevData =>
        prevData.map(user =>
          user._id === item._id
            ? {
                ...user,
                userLikeDetails: {
                  ...user.userLikeDetails,
                  isLike: success,
                },
              }
            : user,
        ),
      );
    }
  };

  const likeOrUnlikeUser = async (likedUserId, isAlreadyLiked, deleteId) => {
    try {
      const url = isAlreadyLiked
        ? `https://stag.mntech.website/api/v1/user/like/update-like/${deleteId}`
        : 'https://stag.mntech.website/api/v1/user/like/create-like';
      const method = isAlreadyLiked ? 'PUT' : 'POST';
      const body = JSON.stringify({
        likedUserId,
        isLike: !isAlreadyLiked,
      });

      console.log(`Calling ${isAlreadyLiked ? 'PUT' : 'POST'} API for like`);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body,
      });

      const result = await response.json();
      console.log('Response:', result);

      if (response.ok) {
        return !isAlreadyLiked; // Toggle the like state
      } else {
        throw new Error(result.message || 'Error liking user');
      }
    } catch (error) {
      console.error('Error liking/unliking user:', error.message);
      Alert.alert('Error', 'Failed to like/unlike user. Please try again.');
      return null;
    }
  };

  //SHORTLIST FUNCTION
  const handleShortlistPress = async item => {
    const isShortlisted = !!item.userShortListDetails; // If `userShortListDetails` exists, the user is shortlisted
    const shortlistId = item._id;

    if (isShortlisted) {
      // If the user is already shortlisted, delete from shortlist
      const success = await removeFromShortlist(item.userShortListDetails._id);
      if (success) {
        setData(prevData =>
          prevData.map(user =>
            user._id === item._id
              ? {
                  ...user,
                  userShortListDetails: null, // Remove shortlist details on success
                }
              : user,
          ),
        );
      }
    } else {
      // If the user is not shortlisted, add to shortlist
      const success = await addToShortlist(shortlistId);
      if (success) {
        setData(prevData =>
          prevData.map(user =>
            user._id === item._id
              ? {
                  ...user,
                  userShortListDetails: {_id: shortlistId}, // Add shortlist details on success
                }
              : user,
          ),
        );
      }
    }
  };

  // API call to remove user from shortlist
  const removeFromShortlist = async deleteId => {
    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const result = await response.json();
      console.log('Remove from Shortlist Response:', result);

      if (response.ok) {
        // Alert.alert('Success', 'User removed from shortlist!');
        console.log(' === Success ===> ', 'User removed from shortlist!');
        return true;
      } else {
        throw new Error(result.message || 'Error removing user from shortlist');
      }
    } catch (error) {
      console.error('Error removing from shortlist:', error.message);
      // Alert.alert(
      //   'Error',
      //   'Failed to remove from shortlist. Please try again.',
      // );
      console.log(
        ' === Error ===> ',
        'Failed to remove from shortlist. Please try again.',
      );
      return false;
    }
  };

  // API call to shortlist a user
  const addToShortlist = async shortlistId => {
    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/shortlist/create-shortlist',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({shortlistId}),
        },
      );

      const result = await response.json();
      console.log('Shortlist Response:', result);

      if (response.ok) {
        // Alert.alert('Success', 'User added to shortlist!');
        console.log(' === Success ===> ', 'User added to shortlist!');
        return true;
      } else {
        throw new Error(result.message || 'Error adding user to shortlist');
      }
    } catch (error) {
      console.error('Error adding to shortlist:', error.message);
      // Alert.alert('Error', 'Failed to add to shortlist. Please try again.');
      console.log(
        ' === Error ===> ',
        'Failed to add to shortlist. Please try again.',
      );
      return false;
    }
  };

  const calculateAge = dateOfBirth => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const loadMoreData = () => {
    if (!isFetchingMore && hasMoreData) {
      setIsFetchingMore(true);
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchData(nextPage);
        return nextPage;
      });
    }
  };

  const renderUserItem = ({item}) => {
    // console.log(' === send  ===> ', item?.friendsDetails);

    const likeIconSource = item?.userLikeDetails?.isLike
      ? icons.new_user_like_icon // Show this if user liked the item
      : icons.new_like_icon;

    const shortlistIconSource = item.userShortListDetails
      ? icons.new_user_addStar_icon // If already shortlisted, show upgrade icon
      : icons.new_star_icon; // If not shortlisted, show star icon

    const currentCity = item.address ? item.address.currentCity : '';
    const currentCountry = item.address ? item.address.currentCountry : '';
    const age = calculateAge(item.dateOfBirth);

    // Extract the friend status
    const friendStatus = item?.friendsDetails?.status;

    // Set the icon based on the friend request status
    const friendIconSource =
      friendStatus === 'accepted' || friendStatus === 'requested'
        ? icons.new_user_send_icon // Show cancel request icon
        : icons.new_send_icon; // Show share icon if no request

    return (
      <View style={styles.itemContainer}>
        <View
          style={{
            height: hp(213),
            borderRadius: 5,
            backgroundColor: '#FFFFFF',
            shadowColor: '#000',
            shadowOpacity: 0.5,
            shadowRadius: 6,
            elevation: 2,
          }}>
          <View>
            <Image
              style={
                item.profilePic
                  ? styles.image
                  : [styles.image, styles.imageWithBorder]
              }
              source={
                item.profilePic
                  ? {uri: item.profilePic}
                  : images.empty_male_Image
              }
            />
            <View style={styles.overlayContainer}>
              {isOnline && (
                <View style={styles.onlineBodyContainer}>
                  <Text style={styles.onlineText}>Online</Text>
                </View>
              )}

              <TouchableOpacity
                onPress={() => handleShortlistPress(item)}
                style={{position: 'absolute', right: 0, padding: 10}}>
                <Image source={shortlistIconSource} style={styles.starIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{alignItems: 'center'}}>
            <Text style={styles.name}>
              {item.firstName} {item.lastName}
            </Text>
            <View style={styles.nameContainer}>
              <Text style={styles.nameDetailTextStyle}>{age || 'N/A'}</Text>
              <Text style={styles.nameDetailTextStyle}> yrs, </Text>
              <Text style={styles.nameDetailTextStyle}>
                {item.state || 'N/A'}
              </Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameDetailTextStyle}>
                {currentCity || 'N/A'}, {currentCountry || 'N/A'}
              </Text>
            </View>
            <View style={styles.shareImageContainer}>
              {/*<TouchableOpacity style={styles.shareImageContainerStyle}>*/}
              {/*  <Image*/}
              {/*    source={icons.thumsDownIcon}*/}
              {/*    style={styles.shareImageStyle}*/}
              {/*  />*/}
              {/*</TouchableOpacity>*/}

              <TouchableOpacity
                style={styles.shareImageContainerStyle}
                onPress={() => handleLikePress(item)}>
                <Image source={likeIconSource} style={styles.shareImageStyle} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareImageContainerStyle}
                onPress={() => onFriendRequestButtonPress(item)}>
                <Image
                  source={friendIconSource}
                  style={styles.shareImageStyle}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderUserItem}
      keyExtractor={(item, index) => (item._id || item.id || item.name) + index}
      onEndReached={loadMoreData}
      onEndReachedThreshold={0.5}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      ListFooterComponent={
        isFetchingMore ? (
          <View style={{alignItems: 'center'}}>
            <Text>Loading Data...</Text>
          </View>
        ) : null
      }
      ListEmptyComponent={
        !loading && !isFetchingMore ? (
          <View
            style={{
              padding: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>No data available</Text>
          </View>
        ) : null
      }
      // contentContainerStyle={{paddingBottom: 200}}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 13,
    marginLeft: -12,
  },
  image: {
    width: wp(110),
    height: hp(136),
    borderRadius: 6,
    marginBottom: 8,
  },
  imageWithBorder: {
    borderWidth: 0.5,
    borderColor: '#D3D3D3',
  },
  overlayContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  onlineText: {
    color: 'black',
    fontSize: fontSize(6),
    alignItems: 'center',
    textAlign: 'center',
  },
  starIcon: {
    width: hp(10.83),
    height: hp(10),
    resizeMode: 'contain',
  },
  name: {
    fontSize: fontSize(10),
    lineHeight: hp(15),
    fontWeight: '700',
    color: colors.black,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  nameDetailTextStyle: {
    fontSize: fontSize(8),
    lineHeight: hp(12),
    color: colors.black,
  },
  shareImageContainer: {
    flexDirection: 'row',
    marginTop: hp(5),
  },
  shareImageContainerStyle: {
    marginHorizontal: 4,
  },
  shareImageStyle: {
    width: hp(32),
    height: hp(20),
    resizeMode: 'contain',
  },
});

export default PremiumMatchesComponent;
