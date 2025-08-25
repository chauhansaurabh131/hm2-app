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
import {fontFamily, fontSize, hp} from '../../utils/helpers';
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

  console.log(' === creditData ===> ', creditData?.credit?.creditBalance);

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
          console.log('User Plan Response:', data);

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

  return (
    <SafeAreaView style={style.container}>
      <View style={style.cardContainer}>
        <LinearGradient
          colors={['#0D4EB3', '#9413D0']}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1.5}}
          style={style.cardBodyStyle}>
          <View style={style.cardViewStyle}>
            {profilePicUrl ? (
              <Image source={{uri: profilePicUrl}} style={style.imageStyle} />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName}
                lastName={user?.user?.lastName}
                textStyle={style.imageStyle}
              />
            )}
            <View style={style.cardTextContainer}>
              {/*<Text style={style.cardUserTextStyle}>Riya Shah</Text>*/}
              <Text style={style.cardUserTextStyle}>
                {/*{firstName} {lastName}*/}
                {name}
              </Text>

              {planDetails?.planId?.planName ? (
                // When API gives planName
                <View>
                  <Text
                    style={[style.cardSubTittleTextStyle, {marginTop: hp(5)}]}>
                    {UserUniqueId}
                  </Text>
                  {/*<View style={style.cardCenterLineStyle} />*/}
                  <Text
                    style={[style.cardSubTittleTextStyle, {marginTop: hp(5)}]}>
                    {capitalizeFirstLetter(planDetails?.planId?.planName)} -{' '}
                    {formatPlanDuration(
                      planDurationDetails?.planId?.planDuration,
                    )}
                  </Text>

                  <View
                    style={{
                      width: '100%',
                      height: 0.5,
                      backgroundColor: 'white',
                      marginTop: hp(13),
                    }}
                  />

                  <Text
                    style={{
                      color: colors.white,
                      fontSize: fontSize(13),
                      // lineHeight: hp(20),
                      fontFamily: fontFamily.poppins500,
                      marginTop: hp(14),
                    }}>
                    Available Credits : {creditData?.credit?.creditBalance}
                  </Text>
                </View>
              ) : (
                // When no API plan data, fallback to Free Plan
                <>
                  <View style={style.cardSubTittleContainer}>
                    <Text style={style.cardSubTittleTextStyle}>
                      {UserUniqueId}
                    </Text>
                    <View style={style.cardCenterLineStyle} />
                    <Text style={style.cardSubTittleTextStyle}>Free Plan</Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      navigation.navigate('Upgrader');
                    }}
                    style={style.cardButtonContainer}>
                    <View style={style.cardButtonBodyStyle}>
                      <View style={style.cardButtonTextContainer}>
                        <Text style={style.cardButtonTextStyle}>Upgrade</Text>
                        <Image
                          source={icons.crownIcon}
                          style={style.cardButtonImageStyle}
                        />
                      </View>
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
