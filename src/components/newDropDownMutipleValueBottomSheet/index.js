import React, {useState, useRef} from 'react';
import {StyleSheet, View, TouchableOpacity, Text, Image} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet'; // Import the bottom sheet
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import {hoverGestureHandlerProps} from 'react-native-gesture-handler/lib/typescript/handlers/gestures/hoverGesture';

const DropdownComponentBottomSheet = ({
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
  bottomSheetHeight,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const bottomSheetRef = useRef(); // Reference to the bottom sheet

  const handleDropdownChange = item => {
    const index = selectedItems.indexOf(item.value);
    if (index === -1) {
      setSelectedItems([...selectedItems, item.value]); // Select if not already selected
    } else {
      const newSelectedItems = [...selectedItems];
      newSelectedItems.splice(index, 1); // Deselect if already selected
      setSelectedItems(newSelectedItems);
    }

    bottomSheetRef.current.close(); // Close the bottom sheet after selection
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
      <TouchableOpacity onPress={() => handleDropdownChange(item)}>
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.6}
        style={[
          styles.dropdown,
          {width: width, height: height},
          isFocus && {...styles.dropdownFocused, ...dropdownStyle},
        ]}
        onPress={() => bottomSheetRef.current.open()} // Open the bottom sheet when clicked
      >
        {/*<Text style={placeholderStyle}>{placeholder}</Text>*/}
        <Text
          style={{
            color: 'black',
            fontFamily: fontFamily.poppins500,
            fontSize: fontSize(16),
            lineHeight: hp(27),
          }}>
          {placeholder}
        </Text>
        {/* Render the dropdown icon */}
        <Image source={icons.drooDownLogo} style={styles.iconStyle} />
      </TouchableOpacity>

      {/* Selected items */}
      <View style={styles.selectedItemsContainer}>{renderSelectedItems()}</View>

      {/* Bottom Sheet */}
      <RBSheet
        ref={bottomSheetRef}
        height={bottomSheetHeight} // Height of the bottom sheet
        closeOnPressMask={true} // Close when the mask is pressed
        closeOnDragDown={true}
        customStyles={{
          container: {
            padding: 10,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            // backgroundColor: 'orange',
          },
        }}>
        <View style={styles.bottomSheetContainer}>
          {/*<Text style={styles.bottomSheetTitle}>Select Items</Text>*/}
          <View style={styles.itemList}>
            {data.map(item => renderItem(item))}
          </View>
        </View>
      </RBSheet>
    </View>
  );
};

export default DropdownComponentBottomSheet;

const styles = StyleSheet.create({
  container: {},
  dropdown: {
    height: hp(50),
    width: wp(339),
    borderColor: '#C0C0C0',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    paddingLeft: 10,
    borderBottomWidth: 1, // Add bottom border for the TextInput look
    borderBottomColor: '#C0C0C0', // Optional: Customize the bottom line color
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
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
    position: 'absolute',
    right: 10,
    transform: [{rotate: '-90deg'}],
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
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
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
    fontSize: fontSize(16),
    padding: 10,
    color: 'black',
    // backgroundColor: 'red',
  },
  bottomSheetContainer: {
    // flex: 1,
    // justifyContent: 'space-between',
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemList: {
    marginTop: 10,
  },
});
