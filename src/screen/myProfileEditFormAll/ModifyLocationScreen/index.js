import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {icons} from '../../../assets';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';
import {addressDetails, updateDetails} from '../../../actions/homeActions';

const ModifyLocationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const userData = route?.params?.UserData || {};

  // console.log(' === userData--- ===> ', userData?.address?.currentState);

  const capitalize = text => {
    if (!text) {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const [selectedCityStatus, setSelectedCityStatus] = useState(
    userData?.address?.currentCity || '',
  );

  const [selectedStateStatus, setSelectedStateStatus] = useState(
    userData?.address?.currentState || '',
  );

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

  const formatState = state => {
    if (!state) {
      return '';
    }
    return selectedStateStatus.toLowerCase().replace(/\s+/g, '-');
  };

  const onSavePress = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      await apiDispatch(
        addressDetails({
          currentCity: selectedCityStatus.toLowerCase(),
          currentState: formatState(selectedStateStatus),
        }),
      );

      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.log('API Error:', error);
      setLoading(false);
    }
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
          Modify Location
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

      <View style={{marginTop: hp(20), paddingHorizontal: wp(17)}}>
        <NewEnterSelectValueComponent
          title="Select Current City"
          value={capitalize(selectedCityStatus)}
          emptyText="Add"
          modalTitle="Current City"
          EnterModalPlaceholderTittle={'Enter Current City'}
          onValueChange={value => {
            setSelectedCityStatus(value);
          }}
        />

        <View style={{marginTop: hp(20)}}>
          <NewSelectValueComponent
            title="Select Current State"
            value={capitalize(selectedStateStatus)}
            dropdownData={currentStateDropdown}
            onValueChange={value => {
              setSelectedStateStatus(value); // ✅ update UI
            }}
            bottomSheetHeight={hp(500)}
            showSearch={true}
          />
        </View>
      </View>

      {/* 🔥 SAVE BUTTON */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
          height: hp(100),
          // backgroundColor: 'white',
        }}>
        <TouchableOpacity
          onPress={onSavePress}
          activeOpacity={0.6}
          style={{
            width: '93%',
            height: hp(50),
            borderRadius: hp(25),
            backgroundColor: colors.pureBlack,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: hp(30),
          }}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: 'white',
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
              }}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ModifyLocationScreen;
