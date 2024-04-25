import React, {useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {hp, isIOS} from '../../utils/helpers';
import TextInputWithIcons from '../../components/textInputWithIcons';
import CommonGradientButton from '../../components/commonGradientButton';
import Toast from 'react-native-toast-message';

const SetPasswordScreen = ({navigation}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const ShowToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Password Mismatch',
      text2: 'Passwords do not match.',
    });
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleIsConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handleRegister = () => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*()]{6,8}$/;

    if (!password.match(passwordRegex)) {
      Alert.alert(
        'Invalid Password',
        'Password must contain at least one capital letter, one special character, one number, and be 6 to 8 characters in length.',
      );
    } else if (password !== confirmPassword) {
      // Alert.alert('Password Mismatch', 'Passwords do not match.');
      ShowToast();
    } else {
      navigation.navigate('StartExploreScreen');
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

        <Text style={style.verificationTextStyle}>Set your password</Text>

        <Text style={style.verificationEmailTextStyle}>
          roh******tel@gmail.com
        </Text>

        <View style={{marginTop: 20, marginHorizontal: 52}}>
          <TextInputWithIcons
            IconNameDesign={icons.profileLogo}
            placeholder={'Enter Your Password'}
            editable={true}
            iconSources
            iconSource={icons.logLogo}
            iconSecures
            iconSecure={
              isPasswordVisible ? icons.show_Password_icon : icons.secureEyeLogo
            }
            secureTextEntry={!isPasswordVisible}
            iconStyle={style.iconStyle}
            containerStyle={{padding: 0, marginBottom: isIOS ? hp(20) : hp(0)}}
            onIconPress={togglePasswordVisibility}
            inputContainerStyle={{width: '100%'}}
            maxLength={8}
            handleInputChange={setPassword}
            inputValue={password}
          />

          <TextInputWithIcons
            IconNameDesign={icons.profileLogo}
            placeholder={'Confirm Your Password'}
            editable={true}
            iconSources
            iconSource={icons.logLogo}
            iconSecures
            iconSecure={
              isConfirmPasswordVisible
                ? icons.show_Password_icon
                : icons.secureEyeLogo
            }
            secureTextEntry={!isConfirmPasswordVisible}
            iconStyle={style.iconStyle}
            containerStyle={{padding: 0, marginBottom: hp(19)}}
            onIconPress={toggleIsConfirmPasswordVisibility}
            inputContainerStyle={{marginTop: 20, width: '100%'}}
            maxLength={8}
            handleInputChange={setConfirmPassword}
            inputValue={confirmPassword}
          />

          <View
            style={{
              alignItems: 'center',
            }}>
            <Text style={style.validationTextStyle}>
              Must be at least 6-8 characters in length and may
            </Text>
            <Text style={style.validationSecondTextStyle}>
              contain both numbers and letters
            </Text>
          </View>

          <CommonGradientButton
            buttonName={'Register Now'}
            containerStyle={{marginTop: hp(19), width: '100%'}}
            onPress={handleRegister}
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
        </View>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

export default SetPasswordScreen;
