import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {images} from '../../assets';
import {hp, isIOS, wp} from '../../utils/helpers';

const CustomHeaderLogo = ({headerImage}) => {
  return (
    <Image
      source={images.happyMilanColorLogo}
      style={[styles.headerImage, headerImage]}
    />
  );
};

const styles = StyleSheet.create({
  headerImage: {
    width: isIOS ? hp(110) : hp(100),
    height: isIOS ? hp(26) : hp(24),
    marginTop: hp(29),
    marginLeft: wp(33),
    resizeMode: 'stretch',
  },
});

export default CustomHeaderLogo;
