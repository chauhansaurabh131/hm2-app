import React, {Fragment, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import style from './style';
import LinearGradient from 'react-native-linear-gradient';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated, {
  FadeIn,
  FadeOut,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import DemoPractiveCodeScreen from '../demoPractiveCodeScreen';

const PressAnimated = Animated.createAnimatedComponent(Pressable);
const HEIGHT = 300;
const CLAMP = 20;

const UpgradeScreen = () => {
  const [selectedOption, setSelectedOption] = useState('silver');
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [upGradePlan, setUpGradePlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const [isOpen, setIsOpen] = useState(false);
  const offset = useSharedValue(0);

  const handleBackdropPress = () => {
    setIsOpen(false);
  };

  const panGesture = Gesture.Pan()
    .onChange(event => {
      const offsetDelta = event.changeY + offset.value;
      const clamp = Math.max(-CLAMP, offsetDelta);
      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value < HEIGHT / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(HEIGHT, {}, () => {
          runOnJS(handleBackdropPress)();
        });
      }
    });

  const translateY = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: offset.value,
        },
      ],
    };
  }, []);

  useEffect(() => {
    function onOpen() {
      if (isOpen) {
        offset.value = 0;
      }
    }
    onOpen();
  }, [isOpen]);

  const openUpGradeModal = item => {
    setSelectedPlan(item);
    setUpGradePlan(true);
  };

  const closeUpGradeModal = () => {
    setUpGradePlan(false);
  };

  const [subscriptionPlans, setSubscriptionPlans] = useState({
    silver: [
      {
        key: '1',
        NewPrice: '599.00',
        OldPrice: '718.00',
        Discount: '20% off',
        label: 'One',
        labels: 'Month Plan',
      },
      {
        key: '2',
        NewPrice: '899.00',
        OldPrice: '1079.00',
        Discount: '20% off',
        label: 'Two',
        labels: 'Month Plan',
      },
      {
        key: '3',
        NewPrice: '1199.00',
        OldPrice: '1319.00',
        Discount: '20% off',
        label: 'Three',
        labels: 'Month Plan',
      },
    ],
    gold: [
      {
        key: '1',
        NewPrice: '799.00',
        OldPrice: '718.00',
        Discount: '20% off',
        label: 'One',
        labels: 'Month Plan',
      },
      {
        key: '2',
        NewPrice: '1099.00',
        OldPrice: '1079.00',
        Discount: '20% off',
        label: 'Two',
        labels: 'Month Plan',
      },
      {
        key: '3',
        NewPrice: '1399.00',
        OldPrice: '1319.00',
        Discount: '20% off',
        label: 'Three',
        labels: 'Month Plan',
      },
    ],
    platinum: [
      {
        key: '1',
        NewPrice: '999.00',
        OldPrice: '718.00',
        Discount: '20% off',
        label: 'One',
        labels: 'Month Plan',
      },
      {
        key: '2',
        NewPrice: '1299.00',
        OldPrice: '1079.00',
        Discount: '20% off',
        label: 'Two',
        labels: 'Month Plan',
      },
      {
        key: '3',
        NewPrice: '1699.00',
        OldPrice: '1319.00',
        Discount: '20% off',
        label: 'Three',
        labels: 'Month Plan',
      },
    ],
  });

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };
  const openTopSheetModal = () => {
    toggleModal();
  };

  const handleOptionClick = option => {
    setSelectedOption(option);
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => setIsOpen(prevState => !prevState)}>
      <View
        style={{
          marginTop: 10,
          width: wp(340),
          height: hp(91),
          borderRadius: 20,
          marginBottom: 1,
          backgroundColor: colors.white,
          alignSelf: 'center',
          ...Platform.select({
            ios: {
              shadowColor: 'lightblue',
              shadowOffset: {width: 0, height: 0.1},
              shadowOpacity: 0.5,
            },
            android: {
              elevation: 2,
            },
          }),
        }}>
        <View
          style={{
            marginTop: hp(20),
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 17,
          }}>
          <Text
            style={{
              color: colors.black,
              fontFamily: fontFamily.poppins600,
              fontSize: fontSize(13),
              lineHeight: hp(19.5),
              alignSelf: 'center',
            }}>
            {item.label}{' '}
            <Text
              style={{
                color: colors.black,
                fontFamily: fontFamily.poppins400,
                fontSize: fontSize(13),
                lineHeight: hp(19.5),
              }}>
              {item.labels}
            </Text>
          </Text>

          <Text
            style={{
              fontSize: fontSize(10),
              lineHeight: hp(15),
              fontFamily: fontFamily.poppins400,
              color: 'black',
              alignSelf: 'center',

              position: 'absolute',
              right: 127,
            }}>
            INR
          </Text>

          <View style={{width: 100, marginRight: 40}}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: fontSize(22),
                  lineHeight: hp(36),
                  fontFamily: fontFamily.poppins600,
                  color: colors.black,
                  textAlign: 'left',
                  width: '100%',
                  marginLeft: hp(20),
                }}>
                {item.NewPrice}
              </Text>

              <Image
                source={icons.rightSideIcon}
                style={{
                  width: hp(4.57),
                  height: hp(8),
                  alignSelf: 'center',
                  marginLeft: hp(2),
                }}
              />
            </View>
          </View>
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            marginTop: hp(3),
          }}>
          <Text
            style={{
              textAlign: 'right',
              textDecorationLine: 'line-through',
              color: colors.black,
              fontFamily: fontFamily.poppins500,
              fontSize: fontSize(10),
              lineHeight: hp(15),
              marginRight: hp(20),
            }}>
            {item.OldPrice}
          </Text>

          <View
            style={{
              width: wp(54),
              height: hp(20),
              borderRadius: 12,
              backgroundColor: '#F0FCF6',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: hp(25),
            }}>
            <Text
              style={{
                fontSize: fontSize(10),
                lineHeight: hp(15),
                fontFamily: fontFamily.poppins500,
                color: colors.black,
              }}>
              {item.Discount}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={style.container}>
      <SafeAreaView style={{flex: 1}}>
        <LinearGradient
          colors={['#0D4EB3', '#9413D0']}
          style={style.headerContainer}
          start={{x: 0, y: 0}}
          end={{x: 1.1, y: 0}}>
          <View style={style.headerTittleStyle}>
            <Image
              source={icons.headerIconWhite}
              style={style.headerLogoStyle}
            />

            <TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>
              <Image
                source={images.profileDisplayImage}
                style={style.profileImageStyle}
              />
            </TouchableOpacity>
          </View>

          <View style={style.headerDescriptionContainer}>
            <Text style={style.headerTittleTextStyle}>
              Hi Riya, Upgrade Your Profile
            </Text>

            <Text style={style.headerTittleDescriptionTextStyle}>
              Upgrade your profile and find your perfect match faster
            </Text>

            <Text style={style.headerTittleDescriptionTextStyle}>
              with exclusive benefits!
            </Text>
          </View>
        </LinearGradient>

        <View
          style={{
            width: wp(335),
            height: hp(60),
            borderWidth: 1,
            borderColor: colors.blue,
            alignSelf: 'center',
            borderRadius: 30,
            backgroundColor: colors.white,
            top: -30,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => handleOptionClick('silver')}
            style={{
              borderRadius: 25,
              width: wp(107),
              height: hp(50),
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: hp(6),
              overflow: 'hidden',
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
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                borderRadius: 25,
                width: wp(107),
                height: hp(50),
              }}
            />
            <Text
              style={{
                color: selectedOption === 'silver' ? 'white' : 'black',
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontWeight: '500',
              }}>
              Silver
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOptionClick('gold')}
            style={{
              borderRadius: 25,
              width: wp(107),
              height: hp(50),
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
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
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                borderRadius: 25,
                width: wp(107),
                height: hp(50),
              }}
            />
            <Text
              style={{
                color: selectedOption === 'gold' ? 'white' : 'black',
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontWeight: '500',
              }}>
              Gold
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOptionClick('platinum')}
            style={{
              borderRadius: 25,
              width: wp(107),
              height: hp(50),
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: hp(6),
              overflow: 'hidden',
            }}>
            <LinearGradient
              colors={
                selectedOption === 'platinum'
                  ? ['#0D4EB3', '#9413D0']
                  : ['transparent', 'transparent']
              }
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                borderRadius: 25,
                width: wp(107),
                height: hp(50),
              }}
            />
            <Text
              style={{
                color: selectedOption === 'platinum' ? 'white' : 'black',
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontWeight: '500',
              }}>
              Platinum
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={{
            textAlign: 'center',
            color: colors.black,
            marginBottom: hp(24),
          }}>
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

        {isOpen && (
          <Fragment>
            <PressAnimated
              onPress={handleBackdropPress}
              entering={FadeIn}
              exiting={FadeOut}
              style={{
                ...StyleSheet.absoluteFillObject,
                backgroundColor: 'rgba(0,0,0,0.45)',
                zIndex: 1,
              }}
            />
            <GestureDetector gesture={panGesture}>
              <Animated.View
                entering={SlideInDown.springify().damping(12)}
                exiting={SlideOutDown}
                style={[
                  {
                    backgroundColor: 'white',
                    height: HEIGHT,
                    width: '100%',
                    position: 'absolute',
                    bottom: -CLAMP * 1.1,
                    zIndex: 1,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  },
                  translateY,
                ]}>
                {/* Your component in bottom sheet */}
                <Text>sjdvksdvkn</Text>
              </Animated.View>
            </GestureDetector>
          </Fragment>
        )}
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default UpgradeScreen;
