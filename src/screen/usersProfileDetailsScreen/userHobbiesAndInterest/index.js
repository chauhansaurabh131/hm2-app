import React from 'react';
import {SafeAreaView, Text, View, FlatList, StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {styles} from './style';
import {style} from '../userPartnerPreferenceScreen/style';

const UserHobbiesAndInterest = (...params) => {
  const UserData = params[0]?.friendList;

  // console.log(' === UserData.... ===> ', UserData?.hobbies);

  const MatchesScreenData = params[0];

  // console.log(' === var ===> ', MatchesScreenData);

  const hobbies = MatchesScreenData?.hobbies || UserData?.hobbies;

  console.log(' === hobbies ===> ', hobbies);

  const renderHobby = ({item}) => (
    <View style={styles.hobbyBox}>
      <Text style={styles.hobbyText}>{item}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginTop: hp(15), marginHorizontal: 17}}>
        {/*<FlatList*/}
        {/*  data={hobbies}*/}
        {/*  renderItem={renderHobby}*/}
        {/*  keyExtractor={(item, index) => index.toString()}*/}
        {/*  numColumns={3} // Display 3 items per row*/}
        {/*  contentContainerStyle={styles.hobbiesContainer}*/}
        {/*/>*/}
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
                {hobby}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserHobbiesAndInterest;
