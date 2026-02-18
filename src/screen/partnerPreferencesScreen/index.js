import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import {partnerReferences, updateDetails} from '../../actions/homeActions';
import {useNavigation} from '@react-navigation/native';
import style from './style';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import Toast from 'react-native-toast-message';
import NewSelectValueComponent from '../../components/newSelectValueComponent';
import NewMultiSelectValueComponent from '../../components/newMultiSelectValueComponent';
import NewEnterMultipleSelectValueComponent from '../../components/newEnterMultipleSelectValueComponent';

const PartnerPreferencesScreen = () => {
  // NEW
  const [ageRange, setAgeRange] = useState([25, 35]); // Initial age range
  const [heightRange, setHeightRange] = useState([4, 6.5]); // Initial age range
  const [preferCountry, setPreferCountry] = useState([]);
  const [preferState, setPreferState] = useState([]);
  const [preferDiet, setPreferDiet] = useState([]);
  const [annualIncome, setAnnualIncome] = useState([7, 12]); // Initial age range
  const [preferHobbies, setPreferHobbies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const [ageRanges, setAgeRanges] = useState(['Select']); // Initial age range
  const [heightRanges, setHeightRanges] = useState(['Select']); // Initial age range
  const [country, setCountry] = useState('');
  const [preferStates, setPreferStates] = useState([]);
  const [preferCity, setPreferCity] = useState([]);
  const [annualIncomes, setAnnualIncomes] = useState(['Select']); // Initial age range
  const [preferDiets, setPreferDiets] = useState([]);
  const [hobbies, setHobbies] = useState([]);

  const dispatch = useDispatch();
  const apiDispatch = useDispatch();
  const navigation = useNavigation();

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
    if (!isFormValid()) {
      Toast.show({
        type: 'error',
        text1: 'Please fill all fields',
      });
      return;
    }

    const getAgeRange = range => {
      if (!range || range === 'Select') {
        return {};
      }

      const [min, max] = range.split('-').map(v => v.trim());
      return {min, max};
    };

    const ageRange = getAgeRange(ageRanges);

    const getHeightRange = range => {
      if (!range || range === 'Select') {
        return {};
      }

      // Remove "ft" and extra spaces
      const clean = range.replace('ft', '').trim();

      const [min, max] = clean.split('-').map(v => v.trim());
      return {min, max};
    };

    const heightRange = getHeightRange(heightRanges);

    const getIncomeRange = income => {
      if (!income || income === 'Select') {
        return {};
      }

      // remove "LPA"
      const clean = income.replace('LPA', '').trim();

      const [min, max] = clean.split('-').map(v => v.trim());
      return {min, max};
    };

    const incomeRange = getIncomeRange(annualIncomes);

    const payload = {
      // age: {min: ageRange[0], max: ageRange[1]},
      // height: {min: heightRange[0], max: heightRange[1]},
      // country: preferCountry.map(country => country.toLowerCase()), // Convert to lowercase
      // state: preferState.map(state => state.toLowerCase().replace(/\s+/g, '-')),
      // city: cities.map(city => city.toLowerCase().replace(/\s+/g, '-')),
      // income: {min: annualIncome[0], max: annualIncome[1]},
      // diet: Array.isArray(preferDiet)
      //     ? preferDiet.map(diet => diet.toLowerCase().replace(/\s+/g, '_'))
      //     : [preferDiet.toLowerCase().replace(/\s+/g, '_')], // convert single string to array

      // hobbies: Array.isArray(preferHobbies)
      //     ? preferHobbies.map(hobby => hobby.toLowerCase().replace(/\s+/g, '_'))
      //     : [preferHobbies.toLowerCase().replace(/\s+/g, '_')],

      age: ageRange,
      height: heightRange,
      // country: country.toLowerCase(),
      country: country.map(c => c.toLowerCase()),
      state: preferStates.map(state =>
        state.toLowerCase().replace(/\s+/g, '-'),
      ),
      city: preferCity.map(city => city.toLowerCase().replace(/\s+/g, '-')),
      income: incomeRange,
      diet: Array.isArray(preferDiets)
        ? preferDiets.map(diet => diet.toLowerCase().replace(/\s+/g, '_'))
        : [preferDiets.toLowerCase().replace(/\s+/g, '_')], // convert single string to array

      hobbies: Array.isArray(hobbies)
        ? hobbies.map(hobby => hobby.toLowerCase().replace(/\s+/g, '_'))
        : [hobbies.toLowerCase().replace(/\s+/g, '_')],
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

  const isFormValid = () => {
    return (
      ageRanges !== 'Select' &&
      heightRanges !== 'Select' &&
      annualIncomes !== 'Select' &&
      country.length > 0 &&
      preferStates.length > 0 &&
      preferCity.length > 0 &&
      preferDiets.length > 0 &&
      hobbies.length > 0
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        {/*<AppColorLogo />*/}
        <Text style={style.headingText}>Add Your Preferences</Text>
      </View>

      <View
        style={{
          width: '100%',
          height: 4,
          backgroundColor: '#F9F7FF',
          marginBottom: hp(5),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <NewSelectValueComponent
          title="Select Age Range"
          value={ageRanges}
          dropdownData={[
            '18 - 25',
            '26 - 35',
            '36 - 45',
            '46 - 52',
            '53 - 60',
            '60 - 70',
          ]}
          onValueChange={setAgeRanges}
          bottomSheetHeight={hp(380)}
          showDivider={false}
        />

        <View style={{marginTop: hp(5)}}>
          <NewSelectValueComponent
            title="Select Height Range"
            value={heightRanges}
            dropdownData={[
              '3 - 4 ft',
              '4 - 5 ft',
              '6 - 7 ft',
              '7 - 8 ft',
              '9 - 10 ft',
            ]}
            onValueChange={setHeightRanges}
            bottomSheetHeight={hp(310)}
            showDivider={false}
          />
        </View>

        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#E9E9E9',
            marginTop: hp(20),
          }}
        />

        <Text
          style={{
            marginHorizontal: 17,
            marginTop: hp(26),
            color: '#7148E4',
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
          }}>
          Select Preferred Location
        </Text>

        <NewSelectValueComponent
          title="Country"
          value={country}
          dropdownData={Prefer_Country}
          // onValueChange={setCountry}
          onValueChange={val => setCountry([val])}
          bottomSheetHeight={hp(120)}
          showDivider={false}
        />

        <NewMultiSelectValueComponent
          title="State"
          value={preferStates} // 👈 ARRAY
          dropdownData={Prefer_State}
          onValueChange={setPreferStates} // 👈 ARRAY SETTER
          bottomSheetHeight={hp(500)}
          showDivider={false}
          showSearch={true}
          selectedContainerStyle={{top: -10}}
          maxSelection={5}
        />

        <NewEnterMultipleSelectValueComponent
          title="City"
          value={preferCity}
          onValueChange={setPreferCity}
          modalTitle="City"
          EnterModalPlaceholderTittle="Enter City"
          showDivider={false}
          valuesBelowContainerStyle={{top: -12}}
        />

        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#E9E9E9',
            marginTop: hp(20),
          }}
        />

        <View style={{marginTop: hp(20)}}>
          <NewSelectValueComponent
            title="Select Annual Income"
            value={annualIncomes}
            dropdownData={[
              '1 - 5 LPA',
              '6 - 10 LPA',
              '11 - 15 LPA',
              '16 - 20 LPA',
              '21 - 25 LPA',
              '26 - 30 LPA',
              '31 - 35 LPA',
              '36 - 40 LPA',
              '41 - 50 LPA',
            ]}
            onValueChange={setAnnualIncomes}
            bottomSheetHeight={hp(520)}
            showDivider={false}
          />
        </View>

        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#E9E9E9',
            marginTop: hp(20),
          }}
        />

        <View style={{marginTop: hp(20)}}>
          <NewMultiSelectValueComponent
            title="Prefer Diet"
            value={preferDiets} // 👈 ARRAY
            dropdownData={Prefer_Diet}
            onValueChange={setPreferDiets} // 👈 ARRAY SETTER
            bottomSheetHeight={hp(520)}
            showDivider={false}
            selectedContainerStyle={{top: -10}}
            maxSelection={3}
          />
        </View>

        <View
          style={{
            width: '100%',
            height: 1,
            backgroundColor: '#E9E9E9',
            marginTop: hp(20),
          }}
        />

        <View style={{marginTop: hp(20)}}>
          <NewMultiSelectValueComponent
            title="Prefer Hobbies"
            value={hobbies}
            dropdownData={Prefer_hobbies}
            onValueChange={setHobbies}
            bottomSheetHeight={hp(520)}
            showDivider={false}
            selectedContainerStyle={{top: -10}}
            maxSelection={5}
          />
        </View>

        <View style={style.bodyContainer}>
          <View style={{marginTop: hp(30)}} />

          <View style={{height: hp(10)}} />
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
            disabled={!isFormValid()}
            style={[
              style.dashboardButton,
              {opacity: isFormValid() ? 1 : 0.5}, // fade when disabled
            ]}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.white} />
            ) : (
              <Text style={style.dashboardText}>Dashboard</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default PartnerPreferencesScreen;
