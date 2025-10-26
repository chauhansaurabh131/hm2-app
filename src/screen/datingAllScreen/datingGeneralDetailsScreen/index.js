import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, View} from 'react-native';
import {colors} from '../../../utils/colors';
import NewDropDownTextInput from '../../../components/newDropdownTextinput';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import FloatingLabelInput from '../../../components/FloatingLabelInput';

import DatingTextInputMultipleSelect from '../../../components/datingTextInputMultipleSelect';
import NewBottomSheetMultipleValueSelect from '../../../components/newBottomSheetMultipleValueSelect';
const DatingGeneralDetailsScreen = ({
  genderSetSelectedOption,
  userHeight,
  setUserHeight,
  languageSpoken,
  setLanguageSpoken,
  SetReligionSelectedOption,
  SetEthnicityData,
  setBio,
  bio,
}) => {
  const genderDropdownData = [
    'Male',
    'Female',
    'Non Binary',
    'prefer Not To Say',
    'Other',
  ];
  const ReligionData = [
    'Hindu',
    'Muslim',
    'Christian',
    'Sikh',
    'Buddhist',
    'Jain',
    'Islam',
    'Other',
  ];
  const Language = ['Hindi', 'English', 'Gujarati'];
  const EthnicityData = ['AAA', 'BBB', 'CCC'];

  const handleOptionSelect = option => {
    if (!languageSpoken.includes(option)) {
      setLanguageSpoken([...languageSpoken, option]);
    }
  };

  const handleRemoveValue = option => {
    setLanguageSpoken(languageSpoken.filter(value => value !== option));
  };

  const handleSelect = selectedValue => {
    setLanguageSpoken(selectedValue);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView
        style={{marginHorizontal: wp(17)}}
        showsVerticalScrollIndicator={false}>
        <View style={{marginTop: 30}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{height: hp(15)}} />
            <NewDropDownTextInput
              placeholder="Gender"
              dropdownData={genderDropdownData}
              onValueChange={genderSetSelectedOption}
              bottomSheetHeight={hp(260)}
            />

            <View style={{marginTop: hp(37)}}>
              <FloatingLabelInput
                label="Height"
                value={userHeight}
                onChangeText={setUserHeight}
                showUnitText={'Ft'}
                showUnit={true}
              />
            </View>

            <View style={{marginTop: hp(30)}}>
              <NewBottomSheetMultipleValueSelect
                label="Langauge Spoken"
                options={Language}
                onSelect={handleSelect} // Pass the onSelect handler to capture selected values
                bottomSheetHeight={hp(170)}
                textInputStyle={{
                  fontSize: fontSize(17),
                  lineHeight: hp(26),
                  fontFamily: fontFamily.poppins400,
                }}
              />
            </View>

            <View style={{marginTop: hp(10)}}>
              <NewDropDownTextInput
                placeholder="Religion"
                dropdownData={ReligionData}
                onValueChange={SetReligionSelectedOption}
                bottomSheetHeight={hp(390)}
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Ethnicity"
                dropdownData={EthnicityData}
                onValueChange={SetEthnicityData}
                bottomSheetHeight={hp(170)}
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <FloatingLabelInput
                label="Short Bio"
                value={bio}
                onChangeText={setBio}
              />
            </View>

            <View style={{height: hp(50)}} />
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DatingGeneralDetailsScreen;
