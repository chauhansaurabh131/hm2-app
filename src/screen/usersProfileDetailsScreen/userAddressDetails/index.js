import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {style} from './style';

const UserAddressDetails = (...params) => {
  const UserData = params[0]?.friendList;

  const MatchesScreenData = params[0];

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle null or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const currentResidenceAddress = capitalizeFirstLetter(
    MatchesScreenData?.currentResidenceAddress ||
      UserData?.address?.currentResidenceAddress,
  );

  const currentCity = capitalizeFirstLetter(
    MatchesScreenData?.currentCity || UserData?.address?.currentCity,
  );

  const currentCountry = capitalizeFirstLetter(
    MatchesScreenData?.currentCountry || UserData?.address?.currentCountry,
  );

  const originCountry = capitalizeFirstLetter(
    MatchesScreenData?.originCountry || UserData?.address?.originCountry,
  );
  const originResidenceAddress = capitalizeFirstLetter(
    MatchesScreenData?.originResidenceAddress ||
      UserData?.address?.originResidenceAddress,
  );

  const originCity = capitalizeFirstLetter(
    MatchesScreenData?.originCity || UserData?.address?.originCity,
  );

  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        <Text style={style.detailTittleText}>Current Residing Address</Text>

        <Text style={style.detailSubTittleText}>
          {/*01-02, Delhi Street, Delhi, India*/}
          {currentResidenceAddress}, {currentCity}, {currentCountry},{' '}
          {originCountry}
        </Text>

        <Text style={style.detailsTittleTextStyle}>Current City</Text>

        <Text style={style.detailSubTittleText}>
          {/*Delhi*/}
          {currentCity}
        </Text>

        <Text style={style.detailsTittleTextStyle}>
          Current Residing Country
        </Text>

        <Text style={style.detailSubTittleText}>
          {/*India*/}
          {originCountry || 'N/A'}
        </Text>

        <Text style={style.detailsTittleTextStyle}>Permanent Address</Text>

        <Text style={style.detailSubTittleText}>
          {/*01-02, Delhi Street, Delhi, India*/}
          {originResidenceAddress || 'N/A'}, {originCity || 'N/A'},{' '}
          {originCountry || 'N/A'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UserAddressDetails;
