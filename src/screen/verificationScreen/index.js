import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {images} from '../../assets';
import {colors} from '../../utils/colors';
import GradientButton from '../../components/GradientButton';
import {hp, wp} from '../../utils/helpers';
import CommonGradientButton from '../../components/commonGradientButton';

const VerificationScreen = ({navigation}) => {
  return (
    <SafeAreaView style={style.container}>
      <Image
        source={images.happyMilanColorLogo}
        style={style.headerLogoStyle}
      />

      <Text style={style.signUpTextStyle}>Sign Up</Text>

      <Text style={style.verificationTextStyle}>
        Please enter verification code
      </Text>

      <Text style={style.verificationEmailTextStyle}>
        Verification code sent roh******tel@gmail.com
      </Text>

      <View style={{marginHorizontal: wp(52), backgroundColor: 'lightgreen'}}>
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
          <Text style={style.resendTextStyle}>Resend ofter 57 s</Text>

          <TouchableOpacity>
            <Text style={style.notNowTextStyle}>Resend</Text>
          </TouchableOpacity>
        </View>

        {/*<GradientButton*/}
        {/*  buttonName={'Verify Code'}*/}
        {/*  containerStyle={{width: wp(280), marginTop: hp(35)}}*/}
        {/*  buttonTextStyle={{color: colors.white}}*/}
        {/*  onPress={() => navigation.navigate('SetPasswordScreen')}*/}
        {/*/>*/}

        <CommonGradientButton
          buttonName={'Verify Code'}
          containerStyle={{width: '100%', marginTop: hp(35)}}
          onPress={() => navigation.navigate('SetPasswordScreen')}
        />
      </View>

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
    </SafeAreaView>
  );
};

export default VerificationScreen;
