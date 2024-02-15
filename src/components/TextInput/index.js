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
import style from './style';

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
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = text => {
    setInputValue(text);
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

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   inputContainer: {
//     width: wp(270),
//     height: hp(50),
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: colors.blue,
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     alignSelf: 'center',
//   },
//   icon: {
//     width: hp(17.5),
//     height: hp(16),
//     marginRight: 10,
//     resizeMode: 'stretch',
//   },
//   input: {
//     flex: 1,
//     height: hp(40),
//     color: colors.black,
//   },
//   textInputStyle: {
//     fontSize: fontSize(16),
//     lineHeight: hp(24),
//     color: colors.black,
//     fontWeight: '400',
//     fontFamily: fontFamily.nunito400,
//   },
//   secureIconStyle: {
//     width: hp(18),
//     height: hp(18),
//     marginRight: 3,
//     resizeMode: 'stretch',
//   },
// });

export default MyTextInput;
