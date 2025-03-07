import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import style from './style';
import {icons, images} from '../../../assets';
import NewProfileBottomSheet from '../../../components/newProfileBottomSheet';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Swiper from 'react-native-deck-swiper';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../utils/colors';
import axios from 'axios';
import AgeRangeSlider from '../../../components/ageRangeSlider';
import RBSheet from 'react-native-raw-bottom-sheet';
const GOOGLE_MAPS_API_KEY = 'AIzaSyBaqU_1hOFIhVLm8su_caJheEChJCNBTyY';

const DatingSearchFilterScreen = ({route}) => {
  let {searchData} = route.params; // Get the search data (city or age range)
  // console.log(' === searchData ===> ', searchData);

  const filterSearchData = Array.isArray(searchData)
    ? searchData // If it's an array (age range), use it directly
    : searchData.charAt(0).toLowerCase() + searchData.slice(1); // If it's a string, normalize it

  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [resetKey, setResetKey] = useState(0);
  const [initialCards, setInitialCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAgeSelected, setIsAgeSelected] = useState(true);
  const [ageRange, setAgeRange] = useState([25, 35]);
  const [text, setText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const navigation = useNavigation();
  const bottomSheetRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      if (Array.isArray(searchData)) {
        // If searchData is an age range (array), call the relevant API for age range
        fetchUserByAgeRange(searchData);
      } else if (typeof searchData === 'string') {
        // If searchData is a string (city name), call the city search API
        fetchUserSearchData(searchData);
      }
    }, [searchData]),
  );

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

  const handleRangeSubmit = range => {
    setAgeRange(range); // Update the state with the selected age range
  };

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

  const handleClear = () => {
    setText('');
    setFilteredData([]);
  };

  const handleSelect = item => {
    setText(item);
    setFilteredData([]); // Close dropdown by clearing filtered data
  };

  const onSubmit = () => {
    bottomSheetRef.current.close();
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

  // Function to fetch users based on city (string)
  const fetchUserSearchData = async city => {
    setLoading(true);
    try {
      // Make sure the first letter of the city is lowercase
      const normalizedCity = city.charAt(0).toLowerCase() + city.slice(1);

      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/user/search-user-dating',
        {
          method: 'POST',
          headers: {
            Accept: '/',
            'Accept-Language': 'en-US,en;q=0.9,gu;q=0.8',
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            Origin: 'http://localhost:3000',
            Referer: 'http://localhost:3000/',
            'User-Agent':
              'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
          },
          body: JSON.stringify({
            Ethnicity: normalizedCity, // Send city with the first letter lowercase
          }),
        },
      );

      const data = await response.json();
      const responseData = data?.data[0]?.paginatedResults || [];
      console.log(' === responseData ===> ', responseData);

      if (responseData) {
        setCards(responseData);
        setInitialCards(responseData);
        // Other card updates
      } else {
        console.log('API Error: ', data);
      }
    } catch (error) {
      console.log('Error while calling the API: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch users based on age range (array)
  const fetchUserByAgeRange = async ageRange => {
    setLoading(true);
    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/user/getUserByGenderDatingAge',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            minAge: ageRange[0],
            maxAge: ageRange[1],
          }),
        },
      );

      const data = await response.json();
      const responseData = data?.data[0]?.paginatedResults || [];
      console.log(' === responseData ===> ', responseData);

      if (responseData) {
        setCards(responseData);
        setInitialCards(responseData);
        // Update the cards state with the data received from API
      } else {
        console.log('API Error: ', data);
      }
    } catch (error) {
      console.log('Error while calling the API: ', error);
    } finally {
      setLoading(false);
    }
  };

  const topModalBottomSheetRef = useRef(null);
  const swiperRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const onSwiped = cardIndex => {
    if (cardIndex === cards.length - 1 && !loading) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const onSwipedAll = () => {
    console.log('All cards swiped');
    setCards([...initialCards]);
    setResetKey(prevKey => prevKey + 1);
  };

  const onSwipePress = card => {
    // Simulate swipe on the card by calling swipeLeft or swipeRight
    if (swiperRef.current) {
      // For example, swipe right
      swiperRef.current.swipeRight();
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
          `https://stag.mntech.website/api/v1/user/like/update-like/${currentLikeStatusId}`,
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
        } else {
          Alert.alert('Error', 'Unable to unlike the user. Please try again.');
        }
      } else {
        // Like user
        const response = await axios.post(
          'https://stag.mntech.website/api/v1/user/like/create-like?appUsesType=dating',
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
        } else {
          Alert.alert('Error', 'Unable to like the user. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error with like/unlike operation:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleSend = async card => {
    const requestedId = card?.friendsDetails[0]?._id; // Retrieve stored request ID

    console.log('=== requestedId ===> ', requestedId);

    if (card?.friendsDetails[0]?.status !== 'requested') {
      // Sending friend request
      try {
        const response = await axios.post(
          'https://stag.mntech.website/api/v1/user/friend/create-friend?appUsesType=dating',
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
        } else {
          console.log('Unable to send friend request. Please try again.');
        }
      } catch (error) {
        console.error('Error with create-friend API:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
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
          'https://stag.mntech.website/api/v1/user/friend/respond-friend-req?appUsesType=dating',
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
        } else {
          console.log('Unable to remove friend request. Please try again.');
        }
      } catch (error) {
        console.error('Error with remove-friend-request API:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

  const renderCard = card => {
    // console.log(' === card ===> ', card?.friendsDetails?.status);

    const capitalizeFirstLetter = str =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : 'N/A';

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
          borderWidth: 2,
          borderColor: '#E8E8E8',
          backgroundColor: '#FFF',
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
          height: hp(530),
        }}>
        <Image
          source={{uri: card?.profilePic}}
          style={{width: '100%', height: '100%', borderRadius: 20}}
          resizeMode="cover"
        />
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
            marginBottom: hp(13),
          }}
        />

        <TouchableOpacity
          onPress={() => {
            // console.log(' === card ===> ', card);
            // navigation.navigate('Abc', {userData: card});
            navigation.navigate('DatingUserDetailsScreen', {userData: card});
          }}
          style={{
            position: 'absolute',
            bottom: 90,
            left: 20,
          }}>
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize(24),
              lineHeight: hp(36),
              fontFamily: fontFamily.poppins700,
            }}>
            {/*{card.name.charAt(0).toUpperCase() + card.name.slice(1)},{' '}*/}
            {capitalizeFirstLetter(card?.name)}, {age || card?.age || 'N.A'}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins400,
              }}>
              {card?.datingData[0]?.Occupation || 'N.A'} |{' '}
              {capitalizeFirstLetter(card?.datingData[0]?.Ethnicity) || 'N.A'},{' '}
              {capitalizeFirstLetter(card?.datingData[0]?.CurrentlyLiving) ||
                'N.A'}
            </Text>
          </View>
        </TouchableOpacity>

        <View
          style={{
            position: 'absolute',
            bottom: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 17,
            flex: 1,
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
              }}
              style={{
                width: hp(70),
                height: hp(40),
                backgroundColor: colors.white,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={icons.date_boost_icon}
                style={{width: hp(14), height: hp(22), resizeMode: 'contain'}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onSwipePress(card);
              }}
              style={{
                width: hp(70),
                height: hp(40),
                backgroundColor: colors.white,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={icons.date_cancel_icon}
                style={{width: hp(19), height: hp(17)}}
              />
            </TouchableOpacity>

            {card?.userLikeDetails[0]?.isLike ? (
              <TouchableOpacity
                onPress={() => OnLikePress(card)}
                style={{
                  width: hp(70),
                  height: hp(40),
                  backgroundColor: '#9E28D7',
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.dating_white_heart}
                  style={{width: hp(19), height: hp(17), tintColor: 'white'}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => OnLikePress(card)}
                style={{
                  width: hp(70),
                  height: hp(40),
                  backgroundColor: colors.white,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.date_like_icon}
                  style={{width: hp(19), height: hp(17)}}
                />
              </TouchableOpacity>
            )}

            {card?.friendsDetails[0]?.status === 'requested' ? (
              <TouchableOpacity
                style={{
                  width: hp(70),
                  height: hp(40),
                  backgroundColor: '#7045EB',
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handleSend(card)}>
                <Image
                  source={icons.date_white_send_icon}
                  style={{width: hp(19), height: hp(17)}}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{
                  width: hp(70),
                  height: hp(40),
                  backgroundColor: colors.white,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => handleSend(card)}>
                <Image
                  source={icons.date_send_icon}
                  style={{width: hp(19), height: hp(17)}}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
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
            {userImage ? (
              <Image source={{uri: userImage}} style={style.dropDownTopImage} />
            ) : (
              <Image
                source={images.empty_male_Image}
                style={style.dropDownTopImage}
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
              // navigation.navigate('Matches');
              navigation.goBack();
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

          <Text style={style.exploreText}>
            <Text style={{color: '#0F52BA'}}>{cards.length} Profiles </Text>
            in{' '}
            {
              Array.isArray(searchData) ? 'Age' : searchData // Check if it's an array (age range) or a string (city)
            }
          </Text>

          <TouchableOpacity
            activeOpacity={0.5}
            style={style.filterContainer}
            onPress={() => bottomSheetRef.current.open()}>
            <Image source={icons.filter_icon} style={style.filterIcon} />
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
                    colors={['#0D4EB3', '#9413D0']}
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

      <View style={{flex: 1}}>
        {/*<NewMeetFriendComponent />*/}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={{marginTop: 250}}
          />
        ) : !accessToken || cards.length === 0 ? (
          <Text style={{color: 'black', marginTop: 50}}>No Match data</Text>
        ) : (
          <View style={{marginTop: -40}}>
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
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default DatingSearchFilterScreen;
