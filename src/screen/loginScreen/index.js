import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import TextInput from '../../components/TextInput';
import {colors} from '../../utils/colors';
import GradientButton from '../../components/GradientButton';

const LoginScreen = ({navigation}) => {
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

      <View style={style.headingContainer}>
        <Text style={style.headingTextStyle}>Welcome back</Text>
        <Text style={style.headingTextStyle}>to Happy Milan</Text>
      </View>

      <TextInput
        IconNameDesign={icons.profileLogo}
        placeholder={'Enter Your Email'}
        editable={true}
        iconSource={icons.profileLogo}
        textInputStyle={style.textInputStyle}
        containerStyle={style.containerStyle}
      />

      <TextInput
        IconNameDesign={icons.profileLogo}
        placeholder={'Enter Password'}
        editable={true}
        iconSource={icons.mailLogo}
        iconSecures
        iconSecure={icons.secureEyeLogo}
        secureTextEntry={!isPasswordVisible}
        // placeHolderTextInputStyle={{color: colors.red}}
        textInputStyle={{textAlign: 'center', marginLeft: 20}}
        onIconPress={togglePasswordVisibility}
        containerStyle={style.passwordContainerStyle}
      />

      <GradientButton
        buttonName={'Login'}
        containerStyle={style.gradientContainerStyle}
        buttonTextStyle={{color: colors.white}}
        // onPress={() => navigation.navigate('RegistrationScreen')}
      />

      <Text style={style.orLoginTextStyle}>or login with</Text>

      <View style={style.socialMediaLogoContainer}>
        <TouchableOpacity>
          <View style={style.socialMediaCircleStyle}>
            <Image source={icons.googleLogo} style={style.logoStyle} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={style.socialMediaLogoContainers}>
            <Image source={icons.facebookLogo} style={style.logoStyle} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={style.socialMediaCircleStyle}>
            <Image source={icons.phoneLogo} style={style.logoStyle} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={style.privacyPolicyTextContainer}>
        <Text style={style.privacyPolicyTextStyle}>
          By creating account, I Agee to Happy Milan{' '}
        </Text>

        <TouchableOpacity>
          <Text style={style.privacyPolicyHighLightTextStyle}>Privacy</Text>
        </TouchableOpacity>
      </View>

      <View style={style.privacyPolicyTextContainer}>
        <TouchableOpacity>
          <Text style={style.privacyPolicyHighLightTextStyle}>Policy </Text>
        </TouchableOpacity>
        <Text style={style.privacyPolicyTextStyle}>and </Text>
        <TouchableOpacity>
          <Text style={style.privacyPolicyHighLightTextStyle}>T&C</Text>
        </TouchableOpacity>
      </View>

      <View style={style.bottomUnderLineStyle} />

      <View style={style.bottomTextContainer}>
        <Text style={style.bottomTextStyle}>New Member? </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('RegistrationScreen')}>
          <Text style={style.signUpTextStyle}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
