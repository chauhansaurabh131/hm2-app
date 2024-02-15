import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const ProfileCheckboxGroup = ({data, styleRow}) => {
  const [selectedId, setSelectedId] = useState(null);

  const handleCheckboxChange = id => {
    setSelectedId(id);
  };

  return (
    <View>
      <View style={styles.row}>
        {data.slice(0, 2).map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleCheckboxChange(item.id)}
            style={styles.checkboxContainer}>
            <View
              style={[
                styles.checkbox,
                selectedId === item.id && styles.checked,
              ]}
            />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={[styles.row, styleRow]}>
        {data.slice(2, 4).map(item => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleCheckboxChange(item.id)}
            style={styles.checkboxContainer}>
            <View
              style={[
                styles.checkbox,
                selectedId === item.id && styles.checked,
              ]}
            />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    // flexDirection: 'row',
    marginBottom: 10,
    // backgroundColor: 'silver',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: 'red',
    // width: '45%',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    marginRight: 10,
  },
  checked: {
    backgroundColor: '#000',
  },
  label: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
});

export default ProfileCheckboxGroup;
