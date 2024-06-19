import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {images} from '../../assets';
import style from './style';
import * as Progress from 'react-native-progress';
import DropDownMutipleValueComponent from '../../components/DropDownMutipleValueComponent';
import {
  ANNUAL_SALARY,
  COUNTRY_LIST,
  CREATIVE,
  CurrentCity,
  CurrentState,
  Diet,
  DIeT,
  Fun,
} from '../../utils/data';
import CommonGradientButton from '../../components/commonGradientButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {partnerReferences} from '../../actions/homeActions';
import DropdownHeightAndAgeComponent from '../../components/DropdownHeightAndAgeComponent';

const PartnerPreferencesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const [countryList, setCountryList] = useState([]);
  const [chooseState, setChooseState] = useState([]);
  const [chooseCity, setChooseCity] = useState([]);
  const [Income, setIncome] = useState([]);
  const [Creative, setCreative] = useState([]);
  const [Funs, setFuns] = useState([]);
  const [diet, setDiet] = useState([]);
  const [ageFrom, setAgeFrom] = useState('');
  const [ageTo, setAgeTo] = useState('');
  const [heightFrom, setHeightFrom] = useState('');
  const [heightTo, setHeightTo] = useState('');

  const AGE_LIST = [
    {label: '22', value: '22'},
    {label: '23', value: '23'},
    {label: '24', value: '24'},
    {label: '25', value: '25'},
    {label: '26', value: '26'},
    {label: '27', value: '27'},
    {label: '28', value: '28'},
    {label: '29', value: '29'},
  ];

  const HEIGHT_LIST = [
    {label: '106', value: '106'},
    {label: '137', value: '137'},
    {label: '167', value: '167'},
    {label: '182', value: '182'},
    {label: '185', value: '185'},
  ];

  const handleContinue = () => {
    const selectedAgeFrom = AGE_LIST.find(
      item => item.value === ageFrom,
    )?.label;
    const selectedAgeTo = AGE_LIST.find(item => item.value === ageTo)?.label;
    const selectedHeightFrom = HEIGHT_LIST.find(
      item => item.value === heightFrom,
    )?.label;
    const selectedHeightTo = HEIGHT_LIST.find(
      item => item.value === heightTo,
    )?.label;

    const selectedCountries = countryList.map(
      item => COUNTRY_LIST.find(country => country.value === item)?.label,
    );

    const selectedState = chooseState.map(
      item => CurrentState.find(state => state.value === item)?.label,
    );

    const selectedCities = chooseCity.map(
      item => CurrentCity.find(city => city.value === item)?.label,
    );

    const selectedIncome = Income.map(
      item => ANNUAL_SALARY.find(income => income.value === item)?.label,
    ).join(', ');

    const selectedCreative = Creative.map(item =>
      CREATIVE.find(creative => creative.value === item)?.label.toLowerCase(),
    );

    const selectedFun = Funs.map(
      item => Fun.find(fun => fun.value === item)?.label,
    );

    const selectedDiet = diet.map(
      item => Diet.find(diet => diet.value === item)?.label,
    );

    const payload = {
      age: {min: selectedAgeFrom, max: selectedAgeTo},
      height: {min: selectedHeightFrom, max: selectedHeightTo},
      country: selectedCountries,
      state: selectedState,
      city: selectedCities,
      income: selectedIncome,
      creative: selectedCreative,
      fun: selectedFun,
      diet: selectedDiet,
    };

    // Debugging Logs
    console.log('Selected Age Range:', selectedAgeFrom, 'to', selectedAgeTo);
    console.log(
      'Selected Height Range:',
      selectedHeightFrom,
      'to',
      selectedHeightTo,
    );
    console.log('Selected Countries:', selectedCountries);
    console.log('Selected State:', selectedState);
    console.log('Selected Cities:', selectedCities);
    console.log('Selected Income:', selectedIncome);
    console.log('Selected Creative:', selectedCreative);
    console.log('Selected Fun:', selectedFun);
    console.log('Selected Diet:', selectedDiet);

    // Check for missing fields
    if (!selectedCountries.length) {
      console.error("Error: 'country' is required");
      return;
    }

    dispatch(
      partnerReferences(payload, () => {
        navigation.navigate('HomeTabs');
      }),
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        <Image
          source={images.happyMilanColorLogo}
          style={style.headerImageStyle}
        />

        <View style={style.headerTittleContainer}>
          <Text style={style.partnerPreferencesTextStyle}>
            Partner Preferences
          </Text>
          <TouchableOpacity activeOpacity={0.5}>
            <Text style={style.doItLaterTextStyle}>I’ll do it later</Text>
          </TouchableOpacity>
        </View>

        <Progress.Bar
          progress={0.85}
          width={Dimensions.get('window').width * 0.9}
          color={'#17C270'}
          borderWidth={0.5}
          borderColor={colors.gray}
          height={0.7}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={style.bodyContainer}>
            <View style={style.headerListBody}>
              <View>
                <Text style={style.chooseAgeText}>Choose Age</Text>

                <View style={style.chooseAgeContainer}>
                  <View style={style.chooseAgeSpace}>
                    <DropdownHeightAndAgeComponent
                      data={AGE_LIST}
                      placeholder="Select Age From"
                      selectedValue={ageFrom}
                      onValueChange={value => setAgeFrom(value)}
                    />
                  </View>

                  <Text style={style.toText}>to</Text>

                  <View>
                    <DropdownHeightAndAgeComponent
                      data={AGE_LIST}
                      placeholder="Select Age To"
                      selectedValue={ageTo}
                      onValueChange={value => setAgeTo(value)}
                    />
                  </View>
                </View>
              </View>

              <View>
                <Text style={style.chooseHeightText}>Choose Height</Text>

                <View style={style.chooseHeightContainer}>
                  <View style={style.chooseHeightSpace}>
                    <DropdownHeightAndAgeComponent
                      data={HEIGHT_LIST}
                      placeholder="Select Height From"
                      dropdownContainer={{width: 70}}
                      selectedValue={heightFrom}
                      onValueChange={value => setHeightFrom(value)}
                    />
                  </View>

                  <Text style={style.toText}>to</Text>
                  <View>
                    <DropdownHeightAndAgeComponent
                      data={HEIGHT_LIST}
                      placeholder="Select Height To"
                      dropdownContainer={{width: 70}}
                      selectedValue={heightTo}
                      onValueChange={value => setHeightTo(value)}
                    />
                  </View>
                </View>
              </View>
            </View>

            <Text style={style.bodyTittleTextStyle}>Choose Country</Text>

            <DropDownMutipleValueComponent
              data={COUNTRY_LIST}
              height={50}
              searchPlaceholder={'Search Country'}
              placeholder={'Choose Country'}
              selectedItems={countryList}
              setSelectedItems={setCountryList}
            />

            <Text style={style.bodyTittleTextStyle}>Choose State</Text>

            <DropDownMutipleValueComponent
              data={CurrentState}
              height={50}
              searchPlaceholder={'Search State'}
              placeholder={'Choose State'}
              selectedItems={chooseState}
              setSelectedItems={setChooseState}
            />

            <Text style={style.bodyTittleTextStyle}>Choose City</Text>

            <DropDownMutipleValueComponent
              data={CurrentCity}
              height={50}
              searchPlaceholder={'Search City'}
              placeholder={'Choose City'}
              selectedItems={chooseCity}
              setSelectedItems={setChooseCity}
            />

            <Text style={style.bodyTittleTextStyle}>Income</Text>

            <DropDownMutipleValueComponent
              data={ANNUAL_SALARY}
              height={50}
              searchPlaceholder={'Search Income'}
              placeholder={'Choose Income'}
              selectedItems={Income}
              setSelectedItems={setIncome}
            />

            <Text style={style.bodyTittleTextStyle}>Creative</Text>

            <DropDownMutipleValueComponent
              data={CREATIVE}
              height={50}
              searchPlaceholder={'Search Creative'}
              placeholder={'Choose Creative'}
              selectedItems={Creative}
              setSelectedItems={setCreative}
            />

            <Text style={style.bodyTittleTextStyle}>Fun</Text>

            <DropDownMutipleValueComponent
              data={Fun}
              height={50}
              searchPlaceholder={'Search Fun'}
              placeholder={'Choose Fun'}
              selectedItems={Funs}
              setSelectedItems={setFuns}
            />

            <Text style={style.bodyTittleTextStyle}>Diet</Text>

            <DropDownMutipleValueComponent
              data={Diet}
              height={50}
              searchPlaceholder={'Search Fun'}
              placeholder={'Choose Fun'}
              selectedItems={diet}
              setSelectedItems={setDiet}
            />
          </View>
          <View style={{height: 50}} />
        </ScrollView>

        <View style={style.bottomButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.goBack();
            }}
            style={style.backButtonContainer}>
            <Text style={style.backButtonText}>Back</Text>
          </TouchableOpacity>

          <CommonGradientButton
            onPress={handleContinue}
            buttonName={'Continue'}
            containerStyle={style.continueButtonContainer}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PartnerPreferencesScreen;
