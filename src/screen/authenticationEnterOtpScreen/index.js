import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import style from './style';
import {icons, images} from '../../assets';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import {useSelector} from 'react-redux';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Toast from 'react-native-toast-message'; // Import axios

const AuthenticationEnterOtpScreen = () => {
  const route = useRoute();
  const {email, mobileNumber} = route.params;

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false); // Add loading state
  const [seconds, setSeconds] = useState(120); // 120 seconds (2 minutes)
  const [timerActive, setTimerActive] = useState(true);

  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;
  const accessToken = user?.tokens?.access?.token; // Get the access token from Redux

  const navigation = useNavigation();
  const inputRefs = useRef([]);

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  // Start the timer when the component mounts
  useEffect(() => {
    let interval;

    if (timerActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000); // Decrease by 1 second every second
    } else if (seconds === 0) {
      setTimerActive(false); // Stop the timer when it reaches 0
    }

    // Clear the interval when the component is unmounted or timer is inactive
    return () => clearInterval(interval);
  }, [timerActive, seconds]);

  // Format the display based on time remaining
  const formatDisplay = seconds => {
    if (seconds >= 60) {
      // If more than 60 seconds, display MM:SS Min
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${String(remainingSeconds).padStart(2, '0')} Min`;
    } else {
      // If less than 60 seconds, display SS Sec
      return `${String(seconds).padStart(2, '0')} Sec`;
    }
  };

  // Function to mask email
  const maskEmail = email => {
    if (!email) {
      return '';
    }
    const [username, domain] = email.split('@');
    const maskedUsername = username.slice(0, 3) + '******'; // Mask the middle part of the username
    return `${maskedUsername}@${domain}`;
  };

  // Function to mask mobile number
  const maskMobileNumber = mobileNumber => {
    if (!mobileNumber) {
      return '';
    }
    const mobileStr = mobileNumber?.toString();

    // Check if mobileNumber is a valid string and contains exactly 10 digits
    if (!/^\d{10}$/.test(mobileStr)) {
      console.log('Invalid mobile number format'); // Debugging: Log if mobile number is invalid
      return ''; // Return empty string if it's not a valid number
    }

    const prefix = mobileStr.slice(0, 3); // First 3 digits (country code)
    const last = mobileStr.slice(-2); // Last 2 digits
    const masked = mobileStr.slice(3, -2).replace(/\d/g, '*'); // Mask all middle digits with '*'
    return `${prefix}${masked}${last}`; // Return formatted masked mobile number
  };

  const handleOtpChange = (value, index) => {
    if (/^[0-9]$/.test(value)) {
      const otpCopy = [...otp];
      otpCopy[index] = value;
      setOtp(otpCopy);
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === '') {
      const otpCopy = [...otp];
      otpCopy[index] = '';
      setOtp(otpCopy);
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleConfirmPress = async () => {
    Keyboard.dismiss();
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      console.log('Please enter the complete OTP');
      return;
    }

    setLoading(true); // Show loading indicator

    try {
      // Replace with the actual API URL
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/2fa/verify',
        {
          token: otpCode, // Pass the OTP as token in the request body
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.tokens?.access?.token}`, // Use the user's access token
          },
        },
      );

      if (response.status === 200) {
        console.log('OTP verified successfully:', response.data);
        // Navigate to the next screen after successful OTP verification

        navigation.navigate('TwoFactorAuthenticationScreen'); // Replace with your actual next screen
      } else {
        console.error('OTP verification failed:', response.data);
      }
    } catch (error) {
      console.error('Error verifying OTP:', error.response?.data?.message);
      Toast.show({
        type: 'error',
        // position: 'bottom',
        text1: 'OTP Verification Failed',
        text2:
          error.response?.data?.message ||
          'An error occurred. Please try again.',
        visibilityTime: 4000,
        autoHide: true,
      });
    } finally {
      setLoading(false); // Hide loading indicator
      setOtp(['', '', '', '', '', '']);
    }
  };

  // Handle Resend Click
  const handleResend = async () => {
    try {
      // Make the API request to send OTP
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/2fa/send-otp',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Use the access token from Redux store
          },
        },
      );
      if (response.status === 200) {
        console.log('OTP resend successful:', response.data);
        // Reset the timer and start again
        setSeconds(120); // Reset the timer to 2 minutes
        setTimerActive(true); // Start the timer again
      } else {
        console.error('Failed to resend OTP:', response.data);
      }
    } catch (error) {
      console.error('Error resending OTP:', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={style.container}>
        <View style={style.headerContainerView}>
          <View style={style.headerContainerStyle}>
            <Image
              source={images.happyMilanColorLogo}
              style={style.customerHeaderImage}
            />
            <TouchableOpacity onPress={openBottomSheet}>
              <Image
                source={userImage ? {uri: userImage} : images.empty_male_Image}
                style={style.profileImageStyle}
              />
            </TouchableOpacity>
          </View>

          <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

          <View style={style.headingTittleContainer}>
            <Text style={style.headingCredentialsText}>Enter OTP</Text>
          </View>
        </View>

        <View style={style.underLineHeaderStyle} />

        <Text
          style={{
            marginTop: hp(19),
            textAlign: 'center',
            color: '#AEAEAE',
            fontSize: fontSize(14),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins400,
          }}>
          OTP sent on{' '}
          <Text style={{color: colors.black}}>
            {email ? maskEmail(email) : maskMobileNumber(mobileNumber)}
          </Text>
        </Text>

        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View style={style.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                value={digit}
                onChangeText={value => handleOtpChange(value, index)}
                keyboardType="numeric"
                maxLength={1}
                secureTextEntry={false}
                style={[
                  style.otpInput,
                  digit ? style.activeInput : style.inactiveInput,
                  digit ? style.digitStyle : style.placeholderStyle,
                ]}
                ref={ref => (inputRefs.current[index] = ref)}
                placeholder="0"
                placeholderTextColor="#D9D9D9"
              />
            ))}
          </View>
        </View>

        <View>
          {timerActive ? (
            <Text style={{textAlign: 'center'}}>
              Resend in{' '}
              <Text style={{color: 'black'}}>{`${formatDisplay(
                seconds,
              )}`}</Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <Text style={{textAlign: 'center', color: 'blue'}}>Resend</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={{marginHorizontal: 18}}>
          <TouchableOpacity activeOpacity={0.7} onPress={handleConfirmPress}>
            <LinearGradient
              colors={['#0F52BA', '#8225AF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1.2}}
              style={{
                width: '100%',
                height: hp(44),
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: hp(30),
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: fontSize(14),
                  lineHeight: hp(18),
                  fontFamily: fontFamily.poppins400,
                }}>
                {loading ? 'Verifying OTP...' : 'Confirm'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Toast ref={ref => Toast.setRef(ref)} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default AuthenticationEnterOtpScreen;
