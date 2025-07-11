import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  TextInput,
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../utils/colors';
import {hp, wp, fontSize, fontFamily, isIOS} from '../../utils/helpers';
import {icons, images} from '../../assets';
import CommonGradientButton from '../../components/commonGradientButton';
import {verifyOTP} from '../../actions/authActions';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const VerifyEmailOtpScreen = ({route}) => {
  const {email = ''} = route.params;

  // console.log(' === email ===> ', email);

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const [timer, setTimer] = useState(120); // 2 minutes
  const [resendAvailable, setResendAvailable] = useState(false);

  const {otpVerifiedDetails, loading} = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setResendAvailable(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = seconds => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const getMaskedValue = (input = '') => {
    const isMobile = /^[0-9]{10}$/.test(input);

    if (isMobile) {
      // Mask first 8 digits, show last 2
      return '********' + input.slice(-2);
    } else if (input.includes('@')) {
      // Mask part of the email
      const atIndex = input.indexOf('@');
      const namePart = input.slice(0, atIndex);
      const domainPart = input.slice(atIndex);

      const visibleChars = namePart.slice(0, 3);
      return visibleChars + '******' + domainPart;
    } else {
      // In case input is something unexpected
      return input;
    }
  };

  const maskedValue = getMaskedValue(email);

  const handleOtpChange = (value, index) => {
    // Ensure that only numeric values are accepted
    if (/^[0-9]$/.test(value)) {
      const otpCopy = [...otp];
      otpCopy[index] = value;
      setOtp(otpCopy);

      // Automatically focus on the next input field
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === '') {
      // Handle backspace to clear the value
      const otpCopy = [...otp];
      otpCopy[index] = '';
      setOtp(otpCopy);

      // Automatically go back to the previous input if the current one is empty
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  // const onVerifyCodePress = () => {
  //   const enteredOtp = otp.join('');
  //   console.log('Entered OTP:', enteredOtp);
  //   dispatch(
  //     verifyOTP({email, otp: otp.join('')}, () =>
  //       navigation.navigate('NewSetPasswordScreen'),
  //     ),
  //   );
  // };

  const onVerifyCodePress = () => {
    const enteredOtp = otp.join('');
    console.log('Entered OTP:', enteredOtp);
    console.log('Email or Mobile:', email);

    // Check if it's a 10-digit number (i.e., mobile number)
    const isMobile = /^[0-9]{10}$/.test(email);

    const payload = {
      otp: enteredOtp,
      ...(isMobile ? {mobileNumber: email} : {email: email}),
    };

    dispatch(
      verifyOTP(payload, () => {
        navigation.navigate('NewSetPasswordScreen');
      }),
    );
  };

  const resendOtpEmail = async () => {
    const isMobile = /^[0-9]{10}$/.test(email); // Basic mobile number check

    try {
      if (isMobile) {
        // Mobile OTP API
        const response = await axios.post(
          'https://stag.mntech.website/api/v1/user/auth/send-verify-otp-email',
          {
            countryCodeId: '68709f07e33fd998c7105ad5', // replace with actual ID if required
            mobileNumber: email,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('Resend Mobile OTP success:', response.data);
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'A new OTP has been sent to your mobile number',
        });
      } else {
        // Email OTP API
        const response = await axios.post(
          'https://stag.mntech.website/api/v1/user/auth/send-verify-otp-email',
          {
            email: email,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('Resend Email OTP success:', response.data);
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'A new OTP has been sent to your email',
        });
      }
    } catch (error) {
      console.error('Resend OTP error:', error.response?.data || error.message);
      Toast.show({
        type: 'error',
        text1: 'Failed to resend OTP',
        text2: error.response?.data?.message || 'Please try again later',
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
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

          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={icons.back_arrow_icon}
              style={{
                width: hp(20),
                height: hp(20),
                marginTop: hp(29),
                marginRight: wp(20),
                tintColor: colors.lightGray,
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flex: 1,
            marginHorizontal: wp(30),
          }}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(24),
              lineHeight: hp(36),
              fontFamily: fontFamily.poppins500,
              alignSelf: 'center',
              marginTop: hp(80),
            }}>
            {/*Verify Email*/}
            {/^[0-9]{10}$/.test(email)
              ? 'Verify Mobile Number'
              : 'Verify Email'}
          </Text>

          <View style={{alignSelf: 'center', marginTop: hp(20)}}>
            <Text style={{color: colors.lightGray}}>
              OTP sent on
              <Text style={{color: colors.black}}> {maskedValue}</Text>
            </Text>
          </View>

          <View style={styles.container}>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  value={digit}
                  onChangeText={value => handleOtpChange(value, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  secureTextEntry={false}
                  style={[
                    styles.otpInput,
                    digit ? styles.activeInput : styles.inactiveInput,
                    digit ? styles.digitStyle : styles.placeholderStyle,
                  ]}
                  ref={ref => (inputRefs.current[index] = ref)}
                  placeholder="0"
                  placeholderTextColor="#D9D9D9"
                />
              ))}
            </View>
          </View>

          {/*<View style={{alignSelf: 'center'}}>*/}
          {/*  <Text style={{color: colors.lightGray}}>*/}
          {/*    Resend in <Text style={{color: colors.black}}>48 Sec. </Text>*/}
          {/*  </Text>*/}
          {/*</View>*/}

          <View style={{alignSelf: 'center', marginTop: hp(20)}}>
            {resendAvailable ? (
              <TouchableOpacity
                onPress={() => {
                  setTimer(120);
                  setResendAvailable(false);
                  // You can also trigger resend OTP API here
                  resendOtpEmail();
                }}>
                <Text style={{color: colors.black, fontWeight: 'bold'}}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{color: colors.lightGray}}>
                Resend in{' '}
                <Text style={{color: colors.black}}>
                  {formatTime(timer)} Min
                </Text>
              </Text>
            )}
          </View>

          <CommonGradientButton
            buttonName={'Verify Code'}
            containerStyle={{width: '100%', marginTop: hp(70)}}
            onPress={onVerifyCodePress}
            loading={loading}
          />

          <View
            style={{
              // position: 'absolute',
              // bottom: 0,
              // alignSelf: 'center',
              marginTop: hp(90),
              alignSelf: 'center',
            }}>
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
              <Text style={{color: colors.black}}>Member Login</Text>
              <View>
                <Image
                  source={images.profileVectorLogo}
                  style={{
                    width: hp(16),
                    height: hp(16),
                    marginLeft: wp(10),
                    tintColor: colors.black,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(20),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(330),
    height: hp(150),
  },
  otpInput: {
    width: wp(60),
    height: hp(50),
    textAlign: 'center',
    fontSize: fontSize(24),
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    fontWeight: 'bold',
  },
  activeInput: {
    borderBottomColor: colors.black,
  },
  inactiveInput: {
    borderBottomColor: '#D9D9D9',
  },
  digitStyle: {
    color: colors.black,
  },
  placeholderStyle: {
    color: '#D9D9D9',
  },
});

export default VerifyEmailOtpScreen;
