import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {useSelector} from 'react-redux';
import style from '../upgradeScreen/style';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';
import RBSheet from 'react-native-raw-bottom-sheet';

const DemoCode = () => {
  const {user} = useSelector(state => state.auth);
  const AccessToken = user?.tokens?.access?.token;

  const [selectedOption, setSelectedOption] = useState('silver');
  const [pressed, setPressed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [error, setError] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState({
    silver: [],
    gold: [],
  });
  const [userPlan, setUserPlan] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);

  console.log(' === selectedPlan___ ===> ', selectedPlan?.label);

  const bottomSheetRef = useRef(null);

  useEffect(() => {
    const fetchPlansAndUserPlan = async () => {
      setLoading(true);
      try {
        // Fetch all plans
        const planRes = await fetch(
          'https://stag.mntech.website/api/v1/user/plan/get-plan',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${AccessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        if (!planRes.ok) {
          throw new Error(`HTTP error! status: ${planRes.status}`);
        }
        const planJson = await planRes.json();

        const transformedPlans = {silver: [], gold: []};
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

        planJson?.data?.forEach((plan, index) => {
          const {
            planName,
            planDuration,
            price,
            totalPrice,
            discount,
            discountAmount,
          } = plan;
          const planItem = {
            key: String(index + 1),
            NewPrice: Math.round(totalPrice).toString(),
            OldPrice: Math.round(price).toString(),
            Discount: `${discount}% off`,
            label: labelMap[planDuration] || '',
            labels: labelsMap[planDuration] || '',
            DiscountPrice: Math.round(discountAmount).toString(),
            planName,
            planDuration,
          };
          if (planName === 'silver') {
            transformedPlans.silver.push(planItem);
          }
          if (planName === 'gold') {
            transformedPlans.gold.push(planItem);
          }
        });
        setSubscriptionPlans(transformedPlans);

        // Fetch current user plan
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
        setUserPlan(userPlanJson.data);
      } catch (err) {
        setError(err.message);
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
    } else {
      console.log('You can buy a plan');
      bottomSheetRef.current?.close();
    }
  };

  const handleOptionClick = option => setSelectedOption(option);

  const handlePlanPress = plan => {
    setSelectedPlan(plan);
    bottomSheetRef.current?.open();
  };

  const renderItem = ({item}) => {
    const isCurrentPlan =
      userPlan?.planId?.planName?.toLowerCase() ===
        item.planName?.toLowerCase() &&
      Math.round(userPlan?.planId?.totalPrice) === Number(item.NewPrice);

    return (
      <View style={{marginHorizontal: 18}}>
        <TouchableHighlight
          underlayColor="#F9FBFF"
          style={[style.itemContainer, pressed && {backgroundColor: 'white'}]}
          activeOpacity={0.7}
          onPress={() => handlePlanPress(item)}>
          <View>
            <View
              style={{
                marginTop: hp(25),
                flexDirection: 'row',
                alignItems: 'center',
                marginHorizontal: hp(27),
              }}>
              <Text
                style={{
                  color: '#8225AF',
                  fontFamily: fontFamily.poppins600,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  width: '40%',
                }}>
                {item.label}{' '}
                <Text style={{color: colors.black}}>{item.labels}</Text>
                {isCurrentPlan && (
                  <Text style={{color: 'green', fontSize: fontSize(14)}}>
                    {' '}
                    (Current Plan)
                  </Text>
                )}
              </Text>
              <View style={{marginLeft: wp(20), flexDirection: 'row'}}>
                <Text style={{fontSize: fontSize(24), color: 'black'}}>
                  Rs.
                </Text>
                <Text style={{fontSize: fontSize(24), color: colors.black}}>
                  {item.NewPrice}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(3),
                marginLeft: wp(165),
              }}>
              <Text
                style={{
                  textDecorationLine: 'line-through',
                  color: colors.black,
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
                <Text>{item.Discount}</Text>
              </View>
            </View>

            <View style={{position: 'absolute', right: 15, marginTop: hp(50)}}>
              <Image
                source={icons.rightSideIcon}
                style={{width: hp(8), height: hp(14), tintColor: '#EBEBEB'}}
              />
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      {/* Toggle buttons */}
      <View style={{marginHorizontal: wp(5), marginTop: hp(15)}}>
        <View
          style={{
            width: '100%',
            height: hp(60),
            borderRadius: 30,
            backgroundColor: colors.white,
            flexDirection: 'row',
            padding: 4,
            borderColor: '#2D40BA',
            borderWidth: 1,
          }}>
          {['silver', 'gold'].map(opt => (
            <TouchableOpacity
              key={opt}
              onPress={() => handleOptionClick(opt)}
              style={{
                flex: 1,
                borderRadius: 25,
                overflow: 'hidden',
                height: '100%',
                marginHorizontal: 5,
              }}>
              <LinearGradient
                colors={
                  selectedOption === opt
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
                    color: selectedOption === opt ? colors.white : '#000',
                  }}>
                  {opt.charAt(0).toUpperCase() + opt.slice(1)}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Plans */}
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#0D4EB3" />
        </View>
      ) : error ? (
        <Text style={{color: 'red', textAlign: 'center'}}>{error}</Text>
      ) : (
        <FlatList
          data={subscriptionPlans[selectedOption]}
          renderItem={renderItem}
          keyExtractor={item => item.key}
        />
      )}

      {/* Bottom Sheet */}
      <RBSheet
        ref={bottomSheetRef}
        height={220}
        openDuration={250}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 20,
          },
        }}>
        {selectedPlan && (
          <>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              {selectedPlan.planName.toUpperCase()} Plan
            </Text>
            <Text style={{marginVertical: 10}}>
              Price: Rs. {selectedPlan.NewPrice}
            </Text>

            <TouchableOpacity onPress={handleContinuePayment}>
              <LinearGradient
                colors={
                  userPlan?.planId?.planName?.toLowerCase() ===
                    selectedPlan.planName?.toLowerCase() &&
                  Math.round(userPlan?.planId?.totalPrice) ===
                    Number(selectedPlan.NewPrice)
                    ? ['#ccc', '#ccc'] // grey out for active plan
                    : ['#0D4EB3', '#9413D0']
                }
                style={{
                  borderRadius: 10,
                  paddingVertical: 12,
                  alignItems: 'center',
                }}>
                <Text style={{color: '#fff', fontSize: 16, fontWeight: 'bold'}}>
                  {userPlan?.planId?.planName?.toLowerCase() ===
                    selectedPlan.planName?.toLowerCase() &&
                  Math.round(userPlan?.planId?.totalPrice) ===
                    Number(selectedPlan.NewPrice)
                    ? 'Already Purchased'
                    : 'Continue Payment'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </RBSheet>

      <Modal
        visible={showPlanModal}
        transparent
        animationType="fade"
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
              padding: 20,
              borderRadius: 10,
              width: '80%',
              alignItems: 'center',
            }}>
            <Text
              style={{fontSize: 16, fontWeight: '600', textAlign: 'center'}}>
              Current Plan is active. After it expires or is cancelled, you can
              activate a new plan.
            </Text>
            <TouchableOpacity
              onPress={() => setShowPlanModal(false)}
              style={{
                marginTop: 20,
                backgroundColor: '#0D4EB3',
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 8,
              }}>
              <Text style={{color: '#fff', fontSize: 14}}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default DemoCode;
