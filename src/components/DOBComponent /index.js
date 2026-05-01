import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';
import DatePicker from 'react-native-date-picker';

const DOBComponent = ({
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
    <>
      {/* Row Input */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.rowContainer}
        onPress={() => setOpen(true)}>
        {/* Left Label */}
        <Text style={styles.label}>{label}</Text>

        {/* Right Value + Arrow */}
        <View style={styles.rightSection}>
          <Text style={styles.valueText}>{value ? value : 'DD/MM/YYYY'}</Text>

          <Image source={icons.drooDownLogo} style={styles.arrowIcon} />
        </View>
      </TouchableOpacity>

      {/* Bottom Border */}
      {/*<View style={styles.divider} />*/}

      {/* Modal */}
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
    </>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: hp(14),
    // paddingHorizontal: 17,
    backgroundColor: colors.white,
  },

  label: {
    fontSize: fontSize(15),
    color: '#8E8E8E',
    fontFamily: 'inter',
    fontWeight: '400',
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

  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
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

  modalTitle: {
    fontSize: fontSize(18),
    fontFamily: fontFamily.poppins500,
    marginBottom: hp(10),
  },

  setDateButton: {
    marginTop: hp(20),
    backgroundColor: colors.black,
    width: '90%',
    height: hp(44),
    justifyContent: 'center',
    borderRadius: 50,
  },

  setDateButtonText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: fontSize(14),
    fontFamily: fontFamily.poppins400,
  },
});

export default DOBComponent;
