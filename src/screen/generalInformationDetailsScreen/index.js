import React, {useState} from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
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
}) => {
  const genderDropdownData = ['Male', 'Female'];
  const maritalDropdownData = ['Single', 'Never-married', 'Married'];
  const casteDropdownData = ['Rajput', 'Shah', 'Jain', 'Surti', 'Kathiawar'];
  const religionDropdownData = ['Hindu', 'Muslim', 'Sikh'];

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
              <FloatingLabelInput
                label="Weight"
                value={userWeight}
                onChangeText={setUserWeight}
                showUnitText={'KG'}
                showUnit={true}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GeneralInformationDetailsScreen;
