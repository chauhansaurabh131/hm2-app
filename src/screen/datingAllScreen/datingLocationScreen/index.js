import React from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {colors} from '../../../utils/colors';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import {hp, wp} from '../../../utils/helpers';
import NewDropDownTextInput from '../../../components/newDropdownTextinput';
import {useSelector} from 'react-redux';

const DatingLocationScreen = ({
  mobileNumber,
  setMobileNumber,
  setCurrentLiving,
  setEducationLevel,
  setOccupation,
  setAnnualIncome,
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

  const Annual_Income = [
    'Above 2 Lacs',
    'Above 3 Lacs',
    'Above 4 Lacs',
    'Above 5 Lacs',
  ];

  const {user} = useSelector(state => state.auth);
  const userEmail = user?.user?.email;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        <ScrollView showsVerticalScrollIndicator={false}>
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
              v
              value={userEmail || 'N/A'}
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

          <View style={{marginTop: 37}}>
            <NewDropDownTextInput
              placeholder="Annual Income"
              dropdownData={Annual_Income}
              onValueChange={setAnnualIncome}
            />
          </View>

          <View style={{height: 50}} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DatingLocationScreen;
