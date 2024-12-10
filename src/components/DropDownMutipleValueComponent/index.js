import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {colors} from '../../utils/colors';
import {fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';

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
  selectedItems,
  setSelectedItems,
}) => {
  const [isFocus, setIsFocus] = useState(false);

  const handleDropdownChange = item => {
    const index = selectedItems.indexOf(item.value);
    if (index === -1) {
      setSelectedItems([...selectedItems, item.value]); // Select if not already selected
    } else {
      const newSelectedItems = [...selectedItems];
      newSelectedItems.splice(index, 1); // Deselect if already selected
      setSelectedItems(newSelectedItems);
    }
  };

  const removeSelectedValue = value => {
    const newSelectedItems = selectedItems.filter(val => val !== value);
    setSelectedItems(newSelectedItems);
  };

  const renderSelectedItems = () => {
    return selectedItems.map(value => {
      const label = data.find(item => item.value === value)?.label;
      return (
        <TouchableOpacity
          key={value}
          onPress={() => removeSelectedValue(value)}
          style={styles.selectedItem}>
          <Text style={styles.selectedText}>{label}</Text>
          <View style={styles.removeButtonContainer}>
            <Text style={styles.removeButton}>X</Text>
          </View>
        </TouchableOpacity>
      );
    });
  };

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
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
        data={data}
        search={search}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        searchPlaceholder={searchPlaceholder}
        value={null} // Ensure TextInput stays empty
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={handleDropdownChange}
        multiselect
        nestedScrollEnabled={true}
        renderItem={renderItem}
        renderRightIcon={() => (
          <Image source={icons.drooDownLogo} style={styles.iconStyle} />
        )}
      />
      <View style={styles.selectedItemsContainer}>{renderSelectedItems()}</View>
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {},
  dropdown: {
    height: hp(50),
    width: wp(339),
    // borderColor: colors.lightGreyBorder,
    borderColor: '#C0C0C0',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    // paddingHorizontal: 8,
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
    width: hp(12),
    height: hp(18),
    resizeMode: 'contain',
    marginRight: 9,
    tintColor: '#5F6368',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: colors.black,
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    borderRadius: 10, // Optional: Add border radius here for selected items
    overflow: 'hidden', // Ensure the border radius is respected
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    padding: 4,
    backgroundColor: '#F3F3F3',
    borderRadius: 50,
    height: hp(40),
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  selectedText: {
    marginRight: 8,
    color: colors.black,
  },
  removeButtonContainer: {
    backgroundColor: '#5F6368',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButton: {
    color: colors.white,
    fontSize: fontSize(11),
    textAlign: 'center',
  },
  textItem: {
    fontSize: 16,
    padding: 20,
    color: 'black',
  },
});
