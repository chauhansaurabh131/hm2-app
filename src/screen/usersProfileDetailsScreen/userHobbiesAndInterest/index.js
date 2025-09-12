import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';

const UserHobbiesAndInterest = (...params) => {
  const UserData = params[0]?.friendList;

  const MatchesScreenData = params[0];

  const hobbies = MatchesScreenData?.hobbies || UserData?.hobbies;
  const language = MatchesScreenData?.language || UserData?.language;

  // console.log(' === var ===> ', MatchesScreenData?.language);

  const formatHobby = hobby => {
    return hobby
      .split('_') // split by underscore
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
      .join(' '); // join with space
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginTop: hp(15), marginHorizontal: 17}}>
        <Text
          style={{
            fontSize: fontSize(16),
            lineHeight: hp(24),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
          }}>
          Hobbies
        </Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: hp(10),
          }}>
          {hobbies.map((hobby, index) => (
            <View
              key={index}
              style={{
                backgroundColor: '#F3F3F3',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 26,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.black,
                  textTransform: 'capitalize',
                  fontFamily: fontFamily.poppins500,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                }}>
                {formatHobby(hobby)}
              </Text>
            </View>
          ))}
        </View>

        <Text
          style={{
            fontSize: fontSize(16),
            lineHeight: hp(24),
            fontFamily: fontFamily.poppins500,
            color: colors.black,
            marginTop: hp(40),
          }}>
          Language Known
        </Text>

        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 10,
            marginTop: hp(10),
          }}>
          {language.map((lang, index) => (
            <View
              key={index}
              style={{
                backgroundColor: '#F3F3F3',
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 26,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.black,
                  textTransform: 'capitalize',
                  fontFamily: fontFamily.poppins500,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                }}>
                {formatHobby(lang)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserHobbiesAndInterest;
