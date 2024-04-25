import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {images} from '../../assets';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import CommonGradientButton from '../../components/commonGradientButton';
import {useRoute} from '@react-navigation/native';

const VerificationScreen = ({navigation}) => {
  const route = useRoute();
  const [otp, setOTP] = useState(['', '', '', '']);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const {name, email} = route.params;

  const hiddenChars = email.substring(0, 3);
  const domain = email.substring(email.indexOf('@'));
  const maskedEmail = hiddenChars + '******' + domain;

  // console.log(' === email ===> ', email);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer === 1) {
            clearInterval(interval);
            setIsTimerRunning(false); // Timer is not running anymore
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsTimerRunning(false); // Timer is not running anymore
    }
  }, [timer]);

  const handleResend = () => {
    // Reset timer and start again
    setTimer(60);
    setIsTimerRunning(true);
  };

  const handleOTPChange = (text, index) => {
    if (text.length <= 1) {
      const updatedOTP = [...otp];
      updatedOTP[index] = text;
      setOTP(updatedOTP);

      if (text.length === 1 && index < 3) {
        inputRefs.current[index + 1].focus();
      } else if (text.length === 0 && index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };
  return (
    <SafeAreaView style={style.container}>
      <Image
        source={images.happyMilanColorLogo}
        style={style.headerLogoStyle}
      />

      <View style={{flex: 1}}>
        <Text style={style.signUpTextStyle}>Sign Up</Text>

        <Text style={style.verificationTextStyle}>
          Please enter verification code
        </Text>

        <Text style={style.verificationEmailTextStyle}>
          {/*Verification code sent roh******tel@gmail.com*/}
          Verification code sent {maskedEmail}
        </Text>

        <View style={{marginHorizontal: wp(52)}}>
          <View style={style.OtpGeneratedContainer}>
            {otp.map((value, index) => (
              <TextInput
                key={index}
                ref={ref => (inputRefs.current[index] = ref)}
                style={{
                  borderColor: 'black',
                  borderRadius: 5,
                  fontSize: 20,
                  textAlign: 'center',
                  width: 50,
                }}
                onChangeText={text => handleOTPChange(text, index)}
                value={value}
                keyboardType="numeric"
                maxLength={1}
              />
            ))}
          </View>
          <View style={style.underLineContainer}>
            <View style={style.line} />
            <View style={style.line} />
            <View style={style.line} />
            <View style={style.line} />
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: hp(35),
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={style.resendTextStyle}>Resend ofter</Text>
              <Text
                style={{
                  color: colors.black,
                  fontFamily: fontFamily.poppins500,
                  textAlign: 'center',
                  fontSize: fontSize(12),
                  lineHeight: hp(18),
                }}>
                {' '}
                {timer === 0 ? 0 : timer} sec.
              </Text>
            </View>

            {isTimerRunning ? (
              <TouchableOpacity disabled={true}>
                <Text style={style.notNowTextStyle}>RESEND</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleResend}>
                <Text style={style.notNowTextStyle}>RESEND</Text>
              </TouchableOpacity>
            )}
          </View>

          <CommonGradientButton
            buttonName={'Verify Code'}
            containerStyle={{width: '100%', marginTop: hp(35)}}
            onPress={() => navigation.navigate('SetPasswordScreen')}
          />

          <View style={style.bottomUnderLineStyle} />

          <View style={style.memberLoginTextContainer}>
            <Text style={style.loginTextStyle}>Member Login</Text>
            <TouchableOpacity
            // onPress={() => {
            //   navigation.navigate('LoginScreen');
            // }}
            >
              <Image
                source={images.profileVectorLogo}
                style={style.profileVectorStyle}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VerificationScreen;
