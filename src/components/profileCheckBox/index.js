import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const ProfileCheckboxGroup = ({data, selectedId}) => {
  const [checkedId, setCheckedId] = useState(selectedId);

  const handleCheckboxChange = id => {
    setCheckedId(id);
  };

  return (
    <View>
      {data.map(item => (
        <View key={item.id} style={styles.row}>
          <TouchableOpacity
            onPress={() => handleCheckboxChange(item.id)}
            style={styles.checkboxContainer}>
            <View style={styles.outerCircle}>
              {checkedId === item.id && <View style={styles.innerCircle} />}
            </View>
          </TouchableOpacity>
          <View style={styles.textContainer}>
            <Text style={styles.label}>{item.label}</Text>
            {item.subTitle && (
              <Text style={styles.subTitle}>{item.subTitle}</Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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
    backgroundColor: '#000',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  subTitle: {
    fontSize: fontSize(10),
    lineHeight: hp(14),
    color: '#464646',
  },
});

export default ProfileCheckboxGroup;
