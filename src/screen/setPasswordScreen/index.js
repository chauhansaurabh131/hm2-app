import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import TextInput from '../../components/TextInput';
import {colors} from '../../utils/colors';
import GradientButton from '../../components/GradientButton';

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

      <TextInput
        IconNameDesign={icons.profileLogo}
        placeholder={'Enter Your Password'}
        editable={true}
        iconSources
        iconSource={icons.logLogo}
        iconSecures
        iconSecure={icons.secureEyeLogo}
        containerStyle={style.textInputContainerStyle}
        secureTextEntry={!isPasswordVisible}
        onIconPress={togglePasswordVisibility}
      />

      <Text style={style.validationTextStyle}>
        Must be at least 6-8 characters in length and may contain both
      </Text>
      <Text style={style.validationSecondTextStyle}>numbers and letters</Text>

      <TextInput
        IconNameDesign={icons.profileLogo}
        placeholder={'Confirm Your Password'}
        editable={true}
        iconSources
        iconSource={icons.logLogo}
        iconSecures
        iconSecure={icons.secureEyeLogo}
        containerStyle={style.passwordTextInputContainerStyle}
        secureTextEntry={!isPasswordVisible}
        onIconPress={togglePasswordVisibility}
      />

      <GradientButton
        buttonName={'Send Code'}
        containerStyle={style.gradientButtonContainerStyle}
        buttonTextStyle={{color: colors.white}}
        // onPress={() => navigation.navigate('RegistrationScreen')}
      />

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
