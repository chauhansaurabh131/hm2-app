import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import ProfileCheckboxGroup from '../../components/profileCheckBox';

const PrivacyScreen = () => {
  const navigation = useNavigation();

  const Display_Name = [
    {id: 1, label: 'Rihan Gajjar'},
    {id: 2, label: 'R Gajjar'},
    {id: 3, label: 'Rihan G'},
    {id: 4, label: 'Profile ID: SH00289943'},
  ];

  const Number_Privacy_Data = [
    {id: 1, label: 'Visible to all'},
    {id: 2, label: 'Only visible to registered Members'},
  ];

  const Profile_Privacy = [
    {
      id: 1,
      label: 'Visible to all, including unregistered visitors',
      subTitle: '(photo and Name will not be visible on Profile)',
    },
    {
      id: 2,
      label: 'Only visible to registered Members',
    },
  ];

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
            source={icons.delete_Profile_icon}
            style={style.headingCredentialsImageStyle}
          />
          <Text style={style.headingCredentialsText}>Hide/Delete Profile</Text>
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
      {/*BODY*/}

      <View style={style.bodyContainer}>
        <Text style={style.bodyTittleTextStyle}>Select Display Name</Text>

        <ProfileCheckboxGroup data={Display_Name} selectedId={1} />

        <View style={style.descriptionBodyUnderlineStyle} />

        <Text style={[style.bodyTittleTextStyle, {marginTop: 14}]}>
          Who can see your mobile Number?{' '}
        </Text>

        <ProfileCheckboxGroup data={Number_Privacy_Data} selectedId={1} />

        <View style={style.descriptionBodyUnderlineStyle} selectedId={1} />

        <Text style={[style.bodyTittleTextStyle, {marginTop: 14}]}>
          Who can see your email address?
        </Text>
        <ProfileCheckboxGroup data={Number_Privacy_Data} selectedId={1} />

        <View style={style.descriptionBodyUnderlineStyle} />

        <Text style={[style.bodyTittleTextStyle, {marginTop: 14}]}>
          Profile Privacy
        </Text>
        <ProfileCheckboxGroup data={Profile_Privacy} selectedId={1} />
      </View>
    </SafeAreaView>
  );
};

export default PrivacyScreen;
