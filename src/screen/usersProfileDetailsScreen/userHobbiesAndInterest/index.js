import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import style from './style';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';

const UserHobbiesAndInterest = (...params) => {
  const MatchesScreenData = params[0];

  console.log(' === MatchesScreenData.... ===> ', MatchesScreenData);

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
          Creative
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          Writing, Painting
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Fun
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          Movie
        </Text>

        <Text
          style={{
            fontSize: fontSize(14),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(15),
          }}>
          Fitness
        </Text>
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
          }}>
          Walking
        </Text>
      </View>
    </SafeAreaView>
  );
};
export default UserHobbiesAndInterest;
