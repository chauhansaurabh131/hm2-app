import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  TextInput,
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native';
import {colors} from '../../utils/colors';
import {hp, wp, fontSize, fontFamily, isIOS} from '../../utils/helpers';
import {icons, images} from '../../assets';
import CommonGradientButton from '../../components/commonGradientButton';
import {verifyOTP} from '../../actions/authActions';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const VerifyEmailOtpScreen = ({route}) => {
  const {email = ''} = route.params;

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef([]);

  const {otpVerifiedDetails, loading} = useSelector(state => state.auth);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const hiddenChars = email.substring(0, 3);
  const domain = email.substring(email.indexOf('@'));
  const maskedEmail = hiddenChars + '******' + domain;

  const handleOtpChange = (value, index) => {
    // Ensure that only numeric values are accepted
    if (/^[0-9]$/.test(value)) {
      const otpCopy = [...otp];
      otpCopy[index] = value;
      setOtp(otpCopy);

      // Automatically focus on the next input field
      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === '') {
      // Handle backspace to clear the value
      const otpCopy = [...otp];
      otpCopy[index] = '';
      setOtp(otpCopy);

      // Automatically go back to the previous input if the current one is empty
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const onVerifyCodePress = () => {
    const enteredOtp = otp.join('');
    console.log('Entered OTP:', enteredOtp);
    dispatch(
      verifyOTP({email, otp: otp.join('')}, () =>
        navigation.navigate('NewSetPasswordScreen'),
      ),
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
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

        <View
          style={{
            flex: 1,
            marginHorizontal: wp(30),
          }}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(24),
              lineHeight: hp(36),
              fontFamily: fontFamily.poppins500,
              alignSelf: 'center',
              marginTop: hp(80),
            }}>
            Verify Email
          </Text>

          <View style={{alignSelf: 'center', marginTop: hp(20)}}>
            <Text style={{color: colors.lightGray}}>
              OTP sent on
              {/*<Text style={{color: colors.black}}> {maskedEmail}</Text>*/}
            </Text>
          </View>

          <View style={styles.container}>
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  value={digit}
                  onChangeText={value => handleOtpChange(value, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  secureTextEntry={false}
                  style={[
                    styles.otpInput,
                    digit ? styles.activeInput : styles.inactiveInput,
                    digit ? styles.digitStyle : styles.placeholderStyle,
                  ]}
                  ref={ref => (inputRefs.current[index] = ref)}
                  placeholder="0"
                  placeholderTextColor="#D9D9D9"
                />
              ))}
            </View>
          </View>

          <View style={{alignSelf: 'center'}}>
            <Text style={{color: colors.lightGray}}>
              Resend in <Text style={{color: colors.black}}>48 Sec. </Text>
            </Text>
          </View>

          <CommonGradientButton
            buttonName={'Verify Code'}
            containerStyle={{width: '100%', marginTop: hp(70)}}
            onPress={onVerifyCodePress}
            loading={loading}
          />

          <View
            style={{
              // position: 'absolute',
              // bottom: 0,
              // alignSelf: 'center',
              marginTop: hp(90),
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
                    tintColor: colors.black,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(20),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(330),
    height: hp(150),
  },
  otpInput: {
    width: wp(60),
    height: hp(50),
    textAlign: 'center',
    fontSize: fontSize(24),
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    fontWeight: 'bold',
  },
  activeInput: {
    borderBottomColor: colors.black,
  },
  inactiveInput: {
    borderBottomColor: '#D9D9D9',
  },
  digitStyle: {
    color: colors.black,
  },
  placeholderStyle: {
    color: '#D9D9D9',
  },
});

export default VerifyEmailOtpScreen;
