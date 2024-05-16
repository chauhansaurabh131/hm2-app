import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  // TextInput,
} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import TextInput from '../../components/TextInput';
import {colors} from '../../utils/colors';
import GradientButton from '../../components/GradientButton';
import {useDispatch, useSelector} from 'react-redux';
import {Login} from '../../store/actions/allActions';
import {apiKeys} from '../../config/apikeys';
import useDelayedNavigation from '../../utils/delayFunction';
import {MyContext} from '../../utils/Provider';
import Toast from 'react-native-toast-message';
import TextInputWithIcons from '../../components/textInputWithIcons';
import {hp} from '../../utils/helpers';

const LoginScreen = ({navigation}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  // const {setTemporyHome} = useContext(MyContext);

  const {loading, userDetails, userDetailsError} = useSelector(
    state => state.auth,
  );
  const {setMoveToHome} = useContext(MyContext);

  useEffect(() => {
    if (userDetailsError == null) {
      if (userDetails.length !== 0) {
        setMoveToHome(true);
      }
    } else {
      Alert.alert(userDetailsError);
    }
  });

  useEffect(() => {
    if (userDetailsError !== null) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: userDetailsError,
        autoHide: true,
      });
    }
  }, [userDetailsError]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // const onPressLogin = () => {
  //   if (email === '' && password === '') {
  //     let params = {
  //       [apiKeys.Path]: apiKeys.login,
  //       [apiKeys.Data]: {
  //         email: 'happytest01@yopmail.com',
  //         password: 'test123',
  //       },
  //     };
  //     dispatch(Login(params));
  //   }
  // };

  const onPressLogin = () => {
    console.log('onPressLogin ', email + password);
    if (email !== '' && password !== '') {
      let params = {
        [apiKeys.Path]: apiKeys.login,
        [apiKeys.Data]: {
          email: email,
          password: password,
        },
      };
      dispatch(Login(params));
    }
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

      {/*<TextInput*/}
      {/*  style={{*/}
      {/*    width: '68%',*/}
      {/*    height: hp(50),*/}
      {/*    borderRadius: 10,*/}
      {/*    borderWidth: 1,*/}
      {/*    borderColor: 'black',*/}
      {/*    alignSelf: 'center',*/}
      {/*    marginBottom: '2%',*/}
      {/*  }}*/}
      {/*  value={email}*/}
      {/*  onChangeText={emailInput => setEmail(emailInput)}*/}
      {/*/>*/}

      <TextInput
        inputValue={email}
        IconNameDesign={icons.profileLogo}
        placeholder={'Enter Your Email'}
        iconSource={icons.profileLogo}
        textInputStyle={style.textInputStyle}
        containerStyle={style.containerStyle}
        handleInputChange={emailInput => setEmail(emailInput)}
      />

      {/*<TextInput*/}
      {/*  style={{*/}
      {/*    width: '68%',*/}
      {/*    height: hp(50),*/}
      {/*    borderRadius: 10,*/}
      {/*    borderWidth: 1,*/}
      {/*    borderColor: 'black',*/}
      {/*    alignSelf: 'center',*/}
      {/*  }}*/}
      {/*  value={password}*/}
      {/*  onChangeText={passwordInput => setPassword(passwordInput)}*/}
      {/*/>*/}

      <TextInput
        inputValue={password}
        IconNameDesign={icons.profileLogo}
        placeholder={'Enter Password'}
        iconSource={icons.mailLogo}
        iconSecures
        iconSecure={icons.secureEyeLogo}
        secureTextEntry={!isPasswordVisible}
        textInputStyle={{textAlign: 'center', marginLeft: 20}}
        onIconPress={togglePasswordVisibility}
        containerStyle={style.passwordContainerStyle}
        handleInputChange={passwordInput => setPassword(passwordInput)}
      />

      <GradientButton
        buttonName={'Login'}
        containerStyle={style.gradientContainerStyle}
        buttonTextStyle={{color: colors.white}}
        onPress={onPressLogin}
        isLoading={loading}
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
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default LoginScreen;
