import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import NewDropDownTextInput from '../../../components/newDropdownTextinput';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import {useSelector} from 'react-redux';

const EditEducationScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);

  console.log(' === var ===> ', user?.user?.userEducation?.country);

  const [degree, setDegree] = useState('');
  const [collage, setCollage] = useState('');
  const [collageCity, setCollageCity] = useState('');
  const [collageState, setCollageState] = useState('');
  const [collageCountry, setCollageCountry] = useState('');

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

  useEffect(() => {
    if (user?.user?.userEducation?.degree) {
      setDegree(user?.user?.userEducation?.degree);
    }
    if (user?.user?.userEducation?.collage) {
      setCollage(user?.user?.userEducation?.collage);
    }
    if (user?.user?.userEducation?.city) {
      setCollageCity(user?.user?.userEducation?.city);
    }
    if (user?.user?.userEducation?.state) {
      setCollageState(user?.user?.userEducation?.state);
    }
    if (user?.user?.userEducation?.country) {
      setCollageCountry(user?.user?.userEducation?.country);
    }
  }, [
    user?.user?.userEducation?.degree,
    user?.user?.userEducation?.collage,
    user?.user?.userEducation?.city,
    user?.user?.userEducation?.state,
    user?.user?.userEducation?.country,
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
          Education Details
        </Text>

        <View style={{marginTop: 30}}>
          <NewDropDownTextInput
            placeholder="Degree"
            dropdownData={degreeDropdownData}
            onValueChange={setDegree}
            value={capitalizeFirstLetter(degree)}
            bottomSheetHeight={getDropdownHeight('Degree')} // Dynamic height
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <FloatingLabelInput
            label="College/University"
            value={capitalizeFirstLetter(collage)}
            onChangeText={setCollage}
          />
        </View>

        <View style={{marginTop: 37}}>
          <NewDropDownTextInput
            placeholder="City"
            dropdownData={educationCityDropdownData}
            onValueChange={setCollageCity}
            value={capitalizeFirstLetter(collageCity)}
            bottomSheetHeight={getDropdownHeight('City')} // Dynamic height
          />
        </View>

        <View style={{marginTop: 37}}>
          <NewDropDownTextInput
            placeholder="State"
            dropdownData={educationStateDropdownData}
            onValueChange={setCollageState}
            value={capitalizeFirstLetter(collageState)}
            bottomSheetHeight={getDropdownHeight('State')} // Dynamic height
          />
        </View>

        <View style={{marginTop: 37}}>
          <NewDropDownTextInput
            placeholder="Country"
            dropdownData={educationCountryDropdownData}
            onValueChange={setCollageCountry}
            value={capitalizeFirstLetter(collageCountry)}
            bottomSheetHeight={getDropdownHeight('Country')} // Dynamic height
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

export default EditEducationScreen;
