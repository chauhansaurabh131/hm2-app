import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {style} from './style';

const UserProfessionalsDetails = (...params) => {
  const UserData = params[0]?.friendList;

  const MatchesScreenData = params[0];

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle null or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const Designation = capitalizeFirstLetter(
    MatchesScreenData?.Designation || UserData?.userProfessional?.jobTitle,
  );
  const jobType = capitalizeFirstLetter(
    MatchesScreenData?.jobType || UserData?.userProfessional?.jobType,
  );
  const companyName = capitalizeFirstLetter(
    MatchesScreenData?.companyName || UserData?.userProfessional?.companyName,
  );
  const workCity = capitalizeFirstLetter(
    MatchesScreenData?.workCity || UserData?.userProfessional?.workCity,
  );
  const workCountry = capitalizeFirstLetter(
    MatchesScreenData?.workCountry || UserData?.userProfessional?.workCountry,
  );
  const currentSalary =
    MatchesScreenData?.currentSalary ||
    UserData?.userProfessional?.currentSalary;

  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        <Text style={style.detailTittleText}>Current Designation</Text>

        <Text style={style.detailSubTittleText}>
          {/*Software Designer*/}
          {Designation}
        </Text>

        <Text style={style.detailsTittleTextStyle}>Job Type</Text>
        <Text style={style.detailSubTittleText}>
          {/*private*/}
          {jobType}
        </Text>

        <Text style={style.detailsTittleTextStyle}>Company Name</Text>

        <Text style={style.detailSubTittleText}>
          {/*MN Tech*/}
          {companyName}
        </Text>

        <Text style={style.detailsTittleTextStyle}>annual Salary</Text>

        <Text style={style.detailSubTittleText}>
          {/*INR 6-8 Lacs*/}
          {currentSalary}
        </Text>

        <Text style={style.detailsTittleTextStyle}>Work in City</Text>

        <Text style={style.detailSubTittleText}>
          {/*Delhi*/}
          {workCity}
        </Text>

        <Text style={style.detailsTittleTextStyle}>Work in Country</Text>

        <Text style={style.detailSubTittleText}>
          {/*India*/}
          {workCountry}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UserProfessionalsDetails;
