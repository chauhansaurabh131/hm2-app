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
import moment from 'moment';
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

  // Confirm time
  const handleConfirm = () => {
    const formattedTime = moment(selectedTime).format('hh:mm A');
    onChangeText(formattedTime);
    setModalVisible(false);
  };

  return (
    <View style={styles.inputContainer}>
      {/* FLOATING LABEL */}
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

      {/* 👇 TAP ANYWHERE TO OPEN MODAL */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setModalVisible(true)}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={value}
            editable={false}
            pointerEvents="none" // 👈 IMPORTANT
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isFocused ? 'HH:MM AM/PM' : ''}
            placeholderTextColor={'gray'}
            {...props}
          />

          {showImage && (
            <Image
              source={imageSource}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </View>
      </TouchableOpacity>

      {/* TIME PICKER MODAL */}
      <Modal
        animationType="none"
        transparent
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time</Text>

            <DatePicker
              mode="time"
              date={selectedTime}
              is24hour={true}
              onDateChange={setSelectedTime}
              minuteInterval={1}
              textColor={'black'}
              style={{height: 80, paddingVertical: 50}}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Confirm</Text>
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
    fontSize: fontSize(16),
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
    fontFamily: 'inter',
    fontWeight: '800',
  },
  label: {
    position: 'absolute',
  },
  image: {
    position: 'absolute',
    right: 10,
    height: 13,
    width: 13,
    // top: -8,
    transform: [{rotate: '-90deg'}],
    tintColor: colors.pureBlack,
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
