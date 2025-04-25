import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {
  authOtpVerify,
  changeStack,
  login,
  resendOtp,
  verifyOTP,
} from '../../actions/authActions';
import axios from 'axios';
import {getAsyncStorageData} from '../../utils/global';
import {TOKEN} from '../../utils/constants';

const LoginAuthenticationCodeScreen = () => {
  const route = useRoute();
  const {email, password, otpType, otpEmail, otpMobileNumber} =
    route.params || {};

  // console.log(' === email ===> ', email);

  // console.log(' === route ===> ', otpType, otpEmail, otpMobileNumber);

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [seconds, setSeconds] = useState(120); // 120 seconds (2 minutes)
  const [timerActive, setTimerActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token; // Get the access token from Redux

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

  const failureCallback = () => {
    setIsLoading(false);
  };

  const onVerifyPress = () => {
    setIsLoading(true);
    dispatch(
      login(
        {email, password, twoFactorCode: otp.join('')},
        () => {
          dispatch(changeStack());
          setIsLoading(false);
          failureCallback();
        },
        () => {
          setIsLoading(false);
          failureCallback();
        },
      ),
    );
  };

  // Handle Resend Click
  const handleResend = async () => {
    try {
      if (!email) {
        console.error('Email is not available');
        return;
      }

      // Make the API request to resend OTP
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/2fa/resend-otp',
        {email}, // Send the email as JSON in the request body
        {
          headers: {
            'Content-Type': 'application/json', // Ensure correct content type
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

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{flex: 1}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={{flex: 1}}>
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
                  style={{marginTop: hp(29), marginRight: hp(20)}}
                  onPress={() => {
                    navigation.navigate('NewLogInScreen');
                  }}>
                  <Image
                    source={icons.back_arrow_icon}
                    style={{
                      width: hp(20),
                      height: hp(20),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>

              <Text
                style={{
                  fontSize: fontSize(24),
                  lineHeight: hp(32),
                  fontFamily: fontFamily.poppins500,
                  color: colors.black,
                  textAlign: 'center',
                  marginTop: hp(137),
                }}>
                Authentication Code
              </Text>

              <Text
                style={{
                  color: '#AEAEAE',
                  textAlign: 'center',
                  marginTop: hp(11),
                  fontSize: fontSize(14),
                  lineHeight: hp(18),
                  fontFamily: fontFamily.poppins400,
                }}>
                {otpType ? (
                  // If otpType exists, show the appropriate one
                  <>
                    Code sent on{' '}
                    <Text style={{color: colors.black}}>
                      {otpType === 'email' ? otpEmail : otpMobileNumber}
                    </Text>
                  </>
                ) : (
                  // If otpType doesn't exist, show the fallback message
                  <Text style={{color: colors.black}}>
                    Open your authentication app and enter code
                  </Text>
                )}
              </Text>

              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: hp(20),
                }}>
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

              <View>
                {timerActive ? (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: '#AEAEAE',
                      fontSize: fontSize(14),
                      lineHeight: hp(18),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Resend in{' '}
                    <Text style={{color: 'black'}}>{`${formatDisplay(
                      seconds,
                    )}`}</Text>
                  </Text>
                ) : (
                  <TouchableOpacity onPress={handleResend}>
                    <Text style={{textAlign: 'center', color: 'blue'}}>
                      Resend
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={{marginHorizontal: 22}}>
                <TouchableOpacity activeOpacity={0.7} onPress={onVerifyPress}>
                  <LinearGradient
                    colors={['#0F52BA', '#8225AF']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1.2}}
                    style={{
                      width: '100%',
                      height: hp(50),
                      borderRadius: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginTop: hp(75),
                    }}>
                    {isLoading ? (
                      <ActivityIndicator size="large" color={colors.white} />
                    ) : (
                      <Text
                        style={{
                          color: colors.white,
                          fontFamily: fontFamily.poppins400,
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                        }}>
                        Verify Code
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: wp(267),
                  borderWidth: 0.5,
                  borderColor: '#E1E1E1',
                  alignSelf: 'center',
                  marginTop: hp(50),
                }}
              />

              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignSelf: 'center',
                  marginBottom: Platform.OS === 'ios' ? hp(10) : hp(30),
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
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(330), // Adjust width to fit 6 input fields
    height: hp(150),
  },
  otpInput: {
    width: wp(40), // Adjust width for 6 inputs
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

export default LoginAuthenticationCodeScreen;
