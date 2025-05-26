import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {style} from './style';
import {useSelector} from 'react-redux';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../utils/colors';
import {icons} from '../../../assets';

const UserContactDetail = (...params) => {
  const UserData = params[0]?.friendList;

  // console.log(' === UserData ===> ', UserData?.email);

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const [planStatus, setPlanStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loader state

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!accessToken) {
        console.warn('No access token available');
        return;
      }

      setIsLoading(true); // Start loading

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
        setIsLoading(false); // End loading
      }
    };

    fetchSubscription();
  }, [accessToken]);

  const MatchesScreenData = params[0];

  const rawMobileNumber =
    MatchesScreenData?.mobileNumber?.toString() ||
    UserData?.mobileNumber?.toString();

  const rawHomeMobileNumber =
    MatchesScreenData?.homeMobileNumber?.toString() ||
    UserData?.homeMobileNumber?.toString();

  const email = MatchesScreenData?.email || UserData?.email;

  // Function to format the mobile number as "+91 90001 01021"
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
  const HomeMobileNumber = formatMobileNumber(rawHomeMobileNumber);

  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        {isLoading ? (
          <View style={{marginTop: hp(150)}}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : planStatus === 'active' ? (
          <>
            <Text style={style.detailTittleText}>Mobile Number</Text>

            <Text style={style.detailSubTittleText}>
              {/*+91 90001 01021*/}
              {mobileNumber || 'N/A'}
            </Text>

            <Text style={style.detailsTittleTextStyle}>Home Number</Text>

            <Text style={style.detailSubTittleText}>
              {/*+91 90001 01021*/}
              {HomeMobileNumber || 'N/A'}
            </Text>

            <Text style={style.detailsTittleTextStyle}>Email Address</Text>

            <Text style={style.detailSubTittleText}>
              {/*riyashah@gmail.com*/}
              {email || 'N/A'}
            </Text>
          </>
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
                onPress={() => {
                  navigation.navigate('Upgrader');
                }}
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
    </SafeAreaView>
  );
};

export default UserContactDetail;
