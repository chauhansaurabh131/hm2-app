import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import AgeRangeSlider from '../../../components/ageRangeSlider';
import {useSelector} from 'react-redux';
import HeightRangeSlider from '../../../components/heightRangeSlider';
import NewBottomSheetMultipleValueSelect from '../../../components/newBottomSheetMultipleValueSelect';
import NewBottomSheetSingleValueSelect from '../../../components/newBottomSheetSingleValueSelect';

const EditPartnerPreferencesScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);

  console.log(' === var ===> ', user?.user?.userPartner);

  const [ageRange, setAgeRange] = useState([25, 35]); // Initial age range
  const [heightRange, setHeightRange] = useState([4, 8]); // Initial age range
  const [preferCountry, setPreferCountry] = useState([]);
  const [preferState, setPreferState] = useState([]);
  const [preferCity, setPreferCity] = useState([]);
  const [preferDiet, setPreferDiet] = useState([]);
  const [annualIncome, setAnnualIncome] = useState([7, 12]); // Initial age range
  const [preferHobbies, setPreferHobbies] = useState([]);

  const Prefer_Country = [
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

  const Prefer_State = [
    'Gujarat',
    'Assam',
    'Andhra-pradesh',
    'Arunachal-pradesh',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Haryana',
    'Himachal-pradesh',
  ];

  const Prefer_City = [
    'Surat',
    'Navsari',
    'Bardoli',
    'Vadodara',
    'valod',
    'Mumbai',
    'Delhi',
    'Daman',
    'Sirdi',
  ];

  const Prefer_Diet = ['Vegetarian', 'Non_vegetarian'];

  const Prefer_hobbies = [
    'Movie',
    'Sports',
    'Biking',
    'Music',
    'Social Media',
    'Clubbing',
    'Travelling',
    'Shopping',
    'Reading',
    'Binge-Watching',
    'Theater & Events',
    'Photography',
  ];

  const handleRangeSubmit = range => {
    setAgeRange(range); // Update the state with the selected age range
  };

  const handleHeightRangeSubmit = range => {
    setHeightRange(range);
  };
  const handleSelect = selectedValue => {
    setPreferCountry(selectedValue);
  };

  const handleStateSelect = selectedValue => {
    setPreferState(selectedValue);
  };

  const handleCitySelect = selectedValue => {
    setPreferCity(selectedValue);
  };

  const handleDietSelect = selectedValue => {
    setPreferDiet(selectedValue);
  };

  const handleAnnualIncomeSubmit = range => {
    setAnnualIncome(range); // Update the state with the selected age range
  };

  const handleHobbiesSelect = selectedValue => {
    setPreferHobbies(selectedValue);
  };

  const onSubmitPress = () => {
    navigation.goBack();
  };

  const onBackPress = () => {
    navigation.goBack();
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
          Add Partner Preference
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center', marginTop: hp(37)}}>
            <AgeRangeSlider
              initialRange={ageRange}
              onSubmitRange={handleRangeSubmit}
              tittleLabelText={'Select Age Range'}
              min={18}
              max={50}
              containerStyle={{width: '100%'}}
              labelContainerStyle={{
                marginHorizontal: 3,
                marginBottom: 5,
              }}
              rangeLabel={{
                fontsize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins600,
              }}
              tittleLabel={{
                fontsize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
                color: '#9A9A9A',
              }}
              trackStyle={{height: 3}}
            />
          </View>

          <View style={{alignItems: 'center', marginTop: hp(30)}}>
            <HeightRangeSlider
              initialRange={heightRange}
              onSubmitRange={handleHeightRangeSubmit}
              tittleLabelText={'Select Height Range'}
              containerStyle={{width: '100%'}}
              labelContainerStyle={{
                marginHorizontal: 3,
                marginBottom: 5,
              }}
              rangeLabel={{
                fontsize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins600,
              }}
              tittleLabel={{
                fontsize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
                color: '#9A9A9A',
              }}
              trackStyle={{height: 3}}
            />
          </View>

          <View style={{marginTop: hp(30)}}>
            <NewBottomSheetMultipleValueSelect
              label="Select Prefer Country"
              options={Prefer_Country}
              onSelect={handleSelect} // Pass the onSelect handler to capture selected values
              bottomSheetHeight={hp(450)}
              // selectedValues={preferCountry}
            />
          </View>

          <View style={{marginTop: hp(30)}}>
            <NewBottomSheetMultipleValueSelect
              label="Select Prefer City"
              options={Prefer_City}
              onSelect={handleCitySelect} // Pass the onSelect handler to capture selected values
              bottomSheetHeight={hp(450)}
            />
          </View>

          <View style={{marginTop: hp(30)}}>
            <NewBottomSheetSingleValueSelect
              label="Prefer Diet"
              options={Prefer_Diet}
              onSelect={handleDietSelect} // Pass the onSelect handler to capture the selected value
              bottomSheetHeight={hp(150)}
            />
          </View>

          <View style={{alignItems: 'center', marginTop: hp(50)}}>
            <AgeRangeSlider
              initialRange={annualIncome}
              onSubmitRange={handleAnnualIncomeSubmit}
              tittleLabelText={'Select Annual Income'}
              rangeDatalabel={' Lacs'}
              min={5}
              max={30}
              containerStyle={{width: '100%'}}
              labelContainerStyle={{
                marginHorizontal: 3,
                marginBottom: 5,
              }}
              rangeLabel={{
                fontsize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins600,
              }}
              tittleLabel={{
                fontsize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
                color: '#9A9A9A',
              }}
              trackStyle={{height: 3}}
            />
          </View>

          <View style={{marginTop: hp(30)}}>
            <NewBottomSheetMultipleValueSelect
              label="Select Hobbies"
              options={Prefer_hobbies}
              onSelect={handleHobbiesSelect} // Pass the onSelect handler to capture selected values
              bottomSheetHeight={hp(500)}
            />
          </View>

          <View style={{height: 100}} />
        </ScrollView>

        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 0,
            width: '100%',
            // backgroundColor: 'red',
            height: 70,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 10,
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

export default EditPartnerPreferencesScreen;
