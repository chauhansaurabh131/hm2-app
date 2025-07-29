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

  const Prefer_Country = [
    'India',
    'Canada',
    'Us',
    'Afghanistan',
    'China',
    'Myanmar',
    'Nepal',
    'Sri-lanka',
    'Pakistan',
  ];

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

  // const onDashboardPress = () => {
  //   setLoading(true);
  //   const mappedDatingList = getMappedDatingValues(preferenceDatingList);
  //
  //   console.log(
  //     ' === onDashboardPress ===> ',
  //     mappedDatingList,
  //     ageRange[0],
  //     ageRange[1],
  //     countryList,
  //   );
  //
  //   // const payload = {
  //   //   interestedIn: mappedDatingList, // Send the mapped values instead of labels
  //   //   age: {min: ageRange[0], max: ageRange[1]},
  //   //   preferredLocation: countryList,
  //   //   // userPartnerPreCompleted: true,
  //   // };
  //   //
  //   // dispatch(
  //   //   datingPartnerReferences(payload, () => {
  //   //     setLoading(false);
  //   //     navigation.navigate('HomeTabs');
  //   //   }),
  //   // );
  // };

  const onDashboardPress = () => {
    // Check if any of the required values are empty

    const mappedDatingList = getMappedDatingValues(preferenceDatingList);

    if (
      mappedDatingList.length === 0 ||
      ageRange[0] === ageRange[1] || // If age range is not selected correctly
      countryList.length === 0
    ) {
      // If any of the fields are empty, show a notification (alert)
      Alert.alert(
        'Missing Information',
        'Please fill in all the required fields before proceeding.',
        [{text: 'OK'}],
        {cancelable: false},
      );
      setLoading(false);
      return; // Exit the function to prevent further execution
    }

    // If all data is filled, proceed with your logic
    setLoading(true);
    console.log(
      ' === onDashboardPress ===> ',
      mappedDatingList,
      ageRange[0],
      ageRange[1],
      countryList,
    );

    const payload = {
      interestedIn: mappedDatingList, // Send the mapped values instead of labels
      age: {min: ageRange[0], max: ageRange[1]},
      preferredLocation: countryList,
    };

    // dispatch(
    //   datingPartnerReferences(payload, () => {
    //     setLoading(false);
    //     navigation.navigate('HomeTabs');
    //   }),
    // );
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
      <View style={{marginHorizontal: wp(17), flex: 1}}>
        {/*<AppColorLogo />*/}
        <Text
          style={{
            color: 'black',
            marginTop: hp(30),
            fontSize: fontSize(20),
            lineHeight: hp(30),
            fontFamily: fontFamily.poppins600,
            textAlign: 'center',
          }}>
          Add Partner Preference
        </Text>
        <ScrollView>
          <View style={{marginTop: hp(50)}}>
            <NewBottomSheetMultipleValueSelect
              label="Select Interested In"
              options={Dating_List}
              onSelect={handleInterestedInSelect}
              bottomSheetHeight={hp(450)}
            />

            <View style={{alignItems: 'center', marginTop: hp(50)}}>
              <AgeRangeSlider
                initialRange={ageRange}
                onSubmitRange={handleRangeSubmit}
                tittleLabelText={'Select Age Range'}
                min={18}
                max={50}
                containerStyle={{width: '100%'}}
                labelContainerStyle={{
                  marginHorizontal: 3,
                  marginBottom: 5,
                }}
                rangeLabel={{
                  fontsize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins600,
                }}
                tittleLabel={{
                  fontsize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  color: '#9A9A9A',
                }}
                trackStyle={{height: 3}}
              />
            </View>

            <View style={{marginTop: 50}}>
              <NewBottomSheetMultipleValueSelect
                label="Select Prefer Country"
                options={Prefer_Country}
                onSelect={handleSelect} // Pass the onSelect handler to capture selected values
                bottomSheetHeight={hp(450)}
              />
            </View>
          </View>

          <View style={{height: hp(150)}} />
        </ScrollView>

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
            // disabled={isUpdatingProfile}
            style={{
              width: wp(176),
              height: hp(44),
              borderRadius: 30,
              backgroundColor: colors.black,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {loading ? (
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
