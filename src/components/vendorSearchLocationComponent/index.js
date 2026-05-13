import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  Linking,
  PermissionsAndroid,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoding';
import RBSheet from 'react-native-raw-bottom-sheet';

import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';

// ========================================
// GOOGLE MAP API
// ========================================

const GOOGLE_MAPS_API_KEY = 'AIzaSyAL22l4qyPMGMu2-6BXjUZa0mYO05wrN9A';

Geocoder.init(GOOGLE_MAPS_API_KEY);

const VendorSearchLocationComponent = ({onLocationChange}) => {
  const [location, setLocation] = useState('Fetching location...');

  const [text, setText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [vendorText, setVendorText] = useState('');

  const refRBSheet = useRef();
  const vendorSheetRef = useRef();

  const navigation = useNavigation();

  const vendorList = [
    'Wedding Planner',
    'Wedding Studio',
    'Decorators',
    'Caterers',
    'Jewelry Shops',
    'Beauty',
    'Meeting Points',
    'Dating Venues',
    'Yoga Centers',
    'Fitness Centers',
  ];

  // ========================================
  // INITIAL LOCATION
  // ========================================

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // ========================================
  // LOCATION PERMISSION
  // ========================================

  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs location permission to show nearby vendors.',
            buttonPositive: 'Allow',
            buttonNegative: 'Cancel',
          },
        );

        // GRANTED
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('✅ Permission Granted');

          getCurrentLocation();

          return true;
        }

        // NEVER ASK AGAIN
        if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          Alert.alert(
            'Permission Required',
            'Location permission is permanently denied. Please enable it from settings.',
            [
              {
                text: 'Cancel',
                style: 'cancel',
              },

              {
                text: 'Open Settings',
                onPress: () => {
                  Linking.openSettings();
                },
              },
            ],
          );

          return false;
        }

        // DENIED
        Alert.alert('Permission Denied', 'Location permission is required.');

        return false;
      }

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  };

  // ========================================
  // GET CURRENT LOCATION
  // ========================================

  const getCurrentLocation = async () => {
    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;

        console.log('LATITUDE:', latitude);
        console.log('LONGITUDE:', longitude);

        try {
          const response = await Geocoder.from(latitude, longitude);

          // console.log('FULL ADDRESS ===>', response);

          const address = response.results[0].address_components;

          let city = '';
          let state = '';

          address.forEach(component => {
            if (component.types.includes('locality')) {
              city = component.long_name;
            }

            if (component.types.includes('administrative_area_level_1')) {
              state = component.long_name;
            }
          });

          if (city && state) {
            // setLocation(`${city}, ${state}`);
            const finalLocation = `${city}, ${state}`;

            setLocation(finalLocation);

            onLocationChange?.(finalLocation);
          } else {
            setLocation('Location not found');
          }
        } catch (error) {
          console.log('GEOCODER ERROR ===>', error);
        }
      },

      error => {
        console.log('LOCATION ERROR ===>', error);
      },

      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
        forceRequestLocation: true,
        showLocationDialog: true,
      },
    );
  };

  // ========================================
  // GOOGLE CITY SEARCH
  // ========================================

  const fetchCityState = async input => {
    setText(input);

    if (input.length > 0) {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&components=country:in&key=${GOOGLE_MAPS_API_KEY}`;

      try {
        const response = await fetch(url);

        const data = await response.json();

        console.log('CITY SEARCH ===>', data);

        if (data.status === 'OK') {
          const suggestions = data.predictions.map(item => {
            const parts = item.description.split(',');

            // REMOVE COUNTRY
            parts.pop();

            return parts.join(',').trim();
          });

          setFilteredData(suggestions);
        } else {
          setFilteredData([]);
        }
      } catch (error) {
        console.log('SEARCH ERROR ===>', error);
      }
    } else {
      setFilteredData([]);
    }
  };

  const onPressItem = label => {
    // CONVERT TO SLUG
    const formattedLabel = label.toLowerCase().replace(/\s+/g, '-');

    console.log('Pressed item:', formattedLabel);

    vendorSheetRef.current.close();

    navigation.navigate('VendorSearchFilterScreen', {
      category: formattedLabel,
      location: location,
    });
  };

  return (
    <>
      {/* ======================================== */}
      {/* TOP LOCATION */}
      {/* ======================================== */}

      <View
        style={{
          backgroundColor: '#FBF9FF',
        }}>
        <View
          style={{
            marginHorizontal: wp(17),
            marginTop: hp(13),
            marginBottom: hp(19),
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            {/* ICON */}
            <View
              style={{
                width: hp(27),
                height: hp(27),
                backgroundColor: '#F2EDFF',
                borderRadius: hp(50),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={icons.location_Icon}
                style={{
                  width: hp(7),
                  height: hp(10),
                  resizeMode: 'contain',
                }}
              />
            </View>

            {/* LOCATION */}
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={async () => {
                const granted = await PermissionsAndroid.check(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                );

                if (granted) {
                  refRBSheet.current.open();
                } else {
                  requestLocationPermission();
                }
              }}
              style={{
                marginLeft: wp(11),
              }}>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(9),
                  fontFamily: fontFamily.poppins600,
                }}>
                Select City
              </Text>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text
                  style={{
                    color: colors.pureBlack,
                    fontSize: fontSize(12),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  {location}
                </Text>

                {/* ARROW */}
                <Image
                  source={icons.right_Arrow_Color_Icon}
                  style={{
                    tintColor: '#7148E4',
                    width: hp(15),
                    height: hp(7),
                    resizeMode: 'contain',
                    marginLeft: wp(16),
                    top: -1,
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/*SEARCH TEXT INPUT*/}
          <TouchableOpacity
            onPress={async () => {
              const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
              );

              // IF LOCATION NOT ENABLED
              if (!granted) {
                requestLocationPermission();
              } else {
                // CLOSE KEYBOARD
                // Keyboard.dismiss();

                // OPEN NEW BOTTOMSHEET
                vendorSheetRef.current.open();
              }
            }}
            style={{
              width: '100%',
              height: hp(40),
              backgroundColor: '#FFFFFF',
              borderRadius: hp(20),
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: wp(15),
              marginTop: hp(12),
            }}>
            <Image
              source={icons.search_icon}
              style={{
                width: hp(13),
                height: hp(13),
                resizeMode: 'contain',
                tintColor: '#93A0B4',
              }}
            />
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
                marginLeft: wp(12),
              }}>
              Select Vendor
            </Text>

            <View style={{position: 'absolute', right: 20}}>
              <Image
                source={icons.rightSideIcon}
                style={{
                  width: hp(15),
                  height: hp(10),
                  resizeMode: 'contain',
                  tintColor: '#C7B7F5',
                }}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ======================================== */}
      {/* BOTTOM SHEET */}
      {/* ======================================== */}

      <RBSheet
        ref={refRBSheet}
        height={hp(550)}
        openDuration={250}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.4)',
          },

          draggableIcon: {
            backgroundColor: '#D3D3D3',
            width: wp(70),
          },

          container: {
            borderTopLeftRadius: hp(25),
            borderTopRightRadius: hp(25),
            backgroundColor: colors.white,
          },
        }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: wp(17),
          }}>
          {/* TITLE */}
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins600,
              marginTop: hp(10),
            }}>
            Select City
          </Text>

          {/* SEARCH */}
          <View
            style={{
              height: hp(48),
              borderWidth: 1,
              borderColor: '#E2E2E2',
              borderRadius: hp(14),
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: wp(14),
              marginTop: hp(20),
            }}>
            <Image
              source={icons.search_icon}
              style={{
                width: hp(16),
                height: hp(16),
                tintColor: '#7148E4',
                resizeMode: 'contain',
              }}
            />

            <TextInput
              placeholder="Search city"
              placeholderTextColor="#999"
              value={text}
              onChangeText={fetchCityState}
              style={{
                flex: 1,
                marginLeft: wp(10),
                color: colors.pureBlack,
                fontSize: fontSize(13),
                fontFamily: fontFamily.poppins400,
              }}
            />
          </View>

          {/* CURRENT LOCATION */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              getCurrentLocation();
              refRBSheet.current.close();
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: hp(22),
            }}>
            <Image
              source={icons.location_Icon}
              style={{
                width: hp(16),
                height: hp(16),
                tintColor: '#7148E4',
                resizeMode: 'contain',
              }}
            />

            <Text
              style={{
                color: '#7148E4',
                marginLeft: wp(10),
                fontSize: fontSize(13),
                fontFamily: fontFamily.poppins600,
              }}>
              Use Current Location
            </Text>
          </TouchableOpacity>

          {/* SEARCH LIST */}
          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: hp(50),
              marginTop: hp(15),
            }}
            renderItem={({item}) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  // setLocation(item);
                  setLocation(item);

                  onLocationChange?.(item);

                  setText(item);

                  refRBSheet.current.close();
                }}
                style={{
                  paddingVertical: hp(16),
                  borderBottomWidth: 1,
                  borderBottomColor: '#F1F1F1',
                }}>
                <Text
                  style={{
                    color: colors.pureBlack,
                    fontSize: fontSize(13),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </RBSheet>

      {/* NEW VENDOR BOTTOM SHEET */}
      {/* ======================================== */}

      <RBSheet
        ref={vendorSheetRef}
        height={hp(580)}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          draggableIcon: {
            backgroundColor: '#ffffff',
          },

          container: {
            borderTopLeftRadius: hp(25),
            borderTopRightRadius: hp(25),
          },
        }}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: wp(17),
          }}>
          {/* TITLE */}
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins600,
              marginTop: hp(10),
            }}>
            Select Vendor
          </Text>

          {/* LINE */}
          <View
            style={{
              width: '100%',
              height: hp(1),
              backgroundColor: '#DADADA',
              marginTop: hp(21),
            }}
          />

          {/* LIST */}
          <FlatList
            data={vendorList}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: hp(10),
              paddingTop: hp(15),
            }}
            renderItem={({item}) => (
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => onPressItem(item)}
                style={{
                  paddingVertical: hp(10),
                }}>
                <Text
                  style={{
                    color: colors.pureBlack,

                    fontSize: fontSize(16),

                    fontFamily: fontFamily.poppins500,
                  }}>
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </RBSheet>
    </>
  );
};

export default VendorSearchLocationComponent;
