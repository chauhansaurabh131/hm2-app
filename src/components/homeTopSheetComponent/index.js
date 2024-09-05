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
import {useDispatch, useSelector} from 'react-redux';
import {changeStack, logout} from '../../actions/authActions';
import io from 'socket.io-client';
import style from '../../screen/chatScreen/style';

const HomeTopSheetComponent = ({
  isVisible,
  onBackdropPress,
  onBackButtonPress,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [isModalVisible, setModalVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [modalTop, setModalTop] = useState(new Animated.Value(20));
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const [socket, setSocket] = useState(null);

  // const userImage = user?.user?.userProfilePic?.[0]?.url;
  const userImage = user?.user?.profilePic;
  const UserUniqueId = user?.user?.userUniqueId;

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const socketIo = io('https://happymilan.tech', {
      path: '/api/socket.io',
      query: {token: accessToken},
    });

    socketIo.on('connect', () => {
      console.log('Connected to socket');
      socketIo.emit('userInActive');
    });

    socketIo.on('onlineUser', data => {
      console.log('Data from socket:', data);
    });

    socketIo.on('disconnect', () => {
      console.log('Disconnected from socket');
      socketIo.emit('userInActive');
    });

    setSocket(socketIo);

    return () => {
      if (socket) {
        socket.emit('userInActive');
        socket.disconnect();
      }
      setSocket(null);
    };
  }, [accessToken]);

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

  const handleLogout = () => {
    // Uncomment out when logout to user (both)
    dispatch(logout());
    dispatch(logout(), () => dispatch(changeStack()));
    if (socket) {
      socket.emit('userInActive');
      socket.disconnect();
    }
    setConfirmationVisible(false);
    onBackdropPress(); // Close the main modal
  };

  const onStayButtonPress = () => {
    setConfirmationVisible(false);
    onBackdropPress();
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={toggleModal} />

      <Modal
        isVisible={isVisible}
        animationIn="slideInDown"
        animationOut="slideOutUp"
        onBackdropPress={onBackdropPress}
        onBackButtonPress={onBackButtonPress}
        style={{top: modalTop}}>
        <View style={styles.modalContainer}>
          <View style={styles.modalBodyContainer}>
            {/*<Image*/}
            {/*  source={images.profileDisplayImage}*/}
            {/*  style={styles.modalHeaderProfileStyle}*/}
            {/*/>*/}

            {userImage ? (
              <Image
                source={{uri: userImage}}
                style={styles.modalHeaderProfileStyle}
              />
            ) : (
              <Image
                source={images.empty_male_Image}
                style={styles.modalHeaderProfileStyle}
              />
            )}

            <Text style={styles.userNameTextStyle}>Riya Shah</Text>

            <View style={styles.userDescriptionContainer}>
              <Text style={styles.userNumberTextStyle}>{UserUniqueId}</Text>
              <View style={styles.userDescriptionTextStyle} />
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
                  borderRadius: 20,
                  flexDirection: 'row',
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
          <TouchableOpacity
            onPress={() => setConfirmationVisible(true)}
            style={{
              width: '47%',
              height: hp(50),
              // backgroundColor: '#F4FAFF',
              borderWidth: 0.5,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 50,
              marginLeft: wp(27),
              marginBottom: hp(24),
              marginTop: hp(35),
              borderColor: '#E5E5E5',
            }}>
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins500,
              }}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        isVisible={isConfirmationVisible}
        onBackdropPress={() => setConfirmationVisible(false)}
        onBackButtonPress={() => setConfirmationVisible(false)}
        animationIn="slideInUp"
        animationOut="slideOutDown">
        <View style={styles.confirmationModalContainer}>
          <Text style={styles.confirmationTitle}>
            Are you sure you want to exit?
          </Text>
          <View style={styles.confirmationButtonContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={onStayButtonPress}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0.5}}
                style={{
                  // marginTop: hp(50),
                  width: wp(122),
                  height: hp(50),
                  borderRadius: 50,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: colors.white,
                    textAlign: 'center',
                    fontSize: fontSize(16),
                    lineHeight: hp(26),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  stay
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              // onPress={SelectSetDurationModalClose}
              onPress={handleLogout}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                style={{
                  width: wp(122),
                  height: hp(50),
                  borderRadius: 50,
                  borderWidth: 1,
                  justifyContent: 'center',
                  borderColor: 'transparent', // Set border color to transparent
                }}>
                <View
                  style={{
                    borderRadius: 100, // <-- Inner Border Radius
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
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins600,
                    }}>
                    Log Out
                  </Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    width: '200%',
    position: 'absolute',
    top: -20,
    marginLeft: -20,
  },
  modalBodyContainer: {
    marginTop: 23,
    marginHorizontal: wp(27),
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
  confirmationModalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  confirmationTitle: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    marginTop: hp(50),
  },
  confirmationButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: hp(50),
    marginBottom: hp(35),
  },
  stayButton: {
    backgroundColor: colors.gray,
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  stayButtonText: {
    color: colors.white,
    fontSize: fontSize(14),
  },
  logoutButton: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 5,
    width: '45%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: colors.white,
    fontSize: fontSize(14),
  },
});

export default HomeTopSheetComponent;
