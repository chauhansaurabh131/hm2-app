import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import CheckBoxComponent from '../../components/checkBoxComponent ';

const EmailSmsAlertScreen = () => {
  const navigation = useNavigation();
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleSelect = selectedItems => {
    setSelectedOptions(selectedItems);
  };

  const handlePermission = selectedItems => {
    setSelectedOptions(selectedItems);
  };

  const Permission = [
    {
      id: 1,
      label: 'Send me Broader Matches if there are no new Preferred Matches',
    },
  ];

  const privacyOptions = [
    {id: 1, label: 'Daily'},
    {id: 2, label: 'Tri-Weekly'},
    {id: 3, label: 'Weekly'},
    {id: 4, label: 'Unsubscribe'},
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
            source={icons.email_sms_icon}
            style={style.headingCredentialsImageStyle}
          />
          <Text style={style.headingCredentialsText}>
            Email/SMS Alert Setting
          </Text>
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

      <View style={style.bodyContainer}>
        <Text style={style.bodyTittleTextStyle}>My Alerts Manager</Text>

        <Text style={style.bodySubTittleTextStyle}>
          Manage your subscriptions to HappyMilan.com alerts on email
        </Text>
        <Text style={style.bodySubTittleTextStyle}>listed below.</Text>

        <View style={style.underLineHeaderStyle} />

        <Text style={[style.bodyTittleTextStyle, {marginTop: hp(14)}]}>
          Match Mail & Photo Match Mail
        </Text>

        <View style={style.checkBoxContainer}>
          <CheckBoxComponent
            options={Permission}
            onSelect={handlePermission}
            defaultSelectedId={1}
          />
        </View>

        <View style={style.underLineHeaderStyle} />

        <Text style={[style.bodyTittleTextStyle, {marginTop: hp(14)}]}>
          Email
        </Text>

        <View style={{marginTop: 15}}>
          <CheckBoxComponent
            options={privacyOptions}
            onSelect={handleSelect}
            defaultSelectedId={1}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmailSmsAlertScreen;
