import React, {useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import NewBottomSheetMultipleValueSelect from '../../../components/newBottomSheetMultipleValueSelect';
import {useSelector} from 'react-redux';

const EditHobbiesScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);

  console.log(' === var ===> ', user?.user?.hobbies);

  const [selectedItems, setSelectedItems] = useState([]);

  const options = [
    'Writing',
    'Play Instrument',
    'Game',
    'Movie',
    'Sports',
    'Running',
    'Cycling',
  ];

  const handleSelect = selectedValue => {
    setSelectedItems(selectedValue);
  };

  const onSubmitPress = () => {
    navigation.goBack();
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: 17, flex: 1}}>
        <AppColorLogo />
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(20),
            lineHeight: hp(30),
            fontFamily: fontFamily.poppins600,
            textAlign: 'center',
            marginTop: 10,
          }}>
          Hobbies
        </Text>

        <View style={{marginTop: hp(37)}}>
          <NewBottomSheetMultipleValueSelect
            label="Select options"
            options={options}
            onSelect={handleSelect} // Pass the onSelect handler to capture selected values
          />
        </View>

        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 15,
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={onBackPress}
              activeOpacity={0.7}
              style={{
                width: wp(133),
                height: hp(44),
                borderRadius: 25,
                borderWidth: 1,
                borderColor: colors.black,
                justifyContent: 'center',
              }}>
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
              onPress={onSubmitPress}
              style={{
                width: wp(176),
                height: hp(44),
                borderRadius: 30,
                backgroundColor: colors.black,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditHobbiesScreen;
