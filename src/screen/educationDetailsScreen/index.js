import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import TextInputWithDropDownComponent from '../../components/textInputWithDropDownComponent';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const EducationDetailsScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: 17}}>
        <Text
          style={{
            // marginLeft: wp(12),
            color: colors.black,
            fontSize: fontSize(12),
            lineHeight: hp(18),
            fontFamily: fontFamily.nunito400,
            fontWeight: '400',
            marginTop: hp(10),
          }}>
          Degree
        </Text>
        <TextInputWithDropDownComponent />

        <Text
          style={{
            // marginLeft: wp(12),
            color: colors.black,
            fontSize: fontSize(12),
            lineHeight: hp(18),
            fontFamily: fontFamily.nunito400,
            fontWeight: '400',
            marginTop: hp(10),
          }}>
          Collage/University
        </Text>

        <TextInputWithDropDownComponent />

        <Text
          style={{
            // marginLeft: wp(12),
            color: colors.black,
            fontSize: fontSize(12),
            lineHeight: hp(18),
            fontFamily: fontFamily.nunito400,
            fontWeight: '400',
            marginTop: hp(10),
          }}>
          City
        </Text>

        <TextInputWithDropDownComponent />

        <Text
          style={{
            // marginLeft: wp(12),
            color: colors.black,
            fontSize: fontSize(12),
            lineHeight: hp(18),
            fontFamily: fontFamily.nunito400,
            fontWeight: '400',
            marginTop: hp(10),
          }}>
          State
        </Text>

        <TextInputWithDropDownComponent />

        <Text
          style={{
            // marginLeft: wp(12),
            color: colors.black,
            fontSize: fontSize(12),
            lineHeight: hp(18),
            fontFamily: fontFamily.nunito400,
            fontWeight: '400',
            marginTop: hp(10),
          }}>
          Country
        </Text>

        <TextInputWithDropDownComponent />
      </View>
    </SafeAreaView>
  );
};

export default EducationDetailsScreen;
