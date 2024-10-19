import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import CustomProgressBar from '../../components/customProgressBar';
import GradientButton from '../../components/GradientButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import Swiper from 'react-native-deck-swiper';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import DatingSwipeDataComponent from '../../components/datingSwipeDataComponent';
import {style} from './style';
import {colors} from '../../utils/colors';
import axios from 'axios';

const DatingHomeScreen = () => {
  const [showModal, setShowModal] = useState(true);
  const [activeLine, setActiveLine] = useState(1);
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [bottomsheetVisible, setBottomSheVisible] = useState(false);
  const [progress, setProgress] = useState(0.6); // Initial progress value
  const [ageprogress, setAgeProgress] = useState(0.1); // Initial progress value
  const [cards, setCards] = useState([]);
  const [initialCards, setInitialCards] = useState([]); // State to hold the initial cards
  const [resetKey, setResetKey] = useState(0); // State to handle resetting the swiper
  const [swipedAllCards, setSwipedAllCards] = useState(false);

  const RBSheetRef = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);

  // console.log(' === user999999 ===> ', user);

  const getButtpnText = () => {
    switch (activeLine) {
      case 1:
        return 'Next';
      case 2:
        return 'Next';
      case 3:
        return 'Let’s do it';
      default:
        return 'Next';
    }
  };
  const getDisplayText = () => {
    switch (activeLine) {
      case 1:
        return 'Explore Matches';
      case 2:
        return 'Stay Safe & Secure';
      case 3:
        return 'Complete Your Profile';
      default:
        return 'Explore Matches';
    }
  };

  const getDisplayDescriptionText = () => {
    switch (activeLine) {
      case 1:
        return (
          'Boost your profile by sharing more\n' +
          'about yourself, your interests, and your\n' +
          'ideal partner. A detailed profile\n' +
          'improves your chances of finding the\n' +
          'perfect match'
        );
      case 2:
        return (
          'Your privacy is our priority. Take\n' +
          'advantage of our security features,\n' +
          'and be assured that your information is\n' +
          'improves your chances of finding the\n' +
          ''
        );
      case 3:
        return (
          'Your privacy is our priority. Take\n' +
          'advantage of our security features,\n' +
          'and be assured that your information is\n' +
          'improves your chances of finding the\n' +
          ''
        );
      default:
        return (
          'Boost your profile by sharing more\n' +
          'about yourself, your interests, and your\n' +
          'ideal partner. A detailed profile\n' +
          'improves your chances of finding the\n' +
          'perfect match'
        );
    }
  };

  const handleButtonClick = () => {
    if (activeLine === 3) {
      setShowModal(false);
      setActiveLine(1); // Reset the active line
      navigation.navigate('DatingCreatingProfile');
    } else {
      setActiveLine(prev => prev + 1);
    }
  };

  const userImage = user?.user?.profilePic;

  const userProfileCompleted = user?.user?.userProfileCompleted;

  useEffect(() => {
    if (userProfileCompleted) {
      setShowModal(false);
    }
  }, [userProfileCompleted]);

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
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <View style={style.headerBody}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.appLogoStyle}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openTopSheetModal}
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

        {/*TOP SHEET*/}
        <HomeTopSheetComponent
          isVisible={topModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        />
      </View>

      <View style={style.bodyContainer}>
        <View style={style.bodyContainerStyle}>
          <Text style={style.exploreText}>Explore</Text>

          <TouchableOpacity
            activeOpacity={0.5}
            style={style.filterContainer}
            onPress={() => RBSheetRef.current.open()}>
            <Image source={icons.filter_icon} style={style.filterIcon} />
          </TouchableOpacity>
        </View>

        <RBSheet
          ref={RBSheetRef}
          onClose={openBottomSheetModal}
          height={480}
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
          <View style={style.bottomSheetContainer}>
            <Text style={style.bottomSheetTittleText}>Explore By</Text>

            <View style={style.bottomSheetFilterContainer}>
              <TextInput
                placeholder={'Search by location'}
                placeholderTextColor={'black'}
                style={style.bottomSheetSearchTextInput}
              />

              <Image source={icons.search_icon} style={style.searchIcon} />
            </View>

            <View style={style.BottomSheetUnderLine} />

            <View style={style.bottomSheetBody}>
              <View style={style.distanceContainer}>
                <Text style={style.distanceText}>Distance</Text>

                <Text style={style.distanceTextSlider}>{`${Math.ceil(
                  progress * 10,
                )} km`}</Text>
              </View>

              <CustomProgressBar
                progress={progress}
                onMoveCircle={newProgress => setProgress(newProgress)}
              />

              <View style={style.ageContainer}>
                <Text style={style.ageTextStyle}>Age</Text>

                <Text style={style.ageTextSlider}>{`18-${Math.max(
                  Math.ceil(ageprogress * 50),
                )}`}</Text>
              </View>

              <CustomProgressBar
                progress={ageprogress}
                onMoveCircle={newProgress => setAgeProgress(newProgress)}
              />
            </View>

            <View style={style.BottomSheetUnderLine} />

            <View style={style.bottomSheetBody}>
              <GradientButton
                buttonName={'Show Me'}
                buttonTextStyle={style.bottomSheetShowMeText}
                containerStyle={style.BottomSheetButtonContainer}
                onPress={closeBottomSheet}
              />
            </View>
          </View>
        </RBSheet>
      </View>

      <View style={{backgroundColor: 'green', marginTop: -40}}>
        {/*<Swiper*/}
        {/*  cards={cards}*/}
        {/*  renderCard={renderCard}*/}
        {/*  onSwipedAll={onSwipedAll}*/}
        {/*  onSwiped={onSwiped} // Handle card swipe event*/}
        {/*  stackSize={2}*/}
        {/*  backgroundColor="white"*/}
        {/*  cardIndex={0}*/}
        {/*  animateOverlayLabelsOpacity*/}
        {/*  verticalSwipe={false}*/}
        {/*  horizontalSwipe={true}*/}
        {/*/>*/}

        {/*{user?.user?.userProfileCompleted === true ? (*/}
        {/*  <DatingSwipeDataComponent />*/}
        {/*) : (*/}
        {/*  <Text>No data</Text>*/}
        {/*)}*/}

        {/*{cards.length > 0 ? (*/}
        {/*  <Swiper*/}
        {/*    key={resetKey} // Add a key to reset the swiper*/}
        {/*    cards={cards}*/}
        {/*    renderCard={renderCard}*/}
        {/*    onSwipedAll={onSwipedAll}*/}
        {/*    onSwiped={onSwiped}*/}
        {/*    stackSize={2}*/}
        {/*    backgroundColor="white"*/}
        {/*    cardIndex={0}*/}
        {/*    animateOverlayLabelsOpacity*/}
        {/*    verticalSwipe={false}*/}
        {/*    horizontalSwipe={true}*/}
        {/*  />*/}
        {/*) : (*/}
        {/*  <Text>Loading...</Text>*/}
        {/*)}*/}

        <DatingSwipeDataComponent />
      </View>

      <Modal
        animationType="none"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}>
        <View style={style.modalContainer}>
          <View style={style.modalBodyContainer}>
            <Image source={images.modal_top_img} style={{width: '100%'}} />

            <Text style={style.modalTittleText}>Congratulations</Text>

            <View style={style.modalSubBodyContainer}>
              <Text style={style.modalDisplayText}>{getDisplayText()}</Text>

              <Text style={style.modalSubDisplayText}>
                {getDisplayDescriptionText()}
              </Text>

              <View style={style.modalLineContainer}>
                {[1, 2, 3].map((line, index) => (
                  <View
                    key={index}
                    style={{
                      width: wp(50),
                      borderWidth: 1,
                      borderColor: activeLine === line ? '#8225AF' : '#E8E8E8',
                      marginHorizontal: 5,
                    }}
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleButtonClick}
              style={style.modalButtonContainer}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0.5}}
                style={style.modalButtonGradient}>
                <Text style={style.modalButtonText}>{getButtpnText()}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DatingHomeScreen;
