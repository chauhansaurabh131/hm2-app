import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image, View, Pressable} from 'react-native';
import {hp} from '../../utils/helpers';
import {icons} from '../../assets';

const DemoCode = () => {
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: 'white', justifyContent: 'center'}}>
      <View
        style={{
          height: hp(150),
          backgroundColor: 'black',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Pressable
          style={({pressed}) => ({
            opacity: pressed ? 0.7 : 1,
            transform: [{scale: pressed ? 0.95 : 1}],
          })}>
          <Image
            source={icons.gradient_Cancel_Btn}
            style={{
              width: hp(80),
              height: hp(80),
              resizeMode: 'contain',
            }}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default DemoCode;
