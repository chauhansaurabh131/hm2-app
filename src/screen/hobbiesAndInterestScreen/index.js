import React, {useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import NewBottomSheetMultipleValueSelect from '../../components/newBottomSheetMultipleValueSelect';
import {hp} from '../../utils/helpers';

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
    'Working_out',
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{marginHorizontal: 17, marginTop: hp(7)}}>
        {/* Use the NewBottomSheetMultipleValueSelect component */}
        <NewBottomSheetMultipleValueSelect
          label="Select Hobbies"
          options={options}
          onSelect={handleSelect} // Pass the onSelect handler to capture selected values
          bottomSheetHeight={hp(400)}
        />

        <View style={{marginTop: hp(20)}}>
          <NewBottomSheetMultipleValueSelect
            label="Language Known"
            options={language}
            onSelect={languageSelect} // Pass the onSelect handler to capture selected values
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HobbiesAndInterestScreen;

// HobbiesAndInterestScreen
