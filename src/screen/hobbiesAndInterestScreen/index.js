import React, {useState} from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import DropDownMutipleValueComponent from '../../components/DropDownMutipleValueComponent';
import {icons} from '../../assets';

const HobbiesAndInterestScreen = ({
  selectedCreative,
  setSelectedCreative,
  selectedFun,
  setSelectedFun,
  selectedFitness,
  setSelectedFitness,
}) => {
  // const [selectedCreative, setSelectedCreative] = useState([]);
  // const [selectedFun, setSelectedFun] = useState([]);
  // const [selectedFitness, setSelectedFitness] = useState([]);
  // const [selectedValues, setSelectedValues] = useState('');
  //
  // const CREATIVE = [
  //   {label: 'Writing', value: '1'},
  //   {label: 'Play Instrument', value: '2'},
  //   {label: 'Game', value: '3'},
  //   // ... other options
  // ];
  //
  // const FUN = [
  //   {label: 'Movie', value: '1'},
  //   {label: 'Sports', value: '2'},
  //   // ... other options
  // ];
  //
  // const FITNESS = [
  //   {label: 'Running', value: '1'},
  //   {label: 'Cycling', value: '2'},
  //   // ... other options
  // ];

  const [isVisible, setIsVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [inputText, setInputText] = useState('');

  const options = [
    {label: 'Writing', value: 'option1'},
    {label: 'Play Instrument', value: 'option2'},
    {label: 'Game', value: 'option3'},
    {label: 'Movie', value: 'option4'},
    {label: 'Sports', value: 'option5'},
    {label: 'Running', value: 'option6'},
    {label: 'Cycling', value: 'option7'},
  ];

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputText.toLowerCase()),
  );

  const handleSelect = item => {
    if (
      !selectedItems.find(selectedItem => selectedItem.value === item.value)
    ) {
      setSelectedItems([...selectedItems, item]);
    }
    setIsVisible(false);
    setInputText('');
    Keyboard.dismiss();
  };

  const handleInputChange = text => {
    setInputText(text);
    if (text.length > 0 && filteredOptions.length > 0) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const handleSubmitEditing = () => {
    if (inputText.trim().length > 0) {
      setSelectedItems([
        ...selectedItems,
        {label: inputText, value: inputText.toLowerCase()},
      ]);
      setInputText('');
      Keyboard.dismiss();
    }
  };

  const handleRemoveItem = itemValue => {
    setSelectedItems(selectedItems.filter(item => item.value !== itemValue));
  };

  // Group items into rows of 3
  const groupItems = items => {
    const rows = [];
    for (let i = 0; i < items.length; i += 3) {
      rows.push(items.slice(i, i + 3));
    }
    return rows;
  };

  // return (
  //   <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
  //     <View style={{marginHorizontal: wp(17)}}>
  //       <Text
  //         style={{
  //           color: colors.black,
  //           fontSize: fontSize(14),
  //           lineHeight: hp(18),
  //           fontFamily: fontFamily.poppins600,
  //           marginTop: hp(20),
  //           marginBottom: hp(11),
  //         }}>
  //         Creative
  //       </Text>
  //       <DropDownMutipleValueComponent
  //         data={CREATIVE}
  //         selectedItems={selectedCreative}
  //         setSelectedItems={setSelectedCreative} // Pass setSelectedCreative function
  //         height={50}
  //       />
  //
  //       <Text
  //         style={{
  //           color: colors.black,
  //           fontSize: fontSize(14),
  //           lineHeight: hp(18),
  //           fontFamily: fontFamily.poppins600,
  //           marginTop: hp(15),
  //           marginBottom: hp(11),
  //         }}>
  //         Fun
  //       </Text>
  //       <DropDownMutipleValueComponent
  //         data={FUN}
  //         selectedItems={selectedFun}
  //         setSelectedItems={setSelectedFun}
  //         height={50}
  //       />
  //
  //       <Text
  //         style={{
  //           color: colors.black,
  //           fontSize: fontSize(14),
  //           lineHeight: hp(18),
  //           fontFamily: fontFamily.poppins600,
  //           marginTop: hp(15),
  //           marginBottom: hp(11),
  //         }}>
  //         Fitness
  //       </Text>
  //       <DropDownMutipleValueComponent
  //         data={FITNESS}
  //         selectedItems={selectedFitness}
  //         setSelectedItems={setSelectedFitness}
  //         height={50}
  //       />
  //     </View>
  //   </SafeAreaView>
  // );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder="Select Hobbies"
          value={inputText}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSubmitEditing} // Handle Enter key press
          placeholderTextColor={colors.black}
        />
        <TouchableOpacity
          style={styles.iconContainer}
          onPress={() => setIsVisible(!isVisible)}>
          {/*<Icon name="arrow-drop-down" size={30} color="#333" />*/}
          <Image
            source={icons.drooDownLogo}
            style={{
              width: hp(12),
              height: hp(12),
              marginRight: wp(15),
              tintColor: colors.black,
            }}
          />
        </TouchableOpacity>
      </View>

      {isVisible && filteredOptions.length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            data={filteredOptions}
            keyExtractor={item => item.value.toString()}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handleSelect(item)}>
                <Text style={styles.itemText}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {selectedItems.length > 0 && (
        <View style={styles.selectedOptionContainer}>
          <FlatList
            data={groupItems(selectedItems)}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <View style={styles.row}>
                {item.map(subItem => (
                  <View key={subItem.value} style={styles.selectedOptionItem}>
                    <Text style={styles.selectedOptionText}>
                      {subItem.label}
                    </Text>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={() => handleRemoveItem(subItem.value)}>
                      {/*<Icon name="cancel" size={20} color="#ff0000" />*/}
                      <Image
                        source={icons.x_cancel_icon}
                        style={{width: hp(10), height: hp(10)}}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
            numColumns={1} // Ensures rows are rendered vertically
          />
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: hp(20),
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    backgroundColor: '#fff',
    width: wp(350),
    padding: 2,
    marginBottom: hp(5),
    height: hp(50),
  },
  textInput: {
    flex: 1,
    fontSize: fontSize(16),
    color: '#333',
    marginLeft: wp(15),
  },
  iconContainer: {
    paddingLeft: wp(10),
  },
  dropdown: {
    backgroundColor: '#fff',
    borderRadius: 5,
    width: wp(350),
    maxHeight: 200,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 5,
    marginTop: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: fontSize(16),
    color: '#333',
  },
  selectedOptionContainer: {
    marginTop: hp(10),
    width: wp(350),
  },
  selectedOptionHeader: {
    fontSize: fontSize(16),
    fontWeight: 'bold',
    marginBottom: hp(5),
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: hp(5),
  },
  selectedOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: wp(20),
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#E8E9EB',
    flex: 1,
    maxWidth: '30%', // Ensures up to 3 items per row
    height: hp(50),
  },
  selectedOptionText: {
    flex: 1,
    fontSize: fontSize(12),
    color: '#333',
  },
  cancelButton: {
    padding: 5,
  },
});

export default HobbiesAndInterestScreen;
