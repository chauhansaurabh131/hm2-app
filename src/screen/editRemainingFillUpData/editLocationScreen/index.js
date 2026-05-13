import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {useDispatch, useSelector} from 'react-redux';
import {addressDetails} from '../../../actions/homeActions';
import {icons} from '../../../assets';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';

const EditLocationScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);

  const apiDispatch = useDispatch();

  const [currentCountry, setCurrentCountry] = useState('');
  const [currentState, setCurrentState] = useState('');
  const [selectCurrentCity, setSelectCurrentCity] = useState('');
  const [loading, setLoading] = useState(false); // Loader state

  const currentCountryDropDown = ['India'];

  const currentStateDropdown = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya-Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];

  useEffect(() => {
    if (user?.user?.address?.currentCountry) {
      setCurrentCountry(user?.user?.address?.currentCountry);
    }
    if (user?.user?.address?.currentState) {
      setCurrentState(user?.user?.address?.currentState);
    }
    if (user?.user?.address?.currentCity) {
      setSelectCurrentCity(user?.user?.address?.currentCity);
    }
  }, [
    // user?.user?.address?.currentResidenceAddress,
    user?.user?.address?.currentCountry,
    user?.user?.address?.currentState,
    user?.user?.address?.currentCity,
  ]);

  const isFormValid =
    currentCountry?.trim() && currentState?.trim() && selectCurrentCity?.trim();

  const onSubmitPress = () => {
    setLoading(true);

    const formattedCountry =
      currentCountry.charAt(0).toLowerCase() + currentCountry.slice(1);

    const formatState = state => {
      if (!state) {
        return '';
      }
      return currentState.toLowerCase().replace(/\s+/g, '-');
    };

    apiDispatch(
      addressDetails(
        {
          // currentResidenceAddress: residingAddress,
          currentCountry: formattedCountry,
          currentState: formatState(currentState),
          currentCity: selectCurrentCity.toLowerCase(),
        },
        () => {
          setLoading(false);
          navigation.goBack();
        },
      ),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{flex: 1}}>
        {/* Header */}
        <View
          style={{
            height: hp(50),
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
            Location Info
          </Text>
        </View>

        <View
          style={{width: '100%', height: hp(1), backgroundColor: '#E3E3E3'}}
        />

        <View style={{marginHorizontal: wp(17)}}>
          <View style={{marginTop: hp(30)}}>
            <NewSelectValueComponent
              title="Select Current Country"
              value={currentCountry}
              dropdownData={currentCountryDropDown}
              onValueChange={value => {
                setCurrentCountry(value);
              }}
              bottomSheetHeight={hp(100)}
            />
          </View>

          <View style={{marginTop: hp(37)}}>
            <NewSelectValueComponent
              title="Select Current State"
              value={currentState}
              dropdownData={currentStateDropdown}
              onValueChange={value => {
                setCurrentState(value); // ✅ update UI
              }}
              bottomSheetHeight={hp(500)}
              showSearch={true}
            />
          </View>

          <View style={{marginTop: hp(37)}}>
            <NewEnterSelectValueComponent
              title="Select Current City"
              value={selectCurrentCity}
              emptyText="Add"
              modalTitle="Current City"
              EnterModalPlaceholderTittle={'Enter Current City'}
              onValueChange={value => {
                setSelectCurrentCity(value);
              }}
            />
          </View>
        </View>

        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 15,
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: wp(17),
            }}>
            <TouchableOpacity
              onPress={onSubmitPress}
              activeOpacity={isFormValid ? 0.7 : 1}
              disabled={!isFormValid || loading} // ✅ disable when empty
              style={{
                width: '100%',
                height: hp(50),
                borderRadius: hp(25),
                backgroundColor: colors.pureBlack,
                justifyContent: 'center',
                alignItems: 'center',
                opacity: isFormValid ? 1 : 0.5,
              }}>
              {loading ? (
                // Show loader if loading is true
                <ActivityIndicator size="large" color={colors.white} />
              ) : (
                <Text
                  style={{
                    color: colors.white,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Submit
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditLocationScreen;
