import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import ProfileCheckboxGroup from '../../components/profileCheckBox';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../actions/homeActions';
import {hp} from '../../utils/helpers';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';

const PrivacyScreen = () => {
  const [topModalVisible, setTopModalVisible] = useState(false);
  const navigation = useNavigation();

  const apiDispatch = useDispatch();

  const {user} = useSelector(state => state.auth);

  const userImage = user?.user?.profilePic;

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  const capitalizeFirstLetter = str =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

  const Display_Name = [
    {
      id: 1,
      label: `${capitalizeFirstLetter(
        user?.user.firstName,
      )} ${capitalizeFirstLetter(user?.user.lastName)}`,
    },
    {
      id: 2,
      label: capitalizeFirstLetter(user?.user.firstName),
    },
    {
      id: 3,
      label: `Profile ID: ${user?.user.userUniqueId}`,
    },
  ];

  const handleCheckboxChange = label => {
    apiDispatch(updateDetails({name: label}));
  };

  const selectedId =
    Display_Name.findIndex(item => item.label === user?.user.name) + 1;

  const Profile_Privacy = [
    {
      id: 1,
      label: 'Private Profile',
      subTitle: 'Only Full Name will be visible',
    },
    {
      id: 2,
      label: 'Visible to Premium Members Only',
      subTitle:
        'Full Name, Photo Gallery, Contact, Address will be\nhidden to unregistered members.',
    },
    {
      id: 3,
      label: 'Only Accepted Members',
      subTitle:
        'Full Name and Photos will be visible and contact,\naddress will not be visible',
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

          <TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.profileImageStyle}
            />
          </TouchableOpacity>
        </View>

        <HomeTopSheetComponent
          isVisible={topModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        />

        <View style={style.headingTittleContainer}>
          {/*<Image*/}
          {/*  source={icons.privacy_setting_icon}*/}
          {/*  style={style.headingCredentialsImageStyle}*/}
          {/*/>*/}
          <Text style={style.headingCredentialsText}>Privacy setting</Text>
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
        <Text style={style.bodyTittleTextStyle}>Select Display Name</Text>

        <View style={{marginTop: hp(15)}}>
          <ProfileCheckboxGroup
            data={Display_Name}
            selectedId={selectedId || 1} // Default to 1 if `selectedId` is undefined
            onChange={handleCheckboxChange}
          />
        </View>
      </View>

      <View style={style.descriptionBodyUnderlineStyle} />

      <View style={{marginHorizontal: 17}}>
        <Text style={[style.bodyTittleTextStyle, {marginTop: 27}]}>
          Select Profile Privacy Option
        </Text>

        <View style={{marginTop: hp(10)}}>
          {/*<ProfileCheckboxGroup*/}
          {/*  data={Profile_Privacy}*/}
          {/*  selectedId={1}*/}
          {/*  containerRow={{marginTop: 10}}*/}
          {/*/>*/}

          <ProfileCheckboxGroup
            data={Profile_Privacy}
            selectedId={1}
            layout="vertical" // Specify layout as "vertical"
            containerRow={{marginTop: 10}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PrivacyScreen;
