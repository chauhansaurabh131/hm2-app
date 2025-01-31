import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp} from '../../utils/helpers';

const Checkbox = ({options, onSelect, defaultSelectedId, stateCheckedBox}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    setSelectedOption(defaultSelectedId);
  }, [defaultSelectedId]);

  const handleSelect = optionId => {
    setSelectedOption(optionId === selectedOption ? null : optionId);
    onSelect(optionId);
  };

  // Split options into two arrays
  const options1 = options.slice(0, Math.ceil(options.length / 2));
  const options2 = options.slice(Math.ceil(options.length / 2));

  return (
    <View>
      {options2.length === 0 ? (
        <View style={styles.container}>
          {options.map(option => (
            <TouchableOpacity
              key={option.id}
              onPress={() => handleSelect(option.id)}
              style={styles.checkboxContainer}>
              <View
                style={[
                  styles.checkbox,
                  selectedOption === option.id && styles.checked,
                  stateCheckedBox,
                ]}>
                {selectedOption === option.id && (
                  <Text style={styles.check}>&#10003;</Text>
                )}
              </View>
              <Text style={styles.label}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.container}>
          <View style={styles.column}>
            {options1.map(option => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelect(option.id)}
                style={styles.checkboxContainer}>
                <View
                  style={[
                    styles.checkbox,
                    selectedOption === option.id && styles.checked,
                  ]}>
                  {selectedOption === option.id && (
                    <Text style={styles.check}>&#10003;</Text>
                  )}
                </View>
                <Text style={styles.label}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.column}>
            {options2.map(option => (
              <TouchableOpacity
                key={option.id}
                onPress={() => handleSelect(option.id)}
                style={styles.checkboxContainer}>
                <View
                  style={[
                    styles.checkbox,
                    selectedOption === option.id && styles.checked,
                  ]}>
                  {selectedOption === option.id && (
                    <Text style={styles.check}>&#10003;</Text>
                  )}
                </View>
                <Text style={styles.label}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'red',
  },
  column: {
    flex: 1,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    width: hp(16),
    height: hp(16),
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderRadius: 2,
  },
  checked: {
    backgroundColor: '#000',
  },
  check: {
    color: '#fff',
    fontSize: 10,
    top: -1,
  },
  label: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
  },
});

export default Checkbox;
