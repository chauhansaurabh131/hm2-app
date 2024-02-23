import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp} from '../../utils/helpers';

const Checkbox = ({options, onSelect}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = optionId => {
    setSelectedOption(optionId === selectedOption ? null : optionId);
    onSelect(optionId);
  };

  return (
    <View>
      {options.map(option => (
        <TouchableOpacity
          key={option.id}
          onPress={() => handleSelect(option.id)}
          style={styles.checkboxContainer}>
          <View style={styles.checkbox}>
            {selectedOption === option.id && (
              <Text style={styles.check}>&#10003;</Text>
            )}
          </View>
          <Text style={styles.label}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  check: {
    color: '#000',
    fontSize: 16,
  },
  label: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
  },
});

export default Checkbox;
