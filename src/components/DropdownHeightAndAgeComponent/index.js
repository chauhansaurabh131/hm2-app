import React, {useState} from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Text,
  SafeAreaView,
} from 'react-native';
import {icons} from '../../assets';
import {fontFamily, fontSize, hp} from '../../utils/helpers';

const DropdownHeightAndAgeComponent = ({
  options,
  placeholder,
  selectedValue,
  setSelectedValue,
}) => {
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const toggleDropdown = () => {
    setDropdownVisible(prev => !prev);
  };

  const handleSelect = value => {
    setSelectedValue(value); // Update input value with selected option
    setDropdownVisible(false);
  };

  const handleInputChange = text => {
    // Allow only digits and limit to 3 characters
    const numericText = text.replace(/[^0-9]/g, '').slice(0, 3);
    setInputValue(numericText);
  };

  return (
    <SafeAreaView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={'gray'}
          value={selectedValue} // Bind the input value
          editable={false} // Make it read-only
        />
        <TouchableOpacity
          onPress={toggleDropdown}
          style={styles.imageContainer}>
          <Image source={icons.drooDownLogo} style={styles.image} />
        </TouchableOpacity>
      </View>

      {isDropdownVisible && (
        <View style={styles.dropdownContainer}>
          <FlatList
            data={options}
            keyExtractor={item => item}
            renderItem={({item}) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            )}
            nestedScrollEnabled={true}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderBottomColor: '#C0C0C0',
    borderBottomWidth: 1,
  },
  textInput: {
    flex: 1,
    height: '100%',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    color: 'black',
    fontSize: fontSize(18),
    lineHeight: hp(27),
    fontFamily: fontFamily.poppins500,
  },
  image: {
    width: hp(12), // Adjust size as needed
    height: hp(8), // Adjust size as needed
    tintColor: '#5F6368',
    resizeMode: 'contain',
  },
  imageContainer: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    top: -3,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: '#C0C0C0',
    width: '100%',
    backgroundColor: 'white',
    position: 'absolute',
    top: 50, // Adjust based on your layout
    zIndex: 99,
    marginTop: 10,
    borderRadius: 10,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: 'black',
  },
});

export default DropdownHeightAndAgeComponent;
