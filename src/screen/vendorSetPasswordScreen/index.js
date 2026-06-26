import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import NewTextInputComponent from '../../components/newTextInputComponent';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {setPassword as setPasswordAction} from '../../actions/authActions';
import {useNavigation} from '@react-navigation/native';
import {updateDetails} from '../../actions/homeActions';

const VendorSetPasswordScreen = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const {loading} = useSelector(state => state.auth);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const ShowToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Password Mismatch',
      text2: 'Passwords do not match.',
    });
  };

  // const handleRegister = () => {
  //   const passwordRegex =
  //     /^(?=.*[A-Z])(?=.*[!@#$%^&*()])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*()]{6,8}$/;
  //
  //   if (!password.match(passwordRegex)) {
  //     Alert.alert(
  //       'Invalid Password',
  //       'Password must contain at least one capital letter, one special character, one number, and be 6 to 8 characters in length.',
  //     );
  //   } else if (password !== confirmPassword) {
  //     ShowToast();
  //   } else {
  //     dispatch(
  //       setPasswordAction({password}, () => {
  //         navigation.navigate('VendorBasicDetailScreen');
  //       }),
  //     );
  //   }
  // };

  const handleRegister = () => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*()])(?=.*[0-9])[a-zA-Z0-9!@#$%^&*()]{6,8}$/;

    if (!password.match(passwordRegex)) {
      Alert.alert(
        'Invalid Password',
        'Password must contain at least one capital letter, one special character, one number, and be 6 to 8 characters in length.',
      );
      return;
    }

    if (password !== confirmPassword) {
      ShowToast();
      return;
    }

    dispatch(
      setPasswordAction(
        {password},
        () => {
          // ✅ Password API Success

          dispatch(
            updateDetails({appUsesType: 'vendor'}, () => {
              navigation.navigate('VendorBasicDetailScreen');
            }),
          );
        },
        error => {
          // ❌ Password API Failed
          console.log('setPasswordAction failed', error);
        },
      ),
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Image
          source={images.happyMilanColorLogo}
          style={{
            marginTop: hp(15),
            marginLeft: wp(33),
            resizeMode: 'contain',
            width: hp(96),
            height: hp(24),
          }}
        />

        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(24),
            lineHeight: hp(36),
            fontFamily: fontFamily.poppins500,
            alignSelf: 'center',
            marginTop: hp(100),
          }}>
          Set Password
        </Text>

        <View style={{marginHorizontal: wp(30), marginTop: hp(50)}}>
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
        </View>

        <View style={{marginTop: hp(50), marginHorizontal: wp(30)}}>
          <TouchableOpacity
            disabled={loading}
            onPress={handleRegister}
            style={{
              width: '100%',
              height: hp(50),
              backgroundColor: '#7148E4',
              borderRadius: hp(50),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {loading ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins400,
                }}>
                Register Now
              </Text>
            )}
          </TouchableOpacity>

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
        <Toast />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default VendorSetPasswordScreen;
