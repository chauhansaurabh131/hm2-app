import React, {useRef, useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import CheckBoxComponent from '../../components/checkBoxComponent';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {useSelector} from 'react-redux';
import ProfileCheckboxGroup from '../../components/profileCheckBox';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';

const EmailSmsAlertScreen = () => {
  const navigation = useNavigation();
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [topModalVisible, setTopModalVisible] = useState(false);

  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  const handleSelect = selectedItems => {
    setSelectedOptions(selectedItems);
  };

  const handlePermission = selectedItems => {
    setSelectedOptions(selectedItems);
  };

  const Permission = [
    {
      id: 1,
      label: 'Send me Broader Matches if there are no new\nPreferred Matches',
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
          {/*<TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>*/}
          <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.profileImageStyle}
            />
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <HomeTopSheetComponent
          isVisible={topModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        />

        <View style={style.headingTittleContainer}>
          {/*<Image*/}
          {/*  source={icons.email_sms_icon}*/}
          {/*  style={style.headingCredentialsImageStyle}*/}
          {/*/>*/}
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
          Manage your subscriptions to HappyMilan.com alerts on
        </Text>
        <Text style={style.bodySubTittleTextStyle}>email listed below.</Text>
      </View>

      <View style={[style.underLineHeaderStyle, {marginTop: 20}]} />

      <View style={{marginHorizontal: 17}}>
        <Text style={[style.bodyTittleTextStyle, {marginTop: hp(16)}]}>
          Match Mail & Photo Match Mail
        </Text>

        <View style={style.checkBoxContainer}>
          <CheckBoxComponent
            options={Permission}
            onSelect={handlePermission}
            defaultSelectedId={1}
            stateCheckedBox={{top: -8}}
          />
        </View>
      </View>

      <View style={style.underLineHeaderStyle} />

      <View style={{marginHorizontal: 17}}>
        <Text style={[style.bodyTittleTextStyle, {marginTop: hp(16)}]}>
          Email
        </Text>

        <View style={{marginTop: 4}}>
          <ProfileCheckboxGroup
            data={privacyOptions}
            selectedId={1}
            containerLabel={{color: 'orange'}}
            checkboxRowContainer={{alignItems: 'center'}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EmailSmsAlertScreen;
