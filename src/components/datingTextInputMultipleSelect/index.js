import React, {useState} from 'react';
import {
  SafeAreaView,
  TextInput,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {hp} from '../../utils/helpers'; // Assuming you have a helper function for height
import {colors} from '../../utils/colors';
import {icons} from '../../assets'; // Assuming your color constants are stored here

const DatingTextInputMultipleSelect = ({
  options = [],
  selectedValues = [], // Ensure selectedValues defaults to an empty array
  onOptionSelect = () => {},
  onRemoveValue = () => {},
  placeholder = 'Select',
  dropdownIcon,
  fontFamily,
  fontSize,
}) => {
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const handleTextInputPress = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <SafeAreaView>
      <View style={{position: 'relative', width: '100%'}}>
        <TouchableOpacity onPress={handleTextInputPress}>
          <TextInput
            style={{
              width: '100%',
              height: hp(50),
              borderWidth: 1,
              borderColor: '#C0C0C0',
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
              paddingRight: 40,
              fontSize: fontSize || 16,
              lineHeight: hp(27),
              fontFamily: fontFamily || 'System',
            }}
            editable={false}
            placeholder={placeholder}
            placeholderTextColor={'black'}
            pointerEvents="none"
          />

          <Image
            source={icons.drooDownLogo}
            style={{
              position: 'absolute',
              right: 12,
              top: hp(12),
              width: hp(12),
              height: hp(18),
              resizeMode: 'contain',
              tintColor: '#5F6368',
            }}
          />
        </TouchableOpacity>

        {dropdownVisible && (
          <View style={styles.dropdown}>
            <FlatList
              data={options}
              keyExtractor={item => item}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => {
                    onOptionSelect(item);
                    setDropdownVisible(false);
                  }}>
                  <Text style={{color: 'black'}}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {/* Ensure selectedValues is an array */}
        <View style={styles.selectedValuesContainer}>
          {Array.isArray(selectedValues) &&
            selectedValues.map((value, index) => (
              <View key={index} style={styles.selectedValueBox}>
                <Text style={styles.selectedValueText}>{value}</Text>
                <TouchableOpacity
                  style={styles.removeButtonContainer}
                  onPress={() => onRemoveValue(value)}>
                  <Text style={styles.cancelIcon}>X</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    position: 'absolute',
    top: hp(50),
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#C0C0C0',
    borderWidth: 1,
    zIndex: 999, // Ensure dropdown is above other content
  },
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
  },
  selectedValuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  selectedValueBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    padding: 10,
    margin: 5,
    borderRadius: 50,
    height: hp(40),
  },
  selectedValueText: {
    color: 'black',
    marginRight: 10,
  },
  cancelIcon: {
    color: colors.white,
    fontSize: 11,
    textAlign: 'center',
  },
  removeButtonContainer: {
    backgroundColor: '#5F6368',
    width: 15,
    height: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DatingTextInputMultipleSelect;
