import React, {useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import NewTextInputComponent from '../../components/newTextInputComponent';
import {icons} from '../../assets';
import CommonGradientButton from '../../components/commonGradientButton';
import {hp} from '../../utils/helpers';
import {useDispatch, useSelector} from 'react-redux';
import {register} from '../../actions/authActions';
import Toast from 'react-native-toast-message';

const DemoCode = () => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const {loading} = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // Validate Name (at least 3 and at most 15 characters)
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

  // Validate Email or Mobile
  const validateEmailOrMobile = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Email regex pattern
    const mobilePattern = /^[0-9]{10}$/; // Mobile number regex (10 digits)

    // Check if it's an email
    if (emailPattern.test(email)) {
      setEmailError('');
      return 'email';
    }

    // Check if it's a valid mobile number (10 digits)
    if (mobilePattern.test(email)) {
      setEmailError('');
      return 'mobile';
    }

    // Invalid email or mobile
    setEmailError('Invalid E-mail Address or Mobile Number');
    return false;
  };

  const onPressLogin = () => {
    // Validate both name and email/mobile input before proceeding
    const isNameValid = validateName();
    const emailOrMobileValid = validateEmailOrMobile();

    // If either validation fails, return early
    if (!isNameValid || !emailOrMobileValid) {
      return;
    }

    console.log(' === onPressLogin ===> ', name, email);

    // Now we make the API call after validation
    if (emailOrMobileValid === 'email') {
      // Proceed with registration using email
      dispatch(
        register(
          {name, email, countryCodeId: '67d2698641c89038f51512a2'},
          () => {
            // navigation.navigate('VerifyEmailOtpScreen', { name, email });
          },
        ),
      );
    } else if (emailOrMobileValid === 'mobile') {
      // Proceed with registration using mobile number
      dispatch(
        register(
          {
            name,
            mobileNumber: email,
            countryCodeId: '67d2698641c89038f51512a2',
          },
          () => {
            // navigation.navigate('VerifyMobileOtpScreen', { name, email });
          },
        ),
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{marginHorizontal: 17, marginTop: 50}}>
        {/* Name Input */}
        <NewTextInputComponent
          value={name}
          onChangeText={text => setName(text)}
          placeholder="Enter Your Name"
          LeftIconName={icons.profileLogo}
        />
        {nameError ? (
          <Text style={{marginTop: 2, color: 'red'}}>{nameError}</Text>
        ) : null}

        {/* Email or Mobile Input */}
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

        {/* Login Button */}
        <CommonGradientButton
          buttonName={'Login'}
          containerStyle={{width: '100%', marginTop: hp(20)}}
          onPress={onPressLogin}
        />
      </View>

      {/* Toast component for showing toast messages */}
      <Toast />
    </SafeAreaView>
  );
};

export default DemoCode;
