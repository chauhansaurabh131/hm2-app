import React, {useRef, useState} from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
} from 'react-native';
import axios from 'axios';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import CommonGradientButton from '../../components/commonGradientButton';
import {verifyOTP} from '../../actions/authActions';

const ResetVerifyScreen = ({route}) => {
  const {email = ''} = route.params;
  const navigation = useNavigation();

  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef([]);

  const hiddenChars = email.substring(0, 3);
  const domain = email.substring(email.indexOf('@'));
  const maskedEmail = hiddenChars + '******' + domain;

  const handleOtpChange = (value, index) => {
    if (/^[0-9]$/.test(value)) {
      const otpCopy = [...otp];
      otpCopy[index] = value;
      setOtp(otpCopy);

      if (value && index < 3) {
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

  const onVerifyCodePress = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      Alert.alert('Invalid OTP', 'Please enter the 4-digit OTP.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        // 'https://happymilan.tech/api/v1/user/auth/verify-reset-otp',
        'https://stag.mntech.website/api/v1/user/auth/verify-reset-otp',
        {
          email,
          otp: enteredOtp,
        },
      );

      if (response.status === 200) {
        // Navigate to VerifySetPasswordScreen on successful verification
        navigation.navigate('VerifySetPasswordScreen', {email, otp});
      } else {
        Alert.alert(
          'Verification Failed',
          'The OTP you entered is incorrect. Please try again.',
        );
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert(
        'Error',
        'An error occurred while verifying the OTP. Please try again.',
      );
    } finally {
      setLoading(false);
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
            Verify Email
          </Text>

          <View style={{alignSelf: 'center', marginTop: hp(20)}}>
            <Text style={{color: colors.lightGray}}>
              OTP sent on
              <Text style={{color: colors.black}}> {maskedEmail}</Text>
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

          <View style={{alignSelf: 'center'}}>
            <Text style={{color: colors.lightGray}}>
              Resend in <Text style={{color: colors.black}}>48 Sec. </Text>
            </Text>
          </View>

          <CommonGradientButton
            buttonName={'Verify Code'}
            containerStyle={{width: '100%', marginTop: hp(70)}}
            onPress={onVerifyCodePress}
            loading={loading}
          />

          <View
            style={{
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

export default ResetVerifyScreen;
