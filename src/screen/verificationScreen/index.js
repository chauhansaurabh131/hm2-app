import React, {useEffect, useRef, useState, useContext} from 'react';
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
import {useDispatch, useSelector} from 'react-redux';
import {apiKeys} from '../../config/apikeys';
import {Login, VerifyOtp} from '../../store/actions/allActions';
import useDelayedNavigation from '../../utils/delayFunction';
import {MyContext} from '../../utils/Provider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {globalUse} from '../../utils/constants';
import {verifyOTP} from '../../actions/authActions';

const VerificationScreen = ({navigation, route}) => {
  const {email = ''} = route.params;

  // console.log(' === var ===> ', email);

  const [otp, setOTP] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const {otpVerifiedDetails} = useSelector(state => state.auth);

  const loading = false;
  const updatedEmail = '';

  const hiddenChars = email.substring(0, 3);
  const domain = email.substring(email.indexOf('@'));
  const maskedEmail = hiddenChars + '******' + domain;

  const dispatch = useDispatch();

  const navigationFunction = async () => {
    // setAccessToken(otpVerifiedDetails[0]?.tokens.access.token);
    await AsyncStorage.setItem(
      globalUse.ACCESSTOKEN,
      otpVerifiedDetails[0]?.tokens.access.token,
    );
    navigation.navigate('SetPasswordScreen');
  };

  const handleResend = () => {
    setTimer(60);
    setIsTimerRunning(true);
  };

  const handleOTPChange = (text, index) => {
    const updatedOTP = [...otp]; // Create a copy of current state
    updatedOTP[index] = text; // Update the value at the specified index
    setOTP(updatedOTP); // Update the state with the new OTP array
  };

  const onVerifyCodePress = () => {
    dispatch(
      verifyOTP({email, otp: otp.join('')}, () =>
        navigation.navigate('SetPasswordScreen'),
      ),
    );
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
          {/*Verification code sent {updatedEmail}*/}
          Verification code sent {maskedEmail}
        </Text>

        <View style={{marginHorizontal: wp(52)}}>
          <View style={style.OtpGeneratedContainer}>
            {/*{otp?.map((value, index) => (*/}
            {/*<TextInput*/}
            {/*  // key={index}*/}
            {/*  // ref={ref => (inputRefs.current[index] = ref)}*/}
            {/*  style={{*/}
            {/*    borderColor: 'black',*/}
            {/*    borderRadius: 5,*/}
            {/*    fontSize: 20,*/}
            {/*    textAlign: 'center',*/}
            {/*    width: 50,*/}
            {/*  }}*/}
            {/*  onChangeText={handleOTPChange}*/}
            {/*  value={otp}*/}
            {/*  keyboardType="numeric"*/}
            {/*  maxLength={1}*/}
            {/*/>*/}
            {/*))}*/}

            {otp?.map((value, index) => (
              <TextInput
                key={index}
                style={{
                  borderColor: 'black',
                  borderRadius: 5,
                  fontSize: 20,
                  textAlign: 'center',
                  width: 50,
                  color: colors.black,
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
            // onPress={() => navigation.navigate('SetPasswordScreen')}
            onPress={onVerifyCodePress}
            loading={loading}
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
