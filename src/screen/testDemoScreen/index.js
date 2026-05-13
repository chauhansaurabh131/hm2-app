import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  View,
  Text,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import AppColorLogo from '../../components/appColorLogo';
import ServiceHomeScreen from '../serviceHomeScreen';

const {width} = Dimensions.get('window');

const slides = [
  {
    id: '1',
    image: images.main_screen_image_five,
    title: 'Find Your Perfect on\nHapmeet',
    subtitle:
      'Create a long-term or dating profile\nto find your perfect match.',
    btn1: 'Get Started',
    btn2: 'Login',
    btn1Screen: 'NewSignUpScreen',
    btn2Screen: 'NewLogInScreen',
    showBtn2: true,
  },
  {
    id: '2',
    image: images.main_screen_image_seven,
    title: 'Find Trusted Nearby\nVendors',
    subtitle: 'Book trusted services for your\nnext events.',
    btn1: 'Explore Vendors',
    btn1Screen: 'ServiceTabs',
    showBtn2: false,
    bottomText: 'Service providers can create listings\nusing the web version.',
  },
];

const TestDemoScreen = () => {
  const navigation = useNavigation();

  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const renderItem = ({item}) => {
    return (
      <View
        style={{
          width: width,
          alignItems: 'center',
        }}>
        {/* CARD */}
        <View
          style={{
            width: '85%',
            backgroundColor: colors.white,
            borderRadius: hp(28),
            borderWidth: hp(1),
            borderColor: '#C9C9C9',
            alignItems: 'center',
            overflow: 'hidden',
          }}>
          {/* IMAGE */}
          <Image
            source={item.image}
            style={{
              width: '100%',
              height: hp(296),
            }}
            resizeMode={item.id === '2' ? 'stretch' : ''}
          />

          {/* TITLE */}
          <Text
            style={{
              textAlign: 'center',
              fontSize: hp(20),
              fontFamily: fontFamily.poppins700,
              color: colors.pureBlack,
              marginTop: hp(15),
              lineHeight: hp(32),
            }}>
            {item.title}
          </Text>

          {/* SUBTITLE */}
          <Text
            style={{
              fontSize: fontSize(12),
              color: '#6F6F6F',
              textAlign: 'center',
              marginTop: hp(10),
              fontFamily: fontFamily.poppins400,
              lineHeight: hp(18),
            }}>
            {item.subtitle}
          </Text>

          {/* BUTTON 1 */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(item.btn1Screen);
            }}
            activeOpacity={0.7}
            style={{
              backgroundColor: '#7148E4',
              width: '80%',
              borderRadius: hp(30),
              marginTop: hp(20),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              height: hp(45),
              paddingHorizontal: wp(20),
            }}>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(13),
                fontFamily: fontFamily.poppins500,
              }}>
              {item.btn1}
            </Text>
          </TouchableOpacity>

          {/* BUTTON 2 OR BOTTOM TEXT */}
          {item.showBtn2 ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate(item.btn2Screen);
              }}
              activeOpacity={0.7}
              style={{
                borderColor: '#7148E4',
                borderWidth: hp(1),
                width: '80%',
                marginTop: hp(15),
                alignItems: 'center',
                justifyContent: 'center',
                height: hp(45),
                borderRadius: hp(30),
                marginBottom: hp(32),
              }}>
              <Text
                style={{
                  color: '#7148E4',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins500,
                }}>
                {item.btn2}
              </Text>
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                fontSize: fontSize(10),
                color: '#A0A0A0',
                textAlign: 'center',
                marginTop: hp(18),
                marginBottom: hp(32),
                fontFamily: fontFamily.poppins400,
                lineHeight: hp(16),
              }}>
              {item.bottomText}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      {/* LOGO */}
      <View
        style={{
          alignSelf: 'center',
          marginTop: hp(30),
          marginBottom: hp(20),
        }}>
        <AppColorLogo />
      </View>

      {/* SLIDER */}
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewConfig}
      />

      {/* PAGINATION */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: hp(40),
        }}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={{
              height: hp(8),
              width: currentIndex === index ? hp(28) : hp(28),
              borderRadius: hp(10),
              backgroundColor: currentIndex === index ? '#7148E4' : '#E5E5E5',
              marginHorizontal: wp(5),
            }}
          />
        ))}
      </View>
    </SafeAreaView>
  );
};

export default TestDemoScreen;
