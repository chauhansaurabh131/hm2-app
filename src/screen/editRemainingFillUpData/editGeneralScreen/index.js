import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import NewDropDownTextInput from '../../../components/newDropdownTextinput';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import {useSelector} from 'react-redux';

const EditGeneralScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);

  // console.log(' === var ===> ', user?.user?.height);

  const [genderSelectedOption, genderSetSelectedOption] = useState('');
  const [maritalSelectedOption, maritalSetSelectedOption] = useState('');
  const [selectCaste, setSelectCaste] = useState('');
  const [selectReligion, setSelectReligion] = useState('');
  const [userHeight, setUserHeight] = useState('');
  const [userWeight, setUserWeight] = useState('');

  const genderDropdownData = ['Male', 'Female'];
  const maritalDropdownData = ['Single', 'Never-married', 'Married'];
  const casteDropdownData = ['Rajput', 'Shah', 'Jain', 'Surti', 'Kathiawar'];
  const religionDropdownData = ['Hindu', 'Muslim', 'Sikh'];

  useEffect(() => {
    if (user?.user?.gender) {
      genderSetSelectedOption(user?.user?.gender); // Set gender value if available
    }
    if (user?.user?.maritalStatus) {
      maritalSetSelectedOption(user?.user?.maritalStatus); // Set marital status value if available
    }
    if (user?.user?.caste) {
      setSelectCaste(user?.user?.caste);
    }
    if (user?.user?.religion) {
      setSelectReligion(user?.user?.religion);
    }
    if (user?.user?.height) {
      setUserHeight(user?.user?.height);
    }
    if (user?.user?.weight) {
      setUserWeight(user?.user?.weight);
    }
  }, [
    user?.user?.gender,
    user?.user?.maritalStatus,
    user?.user?.caste,
    user?.user?.religion,
    user?.user?.height,
    user?.user?.weight,
  ]);

  // console.log(' === userHeight ===> ', userHeight);

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

  const onSubmitPress = () => {
    navigation.goBack();
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const capitalizeFirstLetter = text => {
    if (!text) {
      return text;
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: 17, flex: 1}}>
        <AppColorLogo />
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(20),
            lineHeight: hp(30),
            fontFamily: fontFamily.poppins600,
            textAlign: 'center',
            marginTop: 10,
          }}>
          General Details
        </Text>

        <View style={{marginTop: 30}}>
          <NewDropDownTextInput
            placeholder="Gender"
            dropdownData={genderDropdownData}
            onValueChange={genderSetSelectedOption}
            value={capitalizeFirstLetter(genderSelectedOption)}
            bottomSheetHeight={getDropdownHeight('gender')} // Dynamic height
          />

          <View style={{marginTop: hp(37)}}>
            <NewDropDownTextInput
              placeholder="Marital Status"
              dropdownData={maritalDropdownData}
              onValueChange={maritalSetSelectedOption}
              value={capitalizeFirstLetter(maritalSelectedOption)}
              bottomSheetHeight={getDropdownHeight('marital')} // Dynamic height
            />
          </View>

          <View style={{marginTop: hp(37)}}>
            <NewDropDownTextInput
              placeholder="Caste"
              dropdownData={casteDropdownData}
              onValueChange={setSelectCaste}
              value={capitalizeFirstLetter(selectCaste)}
              bottomSheetHeight={getDropdownHeight('caste')} // Dynamic height
            />
          </View>

          <View style={{marginTop: hp(37)}}>
            <NewDropDownTextInput
              placeholder="Religion"
              dropdownData={religionDropdownData}
              onValueChange={setSelectReligion}
              value={capitalizeFirstLetter(selectReligion)}
              bottomSheetHeight={getDropdownHeight('Religion')} // Dynamic height
            />
          </View>

          <View style={{marginTop: hp(37)}}>
            <FloatingLabelInput
              label="Height"
              value={userHeight.toString()}
              onChangeText={setUserHeight}
              showUnitText={'(ft/cm)'}
              showUnit={true}
            />
          </View>

          <View style={{marginTop: hp(37)}}>
            <FloatingLabelInput
              label="Weight"
              value={userWeight.toString()}
              onChangeText={setUserWeight}
              showUnitText={'(kg)'}
              showUnit={true}
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 15,
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={onBackPress}
              activeOpacity={0.7}
              style={{
                width: wp(133),
                height: hp(44),
                borderRadius: 25,
                borderWidth: 1,
                borderColor: colors.black,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  color: colors.black,
                }}>
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSubmitPress}
              style={{
                width: wp(176),
                height: hp(44),
                borderRadius: 30,
                backgroundColor: colors.black,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditGeneralScreen;
