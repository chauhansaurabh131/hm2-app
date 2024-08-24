import React, {useState} from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import NewTextInputComponent from '../../components/newTextInputComponent';
import CommonGradientButton from '../../components/commonGradientButton';
import {useDispatch, useSelector} from 'react-redux';
import {register} from '../../actions/authActions';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';

const NewSignUpScreen = () => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {loading} = useSelector(state => state.auth);

  console.log(' === loading ===> ', loading);

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

  const handleSignUp = async () => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    if (isNameValid && isEmailValid) {
      dispatch(
        register({name, email}, () => {
          navigation.navigate('VerifyEmailOtpScreen', {name, email});
        }),
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Image
          source={images.happyMilanColorLogo}
          style={{
            marginTop: hp(29),
            marginLeft: wp(33),
            resizeMode: 'stretch',
            width: hp(96),
            height: hp(24),
          }}
        />

        <View style={{flex: 1, marginHorizontal: wp(30)}}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(24),
              lineHeight: hp(36),
              fontFamily: fontFamily.poppins500,
              alignSelf: 'center',
              marginTop: hp(80),
            }}>
            Sign Up
          </Text>

          <View style={{marginTop: hp(50)}}>
            <NewTextInputComponent
              value={name}
              onChangeText={text => setName(text)}
              placeholder="Enter Your Name"
              LeftIconName={icons.profileLogo}
            />
            {nameError ? (
              <Text style={{marginTop: 2, color: 'red'}}>{nameError}</Text>
            ) : null}

            <NewTextInputComponent
              value={email}
              onChangeText={text => setEmail(text)}
              placeholder="Your Email or Mobile"
              style={{marginTop: 20}}
              LeftIconName={icons.mailLogo}
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

            <View style={{alignItems: 'center', marginTop: hp(34)}}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(12),
                  lineHeight: hp(18),
                  fontFamily: fontFamily.poppins400,
                }}>
                By creating account, I Agree to Happy Milan
              </Text>
              <View>
                <Text
                  style={{
                    color: colors.blue,
                    fontSize: fontSize(12),
                    lineHeight: hp(18),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Privacy Policy
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: fontSize(12),
                      lineHeight: hp(18),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    {' '}
                    and{' '}
                  </Text>
                  <Text>T&C</Text>
                </Text>
              </View>
            </View>
          </View>

          {/*BOTTOM DESIGN */}
          <View
            style={{
              // position: 'absolute',
              // bottom: 0,
              // alignSelf: 'center',
              // backgroundColor: 'red',
              marginTop: hp(40),
              alignSelf: 'center',
            }}>
            <View
              style={{
                width: wp(267),
                borderWidth: 0.5,
                borderColor: '#E1E1E1',
                alignSelf: 'center',
                marginBottom: hp(5),
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(21),
                width: wp(267),
              }}>
              <Text
                style={{
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  textAlign: 'center',
                  color: colors.black,
                  fontFamily: fontFamily.poppins400,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                or continue with
              </Text>

              <TouchableOpacity
                style={{
                  width: hp(44),
                  height: hp(44),
                  borderRadius: hp(50),
                  borderColor: colors.lightGrayCircle,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: wp(40),
                }}>
                <Image
                  source={icons.googleLogo}
                  style={{
                    height: hp(17.6),
                    width: hp(17.6),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  width: hp(44),
                  height: hp(44),
                  borderRadius: hp(50),
                  borderColor: '#D4D4D4',
                  borderWidth: 1,
                  marginRight: wp(20),
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: wp(24),
                }}>
                <Image
                  source={icons.facebookLogo}
                  style={{
                    height: hp(17.6),
                    width: hp(17.6),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: wp(267),
                borderWidth: 0.5,
                borderColor: '#E1E1E1',
                alignSelf: 'center',
                marginTop: hp(24),
              }}
            />

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginBottom: isIOS ? hp(10) : hp(30),
                marginTop: hp(58),

                alignItems: 'center',
              }}
              onPress={() => {
                navigation.navigate('NewLogInScreen');
              }}>
              <Text style={{color: colors.black}}>Member Login</Text>
              <View>
                <Image
                  source={images.profileVectorLogo}
                  style={{
                    width: hp(16),
                    height: hp(16),
                    marginLeft: wp(10),
                    // top: 3,
                    tintColor: colors.black,
                  }}
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

export default NewSignUpScreen;
