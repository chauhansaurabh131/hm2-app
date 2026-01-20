import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import style from './style';
import {hp} from '../../utils/helpers';
import Toast from 'react-native-toast-message';
import NewSelectValueComponent from '../../components/newSelectValueComponent';
import NewEnterSelectValueComponent from '../../components/newEnterSelectValueComponent';

const AddressDetailsScreen = ({
  setCurrentCountry,
  setCurrentState,
  setSelectCurrentCity,
}) => {
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

  const [selectedCountryStatus, setSelectedCountryStatus] = useState('');
  const [selectedStateStatus, setSelectedStateStatus] = useState('');
  const [selectedCityStatus, setSelectedCityStatus] = useState('');

  return (
    <SafeAreaView style={style.container}>
      <NewSelectValueComponent
        title="Select Current Country"
        value={selectedCountryStatus}
        dropdownData={currentCountryDropDown}
        onValueChange={value => {
          setSelectedCountryStatus(value); // ✅ update UI
          setCurrentCountry?.(value); // ✅ optional: update parent
        }}
        bottomSheetHeight={hp(100)}
      />

      <View style={{marginTop: hp(10)}}>
        <NewSelectValueComponent
          title="Select Current State"
          value={selectedStateStatus}
          dropdownData={currentStateDropdown}
          onValueChange={value => {
            setSelectedStateStatus(value); // ✅ update UI
            setCurrentState?.(value); // ✅ optional: update parent
          }}
          bottomSheetHeight={hp(500)}
          showSearch={true}
        />
      </View>

      <View style={{marginTop: hp(10)}}>
        <NewEnterSelectValueComponent
          title="Select Current City"
          value={selectedCityStatus}
          emptyText="Add"
          modalTitle="Current City"
          EnterModalPlaceholderTittle={'Enter Current City'}
          onValueChange={value => {
            setSelectedCityStatus(value);
            setSelectCurrentCity?.(value);
          }}
        />
      </View>

      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default AddressDetailsScreen;
