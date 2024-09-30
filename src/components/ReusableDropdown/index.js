import React, {useState} from 'react';
import {
  View,
  TextInput,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
} from 'react-native';
import {hp, wp} from '../../utils/helpers';
import {icons} from '../../assets'; // Assuming icons are in the assets

const ReusableDropdown = ({
  dropdownValues = [],
  placeholder = 'Select',
  selectedValue,
  onValueChange,
  dropdownHeight = hp(60), // To adjust the dropdown height
}) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const selectValue = value => {
    onValueChange(value);
    setIsDropdownVisible(false);
  };

  return (
    <View style={{position: 'relative', width: '100%'}}>
      {/* Touchable to open the dropdown */}
      <TouchableWithoutFeedback onPress={toggleDropdown}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TextInput
            value={selectedValue}
            editable={false} // Make the TextInput non-editable to avoid keyboard pop-up
            style={{
              width: '100%',
              height: hp(50),
              borderBottomWidth: 1, // Only bottom border
              borderColor: '#C0C0C0',
              paddingRight: wp(10), // Add padding to make space for the image
              color: 'black',
            }}
            placeholder={placeholder}
            placeholderTextColor={'black'}
          />

          {/* Dropdown arrow image inside TextInput aligned to the right */}
          <Image
            source={icons.drooDownLogo} // Replace with your image path
            style={{
              position: 'absolute',
              right: 10,
              top: '50%',
              transform: [{translateY: -12}], // Adjust to center vertically based on image height
              width: hp(12),
              height: hp(18),
              resizeMode: 'contain',
              tintColor: '#5F6368',
            }}
            resizeMode="contain"
          />
        </View>
      </TouchableWithoutFeedback>

      {/* Dropdown values list */}
      {isDropdownVisible && (
        <View
          style={{
            position: 'absolute',
            top: dropdownHeight, // Dropdown appears just below the TextInput
            width: '100%',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#ccc',
            zIndex: 1,
            borderRadius: 10,
          }}>
          <FlatList
            data={dropdownValues}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => selectValue(item)}>
                <Text
                  style={{
                    padding: hp(10),
                    borderBottomWidth: 1,
                    borderBottomColor: '#ccc',
                    color: 'black',
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default ReusableDropdown;
