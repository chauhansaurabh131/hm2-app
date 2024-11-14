import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const ProfileCheckboxGroup = ({
  data,
  selectedId,
  onChange,
  containerRow,
  layout = 'vertical',
}) => {
  const [checkedId, setCheckedId] = useState(selectedId);

  const handleCheckboxChange = id => {
    setCheckedId(id);
    const selectedItem = data.find(item => item.id === id);
    if (onChange) {
      onChange(selectedItem.label);
    }
  };

  // Split data into two rows for horizontal layout
  const firstRow = data.slice(0, 2);
  const secondRow = data.slice(2, 4);

  return (
    <View>
      {layout === 'horizontal' ? (
        <>
          <View style={styles.row}>
            {firstRow.map(item => (
              <View
                key={item.id}
                style={[styles.checkboxWrapper, containerRow]}>
                <TouchableOpacity
                  onPress={() => handleCheckboxChange(item.id)}
                  style={styles.checkboxContainer}>
                  <View style={styles.outerCircle}>
                    {checkedId === item.id && (
                      <View style={styles.innerCircle} />
                    )}
                  </View>
                </TouchableOpacity>
                <Text style={styles.label}>{item.label}</Text>
              </View>
            ))}
          </View>
          <View style={styles.row}>
            {secondRow.map(item => (
              <View
                key={item.id}
                style={[styles.checkboxWrapper, containerRow]}>
                <TouchableOpacity
                  onPress={() => handleCheckboxChange(item.id)}
                  style={styles.checkboxContainer}>
                  <View style={styles.outerCircle}>
                    {checkedId === item.id && (
                      <View style={styles.innerCircle} />
                    )}
                  </View>
                </TouchableOpacity>
                <Text style={styles.label}>{item.label}</Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        data.map(item => (
          <View key={item.id} style={[styles.row, containerRow]}>
            <TouchableOpacity
              onPress={() => handleCheckboxChange(item.id)}
              style={styles.checkboxContainer}>
              <View style={styles.outerCircle}>
                {checkedId === item.id && <View style={styles.innerCircle} />}
              </View>
            </TouchableOpacity>
            <Text style={styles.label}>{item.label}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: wp(50), // Adjust width to display two items per row
    // marginBottom: 10,
    // backgroundColor: 'red',
    flex: 1,
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
  label: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
});

export default ProfileCheckboxGroup;
