import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers'; // Ensure you have these utils
import {icons} from '../../assets'; // Assuming icons are defined for your assets
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors} from '../../utils/colors'; // Ensure you have colors defined

const NewBottomSheetSingleValueSelect = ({
  label,
  options = [],
  onSelect,
  bottomSheetHeight,
}) => {
  const [selectedValue, setSelectedValue] = useState(null); // State to store the selected value
  const bottomSheetRef = useRef(null); // Reference to the bottom sheet

  // Function to open the bottom sheet
  const openBottomSheet = () => {
    bottomSheetRef.current.open();
  };

  // Function to handle value selection from the bottom sheet
  const handleSelect = value => {
    setSelectedValue(value); // Set the selected value

    // Update parent state if onSelect is defined
    if (onSelect) {
      onSelect(value);
    }

    // Delay closing the bottom sheet slightly to avoid race conditions
    setTimeout(() => {
      bottomSheetRef.current.close();
    }, 100);
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      {/* TextInput and dropdown icon container */}
      <TouchableOpacity
        onPress={openBottomSheet}
        style={styles.textInputContainer}>
        <TextInput
          placeholder={label || 'Select an option'}
          value={selectedValue || ''} // Display the selected value
          style={styles.textInput}
          editable={false} // Make it non-editable to only open the bottom sheet on press
          placeholderTextColor={'black'}
        />
        <Image
          source={icons.drooDownLogo} // Update the image source as needed
          style={styles.dropdownIconStyle}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Bottom Sheet Component */}
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={bottomSheetHeight}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            backgroundColor: 'white',
          },
        }}>
        {/* Content inside the Bottom Sheet */}
        <View>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(option)} // Call handleSelect to select value
              style={styles.option}>
              <Text
                style={[
                  styles.optionText,
                  selectedValue === option && {color: colors.black}, // Highlight selected option
                ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C0C0C0',
    width: '100%',
    height: 50,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: fontSize(18),
    color: 'black',
    lineHeight: hp(27),
    fontFamily: fontFamily.poppins500,
  },
  dropdownIconStyle: {
    height: 6,
    width: 10,
    tintColor: '#5F6368',
    transform: [{rotate: '-90deg'}],
    marginRight: 10,
  },
  option: {
    marginHorizontal: 17,
  },
  optionText: {
    padding: 10,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamily.poppins500,
    color: colors.black,
  },
});

export default NewBottomSheetSingleValueSelect;
