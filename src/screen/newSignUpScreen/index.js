import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Image,
  Keyboard,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import NewTextInputComponent from '../../components/newTextInputComponent';
import CommonGradientButton from '../../components/commonGradientButton';
import {useDispatch, useSelector} from 'react-redux';
import {changeStack, googleLogin, register} from '../../actions/authActions';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';
import appleAuth from '@invertase/react-native-apple-authentication';

const BLOCKED_EMAIL_DOMAINS = [
  'yopmail.com',
  'yopmail.fr',
  'yopmail.net',
  'yapmail.com',
  'mailinator.com',
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'example.com',
  'example.org',
  'example.net',
];

const NewSignUpScreen = () => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [fcmToken, setFcmToken] = useState(null);

  const {loading} = useSelector(state => state.auth);

  useEffect(() => {
    const RequestUserPermission = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        if (token) {
          console.log('=============fcmToken_____========>', token);
          setFcmToken(token); // Save the token in state
        }
      }
    };

    RequestUserPermission();
  }, []);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '562359368016-goaj8oi4f8tgeo001als2rib72da5dqs.apps.googleusercontent.com',
      iosClientId:
        '562359368016-4de4ter7ddbrqmlo2idthm45re3p5ta3.apps.googleusercontent.com',
    });
  }, []);

  const validateName = () => {
    if (name.length < 3) {
      setNameError('Name must be at least 3 characters');
      return false;
    } else if (name.length > 15) {
      setNameError('Name must be less than 15 characters');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const openPrivacyPolicy = async () => {
    const url = 'https://happymilan.vercel.app/privacypolicy';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn("Can't open URL:", url);
    }
  };

  const openTermAndCondition = async () => {
    const url = 'https://happymilan.vercel.app/termsofuse';
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.warn("Can't open URL:", url);
    }
  };

  // Validate Email or Mobile
  const validateEmailOrMobile = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email regex pattern
    const mobilePattern = /^[0-9]{10}$/; // Mobile number regex (10 digits)

    // Check if it's an email
    if (emailPattern.test(email)) {
      setEmailError('');
      return 'email';
    }

    // Check if it's a valid mobile number (10 digits)
    if (mobilePattern.test(email)) {
      setEmailError('');
      return 'mobile';
    }

    // Invalid email or mobile
    setEmailError('Invalid E-mail Address or Mobile Number');
    return false;
  };

  /* 🚫 CHECK DISPOSABLE EMAIL */
  const isBlockedEmailDomain = email => {
    if (!email.includes('@')) {
      return false;
    }
    const domain = email.split('@')[1].toLowerCase();
    return BLOCKED_EMAIL_DOMAINS.includes(domain);
  };

  const handleSignUp = () => {
    Keyboard.dismiss();
    // Validate both name and email/mobile input before proceeding
    const isNameValid = validateName();
    const emailOrMobileValid = validateEmailOrMobile();

    // If either validation fails, return early

    // if (!isNameValid || !emailOrMobileValid) {
    //   return;
    // }

    if (!isNameValid || !emailOrMobileValid) {
      return;
    }

    // 🚫 BLOCK FAKE EMAIL DOMAINS
    if (emailOrMobileValid === 'email' && isBlockedEmailDomain(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email Address',
        text2: 'Temporary or disposable email addresses are not allowed',
      });
      return;
    }

    console.log(' === onPressLogin ===> ', name, email);

    // Now we make the API call after validation
    if (emailOrMobileValid === 'email') {
      // Proceed with registration using email

      dispatch(
        register(
          {name, email, countryCodeId: '690ab965be71921b32ea02a5'},
          () => {
            navigation.navigate('VerifyEmailOtpScreen', {
              name,
              email,
              deviceToken: fcmToken,
            });
          },
        ),
      );
    } else if (emailOrMobileValid === 'mobile') {
      // Proceed with registration using mobile number

      dispatch(
        register(
          {
            name,
            mobileNumber: email,
            countryCodeId: '690ab965be71921b32ea02a5',
          },
          () => {
            navigation.navigate('VerifyEmailOtpScreen', {name, email});
          },
        ),
      );
    }
  };

  const signIn = async () => {
    console.log(' === signIn Press ===> ');
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log(' === response ===> ', response);

      const idToken = response.idToken || response?.data?.idToken;

      console.log(' === response?.data--- ===> ', response?.data);

      if (!idToken) {
        console.log('No idToken found in response');
        return;
      }

      // dispatch(
      //   googleLogin({access_token: idToken}, () => {
      //     navigation.navigate('NewStartExploreScreen');
      //   }),
      // );

      dispatch(
        googleLogin(
          {access_token: idToken},
          () => {
            // console.log(' === Success Callback ===> ');
            dispatch(changeStack());
          },
          () => {
            // console.log(' === Failure Callback ===> ');
            navigation.navigate('NewStartExploreScreen');
          },
        ),
      );
    } catch (error) {
      console.log(' === signIn error ===> ', error);
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log('Sign in already in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Play Services not available');
            break;
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled sign-in');
            break;
          default:
            console.log('Other Google sign-in error:', error.code);
        }
      } else {
        console.log('Non-Google sign-in error:', error.message);
      }
    }
  };

  // const handleAppleSignIn = async () => {
  //   try {
  //     const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: appleAuth.Operation.LOGIN,
  //       requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  //     });
  //
  //     console.log('APPLE RESPONSE:', appleAuthRequestResponse);
  //
  //     const {identityToken} = appleAuthRequestResponse;
  //
  //     if (!identityToken) {
  //       console.log('No identityToken');
  //       return;
  //     }
  //
  //     console.log('IDENTITY TOKEN:', identityToken);
  //
  //     alert('Apple login success, token received!');
  //   } catch (error) {
  //     console.log('Apple Error:', error);
  //   }
  // };

  // const handleAppleSignIn = async () => {
  //   try {
  //     // 🔹 Step 1: Perform Apple Login Request
  //     const appleAuthRequestResponse = await appleAuth.performRequest({
  //       requestedOperation: appleAuth.Operation.LOGIN,
  //       requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  //     });
  //
  //     console.log('🍎 Apple Full Response:', appleAuthRequestResponse);
  //
  //     const {identityToken, fullName, email, user} = appleAuthRequestResponse;
  //
  //     // 🔹 Step 2: Validate Token
  //     if (!identityToken) {
  //       console.log('❌ No identityToken returned');
  //       return;
  //     }
  //
  //     console.log('✅ Apple identityToken received');
  //
  //     // 🔹 Step 3: Send to Backend
  //     dispatch(
  //       googleLogin(
  //         {
  //           access_token: identityToken,
  //           provider: 'apple',
  //           appleUserId: user,
  //           name: fullName?.givenName || '',
  //           email: email || '',
  //         },
  //         // 🔹 Success Callback
  //         () => {
  //           console.log('✅ Apple login success');
  //           dispatch(changeStack());
  //         },
  //         // 🔹 Failure Callback
  //         () => {
  //           console.log('❌ Apple login failed');
  //           navigation.navigate('NewStartExploreScreen');
  //         },
  //       ),
  //     );
  //   } catch (error) {
  //     console.log('❌ Apple Sign-In Error:', error);
  //
  //     if (error.code === appleAuth.Error.CANCELED) {
  //       console.log('User canceled Apple Sign-In');
  //     } else {
  //       console.log('Other Apple Sign-In error');
  //     }
  //   }
  // };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Image
          source={images.happyMilanColorLogo}
          style={{
            marginTop: hp(15),
            marginLeft: wp(33),
            resizeMode: 'contain',
            width: hp(96),
            height: hp(24),
          }}
        />

        <View style={{flex: 1, marginHorizontal: wp(30)}}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(24),
              lineHeight: hp(36),
              fontFamily: fontFamily.poppins500,
              alignSelf: 'center',
              marginTop: hp(70),
            }}>
            Sign Up
          </Text>

          <View style={{marginTop: hp(50)}}>
            <NewTextInputComponent
              value={name}
              // onChangeText={text => setName(text)}
              onChangeText={text => {
                // Capitalize first letter and keep rest the same
                const formattedText =
                  text.charAt(0).toUpperCase() + text.slice(1);
                setName(formattedText);
              }}
              placeholder="Enter Your Name"
              LeftIconName={icons.profileLogo}
            />
            {nameError ? (
              <Text style={{marginTop: 2, color: 'red'}}>{nameError}</Text>
            ) : null}

            <NewTextInputComponent
              value={email}
              onChangeText={text => setEmail(text)}
              placeholder="Your Email or Mobile"
              style={{marginTop: 20}}
              LeftIconName={icons.mailLogo}
            />
            {emailError ? (
              <Text style={{color: 'red', marginTop: 2}}>{emailError}</Text>
            ) : null}

            <CommonGradientButton
              buttonName={'Send Code'}
              containerStyle={{width: '100%', marginTop: hp(20)}}
              onPress={handleSignUp}
              loading={loading}
            />

            <View style={{alignItems: 'center', marginTop: hp(34)}}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(14),
                  lineHeight: hp(20),
                  fontFamily: fontFamily.poppins400,
                }}>
                By creating account, I Agree to Hapmeet
              </Text>
              {/*<View>*/}
              {/*  <Text*/}
              {/*    style={{*/}
              {/*      color: colors.blue,*/}
              {/*      fontSize: fontSize(14),*/}
              {/*      lineHeight: hp(20),*/}
              {/*      fontFamily: fontFamily.poppins400,*/}
              {/*    }}>*/}
              {/*    Privacy Policy*/}
              {/*    <Text*/}
              {/*      style={{*/}
              {/*        color: colors.black,*/}
              {/*        fontSize: fontSize(14),*/}
              {/*        lineHeight: hp(20),*/}
              {/*        fontFamily: fontFamily.poppins400,*/}
              {/*      }}>*/}
              {/*      {' '}*/}
              {/*      and{' '}*/}
              {/*    </Text>*/}
              {/*    <Text>T&C</Text>*/}
              {/*  </Text>*/}
              {/*</View>*/}

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={openPrivacyPolicy}>
                  <Text
                    style={{
                      color: colors.blue,
                      fontSize: fontSize(14),
                      lineHeight: hp(20),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(14),
                    lineHeight: hp(20),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  {' '}
                  and{' '}
                </Text>
                <TouchableOpacity onPress={openTermAndCondition}>
                  <Text
                    style={{
                      color: colors.blue,
                      fontSize: fontSize(14),
                      lineHeight: hp(20),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    T&C
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/*BOTTOM DESIGN */}
          <View
            style={{
              // position: 'absolute',
              // bottom: 0,
              // alignSelf: 'center',
              // backgroundColor: 'red',
              marginTop: hp(40),
              alignSelf: 'center',
            }}>
            {Platform.OS !== 'ios' && (
              <View
                style={{
                  width: wp(267),
                  borderWidth: 0.5,
                  borderColor: '#E1E1E1',
                  alignSelf: 'center',
                  marginBottom: hp(5),
                }}
              />
            )}

            <View
              style={{
                marginTop: Platform.OS === 'ios' ? hp(50) : 0,
              }}
            />

            {Platform.OS !== 'ios' && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: hp(21),
                  width: wp(267),
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    textAlign: 'center',
                    color: colors.black,
                    fontFamily: fontFamily.poppins400,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  or continue with
                </Text>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={signIn}
                  // onPress={isIOS ? handleAppleSignIn : signIn}
                  style={{
                    width: hp(44),
                    height: hp(44),
                    borderRadius: hp(50),
                    borderColor: colors.lightGrayCircle,
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: wp(40),
                  }}>
                  <Image
                    source={icons.googleLogo}
                    // source={isIOS ? icons.apple_icon : icons.googleLogo}
                    style={{
                      height: hp(17.6),
                      width: hp(17.6),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}

            <View
              style={{
                width: wp(267),
                borderWidth: 0.5,
                borderColor: '#E1E1E1',
                alignSelf: 'center',
                marginTop: hp(24),
              }}
            />

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginBottom: isIOS ? hp(10) : hp(30),
                marginTop: hp(58),

                alignItems: 'center',
              }}
              onPress={() => {
                navigation.navigate('NewLogInScreen');
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Member Login
              </Text>
              <View>
                <Image
                  source={images.profileVectorLogo}
                  style={{
                    width: hp(16),
                    height: hp(16),
                    marginLeft: wp(10),
                    // top: 3,
                    tintColor: colors.black,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Toast ref={ref => Toast.setRef(ref)} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default NewSignUpScreen;
