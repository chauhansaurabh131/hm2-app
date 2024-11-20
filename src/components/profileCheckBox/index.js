import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const ProfileCheckboxGroup = ({
  data,
  selectedId,
  onChange,
  containerRow,
  checkboxRowContainer,
  outerCircle,
  label,
}) => {
  const [checkedId, setCheckedId] = useState(selectedId);

  const handleCheckboxChange = id => {
    setCheckedId(id);
    // Call the onChange callback with the selected item
    const selectedItem = data.find(item => item.id === id);
    if (onChange) {
      onChange(selectedItem.label);
    }
  };

  return (
    <View>
      {data.map(item => (
        <View key={item.id} style={[styles.row, containerRow]}>
          <TouchableOpacity
            onPress={() => handleCheckboxChange(item.id)}
            style={[styles.checkboxRowContainer, checkboxRowContainer]}>
            <View style={styles.checkboxContainer}>
              <View style={[styles.outerCircle, outerCircle]}>
                {checkedId === item.id && <View style={styles.innerCircle} />}
              </View>
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.label, label]}>{item.label}</Text>
              <View>
                {item.subTitle && (
                  <Text style={styles.subTitle}>{item.subTitle}</Text>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginBottom: hp(15),
  },
  checkboxRowContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // backgroundColor: 'orange',
  },
  checkboxContainer: {
    marginRight: 10,
  },
  outerCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.blue,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  subTitle: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    color: '#818181',
    marginTop: 2,
  },
});

export default ProfileCheckboxGroup;
