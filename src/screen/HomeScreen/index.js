import React, {useState, useEffect, useRef, useCallback} from 'react';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Text,
  Modal,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  ImageBackground,
} from 'react-native';
import style from './style';
import LinearGradient from 'react-native-linear-gradient';
import {gif, icons, images} from '../../assets';

import HomeTopSheetComponent from '../../components/homeTopSheetComponent';

import SuccessStoryFlatListComponent from '../../components/SuccessStoryFlatListComponent';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import FastImage from 'react-native-fast-image';
import CommonGradientButton from '../../components/commonGradientButton';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getSuccessStories, userDatas} from '../../actions/homeActions';
import PremiumMatchesComponent from '../../components/PremiumMatchesComponent';

import {colors} from '../../utils/colors';
import io from 'socket.io-client';

import NewAddStoryScreen from '../newAddStoryScreen';
import {RequestUserPermission} from '../../service/pushNotification';
import NewPremiumMatchesComponent from '../../components/newPremiumMatchesComponent';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import RemainingDataUiScreen from '../editRemainingFillUpData/remainingDataUiScreen';
import DemoCode from '../demoCode';
import RecentlyViewComponent from '../../components/recentlyViewComponent';
import ProfileAvatar from '../../components/letterProfileComponent';
import Abc from '../abc';
import HomeCardProfileComponent from '../../components/homeCardProfileComponent';

const HomeScreen = ({route}) => {
  const insets = useSafeAreaInsets();
  const [showMeAllStories, setShowMeAllStories] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [isCompleteModalVisible, setCompleteModalModalVisible] =
    useState(false);
  const [activeLine, setActiveLine] = useState(1);
  const [planDetails, setPlanDetails] = useState('');

  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const [status, setStatus] = useState('Disconnected');
  const socketRef = useRef(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {selectedBox} = route.params ?? {};

  const {user} = useSelector(state => state.auth);

  // console.log(' === user?.user---= ===> ', user?.user);

  const {storiesData} = useSelector(state => state.home);

  const showCustomAlert = message => {
    setAlertMessage(message);
    setShowAlert(true);

    setTimeout(() => {
      setShowAlert(false);
    }, 1500);
  };

  // console.log(' === user____ ===> ', user);

  useEffect(() => {
    RequestUserPermission();
    // requestPermissions();
  }, []);

  useEffect(() => {
    dispatch(getSuccessStories());
  }, [dispatch]);

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!accessToken) {
        console.warn('No access token found');
        return;
      }

      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/user-plan/get-user-planbyId',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          console.log('User Plan:', data);
          setPlanDetails(data?.data);
        } else {
          console.error('API Error:', data);
          // Alert.alert('Error', data.message || 'Something went wrong');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        // Alert.alert('Network Error', 'Unable to fetch user plan');
      }
    };

    fetchUserPlan();
  }, [accessToken]);

  // console.log(' === storiesData ===> ', storiesData?.data?.totalResults);

  const userImage = user?.user?.profilePic;

  const hasValidImage =
    user?.user?.profilePic &&
    user?.user?.profilePic !== 'null' &&
    user?.user?.profilePic.trim() !== '';

  const accessToken = user?.tokens?.access?.token;
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    // Initialize socket connection
    const socketIo = io('https://happymilan.tech', {
      path: '/api/socket.io',
      query: {token: accessToken},
      // transports: ['websocket'], // Optional: specify transport
    });

    // Update connection status
    socketIo.on('connect', () => {
      console.log('Connected to socket');
      socketIo.emit('userActive');
    });

    socketIo.on('onlineUser', data => {
      console.log('Data from socket:', data);
    });
    // socketIo.emit('userActive');
    socketIo.on('disconnect', () => {
      setStatus('Disconnected');
      console.log('Disconnected from socket');
      socketIo.emit('userInActive');
    });

    setSocket(socketIo);

    // Cleanup on component unmount
    return () => {
      socketIo.disconnect();
      setSocket(null);
    };
  }, [accessToken]);

  useEffect(() => {
    if (user?.user && userProfileCompleted) {
      dispatch(userDatas());
    }
    dispatch(getSuccessStories());
  }, [dispatch, user, userProfileCompleted]);

  const {userData} = useSelector(state => state.home);

  const userProfileCompleted = user?.user?.userProfileCompleted;

  const userPartnerPreCompleted = user?.user?.userPartnerPreCompleted;

  useEffect(() => {
    if (userPartnerPreCompleted === false) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [userPartnerPreCompleted]);

  const handleButtonClick = () => {
    if (activeLine === 3) {
      setShowModal(false);
      setActiveLine(1); // Reset the active line
      // navigation.navigate('GeneralInformationScreen');
      // navigation.navigate('CreatingProfileScreen');

      if (!userProfileCompleted) {
        // Navigate to CreatingProfileScreen if user profile is not completed
        navigation.navigate('CreatingProfileScreen');
      } else if (!userPartnerPreCompleted) {
        // Navigate to Abc if partner pre-profile is not completed
        navigation.navigate('PartnerPreferencesScreen');
      } else {
        // If both conditions are true, don't display modal and proceed with existing logic
        setShowModal(false);
      }
    } else {
      setActiveLine(prev => prev + 1);
    }
  };

  useFocusEffect(
    useCallback(() => {
      // This will hide the modal when the screen is focused
      if (!(userProfileCompleted && userPartnerPreCompleted)) {
        setShowModal(true); // Show modal only if conditions are false
      }
    }, [userProfileCompleted, userPartnerPreCompleted]),
  );

  const capitalizeFirstLetter = str => {
    if (!str || typeof str !== 'string') {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const firstName = capitalizeFirstLetter(
    user?.user?.firstName || user?.user?.name || '',
  );
  const lastName = user?.user?.lastName;
  const name = capitalizeFirstLetter(user?.user?.name || '');
  const profilePicUrl = user?.user?.profilePic;
  const UserUniqueId = user?.user?.userUniqueId;

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

  const closeWelcomeModal = () => {
    setShowModal(false);
  };

  const toggleModal = () => {
    // console.log(' === toggleModal ===> ', topModalVisible);
    setTopModalVisible(!topModalVisible);
  };

  const verificationModalToggle = () => {
    setCompleteModalModalVisible(false);
    // navigation.navigate('GeneralInformationScreen', {selectedBox});
    navigation.navigate('CreatingProfileScreen', {selectedBox});
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  const completeOpenModal = selectedBox => {
    setCompleteModalModalVisible(true);
  };

  const onStoriesAllOnPress = () => {
    setShowMeAllStories(true);
  };
  const onStoriesAllNotPress = () => {
    setShowMeAllStories(false);
  };

  const topModalBottomSheetRef = useRef(null);

  // Function to open bottom sheet from Abc component
  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={style.container}>
      {/*<SafeAreaView style={[style.container, {paddingTop: insets.top}]}>*/}
      {showAlert && (
        <View
          style={{
            position: 'absolute',
            top: hp(40),
            alignSelf: 'center',
            backgroundColor: '#333',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 30,
            zIndex: 1000,
          }}>
          <Text
            style={{
              color: '#fff',
              fontFamily: fontFamily.poppins400,
            }}>
            {alertMessage}
          </Text>
        </View>
      )}

      <View style={{marginHorizontal: 17}}>
        <View style={style.headerViewContainer}>
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
            style={{
              position: 'absolute',
              right: 45,
              height: hp(24),
              width: hp(30),
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => {
              navigation.navigate('SearchFilterScreen');
            }}>
            <Image
              source={icons.search_gradient_icon}
              style={{width: hp(16), height: hp(16), resizeMode: 'contain'}}
            />
          </TouchableOpacity>

          {/*TOP PROFILE BUTTON TOGGLE*/}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openBottomSheet}
            style={style.headerTopSheetImageContainer}>
            {hasValidImage ? (
              <Image
                source={userImage ? {uri: userImage} : images.empty_male_Image}
                style={style.headerTopSheetImageStyle}
              />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName || name}
                lastName={user?.user?.lastName}
                textStyle={style.headerTopSheetImageStyle}
                profileTexts={{fontSize: fontSize(10)}}
              />
            )}
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View style={{marginTop: hp(15)}}>
          <NewAddStoryScreen />
        </View>
      </View>

      {/*<LinearGradient*/}
      {/*  colors={['white', 'transparent']}*/}
      {/*  style={{*/}
      {/*    height: 15,*/}
      {/*    width: '100%',*/}
      {/*    position: 'absolute',*/}
      {/*    top: 100, // 👈 exactly below header*/}
      {/*    left: 0,*/}
      {/*    right: 0,*/}
      {/*    zIndex: 1,*/}
      {/*  }}*/}
      {/*/>*/}

      <Modal
        animationType="none"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(!showModal);
        }}>
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
              height: hp(470),
              backgroundColor: 'white',
              borderRadius: 14,
              alignItems: 'center',
            }}>
            <Image
              source={images.modal_top_img}
              style={{
                width: '99.9%',
                height: hp(91),
                borderTopRightRadius: 14,
                borderTopLeftRadius: 14,
              }}
            />

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
                {getDisplayText()}
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
                {getDisplayDescriptionText()}
              </Text>

              <View
                style={{
                  marginTop: 50,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                {[1, 2, 3].map((line, index) => (
                  <View
                    key={index}
                    style={{
                      width: wp(50),
                      borderWidth: 1,
                      // borderColor: activeLine === line ? '#8225AF' : '#E8E8E8',
                      borderColor: activeLine === line ? '#7045EB' : '#E8E8E8',
                      marginHorizontal: 5,
                    }}
                  />
                ))}
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleButtonClick}
              style={{
                // backgroundColor: 'red',
                flex: 1,
                position: 'absolute',
                bottom: 35,
              }}>
              <LinearGradient
                colors={['#7045EB', '#4819CB']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0.5}}
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
                  {getButtpnText()}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginHorizontal: 17}}>
          <HomeCardProfileComponent />
        </View>

        {/*TOP SHEET*/}
        <HomeTopSheetComponent
          isVisible={topModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        />

        <View>
          <View style={style.premiumTextContainer}>
            <Text style={style.premiumTextStyle}>New Matches</Text>
          </View>

          {/*PREMIUM MATCHES COMPONENT*/}
          <View style={style.PremiumMatchesTextContainer}>
            <PremiumMatchesComponent
              onShowAlert={showCustomAlert} // 👈 PASS CALLBACK
            />
          </View>
        </View>

        <TouchableHighlight
          activeOpacity={0.3}
          style={{
            justifyContent: 'center',
            height: hp(45),
          }}
          underlayColor="#F9FBFF"
          // onPress={() => {
          //   navigation.navigate('Matches');
          // }}
          onPress={() => {
            navigation.navigate('Matches', {initialTab: 'new'}); // 👈 passing "viewed"
          }}>
          <Text style={style.showMeAllTextStyle}>Show Me All</Text>
        </TouchableHighlight>

        <View style={{width: '100%', height: 4, backgroundColor: '#F8F8F8'}} />

        {/*<View style={{width: '100%', height: 4, backgroundColor: '#F8F8F8'}} />*/}

        {/* Start Recently view code*/}
        <View>
          <RecentlyViewComponent />
        </View>

        <View>
          <RemainingDataUiScreen />
        </View>

        {/*<View*/}
        {/*  style={{*/}
        {/*    width: '100%',*/}
        {/*    height: 4,*/}
        {/*    backgroundColor: '#F8F8F8',*/}
        {/*    marginTop: hp(25),*/}
        {/*  }}*/}
        {/*/>*/}

        {storiesData?.data?.totalResults > 0 && (
          <>
            <View style={{marginHorizontal: 17}}>
              <View style={[style.premiumTextContainer, {marginTop: 0}]}>
                <Text style={style.premiumTextStyle}>Success Stories</Text>
              </View>

              <SuccessStoryFlatListComponent />
            </View>

            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor="#F9FBFF"
              style={{
                height: hp(45),
                justifyContent: 'center',
                marginTop: hp(5),
                marginBottom: hp(10),
              }}
              onPress={() => {
                console.log(' === var ===> ');
              }}>
              <Text style={style.showMeAllTextStyle}>Show Me All</Text>
            </TouchableHighlight>
          </>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          style={{marginHorizontal: 17}}
          onPress={() => {
            navigation.navigate('SuccessStoryEditInformationScreen');
          }}>
          <ImageBackground
            source={images.new_add_story_img}
            style={{height: hp(159), width: '100%'}}
            imageStyle={{borderRadius: 12}} // ✅ iOS friendly
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/*VERIFICATION MODAL OPEN */}
        <View style={style.verificationModalContainer}>
          <Modal
            visible={isCompleteModalVisible}
            animationType="none"
            transparent={true}>
            <View style={style.verificationModalContainerStyle}>
              <View style={style.verificationModalBodyStyle}>
                <Text style={style.verificationModalHeadingStyle}>
                  Please complete your profile
                </Text>

                <FastImage
                  source={gif.register_modal}
                  style={{height: 180, width: 180, marginTop: 20}}
                  resizeMode={'contain'}
                />

                <View style={style.verificationDescriptionStyle}>
                  <Text style={style.verificationDescriptionText}>
                    A comprehensive profile enables us to provide
                  </Text>

                  <Text style={style.verificationDescriptionText}>
                    recise match recommendations, ensuring
                  </Text>

                  <Text style={style.verificationDescriptionText}>
                    that we deliver tailored results to you.
                  </Text>

                  <CommonGradientButton
                    buttonName={'Let’s do it'}
                    containerStyle={{
                      width: wp(270),
                      height: hp(50),
                      marginTop: hp(20),
                    }}
                    onPress={verificationModalToggle}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>

        <View style={{height: isIOS ? hp(20) : hp(20)}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
