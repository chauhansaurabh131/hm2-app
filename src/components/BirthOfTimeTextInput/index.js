import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';
import DatePicker from 'react-native-date-picker';

const BirthOfTimeComponent = ({label, value, onChangeText}) => {
  const [open, setOpen] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());

  // 🔥 FORMAT TIME
  const formatTime = date => {
    return date
      .toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        // ❌ remove second
        hour12: true,
      })
      .toUpperCase(); // 🔥 AM/PM capital
  };

  const handleSetTime = () => {
    const formatted = formatTime(selectedTime);
    onChangeText(formatted);
    setOpen(false);
  };

  return (
    <>
      {/* 🔥 SAME ROW UI LIKE DOB */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.rowContainer}
        onPress={() => setOpen(true)}>
        {/* LEFT LABEL */}
        <Text style={styles.label}>{label}</Text>

        {/* RIGHT VALUE + ICON */}
        <View style={styles.rightSection}>
          <Text style={styles.valueText}>{value ? value : 'HH:MM AM'}</Text>

          <Image source={icons.drooDownLogo} style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>

      {/* 🔥 MODAL */}
      <Modal visible={open} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {/* CLOSE */}
            <TouchableOpacity
              onPress={() => setOpen(false)}
              style={styles.closeBtn}>
              <Image source={icons.x_cancel_icon} style={styles.closeIcon} />
            </TouchableOpacity>

            <Text style={styles.title}>Select Birth Time</Text>

            {/*<DatePicker*/}
            {/*  mode="time"*/}
            {/*  date={selectedTime}*/}
            {/*  onDateChange={setSelectedTime}*/}
            {/*  is24hour={false}*/}
            {/*  textColor="black"*/}
            {/*  style={{*/}
            {/*    height: 150,*/}
            {/*    transform: [{scale: 1.2}], // 🔥 increase size*/}
            {/*  }}*/}
            {/*/>*/}

            <DatePicker
              mode="time"
              date={selectedTime}
              onDateChange={setSelectedTime}
              is24hour={false}
              textColor="black"
              style={{
                height: 100, // 🔥 reduce height (important)
                transform: [{scale: 1.2}], // optional for size
                marginTop: hp(10),
                marginBottom: hp(10),
              }}
            />

            <TouchableOpacity style={styles.button} onPress={handleSetTime}>
              <Text style={styles.buttonText}>Set Time</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default BirthOfTimeComponent;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(14),
    backgroundColor: colors.white,
  },

  label: {
    fontSize: fontSize(15),
    color: '#8E8E8E',
    fontFamily: 'inter',
  },

  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  valueText: {
    fontSize: fontSize(15),
    color: colors.pureBlack,
    marginRight: 6,
    fontWeight: '800',
    fontFamily: 'inter',
    left: -20,
  },

  arrowIcon: {
    height: 8,
    width: 12,
    tintColor: '#5F6368',
    transform: [{rotate: '-90deg'}],
    left: -15,
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
    borderRadius: 12,
    alignItems: 'center',
    width: '85%',
  },

  title: {
    fontSize: fontSize(18),
    marginBottom: hp(10),
    color: colors.black,
    marginTop: hp(10),
    top: -10,
  },

  button: {
    marginTop: hp(20),
    backgroundColor: colors.black,
    width: '90%',
    height: hp(44),
    justifyContent: 'center',
    borderRadius: 50,
  },

  buttonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: fontSize(14),
    fontFamily: fontFamily.poppins400,
  },

  closeBtn: {
    position: 'absolute',
    // top: 5,
    right: 0,
    // backgroundColor: 'red',

    width: hp(50),
    height: hp(40),
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeIcon: {
    width: hp(15),
    height: hp(15),
    tintColor: 'black',
    resizeMode: 'contain',
  },
});
