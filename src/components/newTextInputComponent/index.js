import React, {useState} from 'react';
import {
  TextInput,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';

const NewTextInputComponent = ({
  value,
  onChangeText,
  placeholder,
  style,
  LeftIconName,
  RightIconName,
  isPasswordInput = false, // New prop to indicate password input
  maxLength,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to manage visibility

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible); // Toggle visibility
  };

  return (
    <View style={[styles.container, style]}>
      {LeftIconName && <Image source={LeftIconName} style={styles.iconLeft} />}
      <TextInput
        style={[
          styles.textInput,
          LeftIconName && RightIconName ? {paddingHorizontal: 5} : {},
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.black}
        secureTextEntry={isPasswordInput && !isPasswordVisible} // Conditionally hide/show password
        maxLength={maxLength}
        importantForAutofill="no"
      />
      {RightIconName && (
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Image
            source={
              isPasswordVisible
                ? icons.show_Password_icon // Icon for visible password
                : icons.secureEyeLogo
            }
            style={styles.iconRight}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#D9D9D9',
    borderWidth: 1,
    borderRadius: 25,
  },
  iconLeft: {
    marginLeft: 15,
    width: hp(18),
    height: hp(18),
    tintColor: '#D9D9D9',
    resizeMode: 'contain',
  },
  textInput: {
    flex: 1,
    height: hp(50),
    // paddingHorizontal: 15,
    fontSize: fontSize(16),
    color: '#333',
    // width: wp(400),
    marginLeft: hp(13),
    paddingRight: hp(15),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    top: 3,
  },
  iconRight: {
    marginRight: 15,
    width: hp(18),
    height: hp(18),
    tintColor: '#D9D9D9',
    resizeMode: 'contain',
  },
});

export default NewTextInputComponent;
