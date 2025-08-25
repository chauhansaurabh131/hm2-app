import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {style} from './style';
import {useSelector} from 'react-redux';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../utils/colors';
import {icons} from '../../../assets';
import {useNavigation} from '@react-navigation/native';
import GradientButton from '../../../components/GradientButton';

const UserContactDetail = (...params) => {
  const UserData = params[0]?.friendList;
  const MatchesScreenData = params[0];

  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  const [planStatus, setPlanStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accessibleContact, setAccessibleContact] = useState(null); // NEW STATE
  const [numberSendRequestModal, setNumberSendRequestModal] = useState(false);
  const [numberSendRequestLimitModal, setNumberSendRequestLimitModal] =
    useState(false);
  const [loading, setLoading] = useState(false);

  console.log(
    ' === accessibleContact ===> ',
    accessibleContact?.results[0]?.targetUserId?.mobileNumber,
  );

  // ✅ First API: get-user-subscription
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!accessToken) {
        console.warn('No access token available');
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/subscription/get-user-subscription',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('User subscription data:', result);
        setPlanStatus(result?.data?.status);
      } catch (error) {
        console.error('Error fetching subscription:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscription();
  }, [accessToken]);

  // ✅ Second API: accessible-ById/{id}
  const fetchAccessibleById = async () => {
    if (!accessToken || !MatchesScreenData?._id) {
      return;
    }

    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/mobile-number-request/accessible-ById/${MatchesScreenData._id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Accessible by ID data:', result);

      setAccessibleContact(result?.data || null);
    } catch (error) {
      console.error('Error fetching accessible by ID:', error);
    }
  };

  const handleRequestMobileNumber = async () => {
    if (!accessToken || !MatchesScreenData?._id) {
      console.warn('Missing accessToken or targetUserId');
      return;
    }

    try {
      setLoading(true); // 👉 start loader

      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/mobile-number-request/create',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            targetUserId: MatchesScreenData._id,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setNumberSendRequestModal(false);
        setNumberSendRequestLimitModal(true);
        // alert(result.message || 'Something went wrong');
        // console.log(' === result.message ===> ', result.message);
      } else {
        console.log('✅ Mobile number request created:', result);
        setNumberSendRequestModal(false);
      }
    } catch (error) {
      console.error('🚨 Unexpected error:', error);
    } finally {
      setLoading(false); // 👉 stop loader in both success & error
    }
  };

  useEffect(() => {
    fetchAccessibleById();
  }, [accessToken, MatchesScreenData?._id]);

  // Fallback values
  const rawMobileNumber =
    accessibleContact?.results[0]?.targetUserId?.mobileNumber?.toString() ||
    accessibleContact?.results[0]?.targetUserId?.mobileNumber?.toString() ||
    accessibleContact?.results[0]?.targetUserId?.mobileNumber?.toString();

  const email =
    accessibleContact?.email || MatchesScreenData?.email || UserData?.email;

  const formatMobileNumber = number => {
    if (number && number.length === 12) {
      const countryCode = `+${number.slice(0, 2)}`;
      const firstPart = number.slice(2, 7);
      const secondPart = number.slice(7);
      return `${countryCode} ${firstPart} ${secondPart}`;
    }
    return number;
  };

  const mobileNumber = formatMobileNumber(rawMobileNumber);

  console.log(' === mobileNumber ===> ', mobileNumber);

  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        {isLoading ? (
          <View style={{marginTop: hp(150)}}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : planStatus === 'active' ? (
          MatchesScreenData?.privacySettingCustom?.contact ? (
            <View
              style={{
                width: '100%',
                height: 244,
                backgroundColor: '#F7F7F7',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 19,
                marginTop: 5,
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(18),
                  lineHeight: hp(26),
                  fontFamily: fontFamily.poppins500,
                }}>
                Private contact
              </Text>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(14),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  marginTop: 2,
                }}>
                This user has hidden their contact details
              </Text>
            </View>
          ) : (
            <>
              <Text style={style.detailTittleText}>Mobile Number</Text>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text style={style.detailSubTittleText}>
                  +91 {mobileNumber || '**********'}
                </Text>

                {!mobileNumber && (
                  <TouchableOpacity
                    // onPress={handleRequestMobileNumber}
                    onPress={() => setNumberSendRequestModal(true)}
                    activeOpacity={0.5}
                    style={{
                      top: -4,
                      height: hp(30),
                      width: hp(50),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={icons.blue_screen_eye}
                      style={{
                        width: wp(22),
                        height: hp(15),
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <Text style={style.detailsTittleTextStyle}>Email Address</Text>
              <Text style={style.detailSubTittleText}>{email || 'N/A'}</Text>
            </>
          )
        ) : (
          <View>
            <LinearGradient
              colors={['#0F52BA', '#8225AF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                width: '100%',
                height: 244,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 19,
                marginTop: 5,
              }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(18),
                  lineHeight: hp(26),
                  fontFamily: fontFamily.poppins500,
                }}>
                Premium Members Only
              </Text>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(13),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  marginTop: 2,
                }}>
                Upgrade to view details
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('Upgrader')}
                activeOpacity={0.6}
                style={{
                  marginTop: hp(34),
                  width: hp(123),
                  height: hp(44),
                  backgroundColor: colors.white,
                  borderRadius: 22,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    fontSize: fontSize(14),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins500,
                    color: colors.black,
                  }}>
                  Upgrade
                </Text>

                <Image
                  source={icons.crownIcon}
                  style={{
                    width: hp(18),
                    height: hp(18),
                    resizeMode: 'contain',
                    marginLeft: hp(8),
                    top: -2,
                  }}
                />
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </View>

      {/*SEND REQUESTED MOBILE NUMBER VIEW MODAL*/}
      <Modal
        transparent={true}
        animationType="none"
        visible={numberSendRequestModal}
        onRequestClose={() => setNumberSendRequestModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              width: '90%',
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 5,
                width: hp(35),
                height: hp(35),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setNumberSendRequestModal(false);
              }}>
              <Image
                source={icons.x_cancel_icon}
                style={{width: hp(15), height: hp(15), resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: fontSize(16),
                marginTop: hp(65),
                fontFamily: fontFamily.poppins500,
                color: colors.pureBlack,
                textAlign: 'center',
              }}>
              Mobile number can be viewed{'\n'}with the user’s approval.
            </Text>

            <View
              style={{
                marginTop: hp(32),
                marginBottom: hp(31),
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleRequestMobileNumber}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={{
                    width: wp(270),
                    height: hp(50),
                    borderRadius: 50,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}>
                  {loading ? (
                    <ActivityIndicator size="large" color="white" />
                  ) : (
                    <Text
                      style={{
                        textAlign: 'center',
                        color: colors.white,
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Send View Request
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/*SEND REQUESTED MOBILE NUMBER LIMIT OVER MODAL*/}
      <Modal
        transparent={true}
        animationType="none"
        visible={numberSendRequestLimitModal}
        onRequestClose={() => setNumberSendRequestLimitModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              // padding: 25,
              borderRadius: 10,
              width: '90%',
              // alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 5,
                width: hp(35),
                height: hp(35),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setNumberSendRequestLimitModal(false);
              }}>
              <Image
                source={icons.x_cancel_icon}
                style={{width: hp(15), height: hp(15), resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: fontSize(16),
                marginTop: hp(65),
                fontFamily: fontFamily.poppins500,
                color: colors.pureBlack,
                textAlign: 'center',
              }}>
              Your limit has expired. Upgrade to{'\n'}access premium features.
            </Text>

            <View
              style={{
                marginTop: hp(32),
                marginBottom: hp(31),
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                // onPress={handleRequestMobileNumber}
                onPress={() => {
                  setNumberSendRequestLimitModal(false);
                  navigation.navigate('Upgrader');
                }}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={{
                    width: wp(270),
                    height: hp(50),
                    borderRadius: 50,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: colors.white,
                      fontSize: fontSize(16),
                      lineHeight: hp(24),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Upgrade
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserContactDetail;
