import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import {fontFamily, hp, wp} from '../../utils/helpers';

const GradientButton = ({
  buttonName,
  onPress,
  containerStyle,
  buttonTextStyle,
}) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <LinearGradient
        colors={['#0D4EB3', '#9413D0']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={[styles.buttonContainer, containerStyle]}>
        <Text style={[styles.buttonText, buttonTextStyle]}>{buttonName}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = {
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: colors.blue,
    borderRadius: hp(10),
    paddingVertical: hp(10),
    paddingHorizontal: hp(15),
    width: wp(270),
    height: hp(50),
    alignSelf: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: hp(16),
    textAlign: 'center',
    lineHeight: hp(24),
    fontFamily: fontFamily.montserrat,
  },
};

export default GradientButton;
