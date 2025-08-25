import React, {useState} from 'react';
import {Image, SafeAreaView, TouchableOpacity, View, Text} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import ImagePaginationAndPinableComponent from '../../components/imagePaginationAndPinableComponent';
import ImagePaginationAndPinableComponentUser from '../../components/ImagePaginationAndPinableComponentUser';

const UserUploadImageFullScreen = () => {
  const route = useRoute();

  const {allImages} = route.params;
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);

  const [topModalVisible, setTopModalVisible] = useState(false);

  // console.log(' === allImages ===> ', allImages);

  const userImage = user?.user?.profilePic;

  const openTopSheetModal = () => {
    toggleModal();
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  // Determine the correct image array
  // const imageArray = Array.isArray(allImages)
  //   ? allImages
  //   : allImages.userAllImage;

  const rawArray = Array.isArray(allImages)
    ? allImages
    : allImages?.userAllImage ?? [];

  const getUniqueImagesByFilename = urls => {
    const seenFilenames = new Set();
    return urls.filter(url => {
      const filename = url.split('/').pop(); // get last part of the URL
      if (seenFilenames.has(filename)) {
        return false;
      }
      seenFilenames.add(filename);
      return true;
    });
  };

  const imageArray = getUniqueImagesByFilename(rawArray);

  // console.log(' === imageArray ===> ', imageArray);

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

      {imageArray && imageArray.length > 0 ? (
        <ImagePaginationAndPinableComponentUser images={imageArray} />
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
