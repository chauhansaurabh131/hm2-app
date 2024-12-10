import React, {useState} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import moment from 'moment'; // Import moment
import {fontFamily, fontSize} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const BirthOfTimeTextInput = ({
  label,
  value,
  onChangeText,
  showImage,
  imageSource,
  ...props
}) => {
  const [isFocused, setFocused] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  // Handle text input to enforce HH:MM format with AM/PM
  const handleTextChange = text => {
    let formattedText = text.replace(/[^0-9: ]/g, ''); // Allow colon and spaces

    // Automatically format the input into HH:MM AM/PM format
    if (formattedText.length > 2 && !formattedText.includes(':')) {
      formattedText = formattedText.slice(0, 2) + ':' + formattedText.slice(2);
    }

    // Split time into hours, minutes and AM/PM
    const parts = formattedText.split(':');
    let hours = parts[0] || '';
    let minutes = parts[1] || '';

    if (minutes && parseInt(minutes, 10) > 59) {
      minutes = '59';
    }

    if (hours && parseInt(hours, 10) > 12) {
      // 12-hour format validation
      hours = '12';
    }

    // Ensure the time format stays valid
    formattedText = (hours ? hours : '12') + (minutes ? ':' + minutes : '');

    if (formattedText.length <= 7) {
      onChangeText(formattedText);
    }
  };

  // Open modal to show time picker
  const handleImagePress = () => {
    setModalVisible(true);
  };

  // Update time from picker and close modal using moment for formatting (AM/PM)
  const handleConfirm = () => {
    const formattedTime = moment(selectedTime).format('hh:mm A'); // Format with AM/PM
    onChangeText(formattedTime);
    setModalVisible(false);
  };

  return (
    <View style={styles.inputContainer}>
      <Text
        style={[
          styles.label,
          {
            top: isFocused || value ? -15 : 10,
            color: isFocused || value ? 'gray' : 'black',
            fontSize: isFocused || value ? 14 : 18,
          },
        ]}>
        {label}
      </Text>

      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={value}
          editable={false}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChangeText={handleTextChange}
          keyboardType="numeric"
          placeholder={isFocused ? 'HH:MM AM/PM' : ''}
          placeholderTextColor={'gray'}
          maxLength={8} // Allow for AM/PM formatting
          {...props}
        />
        {showImage && (
          <TouchableOpacity onPress={handleImagePress}>
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>

      <Modal
        animationType="none"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time</Text>
            <DatePicker
              mode="time"
              date={selectedTime}
              is24hour={true} // Use 12-hour format for AM/PM
              onDateChange={setSelectedTime}
              minuteInterval={1}
              textColor={'black'}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
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
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 50,
    paddingLeft: 0,
    paddingRight: 40,
    color: 'black',
    fontSize: fontSize(20),
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
  },
  label: {
    position: 'absolute',
  },
  image: {
    position: 'absolute',
    right: 10,
    height: 20,
    width: 20,
    top: -10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  button: {
    width: 100,
    height: 50,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    marginHorizontal: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize(14),
    fontFamily: fontFamily.poppins500,
  },
});

export default BirthOfTimeTextInput;
