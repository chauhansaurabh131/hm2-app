import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';

import {colors} from '../../utils/colors';
import NewSelectValueComponent from '../../components/newSelectValueComponent';
import PremiumMatchesComponent from '../../components/PremiumMatchesComponent';

const DemoCode = () => {
  const [currentLocation, setCurrentLocation] = useState('');

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <PremiumMatchesComponent />
    </SafeAreaView>
  );
};

export default DemoCode;
