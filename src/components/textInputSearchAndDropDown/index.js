import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Image, Text} from 'react-native';
import {colors} from '../../utils/colors';

const TextInputSearchAndDropDowm = ({
  dropdownItems,
  placeholder,
  value,
  onChangeText,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTextInputFocused, setIsTextInputFocused] = useState(false);
  const [filteredDropdownItems, setFilteredDropdownItems] =
    useState(dropdownItems);

  const handleDropdownPress = () => {
    setShowDropdown(!showDropdown);
  };

  const handleTextInputFocus = () => {
    setIsTextInputFocused(true);
    setShowDropdown(true); // Always show dropdown on focus
  };

  const handleTextInputBlur = () => {
    setIsTextInputFocused(false);
  };

  const handleTextInputChange = text => {
    onChangeText(text);

    const filteredItems = dropdownItems.filter(item =>
      item.toLowerCase().includes(text.toLowerCase()),
    );

    if (filteredItems.length === 0) {
      setShowDropdown(false);
    } else {
      setFilteredDropdownItems(filteredItems);
      setShowDropdown(true);
    }
  };

  const handleDropdownItemPress = item => {
    onChangeText(item);
    setShowDropdown(false); // Close the dropdown after selecting an item
  };

  return (
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 10,
            padding: 12,
            width: '100%',
            height: 50,
            borderColor: colors.lightGreyBorder,
            color: 'black',
          }}
          placeholder={placeholder}
          value={value}
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
        <View
          style={{
            position: 'absolute',
            width: '100%',
            top: 70,
            zIndex: 1,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            maxHeight: 200,
          }}>
          {filteredDropdownItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleDropdownItemPress(item)}
              style={{padding: 10, borderBottomWidth: 1, borderColor: '#ccc'}}>
              <Text style={{color: colors.black}}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default TextInputSearchAndDropDowm;
