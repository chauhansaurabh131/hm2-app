import React, {useRef, useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';
import {fontSize} from '../../utils/helpers';

const Abc = () => {
  const bottomSheetRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(null); // Start as null to track no selection

  // Function to handle option selection
  const handleOptionSelect = option => {
    setSelectedOption(option); // Update selected option
    bottomSheetRef.current.close(); // Close the bottom sheet
  };

  // Function to handle "Add" button press
  const handleAddPress = () => {
    console.log('Selected option:', selectedOption); // Log selected option to the terminal
  };

  return (
    <SafeAreaView
      style={{marginHorizontal: 17, backgroundColor: 'white', flex: 1}}>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            marginTop: 50,
            width: '100%',
            height: 50,
            borderColor: '#E5E5E5',
            borderWidth: 1,
            borderRadius: 50,
            paddingLeft: 20,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => bottomSheetRef.current.open()} // Open the bottom sheet
        >
          <Text>{selectedOption || 'Open'}</Text>
          {/* Display selected option or "Open" */}
          <Image
            source={icons.drooDownLogo}
            style={{
              width: 13,
              height: 10,
              marginRight: 21,
              tintColor: colors.black,
            }}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={{
          marginTop: 50,
          width: '100%',
          height: 50,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: selectedOption ? 'black' : '#d3d3d3',
        }}
        onPress={handleAddPress} // Add onPress handler to log the selected option
        disabled={!selectedOption} // Disable button if no option is selected
      >
        <Text style={{fontSize: fontSize(24), color: 'white'}}>Add</Text>
      </TouchableOpacity>

      {/* Bottom Sheet */}
      <RBSheet
        ref={bottomSheetRef}
        height={300}
        openDuration={250}
        customStyles={{
          draggableIcon: {
            backgroundColor: '#ffffff',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <View style={{marginHorizontal: 17}}>
          <Text style={{fontSize: 18, marginBottom: 10}}>
            This is a Bottom Sheet
          </Text>

          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={() => handleOptionSelect('1 Month')}>
            <Text>1 Month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={() => handleOptionSelect('3 Month')}>
            <Text>3 Month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={() => handleOptionSelect('6 Month')}>
            <Text>6 Month</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{marginTop: 10}}
            onPress={() => handleOptionSelect('Till I activate')}>
            <Text>Till I activate</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default Abc;
