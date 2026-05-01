import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image, Text, TouchableOpacity, View, TextInput} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {icons} from '../../../assets';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {updateDetails} from '../../../actions/homeActions';
import {ActivityIndicator} from 'react-native';

const AboutEditScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const aboutText = route?.params?.aboutText || '';

  // 🔥 state with default value
  const [description, setDescription] = useState(aboutText);
  const [loading, setLoading] = useState(false);

  const onSavePress = async () => {
    if (loading) {
      return;
    } // 🔥 prevent double click

    try {
      setLoading(true);

      await apiDispatch(
        updateDetails({
          writeBoutYourSelf: description,
        }),
      );

      // ✅ success
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      // ❌ fail
      console.log('API Error:', error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* 🔥 HEADER */}
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
          Modify About Me
        </Text>
      </View>

      <View
        style={{width: '100%', height: hp(1), backgroundColor: '#EDEDED'}}
      />

      {/* 🔥 TEXT INPUT BOX */}
      <View style={{paddingHorizontal: wp(15), marginTop: hp(10)}}>
        <TextInput
          value={description} // 🔥 prefilled value
          onChangeText={setDescription} // 🔥 update state
          multiline={true}
          placeholder="Write about yourself..."
          placeholderTextColor={'#475569'}
          style={{
            minHeight: hp(316),
            backgroundColor: '#FBFBFB',
            // backgroundColor: 'red',
            borderRadius: hp(16),
            padding: wp(15),
            fontSize: fontSize(15),
            fontFamily: fontFamily.poppins400,
            color: '#475569',
            textAlignVertical: 'top', // 🔥 start from top
          }}
        />
      </View>

      <View
        style={{
          position: 'absolute',
          bottom: 26,
          width: '100%',
          alignItems: 'center',
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

export default AboutEditScreen;
