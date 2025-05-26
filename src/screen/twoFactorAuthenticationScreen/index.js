import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Animated,
  Button,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import ProfileAvatar from '../../components/letterProfileComponent';

const TwoFactorAuthenticationScreen = () => {
  const [isToggled, setIsToggled] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial API call
  const [error, setError] = useState(null); // For handling errors
  const [isEnabled, setIsEnabled] = useState(false); // To track the 2FA status
  const [isModalVisible, setIsModalVisible] = useState(false);

  const animatedValue = useRef(new Animated.Value(3)).current;

  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;
  const accessToken = user?.tokens?.access?.token;

  const navigation = useNavigation();

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const onTurnOffPress = () => {
    setIsModalVisible(true); // Toggle the modal visibility
  };

  const fetch2FAStatus = useCallback(() => {
    if (accessToken) {
      fetch('https://stag.mntech.website/api/v1/user/2fa/status', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          console.log(' === API response ===> ', data);
          if (data?.isEnabled !== undefined) {
            setIsEnabled(data?.isEnabled);
            setIsToggled(data?.isEnabled);
          }
          setIsLoading(false);
        })
        .catch(err => {
          setError(err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [accessToken]);

  useFocusEffect(
    useCallback(() => {
      fetch2FAStatus();
    }, [fetch2FAStatus]),
  );

  const handleTurnOff2FA = () => {
    setIsLoading(true); // Show loading indicator during the request
    setIsModalVisible(false);

    // Disable 2FA by making the API call
    fetch('https://stag.mntech.website/api/v1/user/2fa/disable', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`, // Using the access token for authentication
      },
    })
      .then(response => response.json())
      .then(data => {
        console.log(' === data__ ===> ', data);
        // Check if the response message is as expected
        if (
          data?.message === 'Two-factor authentication disabled successfully'
        ) {
          console.log('2FA successfully disabled, fetching updated status...');

          // Call fetch2FAStatus again to get the updated status
          fetch2FAStatus(); // Re-fetch the 2FA status after disabling it
        } else {
          setError('Failed to disable 2FA. Please try again.'); // Set error if the request fails
        }
        setIsLoading(false); // Hide loading indicator
      })
      .catch(err => {
        console.log('Error while disabling 2FA:', err);
        setError('Failed to disable 2FA. Please try again.'); // Set error if the request fails
        setIsLoading(false); // Hide loading indicator
      });
  };

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isToggled ? 28 : 3,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isToggled]);

  const toggleSwitch = () => {
    setIsToggled(!isToggled);
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        {/*<Text>Loading...</Text>*/}
        <ActivityIndicator size="large" color={colors.blue} />
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView
        style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{color: 'red'}}>
          Failed to load data. Please try again later.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />
          {/*<TouchableOpacity onPress={openTopSheetModal}>*/}
          <TouchableOpacity onPress={openBottomSheet}>
            {userImage ? (
              <Image
                source={{uri: userImage}}
                style={style.profileImageStyle}
              />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName}
                lastName={user?.user?.lastName}
                textStyle={style.profileImageStyle}
                profileTexts={{fontSize: fontSize(10)}}
              />
            )}
            {/*<Image*/}
            {/*  source={userImage ? {uri: userImage} : images.empty_male_Image}*/}
            {/*  style={style.profileImageStyle}*/}
            {/*/>*/}
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View style={style.headingTittleContainer}>
          <Text style={style.headingCredentialsText}>Enable 2FA</Text>
          <TouchableOpacity
            style={style.backButtonContainer}
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back_arrow_icon}
              style={style.backButtonIconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={style.underLineHeaderStyle} />

      {isEnabled ? (
        // If 2FA is enabled (status is true), show only the authentication message

        <View style={{marginHorizontal: 17, marginTop: hp(20)}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: fontSize(14),
                lineHeight: hp(18),
                fontFamily: fontFamily.poppins400,
                color: colors.black,
              }}>
              Your account is protected with 2-Step{'\n'}Verification
            </Text>

            <View
              style={{
                width: hp(44),
                height: hp(23),
                backgroundColor: '#FCF6FF',
                borderRadius: 100,
                // justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text style={{color: colors.black, fontWeight: 'bold'}}>on</Text>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            style={{marginTop: hp(20)}}
            onPress={onTurnOffPress}>
            <LinearGradient
              colors={['#0D4EB3', '#9413D0']}
              style={{
                width: '100%',
                height: hp(50),
                borderRadius: 50,
                borderWidth: 1,
                justifyContent: 'center',
                borderColor: 'transparent', // Set border color to transparent
              }}>
              <View
                style={{
                  borderRadius: 50, // <-- Inner Border Radius
                  flex: 1,
                  backgroundColor: colors.white,
                  justifyContent: 'center',
                  margin: isIOS ? 0 : 1,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    backgroundColor: 'transparent',
                    color: colors.black,
                    margin: 10,
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins600,
                  }}>
                  Turn Off 2FA Authentication
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* Modal component */}
          {/*<Modal*/}
          {/*  visible={isModalVisible}*/}
          {/*  animationType="none" // You can choose 'fade' or 'slide' for the animation*/}
          {/*  transparent={true} // Makes the background behind the modal dim*/}
          {/*  onRequestClose={() => {*/}
          {/*    onTurnOffPress;*/}
          {/*  }} // Close the modal when the back button is pressed on Android*/}
          {/*>*/}
          {/*  <View*/}
          {/*    style={{*/}
          {/*      flex: 1,*/}
          {/*      justifyContent: 'center',*/}
          {/*      alignItems: 'center',*/}
          {/*      backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background*/}
          {/*    }}>*/}
          {/*    <View*/}
          {/*      style={{*/}
          {/*        width: '90%',*/}
          {/*        backgroundColor: 'white',*/}
          {/*        borderRadius: 10,*/}
          {/*      }}>*/}
          {/*      <View style={{marginTop: hp(54)}}>*/}
          {/*        <Text*/}
          {/*          style={{*/}
          {/*            textAlign: 'center',*/}
          {/*            color: colors.black,*/}
          {/*            fontSize: fontSize(16),*/}
          {/*            lineHeight: hp(24),*/}
          {/*            fontFamily: fontFamily.poppins400,*/}
          {/*          }}>*/}
          {/*          Disabling 2-step verification will*/}
          {/*        </Text>*/}
          {/*        <Text*/}
          {/*          style={{*/}
          {/*            textAlign: 'center',*/}
          {/*            color: colors.black,*/}
          {/*            fontSize: fontSize(16),*/}
          {/*            lineHeight: hp(24),*/}
          {/*            fontFamily: fontFamily.poppins400,*/}
          {/*          }}>*/}
          {/*          eliminate the additional security for{' '}*/}
          {/*        </Text>*/}
          {/*        <Text*/}
          {/*          style={{*/}
          {/*            textAlign: 'center',*/}
          {/*            color: colors.black,*/}
          {/*            fontSize: fontSize(16),*/}
          {/*            lineHeight: hp(24),*/}
          {/*            fontFamily: fontFamily.poppins400,*/}
          {/*          }}>*/}
          {/*          your account.{' '}*/}
          {/*        </Text>*/}
          {/*      </View>*/}
          {/*      /!*<Button title="Close" onPress={onTurnOffPress} />*!/*/}

          {/*      <View*/}
          {/*        style={{*/}
          {/*          flexDirection: 'row',*/}
          {/*          justifyContent: 'center',*/}
          {/*          marginTop: hp(32),*/}
          {/*          marginBottom: hp(52),*/}
          {/*        }}>*/}
          {/*        <TouchableOpacity*/}
          {/*          activeOpacity={0.7}*/}
          {/*          style={{marginRight: hp(17)}}*/}
          {/*          onPress={() => {*/}
          {/*            setIsModalVisible(false);*/}
          {/*          }}>*/}
          {/*          <LinearGradient*/}
          {/*            colors={['#0D4EB3', '#9413D0']}*/}
          {/*            style={{*/}
          {/*              width: hp(120),*/}
          {/*              height: hp(46),*/}
          {/*              borderRadius: 50,*/}
          {/*              borderWidth: 1,*/}
          {/*              justifyContent: 'center',*/}
          {/*              borderColor: 'transparent', // Set border color to transparent*/}
          {/*            }}>*/}
          {/*            <View*/}
          {/*              style={{*/}
          {/*                borderRadius: 50, // <-- Inner Border Radius*/}
          {/*                flex: 1,*/}
          {/*                backgroundColor: colors.white,*/}
          {/*                justifyContent: 'center',*/}
          {/*                margin: isIOS ? 0 : 1,*/}
          {/*              }}>*/}
          {/*              <Text*/}
          {/*                style={{*/}
          {/*                  textAlign: 'center',*/}
          {/*                  backgroundColor: 'transparent',*/}
          {/*                  color: colors.black,*/}
          {/*                  margin: 10,*/}
          {/*                  fontSize: fontSize(16),*/}
          {/*                  lineHeight: hp(24),*/}
          {/*                  fontFamily: fontFamily.poppins400,*/}
          {/*                }}>*/}
          {/*                Cancel*/}
          {/*              </Text>*/}
          {/*            </View>*/}
          {/*          </LinearGradient>*/}
          {/*        </TouchableOpacity>*/}

          {/*        <TouchableOpacity*/}
          {/*          activeOpacity={0.7}*/}
          {/*          onPress={handleTurnOff2FA}>*/}
          {/*          <LinearGradient*/}
          {/*            colors={['#0F52BA', '#8225AF']}*/}
          {/*            start={{x: 0, y: 0}}*/}
          {/*            end={{x: 1, y: 1.2}}*/}
          {/*            style={{*/}
          {/*              width: hp(120),*/}
          {/*              height: hp(44),*/}
          {/*              borderRadius: 50,*/}
          {/*              alignItems: 'center',*/}
          {/*              justifyContent: 'center',*/}
          {/*              alignSelf: 'center',*/}
          {/*              // marginTop: hp(75),*/}
          {/*            }}>*/}
          {/*            <Text*/}
          {/*              style={{*/}
          {/*                color: 'white',*/}
          {/*                fontSize: fontSize(16),*/}
          {/*                lineHeight: hp(24),*/}
          {/*                fontFamily: fontFamily.poppins400,*/}
          {/*              }}>*/}
          {/*              Turn off*/}
          {/*            </Text>*/}
          {/*          </LinearGradient>*/}
          {/*        </TouchableOpacity>*/}

          {/*        <View style={{marginBottom: 10}} />*/}
          {/*      </View>*/}
          {/*    </View>*/}
          {/*  </View>*/}
          {/*</Modal>*/}
        </View>
      ) : (
        <>
          <View style={style.bodyContainer}>
            {/* Conditionally render the text */}
            {isToggled ? (
              <Text style={style.bodyTittle}>Choose the option for 2FA.</Text>
            ) : (
              <View>
                <Text style={style.bodyTittle}>
                  2 Factor Authentication is off
                </Text>
              </View>
            )}

            <View style={style.switchWrapper}>
              {isToggled ? (
                <LinearGradient
                  colors={['#8225AF', '#0F52BA']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={style.switch}>
                  <Animated.View
                    style={[
                      style.circleContainer,
                      {transform: [{translateX: animatedValue}]},
                    ]}>
                    <TouchableOpacity
                      style={[
                        style.circle,
                        {backgroundColor: isToggled ? 'white' : 'black'},
                      ]}
                      onPress={toggleSwitch}
                    />
                  </Animated.View>
                </LinearGradient>
              ) : (
                <View style={[style.switch, {backgroundColor: '#F1F1F1'}]}>
                  <Animated.View
                    style={[
                      style.circleContainer,
                      {transform: [{translateX: animatedValue}]},
                    ]}>
                    <TouchableOpacity
                      style={[
                        style.circle,
                        {backgroundColor: isToggled ? 'white' : 'black'},
                      ]}
                      onPress={toggleSwitch}
                    />
                  </Animated.View>
                </View>
              )}
            </View>
          </View>

          <View style={style.bodyOptionContainer}>
            {isToggled ? (
              <>
                <View style={style.optionBodyContainer}>
                  <TouchableHighlight
                    activeOpacity={0.3}
                    underlayColor="#F9FBFF"
                    style={style.optionBodyTouchable}
                    onPress={() => {
                      navigation.navigate('StepForAuthenticationOnScreen');
                    }}>
                    <View style={style.optionBodyStyle}>
                      <Image
                        source={icons.QR_Code_icon}
                        style={style.optionBodyImage}
                      />
                      <Text style={style.optionBodyText}>
                        Authenticator App
                      </Text>

                      <Image
                        source={icons.rightSideIcon}
                        style={style.optionBodyRightIcon}
                      />
                    </View>
                  </TouchableHighlight>
                </View>

                <View style={[style.optionBodyContainer, {marginTop: hp(13)}]}>
                  <TouchableHighlight
                    activeOpacity={0.3}
                    underlayColor="#F9FBFF"
                    style={style.optionBodyTouchable}
                    onPress={() => {
                      navigation.navigate('EmailNumberAuthenticationNumber');
                    }}>
                    <View style={style.optionBodyStyle}>
                      <Image
                        source={icons.send_message_icon}
                        style={style.optionBodyImage}
                      />
                      <Text style={style.optionBodyText}>
                        Email/Phone Number
                      </Text>

                      <Image
                        source={icons.rightSideIcon}
                        style={style.optionBodyRightIcon}
                      />
                    </View>
                  </TouchableHighlight>
                </View>
              </>
            ) : (
              <></>
            )}
          </View>
        </>
      )}

      <Modal
        visible={isModalVisible}
        animationType="none" // You can choose 'fade' or 'slide' for the animation
        transparent={true} // Makes the background behind the modal dim
        onRequestClose={() => {
          onTurnOffPress;
        }} // Close the modal when the back button is pressed on Android
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dimmed background
          }}>
          <View
            style={{
              width: '90%',
              backgroundColor: 'white',
              borderRadius: 10,
            }}>
            <View style={{marginTop: hp(54)}}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.black,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Disabling 2-step verification will
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.black,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                eliminate the additional security for{' '}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.black,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                your account.{' '}
              </Text>
            </View>
            {/*<Button title="Close" onPress={onTurnOffPress} />*/}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: hp(32),
                marginBottom: hp(52),
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={{marginRight: hp(17)}}
                onPress={() => {
                  setIsModalVisible(false);
                }}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  style={{
                    width: hp(120),
                    height: hp(46),
                    borderRadius: 50,
                    borderWidth: 1,
                    justifyContent: 'center',
                    borderColor: 'transparent', // Set border color to transparent
                  }}>
                  <View
                    style={{
                      borderRadius: 50, // <-- Inner Border Radius
                      flex: 1,
                      backgroundColor: colors.white,
                      justifyContent: 'center',
                      margin: isIOS ? 0 : 1,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        backgroundColor: 'transparent',
                        color: colors.black,
                        margin: 10,
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Cancel
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7} onPress={handleTurnOff2FA}>
                <LinearGradient
                  colors={['#0F52BA', '#8225AF']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1.2}}
                  style={{
                    width: hp(120),
                    height: hp(44),
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    // marginTop: hp(75),
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: fontSize(16),
                      lineHeight: hp(24),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Turn off
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={{marginBottom: 10}} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default TwoFactorAuthenticationScreen;
