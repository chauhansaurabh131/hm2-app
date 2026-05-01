import React, {useState, useEffect} from 'react';
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

const ModifyHobbiesAndInterestScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const userData = route?.params?.UserData || {};

  console.log(' === userData--- ===> ', userData?.hobbies);

  const [multiHobbiesStatus, setMultiHobbiesStatus] = useState([]);
  const [multiLanguageStatus, setMultiLanguageStatus] = useState([]);

  // 🔥 OPTIONS
  const options = [
    'Writing',
    'Play Instrument',
    'Poetry',
    'Cooking',
    'Painting',
    'Gardening',
    'Singing',
    'Diy Crafts',
    'Blogging',
    'Photography',
    'Dancing',
    'Content Creation',
    'Movie',
    'Sports',
    'Biking',
    'Music',
    'Social Media',
    'Clubbing',
    'Travelling',
    'Gaming',
    'Shopping',
    'Reading',
    'Binge Watching',
    'Theater Events',
    'Running',
    'Cycling',
    'Yoga',
    'Walking',
    'Working Out',
    'Trekking',
    'Aerobics Zumba',
    'Swimming',
  ];

  const language = ['Hindi', 'Gujarati', 'English'];

  // 🔥 FORMAT API → UI
  const formatForUI = item => {
    if (!item) {
      return '';
    }

    return item.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  // 🔥 FORMAT UI → API
  const formatForAPI = item => {
    if (!item) {
      return '';
    }

    return item.toLowerCase().replace(/\s+/g, '_');
  };

  // 🔥 PREFILL DATA
  useEffect(() => {
    if (userData?.hobbies?.length > 0) {
      const formatted = userData.hobbies.map(formatForUI);
      setMultiHobbiesStatus(formatted);
    }

    if (userData?.language?.length > 0) {
      const formattedLang = userData.language.map(formatForUI);
      setMultiLanguageStatus(formattedLang);
    }
  }, [userData]);

  // 🔥 SAVE API
  const onSavePress = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      const formattedHobbies = multiHobbiesStatus.map(formatForAPI);
      const formattedLanguages = multiLanguageStatus.map(formatForAPI);

      await apiDispatch(
        updateDetails({
          hobbies: formattedHobbies,
          language: formattedLanguages,
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
      {/* HEADER */}
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
          Modify Hobbies & Interest
        </Text>
      </View>

      {/* DIVIDER */}
      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#EDEDED',
        }}
      />

      <View style={{marginTop: hp(20), paddingHorizontal: wp(17)}}>
        {/* HOBBIES */}
        <NewMultiSelectValueComponent
          title="Add Hobbies"
          value={multiHobbiesStatus}
          dropdownData={options}
          onValueChange={setMultiHobbiesStatus}
          bottomSheetHeight={hp(500)}
          maxSelection={5}
        />

        {/* LANGUAGE */}
        <View style={{marginTop: hp(40)}}>
          <NewMultiSelectValueComponent
            title="Add Language Known"
            value={multiLanguageStatus}
            dropdownData={language}
            onValueChange={setMultiLanguageStatus}
            bottomSheetHeight={hp(200)}
          />
        </View>
      </View>

      {/* SAVE BUTTON */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
          height: hp(100),
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

export default ModifyHobbiesAndInterestScreen;
