import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import style from './style';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';

const UserProfessionalsDetails = () => {
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
          Current Designation
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          Software Designer
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Job Type
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          private
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Company Name
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          MN Tech
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          annual Salary
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          INR 6-8 Lacs
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Work in City
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
          Work in Country
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
      </View>
    </SafeAreaView>
  );
};

export default UserProfessionalsDetails;
