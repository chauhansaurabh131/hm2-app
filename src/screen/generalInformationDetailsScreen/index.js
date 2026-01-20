import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, View} from 'react-native';
import {style} from './style';
import NewDropDownTextInput from '../../components/newDropdownTextinput';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import {hp, wp} from '../../utils/helpers';
import NewSelectValueComponent from '../../components/newSelectValueComponent';
import NewEnterSelectValueComponent from '../../components/newEnterSelectValueComponent';

const GeneralInformationDetailsScreen = ({
  genderSetSelectedOption,
  maritalSetSelectedOption,
  setSelectCaste,
  setSelectReligion,
  setUserHeight,
  setUserWeight,
  setSelectManglik,
  setSelectGothra,
  setSelectZodiac,
  setSelectLanguage,
}) => {
  const genderDropdownData = [
    'Male',
    'Female',
    'Non Binary',
    'Prefer Not To Say',
    'Other',
  ];

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
  const ManglikStatusDropdownData = [
    'Manglik',
    'Non Manglik',
    'Anshik Manglik',
    'Dont know',
  ];
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

  const [selectedGenderStatus, setSelectedGenderStatus] = useState('');
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState('');
  const [selectedReligionStatus, setSelectedReligionStatus] = useState('');
  const [selectedCasteStatus, setSelectedCasteStatus] = useState('');
  const [selectedHeightStatus, setSelectedHeightStatus] = useState('');
  const [selectedWeightStatus, setSelectedWeightStatus] = useState('');
  const [selectedManglikStatus, setSelectedManglikStatus] = useState('');
  const [selectedGothraStatus, setSelectedGothraStatus] = useState('');
  const [selectedZodiacStatus, setSelectedZodiacStatus] = useState('');
  const [selectedLanguageStatus, setSelectedLanguageStatus] = useState('');

  return (
    <SafeAreaView style={style.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <NewSelectValueComponent
          title="Gender"
          value={selectedGenderStatus}
          dropdownData={genderDropdownData}
          onValueChange={value => {
            setSelectedGenderStatus(value); // ✅ update UI
            genderSetSelectedOption?.(value); // ✅ optional: update parent
          }}
          bottomSheetHeight={hp(300)}
        />

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Marital Status"
            value={selectedMaritalStatus}
            dropdownData={['Single', 'Never-Married', 'Married', 'Divorcee']}
            onValueChange={value => {
              setSelectedMaritalStatus(value);
              maritalSetSelectedOption?.(value);
            }}
            bottomSheetHeight={hp(250)}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Religion"
            value={selectedReligionStatus}
            dropdownData={religionDropdownData}
            onValueChange={value => {
              setSelectedReligionStatus(value);
              setSelectReligion?.(value);
            }}
            bottomSheetHeight={hp(450)}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewEnterSelectValueComponent
            title="Caste"
            value={selectedCasteStatus}
            emptyText="Add"
            modalTitle="Caste"
            EnterModalPlaceholderTittle={'Add Caste'}
            onValueChange={value => {
              setSelectedCasteStatus(value);
              setSelectCaste?.(value);
            }}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewEnterSelectValueComponent
            title="Height"
            value={selectedHeightStatus}
            emptyText="Add"
            modalTitle="Height"
            modalEgTitle="(e.g 5.3ft)"
            keyboardTypes="decimal-pad"
            onValueChange={value => {
              setSelectedHeightStatus(value);
              setUserHeight?.(value);
            }}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
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
              setUserWeight?.(value);
            }}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Manglik Status"
            value={selectedManglikStatus}
            dropdownData={ManglikStatusDropdownData}
            onValueChange={value => {
              setSelectedManglikStatus(value);
              setSelectManglik?.(value);
            }}
            bottomSheetHeight={hp(260)}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Gothra"
            value={selectedGothraStatus}
            dropdownData={GothraStatusDropdownData}
            onValueChange={value => {
              setSelectedGothraStatus(value);
              setSelectGothra?.(value);
            }}
            bottomSheetHeight={hp(500)}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Zodiac"
            value={selectedZodiacStatus}
            dropdownData={ZodiacStatusDropdownData}
            onValueChange={value => {
              setSelectedZodiacStatus(value);
              setSelectZodiac?.(value);
            }}
            bottomSheetHeight={hp(500)}
          />
        </View>

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Mother Tongue"
            value={selectedLanguageStatus}
            dropdownData={languageDropdownData}
            onValueChange={value => {
              setSelectedLanguageStatus(value);
              setSelectLanguage?.(value);
            }}
            bottomSheetHeight={hp(500)}
          />
        </View>

        <View style={{marginHorizontal: wp(17), marginTop: hp(7)}}>
          <View>
            <View style={{height: hp(50)}} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GeneralInformationDetailsScreen;
