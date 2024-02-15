// CustomDropdown.js
import React, {useState} from 'react';
import {View, TouchableOpacity, Text, Image, StyleSheet} from 'react-native';
import {hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';

const CustomDropdown = ({options, onSelect, dropdownButton}) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionPress = option => {
    setSelectedOption(option);
    setShowOptions(false);
    onSelect(option);
  };

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        onPress={() => setShowOptions(!showOptions)}
        style={[styles.dropdownButton, dropdownButton]}>
        <Text style={styles.dropdownText}>{selectedOption || '+91'}</Text>
        <Image source={icons.drooDownLogo} style={styles.dropdownIcon} />
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.optionsContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.option}
              onPress={() => handleOptionPress(option)}>
              <Text style={{color: colors.black}}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    // marginRight: 13,
    // marginTop: 70,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    width: wp(58),
    height: hp(50),
    // marginLeft: 2,
  },
  dropdownText: {
    marginRight: 10,
    color: colors.black,
  },
  dropdownIcon: {
    width: hp(5.67),
    height: hp(10),
    resizeMode: 'center',
    tintColor: colors.blue,
  },
  optionsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    marginTop: 5,
    zIndex: 1,
    backgroundColor: 'white',
    color: colors.black,
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ced4da',
    zIndex: 99,
  },
});

export default CustomDropdown;
