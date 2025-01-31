import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {icons, images} from '../../assets';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
// import ImagePaginationAndPinableComponent from '../../components/imagePaginationAndPinableComponent';
import {hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import ImagePaginationAndPinableComponent from '../../components/imagePaginationAndPinableComponent';

const UserProfileUploadImageFullScreen = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);

  // Extract URLs from userProfilePic
  const userProfilePic = user?.user?.userProfilePic || [];
  const imageUrls = userProfilePic.map(pic => pic.url);

  console.log(' === imageUrls ===> ', imageUrls);

  const [topModalVisible, setTopModalVisible] = useState(false);

  const userImage = user?.user?.profilePic;

  const openTopSheetModal = () => {
    toggleModal();
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const OnEditButtonPress = () => {
    navigation.navigate('UserEditProfileScreen');
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerBody}>
        <View style={style.headerImageContainer}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customHeaderLogo}
          />
          <TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.profileLogoStyle}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* TOP SHEET */}
      <HomeTopSheetComponent
        isVisible={topModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
      />

      {/* Display Images */}
      {imageUrls && imageUrls.length > 0 ? (
        <ImagePaginationAndPinableComponent images={imageUrls} />
      ) : (
        // Show message if no images are found
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: 'gray'}}>No images found</Text>
        </View>
      )}

      <View
        style={{
          position: 'absolute',
          flexDirection: 'row',
          bottom: 30,
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          activeOpacity={0.5}
          style={style.cancelButton}>
          <Image source={icons.x_cancel_icon} style={style.cancelIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={OnEditButtonPress}
          style={{
            width: hp(44),
            height: hp(44),
            backgroundColor: colors.black,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={icons.edit_icon}
            style={{
              width: hp(20),
              height: hp(20),
              resizeMode: 'contain',
              tintColor: colors.white,
            }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserProfileUploadImageFullScreen;
