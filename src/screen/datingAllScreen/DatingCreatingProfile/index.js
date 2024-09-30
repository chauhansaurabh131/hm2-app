import React, {useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import NewDropDownTextInput from '../../../components/newDropdownTextinput';
import FloatingLabelInput from '../../../components/FloatingLabelInput';

const DatingCreatingProfile = () => {
  const [datingSelectedOption, setDatingSelectedOption] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const dropdownData = [
    'marriage',
    'dating',
    'casualDating',
    'long-Term-Relationship',
    'friendship',
    'OpenToExploring',
    'just-chatting',
  ];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        <AppColorLogo />
        <Text
          style={{
            fontSize: fontSize(20),
            lineHeight: hp(30),
            fontFamily: fontFamily.poppins600,
            color: colors.black,
            textAlign: 'center',
            marginTop: hp(92),
          }}>
          I’m Looking for?
        </Text>

        <View style={{marginTop: hp(92)}}>
          <NewDropDownTextInput
            placeholder="Select an option"
            dropdownData={dropdownData}
            onValueChange={setDatingSelectedOption}
          />

          <View style={{marginTop: hp(37)}}>
            <FloatingLabelInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              // showUnitText={'KG'}
              // showUnit={true}
            />
          </View>

          <View style={{marginTop: hp(37)}}>
            <FloatingLabelInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            // onPress={onStartNowPress}
            style={{
              width: '100%',
              height: hp(50),
              borderRadius: 50,
              backgroundColor: 'black',
              marginTop: hp(50),
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
              }}>
              Start Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DatingCreatingProfile;
