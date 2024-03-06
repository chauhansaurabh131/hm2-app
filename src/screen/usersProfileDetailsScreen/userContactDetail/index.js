import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import style from './style';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';

const UserContactDetail = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginTop: hp(15)}}>
        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
          }}>
          Mobile Number
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          +91 90001 01021
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Home Number
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          +91 90001 01021
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Email Address
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          riyashah@gmail.com
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UserContactDetail;
