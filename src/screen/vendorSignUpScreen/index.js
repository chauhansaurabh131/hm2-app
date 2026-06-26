import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Image,
  Keyboard,
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
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {register} from '../../actions/authActions';
import messaging from '@react-native-firebase/messaging';

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

const VendorSignUpScreen = () => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [fcmToken, setFcmToken] = useState(null);

  const navigation = useNavigation();
  const dispatch = useDispatch();

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

    const emailOrMobileValid = validateEmailOrMobile();

    // // 🚫 BLOCK FAKE EMAIL DOMAINS
    if (emailOrMobileValid === 'email' && isBlockedEmailDomain(email)) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email Address',
        text2: 'Temporary or disposable email addresses are not allowed',
      });
      return;
    }

    // Now we make the API call after validation
    if (emailOrMobileValid === 'email') {
      // Proceed with registration using email

      dispatch(
        register(
          {name, email, countryCodeId: '690ab965be71921b32ea02a5'},
          () => {
            navigation.navigate('VendorOtpVerificationScreen', {
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
            countryCodeId: '6957bb1536f15415201f50e2',
          },
          () => {
            navigation.navigate('VendorOtpVerificationScreen', {name, email});
          },
        ),
      );
    }
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
            fontFamily: fontFamily.poppins500,
            alignSelf: 'center',
            marginTop: hp(100),
          }}>
          Join as Vendor
        </Text>

        <View style={{marginHorizontal: wp(30), marginTop: hp(60)}}>
          <NewTextInputComponent
            value={name}
            // onChangeText={text => setName(text)}
            onChangeText={text => {
              // Capitalize first letter and keep rest the same
              const formattedText =
                text.charAt(0).toUpperCase() + text.slice(1);
              setName(formattedText);
            }}
            placeholder="Business Name"
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

          <View style={{alignItems: 'center', marginTop: hp(40)}}>
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(14),
                lineHeight: hp(20),
                fontFamily: fontFamily.poppins400,
              }}>
              By creating account, I Agree to Hapmeet
            </Text>

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
              // onPress={openPrivacyPolicy}
              >
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
              <TouchableOpacity
              // onPress={openTermAndCondition}
              >
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

          <View
            style={{
              width: '100%',
              height: hp(1),
              backgroundColor: '#E1E1E1',
              marginTop: hp(50),
            }}
          />

          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginTop: hp(70),
              alignItems: 'center',
            }}
            onPress={() => {
              navigation.navigate('VendorLoginScreen');
            }}>
            <Text
              style={{
                color: '#7148E4',
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
              }}>
              Vendor Login
            </Text>
            <View>
              <Image
                source={images.profileVectorLogo}
                style={{
                  width: hp(16),
                  height: hp(16),
                  marginLeft: wp(10),
                  tintColor: '#7148E4',
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Toast ref={ref => Toast.setRef(ref)} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default VendorSignUpScreen;
