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
  const CurrentLivingData = ['India'];

  const EducationLevelData = [
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
    'IRS',
    'IES',
    'IF',
  ];
  const OccupationData = ['Government', 'Private', 'Retired', 'Homemaker'];

  const Annual_Income = [
    'Above 2 Lacs',
    'Above 4 Lacs',
    'Above 6 Lacs',
    'Above 8 Lacs',
    'Above 10 Lacs',
    'Above 12 Lacs',
    'Above 15 Lacs',
    'Above 18 Lacs',
    'Above 20 Lacs',
  ];

  const {user} = useSelector(state => state.auth);
  const userEmail = user?.user?.email;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{height: hp(15)}} />
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
              bottomSheetHeight={hp(100)}
            />
          </View>

          <View style={{marginTop: 37}}>
            <NewDropDownTextInput
              placeholder="Education Level"
              dropdownData={EducationLevelData}
              onValueChange={setEducationLevel}
              bottomSheetHeight={hp(450)}
            />
          </View>

          <View style={{marginTop: 37}}>
            <NewDropDownTextInput
              placeholder="Occupation"
              dropdownData={OccupationData}
              onValueChange={setOccupation}
              bottomSheetHeight={hp(220)}
            />
          </View>

          <View style={{marginTop: 37}}>
            <NewDropDownTextInput
              placeholder="Annual Income"
              dropdownData={Annual_Income}
              onValueChange={setAnnualIncome}
              bottomSheetHeight={hp(300)}
            />
          </View>

          <View style={{height: 50}} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DatingLocationScreen;
