// import React from 'react';
// import {SafeAreaView, Text} from 'react-native';
//
// const DropdownHeightAndAgeComponent = () => {
//   return (
//     <SafeAreaView>
//       <Text>Text</Text>
//     </SafeAreaView>
//   );
// };
// export default DropdownHeightAndAgeComponent;

import React, {useState} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {colors} from '../../utils/colors';

const DropdownHeightAndAgeComponent = ({
  data,
  placeholder,
  dropdownContainer,
}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const ages = [
    {label: '25', value: '1'},
    {label: '26', value: '2'},
    {label: '27', value: '3'},
    {label: '28', value: '4'},
    {label: '29', value: '5'},
    {label: '30', value: '6'},
    // Add more age ranges as needed
  ];
  // const renderItem = item => {
  //   return (
  //     <View style={styles.item}>
  //       <Text style={styles.textItem}>{item.label}</Text>
  //     </View>
  //   );
  // };

  const renderItem = item => {
    const itemTextStyle = {
      ...styles.textItem,
      color: value === item.value ? 'black' : 'black', // Change text color to red if item is selected
    };

    return (
      <View style={styles.item}>
        <Text style={itemTextStyle}>{item.label}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Dropdown
        style={[styles.dropdown, dropdownContainer]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        iconColor={colors.blue}
        data={data}
        search={false}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setIsFocus(false);
        }}
        renderItem={renderItem}
        searchPlaceholder={'select'}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  dropdown: {
    width: 56,
    height: 36,
    borderColor: '#E6E6E6',
    borderWidth: 1,
    borderRadius: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: 'black',
    marginLeft: 8,
  },
  selectedTextStyle: {
    fontSize: 16,
    color: 'black',
    marginLeft: 8,
  },
  iconStyle: {
    width: 20,
    height: 20,
    marginRight: 3,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: 'black',
  },
  textItem: {
    fontSize: 18,
    padding: 10,
    textAlign: 'center',
  },
});

export default DropdownHeightAndAgeComponent;
