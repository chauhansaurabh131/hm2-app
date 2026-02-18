import React, {useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {colors} from '../../../utils/colors';
import {hp} from '../../../utils/helpers';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';
const DatingGeneralDetailsScreen = ({
  genderSetSelectedOption,
  setUserHeight,
  languageSpoken,
  setLanguageSpoken,
  SetReligionSelectedOption,
  SetEthnicityData,
  setCurrentLiving,
  setEducationLevel,
  setOccupation,
  setAnnualIncome,
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
  const Language = [
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
  const EthnicityData = [
    'Punjabi',
    'Tamil',
    'Gujarati',
    'Bengali',
    'Marathi',
    'Arab',
    'Chinese',
    'Hispanic',
    'Other',
  ];
  const currentCountryDropDown = ['India'];

  const degreeDropdownData = [
    'Bachelors Arts',
    'Science',
    'Commerce',
    'B Phil',
    'Bachelors Engineering',
    'Computers',
    'BCA',
    'MCA',
    'BBA',
    'BSC',
    'MSC',
    'Diploma',
    'Higher Secondary',
    'Secondary',
    'Legal BL',
    'ML',
    'LLB',
    'LLM',
    'Management BBA',
    'MBA',
    'Masters Arts',
    'Masters Science',
    'Masters Commerce',
    'M Phil',
    'Masters Engineering',
    'Computers (Masters)',
    'Medicine General',
    'Dental',
    'Surgeon',
    'Ph.D',
    'IAS',
    'IPS',
  ];

  const OccupationData = ['Government', 'Private', 'Retired', 'Homemaker'];

  const anuallSalary = ['1 LPA', '2 LPA', '3 LPA', '5 LPA', '10 LPA'];

  const [selectedGenderStatus, setSelectedGenderStatus] = useState('');
  const [selectedHeightStatus, setSelectedHeightStatus] = useState('');
  const [multiLanguageStatus, setMultiLanguageStatus] = useState('');
  const [selectedReligionStatus, setSelectedReligionStatus] = useState('');
  const [selectedEthnicityStatus, setSelectedEthnicityStatus] = useState('');
  const [selectedCountryStatus, setSelectedCountryStatus] = useState('');
  const [selectedDegreeStatus, setSelectedDegreeStatus] = useState('');
  const [selectedOccupationStatus, setSelectedOccupationStatus] = useState('');
  const [selectedSalaryStatus, setSelectedSalaryStatus] = useState('');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{marginHorizontal: 17}}>
        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Gender"
            value={selectedGenderStatus}
            dropdownData={genderDropdownData}
            onValueChange={value => {
              setSelectedGenderStatus(value); // ✅ update UI
              genderSetSelectedOption?.(value); // ✅ optional: update parent
            }}
            bottomSheetHeight={hp(300)}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewEnterSelectValueComponent
            title="Height"
            value={selectedHeightStatus}
            emptyText="Add"
            modalTitle="Height"
            modalEgTitle="(e.g 5.3ft)"
            keyboardTypes="decimal-pad"
            onValueChange={value => {
              setSelectedHeightStatus(value);
              setUserHeight?.(value);
            }}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Language Spoken"
            value={multiLanguageStatus}
            dropdownData={Language}
            onValueChange={value => {
              setMultiLanguageStatus(value);
              setLanguageSpoken?.(value);
            }}
            bottomSheetHeight={hp(450)}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Religion"
            value={selectedReligionStatus}
            dropdownData={ReligionData}
            onValueChange={value => {
              setSelectedReligionStatus(value);
              SetReligionSelectedOption?.(value);
            }}
            bottomSheetHeight={hp(450)}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Ethnicity"
            value={selectedEthnicityStatus}
            dropdownData={EthnicityData}
            onValueChange={value => {
              setSelectedEthnicityStatus(value);
              SetEthnicityData?.(value);
            }}
            bottomSheetHeight={hp(450)}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Currently Living"
            value={selectedCountryStatus}
            dropdownData={currentCountryDropDown}
            onValueChange={value => {
              setSelectedCountryStatus(value); // ✅ update UI
              setCurrentLiving?.(value); // ✅ optional: update parent
            }}
            bottomSheetHeight={hp(450)}
            showSearch={true}
            useGoogleSearch={true}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Education Level"
            value={selectedDegreeStatus}
            dropdownData={degreeDropdownData}
            onValueChange={value => {
              setSelectedDegreeStatus(value);
              setEducationLevel?.(value);
            }}
            bottomSheetHeight={hp(450)}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Occupation"
            value={selectedOccupationStatus}
            dropdownData={OccupationData}
            onValueChange={value => {
              setSelectedOccupationStatus(value);
              setOccupation?.(value);
            }}
            bottomSheetHeight={hp(270)}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Annual Salary"
            value={selectedSalaryStatus}
            dropdownData={anuallSalary}
            onValueChange={value => {
              setSelectedSalaryStatus(value);
              setAnnualIncome?.(value);
            }}
            bottomSheetHeight={hp(300)}
          />
        </View>

        <View style={{marginTop: 30}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{height: hp(15)}} />

            <View style={{height: hp(15)}} />
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DatingGeneralDetailsScreen;
