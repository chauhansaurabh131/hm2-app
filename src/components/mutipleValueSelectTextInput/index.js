import React, {useState} from 'react';
import {
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {style} from './style';

const MultipleValueSelectTextInput = ({
  placeholder = 'Select Item',
  maxItems = 5,
  value = [],
  onChange,
  textInputProps,
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddItem = () => {
    const newValue = inputValue.trim();
    if (!newValue) {
      return;
    }

    if (value.length >= maxItems) {
      Alert.alert(
        'Maximum Selection Reached',
        `You can select a maximum of ${maxItems} items.`,
      );
      return;
    }

    if (value.includes(newValue)) {
      Alert.alert('Duplicate Entry', `${newValue} is already added.`);
      return;
    }

    onChange([...value, newValue]);
    setInputValue('');
  };

  const handleRemoveItem = indexToRemove => {
    const updated = value.filter((_, index) => index !== indexToRemove);
    onChange(updated); // send updated list
  };

  return (
    <View>
      {/* Input with right arrow */}
      <View style={style.inputContainer}>
        <TextInput
          placeholder={placeholder}
          value={inputValue}
          onChangeText={setInputValue}
          onSubmitEditing={handleAddItem} // enter key
          style={[style.textInput, textInputProps]}
          placeholderTextColor="black"
          returnKeyType="done"
        />

        {/*<TouchableOpacity onPress={handleAddItem}>*/}
        {/*  <Image source={icons.drooDownLogo} style={styles.dropdownIcon} />*/}
        {/*</TouchableOpacity>*/}
      </View>

      {/* Bottom line */}
      <View style={style.bottomLine} />

      {/* Show selected items */}
      <View style={style.itemsContainer}>
        {value.map((item, index) => (
          <View key={index} style={style.itemBox}>
            <Text style={style.itemText}>{item}</Text>
            <TouchableOpacity
              style={style.removeBtn}
              onPress={() => handleRemoveItem(index)}>
              <Text style={style.removeText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MultipleValueSelectTextInput;
