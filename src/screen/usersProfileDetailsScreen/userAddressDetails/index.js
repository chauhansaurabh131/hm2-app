import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import style from './style';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';
import {colors} from '../../../utils/colors';

const UserAddressDetails = () => {
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
          Current Residing Address
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          01-02, Delhi Street, Delhi, India
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Current City
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          Delhi
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Current Residing Country
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          India
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Permanent Address
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          01-02, Delhi Street, Delhi, India
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UserAddressDetails;
