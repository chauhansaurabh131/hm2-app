import React from 'react';
import {Image, SafeAreaView} from 'react-native';
import {images} from '../../assets';
import {hp, wp} from '../../utils/helpers';

const AppColorLogo = () => {
  return (
    <SafeAreaView>
      <Image
        source={images.happyMilanColorLogo}
        style={{
          width: wp(96),
          height: hp(24),
          marginTop: hp(15),
          resizeMode: 'stretch',
          marginBottom: hp(15),
        }}
      />
    </SafeAreaView>
  );
};

export default AppColorLogo;
