import React from 'react';
import {SafeAreaView, Text, View, TextInput} from 'react-native';
import DropDownTextInputComponent from '../../components/DropDownTextInputComponent';
import {CurrentCity} from '../../utils/data';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';
import style from './style';
// import TextInput from '../../components/TextInput';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const ContactDetailsScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: 17}}>
        <Text
          style={{
            color: colors.black,
            marginTop: hp(20),
            fontSize: fontSize(12),
            lineHeight: hp(18),
            fontWeight: '400',
            fontFamily: fontFamily.nunito400,
          }}>
          Mobile Number
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginTop: hp(10),
            justifyContent: 'space-between',
            // backgroundColor: 'green',
          }}>
          <DropDownTextInputComponent
            placeholder={'Area Code'}
            data={CurrentCity}
            searchPlaceholder={'Search Current City...'}
            placeholderStyle={colors.black}
            height={50}
            width={123}
          />

          <TextInput
            placeholder={'Type'}
            placeholderTextColor={colors.black}
            style={{
              width: wp(205),
              height: 50,
              borderWidth: 1,
              borderColor: colors.lightGreyBorder,
              padding: 15,
              borderRadius: 10,
              // marginTop: hp(7),
            }}
          />
        </View>

        <Text
          style={{
            marginTop: hp(15),
            fontSize: fontSize(12),
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins400,
            color: colors.black,
          }}>
          Home Number
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: hp(10),
          }}>
          <DropDownTextInputComponent
            placeholder={'Area Code'}
            data={CurrentCity}
            searchPlaceholder={'Search Current City...'}
            placeholderStyle={colors.black}
            height={50}
            width={123}
          />

          <TextInput
            placeholder={'Type'}
            placeholderTextColor={colors.black}
            style={{
              width: wp(205),
              height: 50,
              borderWidth: 1,
              borderColor: colors.lightGreyBorder,
              padding: 15,
              borderRadius: 10,
            }}
          />
        </View>

        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(12),
            lineHeight: hp(18),
            fontWeight: '400',
            fontFamily: fontFamily.nunito400,
            marginTop: hp(10),
          }}>
          Enter Email Address
        </Text>

        {/*<TextInput*/}
        {/*  IconNameDesign={icons.profileLogo}*/}
        {/*  placeholder={'Type'}*/}
        {/*  editable={true}*/}
        {/*  iconSource={icons.profileLogo}*/}
        {/*  // containerStyle={style.textInputContainerStyle}*/}
        {/*  inputContainer={{width: '100%', marginTop: 9}}*/}
        {/*/>*/}

        <TextInput
          placeholder={'Type'}
          placeholderTextColor={colors.black}
          style={{
            width: '100%',
            height: hp(50),
            borderWidth: 1,
            borderColor: colors.lightGreyBorder,
            padding: 15,
            borderRadius: 10,
            marginTop: hp(7),
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ContactDetailsScreen;
