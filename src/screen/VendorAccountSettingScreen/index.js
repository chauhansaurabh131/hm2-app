import React, {useCallback, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import style from '../accountsScreen/style';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {BASE_URL} from '../../utils/constants';
import RBSheet from 'react-native-raw-bottom-sheet';
import {changeStack, logout} from '../../actions/authActions';
import axios from 'axios';

const deleteReasons = [
  {
    label: 'No longer using Hapmeet',
    value: 'no-longer-using-happymeet',
  },
  {
    label: 'Business closed or inactive',
    value: 'business-closed-or-inactive',
  },
  {
    label: 'Not getting enough leads/bookings',
    value: 'not-getting-enough-leads-or-bookings',
  },
  {
    label: 'Duplicate account',
    value: 'duplicate-account',
  },
  {
    label: 'Service no longer relevant',
    value: 'service-no-longer-relevant',
  },
  {
    label: 'Facing platform or listing issues',
    value: 'facing-platform-or-listing-issues',
  },
  {
    label: 'Business rebranding or strategy change',
    value: 'business-rebranding-or-strategy-change',
  },
  {
    label: 'No time to manage profile',
    value: 'no-time-to-manage-profile',
  },
  {
    label: 'Other reasons',
    value: 'other',
  },
];

const VendorAccountSettingScreen = () => {
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  console.log(' === var ===> ', accessToken);

  const [kycData, setKycData] = useState(null); // State to hold KYC data
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedDeleteReason, setSelectedDeleteReason] = useState('');
  const [loading, setLoading] = useState(false);

  const refDeleteReasonSheet = useRef();
  const dispatch = useDispatch();

  const fetchKycDetails = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/user/kyc/by-user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Use your auth token here
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log('KYC Details:', result);

        // Save the last KYC details to state
        const kycDataArray = result?.data;
        // if (kycDataArray && kycDataArray.length > 0) {
        //   setKycData(kycDataArray[kycDataArray.length - 1]); // Get the last item
        // }
        setKycData(kycDataArray);
      } else {
        console.error('Failed to fetch KYC details');
        // Toast.show({
        //   type: 'error',
        //   text1: 'Failed to Fetch KYC',
        //   text2: 'Could not retrieve KYC details.',
        // });
      }
    } catch (error) {
      console.error('Error fetching KYC details:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while fetching KYC details.',
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchKycDetails();
    }, []),
  );

  const deleteAccount = async () => {
    try {
      setLoading(true);

      const response = await axios.delete(
        `${BASE_URL}/api/v1/user/user/delete-account`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          data: {
            deleteReason: selectedDeleteReason,
          },
        },
      );

      console.log('SUCCESS =>', response.data);

      setLoading(false);
      setDeleteModalVisible(false);

      dispatch(logout());
      dispatch(changeStack());
    } catch (error) {
      setLoading(false);

      console.log('DELETE ERROR =>', error?.response?.data || error);

      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to delete account',
      );
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
            fontFamily: fontFamily.poppins400,
          }}>
          Account Settings
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

      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#F9FBFF"
        onPress={() => {
          navigation.navigate('CredentialsScreen');
        }}>
        <View
          style={{
            // flex: 1,
            marginHorizontal: wp(17),
            marginTop: hp(19),
            marginBottom: 15,
          }}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: 25}}>
                <Image
                  source={icons.logLogo}
                  style={{
                    width: hp(17.29),
                    height: hp(14),
                    resizeMode: 'contain',
                    alignItems: 'center',
                    top: 4,
                  }}
                />
              </View>

              <Image
                source={icons.rightSideIcon}
                style={{
                  position: 'absolute',
                  right: 0,
                  width: hp(6.02),
                  height: hp(10.62),
                  top: 4,
                  tintColor: '#D8D8D8',
                }}
              />
              <View style={{marginLeft: hp(10)}}>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  Login Details
                </Text>
                <Text
                  style={{
                    color: colors.black,
                    marginTop: hp(9),
                    fontSize: fontSize(12),
                    lineHeight: hp(18),
                    fontFamily: fontFamily.poppins400,
                    marginRight: 17,
                  }}>
                  This menu lets users update and manage{'\n'}authentication
                  info for secure access
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>

      <View
        style={{width: '100%', height: hp(1), backgroundColor: '#E7E7E7'}}
      />

      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#F9FBFF"
        onPress={() => {
          navigation.navigate('KycDetailsScreen', {kycData});
        }}>
        <View
          style={{
            // flex: 1,
            marginHorizontal: wp(17),
            marginTop: hp(19),
            marginBottom: 15,
          }}>
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={{width: 25}}>
                <Image
                  source={icons.kyc_icon}
                  style={{
                    width: hp(17.29),
                    height: hp(14),
                    resizeMode: 'contain',
                    alignItems: 'center',
                    top: 4,
                  }}
                />
              </View>

              <Image
                source={icons.rightSideIcon}
                style={{
                  position: 'absolute',
                  right: 0,
                  width: hp(6.02),
                  height: hp(10.62),
                  top: 4,
                  tintColor: '#D8D8D8',
                }}
              />
              <View style={{marginLeft: hp(10)}}>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  KYC Details
                </Text>
                <Text
                  style={{
                    color: colors.black,
                    marginTop: hp(9),
                    fontSize: fontSize(12),
                    lineHeight: hp(18),
                    fontFamily: fontFamily.poppins400,
                    marginRight: 17,
                  }}>
                  In this menu, you'll see the plan you've purchased{'\n'}and
                  the payment method used for the purchase.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>

      <View style={{position: 'absolute', bottom: 30, width: '100%'}}>
        <TouchableOpacity
          activeOpacity={0.6}
          onPress={() => refDeleteReasonSheet.current?.open()}
          style={{
            backgroundColor: '#FFDCDC',
            height: hp(44),
            borderRadius: hp(25),
            marginHorizontal: wp(17),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#CB0000',
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Delete Account
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent
        visible={deleteModalVisible}
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setDeleteModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: wp(20),
            }}>
            {/* Prevent modal from closing when clicking inside */}
            <TouchableWithoutFeedback>
              <View
                style={{
                  width: '100%',
                  backgroundColor: colors.white,
                  borderRadius: hp(20),
                  padding: wp(20),
                }}>
                <Text
                  style={{
                    color: colors.pureBlack,
                    fontSize: fontSize(16),
                    fontFamily: fontFamily.poppins600,
                    textAlign: 'center',
                  }}>
                  Delete Profile?
                </Text>

                <Text
                  style={{
                    color: 'black',
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins400,
                    textAlign: 'center',
                    marginTop: hp(12),
                    lineHeight: hp(22),
                  }}>
                  Are you sure? All profile{'\n'}information will be permanently
                  {'\n'}
                  removed.
                </Text>

                {/* Buttons */}
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: hp(25),
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setDeleteModalVisible(false)}
                    style={{
                      flex: 1,
                      height: hp(50),
                      borderRadius: hp(25),
                      borderWidth: hp(1),
                      borderColor: '#7148E4',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: wp(10),
                    }}>
                    <Text
                      style={{
                        color: colors.pureBlack,
                        fontSize: fontSize(14),
                        fontFamily: fontFamily.poppins500,
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    disabled={loading}
                    onPress={deleteAccount}
                    style={{
                      flex: 1,
                      height: hp(50),
                      borderRadius: hp(25),
                      backgroundColor: '#7148E4',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    {loading ? (
                      <ActivityIndicator size="large" color="white" />
                    ) : (
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: fontSize(14),
                          fontFamily: fontFamily.poppins500,
                        }}>
                        Yes, Delete
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <RBSheet
        ref={refDeleteReasonSheet}
        closeOnDragDown
        closeOnPressMask
        height={hp(500)}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: '#D9D9D9',
          },
          container: {
            borderTopLeftRadius: hp(25),
            borderTopRightRadius: hp(25),
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(18),
            fontFamily: fontFamily.poppins600,
            color: colors.pureBlack,
            marginTop: hp(10),
            marginHorizontal: wp(20),
          }}>
          Reason for deleting account
        </Text>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(10),
            marginBottom: hp(10),
          }}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          {deleteReasons.map(item => {
            const isSelected = selectedDeleteReason === item.value;

            return (
              <TouchableOpacity
                key={item.value}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedDeleteReason(item.value);

                  refDeleteReasonSheet.current?.close();

                  setTimeout(() => {
                    setDeleteModalVisible(true);
                  }, 300);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: wp(20),
                  height: hp(45),
                  // borderBottomWidth: hp(0.8),
                  // borderBottomColor: '#E9E9E9',
                }}>
                <Text
                  style={{
                    fontSize: fontSize(14),
                    color: colors.pureBlack,
                    fontFamily: fontFamily.poppins400,
                    flex: 1,
                  }}>
                  {item.label}
                </Text>

                {/*{isSelected && (*/}
                {/*  <Image*/}
                {/*    source={icons.new_Circle_Check_Icon}*/}
                {/*    style={{*/}
                {/*      width: hp(22),*/}
                {/*      height: hp(22),*/}
                {/*      resizeMode: 'contain',*/}
                {/*    }}*/}
                {/*  />*/}
                {/*)}*/}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </RBSheet>
    </SafeAreaView>
  );
};

export default VendorAccountSettingScreen;
