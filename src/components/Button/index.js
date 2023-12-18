import React from 'react';
import {TouchableOpacity, Text, Image, View} from 'react-native';
import style from '../Button/style';
import {images} from '../../assets';

const Button = ({
  onPress,
  disabled,
  containerStyle,
  buttonName,
  buttonTextStyle,
  buttonIcon,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      activeOpacity={0.8}
      onPress={onPress}
      style={[style.container, containerStyle]}>
      <View style={style.buttonContent}>
        <Text style={[style.buttonTextStyle, buttonTextStyle]}>
          {buttonName}
        </Text>
        {buttonIcon && (
          <Image source={images.rightArrowLogo} style={style.rightArrowStyle} />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;
