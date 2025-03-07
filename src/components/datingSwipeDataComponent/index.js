import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const DatingSwipeDataComponent = () => {
  const [cards, setCards] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Track the current page for pagination
  const [loading, setLoading] = useState(false); // Track loading state
  const [resetKey, setResetKey] = useState(0); // Reset swiper key

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const navigation = useNavigation();
  const swiperRef = useRef(null);

  const fetchData = async page => {
    if (accessToken && !loading) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://stag.mntech.website/api/v1/user/user/getUserByGenderDating?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const responseData = response.data?.data[0]?.paginatedResults || [];

        if (responseData.length > 0) {
          setCards(prevCards => [...prevCards, ...responseData]); // Append new data
        }
      } catch (error) {
        console.error('Error fetching data:', error);
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
    }, []),
  );

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

  const onSwipePress = () => {
    if (swiperRef.current) {
      swiperRef.current.swipeRight();
    }
  };

  const renderCard = card => {
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
          source={{uri: card.profilePic}}
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
        <View style={{position: 'absolute', bottom: 90, left: 20}}>
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize(24),
              lineHeight: hp(36),
              fontFamily: fontFamily.poppins700,
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
              }}>
              {card?.datingData[0]?.Occupation || 'N.A'} |{' '}
              {card?.datingData[0]?.Ethnicity || 'N.A'},{' '}
              {card?.datingData[0]?.CurrentlyLiving || 'N.A'}
            </Text>
          </View>
        </View>
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
                onSwipePress();
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
                style={{width: hp(19), height: hp(17), resizeMode: 'contain'}}
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
                  // source={icons.date_send_icon}
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
                  // source={icons.date_send_icon}
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
    <SafeAreaView style={{flex: 1}}>
      {cards.length === 0 ? (
        // <Text style={{color: 'black', marginTop: 50}}>Loading...</Text>
        <View style={{justifyContent: 'center', marginTop: hp(310)}}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : (
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
        />
      )}
    </SafeAreaView>
  );
};

export default DatingSwipeDataComponent;
