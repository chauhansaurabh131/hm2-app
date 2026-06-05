import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
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
import NewMultiSelectValueComponent from '../../../components/newMultiSelectValueComponent';
import {
  datingPartnerReferences,
  updateDetails,
} from '../../../actions/homeActions';
import {changeStack} from '../../../actions/authActions';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';
import NewEnterMultipleSelectValueComponent from '../../../components/newEnterMultipleSelectValueComponent';

const ModifyDatingPartnerPreferenceScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();
  const dispatch = useDispatch();

  const userData = route?.params?.UserData || {};

  console.log(' === userData888888 ===> ', userData);

  const [loading, setLoading] = useState(false);

  const [Interested, setInterested] = useState(
    () =>
      userData?.userPartnerPrefForDating?.interestedIn?.map(item =>
        item
          .split('-')
          .map(
            word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(' '),
      ) || [],
  );

  const [ageRanges, setAgeRanges] = useState(() => {
    const age = userData?.userPartnerPrefForDating?.age;

    if (!age?.min || !age?.max) {
      return '';
    }

    return `${age.min} - ${age.max}`;
  });

  const [preferCity, setPreferCity] = useState(
    userData?.userPartnerPrefForDating?.preferredLocation?.map(
      city => city.charAt(0).toUpperCase() + city.slice(1).toLowerCase(),
    ) || [],
  );

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

  const getMappedDatingValues = selectedLabels => {
    console.log('Selected Labels: ', selectedLabels); // Log the selected labels
    return selectedLabels
      .map(label => DatingListMapping[label]) // Map to corresponding value
      .filter(mappedValue => mappedValue !== undefined); // Filter out undefined values
  };

  const onSavePress = () => {
    const mappedDatingList = getMappedDatingValues(Interested);

    const getAgeRange = range => {
      if (!range || typeof range !== 'string' || range === 'Select') {
        return {};
      }

      const [min, max] = range.split('-').map(v => v.trim());
      return {min, max};
    };

    const ageRange = getAgeRange(ageRanges);

    const payload = {
      interestedIn: mappedDatingList,
      age: ageRange,
      preferredLocation: preferCity,
    };

    setLoading(true);

    dispatch(
      datingPartnerReferences(
        payload,
        response => {
          console.log('datingPartnerReferences Success ===>', response);

          apiDispatch(
            updateDetails(
              {}, // or your payload if required
              response => {
                console.log('updateDetails Success ===>', response);

                setLoading(false);
                navigation.goBack();
              },
              error => {
                console.log('updateDetails Error ===>', error);

                setLoading(false);
              },
            ),
          );
        },
        error => {
          console.log('datingPartnerReferences Error ===>', error);

          setLoading(false);
        },
      ),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* Header */}
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
          Change Partner Preference
        </Text>
      </View>

      {/* Divider */}
      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#EDEDED',
        }}
      />

      <View style={{marginTop: hp(20)}}>
        <View style={{marginHorizontal: wp(17)}}>
          <NewMultiSelectValueComponent
            title="Select Prefer Interests"
            value={Interested} // 👈 ARRAY
            dropdownData={Dating_List}
            onValueChange={setInterested} // 👈 ARRAY SETTER
            bottomSheetHeight={hp(480)}
            showDivider={false}
            selectedContainerStyle={{top: -5}}
            maxSelection={3}
          />
        </View>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(26),
          }}
        />

        <View style={{marginHorizontal: wp(17), marginTop: hp(20)}}>
          <NewSelectValueComponent
            title="Select Your Age Range"
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
            bottomSheetHeight={hp(320)}
            showDivider={false}
          />
        </View>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(22),
          }}
        />

        <View style={{marginTop: hp(20), marginHorizontal: wp(17)}}>
          <NewEnterMultipleSelectValueComponent
            title="Select Your Prefer Cities"
            value={preferCity}
            onValueChange={setPreferCity}
            modalTitle="City"
            EnterModalPlaceholderTittle="Enter City"
            showDivider={false}
            valuesBelowContainerStyle={{top: -8}}
          />
        </View>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(22),
          }}
        />
      </View>

      {/* Save Button */}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: hp(30),
        }}>
        <TouchableOpacity
          onPress={onSavePress}
          activeOpacity={0.6}
          disabled={loading}
          style={{
            height: hp(44),
            backgroundColor: colors.pureBlack,
            borderRadius: hp(30),
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: wp(17),
          }}>
          {loading ? (
            <ActivityIndicator color="#FFF" size="large" />
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
    </SafeAreaView>
  );
};

export default ModifyDatingPartnerPreferenceScreen;
