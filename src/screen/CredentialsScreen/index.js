import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {useNavigation} from '@react-navigation/native';

const CredentialsScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />

          <Image
            source={images.profileDisplayImage}
            style={style.profileImageStyle}
          />
        </View>
        <View style={style.headingTittleContainer}>
          <Image
            source={icons.credentials_icon}
            style={style.headingCredentialsImageStyle}
          />

          <Text style={style.headingCredentialsText}>Credentials</Text>

          <TouchableOpacity
            style={style.backButtonContainer}
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back_arrow_icon}
              style={style.backButtonIconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={style.underLineHeaderStyle} />

      <View style={style.credentialBodyContainer}>
        <Text style={style.bodyCredentialsTittleText}>Email</Text>

        <View style={style.bodyFillFullContainer}>
          <Text style={style.UserEmailTextStyle}>jit*****@gmail.com</Text>

          <Image source={icons.green_check_icon} style={style.checkIconStyle} />

          <TouchableOpacity style={style.editImageContainer}>
            <Image source={icons.edit_icon} style={style.editImageStyle} />
          </TouchableOpacity>
        </View>
        <View style={style.descriptionBodyUnderlineStyle} />

        <Text style={[style.bodyCredentialsTittleText, {marginTop: 16}]}>
          Password
        </Text>

        <View style={style.bodyFillFullContainer}>
          <Text style={style.UserEmailTextStyle}>*********</Text>

          {/*<Image source={icons.green_check_icon} style={style.checkIconStyle} />*/}

          <TouchableOpacity style={style.editImageContainer}>
            <Image source={icons.edit_icon} style={style.editImageStyle} />
          </TouchableOpacity>
        </View>

        <View style={style.descriptionBodyUnderlineStyle} />

        <Text style={[style.bodyCredentialsTittleText, {marginTop: 16}]}>
          Mobile Number
        </Text>

        <View style={style.bodyFillFullContainer}>
          <Text style={style.UserEmailTextStyle}>*********</Text>

          <Image source={icons.green_check_icon} style={style.checkIconStyle} />

          <TouchableOpacity style={style.editImageContainer}>
            <Image source={icons.edit_icon} style={style.editImageStyle} />
          </TouchableOpacity>
        </View>

        <View style={style.descriptionBodyUnderlineStyle} />
      </View>
    </SafeAreaView>
  );
};

export default CredentialsScreen;
