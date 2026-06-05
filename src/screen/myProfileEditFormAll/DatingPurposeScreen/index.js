import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {icons} from '../../../assets';
import NewMultiSelectValueComponent from '../../../components/newMultiSelectValueComponent';
import {updateDetails} from '../../../actions/homeActions';

const DatingPurposeScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const userData = route?.params?.UserData || {};

  const dropdownData = [
    'Meet New Friends',
    'Looking for Love',
    'Movie Date',
    'Foodies',
    'Travel Buddies',
    'Game Lover',
    'Chit-Chat',
    'Adventurous',
  ];

  const [datingSelectedOption, setDatingSelectedOption] = useState(() =>
    (userData?.datingData?.[0]?.interestedIn || []).map(item =>
      item
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
    ),
  );

  const [loading, setLoading] = useState(false);

  const onSavePress = () => {
    if (loading) {
      return;
    }

    setLoading(true);

    const slugify = text =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

    const selectedSlugArray = datingSelectedOption.map(item => slugify(item));

    const payload = {
      datingData: [
        {
          interestedIn: selectedSlugArray,
        },
      ],
    };

    console.log('Payload ===> ', payload);

    apiDispatch(
      updateDetails(
        payload,
        () => {
          setLoading(false);
          navigation.goBack();
        },
        () => {
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
          Modify Purpose Info
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

      {/* Content */}
      <View
        style={{
          marginTop: hp(20),
          marginHorizontal: wp(17),
        }}>
        <NewMultiSelectValueComponent
          title="I am looking for"
          value={datingSelectedOption}
          dropdownData={dropdownData}
          onValueChange={setDatingSelectedOption}
          bottomSheetHeight={hp(500)}
          showDivider={false}
          maxSelection={3}
        />

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(5),
          }}
        />
      </View>

      {/* Save Button */}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 30,
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
            <ActivityIndicator color="#FFF" size={'large'} />
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

export default DatingPurposeScreen;
