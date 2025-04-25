import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {style} from './style';
import NewDropDownTextInput from '../../components/newDropdownTextinput';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import {hp, wp} from '../../utils/helpers';

const GeneralInformationDetailsScreen = ({
  genderSetSelectedOption,
  maritalSetSelectedOption,
  setSelectCaste,
  setSelectReligion,
  setUserHeight,
  setUserWeight,
  userHeight,
  userWeight,
  setSelectManglik,
  setSelectGothra,
  setSelectZodiac,
  setSelectLanguage,
  about,
  setAbout,
}) => {
  const genderDropdownData = ['Male', 'Female'];
  const maritalDropdownData = ['Single', 'Never-married', 'Married'];
  const casteDropdownData = ['Rajput', 'Shah', 'Jain', 'Surti', 'Kathiawar'];
  const religionDropdownData = ['Hindu', 'Muslim', 'Sikh'];
  const ManglikStatusDropdownData = ['Yes', 'No'];
  const GothraStatusDropdownData = [
    'Agasthi (अगस्ती)',
    'Atri (अत्री)',
    'Angirasa (अंगिरासा)',
    'Bharadwaj (भारद्वाज)',
    'Gautam (गौतम)',
    'Jamadagni (जमदग्नि)',
    'Kashyap (कश्यप)',
    'Vasishta (वशिष्ठ)',
    'Vishwamitra (विश्वामित्र)',
    'Bhrigu (भृगु)',
    'Shandilya (शांडिल्य)',
    'Kaushik (कौशिक)',
    'Parashar (पाराशर)',
    'Vatsa (वत्स)',
    'Mudgal (मुदगल)',
    'Other (अन्य)',
  ];

  const ZodiacStatusDropdownData = [
    'Aries (मेष)',
    'Taurus (वॄष)',
    'Gemini (मिथुन)',
    'Cancer (कर्क)',
    'Leo (सिंह)',
    'Virgo (कन्या)',
    'Libra (तुला)',
    'Scorpio (वृश्चिक)',
    'Sagittarius (धनु)',
    'Capricorn (मकर)',
    'Aquarius (कुंभ)',
    'Pisces (मीन)',
  ];

  const languageDropdownData = ['Hindi', 'Gujarati', 'English'];

  // Dynamic height assignment based on dropdown type
  const getDropdownHeight = dropdownType => {
    switch (dropdownType) {
      case 'gender':
        return hp(150); // Set height for gender dropdown
      case 'marital':
        return hp(200); // Set height for marital status dropdown
      case 'caste':
        return hp(300); // Set height for caste dropdown
      case 'Religion':
        return hp(200); // Set height for caste dropdown
      case 'Manglik':
        return hp(150); // Set height for caste dropdown
      case 'Gothra':
        return hp(350); // Set height for caste dropdown
      case 'Zodiac':
        return hp(350); // Set height for caste dropdown
      case 'Toungue':
        return hp(180); // Set height for caste dropdown
      default:
        return 300; // Default height
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginHorizontal: wp(17)}}>
          <View style={{marginTop: 30}}>
            <NewDropDownTextInput
              placeholder="Gender"
              dropdownData={genderDropdownData}
              onValueChange={genderSetSelectedOption}
              bottomSheetHeight={getDropdownHeight('gender')} // Dynamic height
            />
            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Marital Status"
                dropdownData={maritalDropdownData}
                onValueChange={maritalSetSelectedOption}
                bottomSheetHeight={getDropdownHeight('marital')} // Dynamic height
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Caste"
                dropdownData={casteDropdownData}
                onValueChange={setSelectCaste}
                bottomSheetHeight={getDropdownHeight('caste')} // Dynamic height
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Religion"
                dropdownData={religionDropdownData}
                onValueChange={setSelectReligion}
                bottomSheetHeight={getDropdownHeight('Religion')} // Dynamic height
              />
            </View>

            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <View style={{marginTop: hp(37), width: '45%'}}>
                <FloatingLabelInput
                  label="Height"
                  value={userHeight}
                  onChangeText={setUserHeight}
                  showUnitText={'(ft/cm)'}
                  showUnit={true}
                />
              </View>
              <View style={{marginTop: hp(37), width: '45%'}}>
                <FloatingLabelInput
                  label="Weight"
                  value={userWeight}
                  onChangeText={setUserWeight}
                  showUnitText={'(kg)'}
                  showUnit={true}
                />
              </View>
            </View>

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Manglik Status"
                dropdownData={ManglikStatusDropdownData}
                onValueChange={setSelectManglik}
                bottomSheetHeight={getDropdownHeight('Manglik')} // Dynamic height
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Select Your Gothra"
                dropdownData={GothraStatusDropdownData}
                onValueChange={setSelectGothra}
                bottomSheetHeight={getDropdownHeight('Gothra')} // Dynamic height
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Zodiac Sign"
                dropdownData={ZodiacStatusDropdownData}
                onValueChange={setSelectZodiac}
                bottomSheetHeight={getDropdownHeight('Zodiac')} // Dynamic height
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Mother Toungue"
                dropdownData={languageDropdownData}
                onValueChange={setSelectLanguage}
                bottomSheetHeight={getDropdownHeight('Toungue')} // Dynamic height
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <FloatingLabelInput
                label="About Yourself"
                value={about}
                onChangeText={setAbout}
              />
            </View>

            <View style={{height: hp(100)}} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GeneralInformationDetailsScreen;
