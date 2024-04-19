import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import Modal from 'react-native-modal';
import {icons, images} from '../../assets';

import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

const HomeTopSheetComponent = ({
  isVisible,
  onBackdropPress,
  onBackButtonPress,
}) => {
  const navigation = useNavigation();

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalTop, setModalTop] = useState(new Animated.Value(20));

  useEffect(() => {
    let timeoutId;

    if (isVisible) {
      setModalTop(20);

      timeoutId = setTimeout(() => {
        setModalTop(prevTop => (prevTop === -40 ? -10 : -20));
      }, 400); // Adjust the duration as needed
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isVisible]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // const privacyPolicyPress = () => {};

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={toggleModal} />

      <Modal
        isVisible={isVisible}
        animationIn="slideInDown" // You can customize the animation here
        animationOut="slideOutUp" // You can customize the animation here
        onBackdropPress={onBackdropPress}
        onBackButtonPress={onBackButtonPress}
        style={{top: modalTop}}>
        <View
          style={{
            backgroundColor: 'white',
            // height: 514,
            width: '200%',
            position: 'absolute',
            top: -20,
            marginLeft: -20,
          }}>
          <View style={{marginTop: 23, marginHorizontal: wp(27)}}>
            <Image
              source={images.profileDisplayImage}
              style={{
                height: hp(60),
                width: hp(60),
                borderRadius: 50,
                marginTop: hp(23),
              }}
            />

            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(22),
                lineHeight: hp(33),
                fontWeight: '600',
                marginTop: hp(10),
              }}>
              Riya Shah
            </Text>

            <View style={{flexDirection: 'row', marginTop: hp(3)}}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  fontWeight: '500',
                }}>
                HM 10000122
              </Text>
              <View
                style={{
                  height: hp(13),
                  borderWidth: 0.9,
                  borderColor: '#BEBEBE',
                  marginLeft: hp(10),
                  marginRight: hp(10),
                  top: 5,
                }}
              />
              <Text
                style={{
                  color: '#BEBEBE',
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  fontWeight: '500',
                }}>
                FREE Profile
              </Text>
            </View>

            <TouchableOpacity activeOpacity={0.7} style={{marginTop: hp(9)}}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1.5}}
                style={{
                  width: 136,
                  height: 40,
                  borderRadius: 10,
                  flexDirection: 'row',
                  // justifyContent: 'center',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={{color: colors.white, marginLeft: hp(20)}}>
                  Upgrade
                </Text>
                <Image
                  source={icons.crownIcon}
                  style={{
                    width: hp(18.88),
                    height: hp(16),
                    tintColor: colors.white,
                    marginRight: hp(22.12),
                  }}
                />
              </LinearGradient>
            </TouchableOpacity>

            <View
              style={{
                width: '50%',
                borderWidth: 0.5,
                // borderColor: '#F2F2F2',
                borderColor: colors.gray,
                marginTop: hp(17),
                marginRight: 100,
              }}
            />

            <View style={{marginTop: hp(21)}}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('MyProfileScreen');
                  toggleModal();
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginBottom: hp(19),
                    alignItems: 'center',
                  }}>
                  <Image
                    source={icons.profileLogo}
                    style={{
                      width: hp(17.22),
                      height: hp(16),
                      tintColor: colors.black,
                      resizeMode: 'stretch',
                    }}
                  />
                  <Text
                    style={{
                      color: colors.black,
                      marginLeft: hp(17.78),
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontWeight: '400',
                    }}>
                    My Profile
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('AccountsScreen');
                  toggleModal();
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: hp(19),
                  }}>
                  <Image
                    source={icons.settingIcon}
                    style={{
                      width: hp(15.49),
                      height: hp(16),
                      tintColor: colors.black,
                      resizeMode: 'stretch',
                    }}
                  />
                  <Text
                    style={{
                      color: colors.black,
                      marginLeft: hp(18.51),
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontWeight: '400',
                    }}>
                    Accounts
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('PrivacyScreen');
                  console.log(' press> ', 'press');
                  toggleModal(); // Close the modal after navigation
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: hp(19),
                  }}>
                  <Image
                    source={icons.logLogo}
                    style={{
                      width: hp(12.44),
                      height: hp(16),
                      tintColor: colors.black,
                      resizeMode: 'stretch',
                    }}
                  />
                  <Text
                    style={{
                      color: colors.black,
                      marginLeft: hp(21.56),
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontWeight: '400',
                    }}>
                    Privacy Policy
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  // marginBottom: hp(19),
                }}>
                <Image
                  source={icons.linkDevicesIcon}
                  style={{
                    width: hp(18.02),
                    height: hp(14),
                    tintColor: colors.black,
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    color: colors.black,
                    marginLeft: hp(15.98),
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontWeight: '400',
                  }}>
                  Link a Device
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/*button*/}

          <TouchableOpacity
            activeOpacity={0.5}
            style={{
              // width: wp(340),
              width: '47%',
              height: hp(50),
              backgroundColor: '#F4FAFF',
              // backgroundColor: 'green',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              marginLeft: wp(27),
              // marginTop: isIOS ? hp(10) : hp(50),
              marginBottom: hp(24),
              marginTop: hp(35),
            }}>
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontWeight: '400',
              }}>
              Log Out
            </Text>
            <View style={{width: 17}} />
            <Image
              source={icons.logOutIcon}
              style={{width: hp(14.7), height: hp(17.27)}}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    // height: 514,
    width: '200%',
    position: 'absolute',
    top: -20,
    marginLeft: -20,
  },
  modalBodyContainer: {
    marginTop: 23,
    marginHorizontal: wp(27),
    // backgroundColor: 'red',
  },
  modalHeaderProfileStyle: {
    height: hp(60),
    width: hp(60),
    borderRadius: 50,
    marginTop: hp(23),
  },
  userNameTextStyle: {
    color: colors.black,
    fontSize: fontSize(22),
    lineHeight: hp(33),
    fontWeight: '600',
    marginTop: hp(10),
  },
  userDescriptionContainer: {
    flexDirection: 'row',
    marginTop: hp(3),
  },
  userNumberTextStyle: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontWeight: '500',
  },
  userDescriptionTextStyle: {
    height: hp(13),
    borderWidth: 0.9,
    borderColor: '#BEBEBE',
    marginLeft: hp(10),
    marginRight: hp(10),
    top: 5,
  },
});

export default HomeTopSheetComponent;
