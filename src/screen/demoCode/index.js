import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const DemoCode = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Abc', {
            data: {
              minAge: 22,
              maxAge: 50,
              minHeight: 4,
              maxHeight: 8,
            },
          });
        }}>
        <Text style={{color: 'black', fontSize: 24}}>Next PAge</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DemoCode;
