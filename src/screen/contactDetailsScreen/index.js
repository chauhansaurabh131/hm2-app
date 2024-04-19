import React from 'react';
import {SafeAreaView, Text, View, TextInput} from 'react-native';
import DropDownTextInputComponent from '../../components/DropDownTextInputComponent';
import {Area_Code, CurrentCity} from '../../utils/data';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const ContactDetailsScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: 17}}>
        <Text
          style={{
            color: colors.black,
            marginTop: hp(20),
            fontSize: fontSize(14),
            lineHeight: hp(18),
            fontWeight: '400',
            fontFamily: fontFamily.poppins600,
          }}>
          Mobile Number
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginTop: hp(7),
            justifyContent: 'space-between',
            // backgroundColor: 'green',
          }}>
          <DropDownTextInputComponent
            placeholder={'Area Code'}
            data={Area_Code}
            searchPlaceholder={'Search Current City...'}
            placeholderStyle={colors.black}
            height={50}
            width={123}
            iconStyle={{marginRight: 5}}
          />

          <TextInput
            placeholder={'Type'}
            keyboardType="numeric"
            placeholderTextColor={colors.black}
            style={{
              width: wp(205),
              height: 50,
              borderWidth: 1,
              borderColor: colors.lightGreyBorder,
              padding: 15,
              borderRadius: 10,
              color: colors.black,
            }}
          />
        </View>

        <Text
          style={{
            marginTop: hp(15),
            fontSize: fontSize(14),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins600,
            color: colors.black,
          }}>
          Home Number
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: hp(7),
          }}>
          <DropDownTextInputComponent
            placeholder={'Area Code'}
            data={Area_Code}
            searchPlaceholder={'Search Current City...'}
            placeholderStyle={colors.black}
            height={50}
            width={123}
            iconStyle={{marginRight: 5}}
          />

          <TextInput
            placeholder={'Type'}
            placeholderTextColor={colors.black}
            keyboardType="numeric"
            style={{
              width: wp(205),
              height: 50,
              borderWidth: 1,
              borderColor: colors.lightGreyBorder,
              padding: 15,
              borderRadius: 10,
              color: colors.black,
            }}
          />
        </View>

        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(14),
            lineHeight: hp(18),
            fontWeight: '400',
            fontFamily: fontFamily.poppins600,
            marginTop: hp(15),
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
            color: colors.black,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default ContactDetailsScreen;
