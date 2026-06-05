import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';

import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {icons, images} from '../../../assets';
import NewProfileBottomSheet from '../../../components/newProfileBottomSheet';
import style from './style';
import RBSheet from 'react-native-raw-bottom-sheet';
import Swiper from 'react-native-deck-swiper';
import axios from 'axios';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../utils/colors';
import AgeRangeSlider from '../../../components/ageRangeSlider';

import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import ProfileAvatar from '../../../components/letterProfileComponent';
import Toast from 'react-native-toast-message';
import CompleteYourProfileModalComponent from '../../../components/completeYourProfileModalComponent';
import {BASE_URL} from '../../../utils/constants';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const GOOGLE_MAPS_API_KEY = 'AIzaSyBaqU_1hOFIhVLm8su_caJheEChJCNBTyY';

const customToastConfig = {
  like: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 50,
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 15, fontWeight: '600'}}>
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
        marginTop: 50,
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 15, fontWeight: '600'}}>
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
        marginTop: 50,
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 15, fontWeight: '600'}}>
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
        marginTop: 50,
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 15, fontWeight: '600'}}>
        {text1}
      </Text>
    </View>
  ),
};

const MeetNewFriendsScreen = ({route}) => {
  const {category} = route.params;

  const [bottomsheetVisible, setBottomSheVisible] = useState(false);
  const [ageProgress, setAgeProgress] = useState(0); // Initial progress value
  const [cards, setCards] = useState([]);
  const [initialCards, setInitialCards] = useState([]);
  const [resetKey, setResetKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isAgeSelected, setIsAgeSelected] = useState(true); // Default to Age section
  const [ageRange, setAgeRange] = useState([25, 35]); // Initial age range
  const [text, setText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [freeCreditModal, setFreeCreditModal] = useState(false);
  const [creditOverModal, setCreditOverModal] = useState(false);
  const [profileCompleteModal, setProfileCompleteModal] = useState(false);
  const [selectedUserForRequest, setSelectedUserForRequest] = useState(null);

  // console.log(' === cards___ ===> ', cards);

  const bottomSheetRef = useRef(null);

  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;
  const isProfileCompletedForReq = user?.user?.isUserprofileCompletedForReq;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const formatCategory = category => {
    // Convert the category to title case by replacing hyphens with spaces and capitalizing each word
    return category
      .split('-') // Split the string by hyphens
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' '); // Join the words with spaces
  };

  const formattedCategory = formatCategory(category);

  // console.log('Formatted Category:', formattedCategory);

  const swiperRef = useRef(null); // <-- Create a reference for the Swiper=

  const topModalBottomSheetRef = useRef(null);
  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  // const openBottomSheetModal = () => {
  //   setBottomSheVisible(!bottomsheetVisible);
  // };

  const handleRangeSubmit = range => {
    setAgeRange(range); // Update the state with the selected age range
  };

  const handleClear = () => {
    setText('');
    setFilteredData([]);
  };

  const handleSelect = item => {
    setText(item);
    setFilteredData([]); // Close dropdown by clearing filtered data
  };

  const onSubmit = () => {
    if (isAgeSelected) {
      console.log(' === isAgeSelected ===> ', ageRange[0], ageRange[1]);

      navigation.navigate('DatingSearchFilterScreen', {
        searchData: [ageRange[0], ageRange[1]],
      });
    } else {
      const city = text.split(',')[0].trim();
      console.log('Location Screen section', city); // Log to terminal
      if (city) {
        navigation.navigate('DatingSearchFilterScreen', {searchData: city});
        setText('');
      } else {
        console.log(' === Not Get City ===> ');
      }
    }
  };

  const minAge = 18;
  const maxAge = 50; // Max possible age
  const currentAge = Math.round(minAge + (maxAge - minAge) * ageProgress);

  const fetchCityState = async input => {
    setText(input);
    if (input.length > 0) {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&key=${GOOGLE_MAPS_API_KEY}`;

      try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
          const suggestions = data.predictions.map(item => item.description);
          setFilteredData(suggestions);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    } else {
      setFilteredData([]);
    }
  };

  const fetchData = async page => {
    if (category) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${BASE_URL}/api/v1/user/user/getUser-list-by-interest?page=${page}`,
          {
            // interestedIn: 'meet-new-friends',
            interestedIn: category,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const responseData = response.data?.data[0]?.paginatedResults || [];

        if (responseData.length > 0) {
          setCards(prevCards => [...prevCards, ...responseData]); // Append new data
        } else {
          console.error('Unexpected response structure', response.data);
        }
      } catch (error) {
        console.error('Error fetching data: ', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setCards([]); // Reset cards on screen focus
      setCurrentPage(1); // Reset page number
      fetchData(1); // Fetch first page
    }, [category]),
  );

  const handleSend = async card => {
    const requestedId = card?.friendsDetails[0]?._id; // Retrieve stored request ID

    console.log('=== requestedId ===> ', requestedId);

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
        }
      } catch (error) {
        console.error('Error with create-friend API:', error);
        // Alert.alert('Error', 'Something went wrong. Please try again.');
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
          {
            likedUserId: likedUserId,
            isLike: false,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('API Response for unlike:', response?.data);

        if (response?.data?.status === 'Success') {
          const updatedCards = cards.map(item =>
            item._id === likedUserId
              ? {
                  ...item,
                  userLikeDetails: [
                    {
                      ...item.userLikeDetails[0], // Spread existing details
                      isLike: false, // Update isLike to false
                    },
                  ],
                }
              : item,
          );

          setCards(updatedCards); // Update the state

          // 🔹 Show toast after unlike
          Toast.show({
            type: 'disLike',
            text1: 'Profile Disliked',
            position: 'top',
            visibilityTime: 1500,
          });
        } else {
          Alert.alert('Error', 'Unable to unlike the user. Please try again.');
        }
      } else {
        // Like user
        const response = await axios.post(
          `${BASE_URL}/api/v1/user/like/create-like?appUsesType=dating`,
          {
            likedUserId: likedUserId,
            isLike: true,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('API Response for like:', response?.data);

        if (response?.data?.status === 'Success') {
          const updatedCards = cards.map(item =>
            item._id === likedUserId
              ? {
                  ...item,
                  userLikeDetails: [
                    {
                      _id: response?.data?.data?.id, // Use new ID from response
                      isLike: true, // Update isLike to true
                    },
                  ],
                }
              : item,
          );

          setCards(updatedCards); // Update the state

          // 🔹 Show toast after like
          Toast.show({
            type: 'like',
            text1: 'Profile Liked',
            position: 'top',
            visibilityTime: 1500,
          });
        } else {
          Alert.alert('Error', 'Unable to like the user. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error with like/unlike operation:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const onSwipePress = card => {
    // Simulate swipe on the card by calling swipeLeft or swipeRight
    if (swiperRef.current) {
      // For example, swipe right
      swiperRef.current.swipeRight();
    }
  };

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

  const renderCard = card => {
    // console.log(' === card ===> ', card?.datingData[0]?.Ethnicity);

    const profilePrivacy =
      card.privacySettingCustom?.profilePhotoPrivacy === true ||
      card.privacySettingCustom?.showPhotoToFriendsOnly === true;

    const hasValidImage =
      card.profilePic &&
      card.profilePic !== 'null' &&
      card.profilePic.trim() !== '';

    const capitalizeFirstLetter = str =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : 'N/A';

    const formatText = text => {
      if (!text) {
        return 'N.A';
      }
      return text
        .split('_') // split by underscore
        .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize
        .join(' '); // join with space
    };

    const calculateAge = dateOfBirth => {
      const dob = new Date(dateOfBirth); // Parse the date of birth string into a Date object
      const diffMs = Date.now() - dob.getTime(); // Get the difference in milliseconds
      const ageDate = new Date(diffMs); // Convert the difference into a date object
      return Math.abs(ageDate.getUTCFullYear() - 1970); // Subtract 1970 to get the age in years
    };

    const age = calculateAge(card?.dateOfBirth);

    return (
      <View
        style={{
          justifyContent: 'center',
          borderRadius: 20,
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
              source={{uri: card?.profilePic}}
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
            height: '40%',
            // marginBottom: hp(5),
          }}
        />

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('DatingUserProfileScreen', {userData: card});
          }}
          style={{position: 'absolute', bottom: 75, left: 15, right: 15}}>
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
            }}>
            {card.name.charAt(0).toUpperCase() + card.name.slice(1)},{' '}
            {age || 'N.A'}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins400,
              }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  fontFamily: fontFamily.poppins400,
                }}>
                {formatText(card?.datingData?.[0]?.Occupation) || 'N.A'} |{' '}
                {formatText(card?.datingData?.[0]?.Ethnicity) || 'N.A'},{' '}
                {formatText(card?.datingData?.[0]?.CurrentlyLiving) || 'N.A'}
              </Text>
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
                onSwipePress(card);
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

  const hasValidImage =
    user?.user?.profilePic &&
    user?.user?.profilePic !== 'null' &&
    user?.user?.profilePic.trim() !== '';

  return (
    <SafeAreaView style={style.container}>
      <View style={{zIndex: 99, top: -70}}>
        <Toast config={customToastConfig} />
      </View>

      <View style={style.headerContainer}>
        <View style={style.headerBody}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.appLogoStyle}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openBottomSheet}
            style={{alignSelf: 'center'}}>
            {hasValidImage ? (
              <Image
                source={userImage ? {uri: userImage} : images.empty_male_Image}
                style={style.dropDownTopImage}
              />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName || user?.user?.name}
                lastName={user?.user?.lastName}
                textStyle={style.dropDownTopImage}
                profileTexts={{fontSize: fontSize(10)}}
              />
            )}
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />
      </View>

      <View style={style.bodyContainer}>
        <View style={style.bodyContainerStyle}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Matches');
            }}
            style={{
              height: hp(25),
              width: hp(25),
              justifyContent: 'center',
            }}>
            <Image
              source={icons.down_arrow_icon}
              style={{
                width: hp(15),
                height: hp(10),
                transform: [{rotate: '90deg'}], // Rotate 90 degrees to make it point left
                tintColor: '#5F6368',
              }}
            />
          </TouchableOpacity>
          <Text style={style.exploreText}>{formattedCategory}</Text>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => bottomSheetRef.current.open()}>
            <Image
              source={icons.dating_new_Filter_Icon}
              style={style.filterIcon}
            />
          </TouchableOpacity>
        </View>

        <RBSheet
          ref={bottomSheetRef}
          height={hp(380)}
          customStyles={{
            container: {
              backgroundColor: 'white',
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}>
          <View style={{flex: 1, backgroundColor: colors.white}}>
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: hp(20),
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  width: hp(174),
                  height: hp(30),
                  backgroundColor: '#F2F2F2',
                  borderRadius: 50,
                  marginTop: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onPress={() => setIsAgeSelected(true)}
                  style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: isAgeSelected ? 'black' : 'transparent',
                    borderRadius: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: isAgeSelected ? 'white' : 'black',
                      fontSize: fontSize(14),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Age
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsAgeSelected(false)}
                  style={{
                    width: '50%',
                    height: '100%',
                    backgroundColor: !isAgeSelected ? 'black' : 'transparent',
                    borderRadius: 25,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: !isAgeSelected ? 'white' : 'black',
                      fontSize: fontSize(14),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Location
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Display the selected section dynamically */}
            {isAgeSelected ? (
              // <Text style={{textAlign: 'center', marginTop: 20}}>
              //   Age Screen section
              // </Text>

              <View
                style={
                  {
                    // marginTop: 50,
                    // marginHorizontal: 17,
                  }
                }>
                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#F0F0F0',
                    marginBottom: hp(50),
                  }}
                />
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Text
                    style={{
                      fontSize: fontSize(34),
                      lineHeight: hp(47),
                      fontFamily: fontFamily.poppins700,
                      color: colors.black,
                    }}>
                    {ageRange[0]} -{' '}
                  </Text>
                  <Text
                    style={{
                      fontSize: fontSize(34),
                      lineHeight: hp(47),
                      fontFamily: fontFamily.poppins700,
                      color: colors.black,
                    }}>
                    {ageRange[1]}
                  </Text>
                </View>

                <AgeRangeSlider
                  initialRange={ageRange}
                  onSubmitRange={handleRangeSubmit}
                  // tittleLabelText={'Select Age Range'}
                  min={18}
                  max={50}
                  containerStyle={{width: '100%'}}
                  hideRangeLabel={true}
                  labelContainerStyle={{
                    marginHorizontal: 3,
                    marginBottom: 5,
                  }}
                  rangeLabel={{
                    fontsize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins600,
                  }}
                  tittleLabel={{
                    fontsize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                    color: '#9A9A9A',
                  }}
                  trackStyle={{height: 3}}
                />
              </View>
            ) : (
              // <Text style={{textAlign: 'center', marginTop: 20}}>
              //   Location Screen section
              // </Text>
              <View style={{marginHorizontal: 17}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderColor: '#ccc',
                    paddingHorizontal: 10,
                    height: hp(52),
                    backgroundColor: '#F8F8F8',
                    paddingLeft: 15,
                    borderRadius: 15,
                  }}>
                  <TextInput
                    style={{
                      flex: 1,
                      height: 40,
                      fontSize: 16,
                      color: colors.black,
                    }}
                    placeholder="Enter City Name"
                    placeholderTextColor={'black'}
                    value={text}
                    onChangeText={fetchCityState}
                  />
                  {text.length > 0 && (
                    <TouchableOpacity
                      onPress={handleClear}
                      style={{
                        width: hp(25),
                        height: hp(25),
                        backgroundColor: '#B1B1B1',
                        borderRadius: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                        right: 10,
                      }}>
                      <Image
                        source={icons.date_cancel_icon}
                        style={{
                          width: hp(10),
                          height: hp(10),
                          tintColor: 'white',
                        }}
                      />
                    </TouchableOpacity>
                  )}
                </View>

                {text.length === 0 && (
                  <Text
                    style={{
                      marginTop: hp(100),
                      color: '#D6D6D6',
                      textAlign: 'center',
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                      alignItems: 'center',
                    }}>
                    No City Found
                  </Text>
                )}

                {filteredData.length > 0 && (
                  <View
                    style={{
                      marginTop: 15,
                      backgroundColor: '#fff',
                      borderColor: '#ccc',
                      maxHeight: 150,
                      width: '99%',
                      justifyContent: 'center',
                    }}>
                    <FlatList
                      data={filteredData}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({item}) => (
                        <TouchableOpacity onPress={() => handleSelect(item)}>
                          <Text
                            style={{
                              padding: 10,
                              borderBottomWidth: 1,
                              borderBottomColor: '#ccc',
                              color: 'black',
                            }}>
                            {item}
                          </Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                )}
              </View>
            )}

            {!isKeyboardVisible && (
              <View
                style={{
                  marginTop: 50,
                  position: 'absolute',
                  flex: 1,
                  bottom: 15,
                  width: '90%',
                  alignSelf: 'center',
                }}>
                <TouchableOpacity
                  onPress={onSubmit}
                  activeOpacity={0.7}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    // height: 50,
                  }}>
                  <LinearGradient
                    colors={['#7045EB', '#4819CB']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0.5}}
                    style={{
                      marginTop: hp(50),
                      width: '100%',
                      height: hp(50),
                      borderRadius: 25,
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: colors.white,
                        textAlign: 'center',
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins600,
                      }}>
                      Show Me
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </RBSheet>
      </View>

      {/*<Text>svnsvdnskndvl</Text>*/}

      <View style={{flex: 1}}>
        {/*<NewMeetFriendComponent />*/}
        {loading ? (
          // <ActivityIndicator
          //   size="large"
          //   color="#0000ff"
          //   style={{marginTop: 250}}
          // />
          <View style={{justifyContent: 'center', marginTop: hp(25)}}>
            {/*<ActivityIndicator size="large" color={colors.blue} />*/}
            <View style={{height: hp(449), marginHorizontal: hp(17)}}>
              <ShimmerPlaceholder
                style={{
                  width: '100%',
                  height: hp(530),
                  borderRadius: 20,
                  marginBottom: hp(13),
                }}
              />
              <View style={{marginTop: -180, marginHorizontal: 17}}>
                <ShimmerPlaceholder style={{width: 150, height: 25}} />

                <View style={{marginTop: 10}}>
                  <ShimmerPlaceholder style={{width: 150, height: 10}} />
                </View>

                <View style={{marginTop: 50, flexDirection: 'row'}}>
                  <ShimmerPlaceholder
                    style={{
                      width: wp(69),
                      height: hp(40),
                      justifyContent: 'center',
                      marginRight: 15,
                      borderRadius: 20,
                    }}
                  />
                  <ShimmerPlaceholder
                    style={{
                      width: wp(69),
                      height: hp(40),
                      justifyContent: 'center',
                      marginRight: 15,
                      borderRadius: 20,
                    }}
                  />

                  <ShimmerPlaceholder
                    style={{
                      width: wp(69),
                      height: hp(40),
                      justifyContent: 'center',
                      marginRight: 15,
                      borderRadius: 20,
                    }}
                  />

                  <ShimmerPlaceholder
                    style={{
                      width: wp(69),
                      height: hp(40),
                      justifyContent: 'center',
                      marginRight: 10,
                      borderRadius: 20,
                    }}
                  />
                </View>
              </View>
            </View>
          </View>
        ) : !accessToken || cards.length === 0 ? (
          // <Text style={{color: 'black', marginTop: 50}}>No Match data</Text>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={icons.no_Profile_Found_img}
              style={{width: hp(50), height: hp(50), resizeMode: 'contain'}}
            />
            <Text
              style={{
                color: colors.gray,
                fontSize: fontSize(18),
                marginTop: hp(10),
              }}>
              No Profiles Found
            </Text>
          </View>
        ) : (
          // <View style={{marginTop: -40}}>
          <View style={{flex: 1, marginTop: hp(20)}}>
            <Swiper
              ref={swiperRef} // Add ref to the Swiper
              key={resetKey}
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
      </View>

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
    </SafeAreaView>
  );
};

export default MeetNewFriendsScreen;
