import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import style from './style';
import LinearGradient from 'react-native-linear-gradient';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, screenHeight, wp} from '../../utils/helpers';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import RBSheet from 'react-native-raw-bottom-sheet';
import {paymentDetails} from '../../actions/homeActions';
import {useDispatch, useSelector} from 'react-redux';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import ProfileAvatar from '../../components/letterProfileComponent';
import axios from 'axios';
import RazorpayCheckout from 'react-native-razorpay';
import Config from 'react-native-config';
import GradientButton from '../../components/GradientButton';

const UpgradeScreen = () => {
  const [selectedOption, setSelectedOption] = useState('silver');
  const [topModalVisible, setTopModalVisible] = useState(false);
  const RBSheetRef = useRef();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [pressed, setPressed] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null); // Track which question is expanded
  const [loading, setLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  // console.log(' === setSelectedPlan__ ===> ', selectedPlan);

  const toggleExpand = index => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle expand/collapse
  };

  const API_URL = Config.API_URL || 'https://stag.mntech.website/api';

  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);

  // console.log(' === user ===> ', user?.user?.mobileNumber);

  const AccessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;

  const topModalBottomSheetRef = useRef(null);

  const openTopBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  useEffect(() => {
    dispatch(paymentDetails());
  }, [dispatch]);

  const payment = useSelector(state => state.home);
  const PlanDetails = payment?.paymentDetail;
  const token = user?.tokens?.access?.token;

  // console.log(' === PlanDetails.... ===> ', PlanDetails);

  const [subscriptionPlans, setSubscriptionPlans] = useState({
    silver: [],
    gold: [],
  });
  const [userPlan, setUserPlan] = useState(null); // store user plan details

  const openBottomSheet = plan => {
    setSelectedPlan(plan);
    RBSheetRef.current.open();
    setIsBottomSheetOpen(true);
  };

  const closeBottomSheet = () => {
    handlePayment();
    RBSheetRef.current.close();
    setIsBottomSheetOpen(false);
  };

  const handleSheetClosed = () => {
    setIsBottomSheetOpen(false);
  };

  useEffect(() => {
    const fetchPlansAndUserPlan = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/plan/get-plan',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${AccessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();

        // Transform API data into your expected format
        const transformedPlans = {
          silver: [],
          gold: [],
        };

        const labelMap = {
          monthly: 'One',
          'two-month': 'Two',
          'three-month': 'Three',
        };

        const labelsMap = {
          monthly: 'Month',
          'two-month': 'Month',
          'three-month': 'Month',
        };

        json?.data?.forEach((plan, index) => {
          // console.log(' === plan ===> ', plan);
          const {
            planName,
            planDuration,
            price,
            totalPrice,
            discount,
            discountAmount,
            allowNumberOfProfile,
            allowNumberOfRequest,
          } = plan;

          const planItem = {
            key: String(index + 1),
            NewPrice: Math.round(totalPrice).toString(),
            OldPrice: Math.round(price).toString(),
            Discount: `${discount}% off`,
            label: labelMap[planDuration] || '',
            labels: labelsMap[planDuration] || '',
            DiscountPrice: Math.round(discountAmount).toString(),
            PlanName: planName,
            MessageNumber: allowNumberOfProfile.toString(),
            SendRequestNumber: allowNumberOfRequest.toString(),
            planName, // store for comparison
            planDuration, // store for comparison
          };

          if (planName === 'silver') {
            transformedPlans.silver.push(planItem);
          } else if (planName === 'gold') {
            transformedPlans.gold.push(planItem);
          }
        });

        setSubscriptionPlans(transformedPlans);

        // 2️⃣ Fetch user's current plan
        const userPlanRes = await fetch(
          'https://stag.mntech.website/api/v1/user/user-plan/get-user-planbyId',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${AccessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!userPlanRes.ok) {
          throw new Error(`HTTP error! status: ${userPlanRes.status}`);
        }

        const userPlanJson = await userPlanRes.json();
        console.log('=== USER PLAN DETAILS ===', userPlanJson);

        setUserPlan(userPlanJson.data); // store for later use
      } catch (err) {
        console.error('Error fetching plan:', err);
        console.log(err.message);
        // setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (AccessToken) {
      fetchPlansAndUserPlan();
    }
  }, [AccessToken]);

  const handleContinuePayment = () => {
    const hasAnyPlan = !!userPlan; // true if user has purchased any plan

    if (hasAnyPlan) {
      setShowPlanModal(true); // show modal for any purchased plan
      RBSheetRef.current?.close();
    } else {
      console.log('You can buy a plan');
      handlePayment();
      RBSheetRef.current?.close();
    }
  };

  const handlePayment = async () => {
    try {
      // 1. Create Razorpay Order
      const response = await axios.post(
        `${API_URL}/v1/user/razorpay/order`,
        {planId: PlanDetails?.data[0]?.id},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true', // optional
          },
        },
      );

      const {id: orderId, amount, paymentHistoryToken} = response.data;

      if (!paymentHistoryToken) {
        throw new Error('Payment history token missing');
      }

      // 2. Construct callback URL for Razorpay server to notify backend
      const callbackUrl = `${API_URL}/v1/user/razorpay/is-order-complete?authToken=${encodeURIComponent(
        token,
      )}&paymentHistoryToken=${encodeURIComponent(paymentHistoryToken)}`;

      // 3. Razorpay Options
      const options = {
        key: 'rzp_live_OyWOR7Tj1c7Vnh',
        name: 'Happy Milan',
        description: 'Credits towards consultation',
        image: 'https://i.imgur.com/3g7nmJC.png',
        order_id: orderId,
        amount: amount.toString(), // In paise
        currency: 'INR',
        callback_url: callbackUrl,
        prefill: {
          name: user?.user?.name || 'User',
          email: user?.user?.email || 'test@example.com',
          contact: user?.user?.mobileNumber || '9999999999',
        },
        theme: {color: '#0F52BA'},
      };

      // 4. Open Razorpay payment screen
      RazorpayCheckout.open(options)
        .then(data => {
          console.log('Payment Success:', data);
          Alert.alert('Payment Successful', 'We are verifying your payment.');
          // Verification handled by callback_url server-side
        })
        .catch(error => {
          console.error('Payment Failed:', error);
          Alert.alert(
            'Payment Error',
            error.description || 'Please try again.',
          );
        });
    } catch (error) {
      console.error(
        'Order Creation Error:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Unable to initiate payment.');
    }
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };
  const openTopSheetModal = () => {
    toggleModal();
  };

  const handleOptionClick = option => {
    setSelectedOption(option);
  };

  const renderItem = ({item}) => {
    // console.log(' === renderItem ===> ', item);

    return (
      <View style={{marginHorizontal: 18}}>
        <TouchableHighlight
          underlayColor="#F9FBFF"
          style={[
            style.itemContainer,
            pressed && {backgroundColor: 'white'}, // Change background color when pressed
          ]}
          activeOpacity={0.7}
          onPress={() => openBottomSheet(item)}>
          <View>
            <View
              style={{
                marginTop: hp(25),
                flexDirection: 'row',
                // justifyContent: 'space-between',
                // marginHorizontal: 17,
                // backgroundColor: 'red',
                alignItems: 'center',
                marginHorizontal: hp(27),
              }}>
              <Text
                style={{
                  color: '#8225AF',
                  fontFamily: fontFamily.poppins600,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  alignSelf: 'center',
                  // backgroundColor: 'orange',
                  width: '40%',
                }}>
                {item.label}{' '}
                <Text
                  style={{
                    color: colors.black,
                    fontFamily: fontFamily.poppins600,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                  }}>
                  {item.labels}
                </Text>
                {userPlan?.planId?.planName === item.planName &&
                  Math.round(userPlan?.planId?.totalPrice) ===
                    Number(item.NewPrice) && (
                    <Text
                      style={{
                        color: '#AAAAAA',
                        fontFamily: fontFamily.poppins600,
                        fontSize: fontSize(13),
                        // marginLeft: 5,
                      }}>
                      {' '}
                      (Current Plan)
                    </Text>
                  )}
              </Text>

              {/*<View style={{width: 100, marginRight: 40}}>*/}
              <View
                style={{
                  marginLeft: wp(20),
                  flexDirection: 'row',
                  // backgroundColor: 'orange',
                }}>
                <Text
                  style={{
                    fontSize: fontSize(24),
                    lineHeight: hp(36),
                    fontFamily: fontFamily.poppins700,
                    color: 'black',
                  }}>
                  Rs.
                </Text>

                <Text
                  style={{
                    fontSize: fontSize(24),
                    lineHeight: hp(36),
                    fontFamily: fontFamily.poppins700,
                    color: colors.black,
                  }}>
                  {item.NewPrice}
                </Text>

                {/*<Image*/}
                {/*  source={icons.rightSideIcon}*/}
                {/*  style={{*/}
                {/*    width: hp(4.57),*/}
                {/*    height: hp(8),*/}
                {/*    alignSelf: 'center',*/}
                {/*    marginLeft: hp(2),*/}
                {/*  }}*/}
                {/*/>*/}
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                // alignSelf: 'flex-end',
                marginTop: hp(3),
                marginLeft: wp(165),
                // backgroundColor: 'orange',
              }}>
              <Text
                style={{
                  // textAlign: 'right',
                  textDecorationLine: 'line-through',
                  color: colors.black,
                  fontFamily: fontFamily.poppins600,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  // width: '42%',
                  // backgroundColor: 'red',
                  // marginRight: hp(20),
                }}>
                Rs. {item.OldPrice}
              </Text>

              <View
                style={{
                  width: hp(77),
                  height: hp(24),
                  backgroundColor: '#A7F7D1',
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginLeft: hp(10),
                }}>
                <Text
                  style={{
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins500,
                    color: colors.black,
                  }}>
                  {item.Discount}
                </Text>
              </View>
            </View>

            {/*<View*/}
            {/*  style={{*/}
            {/*    width: wp(77),*/}
            {/*    height: hp(20),*/}
            {/*    borderRadius: 12,*/}
            {/*    backgroundColor: '#A7F7D1',*/}
            {/*    justifyContent: 'center',*/}
            {/*    alignItems: 'center',*/}
            {/*    // marginRight: hp(25),*/}
            {/*  }}>*/}
            {/*  <Text*/}
            {/*    style={{*/}
            {/*      fontSize: fontSize(10),*/}
            {/*      lineHeight: hp(15),*/}
            {/*      fontFamily: fontFamily.poppins500,*/}
            {/*      color: '#17C270',*/}
            {/*    }}>*/}
            {/*    {item.Discount}*/}
            {/*  </Text>*/}
            {/*</View>*/}
            <View
              style={{
                position: 'absolute',
                // justifyContent: 'center',
                // alignItems: 'center',
                // alignSelf: 'center',
                right: 15,
                marginTop: hp(50),
              }}>
              <Image
                source={icons.rightSideIcon}
                style={{
                  width: hp(8),
                  height: hp(14),
                  alignSelf: 'center',
                  marginLeft: hp(2),
                  tintColor: '#EBEBEB',
                }}
              />
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={{flex: 1}}>
        <View
          style={{
            backgroundColor: isBottomSheetOpen
              ? 'rgba(0, 0, 0, 0.3)'
              : '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/*<Button title="OPEN BOTTOM SHEET" onPress={openBottomSheet} />*/}
        </View>

        <RBSheet
          ref={RBSheetRef}
          height={screenHeight * 0.9 - 60}
          closeOnDragDown={true}
          closeOnPressMask={true}
          onClose={handleSheetClosed} // Added onClose callback
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
            },
            draggableIcon: {
              backgroundColor: '#ffffff',
            },
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}>
          <View style={{flex: 1}}>
            <View style={{marginHorizontal: 24}}>
              <Text style={style.bottomSheetOneMonthText}>
                {selectedPlan?.label}{' '}
                <Text style={{color: colors.black}}>Month</Text>
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={style.oneMonthPriceText}>
                  Rs.{selectedPlan?.NewPrice}
                </Text>

                <Text style={style.oldPriceText}>
                  Rs.{selectedPlan?.OldPrice}
                </Text>

                <View style={style.offerContainer}>
                  <Text style={style.offerTextStyle}>
                    {selectedPlan?.Discount}
                  </Text>
                </View>
              </View>
            </View>

            <View style={style.headingLine} />

            <View style={{marginHorizontal: 24}}>
              <Text style={style.bodyTittleText}>Plan Benefits</Text>

              <View style={style.tittleBodyContainer}>
                <Text style={style.tittleOneTextStyle}>
                  Message to{' '}
                  <Text style={style.tittleTextColor}>
                    {selectedPlan?.MessageNumber} Profiles
                  </Text>
                </Text>

                <Image
                  source={icons.confirm_check_icon}
                  style={style.checkIcon}
                />
              </View>

              <View style={style.tittleBodyContainer}>
                <Text style={style.tittleOneTextStyle}>
                  Send request to{' '}
                  <Text style={style.tittleTextColor}>
                    {selectedPlan?.SendRequestNumber} Profiles
                  </Text>
                </Text>

                <Image
                  source={icons.confirm_check_icon}
                  style={style.checkIcon}
                />
              </View>

              <View style={style.tittleBodyContainer}>
                <Text style={style.tittleOneTextStyle}>Online Support</Text>
                <Image
                  source={icons.confirm_check_icon}
                  style={style.checkIcon}
                />
              </View>
            </View>

            <View style={[style.headingLine, {marginBottom: 0}]} />

            <View style={{backgroundColor: '#F9F9F9'}}>
              <View
                style={{
                  marginHorizontal: 24,
                  // backgroundColor: 'grey',
                  marginTop: 24,
                  marginBottom: 24,
                }}>
                <Text style={style.bodyTittleText}>Plan Summary</Text>

                <View style={style.tittleBodyContainer}>
                  <Text style={style.planSummeryTittle}>
                    {selectedPlan?.PlanName?.charAt(0).toUpperCase() +
                      selectedPlan?.PlanName?.slice(1)}
                    <Text style={style.planSummerySubTittle}>
                      {' '}
                      -{' '}
                      {selectedPlan?.label?.charAt(0).toUpperCase() +
                        selectedPlan?.label?.slice(1)}{' '}
                      Month Plan
                    </Text>
                  </Text>

                  <Text style={style.planSummaryPrice}>
                    Rs. {selectedPlan?.OldPrice}
                  </Text>
                </View>

                <View style={style.tittleBodyContainer}>
                  <Text style={style.tittleOneTextStyle}>
                    Discount (-)
                    {/*<Text style={style.tittleTextColor}>10 Profiles</Text>*/}
                  </Text>

                  <Text style={style.planSummaryPrice}>
                    Rs. {selectedPlan?.DiscountPrice}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[style.headingLine, {marginTop: 0}]} />

            <View
              style={{
                marginHorizontal: 24,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={style.totalText}>
                  Total Payable{' '}
                  {/*<Text style={style.gstTextStyle}>(Incl. 18% GST)</Text>*/}
                </Text>

                <Text style={style.planSummaryPrice}>
                  Rs. {selectedPlan?.NewPrice}
                </Text>
              </View>
            </View>

            <View style={style.bottomSheetBottomButtonContainer}>
              <TouchableOpacity
                onPress={handleContinuePayment}
                disabled={
                  userPlan?.planId?.planName?.toLowerCase() ===
                    selectedPlan?.planName?.toLowerCase() &&
                  Math.round(userPlan?.planId?.totalPrice) ===
                    Number(selectedPlan?.NewPrice)
                }
                style={{
                  opacity:
                    userPlan?.planId?.planName?.toLowerCase() ===
                      selectedPlan?.planName?.toLowerCase() &&
                    Math.round(userPlan?.planId?.totalPrice) ===
                      Number(selectedPlan?.NewPrice)
                      ? 0.5
                      : 1,
                }}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']} // keep original colors
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={style.payButtonColorGradient}>
                  <Text style={style.payButtonText}>
                    {userPlan?.planId?.planName?.toLowerCase() ===
                      selectedPlan?.planName?.toLowerCase() &&
                    Math.round(userPlan?.planId?.totalPrice) ===
                      Number(selectedPlan?.NewPrice)
                      ? 'Already Purchased'
                      : 'Continue Payment'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>

        <LinearGradient
          colors={['#0D4EB3', '#9413D0']}
          style={style.headerContainer}
          start={{x: 0, y: 0}}
          end={{x: 1.1, y: 0}}>
          {/*{user?.user?.appUsesType !== 'dating' && (*/}
          {/*  <View style={style.headerTittleStyle}>*/}
          {/*    <Image*/}
          {/*      source={icons.headerIconWhite}*/}
          {/*      style={style.headerLogoStyle}*/}
          {/*    />*/}

          {/*    /!*<TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>*!/*/}
          {/*    <TouchableOpacity*/}
          {/*      activeOpacity={0.7}*/}
          {/*      onPress={openTopBottomSheet}>*/}
          {/*      {userImage ? (*/}
          {/*        <Image*/}
          {/*          source={{uri: userImage}}*/}
          {/*          style={style.profileImageStyle}*/}
          {/*        />*/}
          {/*      ) : (*/}
          {/*        <ProfileAvatar*/}
          {/*          firstName={user?.user?.firstName}*/}
          {/*          lastName={user?.user?.lastName}*/}
          {/*          textStyle={style.profileImageStyle}*/}
          {/*          profileTexts={{fontSize: fontSize(10)}}*/}
          {/*        />*/}
          {/*      )}*/}
          {/*    </TouchableOpacity>*/}
          {/*  </View>*/}
          {/*)}*/}

          <View>
            <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />
          </View>

          <View style={style.headerDescriptionContainer}>
            <Text style={style.headerTittleTextStyle}>
              Hi {user?.user?.firstName}, Upgrade Your Profile
            </Text>

            <Text style={style.headerTittleDescriptionTextStyle}>
              Upgrade your profile and find your perfect match
            </Text>

            {/*<Text style={style.headerTittleDescriptionTextStyle}>*/}
            {/*  with exclusive benefits!*/}
            {/*</Text>*/}
          </View>
        </LinearGradient>

        {/*<View style={{marginHorizontal: 18}}>*/}
        {/*  <View style={style.headingBodYContainer}>*/}
        {/*    <TouchableOpacity*/}
        {/*      onPress={() => handleOptionClick('silver')}*/}
        {/*      style={style.silverTouchableFunctionality}>*/}
        {/*      <LinearGradient*/}
        {/*        colors={*/}
        {/*          selectedOption === 'silver'*/}
        {/*            ? ['#0D4EB3', '#9413D0']*/}
        {/*            : ['transparent', 'transparent']*/}
        {/*        }*/}
        {/*        start={{x: 0, y: 0.5}}*/}
        {/*        end={{x: 1, y: 0.5}}*/}
        {/*        style={style.silverTextContainer}*/}
        {/*      />*/}

        {/*      <Text*/}
        {/*        style={[*/}
        {/*          style.silverText,*/}
        {/*          {color: selectedOption === 'silver' ? 'white' : 'black'},*/}
        {/*        ]}>*/}
        {/*        Silver*/}
        {/*      </Text>*/}
        {/*    </TouchableOpacity>*/}

        {/*    <TouchableOpacity*/}
        {/*      onPress={() => handleOptionClick('gold')}*/}
        {/*      style={style.goldContainer}>*/}
        {/*      <LinearGradient*/}
        {/*        colors={*/}
        {/*          selectedOption === 'gold'*/}
        {/*            ? ['#0D4EB3', '#9413D0']*/}
        {/*            : ['transparent', 'transparent']*/}
        {/*        }*/}
        {/*        start={{x: 0, y: 0.5}}*/}
        {/*        end={{x: 1, y: 0.5}}*/}
        {/*        style={style.goldBodyContainer}*/}
        {/*      />*/}
        {/*      <Text*/}
        {/*        style={[*/}
        {/*          style.goldText,*/}
        {/*          {color: selectedOption === 'gold' ? 'white' : 'black'},*/}
        {/*        ]}>*/}
        {/*        Gold*/}
        {/*      </Text>*/}
        {/*    </TouchableOpacity>*/}

        {/*    <TouchableOpacity*/}
        {/*      onPress={() => handleOptionClick('platinum')}*/}
        {/*      style={style.platinumBodyContainer}>*/}
        {/*      <LinearGradient*/}
        {/*        colors={*/}
        {/*          selectedOption === 'platinum'*/}
        {/*            ? ['#0D4EB3', '#9413D0']*/}
        {/*            : ['transparent', 'transparent']*/}
        {/*        }*/}
        {/*        start={{x: 0, y: 0.5}}*/}
        {/*        end={{x: 1, y: 0.5}}*/}
        {/*        style={style.platinumBody}*/}
        {/*      />*/}
        {/*      <Text*/}
        {/*        style={[*/}
        {/*          style.platinumText,*/}
        {/*          {color: selectedOption === 'platinum' ? 'white' : 'black'},*/}
        {/*        ]}>*/}
        {/*        Platinum*/}
        {/*      </Text>*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*</View>*/}

        <View style={{marginHorizontal: 18}}>
          <View
            style={{
              width: '100%',
              height: hp(60),
              borderRadius: 30,
              backgroundColor: colors.white,
              flexDirection: 'row',
              padding: 4,
              justifyContent: 'space-between',
              alignItems: 'center',
              borderColor: '#2D40BA',
              borderWidth: 1,
              top: -30,
            }}>
            {/* SILVER OPTION */}
            <TouchableOpacity
              onPress={() => handleOptionClick('silver')}
              style={{
                flex: 1,
                borderRadius: 25,
                overflow: 'hidden',
                height: '100%',
                marginRight: 5,
              }}>
              <LinearGradient
                colors={
                  selectedOption === 'silver'
                    ? ['#0D4EB3', '#9413D0']
                    : ['transparent', 'transparent']
                }
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={{
                  flex: 1,
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins500,
                    color:
                      selectedOption === 'silver' ? colors.white : '#000000',
                  }}>
                  Silver
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* GOLD OPTION */}
            <TouchableOpacity
              onPress={() => handleOptionClick('gold')}
              style={{
                flex: 1,
                borderRadius: 25,
                overflow: 'hidden',
                height: '100%',
                marginLeft: 5,
              }}>
              <LinearGradient
                colors={
                  selectedOption === 'gold'
                    ? ['#0D4EB3', '#9413D0']
                    : ['transparent', 'transparent']
                }
                start={{x: 0, y: 0.5}}
                end={{x: 1, y: 0.5}}
                style={{
                  flex: 1,
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins500,
                    color: selectedOption === 'gold' ? colors.white : '#000000',
                  }}>
                  Gold
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: hp(50),
            }}>
            <ActivityIndicator size="large" color="#0D4EB3" />
          </View>
        ) : (
          <>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={style.choiceDescriptionText}>
                Choose your subscription
              </Text>

              <FlatList
                data={subscriptionPlans[selectedOption]}
                renderItem={renderItem}
              />

              <HomeTopSheetComponent
                isVisible={topModalVisible}
                onBackdropPress={toggleModal}
                onBackButtonPress={toggleModal}
              />

              <Text style={style.bottomTittleText}>
                Frequently Asked Questions
              </Text>

              <View style={{marginHorizontal: 18}}>
                <View style={style.bottomQueryBody}>
                  {/* Question 1 */}
                  <TouchableOpacity
                    onPress={() => toggleExpand(0)}
                    style={{
                      backgroundColor:
                        expandedIndex === 0 ? '#F5F9FF' : 'white',
                      borderTopRightRadius: 14,
                      borderTopLeftRadius: 14,
                    }}>
                    <View style={style.queryTittleContainer}>
                      <Text style={style.queryTittle}>
                        What payment options are available?
                      </Text>

                      <Image
                        source={icons.down_arrow_icon}
                        style={{
                          width: hp(9),
                          height: hp(5),
                          transform: [
                            {
                              rotate:
                                expandedIndex === 0 ? '-180deg' : '-90deg',
                            },
                          ], // Rotate arrow when expanded
                        }}
                      />
                    </View>
                    {expandedIndex === 0 && ( // Show text only if expanded
                      <View style={style.querySubTittleContainer}>
                        <Text style={style.querySubTittle}>
                          We accept a wide range of payment methods,{'\n'}
                          including:
                        </Text>

                        <View
                          style={{
                            flexDirection: 'row',
                            marginLeft: hp(8),
                            marginTop: hp(15),
                          }}>
                          <View
                            style={{
                              width: hp(5),
                              height: hp(5),
                              borderRadius: 50,
                              backgroundColor: 'black',
                              top: 6,
                            }}
                          />

                          <Text
                            style={[style.querySubTittle, {marginLeft: hp(8)}]}>
                            Credit/Debit Cards (Visa, MasterCard,{'\n'}American
                            Express)
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            marginLeft: hp(8),
                            marginTop: hp(5),
                          }}>
                          <View
                            style={{
                              width: hp(5),
                              height: hp(5),
                              borderRadius: 50,
                              backgroundColor: 'black',
                              top: 6,
                            }}
                          />

                          <Text
                            style={[style.querySubTittle, {marginLeft: hp(8)}]}>
                            Digital Wallets (PayPal, Google Pay, Apple Pay)
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            marginLeft: hp(8),
                            marginTop: hp(5),
                          }}>
                          <View
                            style={{
                              width: hp(5),
                              height: hp(5),
                              borderRadius: 50,
                              backgroundColor: 'black',
                              top: 6,
                            }}
                          />

                          <Text
                            style={[style.querySubTittle, {marginLeft: hp(8)}]}>
                            Net Banking and UPI (for users in supported{'\n'}
                            regions)
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: 'row',
                            marginLeft: hp(8),
                            marginTop: hp(5),
                          }}>
                          <View
                            style={{
                              width: hp(5),
                              height: hp(5),
                              borderRadius: 50,
                              backgroundColor: 'black',
                              top: 6,
                            }}
                          />

                          <Text
                            style={[style.querySubTittle, {marginLeft: hp(8)}]}>
                            Mobile Payments (where available)
                          </Text>
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>

                  <View style={style.queryBorderCenterLine} />

                  {/* Question 2 */}
                  <TouchableOpacity
                    onPress={() => toggleExpand(1)}
                    style={{
                      backgroundColor:
                        expandedIndex === 1 ? '#F5F9FF' : 'white',
                    }}>
                    <View style={style.queryTittleContainer}>
                      <Text style={style.queryTittle}>
                        Can I cancel the plan at any time?
                      </Text>

                      <Image
                        source={icons.down_arrow_icon}
                        style={{
                          width: hp(9),
                          height: hp(5),
                          transform: [
                            {
                              rotate:
                                expandedIndex === 1 ? '-180deg' : '-90deg',
                            },
                          ], // Rotate arrow when expanded
                        }}
                      />
                    </View>

                    {expandedIndex === 1 && ( // Show text only if expanded
                      <View style={style.querySubTittleContainer}>
                        <Text style={style.querySubTittle}>
                          Yes, you can cancel your subscription at any time.
                          {'\n'}If you cancel during an active subscription
                          period,{'\n'}your premium features will remain
                          available until{'\n'}the end of the billing cycle.
                          After that, your{'\n'}account will revert to a free
                          plan.
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <View style={style.queryBorderCenterLine} />

                  {/* Question 3 */}
                  <TouchableOpacity
                    onPress={() => toggleExpand(2)}
                    style={{
                      backgroundColor:
                        expandedIndex === 2 ? '#F5F9FF' : 'white',
                    }}>
                    <View style={style.queryTittleContainer}>
                      <Text style={style.queryTittle}>
                        Do you offer refunds?
                      </Text>

                      <Image
                        source={icons.down_arrow_icon}
                        style={{
                          width: hp(9),
                          height: hp(5),
                          transform: [
                            {
                              rotate:
                                expandedIndex === 2 ? '-180deg' : '-90deg',
                            },
                          ], // Rotate arrow when expanded
                        }}
                      />
                    </View>

                    {expandedIndex === 2 && ( // Show text only if expanded
                      <View style={style.querySubTittleContainer}>
                        <Text style={style.querySubTittle}>
                          Refunds are generally not provided after a{'\n'}
                          subscription has been activated, except in cases{'\n'}
                          of accidental charges or technical issues. Please
                          {'\n'}
                          contact our support team within 14 days of{'\n'}
                          purchase for refund inquiries.
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>

                  <View style={style.queryBorderCenterLine} />

                  {/* Question 4 */}
                  <TouchableOpacity
                    onPress={() => toggleExpand(3)}
                    style={{
                      backgroundColor:
                        expandedIndex === 3 ? '#F5F9FF' : 'white',
                      borderBottomLeftRadius: 14,
                      borderBottomRightRadius: 14,
                    }}>
                    <View style={style.queryTittleContainer}>
                      <Text style={style.queryTittle}>
                        What happens if my payment fails?
                      </Text>

                      <Image
                        source={icons.down_arrow_icon}
                        style={{
                          width: hp(9),
                          height: hp(5),
                          transform: [
                            {
                              rotate:
                                expandedIndex === 3 ? '-180deg' : '-90deg',
                            },
                          ], // Rotate arrow when expanded
                        }}
                      />
                    </View>

                    {expandedIndex === 3 && ( // Show text only if expanded
                      <View style={style.querySubTittleContainer}>
                        <Text style={style.querySubTittle}>
                          If your payment fails, you will receive a notification
                          {'\n'}
                          with the option to update your payment details.{'\n'}
                          Your subscription will remain active for a short{'\n'}
                          grace period, during which you can resolve the{'\n'}
                          payment issue.
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{height: 50}} />
            </ScrollView>
          </>
        )}
      </View>

      <Modal
        visible={showPlanModal}
        transparent
        animationType="none"
        onRequestClose={() => setShowPlanModal(false)}>
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
              // padding: 20,
              borderRadius: 10,
              width: '90%',
              alignItems: 'center',
            }}>
            <View style={{marginTop: hp(49), marginHorizontal: 18}}>
              <Text
                style={{
                  fontSize: fontSize(16),
                  textAlign: 'center',
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins500,
                  color: colors.black,
                }}>
                Current Plan is active, after expired{'\n'}or cancelled then
                only will allow to{'\n'}activate new plan.
              </Text>
              {/*<TouchableOpacity*/}
              {/*  onPress={() => setShowPlanModal(false)}*/}
              {/*  style={{*/}
              {/*    marginTop: 20,*/}
              {/*    backgroundColor: '#0D4EB3',*/}
              {/*    paddingVertical: 8,*/}
              {/*    paddingHorizontal: 20,*/}
              {/*    borderRadius: 8,*/}
              {/*  }}>*/}
              {/*  <Text style={{color: '#fff', fontSize: 14}}>OK</Text>*/}
              {/*</TouchableOpacity>*/}

              <GradientButton
                onPress={() => setShowPlanModal(false)}
                buttonName={'ok'}
                containerStyle={{
                  borderRadius: 50,
                  width: wp(120),
                  height: hp(50),
                  marginTop: hp(30),
                  marginBottom: hp(40),
                }}
                buttonTextStyle={{
                  fontSize: fontSize(18),
                  fontFamily: fontFamily.poppins500,
                }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UpgradeScreen;
