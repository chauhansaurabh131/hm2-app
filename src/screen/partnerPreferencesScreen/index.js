import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
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
import MultipleValueSelectTextInput from '../../components/mutipleValueSelectTextInput';
import Toast from 'react-native-toast-message';

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
  const [heightRange, setHeightRange] = useState([4, 6.5]); // Initial age range
  const [preferCountry, setPreferCountry] = useState([]);
  const [preferState, setPreferState] = useState([]);
  // const [preferCity, setPreferCity] = useState([]);
  const [preferDiet, setPreferDiet] = useState([]);
  const [annualIncome, setAnnualIncome] = useState([7, 12]); // Initial age range
  const [preferHobbies, setPreferHobbies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const dispatch = useDispatch();
  const apiDispatch = useDispatch();
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);

  // console.log(' === PartnerPreferencesScreen..... ===> ', user);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const Prefer_Country = ['India'];

  const Prefer_State = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya-Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
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

  const Prefer_Diet = [
    'Vegetarian',
    'Eggetarian',
    'Non Vegetarian',
    'Vegan',
    'Jain',
    'Occasionally Non Vegetarian',
    'Occasionally Vegetarian',
    'Satvik',
    'Other',
  ];

  const Prefer_hobbies = [
    'Writing',
    'Play Instrument',
    'Poetry',
    'Cooking',
    'Painting',
    'Gardening',
    'Singing',
    'Diy Crafts',
    'Blogging',
    'Photography',
    'Dancing',
    'Content Creation',
    'Movie',
    'Sports',
    'Biking',
    'Music',
    'Social Media',
    'Clubbing',
    'Travelling',
    'Gaming',
    'Shopping',
    'Reading',
    'Binge Watching',
    'Theater Events',
    'Running',
    'Cycling',
    'Yoga',
    'Walking',
    'Working_out',
    'Trekking',
    'Aerobics Zumba',
    'Swimming',
  ];

  const onDashboardPress = () => {
    if (!preferCountry.length) {
      // Alert.alert('Missing Field', 'Please select at least one country');
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please select a country.',
      });
      return;
    }

    if (!preferState.length) {
      // Alert.alert('Missing Field', 'Please select at least one state');
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please select at least one state.',
      });
      return;
    }

    if (!cities.length) {
      // Alert.alert('Missing Field', 'Please enter at least one city');
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter at least one city.',
      });
      return;
    }

    if (!preferDiet.length) {
      // Alert.alert('Missing Field', 'Please select a diet preference');
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please enter a diet preference.',
      });
      return;
    }

    if (!preferHobbies.length) {
      // Alert.alert('Missing Field', 'Please select at least one hobby');
      Toast.show({
        type: 'error',
        text1: 'Missing Field',
        text2: 'Please select at least one hobby.',
      });
      return;
    }

    const payload = {
      age: {min: ageRange[0], max: ageRange[1]},
      height: {min: heightRange[0], max: heightRange[1]},
      country: preferCountry.map(country => country.toLowerCase()), // Convert to lowercase
      state: preferState.map(state => state.toLowerCase().replace(/\s+/g, '-')),
      city: cities.map(city => city.toLowerCase().replace(/\s+/g, '-')),
      diet: Array.isArray(preferDiet)
        ? preferDiet.map(diet => diet.toLowerCase().replace(/\s+/g, '_'))
        : [preferDiet.toLowerCase().replace(/\s+/g, '_')], // convert single string to array
      income: {min: annualIncome[0], max: annualIncome[1]}, // Send a single numeric value for income
      hobbies: Array.isArray(preferHobbies)
        ? preferHobbies.map(hobby => hobby.toLowerCase().replace(/\s+/g, '_'))
        : [preferHobbies.toLowerCase().replace(/\s+/g, '_')],
    };

    console.log(' === var ===> ', payload);

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

  // const handleCitySelect = selectedValue => {
  //   setPreferCity(selectedValue);
  // };

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
              bottomSheetHeight={hp(100)}
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
            {/*<NewBottomSheetMultipleValueSelect*/}
            {/*  label="Select Prefer City"*/}
            {/*  options={Prefer_City}*/}
            {/*  onSelect={handleCitySelect} // Pass the onSelect handler to capture selected values*/}
            {/*  bottomSheetHeight={hp(450)}*/}
            {/*  maxSelections={5}*/}
            {/*/>*/}

            <MultipleValueSelectTextInput
              placeholder="Select Prefer City"
              maxItems={5}
              value={cities}
              onChange={setCities}
            />
          </View>

          <View style={{marginTop: hp(30)}}>
            {/*<NewBottomSheetSingleValueSelect*/}
            {/*  label="Prefer Diet"*/}
            {/*  options={Prefer_Diet}*/}
            {/*  onSelect={handleDietSelect} // Pass the onSelect handler to capture the selected value*/}
            {/*  bottomSheetHeight={hp(430)}*/}
            {/*/>*/}

            <NewBottomSheetMultipleValueSelect
              label="Prefer Diet"
              options={Prefer_Diet}
              onSelect={handleDietSelect} // Pass the onSelect handler to capture selected values
              bottomSheetHeight={hp(450)}
              maxSelections={3}
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
        </View>
      </ScrollView>

      {!isKeyboardVisible && (
        <View style={style.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.6}
            style={style.backButtonContainer}
            onPress={() => {
              navigation.goBack();
            }}>
            <Text style={style.backButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.6}
            onPress={onDashboardPress}
            style={style.dashboardButton}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.white} />
            ) : (
              <Text style={style.dashboardText}>Dashboard</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      {/*<Toast ref={ref => Toast.setRef(ref)} />*/}
    </SafeAreaView>
  );
};

export default PartnerPreferencesScreen;
