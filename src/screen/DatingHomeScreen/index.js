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
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';

const DatingHomeScreen = () => {
  const [showModal, setShowModal] = useState(true);
  const [activeLine, setActiveLine] = useState(1);
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [bottomsheetVisible, setBottomSheVisible] = useState(false);
  const [progress, setProgress] = useState(0.6); // Initial progress value
  const [ageProgress, setAgeProgress] = useState(0); // Initial progress value
  const [cards, setCards] = useState([]);
  const [initialCards, setInitialCards] = useState([]); // State to hold the initial cards
  const [resetKey, setResetKey] = useState(0); // State to handle resetting the swiper
  const [swipedAllCards, setSwipedAllCards] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const RBSheetRef = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);

  console.log(' === user ===> ', user?.user);

  const topModalBottomSheetRef = useRef(null);
  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  // Calculate age dynamically based on progress
  const minAge = 18;
  const maxAge = 50; // Max possible age
  const currentAge = Math.round(minAge + (maxAge - minAge) * ageProgress);

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

  const userImage = user?.user?.profilePic;

  const userProfileCompleted = user?.user?.userProfileCompleted;
  const userPartnerFormPreCompleted = user?.user?.userPartnerPreCompleted;

  console.log(' === userProfileCompleted ===> ', userProfileCompleted);

  console.log(
    ' === userPartnerFormPreCompleted ===> ',
    userPartnerFormPreCompleted,
  );

  const handleButtonClick = () => {
    if (activeLine === 3) {
      setShowModal(false);
      setActiveLine(1); // Reset the active line
      navigation.navigate('DatingCreatingProfile');
    } else {
      setActiveLine(prev => prev + 1);
    }
  };

  const handleCompleteButtonClick = () => {
    setModalVisible(false);
    navigation.navigate('DatingPartnerPreferenceScreen');
  };

  useEffect(() => {
    if (userProfileCompleted) {
      setShowModal(false);
    }
  }, [userProfileCompleted]);

  useFocusEffect(
    useCallback(() => {
      if (!userProfileCompleted) {
        // If userProfileCompleted is false, show the modal
        setShowModal(true);
      } else if (userProfileCompleted && !userPartnerFormPreCompleted) {
        // If userProfileCompleted is true and userPartnerFormPreCompleted is false, show the modal
        setModalVisible(true);
      }
    }, [userProfileCompleted, userPartnerFormPreCompleted]),
  );

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
            // onPress={openTopSheetModal}
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
          height={hp(380)}
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
              {/*<View style={style.distanceContainer}>*/}
              {/*  <Text style={style.distanceText}>Distance</Text>*/}

              {/*  <Text style={style.distanceTextSlider}>{`${Math.ceil(*/}
              {/*    progress * 10,*/}
              {/*  )} km`}</Text>*/}
              {/*</View>*/}

              {/*<CustomProgressBar*/}
              {/*  progress={progress}*/}
              {/*  onMoveCircle={newProgress => setProgress(newProgress)}*/}
              {/*/>*/}

              <View style={style.ageContainer}>
                <Text style={style.ageTextStyle}>Age</Text>

                <Text style={style.ageTextSlider}>{`18-${currentAge}`}</Text>
              </View>

              <CustomProgressBar
                progress={ageProgress}
                onMoveCircle={newProgress => setAgeProgress(newProgress)}
              />
            </View>

            {/*<View style={style.BottomSheetUnderLine} />*/}

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

      {/* Modal Component */}
      <Modal
        // animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: wp(340),
              height: hp(420),
              backgroundColor: 'white',
              borderRadius: 14,
              alignItems: 'center',
            }}>
            <Image source={images.modal_top_img} style={{width: '100%'}} />

            <Text
              style={{
                fontSize: fontSize(20),
                lineHeight: hp(30),
                fontFamily: fontFamily.poppins600,
                color: colors.white,
                marginTop: -60,
              }}>
              Congratulations
            </Text>

            <View style={{marginTop: 70, alignItems: 'center'}}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(24),
                  lineHeight: hp(36),
                  fontFamily: fontFamily.poppins600,
                }}>
                Complete Your Profile
              </Text>

              <Text
                style={{
                  marginHorizontal: wp(31),
                  fontFamily: fontFamily.poppins400,
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  color: colors.black,
                  textAlign: 'center',
                  marginTop: hp(27),
                }}>
                Your privacy is our priority. Take{'\n'}advantage of our
                security features,{'\n'}and be assured that your information is
                {'\n'}in safe hands
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleCompleteButtonClick}
              // onPress={() => {
              //   setModalVisible(false);
              // }}
              style={{
                // backgroundColor: 'red',
                flex: 1,
                position: 'absolute',
                bottom: 50,
              }}>
              <LinearGradient
                colors={['#0F52BA', '#BA0FA9']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 2}}
                style={{
                  marginTop: hp(50),
                  width: wp(176),
                  height: hp(50),
                  borderRadius: 25,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: colors.white,
                    textAlign: 'center',
                    fontSize: fontSize(16),
                    lineHeight: hp(26),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  Let’s do it
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DatingHomeScreen;
