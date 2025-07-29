import React, {useEffect, useState} from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import NewTextInputComponent from '../../components/newTextInputComponent';
import {changeStack, googleLogin, login} from '../../actions/authActions';
import {useDispatch, useSelector} from 'react-redux';
import CommonGradientButton from '../../components/commonGradientButton';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {
  GoogleSignin,
  isErrorWithCode,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';

const NewLogInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
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
    });
  }, []);

  const successCallback = () => {
    dispatch(changeStack());
  };

  const failureCallback = (otpType, otpEmail, otpMobileNumber) => {
    navigation.navigate('LoginAuthenticationCodeScreen', {
      email, // pass the email
      password, // pass the password
      otpType, // pass the method data
      otpEmail,
      otpMobileNumber,
      deviceToken: fcmToken,
    });
  };

  // const onPressLogin = () => {
  //   Keyboard.dismiss();
  //   const trimmedEmail = email.trim();
  //   // dispatch(login({email, password}, () => dispatch(changeStack())));
  //
  //   // Check if the email or mobile number is valid
  //   const isEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
  //     trimmedEmail,
  //   );
  //   let loginPayload = {};
  //
  //   if (isEmail) {
  //     console.log('Logging in with Email:', trimmedEmail);
  //     loginPayload = {email: trimmedEmail, password};
  //   } else {
  //     // Handle mobile number, ensuring it is 10 digits and no '+' sign
  //     const mobileNumber = trimmedEmail.replace(/\D/g, ''); // Removes all non-digit characters
  //     const isMobile = mobileNumber.length === 10;
  //
  //     if (isMobile) {
  //       console.log('Logging in with Mobile Number:', mobileNumber);
  //       loginPayload = {
  //         countryCodeId: '67d2698641c89038f51512a2', // You can dynamically handle this based on user's region
  //         mobileNumber: mobileNumber, // Only 10 digits will be passed
  //         password,
  //       };
  //     } else {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Invalid Mobile Number',
  //         text2: 'Please enter a valid 10-digit mobile number',
  //       });
  //       console.log('Invalid Mobile Number');
  //       return; // Return early if number is not valid
  //     }
  //   }
  //
  //   dispatch(login({...loginPayload}, successCallback, failureCallback));
  //   setEmail('');
  //   setPassword('');
  // };

  const onPressLogin = async () => {
    Keyboard.dismiss();

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      Toast.show({
        type: 'error',
        text1: 'No Internet Connection',
        text2: 'Please check your network and try again',
      });
      return; // ⛔ Stop login flow
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const isEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      trimmedEmail,
    );
    let loginPayload = {};

    if (isEmail) {
      if (!trimmedPassword) {
        Toast.show({
          type: 'error',
          text1: 'Missing Password',
          text2: 'Please enter your password',
        });
        return;
      }

      console.log('Logging in with Email:', trimmedEmail);
      loginPayload = {
        email: trimmedEmail,
        password: trimmedPassword,
      };
    } else {
      const mobileNumber = trimmedEmail.replace(/\D/g, ''); // removes non-digits
      const isMobile = mobileNumber.length === 10;

      if (isMobile) {
        if (!trimmedPassword) {
          Toast.show({
            type: 'error',
            text1: 'Missing Password',
            text2: 'Please enter your password',
          });
          return;
        }

        console.log('Logging in with Mobile Number:', mobileNumber);
        loginPayload = {
          countryCodeId: '68709f07e33fd998c7105ad5',
          mobileNumber,
          password: trimmedPassword,
          deviceToken: fcmToken,
        };
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid Mobile Number',
          text2: 'Please enter a valid 10-digit mobile number or email',
        });
        return;
      }
    }

    dispatch(
      login(
        {...loginPayload, deviceToken: fcmToken},
        successCallback,
        failureCallback,
      ),
    );
    setEmail('');
    setPassword('');
  };

  const signIn = async () => {
    console.log(' === signIn Press ===> ');
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log(' === response ===> ', response);

      const idToken = response.idToken || response?.data?.idToken;

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Image
          source={images.happyMilanColorLogo}
          style={{
            marginTop: hp(29),
            marginLeft: wp(33),
            resizeMode: 'stretch',
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
              fontFamily: fontFamily.poppins600,
              alignSelf: 'center',
              marginTop: hp(80),
            }}>
            Login
          </Text>

          <View style={{marginTop: hp(50)}}>
            <NewTextInputComponent
              value={email}
              onChangeText={emailInput => setEmail(emailInput)}
              placeholder="Your Email or Mobile"
              LeftIconName={icons.profileLogo}
            />

            <NewTextInputComponent
              value={password}
              onChangeText={passwordInput => setPassword(passwordInput)}
              placeholder="Enter Password"
              style={{marginTop: 20}}
              LeftIconName={icons.logLogo}
              RightIconName={icons.secureEyeLogo}
              isPasswordInput={true}
            />

            <CommonGradientButton
              buttonName={'Login'}
              containerStyle={{width: '100%', marginTop: hp(20)}}
              onPress={onPressLogin}
              loading={loading}
            />

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ResetPasswordScreen');
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  color: colors.blue,
                  marginTop: hp(40),
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Reset Password
              </Text>
            </TouchableOpacity>
          </View>

          {/*BOTTOM DESIGN */}
          <View
            style={{
              // position: 'absolute',
              // bottom: 0,
              // alignSelf: 'center',
              marginTop: hp(40),
              alignSelf: 'center',
            }}>
            <View
              style={{
                width: wp(267),
                borderWidth: 0.5,
                borderColor: '#E1E1E1',
                alignSelf: 'center',
                marginBottom: hp(5),
              }}
            />

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
                  style={{
                    height: hp(17.6),
                    width: hp(17.6),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>

              {/*<TouchableOpacity*/}
              {/*  style={{*/}
              {/*    width: hp(44),*/}
              {/*    height: hp(44),*/}
              {/*    borderRadius: hp(50),*/}
              {/*    borderColor: '#D4D4D4',*/}
              {/*    borderWidth: 1,*/}
              {/*    marginRight: wp(20),*/}
              {/*    justifyContent: 'center',*/}
              {/*    alignItems: 'center',*/}
              {/*    marginLeft: wp(24),*/}
              {/*  }}>*/}
              {/*  <Image*/}
              {/*    source={icons.facebookLogo}*/}
              {/*    style={{*/}
              {/*      height: hp(17.6),*/}
              {/*      width: hp(17.6),*/}
              {/*      resizeMode: 'contain',*/}
              {/*    }}*/}
              {/*  />*/}
              {/*</TouchableOpacity>*/}
            </View>

            <View
              style={{
                width: wp(267),
                borderWidth: 0.5,
                borderColor: '#E1E1E1',
                alignSelf: 'center',
                marginTop: hp(24),
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginBottom: isIOS ? hp(10) : hp(30),
                marginTop: hp(58),

                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                New Member?{' '}
              </Text>
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => {
                  navigation.navigate('NewSignUpScreen');
                }}>
                <Text
                  style={{
                    color: colors.blue,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/*<Toast ref={ref => Toast.setRef(ref)} />*/}
        <Toast />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default NewLogInScreen;
