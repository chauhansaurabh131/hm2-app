import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import style from './style'; // Assuming you have a style file
import {colors} from '../../utils/colors'; // Assuming you have a colors file

const MyTextInput = ({
  iconSource,
  placeholder,
  secureTextEntry,
  onIconPress,
  iconSources,
  iconSecures,
  iconSecure,
  containerStyle,
  textInputStyle,
  inputContainer,
  maxLength,
  keyboardType,
  iconStyle,
  handleInputChange,
  inputValue,
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  return (
    <SafeAreaView style={[style.container, containerStyle]}>
      <View style={[style.inputContainer, inputContainer]}>
        {iconSources && (
          <View>
            <Image source={iconSource} style={[style.icon, iconStyle]} />
          </View>
        )}
        <TextInput
          style={[
            style.input,
            textInputStyle,
            {
              textAlign: inputValue || isInputFocused ? 'left' : 'center', // Center align placeholder, left align text
            },
          ]}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          onChangeText={handleInputChange}
          value={inputValue}
          placeholderTextColor="black"
          maxLength={maxLength}
          keyboardType={keyboardType}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoFocus={false} // Set this to true if you want the input to be focused initially
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

export default MyTextInput;
