import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {images} from '../../assets';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const TextInput = ({
  label,
  iconName,
  error,
  password,
  onFocus = () => {},
  ...props
}) => {
  return (
    <SafeAreaView>
      <Text />
      <Icon name={iconName}  size={24} />
    </SafeAreaView>
  );
};

export default TextInput;
