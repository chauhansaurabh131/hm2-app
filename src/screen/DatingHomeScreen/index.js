import React, {useCallback, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {useFocusEffect} from '@react-navigation/native';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import style from '../exploreScreen/style';
import CustomProgressBar from '../../components/customProgressBar';
import GradientButton from '../../components/GradientButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import Swiper from 'react-native-deck-swiper';
import LinearGradient from 'react-native-linear-gradient';

const DatingHomeScreen = () => {
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [bottomsheetVisible, setBottomSheVisible] = useState(false);
  const [progress, setProgress] = useState(0.6); // Initial progress value
  const [ageprogress, setAgeProgress] = useState(0.1); // Initial progress value
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeCardId, setActiveCardId] = useState(1); // Track the active card ID
  const RBSheetRef = useRef();

  const [cards, setCards] = useState([
    {
      id: 1,
      text: 'Card 1',
      images: [
        require('../../assets/images/couple_One.png'),
        require('../../assets/images/couple_Two.png'),
        require('../../assets/images/couple_Three.png'),
      ],
    },
    {
      id: 2,
      text: 'Card 2',
      image: require('../../assets/images/couple_Two.png'),
    },
    {
      id: 3,
      text: 'Card 3',
      image: require('../../assets/images/couple_Three.png'),
    },
    {
      id: 4,
      text: 'Card 4',
      image: require('../../assets/images/couple_img_three.png'),
    },
    {
      id: 5,
      text: 'Card 5',
      image: require('../../assets/images/couple_logo.png'),
    },
  ]);

  const handleSend = cardText => {
    console.log(`Card sent______: ${cardText}`); // Log the card text to the terminal
  };

  const renderCard = card => {
    const isCardOne = card.id === 1;

    return (
      <View
        style={{
          // flex: 1,

          justifyContent: 'center',
          // alignItems: 'center',
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
          source={isCardOne ? card.images[currentImageIndex] : card.image}
          style={{width: '100%', height: '100%', borderRadius: 20}}
          resizeMode="cover"
        />
        {/*<Text style={{fontSize: 24, color: 'black', marginBottom: 20}}>*/}
        {/*  {card.text}*/}
        {/*</Text>*/}

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

        <View
          style={{
            position: 'absolute',
            bottom: 0,
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
              onPress={() => handleSend(card.text)}>
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
    setActiveCardId(cards[cardIndex + 1]?.id || null); // Set the active card ID when swiping
  };

  const onSwipedAll = () => {
    console.log('All cards swiped');
  };

  const openTopSheetModal = () => {
    // Call toggleModal to show the top modal
    toggleModal();
  };

  const toggleModal = () => {
    // console.log(' === toggleModal ===> ', topModalVisible);
    setTopModalVisible(!topModalVisible);
  };

  const openBottomSheetModal = () => {
    setBottomSheVisible(!bottomsheetVisible);
  };
  const closeBottomSheet = () => {
    RBSheetRef.current.close();
  };

  useFocusEffect(
    useCallback(() => {
      setTopModalVisible(false);
    }, []),
  );
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: 17}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: hp(12),
          }}>
          <Image
            source={images.happyMilanColorLogo}
            style={{
              width: wp(96),
              height: hp(24),
              resizeMode: 'contain',
              marginTop: hp(2),
            }}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openTopSheetModal}
            style={{alignSelf: 'center'}}>
            {/*<Image*/}
            {/*  source={images.profileDisplayImage}*/}
            {/*  style={style.headerTopSheetImageStyle}*/}
            {/*/>*/}

            {/*{userImage ? (*/}
            {/*  <Image*/}
            {/*    source={{uri: userImage}}*/}
            {/*    style={style.headerTopSheetImageStyle}*/}
            {/*  />*/}
            {/*) : (*/}
            <Image
              source={images.empty_male_Image}
              style={{
                width: hp(24),
                height: hp(24),
                borderRadius: 50,
                marginRight: hp(10.5),
                resizeMode: 'stretch',
                right: -7,
                marginTop: hp(2),
              }}
            />
            {/*)}*/}
          </TouchableOpacity>
        </View>

        {/*TOP SHEET*/}
        <HomeTopSheetComponent
          isVisible={topModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        />
      </View>

      <View
        style={{
          marginTop: hp(22),
          marginHorizontal: 17,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'space-between',
            // marginBottom: hp(20),
          }}>
          <Text
            style={{
              fontSize: fontSize(20),
              lineHeight: hp(30),
              fontFamily: fontFamily.poppins400,
              color: colors.black,
            }}>
            Explore
          </Text>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => RBSheetRef.current.open()}>
            <Image
              source={icons.filter_icon}
              style={{
                width: hp(24),
                height: hp(24),
                resizeMode: 'contain',
                marginRight: 2,
              }}
            />
          </TouchableOpacity>
        </View>

        <RBSheet
          ref={RBSheetRef}
          onClose={openBottomSheetModal}
          height={425}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            },
            draggableIcon: {
              backgroundColor: '#ffffff',
            },
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}>
          <View style={{flex: 1, marginTop: hp(10)}}>
            <Text
              style={{
                color: colors.black,
                textAlign: 'center',
                fontSize: fontSize(18),
                lineHeight: hp(27),
                fontFamily: fontFamily.poppins400,
              }}>
              Explore By
            </Text>

            <View style={{marginHorizontal: 26, marginTop: hp(34)}}>
              <TextInput
                placeholder={'Search by location'}
                placeholderTextColor={'black'}
                style={{
                  width: '100%',
                  height: hp(50),
                  backgroundColor: '#F7F7F7',
                  borderRadius: 10,
                  padding: 15,
                  paddingRight: 50,
                }}
              />

              <Image
                source={icons.search_icon}
                style={{
                  position: 'absolute',
                  right: 15,
                  top: 17,
                  width: 15,
                  height: 15,
                  resizeMode: 'contain',
                }}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp(29),
                  marginBottom: hp(20),
                }}>
                <Text
                  style={{
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                    color: colors.black,
                  }}>
                  Distance
                </Text>

                <Text
                  style={{
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                    color: colors.blue,
                  }}>{`${Math.ceil(progress * 10)} km`}</Text>
              </View>

              <CustomProgressBar
                progress={progress}
                onMoveCircle={newProgress => setProgress(newProgress)}
              />

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp(29),
                  marginBottom: hp(20),
                }}>
                <Text
                  style={{
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                    color: colors.black,
                  }}>
                  Age
                </Text>

                <Text
                  style={{
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                    color: colors.blue,
                  }}>{`18-${Math.max(Math.ceil(ageprogress * 50))}`}</Text>
              </View>

              <CustomProgressBar
                progress={ageprogress}
                onMoveCircle={newProgress => setAgeProgress(newProgress)}
              />

              <GradientButton
                buttonName={'Show Me'}
                buttonTextStyle={style.bottomTextStyle}
                containerStyle={style.BottomSheetButtonContainer}
                onPress={closeBottomSheet}
              />
            </View>
          </View>
        </RBSheet>
      </View>

      <View style={{backgroundColor: 'green', marginTop: -40}}>
        <Swiper
          cards={cards}
          renderCard={renderCard}
          onSwipedAll={onSwipedAll}
          onSwiped={onSwiped} // Handle card swipe event
          stackSize={2}
          backgroundColor="white"
          cardIndex={0}
          animateOverlayLabelsOpacity
          verticalSwipe={false}
          horizontalSwipe={true}
        />
      </View>
    </SafeAreaView>
  );
};

export default DatingHomeScreen;
