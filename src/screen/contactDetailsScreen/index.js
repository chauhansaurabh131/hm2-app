import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import DropDownTextInputComponent from '../../components/DropDownTextInputComponent';
import {CurrentCity} from '../../utils/data';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';
import style from './style';
import TextInput from '../../components/TextInput';
import {hp, wp} from '../../utils/helpers';

const ContactDetailsScreen = () => {
  return (
    <SafeAreaView style={style.container}>
      <View style={{marginHorizontal: 17}}>
        <Text style={style.mobileNumberTextStyle}>Mobile Number</Text>

        <View style={style.dropDownContainer}>
          {/*<DropDownTextInputComponent*/}
          {/*  data={CurrentCity}*/}
          {/*  placeholder={'Area Code'}*/}
          {/*  searchPlaceholder={'Search Current City...'}*/}
          {/*  placeholderStyle={colors.black}*/}
          {/*  width={123}*/}
          {/*  height={50}*/}
          {/*/>*/}

          <DropDownTextInputComponent
            placeholder={'Area Code'}
            data={CurrentCity}
            searchPlaceholder={'Search Current City...'}
            placeholderStyle={colors.black}
            height={50}
            width={123}
          />

          <TextInput
            IconNameDesign={icons.profileLogo}
            placeholder={'Type'}
            editable={true}
            iconSource={icons.profileLogo}
            // containerStyle={style.textInputContainerStyle}
            // inputContainer={style.mobileNumberTextInputStyle}
            inputContainer={{width: wp(205), height: 50}}
          />
        </View>

        <Text style={style.homeNumberTextStyle}>Home Number</Text>

        <View style={style.homeNumberTextInputContainerStyle}>
          {/*<DropDownTextInputComponent*/}
          {/*  data={CurrentCity}*/}
          {/*  placeholder={'Area Code'}*/}
          {/*  searchPlaceholder={'Search Current City...'}*/}
          {/*  placeholderStyle={colors.black}*/}
          {/*  height={50}*/}
          {/*  width={123}*/}
          {/*/>*/}

          <DropDownTextInputComponent
            placeholder={'Area Code'}
            data={CurrentCity}
            searchPlaceholder={'Search Current City...'}
            placeholderStyle={colors.black}
            height={50}
            width={123}
          />

          <TextInput
            IconNameDesign={icons.profileLogo}
            placeholder={'Type'}
            editable={true}
            iconSource={icons.profileLogo}
            // containerStyle={style.textInputContainerStyle}
            // inputContainer={style.mobileNumberTextInputStyle}
            inputContainer={{width: wp(205), height: 50}}
          />

          {/*<TextInput*/}
          {/*  IconNameDesign={icons.profileLogo}*/}
          {/*  placeholder={'Type'}*/}
          {/*  editable={true}*/}
          {/*  iconSource={icons.profileLogo}*/}
          {/*  containerStyle={style.textInputContainerStyle}*/}
          {/*  inputContainer={style.homeNumberTextInputStyle}*/}
          {/*/>*/}
        </View>

        <Text style={style.emailTextStyle}>Enter Email Address</Text>

        <TextInput
          IconNameDesign={icons.profileLogo}
          placeholder={'Type'}
          editable={true}
          iconSource={icons.profileLogo}
          containerStyle={style.textInputContainerStyle}
          // inputContainer={style.emailTextInputStyle}
          inputContainer={{width: '100%', marginTop: 9}}
        />
      </View>
    </SafeAreaView>
  );
};

export default ContactDetailsScreen;
