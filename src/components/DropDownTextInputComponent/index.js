import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
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
}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  // const handleDropdownChange = item => {
  //   const index = selectedValues.indexOf(item.value);
  //   if (index === -1) {
  //     setSelectedValues([...selectedValues, item.value]); // Select if not already selected
  //   } else {
  //     const newSelectedValues = [...selectedValues];
  //     newSelectedValues.splice(index, 1); // Deselect if already selected
  //     setSelectedValues(newSelectedValues);
  //   }
  // };

  // const removeSelectedValue = value => {
  //   const newSelectedValues = selectedValues.filter(val => val !== value);
  //   setSelectedValues(newSelectedValues);
  // };

  // const getPlaceholderText = () => {
  //   if (selectedValues.length === 0) {
  //     return placeholder;
  //   } else {
  //     return selectedValues.map(value => {
  //       const label = data.find(item => item.value === value).label;
  //       return (
  //         <TouchableOpacity
  //           key={value}
  //           onPress={() => removeSelectedValue(value)}
  //           style={styles.selectedItem}>
  //           <Text>{label}</Text>
  //           <Text style={styles.removeButton}>X</Text>
  //         </TouchableOpacity>
  //       );
  //     });
  //   }
  // };

  const renderItem = item => {
    const itemTextStyle = {
      ...styles.textItem,
      color: value === item.value ? 'black' : 'black', // Change text color to red if item is selected
    };

    return (
      <View style={styles.item}>
        <Text style={itemTextStyle}>{item.label}</Text>
      </View>
    );
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
        // placeholder={!isFocus ? 'Select item' : 'Select item'}
        // searchPlaceholder="Search..."
        searchPlaceholder={searchPlaceholder}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
        renderItem={renderItem}
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
    borderColor: colors.lightGreyBorder,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    // marginTop: 50,
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
  textItem: {
    // flex: 1,
    fontSize: 16,
    padding: 20,
  },
});
