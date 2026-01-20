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
import DatePicker from 'react-native-date-picker';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';

const DOBTextInputComponent = ({
  label,
  value,
  onChangeText,
  showUnit,
  showUnitText,
  imageSource,
  ...props
}) => {
  const [isFocused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  const currentYear = new Date().getFullYear();
  const maxDate = new Date(currentYear, 11, 31);

  const labelColor = isFocused || value ? 'gray' : 'black';
  const labelFontSize = isFocused || value ? 14 : 18;
  const labelTop = isFocused || value ? -15 : 10;

  const handleSetDate = () => {
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear().toString();

    onChangeText(`${day}/${month}/${year}`);
    setOpen(false);
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

      {/* 👇 TAP ANYWHERE TO OPEN MODAL */}
      <TouchableOpacity activeOpacity={0.8} onPress={() => setOpen(true)}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={value}
            editable={false}
            pointerEvents="none" // 👈 IMPORTANT
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={isFocused ? 'DD/MM/YYYY' : ''}
            placeholderTextColor={'#C0C0C0'}
            {...props}
          />

          {showUnit && <Text style={styles.unitText}>{showUnitText}</Text>}

          {imageSource && <Image source={imageSource} style={styles.image} />}
        </View>
      </TouchableOpacity>

      {/* DATE PICKER MODAL */}
      <Modal visible={open} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {/* CLOSE ICON */}
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={{
                height: hp(30),
                width: hp(30),
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                top: 5,
                right: 10,
              }}>
              <Image
                source={icons.x_cancel_icon}
                style={{
                  width: hp(12),
                  height: hp(12),
                  resizeMode: 'contain',
                  tintColor: 'black',
                }}
              />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: fontSize(18),
                lineHeight: hp(26),
                fontFamily: fontFamily.poppins400,
                color: colors.black,
                marginTop: hp(10),
              }}>
              Date of Birth
            </Text>

            <View style={{marginTop: 20}}>
              <DatePicker
                date={selectedDate}
                mode="date"
                maximumDate={maxDate}
                onDateChange={setSelectedDate}
                textColor={'black'}
                style={{height: 130, width: 300}}
              />
            </View>

            <TouchableOpacity
              activeOpacity={0.6}
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
    paddingRight: 40,
    color: 'black',
    fontSize: fontSize(16),
    lineHeight: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#C0C0C0',
    fontFamily: 'inter',
    fontWeight: '800',
  },
  unitText: {
    position: 'absolute',
    right: 40,
    fontSize: fontSize(18),
    color: '#AFAFAF',
    fontFamily: fontFamily.poppins500,
  },
  image: {
    position: 'absolute',
    right: 10,
    width: wp(13),
    height: wp(13),
    resizeMode: 'contain',
    tintColor: 'black',
    // top: -8,
    transform: [{rotate: '-90deg'}],
  },
  label: {
    position: 'absolute',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '85%',
    position: 'relative',
  },
  setDateButton: {
    marginTop: 20,
    backgroundColor: colors.black,
    width: '90%',
    height: hp(44),
    justifyContent: 'center',
    borderRadius: 50,
  },
  setDateButtonText: {
    color: '#FFFFFF',
    fontSize: fontSize(16),
    lineHeight: hp(22),
    fontFamily: fontFamily.poppins400,
    textAlign: 'center',
  },
});

export default DOBTextInputComponent;
