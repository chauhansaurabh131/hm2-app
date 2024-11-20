import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
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

const UpgradeScreen = () => {
  const [selectedOption, setSelectedOption] = useState('silver');
  const [topModalVisible, setTopModalVisible] = useState(false);
  const RBSheetRef = useRef();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [pressed, setPressed] = useState(false);

  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);
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

  // console.log(' === PlanDetails.... ===> ', PlanDetails);

  const openBottomSheet = (newPrice, oldPrice) => {
    setSelectedPrice({newPrice, oldPrice});
    RBSheetRef.current.open();
    setIsBottomSheetOpen(true);
  };

  const closeBottomSheet = () => {
    RBSheetRef.current.close();
    setIsBottomSheetOpen(false);
  };

  const handleSheetClosed = () => {
    setIsBottomSheetOpen(false);
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
      style={[
        style.itemContainer,
        pressed && {backgroundColor: 'white'}, // Change background color when pressed
      ]}
      activeOpacity={0.7}
      onPress={() => openBottomSheet(item.NewPrice, item.OldPrice)}>
      <View>
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
                color: '#17C270',
              }}>
              {item.Discount}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          height={screenHeight * 0.7 - 50}
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
            <Text style={style.bottomSheetOneMonthText}>One Month Plan</Text>

            <Text style={style.oneMonthPriceText}>
              {selectedPrice.newPrice}
            </Text>

            <View style={style.bottomSheetHeadingBodyContainer}>
              <Text style={style.InrText}>INR</Text>

              <Text style={style.oldPriceText}>{selectedPrice.oldPrice}</Text>

              <View style={style.offerContainer}>
                <Text style={style.offerTextStyle}>20% Off</Text>
              </View>
            </View>

            <View style={style.headingLine} />

            <Text style={style.bodyTittleText}>What Will You Get?</Text>

            <View style={style.tittleBodyContainer}>
              <Text style={style.tittleOneTextStyle}>
                Message to{' '}
                <Text style={style.tittleTextColor}>10 Profiles</Text>
              </Text>

              <Image
                source={icons.confirm_check_icon}
                style={style.checkIcon}
              />
            </View>

            <View style={style.tittleBodyContainer}>
              <Text style={style.tittleOneTextStyle}>
                Send request to{' '}
                <Text style={style.tittleTextColor}>10 Profiles</Text>
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

            <View style={style.bottomSheetBottomButtonContainer}>
              <TouchableOpacity activeOpacity={0.7} onPress={closeBottomSheet}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  style={style.notNowButtonColorGradient}>
                  <View style={style.notNowButtonContainer}>
                    <Text style={style.notNowButtonText}>Not Now</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                // onPress={handleModalClose}
              >
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={style.payButtonColorGradient}>
                  <Text style={style.payButtonText}>Proceed to Pay</Text>
                  <Image
                    source={icons.light_arrow_icon}
                    style={style.payButtonIcon}
                  />
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
          <View style={style.headerTittleStyle}>
            <Image
              source={icons.headerIconWhite}
              style={style.headerLogoStyle}
            />

            {/*<TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>*/}
            <TouchableOpacity activeOpacity={0.7} onPress={openTopBottomSheet}>
              <Image
                source={userImage ? {uri: userImage} : images.empty_male_Image}
                style={style.profileImageStyle}
              />
            </TouchableOpacity>
          </View>

          <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

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

        <View style={style.headingBodYContainer}>
          <TouchableOpacity
            onPress={() => handleOptionClick('silver')}
            style={style.silverTouchableFunctionality}>
            <LinearGradient
              colors={
                selectedOption === 'silver'
                  ? ['#0D4EB3', '#9413D0']
                  : ['transparent', 'transparent']
              }
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={style.silverTextContainer}
            />

            <Text
              style={[
                style.silverText,
                {color: selectedOption === 'silver' ? 'white' : 'black'},
              ]}>
              Silver
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOptionClick('gold')}
            style={style.goldContainer}>
            <LinearGradient
              colors={
                selectedOption === 'gold'
                  ? ['#0D4EB3', '#9413D0']
                  : ['transparent', 'transparent']
              }
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={style.goldBodyContainer}
            />
            <Text
              style={[
                style.goldText,
                {color: selectedOption === 'gold' ? 'white' : 'black'},
              ]}>
              Gold
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleOptionClick('platinum')}
            style={style.platinumBodyContainer}>
            <LinearGradient
              colors={
                selectedOption === 'platinum'
                  ? ['#0D4EB3', '#9413D0']
                  : ['transparent', 'transparent']
              }
              start={{x: 0, y: 0.5}}
              end={{x: 1, y: 0.5}}
              style={style.platinumBody}
            />
            <Text
              style={[
                style.platinumText,
                {color: selectedOption === 'platinum' ? 'white' : 'black'},
              ]}>
              Platinum
            </Text>
          </TouchableOpacity>
        </View>

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
      </View>
    </SafeAreaView>
  );
};

export default UpgradeScreen;
