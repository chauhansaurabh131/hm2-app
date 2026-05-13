import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Image,
  Keyboard,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import NewTextInputComponent from '../../components/newTextInputComponent';
import CommonGradientButton from '../../components/commonGradientButton';
import {useNavigation} from '@react-navigation/native';

const VendorSignUpScreen = () => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const navigation = useNavigation();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
        <Image
          source={images.happyMilanColorLogo}
          style={{
            marginTop: hp(15),
            marginLeft: wp(33),
            resizeMode: 'contain',
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
              marginTop: hp(70),
            }}>
            Join as Vendor
          </Text>

          <View style={{marginTop: hp(50)}}>
            <NewTextInputComponent
              value={name}
              // onChangeText={text => setName(text)}
              onChangeText={text => {
                // Capitalize first letter and keep rest the same
                const formattedText =
                  text.charAt(0).toUpperCase() + text.slice(1);
                setName(formattedText);
              }}
              placeholder="Business Name"
              LeftIconName={icons.profileLogo}
            />
            {nameError ? (
              <Text style={{marginTop: 2, color: 'red'}}>{nameError}</Text>
            ) : null}

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

            <CommonGradientButton
              buttonName={'Send Code'}
              containerStyle={{width: '100%', marginTop: hp(20)}}
              // onPress={handleSignUp}
              // loading={loading}
            />

            <View style={{alignItems: 'center', marginTop: hp(34)}}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(14),
                  lineHeight: hp(20),
                  fontFamily: fontFamily.poppins400,
                }}>
                By creating account, I Agree to Hapmeet
              </Text>

              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                // onPress={openPrivacyPolicy}
                >
                  <Text
                    style={{
                      color: colors.blue,
                      fontSize: fontSize(14),
                      lineHeight: hp(20),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(14),
                    lineHeight: hp(20),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  {' '}
                  and{' '}
                </Text>
                <TouchableOpacity
                // onPress={openTermAndCondition}
                >
                  <Text
                    style={{
                      color: colors.blue,
                      fontSize: fontSize(14),
                      lineHeight: hp(20),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    T&C
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/*BOTTOM DESIGN */}
        <View
          style={{
            // position: 'absolute',
            // bottom: 0,
            // alignSelf: 'center',
            // backgroundColor: 'red',
            marginTop: hp(40),
            alignSelf: 'center',
          }}>
          {Platform.OS !== 'ios' && (
            <View
              style={{
                width: wp(267),
                borderWidth: 0.5,
                borderColor: '#E1E1E1',
                alignSelf: 'center',
                marginBottom: hp(5),
              }}
            />
          )}

          <View
            style={{
              marginTop: Platform.OS === 'ios' ? hp(50) : 0,
            }}
          />

          {Platform.OS !== 'ios' && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(21),
                width: wp(267),
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  textAlign: 'center',
                  color: colors.black,
                  fontFamily: fontFamily.poppins400,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                or continue with
              </Text>

              <TouchableOpacity
                activeOpacity={0.5}
                // onPress={signIn}
                // onPress={isIOS ? handleAppleSignIn : signIn}
                style={{
                  width: hp(44),
                  height: hp(44),
                  borderRadius: hp(50),
                  borderColor: colors.lightGrayCircle,
                  borderWidth: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: wp(40),
                }}>
                <Image
                  source={icons.googleLogo}
                  // source={isIOS ? icons.apple_icon : icons.googleLogo}
                  style={{
                    height: hp(17.6),
                    width: hp(17.6),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>
          )}

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
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
              }}>
              Member Login
            </Text>
            <View>
              <Image
                source={images.profileVectorLogo}
                style={{
                  width: hp(16),
                  height: hp(16),
                  marginLeft: wp(10),
                  // top: 3,
                  tintColor: colors.black,
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default VendorSignUpScreen;
