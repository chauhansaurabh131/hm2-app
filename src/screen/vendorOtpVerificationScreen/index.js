import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import CommonGradientButton from '../../components/commonGradientButton';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {BASE_URL} from '../../utils/constants';
import {useDispatch, useSelector} from 'react-redux';
import {verifyOTP} from '../../actions/authActions';

const VendorOtpVerificationScreen = ({route}) => {
  const {email = ''} = route.params;
  const navigation = useNavigation();

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [resendAvailable, setResendAvailable] = useState(false);

  const {loading} = useSelector(state => state.auth);

  const dispatch = useDispatch();

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

  const resendOtpEmail = async () => {
    Keyboard.dismiss();
    const isMobile = /^[0-9]{10}$/.test(email); // Basic mobile number check

    try {
      if (isMobile) {
        // Mobile OTP API
        const response = await axios.post(
          'https://stag.mntech.website/api/v1/user/auth/send-verify-otp-email',
          {
            countryCodeId: '6957bb1536f15415201f50e2', // replace with actual ID if required
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
          `${BASE_URL}/api/v1/user/auth/send-verify-otp-email`,
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

  const onVerifyCodePress = () => {
    Keyboard.dismiss();

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
        navigation.navigate('VendorSetPasswordScreen');
      }),
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
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
          Verify Email
        </Text>

        <View style={{alignItems: 'center', marginTop: hp(20)}}>
          <Text
            style={{
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
              color: '#AEAEAE',
            }}>
            OTP sent on{' '}
            <Text style={{color: colors.pureBlack}}>{maskedValue}</Text>
          </Text>
        </View>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: hp(20),
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: wp(330),
              height: hp(150),
            }}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                value={digit}
                onChangeText={value => handleOtpChange(value, index)}
                keyboardType="numeric"
                maxLength={1}
                secureTextEntry={false}
                style={[
                  {
                    width: wp(60),
                    height: hp(50),
                    textAlign: 'center',
                    fontSize: fontSize(24),
                    borderBottomWidth: 1,
                    borderBottomColor: '#D9D9D9',
                    fontWeight: 'bold',
                  },
                  digit
                    ? {borderBottomColor: colors.black}
                    : {borderBottomColor: '#D9D9D9'},
                  digit ? {color: colors.black} : {color: '#D9D9D9'},
                ]}
                ref={ref => (inputRefs.current[index] = ref)}
                placeholder="0"
                placeholderTextColor="#D9D9D9"
              />
            ))}
          </View>
        </View>

        <View style={{alignSelf: 'center', marginTop: hp(15)}}>
          {resendAvailable ? (
            <TouchableOpacity
              onPress={() => {
                setTimer(120);
                setResendAvailable(false);
                // You can also trigger resend OTP API here
                resendOtpEmail();
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins400,
                }}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                color: '#A3A3A3',
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
              }}>
              Resend in{' '}
              <Text style={{color: colors.black}}>{formatTime(timer)} Min</Text>
            </Text>
          )}
        </View>

        <View style={{marginTop: hp(50), marginHorizontal: wp(30)}}>
          <TouchableOpacity
            disabled={loading}
            onPress={onVerifyCodePress}
            style={{
              width: '100%',
              height: hp(50),
              backgroundColor: loading ? '#B8A5F5' : '#7148E4',
              borderRadius: hp(50),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {loading ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins400,
                }}>
                Verify Code
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default VendorOtpVerificationScreen;
