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
  secureEyeIcon,
  showPasswordIcon,
  containerStyle,
  textInputStyle,
  iconStyle,
  onChangeText,
  value,
  isPassword,
  iconsStyle,
}) => {
  const [text, setText] = useState(value || '');
  const [isSecure, setIsSecure] = useState(isPassword);
  const [currentIcon, setCurrentIcon] = useState(rightIconSource);

  const handleTextChange = newValue => {
    setText(newValue);
    if (onChangeText) {
      onChangeText(newValue);
    }
  };

  const toggleSecureEntry = () => {
    setIsSecure(prevState => !prevState);
    setCurrentIcon(prevState =>
      prevState === secureEyeIcon ? showPasswordIcon : secureEyeIcon,
    );
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
        secureTextEntry={isSecure}
      />
      {isPassword && (
        <TouchableOpacity onPress={toggleSecureEntry}>
          <Image source={currentIcon} style={[styles.icon, iconStyle]} />
        </TouchableOpacity>
      )}
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
    width: hp(16),
    height: hp(18),
    resizeMode: 'contain',
    marginRight: wp(15),
  },
  icons: {
    width: hp(16),
    height: hp(14),
    resizeMode: 'contain',
    marginLeft: wp(15),
  },
});

export default TextInputWithIcons;
