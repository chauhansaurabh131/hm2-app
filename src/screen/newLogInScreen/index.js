import React, {useState} from 'react';
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
import {changeStack, login} from '../../actions/authActions';
import {useDispatch, useSelector} from 'react-redux';
import CommonGradientButton from '../../components/commonGradientButton';
import Toast from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';

const NewLogInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {loading} = useSelector(state => state.auth);

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
    });
  };

  const onPressLogin = () => {
    Keyboard.dismiss();
    const trimmedEmail = email.trim();
    // dispatch(login({email, password}, () => dispatch(changeStack())));

    // Check if the email or mobile number is valid
    const isEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
      trimmedEmail,
    );
    let loginPayload = {};

    if (isEmail) {
      console.log('Logging in with Email:', trimmedEmail);
      loginPayload = {email: trimmedEmail, password};
    } else {
      // Handle mobile number, ensuring it is 10 digits and no '+' sign
      const mobileNumber = trimmedEmail.replace(/\D/g, ''); // Removes all non-digit characters
      const isMobile = mobileNumber.length === 10;

      if (isMobile) {
        console.log('Logging in with Mobile Number:', mobileNumber);
        loginPayload = {
          countryCodeId: '67d2698641c89038f51512a2', // You can dynamically handle this based on user's region
          mobileNumber: mobileNumber, // Only 10 digits will be passed
          password,
        };
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid Mobile Number',
          text2: 'Please enter a valid 10-digit mobile number',
        });
        console.log('Invalid Mobile Number');
        return; // Return early if number is not valid
      }
    }

    // dispatch(login({email, password}, successCallback, failureCallback));
    // dispatch(
    //   login({
    //     ...loginPayload,
    //     successCallback,
    //     failureCallback,
    //   }),
    // );
    dispatch(login({...loginPayload}, successCallback, failureCallback));
    setEmail('');
    setPassword('');
  };

  // const onPressLogin = () => {
  //   Keyboard.dismiss();
  //   // dispatch(login({email, password}, () => dispatch(changeStack())));
  //   dispatch(login({email, password}, successCallback, failureCallback));
  //   setEmail('');
  //   setPassword('');
  // };

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
              fontFamily: fontFamily.poppins500,
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
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
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
              }}>
              <Text
                style={{
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
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
                onPress={() => {
                  console.log(' === Goggle Logo ===> ');
                }}
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

              <TouchableOpacity
                style={{
                  width: hp(44),
                  height: hp(44),
                  borderRadius: hp(50),
                  borderColor: '#D4D4D4',
                  borderWidth: 1,
                  marginRight: wp(20),
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: wp(24),
                }}>
                <Image
                  source={icons.facebookLogo}
                  style={{
                    height: hp(17.6),
                    width: hp(17.6),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
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

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginBottom: isIOS ? hp(10) : hp(30),
                marginTop: hp(58),

                alignItems: 'center',
              }}
              onPress={() => {
                navigation.navigate('NewSignUpScreen');
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  fontFamily: fontFamily.poppins400,
                }}>
                New Member?{' '}
              </Text>
              <View>
                <Text
                  style={{
                    color: colors.blue,
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Sign Up
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/*<Toast ref={ref => Toast.setRef(ref)} />*/}
        <Toast />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default NewLogInScreen;
