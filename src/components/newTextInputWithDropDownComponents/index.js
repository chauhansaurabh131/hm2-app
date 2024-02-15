// CustomTextInputWithDropDown.js

import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Image, Text} from 'react-native';
import {colors} from '../../utils/colors';
import {hp, wp} from '../../utils/helpers';

const CustomTextInputWithDropDown = ({
  dropdownItems,
  placeholder,
  editable = true,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isTextInputFocused, setIsTextInputFocused] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');

  const handleDropdownPress = () => {
    setShowDropdown(!showDropdown);
  };

  const handleItemSelected = item => {
    setSelectedItem(item);
    setTextInputValue(item);
    setShowDropdown(false);
  };

  const handleTextInputFocus = () => {
    setIsTextInputFocused(true);
    setShowDropdown(true); // Always show dropdown on focus
  };

  const handleTextInputBlur = () => {
    setIsTextInputFocused(false);
  };

  const handleTextInputChange = text => {
    setTextInputValue(text);
    setSelectedItem(null); // Clear selected item when typing
    setShowDropdown(true); // Always show dropdown on typing
  };

  return (
    <View>
      <View style={styles.container}>
        <TextInput
          style={styles.textInputStyle}
          placeholder={placeholder}
          value={selectedItem !== null ? selectedItem : textInputValue}
          onFocus={handleTextInputFocus}
          onBlur={handleTextInputBlur}
          onChangeText={handleTextInputChange}
          placeholderTextColor={colors.black}
          editable={editable}
        />

        <TouchableOpacity onPress={handleDropdownPress}>
          <View style={styles.dropdownIconContainer}>
            <Image
              source={require('../../assets/icons/dropDown_Down_logo.png')}
              style={styles.dropdownIcon}
            />
          </View>
        </TouchableOpacity>
      </View>

      {showDropdown && (
        <View style={styles.dropdownListContainer}>
          {dropdownItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleItemSelected(item)}
              style={styles.dropdownItem}>
              <Text style={styles.dropdownItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    colors: 'black',
  },
  textInputStyle: {
    width: '100%',
    height: hp(50),
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F7F7F7',
    // colors: colors.black,
    color: colors.black,
  },
  dropdownIconContainer: {
    marginLeft: -35,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIcon: {
    width: 10.36,
    height: 6,
  },
  dropdownListContainer: {
    position: 'absolute',
    width: wp(339),
    top: 70,
    left: wp(10),
    zIndex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  dropdownItemText: {
    color: colors.black,
  },
};

export default CustomTextInputWithDropDown;
