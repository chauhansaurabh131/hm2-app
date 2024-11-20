import React from 'react';
import {SafeAreaView, Text, View, FlatList, StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {hp, wp} from '../../../utils/helpers';
import {styles} from './style';

const UserHobbiesAndInterest = (...params) => {
  const UserData = params[0]?.friendList;

  console.log(' === UserData.... ===> ', UserData?.hobbies);

  const MatchesScreenData = params[0];

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
        <FlatList
          data={hobbies}
          renderItem={renderHobby}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3} // Display 3 items per row
          contentContainerStyle={styles.hobbiesContainer}
        />
      </View>
    </SafeAreaView>
  );
};

export default UserHobbiesAndInterest;
