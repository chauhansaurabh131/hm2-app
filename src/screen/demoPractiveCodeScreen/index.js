import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Keyboard,
} from 'react-native';

const DemoPractiveCodeScreen = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardOpen(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardOpen(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text>hxvk</Text>

      <TextInput
        placeholder={'name'}
        style={{
          // width: '100%',
          height: 50,
          borderWidth: 1,
          borderColor: 'red',
          marginHorizontal: 17,
          padding: 10,
        }}
      />

      {!isKeyboardOpen && (
        <View
          style={{
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginHorizontal: 18,
            position: 'absolute',
            bottom: 10,
          }}>
          <TouchableOpacity
            style={{
              width: 150,
              height: 50,
              backgroundColor: 'red',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 150,
              height: 50,
              backgroundColor: 'red',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default DemoPractiveCodeScreen;
