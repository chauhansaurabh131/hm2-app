import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../utils/colors';
import style from '../privacyScreen/style';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';

const ConnectToWebScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17), marginTop: hp(14)}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Image
            source={images.happyMilanColorLogo}
            style={{width: wp(96), height: hp(24), resizeMode: 'contain'}}
          />
          <Image
            source={images.profileDisplayImage}
            style={{width: hp(24), height: hp(24), borderRadius: 50}}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            marginTop: hp(37),
            marginBottom: hp(20),
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              width: hp(24),
              height: hp(24),
              marginRight: hp(18),
              justifyContent: 'center',
            }}>
            <Image
              source={icons.back_arrow_icon}
              style={{width: hp(16), height: hp(16), resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(21),
              fontFamily: fontFamily.poppins600,
            }}>
            Connect to Web{' '}
          </Text>
        </View>
      </View>

      <View style={{backgroundColor: colors.black, flex: 1}}>
        <Text
          style={{
            fontSize: fontSize(16),
            lineHeight: hp(20),
            fontFamily: fontFamily.poppins400,
            color: colors.white,
            textAlign: 'center',
            marginTop: hp(57),
          }}>
          Login to HappyMilan Web
        </Text>

        <Image
          source={icons.connect_web_icon}
          style={{
            width: wp(145),
            height: hp(90),
            alignSelf: 'center',
            marginTop: hp(72),
            resizeMode: 'contain',
          }}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('QRCodeScreen');
          }}>
          <LinearGradient
            colors={['#0D4EB3', '#9413D0']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0.5}}
            style={{
              marginTop: hp(72),
              width: wp(300),
              height: hp(50),
              borderRadius: 25,
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: colors.white,
                textAlign: 'center',
                fontSize: fontSize(16),
                lineHeight: hp(20),
                fontFamily: fontFamily.poppins400,
              }}>
              Connect to Web
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ConnectToWebScreen;
