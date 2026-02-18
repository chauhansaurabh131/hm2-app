import React, {useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {icons} from '../../assets';
import RBSheet from 'react-native-raw-bottom-sheet';
import {fontSize} from '../../utils/helpers';
import {colors} from '../../utils/colors';

// Google API Key
const GOOGLE_MAP_SEARCH_KEY = 'AIzaSyBaqU_1hOFIhVLm8su_caJheEChJCNBTyY';

// ✅ Formatter: bardoli, Guj, Ind
const formatGooglePlace = place => {
  if (!place) {
    return '';
  }

  const parts = place.split(',').map(p => p.trim());

  const rawCity = parts[0] || '';
  const city = rawCity.charAt(0).toUpperCase() + rawCity.slice(1).toLowerCase();

  const state = parts[1]?.slice(0, 3) || '';
  const country = parts[2]?.slice(0, 3) || '';

  return `${city}, ${state}, ${country}`;
};

const NewSelectValueComponent = ({
  title,
  value = '',
  dropdownData = [],
  onValueChange,
  bottomSheetHeight,
  showSearch = false,
  showDivider = true,
  useGoogleSearch = false, // ✅ optional
  componentMainStyle,
}) => {
  const refRBSheet = useRef(null);
  const [searchText, setSearchText] = useState('');
  const [googleData, setGoogleData] = useState([]);

  const handleSelectOption = item => {
    refRBSheet.current.close();
    setSearchText('');
    setGoogleData([]);
    onValueChange?.(item);
  };

  // Google API (ONLY when enabled)
  const fetchGooglePlaces = async text => {
    if (!text) {
      setGoogleData([]);
      return;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=(cities)&key=${GOOGLE_MAP_SEARCH_KEY}`,
      );
      const json = await response.json();

      if (json?.predictions) {
        setGoogleData(json.predictions.map(i => i.description));
      }
    } catch (e) {
      console.log('Google API error:', e);
    }
  };

  const filteredData = useGoogleSearch
    ? googleData
    : dropdownData.filter(item =>
        item.toLowerCase().includes(searchText.toLowerCase()),
      );

  return (
    <>
      {/* MAIN ROW */}
      <TouchableOpacity
        style={[styles.row, {componentMainStyle}]}
        activeOpacity={0.7}
        onPress={() => refRBSheet.current.open()}>
        <Text style={styles.leftText}>{title}</Text>

        <View style={styles.rightContainer}>
          <Text style={styles.rightText}>
            {value
              ? useGoogleSearch
                ? formatGooglePlace(value)
                : value
              : 'Select'}
          </Text>
          <Image source={icons.drooDownLogo} style={styles.arrow} />
        </View>
      </TouchableOpacity>

      {showDivider && <View style={styles.divider} />}

      {/* BOTTOM SHEET */}
      <RBSheet
        ref={refRBSheet}
        height={bottomSheetHeight}
        closeOnDragDown
        onClose={() => {
          setSearchText('');
          setGoogleData([]);
        }}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingTop: 10,
          },
        }}>
        {/* SEARCH */}
        {showSearch && (
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search"
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                if (useGoogleSearch) {
                  fetchGooglePlaces(text);
                }
              }}
              style={styles.searchInput}
              placeholderTextColor="#999"
            />
          </View>
        )}

        {/* LIST */}
        <ScrollView keyboardShouldPersistTaps="handled">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleSelectOption(item)}>
                <Text style={styles.dropdownText}>{item}</Text>
              </TouchableOpacity>
            ))
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

  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    // marginHorizontal: 16,
  },

  searchContainer: {
    // paddingHorizontal: 16,
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
    color: '#000',
  },

  noDataText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: fontSize(14),
    color: '#999',
  },
});

export default NewSelectValueComponent;
