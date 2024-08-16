import React, {useState, useEffect, useRef} from 'react';
import {
  SafeAreaView,
  Text,
  Modal,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import style from './style';
import LinearGradient from 'react-native-linear-gradient';
import {gif, icons, images} from '../../assets';
import StoryComponent from '../../components/storyComponent';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import PremiumMatchesFlatlistComponent from '../../components/premiumMatchesFlatlistComponent';
import {NEW_MATCHES} from '../../utils/data';
import SuccessStoryFlatListComponent from '../../components/SuccessStoryFlatListComponent';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import FastImage from 'react-native-fast-image';
import CommonGradientButton from '../../components/commonGradientButton';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {userDatas} from '../../actions/homeActions';
import PremiumMatchesComponent from '../../components/PremiumMatchesComponent';
import Toast from 'react-native-toast-message';
import {colors} from '../../utils/colors';
import io from 'socket.io-client';

const HomeScreen = ({route}) => {
  const [showModal, setShowModal] = useState(true);
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [isCompleteModalVisible, setCompleteModalModalVisible] =
    useState(false);
  const [activeLine, setActiveLine] = useState(1);
  const [status, setStatus] = useState('Disconnected');
  const socketRef = useRef(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {selectedBox} = route.params ?? {};

  const {user} = useSelector(state => state.auth);
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

  // console.log(' === var ===> ', user?.tokens?.access?.token);

  useEffect(() => {
    dispatch(userDatas());
  }, [dispatch]);

  const {userData} = useSelector(state => state.home);

  const userProfileCompleted = user?.user?.userProfileCompleted;

  useEffect(() => {
    if (userProfileCompleted) {
      setShowModal(false);
    }
  }, [userProfileCompleted]);

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const firstName = capitalizeFirstLetter(user?.user?.firstName || '');
  const lastName = user?.user?.lastName;
  const name = user?.user?.name;
  const profilePicUrl = user?.user?.profilePic;

  const handleButtonClick = () => {
    if (activeLine === 3) {
      setShowModal(false);
      setActiveLine(1); // Reset the active line
      navigation.navigate('GeneralInformationScreen');
    } else {
      setActiveLine(prev => prev + 1);
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
        return 'Boost your profile by sharing more about yourself, your interests, and your ideal partner. A detailed profile improves your chances of finding the perfect match';
      case 2:
        return 'Your privacy is our priority. Take advantage of our security features, and be assured that your information is in safe hands';
      case 3:
        return 'Your privacy is our priority. Take advantage of our security features, and be assured that your information is in safe hands';
      default:
        return 'Boost your profile by sharing more about yourself, your interests, and your ideal partner. A detailed profile improves your chances of finding the perfect match';
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
    setTopModalVisible(!topModalVisible);
  };

  const verificationModalToggle = () => {
    setCompleteModalModalVisible(false);
    navigation.navigate('GeneralInformationScreen', {selectedBox});
  };

  const openTopSheetModal = () => {
    // Call toggleModal to show the top modal
    toggleModal();
  };

  const completeOpenModal = selectedBox => {
    setCompleteModalModalVisible(true);
  };

  return (
    <SafeAreaView style={style.container}>
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
            activeOpacity={0.7}
            onPress={openTopSheetModal}
            style={style.headerTopSheetImageContainer}>
            <Image
              source={images.profileDisplayImage}
              style={style.headerTopSheetImageStyle}
            />
          </TouchableOpacity>
        </View>

        <View style={{marginTop: hp(15)}}>
          <StoryComponent />
        </View>

        {/*<Modal*/}
        {/*  visible={showModal}*/}
        {/*  animationType="none"*/}
        {/*  transparent*/}
        {/*  presentationStyle="overFullScreen"*/}
        {/*  onRequestClose={closeWelcomeModal}>*/}
        {/*  <View style={style.modalContainer}>*/}
        {/*    <View style={style.modalBodyContainer}>*/}
        {/*      <GradientText style={style.modalHeadingText}>*/}
        {/*        Congratulations*/}
        {/*      </GradientText>*/}

        {/*      <View*/}
        {/*        style={{*/}
        {/*          marginTop: 34,*/}
        {/*          alignItems: 'center',*/}
        {/*        }}>*/}
        {/*        <Text style={style.modalSubTitleTextStyle}>*/}
        {/*          "New Beginnings, New Possibilities!*/}
        {/*        </Text>*/}
        {/*        <Text style={style.modalSubTitleTextStyle}>*/}
        {/*          Congratulations on Registering with*/}
        {/*        </Text>*/}
        {/*        <Text style={style.modalSubTitleTextStyle}>HappyMilan</Text>*/}
        {/*      </View>*/}

        {/*      <FastImage*/}
        {/*        source={gif.congrats_modal}*/}
        {/*        style={{width: 180, height: 150, marginTop: -130}}*/}
        {/*        resizeMode={'contain'}*/}
        {/*      />*/}

        {/*      <CommonGradientButton*/}
        {/*        buttonName={'Start Exploring'}*/}
        {/*        onPress={closeWelcomeModal}*/}
        {/*        containerStyle={{*/}
        {/*          width: wp(280),*/}
        {/*          height: hp(50),*/}
        {/*          marginTop: hp(30),*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    </View>*/}
        {/*  </View>*/}
        {/*</Modal>*/}

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
                        borderWidth: 0.5,
                        borderColor:
                          activeLine === line ? '#8225AF' : '#E8E8E8',
                        marginHorizontal: 5,
                      }}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleButtonClick}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
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
          </View>
        </Modal>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={style.cardContainer}>
            <LinearGradient
              colors={['#0D4EB3', '#9413D0']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1.5}}
              style={style.cardBodyStyle}>
              <View style={style.cardViewStyle}>
                <Image
                  // source={images.profileDisplayImage}
                  // source={{uri: profilePicUrl}}
                  source={
                    profilePicUrl
                      ? {uri: profilePicUrl}
                      : images.profileDisplayImage
                  }
                  style={style.imageStyle}
                />
                <View style={style.cardTextContainer}>
                  {/*<Text style={style.cardUserTextStyle}>Riya Shah</Text>*/}
                  <Text style={style.cardUserTextStyle}>
                    {firstName} {lastName}
                  </Text>

                  <View style={style.cardSubTittleContainer}>
                    <Text style={style.cardSubTittleTextStyle}>
                      HM 10000122
                    </Text>
                    <View style={style.cardCenterLineStyle} />
                    <Text style={style.cardSubTittleTextStyle}>
                      FREE Profile
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      navigation.navigate('Upgrader');
                    }}
                    style={style.cardButtonContainer}>
                    <View style={style.cardButtonBodyStyle}>
                      <View style={style.cardButtonTextContainer}>
                        <Text style={style.cardButtonTextStyle}>Upgrade</Text>
                        <Image
                          source={icons.crownIcon}
                          style={style.cardButtonImageStyle}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/*TOP SHEET*/}
          <HomeTopSheetComponent
            isVisible={topModalVisible}
            onBackdropPress={toggleModal}
            onBackButtonPress={toggleModal}
          />

          <View style={style.premiumTextContainer}>
            <Text style={style.premiumTextStyle}>Premium Matches</Text>
            <Text style={style.premiumTextsStyle}>110</Text>
          </View>

          {/*PREMIUM MATCHES COMPONENT*/}
          <View style={style.PremiumMatchesTextContainer}>
            <PremiumMatchesFlatlistComponent
              data={NEW_MATCHES}
              shareButtonPress={() => {
                completeOpenModal(selectedBox);
              }}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              if (selectedBox === 'marriage') {
                navigation.navigate('Matches');
              } else if (selectedBox === 'dating') {
                navigation.navigate('Explore');
              }
            }}>
            <Text style={style.showMeAllTextStyle}>Show Me All</Text>
          </TouchableOpacity>

          <View style={style.premiumTextContainer}>
            <Text style={style.premiumTextStyle}>New Matches</Text>
            <Text style={style.premiumTextsStyle}>
              {userData?.data?.length}
            </Text>
          </View>

          <PremiumMatchesComponent data={NEW_MATCHES} />

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={style.showMeAllTextStyle}>Show Me All</Text>
          </TouchableOpacity>

          <View style={style.premiumTextContainer}>
            <Text style={style.premiumTextStyle}>Success Stories</Text>
          </View>

          <SuccessStoryFlatListComponent
            onStoryPagePress={() => {
              navigation.navigate('SuccessStoryPageScreen');
            }}
          />

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

          <View style={{height: isIOS ? hp(150) : hp(120)}} />
        </ScrollView>
      </View>
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default HomeScreen;
