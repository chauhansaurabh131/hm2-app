import React, {useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AppColorLogo from '../../components/appColorLogo';
import DropdownHeightAndAgeComponent from '../../components/DropdownHeightAndAgeComponent';
import {COUNTRY_LIST, CurrentState, Fun} from '../../utils/data';
import DropDownMutipleValueComponent from '../../components/DropDownMutipleValueComponent';
import {useDispatch, useSelector} from 'react-redux';
import {partnerReferences, updateDetails} from '../../actions/homeActions';

import ReusableDropdown from '../../components/ReusableDropdown';
import {useNavigation} from '@react-navigation/native';
import style from './style';
import AgeRangeSlider from '../../components/ageRangeSlider';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import HeightRangeSlider from '../../components/heightRangeSlider';
import NewBottomSheetMultipleValueSelect from '../../components/newBottomSheetMultipleValueSelect';
import NewBottomSheetSingleValueSelect from '../../components/newBottomSheetSingleValueSelect';
import {colors} from '../../utils/colors';

const PartnerPreferencesScreen = () => {
  const [countryList, setCountryList] = useState([]);
  const [selectedAgeFrom, setSelectedAgeFrom] = useState('');
  const [selectedAgeTo, setSelectedAgeTo] = useState('');
  const [selectHeightFrom, setSelectHeightFrom] = useState('');
  const [selectedHeightTo, setSelectedHeightTo] = useState('');
  const [stateList, setStateList] = useState([]);
  const [partnerPreferCity, setPartnerPreferCity] = useState([]);
  // const [preferDiet, setPreferDiet] = useState('');
  const [preferIncome, setPreferIncome] = useState('');
  const [hobbies, setHobbies] = useState([]);

  const AgeFrom = ['22', '23', '24']; // Your options
  const AgeFromTo = ['32', '33', '34']; // Your options
  const HeightRangeFrom = ['4', '5.5', '6']; // Your options
  const HeightRangeTo = ['5.7', '6.1', '7']; // Your options
  const dropdownValues = ['vegetarian', 'non_vegetarian'];
  const dropdownPreferIncome = ['100000', '200000', '300000'];

  // NEW
  const [ageRange, setAgeRange] = useState([25, 35]); // Initial age range
  const [heightRange, setHeightRange] = useState([4, 8]); // Initial age range
  const [preferCountry, setPreferCountry] = useState([]);
  const [preferState, setPreferState] = useState([]);
  const [preferCity, setPreferCity] = useState([]);
  const [preferDiet, setPreferDiet] = useState([]);
  const [annualIncome, setAnnualIncome] = useState([7, 12]); // Initial age range
  const [preferHobbies, setPreferHobbies] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const apiDispatch = useDispatch();
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);

  // console.log(' === PartnerPreferencesScreen..... ===> ', user);

  const getSelectedCountryLabels = () => {
    return countryList
      .map(value => {
        const country = COUNTRY_LIST.find(item => item.value === value);
        return country ? country.label : null;
      })
      .filter(label => label); // Filter out any null values
  };

  const getSelectedStateLabels = () => {
    return stateList
      .map(value => {
        const state = CurrentState.find(item => item.value === value);
        return state ? state.label : null;
      })
      .filter(label => label); // Filter out any null values
  };

  const getSelectedPartnerCountryLabels = () => {
    return partnerPreferCity
      .map(value => {
        const country = COUNTRY_LIST.find(item => item.value === value);
        return country ? country.label : null;
      })
      .filter(label => label); // Filter out any null values
  };

  const getSelectedPartnerHobbiesLabels = () => {
    return hobbies
      .map(value => {
        const hobbies = Fun.find(item => item.value === value);
        return hobbies ? hobbies.label : null;
      })
      .filter(label => label); // Filter out any null values
  };

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

  const onDashboardPress = () => {
    console.log(' === Min Age ===> ', ageRange[0]);
    console.log(' === Max Age ===> ', ageRange[1]);
    console.log(' === Max Height ===> ', heightRange[0]);
    console.log(' === Max Height ===> ', heightRange[1]);
    console.log(' === preferCountry ===> ', preferCountry);
    console.log(' === preferState ===> ', preferState);
    console.log(' === preferCity ===> ', preferCity);
    console.log(' === preferDiet ===> ', preferDiet);
    console.log(' === annualIncome[0] ===> ', annualIncome[0]);
    console.log(' === annualIncome[1] ===> ', annualIncome[1]);
    setLoading(true);

    // const incomeValue = annualIncome[0]; // You can use annualIncome[0] (min), annualIncome[1] (max), or calculate the average

    const payload = {
      age: {min: ageRange[0], max: ageRange[1]},
      height: {min: heightRange[0], max: heightRange[1]},
      country: preferCountry.map(country => country.toLowerCase()), // Convert to lowercase
      state: preferState.map(state => state.toLowerCase()), // Convert to lowercase
      city: preferCity.map(city => city.toLowerCase()), // Convert to lowercase
      diet: Array.isArray(preferDiet)
        ? preferDiet.map(diet => diet.toLowerCase())
        : [preferDiet.toLowerCase()], // Ensure diet is an array
      income: {min: annualIncome[0], max: annualIncome[1]}, // Send a single numeric value for income
      hobbies: preferHobbies,
    };

    setLoading(true);
    // First API Call: partnerReferences
    dispatch(
      partnerReferences(payload, () => {
        // On success of partnerReferences, call updateDetails
        apiDispatch(
          updateDetails(
            {
              userPartnerPreCompleted: true, // Setting the userPartnerPreCompleted to true
            },
            () => {
              // On success of updateDetails, navigate to HomeTabs
              setLoading(false);
              navigation.navigate('HomeTabs');
            },
          ),
        );
      }),
    );
  };

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

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        {/*<AppColorLogo />*/}
        <Text style={style.headingText}>Add Partner Preference</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.bodyContainer}>
          <View style={{alignItems: 'center'}}>
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
              maxSelections={5}
            />
          </View>

          <View style={{marginTop: hp(30)}}>
            <NewBottomSheetMultipleValueSelect
              label="Select Prefer State"
              options={Prefer_State}
              onSelect={handleStateSelect} // Pass the onSelect handler to capture selected values
              bottomSheetHeight={hp(450)}
              maxSelections={5}
            />
          </View>

          <View style={{marginTop: hp(30)}}>
            <NewBottomSheetMultipleValueSelect
              label="Select Prefer City"
              options={Prefer_City}
              onSelect={handleCitySelect} // Pass the onSelect handler to capture selected values
              bottomSheetHeight={hp(450)}
              maxSelections={5}
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
              maxSelections={5}
            />
          </View>

          <View style={{height: hp(70)}} />
          {/*<Text style={style.headingSubText}>Select Age Range (From & To)</Text>*/}

          {/*<View style={style.ageContainer}>*/}
          {/*  <View style={style.ageContainerStyle}>*/}
          {/*    <DropdownHeightAndAgeComponent*/}
          {/*      options={AgeFrom}*/}
          {/*      placeholder="25"*/}
          {/*      selectedValue={selectedAgeFrom}*/}
          {/*      setSelectedValue={setSelectedAgeFrom}*/}
          {/*    />*/}
          {/*  </View>*/}
          {/*  <View style={style.ageContainerStyle}>*/}
          {/*    <DropdownHeightAndAgeComponent*/}
          {/*      options={AgeFromTo}*/}
          {/*      placeholder="25"*/}
          {/*      selectedValue={selectedAgeTo}*/}
          {/*      setSelectedValue={setSelectedAgeTo}*/}
          {/*    />*/}
          {/*  </View>*/}
          {/*</View>*/}

          {/*<Text style={style.headingSubTittleText}>*/}
          {/*  Select Height Range (CM)*/}
          {/*</Text>*/}

          {/*<View style={style.ageContainer}>*/}
          {/*  <View style={style.ageContainerStyle}>*/}
          {/*    <DropdownHeightAndAgeComponent*/}
          {/*      options={HeightRangeFrom}*/}
          {/*      placeholder="4"*/}
          {/*      selectedValue={selectHeightFrom}*/}
          {/*      setSelectedValue={setSelectHeightFrom}*/}
          {/*    />*/}
          {/*  </View>*/}
          {/*  <View style={style.ageContainerStyle}>*/}
          {/*    <DropdownHeightAndAgeComponent*/}
          {/*      options={HeightRangeTo}*/}
          {/*      placeholder="6"*/}
          {/*      selectedValue={selectedHeightTo}*/}
          {/*      setSelectedValue={setSelectedHeightTo}*/}
          {/*    />*/}
          {/*  </View>*/}
          {/*</View>*/}

          {/*<Text style={style.headingSubTittleText}>Select Prefer Country</Text>*/}

          {/*<DropDownMutipleValueComponent*/}
          {/*  data={COUNTRY_LIST}*/}
          {/*  height={50}*/}
          {/*  searchPlaceholder={'Search Country'}*/}
          {/*  placeholder={'Select'}*/}
          {/*  selectedItems={countryList}*/}
          {/*  setSelectedItems={setCountryList}*/}
          {/*/>*/}

          {/*<Text style={style.headingSubTittleText}>Select Prefer State</Text>*/}

          {/*<DropDownMutipleValueComponent*/}
          {/*  data={CurrentState}*/}
          {/*  height={50}*/}
          {/*  searchPlaceholder={'Search Country'}*/}
          {/*  placeholder={'Select'}*/}
          {/*  selectedItems={stateList}*/}
          {/*  setSelectedItems={setStateList}*/}
          {/*/>*/}

          {/*<Text style={style.headingSubTittleText}>Select Prefer City</Text>*/}

          {/*<DropDownMutipleValueComponent*/}
          {/*  data={COUNTRY_LIST}*/}
          {/*  height={50}*/}
          {/*  searchPlaceholder={'Search Country'}*/}
          {/*  placeholder={'Select'}*/}
          {/*  selectedItems={partnerPreferCity}*/}
          {/*  setSelectedItems={setPartnerPreferCity}*/}
          {/*/>*/}

          {/*<Text style={style.headingSubTittleText}>Prefer Diet</Text>*/}

          {/*<ReusableDropdown*/}
          {/*  dropdownValues={dropdownValues}*/}
          {/*  placeholder={'Select'}*/}
          {/*  selectedValue={preferDiet}*/}
          {/*  onValueChange={value => setPreferDiet(value)}*/}
          {/*/>*/}

          {/*<Text style={style.headingSubTittleText}>Prefer income</Text>*/}

          {/*<ReusableDropdown*/}
          {/*  dropdownValues={dropdownPreferIncome}*/}
          {/*  placeholder={'Select'}*/}
          {/*  selectedValue={preferIncome}*/}
          {/*  onValueChange={value => setPreferIncome(value)}*/}
          {/*/>*/}

          {/*<Text style={style.headingSubTittleText}>Select Hobbies</Text>*/}

          {/*  <DropDownMutipleValueComponent*/}
          {/*    data={Fun}*/}
          {/*    height={50}*/}
          {/*    searchPlaceholder={'Search Country'}*/}
          {/*    placeholder={'Select'}*/}
          {/*    selectedItems={hobbies}*/}
          {/*    setSelectedItems={setHobbies}*/}
          {/*  />*/}

          {/*  <View style={style.space} />*/}
        </View>
      </ScrollView>

      <View style={style.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={style.backButtonContainer}
          onPress={() => {
            navigation.goBack();
          }}>
          <Text style={style.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDashboardPress}
          style={style.dashboardButton}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.white} />
          ) : (
            <Text style={style.dashboardText}>Dashboard</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PartnerPreferencesScreen;
