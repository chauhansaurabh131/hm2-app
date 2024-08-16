import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {style} from './style';

const UserContactDetail = (...params) => {
  const UserData = params[0]?.friendList;

  console.log(' === UserData ===> ', UserData?.email);

  const MatchesScreenData = params[0];

  const rawMobileNumber =
    MatchesScreenData?.mobileNumber?.toString() ||
    UserData?.mobileNumber?.toString();

  const rawHomeMobileNumber =
    MatchesScreenData?.homeMobileNumber?.toString() ||
    UserData?.homeMobileNumber?.toString();

  const email = MatchesScreenData?.email || UserData?.email;

  // Function to format the mobile number as "+91 90001 01021"
  const formatMobileNumber = number => {
    if (number && number.length === 12) {
      const countryCode = `+${number.slice(0, 2)}`;
      const firstPart = number.slice(2, 7);
      const secondPart = number.slice(7);
      return `${countryCode} ${firstPart} ${secondPart}`;
    }
    return number;
  };

  const mobileNumber = formatMobileNumber(rawMobileNumber);
  const HomeMobileNumber = formatMobileNumber(rawHomeMobileNumber);

  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        <Text style={style.detailTittleText}>Mobile Number</Text>

        <Text style={style.detailSubTittleText}>
          {/*+91 90001 01021*/}
          {mobileNumber}
        </Text>

        <Text style={style.detailsTittleTextStyle}>Home Number</Text>

        <Text style={style.detailSubTittleText}>
          {/*+91 90001 01021*/}
          {HomeMobileNumber}
        </Text>

        <Text style={style.detailsTittleTextStyle}>Email Address</Text>

        <Text style={style.detailSubTittleText}>
          {/*riyashah@gmail.com*/}
          {email}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default UserContactDetail;
