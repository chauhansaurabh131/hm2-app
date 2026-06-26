import React, {useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {icons} from '../../assets';
import ServicesFeaturedComponent from '../../components/servicesFeaturedComponent';
import ServicesRecentlyComponent from '../../components/servicesRecentlyComponent';
import {useNavigation} from '@react-navigation/native';
import style from './style';
import {SafeAreaView} from 'react-native-safe-area-context';
import VendorSearchLocationComponent from '../../components/vendorSearchLocationComponent';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {useDispatch, useSelector} from 'react-redux';
import ProfileAvatar from '../../components/letterProfileComponent';
import RBSheet from 'react-native-raw-bottom-sheet';
import {changeStack, logout} from '../../actions/authActions';
import SignInOrLogInComponent from '../../components/signInOrLogInComponent';
import {navigationRef} from '../../navigations';

const ServiceHomeScreen = () => {
  const [text, setText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [loginModal, setSetLoginModal] = useState(false);

  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);

  const businessName = user?.user?.vendorData?.[0]?.businessName || '';

  const initials = businessName
    .split(' ')
    .filter(item => item)
    .slice(0, 2)
    .map(item => item.charAt(0))
    .join('')
    .toUpperCase();

  console.log(' === var ===> ', user?.user?.vendorData[0]?.businessName);

  const refProfileSheet = useRef();

  const dispatch = useDispatch();

  // console.log(' === user***** ===> ', user?.user?.profilePic);

  const items = [
    {icon: icons.wedding_Planner_icon, label: 'Wedding Planner'},
    {icon: icons.wedding_Studio_icon, label: 'Wedding Studio'},
    {icon: icons.decorators_icon, label: 'Decorators'},
    {icon: icons.caterers_icon, label: 'Caterers'},
    {icon: icons.jewellery_Shops_icon, label: 'Jewellery Shops'},
    {icon: icons.cosmetics_icon, label: 'Cosmetics'},
    {icon: icons.meeting_Points_icon, label: 'Meeting Points'},
    {icon: icons.makeup_Artist_icon, label: 'Makeup Artisti'},
    {icon: icons.salons_icon, label: 'Salons'},
  ];

  const capitalizeWords = text => {
    if (!text) {
      return '';
    }

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatBusinessType = value => {
    if (!value) {
      return '';
    }

    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const onPressItem = label => {
    // CONVERT TO SLUG
    const formattedLabel = label.toLowerCase().replace(/\s+/g, '-');

    console.log('Pressed item:', formattedLabel);

    navigation.navigate('VendorSearchFilterScreen', {
      category: formattedLabel,
      location: selectedLocation,
    });

    // navigation.navigate('ServicesSearchScreen');
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={{height: hp(50), backgroundColor: colors.white}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            activeOpacity={0.6}
            style={{
              width: wp(50),
              height: hp(50),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={icons.back_arrow_icon}
              style={{width: hp(14), height: hp(14), resizeMode: 'contain'}}
            />
          </TouchableOpacity>

          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins500,
            }}>
            Search Nearby Vendors
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (user) {
                refProfileSheet.current?.open();
              } else {
                setSetLoginModal(true);
              }
            }}
            style={{
              width: wp(50),
              height: hp(50),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {!user ? (
              <Image
                source={icons.view_profile_icon}
                style={{
                  width: hp(18),
                  height: hp(18),
                  resizeMode: 'contain',
                  tintColor: '#7148E4',
                }}
              />
            ) : user?.user?.profilePic ? (
              <Image
                source={{
                  uri: user?.user?.profilePic,
                }}
                style={{
                  width: hp(20),
                  height: hp(20),
                  borderRadius: hp(40),
                  resizeMode: 'cover',
                }}
              />
            ) : (
              <View
                style={{
                  width: hp(20),
                  height: hp(20),
                  borderRadius: hp(20),
                  backgroundColor: '#7148E4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: fontSize(9),
                    fontFamily: fontFamily.poppins500,
                    textTransform: 'uppercase',
                    top: 1,
                  }}>
                  {initials}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/*<View style={style.headerContainer}>*/}
        {/*  <View style={style.searchContainer}>*/}
        {/*    <TextInput*/}
        {/*      style={style.searchTextInput}*/}
        {/*      placeholder="Enter Your City"*/}
        {/*      placeholderTextColor="#999"*/}
        {/*      value={text}*/}
        {/*      onChangeText={setText}*/}
        {/*    />*/}
        {/*  </View>*/}
        {/*</View>*/}

        {/*<VendorSearchLocationComponent />*/}
        <VendorSearchLocationComponent onLocationChange={setSelectedLocation} />

        <View style={style.discoverTextContainer}>
          <Text style={style.discoverTextStyle}>Discover Services</Text>
        </View>

        <View style={style.discoverBodyContainer}>
          <View style={style.discoverWrapContainer}>
            {items.map((item, index) => {
              const isMiddle = index % 3 === 1; // 2nd item in each row

              return (
                <View
                  key={index}
                  style={[
                    style.discoverWrapStyle,
                    {marginHorizontal: isMiddle ? 5 : 0},
                  ]}>
                  {/* 🔥 Touchable Image Box */}
                  <TouchableOpacity
                    activeOpacity={0.4}
                    onPress={() => onPressItem(item.label)}
                    style={style.discoverImageStyle}>
                    <Image source={item.icon} style={style.discoverIconStyle} />
                  </TouchableOpacity>
                  <Text style={style.discoverIconLabel}>{item.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={style.horizontalOne} />

        <ServicesFeaturedComponent />

        <View style={style.horizontalTwo} />

        <ServicesRecentlyComponent labelHeading={'Recently Viewed'} />

        <View style={{height: 50}} />
      </ScrollView>

      <RBSheet
        ref={refProfileSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={hp(390)}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: 'white',
          },
          container: {
            borderTopLeftRadius: hp(25),
            borderTopRightRadius: hp(25),
          },
        }}>
        <View style={{paddingHorizontal: wp(20)}}>
          <View
            // onPress={() => refProfileSheet.current?.open()}
            style={{
              width: wp(60),
              height: hp(60),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {!user ? (
              <Image
                source={icons.view_profile_icon}
                style={{
                  width: hp(18),
                  height: hp(18),
                  resizeMode: 'contain',
                  tintColor: '#7148E4',
                }}
              />
            ) : user?.user?.profilePic ? (
              <Image
                source={{
                  uri: user?.user?.profilePic,
                }}
                style={{
                  width: hp(60),
                  height: hp(60),
                  borderRadius: hp(50),
                  resizeMode: 'cover',
                }}
              />
            ) : (
              <View
                style={{
                  width: hp(60),
                  height: hp(60),
                  borderRadius: hp(50),
                  backgroundColor: '#7148E4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: fontSize(20),
                    fontFamily: fontFamily.poppins700,
                    textTransform: 'uppercase',
                    top: 1,
                  }}>
                  {initials}
                </Text>
              </View>
            )}
          </View>

          <Text
            style={{
              fontSize: fontSize(22),
              fontFamily: fontFamily.poppins600,
              color: colors.pureBlack,
              marginTop: hp(10),
            }}>
            {capitalizeWords(user?.user?.vendorData?.[0]?.businessName)}
          </Text>

          <View
            style={{
              backgroundColor: '#F9F6FF',
              paddingHorizontal: hp(20),
              borderRadius: hp(50),
              paddingVertical: hp(5),
              marginTop: hp(5),
              alignSelf: 'flex-start', // 👈 Add this
            }}>
            <Text
              style={{
                color: '#7148E4',
                fontSize: fontSize(12),
                fontFamily: fontFamily.poppins400,
              }}>
              {formatBusinessType(user?.user?.vendorData?.[0]?.businessType)}
            </Text>
          </View>

          <View
            style={{
              height: hp(1),
              backgroundColor: '#F2F2F2',
              marginTop: hp(15),
              // marginBottom: hp(15),
            }}
          />
        </View>

        <TouchableOpacity
          onPress={() => {
            refProfileSheet.current?.open();
            navigation.navigate('Profile');
          }}
          style={{
            height: hp(30),
            marginTop: hp(30),
            paddingHorizontal: wp(18),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: wp(40),
              height: hp(30),
              justifyContent: 'center',
            }}>
            <Image
              source={icons.profileLogo}
              style={{
                tintColor: 'black',
                width: hp(17),
                height: hp(16),
                resizeMode: 'contain',
              }}
            />
          </View>
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            My Profile
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            refProfileSheet.current?.open();
            navigation.navigate('VendorAccountSettingScreen');
          }}
          style={{
            height: hp(30),
            marginTop: hp(20),
            paddingHorizontal: wp(18),
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: wp(40),
              height: hp(30),
              justifyContent: 'center',
            }}>
            <Image
              source={icons.settingIcon}
              style={{
                tintColor: 'black',
                width: hp(17),
                height: hp(16),
                resizeMode: 'contain',
              }}
            />
          </View>
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Accounts Settings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            refProfileSheet.current?.open();
            // navigation.navigate('VendorAccountSettingScreen');
            dispatch(logout());
            dispatch(logout(), () => dispatch(changeStack()));
          }}
          activeOpacity={0.6}
          style={{
            marginHorizontal: wp(18),
            marginTop: hp(25),
            height: hp(50),
            borderWidth: hp(1),
            borderColor: '#E5E5E5',
            borderRadius: hp(25),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Log Out
          </Text>
        </TouchableOpacity>
      </RBSheet>

      {/* LOGIN MODAL */}
      <SignInOrLogInComponent
        visible={loginModal}
        onClose={() => setSetLoginModal(false)}
        onSignUp={() => {
          setSetLoginModal(false);

          navigationRef.current?.navigate('VendorSignUpScreen');
        }}
        onLogin={() => {
          setSetLoginModal(false);

          navigationRef.current?.navigate('VendorLoginScreen');
        }}
      />
    </SafeAreaView>
  );
};

export default ServiceHomeScreen;
