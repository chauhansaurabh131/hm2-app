import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image, TouchableOpacity} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import Pinchable from 'react-native-pinchable';
import {icons} from '../../assets';
import {hp} from '../../utils/helpers';

const VendorImageViewScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {imageUrl} = route.params || {};

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'black',
      }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: hp(20),
          left: hp(20),
          zIndex: 999,
        }}>
        <Image
          source={icons.back_arrow_icon}
          style={{
            width: hp(20),
            height: hp(20),
            tintColor: 'white',
          }}
        />
      </TouchableOpacity>

      <Pinchable>
        <Image
          source={{uri: imageUrl}}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
        />
      </Pinchable>
    </SafeAreaView>
  );
};

export default VendorImageViewScreen;
