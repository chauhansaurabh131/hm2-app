import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, View} from 'react-native';
import style from './style';
import {colors} from '../../utils/colors';
import CheckBox from 'react-native-check-box';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import TextInputSearchAndDropDowm from '../../components/textInputSearchAndDropDown';
import Toast from 'react-native-toast-message';
import NewDropDownTextInput from '../../components/newDropdownTextinput';
import FloatingLabelInput from '../../components/FloatingLabelInput';

const AddressDetailsScreen = ({
  selectCurrentCity,
  currentResidingAddress,
  setCurrentResidingAddress,
  selectCurrentLiving,
  setSelectCurrentLiving,

  currentAddress,
  setCurrentAddress,
  setCurrentCountry,
  setCurrentState,
  setSelectCurrentCity,
}) => {
  const currentCountryDropDown = [
    'India',
    'Canada',
    'Us',
    'Afghanistan',
    'China',
    'Myanmar',
    'Nepal',
    'Sri-lanka',
    'Pakistan',
  ];

  const currentStateDropdown = [
    'Maharashtra',
    'Delhi',
    'Rajasthan',
    'Haryana',
    'Gujarat',
  ];

  const currentCityNameDropdown = [
    'Ahmedabad',
    'Surat',
    'Gandhinagar',
    'Patan',
    'Mehsana',
    'Himmatnagar',
  ];

  return (
    <SafeAreaView style={style.container}>
      <View style={{marginHorizontal: wp(17)}}>
        {/*<View style={{marginTop: 30}}>*/}
        {/*  <FloatingLabelInput*/}
        {/*    label="Current Address"*/}
        {/*    value={currentAddress}*/}
        {/*    onChangeText={setCurrentAddress}*/}
        {/*  />*/}
        {/*</View>*/}

        <View style={{marginTop: hp(30)}}>
          <NewDropDownTextInput
            placeholder="Country"
            dropdownData={currentCountryDropDown}
            onValueChange={setCurrentCountry}
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <NewDropDownTextInput
            placeholder="State"
            dropdownData={currentStateDropdown}
            onValueChange={setCurrentState}
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <NewDropDownTextInput
            placeholder="City"
            dropdownData={currentCityNameDropdown}
            onValueChange={setSelectCurrentCity}
          />
        </View>
      </View>
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default AddressDetailsScreen;
