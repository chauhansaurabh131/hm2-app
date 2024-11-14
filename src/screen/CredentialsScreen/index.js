import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
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

const CredentialsScreen = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef();
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

  const apiDispatch = useDispatch();

  const {user} = useSelector(state => state.auth);

  const userImage = user?.user?.profilePic;

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

  const handleSubmit = () => {
    // if (newEmail.trim() !== '') {
    //   setCurrentEmail(newEmail);
    // }

    console.log(' === newEmail ===> ', newEmail);

    apiDispatch(updateDetails({email: newEmail}));

    bottomSheetRef.current.close();
    passwordBottomSheetRef.current.close();
  };

  // const onUpdatePasswordPress = () => {
  //   if (newPassword === confirmPassword) {
  //     passwordBottomSheetRef.current.close();
  //     setTimeout(() => {
  //       bottomSheetPasswordChangeRef2.current.open();
  //     }, 100); // Small delay to ensure the first sheet closes before opening the second
  //   } else {
  //     Alert.alert(
  //       'Password Mismatch',
  //       'New Password and Confirm Password do not match.',
  //     );
  //   }
  // };

  const onUpdatePasswordPress = async () => {
    // Check if new password and confirm password match
    if (newPassword === confirmPassword) {
      try {
        console.log('Making API call with token:', token); // Debugging line

        // Make the API call
        const response = await fetch(
          'https://happymilan.tech/api/v1/user/auth/update-password',
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

  const onMobileChangePress = () => {
    // setVerificationCodeSent(true);

    apiDispatch(updateDetails({mobileNumber: newMobile}));

    bottomSheetRef.current.close();
    passwordBottomSheetRef.current.close();
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
            <View style={{marginHorizontal: 30}}>
              <Text style={style.bottomSheetTittleText}>Update Email</Text>
            </View>

            <View
              style={{
                width: '100%',
                height: 0.7,
                backgroundColor: '#E7E7E7',
                marginTop: 20,
              }}
            />

            <View style={[style.bottomSheetBodyContainer, {marginTop: 15}]}>
              <Text style={style.bottomSheetBodyTitleText}>Current Email</Text>

              <TextInput
                placeholder={currentEmail}
                placeholderTextColor={'black'}
                editable={false}
                style={style.textInputContainer}
              />

              <Text style={style.bottomSheetBodyTitleText}>New Email</Text>

              <TextInput
                onChangeText={handleEmailChange}
                placeholder={'Type'}
                style={style.textInputContainer}
              />

              <View style={style.bottomSheetButtonContainer}>
                <TouchableOpacity activeOpacity={0.7} onPress={handleSubmit}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    style={style.bottomSheetNotNowContainer}>
                    <View style={style.notNowButtonContainer}>
                      <Text style={style.notNowButtonTextStyle}>Not Now</Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5} onPress={handleSubmit}>
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

                  <View style={{marginTop: 15}}>
                    <Text style={style.bottomSheetBodyTitleText}>
                      Current Mobile Number
                    </Text>
                  </View>

                  <TextInput
                    placeholder={maskedMobileString}
                    placeholderTextColor={'black'}
                    editable={false}
                    style={style.textInputContainer}
                  />

                  <Text style={style.bottomSheetBodyTitleText}>
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
                        style={style.submitButtonContainer}>
                        <Text style={style.submitButtonTextStyle}>Submit</Text>
                      </LinearGradient>
                    </TouchableOpacity>
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

  const renderPasswordBottomSheetContent = () => {
    return (
      <View style={style.bottomSheetContainer}>
        <View style={{marginHorizontal: 30}}>
          <Text style={style.bottomSheetTittleText}>Update Password</Text>
        </View>

        <View
          style={{
            width: '100%',
            height: 0.7,
            backgroundColor: '#E7E7E7',
            marginTop: 20,
          }}
        />

        <View style={[style.bottomSheetBodyContainer, {marginTop: 15}]}>
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
                    ? icons.show_Password_icon
                    : icons.secureEyeLogo
                }
                style={{
                  width: hp(16),
                  height: hp(14),
                  resizeMode: 'contain',
                  top: 5,
                }}
              />
            </TouchableOpacity>
          </View>

          <Text style={style.bottomSheetBodyTitleText}>New Password</Text>

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
                    ? icons.show_Password_icon
                    : icons.secureEyeLogo
                }
                style={{
                  width: hp(16),
                  height: hp(14),
                  resizeMode: 'contain',
                  top: 5,
                }}
              />
            </TouchableOpacity>
          </View>

          <Text style={style.bottomSheetBodyTitleText}>Confirm Password</Text>

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
                    ? icons.show_Password_icon
                    : icons.secureEyeLogo
                }
                style={{
                  width: hp(16),
                  height: hp(14),
                  resizeMode: 'contain',
                  top: 5,
                }}
              />
            </TouchableOpacity>
          </View>

          <View style={style.bottomSheetButtonContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={handleSubmit}>
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

          <TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.profileImageStyle}
            />
          </TouchableOpacity>
        </View>

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

          <Text style={style.headingCredentialsText}>Login Details</Text>

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
        height={430}
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
        ref={passwordBottomSheetRef}
        height={isIOS ? 550 : 530} // Adjust the height as per your requirement
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
        height={350} // Set the height of the bottom sheet
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

export default CredentialsScreen;
