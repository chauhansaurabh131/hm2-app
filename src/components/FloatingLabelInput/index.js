import React, {useState} from 'react';
import {Text, TextInput, View, StyleSheet} from 'react-native';
import {fontFamily, fontSize, hp} from '../../utils/helpers';

const FloatingLabelInput = ({
  label,
  value,
  onChangeText,
  showUnit,
  showUnitText,
  ...props
}) => {
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

  // Ensure that only numeric values with a decimal format are entered and the length is limited to 10 when showUnit is true
  const handleTextChange = text => {
    if (showUnit) {
      // Allow input of numbers with up to one decimal point
      let numericValue = text;

      // Restrict input to numbers and one optional decimal point
      numericValue = numericValue.replace(/[^0-9.]/g, '');

      // Split the number into integer and decimal parts
      const parts = numericValue.split('.');

      // Ensure only one decimal point is allowed
      if (parts.length > 2) {
        numericValue = `${parts[0]}.${parts[1]}`; // Keep only one decimal point
      }

      // Limit the entire input length to 10 characters
      if (numericValue.length <= 10) {
        onChangeText(numericValue);
      }
    } else {
      // Allow any text input when showUnit is false
      onChangeText(text);
    }
  };

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

      <View style={styles.inputWrapper}>
        {/* Custom TextInput */}
        <TextInput
          style={styles.input}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleTextChange}
          keyboardType={showUnit ? 'numeric' : 'default'} // Use numeric keyboard when showUnit is true
          placeholderTextColor={'transparent'} // Hide default placeholder text
          maxLength={showUnit ? 10 : undefined} // Set max length for numeric input
          {...props} // Pass other props to TextInput
        />
        {/* Conditionally render unit text */}
        {showUnit && <Text style={styles.unitText}>{showUnitText}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative', // Ensure the label is overlaid on the input
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1, // Make sure the input takes all available space
    height: 50,
    paddingLeft: 0,
    paddingRight: 40, // Add padding to the right to ensure the unit text doesn't overlap the input text
    color: 'black',
    fontSize: fontSize(20),
    lineHeight: 30,
    fontFamily: fontFamily.poppins500,
    borderBottomWidth: 1, // Display only the bottom border line
    borderBottomColor: '#C0C0C0', // Set color for the bottom border line
  },
  unitText: {
    position: 'absolute',
    right: 10, // Position the unit text on the right
    fontSize: fontSize(18),
    color: '#AFAFAF',
    fontFamily: fontFamily.poppins500,
  },
  label: {
    position: 'absolute',
    // left: 10,
    // transition: 'top 0.3s ease', // Optional: for smooth transition of label
  },
});

export default FloatingLabelInput;
