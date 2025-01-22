import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {style} from './style';

// Utility function to format and capitalize array elements
const formatList = list => {
  return list
    .map(item => item.charAt(0).toUpperCase() + item.slice(1)) // Capitalize first letter
    .join(', '); // Join array into a string with commas
};

const UserPartnerPreferenceScreen = (...params) => {
  const UserData = params[0]?.friendList;
  const userData = params[0];

  console.log(' === 123 ===> ', userData?.userPartner);

  const MatchesScreenData = params[0];

  const minAge =
    MatchesScreenData?.userPartnerDetails?.age?.min ||
    userData?.userPartner?.age?.min ||
    [];

  const maxAge =
    MatchesScreenData?.userPartnerDetails?.age?.max ||
    userData?.userPartner?.age?.max ||
    [];

  const minHeight =
    MatchesScreenData?.userPartnerDetails?.height?.min ||
    userData?.userPartner?.height?.min ||
    [];

  const maxHeight =
    MatchesScreenData?.userPartnerDetails?.height?.max ||
    userData?.userPartner?.height?.max ||
    [];

  const city =
    MatchesScreenData?.userPartnerDetails?.city ||
    userData?.userPartner?.city ||
    [];

  const states =
    MatchesScreenData?.userPartnerDetails?.state ||
    userData?.userPartner?.state ||
    [];

  const country =
    MatchesScreenData?.userPartnerDetails?.country ||
    userData?.userPartner?.country ||
    [];

  const minIncome =
    MatchesScreenData?.userPartnerDetails?.income?.min ||
    userData?.userPartner?.income?.min ||
    [];

  const maxIncome =
    MatchesScreenData?.userPartnerDetails?.income?.max ||
    userData?.userPartner?.income?.max ||
    [];

  const diet =
    MatchesScreenData?.userPartnerDetails?.diet ||
    userData?.userPartner?.diet ||
    [];

  const hobbies =
    MatchesScreenData?.userPartnerDetails?.hobbies ||
    userData?.userPartner?.hobbies ||
    [];

  const formattedStates = formatList(states);
  const formattedCity = formatList(city);
  const formattedCountry = formatList(country);
  const formattedDiet = formatList(diet);

  return (
    <SafeAreaView style={style.container}>
      <View style={style.bodyContainer}>
        <Text style={style.tittleText}>Age</Text>
        <Text style={style.subTittleText}>
          {minAge || 'N/A'} - {maxAge || 'N/A'}
        </Text>

        <Text style={style.tittlesText}>Prefer Height (ft)</Text>
        <Text style={style.subTittleText}>
          {minHeight} - {maxHeight} ft
        </Text>

        <Text style={style.tittlesText}>Prefer City</Text>
        <Text style={style.subTittleText}>{formattedCity || 'N/A'}</Text>

        <Text style={style.tittlesText}>Prefer State</Text>
        <Text style={style.subTittleText}>{formattedStates || 'N/A'}</Text>

        <Text style={style.tittlesText}>Prefer Country</Text>
        <Text style={style.subTittleText}>{formattedCountry || 'N/A'}</Text>

        <Text style={style.tittlesText}>Prefer Income</Text>
        <Text style={style.subTittleText}>
          {minIncome || 'N/A'} - {maxIncome} Lacs
        </Text>

        <Text style={style.tittlesText}>Prefer Diet</Text>
        <Text style={style.subTittleText}>{formattedDiet || 'N/A'}</Text>

        <Text style={style.tittlesText}>Hobbies & Interest</Text>
        <View style={style.hobbiesContainer}>
          {hobbies.map((hobby, index) => (
            <View key={index} style={style.hobbiesBody}>
              <Text style={style.hobbiesText}>{hobby}</Text>
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default UserPartnerPreferenceScreen;
