import React, {useState} from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {hp, wp} from '../../utils/helpers';
import TextInputWithIcons from '../../components/textInputWithIcons';
import CommonGradientButton from '../../components/commonGradientButton';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {register} from '../../actions/authActions';
import Toast from 'react-native-toast-message';
import NewTextInputComponent from '../../components/newTextInputComponent';

const RegistrationScreen = () => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {loading} = useSelector(state => state.auth);

  console.log(' === loading ===> ', loading);

  const handleSignUp = async () => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    if (isNameValid && isEmailValid) {
      dispatch(
        register({name, email}, () => {
          navigation.navigate('VerificationScreen', {name, email});
        }),
      );
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const validateName = () => {
    if (name.length < 3) {
      setNameError('Name must be at least 3 characters');
      return false;
    } else if (name.length > 15) {
      setNameError('Name must be less than 15 characters');
      return false;
    } else {
      setNameError('');
      return true;
    }
  };

  const validateEmail = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setEmailError('Invalid E-mail Address or Mobile Number');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={style.container}>
        <Image
          source={images.happyMilanColorLogo}
          style={style.headerLogoStyle}
        />

        <View style={{}}>
          <Text style={style.signUpTextStyle}>Sign Up</Text>

          <View
            style={{
              marginTop: hp(64),
              marginHorizontal: 40,
              // backgroundColor: 'orange',
            }}>
            {/*<TextInputWithIcons*/}
            {/*  iconSources={true}*/}
            {/*  iconSource={icons.profileLogo}*/}
            {/*  placeholder={'Enter Your name'}*/}
            {/*  textInputStyle={{marginLeft: 10}}*/}
            {/*  inputContainerStyle={{width: '100%'}}*/}
            {/*  inputValue={name}*/}
            {/*  handleInputChange={text => setName(text)}*/}
            {/*  maxLength={15}*/}
            {/*/>*/}

            <NewTextInputComponent
              value={name}
              onChangeText={text => setName(text)}
              placeholder="Enter Your Name"
              // style={{marginBottom: 20}}
              LeftIconName={icons.profileLogo}
            />

            {nameError ? (
              <Text style={{marginTop: 2, color: 'red'}}>{nameError}</Text>
            ) : null}

            {/*<TextInputWithIcons*/}
            {/*  IconNameDesign={icons.profileLogo}*/}
            {/*  placeholder={'Enter Your Email'}*/}
            {/*  editable={true}*/}
            {/*  iconSources*/}
            {/*  iconSource={icons.mailLogo}*/}
            {/*  iconSecure={icons.secureEyeLogo}*/}
            {/*  containerStyle={style.textInputContainerStyle}*/}
            {/*  secureTextEntry={isPasswordVisible}*/}
            {/*  onIconPress={togglePasswordVisibility}*/}
            {/*  iconStyle={style.iconStyle}*/}
            {/*  textInputStyle={{marginLeft: 10}}*/}
            {/*  inputContainerStyle={{marginTop: 20, width: '100%'}}*/}
            {/*  inputValue={email}*/}
            {/*  handleInputChange={text => setEmail(text)}*/}
            {/*/>*/}

            <NewTextInputComponent
              value={email}
              onChangeText={text => setEmail(text)}
              placeholder="Your Email or Mobile"
              style={{marginTop: 20}}
              LeftIconName={icons.profileLogo}
            />
            {emailError ? (
              <Text style={{color: 'red', marginTop: 2}}>{emailError}</Text>
            ) : null}

            <CommonGradientButton
              buttonName={'Send Code'}
              containerStyle={{width: '100%', marginTop: hp(20)}}
              onPress={handleSignUp}
              loading={loading}
            />

            <View style={[style.privacyPolicyTextContainer, {marginTop: 34}]}>
              <Text style={style.privacyPolicyTextStyle}>
                By creating account, I Agee to Happy Milan{' '}
              </Text>

              <TouchableOpacity>
                <Text style={style.privacyPolicyHighLightTextStyle}>
                  Privacy
                </Text>
              </TouchableOpacity>
            </View>

            <View style={style.privacyPolicyTextContainer}>
              <TouchableOpacity>
                <Text style={style.privacyPolicyHighLightTextStyle}>
                  Policy{' '}
                </Text>
              </TouchableOpacity>
              <Text style={style.privacyPolicyTextStyle}>and </Text>
              <TouchableOpacity>
                <Text style={style.privacyPolicyHighLightTextStyle}>T&C</Text>
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: wp(267),
                borderWidth: 0.5,
                borderColor: '#E1E1E1',
                alignSelf: 'center',
                marginTop: hp(33),
              }}
            />

            <View style={[style.socialMediaLogoContainer, {}]}>
              <Text style={style.continueWithTextStyle}>or continue with</Text>
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

              {/*<TouchableOpacity*/}
              {/*  onPress={() => {*/}
              {/*    navigation.navigate('NumberRegistrationScreen');*/}
              {/*  }}>*/}
              {/*  <View style={style.socialMediaCircleStyle}>*/}
              {/*    <Image source={icons.phoneLogo} style={style.logoStyle} />*/}
              {/*  </View>*/}
              {/*</TouchableOpacity>*/}
            </View>

            {/*<View style={style.bottomUnderLineStyle} />*/}
            <View
              style={{
                width: wp(267),
                borderWidth: 0.5,
                borderColor: '#E1E1E1',
                alignSelf: 'center',
                // marginTop: hp(33),
              }}
            />

            <TouchableOpacity
              style={style.memberLoginTextContainer}
              onPress={() => {
                navigation.navigate('LoginScreen');
              }}>
              <Text style={style.loginTextStyle}>Member Login</Text>
              <View>
                <Image
                  source={images.profileVectorLogo}
                  style={style.profileVectorStyle}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <Toast ref={ref => Toast.setRef(ref)} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default RegistrationScreen;
