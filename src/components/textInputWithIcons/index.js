import React from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';

const TextInputWithIcons = ({
  inputContainerStyle,
  iconSource,
  iconStyle,
  placeholder,
  textInputStyle,
  secureTextEntry,
  handleInputChange,
  inputValue,
  maxLength,
  keyboardType,
  iconSources,
  iconSecures,
  onIconPress,
  iconSecure,
}) => {
  return (
    <SafeAreaView>
      <View style={[style.inputContainer, inputContainerStyle]}>
        {iconSources && (
          <View>
            <Image source={iconSource} style={[style.icon, iconStyle]} />
          </View>
        )}
        <TextInput
          style={[style.input, textInputStyle]}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          onChangeText={handleInputChange}
          value={inputValue}
          placeholderTextColor="black"
          maxLength={maxLength}
          keyboardType={keyboardType}
        />
        {iconSecures && (
          <TouchableOpacity onPress={onIconPress}>
            <Image source={iconSecure} style={style.secureIconStyle} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};
export default TextInputWithIcons;
