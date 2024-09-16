import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Text,
  Animated,
  TextInput,
} from 'react-native';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp} from '../../utils/helpers'; // Make sure you have the icons in your assets

const NewDropDownTextInput = ({
  placeholder,
  dropdownData = [],
  onValueChange,
}) => {
  const [value, setValue] = useState('');
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isFocused, setFocused] = useState(false);

  // Create animated state for the floating label
  const labelPosition = new Animated.Value(value ? 1 : 0);

  const handleFocus = () => {
    setFocused(true);
    // Toggle dropdown visibility when clicking on TextInput
    setDropdownVisible(prevState => !prevState);

    Animated.timing(labelPosition, {
      toValue: 1, // Move label to the top
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    if (!value) {
      Animated.timing(labelPosition, {
        toValue: 0, // Move label back down
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSelectOption = item => {
    setValue(item);
    setDropdownVisible(false); // Close dropdown after selecting an option
    Animated.timing(labelPosition, {
      toValue: 1, // Keep label at the top
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (onValueChange) {
      onValueChange(item); // Call the parent's function when value changes
    }
  };

  const labelStyle = {
    position: 'absolute',
    left: 10,
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -10], // Move the label up when value is selected or input is focused
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 12], // Reduce font size when moving the label up
    }),
    color: isFocused || value ? 'gray' : 'black', // Change label color on focus
  };

  return (
    <View style={styles.inputContainer}>
      {/* Floating label */}
      <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>

      {/* Custom TextInput with Icon */}
      <TextInput
        style={styles.input}
        value={value}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChangeText={setValue}
        placeholderTextColor={'transparent'} // Hide default placeholder text
        editable={!isDropdownVisible} // Disable typing when dropdown is visible
      />
      <TouchableOpacity style={styles.icon}>
        <Image source={icons.drooDownLogo} style={styles.iconStyle} />
      </TouchableOpacity>

      {/* Dropdown menu */}
      {isDropdownVisible && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={dropdownData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={() => handleSelectOption(item)}>
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 70,
    position: 'relative', // Ensure the label is overlaid on the input
  },
  input: {
    height: 50,
    borderColor: 'black',
    borderBottomWidth: 1, // Only bottom border
    width: '100%',
    paddingLeft: 10,
    paddingRight: 35, // Space for the icon on the right side
    color: 'black',
    fontSize: fontSize(20),
    lineHeight: hp(30),
    fontFamily: fontFamily.poppins500,
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: 25,
  },
  iconStyle: {
    height: 6,
    width: 10,
    tintColor: colors.black,
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 5,
    maxHeight: 150, // Limit dropdown height
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  dropdownText: {
    color: 'black',
  },
});

export default NewDropDownTextInput;
