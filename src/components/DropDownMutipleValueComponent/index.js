import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  ScrollView,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet'; // Import RBSheet
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';

const DropdownComponent = ({
  placeholder,
  data,
  width,
  height,
  selectedItems,
  setSelectedItems,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const bottomSheetRef = useRef(null); // Reference for the bottom sheet

  const handleDropdownChange = item => {
    const index = selectedItems.indexOf(item.value);
    if (index === -1) {
      setSelectedItems([...selectedItems, item.value]); // Select if not already selected
      bottomSheetRef.current.close();
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
      <TouchableOpacity
        onPress={() => handleDropdownChange(item)}
        style={styles.item}>
        <View style={{marginHorizontal: 17}}>
          <Text style={styles.textItem}>{item.label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Your TextInput styled area to open bottom sheet */}
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => bottomSheetRef.current.open()}
        style={styles.dropdownWrapper}>
        <View style={[styles.dropdown, {width: width, height: height}]}>
          <Text style={styles.placeholderStyle}>{placeholder}</Text>
        </View>
        <Image
          source={icons.rightSideIcon} // Make sure to import your right-side icon
          style={styles.iconStyle}
        />
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <RBSheet
        ref={bottomSheetRef}
        height={300} // Set the height of the bottom sheet
        closeOnDragDown={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            // padding: 20,
          },
        }}>
        {/* Dropdown inside the Bottom Sheet */}
        <ScrollView style={{flex: 1, marginTop: hp(10)}}>
          {data.map(item => renderItem(item))}
        </ScrollView>
      </RBSheet>

      {/* Render selected items below */}
      <View style={styles.selectedItemsContainer}>{renderSelectedItems()}</View>
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {},
  dropdownWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdown: {
    height: hp(50),
    borderColor: '#C0C0C0',
    borderWidth: 0,
    borderBottomWidth: 1,
    borderRadius: 0,
    flex: 1,
  },
  placeholderStyle: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(27),
    fontFamily: fontFamily.poppins500,
  },
  iconStyle: {
    width: hp(8),
    height: hp(11),
    resizeMode: 'contain',
    right: 15,
    top: -5,
  },
  selectedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    borderRadius: 10,
    overflow: 'hidden',
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
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
    padding: 10,
    color: 'black',
  },
});
