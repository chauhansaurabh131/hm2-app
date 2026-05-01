import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../../utils/helpers';
import {icons} from '../../../assets';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';
import {addressDetails, updateDetails} from '../../../actions/homeActions';
import RBSheet from 'react-native-raw-bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import style from '../../CredentialsScreen/style';

const ModifyContactScreen = () => {
  const route = useRoute();
  const userData = route?.params?.UserData || {};
  const {user} = useSelector(state => state.auth);
  const token = user?.tokens?.access?.token;
  const navigation = useNavigation();
  const apiDispatch = useDispatch();
  const refRBSheet = useRef();
  const bottomSheetMobileNumberChangeRef = useRef();
  const inputRefs = useRef([]);
  const bottomSheetMobileNumberChangeSubmitRef = useRef();
  const emailRefRBSheet = useRef();
  const bottomSheetEmailChangeRef = useRef();
  const bottomSheetEmailChangeSubmitRef = useRef();

  const [loading, setLoading] = useState(false);
  const [currentNumber, setCurrentNumber] = useState(
    userData?.mobileNumber || '',
  );
  const [newMobileNumber, setNewMobileNumber] = useState('');

  const [currentEmail, setCurrentEmail] = useState(userData?.email || '');
  const [newEmail, setNewEmail] = useState('');
  const isValidNumber = newMobileNumber?.length === 10;
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendAvailable, setResendAvailable] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes

  // console.log(' === userData--- ===> ', userData?.email);

  const formatMaskedEmail = email => {
    if (!email) {
      return 'N/A';
    }

    const [name, domain] = email.split('@');

    if (!name || !domain) {
      return email;
    }

    const firstThree = name.slice(0, 3);

    return `${firstThree}****@${domain}`;
  };

  // Format seconds as MM:SS
  const formatTime = seconds => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
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

  const handleNewMobileChange = text => {
    const numericValue = text.replace(/[^0-9]/g, '');

    setNewMobileNumber(numericValue);
  };

  const handleEmailChange = text => {
    setNewEmail(text);
  };

  const onMobileChangePress = async () => {
    setLoading(true);

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
              currentMobileNumber: currentNumber,
              newMobileNumber: newMobileNumber,
            },
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log('OTP sent successfully:', data);

        setLoading(false);

        // ✅ FIRST close current sheet
        refRBSheet.current.close();

        // ✅ THEN open next sheet (with delay for smooth animation)
        setTimeout(() => {
          bottomSheetMobileNumberChangeRef.current.open();
        }, 300);
      } else {
        console.warn('Failed to send OTP:', data.message || data);

        Alert.alert('Error', data?.message || 'Failed to send OTP');

        setLoading(false);
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setLoading(false);
    }
  };

  const onChangeNumberNumberPress = () => {
    const enteredOtp = otp.join('');
    console.log('=== enteredOtp ===> ', enteredOtp);
    setLoading(true);

    const payload = {
      mobileNumber: {
        currentMobileNumber: currentNumber,
        newMobileNumber: newMobileNumber,
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
          setLoading(false);
          apiDispatch(updateDetails());
          bottomSheetMobileNumberChangeRef.current.close();
          bottomSheetMobileNumberChangeSubmitRef.current.open();
          setOtp(['', '', '', '']);
        } else {
          // ❌ OTP is invalid or other server-side issue
          setLoading(false);
          setOtp(['', '', '', '']);
          alert(data?.data?.message || 'Something went wrong.');
        }
      })
      .catch(error => {
        console.error('❌ Error:', error);
        setLoading(false);
        setOtp(['', '', '', '']);
        alert('Network error. Please try again.');
      });
  };

  const handleSubmit = async () => {
    console.log('=== newEmail ===>', newEmail);
    setLoading(true);

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

        setLoading(false);

        // ✅ success → close & open
        emailRefRBSheet.current.close();

        setTimeout(() => {
          bottomSheetEmailChangeRef.current.open();
        }, 300);
      } else {
        console.warn('Failed to send OTP:', data.message || data);

        setLoading(false);

        // ❌ do NOT close sheet
        // ❌ do NOT open next sheet

        // ✅ show alert
        Alert.alert('Error', data?.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);

      setLoading(false);

      // ✅ network error alert
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handleSubmitEmail = async () => {
    console.log('=== newEmail ===>', newEmail);
    setLoading(true);

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
        setLoading(false);

        // Open OTP verification bottom sheet
        bottomSheetEmailChangeRef.current.open();

        // Optionally close other bottom sheets
        // bottomSheetRef.current.close();
        // passwordBottomSheetRef.current.close();
      } else {
        console.warn('Failed to send OTP:', data.message || data);
        setLoading(false);
        // Show error message to user if needed
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      setLoading(false);
    }
  };

  const onChangeEmailPress = async () => {
    const enteredOtp = otp.join('');
    console.log('=== enteredOtp ===> ', enteredOtp);

    setLoading(true);

    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/auth/verify-otp-change-email',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: {
              currentEmail,
              newEmail,
              otp: enteredOtp,
            },
          }),
        },
      );

      const data = await response.json();
      console.log('✅ Response:', data);

      if (response.ok && data?.data?.success === true) {
        // ✅ SUCCESS FLOW
        setLoading(false);

        apiDispatch(updateDetails());

        // 🔥 CLOSE CURRENT SHEET
        bottomSheetEmailChangeRef.current.close();

        // 🔥 OPEN NEXT SHEET (DELAY)
        setTimeout(() => {
          bottomSheetEmailChangeSubmitRef.current.open();
        }, 300);

        setOtp(['', '', '', '']);
      } else {
        // ❌ FAIL FLOW
        setLoading(false);
        setOtp(['', '', '', '']);

        Alert.alert('Error', data?.data?.message || 'Invalid OTP');

        // ❌ DO NOT CLOSE
        // ❌ DO NOT NAVIGATE
      }
    } catch (error) {
      console.error('❌ Error:', error);

      setLoading(false);
      setOtp(['', '', '', '']);

      Alert.alert('Error', 'Network error. Please try again.');

      // ❌ stay on same sheet
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* 🔥 HEADER */}
      <View
        style={{
          height: hp(54),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: 0,
            width: wp(50),
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{
              width: hp(14),
              height: hp(14),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins600,
          }}>
          Modify Contact
        </Text>
      </View>

      {/* 🔥 DIVIDER */}
      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#EDEDED',
        }}
      />

      <View style={{marginTop: hp(25), paddingHorizontal: wp(17)}}>
        <TouchableOpacity
          onPress={() => refRBSheet.current.open()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: '#7B7B7B',
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Mobile Number
          </Text>

          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins600,
              marginRight: wp(25),
              top: 2,
            }}>
            {currentNumber
              ? `+91 *******${currentNumber.toString().slice(-3)}`
              : 'N/A'}
          </Text>

          <View style={{position: 'absolute', right: 8}}>
            <Image
              source={icons.left_arrow_icon}
              style={{
                tintColor: 'black',
                width: hp(6),
                height: hp(10),
                // top: -2,
              }}
            />
          </View>
        </TouchableOpacity>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(5),
          }}
        />

        <TouchableOpacity
          onPress={() => emailRefRBSheet.current.open()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: hp(30),
          }}>
          <Text
            style={{
              color: '#7B7B7B',
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Email
          </Text>

          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins600,
              marginRight: wp(25),
              top: 2,
            }}>
            {formatMaskedEmail(currentEmail)}
            {/*{currentEmail}*/}
          </Text>

          <View style={{position: 'absolute', right: 8}}>
            <Image
              source={icons.left_arrow_icon}
              style={{
                tintColor: 'black',
                width: hp(6),
                height: hp(10),
                // top: -2,
              }}
            />
          </View>
        </TouchableOpacity>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(5),
          }}
        />
      </View>

      {/* 🔥 SAVE BUTTON */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
          height: hp(100),
          // backgroundColor: 'white',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          activeOpacity={0.6}
          style={{
            width: '93%',
            height: hp(50),
            borderRadius: hp(25),
            backgroundColor: colors.pureBlack,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: hp(30),
          }}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: 'white',
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
              }}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <RBSheet
        ref={refRBSheet}
        height={hp(400)}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(16),
            fontFamily: fontFamily.poppins500,
            color: colors.pureBlack,
            paddingHorizontal: wp(30),
            paddingVertical: hp(18),
          }}>
          Update Mobile Number
        </Text>

        <View
          style={{width: '100%', height: hp(1), backgroundColor: '#E7E7E7'}}
        />

        <View style={{marginTop: hp(36), paddingHorizontal: wp(30)}}>
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Current Mobile Number
          </Text>

          <View
            style={{
              borderWidth: hp(1),
              borderColor: '#CDCDCD',
              height: hp(50),
              borderRadius: hp(50),
              justifyContent: 'center',
              paddingHorizontal: wp(21),
              marginTop: hp(9),
            }}>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
              }}>
              {currentNumber
                ? `*******${currentNumber.toString().slice(-3)}`
                : 'N/A'}
            </Text>
          </View>

          <Text
            style={{
              marginTop: hp(21),
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            New Mobile Number
          </Text>

          <TextInput
            style={{
              width: '100%',
              height: hp(50),
              borderWidth: hp(1),
              borderRadius: hp(50),
              marginTop: hp(9),
              borderColor: '#CDCDCD',
              justifyContent: 'center',
              paddingHorizontal: wp(21),
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
              color: colors.pureBlack,
            }}
            value={newMobileNumber}
            onChangeText={handleNewMobileChange}
            placeholder={'Enter Mobile Number'}
            placeholderTextColor={'gray'}
            keyboardType={'number-pad'}
            maxLength={10}
          />

          <View
            style={{
              flexDirection: 'row',
              marginTop: hp(35),
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => refRBSheet.current.close()}>
              <LinearGradient
                colors={['#9413D0', '#0D4EB3']}
                style={{
                  width: wp(147),
                  height: hp(50),
                  borderRadius: 50,
                  borderWidth: hp(1),
                  justifyContent: 'center',
                  borderColor: 'transparent',
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    borderRadius: 50,
                    flex: 1,
                    backgroundColor: colors.white,
                    justifyContent: 'center',
                    margin: isIOS ? 0 : 1,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      backgroundColor: 'transparent',
                      color: colors.black,
                      margin: 10,
                      fontSize: fontSize(16),
                      lineHeight: hp(24),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Not Now
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              disabled={!isValidNumber}
              // onPress={() => {
              //   refRBSheet.current.close();
              //
              //   setTimeout(() => {
              //     // bottomSheetMobileNumberChangeRef.current.open();
              //     onMobileChangePress();
              //   }, 200);
              // }}

              onPress={() => {
                onMobileChangePress(); // ✅ only API call
              }}>
              <LinearGradient
                colors={['#7045EB', '#4819CB']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                // style={style.submitButtonContainer}
                style={{
                  width: wp(147),
                  height: hp(50),
                  borderRadius: 50,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  opacity: isValidNumber ? 1 : 0.6,
                }}>
                {loading ? (
                  <ActivityIndicator color={'white'} size={'large'} /> // ✅ loader
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: colors.white,
                      fontSize: fontSize(16),
                      lineHeight: hp(24),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Submit
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>

      <RBSheet
        ref={bottomSheetMobileNumberChangeRef}
        height={hp(400)}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(16),
            fontFamily: fontFamily.poppins500,
            color: colors.pureBlack,
            paddingHorizontal: wp(30),
            paddingVertical: hp(18),
          }}>
          Verify Mobile Number
        </Text>

        <View
          style={{width: '100%', height: hp(1), backgroundColor: '#E7E7E7'}}
        />

        <View style={{marginTop: hp(34), paddingHorizontal: wp(30)}}>
          <Text
            style={{
              color: '#AEAEAE',
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
              alignSelf: 'center',
            }}>
            OTP sent on{' '}
            <Text
              style={{
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
                color: colors.pureBlack,
              }}>
              {/*{newMobileNumber}*/}
              {newMobileNumber
                ? `*******${newMobileNumber.toString().slice(-3)}`
                : 'N/A'}
            </Text>
          </Text>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: wp(330),
                height: hp(150),
              }}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  value={digit}
                  onChangeText={value => handleOtpChange(value, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  secureTextEntry={false}
                  style={[
                    {
                      width: wp(60),
                      height: hp(50),
                      textAlign: 'center',
                      fontSize: fontSize(24),
                      borderBottomWidth: 1,
                      borderBottomColor: '#D9D9D9',
                      fontWeight: 'bold',
                    },
                    digit
                      ? {borderBottomColor: colors.black}
                      : {borderBottomColor: '#D9D9D9'},
                    digit ? {color: colors.black} : {color: '#D9D9D9'},
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
                  // handleSubmit();
                  onMobileChangePress();
                }}>
                <Text style={{color: colors.black, fontWeight: 'bold'}}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{color: colors.lightGray}}>
                Resend in{' '}
                <Text style={{color: colors.black}}>
                  {formatTime(timer)} Min
                </Text>
              </Text>
            )}
          </View>

          {/*<Text style={{color: 'black'}}>{newMobileNumber}</Text>*/}

          <TouchableOpacity
            activeOpacity={0.5}
            // onPress={() => {
            //     // setVerificationCodeSent(true);
            //     onMobileChangePress();
            // }}

            onPress={() => {
              bottomSheetMobileNumberChangeRef.current.close();
              bottomSheetMobileNumberChangeSubmitRef.current.open();
              onChangeNumberNumberPress();
            }}>
            <LinearGradient
              colors={['#7045EB', '#4819CB']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              // style={style.submitButtonContainer}
              style={{
                width: '100%',
                height: hp(50),
                borderRadius: 50,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(50),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.white,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Verfiy Code
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
            // onPress={() => {
            //   bottomSheetMobileNumberChangeSubmitRef.current.close();
            //   setNewMobileNumber('');
            // }}

            onPress={() => {
              if (newMobileNumber) {
                setCurrentNumber(newMobileNumber); // ✅ update current number
              }

              bottomSheetMobileNumberChangeSubmitRef.current.close();

              setNewMobileNumber(''); // clear after update
            }}>
            <LinearGradient
              colors={['#7045EB', '#4819CB']}
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

      {/*EMAIL UPDATE BOTTOM SHEET*/}
      <RBSheet
        ref={emailRefRBSheet}
        height={hp(400)}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(16),
            fontFamily: fontFamily.poppins500,
            color: colors.pureBlack,
            paddingHorizontal: wp(30),
            paddingVertical: hp(18),
          }}>
          Update Email
        </Text>

        <View
          style={{width: '100%', height: hp(1), backgroundColor: '#E7E7E7'}}
        />

        <View style={{marginTop: hp(36), paddingHorizontal: wp(30)}}>
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Current Email
          </Text>

          <View
            style={{
              borderWidth: hp(1),
              borderColor: '#CDCDCD',
              height: hp(50),
              borderRadius: hp(50),
              justifyContent: 'center',
              paddingHorizontal: wp(21),
              marginTop: hp(9),
            }}>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
              }}>
              {formatMaskedEmail(currentEmail)}
            </Text>
          </View>

          <Text
            style={{
              marginTop: hp(21),
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            New Email
          </Text>

          <TextInput
            style={{
              width: '100%',
              height: hp(50),
              borderWidth: hp(1),
              borderRadius: hp(50),
              marginTop: hp(9),
              borderColor: '#CDCDCD',
              justifyContent: 'center',
              paddingHorizontal: wp(21),
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
              color: colors.pureBlack,
            }}
            value={newEmail}
            onChangeText={handleEmailChange}
            placeholder={'Enter New Email'}
            placeholderTextColor={'gray'}
          />

          <View
            style={{
              flexDirection: 'row',
              marginTop: hp(35),
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => emailRefRBSheet.current.close()}>
              <LinearGradient
                colors={['#9413D0', '#0D4EB3']}
                style={{
                  width: wp(147),
                  height: hp(50),
                  borderRadius: 50,
                  borderWidth: hp(1),
                  justifyContent: 'center',
                  borderColor: 'transparent',
                  overflow: 'hidden',
                }}>
                <View
                  style={{
                    borderRadius: 50,
                    flex: 1,
                    backgroundColor: colors.white,
                    justifyContent: 'center',
                    margin: isIOS ? 0 : 1,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      backgroundColor: 'transparent',
                      color: colors.black,
                      margin: 10,
                      fontSize: fontSize(16),
                      lineHeight: hp(24),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Not Now
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              // disabled={!isValidNumber}
              onPress={() => {
                // onMobileChangePress(); // ✅ only API call
                // emailRefRBSheet.current.close();
                // bottomSheetEmailChangeRef.current.open();
                handleSubmit();
              }}>
              <LinearGradient
                colors={['#7045EB', '#4819CB']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                // style={style.submitButtonContainer}
                style={{
                  width: wp(147),
                  height: hp(50),
                  borderRadius: 50,
                  justifyContent: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  // opacity: isValidNumber ? 1 : 0.6,
                }}>
                {loading ? (
                  <ActivityIndicator color={'white'} size={'large'} /> // ✅ loader
                ) : (
                  <Text
                    style={{
                      textAlign: 'center',
                      color: colors.white,
                      fontSize: fontSize(16),
                      lineHeight: hp(24),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Submit
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>

      <RBSheet
        ref={bottomSheetEmailChangeRef}
        height={hp(400)}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(16),
            fontFamily: fontFamily.poppins500,
            color: colors.pureBlack,
            paddingHorizontal: wp(30),
            paddingVertical: hp(18),
          }}>
          Verify Email
        </Text>

        <View
          style={{width: '100%', height: hp(1), backgroundColor: '#E7E7E7'}}
        />

        <View style={{marginTop: hp(34), paddingHorizontal: wp(30)}}>
          <Text
            style={{
              color: '#AEAEAE',
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
              alignSelf: 'center',
            }}>
            OTP sent on{' '}
            <Text
              style={{
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
                color: colors.pureBlack,
              }}>
              {/*{newMobileNumber}*/}
              {formatMaskedEmail(newEmail)}
            </Text>
          </Text>

          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: wp(330),
                height: hp(150),
              }}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  value={digit}
                  onChangeText={value => handleOtpChange(value, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  secureTextEntry={false}
                  style={[
                    {
                      width: wp(60),
                      height: hp(50),
                      textAlign: 'center',
                      fontSize: fontSize(24),
                      borderBottomWidth: 1,
                      borderBottomColor: '#D9D9D9',
                      fontWeight: 'bold',
                    },
                    digit
                      ? {borderBottomColor: colors.black}
                      : {borderBottomColor: '#D9D9D9'},
                    digit ? {color: colors.black} : {color: '#D9D9D9'},
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
                  // handleSubmit();
                  handleSubmitEmail();
                }}>
                <Text style={{color: colors.black, fontWeight: 'bold'}}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{color: colors.lightGray}}>
                Resend in{' '}
                <Text style={{color: colors.black}}>
                  {formatTime(timer)} Min
                </Text>
              </Text>
            )}
          </View>

          {/*<Text style={{color: 'black'}}>{newMobileNumber}</Text>*/}

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              // bottomSheetEmailChangeRef.current.close();
              // bottomSheetEmailChangeSubmitRef.current.open();
              onChangeEmailPress();
            }}>
            <LinearGradient
              colors={['#7045EB', '#4819CB']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              // style={style.submitButtonContainer}
              style={{
                width: '100%',
                height: hp(50),
                borderRadius: 50,
                justifyContent: 'center',
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(50),
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.white,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Verfiy Code
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
            // onPress={() => {
            //   bottomSheetMobileNumberChangeSubmitRef.current.close();
            //   setNewMobileNumber('');
            // }}

            onPress={() => {
              if (newEmail) {
                setCurrentEmail(newEmail); // ✅ update current number
              }

              bottomSheetEmailChangeSubmitRef.current.close();

              setNewEmail(''); // clear after update
            }}>
            <LinearGradient
              colors={['#7045EB', '#4819CB']}
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
    </SafeAreaView>
  );
};

export default ModifyContactScreen;
