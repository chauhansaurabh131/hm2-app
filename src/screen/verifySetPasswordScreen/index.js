import React, {useState} from 'react';
import {
  Image,
  Keyboard,
  Modal,
  SafeAreaView,
  Text,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import NewTextInputComponent from '../../components/newTextInputComponent';
import CommonGradientButton from '../../components/commonGradientButton';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios'; // Import axios
import Toast from 'react-native-toast-message';

const VerifySetPasswordScreen = ({route}) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility
  const [loading, setLoading] = useState(false); // Local loading state
  const navigation = useNavigation();
  // const {loading} = useSelector(state => state.auth);

  // Retrieve email and OTP from route params
  const {email, otp} = route.params;

  const onResetPasswordPress = async () => {
    console.log(' === otp, email ===> ', otp, email);
    const enteredOtp = otp.join('');
    console.log(' === enteredOtp ===> ', enteredOtp);

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
      setLoading(true); // Show loader
      try {
        const response = await axios.post(
          'https://happymilan.tech/api/v1/user/auth/reset-password',
          {
            email,
            password,
            otp: enteredOtp,
          },
        );

        if (response.status === 200) {
          setModalVisible(true);
        } else {
          Alert.alert('Error', 'Password reset failed. Please try again.');
        }
      } catch (error) {
        console.error(
          'Error resetting password:',
          error.response ? error.response.data : error.message,
        );
        Alert.alert(
          'Error',
          'An error occurred while resetting the password. Please try again.',
        );
      } finally {
        setLoading(false); // Hide loader
      }
    }
  };

  const closeModal = () => {
    setModalVisible(false); // Close the modal
    navigation.navigate('NewLogInScreen'); // Navigate to login screen
  };

  const ShowToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Password Mismatch',
      text2: 'Passwords do not match.',
    });
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
              buttonName={'Reset Password'}
              containerStyle={{width: '100%', marginTop: hp(29)}}
              onPress={onResetPasswordPress}
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
        </View>

        {/* Modal for Reset Password */}
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0,0,0,0.5)',
            }}>
            <View
              style={{
                width: '90%',
                padding: 20,
                backgroundColor: colors.white,
                borderRadius: 10,
              }}>
              <Image
                source={icons.check_gradient_icon}
                style={{
                  width: hp(40),
                  height: hp(40),
                  resizeMode: 'contain',
                  marginTop: hp(57),
                  marginBottom: hp(34),
                  alignSelf: 'center',
                }}
              />
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(18),
                  lineHeight: hp(28),
                  fontFamily: fontFamily.poppins400,
                  textAlign: 'center',
                }}>
                Your password has been
              </Text>

              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(18),
                  lineHeight: hp(28),
                  fontFamily: fontFamily.poppins400,
                  textAlign: 'center',
                }}>
                changed successfully
              </Text>

              <TouchableOpacity activeOpacity={0.7} onPress={closeModal}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0.5}}
                  style={{
                    marginTop: hp(34),
                    width: wp(112),
                    height: hp(50),
                    borderRadius: 25,
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginBottom: hp(57),
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      textAlign: 'center',
                      fontSize: fontSize(16),
                      lineHeight: hp(26),
                      fontFamily: fontFamily.poppins500,
                    }}>
                    Login
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default VerifySetPasswordScreen;
