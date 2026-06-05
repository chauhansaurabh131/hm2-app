import React, {useState, useEffect, useCallback, useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import ProfileAvatar from '../letterProfileComponent';
import Toast from 'react-native-toast-message';
import {style} from '../../screen/matchesAllScreen/matchesInAcceptedScreen/style';
import CompleteYourProfileModalComponent from '../completeYourProfileModalComponent';
import {BASE_URL} from '../../utils/constants';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const customToastConfig = {
  like: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: hp(50),
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: fontSize(15),
          fontFamily: fontFamily.poppins400,
        }}>
        {text1}
      </Text>
    </View>
  ),
  disLike: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: hp(50),
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: fontSize(15),
          fontFamily: fontFamily.poppins400,
        }}>
        {text1}
      </Text>
    </View>
  ),
  sentReq: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: hp(50),
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: fontSize(15),
          fontFamily: fontFamily.poppins400,
        }}>
        {text1}
      </Text>
    </View>
  ),
  cancelReq: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: hp(50),
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: fontSize(15),
          fontFamily: fontFamily.poppins400,
        }}>
        {text1}
      </Text>
    </View>
  ),
};

const DatingSwipeDataComponent = () => {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page for pagination
  const [loading, setLoading] = useState(false); // Track loading state
  const [resetKey, setResetKey] = useState(0); // Reset swiper key
  const [freeCreditModal, setFreeCreditModal] = useState(false);
  const [creditOverModal, setCreditOverModal] = useState(false);
  const [profileCompleteModal, setProfileCompleteModal] = useState(false);
  const [selectedUserForRequest, setSelectedUserForRequest] = useState(null);

  const {user} = useSelector(state => state.auth);
  // console.log(' === Dating ===> ', user?.user?.isUserprofileCompletedForReq);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;
  const isProfileCompletedForReq = user?.user?.isUserprofileCompletedForReq;

  const navigation = useNavigation();
  const swiperRef = useRef(null);

  const fetchData = async page => {
    if (accessToken && !loading) {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/api/v1/user/user/getUserByGenderDating?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const responseData = response.data?.data[0]?.paginatedResults || [];

        // console.log(' === var ===> ', responseData);

        if (responseData.length > 0) {
          setCards(prevCards => [...prevCards, ...responseData]); // Append new data
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Alert.alert('Error', 'Something went wrong. Please try again...');
      }
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setCards([]); // Reset cards on screen focus
      setCurrentPage(1); // Reset page number
      fetchData(1); // Fetch first page
    }, []),
  );

  const onCompleteProfilePress = () => {
    setProfileCompleteModal(false);
    navigation.navigate('DatingCreatingProfile');
  };

  const onSendRequestPress = () => {
    if (selectedUserForRequest) {
      handleSend(selectedUserForRequest);
    }

    setProfileCompleteModal(false);
    setSelectedUserForRequest(null);
  };

  const handleSendPress = card => {
    const isAlreadyRequested =
      card?.friendsDetails?.[0]?.status === 'requested';

    // ✅ If removing request → call API directly
    if (isAlreadyRequested) {
      handleSend(card);
      return;
    }

    // ✅ If sending new request → check profile
    if (!isProfileCompletedForReq) {
      setSelectedUserForRequest(card);
      setProfileCompleteModal(true);
    } else {
      handleSend(card);
    }
  };

  const handleSend = async card => {
    const requestedId = card?.friendsDetails[0]?._id; // Retrieve stored request ID

    // console.log('=== requestedId ===> ', requestedId);

    if (card?.friendsDetails[0]?.status !== 'requested') {
      // Sending friend request
      try {
        const response = await axios.post(
          `${BASE_URL}/api/v1/user/friend/create-friend?appUsesType=dating`,
          {
            friend: card._id, // Friend's ID
            user: userId, // Logged-in user's ID
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('API Response for create-friend:', response?.data);

        if (response?.data?.status === 'Success') {
          const requestId = response?.data?.data?.id; // Extract the request ID

          if (!requestId) {
            console.error('Friend request ID is missing from API response.');
            return;
          }

          // Update the card with the request ID and status
          const updatedCards = cards.map(item =>
            item._id === card._id
              ? {
                  ...item,
                  friendsDetails: [
                    {
                      ...item.friendsDetails[0],
                      _id: requestId, // Store request ID
                      status: 'requested',
                    },
                  ],
                }
              : item,
          );
          setCards(updatedCards);

          Toast.show({
            type: 'sentReq',
            text1: 'Request Sent',
            position: 'top',
            visibilityTime: 1500,
          });
        } else {
          console.log('Unable to send friend request. Please try again.');

          console.log(' === test ===> ');
        }
      } catch (error) {
        console.error(
          'Error with create-friend API:',
          error?.response?.data?.message,
        );

        // const errorMessage =
        //   error?.response?.data?.message ||
        //   'Something went wrong. Please try again.';
        // Alert.alert('Error', errorMessage);

        // console.log(
        //   ' === error?.response?.data?.message ===> ',
        //   error?.response?.data?.message,
        // );

        // Alert.alert('Error', 'Something went wrong. Please try again....');

        const errorMessage =
          error?.response?.data?.message ||
          'Something went wrong. Please try again.';

        console.error('API Error:', errorMessage);

        if (errorMessage.includes('Credit record not found')) {
          setFreeCreditModal(true);
        } else {
          setCreditOverModal(true);
          // Alert.alert('Error', errorMessage);
        }
      }
    } else {
      console.log('Friend request already sent, now removing the request');

      if (!requestedId) {
        console.error('Requested ID is missing. Cannot remove friend request.');
        return;
      }

      // Removing friend request
      try {
        const response = await axios.post(
          `${BASE_URL}/api/v1/user/friend/respond-friend-req?appUsesType=dating`,
          {
            user: card._id, // Friend's ID
            request: requestedId, // Use stored request ID
            status: 'removed', // Mark request as removed
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('API Response for remove-friend-request:', response?.data);

        if (response?.data?.success === true) {
          // Update the card to reflect the removal
          const updatedCards = cards.map(item =>
            item._id === card._id
              ? {
                  ...item,
                  friendsDetails: [
                    {
                      ...item.friendsDetails[0],
                      _id: null, // Remove request ID
                      status: 'removed',
                    },
                  ],
                }
              : item,
          );
          setCards(updatedCards);

          Toast.show({
            type: 'cancelReq',
            text1: 'Cancel Request ',
            position: 'top',
            visibilityTime: 1500,
          });
        } else {
          console.log('Unable to remove friend request. Please try again.');
        }
      } catch (error) {
        console.error('Error with remove-friend-request API:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

  const OnLikePress = async card => {
    const {userLikeDetails} = card;
    const likedUserId = card._id;
    const currentLikeStatus = userLikeDetails[0]?.isLike;
    const currentLikeStatusId = userLikeDetails[0]?._id;

    try {
      if (currentLikeStatus) {
        // Unlike user
        const response = await axios.put(
          `${BASE_URL}/api/v1/user/like/update-like/${currentLikeStatusId}`,
          {likedUserId, isLike: false},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response?.data?.status === 'Success') {
          const updatedCards = cards.map(item =>
            item._id === likedUserId
              ? {
                  ...item,
                  userLikeDetails: [
                    {...item.userLikeDetails[0], isLike: false},
                  ],
                }
              : item,
          );
          setCards(updatedCards);

          // 🔹 Show toast after unlike
          Toast.show({
            type: 'disLike',
            text1: 'Profile Disliked',
            position: 'top',
            visibilityTime: 1500,
          });
        }
      } else {
        // Like user
        const response = await axios.post(
          `${BASE_URL}/api/v1/user/like/create-like?appUsesType=dating`,
          {likedUserId, isLike: true},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response?.data?.status === 'Success') {
          const updatedCards = cards.map(item =>
            item._id === likedUserId
              ? {
                  ...item,
                  userLikeDetails: [
                    {_id: response?.data?.data?.id, isLike: true},
                  ],
                }
              : item,
          );
          setCards(updatedCards);

          // ShowToast();

          // 🔹 Show toast after like
          Toast.show({
            type: 'like',
            text1: 'Profile Liked',
            position: 'top',
            visibilityTime: 1500,
          });
        }
      }
    } catch (error) {
      console.error('Error with like/unlike operation:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const onSwipePress = () => {
    if (swiperRef.current) {
      swiperRef.current.swipeRight();
    }
  };

  const renderCard = card => {
    // console.log(' === card ===> ', card?.datingData?.[0]?.Occupation);

    const formatText = text => {
      if (!text) {
        return 'N.A';
      }
      return text
        .split('_') // split by underscore
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize
        .join(' '); // join with space
    };

    const profilePrivacy =
      card.privacySettingCustom?.profilePhotoPrivacy === true ||
      card.privacySettingCustom?.showPhotoToFriendsOnly === true;

    const hasValidImage =
      card.profilePic &&
      card.profilePic !== 'null' &&
      card.profilePic.trim() !== '';

    return (
      <View
        style={{
          justifyContent: 'center',
          borderRadius: 20,
          // borderWidth: 2,
          // borderColor: '#E8E8E8',
          backgroundColor: '#FFF',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
          height: hp(500),
          marginHorizontal: wp(18),
          marginBottom: hp(10),
        }}>
        {hasValidImage ? (
          <>
            <Image
              source={{uri: card.profilePic}}
              style={{width: '100%', height: '100%', borderRadius: 20}}
              resizeMode="cover"
            />
            {profilePrivacy && (
              <Image
                source={icons.logLogo} // make sure you have a `lock` icon inside `icons`
                style={{
                  position: 'absolute',
                  tintColor: '#fff',
                  resizeMode: 'contain',
                  width: hp(50),
                  height: hp(50),
                  alignSelf: 'center',
                  top: 250,
                }}
              />
            )}
          </>
        ) : (
          <ProfileAvatar
            firstName={card.firstName || card.name}
            lastName={card.lastName}
            textStyle={{width: '100%', height: hp(500), borderRadius: 20}}
            profileTexts={{fontSize: fontSize(60)}}
          />
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
          style={{
            position: 'absolute',
            bottom: -20,
            left: 0,
            right: 0,
            borderRadius: 10,
            width: '100%',
            height: '50%',
            marginBottom: hp(5),
          }}
        />
        <TouchableOpacity
          style={{position: 'absolute', bottom: 80, left: 15, right: 15}}
          onPress={() => {
            // console.log(' === card___ ===> ', card);
            // navigation.navigate('DatingUserDetailsScreen', {userData: card});
            navigation.navigate('DatingUserProfileScreen', {userData: card});

            console.log(' === userData Card ===> ', card);
          }}>
          {card?.isUserActive && (
            <View
              style={{
                width: wp(45),
                height: hp(16),
                borderRadius: 5,
                backgroundColor: '#24FF00',
                justifyContent: 'center',
                marginBottom: hp(5),
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(10),
                  lineHeight: hp(16),
                  textAlign: 'center',
                  fontFamily: fontFamily.poppins600,
                }}>
                Online
              </Text>
            </View>
          )}

          <Text
            style={{
              color: colors.white,
              fontSize: fontSize(24),
              lineHeight: hp(36),
              fontFamily: fontFamily.poppins700,
              // top: -10,
            }}>
            {card.name.charAt(0).toUpperCase() + card.name.slice(1)},{' '}
            {card.age || 'N.A'}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins400,
                // top: -10,
              }}>
              {formatText(card?.datingData?.[0]?.Occupation)} |{' '}
              {formatText(card?.datingData?.[0]?.Ethnicity)} ,{' '}
              {formatText(card?.datingData?.[0]?.CurrentlyLiving)}
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: wp(18),
          }}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Upgrader');
              }}>
              <Image
                source={icons.dating_New_Upgrade_Icon}
                style={{width: hp(54), height: hp(53), resizeMode: 'contain'}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onSwipePress();
              }}>
              <Image
                source={icons.dating_Cancel_New_Icon}
                style={{width: hp(54), height: hp(53), resizeMode: 'contain'}}
              />
            </TouchableOpacity>

            {card?.userLikeDetails[0]?.isLike ? (
              <TouchableOpacity onPress={() => OnLikePress(card)}>
                <Image
                  source={icons.dating_New_Like_Icon}
                  style={{width: hp(54), height: hp(53), resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => OnLikePress(card)}>
                <Image
                  source={icons.dating_New_Dis_Like_Icon}
                  style={{width: hp(54), height: hp(53), resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            )}

            {card?.friendsDetails[0]?.status === 'requested' ? (
              <TouchableOpacity
                onPress={() => {
                  const isAlreadyRequested =
                    card?.friendsDetails?.[0]?.status === 'requested';

                  // ✅ If removing request → call API directly (NO modal)
                  if (isAlreadyRequested) {
                    handleSend(card);
                    return;
                  }

                  // ✅ If sending new request → check profile
                  if (!isProfileCompletedForReq) {
                    setSelectedUserForRequest(card);
                    setProfileCompleteModal(true);
                  } else {
                    handleSend(card);
                  }
                }}>
                <Image
                  source={icons.dating_Sended_Icon}
                  style={{width: hp(54), height: hp(53), resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => handleSendPress(card)}>
                <Image
                  source={icons.dating_Send_Icon}
                  style={{width: hp(54), height: hp(53), resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  const onSwiped = cardIndex => {
    if (cardIndex === cards.length - 1 && !loading) {
      setCurrentPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchData(nextPage);
        return nextPage;
      });
    }
  };

  const onSwipedAll = () => {
    console.log('All cards swiped');
    setCards([]); // Reset cards
    setCurrentPage(1); // Reset page
    setResetKey(prevKey => prevKey + 1); // Force re-render
    fetchData(1);
  };

  return (
    <View style={{flex: 1}}>
      <View style={{zIndex: 99, top: -160}}>
        <Toast config={customToastConfig} />
      </View>

      {loading ? (
        <View style={{justifyContent: 'center', marginTop: hp(20)}}>
          <View style={{height: hp(449), marginHorizontal: 17}}>
            <ShimmerPlaceholder
              style={{
                width: '100%',
                height: hp(500),
                borderRadius: 20,
                marginBottom: hp(13),
              }}
            />
            <View style={{marginTop: -200, marginHorizontal: 17}}>
              <ShimmerPlaceholder style={{width: 150, height: 25}} />

              <View style={{marginTop: 10}}>
                <ShimmerPlaceholder style={{width: 150, height: 10}} />
              </View>

              <View style={{marginTop: 50, flexDirection: 'row'}}>
                <ShimmerPlaceholder
                  style={{
                    width: wp(54),
                    height: hp(53),
                    justifyContent: 'center',
                    marginRight: wp(30),
                    borderRadius: hp(50),
                  }}
                />
                <ShimmerPlaceholder
                  style={{
                    width: wp(54),
                    height: hp(53),
                    justifyContent: 'center',
                    marginRight: wp(30),
                    borderRadius: hp(50),
                  }}
                />

                <ShimmerPlaceholder
                  style={{
                    width: wp(54),
                    height: hp(53),
                    justifyContent: 'center',
                    marginRight: wp(30),
                    borderRadius: hp(50),
                  }}
                />

                <ShimmerPlaceholder
                  style={{
                    width: wp(54),
                    height: hp(53),
                    justifyContent: 'center',
                    marginRight: wp(30),
                    borderRadius: hp(50),
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      ) : cards.length === 0 ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={icons.no_Profile_Found_img}
            style={{width: 100, height: 100}}
          />
          <Text
            style={{
              color: 'black',
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins600,
              marginTop: hp(20),
            }}>
            No Profile Found
          </Text>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <Swiper
            ref={swiperRef}
            cards={cards}
            renderCard={renderCard}
            onSwipedAll={onSwipedAll}
            onSwiped={onSwiped}
            stackSize={2}
            backgroundColor="white"
            cardIndex={0}
            animateOverlayLabelsOpacity
            verticalSwipe={false}
            horizontalSwipe={true}
            cardVerticalMargin={0}
            cardHorizontalMargin={0}
          />
        </View>
      )}

      {/*FREE CREDIT OVER MODAL*/}
      <Modal
        animationType="none"
        transparent={true}
        visible={freeCreditModal}
        onRequestClose={() => setFreeCreditModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '90%',
              backgroundColor: 'white',
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: fontSize(16),
                fontFamily: fontFamily.poppins400,
                color: colors.pureBlack,
                marginTop: hp(42),
              }}>
              Free plan ended — upgrade to
            </Text>
            <Text
              style={{
                fontSize: fontSize(16),
                fontFamily: fontFamily.poppins400,
                color: colors.pureBlack,
              }}>
              send more requests.
            </Text>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => {
                setFreeCreditModal(false);
                navigation.navigate('Upgrader');
              }}
              activeOpacity={0.7}
              style={{marginTop: hp(23), marginBottom: hp(43)}}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1.5}}
                style={{
                  width: wp(123),
                  height: hp(44),
                  borderRadius: 50,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: colors.white,
                    marginLeft: hp(20),
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins400,
                    marginRight: wp(7),
                    top: 2,
                  }}>
                  Upgrade
                </Text>
                <Image
                  source={icons.crownIcon}
                  style={{
                    width: hp(16.52),
                    height: hp(14),
                    tintColor: colors.white,
                    marginRight: hp(22.12),
                  }}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PURCHASE CREDIT OVER MODAL */}
      <Modal
        animationType="none"
        transparent={true}
        visible={creditOverModal}
        onRequestClose={() => setCreditOverModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: '90%',
              backgroundColor: 'white',
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontSize: fontSize(16),
                fontFamily: fontFamily.poppins400,
                color: colors.pureBlack,
                marginTop: hp(42),
              }}>
              No credits left. Purchase more to
            </Text>
            <Text
              style={{
                fontSize: fontSize(16),
                fontFamily: fontFamily.poppins400,
                color: colors.pureBlack,
              }}>
              send requests.
            </Text>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => {
                setCreditOverModal(false);
                navigation.navigate('Upgrader');
              }}
              activeOpacity={0.7}
              style={{marginTop: hp(23), marginBottom: hp(43)}}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1.5}}
                style={{
                  width: wp(123),
                  height: hp(44),
                  borderRadius: 50,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text
                  style={{
                    color: colors.white,
                    marginLeft: hp(20),
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins400,
                    marginRight: wp(7),
                    top: 2,
                  }}>
                  Upgrade
                </Text>
                <Image
                  source={icons.crownIcon}
                  style={{
                    width: hp(16.52),
                    height: hp(14),
                    tintColor: colors.white,
                    marginRight: hp(22.12),
                  }}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <CompleteYourProfileModalComponent
        visible={profileCompleteModal}
        onClose={() => setProfileCompleteModal(false)}
        onPrimaryPress={onCompleteProfilePress}
        onSecondaryPress={onSendRequestPress}
      />
    </View>
  );
};

export default DatingSwipeDataComponent;
