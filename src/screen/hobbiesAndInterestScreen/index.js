import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {hp} from '../../utils/helpers';
import NewMultiSelectValueComponent from '../../components/newMultiSelectValueComponent';

const HobbiesAndInterestScreen = ({setSelectedItems, setSelectedLanguage}) => {
  // Define the options for the bottom sheet
  const options = [
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

  const language = ['Hindi', 'Gujarati', 'English'];

  // Handle selection changes
  const handleSelect = selectedValue => {
    setSelectedItems(selectedValue);
  };

  const languageSelect = selectedValue => {
    setSelectedLanguage(selectedValue);
  };

  const [multiHobbiesStatus, setMultiHobbiesStatus] = useState([]);
  const [multiLanguageStatus, setMultiLanguageStatus] = useState([]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <NewMultiSelectValueComponent
        title="Add Hobbies"
        value={multiHobbiesStatus} // 👈 ARRAY
        dropdownData={options}
        onValueChange={setMultiHobbiesStatus} // 👈 ARRAY SETTER
        bottomSheetHeight={hp(500)}
      />

      <View style={{marginTop: hp(40)}}>
        <NewMultiSelectValueComponent
          title="Add Language Known"
          value={multiLanguageStatus} // 👈 ARRAY
          dropdownData={language}
          onValueChange={setMultiLanguageStatus} // 👈 ARRAY SETTER
          bottomSheetHeight={hp(200)}
        />
      </View>
    </SafeAreaView>
  );
};

export default HobbiesAndInterestScreen;
