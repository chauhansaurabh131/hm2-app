// import React, {useState} from 'react';
// import {
//   FlatList,
//   Image,
//   Keyboard,
//   SafeAreaView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
// import {colors} from '../../utils/colors';
// import {icons} from '../../assets';
//
// const HobbiesAndInterestScreen = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [inputText, setInputText] = useState('');
//
//   const options = [
//     {label: 'Writing', value: 'option1'},
//     {label: 'Play Instrument', value: 'option2'},
//     {label: 'Game', value: 'option3'},
//     {label: 'Movie', value: 'option4'},
//     {label: 'Sports', value: 'option5'},
//     {label: 'Running', value: 'option6'},
//     {label: 'Cycling', value: 'option7'},
//   ];
//
//   const filteredOptions = options.filter(option =>
//     option.label.toLowerCase().includes(inputText.toLowerCase()),
//   );
//
//   const handleSelect = item => {
//     if (
//       !selectedItems.find(selectedItem => selectedItem.value === item.value)
//     ) {
//       setSelectedItems([...selectedItems, item]);
//     }
//     setIsVisible(false);
//     setInputText('');
//     Keyboard.dismiss();
//   };
//
//   const handleInputChange = text => {
//     setInputText(text);
//     if (text.length > 0 && filteredOptions.length > 0) {
//       setIsVisible(true);
//     } else {
//       setIsVisible(false);
//     }
//   };
//
//   const handleSubmitEditing = () => {
//     if (inputText.trim().length > 0) {
//       setSelectedItems([
//         ...selectedItems,
//         {label: inputText, value: inputText.toLowerCase()},
//       ]);
//       setInputText('');
//       Keyboard.dismiss();
//     }
//   };
//
//   const handleRemoveItem = itemValue => {
//     setSelectedItems(selectedItems.filter(item => item.value !== itemValue));
//   };
//
//   // Group items into rows of 3
//   const groupItems = items => {
//     const rows = [];
//     for (let i = 0; i < items.length; i += 3) {
//       rows.push(items.slice(i, i + 3));
//     }
//     return rows;
//   };
//
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.textInput}
//           placeholder="Select Hobbies"
//           value={inputText}
//           onChangeText={handleInputChange}
//           onSubmitEditing={handleSubmitEditing} // Handle Enter key press
//           placeholderTextColor={colors.black}
//         />
//         <TouchableOpacity
//           style={styles.iconContainer}
//           onPress={() => setIsVisible(!isVisible)}>
//           <Image
//             source={icons.drooDownLogo}
//             style={{
//               width: hp(12),
//               height: hp(12),
//               marginRight: wp(15),
//               tintColor: colors.black,
//             }}
//           />
//         </TouchableOpacity>
//       </View>
//
//       {isVisible && filteredOptions.length > 0 && (
//         <View style={styles.dropdown}>
//           <FlatList
//             data={filteredOptions}
//             keyExtractor={item => item.value.toString()}
//             renderItem={({item}) => (
//               <TouchableOpacity
//                 style={styles.item}
//                 onPress={() => handleSelect(item)}>
//                 <Text style={styles.itemText}>{item.label}</Text>
//               </TouchableOpacity>
//             )}
//           />
//         </View>
//       )}
//
//       {selectedItems.length > 0 && (
//         <View style={styles.selectedOptionContainer}>
//           <FlatList
//             data={groupItems(selectedItems)}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({item}) => (
//               <View style={styles.row}>
//                 {item.map(subItem => (
//                   <View key={subItem.value} style={styles.selectedOptionItem}>
//                     <Text style={styles.selectedOptionText}>
//                       {subItem.label}
//                     </Text>
//                     <TouchableOpacity
//                       style={styles.cancelButton}
//                       onPress={() => handleRemoveItem(subItem.value)}>
//                       {/* Black Circle with Red X */}
//                       <View style={styles.circle}>
//                         <Text style={styles.cancelText}>X</Text>
//                       </View>
//                     </TouchableOpacity>
//                   </View>
//                 ))}
//               </View>
//             )}
//             numColumns={1} // Ensures rows are rendered vertically
//           />
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     paddingTop: 20,
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderBottomWidth: 1, // Set bottom border only
//     borderColor: '#ccc', // Bottom border color
//     backgroundColor: '#fff',
//     width: wp(350),
//     padding: 2,
//     marginBottom: hp(5),
//     height: hp(50),
//   },
//   textInput: {
//     flex: 1,
//     fontSize: fontSize(16),
//     color: '#333',
//     marginLeft: 15,
//   },
//   iconContainer: {
//     paddingLeft: 10,
//   },
//   dropdown: {
//     backgroundColor: '#fff',
//     borderRadius: 5,
//     width: wp(350),
//     maxHeight: 200,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     elevation: 5,
//     marginTop: 5,
//   },
//   item: {
//     padding: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   itemText: {
//     fontSize: fontSize(16),
//     color: '#333',
//   },
//   selectedOptionContainer: {
//     marginTop: hp(10),
//     width: wp(350),
//   },
//   row: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginBottom: hp(5),
//   },
//   selectedOptionItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginRight: wp(20),
//     borderColor: '#ccc',
//     borderRadius: 30, // Add border radius here
//     padding: 10,
//     backgroundColor: '#E8E9EB',
//     flex: 1,
//     maxWidth: '30%', // Ensures up to 3 items per row
//     height: hp(40),
//   },
//   selectedOptionText: {
//     flex: 1,
//     fontSize: fontSize(12),
//     color: '#333',
//   },
//   cancelButton: {
//     padding: 5,
//   },
//   circle: {
//     width: hp(18),
//     height: hp(18),
//     borderRadius: hp(9),
//     backgroundColor: '#5F6368',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   cancelText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: fontSize(12),
//   },
// });
//
// export default HobbiesAndInterestScreen;

import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {fontFamily, fontSize} from '../../utils/helpers';

const data = [
  {label: 'Writing', value: '1'},
  {label: 'Play Instrument', value: '2'},
  {label: 'Game', value: '3'},
  {label: 'Movie', value: '4'},
  {label: 'Sports', value: '5'},
  {label: 'Running', value: '6'},
  {label: 'Cycling', value: '7'},
];

const HobbiesAndInterestScreen = ({selectedItems = [], setSelectedItems}) => {
  // const [selectedItems, setSelectedItems] = useState([]);

  // Map selected items to labels
  const selectedLabels = selectedItems.map(item => item.label);

  // Log the selected labels
  console.log('Selected Labels:', selectedLabels.join(', '));

  const handleSelect = item => {
    const selectedLabel = item.label;
    const selectedValue = item.value;
    if (selectedItems.find(i => i.value === selectedValue)) {
      setSelectedItems(selectedItems.filter(i => i.value !== selectedValue));
    } else {
      setSelectedItems([
        ...selectedItems,
        {label: selectedLabel, value: selectedValue},
      ]);
    }
  };

  const removeItem = itemValue => {
    setSelectedItems(selectedItems.filter(i => i.value !== itemValue));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.wrapper}>
        <Dropdown
          style={styles.dropdown}
          data={data}
          labelField="label"
          valueField="value"
          placeholder="Select Hobbies"
          placeholderStyle={{
            color: 'black',
            fontSize: fontSize(18),
            lineHeight: 27,
            fontFamily: fontFamily.poppins500,
          }}
          value={selectedItems.map(item => item.value)} // Use the values of selected items
          onChange={item => handleSelect(item)}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={styles.dropdownContainer}
          multi
          renderItem={(item, selected) => (
            <View style={styles.dropdownItem}>
              <Text
                style={[styles.itemText, selected ? styles.selectedItem : {}]}>
                {item.label}
              </Text>
            </View>
          )}
          search={false} // Hide the search bar
        />
        {selectedLabels.length > 0 && (
          <View style={styles.selectedContainer}>
            {selectedLabels.map((label, index) => (
              <View key={index} style={styles.selectedItemContainer}>
                <Text style={styles.selectedItemText}>{label}</Text>
                <TouchableOpacity
                  onPress={() => removeItem(selectedItems[index].value)}>
                  <View style={styles.cancelButton}>
                    <Text style={styles.cancelIcon}>X</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  wrapper: {
    width: '100%',
  },
  dropdown: {
    height: 50,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingHorizontal: 8,
  },
  selectedTextStyle: {
    fontSize: 14,
    color: 'black',
  },
  dropdownContainer: {
    marginTop: 10,
    borderRadius: 8,
    maxHeight: 180,
  },
  dropdownItem: {
    padding: 10,
  },
  itemText: {
    color: 'black',
  },
  selectedItem: {
    fontWeight: 'bold',
  },
  selectedContainer: {
    marginTop: 10,
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  selectedItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 20,
    padding: 8,
    margin: 5,
    height: 40,
  },
  selectedItemText: {
    color: 'black',
    marginRight: 8,
    fontSize: fontSize(16),
    lineHeight: 24,
    fontFamily: fontFamily.poppins400,
  },
  cancelButton: {
    backgroundColor: '#5F6368',
    borderRadius: 15,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelIcon: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
});

export default HobbiesAndInterestScreen;
