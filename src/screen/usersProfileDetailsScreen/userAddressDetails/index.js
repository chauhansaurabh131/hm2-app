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
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';
import {icons} from '../../../assets';
import {useNavigation} from '@react-navigation/native';

const UserAddressDetails = (...params) => {
  const UserData = params[0]?.friendList;

  const MatchesScreenData = params[0];

  console.log(
    ' === MatchesScreenData__ ===> ',
    MatchesScreenData?.privacySettingCustom?.address,
  );

  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  // console.log(' === MatchesScreenData ===> ', MatchesScreenData);

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

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle null or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const currentResidenceAddress = capitalizeFirstLetter(
    MatchesScreenData?.address?.currentResidenceAddress ||
      UserData?.address?.currentResidenceAddress,
  );

  const currentCity = capitalizeFirstLetter(
    MatchesScreenData?.address?.currentCity || UserData?.address?.currentCity,
  );

  const currentCountry = capitalizeFirstLetter(
    MatchesScreenData?.address?.currentCountry ||
      UserData?.address?.currentCountry,
  );

  const originCountry = capitalizeFirstLetter(
    MatchesScreenData?.originCountry || UserData?.address?.originCountry,
  );
  const originResidenceAddress = capitalizeFirstLetter(
    MatchesScreenData?.originResidenceAddress ||
      UserData?.address?.originResidenceAddress,
  );

  const originCity = capitalizeFirstLetter(
    MatchesScreenData?.originCity || UserData?.address?.originCity,
  );

  return (
    <SafeAreaView style={style.container}>
      {/*<Text style={style.detailTittleText}>Current Residing Address</Text>*/}

      {/*<Text style={style.detailSubTittleText}>*/}
      {/*  /!*01-02, Delhi Street, Delhi, India*!/*/}
      {/*  {currentResidenceAddress || 'N/A'}*/}
      {/*</Text>*/}

      <View style={style.containerBody}>
        {isLoading ? (
          <View style={{marginTop: hp(150)}}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : planStatus === 'active' ? (
          MatchesScreenData?.privacySettingCustom?.address ? (
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
                Private Address
              </Text>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(14),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  marginTop: 2,
                }}>
                This user has hidden their address details
              </Text>
            </View>
          ) : (
            <>
              <Text style={style.detailTittleText}>Current City</Text>
              <Text style={style.detailSubTittleText}>
                {currentCity || 'N/A'}
              </Text>

              <Text style={style.detailsTittleTextStyle}>
                Current Residing Country
              </Text>
              <Text style={style.detailSubTittleText}>
                {currentCountry || 'N/A'}
              </Text>

              <Text style={style.detailsTittleTextStyle}>
                Permanent Address
              </Text>
              <Text style={style.detailSubTittleText}>
                {currentCity || 'N/A'}, {currentResidenceAddress || 'N/A'},{' '}
                {currentCountry || 'N/A'}
              </Text>
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

export default UserAddressDetails;
