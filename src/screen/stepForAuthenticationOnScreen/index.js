import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Linking,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import ProfileAvatar from '../../components/letterProfileComponent';

const StepForAuthenticationOnScreen = () => {
  const [barcodeUrl, setBarcodeUrl] = useState(null); // State to hold barcode URL
  const [code, setCode] = useState(''); // To store the 6-digit code

  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;
  const accessToken = user?.tokens?.access?.token;

  const navigation = useNavigation();

  const topModalBottomSheetRef = useRef(null);
  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  // URL of the app on the Play Store
  const playStoreUrl =
    'https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2'; // Change this URL to the authentication app's Play Store URL

  useEffect(() => {
    if (accessToken) {
      // Define the API call
      const callApi = async () => {
        try {
          const response = await fetch(
            'https://stag.mntech.website/api/v1/user/2fa/generate',
            {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            },
          );

          const responseData = await response.json();
          // console.log('API Response:', responseData);

          // Get the dataURL for barcode
          const dataURL = responseData?.dataURL;
          if (dataURL) {
            setBarcodeUrl(dataURL); // Update the state with the barcode URL
          }
        } catch (error) {
          console.error('API Error:', error);
        }
      };

      callApi();
    } else {
      console.log('No access token found');
    }
  }, [accessToken]); // Run the effect when the access token changes

  const handleChange = text => {
    // Remove any non-digit characters
    const cleanedText = text.replace(/\D/g, '').slice(0, 6);

    // Format the cleaned text by adding space between each digit
    let formattedText = cleanedText.split('').join(' ');

    setCode(formattedText);
  };

  const handleSubmit = async () => {
    // Remove spaces from the code for validation
    const codeWithoutSpaces = code.replace(/\s/g, '');

    // Check if the length of the code is less than 6 digits
    if (codeWithoutSpaces.length < 6) {
      // Show a toast message
      Toast.show({
        type: 'error',
        text1: 'Incorrect OTP',
        text2: 'Please enter a valid 6-digit OTP.',
        visibilityTime: 3000, // Show the toast for 3 seconds
      });
      return; // Stop further execution if the OTP is invalid
    }

    console.log(' === codeWithoutSpaces ===> ', codeWithoutSpaces);

    // API request to verify the OTP
    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/2fa/verify',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Pass the access token here
          },
          body: JSON.stringify({
            token: codeWithoutSpaces, // Send the 6-digit OTP
          }),
        },
      );

      const responseData = await response.json();

      // Log the full response data for debugging
      console.log('API Response Data:', responseData);

      if (response.ok) {
        // Handle success
        Toast.show({
          type: 'success',
          text1: 'OTP Verified',
          text2: 'Your OTP has been successfully verified.',
          visibilityTime: 3000, // Show the success message for 3 seconds
        });
        // Redirect or do something on success (e.g., navigation)
        // navigation.goBack();
        setCode('');
        navigation.navigate('TwoFactorAuthenticationScreen');
      } else {
        // Log the error details from the API response
        setCode('');
        console.error(
          'Verification Failed:',
          responseData?.message || 'Unknown error',
        );

        // Enhanced user feedback for invalid code
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2:
            responseData?.message === 'Invalid verification code'
              ? 'The code you entered is invalid or has expired. Please try again with a new code.'
              : 'Something went wrong. Please try again.',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      // Log the error if there's a network issue or other failure
      console.error('Network Error:', error);

      Toast.show({
        type: 'error',
        text1: 'Network Error',
        text2: 'There was an error connecting to the server. Please try again.',
        visibilityTime: 3000,
      });
    }
  };

  const onGooglePlayPress = () => {
    Linking.openURL(playStoreUrl) // Open the Play Store URL
      .catch(err => console.error('An error occurred', err)); // Handle any errors
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />
          {/*<TouchableOpacity onPress={openTopSheetModal}>*/}
          <TouchableOpacity onPress={openBottomSheet}>
            {userImage ? (
              <Image
                source={{uri: userImage}}
                style={style.profileImageStyle}
              />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName}
                lastName={user?.user?.lastName}
                textStyle={style.profileImageStyle}
                profileTexts={{fontSize: fontSize(10)}}
              />
            )}
            {/*<Image*/}
            {/*  source={userImage ? {uri: userImage} : images.empty_male_Image}*/}
            {/*  style={style.profileImageStyle}*/}
            {/*/>*/}
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View style={style.headingTittleContainer}>
          <Text style={style.headingCredentialsText}>
            Follow steps in Authenticator App
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.bodyContainer}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <View style={style.tittleCircle}>
              <Text style={{color: 'black'}}>1</Text>
            </View>
            <Text style={style.tittleText}>
              Install Google Authenticator on your{'\n'}mobile.
            </Text>
          </View>

          <View style={style.tittleBody}>
            <TouchableOpacity activeOpacity={0.6} onPress={onGooglePlayPress}>
              <Image source={icons.google_play_icon} style={style.bodyImage} />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.6} style={{marginLeft: hp(10)}}>
              <Image source={icons.app_store_icon} style={style.bodyImage} />
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: hp(27),
            }}>
            <View style={style.tittleCircle}>
              <Text style={{color: 'black'}}>2</Text>
            </View>
            <Text style={style.tittleText}>
              Open Authenticator and scan the QR {'\n'}code.
            </Text>
          </View>

          <View
            style={{
              alignItems: 'center',
              marginTop: hp(10),
            }}>
            {barcodeUrl ? (
              <Image
                source={{uri: barcodeUrl}}
                style={{width: hp(192), height: hp(192), resizeMode: 'contain'}}
              />
            ) : (
              <ActivityIndicator size="large" color={colors.blue} />
            )}
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: hp(10),
            }}>
            <View style={style.tittleCircle}>
              <Text style={{color: 'black'}}>3</Text>
            </View>
            <Text style={style.tittleText}>
              Enter the 6-digit code from Authenticator.
            </Text>
          </View>

          <TextInput
            style={style.textInputContainer}
            placeholder={'Enter 6 Digit Code'}
            placeholderTextColor="gray"
            value={code}
            onChangeText={handleChange} // Update the state with user input
            keyboardType="numeric" // Display numeric keyboard for input
            maxLength={11} // Maximum length to account for 6 digits and 5 spaces
            textAlign="center" // Center align the text
          />

          <TouchableOpacity activeOpacity={0.7} onPress={handleSubmit}>
            <LinearGradient
              colors={['#2D46B9', '#8D1D8D']}
              start={{x: 0, y: 0}}
              end={{x: 1.3, y: 1.8}}
              style={style.buttonContainer}>
              <Text style={style.buttonText}>Verify</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={{height: 50}} />
        </View>
      </ScrollView>
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default StepForAuthenticationOnScreen;
