import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {style} from './style';

const UserEducationDetail = (...params) => {
  const UserData = params[0]?.friendList;

  const MatchesScreenData = params[0];

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle null or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const degree = capitalizeFirstLetter(
    MatchesScreenData?.degree || UserData?.userEducation?.degree,
  );
  const college = capitalizeFirstLetter(
    MatchesScreenData?.collage || UserData?.userEducation?.collage,
  );
  const educationState = capitalizeFirstLetter(
    MatchesScreenData?.educationState || UserData?.userEducation?.city,
  );
  const educationCountry = capitalizeFirstLetter(
    MatchesScreenData?.educationCountry || UserData?.userEducation?.country,
  );

  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        <Text style={style.detailTittleText}>Degree</Text>

        <Text style={style.detailSubTittleText}>
          {/*BCA*/}
          {degree}
        </Text>

        <Text style={style.detailsTittleTextStyle}>College/University</Text>
        <Text style={style.detailSubTittleText}>
          {/*Delhi University*/}
          {college}
        </Text>

        <Text style={style.detailsTittleTextStyle}>City</Text>
        <Text style={style.detailSubTittleText}>
          {/*Noida*/}
          {educationState}
        </Text>

        <Text style={style.detailsTittleTextStyle}>State</Text>
        <Text style={style.detailSubTittleText}>Delhi</Text>

        <Text style={style.detailsTittleTextStyle}>Country</Text>

        <Text style={style.detailSubTittleText}>
          {/*India*/}
          {educationCountry}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UserEducationDetail;
