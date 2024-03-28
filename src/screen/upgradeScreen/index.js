import React, {useRef, useState} from 'react';
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
import {
  fontFamily,
  fontSize,
  hp,
  isIOS,
  screenHeight,
  wp,
} from '../../utils/helpers';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';

import RBSheet from 'react-native-raw-bottom-sheet';

const UpgradeScreen = () => {
  const [selectedOption, setSelectedOption] = useState('silver');
  const [topModalVisible, setTopModalVisible] = useState(false);
  const RBSheetRef = useRef();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState('');
  const [pressed, setPressed] = useState(false);

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
      <View
      // style={{
      //   marginTop: 10,
      //   width: wp(340),
      //   height: hp(91),
      //   borderRadius: 20,
      //   marginBottom: 1,
      //   backgroundColor: colors.white,
      //   alignSelf: 'center',
      //   ...Platform.select({
      //     ios: {
      //       shadowColor: 'lightblue',
      //       shadowOffset: {width: 0, height: 0.1},
      //       shadowOpacity: 0.5,
      //     },
      //     android: {
      //       elevation: 2,
      //     },
      //   }),
      // }}
      >
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
          // height={480}
          height={screenHeight * 0.7 - 50}
          // duration={250}
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
            <Text
              style={{
                textAlign: 'center',
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins400,
                color: colors.black,
              }}>
              One Month Plan
            </Text>
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(54),
                lineHeight: hp(81),
                fontFamily: fontFamily.poppins700,
                textAlign: 'center',
              }}>
              {/*{selectedPrice}*/}
              {selectedPrice.newPrice}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  fontFamily: fontFamily.poppins400,
                }}>
                INR
              </Text>
              <Text
                style={{
                  textDecorationLine: 'line-through',
                  marginLeft: 5,
                  color: colors.black,
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  fontFamily: fontFamily.poppins400,
                }}>
                {selectedPrice.oldPrice}
              </Text>

              <View
                style={{
                  width: wp(84),
                  height: hp(28),
                  borderRadius: 14,
                  backgroundColor: '#F0FCF6',
                  marginLeft: wp(10),
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins500,
                    color: '#17C270',
                  }}>
                  20% Off
                </Text>
              </View>
            </View>
            <View
              style={{
                marginTop: hp(25),
                width: '100%',
                borderWidth: 1,
                borderColor: '#E3E3E3',
              }}
            />

            <Text
              style={{
                fontSize: fontSize(16),
                lineHeight: hp(28),
                fontFamily: fontFamily.poppins600,
                color: colors.black,
                textAlign: 'center',
                marginTop: hp(20),
              }}>
              What Will You Get?
            </Text>

            <View
              style={{
                marginHorizontal: wp(30),
                marginTop: hp(18),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Message to <Text style={{color: colors.blue}}>10 Profiles</Text>
              </Text>
              <Image
                source={icons.confirm_check_icon}
                style={{width: hp(14), height: hp(14), resizeMode: 'contain'}}
              />
            </View>

            <View
              style={{
                marginHorizontal: wp(30),
                marginTop: hp(18),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Send request to{' '}
                <Text style={{color: colors.blue}}>10 Profiles</Text>
              </Text>
              <Image
                source={icons.confirm_check_icon}
                style={{width: hp(14), height: hp(14), resizeMode: 'contain'}}
              />
            </View>

            <View
              style={{
                marginHorizontal: wp(30),
                marginTop: hp(18),
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Online Support
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                marginHorizontal: wp(30),
                justifyContent: 'space-between',
                marginTop: isIOS ? hp(30) : hp(50),
              }}>
              <TouchableOpacity activeOpacity={0.7} onPress={closeBottomSheet}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  style={{
                    width: wp(110),
                    height: hp(50),
                    borderRadius: 10,
                    borderWidth: 1,
                    justifyContent: 'center',
                    borderColor: 'transparent', // Set border color to transparent
                  }}>
                  <View
                    style={{
                      borderRadius: 10, // <-- Inner Border Radius
                      flex: 1,
                      backgroundColor: colors.white,
                      justifyContent: 'center',
                      margin: isIOS ? 0 : 1,
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
                      Not Now
                    </Text>
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
                  style={{
                    width: wp(178),
                    height: hp(50),
                    borderRadius: 10,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: colors.white,
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins600,
                    }}>
                    Proceed to Pay
                  </Text>
                  <Image
                    source={icons.light_arrow_icon}
                    style={{
                      width: hp(14),
                      height: hp(14),
                      resizeMode: 'contain',
                      transform: [{rotate: '90deg'}],
                      marginLeft: wp(14),
                    }}
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
      </View>
    </SafeAreaView>
  );
};

export default UpgradeScreen;
