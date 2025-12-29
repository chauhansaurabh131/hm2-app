import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import style from './style';

const data = [
  {id: 1, title: 'Chandra Studio'},
  {id: 2, title: 'Smile Studio'},
  {id: 3, title: 'Rockey Studio'},
  {id: 4, title: 'First Try Studio'},
];

const CARD_WIDTH = wp(365);

const ServicesFeaturedComponent = () => {
  const [index, setIndex] = useState(0);
  const translateX = useRef(new Animated.Value(0)).current;

  const navigation = useNavigation();

  // Change index every 2 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      // Start card from right side before showing new data
      translateX.setValue(CARD_WIDTH);

      setIndex(prev => {
        const next = (prev + 1) % data.length;
        return next;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [translateX]);

  // Whenever index changes -> animate slide from right to center
  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [index, translateX]);

  const item = data[index];

  return (
    <SafeAreaView style={style.container}>
      <Text style={style.featuredHeadingText}>Featured</Text>

      <TouchableOpacity
        style={style.featuredBodyContainer}
        activeOpacity={0.6}
        onPress={() => {
          navigation.navigate('ServicesProfileScreen');
        }}>
        <Animated.View
          style={{
            width: CARD_WIDTH,
            transform: [{translateX}],
          }}>
          <View style={style.animatedContainer}>
            <Image
              source={images.photo_studio_background_img}
              style={style.imageProfileContainer}
            />

            <View style={{top: -25}}>
              <Image
                source={images.photo_studio_img}
                style={style.profileImage}
              />
            </View>

            <View style={{marginHorizontal: wp(17)}}>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(18),
                  fontFamily: fontFamily.poppins600,
                }}>
                {item.title}
              </Text>

              <Text style={{color: '#6E6E6E'}}>
                304, Doubledaker, Sector 24, Gandhinagar, Gujarat 382024, India
              </Text>

              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View
                  style={{
                    marginBottom: 16,
                    marginTop: hp(15),
                    width: hp(145),
                    height: hp(33),
                    backgroundColor: '#F9F6FF',
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={icons.wedding_Studio_icon}
                    style={{
                      width: hp(16),
                      height: hp(16),
                      resizeMode: 'contain',
                      marginRight: wp(10),
                    }}
                  />
                  <Text
                    style={{
                      color: colors.pureBlack,
                      fontSize: fontSize(12),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Birthday Shoot
                  </Text>
                </View>

                <View
                  style={{
                    marginBottom: 16,
                    marginTop: hp(15),
                    width: hp(88),
                    height: hp(33),
                    backgroundColor: '#F9F6FF',
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={icons.wedding_Studio_icon}
                    style={{
                      width: hp(16),
                      height: hp(16),
                      resizeMode: 'contain',
                      marginRight: wp(10),
                    }}
                  />
                  <Text
                    style={{
                      color: colors.pureBlack,
                      fontSize: fontSize(12),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Events
                  </Text>
                </View>

                <View
                  style={{
                    marginBottom: 16,
                    marginTop: hp(15),
                    width: hp(55),
                    height: hp(33),
                    backgroundColor: '#F9F6FF',
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: colors.pureBlack,
                      fontSize: fontSize(12),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    +5
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ServicesFeaturedComponent;
