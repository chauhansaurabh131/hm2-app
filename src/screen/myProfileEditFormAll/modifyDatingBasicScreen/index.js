import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {icons} from '../../../assets';
import DOBComponent from '../../../components/DOBComponent ';
import {addressDetails, updateDetails} from '../../../actions/homeActions';
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';

const ModifyDatingBasicScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const userData = route?.params?.UserData || {};

  const formatDate = date => {
    if (!date) {
      return '';
    }

    // Handle DD/MM/YYYY
    if (typeof date === 'string' && date.includes('/')) {
      const [day, month, year] = date.split('/');

      return `${day.padStart(2, '0')}. ${month.padStart(2, '0')}. ${year}`;
    }

    // Handle ISO date
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}. ${month}. ${year}`;
  };

  const formatLocation = location => {
    if (!location) {
      return '';
    }

    return location
      .split(',')
      .slice(0, 2) // Only City, State
      .map(
        item =>
          item.trim().charAt(0).toUpperCase() +
          item.trim().slice(1).toLowerCase(),
      )
      .join(', ');
  };

  const [dateOfBirth, setDateOfBirth] = useState(
    formatDate(userData?.dateOfBirth),
  );

  const [selectedCountryStatus, setSelectedCountryStatus] = useState(
    userData?.datingData?.[0]?.CurrentlyLiving || '',
  );

  const [selectedReligionStatus, setSelectedReligionStatus] = useState(
    userData?.religion || '',
  );

  const [selectedEthnicityStatus, setSelectedEthnicityStatus] = useState(
    userData?.datingData[0]?.Ethnicity || '',
  );

  const [multiLanguageStatus, setMultiLanguageStatus] = useState(
    userData?.motherTongue || '',
  );

  const currentCountryDropDown = ['India'];
  const ReligionData = [
    'Hindu',
    'Muslim',
    'Christian',
    'Sikh',
    'Buddhist',
    'Jain',
    'Islam',
    'Other',
  ];
  const EthnicityData = [
    'Punjabi',
    'Tamil',
    'Gujarati',
    'Bengali',
    'Marathi',
    'Arab',
    'Chinese',
    'Hispanic',
    'Other',
  ];

  const Language = [
    'Assamese',
    'Bengali',
    'Bodo',
    'Dogri',
    'English',
    'Gujarati',
    'Hindi',
    'Kannada',
    'Kashmiri',
    'Konkini',
    'Nepali',
    'Manipuri',
    'Marathi',
    'Odia',
    'Punjabi',
    'Sanskrit',
    'Santali',
    'Sindhi',
    'Tamil',
    'Telugu',
    'Urdu',
  ];

  const [loading, setLoading] = useState(false);

  // 🔥 CALCULATE AGE
  const calculateAge = dateValue => {
    if (!dateValue) {
      return 0;
    }

    let date;

    // DD/MM/YYYY
    if (typeof dateValue === 'string' && dateValue.includes('/')) {
      const [day, month, year] = dateValue.split('/');
      date = new Date(`${year}-${month}-${day}`);
    }

    // DD. MM. YYYY
    else if (typeof dateValue === 'string' && dateValue.includes('.')) {
      const [day, month, year] = dateValue.split('.').map(item => item.trim());

      date = new Date(`${year}-${month}-${day}`);
    }

    // ISO Date
    else {
      date = new Date(dateValue);
    }

    if (isNaN(date.getTime())) {
      return 0;
    }

    const today = new Date();

    let age = today.getFullYear() - date.getFullYear();

    const monthDiff = today.getMonth() - date.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < date.getDate())
    ) {
      age--;
    }

    return age;
  };

  // 🔥 CONVERT TO ISO (API)
  const convertToISO = dateValue => {
    if (!dateValue) {
      return null;
    }

    if (dateValue.includes('T')) {
      return dateValue;
    }

    // DD/MM/YYYY
    if (dateValue.includes('/')) {
      const [day, month, year] = dateValue.split('/');
      return new Date(`${year}-${month}-${day}`).toISOString();
    }

    // DD. MM. YYYY
    if (dateValue.includes('.')) {
      const [day, month, year] = dateValue.split('.').map(item => item.trim());

      return new Date(`${year}-${month}-${day}`).toISOString();
    }

    return new Date(dateValue).toISOString();
  };

  const capitalize = text => {
    if (!text) {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const onSavePress = () => {
    if (loading) {
      return;
    }

    const age = calculateAge(dateOfBirth);

    if (age < 18) {
      Alert.alert(
        'Age Restriction',
        'You must be at least 18 years old to continue.',
      );
      return;
    }

    setLoading(true);

    const finalDOB = convertToISO(dateOfBirth);

    const updatedDatingData = {
      ...userData?.datingData[0],
      CurrentlyLiving: selectedCountryStatus.toLowerCase(),
      Ethnicity: selectedEthnicityStatus,
    };

    const payload = {
      dateOfBirth: finalDOB,
      religion: selectedReligionStatus.toLowerCase(),
      motherTongue: multiLanguageStatus.toLowerCase(),
      datingData: [updatedDatingData],
    };

    apiDispatch(
      updateDetails(
        payload,
        response => {
          setLoading(false);
          navigation.goBack();
        },
        error => {
          setLoading(false);

          Alert.alert('Error', error?.message || 'Something went wrong');
        },
      ),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* Header */}
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
            style={{
              width: hp(14),
              height: hp(14),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins600,
          }}>
          Modify Basic Info
        </Text>
      </View>

      {/* Divider */}
      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#EDEDED',
        }}
      />

      {/* DOB Field */}
      <View
        style={{
          marginTop: hp(20),
          marginHorizontal: wp(17),
        }}>
        <DOBComponent
          label="Date of Birth"
          value={dateOfBirth}
          onChangeText={value => {
            console.log('RAW DATE ===>', value);

            setDateOfBirth(formatDate(value));
          }}
          imageSource={icons.drooDownLogo}
        />

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginBottom: hp(15),
          }}
        />

        <NewSelectValueComponent
          title="Currently Living"
          value={selectedCountryStatus}
          dropdownData={currentCountryDropDown}
          onValueChange={value => {
            setSelectedCountryStatus(value); // ✅ update UI
          }}
          bottomSheetHeight={hp(450)}
          showSearch={true}
          useGoogleSearch={true}
        />

        <View style={{marginTop: hp(15), marginBottom: hp(20)}}>
          <NewSelectValueComponent
            title="Religion"
            value={capitalize(selectedReligionStatus)}
            dropdownData={ReligionData}
            onValueChange={value => {
              setSelectedReligionStatus(value);
            }}
            bottomSheetHeight={hp(450)}
          />
        </View>

        <NewSelectValueComponent
          title="Ethnicity"
          value={capitalize(selectedEthnicityStatus)}
          dropdownData={EthnicityData}
          onValueChange={value => {
            setSelectedEthnicityStatus(value);
          }}
          bottomSheetHeight={hp(450)}
        />

        <View style={{marginTop: hp(15)}}>
          <NewSelectValueComponent
            title="Language Spoken"
            value={capitalize(multiLanguageStatus)}
            dropdownData={Language}
            onValueChange={value => {
              setMultiLanguageStatus(value);
            }}
            bottomSheetHeight={hp(450)}
          />
        </View>
      </View>

      {/* Save Button */}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: hp(30),
        }}>
        <TouchableOpacity
          onPress={onSavePress}
          activeOpacity={0.6}
          disabled={loading}
          style={{
            height: hp(44),
            backgroundColor: colors.pureBlack,
            borderRadius: hp(30),
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: wp(17),
          }}>
          {loading ? (
            <ActivityIndicator color="#FFF" size="large" />
          ) : (
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
              }}>
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ModifyDatingBasicScreen;
