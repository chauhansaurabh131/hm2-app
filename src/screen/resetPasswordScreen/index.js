import React, {useState} from 'react';
import {
  Image,
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import NewTextInputComponent from '../../components/newTextInputComponent';
import CommonGradientButton from '../../components/commonGradientButton';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import {SetLoading} from '../../actions/authActions';

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {loading} = useSelector(state => state.auth);

  const onSendCodePress = async () => {
    dispatch(SetLoading(true)); // Set loading to true before the API call

    try {
      const response = await axios.post(
        'https://happymilan.tech/api/v1/user/auth/forgot-password',
        {email},
        {headers: {'Content-Type': 'application/json'}},
      );

      if (response.status === 200) {
        // Alert.alert('Success', 'A reset code has been sent to your email.');
        navigation.navigate('ResetVerifyScreen', {email});
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'Failed to send code. Please try again.',
      );
    } finally {
      dispatch(SetLoading(false)); // Set loading to false after the API call
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
              marginTop: hp(137),
            }}>
            Reset Password
          </Text>

          <View style={{marginTop: hp(80)}}>
            <NewTextInputComponent
              value={email}
              onChangeText={emailInput => setEmail(emailInput)}
              placeholder="Your Email or Mobile"
              LeftIconName={icons.profileLogo}
            />

            <CommonGradientButton
              buttonName={
                loading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  'Send Code'
                )
              }
              containerStyle={{width: '100%', marginTop: hp(29)}}
              onPress={onSendCodePress}
              disabled={loading} // Disable the button while loading
            />
          </View>

          <View
            style={{
              marginTop: hp(120),
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
                // navigation.navigate('NewSignUpScreen');
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  fontFamily: fontFamily.poppins400,
                }}>
                New Member?{' '}
              </Text>
              <View>
                <Text
                  style={{
                    color: colors.blue,
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Sign Up
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ResetPasswordScreen;
