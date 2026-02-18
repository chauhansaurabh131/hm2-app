import React, {useRef, useState} from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';
import {fontSize} from '../../utils/helpers';

const NewMultiSelectValueComponent = ({
  title,
  value = [], // ✅ ARRAY
  dropdownData = [],
  onValueChange,
  bottomSheetHeight = 400,
  showDivider = true,
  showSearch = false,
  selectedContainerStyle,
  maxSelection = Infinity, // ✅ LIMIT
}) => {
  const refRBSheet = useRef(null);
  const [searchText, setSearchText] = useState('');

  // ✅ SELECT / DESELECT WITH ALERT ONLY
  const handleSelectOption = item => {
    // REMOVE
    if (value.includes(item)) {
      onValueChange(value.filter(v => v !== item));
      return;
    }

    // LIMIT EXCEEDED → SHOW ALERT
    if (value.length >= maxSelection) {
      Alert.alert(
        'Selection Limit',
        `You can select only ${maxSelection} items.`,
        [{text: 'OK'}],
      );
      return;
    }

    // ADD
    onValueChange([...value, item]);
  };

  // FILTER DATA
  const filteredData = dropdownData.filter(item =>
    item.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <>
      {/* MAIN ROW */}
      <TouchableOpacity
        style={styles.row}
        activeOpacity={0.7}
        onPress={() => refRBSheet.current.open()}>
        <Text style={styles.leftText}>{title}</Text>

        <View style={styles.rightContainer}>
          <Text style={styles.rightText}>
            {value.length > 0 ? 'Selected' : 'Select'}
          </Text>
          <Image source={icons.drooDownLogo} style={styles.arrow} />
        </View>
      </TouchableOpacity>

      {/* SELECTED VALUES BELOW */}
      {value.length > 0 && (
        <View style={[styles.selectedContainer, selectedContainerStyle]}>
          <Text style={styles.selectedText}>{value.join(', ')}</Text>
        </View>
      )}

      {/* DIVIDER */}
      {showDivider && <View style={styles.divider} />}

      {/* BOTTOM SHEET */}
      <RBSheet
        ref={refRBSheet}
        height={bottomSheetHeight}
        closeOnDragDown
        onClose={() => setSearchText('')}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 10,
          },
        }}>
        {/* SEARCH BAR */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search"
              value={searchText}
              onChangeText={setSearchText}
              placeholderTextColor="#999"
              style={styles.searchInput}
            />
          </View>
        )}

        {/* LIST */}
        <ScrollView keyboardShouldPersistTaps="handled">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => {
              const isSelected = value.includes(item);

              return (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleSelectOption(item)}>
                  <Text
                    style={[
                      styles.dropdownText,
                      {
                        color: isSelected ? '#9E9E9E' : '#000', // ✅ ALWAYS BLACK
                      },
                    ]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })
          ) : (
            <Text style={styles.noDataText}>No results found</Text>
          )}
        </ScrollView>
      </RBSheet>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 16,
    backgroundColor: colors.white,
  },

  leftText: {
    fontSize: fontSize(14),
    color: '#8E8E8E',
    fontFamily: 'inter',
    fontWeight: '400',
  },

  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rightText: {
    fontSize: fontSize(14),
    color: colors.pureBlack,
    marginRight: 6,
    fontWeight: '800',
    fontFamily: 'inter',
    left: -20,
  },

  arrow: {
    height: 8,
    width: 12,
    tintColor: '#5F6368',
    transform: [{rotate: '-90deg'}],
    left: -15,
  },

  selectedContainer: {
    // paddingHorizontal: 16,
    paddingTop: 6,
  },

  selectedText: {
    fontSize: fontSize(14),
    color: '#000',
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    // marginHorizontal: 16,
    marginTop: 8,
  },

  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  searchInput: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    fontSize: fontSize(14),
    color: '#000',
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },

  dropdownText: {
    fontSize: fontSize(16),
  },

  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: fontSize(14),
    color: '#999',
  },
});

export default NewMultiSelectValueComponent;
