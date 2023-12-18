import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

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
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = text => {
    setInputValue(text);
  };

  return (
    <SafeAreaView style={[styles.container, containerStyle]}>
      <View style={styles.inputContainer}>
        {iconSources && (
          <View>
            <Image source={iconSource} style={styles.icon} />
          </View>
        )}
        <TextInput
          style={[styles.input, textInputStyle]}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          onChangeText={handleInputChange}
          value={inputValue}
          placeholderTextColor="black"
        />
        {iconSecures && (
          <TouchableOpacity onPress={onIconPress}>
            <Image source={iconSecure} style={styles.secureIconStyle} />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    width: wp(270),
    height: hp(50),
    alignSelf: 'center',
  },
  icon: {
    width: 18,
    height: 18,
    marginRight: 10,
    resizeMode: 'stretch',
  },
  input: {
    flex: 1,
    height: 40,
    color: colors.black,
  },
  textInputStyle: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    color: colors.black,
    fontWeight: '400',
    fontFamily: fontFamily.nunito400,
  },
  secureIconStyle: {
    width: 18,
    height: 18,
    marginRight: 3,
    resizeMode: 'stretch',
  },
});

export default MyTextInput;
