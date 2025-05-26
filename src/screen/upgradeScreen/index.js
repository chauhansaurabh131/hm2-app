import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
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

const UpgradeScreen = () => {
  const [selectedOption, setSelectedOption] = useState('silver');
  const [topModalVisible, setTopModalVisible] = useState(false);
  const RBSheetRef = useRef();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [pressed, setPressed] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null); // Track which question is expanded

  const toggleExpand = index => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle expand/collapse
  };

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

  const openBottomSheet = (newPrice, oldPrice, label) => {
    setSelectedPrice({newPrice, oldPrice, label});
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
        NewPrice: '599',
        OldPrice: '718',
        Discount: '20% off',
        label: 'One',
        labels: 'Month',
      },
      {
        key: '2',
        NewPrice: '899',
        OldPrice: '1079',
        Discount: '20% off',
        label: 'Two',
        labels: 'Month',
      },
      {
        key: '3',
        NewPrice: '1199',
        OldPrice: '1319',
        Discount: '20% off',
        label: 'Three',
        labels: 'Month',
      },
    ],
    gold: [
      {
        key: '1',
        NewPrice: '799',
        OldPrice: '718',
        Discount: '20% off',
        label: 'One',
        labels: 'Month',
      },
      {
        key: '2',
        NewPrice: '1099',
        OldPrice: '1079',
        Discount: '20% off',
        label: 'Two',
        labels: 'Month',
      },
      {
        key: '3',
        NewPrice: '1399',
        OldPrice: '1319',
        Discount: '20% off',
        label: 'Three',
        labels: 'Month',
      },
    ],
    platinum: [
      {
        key: '1',
        NewPrice: '999',
        OldPrice: '718',
        Discount: '20% off',
        label: 'One',
        labels: 'Month',
      },
      {
        key: '2',
        NewPrice: '1299',
        OldPrice: '1079',
        Discount: '20% off',
        label: 'Two',
        labels: 'Month',
      },
      {
        key: '3',
        NewPrice: '1699',
        OldPrice: '1319',
        Discount: '20% off',
        label: 'Three',
        labels: 'Month',
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
    <View style={{marginHorizontal: 18}}>
      <TouchableHighlight
        underlayColor="#F9FBFF"
        style={[
          style.itemContainer,
          pressed && {backgroundColor: 'white'}, // Change background color when pressed
        ]}
        activeOpacity={0.7}
        onPress={() =>
          openBottomSheet(item.NewPrice, item.OldPrice, item.label)
        }>
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
                {selectedPrice.label}{' '}
                <Text style={{color: colors.black}}>Month</Text>
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <Text style={style.oneMonthPriceText}>
                  Rs.{selectedPrice.newPrice}
                </Text>

                <Text style={style.oldPriceText}>
                  Rs.{selectedPrice.oldPrice}
                </Text>

                <View style={style.offerContainer}>
                  <Text style={style.offerTextStyle}>20% Off</Text>
                </View>
              </View>
            </View>

            <View style={style.headingLine} />

            <View style={{marginHorizontal: 24}}>
              <Text style={style.bodyTittleText}>Plan Benefits</Text>

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
                    Gold
                    <Text style={style.planSummerySubTittle}>
                      {' '}
                      - One Month Plan
                    </Text>
                  </Text>

                  <Text style={style.planSummaryPrice}>
                    Rs. {selectedPrice.oldPrice}
                  </Text>
                </View>

                <View style={style.tittleBodyContainer}>
                  <Text style={style.tittleOneTextStyle}>
                    Send request to{' '}
                    <Text style={style.tittleTextColor}>10 Profiles</Text>
                  </Text>

                  <Text style={style.planSummaryPrice}>Rs. 200</Text>
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
                  <Text style={style.gstTextStyle}>(Incl. 18% GST)</Text>
                </Text>

                <Text style={style.planSummaryPrice}>
                  Rs. {selectedPrice.newPrice}
                </Text>
              </View>
            </View>

            <View style={style.bottomSheetBottomButtonContainer}>
              {/*<TouchableOpacity activeOpacity={0.7} onPress={closeBottomSheet}>*/}
              {/*  <LinearGradient*/}
              {/*    colors={['#0D4EB3', '#9413D0']}*/}
              {/*    style={style.notNowButtonColorGradient}>*/}
              {/*    <View style={style.notNowButtonContainer}>*/}
              {/*      <Text style={style.notNowButtonText}>Not Now</Text>*/}
              {/*    </View>*/}
              {/*  </LinearGradient>*/}
              {/*</TouchableOpacity>*/}

              <TouchableOpacity activeOpacity={0.5} onPress={closeBottomSheet}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={style.payButtonColorGradient}>
                  <Text style={style.payButtonText}>Continue Payment</Text>
                  {/*<Image*/}
                  {/*  source={icons.light_arrow_icon}*/}
                  {/*  style={style.payButtonIcon}*/}
                  {/*/>*/}
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

              {/*<Image*/}
              {/*  source={userImage ? {uri: userImage} : images.empty_male_Image}*/}
              {/*  style={style.profileImageStyle}*/}
              {/*/>*/}
            </TouchableOpacity>
          </View>

          <View>
            <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />
          </View>

          <View style={style.headerDescriptionContainer}>
            <Text style={style.headerTittleTextStyle}>
              Hi Riya, Upgrade Your Profile
            </Text>

            <Text style={style.headerTittleDescriptionTextStyle}>
              Upgrade your profile and find your perfect match
            </Text>

            {/*<Text style={style.headerTittleDescriptionTextStyle}>*/}
            {/*  with exclusive benefits!*/}
            {/*</Text>*/}
          </View>
        </LinearGradient>

        <View style={{marginHorizontal: 18}}>
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
        </View>

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

          <Text style={style.bottomTittleText}>Frequently Asked Questions</Text>

          <View style={{marginHorizontal: 18}}>
            <View style={style.bottomQueryBody}>
              {/* Question 1 */}
              <TouchableOpacity
                onPress={() => toggleExpand(0)}
                style={{
                  backgroundColor: expandedIndex === 0 ? '#F5F9FF' : 'white',
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
                        {rotate: expandedIndex === 0 ? '-180deg' : '-90deg'},
                      ], // Rotate arrow when expanded
                    }}
                  />
                </View>
                {expandedIndex === 0 && ( // Show text only if expanded
                  <View style={style.querySubTittleContainer}>
                    <Text style={style.querySubTittle}>
                      We accept a wide range of payment methods,{'\n'}including:
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

                      <Text style={[style.querySubTittle, {marginLeft: hp(8)}]}>
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

                      <Text style={[style.querySubTittle, {marginLeft: hp(8)}]}>
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

                      <Text style={[style.querySubTittle, {marginLeft: hp(8)}]}>
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

                      <Text style={[style.querySubTittle, {marginLeft: hp(8)}]}>
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
                  backgroundColor: expandedIndex === 1 ? '#F5F9FF' : 'white',
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
                        {rotate: expandedIndex === 1 ? '-180deg' : '-90deg'},
                      ], // Rotate arrow when expanded
                    }}
                  />
                </View>

                {expandedIndex === 1 && ( // Show text only if expanded
                  <View style={style.querySubTittleContainer}>
                    <Text style={style.querySubTittle}>
                      Yes, you can cancel your subscription at any time.{'\n'}If
                      you cancel during an active subscription period,{'\n'}your
                      premium features will remain available until{'\n'}the end
                      of the billing cycle. After that, your{'\n'}account will
                      revert to a free plan.
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={style.queryBorderCenterLine} />

              {/* Question 3 */}
              <TouchableOpacity
                onPress={() => toggleExpand(2)}
                style={{
                  backgroundColor: expandedIndex === 2 ? '#F5F9FF' : 'white',
                }}>
                <View style={style.queryTittleContainer}>
                  <Text style={style.queryTittle}>Do you offer refunds?</Text>

                  <Image
                    source={icons.down_arrow_icon}
                    style={{
                      width: hp(9),
                      height: hp(5),
                      transform: [
                        {rotate: expandedIndex === 2 ? '-180deg' : '-90deg'},
                      ], // Rotate arrow when expanded
                    }}
                  />
                </View>

                {expandedIndex === 2 && ( // Show text only if expanded
                  <View style={style.querySubTittleContainer}>
                    <Text style={style.querySubTittle}>
                      Refunds are generally not provided after a{'\n'}
                      subscription has been activated, except in cases{'\n'}of
                      accidental charges or technical issues. Please{'\n'}
                      contact our support team within 14 days of{'\n'}purchase
                      for refund inquiries.
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <View style={style.queryBorderCenterLine} />

              {/* Question 4 */}
              <TouchableOpacity
                onPress={() => toggleExpand(3)}
                style={{
                  backgroundColor: expandedIndex === 3 ? '#F5F9FF' : 'white',
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
                        {rotate: expandedIndex === 3 ? '-180deg' : '-90deg'},
                      ], // Rotate arrow when expanded
                    }}
                  />
                </View>

                {expandedIndex === 3 && ( // Show text only if expanded
                  <View style={style.querySubTittleContainer}>
                    <Text style={style.querySubTittle}>
                      If your payment fails, you will receive a notification
                      {'\n'}
                      with the option to update your payment details.{'\n'}Your
                      subscription will remain active for a short{'\n'}grace
                      period, during which you can resolve the{'\n'}payment
                      issue.
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={{height: 50}} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default UpgradeScreen;
