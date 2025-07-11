import React from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, View} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import TextInputSearchAndDropDowm from '../../components/textInputSearchAndDropDown';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import NewDropDownTextInput from '../../components/newDropdownTextinput';

const ProfessionalsDetailsScreen = ({
  jobTitle,
  setJobTitle,
  jobType,
  setJobType,
  companyName,
  setCompanyName,
  salary,
  setSalary,
  workInCity,
  setWorkInCity,
  workInCountry,
  setWorkInCountry,
}) => {
  const jobTypeDropdownData = ['Part-Time', 'Full-Time'];
  const jobWorkCityDropdownData = ['Surat', 'Ahmadabad', 'Navsari', 'Bardoli'];
  const jobWorkContryDropdownData = ['India', 'Sri-Lanka', 'UK', 'USA'];
  const anuallSalary = ['1 lakh', '2 lakh', '3 lakh', '5 lakh', '10 lakh'];

  // Dynamic height assignment based on dropdown type
  const getDropdownHeight = dropdownType => {
    switch (dropdownType) {
      case 'Job Type':
        return hp(150); // Set height for gender dropdown
      case 'Annual Salary':
        return hp(250); // Set height for marital status dropdown
      case 'Work City':
        return hp(230); // Set height for caste dropdown
      case 'Country':
        return hp(230); // Set height for caste dropdown
      default:
        return 300; // Default height
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View>
            <FloatingLabelInput
              label="Current Designation"
              value={jobTitle}
              onChangeText={setJobTitle}
            />
          </View>

          <View style={{marginTop: hp(37)}}>
            <NewDropDownTextInput
              placeholder="Job Type"
              dropdownData={jobTypeDropdownData}
              onValueChange={setJobType}
              bottomSheetHeight={getDropdownHeight('Job Type')} // Dynamic height
            />
          </View>

          <View style={{marginTop: hp(37)}}>
            <FloatingLabelInput
              label="Company Name"
              value={companyName}
              onChangeText={setCompanyName}
            />
          </View>

          <View style={{marginTop: hp(37)}}>
            {/*<FloatingLabelInput*/}
            {/*  label="Annual Salary"*/}
            {/*  value={salary}*/}
            {/*  onChangeText={setSalary}*/}
            {/*  showUnit={true}*/}
            {/*/>*/}
            <NewDropDownTextInput
              placeholder="Annual Salary"
              dropdownData={anuallSalary}
              onValueChange={setSalary}
              bottomSheetHeight={getDropdownHeight('Annual Salary')} // Dynamic height
            />

            {/*<FloatingLabelInput*/}
            {/*  label="Annual Salary"*/}
            {/*  value={salary}*/}
            {/*  onChangeText={setSalary}*/}
            {/*/>*/}
          </View>

          <View style={{marginTop: hp(37)}}>
            <NewDropDownTextInput
              placeholder="Work City"
              dropdownData={jobWorkCityDropdownData}
              onValueChange={setWorkInCity}
              bottomSheetHeight={getDropdownHeight('Work City')} // Dynamic height
            />
          </View>

          <View style={{marginTop: hp(37)}}>
            <NewDropDownTextInput
              placeholder="Country"
              dropdownData={jobWorkContryDropdownData}
              onValueChange={setWorkInCountry}
              bottomSheetHeight={getDropdownHeight('Country')} // Dynamic height
            />
          </View>
          <View style={{height: 50}} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ProfessionalsDetailsScreen;
