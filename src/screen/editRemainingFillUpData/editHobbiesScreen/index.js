import React, {useState} from 'react';
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
import {updateDetails} from '../../../actions/homeActions';
import NewMultiSelectValueComponent from '../../../components/newMultiSelectValueComponent';
import {icons} from '../../../assets';

const EditHobbiesScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);
  const apiDispatch = useDispatch();

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedLang, setSelectedLang] = useState([]);
  const [loading, setLoading] = useState(false); // Loader state

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

  const LanguageOptions = ['Hindi', 'Gujarati', 'English'];

  const handleSelect = selectedValue => {
    setSelectedItems(selectedValue);
  };

  const handleSelectLanguage = selectedLanguageValue => {
    setSelectedLang(selectedLanguageValue);
  };

  const formatHobbies = items => {
    return items
      .map(
        item =>
          item
            .toLowerCase() // lowercase
            .replace(/\s+/g, '_'), // replace spaces with underscore
      )
      .join(', '); // join into a single string
  };

  const onSubmitPress = () => {
    const formatHobby = hobby => {
      if (!hobby) {
        return '';
      }
      return hobby.toLowerCase().replace(/\s+/g, '_');
    };

    const formattedItems = selectedItems.map(formatHobby);
    const formattedItemsLanguage = selectedLang.map(formatHobby);

    console.log(' === 13 ===> ', formattedItems, formattedItemsLanguage);

    const formattedHobbies = formatHobbies(selectedItems);

    setLoading(true);
    apiDispatch(
      updateDetails(
        {
          // hobbies: formattedHobbies,
          // language: selectedLang.map(lang => lang.toLowerCase()).join(', '),
          hobbies: formattedItems,
          language: formattedItemsLanguage,
        },
        () => {
          setLoading(false);
          navigation.goBack();
        },
      ),
    );
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
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
          Hobbies Info
        </Text>
      </View>

      <View
        style={{width: '100%', height: hp(1), backgroundColor: '#E3E3E3'}}
      />

      <View style={{marginHorizontal: wp(17), marginTop: hp(20)}}>
        <NewMultiSelectValueComponent
          title="Add Hobbies"
          value={selectedItems} // 👈 ARRAY
          dropdownData={options}
          onValueChange={setSelectedItems} // 👈 ARRAY SETTER
          bottomSheetHeight={hp(500)}
          maxSelection={5}
        />

        <View style={{marginTop: hp(40)}}>
          <NewMultiSelectValueComponent
            title="Add Language Known"
            value={selectedLang} // 👈 ARRAY
            dropdownData={LanguageOptions}
            onValueChange={setSelectedLang} // 👈 ARRAY SETTER
            bottomSheetHeight={hp(200)}
          />
        </View>
      </View>

      <View style={{marginHorizontal: 17, flex: 1}}>
        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 20,
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              activeOpacity={0.6}
              onPress={onSubmitPress}
              disabled={selectedItems.length === 0 || selectedLang.length === 0} // ✅ Disable if nothing selected
              style={{
                width: '100%',
                height: hp(50),
                borderRadius: hp(25),
                backgroundColor:
                  selectedItems.length === 0 || selectedLang.length === 0
                    ? colors.gray // disabled state color
                    : colors.black, // enabled state color
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {loading ? (
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

export default EditHobbiesScreen;
