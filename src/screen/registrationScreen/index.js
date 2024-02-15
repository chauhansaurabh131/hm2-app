import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {colors} from '../../utils/colors';
import GradientButton from '../../components/GradientButton';
import {hp, wp} from '../../utils/helpers';
import TextInput from '../../components/TextInput';
import TextInputWithIcons from '../../components/textInputWithIcons';
import LinearGradient from 'react-native-linear-gradient';
import CommonGradientButton from '../../components/commonGradientButton';

const RegistrationScreen = ({navigation}) => {
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

      <View
        style={{
          marginTop: hp(64),
          backgroundColor: 'red',
          marginHorizontal: 52,
        }}>
        <TextInputWithIcons
          iconSources={true}
          iconSource={icons.profileLogo}
          placeholder={'Enter Your name'}
          textInputStyle={{marginLeft: 10}}
          inputContainerStyle={{width: '100%'}}
        />

        <TextInputWithIcons
          IconNameDesign={icons.profileLogo}
          placeholder={'Enter Your Email'}
          editable={true}
          iconSources
          iconSource={icons.mailLogo}
          iconSecures
          iconSecure={icons.secureEyeLogo}
          containerStyle={style.textInputContainerStyle}
          secureTextEntry={isPasswordVisible}
          onIconPress={togglePasswordVisibility}
          iconStyle={style.iconStyle}
          textInputStyle={{marginLeft: 10}}
          inputContainerStyle={{marginTop: 20, width: '100%'}}
        />

        {/*<TouchableOpacity>*/}
        {/*  <LinearGradient*/}
        {/*    colors={['#0D4EB3', '#9413D0']}*/}
        {/*    start={{x: 0, y: 0}}*/}
        {/*    end={{x: 1, y: 0}}*/}
        {/*    style={{*/}
        {/*      width: '100%',*/}
        {/*      height: hp(50),*/}
        {/*      borderRadius: 10,*/}
        {/*      marginTop: hp(20),*/}
        {/*    }}>*/}
        {/*    <Text>asjb</Text>*/}
        {/*  </LinearGradient>*/}
        {/*</TouchableOpacity>*/}

        <CommonGradientButton
          buttonName={'Send Code'}
          containerStyle={{width: '100%', marginTop: hp(20)}}
          onPress={() => navigation.navigate('VerificationScreen')}
        />

        {/*<TextInput*/}
        {/*  IconNameDesign={icons.profileLogo}*/}
        {/*  placeholder={'Enter Your Name'}*/}
        {/*  editable={true}*/}
        {/*  iconSources*/}
        {/*  iconSource={icons.profileLogo}*/}
        {/*  textInputStyle={{marginLeft: 10}}*/}
        {/*  containerStyle={{padding: 0, marginBottom: 20}}*/}
        {/*/>*/}

        {/*<TextInput*/}
        {/*  IconNameDesign={icons.profileLogo}*/}
        {/*  placeholder={'Enter Your Email'}*/}
        {/*  editable={true}*/}
        {/*  iconSources*/}
        {/*  iconSource={icons.mailLogo}*/}
        {/*  iconSecures*/}
        {/*  iconSecure={icons.secureEyeLogo}*/}
        {/*  containerStyle={style.textInputContainerStyle}*/}
        {/*  secureTextEntry={isPasswordVisible}*/}
        {/*  onIconPress={togglePasswordVisibility}*/}
        {/*  iconStyle={style.iconStyle}*/}
        {/*  textInputStyle={{marginLeft: 10}}*/}
        {/*/>*/}

        {/*<GradientButton*/}
        {/*  buttonName={'Send Code'}*/}
        {/*  containerStyle={style.gradientButtonContainerStyle}*/}
        {/*  buttonTextStyle={{color: colors.white}}*/}
        {/*  onPress={() => navigation.navigate('VerificationScreen')}*/}
        {/*/>*/}
      </View>

      <Text style={style.continueWithTextStyle}>or continue with</Text>

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

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('NumberRegistrationScreen');
          }}>
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

      <View style={style.memberLoginTextContainer}>
        <Text style={style.loginTextStyle}>Member Login</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('LoginScreen');
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

export default RegistrationScreen;
