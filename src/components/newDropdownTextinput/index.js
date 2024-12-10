import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Animated,
  TextInput,
  ScrollView,
} from 'react-native';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import RBSheet from 'react-native-raw-bottom-sheet';

const NewDropDownTextInput = ({
  placeholder,
  dropdownData = [],
  onValueChange,
  bottomSheetHeight = 300, // Default height for the bottom sheet
}) => {
  const [value, setValue] = useState('');
  const [isFocused, setFocused] = useState(false);
  const refRBSheet = useRef(null);

  // Create animated state for the floating label
  const labelPosition = new Animated.Value(value ? 1 : 0);

  const handleFocus = () => {
    setFocused(true);
    // Open bottom sheet when clicking on TextInput
    if (refRBSheet.current) {
      refRBSheet.current.open();
    } else {
      console.log('Bottom sheet ref is null');
    }

    Animated.timing(labelPosition, {
      toValue: 1, // Move label to the top
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setFocused(false);
    if (!value) {
      Animated.timing(labelPosition, {
        toValue: 0, // Move label back down
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSelectOption = item => {
    setValue(item);
    refRBSheet.current.close(); // Close bottom sheet after selecting an option
    Animated.timing(labelPosition, {
      toValue: 1, // Keep label at the top
      duration: 200,
      useNativeDriver: false,
    }).start();
    if (onValueChange) {
      onValueChange(item); // Call the parent's function when value changes
    }
  };

  const labelStyle = {
    position: 'absolute',
    top: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [20, -10], // Move the label up when value is selected or input is focused
    }),
    fontSize: labelPosition.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 12], // Reduce font size when moving the label up
    }),
    color: isFocused || value ? 'gray' : 'black', // Change label color on focus
  };

  return (
    <View style={styles.inputContainer}>
      {/* Floating label */}
      <Animated.Text style={labelStyle}>{placeholder}</Animated.Text>

      {/* Wrap TextInput in TouchableOpacity to open the bottom sheet */}
      <TouchableOpacity onPress={handleFocus} activeOpacity={1}>
        <TextInput
          style={styles.input}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="transparent" // Hide default placeholder text
          editable={false} // Prevent typing inside the TextInput
          pointerEvents="none" // Disable interactions with TextInput
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.icon} onPress={handleFocus}>
        <Image source={icons.drooDownLogo} style={styles.iconStyle} />
      </TouchableOpacity>

      {/* Bottom sheet */}
      <RBSheet
        ref={refRBSheet}
        height={bottomSheetHeight} // Use dynamic height for bottom sheet
        closeOnDragDown={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <View style={styles.dropdownContainer}>
          <ScrollView style={{marginBottom: 25}}>
            {dropdownData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleSelectOption(item)}>
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={{height: 10}} />
        </View>
      </RBSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative', // Ensure the label is overlaid on the input
  },
  input: {
    height: 50,
    borderColor: '#C0C0C0',
    borderBottomWidth: 1, // Only bottom border
    width: '100%',
    paddingLeft: 0,
    paddingRight: 35, // Space for the icon on the right side
    color: 'black',
    fontSize: fontSize(20),
    lineHeight: 30, // Ensure hp(30) returns a valid number
    fontFamily: 'poppins_medium', // Ensure this font family is correctly loaded
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: 25,
  },
  iconStyle: {
    height: 6,
    width: 10,
    tintColor: colors.black,
    transform: [{rotate: '-90deg'}],
  },
  dropdownContainer: {
    backgroundColor: 'white',
    borderColor: 'gray',
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 17,
  },
  dropdownText: {
    color: 'black',
    fontSize: fontSize(16),
    lineHeight: 24,
    fontFamily: fontFamily.poppins500,
  },
});

export default NewDropDownTextInput;
