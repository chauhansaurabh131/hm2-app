// import React, {useState} from 'react';
// import {View, TextInput, TouchableOpacity, Image, Text} from 'react-native';
// import {colors} from '../../utils/colors';
// import {hp, wp} from '../../utils/helpers';
//
// const TextInputWithDropDownComponent = ({
//   textInput,
//   dropdownIconContainer,
//   dropdownListContainer,
//   dropdownItem,
// }) => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [isTextInputFocused, setIsTextInputFocused] = useState(false);
//   const [textInputValue, setTextInputValue] = useState('');
//
//   const handleDropdownPress = () => {
//     setShowDropdown(!showDropdown);
//   };
//
//   const handleItemSelected = item => {
//     if (item === selectedItem) {
//       setSelectedItem(null);
//       setTextInputValue('');
//     } else {
//       setSelectedItem(item);
//       setTextInputValue(item);
//     }
//     setShowDropdown(false);
//   };
//
//   const handleTextInputFocus = () => {
//     setIsTextInputFocused(true);
//   };
//
//   const handleTextInputBlur = () => {
//     if (isTextInputFocused) {
//       setSelectedItem(null);
//       setIsTextInputFocused(false);
//     }
//   };
//
//   const handleTextInputChange = text => {
//     setTextInputValue(text);
//     setSelectedItem(null);
//   };
//
//   const styles = {
//     container: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       marginTop: 7,
//       // padding: hp(10),
//       // marginTop: hp(50),
//     },
//     textInput: {
//       flex: 1,
//       borderWidth: 1,
//       borderRadius: hp(10),
//       padding: hp(10),
//       // width: wp(339),
//       width: '100%',
//       height: hp(50),
//       borderColor: colors.blue,
//     },
//     dropdownIconContainer: {
//       marginLeft: hp(-35),
//       width: hp(30),
//       height: hp(30),
//       justifyContent: 'center',
//       alignItems: 'center',
//       transform: [{rotate: showDropdown ? '180deg' : '0deg'}],
//     },
//     dropdownIcon: {
//       width: hp(10.36),
//       height: hp(6),
//     },
//     dropdownListContainer: {
//       position: 'absolute',
//       width: wp(339),
//       top: hp(70),
//       left: wp(10),
//       zIndex: 1,
//       backgroundColor: 'white',
//       padding: hp(10),
//       borderRadius: hp(10),
//       borderWidth: 1,
//       borderColor: '#ccc',
//     },
//     dropdownItem: {
//       padding: hp(10),
//       borderBottomWidth: 1,
//       borderColor: '#ccc',
//       colors: colors.black,
//     },
//   };
//
//   const dropdownItems = ['Item 1', 'Item 2', 'Item 3'];
//
//   return (
//     <View style={styles.container}>
//       <TextInput
//         style={[styles.textInput, textInput]}
//         placeholder="Select"
//         value={selectedItem !== null ? selectedItem : textInputValue}
//         onFocus={handleTextInputFocus}
//         onBlur={handleTextInputBlur}
//         onChangeText={handleTextInputChange}
//         placeholderTextColor={'black'}
//       />
//
//       <TouchableOpacity onPress={handleDropdownPress}>
//         <View style={[styles.dropdownIconContainer, dropdownIconContainer]}>
//           <Image
//             source={require('../../assets/icons/dropDown_Down_logo.png')}
//             style={styles.dropdownIcon}
//           />
//         </View>
//       </TouchableOpacity>
//
//       {showDropdown && (
//         <View style={[styles.dropdownListContainer, dropdownListContainer]}>
//           {dropdownItems.map((item, index) => (
//             <TouchableOpacity
//               key={index}
//               onPress={() => handleItemSelected(item)}
//               style={[styles.dropdownItem, dropdownItem]}>
//               <Text style={{color: colors.black}}>{item}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// };
//
// export default TextInputWithDropDownComponent;

import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Image, Text} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {colors} from '../../utils/colors';
import {hp, wp} from '../../utils/helpers';
import Autocomplete from 'react-native-dropdown-autocomplete-textinput/autoComplete/Autocomplete';

const TextInputWithDropDownComponent = ({dropdownItems}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isTextInputFocused, setIsTextInputFocused] = useState(false);
  const [textInputValue, setTextInputValue] = useState('');

  const handleDropdownPress = () => {
    setShowDropdown(!showDropdown);
  };

  const handleItemSelected = item => {
    setSelectedItem(item);
    setTextInputValue(item);
    setShowDropdown(false);
  };

  const handleTextInputFocus = () => {
    setIsTextInputFocused(true);
    setShowDropdown(true); // Always show dropdown on focus
  };

  const handleTextInputBlur = () => {
    setIsTextInputFocused(false);
  };

  const handleTextInputChange = text => {
    setTextInputValue(text);
    setSelectedItem(null); // Clear selected item when typing
    setShowDropdown(true); // Always show dropdown on typing
  };

  return (
    <View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 7}}>
        <TextInput
          style={{
            flex: 1,
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            width: '100%',
            height: 50,
            borderColor: colors.lightGreyBorder,
          }}
          placeholder="Select"
          value={selectedItem !== null ? selectedItem : textInputValue}
          onFocus={handleTextInputFocus}
          onBlur={handleTextInputBlur}
          onChangeText={handleTextInputChange}
          placeholderTextColor={colors.black}
        />

        <TouchableOpacity onPress={handleDropdownPress}>
          <View
            style={{
              marginLeft: -35,
              width: 30,
              height: 30,
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
        <FlatList
          style={{
            maxHeight: 300,
            position: 'absolute',
            width: wp(339),
            top: 70,
            left: wp(10),
            zIndex: 1,
            backgroundColor: 'white',
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ccc',
          }}
          data={[...dropdownItems, ...dropdownItems]}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleItemSelected(item)}
                style={styles.dropdownItem}>
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    width: '100%',
    height: 50,
    borderColor: colors.lightGreyBorder,
  },
  dropdownIconContainer: {
    marginLeft: -35,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownIcon: {
    width: 10.36,
    height: 6,
  },
  dropdownListContainer: {
    position: 'absolute',
    width: wp(339),
    top: 70,
    left: wp(10),
    zIndex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  dropdownItemText: {
    color: colors.black,
  },
};

export default TextInputWithDropDownComponent;
