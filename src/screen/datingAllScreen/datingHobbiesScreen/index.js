import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize} from '../../../utils/helpers';
import {Dropdown} from 'react-native-element-dropdown';

const data = [
  {label: 'Writing', value: '1'},
  {label: 'Play Instrument', value: '2'},
  {label: 'Game', value: '3'},
  {label: 'Movie', value: '4'},
  {label: 'Sports', value: '5'},
  {label: 'Running', value: '6'},
  {label: 'Cycling', value: '7'},
];

const DatingHobbiesScreen = ({selectedItems = [], setSelectedItems}) => {
  const selectedLabels = selectedItems.map(item => item.label);

  // Log the selected labels
  console.log('Selected Labels:', selectedLabels.join(', '));

  const handleSelect = item => {
    const selectedLabel = item.label;
    const selectedValue = item.value;
    if (selectedItems.find(i => i.value === selectedValue)) {
      setSelectedItems(selectedItems.filter(i => i.value !== selectedValue));
    } else {
      setSelectedItems([
        ...selectedItems,
        {label: selectedLabel, value: selectedValue},
      ]);
    }
  };

  const removeItem = itemValue => {
    setSelectedItems(selectedItems.filter(i => i.value !== itemValue));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Dropdown
          style={styles.dropdown}
          data={data}
          labelField="label"
          valueField="value"
          placeholder="Select Hobbies"
          placeholderStyle={{
            color: 'black',
            fontSize: fontSize(18),
            lineHeight: 27,
            fontFamily: fontFamily.poppins500,
          }}
          value={selectedItems.map(item => item.value)} // Use the values of selected items
          onChange={item => handleSelect(item)}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={styles.dropdownContainer}
          multi
          renderItem={(item, selected) => (
            <View style={styles.dropdownItem}>
              <Text
                style={[styles.itemText, selected ? styles.selectedItem : {}]}>
                {item.label}
              </Text>
            </View>
          )}
          search={false} // Hide the search bar
        />
        {selectedLabels.length > 0 && (
          <View style={styles.selectedContainer}>
            {selectedLabels.map((label, index) => (
              <View key={index} style={styles.selectedItemContainer}>
                <Text style={styles.selectedItemText}>{label}</Text>
                <TouchableOpacity
                  onPress={() => removeItem(selectedItems[index].value)}>
                  <View style={styles.cancelButton}>
                    <Text style={styles.cancelIcon}>X</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  wrapper: {
    width: '100%',
  },
  dropdown: {
    height: 50,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: 'black',
  },
  dropdownContainer: {
    marginTop: 10,
    borderRadius: 8,
    maxHeight: 180,
  },
  dropdownItem: {
    padding: 10,
  },
  itemText: {
    color: 'black',
  },
  selectedItem: {
    fontWeight: 'bold',
  },
  selectedContainer: {
    marginTop: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  selectedItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    padding: 8,
    margin: 5,
    height: 40,
  },
  selectedItemText: {
    color: 'black',
    marginRight: 8,
    fontSize: fontSize(16),
    lineHeight: 24,
    fontFamily: fontFamily.poppins400,
  },
  cancelButton: {
    backgroundColor: '#5F6368',
    borderRadius: 15,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelIcon: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
});
export default DatingHobbiesScreen;
