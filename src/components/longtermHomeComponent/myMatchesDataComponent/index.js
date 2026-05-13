import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, Image, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import axios from 'axios';
import {BASE_URL} from '../../../utils/constants';
import {colors} from '../../../utils/colors';
import {icons} from '../../../assets';
import ProfileAvatar from '../../letterProfileComponent';
import CompleteYourProfileModalComponent from '../../completeYourProfileModalComponent';
import Toast from 'react-native-toast-message';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const renderShimmer = () => {
  return (
    <FlatList
      data={[1, 2, 3, 4]}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingLeft: wp(17)}}
      renderItem={() => (
        <View style={{marginRight: 10}}>
          <View
            style={{
              width: wp(156),
              height: hp(270),
              borderRadius: hp(20),
              backgroundColor: '#E0E0E0',
              padding: hp(10),
            }}>
            <ShimmerPlaceholder
              style={{
                width: '100%',
                height: hp(180),
                borderRadius: hp(10),
              }}
            />

            <ShimmerPlaceholder
              style={{
                width: '60%',
                height: hp(10),
                marginTop: hp(10),
                borderRadius: hp(5),
              }}
            />

            <ShimmerPlaceholder
              style={{
                width: '40%',
                height: hp(10),
                marginTop: hp(8),
                borderRadius: hp(5),
              }}
            />
          </View>
        </View>
      )}
    />
  );
};

const MyMatchesDataComponent = ({toastConfigs, onShowAlert}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);

  const accessToken = user?.tokens?.access?.token;

  const [loading, setLoading] = useState(false); // Loading state
  const [users, setUsers] = useState([]); // State to store the user data
  const [totalCount, setTotalCount] = useState(0);
  const [profileCompleteModal, setProfileCompleteModal] = useState(false);
  const [selectedUserForRequest, setSelectedUserForRequest] = useState(null);

  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  const fetchData = async () => {
    try {
      setLoading(true); // 🔥 START LOADING

      const response = await axios.get(
        `${BASE_URL}/v1/user/user/getMatchUser`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const apiData = response.data?.data?.[0];

      const userData = apiData?.paginatedResults || [];
      const totalDocs = apiData?.totalDocs || 0;

      setUsers(userData);
      setTotalCount(totalDocs);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // 🔥 STOP LOADING
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, []),
  );

  const onCompleteProfilePress = () => {
    setProfileCompleteModal(false);
    navigation.navigate('CreatingProfileScreen');
  };

  const onSendRequestPress = () => {
    if (selectedUserForRequest) {
      OnsendRequestedSend(selectedUserForRequest);
    }

    setProfileCompleteModal(false);
    setSelectedUserForRequest(null);
  };

  const OnsendRequestedSend = async item => {
    try {
      // console.log(' === Sending Friend Request ===> ', item);

      const response = await axios.post(
        `${BASE_URL}/api/v1/user/friend/create-friend`,
        {
          friend: item?._id,
          user: user?.user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Friend request sent successfully:', response.data);

      // Update the specific item in newUserData to reflect the request status
      setUsers(prevData =>
        prevData.map(userItem =>
          userItem._id === item._id
            ? {
                ...userItem,
                friendsDetails: {
                  ...(userItem.friendsDetails || {}),
                  status: 'requested', // Update status to 'requested'
                },
              }
            : userItem,
        ),
      );

      onShowAlert?.('Friend request sent');
    } catch (error) {
      // Alert.alert('Error', 'Failed to send friend request.');
      console.log(' === Error ===> ', 'Failed to send friend request.');
      onShowAlert?.('Failed to send request');
    }
  };

  const handleRequestAction = async (item, requestId) => {
    if (!requestId) {
      console.log('❌ requestId missing');
      onShowAlert?.('Something went wrong');
      return;
    }

    if (item?.friendsDetails?.status === 'requested') {
      try {
        const response = await axios.post(
          `${BASE_URL}/api/v1/user/friend/respond-friend-req`,
          {
            user: item?._id,
            request: requestId, // ✅ now correct
            status: 'removed',
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        // ✅ Update UI
        setUsers(prevData =>
          prevData.map(userItem =>
            userItem._id === item._id
              ? {
                  ...userItem,
                  friendsDetails: {
                    ...(userItem.friendsDetails || {}),
                    status: null,
                  },
                }
              : userItem,
          ),
        );

        onShowAlert?.('Friend request removed');
      } catch (error) {
        console.log('Error:', error?.response?.data || error);
        onShowAlert?.('Failed to remove request');
      }
    }
  };

  const handleLikePress = item => {
    const isLiked = item?.userLikeDetails?.isLike; // Access the isLike property

    if (isLiked) {
      // If already liked, call the update-like API to unlike
      // updateLike(item?.userLikeDetails?._id || item?.userLikeDetails?.id);
      updateLike(item);

      // console.log(' === var ===> ', item?.userLikeDetails?.id);
    } else {
      // If not liked, call the create-like API to like
      createLike(item._id);
    }
  };

  const createLike = async likedUserId => {
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/user/like/create-like`,
        {
          likedUserId: likedUserId,
          isLike: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      // Handle successful response, update state with the new like status
      console.log('Like created successfully:', response.data);

      // Extract the id from the response data
      const {id, isLike} = response.data.data;

      // Update the local state with the new like status and id
      setUsers(prevData => {
        return prevData.map(user =>
          user._id === likedUserId
            ? {
                ...user,
                userLikeDetails: {
                  ...user.userLikeDetails,
                  isLike: isLike, // Update with the correct isLike status from response
                  id: id, // Add the id from response
                },
              }
            : user,
        );
      });

      onShowAlert?.('Profile Like'); // 🔔 ALERT
    } catch (error) {
      console.error('Error creating like:', error);
      // Alert.alert('Error', 'Failed to create like.');
      onShowAlert?.('Failed to Profile Like');
    }
  };

  const updateLike = async likedUserId => {
    const likeId =
      likedUserId?.userLikeDetails?._id || likedUserId?.userLikeDetails?.id;

    const userId = likedUserId?._id || likedUserId?.id;

    try {
      // Sending the request to update the like status to false (unlike)
      const response = await axios.put(
        `${BASE_URL}/api/v1/user/like/update-like/${likeId}`,
        {
          likedUserId: userId,
          isLike: false, // Dislike the user
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log('Like updated successfully:', response.data.data);

      // Update the local state to reflect the unliked status
      const {id, isLike} = response.data.data;

      setUsers(prevData => {
        const updatedData = prevData.map(user => {
          if ((user?._id || user?.id) === userId) {
            return {
              ...user,
              userLikeDetails: {
                ...(user.userLikeDetails || {}),
                isLike: false,
              },
            };
          }
          return user;
        });

        return updatedData;
      });

      // If necessary, re-fetch the data after updating
      // await fetchNewUserData();

      onShowAlert?.('Profile Disliked'); // 🔔 ALERT
    } catch (error) {
      console.error('Error updating like:', error);
      // Alert.alert('Error', 'Failed to update like.');

      onShowAlert?.('Failed to Profile Disliked');
    }
  };

  const modifiedData =
    totalCount > 10 ? [...users.slice(0, 10), {isShowMore: true}] : users;

  const isProfileCompletedForReq = user?.user?.isUserprofileCompletedForReq;

  const renderItem = ({item}) => {
    const {selectedPlan, status} = item?.subscriptionDetails || {};

    // Determine if the selected plan is 'gold' (for the crown icon)
    const isGoldPlan = selectedPlan === 'gold';
    const isSilverPlan = selectedPlan === 'silver';
    const isPlatinumPlan = selectedPlan === 'Platinum';

    const subPlan = isGoldPlan || isSilverPlan || isPlatinumPlan;

    let crownTintColor = 'white'; // Default to white
    if (isGoldPlan) {
      crownTintColor = 'orange'; // Gold plan -> orange tint
    } else if (isSilverPlan) {
      crownTintColor = 'silver'; // Silver plan -> silver tint
    } else if (isPlatinumPlan) {
      crownTintColor = 'green'; // Platinum plan -> red tint
    }

    if (item?.isShowMore) {
      return (
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => {
            navigation.navigate('Matches', {initialTab: 'new'}); // 👈 passing "viewed"
          }}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingRight: wp(13),
            paddingLeft: wp(2),
          }}>
          <View
            style={{
              width: wp(156),
              height: hp(275),
              borderRadius: hp(20),
              backgroundColor: '#EBF2FE',
              // borderWidth: 1,
              // borderColor: '#3B82F6',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {/* Circle */}
            <View
              style={{
                width: hp(70),
                height: hp(69),
                borderRadius: hp(35),
                backgroundColor: '#7148E4',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: fontSize(18),
                  fontFamily: fontFamily.poppins500,
                  top: 5,
                  left: 5,
                }}>
                10+
              </Text>
            </View>

            <Text
              style={{
                marginTop: hp(12),
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
              }}>
              Show All Profiles
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    const hasValidImage =
      item.profilePic &&
      item.profilePic !== 'null' &&
      item.profilePic.trim() !== '';

    const profilePrivacy =
      item.privacySettingCustom?.profilePhotoPrivacy === true ||
      item.privacySettingCustom?.showPhotoToFriendsOnly === true;

    const firstName = item?.firstName
      ? item.firstName.charAt(0).toUpperCase() +
        item.firstName.slice(1).toLowerCase()
      : '';

    const name = item?.name
      ? item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()
      : '';

    const lastName = item?.lastName
      ? item.lastName.charAt(0).toUpperCase() +
        item.lastName.slice(1).toLowerCase()
      : '';

    const currentCity = item?.address?.currentCity
      ? item?.address.currentCity.charAt(0).toUpperCase() +
        item?.address.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item?.address?.currentCountry
      ? item?.address.currentCountry.charAt(0).toUpperCase() +
        item?.address.currentCountry.slice(1).toLowerCase()
      : '';

    const calculateAge = dateOfBirth => {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      // Adjust age if the current date is before the birthday in the current year
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    };

    const age = calculateAge(item.dateOfBirth);

    const handlePress = items => {
      const matchesUserData = {
        firstName: items.name,
        id: items?._id,
      };
      // console.log(' === var ===> ', matchesUserData);
      // navigation.navigate('NewUserDetailsScreen', {matchesUserData});
      navigation.navigate('UserProfileDetailsScreen', {matchesUserData});
    };

    const isLiked = item?.userLikeDetails?.isLike; // Access the isLike property

    const friendStatus = item?.friendsDetails?.status;

    // Set the icon based on the friend request status
    const friendIconSource =
      friendStatus === 'accepted'
        ? icons.new_user_send_icon // Request already accepted
        : friendStatus === 'requested'
        ? icons.new_Req_Sent_Icon // Request already sent, allow for rejection
        : icons.new_Sent_Req_Icon; // No request sent, allow sending a request

    if (item?.isShowMore) {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('AllProfilesScreen')}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 13,
          }}>
          <View
            style={{
              width: wp(156),
              height: hp(285),
              borderRadius: hp(20),
              backgroundColor: '#E6ECF5',
              borderWidth: 1,
              borderColor: '#3B82F6',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: hp(70),
                height: hp(70),
                borderRadius: hp(35),
                backgroundColor: '#6D5DF6',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: 'white', fontSize: 16}}>10+</Text>
            </View>

            <Text style={{marginTop: 10, color: '#000'}}>
              Show All Profiles
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          paddingHorizontal: wp(13),
          marginLeft: -12,
        }}
        activeOpacity={0.6}
        onPress={() => {
          handlePress(item);
        }}>
        <View
          style={{
            width: wp(156),
            // height: hp(285),
            height: 'auto',
            borderRadius: hp(20),
            backgroundColor: '#FFFFFF',
            borderWidth: hp(1),
            borderColor: '#EFEFEF',
          }}>
          {hasValidImage ? (
            <>
              <Image
                source={{uri: item.profilePic}}
                style={{
                  width: '100%',
                  height: hp(184),
                  borderTopRightRadius: hp(20),
                  borderTopLeftRadius: hp(20),
                }}
              />
              {profilePrivacy && (
                <Image
                  source={icons.logLogo} // make sure you have a `lock` icon inside `icons`
                  style={{
                    position: 'absolute',
                    tintColor: '#fff',
                    resizeMode: 'contain',
                    width: hp(20),
                    height: hp(20),
                    alignSelf: 'center',
                    top: 110,
                  }}
                />
              )}

              {subPlan && (
                <Image
                  source={icons.crownIcon} // Crown icon
                  style={{
                    position: 'absolute',
                    top: 12,
                    resizeMode: 'contain',
                    height: hp(12),
                    width: hp(12),
                    tintColor: crownTintColor,
                    left: 15,
                  }}
                />
              )}
            </>
          ) : (
            <>
              <ProfileAvatar
                firstName={item.firstName || item.name}
                lastName={item.lastName}
                textStyle={{
                  width: '100%',
                  height: hp(184),
                  borderTopRightRadius: hp(20),
                  borderTopLeftRadius: hp(20),
                  borderBottomLeftRadius: hp(0),
                  borderBottomRightRadius: hp(0),
                }}
              />
              {subPlan && (
                <Image
                  source={icons.crownIcon} // Crown icon
                  style={{
                    position: 'absolute',
                    top: 12,
                    resizeMode: 'contain',
                    height: hp(12),
                    width: hp(12),
                    tintColor: crownTintColor,
                    left: 15,
                  }}
                />
              )}
            </>
          )}

          {item?.isUserActive && (
            <View
              style={{
                position: 'absolute',
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '100%',
              }}>
              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: 13,
                  top: 10,
                  backgroundColor: 'black',
                  width: wp(43),
                  height: hp(16),
                  borderRadius: hp(50),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: fontSize(8),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  Online
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={{alignItems: 'center', marginTop: hp(11)}}>
            <Text
              style={{
                fontSize: fontSize(12),
                lineHeight: hp(16),
                fontFamily: fontFamily.poppins600,
                color: colors.black,
              }}>
              {firstName || name} {lastName}
            </Text>

            <View style={{flexDirection: 'row', marginTop: hp(5)}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: fontSize(9),
                  color: '#9C9C9C',
                  fontFamily: fontFamily.poppins400,
                }}>
                {item?.age || 'N/A'} yr, {item?.height || 'N/A'},{' '}
                {currentCity || 'N/A'}, {currentCountry || 'N/A'}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(11),
                marginBottom: hp(9),
              }}>
              <TouchableOpacity
                onPress={() => {
                  const status = item?.friendsDetails?.status;

                  if (status === 'requested') {
                    handleRequestAction(
                      item,
                      item?.friendsDetails?._id || item,
                      item?.friendsDetails?.id,
                    );
                  } else {
                    if (!isProfileCompletedForReq) {
                      // ❌ Profile NOT completed → Show modal
                      setSelectedUserForRequest(item);
                      setProfileCompleteModal(true);
                    } else {
                      // ✅ Profile completed → Directly send request
                      OnsendRequestedSend(item);
                    }
                  }
                }}>
                <Image
                  source={friendIconSource}
                  style={{
                    width: wp(97),
                    height: hp(28),
                    resizeMode: 'contain',
                    marginRight: 8,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleLikePress(item)}>
                <Image
                  source={
                    isLiked
                      ? icons.new_Heart_Like_Icon
                      : icons.new_Heart_Unlike_Icon
                  }
                  style={{
                    width: wp(28),
                    height: hp(28),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      {loading ? (
        renderShimmer()
      ) : users?.length === 0 ? (
        // 🔥 EMPTY STATE
        <View
          style={{
            height: hp(250),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={icons.no_Profile_Found_img} // 👈 optional
            style={{
              width: hp(80),
              height: hp(80),
              resizeMode: 'contain',
              marginBottom: 10,
            }}
          />

          <Text
            style={{
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins500,
              color: colors.black,
            }}>
            No Matches Found
          </Text>

          <Text
            style={{
              fontSize: fontSize(12),
              fontFamily: fontFamily.poppins400,
              color: '#999',
              marginTop: 5,
            }}>
            Try again later
          </Text>
        </View>
      ) : (
        <FlatList
          data={modifiedData}
          keyExtractor={(item, index) =>
            item?.isShowMore ? 'show-more' : item?._id || index.toString()
          }
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingRight: hp(10),
            paddingLeft: wp(17),
          }}
        />
      )}

      <CompleteYourProfileModalComponent
        visible={profileCompleteModal}
        onClose={() => setProfileCompleteModal(false)}
        onPrimaryPress={onCompleteProfilePress}
        onSecondaryPress={onSendRequestPress}
      />

      <Toast config={toastConfigs} />
    </SafeAreaView>
  );
};

export default MyMatchesDataComponent;
