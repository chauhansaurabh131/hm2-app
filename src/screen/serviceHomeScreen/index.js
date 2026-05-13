import React, {useState} from 'react';
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
import {useSelector} from 'react-redux';

const ServiceHomeScreen = () => {
  const [text, setText] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);

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
            style={{
              width: wp(50),
              height: hp(50),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={icons.view_profile_icon}
              style={{
                width: hp(18),
                height: hp(18),
                resizeMode: 'contain',
                tintColor: '#7148E4',
              }}
            />
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
    </SafeAreaView>
  );
};

export default ServiceHomeScreen;
