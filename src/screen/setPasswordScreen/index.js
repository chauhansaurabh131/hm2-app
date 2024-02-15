import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import TextInput from '../../components/TextInput';
import {colors} from '../../utils/colors';
import GradientButton from '../../components/GradientButton';
import {hp, isIOS} from '../../utils/helpers';
import TextInputWithIcons from '../../components/textInputWithIcons';
import CommonGradientButton from '../../components/commonGradientButton';

const SetPasswordScreen = ({navigation}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <SafeAreaView style={style.container}>
      <Image
        source={images.happyMilanColorLogo}
        style={style.headerLogoStyle}
      />

      <Text style={style.signUpTextStyle}>Sign Up</Text>

      <Text style={style.verificationTextStyle}>Set your password</Text>

      <Text style={style.verificationEmailTextStyle}>
        roh******tel@gmail.com
      </Text>

      <View
        style={{marginTop: 20, backgroundColor: 'red', marginHorizontal: 52}}>
        <TextInputWithIcons
          IconNameDesign={icons.profileLogo}
          placeholder={'Enter Your Password'}
          editable={true}
          iconSources
          iconSource={icons.logLogo}
          iconSecures
          iconSecure={icons.secureEyeLogo}
          secureTextEntry={!isPasswordVisible}
          iconStyle={style.iconStyle}
          containerStyle={{padding: 0, marginBottom: isIOS ? hp(20) : hp(0)}}
          onIconPress={togglePasswordVisibility}
          inputContainerStyle={{width: '100%'}}
        />

        {/*<TextInput*/}
        {/*  IconNameDesign={icons.profileLogo}*/}
        {/*  placeholder={'Enter Your Password'}*/}
        {/*  editable={true}*/}
        {/*  iconSources*/}
        {/*  iconSource={icons.logLogo}*/}
        {/*  iconSecures*/}
        {/*  iconSecure={icons.secureEyeLogo}*/}
        {/*  secureTextEntry={!isPasswordVisible}*/}
        {/*  iconStyle={style.iconStyle}*/}
        {/*  containerStyle={{padding: 0, marginBottom: isIOS ? hp(20) : hp(0)}}*/}
        {/*  onIconPress={togglePasswordVisibility}*/}
        {/*/>*/}

        <TextInputWithIcons
          IconNameDesign={icons.profileLogo}
          placeholder={'Confirm Your Password'}
          editable={true}
          iconSources
          iconSource={icons.logLogo}
          iconSecures
          iconSecure={icons.secureEyeLogo}
          // containerStyle={style.passwordTextInputContainerStyle}
          secureTextEntry={!isPasswordVisible}
          iconStyle={style.iconStyle}
          containerStyle={{padding: 0, marginBottom: hp(19)}}
          onIconPress={togglePasswordVisibility}
          inputContainerStyle={{marginTop: 20, width: '100%'}}
        />

        {/*<TextInput*/}
        {/*  IconNameDesign={icons.profileLogo}*/}
        {/*  placeholder={'Confirm Your Password'}*/}
        {/*  editable={true}*/}
        {/*  iconSources*/}
        {/*  iconSource={icons.logLogo}*/}
        {/*  iconSecures*/}
        {/*  iconSecure={icons.secureEyeLogo}*/}
        {/*  // containerStyle={style.passwordTextInputContainerStyle}*/}
        {/*  secureTextEntry={!isPasswordVisible}*/}
        {/*  iconStyle={style.iconStyle}*/}
        {/*  // containerStyle={{padding: 0, marginBottom: hp(19)}}`*/}
        {/*  onIconPress={togglePasswordVisibility}*/}
        {/*  containerStyle={{marginTop: 17}}*/}
        {/*/>*/}

        <View
          style={{
            alignItems: 'center',
            // width: '100%',
            backgroundColor: 'silver',
          }}>
          <Text style={style.validationTextStyle}>
            Must be at least 6-8 characters in length and may
          </Text>
          <Text style={style.validationSecondTextStyle}>
            contain both numbers and letters
          </Text>
        </View>

        {/*<GradientButton*/}
        {/*  buttonName={'Register Now'}*/}
        {/*  containerStyle={{marginTop: hp(19)}}*/}
        {/*  buttonTextStyle={{color: colors.white}}*/}
        {/*  onPress={() => navigation.navigate('StartExploreScreen')}*/}
        {/*/>*/}

        <CommonGradientButton
          buttonName={'Register Now'}
          containerStyle={{marginTop: hp(19), width: '100%'}}
          onPress={() => navigation.navigate('StartExploreScreen')}
        />
      </View>

      <View style={style.bottomUnderLineStyle} />

      <View style={style.memberLoginTextContainer}>
        <Text style={style.loginTextStyle}>Member Login</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('RegistrationScreen');
          }}>
          <Image
            source={images.profileVectorLogo}
            style={style.profileVectorStyle}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SetPasswordScreen;
