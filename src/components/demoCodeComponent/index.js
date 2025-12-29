import React from 'react';
import {Image, SafeAreaView, Text, View, FlatList} from 'react-native';
import {images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const studioData = [
  {id: 1, title: 'Chandra Photo Studio', location: 'Gandhinagar, Gujarat'},
  {id: 2, title: 'Smile Studio', location: 'Ahmedabad, Gujarat'},
  {id: 3, title: 'Rockey Studio', location: 'Surat, Gujarat'},
  {id: 4, title: 'First Try Studio', location: 'Rajkot, Gujarat'},
  {id: 5, title: 'Modern Click Studio', location: 'Vadodara, Gujarat'},
  {id: 6, title: 'Golden Pixel Studio', location: 'Bhavnagar, Gujarat'},
];

const DemoCodeComponent = () => {
  return (
    <SafeAreaView>
      <Text
        style={{
          marginTop: hp(27),
          color: colors.pureBlack,
          marginHorizontal: 17,
          fontSize: fontSize(14),
          fontFamily: fontFamily.poppins600,
          marginBottom: hp(26),
        }}>
        Recently Viewed
      </Text>
    </SafeAreaView>
  );
};

export default DemoCodeComponent;
