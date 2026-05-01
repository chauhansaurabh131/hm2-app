import React, {useState, useEffect} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {icons} from '../../../assets';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';
import NewMultiSelectValueComponent from '../../../components/newMultiSelectValueComponent';
import NewEnterMultipleSelectValueComponent from '../../../components/newEnterMultipleSelectValueComponent';
import {partnerReferences} from '../../../actions/homeActions';

const ModifyPartnerPreferenceScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  // ✅ STATES
  const [ageRanges, setAgeRanges] = useState('');
  const [heightRanges, setHeightRanges] = useState('');
  const [preferStates, setPreferStates] = useState([]);
  const [preferCity, setPreferCity] = useState([]);
  const [preferDiets, setPreferDiets] = useState([]);
  const [hobbies, setHobbies] = useState([]);

  // 🔥 OPTIONS
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
    'Madhya Pradesh',
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
    'Working Out',
    'Trekking',
    'Aerobics Zumba',
    'Swimming',
  ];

  // 🔥 FORMAT FUNCTIONS
  const formatStateForUI = item =>
    item.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const formatStateForAPI = item => item.toLowerCase().replace(/\s+/g, '-');

  const formatCityForUI = item => item.charAt(0).toUpperCase() + item.slice(1);

  const formatDietForUI = item =>
    item.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const formatDietForAPI = item => item.toLowerCase().replace(/\s+/g, '_');

  const formatHobbyForUI = item =>
    item.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const formatHobbyForAPI = item => item.toLowerCase().replace(/\s+/g, '_');

  // 🔥 PREFILL
  useEffect(() => {
    const data = route?.params?.UserData;
    if (!data) {
      return;
    }

    if (data?.userPartner?.age) {
      const {min, max} = data.userPartner.age;
      if (min && max) {
        setAgeRanges(`${min} - ${max}`);
      }
    }

    if (data?.userPartner?.height) {
      const {min, max} = data.userPartner.height;
      if (min && max) {
        setHeightRanges(`${min} - ${max} ft`);
      }
    }

    if (data?.userPartner?.state?.length > 0) {
      setPreferStates(data.userPartner.state.map(formatStateForUI));
    }

    if (data?.userPartner?.city?.length > 0) {
      setPreferCity(data.userPartner.city.map(formatCityForUI));
    }

    if (data?.userPartner?.diet?.length > 0) {
      setPreferDiets(data.userPartner.diet.map(formatDietForUI));
    }

    if (data?.userPartner?.hobbies?.length > 0) {
      setHobbies(data.userPartner.hobbies.map(formatHobbyForUI));
    }
  }, [route?.params?.UserData]);

  // 🔥 RANGE FORMAT
  const getAgeRange = range => {
    if (!range) {
      return {};
    }
    const [min, max] = range.split('-').map(v => v.trim());
    return {min: Number(min), max: Number(max)};
  };

  const getHeightRange = range => {
    if (!range) {
      return {};
    }
    const clean = range.replace('ft', '').trim();
    const [min, max] = clean.split('-').map(v => v.trim());
    return {min: Number(min), max: Number(max)};
  };

  // ✅ VALIDATION
  const isFormValid =
    ageRanges &&
    heightRanges &&
    preferStates.length > 0 &&
    preferCity.length > 0 &&
    preferDiets.length > 0 &&
    hobbies.length > 0;

  // 🔥 SAVE
  const onSavePress = async () => {
    if (!isFormValid) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        age: getAgeRange(ageRanges),
        height: getHeightRange(heightRanges),
        state: preferStates.map(formatStateForAPI),
        city: preferCity.map(item => item.toLowerCase()),
        diet: preferDiets.map(formatDietForAPI),
        hobbies: hobbies.map(formatHobbyForAPI),
      };

      console.log('FINAL PAYLOAD:', payload);

      await apiDispatch(partnerReferences(payload));

      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.log('API Error:', error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* HEADER */}
      <View
        style={{
          height: hp(54),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: 0,
            width: wp(50),
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{width: hp(14), height: hp(14)}}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins600,
          }}>
          Modify Partner Preferences
        </Text>
      </View>

      <View
        style={{width: '100%', height: hp(1), backgroundColor: '#EDEDED'}}
      />

      <View style={{marginTop: hp(20), paddingHorizontal: wp(17)}}>
        {/* AGE */}
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
          bottomSheetHeight={hp(330)}
          showDivider={false}
        />

        {/* HEIGHT */}
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
      </View>

      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#E9E9E9',
          marginTop: hp(15),
        }}
      />

      <View style={{marginTop: hp(20), paddingHorizontal: wp(17)}}>
        {/* STATE */}
        <NewMultiSelectValueComponent
          title="State"
          value={preferStates}
          dropdownData={Prefer_State}
          onValueChange={setPreferStates}
          bottomSheetHeight={hp(500)}
          showDivider={false}
          showSearch={true}
          selectedContainerStyle={{top: -10}}
          maxSelection={5}
        />

        <View style={{marginTop: hp(10)}}>
          {/* CITY */}
          <NewEnterMultipleSelectValueComponent
            title="City"
            value={preferCity}
            onValueChange={setPreferCity}
            modalTitle="City"
            EnterModalPlaceholderTittle="Enter City"
            showDivider={false}
            valuesBelowContainerStyle={{top: -12}}
          />
        </View>
      </View>

      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#E9E9E9',
          marginTop: hp(15),
        }}
      />

      <View style={{paddingHorizontal: wp(17)}}>
        {/* DIET */}
        <View style={{marginTop: hp(20)}}>
          <NewMultiSelectValueComponent
            title="Prefer Diet"
            value={preferDiets}
            dropdownData={Prefer_Diet}
            onValueChange={setPreferDiets}
            bottomSheetHeight={hp(520)}
            showDivider={false}
            selectedContainerStyle={{top: -5}}
            maxSelection={3}
          />
        </View>

        <View style={{marginTop: hp(25)}}>
          {/* HOBBIES */}
          <NewMultiSelectValueComponent
            title="Prefer Hobbies"
            value={hobbies}
            dropdownData={Prefer_hobbies}
            onValueChange={setHobbies}
            bottomSheetHeight={hp(520)}
            showDivider={false}
            selectedContainerStyle={{top: -5}}
            maxSelection={5}
          />
        </View>
      </View>

      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#E9E9E9',
          marginTop: hp(15),
        }}
      />

      {/* SAVE BUTTON */}
      <View
        style={{
          position: 'absolute',
          bottom: 30,
          width: '100%',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={onSavePress}
          disabled={!isFormValid}
          activeOpacity={0.7}
          style={{
            width: '93%',
            height: hp(50),
            borderRadius: hp(25),
            backgroundColor: colors.pureBlack,
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isFormValid ? 1 : 0.5,
          }}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: 'white',
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
              }}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ModifyPartnerPreferenceScreen;
