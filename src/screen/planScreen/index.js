import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {style} from './style';
import {icons, images} from '../../assets';
import GradientText from '../../components/textGradientColor';
import LinearGradient from 'react-native-linear-gradient';
import CommonGradientButton from '../../components/commonGradientButton';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {useSelector} from 'react-redux';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import ProfileAvatar from '../../components/letterProfileComponent';
import {colors} from '../../utils/colors';

const PlanScreen = () => {
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [planDetails, setPlanDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noPlan, setNoPlan] = useState(false);
  const [creditData, setCreditData] = useState(null);

  // console.log(' === planDetails ===> ', planDetails);

  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;
  const userID = user?.user?.id;

  const [hasRequested, setHasRequested] = useState(null); // ✅ store API flag
  const topModalBottomSheetRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      const fetchUserPlan = async () => {
        if (!accessToken) {
          console.warn('No access token found');
          return;
        }

        setLoading(true);
        setNoPlan(false);
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
          console.log('API Response:', data);

          if (response.ok && data?.data?.planId) {
            setPlanDetails(data.data);
          } else {
            setNoPlan(true);
            setPlanDetails(null);
          }
        } catch (error) {
          console.error('Fetch error:', error);
          Alert.alert('Network Error', 'Unable to fetch user plan');
        } finally {
          setLoading(false);
        }
      };

      fetchUserPlan();
    }, [accessToken]),
  );

  useFocusEffect(
    useCallback(() => {
      const cancelPlanRequest = async () => {
        if (!accessToken || !userID) {
          console.warn('Missing accessToken or userID');
          return;
        }
        setLoading(true);

        try {
          const response = await fetch(
            `https://stag.mntech.website/api/v1/user/cancel-plan-request/by-user/${userID}`,
            {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
            },
          );

          const data = await response.json();
          console.log('API Response:', data[0]?.hasRequested);

          // ✅ check flag
          if (data[0]?.hasRequested === true) {
            setHasRequested(true);
          } else {
            setHasRequested(false);
          }
        } catch (error) {
          console.error('API Error:', error);
          setHasRequested(false);
        } finally {
          setLoading(false);
        }
      };

      cancelPlanRequest();
    }, [accessToken, userID]),
  );

  useEffect(() => {
    const fetchCredit = async () => {
      if (!accessToken || !userID) {
        console.warn('Missing accessToken or userId');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/user/get-credit/${userID}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch credit data');
        }

        const data = await response.json();
        setCreditData(data);
      } catch (error) {
        console.error('Error fetching credit:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCredit();
  }, [accessToken, userID]);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const capitalizeFirstLetter = text => {
    if (!text || typeof text !== 'string') {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  console.log(' === var ===> ', planDetails?.planId?.planDuration);

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

  const formatDateWithSuffix = dateString => {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    const day = date.getDate();
    const year = date.getFullYear();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const month = monthNames[date.getMonth()];
    const getDaySuffix = d => {
      if (d > 3 && d < 21) {
        return 'th';
      }
      switch (d % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };
    return `${day}${getDaySuffix(day)} ${month} ${year}`;
  };

  return (
    <SafeAreaView style={style.container}>
      {/* Header */}
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />
          <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>
            {userImage ? (
              <Image
                source={{uri: userImage}}
                style={style.profileImageStyle}
              />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName}
                lastName={user?.user?.lastName}
                textStyle={style.profileImageStyle}
                profileTexts={{fontSize: fontSize(10)}}
              />
            )}
          </TouchableOpacity>
        </View>
        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />
        <HomeTopSheetComponent
          isVisible={topModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        />
        <View style={style.headingTittleContainer}>
          <Text style={style.headingCredentialsText}>Plan </Text>
          <TouchableOpacity
            style={style.backButtonContainer}
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back_arrow_icon}
              style={style.backButtonIconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={style.underLineHeaderStyle} />

      {/* Body */}
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : noPlan ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            // padding: 20,
          }}>
          <Image
            source={icons.no_plan_found_icon}
            style={{width: wp(57), height: hp(70), resizeMode: 'contain'}}
          />
          <Text
            style={{
              fontSize: fontSize(18),
              color: 'black',
              marginTop: hp(20),
              fontFamily: fontFamily.poppins500,
            }}>
            No Plan Found
          </Text>

          <View style={{position: 'absolute', bottom: 30}}>
            <CommonGradientButton
              onPress={() => {
                navigation.navigate('Upgrader');
              }}
              buttonName={'Upgrade Now'}
              containerStyle={style.autoRenewButton}
              buttonTextStyle={{
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins400,
              }}
            />
          </View>
        </View>
      ) : planDetails ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={style.bodyBoxContainer}>
            <View style={style.boxStyle}>
              <Image
                source={images.plan_background_img}
                style={style.boxBackGroundImage}
              />
              <View style={style.imageTextContainer}>
                <Text style={style.currentPlanTextStyle}>
                  You’re Current Plan
                </Text>
                <GradientText style={style.gradientColorText}>
                  {capitalizeFirstLetter(planDetails?.planId?.planName)} -{' '}
                  {formatPlanDuration(planDetails?.planId?.planDuration)}
                </GradientText>
                <View style={{flexDirection: 'row'}}>
                  <View>
                    <Text style={style.yourPaidText}>You paid</Text>
                    <Text style={style.priceText}>
                      INR {Math.round(planDetails?.planId?.totalPrice || 0)}.00
                    </Text>
                  </View>
                  <View style={{marginLeft: wp(120)}}>
                    <Text style={style.yourPaidText}>Status</Text>
                    <Text style={style.priceText}>Active</Text>
                  </View>
                </View>
              </View>

              <View style={style.imageBottomContainer}>
                <Text style={style.benefitText}>Benefits</Text>
                <View style={[style.descriptionTextContainer, {marginTop: 15}]}>
                  <Image
                    source={icons.green_check_icon}
                    style={style.greenCheckIcon}
                  />
                  <Text style={style.descriptionText}>
                    Send Unlimited Messages
                    {/*<Text style={style.textColor}>*/}
                    {/*  {planDetails?.planId?.allowNumberOfProfile} Profiles*/}
                    {/*</Text>*/}
                  </Text>
                </View>

                <View style={style.descriptionTextContainer}>
                  <Image
                    source={
                      creditData?.credit?.creditBalance === 0
                        ? icons.red_cancel_icon
                        : icons.green_check_icon
                    }
                    style={style.greenCheckIcon}
                  />
                  <Text style={style.descriptionText}>
                    Contact Details for{' '}
                    <Text style={style.textColor}>
                      {creditData?.credit?.creditBalance} Profiles
                    </Text>
                  </Text>
                </View>

                <View style={style.descriptionTextContainer}>
                  <Image
                    source={icons.green_check_icon}
                    style={style.greenCheckIcon}
                  />
                  <Text style={style.descriptionText}>Online Support</Text>
                </View>

                <View style={style.planIssueContainer}>
                  <Text style={style.planTittle}>Date of Purchase</Text>
                  <Text style={style.issueTextStyle}>
                    {formatDateWithSuffix(planDetails?.startDate)}
                  </Text>
                </View>

                <View style={style.planIssueContainer}>
                  <Text style={style.planTittle}>Payment Method</Text>
                  <Text style={style.issueTextStyle}>
                    {capitalizeFirstLetter(planDetails?.paymentMethod)}
                  </Text>
                </View>

                <View style={style.planIssueContainer}>
                  <Text style={style.planTittle}>Expire on</Text>
                  <Text style={style.issueTextStyle}>
                    {formatDateWithSuffix(planDetails?.endDate)}
                  </Text>
                </View>

                {/*<TouchableOpacity*/}
                {/*  style={{marginTop: hp(35)}}*/}
                {/*  activeOpacity={0.7}>*/}
                {/*  <LinearGradient*/}
                {/*    colors={['#0D4EB3', '#9413D0']}*/}
                {/*    style={style.gradientBorder}>*/}
                {/*    <View style={style.gradientBorderTextContainer}>*/}
                {/*      <Text style={style.notNowText}>Cancel Plan</Text>*/}
                {/*    </View>*/}
                {/*  </LinearGradient>*/}
                {/*</TouchableOpacity>*/}

                {hasRequested ? (
                  // ✅ Show Submitted Request
                  <ImageBackground
                    source={images.gradient_border_button_img}
                    style={{
                      width: '100%',
                      height: hp(44),
                      resizeMode: 'stretch',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginTop: hp(35),
                    }}
                    imageStyle={{resizeMode: 'stretch', borderRadius: 8}}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: fontSize(14),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Submitted Request
                    </Text>
                  </ImageBackground>
                ) : (
                  // ✅ Show Cancel Plan
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('PlanCancelScreen', {
                        planDetails: planDetails, // 👈 passing your data
                      });
                    }}
                    activeOpacity={0.7}
                    style={{marginTop: hp(35)}}>
                    <LinearGradient
                      colors={['#0D4EB3', '#9413D0']}
                      style={{
                        width: '100%',
                        height: hp(44),
                        borderRadius: 50,
                        borderWidth: 1,
                        justifyContent: 'center',
                        borderColor: 'transparent',
                      }}>
                      <View
                        style={{
                          borderRadius: 50,
                          flex: 1,
                          backgroundColor: colors.white,
                          justifyContent: 'center',
                          margin: isIOS ? 0 : 1.2,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            backgroundColor: 'transparent',
                            color: colors.black,
                            margin: 10,
                            fontSize: fontSize(14),
                            lineHeight: hp(21),
                            fontFamily: fontFamily.poppins500,
                          }}>
                          Request Cancellation
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                )}
                <View style={style.space} />
              </View>
            </View>
          </View>
          <View style={style.space} />
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
};

export default PlanScreen;
