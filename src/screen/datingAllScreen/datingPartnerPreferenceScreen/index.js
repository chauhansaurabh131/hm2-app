import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {
  datingPartnerReferences,
  updateDetails,
} from '../../../actions/homeActions';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';

import NewBottomSheetMultipleValueSelect from '../../../components/newBottomSheetMultipleValueSelect';
import AgeRangeSlider from '../../../components/ageRangeSlider';
import style from '../../partnerPreferencesScreen/style';
import NewMultiSelectValueComponent from '../../../components/newMultiSelectValueComponent';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';
import NewEnterMultipleSelectValueComponent from '../../../components/newEnterMultipleSelectValueComponent';
import Toast from 'react-native-toast-message';

const DatingPartnerPreferenceScreen = () => {
  const [preferenceDatingList, setPreferenceDatingList] = useState([]);
  const [ageRange, setAgeRange] = useState([25, 35]); // Initial age range
  const [countryList, setCountryList] = useState([]);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const apiDispatch = useDispatch();
  const navigation = useNavigation();
  // const {isUpdatingProfile} = useSelector(state => state.auth);
  //
  // console.log(' === isUpdatingProfile ===> ', isUpdatingProfile);

  const Dating_List = [
    'Meet New Friends',
    'Looking for Love',
    'Movie Date',
    'Foodies',
    'Travel Buddies',
    'Game Lover',
    'Chit-Chat',
    'Adventurous',
  ];

  // Create a mapping for the labels to their corresponding values
  const DatingListMapping = {
    'Meet New Friends': 'meet-new-friends',
    'Looking for Love': 'looking-for-love',
    Foodies: 'foodies',
    'Travel Buddies': 'travel-buddies',
    'Movie Date': 'movie-date',
    'Game Lover': 'game-lover',
    'Chit-Chat': 'chit-chat', // Added the correct key with hyphen
    Adventurous: 'adventurous',
  };

  const Prefer_Country = ['India'];

  const [Interested, setInterested] = useState([]);
  const [ageRanges, setAgeRanges] = useState(['Select']); // Initial age range
  const [preferCity, setPreferCity] = useState([]);

  // Function to map the selected labels to their corresponding values
  const getMappedDatingValues = selectedLabels => {
    console.log('Selected Labels: ', selectedLabels); // Log the selected labels
    return selectedLabels
      .map(label => DatingListMapping[label]) // Map to corresponding value
      .filter(mappedValue => mappedValue !== undefined); // Filter out undefined values
  };

  const handleInterestedInSelect = selectedValue => {
    setPreferenceDatingList(selectedValue);
  };

  const handleRangeSubmit = range => {
    setAgeRange(range); // Update the state with the selected age range
  };

  const handleSelect = selectedValue => {
    setCountryList(selectedValue);
  };

  const isFormValid =
    Interested.length > 0 && ageRanges !== 'Select' && preferCity.length > 0;

  const onDashboardPress = () => {
    // Check if any of the required values are empty

    if (!isFormValid) {
      return Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please fill all required fields.',
      });
    }

    const mappedDatingList = getMappedDatingValues(Interested);

    // if (
    //   mappedDatingList.length === 0 ||
    //   ageRange[0] === ageRange[1] || // If age range is not selected correctly
    //   countryList.length === 0
    // ) {
    //   // If any of the fields are empty, show a notification (alert)
    //   Alert.alert(
    //     'Missing Information',
    //     'Please fill in all the required fields before proceeding.',
    //     [{text: 'OK'}],
    //     {cancelable: false},
    //   );
    //   setLoading(false);
    //   return; // Exit the function to prevent further execution
    // }

    // If all data is filled, proceed with your logic
    // setLoading(true);

    // console.log(
    //   ' === onDashboardPress ===> ',
    //   mappedDatingList,
    //   ageRange[0],
    //   ageRange[1],
    //   countryList,
    // );

    // const getAgeRange = range => {
    //   if (!range || range === 'Select') {
    //     return {};
    //   }
    //
    //   const [min, max] = range.split('-').map(v => v.trim());
    //   return {min, max};
    // };
    const getAgeRange = range => {
      if (!range || typeof range !== 'string' || range === 'Select') {
        return {};
      }

      const [min, max] = range.split('-').map(v => v.trim());
      return {min, max};
    };

    const ageRange = getAgeRange(ageRanges);

    const payload = {
      interestedIn: mappedDatingList, // Send the mapped values instead of labels
      // age: {min: ageRange[0], max: ageRange[1]},
      age: ageRange,
      preferredLocation: preferCity,
    };

    setLoading(true);

    // console.log(' === payload... ===> ', payload);

    dispatch(
      datingPartnerReferences(payload, () => {
        apiDispatch(
          updateDetails({userPartnerPreCompleted: true}, () => {
            setLoading(false);
            navigation.navigate('HomeTabs');
          }),
        );
      }),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        <Text
          style={{
            color: 'black',
            marginTop: hp(10),
            fontSize: fontSize(16),
            lineHeight: hp(30),
            fontFamily: fontFamily.poppins600,
            textAlign: 'center',
            marginBottom: hp(10),
          }}>
          Add Your Preferences
        </Text>
      </View>

      <View
        style={{
          width: '100%',
          height: 4,
          backgroundColor: '#F9F7FF',
          marginBottom: hp(5),
        }}
      />

      <View style={{marginTop: hp(10)}}>
        <NewMultiSelectValueComponent
          title="Select Interested In?"
          value={Interested} // 👈 ARRAY
          dropdownData={Dating_List}
          onValueChange={setInterested} // 👈 ARRAY SETTER
          bottomSheetHeight={hp(480)}
          showDivider={false}
          selectedContainerStyle={{top: -10}}
          maxSelection={3}
        />
      </View>

      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#E9E9E9',
          marginTop: hp(10),
          marginBottom: hp(20),
        }}
      />

      <NewSelectValueComponent
        title="Select Age Range"
        value={ageRanges}
        dropdownData={[
          '18 - 25',
          '26 - 35',
          '36 - 45',
          '46 - 52',
          '53 - 60',
          '60 - 70',
        ]}
        onValueChange={setAgeRanges}
        bottomSheetHeight={hp(500)}
        showDivider={false}
      />

      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#E9E9E9',
          marginTop: hp(20),
          marginBottom: hp(10),
        }}
      />

      <NewEnterMultipleSelectValueComponent
        title="Select Preferred City"
        value={preferCity}
        onValueChange={setPreferCity}
        modalTitle="City"
        EnterModalPlaceholderTittle="Enter City"
        showDivider={false}
        valuesBelowContainerStyle={{top: -12}}
      />
      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#E9E9E9',
          marginTop: hp(10),
          marginBottom: hp(10),
        }}
      />

      <View style={{marginHorizontal: wp(17), flex: 1}}>
        {/*<AppColorLogo />*/}
        {/*<Text*/}
        {/*  style={{*/}
        {/*    color: 'black',*/}
        {/*    marginTop: hp(30),*/}
        {/*    fontSize: fontSize(20),*/}
        {/*    lineHeight: hp(30),*/}
        {/*    fontFamily: fontFamily.poppins600,*/}
        {/*    textAlign: 'center',*/}
        {/*  }}>*/}
        {/*  Add Partner Preference...*/}
        {/*</Text>*/}
        {/*<ScrollView>*/}
        {/*  <View style={{marginTop: hp(50)}}>*/}
        {/*    <NewBottomSheetMultipleValueSelect*/}
        {/*      label="Select Interested In"*/}
        {/*      options={Dating_List}*/}
        {/*      onSelect={handleInterestedInSelect}*/}
        {/*      bottomSheetHeight={hp(400)}*/}
        {/*    />*/}

        {/*    <View style={{alignItems: 'center', marginTop: hp(50)}}>*/}
        {/*      <AgeRangeSlider*/}
        {/*        initialRange={ageRange}*/}
        {/*        onSubmitRange={handleRangeSubmit}*/}
        {/*        tittleLabelText={'Select Age Range'}*/}
        {/*        min={18}*/}
        {/*        max={50}*/}
        {/*        containerStyle={{width: '100%'}}*/}
        {/*        labelContainerStyle={{*/}
        {/*          marginHorizontal: 3,*/}
        {/*          marginBottom: 5,*/}
        {/*        }}*/}
        {/*        rangeLabel={{*/}
        {/*          fontsize: fontSize(16),*/}
        {/*          lineHeight: hp(24),*/}
        {/*          fontFamily: fontFamily.poppins600,*/}
        {/*        }}*/}
        {/*        tittleLabel={{*/}
        {/*          fontsize: fontSize(16),*/}
        {/*          lineHeight: hp(24),*/}
        {/*          fontFamily: fontFamily.poppins400,*/}
        {/*          color: '#9A9A9A',*/}
        {/*        }}*/}
        {/*        trackStyle={{height: 3}}*/}
        {/*      />*/}
        {/*    </View>*/}

        {/*    <View style={{marginTop: 50}}>*/}
        {/*      <NewBottomSheetMultipleValueSelect*/}
        {/*        label="Select Prefer Country"*/}
        {/*        options={Prefer_Country}*/}
        {/*        onSelect={handleSelect} // Pass the onSelect handler to capture selected values*/}
        {/*        bottomSheetHeight={hp(100)}*/}
        {/*      />*/}
        {/*    </View>*/}
        {/*  </View>*/}

        {/*  <View style={{height: hp(150)}} />*/}
        {/*</ScrollView>*/}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            height: hp(87),
            alignItems: 'center',
            position: 'absolute',
            bottom: 10,
            width: '100%',
            backgroundColor: 'white',
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
            onPress={() => navigation.goBack()}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: fontSize(14),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
                color: colors.black,
              }}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onDashboardPress}
            disabled={!isFormValid || loading}
            style={{
              width: wp(176),
              height: hp(44),
              borderRadius: 30,
              backgroundColor: isFormValid ? colors.black : '#C5C5C5',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {loading ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(14),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  opacity: isFormValid ? 1 : 0.6,
                }}>
                Go to Dashboard
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DatingPartnerPreferenceScreen;
