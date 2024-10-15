import React, {useState} from 'react';
import {
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

const PartnerPreferencesScreen = () => {
  const [countryList, setCountryList] = useState([]);
  const [selectedAgeFrom, setSelectedAgeFrom] = useState('');
  const [selectedAgeTo, setSelectedAgeTo] = useState('');
  const [selectHeightFrom, setSelectHeightFrom] = useState('');
  const [selectedHeightTo, setSelectedHeightTo] = useState('');
  const [stateList, setStateList] = useState([]);
  const [partnerPreferCity, setPartnerPreferCity] = useState([]);
  const [preferDiet, setPreferDiet] = useState('');
  const [preferIncome, setPreferIncome] = useState('');
  const [hobbies, setHobbies] = useState([]);

  const AgeFrom = ['22', '23', '24']; // Your options
  const AgeFromTo = ['32', '33', '34']; // Your options
  const HeightRangeFrom = ['4', '5.5', '6']; // Your options
  const HeightRangeTo = ['5.7', '6.1', '7']; // Your options
  const dropdownValues = ['vegetarian', 'non_vegetarian'];
  const dropdownPreferIncome = ['100000', '200000', '300000'];

  const dispatch = useDispatch();
  const apiDispatch = useDispatch();
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);

  console.log(' === PartnerPreferencesScreen..... ===> ', user);

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

  // const onDashboardPress = () => {
  //   const payload = {
  //     age: {min: selectedAgeFrom, max: selectedAgeTo},
  //     height: {min: selectHeightFrom, max: selectedHeightTo},
  //     country: getSelectedCountryLabels(),
  //     state: getSelectedStateLabels(),
  //     city: getSelectedPartnerCountryLabels(),
  //     income: preferIncome,
  //     fun: getSelectedPartnerHobbiesLabels(),
  //     diet: [preferDiet],
  //   };
  //
  //   dispatch(
  //     partnerReferences(payload, () => {
  //       navigation.navigate('HomeTabs');
  //       // userPartnerPreCompleted();
  //     }),
  //   );
  //
  //   // apiDispatch(
  //   //   updateDetails(
  //   //     {
  //   //       userPartnerPreCompleted: true,
  //   //       // userProfileCompleted: true,
  //   //     },
  //   //     // () => navigation.navigate('PartnerPreferencesScreen'),
  //   //     () => navigation.navigate('HomeTabs'),
  //   //   ),
  //   // );
  // };

  const onDashboardPress = () => {
    const payload = {
      age: {min: selectedAgeFrom, max: selectedAgeTo},
      height: {min: selectHeightFrom, max: selectedHeightTo},
      country: getSelectedCountryLabels(),
      state: getSelectedStateLabels(),
      city: getSelectedPartnerCountryLabels(),
      income: preferIncome,
      fun: getSelectedPartnerHobbiesLabels(),
      diet: [preferDiet],
    };

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
              navigation.navigate('HomeTabs');
            },
          ),
        );
      }),
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <AppColorLogo />
        <Text style={style.headingText}>Add Partner Preference</Text>
      </View>

      <ScrollView>
        <View style={style.bodyContainer}>
          <Text style={style.headingSubText}>Select Age Range (From & To)</Text>

          <View style={style.ageContainer}>
            <View style={style.ageContainerStyle}>
              <DropdownHeightAndAgeComponent
                options={AgeFrom}
                placeholder="25"
                selectedValue={selectedAgeFrom}
                setSelectedValue={setSelectedAgeFrom}
              />
            </View>
            <View style={style.ageContainerStyle}>
              <DropdownHeightAndAgeComponent
                options={AgeFromTo}
                placeholder="25"
                selectedValue={selectedAgeTo}
                setSelectedValue={setSelectedAgeTo}
              />
            </View>
          </View>

          <Text style={style.headingSubTittleText}>
            Select Height Range (CM)
          </Text>

          <View style={style.ageContainer}>
            <View style={style.ageContainerStyle}>
              <DropdownHeightAndAgeComponent
                options={HeightRangeFrom}
                placeholder="4"
                selectedValue={selectHeightFrom}
                setSelectedValue={setSelectHeightFrom}
              />
            </View>
            <View style={style.ageContainerStyle}>
              <DropdownHeightAndAgeComponent
                options={HeightRangeTo}
                placeholder="6"
                selectedValue={selectedHeightTo}
                setSelectedValue={setSelectedHeightTo}
              />
            </View>
          </View>

          <Text style={style.headingSubTittleText}>Select Prefer Country</Text>

          <DropDownMutipleValueComponent
            data={COUNTRY_LIST}
            height={50}
            searchPlaceholder={'Search Country'}
            placeholder={'Select'}
            selectedItems={countryList}
            setSelectedItems={setCountryList}
          />

          <Text style={style.headingSubTittleText}>Select Prefer State</Text>

          <DropDownMutipleValueComponent
            data={CurrentState}
            height={50}
            searchPlaceholder={'Search Country'}
            placeholder={'Select'}
            selectedItems={stateList}
            setSelectedItems={setStateList}
          />

          <Text style={style.headingSubTittleText}>Select Prefer City</Text>

          <DropDownMutipleValueComponent
            data={COUNTRY_LIST}
            height={50}
            searchPlaceholder={'Search Country'}
            placeholder={'Select'}
            selectedItems={partnerPreferCity}
            setSelectedItems={setPartnerPreferCity}
          />

          <Text style={style.headingSubTittleText}>Prefer Diet</Text>

          <ReusableDropdown
            dropdownValues={dropdownValues}
            placeholder={'Select'}
            selectedValue={preferDiet}
            onValueChange={value => setPreferDiet(value)}
          />

          <Text style={style.headingSubTittleText}>Prefer income</Text>

          <ReusableDropdown
            dropdownValues={dropdownPreferIncome}
            placeholder={'Select'}
            selectedValue={preferIncome}
            onValueChange={value => setPreferIncome(value)}
          />

          <Text style={style.headingSubTittleText}>Select Hobbies</Text>

          <DropDownMutipleValueComponent
            data={Fun}
            height={50}
            searchPlaceholder={'Search Country'}
            placeholder={'Select'}
            selectedItems={hobbies}
            setSelectedItems={setHobbies}
          />

          <View style={style.space} />
        </View>
      </ScrollView>

      <View style={style.buttonContainer}>
        <TouchableOpacity activeOpacity={0.7} style={style.backButtonContainer}>
          <Text style={style.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onDashboardPress}
          style={style.dashboardButton}>
          <Text style={style.dashboardText}>Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default PartnerPreferencesScreen;
