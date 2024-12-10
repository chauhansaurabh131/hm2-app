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
import {colors} from '../../utils/colors';
import {style} from './style'; // Ensure you have colors defined

const NewBottomSheetMultipleValueSelect = ({
  label,
  options = [],
  onSelect,
  bottomSheetHeight,
}) => {
  const [selectedValues, setSelectedValues] = useState([]); // State to store selected values
  const bottomSheetRef = useRef(null); // Reference to the bottom sheet

  // Function to open the bottom sheet
  const openBottomSheet = () => {
    bottomSheetRef.current.open();
  };

  // Function to handle value selection from the bottom sheet
  const handleSelect = value => {
    const updatedSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter(item => item !== value) // Remove if already selected
      : [...selectedValues, value]; // Add if not selected

    setSelectedValues(updatedSelectedValues);

    // Only update parent state if onSelect is defined
    if (onSelect) {
      onSelect(updatedSelectedValues);
    }

    // Delay closing the bottom sheet slightly to avoid race conditions
    setTimeout(() => {
      bottomSheetRef.current.close();
    }, 100);
  };

  // Function to remove a selected value
  const removeSelectedValue = value => {
    const updatedSelectedValues = selectedValues.filter(item => item !== value);
    setSelectedValues(updatedSelectedValues);

    if (onSelect) {
      onSelect(updatedSelectedValues);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      {/* TextInput and dropdown icon container */}
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={openBottomSheet}
        style={style.textInputContainer}>
        <TextInput
          placeholder={label || 'Select options'}
          value={selectedValues.length === 0 ? '' : undefined} // Show placeholder if no value is selected
          style={style.textInput}
          editable={false} // Make it non-editable to only open the bottom sheet on press
          placeholderTextColor={'black'}
        />
        <Image
          source={icons.drooDownLogo} // Update the image source as needed
          style={style.dropdownIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Display selected values as chips below the TextInput */}
      <View style={style.selectedValuesContainer}>
        {selectedValues.map((value, index) => (
          <View key={`${value}-${index}`} style={style.chip}>
            <Text style={style.chipText}>{value}</Text>
            <TouchableOpacity
              style={style.removeChipButton}
              onPress={() => removeSelectedValue(value)}>
              <Text style={style.removeChipText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Bottom Sheet Component */}
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        // height={hp(350)}
        height={bottomSheetHeight}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: 'white',
          },
        }}>
        {/* Content inside the Bottom Sheet */}
        <View>
          {options.map((option, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelect(option)} // Call handleSelect to select value
              style={style.option}>
              <Text style={style.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default NewBottomSheetMultipleValueSelect;
