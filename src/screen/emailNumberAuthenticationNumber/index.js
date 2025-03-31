import React, {useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import axios from 'axios'; // For API call
import Abc from '../abc';

const EmailNumberAuthenticationNumber = () => {
  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;
  const accessToken = user?.tokens?.access?.token;

  const email = user?.user?.email;
  const mobileNumber = user?.user?.mobileNumber;

  const navigation = useNavigation();

  const topModalBottomSheetRef = useRef(null);
  const [loading, setLoading] = useState(false); // State for loader

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const handlePress = async type => {
    if (loading) {
      return;
    } // Don't proceed if already loading

    setLoading(true); // Show loader when API is called

    let data = {
      otpType: type === 'email' ? 'email' : 'mobile',
    };

    try {
      // Make the API call using axios
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/2fa/setup-otp',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        console.log('API call success:', response.data);
        // Navigate to Abc screen with the respective parameter
        if (type === 'email') {
          navigation.navigate('AuthenticationEnterOtpScreen', {email: email});
        } else if (type === 'mobile') {
          navigation.navigate('AuthenticationEnterOtpScreen', {
            mobileNumber: mobileNumber,
          });
        }
      }
    } catch (error) {
      console.error('API call failed:', error);
      // Handle error case if necessary
    } finally {
      setLoading(false); // Hide loader when API request is complete
    }
  };

  // Function to mask email
  const maskEmail = email => {
    const [username, domain] = email.split('@');
    const maskedUsername = username.slice(0, 4) + '******'; // Mask the middle part of the username
    return `${maskedUsername}@${domain}`;
  };

  // Function to mask mobile number
  const maskMobileNumber = mobileNumber => {
    const mobileStr = mobileNumber?.toString();

    if (!mobileStr || !/^\d{10}$/.test(mobileStr)) {
      console.log('Invalid mobile number format');
      return '';
    }

    const prefix = mobileStr.slice(0, 3); // First 3 digits (country code)
    const last = mobileStr.slice(-2); // Last 2 digits
    const masked = mobileStr.slice(3, -2).replace(/\d/g, '*'); // Mask all middle digits with '*'
    return `+91  ${prefix}${masked}${last}`;
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />
          <TouchableOpacity onPress={openBottomSheet}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.profileImageStyle}
            />
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View style={style.headingTittleContainer}>
          <Text style={style.headingCredentialsText}>
            Email or Phone Number
          </Text>
          <TouchableOpacity
            style={style.backButtonContainer}
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back_arrow_icon}
              style={style.backButtonIconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={style.underLineHeaderStyle} />

      <View style={style.bodyContainer}>
        <Text style={style.bodyTittle}>
          Select your email or mobile number for 2FA
        </Text>

        {email && (
          <View style={style.optionBodyContainer}>
            <TouchableHighlight
              activeOpacity={0.3}
              underlayColor="#F9FBFF"
              style={style.optionBodyTouchable}
              onPress={() => handlePress('email')}>
              <View style={style.optionBodyStyle}>
                <Text style={style.optionBodyText}>{maskEmail(email)}</Text>

                <Image
                  source={icons.rightSideIcon}
                  style={style.optionBodyRightIcon}
                />
              </View>
            </TouchableHighlight>
          </View>
        )}

        {mobileNumber && (
          <View style={[style.optionBodyContainer, {marginTop: hp(10)}]}>
            <TouchableHighlight
              activeOpacity={0.3}
              underlayColor="#F9FBFF"
              style={style.optionBodyTouchable}
              onPress={() => handlePress('mobile')}>
              <View style={style.optionBodyStyle}>
                <Text style={style.optionBodyText}>
                  {maskMobileNumber(mobileNumber)}
                </Text>

                <Image
                  source={icons.rightSideIcon}
                  style={style.optionBodyRightIcon}
                />
              </View>
            </TouchableHighlight>
          </View>
        )}
      </View>

      {loading && (
        <>
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark semi-transparent background
              zIndex: 99, // Ensure it's above other components
              flex: 1,
            }}
          />
          <View
            style={{
              // flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2, // Ensure the loader is above the background overlay
            }}>
            <ActivityIndicator size="large" color={colors.blue} />
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default EmailNumberAuthenticationNumber;
