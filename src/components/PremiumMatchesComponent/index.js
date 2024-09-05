import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import {icons, images} from '../../assets';
import {fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {useDispatch, useSelector} from 'react-redux';
import {addShortList, sendRequest} from '../../actions/homeActions';

const PremiumMatchesComponent = ({data, shareButtonPress, isOnline}) => {
  const {user} = useSelector(state => state.auth);

  // console.log(' === user... ===> ', user.user.id);
  const [shortlistedUsers, setShortlistedUsers] = useState([]);

  const dispatch = useDispatch();

  const {userData} = useSelector(state => state.home);

  const fetchShortlistedUsers = async () => {
    const token = user?.tokens?.access?.token;
    try {
      const response = await axios.get(
        `https://happymilan.tech/api/v1/user/shortlist/get-short-list/${user.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const fetchedShortlistedUsers = response.data.data;
      setShortlistedUsers(fetchedShortlistedUsers);
      console.log('Fetched shortlisted users:', fetchedShortlistedUsers);
    } catch (error) {
      console.error(
        'Error fetching shortlisted users:',
        error.response?.data || error.message,
      );
    }
  };

  const isUserShortlisted = userId => {
    return shortlistedUsers.some(user => user.userId === userId);
  };

  useEffect(() => {
    if (user?.user?.id) {
      fetchShortlistedUsers();
    }
  }, [user]);

  const onFriendRequestButtonPress = item => {
    const token = user?.tokens?.access?.token;
    dispatch(sendRequest({friend: item?._id, user: user.user.id}));
  };

  const onShortListPress = async item => {
    const token = user?.tokens?.access?.token;
    const itemId = item._id;
    const isShortlisted = isUserShortlisted(itemId);

    console.log('Item ID:', itemId);

    if (isShortlisted) {
      // If the item is already shortlisted, remove it
      try {
        const shortlistToDelete = shortlistedUsers.find(
          user => user.userId === itemId,
        );
        if (!shortlistToDelete) {
          console.error('No shortlist found to delete');
          return;
        }

        const response = await axios.delete(
          `https://happymilan.tech/api/v1/user/shortlist/delete-short-list/${shortlistToDelete.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        console.log('Shortlist deleted:', response.data);
        setShortlistedUsers(
          shortlistedUsers.filter(user => user.userId !== itemId),
        );
      } catch (error) {
        console.error(
          'Error deleting shortlist:',
          error.response?.data || error.message,
        );
      }
    } else {
      // If the item is not shortlisted, add it
      try {
        const response = await axios.post(
          'https://happymilan.tech/api/v1/user/shortlist/create-shortlist',
          {shortlistId: itemId}, // Use itemId to create the shortlist
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const newShortlist = response.data.data;
        console.log('Shortlist created:', newShortlist);

        setShortlistedUsers([
          ...shortlistedUsers,
          {userId: itemId, id: newShortlist.id},
        ]);
      } catch (error) {
        console.error(
          'Error creating shortlist:',
          error.response?.data || error.message,
        );
      }
    }
  };

  const onLikePress = async item => {
    console.log(' === var ===> ', item._id);
    const token = user?.tokens?.access?.token;

    console.log(' === token ===> ', token);

    try {
      const response = await axios.post(
        'https://happymilan.tech/api/v1/user/like/create-like',
        {
          likedUserId: item._id,
          isLike: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('Like API response:', response.data);
    } catch (error) {
      console.error(
        'Error creating like:',
        error.response?.data || error.message,
      );
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

  return (
    <FlatList
      data={userData.data}
      keyExtractor={item => item.id}
      renderItem={({item}) => {
        // console.log(' === item..... ===> ', item.userShortListDetails);

        const currentCity = item.address ? item.address.currentCity : '';
        const currentCountry = item.address ? item.address.currentCountry : '';
        const age = calculateAge(item.dateOfBirth);

        const imageStyle = item.profilePic
          ? styles.image
          : [styles.image, styles.imageWithBorder];

        // const isShortlisted = shortlistedUsers.some(
        //   user => user.itemId === item._id,
        // );

        const isShortlisted = isUserShortlisted(item._id);

        return (
          <View style={styles.itemContainer}>
            <View>
              <Image
                style={imageStyle}
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

                <View style={{position: 'absolute', right: 0, padding: 10}}>
                  <TouchableOpacity onPress={() => onShortListPress(item)}>
                    <Image
                      style={styles.starIcon}
                      source={
                        isShortlisted
                          ? icons.user_add_short_list // Replace with your shortlist image
                          : icons.starIcon // Default star icon
                      }
                    />

                    {/*<Image*/}
                    {/*  style={styles.starIcon}*/}
                    {/*  source={*/}
                    {/*    item.userShortListDetails*/}
                    {/*      ? item.userShortListDetails.length > 0*/}
                    {/*        ? icons.starIcon*/}
                    {/*        : icons.user_add_short_list*/}
                    {/*      : isShortlisted*/}
                    {/*      ? icons.user_add_short_list*/}
                    {/*      : icons.starIcon*/}
                    {/*  }*/}
                    {/*/>*/}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text style={styles.name}>
              {item.firstName} {item.lastName}
            </Text>
            <View style={styles.nameContainer}>
              <Text style={styles.nameDetailTextStyle}>{age || 'N/A'}</Text>
              <Text style={styles.nameDetailTextStyle}>yrs,</Text>
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
              <View style={styles.shareImageContainerStyle}>
                <TouchableOpacity>
                  <Image
                    source={icons.thumsDownIcon}
                    style={styles.shareImageStyle}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.shareImageContainerStyle}>
                <TouchableOpacity onPress={() => onLikePress(item)}>
                  <Image
                    source={icons.likeIcon}
                    style={styles.shareImageStyle}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.shareImageContainerStyle}>
                <TouchableOpacity
                  onPress={() => onFriendRequestButtonPress(item)}>
                  <Image
                    source={icons.shareIcon}
                    style={styles.shareImageStyle}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
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
    borderColor: '#D3D3D3', // Adjust the border color as needed
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
    tintColor: colors.blue,
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
    marginTop: hp(2),
  },
  shareImageContainerStyle: {
    marginHorizontal: 4,
  },
  shareImageStyle: {
    width: hp(16),
    height: hp(16),
    resizeMode: 'contain',
  },
});

export default PremiumMatchesComponent;
