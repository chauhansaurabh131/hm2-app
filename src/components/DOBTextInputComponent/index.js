import React, {useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import DatePicker from 'react-native-date-picker'; // Import the DatePicker
import {fontFamily, fontSize, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors'; // Use your own helper functions

const DOBTextInputComponent = ({
  label,
  value,
  onChangeText,
  showUnit,
  showUnitText,
  imageSource, // Add an imageSource prop for the image
  ...props
}) => {
  const [isFocused, setFocused] = useState(false);
  const [open, setOpen] = useState(false); // State to manage the DatePicker modal
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const currentYear = new Date().getFullYear(); // Get the current year
  const maxDate = new Date(currentYear, 11, 31); // Set the maximum date to December 31 of the current year

  // Dynamically set the label position and size based on focus and value
  const labelColor = isFocused || value ? 'gray' : 'black';
  const labelFontSize = isFocused || value ? 14 : 18;
  const labelTop = isFocused || value ? -15 : 10; // Properly define labelTop

  // Ensure day is valid (01-31), month is valid (01-12), and year is valid
  const validateDate = text => {
    let cleaned = text.replace(/[^0-9]/g, ''); // Remove all non-numeric characters

    if (cleaned.length <= 2) {
      // Limit day to 01-31
      const day = cleaned;
      if (parseInt(day, 10) > 31) {
        cleaned = '31'; // Force the day to be max 31
      } else if (parseInt(day, 10) < 1 && day.length === 2) {
        cleaned = '01'; // Force the day to be min 01
      }
    } else if (cleaned.length <= 4) {
      // Limit month to 01-12
      const day = cleaned.slice(0, 2);
      let month = cleaned.slice(2);
      if (parseInt(month, 10) > 12) {
        month = '12'; // Force the month to be max 12
      } else if (parseInt(month, 10) < 1 && month.length === 2) {
        month = '01'; // Force the month to be min 01
      }
      cleaned = `${day}${month}`;
    } else if (cleaned.length > 4) {
      // Allow any year but ensure day, month, and year are valid
      const day = cleaned.slice(0, 2);
      let month = cleaned.slice(2, 4);
      let year = cleaned.slice(4);

      // If the year exceeds the current year, force it to the current year
      if (parseInt(year, 10) > currentYear) {
        year = String(currentYear); // Set year to current year if exceeded
      }

      cleaned = `${day}${month}${year}`;
    }

    return cleaned;
  };

  const handleTextChange = text => {
    let validatedText = validateDate(text);

    // Format the value to DD/MM/YYYY
    if (validatedText.length <= 2) {
      onChangeText(validatedText); // Only day
    } else if (validatedText.length <= 4) {
      onChangeText(`${validatedText.slice(0, 2)}/${validatedText.slice(2)}`); // Day and month
    } else {
      onChangeText(
        `${validatedText.slice(0, 2)}/${validatedText.slice(
          2,
          4,
        )}/${validatedText.slice(4)}`, // Full date (DD/MM/YYYY)
      );
    }
  };

  // Handle the selection of the date from the date picker
  const handleSetDate = () => {
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = selectedDate.getFullYear().toString();

    const formattedDate = `${day}/${month}/${year}`;
    onChangeText(formattedDate); // Update TextInput with selected date
    setOpen(false); // Close the modal
  };

  return (
    <View style={styles.inputContainer}>
      {/* Floating label */}
      <Text
        style={[
          styles.label,
          {top: labelTop, color: labelColor, fontSize: labelFontSize},
        ]}>
        {label}
      </Text>

      <View style={styles.inputWrapper}>
        {/* Custom TextInput */}
        <TextInput
          style={styles.input}
          value={value}
          editable={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleTextChange}
          keyboardType="numeric" // Set the keyboard to numeric
          placeholder={isFocused ? 'DD/MM/YYYY' : ''} // Show placeholder only when focused
          placeholderTextColor={'#C0C0C0'}
          maxLength={10} // Max length is 10 (for DD/MM/YYYY)
          {...props}
        />
        {/* Conditionally render unit text */}
        {showUnit && <Text style={styles.unitText}>{showUnitText}</Text>}

        {/* Display Image on the right side */}
        {imageSource && (
          <TouchableOpacity onPress={() => setOpen(true)}>
            {/* Open date picker on image click */}
            <Image
              source={imageSource} // Pass image source from props
              style={styles.image} // Style for the image
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Date Picker Modal */}
      <Modal visible={open} transparent={true} animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setOpen(false)}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <View style={{marginTop: 40}}>
              <DatePicker
                date={selectedDate} // Selected date
                mode="date"
                maximumDate={maxDate} // Prevent dates beyond the current year
                onDateChange={setSelectedDate} // Update date in state when scrolling
                textColor={'black'}
              />
            </View>
            <TouchableOpacity
              style={styles.setDateButton}
              onPress={handleSetDate}>
              <Text style={styles.setDateButtonText}>Set Date</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    position: 'relative',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    paddingLeft: 0,
    paddingRight: 40, // Ensure padding for right side image
    color: 'black',
    fontSize: fontSize(20),
    lineHeight: 30,
    fontFamily: fontFamily.poppins500,
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
  },
  unitText: {
    position: 'absolute',
    right: 40, // Adjust to avoid overlapping with the image
    fontSize: fontSize(18),
    color: '#AFAFAF',
    fontFamily: fontFamily.poppins500,
  },
  image: {
    position: 'absolute',
    right: 10, // Position image at the right edge
    width: wp(20), // Adjust width and height of the image as needed
    height: wp(20),
    resizeMode: 'contain', // Make sure the image fits within the dimensions
    tintColor: 'black',
    top: -15,
  },
  label: {
    position: 'absolute',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dim background when picker is open
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%', // Ensure the modal has a proper width so the X button aligns properly
    position: 'relative',
  },
  setDateButton: {
    marginTop: 20,
    backgroundColor: colors.black,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  setDateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: fontFamily.poppins500,
  },
  closeButton: {
    position: 'absolute', // Make the button absolutely positioned
    top: 10, // Adjust the vertical positioning
    right: -1,
    marginBottom: 10,
    // backgroundColor: 'red',
    width: 50,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'black',
    fontSize: 24,
    fontFamily: fontFamily.poppins500,
  },
});

export default DOBTextInputComponent;
