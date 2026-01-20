import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';

import {colors} from '../../utils/colors';
import NewSelectValueComponent from '../../components/newSelectValueComponent';

const DemoCode = () => {
  const [currentLocation, setCurrentLocation] = useState('');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: 17, marginTop: 15}}>
        <NewSelectValueComponent
          title="Currently Living"
          value={currentLocation}
          onValueChange={setCurrentLocation}
          bottomSheetHeight={500}
          showSearch={true}
          useGoogleSearch={true} // ✅ GOOGLE API ENABLED
        />
      </View>
    </SafeAreaView>
  );
};

export default DemoCode;
