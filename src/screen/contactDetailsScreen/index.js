import React from 'react';
import {SafeAreaView, Text, View, TextInput} from 'react-native';
import DropDownTextInputComponent from '../../components/DropDownTextInputComponent';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {useSelector} from 'react-redux';
import FloatingLabelInput from '../../components/FloatingLabelInput';

const ContactDetailsScreen = ({
  mobileNumber,
  setMobileNumber,
  homeNumber,
  setHomeNumber,
  // setUserEmail,
}) => {
  const {user} = useSelector(state => state.auth);
  const userEmail = user?.user?.email;

  const Area_Code = [
    {label: '+ 91', value: '1'},
    {label: '+ 92', value: '2'},
    {label: '+ 87', value: '3'},
    {label: '+ 69', value: '4'},
    {label: '+ 93', value: '5'},
    {label: '+ 95', value: '6'},
    {label: '+ 88', value: '7'},
    {label: '+ 90', value: '8'},
  ];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/*<View style={{marginHorizontal: 17}}>*/}
      {/*  <Text*/}
      {/*    style={{*/}
      {/*      color: colors.black,*/}
      {/*      marginTop: hp(20),*/}
      {/*      fontSize: fontSize(14),*/}
      {/*      lineHeight: hp(18),*/}
      {/*      fontWeight: '400',*/}
      {/*      fontFamily: fontFamily.poppins600,*/}
      {/*    }}>*/}
      {/*    Mobile Number*/}
      {/*  </Text>*/}

      {/*  <View*/}
      {/*    style={{*/}
      {/*      flexDirection: 'row',*/}
      {/*      marginTop: hp(7),*/}
      {/*      justifyContent: 'space-between',*/}
      {/*    }}>*/}
      {/*    <DropDownTextInputComponent*/}
      {/*      placeholder={'Area Code'}*/}
      {/*      data={Area_Code}*/}
      {/*      searchPlaceholder={'Search Current City...'}*/}
      {/*      placeholderStyle={colors.black}*/}
      {/*      height={50}*/}
      {/*      width={123}*/}
      {/*      iconStyle={{marginRight: 5}}*/}
      {/*    />*/}

      {/*    <TextInput*/}
      {/*      placeholder={'Type'}*/}
      {/*      keyboardType="numeric"*/}
      {/*      value={mobileNumber}*/}
      {/*      onChangeText={setMobileNumber}*/}
      {/*      placeholderTextColor={colors.black}*/}
      {/*      maxLength={10}*/}
      {/*      style={{*/}
      {/*        width: wp(205),*/}
      {/*        height: 50,*/}
      {/*        borderWidth: 1,*/}
      {/*        borderColor: colors.lightGreyBorder,*/}
      {/*        padding: 15,*/}
      {/*        borderRadius: 10,*/}
      {/*        color: colors.black,*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </View>*/}

      {/*  <Text*/}
      {/*    style={{*/}
      {/*      marginTop: hp(15),*/}
      {/*      fontSize: fontSize(14),*/}
      {/*      lineHeight: hp(18),*/}
      {/*      fontFamily: fontFamily.poppins600,*/}
      {/*      color: colors.black,*/}
      {/*    }}>*/}
      {/*    Home Number*/}
      {/*  </Text>*/}

      {/*  <View*/}
      {/*    style={{*/}
      {/*      flexDirection: 'row',*/}
      {/*      justifyContent: 'space-between',*/}
      {/*      marginTop: hp(7),*/}
      {/*    }}>*/}
      {/*    <DropDownTextInputComponent*/}
      {/*      placeholder={'Area Code'}*/}
      {/*      data={Area_Code}*/}
      {/*      searchPlaceholder={'Search Current City...'}*/}
      {/*      placeholderStyle={colors.black}*/}
      {/*      height={50}*/}
      {/*      width={123}*/}
      {/*      iconStyle={{marginRight: 5}}*/}
      {/*    />*/}

      {/*    <TextInput*/}
      {/*      placeholder={'Type'}*/}
      {/*      value={homeNumber}*/}
      {/*      onChangeText={setHomeNumber}*/}
      {/*      maxLength={10}*/}
      {/*      placeholderTextColor={colors.black}*/}
      {/*      keyboardType="numeric"*/}
      {/*      style={{*/}
      {/*        width: wp(205),*/}
      {/*        height: 50,*/}
      {/*        borderWidth: 1,*/}
      {/*        borderColor: colors.lightGreyBorder,*/}
      {/*        padding: 15,*/}
      {/*        borderRadius: 10,*/}
      {/*        color: colors.black,*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </View>*/}

      {/*  <Text*/}
      {/*    style={{*/}
      {/*      color: colors.black,*/}
      {/*      fontSize: fontSize(14),*/}
      {/*      lineHeight: hp(18),*/}
      {/*      fontWeight: '400',*/}
      {/*      fontFamily: fontFamily.poppins600,*/}
      {/*      marginTop: hp(15),*/}
      {/*    }}>*/}
      {/*    Enter Email Address*/}
      {/*  </Text>*/}

      {/*  <TextInput*/}
      {/*    placeholder={'Type'}*/}
      {/*    placeholderTextColor={colors.black}*/}
      {/*    value={userEmail || 'N/A'}*/}
      {/*    style={{*/}
      {/*      width: '100%',*/}
      {/*      height: hp(50),*/}
      {/*      borderWidth: 1,*/}
      {/*      borderColor: colors.lightGreyBorder,*/}
      {/*      padding: 15,*/}
      {/*      borderRadius: 10,*/}
      {/*      marginTop: hp(7),*/}
      {/*      color: colors.black,*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</View>*/}
      <View style={{marginHorizontal: wp(17)}}>
        <View style={{marginTop: 30}}>
          <FloatingLabelInput
            label="Mobile Number"
            value={mobileNumber}
            onChangeText={setMobileNumber}
            showUnit={true}
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <FloatingLabelInput
            label="Home Number"
            value={homeNumber}
            onChangeText={setHomeNumber}
            showUnit={true}
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <FloatingLabelInput
            label="Email"
            value={userEmail || 'N/A'}
            // onChangeText={setUserEmail}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ContactDetailsScreen;
