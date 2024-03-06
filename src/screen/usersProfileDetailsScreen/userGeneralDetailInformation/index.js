import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import style from './style';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';
import {colors} from '../../../utils/colors';

const UserGeneralDetailInformation = () => {
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
          Date of Birth
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          02.03.1986
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Birth of Time
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          10:01:20 AM
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Religion
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          Hindu
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Caste/Sub Caste
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          Patel, Kadva Patidar
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
          New York
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Country of Living
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          United States of America
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UserGeneralDetailInformation;
