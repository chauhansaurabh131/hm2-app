import React, {useState, useEffect} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {fontFamily, fontSize, hp} from '../../utils/helpers'; // Adjust this import based on your project structure
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';

const DatingSwipeDataComponent = () => {
  const [cards, setCards] = useState([]);
  const [initialCards, setInitialCards] = useState([]); // State to hold the initial cards
  const [resetKey, setResetKey] = useState(0); // State to handle resetting the swiper
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (accessToken) {
          try {
            const response = await axios.get(
              'https://stag.mntech.website/api/v1/user/user/getUserByGenderDating',
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              },
            );

            const responseData = response.data?.data?.[0]?.paginatedResults;

            if (responseData && Array.isArray(responseData)) {
              const formattedCards = responseData.map(user => ({
                id: user?._id,
                name: user?.name,
                image: user?.userProfilePic?.[0]?.url || '',
                age: user?.age,
                occupation: user?.datingData?.[0]?.Occupation || 'N/A',
                currentlyLiving:
                  user?.datingData?.[0]?.CurrentlyLiving || 'N/A',
              }));

              setCards(formattedCards);
              setInitialCards(formattedCards); // Set initial cards
            } else {
              console.error('Unexpected response structure', response.data);
            }
          } catch (error) {
            console.error('Error fetching data: ', error);
          }
        }
      };

      fetchData();
    }, [accessToken]),
  );

  const handleSend = cardName => {
    console.log(`Card name sent: ${cardName}`);
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
          source={{uri: card.image}}
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
            {card.name}, {card.age || 'N.A'}
          </Text>

          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins400,
              }}>
              {card.occupation || 'N.A'} | {card.currentlyLiving || 'N.A'}
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
              style={{
                width: hp(70),
                height: hp(40),
                backgroundColor: colors.white,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={icons.date_Dislike_icon}
                style={{width: hp(19), height: hp(17)}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: hp(70),
                height: hp(40),
                backgroundColor: colors.white,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={icons.date_Star_icon}
                style={{width: hp(19), height: hp(17)}}
              />
            </TouchableOpacity>

            <TouchableOpacity
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

            <TouchableOpacity
              style={{
                width: hp(70),
                height: hp(40),
                backgroundColor: colors.white,
                borderRadius: 30,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => handleSend(card.name)}>
              <Image
                source={icons.date_send_icon}
                style={{width: hp(19), height: hp(17)}}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const onSwiped = cardIndex => {
    if (cardIndex === cards.length - 1) {
      // Handle the case when all cards are swiped
    }
  };

  const onSwipedAll = () => {
    console.log('All cards swiped');
    setCards([...initialCards]); // Reset to the initial cards array
    setResetKey(prevKey => prevKey + 1); // Change the key to force re-render
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Show loading message if accessToken or cards are not available */}
      {!accessToken || cards.length === 0 ? (
        <Text>Loading...</Text>
      ) : (
        <Swiper
          key={resetKey} // Add a key to reset the swiper
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
