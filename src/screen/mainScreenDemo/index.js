import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import style from '../mainScreen/style';
import {colors} from '../../utils/colors';
import Xyz from '../xyz';

const MainScreenDemo = ({navigation}) => {
  return (
    <LinearGradient
      colors={['#184AB5', '#7D1DCC']}
      style={{flex: 1}}
      // locations={[0, 0.8, 3]}
      locations={[0, 0.8]}>
      <SafeAreaView style={{flex: 1}}>
        <Image
          source={images.happyMilan}
          style={{
            width: wp(98.25),
            height: hp(24),
            marginTop: hp(29),
            marginLeft: wp(33),
            resizeMode: 'stretch',
          }}
        />

        <View style={{flex: 1}}>
          <Image
            source={images.coupleLogo}
            style={{width: wp(307), height: hp(359.72), alignSelf: 'center'}}
          />

          <Image
            source={images.intersect}
            style={{
              width: '100%',
              height: hp(73),
              resizeMode: 'stretch',
              // top: isIOS ? -72 : -70,
              top: hp(-72),
            }}
          />

          <View
            style={{
              marginLeft: wp(67),
              top: isIOS ? -50 : -25,
              marginRight: wp(67),
            }}>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(22),
                lineHeight: wp(26.82),
                fontFamily: fontFamily.poppins600,
                // marginLeft: wp(67),
              }}>
              Discover Your
            </Text>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(22),
                lineHeight: wp(26.82),
                fontFamily: fontFamily.poppins600,
              }}>
              Perfect Match with
            </Text>
            <Text
              style={{
                fontSize: fontSize(22),
                lineHeight: wp(26.82),
                color: colors.white,
                fontFamily: fontFamily.poppins600,
              }}>
              Connect.
            </Text>
            <Image
              source={icons.dots_icon}
              style={{
                width: 96,
                height: 12,
                marginTop: isIOS ? hp(20) : hp(30),
                // backgroundColor: 'grey',
                resizeMode: 'stretch',
              }}
            />

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('RegistrationScreen')}
              // onPress={() => navigation.navigate('DemoPractiveCodeScreen')}
            >
              <View
                style={{
                  width: '100%',
                  height: hp(60),
                  backgroundColor: colors.white,
                  borderRadius: hp(10),
                  marginTop: isIOS ? hp(25) : hp(30),
                  justifyContent: 'center',
                }}>
                <View style={style.buttonTextContainerStyle}>
                  <Text style={style.buttonTextStyle}>Free Registration</Text>
                  <Image
                    source={images.rightArrowLogo}
                    style={style.buttonImageStyle}
                  />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('LoginScreen');
              }}
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: hp(34),
              }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  fontFamily: fontFamily.poppins400,
                }}>
                Member Login
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('LoginScreen');
                }}>
                <Image
                  source={images.profileVectorLogo}
                  style={style.profileVectorStyle}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MainScreenDemo;
