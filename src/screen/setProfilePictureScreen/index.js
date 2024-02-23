import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import CommonGradientButton from '../../components/commonGradientButton';

const SetProfilePictureScreen = () => {
  return (
    <SafeAreaView style={style.container}>
      <View
        style={{
          marginHorizontal: wp(18),
          backgroundColor: 'lightgreen',
          flex: 1,
        }}>
        <Image
          source={images.happyMilanColorLogo}
          style={{
            width: wp(96),
            height: hp(24),
            resizeMode: 'stretch',
            marginTop: hp(15),
          }}
        />

        <View style={{marginTop: hp(45), flexDirection: 'row'}}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins400,
            }}>
            Select Photo to
            <Text style={{color: colors.blue}}> Set as profile picture</Text>
          </Text>
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: wp(162),
              height: hp(50),
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.blue,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: colors.black,
                textAlign: 'center',
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins400,
              }}>
              Back
            </Text>
          </TouchableOpacity>
          <CommonGradientButton
            buttonName={'Next'}
            containerStyle={{width: wp(162), height: hp(50)}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SetProfilePictureScreen;
