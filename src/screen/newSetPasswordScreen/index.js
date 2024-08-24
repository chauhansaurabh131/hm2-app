import React, {useState} from 'react';
import {
  Alert,
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
import {useNavigation} from '@react-navigation/native';
import NewTextInputComponent from '../../components/newTextInputComponent';
import CommonGradientButton from '../../components/commonGradientButton';
import {setPassword as setPasswordAction} from '../../actions/authActions';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';

const NewSetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {loading} = useSelector(state => state.auth);

  const ShowToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Password Mismatch',
      text2: 'Passwords do not match.',
    });
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
      ShowToast();
    } else {
      dispatch(
        setPasswordAction({password}, () => {
          navigation.navigate('NewStartExploreScreen');
        }),
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
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

          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={icons.back_arrow_icon}
              style={{
                width: hp(20),
                height: hp(20),
                marginTop: hp(29),
                marginRight: wp(20),
                tintColor: colors.lightGray,
              }}
            />
          </TouchableOpacity>
        </View>

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
            Set Password
          </Text>

          <View style={{marginTop: hp(70)}}>
            <NewTextInputComponent
              value={password}
              onChangeText={setPassword}
              placeholder="Choose Password"
              RightIconName={icons.secureEyeLogo}
              isPasswordInput={true}
              maxLength={8}
            />

            <NewTextInputComponent
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm Password"
              style={{marginTop: 20}}
              RightIconName={icons.secureEyeLogo}
              isPasswordInput={true}
              maxLength={8}
            />

            <CommonGradientButton
              buttonName={'Register Now'}
              containerStyle={{width: '100%', marginTop: hp(29)}}
              onPress={handleRegister}
              loading={loading}
            />

            <View style={{alignSelf: 'center', marginTop: hp(30)}}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(10),
                  lineHeight: hp(15),
                  fontFamily: fontFamily.poppins400,
                }}>
                Hints{' '}
                <Text style={{color: colors.lightGray}}>
                  : Must be 6-8 characters long, including{' '}
                </Text>
              </Text>
              <Text
                style={{
                  color: colors.lightGray,
                  alignSelf: 'center',
                  fontSize: fontSize(10),
                  lineHeight: hp(15),
                  fontFamily: fontFamily.poppins400,
                }}>
                numbers and letters
              </Text>
            </View>
          </View>

          {/*BOTTOM DESIGN */}
          <View
            style={{
              // position: 'absolute',
              // bottom: 0,
              // alignSelf: 'center',
              marginTop: hp(40),
              alignSelf: 'center',
            }}>
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
        <Toast />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default NewSetPasswordScreen;
