import React, {useState} from 'react';
import {Image, SafeAreaView, TouchableOpacity, View, Text} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import ImagePaginationAndPinableComponent from '../../components/imagePaginationAndPinableComponent ';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';

const UserUploadImageFullScreen = () => {
  const route = useRoute();
  const {allImages} = route.params;
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);

  const [topModalVisible, setTopModalVisible] = useState(false);

  const userImage = user?.user?.profilePic;

  const openTopSheetModal = () => {
    toggleModal();
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
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

      {/*TOP SHEET*/}
      <HomeTopSheetComponent
        isVisible={topModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
      />

      {allImages &&
      allImages.userAllImage &&
      allImages.userAllImage.length > 0 ? (
        <ImagePaginationAndPinableComponent images={allImages.userAllImage} />
      ) : (
        // Show message if no images are found
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: 'gray'}}>No image found</Text>
        </View>
      )}

      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}
        activeOpacity={0.5}
        style={style.cancelButton}>
        <Image source={icons.x_cancel_icon} style={style.cancelIcon} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default UserUploadImageFullScreen;
