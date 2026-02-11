import React, {useCallback, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet'; // ✅ import bottom sheet
import {style} from './style';
import LinearGradient from 'react-native-linear-gradient';
import {icons} from '../../assets';

import {useSelector} from 'react-redux';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import RazorpayCheckout from 'react-native-razorpay';
import Config from 'react-native-config';
import GradientButton from '../../components/GradientButton';

const PlanItem = ({item, onPress, planDetails}) => {
  const [pressed, setPressed] = useState(false);

  const formatDuration = duration => {
    switch (duration) {
      case 'monthly':
        return 'One ';
      case 'two-month':
        return 'Two ';
      case 'three-month':
        return 'Three ';
      default:
        return duration;
    }
  };

  const isCurrentPlan =
    planDetails?.status === 'active' && planDetails?.planId?.id === item?.id;

  return (
    <View style={style.renderContainer}>
      <TouchableOpacity
        style={[style.itemContainer, pressed && {backgroundColor: 'white'}]}
        activeOpacity={0.7}
        onPress={() => {
          if (onPress) {
            onPress(item);
          }
        }}
        onPressIn={() => setPressed(true)}
        onPressOut={() => setPressed(false)}>
        <View>
          <View style={style.renderLabelContainer}>
            <Text style={style.renderLabelText}>
              {formatDuration(item?.planDuration)}
              <Text style={style.renderLabelTexts}>Month</Text>
            </Text>

            {isCurrentPlan && (
              <Text
                style={{
                  color: '#AAAAAA',
                  fontFamily: fontFamily.poppins600,
                  fontSize: fontSize(13),
                  position: 'absolute',
                  top: 30,
                }}>
                (Current Plan)
              </Text>
            )}

            <View style={style.renderPriceContainer}>
              <Text style={style.renderPriceText}>Rs.</Text>
              <Text style={style.renderPriceText}>
                {Math.round(item?.totalPrice)}
              </Text>
            </View>
          </View>

          <View style={style.renderDiscountContainer}>
            <Text style={style.renderDiscountPrice}>Rs.{item?.price}</Text>

            <View style={style.renderDiscountBody}>
              <Text style={style.renderDiscountBodyText}>
                {item.discount}% Off
              </Text>
            </View>
          </View>

          <View style={style.renderImageContainer}>
            <Image
              source={icons.rightSideIcon}
              style={style.renderImageStyle}
            />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const DatingUpgradeScreen = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planDetails, setPlanDetails] = useState(null);
  const [planDurationDetails, setPlanDurationDetails] = useState(null);
  const [creditData, setCreditData] = useState(null);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const isAlreadyPurchased =
    planDetails?.status === 'active' &&
    Math.round(planDetails?.planId?.totalPrice) ===
      Math.round(selectedPlan?.totalPrice);

  // console.log(' === planDetails ===> ', planDetails?.status);
  // console.log(' === planDetails___ ===> ', planDetails);

  const API_URL = Config.API_URL || 'https://stag.mntech.website/api';

  const bottomSheetRef = useRef(null);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        'https://stag.mntech.website/api/v1/user/plan/get-plan-dating',
        {headers: {Authorization: `Bearer ${accessToken}`}},
      );
      setPlans(response.data?.data || []);
    } catch (error) {
      console.error(
        'Error fetching plans:',
        error?.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

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

  useFocusEffect(
    useCallback(() => {
      if (accessToken) {
        fetchPlans();
        fetchUserPlan();
        fetchCredit();
      }
    }, [accessToken, userId]),
  );

  const handlePayment = async plan => {
    bottomSheetRef.current?.close();

    try {
      // 1️⃣ Create Razorpay Order on backend
      const response = await axios.post(
        `${API_URL}/v1/user/razorpay/order`,
        {planId: plan?.id},
        {headers: {Authorization: `Bearer ${accessToken}`}},
      );

      const {id: orderId, amount, paymentHistoryToken} = response.data;

      if (!paymentHistoryToken) {
        Alert.alert('Error', 'Payment token missing. Try again.');
        return;
      }

      // 2️⃣ Razorpay Checkout options
      const options = {
        key: 'rzp_live_OyWOR7Tj1c7Vnh',
        name: 'Hapmeet',
        description: 'Credits towards consultation',
        image: 'https://i.imgur.com/3g7nmJC.png',
        order_id: orderId,
        amount: amount.toString(),
        currency: 'INR',
        prefill: {
          name: user?.user?.name || 'User',
          email: user?.user?.email || 'test@example.com',
          contact: user?.user?.mobileNumber || '9999999999',
        },
        theme: {color: '#0F52BA'},
      };

      // 3️⃣ Open Razorpay Checkout
      RazorpayCheckout.open(options)
        .then(async paymentResult => {
          console.log('✅ Payment Success:', paymentResult);

          const callbackUrl = `${API_URL}/v1/user/razorpay/is-order-complete?authToken=${encodeURIComponent(
            accessToken,
          )}&paymentHistoryToken=${encodeURIComponent(
            paymentHistoryToken,
          )}&type=mobile`;

          try {
            // ✅ Send payment verification data to backend
            const verifyResponse = await axios.post(callbackUrl, {
              razorpay_payment_id: paymentResult.razorpay_payment_id,
              razorpay_order_id: paymentResult.razorpay_order_id,
              razorpay_signature: paymentResult.razorpay_signature,
            });

            console.log('✅ Backend verification:', verifyResponse.data);
            Alert.alert('Success', 'Payment completed successfully!');
            fetchPlans();
            fetchUserPlan();
            fetchCredit();
          } catch (verifyError) {
            console.error(
              '❌ Verification Error:',
              verifyError.response?.data || verifyError.message,
            );
            Alert.alert('Failed', 'Payment captured but verification failed.');
          }
        })
        .catch(error => {
          console.error('❌ Payment Failed:', error);
          Alert.alert('Failed', 'Transaction failed or cancelled.');
        });
    } catch (error) {
      console.error(
        '❌ Order Creation Error:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Unable to initiate payment.');
    }
  };

  const openPlanBottomSheet = plan => {
    setSelectedPlan(plan);
    bottomSheetRef.current.open();
  };

  const formatDuration = duration => {
    switch (duration) {
      case 'monthly':
        return 'One ';
      case 'two-month':
        return 'Two ';
      case 'three-month':
        return 'Three ';
      default:
        return duration;
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <LinearGradient
        colors={['#7045EB', '#4819CB']}
        style={style.headerContainer}
        start={{x: 0, y: 0}}
        end={{x: 1.1, y: 0}}>
        <View style={style.headerBody}>
          <Image source={icons.headerIconWhite} style={style.appLogoStyle} />
        </View>

        <View style={style.headerDescriptionContainer}>
          <Text style={style.headerTittleTextStyle}>
            Hi {user?.user?.firstName || user?.user?.name}
          </Text>
          <Text style={style.headerTittleTextStyle}>Upgrade Your Profile</Text>
        </View>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="blue"
          style={{marginTop: hp(230)}}
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={style.choosePlanTextStyle}>
            Choose your subscription
          </Text>

          {plans.length > 0 ? (
            plans.map((item, index) => (
              <PlanItem
                key={index.toString()}
                item={item}
                onPress={openPlanBottomSheet}
                planDetails={planDetails}
              />
            ))
          ) : (
            <Text>No plans found</Text>
          )}
        </ScrollView>
      )}

      {/* ✅ BottomSheet for selected plan */}
      <RBSheet
        ref={bottomSheetRef}
        height={hp(630)}
        openDuration={250}
        closeOnDragDown={true}
        closeOnPressMask={true}
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
            // padding: 16,
          },
        }}>
        {selectedPlan ? (
          <View style={{flex: 1}}>
            <View style={{marginHorizontal: 24}}>
              <Text style={style.bottomSheetOneMonthText}>
                {formatDuration(selectedPlan?.planDuration)}{' '}
                <Text style={{color: colors.black}}>Month</Text>
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={style.oneMonthPriceText}>
                  Rs.{Math.round(selectedPlan.totalPrice)}
                </Text>

                <Text style={style.oldPriceText}>Rs.{selectedPlan?.price}</Text>

                <View style={style.offerContainer}>
                  <Text style={style.offerTextStyle}>
                    {selectedPlan.discount}% off
                  </Text>
                </View>
              </View>
            </View>

            <View style={style.headingLine} />

            <View style={{marginHorizontal: 24}}>
              <Text style={style.bodyTittleText}>Plan Benefits</Text>

              <View style={style.tittleBodyContainer}>
                <Text style={style.tittleOneTextStyle}>
                  Send Unlimited Messages
                  {/*<Text style={style.tittleTextColor}>*/}
                  {/*  {selectedPlan.allowNumberOfProfile} Profiles*/}
                  {/*</Text>*/}
                </Text>

                <Image
                  source={icons.confirm_check_icon}
                  style={style.checkIcon}
                />
              </View>

              <View style={style.tittleBodyContainer}>
                <Text style={style.tittleOneTextStyle}>
                  Contact Details for{' '}
                  <Text style={style.tittleTextColor}>
                    {selectedPlan.allowNumberOfRequest} Profiles
                  </Text>
                </Text>

                <Image
                  source={icons.confirm_check_icon}
                  style={style.checkIcon}
                />
              </View>

              <View style={style.tittleBodyContainer}>
                <Text style={style.tittleOneTextStyle}>
                  Priority Online Support
                </Text>
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
                    {formatDuration(selectedPlan?.planDuration)}
                    <Text style={style.tittleOneTextStyle}>Month Plan</Text>
                  </Text>

                  <Text style={style.planSummaryPrice}>
                    Rs. {selectedPlan?.price}
                  </Text>
                </View>

                <View style={style.tittleBodyContainer}>
                  <Text style={style.tittleOneTextStyle}>
                    Discount (-)
                    {/*<Text style={style.tittleTextColor}>10 Profiles</Text>*/}
                  </Text>

                  <Text style={style.planSummaryPrice}>
                    Rs. {Math.round(selectedPlan.discountAmount)}
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
                  Rs. {Math.round(selectedPlan.totalPrice)}
                </Text>
              </View>
            </View>

            {/*<View*/}
            {/*  style={{*/}
            {/*    marginHorizontal: 24,*/}
            {/*    marginTop: hp(34),*/}
            {/*  }}>*/}
            {/*  {isAlreadyPurchased && creditData?.credit?.creditBalance > 0 ? (*/}
            {/*    <LinearGradient*/}
            {/*      colors={['#7045EB', '#4819CB']}*/}
            {/*      start={{x: 0, y: 0}}*/}
            {/*      end={{x: 1, y: 0}}*/}
            {/*      style={[*/}
            {/*        style.payButtonColorGradient,*/}
            {/*        {*/}
            {/*          opacity: 0.6, // Dim the button*/}
            {/*        },*/}
            {/*      ]}>*/}
            {/*      <Text style={[style.payButtonText, {color: '#fff'}]}>*/}
            {/*        Already Purchased*/}
            {/*      </Text>*/}
            {/*    </LinearGradient>*/}
            {/*  ) : (*/}
            {/*    <TouchableOpacity*/}
            {/*      onPress={() => {*/}
            {/*        handlePayment(selectedPlan);*/}
            {/*      }}*/}
            {/*      disabled={false}>*/}
            {/*      <LinearGradient*/}
            {/*        colors={['#7045EB', '#4819CB']}*/}
            {/*        start={{x: 0, y: 0}}*/}
            {/*        end={{x: 1, y: 0}}*/}
            {/*        style={style.payButtonColorGradient}>*/}
            {/*        <Text style={style.payButtonText}>Continue Payment</Text>*/}
            {/*      </LinearGradient>*/}
            {/*    </TouchableOpacity>*/}
            {/*  )}*/}
            {/*</View>*/}

            <View
              style={{
                marginHorizontal: 24,
                marginTop: hp(34),
              }}>
              {isAlreadyPurchased && creditData?.credit?.creditBalance > 0 ? (
                <LinearGradient
                  colors={['#7045EB', '#4819CB']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={[
                    style.payButtonColorGradient,
                    {
                      opacity: 0.6, // Dim the button
                    },
                  ]}>
                  <Text style={[style.payButtonText, {color: '#fff'}]}>
                    Already Purchased
                  </Text>
                </LinearGradient>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    // ✅ Check credit before payment
                    if (creditData?.credit?.creditBalance > 0) {
                      // Alert.alert(
                      //   'Info',
                      //   'You already have available credits. Please use them before purchasing a new plan.',
                      // );
                      setShowPlanModal(true);
                    } else {
                      handlePayment(selectedPlan);
                    }
                  }}
                  disabled={false}>
                  <LinearGradient
                    colors={['#7045EB', '#4819CB']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={style.payButtonColorGradient}>
                    <Text style={style.payButtonText}>Continue Payment</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ) : (
          <Text>No Plan Selected</Text>
        )}
      </RBSheet>

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

export default DatingUpgradeScreen;
