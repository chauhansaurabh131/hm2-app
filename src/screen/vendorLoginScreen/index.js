import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Alert,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import NewTextInputComponent from '../../components/newTextInputComponent';
import CommonGradientButton from '../../components/commonGradientButton';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-toast-message';
import {changeStack, login} from '../../actions/authActions';

const VendorLoginScreen = () => {
  const navigation = useNavigation();
  const {loading} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fcmToken, setFcmToken] = useState(null);

  const {sessionExpired} = useRoute().params || {};

  useEffect(() => {
    if (sessionExpired) {
      Alert.alert(
        // 'Session Expired',
        'Opps!',
        'Something went wrong, please try to login again',
        [{text: 'OK'}],
      );
    }
  }, [sessionExpired]);

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

  const successCallback = (appUsesType, userProfileCompleted) => {
    console.log('appUsesType =>', appUsesType);
    console.log('userProfileCompleted =>', userProfileCompleted);

    // If profile is incomplete
    if (userProfileCompleted === false) {
      navigation.replace('VendorBasicDetailScreen');
      return;
    }

    // If profile is completed
    dispatch(changeStack());
  };

  // const successCallback = (appUsesType, userProfileCompleted) => {
  //   if (appUsesType === 'vendor') {
  //     if (userProfileCompleted === false) {
  //       navigation.replace('VendorBasicDetailScreen');
  //       return;
  //     }
  //
  //     navigation.replace('ServiceTabs');
  //     return;
  //   }
  //
  //   dispatch(changeStack());
  // };

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

  const onPressLogin = async () => {
    Keyboard.dismiss();

    const netState = await NetInfo.fetch();
    if (!netState.isConnected) {
      Toast.show({
        type: 'error',
        text1: 'No Internet Connection',
        text2: 'Please check your network and try again',
      });
      return;
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedPassword) {
      Toast.show({
        type: 'error',
        text1: 'Missing Password',
        text2: 'Please enter your password',
      });
      return;
    }

    const isEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      trimmedEmail,
    );

    let loginPayload = {
      password: trimmedPassword,
    };

    if (isEmail) {
      loginPayload.email = trimmedEmail;
    } else {
      const mobileNumber = trimmedEmail.replace(/\D/g, '');
      if (mobileNumber.length !== 10) {
        Toast.show({
          type: 'error',
          text1: 'Invalid Mobile Number',
          text2: 'Please enter a valid 10-digit mobile number or email',
        });
        return;
      }

      loginPayload.countryCodeId = '690ab965be71921b32ea02a5';
      loginPayload.mobileNumber = mobileNumber;
    }

    // ✅ iOS-safe deviceToken handling
    if (fcmToken && typeof fcmToken === 'string') {
      loginPayload.deviceToken = fcmToken;
    }

    console.log('LOGIN PAYLOAD 👉', loginPayload);

    dispatch(login(loginPayload, successCallback, failureCallback));

    setEmail('');
    setPassword('');
  };

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

        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(24),
            lineHeight: hp(36),
            fontFamily: fontFamily.poppins600,
            alignSelf: 'center',
            marginTop: hp(100),
          }}>
          Vendor Login
        </Text>

        <View style={{marginHorizontal: wp(30), marginTop: hp(60)}}>
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
                color: '#7148E4',
                marginTop: hp(40),
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
              }}>
              Reset Password
            </Text>

            <View
              style={{
                width: '100%',
                height: hp(1),
                backgroundColor: '#E1E1E1',
                marginTop: hp(40),
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            // alignSelf: 'center',
            marginTop: hp(70),
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Provide Event Services?
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('VendorSignUpScreen');
            }}
            style={{
              // backgroundColor: 'red',
              width: '100%',
              alignItems: 'center',
              height: hp(30),
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: '#7148E4',
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
              }}>
              Join As Vendor
            </Text>
          </TouchableOpacity>
        </View>

        <Toast />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default VendorLoginScreen;
