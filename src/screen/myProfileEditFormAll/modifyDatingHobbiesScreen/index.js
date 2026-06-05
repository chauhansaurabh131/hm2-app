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
import NewSelectValueComponent from '../../../components/newSelectValueComponent';
import NewMultiSelectValueComponent from '../../../components/newMultiSelectValueComponent';
import {updateDetails} from '../../../actions/homeActions';

const ModifyDatingHobbiesScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const userData = route?.params?.UserData || {};

  console.log(' === var ===> ', userData?.hobbies);

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

  const [multiHobbiesStatus, setMultiHobbiesStatus] = useState(
    () =>
      userData?.hobbies?.[0]?.split(',')?.map(item =>
        item
          .trim()
          .replace(/_/g, ' ')
          .split(' ')
          .map(
            word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
          )
          .join(' '),
      ) || [],
  );

  const [loading, setLoading] = useState(false);

  const onSavePress = () => {
    if (loading) {
      return;
    }

    setLoading(true);

    const formatted = multiHobbiesStatus
      .map(item => item.toLowerCase().replace(/\s+/g, '_'))
      .join(', ');

    apiDispatch(
      updateDetails(
        {
          hobbies: formatted,
        },
        response => {
          console.log('Success ===>', response);

          setLoading(false);
          navigation.goBack();
        },
        error => {
          console.log('Error ===>', error);

          setLoading(false);

          Alert.alert('Error', error?.message || 'Something went wrong');
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
          Modify Hobbies & Interest Info
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

      <View style={{marginTop: hp(20), marginHorizontal: wp(17)}}>
        <NewMultiSelectValueComponent
          title="Add Hobbies"
          value={multiHobbiesStatus} // 👈 ARRAY
          dropdownData={options}
          onValueChange={value => {
            setMultiHobbiesStatus(value); // ✅ update UI
          }}
          bottomSheetHeight={hp(500)}
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

export default ModifyDatingHobbiesScreen;
