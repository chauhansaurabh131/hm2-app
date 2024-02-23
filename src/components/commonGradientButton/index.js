import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import style from './style';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const CommonGradientButton = ({
  containerStyle,
  buttonTextStyle,
  buttonName,
  disable,
  onPress,
}) => {
  return (
    <SafeAreaView>
      <TouchableOpacity
        activeOpacity={0.7}
        disabled={disable}
        onPress={onPress}>
        <LinearGradient
          colors={['#0D4EB3', '#9413D0']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[
            {
              width: wp(270),
              height: hp(50),
              borderRadius: 10,
              alignItems: 'center',
              alignSelf: 'center',
              justifyContent: 'center',
            },
            containerStyle,
          ]}>
          <Text
            style={[
              {
                color: colors.white,
                fontSize: hp(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
                textAlign: 'center',
              },
              buttonTextStyle,
            ]}>
            {buttonName}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default CommonGradientButton;
