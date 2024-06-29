import React, {useState} from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {hp, wp} from '../utils/helpers';
import {colors} from '../utils/colors';

const TextInputWithIcons = ({
  placeholder,
  leftIconSource,
  rightIconSource,
  containerStyle,
  textInputStyle,
  iconStyle,
  onChangeText,
  value,
  iconPress,
  iconsStyle,
}) => {
  const [text, setText] = useState(value || '');

  const handleTextChange = newValue => {
    setText(newValue);
    if (onChangeText) {
      onChangeText(newValue);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <Image source={leftIconSource} style={[styles.icons, iconsStyle]} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={'black'}
        style={[
          styles.input,
          textInputStyle,
          {
            textAlign: text ? 'left' : 'center', // Center if no text, left if there's text
          },
        ]}
        onChangeText={handleTextChange}
        value={text}
      />
      <TouchableOpacity onPress={iconPress}>
        <Image source={rightIconSource} style={[styles.icon, iconStyle]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width: wp(270),
    height: hp(50),

    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    alignSelf: 'center',
    borderColor: colors.blue,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingLeft: 10,
    paddingRight: 10, // Ensure there is padding on the right for the right icon
    width: wp(270),
    borderRadius: 20,
  },
  icon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: 15,
  },
  icons: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginLeft: 15,
  },
});

export default TextInputWithIcons;
