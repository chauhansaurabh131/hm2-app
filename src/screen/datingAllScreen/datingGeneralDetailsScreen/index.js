import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, View} from 'react-native';
import {colors} from '../../../utils/colors';
import NewDropDownTextInput from '../../../components/newDropdownTextinput';
import {fontSize, hp, wp} from '../../../utils/helpers';
import FloatingLabelInput from '../../../components/FloatingLabelInput';

import DatingTextInputMultipleSelect from '../../../components/datingTextInputMultipleSelect';
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
  const genderDropdownData = ['male', 'female'];
  const ReligionData = ['hindu', 'muslim', 'sikh', 'christian'];
  const Language = ['hindi', 'english', 'gujarati'];
  const EthnicityData = ['AAA', 'BBB', 'CCC'];

  const handleOptionSelect = option => {
    if (!languageSpoken.includes(option)) {
      setLanguageSpoken([...languageSpoken, option]);
    }
  };

  const handleRemoveValue = option => {
    setLanguageSpoken(languageSpoken.filter(value => value !== option));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        <View style={{marginTop: 30}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <NewDropDownTextInput
              placeholder="Gender"
              dropdownData={genderDropdownData}
              onValueChange={genderSetSelectedOption}
            />

            <View style={{marginTop: hp(37)}}>
              <FloatingLabelInput
                label="Height"
                value={userHeight}
                onChangeText={setUserHeight}
                showUnitText={'CM'}
                showUnit={true}
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <DatingTextInputMultipleSelect
                options={Language}
                selectedValues={languageSpoken}
                onOptionSelect={handleOptionSelect}
                onRemoveValue={handleRemoveValue}
                placeholder="Langauge Spoken"
              />
            </View>

            <View style={{marginTop: hp(30)}}>
              <NewDropDownTextInput
                placeholder="Religion"
                dropdownData={ReligionData}
                onValueChange={SetEthnicityData}
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Ethnicity"
                dropdownData={EthnicityData}
                onValueChange={SetReligionSelectedOption}
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
      </View>
    </SafeAreaView>
  );
};

export default DatingGeneralDetailsScreen;
