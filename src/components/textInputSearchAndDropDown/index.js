import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Image, Text} from 'react-native';
import {colors} from '../../utils/colors';
import {hp, wp} from '../../utils/helpers';
import {ScrollView} from 'react-native-gesture-handler';

const TextInputSearchAndDropDowm = ({dropdownItems, placeholder}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isTextInputFocused, setIsTextInputFocused] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');
  const [filteredDropdownItems, setFilteredDropdownItems] =
    useState(dropdownItems);

  const handleDropdownPress = () => {
    setShowDropdown(!showDropdown);
  };

  const handleItemSelected = item => {
    setSelectedItem(item);
    setTextInputValue(item);
    setShowDropdown(false);
  };

  const handleTextInputFocus = () => {
    setIsTextInputFocused(true);
    setShowDropdown(true); // Always show dropdown on focus
  };

  const handleTextInputBlur = () => {
    setIsTextInputFocused(false);
  };

  const handleTextInputChange = text => {
    setTextInputValue(text);
    setSelectedItem(null); // Clear selected item when typing

    // Filter dropdown items based on the search text
    const filteredItems = dropdownItems.filter(item =>
      item.toLowerCase().includes(text.toLowerCase()),
    );

    // Check if there are any filtered items
    if (filteredItems.length === 0) {
      setShowDropdown(false); // Hide dropdown if there are no matches
    } else {
      setFilteredDropdownItems(filteredItems);
      setShowDropdown(true); // Show dropdown if there are matches
    }
  };

  return (
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 7}}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 10,
            padding: 12,
            width: '100%',
            height: 50,
            borderColor: colors.lightGreyBorder,
            // borderColor: 'red',
            color: 'black',
          }}
          // placeholder="Select"
          placeholder={placeholder}
          value={selectedItem !== null ? selectedItem : textInputValue}
          onFocus={handleTextInputFocus}
          onBlur={handleTextInputBlur}
          onChangeText={handleTextInputChange}
          placeholderTextColor={colors.black}
        />

        <TouchableOpacity onPress={handleDropdownPress}>
          <View
            style={{
              marginLeft: -40,
              width: 40,
              height: 40,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../assets/icons/dropDown_Down_logo.png')}
              style={{width: 10.36, height: 6}}
            />
          </View>
        </TouchableOpacity>
      </View>

      {showDropdown && (
        <>
          <ScrollView
            style={{
              position: 'absolute',
              // width: wp(350),
              width: '100%',
              top: 70,
              // left: wp(10),
              zIndex: 1,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#ccc',
              maxHeight: 200, // Set a maximum height to enable scrolling
            }}>
            {filteredDropdownItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleItemSelected(item)}
                style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={{height: 200}} />
        </>
      )}
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '100%',
    height: 50,
    borderColor: colors.lightGreyBorder,
  },
  dropdownIconContainer: {
    marginLeft: -35,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIcon: {
    width: 10.36,
    height: 6,
  },
  dropdownListContainer: {
    position: 'absolute',
    width: wp(339),
    top: 70,
    left: wp(10),
    zIndex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  dropdownItemText: {
    color: colors.black,
  },
};

export default TextInputSearchAndDropDowm;
