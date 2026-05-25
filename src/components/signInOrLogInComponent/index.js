import React from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {useNavigation} from '@react-navigation/native';

const SignInOrLogInComponent = ({visible, onClose, onSignUp, onLogin}) => {
  const navigation = useNavigation();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      {/* OUTSIDE CLICK */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: wp(20),
          }}>
          {/* STOP INSIDE CLICK */}
          <TouchableWithoutFeedback>
            <View
              style={{
                width: '100%',
                backgroundColor: colors.white,
                borderRadius: hp(18),
                paddingHorizontal: wp(42),
              }}>
              {/* TITLE */}
              <Text
                style={{
                  textAlign: 'center',
                  color: colors.pureBlack,
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins400,
                  marginTop: hp(38),
                }}>
                Log in or create an account{'\n'}
                to continue.
              </Text>

              {/* BUTTONS */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp(28),
                  marginBottom: hp(35),
                }}>
                {/* SIGN UP */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    onClose();

                    navigation.replace('NewSignUpScreen');
                  }}
                  style={{
                    width: wp(122),
                    height: hp(50),
                    borderRadius: hp(25),
                    backgroundColor: '#7148E4',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: fontSize(16),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Sign Up
                  </Text>
                </TouchableOpacity>

                {/* LOGIN */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    onClose();

                    navigation.replace('NewLogInScreen');
                  }}
                  style={{
                    width: wp(122),
                    height: hp(50),
                    borderRadius: hp(25),
                    borderWidth: hp(1),
                    borderColor: '#7148E4',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: '#7148E4',
                      fontSize: fontSize(16),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SignInOrLogInComponent;
