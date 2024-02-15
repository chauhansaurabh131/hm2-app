import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
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
}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

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
        // placeholder={!isFocus ? 'Select item' : 'Select item'}
        placeholder={placeholder}
        // searchPlaceholder="Search..."
        searchPlaceholder={searchPlaceholder}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'white',
    // padding: 16,
  },
  dropdown: {
    height: hp(50),
    width: wp(339),
    borderColor: colors.blue,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    // marginTop: 10,
  },
  dropdownFocused: {
    // Additional styles for the focused state
    // For example:
    // borderColor: 'red',
  },
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
});
