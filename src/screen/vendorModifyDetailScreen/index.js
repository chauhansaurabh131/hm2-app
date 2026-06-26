import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import {useDispatch, useSelector} from 'react-redux';
import {addressDetails, updateDetails} from '../../actions/homeActions';
import RBSheet from 'react-native-raw-bottom-sheet';

const VendorModifyDetailScreen = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);

  // console.log(' === user123------ ===> ', user?.user?.email);

  const apiDispatch = useDispatch();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState(
    user?.user?.vendorData?.[0]?.businessName || '',
  );

  const [mobileNumber, setMobileNumber] = useState(
    user?.user?.mobileNumber?.toString() || '',
  );
  const [mobileInitialized, setMobileInitialized] = useState(false);

  const [email, setEmail] = useState(user?.user?.email || '');

  const [addressLine, setAddressLine] = useState(
    user?.user?.address?.currentResidenceAddress || '',
  );

  const [area, setArea] = useState(user?.user?.address?.area || '');

  const [city, setCity] = useState(user?.user?.address?.currentCity || '');

  const [stateName, setStateName] = useState(
    user?.user?.address?.currentState || '',
  );

  const [country, setCountry] = useState(
    user?.user?.address?.currentCountry || 'india',
  );

  const [savedAddressLine, setSavedAddressLine] = useState(
    user?.user?.address?.currentResidenceAddress || '',
  );

  const [savedArea, setSavedArea] = useState(user?.user?.address?.area || '');

  const [savedCity, setSavedCity] = useState(
    user?.user?.address?.currentCity || '',
  );

  const [savedState, setSavedState] = useState(
    user?.user?.address?.currentState || '',
  );

  const [savedCountry, setSavedCountry] = useState(
    user?.user?.address?.currentCountry || 'india',
  );

  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (
      !mobileInitialized &&
      user?.user?.mobileNumber !== undefined &&
      user?.user?.mobileNumber !== null
    ) {
      setMobileNumber(user.user.mobileNumber.toString());
      setMobileInitialized(true);
    }
  }, [user?.user?.mobileNumber, mobileInitialized]);

  useEffect(() => {
    if (user?.user?.vendorData?.[0]?.businessName) {
      setBusinessName(user.user.vendorData[0].businessName);
    }
  }, [user]);

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const refMobileSheet = useRef();
  const refEmailSheet = useRef();
  const refAddressSheet = useRef();

  const capitalizeWords = text => {
    if (!text) {
      return '';
    }

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatMobileNumber = mobile => {
    if (!mobile) {
      return 'Not added';
    }

    const number = mobile.toString().replace(/\D/g, '');

    if (number.length === 10) {
      return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
    }

    return mobile;
  };

  const openMobileSheet = () => {
    setMobileNumber(user?.user?.mobileNumber?.toString() || '');
    refMobileSheet.current?.open();
  };

  const openEmailSheet = () => {
    setEmail(user?.user?.email || '');
    refEmailSheet.current?.open();
  };

  const openAddressSheet = () => {
    setAddressLine(user?.user?.address?.currentResidenceAddress || '');
    setArea(user?.user?.address?.area || '');
    setCity(user?.user?.address?.currentCity || '');
    setStateName(user?.user?.address?.currentState || '');
    setCountry(user?.user?.address?.currentCountry || 'india');

    refAddressSheet.current?.open();
  };

  // const OnSavePress = () => {
  //   setLoading(true);
  //
  //   const payload = {
  //     vendorData: [
  //       {
  //         ...user?.user?.vendorData?.[0],
  //         businessName: businessName,
  //       },
  //     ],
  //     mobileNumber: mobileNumber,
  //     email: email,
  //   };
  //
  //   apiDispatch(
  //     updateDetails(
  //       payload,
  //       () => {
  //         setLoading(false);
  //         navigation.goBack();
  //       },
  //       error => {
  //         setLoading(false);
  //         console.log('Update Failed =>', error);
  //       },
  //     ),
  //   );
  //
  //   console.log('=== payload ===>', payload);
  // };

  const OnSavePress = () => {
    setLoading(true);

    const payload = {
      vendorData: [
        {
          ...user?.user?.vendorData?.[0],
          businessName,
        },
      ],
      mobileNumber,
      email,
    };

    apiDispatch(
      updateDetails(
        payload,
        () => {
          apiDispatch(
            addressDetails(
              {
                currentResidenceAddress: addressLine,
                area,
                currentCity: city.toLowerCase(),
                currentState: stateName.toLowerCase(),
                currentCountry: country.toLowerCase(),
              },
              () => {
                setLoading(false);
                navigation.goBack();
              },
            ),
          );
        },
        error => {
          setLoading(false);
          console.log('Update Failed =>', error);
        },
      ),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* 🔥 HEADER */}
      <View
        style={{
          height: hp(54),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: 0,
            width: wp(50),
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{
              width: hp(14),
              height: hp(14),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins600,
          }}>
          Modify Details
        </Text>
      </View>

      {/* 🔥 DIVIDER */}
      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#EDEDED',
        }}
      />

      <View style={{marginHorizontal: wp(17)}}>
        <Text
          style={{
            color: '#757575',
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
            marginTop: hp(20),
          }}>
          Enter Your Business Name
        </Text>

        <TextInput
          value={businessName}
          onChangeText={setBusinessName}
          placeholder="Enter Business Name"
          placeholderTextColor="#C0C0C0"
          style={{
            width: '100%',
            height: hp(44),
            borderWidth: hp(1),
            borderColor: '#D8D8D8',
            borderRadius: hp(10),
            paddingHorizontal: wp(17),
            marginTop: hp(12),
            fontSize: fontSize(16),
            fontFamily: fontFamily.poppins400,
            color: colors.pureBlack,
          }}
        />

        <TouchableOpacity
          onPress={openAddressSheet}
          activeOpacity={0.6}
          style={{
            marginTop: hp(30),
            flexDirection: 'row',
            alignItems: 'center',
            height: hp(44),
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: '#848484',
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Business Address
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins700,
                marginRight: wp(15),
              }}>
              {user?.user?.address?.currentResidenceAddress ? 'Edit' : 'Add'}
            </Text>
            <Image
              source={icons.rightSideIcon}
              style={{
                width: hp(6),
                height: hp(10),
                resizeMode: 'contain',
                top: -2,
                marginRight: hp(10),
              }}
            />
          </View>
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
            marginBottom: hp(15),
          }}>
          {savedAddressLine}, {savedArea}, {savedCity}, {savedState},{' '}
          {savedCountry}
        </Text>

        <View
          style={{width: '100%', height: hp(1), backgroundColor: '#E9E9E9'}}
        />

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={openMobileSheet}
          style={{
            marginTop: hp(13),
            flexDirection: 'row',
            alignItems: 'center',
            height: hp(44),
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: '#848484',
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Mobile Number
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins700,
                marginRight: wp(15),
              }}>
              {mobileNumber ? 'Edit' : 'Add'}
            </Text>
            <Image
              source={icons.rightSideIcon}
              style={{
                width: hp(6),
                height: hp(10),
                resizeMode: 'contain',
                top: -2,
                marginRight: hp(10),
              }}
            />
          </View>
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
            marginBottom: hp(15),
          }}>
          {formatMobileNumber(user?.user?.mobileNumber)}
        </Text>

        <View
          style={{width: '100%', height: hp(1), backgroundColor: '#E9E9E9'}}
        />

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={openEmailSheet}
          style={{
            marginTop: hp(13),
            flexDirection: 'row',
            alignItems: 'center',
            height: hp(44),
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              color: '#848484',
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Email (Optional)
          </Text>

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins700,
                marginRight: wp(15),
              }}>
              {email ? 'Edit' : 'Add'}
            </Text>
            <Image
              source={icons.rightSideIcon}
              style={{
                width: hp(6),
                height: hp(10),
                resizeMode: 'contain',
                top: -2,
                marginRight: hp(10),
              }}
            />
          </View>
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
            marginBottom: hp(15),
          }}>
          {user?.user?.email || 'Not added'}
        </Text>

        <View
          style={{width: '100%', height: hp(1), backgroundColor: '#E9E9E9'}}
        />
      </View>

      {!keyboardVisible && (
        <View style={{position: 'absolute', bottom: 20, width: '100%'}}>
          <TouchableOpacity
            onPress={OnSavePress}
            activeOpacity={0.6}
            style={{
              height: hp(44),
              // backgroundColor: '#7148E4',
              backgroundColor: loading ? '#9D84E8' : '#7148E4',
              marginHorizontal: wp(17),
              borderRadius: hp(30),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {loading ? (
              <ActivityIndicator color={colors.white} size="large" />
            ) : (
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins400,
                }}>
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <RBSheet
        ref={refMobileSheet}
        closeOnDragDown
        closeOnPressMask
        height={hp(250)}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: '#D9D9D9',
          },
          container: {
            borderTopLeftRadius: hp(25),
            borderTopRightRadius: hp(25),
            paddingHorizontal: wp(20),
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(18),
            fontFamily: fontFamily.poppins600,
            color: colors.pureBlack,
            marginTop: hp(10),
          }}>
          Mobile Number
        </Text>

        <View
          style={{
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(15),
            marginBottom: hp(20),
          }}
        />

        <TextInput
          value={mobileNumber}
          onChangeText={text =>
            setMobileNumber(text.replace(/[^0-9]/g, '').slice(0, 10))
          }
          keyboardType="number-pad"
          maxLength={10}
          placeholder="Enter Mobile Number"
          placeholderTextColor="#999"
          style={{
            height: hp(46),
            borderWidth: hp(1),
            borderColor: '#D8D8D8',
            borderRadius: hp(10),
            paddingHorizontal: wp(15),
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
          }}
        />

        <TouchableOpacity
          disabled={mobileNumber.length !== 10}
          activeOpacity={0.8}
          onPress={() => {
            const payload = {
              mobileNumber,
            };

            apiDispatch(
              updateDetails(payload, () => {
                refMobileSheet.current?.close();
              }),
            );
          }}
          style={{
            height: hp(48),
            borderRadius: hp(50),
            marginTop: hp(25),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: mobileNumber.length === 10 ? '#7148E4' : '#B9A7EF',
          }}>
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </RBSheet>

      <RBSheet
        ref={refEmailSheet}
        closeOnDragDown
        closeOnPressMask
        height={hp(250)}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: '#D9D9D9',
          },
          container: {
            borderTopLeftRadius: hp(25),
            borderTopRightRadius: hp(25),
            paddingHorizontal: wp(20),
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(18),
            fontFamily: fontFamily.poppins600,
            color: colors.pureBlack,
            marginTop: hp(10),
          }}>
          Email Address
        </Text>

        <View
          style={{
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(15),
            marginBottom: hp(20),
          }}
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="Enter Email Address"
          placeholderTextColor="#999"
          style={{
            height: hp(46),
            borderWidth: hp(1),
            borderColor: '#D8D8D8',
            borderRadius: hp(10),
            paddingHorizontal: wp(15),
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
          }}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            const payload = {
              email,
            };

            apiDispatch(
              updateDetails(payload, () => {
                refEmailSheet.current?.close();
              }),
            );
          }}
          style={{
            height: hp(48),
            borderRadius: hp(50),
            marginTop: hp(25),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#7148E4',
          }}>
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </RBSheet>

      <RBSheet
        ref={refAddressSheet}
        closeOnDragDown
        closeOnPressMask
        height={hp(480)}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: '#D9D9D9',
          },
          container: {
            borderTopLeftRadius: hp(25),
            borderTopRightRadius: hp(25),
            paddingHorizontal: wp(20),
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(18),
            fontFamily: fontFamily.poppins600,
            color: colors.pureBlack,
            marginTop: hp(10),
          }}>
          Add Business Location
        </Text>

        <View
          style={{
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(15),
            marginBottom: hp(20),
          }}
        />

        {/* Address Line */}
        <TextInput
          value={addressLine}
          onChangeText={setAddressLine}
          placeholder="Address Line"
          placeholderTextColor="#999"
          style={{
            height: hp(46),
            borderWidth: hp(1),
            borderColor: '#DBDBDB',
            borderRadius: hp(10),
            paddingHorizontal: wp(15),
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
          }}
        />

        {/* Area */}
        <TextInput
          value={area}
          onChangeText={setArea}
          placeholder="Area"
          placeholderTextColor="#999"
          style={{
            height: hp(46),
            borderWidth: hp(1),
            borderColor: '#DBDBDB',
            borderRadius: hp(10),
            paddingHorizontal: wp(15),
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
            marginTop: hp(15),
          }}
        />

        {/* City */}
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="City"
          placeholderTextColor="#999"
          style={{
            height: hp(46),
            borderWidth: hp(1),
            borderColor: '#DBDBDB',
            borderRadius: hp(10),
            paddingHorizontal: wp(15),
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
            marginTop: hp(15),
          }}
        />

        {/* State */}
        <TextInput
          value={stateName}
          onChangeText={setStateName}
          placeholder="State"
          placeholderTextColor="#999"
          style={{
            height: hp(46),
            borderWidth: hp(1),
            borderColor: '#DBDBDB',
            borderRadius: hp(10),
            paddingHorizontal: wp(15),
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
            marginTop: hp(15),
          }}
        />

        {/* Country */}
        <TextInput
          value={country}
          editable={false}
          placeholderTextColor="#BDBDBD"
          style={{
            height: hp(46),
            borderWidth: hp(1),
            borderColor: '#E0E0E0',
            borderRadius: hp(10),
            paddingHorizontal: wp(15),
            backgroundColor: '#F5F5F5',
            color: '#9E9E9E',
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
            marginTop: hp(15),
          }}
        />

        <TouchableOpacity
          disabled={
            !addressLine.trim() ||
            !area.trim() ||
            !city.trim() ||
            !stateName.trim()
          }
          activeOpacity={0.8}
          onPress={() => {
            setSavedAddressLine(addressLine);
            setSavedArea(area);
            setSavedCity(city);
            setSavedState(stateName);
            setSavedCountry(country);

            refAddressSheet.current?.close();
          }}
          style={{
            height: hp(48),
            borderRadius: hp(50),
            marginTop: hp(25),
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor:
              addressLine.trim() &&
              area.trim() &&
              city.trim() &&
              stateName.trim()
                ? '#7148E4'
                : '#B9A7EF',
          }}>
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize(15),
              fontFamily: fontFamily.poppins600,
            }}>
            Save Changes
          </Text>
        </TouchableOpacity>
      </RBSheet>
    </SafeAreaView>
  );
};

export default VendorModifyDetailScreen;
