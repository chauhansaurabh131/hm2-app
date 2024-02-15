import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import style from './style';
import LinearGradient from 'react-native-linear-gradient';

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
          style={[style.buttonContainer, containerStyle]}>
          <Text style={[style.buttonText, buttonTextStyle]}>{buttonName}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default CommonGradientButton;
