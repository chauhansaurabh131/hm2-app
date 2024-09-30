import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {colors} from '../../../utils/colors';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import {hp, wp} from '../../../utils/helpers';
import NewDropDownTextInput from '../../../components/newDropdownTextinput';

const DatingLocationScreen = ({
  mobileNumber,
  setMobileNumber,
  setCurrentLiving,
  setEducationLevel,
  setOccupation,
}) => {
  const CurrentLivingData = ['India', 'Sri-Lanka', 'US', 'UK'];

  const EducationLevelData = [
    'PhD',
    "master's Degree",
    "Bachelor's Degree",
    'Higher Secondary ',
    'Secondary',
  ];
  const OccupationData = ['Work', 'Business', 'Business & Work'];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        <View style={{marginTop: 30}}>
          <FloatingLabelInput
            label="Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            showUnit={true}
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <FloatingLabelInput
            label="Email Address"
            value={'N/A'}
            // onChangeText={setUserEmail}
          />
        </View>

        <View style={{marginTop: 37}}>
          <NewDropDownTextInput
            placeholder="Currently Living"
            dropdownData={CurrentLivingData}
            onValueChange={setCurrentLiving}
          />
        </View>

        <View style={{marginTop: 37}}>
          <NewDropDownTextInput
            placeholder="Education Level"
            dropdownData={EducationLevelData}
            onValueChange={setEducationLevel}
          />
        </View>

        <View style={{marginTop: 37}}>
          <NewDropDownTextInput
            placeholder="Occupation"
            dropdownData={OccupationData}
            onValueChange={setOccupation}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DatingLocationScreen;
