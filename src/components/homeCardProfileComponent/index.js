import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {style} from './style';
import LinearGradient from 'react-native-linear-gradient';
import ProfileAvatar from '../letterProfileComponent';
import {icons} from '../../assets';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const HomeCardProfileComponent = () => {
  const {user} = useSelector(state => state.auth);
  const profilePicUrl = user?.user?.profilePic;
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const navigation = useNavigation();

  const [planDetails, setPlanDetails] = useState(null);
  const [planDurationDetails, setPlanDurationDetails] = useState(null);
  const [creditData, setCreditData] = useState(null);
  const [loading, setLoading] = useState(false);

  // console.log(' === creditData ===> ', creditData?.credit?.creditBalance);

  useFocusEffect(
    useCallback(() => {
      const fetchUserPlan = async () => {
        if (!accessToken) {
          return;
        }

        try {
          const response = await fetch(
            'https://stag.mntech.website/api/v1/user/user-plan/get-user-planbyId',
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
            `https://stag.mntech.website/api/v1/user/user/get-credit/${userId}`,
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

  const capitalizeFirstLetter = str => {
    if (!str || typeof str !== 'string') {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const name = capitalizeFirstLetter(user?.user?.name || '');

  const UserUniqueId = user?.user?.userUniqueId;

  // console.log(' === UserUniqueId ===> ', UserUniqueId);

  const size = wp(93);

  return (
    <SafeAreaView style={style.container}>
      <View style={style.cardContainer}>
        <LinearGradient
          colors={['#A586FF', '#7045EB']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={style.cardBodyStyle}>
          <View style={style.cardViewStyle}>
            {profilePicUrl ? (
              <Image
                source={{uri: profilePicUrl}}
                style={{
                  width: size,
                  height: size,
                  marginLeft: wp(23),
                  borderRadius: size / 2,
                  resizeMode: 'cover',
                  alignSelf: 'center',
                  overflow: 'hidden',
                }}
              />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName}
                lastName={user?.user?.lastName}
                textStyle={{
                  width: size,
                  height: size,
                  marginLeft: wp(23),
                  borderRadius: size / 2,
                  resizeMode: 'cover',
                  alignSelf: 'center',
                  overflow: 'hidden',
                }}
              />
            )}

            <View style={style.cardTextContainer}>
              <Text style={style.cardUserTextStyle}>{name}</Text>
              {planDetails?.planId ? (
                <>
                  <Text
                    style={[
                      style.cardSubTittleTextStyle,
                      {marginTop: hp(5), textTransform: 'uppercase'},
                    ]}>
                    {UserUniqueId}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: hp(10),
                    }}>
                    <Image
                      source={icons.green_check_icon}
                      tintColor={'white'}
                      style={{
                        width: hp(10),
                        height: hp(10),
                        resizeMode: 'contain',
                        marginRight: wp(7),
                        top: -2,
                      }}
                    />

                    <Text style={style.cardSubTittleTextStyle}>
                      {formatPlanDuration(
                        planDurationDetails?.planId?.planDuration,
                      )}{' '}
                      - {capitalizeFirstLetter(planDetails?.planId?.planName)}{' '}
                      Plan
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={style.cardSubTittleContainer}>
                    <Text
                      style={[
                        style.cardSubTittleTextStyle,
                        {textTransform: 'uppercase', top: 1},
                      ]}>
                      {UserUniqueId}
                    </Text>

                    <View style={style.cardCenterLineStyle} />

                    <Text
                      style={[
                        style.cardSubTittleTextStyle,
                        {top: 1, color: '#BDA6FF'},
                      ]}>
                      Free Plan
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('Upgrader')}
                    activeOpacity={0.6}
                    style={{
                      width: wp(87),
                      height: hp(31),
                      backgroundColor: colors.white,
                      borderRadius: hp(10),
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginTop: hp(10),
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={{
                          color: '#8665F1',
                          fontSize: fontSize(10),
                          fontFamily: fontFamily.poppins600,
                        }}>
                        Upgrade
                      </Text>

                      <Image
                        source={icons.upgrade_Star_Icon}
                        style={{
                          width: hp(12),
                          height: hp(12),
                          resizeMode: 'contain',
                          marginLeft: wp(7),
                        }}
                      />
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};
export default HomeCardProfileComponent;
