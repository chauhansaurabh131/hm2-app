import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import TextInputWithDropDownComponent from '../../components/textInputWithDropDownComponent';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TextInputSearchAndDropDowm from '../../components/textInputSearchAndDropDown';
import NewDropDownTextInput from '../../components/newDropdownTextinput';
import FloatingLabelInput from '../../components/FloatingLabelInput';

const EducationDetailsScreen = ({
  degree,
  setDegree,
  collage,
  setCollage,
  collageCity,
  setCollageCity,
  collageState,
  setCollageState,
  collageCountry,
  setCollageCountry,
}) => {
  const degreeDropdownData = [
    'BCA',
    'MCA',
    'B.Com',
    'M.Com',
    'B.Tech',
    'M.Tech',
    'BBA',
    'MBA',
  ];

  const educationCityDropdownData = [
    'Gandhinagar',
    'Mehsana',
    'Himmatnagar',
    'Kalol',
  ];

  const educationStateDropdownData = ['Gujarat', 'Delhi', 'Kolkata', 'Mumbai'];

  const educationCountryDropdownData = ['India', 'Sri-Lanka', 'US', 'UK'];

  // Dynamic height assignment based on dropdown type
  const getDropdownHeight = dropdownType => {
    switch (dropdownType) {
      case 'Degree':
        return hp(400); // Set height for gender dropdown
      case 'City':
        return hp(230); // Set height for marital status dropdown
      case 'State':
        return hp(230); // Set height for caste dropdown
      case 'Country':
        return hp(250); // Set height for caste dropdown
      default:
        return hp(300); // Default height
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        <View style={{marginTop: 30}}>
          <NewDropDownTextInput
            placeholder="Degree"
            dropdownData={degreeDropdownData}
            onValueChange={setDegree}
            bottomSheetHeight={getDropdownHeight('Degree')} // Dynamic height
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <FloatingLabelInput
            label="College/University"
            value={collage}
            onChangeText={setCollage}
          />
        </View>

        <View style={{marginTop: 37}}>
          <NewDropDownTextInput
            placeholder="City"
            dropdownData={educationCityDropdownData}
            onValueChange={setCollageCity}
            bottomSheetHeight={getDropdownHeight('City')} // Dynamic height
          />
        </View>

        <View style={{marginTop: 37}}>
          <NewDropDownTextInput
            placeholder="State"
            dropdownData={educationStateDropdownData}
            onValueChange={setCollageState}
            bottomSheetHeight={getDropdownHeight('State')} // Dynamic height
          />
        </View>

        <View style={{marginTop: 37}}>
          <NewDropDownTextInput
            placeholder="Country"
            dropdownData={educationCountryDropdownData}
            onValueChange={setCollageCountry}
            bottomSheetHeight={getDropdownHeight('Country')} // Dynamic height
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EducationDetailsScreen;
