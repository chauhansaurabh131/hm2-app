import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  ActivityIndicator,
  View,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import UsersProfileDetailsScreen from '../usersProfileDetailsScreen';

import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {style} from './style';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import NewAddStoryScreen from '../newAddStoryScreen';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {accepted_Decline_Request} from '../../actions/homeActions';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const NewUserDetailsScreen = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageRotation, setImageRotation] = useState('90deg');
  const [requestStatus, setRequestStatus] = useState('pending'); // Default state is 'pending'
  const route = useRoute();
  const {matchesUserData} = route.params;
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;
  const userImage = user?.user?.profilePic;

  const topModalBottomSheetRef = useRef(null);

  console.log(' === userDetails__________________ ===> ', matchesUserData);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
    setImageRotation(showFullDescription ? '90deg' : '-90deg');
  };

  const openTopBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  // Fetch the data based on the user id (matchesUserData.id)
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!matchesUserData?.id || !accessToken) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/user/${matchesUserData.id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();

        // Assuming the data is an array and we need the first item
        if (data.data && data.data.length > 0) {
          setUserDetails(data.data[0]); // Set the first element of the data array
        } else {
          setError('No user data available');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [matchesUserData?.id, accessToken]);

  if (loading) {
    return (
      // <SafeAreaView style={style.centered}>
      //   <ActivityIndicator size="large" color="#0000ff" />
      // </SafeAreaView>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            marginHorizontal: 17,
            position: 'absolute',
            top: 20,
            width: '90%',
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <ShimmerPlaceholder style={{width: 120, height: 25}} />

            <ShimmerPlaceholder
              style={{width: 30, height: 30, borderRadius: 50, marginRight: 10}}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
            }}>
            <ShimmerPlaceholder
              style={{width: 50, height: 50, borderRadius: 50}}
            />
            <ShimmerPlaceholder
              style={{width: 50, height: 50, borderRadius: 50}}
            />
            <ShimmerPlaceholder
              style={{width: 50, height: 50, borderRadius: 50}}
            />
            <ShimmerPlaceholder
              style={{width: 50, height: 50, borderRadius: 50}}
            />
            <ShimmerPlaceholder
              style={{width: 50, height: 50, borderRadius: 50}}
            />
          </View>

          <ShimmerPlaceholder
            style={{
              width: '100%',
              height: hp(500),
              justifyContent: 'center',
              marginRight: 40,
              marginTop: 30,
              borderRadius: 10,
            }}
          />

          <View
            style={{
              marginTop: 30,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 30,
              borderRadius: 25,
            }}>
            <ShimmerPlaceholder
              style={{
                width: wp(142),
                height: hp(40),
                justifyContent: 'center',
                marginRight: 40,
                borderRadius: 25,
              }}
            />
            <ShimmerPlaceholder
              style={{
                width: wp(142),
                height: hp(40),
                justifyContent: 'center',
                marginRight: 40,
                borderRadius: 25,
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={style.centered}>
        <Text style={{color: 'red'}}>{error}</Text>
      </SafeAreaView>
    );
  }

  const handleShortlist = async () => {
    const loggedInUserId = userDetails._id; // Get the logged-in user's ID
    const currentShortlistId = userDetails?.userShortListDetails?._id;

    if (currentShortlistId) {
      // If the user is already in the shortlist, delete them
      try {
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${currentShortlistId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to delete from shortlist');
        }

        // Optimistically update the UI by setting the state before calling API
        setUserDetails(prevState => {
          const updatedState = {
            ...prevState,
            userShortListDetails: null, // Remove shortlistId as the user is no longer in the shortlist
          };
          return updatedState;
        });
      } catch (err) {
        alert('Error removing from shortlist');
        console.error(err);
      }
    } else {
      // If the user is not in the shortlist, add them

      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/shortlist/create-shortlist',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              shortlistId: loggedInUserId, // Use the logged-in user's ID for the request
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to add to shortlist');
        }

        // Assuming the response contains the created shortlist details
        const data = await response.json();

        // Extract the created shortlist ID (this is the ID you want to store)
        const createdShortlistId = data?.data?.id; // Extract the ID from the API response

        if (createdShortlistId) {
          // Optimistically update the UI by setting the state before calling API
          setUserDetails(prevState => {
            const updatedState = {
              ...prevState,
              userShortListDetails: {
                _id: createdShortlistId, // Store the newly created shortlist ID here
              },
            };
            console.log(
              'User Details after Adding to Shortlist:',
              updatedState,
            ); // Log the updated state
            return updatedState;
          });
        } else {
          alert('Shortlist creation failed: No valid ID returned');
        }
      } catch (err) {
        alert('Error adding to shortlist');
        console.error(err);
      }
    }
  };

  // Function to handle like action (add or remove)
  const handleLike = async () => {
    const likedUserId = userDetails._id; // The user you want to like/unlike
    const currentIsLike = userDetails?.userLikeDetails?.isLike;
    const currentIsLikeId = userDetails?.userLikeDetails?._id;

    if (currentIsLike === true) {
      // If already liked, remove the like

      try {
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/like/update-like/${currentIsLikeId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              likedUserId: likedUserId,
              isLike: false,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to remove like');
        }

        // Update user details after removing the like
        setUserDetails(prevState => ({
          ...prevState,
          userLikeDetails: {
            ...prevState.userLikeDetails,
            isLike: false, // Update the isLike to false
          },
        }));
      } catch (err) {
        alert('Error removing like');
        console.error(err);
      }
    } else {
      // If not liked, add the like
      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/like/create-like',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              likedUserId: likedUserId,
              isLike: true,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to add like');
        }

        // Update user details after adding the like
        setUserDetails(prevState => ({
          ...prevState,
          userLikeDetails: {
            ...prevState.userLikeDetails,
            isLike: true, // Update the isLike to true
          },
        }));
      } catch (err) {
        alert('Error adding like');
        console.error(err);
      }
    }
  };

  // Function to remove friend (respond to request)
  const removeFriendRequest = async () => {
    const {_id: requestId} = userDetails?.friendsDetails;

    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/friend/respond-friend-req',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: userDetails?._id,
            request: requestId,
            status: 'rejected', // Reject the friend request
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to remove friend request');
      }

      setUserDetails(prevState => ({
        ...prevState,
        friendsDetails: {...prevState.friendsDetails, status: 'removed'},
      }));
    } catch (err) {
      alert('Error removing friend');
      console.error(err);
    }
  };

  // Function to create a new friend request
  const sendFriendRequest = async () => {
    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/friend/create-friend',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            friend: userDetails?._id,
            user: userId,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }

      setUserDetails(prevState => ({
        ...prevState,
        friendsDetails: {...prevState.friendsDetails, status: 'requested'},
      }));
    } catch (err) {
      alert('Error sending friend request');
      console.error(err);
    }
  };

  const receivedFriendRequestedDecline = item => {
    const requestedId = item?.friendsDetails?._id;

    dispatch(
      accepted_Decline_Request(
        {
          user: userId,
          request: requestedId,
          status: 'rejected',
        },
        () => {
          // Updating the status to 'declined' in the user data after a successful API call
          setRequestStatus('declined'); // Update request status to 'declined'

          // Update userDetails to reflect the declined status
          setUserDetails(prevData => {
            return {
              ...prevData, // Keep the existing data
              friendsDetails: {
                ...prevData.friendsDetails,
                status: 'declined', // Update the status of the declined request
              },
            };
          });
        },
      ),
    );
  };

  const receivedFriendRequestedAccepted = item => {
    const requestedId = item?.friendsDetails?._id;

    // console.log(' === var ===> ', item?._id);

    dispatch(
      accepted_Decline_Request(
        {
          user: userId,
          request: requestedId,
          status: 'accepted',
        },
        () => {
          setRequestStatus('accepted');
          setUserDetails(prevData => {
            return {
              ...prevData, // Keep the existing data
              friendsDetails: {
                ...prevData.friendsDetails,
                status: 'accepted', // Update the status of the declined request
              },
            };
          });
        },
      ),
    );
  };

  const onSendMessagePress = allData => {
    const userData = allData?.userData;
    console.log(' === onSendMessagePress_____ ===> ', userData);

    navigation.navigate('ChatUserScreen', {
      userData,
    });
  };

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle null or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const firstName = capitalizeFirstLetter(userDetails?.firstName);
  const lastName = capitalizeFirstLetter(userDetails?.lastName);
  const jobTittle = capitalizeFirstLetter(
    userDetails?.userProfessional?.jobTitle,
  );
  const currentCity = capitalizeFirstLetter(userDetails?.address?.currentCity);
  const currentCountry = capitalizeFirstLetter(
    userDetails?.address?.currentCountry,
  );

  const imageCount = Array.isArray(userDetails?.userProfilePic)
    ? userDetails?.userProfilePic.length
    : 0;

  const userAllImageShare = () => {
    const allImages = userDetails?.userProfilePic?.map(image => image.url);
    navigation.navigate('UserUploadImageFullScreen', {allImages});
  };

  const receivedScreeData = matchesUserData?.userData?.status || [];
  console.log(
    ' === ____var____ ===> ',
    receivedScreeData,
    matchesUserData?.screen,
  );

  const friendStatus = userDetails?.friendsDetails?.status || [];
  console.log(' === friendStatus ===> ', friendStatus);

  // console.log(' === var ===> ', friendStatus, receivedScreeData);

  const friendIconSource =
    friendStatus === 'accepted'
      ? icons.new_request_sent_icon // Request already accepted
      : friendStatus === 'requested'
      ? icons.new_request_sent_icon // Request already sent, allow for rejection
      : icons.new_rectangle_send_icon; // No request sent, allow sending a request

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <Image
          source={images.happyMilanColorLogo}
          style={style.customHeaderLogo}
        />

        <TouchableOpacity activeOpacity={0.7} onPress={openTopBottomSheet}>
          <Image
            source={userImage ? {uri: userImage} : images.empty_male_Image}
            style={style.profileLogoStyle}
          />
        </TouchableOpacity>
      </View>

      <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

      <View style={style.userStoryContainer}>
        <NewAddStoryScreen />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <Image
            source={
              userDetails.profilePic
                ? {uri: userDetails.profilePic}
                : images.empty_male_Image
            }
            style={{width: '100%', height: hp(449), resizeMode: 'cover'}}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
            style={style.imageBottomShadow}
          />
          <View style={style.UserDetailsContainer}>
            <View style={style.imageBottomContainer}>
              <View style={style.onlineBodyStyle}>
                <Text style={style.bodyTextStyle}>Online</Text>
              </View>

              <View
                style={[style.userDetailsDescriptionContainer, {marginTop: 3}]}>
                <Text style={style.userNameTextStyle}>
                  {firstName} {lastName}
                </Text>
              </View>

              <View
                style={[style.userDetailsDescriptionContainer, {marginTop: 3}]}>
                <Text style={style.userDetailsTextStyle}>
                  {userDetails?.age} yrs,{' '}
                </Text>
                <Text style={style.userDetailsTextStyle} />
                <Text style={style.userDetailsTextStyle}>
                  {userDetails?.height}
                </Text>

                <View style={style.verticalLineStyle} />

                <Text style={style.userDetailsTextStyle}> {jobTittle}</Text>
              </View>

              <View style={style.userDetailsDescriptionContainer}>
                <Text style={style.userDetailsTextStyle}>{currentCity},</Text>
                <Text style={style.userDetailsTextStyle}>
                  {' '}
                  {currentCountry}
                </Text>
              </View>

              <View style={style.bottomImagesContainer}>
                <Image
                  source={images.gradient_button_background_img}
                  style={style.gradientImageContainer}
                />
                <TouchableOpacity
                  activeOpacity={0.5}
                  // onPress={openModal}
                  style={style.gradientImageBody}>
                  <Image source={icons.couple_icon} style={style.coupleImage} />
                  <Text style={style.percentageText}>
                    {userDetails?.matchPercentage}% Match
                  </Text>
                </TouchableOpacity>

                <View style={style.bottomSecondImagesContainer}>
                  <TouchableOpacity
                    style={style.cameraImageContainer}
                    activeOpacity={0.5}
                    onPress={userAllImageShare}>
                    <Image
                      source={icons.new_camera_icon}
                      style={style.cameraIcon}
                    />

                    <Text style={{color: colors.white}}>{imageCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleShortlist}
                    activeOpacity={0.5}
                    style={style.starIconContainer}>
                    <Image
                      source={
                        userDetails?.userShortListDetails?._id
                          ? icons.black_check_icon
                          : icons.black_start_icon
                      }
                      style={style.starIcon}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    // onPress={onThreeDotPress}
                    style={style.threeDotImageContainer}>
                    <Image
                      source={icons.new_three_dot}
                      style={style.threeDotImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={style.bodyMiddleContainer}>
          <View style={style.BodyContainer}>
            {/*<TouchableOpacity*/}
            {/*  activeOpacity={0.5}*/}
            {/*  onPress={*/}
            {/*    friendStatus === 'requested'*/}
            {/*      ? removeFriendRequest*/}
            {/*      : sendFriendRequest*/}
            {/*  }>*/}
            {/*  <Image source={friendIconSource} style={style.sendRequestIcon} />*/}
            {/*</TouchableOpacity>*/}
            {/*{friendStatus === 'accepted' ? (*/}
            {/*  <TouchableOpacity*/}
            {/*    activeOpacity={0.5}*/}
            {/*    onPress={() => {*/}
            {/*      onSendMessagePress(matchesUserData);*/}
            {/*    }}>*/}
            {/*    <Image*/}
            {/*      source={icons.new_send_message_icon}*/}
            {/*      style={style.sendRequestIcon}*/}
            {/*    />*/}
            {/*  </TouchableOpacity>*/}
            {/*) : (*/}
            {/*  <TouchableOpacity*/}
            {/*    activeOpacity={0.5}*/}
            {/*    onPress={*/}
            {/*      friendStatus === 'requested'*/}
            {/*        ? removeFriendRequest*/}
            {/*        : sendFriendRequest*/}
            {/*    }>*/}
            {/*    <Image*/}
            {/*      source={friendIconSource}*/}
            {/*      style={style.sendRequestIcon}*/}
            {/*    />*/}
            {/*  </TouchableOpacity>*/}
            {/*)}*/}

            {matchesUserData?.screen === 'SendScreen' ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={
                  friendStatus === 'requested'
                    ? removeFriendRequest
                    : sendFriendRequest
                }>
                <Image
                  source={friendIconSource}
                  style={style.sendRequestIcon}
                />
              </TouchableOpacity>
            ) : receivedScreeData === 'requested' ? (
              <View
                style={{
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  marginTop: 15,
                }}>
                {requestStatus === 'declined' ? (
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins500,
                        color: colors.black,
                        marginRight: 15,
                      }}>
                      Declined Request
                    </Text>
                    <Image
                      source={icons.matched_declined_icon}
                      tintColor={'#BE6D6B'}
                      style={{
                        width: hp(22),
                        height: hp(22),
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                ) : requestStatus === 'accepted' ? (
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins500,
                        color: colors.black,
                        marginRight: 15,
                      }}>
                      Accepted Request
                    </Text>
                    <Image
                      source={icons.matches_accp_icon}
                      tintColor={'#17C270'}
                      style={{
                        width: hp(22),
                        height: hp(22),
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                ) : (
                  <>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins500,
                        color: colors.black,
                      }}>
                      Want to accept?
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        receivedFriendRequestedAccepted(userDetails);
                      }}>
                      <Image
                        source={icons.received_accept_icon}
                        style={{
                          width: hp(63),
                          height: hp(40),
                          resizeMode: 'contain',
                          marginRight: 15,
                          marginLeft: 18,
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      // onPress={() => handleDecline(item?.friend?._id, item?._id)}
                      onPress={() => {
                        receivedFriendRequestedDecline(userDetails);
                      }}>
                      <Image
                        source={icons.received_declined_icon}
                        style={{
                          width: hp(63),
                          height: hp(40),
                          resizeMode: 'contain',
                        }}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            ) : friendStatus === 'accepted' ? (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  onSendMessagePress(matchesUserData);
                }}>
                <Image
                  source={icons.new_send_message_icon}
                  style={style.sendRequestIcon}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={
                  friendStatus === 'requested'
                    ? removeFriendRequest
                    : sendFriendRequest
                }>
                <Image
                  source={friendIconSource}
                  style={style.sendRequestIcon}
                />
              </TouchableOpacity>
            )}

            {/*//////////////*/}
            {(receivedScreeData !== 'requested' ||
              matchesUserData?.screen === 'SendScreen') && (
              <TouchableOpacity activeOpacity={0.5} onPress={handleLike}>
                <Image
                  source={
                    userDetails?.userLikeDetails?.isLike
                      ? icons.new_user_like_icon
                      : icons.new_like_icon
                  }
                  style={style.likeIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View
          style={{
            width: '100%',
            height: 4,
            backgroundColor: '#F8F8F8',
            marginTop: hp(10),
          }}
        />

        <View
          style={{
            marginTop: hp(17),
            marginHorizontal: 17,
          }}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(21),
              fontFamily: fontFamily.poppins600,
            }}>
            About
          </Text>
          <Text
            numberOfLines={showFullDescription ? undefined : 4}
            style={{
              color: colors.black,
              fontFamily: fontFamily.poppins400,
              fontSize: fontSize(12),
              lineHeight: hp(18),
              marginTop: hp(19),
            }}>
            {userDetails?.writeBoutYourSelf || 'No Description'}
          </Text>

          <TouchableOpacity
            onPress={toggleDescription}
            style={{alignItems: 'center'}}>
            <Image
              source={icons.rightSideIcon}
              style={{
                width: hp(15),
                height: hp(12),
                tintColor: colors.blue,
                marginTop: hp(20),
                transform: [{rotate: imageRotation}],
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>

        <View style={{marginTop: hp(10)}}>
          <UsersProfileDetailsScreen userData={userDetails} />
        </View>
        {/*<View style={{height: 50}} />*/}
        <View style={{paddingVertical: 30}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewUserDetailsScreen;
