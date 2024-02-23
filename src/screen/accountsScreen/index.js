import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import {colors} from '../../utils/colors';
import navigations from '../../navigations';

const AccountsScreen = ({navigation}) => {
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

        <Text style={style.headerTittleStyle}>Account Setting</Text>
      </View>

      <View style={style.underLineHeaderStyle} />

      {/*BODY*/}

      <View style={style.bodyDescriptionStyle}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.navigate('CredentialsScreen');
          }}>
          <View style={style.bodyDescription}>
            <View style={{width: 25}}>
              <Image
                source={icons.credentials_icon}
                style={style.credentialsIconStyle}
              />
            </View>

            <Image
              source={icons.rightSideIcon}
              style={style.sideArrowImageStyle}
            />
            <View style={style.credentialTittleContainer}>
              <Text style={style.credentialTittleText}>Credentials</Text>
              <Text style={style.credentialDescriptionTextStyle}>
                See information about your account, download an archive of your
                data, or learn about your account deactivation options
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={style.descriptionBodyUnderlineStyle} />

        <TouchableOpacity
          activeOpacity={0.5}
          style={{marginTop: hp(16)}}
          onPress={() => {
            navigation.navigate('HideDeleteProfileScreen');
          }}>
          <View style={style.bodyDescription}>
            <View style={{width: 25}}>
              <Image
                source={icons.delete_Profile_icon}
                style={style.deleteProfileIconStyle}
              />
            </View>

            <Image
              source={icons.rightSideIcon}
              style={style.sideArrowImageStyle}
            />
            <View style={style.credentialTittleContainer}>
              <Text style={style.credentialTittleText}>
                Hide/Delete Profile
              </Text>
              <Text style={style.credentialDescriptionTextStyle}>
                See information about your account, download an archive of your
                data, or learn about your account deactivation options
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={style.descriptionBodyUnderlineStyle} />

        <TouchableOpacity
          activeOpacity={0.5}
          style={{marginTop: hp(16)}}
          onPress={() => {
            navigation.navigate('PrivacyScreen');
          }}>
          <View style={style.bodyDescription}>
            <View style={{width: 25}}>
              <Image source={icons.logLogo} style={style.privacyIconStyle} />
            </View>

            <Image
              source={icons.rightSideIcon}
              style={style.sideArrowImageStyle}
            />
            <View style={style.credentialTittleContainer}>
              <Text style={style.credentialTittleText}>Privacy Setting</Text>
              <Text style={style.credentialDescriptionTextStyle}>
                See information about your account, download an archive of your
                data, or learn about your account deactivation options
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={style.descriptionBodyUnderlineStyle} />

        <TouchableOpacity
          activeOpacity={0.5}
          style={{marginTop: hp(16)}}
          onPress={() => {
            navigation.navigate('EmailSmsAlertScreen');
          }}>
          <View style={style.bodyDescription}>
            <View style={{width: 25}}>
              <Image
                source={icons.email_sms_icon}
                style={style.emailSmsIconStyle}
              />
            </View>

            <Image
              source={icons.rightSideIcon}
              style={style.sideArrowImageStyle}
            />
            <View style={style.credentialTittleContainer}>
              <Text style={style.credentialTittleText}>Email/SMS Alert</Text>
              <Text style={style.credentialDescriptionTextStyle}>
                See information about your account, download an archive of your
                data, or learn about your account deactivation options
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AccountsScreen;
