import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {icons} from '../../../assets';
import {useNavigation, useRoute} from '@react-navigation/native';
import {updateDetails} from '../../../actions/homeActions';
import {useDispatch} from 'react-redux';
import DOBComponent from '../../../components/DOBComponent ';
import BirthOfTimeTextInput from '../../../components/BirthOfTimeTextInput';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';
import {ScrollView} from 'react-native-virtualized-view';

const ModifyBasicInfoScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const userData = route?.params?.UserData || {};

  // console.log(' === userData ===> ', userData?.motherTongue);

  const capitalize = text => {
    if (!text) {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // 🔥 FORMAT FOR UI
  const formatDOB = dateValue => {
    if (!dateValue) {
      return '';
    }

    if (typeof dateValue === 'string' && dateValue.includes('/')) {
      const [day, month, year] = dateValue.split('/');
      return `${day.padStart(2, '0')} . ${month.padStart(2, '0')} . ${year}`;
    }

    const date = new Date(dateValue);
    if (isNaN(date)) {
      return '';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day} . ${month} . ${year}`;
  };

  // 🔥 CONVERT TO ISO (API)
  const convertToISO = dateValue => {
    if (!dateValue) {
      return null;
    }

    if (dateValue.includes('T')) {
      return dateValue;
    }

    if (dateValue.includes('/')) {
      const [day, month, year] = dateValue.split('/');
      return new Date(`${year}-${month}-${day}`).toISOString();
    }

    return new Date(dateValue).toISOString();
  };

  // 🔥 CALCULATE AGE
  const calculateAge = dateValue => {
    if (!dateValue) {
      return 0;
    }

    let date;

    if (typeof dateValue === 'string' && dateValue.includes('/')) {
      const [day, month, year] = dateValue.split('/');
      date = new Date(`${year}-${month}-${day}`);
    } else {
      date = new Date(dateValue);
    }

    if (isNaN(date)) {
      return 0;
    }

    const diff = Date.now() - date.getTime();
    const ageDate = new Date(diff);

    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  // 🔥 STATES
  const [rawDOB, setRawDOB] = useState(userData?.dateOfBirth || '');
  const [dateOfBirth, setDateOfBirth] = useState(
    formatDOB(userData?.dateOfBirth),
  );

  // 🔥 HANDLE CHANGE
  const handleDOBChange = newDate => {
    setRawDOB(newDate);
    setDateOfBirth(formatDOB(newDate));
  };

  const formatTime = isoString => {
    if (!isoString) {
      return '';
    }

    const date = new Date(isoString);

    if (isNaN(date)) {
      return '';
    }

    return date
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hour12: true,
      })
      .toUpperCase();
  };

  // 🔥 अब useState में use करो
  const [birthTimeRaw, setBirthTimeRaw] = useState(userData?.birthTime || '');

  const [birthTime, setBirthTime] = useState(formatTime(userData?.birthTime));

  const handleTimeChange = newTime => {
    setBirthTimeRaw(newTime);
    setBirthTime(newTime); // ✅ no need format again
  };

  const convertTimeToISO = timeValue => {
    if (!timeValue) {
      return null;
    }

    // timeValue example: "10:15 AM"
    const date = new Date();

    const [time, modifier] = timeValue.split(' ');
    let [hours, minutes] = time.split(':');

    if (modifier === 'PM' && hours !== '12') {
      hours = parseInt(hours, 10) + 12;
    }

    if (modifier === 'AM' && hours === '12') {
      hours = '00';
    }

    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);

    return date.toISOString(); // ✅ ISO format
  };

  const [selectedReligionStatus, setSelectedReligionStatus] = useState(
    userData?.religion || '',
  );

  const religionDropdownData = [
    'Hindu',
    'Muslim',
    'Christian',
    'Sikh',
    'Buddhist',
    'Jain',
    'Islam',
    'Other',
  ];

  const [selectedCasteStatus, setSelectedCasteStatus] = useState(
    userData?.caste || '',
  );

  const [selectedHeightStatus, setSelectedHeightStatus] = useState(
    userData?.height || '',
  );

  const [selectedWeightStatus, setSelectedWeightStatus] = useState(
    userData?.weight || '',
  );

  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState(
    userData?.maritalStatus || '',
  );

  const formatManglikStatus = value => {
    if (!value) {
      return '';
    }

    return value
      .replace('-', ' ') // 🔥 remove hyphen
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const [selectedManglikStatus, setSelectedManglikStatus] = useState(
    formatManglikStatus(userData?.manglikStatus) || '',
  );

  const ManglikStatusDropdownData = [
    'Manglik',
    'Non Manglik',
    'Anshik Manglik',
    'Dont know',
  ];

  const [selectedGothraStatus, setSelectedGothraStatus] = useState(
    userData?.gothra || '',
  );

  const GothraStatusDropdownData = [
    'Bharadvaja',
    'Kashyapa',
    'Atri',
    'Vashistha',
    'Vishwamitra',
    'Gautama',
    'Jamadagni',
    'Agastya',
    'Bhrigu',
    'Kaushika',
    'Sandilya',
    'Parashara',
    'Mandavya',
    'Harita',
    'Kutsa',
    'Shrivatsa',
    'Mudgala',
    'Vatsa',
    'Maitreya',
    'Durvasa',
    'Chyavana',
    'Marichi',
    'Pulastya',
    'Pulaha',
    'Kratu',
    'Angirasa',
    'Vishnuvardhana',
    'Shunak',
    'Kapila',
    'Vyasa',
    'Rishyashringa',
    'Sankriti',
    'Saunaka',
    'Rohini',
    'Lomasha',
    'Devala',
    'Yajnavalkya',
    'Valmiki',
    'Valmiki',
    'Vamadeva',
    'Other',
  ];

  const [selectedZodiacStatus, setSelectedZodiacStatus] = useState(
    userData?.zodiac || '',
  );

  const ZodiacStatusDropdownData = [
    'Aries',
    'Taurus',
    'Gemini',
    'Cancer',
    'Leo',
    'Virgo',
    'Libra',
    'Scorpio',
    'Sagittarius',
    'Capricorn',
    'Aquarius',
    'Pisces',
  ];

  const [selectedLanguageStatus, setSelectedLanguageStatus] = useState(
    userData?.motherTongue || '',
  );

  const languageDropdownData = [
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

  const formatMaritalOption = option => {
    if (!option) {
      return '';
    } // handle empty string case
    return option
      .toLowerCase()
      .replace(/[- ](.)/g, (_, char) => char.toUpperCase());
  };

  const formatManglik = option => {
    if (!option) {
      return '';
    }
    return option.toLowerCase().replace(/\s+/g, '-'); // replace all spaces with -
  };

  // 🔥 SAVE API WITH 18+ VALIDATION
  const onSavePress = async () => {
    if (loading) {
      return;
    }

    const age = calculateAge(rawDOB);

    if (age < 18) {
      Alert.alert(
        'Age Restriction',
        'You must be at least 18 years old to continue.',
      );
      return;
    }

    try {
      setLoading(true);

      const finalDOB = convertToISO(rawDOB);
      const finalTime = convertTimeToISO(birthTime); // 🔥 important

      await apiDispatch(
        updateDetails({
          dateOfBirth: finalDOB,
          birthTime: finalTime, // ✅ correct
          religion: selectedReligionStatus.toLowerCase(),
          caste: selectedCasteStatus.toLowerCase(),
          height: selectedHeightStatus,
          weight: selectedWeightStatus,
          maritalStatus: formatMaritalOption(selectedMaritalStatus),
          manglikStatus: formatManglik(selectedManglikStatus),
          gothra: selectedGothraStatus,
          zodiac: selectedZodiacStatus,
          motherTongue: selectedLanguageStatus.toLowerCase(),
        }),
      );

      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.log('API Error:', error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* 🔥 HEADER */}
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

      {/* 🔥 DIVIDER */}
      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#EDEDED',
        }}
      />

      <ScrollView>
        {/* 🔥 DOB FIELD */}
        <View style={{marginTop: 20, paddingHorizontal: wp(17)}}>
          <DOBComponent
            label="What’s your Date of Birth?"
            value={dateOfBirth}
            onChangeText={handleDOBChange}
            imageSource={icons.drooDownLogo}
          />

          <View
            style={{
              width: '100%',
              height: hp(1),
              backgroundColor: '#E9E9E9',
              marginBottom: hp(10),
            }}
          />

          <BirthOfTimeTextInput
            label="What’s your Birth of Time?"
            value={birthTime}
            onChangeText={handleTimeChange}
          />

          <View
            style={{
              width: '100%',
              height: hp(1),
              backgroundColor: '#E9E9E9',
              marginBottom: hp(10),
            }}
          />

          <View style={{marginBottom: hp(15)}}>
            <NewSelectValueComponent
              title="Religion"
              value={capitalize(selectedReligionStatus)}
              dropdownData={religionDropdownData}
              onValueChange={value => {
                setSelectedReligionStatus(value);
              }}
              bottomSheetHeight={hp(450)}
            />
          </View>

          <View style={{marginBottom: hp(15)}}>
            <NewEnterSelectValueComponent
              title="Caste"
              value={capitalize(selectedCasteStatus)}
              emptyText="Add"
              modalTitle="Caste"
              EnterModalPlaceholderTittle={'Add Caste'}
              onValueChange={value => {
                setSelectedCasteStatus(value);
              }}
            />
          </View>

          <View style={{marginBottom: hp(15)}}>
            <NewEnterSelectValueComponent
              title="Height"
              value={selectedHeightStatus}
              emptyText="Add"
              modalTitle="Height"
              modalEgTitle="(e.g 5.3ft)"
              keyboardTypes="decimal-pad"
              onValueChange={value => {
                setSelectedHeightStatus(value);
              }}
            />
          </View>

          <View style={{marginBottom: hp(15)}}>
            <NewEnterSelectValueComponent
              title="Weight"
              value={selectedWeightStatus}
              emptyText="Add"
              modalTitle="Weight"
              modalEgTitle="(e.g 60 kg)"
              keyboardTypes="decimal-pad"
              EnterModalPlaceholderTittle={'Enter Weight'}
              onValueChange={value => {
                setSelectedWeightStatus(value);
              }}
            />
          </View>

          <View style={{marginBottom: hp(15)}}>
            <NewSelectValueComponent
              title="Marital Status"
              value={capitalize(selectedMaritalStatus)}
              dropdownData={['Single', 'Never-Married', 'Married', 'Divorcee']}
              onValueChange={value => {
                setSelectedMaritalStatus(value);
              }}
              bottomSheetHeight={hp(250)}
            />
          </View>

          <View style={{marginBottom: hp(15)}}>
            <NewSelectValueComponent
              title="Manglik Status"
              value={selectedManglikStatus}
              dropdownData={ManglikStatusDropdownData}
              onValueChange={value => {
                setSelectedManglikStatus(value);
              }}
              bottomSheetHeight={hp(260)}
            />
          </View>

          <View style={{marginBottom: hp(15)}}>
            <NewSelectValueComponent
              title="Gothra"
              value={selectedGothraStatus}
              dropdownData={GothraStatusDropdownData}
              onValueChange={value => {
                setSelectedGothraStatus(value);
              }}
              bottomSheetHeight={hp(500)}
            />
          </View>

          <View style={{marginBottom: hp(15)}}>
            <NewSelectValueComponent
              title="Zodiac"
              value={capitalize(selectedZodiacStatus)}
              dropdownData={ZodiacStatusDropdownData}
              onValueChange={value => {
                setSelectedZodiacStatus(value);
              }}
              bottomSheetHeight={hp(500)}
            />
          </View>

          <View style={{marginBottom: hp(5)}}>
            <NewSelectValueComponent
              title="Mother Tongue"
              value={capitalize(selectedLanguageStatus)}
              dropdownData={languageDropdownData}
              onValueChange={value => {
                setSelectedLanguageStatus(value);
              }}
              bottomSheetHeight={hp(500)}
            />
          </View>

          <ScrollView style={{height: hp(130)}} />
        </View>
      </ScrollView>

      {/* 🔥 SAVE BUTTON */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
          height: hp(100),
          // backgroundColor: 'white',
        }}>
        <TouchableOpacity
          onPress={onSavePress}
          activeOpacity={0.6}
          style={{
            width: '93%',
            height: hp(50),
            borderRadius: hp(25),
            backgroundColor: colors.pureBlack,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: hp(30),
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

export default ModifyBasicInfoScreen;
