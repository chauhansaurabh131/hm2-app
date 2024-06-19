import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {colors} from '../../utils/colors';
import {hp, wp} from '../../utils/helpers';

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
  search,
  onChange, // Add onChange prop
}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const handleValueChange = item => {
    setValue(item.value);
    if (onChange) {
      onChange(item.value); // Call the onChange callback with the selected value
    }
    setIsFocus(false);
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
        search={search}
        maxHeight={300}
        iconColor={colors.blue}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleValueChange} // Pass the handleValueChange function to Dropdown's onChange prop
      />
    </View>
  );
};

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
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
    color: colors.black,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: colors.black,
    marginLeft: 15,
  },
  iconStyle: {
    width: 20,
    height: 20,
    marginRight: 15,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: colors.black,
  },
});

export default DropdownComponent;
