import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';

const Xyz = ({navigation}) => {
  return (
    <SafeAreaView style={{justifyContent: 'center', flex: 1}}>
      <TouchableOpacity
        style={{justifyContent: 'center', alignItems: 'center'}}
        onPress={() => {
          navigation.navigate('HomeTabs');
        }}>
        <Text>XYZ</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Xyz;
