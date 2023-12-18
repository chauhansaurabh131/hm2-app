import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {images} from '../../assets';
import {colors} from '../../utils/colors';
import GradientButton from '../../components/GradientButton';

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

      <Text style={style.resendTextStyle}>Resend ofter 57 s</Text>

      <TouchableOpacity>
        <Text style={style.notNowTextStyle}>NOT NOW</Text>
      </TouchableOpacity>

      <GradientButton
        buttonName={'Verify Code'}
        containerStyle={style.gradientButtonContainerStyle}
        buttonTextStyle={{color: colors.white}}
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
    </SafeAreaView>
  );
};

export default VerificationScreen;
