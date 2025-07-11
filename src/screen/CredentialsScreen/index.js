import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../actions/homeActions';
import * as text from 'formik';
import {colors} from '../../utils/colors';
import {changeStack, logout} from '../../actions/authActions';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import ProfileAvatar from '../../components/letterProfileComponent';

const CredentialsScreen = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef();
  const bottomSheetEmailChangeRef = useRef();
  const bottomSheetMobileNumberChangeRef = useRef();
  const bottomSheetEmailChangeSubmitRef = useRef();
  const bottomSheetMobileNumberChangeSubmitRef = useRef();
  const passwordBottomSheetRef = useRef();
  const bottomSheetPasswordChangeRef2 = useRef(null);
  const [selectedCredential, setSelectedCredential] = useState(null);
  // const [currentEmail, setCurrentEmail] = useState('jit*****@gmail.com');
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  // const [currentMobile, setCurrentMobile] = useState('*******902');
  const [currentMobile, setCurrentMobile] = useState('');
  const [newMobile, setNewMobile] = useState(''); // New mobile number
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isCurrentPasswordVisible, setIsCurrentPasswordVisible] =
    useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const [topModalVisible, setTopModalVisible] = useState(false);

  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes
  const [loader, setLoader] = useState(false);
  const inputRefs = useRef([]);

  const isMobileValid = newMobile.length === 10;

  // console.log(' === currentEmail ===> ', currentEmail);

  const apiDispatch = useDispatch();

  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;

  // console.log(' === user ===> ', user?.tokens?.access?.token);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setResendAvailable(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  // Format seconds as MM:SS
  const formatTime = seconds => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const maskEmail = email => {
    const [localPart, domain] = email.split('@');
    if (!localPart || !domain) {
      return email;
    }

    const visibleChars = 3;
    const maskedPart = '*'.repeat(Math.max(localPart.length - visibleChars, 0));
    const visible = localPart.slice(0, visibleChars);

    return `${visible}${maskedPart}@${domain}`;
  };

  const topModalBottomSheetRef = useRef(null);
  const openTopBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  // console.log(' === currentMobile ===> ', currentMobile);

  const maskedMobile = currentMobile
    ? `*******${String(currentMobile).slice(-3)}`
    : 'N/A';

  const token = user?.tokens?.access?.token;
  const dispatch = useDispatch();

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  useEffect(() => {
    if (user && user?.user?.email) {
      setCurrentEmail(user?.user?.email);
    }
  }, [user]);

  useEffect(() => {
    if (user && user?.user?.mobileNumber) {
      setCurrentMobile(user?.user?.mobileNumber);
    }
  }, [user]);

  // const email = user.user.email;

  const handleNewMobileChange = text => {
    const numericValue = text.replace(/[^0-9]/g, '');

    setNewMobile(numericValue);
  };

  const openBottomSheet = credential => {
    setSelectedCredential(credential);
    bottomSheetRef.current.open();
  };

  const openPasswordBottomSheet = () => {
    passwordBottomSheetRef.current.open();
  };

  const handleEmailChange = text => {
    setNewEmail(text);
  };

  // const onChangeEmailPress = () => {
  //   const enteredOtp = otp.join('');
  //   console.log(' === enteredOtp ===> ', enteredOtp);
  // };

  // const handleSubmit = () => {
  //   console.log(' === newEmail ===> ', newEmail);
  //
  //   bottomSheetEmailChangeRef.current.open();
  //
  //   // apiDispatch(updateDetails({email: newEmail}));
  //
  //   bottomSheetRef.current.close();
  //   passwordBottomSheetRef.current.close();
  // };

  const onChangeEmailPress = () => {
    const enteredOtp = otp.join('');
    console.log('=== enteredOtp ===> ', enteredOtp);
    setLoader(true);

    const payload = {
      email: {
        currentEmail: currentEmail,
        newEmail: newEmail,
        otp: enteredOtp,
      },
    };

    fetch(
      'https://stag.mntech.website/api/v1/user/auth/verify-otp-change-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    )
      .then(response => response.json())
      .then(data => {
        console.log('✅ Success:', data);

        if (data?.data?.success === true) {
          // ✅ OTP is valid
          setLoader(false);
          apiDispatch(updateDetails());
          bottomSheetEmailChangeRef.current.close();
          bottomSheetEmailChangeSubmitRef.current.open();
          setOtp(['', '', '', '']);
        } else {
          // ❌ OTP is invalid or other server-side issue
          setLoader(false);
          setOtp(['', '', '', '']);
          alert(data?.data?.message || 'Something went wrong.');
        }
      })
      .catch(error => {
        console.error('❌ Error:', error);
        setLoader(false);
        setOtp(['', '', '', '']);
        alert('Network error. Please try again.');
      });
  };

  const onChangeNumberNumberPress = () => {
    // bottomSheetMobileNumberChangeRef.current.close();
    // bottomSheetMobileNumberChangeSubmitRef.current.open();

    const enteredOtp = otp.join('');
    console.log('=== enteredOtp ===> ', enteredOtp);
    setLoader(true);

    const payload = {
      mobileNumber: {
        currentMobileNumber: currentMobile,
        newMobileNumber: newMobile,
        otp: enteredOtp,
      },
    };

    fetch(
      'https://stag.mntech.website/api/v1/user/auth/verify-otp-change-email',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      },
    )
      .then(response => response.json())
      .then(data => {
        console.log('✅ Success:', data);

        if (data?.data?.success === true) {
          // ✅ OTP is valid
          setLoader(false);
          apiDispatch(updateDetails());
          bottomSheetMobileNumberChangeRef.current.close();
          bottomSheetMobileNumberChangeSubmitRef.current.open();
          setOtp(['', '', '', '']);
        } else {
          // ❌ OTP is invalid or other server-side issue
          setLoader(false);
          setOtp(['', '', '', '']);
          alert(data?.data?.message || 'Something went wrong.');
        }
      })
      .catch(error => {
        console.error('❌ Error:', error);
        setLoader(false);
        setOtp(['', '', '', '']);
        alert('Network error. Please try again.');
      });
  };

  const handleSubmit = async () => {
    console.log('=== newEmail ===>', newEmail);
    setLoader(true);

    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/auth/send-otp-change-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: {
              currentEmail: currentEmail,
              newEmail: newEmail,
            },
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log('OTP sent successfully:', data);
        setLoader(false);

        // Open OTP verification bottom sheet
        bottomSheetEmailChangeRef.current.open();

        // Optionally close other bottom sheets
        bottomSheetRef.current.close();
        passwordBottomSheetRef.current.close();
      } else {
        console.warn('Failed to send OTP:', data.message || data);
        setLoader(false);
        // Show error message to user if needed
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setLoader(false);
    }
  };

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

  const onUpdatePasswordPress = async () => {
    // Check if new password and confirm password match
    if (newPassword === confirmPassword) {
      try {
        console.log('Making API call with token:', token); // Debugging line

        // Make the API call
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/auth/update-password',
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Include the token in the request headers
            },
            body: JSON.stringify({
              oldPassword: currentPassword,
              newPassword: newPassword,
            }),
          },
        );

        console.log('Response Status:', response.status); // Debugging line
        console.log('Response URL:', response.url); // Debugging line

        if (response.status === 404) {
          console.error('Error: Endpoint not found. Please check the URL.');
          Alert.alert(
            'Error',
            'The endpoint could not be found. Please contact support.',
          );
          return;
        }

        // Parse the JSON response
        const result = await response.json();

        // Check if the response indicates success
        if (response.ok) {
          // Close the first bottom sheet and open the second one
          passwordBottomSheetRef.current.close();
          setTimeout(() => {
            bottomSheetPasswordChangeRef2.current.open();
          }, 100); // Small delay to ensure the first sheet closes before opening the second
        } else {
          // Show alert if API call fails
          Alert.alert(
            'Update Failed',
            result.message || 'An error occurred. Please try again.',
          );
        }
      } catch (error) {
        // Handle network or other errors
        console.error('Error:', error); // Debugging line
        Alert.alert(
          'Error',
          'Network error or unexpected issue. Please try again later.',
        );
      }
    } else {
      // Show alert if passwords do not match
      Alert.alert(
        'Password Mismatch',
        'New Password and Confirm Password do not match.',
      );
    }
  };

  const currentMobileString = String(currentMobile);

  const maskedMobileString = currentMobileString
    ? `*******${String(currentMobile).slice(-3)}`
    : 'N/A';

  const onMobileChangePress = async () => {
    // apiDispatch(updateDetails({mobileNumber: newMobile}));

    // bottomSheetMobileNumberChangeRef.current.open();
    //
    // bottomSheetRef.current.close();
    // passwordBottomSheetRef.current.close();

    console.log(' === var ===> ', currentMobile, newMobile);

    setLoader(true);

    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/auth/send-otp-change-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            mobileNumber: {
              currentMobileNumber: currentMobile,
              newMobileNumber: newMobile,
            },
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log('OTP sent successfully:', data);
        setLoader(false);

        // Open OTP verification bottom sheet
        bottomSheetMobileNumberChangeRef.current.open();

        // Optionally close other bottom sheets
        bottomSheetRef.current.close();
        passwordBottomSheetRef.current.close();
      } else {
        console.warn('Failed to send OTP:', data.message || data);
        setLoader(false);
        // Show error message to user if needed
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setLoader(false);
    }
  };

  const handleVerificationSubmit = () => {
    setVerificationDone(true);
  };

  const handleCloseBottomSheet = () => {
    setVerificationCodeSent(false);
    setVerificationDone(false);
    setNewMobile('');
    if (newMobile.trim() !== '') {
      setCurrentMobile(newMobile);
    }
    bottomSheetRef.current.close();
  };

  const closeSecondBottomSheet = () => {
    bottomSheetPasswordChangeRef2.current.close();
  };

  const renderBottomSheetContent = () => {
    switch (selectedCredential) {
      case 'email':
        return (
          <View style={style.bottomSheetContainer}>
            <Text style={style.bottomSheetTittleText}>Update Email</Text>

            <View
              style={{
                width: '100%',
                height: 0.7,
                backgroundColor: '#E7E7E7',
                marginTop: 20,
              }}
            />

            <View
              style={[
                style.bottomSheetBodyContainer,
                {marginTop: 15, marginHorizontal: hp(30)},
              ]}>
              <Text
                style={[style.bottomSheetBodyTitleText, {marginTop: hp(10)}]}>
                Current Email
              </Text>

              <TextInput
                placeholder={currentEmail}
                placeholderTextColor={'black'}
                editable={false}
                style={style.textInputContainer}
              />

              <Text
                style={[style.bottomSheetBodyTitleText, {marginTop: hp(21)}]}>
                New Email
              </Text>

              <TextInput
                onChangeText={handleEmailChange}
                placeholder={'Type'}
                style={style.textInputContainer}
              />

              <View style={style.bottomSheetButtonContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    bottomSheetRef.current.close();
                    passwordBottomSheetRef.current.close();
                  }}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    style={style.bottomSheetNotNowContainer}>
                    <View style={style.notNowButtonContainer}>
                      <Text style={style.notNowButtonTextStyle}>Not Now</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={handleSubmit}
                  disabled={!newEmail.trim()}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    // style={style.submitButtonContainer}
                    style={[
                      style.submitButtonContainer,
                      !newEmail.trim() && {opacity: 0.5}, // visually indicate it's disabled
                    ]}>
                    {loader ? (
                      <ActivityIndicator size="large" color={colors.white} />
                    ) : (
                      <Text style={style.submitButtonTextStyle}>Submit</Text>
                    )}
                    {/*<Text style={style.submitButtonTextStyle}>Submit</Text>*/}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      case 'mobile':
        return (
          <View style={style.bottomSheetContainer}>
            {!verificationCodeSent && !verificationDone && (
              <>
                <View style={style.bottomSheetBodyContainer}>
                  <Text style={style.bottomSheetTittleText}>
                    Update Mobile Number
                  </Text>

                  <View
                    style={{
                      width: '100%',
                      height: 0.7,
                      backgroundColor: '#E7E7E7',
                      marginTop: 20,
                    }}
                  />

                  <View style={{marginHorizontal: hp(30), marginTop: hp(15)}}>
                    <View>
                      <Text
                        style={[
                          style.bottomSheetBodyTitleText,
                          {marginTop: hp(10)},
                        ]}>
                        Current Mobile Number
                      </Text>
                    </View>

                    <View>
                      <TextInput
                        placeholder={maskedMobileString}
                        placeholderTextColor={'black'}
                        editable={false}
                        style={style.textInputContainer}
                      />
                    </View>

                    <Text
                      style={[
                        style.bottomSheetBodyTitleText,
                        {marginTop: hp(21)},
                      ]}>
                      New Mobile Number
                    </Text>

                    <TextInput
                      onChangeText={handleNewMobileChange} // Handle changes in the new mobile number
                      placeholder={'Type'}
                      keyboardType="numeric" // Show numeric keyboard
                      maxLength={10}
                      value={newMobile}
                      style={style.textInputContainer}
                    />

                    <View style={style.bottomSheetButtonContainer}>
                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => bottomSheetRef.current.close()}>
                        <LinearGradient
                          colors={['#0D4EB3', '#9413D0']}
                          style={style.bottomSheetNotNowContainer}>
                          <View style={style.notNowButtonContainer}>
                            <Text style={style.notNowButtonTextStyle}>
                              Not Now
                            </Text>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          // setVerificationCodeSent(true);
                          onMobileChangePress();
                        }}>
                        <LinearGradient
                          colors={['#0D4EB3', '#9413D0']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 0}}
                          // style={style.submitButtonContainer}
                          style={[
                            style.submitButtonContainer,
                            {opacity: isMobileValid ? 1 : 0.5}, // visually show it's disabled
                          ]}>
                          <Text style={style.submitButtonTextStyle}>
                            Submit
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </>
            )}
            {verificationCodeSent && !verificationDone && (
              <>
                <View style={style.bottomSheetBodyContainer}>
                  <Text style={style.verificationTextStyle}>
                    Verification Code
                  </Text>

                  <Text style={style.verificationSubTextStyle}>
                    Verification Code sent {currentMobile}
                  </Text>

                  <View style={style.verificationBottomLineContainer}>
                    <View style={style.verificationLineStyle} />
                    <View style={style.verificationLineStyle} />
                    <View style={style.verificationLineStyle} />
                    <View style={style.verificationLineStyle} />
                  </View>

                  <Text style={style.resendTextStyle}>Resend in 57 sec</Text>

                  <View style={style.bottomSheetButtonContainer}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() => bottomSheetRef.current.close()}>
                      <LinearGradient
                        colors={['#0D4EB3', '#9413D0']}
                        style={style.bottomSheetNotNowContainer}>
                        <View style={style.notNowButtonContainer}>
                          <Text style={style.notNowButtonTextStyle}>
                            Not Now
                          </Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={handleVerificationSubmit}>
                      <LinearGradient
                        colors={['#0D4EB3', '#9413D0']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 0}}
                        style={style.submitButtonContainer}>
                        <Text style={style.submitButtonTextStyle}>Submit</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
            {verificationDone && (
              <>
                <View style={{flex: 1}}>
                  <Image
                    source={icons.confirm_check_icon}
                    style={style.conformIconStyle}
                  />

                  <Text style={style.updateTextStyle}>
                    Mobile Number has been updated
                  </Text>

                  <TouchableOpacity
                    style={style.okButtonContainer}
                    activeOpacity={0.5}
                    onPress={handleCloseBottomSheet}>
                    <LinearGradient
                      colors={['#0D4EB3', '#9413D0']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}
                      style={style.okButtonBodyStyle}>
                      <Text style={style.okButtonTextStyle}>Ok</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  const renderBottomSheetEmailChangeContent = () => {
    return (
      <View style={style.bottomSheetContainer}>
        <Text style={style.bottomSheetTittleText}>Verify Email</Text>

        <View
          style={{
            width: '100%',
            height: 0.7,
            backgroundColor: '#E7E7E7',
            marginTop: 20,
          }}
        />

        <Text
          style={{
            textAlign: 'center',
            marginTop: hp(34),
            fontSize: fontSize(14),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins400,
            color: '#AEAEAE',
          }}>
          OTP sent on{' '}
          <Text style={{color: colors.black}}> {maskEmail(newEmail)}</Text>
        </Text>

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

        <View style={{alignSelf: 'center', top: -5}}>
          {resendAvailable ? (
            <TouchableOpacity
              onPress={() => {
                setTimer(120);
                setResendAvailable(false);
                // You can also trigger resend OTP API here
                handleSubmit();
              }}>
              <Text style={{color: colors.black, fontWeight: 'bold'}}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{color: colors.lightGray}}>
              Resend in{' '}
              <Text style={{color: colors.black}}>{formatTime(timer)} Min</Text>
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={{marginTop: hp(45)}}
          activeOpacity={0.7}
          onPress={onChangeEmailPress}>
          <LinearGradient
            colors={['#0F52BA', '#8225AF']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1.2}}
            style={{
              width: '85%',
              height: hp(50),
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              // marginTop: hp(75),
            }}>
            {loader ? (
              <ActivityIndicator size="large" color={colors.white} />
            ) : (
              <Text
                style={{
                  color: 'white',
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Verify Code
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const maskedMobileStrings = currentMobileString
    ? `*******${String(newMobile).slice(-3)}`
    : 'N/A';

  const renderBottomSheetMobileNumberChangeContent = () => {
    return (
      <View style={style.bottomSheetContainer}>
        <Text style={style.bottomSheetTittleText}>Verify Mobile Number</Text>

        <View
          style={{
            width: '100%',
            height: 0.7,
            backgroundColor: '#E7E7E7',
            marginTop: 20,
          }}
        />

        <Text
          style={{
            textAlign: 'center',
            marginTop: hp(34),
            fontSize: fontSize(14),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins400,
            color: '#AEAEAE',
          }}>
          OTP sent on{' '}
          <Text style={{color: colors.black}}>
            {' '}
            {maskEmail(maskedMobileStrings)}
          </Text>
        </Text>

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

        <View style={{alignSelf: 'center', top: -5}}>
          {resendAvailable ? (
            <TouchableOpacity
              onPress={() => {
                setTimer(120);
                setResendAvailable(false);
                // You can also trigger resend OTP API here
                onMobileChangePress();
              }}>
              <Text style={{color: colors.black, fontWeight: 'bold'}}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          ) : (
            <Text style={{color: colors.lightGray}}>
              Resend in{' '}
              <Text style={{color: colors.black}}>{formatTime(timer)} Min</Text>
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={{marginTop: hp(45)}}
          activeOpacity={0.7}
          onPress={onChangeNumberNumberPress}>
          <LinearGradient
            colors={['#0F52BA', '#8225AF']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1.2}}
            style={{
              width: '85%',
              height: hp(50),
              borderRadius: 50,
              alignItems: 'center',
              justifyContent: 'center',
              alignSelf: 'center',
              // marginTop: hp(75),
            }}>
            {loader ? (
              <ActivityIndicator size="large" color={colors.white} />
            ) : (
              <Text
                style={{
                  color: 'white',
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Verify Code
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  };

  const renderPasswordBottomSheetContent = () => {
    return (
      <View style={style.bottomSheetContainer}>
        <Text style={style.bottomSheetTittleText}>Update Password</Text>

        <View
          style={{
            width: '100%',
            height: 0.7,
            backgroundColor: '#E7E7E7',
            marginTop: 20,
          }}
        />

        <View
          style={[
            style.bottomSheetBodyContainer,
            {marginTop: hp(21), marginHorizontal: hp(30)},
          ]}>
          <Text style={style.bottomSheetBodyTitleText}>
            Enter Current Password
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              placeholder={'Type'}
              style={style.textInputContainer}
              secureTextEntry={!isCurrentPasswordVisible}
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TouchableOpacity
              style={{position: 'absolute', right: 15}}
              onPress={() =>
                setIsCurrentPasswordVisible(!isCurrentPasswordVisible)
              }>
              <Image
                source={
                  isCurrentPasswordVisible
                    ? icons.new_show_password_icon
                    : icons.new_secure_Eye_icon
                }
                style={{
                  width: hp(18),
                  height: hp(16),
                  resizeMode: 'contain',
                  top: 5,
                }}
              />
            </TouchableOpacity>
          </View>

          <Text style={[style.bottomSheetBodyTitleText, {marginTop: hp(21)}]}>
            New Password
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              placeholder={'Type'}
              style={style.textInputContainer}
              secureTextEntry={!isNewPasswordVisible}
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TouchableOpacity
              style={{position: 'absolute', right: 15}}
              onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}>
              <Image
                source={
                  isNewPasswordVisible
                    ? icons.new_show_password_icon
                    : icons.new_secure_Eye_icon
                }
                style={{
                  width: hp(18),
                  height: hp(16),
                  resizeMode: 'contain',
                  top: 5,
                }}
              />
            </TouchableOpacity>
          </View>

          <Text style={[style.bottomSheetBodyTitleText, {marginTop: hp(21)}]}>
            Confirm Password
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TextInput
              placeholder={'Type'}
              style={style.textInputContainer}
              secureTextEntry={!isConfirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity
              style={{position: 'absolute', right: 15}}
              onPress={() =>
                setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
              }>
              <Image
                source={
                  isConfirmPasswordVisible
                    ? icons.new_show_password_icon
                    : icons.new_secure_Eye_icon
                }
                style={{
                  width: hp(18),
                  height: hp(16),
                  resizeMode: 'contain',
                  top: 5,
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={style.bottomSheetButtonContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                passwordBottomSheetRef.current.close();
              }}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                style={style.bottomSheetNotNowContainer}>
                <View style={style.notNowButtonContainer}>
                  <Text style={style.notNowButtonTextStyle}>Not Now</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={onUpdatePasswordPress}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={style.submitButtonContainer}>
                <Text style={style.submitButtonTextStyle}>Submit</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />

          {/*<TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>*/}
          <TouchableOpacity activeOpacity={0.7} onPress={openTopBottomSheet}>
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

        <HomeTopSheetComponent
          isVisible={topModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        />

        <View style={style.headingTittleContainer}>
          {/*<Image*/}
          {/*  source={icons.credentials_icon}*/}
          {/*  style={style.headingCredentialsImageStyle}*/}
          {/*/>*/}

          <Text style={style.headingCredentialsText}>Login Info</Text>

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

      <View style={style.credentialBodyContainer}>
        <View style={{marginHorizontal: 17}}>
          <Text style={style.bodyCredentialsTittleText}>Email</Text>

          <View style={style.bodyFillFullContainer}>
            <Text style={style.UserEmailTextStyle}>{currentEmail}</Text>

            <Image
              source={icons.green_check_icon}
              style={style.checkIconStyle}
            />

            <TouchableOpacity
              style={style.editImageContainer}
              onPress={() => openBottomSheet('email')}>
              <Image source={icons.edit_icon} style={style.editImageStyle} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={style.descriptionBodyUnderlineStyle} />

        <View style={{marginHorizontal: 17}}>
          <Text style={[style.bodyCredentialsTittleText, {marginTop: 16}]}>
            Password
          </Text>

          <View style={style.bodyFillFullContainer}>
            <Text style={style.UserEmailTextStyle}>*********</Text>

            <TouchableOpacity
              style={style.editImageContainer}
              onPress={openPasswordBottomSheet}>
              <Image source={icons.edit_icon} style={style.editImageStyle} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={style.descriptionBodyUnderlineStyle} />

        <View style={{marginHorizontal: 17}}>
          <Text style={[style.bodyCredentialsTittleText, {marginTop: 16}]}>
            Mobile Number
          </Text>

          <View style={style.bodyFillFullContainer}>
            <Text style={style.UserEmailTextStyle}>{maskedMobile}</Text>

            <Image
              source={icons.green_check_icon}
              style={style.checkIconStyle}
            />

            <TouchableOpacity
              style={style.editImageContainer}
              onPress={() => openBottomSheet('mobile')}>
              <Image source={icons.edit_icon} style={style.editImageStyle} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={style.descriptionBodyUnderlineStyle} />
      </View>

      <RBSheet
        ref={bottomSheetRef}
        height={hp(430)}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          draggableIcon: {
            backgroundColor: '#ffffff',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        {renderBottomSheetContent()}
      </RBSheet>

      <RBSheet
        ref={bottomSheetEmailChangeRef}
        height={hp(430)}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onOpen={() => {
          setTimer(120); // Start timer when opened
          setResendAvailable(false);
        }}
        onClose={() => {
          setTimer(120); // Reset timer when closed
          setResendAvailable(false);
        }}
        customStyles={{
          draggableIcon: {
            backgroundColor: '#ffffff',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        {renderBottomSheetEmailChangeContent()}
      </RBSheet>

      <RBSheet
        ref={bottomSheetMobileNumberChangeRef}
        height={hp(430)}
        closeOnDragDown={true}
        closeOnPressMask={true}
        onOpen={() => {
          setTimer(120); // Start timer when opened
          setResendAvailable(false);
        }}
        onClose={() => {
          setTimer(120); // Reset timer when closed
          setResendAvailable(false);
        }}
        customStyles={{
          draggableIcon: {
            backgroundColor: '#ffffff',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        {renderBottomSheetMobileNumberChangeContent()}
      </RBSheet>

      <RBSheet
        ref={bottomSheetEmailChangeSubmitRef}
        height={hp(350)}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          draggableIcon: {
            backgroundColor: '#ffffff',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        {/*{renderBottomSheetEmailChangeContent()}*/}
        <View style={{flex: 1, alignItems: 'center'}}>
          <Image
            source={icons.confirm_check_icon}
            style={{
              tintColor: '#0F52BA',
              marginTop: hp(45),
              height: hp(40),
              width: hp(40),
              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              marginTop: hp(48),
              fontSize: fontSize(18),
              lineHeight: hp(26),
              fontFamily: fontFamily.poppins400,
              color: colors.black,
            }}>
            Email has been updated
          </Text>

          <TouchableOpacity
            style={{marginTop: hp(45)}}
            activeOpacity={0.7}
            // onPress={onChangeEmailPress}
            onPress={() => {
              bottomSheetEmailChangeSubmitRef.current.close();
            }}>
            <LinearGradient
              colors={['#0F52BA', '#8225AF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1.2}}
              style={{
                width: hp(120),
                height: hp(50),
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                // marginTop: hp(75),
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Ok
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </RBSheet>

      <RBSheet
        ref={bottomSheetMobileNumberChangeSubmitRef}
        height={hp(350)}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          draggableIcon: {
            backgroundColor: '#ffffff',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        {/*{renderBottomSheetEmailChangeContent()}*/}
        <View style={{flex: 1, alignItems: 'center'}}>
          <Image
            source={icons.confirm_check_icon}
            style={{
              tintColor: '#0F52BA',
              marginTop: hp(45),
              height: hp(40),
              width: hp(40),
              resizeMode: 'contain',
            }}
          />
          <Text
            style={{
              marginTop: hp(48),
              fontSize: fontSize(18),
              lineHeight: hp(26),
              fontFamily: fontFamily.poppins400,
              color: colors.black,
            }}>
            Mobile Number has been updated
          </Text>

          <TouchableOpacity
            style={{marginTop: hp(45)}}
            activeOpacity={0.7}
            // onPress={onChangeEmailPress}
            onPress={() => {
              bottomSheetMobileNumberChangeSubmitRef.current.close();
            }}>
            <LinearGradient
              colors={['#0F52BA', '#8225AF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1.2}}
              style={{
                width: hp(120),
                height: hp(50),
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                // marginTop: hp(75),
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Ok
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </RBSheet>

      <RBSheet
        ref={passwordBottomSheetRef}
        height={isIOS ? hp(550) : hp(530)} // Adjust the height as per your requirement
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          draggableIcon: {
            backgroundColor: '#ffffff',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        {renderPasswordBottomSheetContent()}
      </RBSheet>

      {/*PASSWORD CHANGE SECOND BOTTOMSHEET*/}
      <RBSheet
        ref={bottomSheetPasswordChangeRef2}
        height={hp(350)} // Set the height of the bottom sheet
        closeOnPressMask={false} // Allows closing when clicking outside the bottom sheet
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          },
        }}>
        <View>
          <Image
            source={icons.confirm_check_icon}
            tintColor={colors.blue}
            style={{
              alignSelf: 'center',
              height: hp(40),
              width: hp(40),
              resizeMode: 'contain',
              marginTop: hp(30),
            }}
          />
          <Text
            style={{
              color: 'black',
              textAlign: 'center',
              marginTop: hp(31),
              fontSize: fontSize(18),
              lineHeight: hp(27),
              fontFamily: fontFamily.poppins400,
            }}>
            Password has been changed
          </Text>

          <Text
            style={{
              color: '#9B9B9B',
              textAlign: 'center',
              marginTop: hp(5),
              fontSize: fontSize(12),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins400,
            }}>
            Please login again to confirm the credentials
          </Text>

          <TouchableOpacity
            style={{marginTop: 50, alignItems: 'center'}}
            onPress={closeSecondBottomSheet} // Close the second bottom sheet
          >
            <LinearGradient
              colors={['#0D4EB3', '#9413D0']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0.5}}
              style={{
                // marginTop: hp(50),
                width: wp(176),
                height: hp(50),
                borderRadius: 25,
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  dispatch(logout(), () => dispatch(changeStack()));
                }}>
                <Text
                  style={{
                    color: colors.white,
                    textAlign: 'center',
                    fontSize: fontSize(16),
                    lineHeight: hp(26),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  Login Again
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: hp(20),
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

export default CredentialsScreen;
