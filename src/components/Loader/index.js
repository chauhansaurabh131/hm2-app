import React from 'react';
import {SafeAreaView, ActivityIndicator} from 'react-native';

const Loader = () => {
  return (
    <ActivityIndicator
      style={{flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.3)'}}
      size={'large'}
    />
  );
};
export default Loader;
