import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
  Linking,
  Alert,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import LinearGradient from 'react-native-linear-gradient';
import Modal from 'react-native-modal';
import {changeStack, logout} from '../../actions/authActions';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import ProfileAvatar from '../letterProfileComponent';
import {style} from '../homeCardProfileComponent/style';
import {BASE_URL} from '../../utils/constants';

const NewProfileBottomSheet = ({bottomSheetRef}) => {
  const navigation = useNavigation();
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const shouldShowLogoutModalRef = useRef(false);
  const [planData, setPlanData] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [planDurationDetails, setPlanDurationDetails] = useState(null);
  const [creditData, setCreditData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  // console.log(' === creditData___ ===> ', creditData);
  // console.log(' === var ===> ', planDetails);

  const appType = user?.user?.appUsesType;

  // console.log(' === appType ===> ', appType);

  const userImage = user?.user?.profilePic;

  const hasValidImage =
    user?.user?.profilePic &&
    user?.user?.profilePic !== 'null' &&
    user?.user?.profilePic.trim() !== '';

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const fetchUserPlan = async () => {
        if (!accessToken) {
          return;
        }

        try {
          const response = await fetch(
            `${BASE_URL}/api/v1/user/user-plan/get-user-planbyId`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            },
          );

          const data = await response.json();
          // console.log('User Plan Response:', data);

          if (response.ok && data?.data?.planId) {
            setPlanDetails(data.data);
            setPlanDurationDetails(data.data);
          } else {
            setPlanDetails(null);
            setPlanDurationDetails(null);
          }
        } catch (error) {
          console.error('User Plan Fetch error:', error);
        }
      };

      const fetchCredit = async () => {
        if (!accessToken || !userId) {
          return;
        }

        try {
          setLoading(true);
          const response = await fetch(
            `${BASE_URL}/api/v1/user/user/get-credit/${userId}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            },
          );

          const data = await response.json();
          console.log('Credit Response:', data);

          if (response.ok) {
            setCreditData(data);
          } else {
            setCreditData(null);
          }
        } catch (error) {
          console.error('Credit Fetch error:', error.message);
        } finally {
          setLoading(false);
        }
      };

      // 🔹 Call both APIs when screen focuses
      fetchUserPlan();
      fetchCredit();
    }, [accessToken, userId]),
  );

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const token = user?.tokens?.access?.token;
        if (token) {
          const response = await axios.get(
            `${BASE_URL}/api/v1/user/user/checkPlan`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          setPlanData(response.data);
          console.log('API Response:', response.data);
        } else {
          // Alert.alert('Error', 'No access token found.');
          console.log(' === Error ===> ', 'No access token found.');
        }
      } catch (error) {
        console.error('API Error:', error);
        // Alert.alert('Error', 'Failed to fetch plan data.');
      } finally {
        console.log(' === err ===> ');
      }
    };

    fetchPlanData();
  }, []);

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };
  const name = capitalizeFirstLetter(user?.user?.name || '');
  const UserUniqueId = user?.user?.userUniqueId;

  // Function to close the bottom sheet
  const closeBottomSheet = () => {
    bottomSheetRef.current.close();
  };

  const onStayButtonPress = () => {
    setConfirmationVisible(false);
    // onBackdropPress();
    closeBottomSheet();
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
  };

  const onLogOutPress = () => {
    shouldShowLogoutModalRef.current = true;
    closeBottomSheet();
  };

  const onPrivacyScreenHandle = () => {
    closeBottomSheet();
    if (planData) {
      navigation.navigate('BottomSheetPrivacySettingScreen', {
        planData: planData.data,
      }); // Pass data to Abc screen
    } else {
      // Alert.alert('Error', 'No plan data available to pass.');
      console.log(' === Error ===> ', 'No plan data available to pass.');
    }
  };

  const formatPlanDuration = duration => {
    if (!duration || typeof duration !== 'string') {
      return '';
    }

    // remove "-" and replace with space
    const cleaned = duration.replace(/-/g, ' ');

    const map = {
      monthly: 'One Month',
      yearly: 'Year',
      quarterly: 'Quarter',
      weekly: 'Week',
      daily: 'Day',
    };

    const lower = cleaned.toLowerCase();
    return map[lower] || capitalizeFirstLetter(lower);
  };

  return (
    <>
      <RBSheet
        ref={bottomSheetRef}
        height={hp(610)}
        openDuration={250}
        onClose={() => {
          if (shouldShowLogoutModalRef.current) {
            shouldShowLogoutModalRef.current = false;
            setTimeout(() => {
              setConfirmationVisible(true);
            }, 100);
          }
        }}
        customStyles={{
          container: {
            justifyContent: 'center',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <View style={{flex: 1}}>
          {/* Touchable Text to close the bottom sheet */}
          {/*<TouchableOpacity onPress={closeBottomSheet}>*/}
          {/*  <Text>Profile Details</Text>*/}
          {/*</TouchableOpacity>*/}

          <View style={{marginHorizontal: 27}}>
            {hasValidImage ? (
              <Image
                source={userImage ? {uri: userImage} : images.empty_male_Image}
                style={styles.modalHeaderProfileStyle}
              />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName || name}
                lastName={user?.user?.lastName}
                textStyle={styles.modalHeaderProfileStyle}
              />
            )}

            <Text style={styles.userNameTextStyle}>{name}</Text>

            {/*<View style={styles.userDescriptionContainer}>*/}
            {/*  <Text style={styles.userNumberTextStyle}>{UserUniqueId}</Text>*/}
            {/*  <View style={styles.userDescriptionTextStyle} />*/}
            {/*  <Text style={styles.freeProfileText}>FREE Profile</Text>*/}
            {/*</View>*/}

            {/*<TouchableOpacity*/}
            {/*  activeOpacity={0.7}*/}
            {/*  style={{marginTop: hp(12)}}*/}
            {/*  onPress={() => {*/}
            {/*    navigation.navigate('Upgrader');*/}
            {/*    closeBottomSheet();*/}
            {/*  }}>*/}
            {/*  <LinearGradient*/}
            {/*    colors={['#0D4EB3', '#9413D0']}*/}
            {/*    start={{x: 0, y: 0}}*/}
            {/*    end={{x: 1, y: 1.5}}*/}
            {/*    style={styles.upgradeContainer}>*/}
            {/*    <Text style={styles.upgradeText}>Upgrade</Text>*/}
            {/*    <Image source={icons.crownIcon} style={styles.crownIconStyle} />*/}
            {/*  </LinearGradient>*/}
            {/*</TouchableOpacity>*/}
          </View>

          {/*{creditData?.credit?.creditBalance > 0 ? (*/}
          {planDetails?.planId?.planName ? (
            // When API gives planName
            <View style={{marginHorizontal: 27}}>
              <View style={{flexDirection: 'row'}}>
                <Text
                  style={{
                    marginTop: hp(5),
                    textTransform: 'uppercase',
                    fontSize: fontSize(14),
                    lineHeight: hp(18),
                    fontFamily: fontFamily.poppins500,
                    color: colors.pureBlack,
                  }}>
                  {UserUniqueId}
                </Text>
                <View
                  style={{
                    height: hp(20),
                    marginLeft: hp(10),
                    marginRight: hp(10),
                    top: 3,
                    width: 1,
                    backgroundColor: 'gray',
                  }}
                />

                <Text
                  style={{
                    marginTop: hp(5),
                    fontSize: fontSize(14),
                    lineHeight: hp(18),
                    fontFamily: fontFamily.poppins500,
                    color: colors.pureBlack,
                  }}>
                  {/*{capitalizeFirstLetter(planDetails?.planId?.planName)} -{' '}*/}
                  {appType === 'marriage' && planDetails?.planId?.planName
                    ? `${capitalizeFirstLetter(
                        planDetails?.planId?.planName,
                      )} - `
                    : ''}
                  {formatPlanDuration(
                    planDurationDetails?.planId?.planDuration || ' ',
                  )}
                </Text>
              </View>

              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(16),
                  // lineHeight: hp(20),
                  fontFamily: fontFamily.poppins600,
                  marginTop: hp(10),
                }}>
                Available Credits : {creditData?.credit?.creditBalance}
              </Text>
            </View>
          ) : (
            // When no API plan data, fallback to Free Plan
            <View style={{marginHorizontal: 27}}>
              <View style={styles.userDescriptionContainer}>
                <Text
                  style={[
                    styles.userNumberTextStyle,
                    {textTransform: 'uppercase'},
                  ]}>
                  {UserUniqueId}
                </Text>
                <View style={styles.userDescriptionTextStyle} />
                <Text style={styles.freeProfileText}>FREE Profile</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={{marginTop: hp(12)}}
                onPress={() => {
                  navigation.navigate('Upgrader');
                  closeBottomSheet();
                }}>
                <LinearGradient
                  colors={['#7045EB', '#4819CB']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1.5}}
                  style={styles.upgradeContainer}>
                  <Text style={styles.upgradeText}>Upgrade</Text>
                  <Image
                    source={icons.crownIcon}
                    style={styles.crownIconStyle}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.horizontalLine} />

          <View style={styles.bodyContainer}>
            <View style={{marginHorizontal: 27}}>
              <TouchableOpacity
                style={styles.labelContainer}
                onPress={() => {
                  {
                    appType === 'dating'
                      ? navigation.navigate('DatingProfileScreen')
                      : navigation.navigate('MyNewProfileScreen');
                    // : navigation.navigate('MyProfileScreen');
                  }
                  closeBottomSheet();
                }}>
                <View style={styles.labelViewContainer}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={icons.profileLogo}
                      style={styles.profileIcon}
                    />
                  </View>
                  <Text style={styles.labelText}>My Profile</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.labelContainer}
                onPress={() => {
                  navigation.navigate('AccountsScreen');
                  closeBottomSheet();
                }}>
                <View style={styles.labelViewContainer}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={icons.settingIcon}
                      style={styles.settingIcon}
                    />
                  </View>
                  <Text style={styles.labelText}>Account Settings</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.labelContainer}
                // onPress={() => {
                //   navigation.navigate('BottomSheetPrivacySettingScreen');
                //   closeBottomSheet();
                // }}

                onPress={() => {
                  onPrivacyScreenHandle();
                }}>
                <View style={styles.labelViewContainer}>
                  <View style={styles.imageContainer}>
                    <Image source={icons.logLogo} style={styles.privacyIcon} />
                  </View>
                  <Text style={styles.labelText}>Privacy Settings</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.labelContainer}
                onPress={() => {
                  Linking.openURL('https://happymilan.vercel.app/faq/payment');
                  closeBottomSheet(); // Optional: close your sheet
                }}>
                <View style={styles.labelViewContainer}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={icons.help_center_icon}
                      style={{
                        width: hp(16),
                        height: hp(16),
                        tintColor: colors.black,
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                  <Text style={styles.labelText}>Help Center</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View
              style={[styles.horizontalLine, {marginTop: 5, height: 1.3}]}
            />

            <TouchableOpacity
              style={[
                styles.labelContainer,
                {marginHorizontal: 27, marginTop: 10, marginBottom: 10},
              ]}
              onPress={() => {
                navigation.navigate('ConnectToWebScreen');
                closeBottomSheet();
              }}>
              <View style={styles.labelViewContainer}>
                <View style={styles.imageContainer}>
                  <Image
                    source={icons.linkDevicesIcon}
                    style={styles.linkDeviceIcon}
                  />
                </View>
                <Text style={styles.labelText}>Connect to Web</Text>
              </View>
            </TouchableOpacity>

            <View
              style={[styles.horizontalLine, {marginTop: 5, height: 1.3}]}
            />

            <View style={{marginHorizontal: 27, marginTop: hp(10)}}>
              <TouchableOpacity
                onPress={onLogOutPress}
                style={styles.logOutContainer}>
                <Text style={styles.buttonText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RBSheet>

      <Modal
        transparent={true}
        animationIn="fadeIn"
        animationOut="fadeOut"
        animationInTiming={0}
        animationOutTiming={0}
        backdropTransitionInTiming={0}
        backdropTransitionOutTiming={0}
        isVisible={isConfirmationVisible}
        onBackdropPress={onStayButtonPress} // Dismiss on backdrop press if desired
        backdropOpacity={0.7} // Semi-transparent background
      >
        <View style={styles.modalBodyContainer}>
          <Text style={styles.modalTextStyle}>
            Are you sure you want to exit?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity activeOpacity={0.7} onPress={onStayButtonPress}>
              <LinearGradient
                colors={['#7045EB', '#4819CB']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0.5}}
                style={styles.stayButtonContainer}>
                <Text style={styles.stayTextStyle}>Stay</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                style={styles.logOutContainers}>
                <View style={styles.logOutViewContainer}>
                  <Text style={styles.logoutText}>Log Out</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
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
    fontFamily: fontFamily.poppins600,
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
    fontFamily: fontFamily.poppins400,
  },
  userDescriptionTextStyle: {
    height: hp(13),
    borderWidth: 0.9,
    borderColor: '#BEBEBE',
    marginLeft: hp(10),
    marginRight: hp(10),
    top: 5,
  },
  freeProfileText: {
    color: '#BEBEBE',
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
  },
  upgradeContainer: {
    width: hp(136),
    height: hp(40),
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upgradeText: {
    color: colors.white,
    marginLeft: hp(20),
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
  },
  crownIconStyle: {
    width: hp(18.88),
    height: hp(16),
    tintColor: colors.white,
    marginRight: hp(22.12),
  },
  horizontalLine: {
    width: '100%',
    height: 4,
    backgroundColor: '#F2F2F2',
    // marginTop: hp(26),
    marginTop: hp(20),
  },
  bodyContainer: {
    // marginHorizontal: 27,
    marginTop: hp(12),
  },
  labelContainer: {
    width: '100%',
    height: hp(50),
    justifyContent: 'center',
  },
  labelViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: hp(25),
    height: hp(30),
    justifyContent: 'center',
    marginLeft: 2,
  },
  labelText: {
    color: colors.black,
    marginLeft: hp(17),
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontWeight: fontFamily.poppins500,
  },
  profileIcon: {
    width: hp(17.22),
    height: hp(16),
    tintColor: colors.black,
    resizeMode: 'contain',
  },
  settingIcon: {
    width: hp(15.49),
    height: hp(16),
    tintColor: colors.black,
    resizeMode: 'contain',
  },
  privacyIcon: {
    width: hp(12.44),
    height: hp(16),
    tintColor: colors.black,
    resizeMode: 'contain',
  },
  linkDeviceIcon: {
    width: hp(18.02),
    height: hp(14),
    tintColor: colors.black,
    resizeMode: 'contain',
  },
  logOutContainer: {
    width: '100%',
    height: hp(50),
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginBottom: hp(24),
    borderColor: '#E5E5E5',
    marginTop: hp(17),
  },
  buttonText: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },
  modalBodyContainer: {
    backgroundColor: 'white',
    // padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTextStyle: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    marginTop: hp(50),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '75%',
    marginTop: hp(50),
    marginBottom: hp(35),
  },
  stayButtonContainer: {
    // marginTop: hp(50),
    width: wp(122),
    height: hp(50),
    borderRadius: 50,
    justifyContent: 'center',
  },
  stayTextStyle: {
    color: colors.white,
    textAlign: 'center',
    fontSize: fontSize(16),
    lineHeight: hp(26),
    fontFamily: fontFamily.poppins500,
  },
  logOutContainers: {
    width: wp(122),
    height: hp(50),
    borderRadius: 50,
    borderWidth: 1.5,
    justifyContent: 'center',
    borderColor: 'transparent', // Set border color to transparent
  },
  logOutViewContainer: {
    borderRadius: 100, // <-- Inner Border Radius
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    margin: isIOS ? 0 : 1,
  },
  logoutText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: colors.black,
    margin: 10,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
  },
});

export default NewProfileBottomSheet;
