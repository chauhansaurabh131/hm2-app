import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import moment from 'moment';
import {style} from './style';

const UserGeneralDetailInformation = (...params) => {
  const UserData = params[0]?.friendList;

  // console.log(' === UserGeneralDetailInformation ===> ', UserData);

  const MatchesScreenData = params[0];

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle null or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const dateOfBirth = moment(
    UserData?.dateOfBirth || MatchesScreenData?.dateOfBirth,
  ).format('DD.MM.YYYY');

  const formattedTime = moment(
    UserData?.birthTime || MatchesScreenData?.birthTime,
  ).format('hh:mm:ss A');

  const Religion =
    capitalizeFirstLetter(UserData?.religion) ||
    capitalizeFirstLetter(MatchesScreenData?.religion);

  const Cast =
    capitalizeFirstLetter(UserData?.caste) ||
    capitalizeFirstLetter(MatchesScreenData?.caste);

  const SubCast = capitalizeFirstLetter(UserData?.community);

  const CurrentCity =
    capitalizeFirstLetter(UserData?.address?.currentCity) ||
    capitalizeFirstLetter(MatchesScreenData?.address?.currentCity);

  const CurrentCountry =
    capitalizeFirstLetter(UserData?.address?.currentCountry) ||
    capitalizeFirstLetter(MatchesScreenData?.address?.currentCountry);

  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        <Text style={style.detailTittleText}>Date of Birth</Text>

        <Text style={style.DetailsAnswerText}>
          {/*02.03.1986*/}
          {dateOfBirth || 'N/A'}
        </Text>

        <Text style={style.DetailTittleSecondText}>Birth of Time</Text>

        <Text style={style.DetailsAnswerText}>
          {/*10:01:20 AM*/}
          {formattedTime || 'N/A'}
        </Text>

        <Text style={style.DetailTittleSecondText}>Religion</Text>

        <Text style={style.DetailsAnswerText}>
          {/*Hindu*/}
          {Religion || 'N/A'}
        </Text>

        <Text style={style.DetailTittleSecondText}>Caste/Sub Caste</Text>

        <Text style={style.DetailsAnswerText}>
          {/*Patel, Kadva Patidar*/}
          {Cast || 'N/A'} {SubCast}
        </Text>

        <Text style={style.DetailTittleSecondText}>Current City</Text>

        <Text style={style.DetailsAnswerText}>
          {/*New York*/}
          {CurrentCity || 'N/A'}
        </Text>

        <Text style={style.DetailTittleSecondText}>Country of Living</Text>

        <Text style={style.DetailsAnswerText}>
          {/*United States of America*/}
          {CurrentCountry || 'N/A'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UserGeneralDetailInformation;
