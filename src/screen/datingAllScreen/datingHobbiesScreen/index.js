import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';
import NewMultiSelectValueComponent from '../../../components/newMultiSelectValueComponent';

const DatingHobbiesScreen = ({selectedItems, setSelectedItems}) => {
  const options = [
    'Writing',
    'Play Instrument',
    'Poetry',
    'Cooking',
    'Painting',
    'Gardening',
    'Singing',
    'Diy Crafts',
    'Blogging',
    'Photography',
    'Dancing',
    'Content Creation',
    'Movie',
    'Sports',
    'Biking',
    'Music',
    'Social Media',
    'Clubbing',
    'Travelling',
    'Gaming',
    'Shopping',
    'Reading',
    'Binge Watching',
    'Theater Events',
    'Running',
    'Cycling',
    'Yoga',
    'Walking',
    'Working Out',
    'Trekking',
    'Aerobics Zumba',
    'Swimming',
  ];

  const [multiHobbiesStatus, setMultiHobbiesStatus] = useState([]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginHorizontal: 17}}>
        <NewMultiSelectValueComponent
          title="Add Hobbies"
          value={multiHobbiesStatus} // 👈 ARRAY
          dropdownData={options}
          onValueChange={value => {
            setMultiHobbiesStatus(value); // ✅ update UI
            setSelectedItems?.(value); // ✅ optional: update parent
          }}
          bottomSheetHeight={hp(500)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
export default DatingHobbiesScreen;
