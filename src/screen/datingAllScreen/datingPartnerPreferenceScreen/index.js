import React, {useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';

import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';

import DropDownMutipleValueComponent from '../../../components/DropDownMutipleValueComponent';

import DropdownHeightAndAgeComponent from '../../../components/DropdownHeightAndAgeComponent';
import {datingPartnerReferences} from '../../../actions/homeActions';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {COUNTRY_LIST, Dating_List} from '../../../utils/data';

const DatingPartnerPreferenceScreen = () => {
  const [preferenceDatingList, setPreferenceDatingList] = useState([]);
  const [selectedAgeFrom, setSelectedAgeFrom] = useState('');
  const [selectedAgeTo, setSelectedAgeTo] = useState('');
  const [countryList, setCountryList] = useState([]);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {isUpdatingProfile} = useSelector(state => state.auth);

  const AgeFrom = ['22', '23', '24']; // Your options
  const AgeFromTo = ['32', '33', '34']; // Your options

  const getSelectedDatingLabels = () => {
    return preferenceDatingList
      .map(value => {
        const dating = Dating_List.find(item => item.value === value);
        return dating ? dating.label.toLowerCase().replace(/\s+/g, '-') : null;
      })
      .filter(label => label); // Filter out any null values
  };

  const getSelectedCountryLabels = () => {
    return countryList
      .map(value => {
        const country = COUNTRY_LIST.find(item => item.value === value);
        return country
          ? country.label.toLowerCase().replace(/\s+/g, '-')
          : null;
      })
      .filter(label => label); // Filter out any null values
  };

  const onDashboardPress = () => {
    console.log(
      ' === getSelectedDatingLabels ===> ',
      getSelectedDatingLabels(),
    );

    console.log(
      ' === getSelectedCountryLabels ===> ',
      getSelectedCountryLabels(),
    );

    const payload = {
      interestedIn: getSelectedDatingLabels(),
      age: {min: selectedAgeFrom, max: selectedAgeTo},
      preferredLocation: getSelectedCountryLabels(),
    };

    dispatch(
      datingPartnerReferences(payload, () => {
        navigation.navigate('HomeTabs');
      }),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17), flex: 1}}>
        <AppColorLogo />
        <Text
          style={{
            color: 'black',
            marginTop: hp(10),
            fontSize: fontSize(20),
            lineHeight: hp(30),
            fontFamily: fontFamily.poppins600,
            textAlign: 'center',
          }}>
          Add Partner Preference
        </Text>

        <View style={{marginTop: hp(43)}}>
          <Text
            style={{
              color: '#9A9A9A',
              fontSize: fontSize(12),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              marginTop: hp(34),
            }}>
            Select Interested In
          </Text>

          <DropDownMutipleValueComponent
            data={Dating_List}
            height={50}
            searchPlaceholder={'Search Country'}
            placeholder={'Select'}
            selectedItems={preferenceDatingList}
            setSelectedItems={setPreferenceDatingList}
          />

          <Text
            style={{
              color: '#9A9A9A',
              fontSize: fontSize(12),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              marginTop: hp(34),
            }}>
            Select Age Range
          </Text>

          <View
            style={{
              marginTop: hp(5),
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{width: '45%'}}>
              <DropdownHeightAndAgeComponent
                options={AgeFrom}
                placeholder="25"
                selectedValue={selectedAgeFrom}
                setSelectedValue={setSelectedAgeFrom}
              />
            </View>
            <View style={{width: '45%'}}>
              <DropdownHeightAndAgeComponent
                options={AgeFromTo}
                placeholder="25"
                selectedValue={selectedAgeTo}
                setSelectedValue={setSelectedAgeTo}
              />
            </View>
          </View>

          <Text
            style={{
              color: '#9A9A9A',
              fontSize: fontSize(12),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              marginTop: hp(25),
            }}>
            Preferred Location
          </Text>

          <DropDownMutipleValueComponent
            data={COUNTRY_LIST}
            height={50}
            searchPlaceholder={'Search Country'}
            placeholder={'Select'}
            selectedItems={countryList}
            setSelectedItems={setCountryList}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: hp(87),
            alignItems: 'center',
            position: 'absolute',
            bottom: 10,
            width: '100%',
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: wp(133),
              height: hp(44),
              borderRadius: 25,
              borderWidth: 1,
              borderColor: colors.black,
              justifyContent: 'center',
            }}
            // onPress={() => navigation.goBack()}
          >
            <Text
              style={{
                textAlign: 'center',
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
                color: colors.black,
              }}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onDashboardPress}
            disabled={isUpdatingProfile}
            style={{
              width: wp(176),
              height: hp(44),
              borderRadius: 30,
              backgroundColor: colors.black,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {isUpdatingProfile ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Dashboard
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DatingPartnerPreferenceScreen;
