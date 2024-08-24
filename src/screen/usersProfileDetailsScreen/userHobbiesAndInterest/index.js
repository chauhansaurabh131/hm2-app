import React from 'react';
import {SafeAreaView, Text, View, FlatList, StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {hp, wp} from '../../../utils/helpers';

const UserHobbiesAndInterest = (...params) => {
  const UserData = params[0]?.friendList;

  console.log(' === UserData.... ===> ', UserData?.hobbies);

  const MatchesScreenData = params[0];

  const hobbies = MatchesScreenData?.hobbies || UserData?.hobbies;

  const renderHobby = ({item}) => (
    <View style={styles.hobbyBox}>
      <Text style={styles.hobbyText}>{item}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginTop: hp(15)}}>
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

const styles = StyleSheet.create({
  hobbiesContainer: {
    // alignItems: 'center',
  },
  hobbyBox: {
    // backgroundColor: colors.lightGray, // Adjust this color as needed
    backgroundColor: '#E8E9EB', // Adjust this color as needed
    padding: wp(2),
    margin: wp(2),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(90),
    height: wp(50), // Ensure the box is square
  },
  hobbyText: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
  },
});
export default UserHobbiesAndInterest;
