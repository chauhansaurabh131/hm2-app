import React, {useState} from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {colors} from '../../../utils/colors';

import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';

import DropDownMutipleValueComponent from '../../../components/DropDownMutipleValueComponent';
import ReusableDropdown from '../../../components/ReusableDropdown';

const DatingPartnerPreferenceScreen = () => {
  const [countryList, setCountryList] = useState([]);

  const DatingList = [
    {label: 'Meet New Friends', value: '1'},
    {label: 'Looking for Love', value: '2'},
    {label: 'Movie Date', value: '3'},
    {label: 'Foodies', value: '4'},
    {label: 'Travel Buddies', value: '5'},
    {label: 'Game Lover', value: '6'},
    {label: 'Chit-Chat', value: '7'},
    {label: 'Adventurous', value: '8'},
  ];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        <AppColorLogo />
        <Text
          style={{
            color: 'black',
            marginTop: hp(10),
            fontSize: fontSize(20),
            lineHeight: hp(30),
            fontFamily: fontFamily.poppins600,
            textAlign: 'center',
          }}>
          Add Partner Preference
        </Text>

        <DropDownMutipleValueComponent
          data={DatingList}
          height={50}
          searchPlaceholder={'Search Country'}
          placeholder={'Select Interested In'}
          selectedItems={countryList}
          setSelectedItems={setCountryList}
        />
      </View>
    </SafeAreaView>
  );
};

export default DatingPartnerPreferenceScreen;
