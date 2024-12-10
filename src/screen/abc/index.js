import React, {useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import NewBottomSheetSingleValueSelect from '../../components/newBottomSheetSingleValueSelect';
import {hp} from '../../utils/helpers';

const Abc = () => {
  const [preferCity, setPreferCity] = useState(null); // Store a single selected value

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

  const handleCitySelect = selectedValue => {
    setPreferCity(selectedValue);
  };

  const OnSubmitPress = () => {
    console.log(' === preferCity ===> ', preferCity);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Text>Select your preferred city:</Text>
      <View style={{marginHorizontal: 17}}>
        <NewBottomSheetSingleValueSelect
          options={Prefer_City}
          onSelect={handleCitySelect} // Pass the onSelect handler to capture the selected value
          bottomSheetHeight={hp(450)}
        />
      </View>

      <TouchableOpacity
        style={{marginTop: 50, alignItems: 'center'}}
        onPress={OnSubmitPress}>
        <Text>Submit</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Abc;
