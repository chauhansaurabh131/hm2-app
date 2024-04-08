import React, {useRef, useState} from 'react';
import {
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
import {isIOS} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';

const CredentialsScreen = () => {
  const navigation = useNavigation();
  const bottomSheetRef = useRef();
  const passwordBottomSheetRef = useRef();
  const [selectedCredential, setSelectedCredential] = useState(null);
  const [currentEmail, setCurrentEmail] = useState('jit*****@gmail.com');
  const [newEmail, setNewEmail] = useState('');
  const [currentMobile, setCurrentMobile] = useState('*******902');
  const [newMobile, setNewMobile] = useState(''); // New mobile number
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [verificationDone, setVerificationDone] = useState(false);

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
    if (newEmail.trim() !== '') {
      setCurrentEmail(newEmail);
    }

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

  const renderBottomSheetContent = () => {
    switch (selectedCredential) {
      case 'email':
        return (
          <View style={style.bottomSheetContainer}>
            <Text style={style.bottomSheetTittleText}>Update Email</Text>

            <View style={style.bottomSheetBodyContainer}>
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

                  <Text style={style.bottomSheetBodyTitleText}>
                    Current Mobile Number
                  </Text>

                  <TextInput
                    value={
                      currentMobile.substring(0, 7).replace(/\d/g, '*') +
                      currentMobile.substring(7)
                    } // Show first 7 digits as asterisks and last 3 digits as numbers
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
                        setVerificationCodeSent(true);
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
        <Text style={style.bottomSheetTittleText}>Update Password</Text>

        <View style={style.bottomSheetBodyContainer}>
          <Text style={style.bottomSheetBodyTitleText}>
            Enter Current Password
          </Text>

          <TextInput placeholder={'Type'} style={style.textInputContainer} />

          <Text style={style.bottomSheetBodyTitleText}>New Password</Text>

          <TextInput placeholder={'Type'} style={style.textInputContainer} />

          <Text style={style.bottomSheetBodyTitleText}>Confirm Password</Text>

          <TextInput placeholder={'Type'} style={style.textInputContainer} />

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
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />

          <Image
            source={images.profileDisplayImage}
            style={style.profileImageStyle}
          />
        </View>

        <View style={style.headingTittleContainer}>
          <Image
            source={icons.credentials_icon}
            style={style.headingCredentialsImageStyle}
          />

          <Text style={style.headingCredentialsText}>Credentials</Text>

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
        <Text style={style.bodyCredentialsTittleText}>Email</Text>

        <View style={style.bodyFillFullContainer}>
          <Text style={style.UserEmailTextStyle}>{currentEmail}</Text>

          <Image source={icons.green_check_icon} style={style.checkIconStyle} />

          <TouchableOpacity
            style={style.editImageContainer}
            onPress={() => openBottomSheet('email')}>
            <Image source={icons.edit_icon} style={style.editImageStyle} />
          </TouchableOpacity>
        </View>

        <View style={style.descriptionBodyUnderlineStyle} />

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

        <View style={style.descriptionBodyUnderlineStyle} />

        <Text style={[style.bodyCredentialsTittleText, {marginTop: 16}]}>
          Mobile Number
        </Text>

        <View style={style.bodyFillFullContainer}>
          <Text style={style.UserEmailTextStyle}>
            {currentMobile.substring(0, 7).replace(/\d/g, '*') +
              currentMobile.substring(7)}
          </Text>

          <Image source={icons.green_check_icon} style={style.checkIconStyle} />

          <TouchableOpacity
            style={style.editImageContainer}
            onPress={() => openBottomSheet('mobile')}>
            <Image source={icons.edit_icon} style={style.editImageStyle} />
          </TouchableOpacity>
        </View>

        <View style={style.descriptionBodyUnderlineStyle} />
      </View>

      <RBSheet
        ref={bottomSheetRef}
        height={420}
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
        height={isIOS ? 550 : 500} // Adjust the height as per your requirement
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
    </SafeAreaView>
  );
};

export default CredentialsScreen;
