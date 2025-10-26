import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors} from '../../utils/colors';
import {style} from './style';

const NewBottomSheetMultipleValueSelect = ({
  label,
  options = [],
  onSelect,
  bottomSheetHeight,
  maxSelections = 5,
  textInputStyle,
}) => {
  const [selectedValues, setSelectedValues] = useState([]);
  const bottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    bottomSheetRef.current.open();
  };

  const handleSelect = value => {
    const isSelected = selectedValues.includes(value);
    let updatedSelectedValues;

    if (isSelected) {
      // Remove if already selected
      updatedSelectedValues = selectedValues.filter(item => item !== value);
    } else {
      // Check max selection limit
      if (selectedValues.length >= maxSelections) {
        Alert.alert(
          'Maximum Selection Reached',
          `You can select a maximum of ${maxSelections} items.`,
          [{text: 'OK'}],
        );
        return;
      }
      updatedSelectedValues = [...selectedValues, value];
    }

    setSelectedValues(updatedSelectedValues);

    if (onSelect) {
      onSelect(updatedSelectedValues);
    }

    // ❌ Remove auto-close → Keep BottomSheet open
    // setTimeout(() => {
    //   bottomSheetRef.current.close();
    // }, 100);
  };

  const removeSelectedValue = value => {
    const updatedSelectedValues = selectedValues.filter(item => item !== value);
    setSelectedValues(updatedSelectedValues);

    if (onSelect) {
      onSelect(updatedSelectedValues);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      {/* Input field */}
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={openBottomSheet}
        style={style.textInputContainer}>
        <TextInput
          placeholder={label || 'Select options'}
          value={selectedValues.length === 0 ? '' : undefined}
          style={[style.textInput, textInputStyle]}
          editable={false}
          placeholderTextColor={'black'}
        />
        <Image
          source={icons.drooDownLogo}
          style={style.dropdownIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>

      {/* Chips */}
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

      {/* BottomSheet */}
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={bottomSheetHeight}
        customStyles={{
          wrapper: {backgroundColor: 'rgba(0, 0, 0, 0.3)'},
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: 'white',
          },
        }}>
        <View>
          <ScrollView style={{marginBottom: hp(35)}}>
            {options.map((option, index) => {
              const isSelected = selectedValues.includes(option);
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelect(option)}
                  style={style.option}>
                  <Text
                    style={[
                      style.optionText,
                      isSelected && {color: 'gray'}, // ✅ only text color changes
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default NewBottomSheetMultipleValueSelect;
