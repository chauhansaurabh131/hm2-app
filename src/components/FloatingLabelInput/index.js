// FloatingLabelInput.js
import React, {useState} from 'react';
import {Text, TextInput, View, StyleSheet} from 'react-native';
import {fontFamily, fontSize, hp} from '../../utils/helpers';

const FloatingLabelInput = ({label, value, onChangeText, ...props}) => {
  const [isFocused, setFocused] = useState(false);

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  // Determine the label color, font size, and position based on the input state
  const labelColor = isFocused || value ? 'gray' : 'black';
  const labelFontSize = isFocused || value ? 14 : 18;
  const labelTop = isFocused || value ? -15 : 10;

  return (
    <View style={styles.inputContainer}>
      {/* Floating label */}
      <Text
        style={[
          styles.label,
          {top: labelTop, color: labelColor, fontSize: labelFontSize},
        ]}>
        {label}
      </Text>

      {/* Custom TextInput */}
      <TextInput
        style={styles.input}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={onChangeText}
        placeholderTextColor={'transparent'} // Hide default placeholder text
        {...props} // Pass other props to TextInput
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    // marginHorizontal: 24,
    marginTop: 20,
    position: 'relative', // Ensure the label is overlaid on the input
  },
  input: {
    height: 50,
    paddingLeft: 10,
    paddingRight: 10,
    color: 'black',
    fontSize: fontSize(20),
    lineHeight: hp(30),
    fontFamily: fontFamily.poppins500,
    borderBottomWidth: 1, // Display only the bottom border line
    borderBottomColor: 'black', // Set color for the bottom border line
    borderTopWidth: 0, // Remove top border line
    borderLeftWidth: 0, // Remove left border line
    borderRightWidth: 0, // Remove right border line
  },
  label: {
    position: 'absolute',
    left: 10,
    transition: 'top 0.3s ease', // Optional: for smooth transition of label
  },
});

export default FloatingLabelInput;
