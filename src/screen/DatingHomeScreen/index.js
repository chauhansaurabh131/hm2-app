import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
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
import AgeRangeSlider from '../../components/ageRangeSlider';
import ProfileAvatar from '../../components/letterProfileComponent';

const GOOGLE_MAPS_API_KEY = 'AIzaSyBaqU_1hOFIhVLm8su_caJheEChJCNBTyY';

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
  const [isAgeSelected, setIsAgeSelected] = useState(true);
  const [ageRange, setAgeRange] = useState([25, 35]);
  const [text, setText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const RBSheetRef = useRef();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);

  // console.log(' === user ===> ', user?.user);

  const bottomSheetRef = useRef(null);

  const topModalBottomSheetRef = useRef(null);
  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  // // Calculate age dynamically based on progress
  // const minAge = 18;
  // const maxAge = 50; // Max possible age
  // const currentAge = Math.round(minAge + (maxAge - minAge) * ageProgress);

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

  const userProfileCompleted = user?.user?.userProfileCompleted;
  const userPartnerFormPreCompleted = user?.user?.userPartnerPreCompleted;

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

  const hasValidImage =
    user?.user?.profilePic &&
    user?.user?.profilePic !== 'null' &&
    user?.user?.profilePic.trim() !== '';

  const userImage = user?.user?.profilePic;

  console.log(' === hasValidImage ===> ', user?.user?.profilePic);

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
            {/*{userImage ? (*/}
            {/*  <Image source={{uri: userImage}} style={style.dropDownTopImage} />*/}
            {/*) : (*/}
            {/*  <Image*/}
            {/*    source={images.empty_male_Image}*/}
            {/*    style={style.dropDownTopImage}*/}
            {/*  />*/}
            {/*)}*/}

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

        {/*TOP SHEET*/}
        {/*<HomeTopSheetComponent*/}
        {/*  isVisible={topModalVisible}*/}
        {/*  onBackdropPress={toggleModal}*/}
        {/*  onBackButtonPress={toggleModal}*/}
        {/*/>*/}
      </View>

      <View style={style.bodyContainer}>
        <View style={style.bodyContainerStyle}>
          <Text style={style.exploreText}>Explore</Text>

          <TouchableOpacity
            activeOpacity={0.5}
            style={style.filterContainer}
            // onPress={() => RBSheetRef.current.open()}
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

      <View style={{backgroundColor: 'white', flex: 1}}>
        <DatingSwipeDataComponent />
      </View>
    </SafeAreaView>
  );
};

export default DatingHomeScreen;
