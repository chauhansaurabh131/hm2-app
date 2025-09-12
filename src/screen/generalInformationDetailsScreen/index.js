import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {style} from './style';
import NewDropDownTextInput from '../../components/newDropdownTextinput';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import {hp, wp} from '../../utils/helpers';

const GeneralInformationDetailsScreen = ({
  genderSetSelectedOption,
  maritalSetSelectedOption,
  selectCaste,
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
  const genderDropdownData = [
    'Male',
    'Female',
    'Non Binary',
    'Prefer Not To Say',
    'Other',
  ];
  const maritalDropdownData = [
    'Single',
    'Never-Married',
    'Married',
    'Divorcee',
  ];
  const casteDropdownData = ['Rajput', 'Shah', 'Jain', 'Surti', 'Kathiawar'];
  const religionDropdownData = [
    'Hindu',
    'Muslim',
    'Christian',
    'Sikh',
    'Buddhist',
    'Jain',
    'Islam',
    'Other',
  ];
  const ManglikStatusDropdownData = [
    'Manglik',
    'Non Manglik',
    'Anshik Manglik',
    'Dont know',
  ];
  const GothraStatusDropdownData = [
    'Bharadvaja',
    'Kashyapa',
    'Atri',
    'Vashistha',
    'Vishwamitra',
    'Gautama',
    'Jamadagni',
    'Agastya',
    'Bhrigu',
    'Kaushika',
    'Sandilya',
    'Parashara',
    'Mandavya',
    'Harita',
    'Kutsa',
    'Shrivatsa',
    'Mudgala',
    'Vatsa',
    'Maitreya',
    'Durvasa',
    'Chyavana',
    'Marichi',
    'Pulastya',
    'Pulaha',
    'Kratu',
    'Angirasa',
    'Vishnuvardhana',
    'Shunak',
    'Kapila',
    'Vyasa',
    'Rishyashringa',
    'Sankriti',
    'Saunaka',
    'Rohini',
    'Lomasha',
    'Devala',
    'Yajnavalkya',
    'Valmiki',
    'Valmiki',
    'Vamadeva',
    'Other',
  ];

  const ZodiacStatusDropdownData = [
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
  ];

  const languageDropdownData = [
    'Assamese',
    'Bengali',
    'Bodo',
    'Dogri',
    'English',
    'Gujarati',
    'Hindi',
    'Kannada',
    'Kashmiri',
    'Konkini',
    'Nepali',
    'Manipuri',
    'Marathi',
    'Odia',
    'Punjabi',
    'Sanskrit',
    'Santali',
    'Sindhi',
    'Tamil',
    'Telugu',
    'Urdu',
  ];

  // Dynamic height assignment based on dropdown type
  const getDropdownHeight = dropdownType => {
    switch (dropdownType) {
      case 'gender':
        return hp(255); // Set height for gender dropdown
      case 'marital':
        return hp(220); // Set height for marital status dropdown
      case 'caste':
        return hp(300); // Set height for caste dropdown
      case 'Religion':
        return hp(390); // Set height for caste dropdown
      case 'Manglik':
        return hp(220); // Set height for caste dropdown
      case 'Gothra':
        return hp(420); // Set height for caste dropdown
      case 'Zodiac':
        return hp(350); // Set height for caste dropdown
      case 'Toungue':
        return hp(450); // Set height for caste dropdown
      default:
        return 300; // Default height
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginHorizontal: wp(17), marginTop: hp(7)}}>
          <View>
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
              {/*<NewDropDownTextInput*/}
              {/*  placeholder="Caste"*/}
              {/*  dropdownData={casteDropdownData}*/}
              {/*  onValueChange={setSelectCaste}*/}
              {/*  bottomSheetHeight={getDropdownHeight('caste')} // Dynamic height*/}
              {/*/>*/}

              <FloatingLabelInput
                label="Caste"
                value={selectCaste}
                onChangeText={setSelectCaste}
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
                  showUnitText={'(Ft)'}
                  showUnit={true}
                />
              </View>
              <View style={{marginTop: hp(37), width: '45%'}}>
                <FloatingLabelInput
                  label="Weight"
                  value={userWeight}
                  onChangeText={setUserWeight}
                  showUnitText={'(Kg)'}
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

            <View style={{height: hp(50)}} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GeneralInformationDetailsScreen;
