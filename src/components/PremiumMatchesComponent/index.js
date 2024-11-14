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
import {
  accepted_Decline_Request,
  addShortList,
  sendRequest,
} from '../../actions/homeActions';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
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

  // console.log(' === PremiumMatchesComponent_______ ===> ', user);

  // console.log(' === accessToken ===> ', accessToken);

  // USER ALL DATA FETCH API
  const fetchData = async (pageNumber = 1) => {
    if (!hasMoreData) {
      return;
    }

    try {
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
        setHasMoreData(false); // No more data to fetch
      } else {
        setData(prevData => {
          const mergedData = [...prevData];
          newData.forEach(newItem => {
            if (!mergedData.some(item => item._id === newItem._id)) {
              mergedData.push(newItem); // Avoid duplicates
            }
          });
          return mergedData; // Update with merged data
        });
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

  const loadMoreData = () => {
    if (!isFetchingMore && hasMoreData) {
      setIsFetchingMore(true);
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchData(nextPage); // Fetch more data when reaching the end
        return nextPage;
      });
    }
  };

  // SEND REQUEST FUNCTION
  const onFriendRequestButtonPress = async item => {
    console.log(' === onFriendRequestButtonPress ===> ', item?.friendsDetails);

    const requestId = item?.friendsDetails?._id;

    console.log(' === Friend Request ID ===> ', requestId);

    // Check if the status is 'accepted'
    if (item?.friendsDetails?.status === 'accepted') {
      // If the status is 'accepted', remove the friend request
      try {
        await dispatch(
          accepted_Decline_Request({
            user: item?._id,
            request: requestId, // Use the existing request ID
            status: 'removed',
          }),
        );

        // Update the UI after removing the friend request
        setData(prevData =>
          prevData.map(userItem =>
            userItem._id === item._id
              ? {
                  ...userItem,
                  friendsDetails: {
                    ...userItem.friendsDetails,
                    status: 'none', // Update status locally to reflect removal
                  },
                }
              : userItem,
          ),
        );
      } catch (error) {
        console.error('Error removing friend request:', error);
        Alert.alert(
          'Error',
          'Failed to remove friend request. Please try again.',
        );
      }
    } else if (item?.friendsDetails?.status === 'requested') {
      // If the status is 'requested', reject the friend request
      try {
        await dispatch(
          accepted_Decline_Request({
            user: item?._id,
            request: requestId, // Use the existing request ID
            status: 'removed',
          }),
        );

        // Update the UI after rejecting the request
        setData(prevData =>
          prevData.map(userItem =>
            userItem._id === item._id
              ? {
                  ...userItem,
                  friendsDetails: {
                    ...userItem.friendsDetails,
                    status: 'none', // Update status locally to reflect rejection
                  },
                }
              : userItem,
          ),
        );
      } catch (error) {
        console.error('Error rejecting friend request:', error);
        Alert.alert(
          'Error',
          'Failed to reject friend request. Please try again.',
        );
      }
    } else {
      // Otherwise, send a new friend request
      try {
        const token = user?.tokens?.access?.token;

        await dispatch(sendRequest({friend: item?._id, user: user.user.id}));

        // Update the specific item in the data array to reflect the friend request status
        setData(prevData =>
          prevData.map(userItem =>
            userItem._id === item._id
              ? {
                  ...userItem,
                  friendsDetails: {
                    ...userItem.friendsDetails,
                    status: 'requested', // Update the status locally
                  },
                }
              : userItem,
          ),
        );
      } catch (error) {
        console.error('Error sending friend request:', error);
        Alert.alert(
          'Error',
          'Failed to send friend request. Please try again.',
        );
      }
    }
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
      // Alert.alert('Error', 'Failed to like/unlike user. Please try again.');
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

  const renderUserItem = ({item}) => {
    // console.log(' === send  ===> ', item?.friendsDetails);

    // console.log(' === item______ ===> ', item.address.currentCity);

    const firstName = item?.firstName
      ? item.firstName.charAt(0).toUpperCase() +
        item.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item?.lastName
      ? item.lastName.charAt(0).toUpperCase() +
        item.lastName.slice(1).toLowerCase()
      : '';

    const currentCity = item.address?.currentCity
      ? item.address.currentCity.charAt(0).toUpperCase() +
        item.address.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item.address?.currentCountry
      ? item.address.currentCountry.charAt(0).toUpperCase() +
        item.address.currentCountry.slice(1).toLowerCase()
      : '';

    // const currentCity = item.address ? item.address.currentCity : '';
    // const currentCountry = item.address ? item.address.currentCountry : '';

    const likeIconSource = item?.userLikeDetails?.isLike
      ? icons.new_user_like_icon // Show this if user liked the item
      : icons.new_like_icon;

    const shortlistIconSource = item.userShortListDetails
      ? icons.new_user_addStar_icon // If already shortlisted, show upgrade icon
      : icons.new_star_icon; // If not shortlisted, show star icon

    const age = calculateAge(item.dateOfBirth);

    // Extract the friend status
    const friendStatus = item?.friendsDetails?.status;

    // Set the icon based on the friend request status
    const friendIconSource =
      friendStatus === 'accepted'
        ? icons.new_user_send_icon // Request already accepted
        : friendStatus === 'requested'
        ? icons.new_user_send_icon // Request already sent, allow for rejection
        : icons.new_send_icon; // No request sent, allow sending a request

    return (
      <View style={styles.itemContainer}>
        <View
          style={{
            height: hp(225),
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            // shadowColor: '#EFEFEF',
            borderWidth: 1,
            borderColor: '#EFEFEF',
            // shadowOpacity: 0.5,
            // shadowRadius: 6,
            // elevation: 2,
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
              {firstName} {lastName}
            </Text>
            <View style={styles.nameContainer}>
              <Text style={styles.nameDetailTextStyle}>{age || 'N/A'}</Text>
              <Text style={styles.nameDetailTextStyle}> yrs, </Text>
              <Text style={styles.nameDetailTextStyle}>
                {item?.height || 'N/A'}
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
    marginTop: 12,
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
    fontSize: fontSize(12),
    lineHeight: hp(15),
    fontFamily: fontFamily.poppins700,
    color: colors.black,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  nameDetailTextStyle: {
    fontSize: fontSize(9),
    lineHeight: hp(12),
    color: colors.black,
    fontFamily: fontFamily.poppins400,
    top: 5,
  },
  shareImageContainer: {
    flexDirection: 'row',
    marginTop: hp(12),
  },
  shareImageContainerStyle: {
    marginHorizontal: 4,
  },
  shareImageStyle: {
    width: hp(38),
    height: hp(22),
    resizeMode: 'stretch',
    // marginRight: 8,
  },
});

export default PremiumMatchesComponent;
