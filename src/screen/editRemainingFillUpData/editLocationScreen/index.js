import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import NewDropDownTextInput from '../../../components/newDropdownTextinput';
import {useSelector} from 'react-redux';

const EditLocationScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);

  console.log(' === var ===> ', user?.user?.address?.currentCity);

  const [currentAddress, setCurrentAddress] = useState('');
  const [currentCountry, setCurrentCountry] = useState('');
  const [currentState, setCurrentState] = useState('');
  const [selectCurrentCity, setSelectCurrentCity] = useState('');

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

  useEffect(() => {
    if (user?.user?.address?.currentResidenceAddress) {
      setCurrentAddress(user?.user?.address?.currentResidenceAddress);
    }
    if (user?.user?.address?.currentCountry) {
      setCurrentCountry(user?.user?.address?.currentCountry);
    }
    if (user?.user?.address?.currentState) {
      setCurrentState(user?.user?.address?.currentState);
    }
    if (user?.user?.address?.currentCity) {
      setSelectCurrentCity(user?.user?.address?.currentCity);
    }
  }, [
    user?.user?.address?.currentResidenceAddress,
    user?.user?.address?.currentCountry,
    user?.user?.address?.currentState,
    user?.user?.address?.currentCity,
  ]);

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
          Location Details
        </Text>

        <View style={{marginTop: 30}}>
          <FloatingLabelInput
            label="Current Address"
            value={currentAddress}
            onChangeText={setCurrentAddress}
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <NewDropDownTextInput
            placeholder="Country"
            dropdownData={currentCountryDropDown}
            onValueChange={setCurrentCountry}
            value={capitalizeFirstLetter(currentCountry)}
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <NewDropDownTextInput
            placeholder="State"
            dropdownData={currentStateDropdown}
            onValueChange={setCurrentState}
            value={capitalizeFirstLetter(currentState)}
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <NewDropDownTextInput
            placeholder="City"
            dropdownData={currentCityNameDropdown}
            onValueChange={setSelectCurrentCity}
            value={capitalizeFirstLetter(selectCurrentCity)}
          />
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

export default EditLocationScreen;
