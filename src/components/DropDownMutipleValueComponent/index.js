import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {colors} from '../../utils/colors';
import {fontSize, hp, wp} from '../../utils/helpers';

const DropdownComponent = ({
  dropdownStyle,
  placeholderStyle,
  selectedTextStyle,
  inputSearchStyle,
  iconStyle,
  placeholder,
  searchPlaceholder,
  data,
  width,
  height,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const [isFocus, setIsFocus] = useState(false);

  const handleDropdownChange = item => {
    const index = selectedValues.indexOf(item.value);
    if (index === -1) {
      setSelectedValues([...selectedValues, item.value]); // Select if not already selected
    } else {
      const newSelectedValues = [...selectedValues];
      newSelectedValues.splice(index, 1); // Deselect if already selected
      setSelectedValues(newSelectedValues);
    }
  };

  const removeSelectedValue = value => {
    const newSelectedValues = selectedValues.filter(val => val !== value);
    setSelectedValues(newSelectedValues);
  };

  const getPlaceholderText = () => {
    if (selectedValues.length === 0) {
      return placeholder;
    } else {
      return selectedValues.map(value => {
        const label = data.find(item => item.value === value).label;
        return (
          <TouchableOpacity
            key={value}
            onPress={() => removeSelectedValue(value)}
            style={styles.selectedItem}>
            <Text style={styles.selectedText}>{label}</Text>
            <View
              style={{
                backgroundColor: '#E2E2E2',
                width: 20,
                height: 20,
                borderRadius: 10,
                justifyContent: 'center',
              }}>
              <Text style={styles.removeButton}>X</Text>
            </View>
          </TouchableOpacity>
        );
      });
    }
  };

  return (
    <View style={styles.container}>
      <Dropdown
        style={[
          styles.dropdown,
          {width: width, height: height},
          isFocus && {...styles.dropdownFocused, ...dropdownStyle},
        ]}
        placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
        selectedTextStyle={[styles.selectedTextStyle, selectedTextStyle]}
        inputSearchStyle={[styles.inputSearchStyle, inputSearchStyle]}
        iconStyle={[styles.iconStyle, iconStyle]}
        data={data}
        search
        maxHeight={300}
        iconColor={colors.blue}
        labelField="label"
        valueField="value"
        placeholder={getPlaceholderText()}
        searchPlaceholder={searchPlaceholder}
        value={selectedValues}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleDropdownChange}
        multiselect
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {},
  dropdown: {
    height: hp(50),
    width: wp(339),
    borderColor: colors.lightGreyBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  dropdownFocused: {},
  placeholderStyle: {
    fontSize: 16,
    color: colors.black,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.black,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: colors.black,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    padding: 4,
    backgroundColor: 'white', // Background color for selected item
    borderRadius: 10,
  },
  selectedText: {
    marginRight: 8,
    color: colors.black,
  },
  removeButton: {
    color: colors.black, // Color for 'X' button
    fontSize: fontSize(11),
    alignItems: 'center',
    textAlign: 'center',
  },
});
