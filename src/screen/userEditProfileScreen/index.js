import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  StyleSheet,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import {colors} from '../../utils/colors';
import style from '../userProfileUploadImageFullScreen/style';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {
  addProfilePicture,
  deleteImage,
  updateDetails,
} from '../../actions/homeActions';
import RNBlobUtil from 'react-native-blob-util';

const UserEditProfileScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // const {allImages} = route.params;
  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;
  const dispatch = useDispatch();
  const apiDispatch = useDispatch();
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const userProfilePic = user?.user?.userProfilePic || [];

  // console.log(' === userId ===> ', userId);

  // console.log(' === userProfilePic ===> ', userProfilePic);

  const [imageList, setImageList] = useState([
    ...userProfilePic.map(pic => pic.url),
    {isAddButton: true},
  ]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const onRemoveImage = async index => {
    const selectedImageData = userProfilePic[index];
    const deleteImageUrl = selectedImageData?.url;
    const deleteImageName = selectedImageData?.name;

    console.log(' === deleteImageUrl ===> ', deleteImageUrl);
    console.log(' === deleteImageName ===> ', deleteImageName);
    //
    try {
      // Dispatch the delete action and wait for it to complete
      await dispatch(
        deleteImage({
          userId: userId,
          profileImageUrl: deleteImageUrl,
          name: deleteImageName,
        }),
      );

      // After a successful API call, update imageList to remove the deleted image
      const updatedImages = imageList.filter((_, i) => i !== index);
      setImageList(updatedImages);

      console.log('Image successfully deleted and removed from display');
    } catch (error) {
      console.error('Failed to delete image:', error);
    }

    // try {
    //   const response = await fetch(
    //     `https://stag.mntech.website/api/v1/user/user/delete-profile-image/${userId}`,
    //     {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         Authorization: `Bearer ${accessToken}`,
    //       },
    //       body: JSON.stringify({
    //         profileImageUrl: deleteImageUrl,
    //         name: deleteImageName, // Construct the path based on your example
    //       }),
    //     },
    //   );
    //
    //   if (response.ok) {
    //     console.log('Image deleted successfully');
    //     // Remove image from list in state
    //     // setImageList(prevList => prevList.filter((_, i) => i !== index));
    //
    //     const updatedImages = imageList.filter((_, i) => i !== index);
    //     setImageList(updatedImages);
    //   } else {
    //     const errorData = await response.json();
    //     console.error(
    //       'Failed to delete image:',
    //       errorData.message || response.statusText,
    //     );
    //   }
    // } catch (error) {
    //   console.error('Error deleting image:', error);
    // }
  };

  const onAddImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        setImageList(prevList => [
          ...prevList.slice(0, -1),
          selectedImageUri,
          {isAddButton: true},
        ]);
      }
    });
  };

  const onSave = () => {
    if (selectedImageIndex !== null) {
      const selectedImage = imageList[selectedImageIndex];
      console.log(' === selectedImage ===> ', selectedImage);

      const imageName = selectedImage.split('/').pop(); // Extracts the filename from the URI
      console.log('Selected image name:', imageName);

      const fileExtension = selectedImage.split('.').pop().toLowerCase();
      console.log('File extension:', fileExtension);

      const contentType = getContentType(fileExtension);
      console.log(' === getContentType ===> ', contentType);

      // Check if the selected image is an S3 bucket URL or a local file URI
      if (selectedImage.startsWith('https://happymilan-user-images.s3')) {
        // If the image is from S3 bucket, call updateDetails API
        apiDispatch(
          updateDetails(
            {
              profilePic: selectedImage,
            },
            () => {
              navigation.navigate('MyProfileScreen');
            },
          ),
        );
      } else if (selectedImage.startsWith('file://')) {
        // If the image is a local file URI, call addProfilePicture API
        const callBack = async response => {
          try {
            const presignedUrl = response.data?.data?.url;

            console.log(' === presignedUrl ===> ', presignedUrl);

            const data = await RNBlobUtil.fetch(
              'PUT',
              presignedUrl,
              {
                'Content-Type': contentType,
                'x-amz-acl': 'public-read',
              },
              RNBlobUtil.wrap(selectedImage), // Use the selected image's URI
            );

            console.log('Image uploaded successfully:', data);
            // Optionally navigate or perform other actions
            navigation.navigate('MyProfileScreen');
          } catch (err) {
            console.log(' === err ===> ', err);
          }
        };

        dispatch(
          addProfilePicture(
            {
              key: imageName, // Use the extracted image name as key
              contentType: contentType,
              isProfilePic: true,
              profileType: 'profileImage',
            },
            callBack,
          ),
        );
      } else {
        console.log('Unknown image URL format');
      }
    } else {
      console.log('No image selected');
    }
  };

  const getContentType = fileExtension => {
    switch (fileExtension) {
      case 'mp4':
        return 'video/mp4';
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        return 'application/octet-stream';
      // return 'image/jpeg';
    }
  };

  const renderItem = ({item, index}) => {
    if (item.isAddButton) {
      return (
        <TouchableOpacity
          style={{
            width: wp(110),
            height: wp(106),
            borderRadius: wp(10),
            backgroundColor: '#F1F1F1',
            alignItems: 'center',
            justifyContent: 'center',
            marginLeft: 5,
            marginTop: 5,
          }}
          onPress={onAddImage}>
          {/*<Text style={{fontSize: wp(10), color: colors.black}}>+</Text>*/}
          <Image
            source={icons.plus_icon}
            style={{
              width: hp(25),
              height: hp(25),
              resizeMode: 'contain',
              tintColor: '#0091FF',
            }}
          />
        </TouchableOpacity>
      );
    }

    const isSelected = selectedImageIndex === index;

    return (
      <TouchableOpacity
        style={{padding: 5}}
        onPress={() => setSelectedImageIndex(index)}>
        <Image
          source={{uri: item}}
          style={{
            width: wp(110),
            height: wp(106),
            borderRadius: wp(10),
          }}
        />
        {isSelected && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              backgroundColor: '#0F52BACC',
              width: wp(110),
              height: wp(106),
              borderRadius: wp(10),
              marginLeft: 5,
              marginTop: 5,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={icons.select_borderWhite_icon}
              style={{width: hp(20), height: hp(20), resizeMode: 'contain'}}
            />
          </View>
        )}
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: 10,
            right: 15,
            // backgroundColor: 'rgba(255, 255, 255, 0.7)',
            backgroundColor: '#00000066',
            borderRadius: wp(50),
            padding: 2,
            width: hp(13),
            height: hp(13),
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => onRemoveImage(index)}>
          {/*<Text style={{fontSize: wp(6), color: 'red'}}>X</Text>*/}
          <Image
            source={icons.delete_icon}
            style={{width: hp(6), height: hp(6), resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: hp(14),
            marginBottom: hp(20),
          }}>
          <Image
            source={images.happyMilanColorLogo}
            style={{width: wp(96), height: hp(24), resizeMode: 'contain'}}
          />

          <TouchableOpacity activeOpacity={0.7}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={{
                width: hp(24),
                height: hp(24),
                borderRadius: 50,
                marginRight: wp(3),
                resizeMode: 'stretch',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View
        style={{
          marginHorizontal: 17,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text
          style={{
            fontSize: fontSize(18),
            lineHeight: hp(27),
            fontFamily: fontFamily.poppins600,
            color: colors.black,
          }}>
          Photos
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.goBack();
          }}
          style={{
            width: hp(24),
            height: hp(24),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{width: hp(14), height: hp(14), resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </View>

      <View
        style={{marginHorizontal: 17, marginTop: hp(17), marginBottom: hp(17)}}>
        <Text
          style={{
            color: '#A2A2A2',
            fontSize: fontSize(12),
            lineHeight: hp(18),
            fontFamily: fontFamily.poppins400,
          }}>
          Select Photo to{' '}
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(12),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins400,
            }}>
            Set as profile picture
          </Text>
        </Text>
      </View>

      <View style={{marginHorizontal: 17, flex: 1}}>
        <FlatList
          data={imageList}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={3}
        />

        <TouchableOpacity activeOpacity={0.7} onPress={onSave}>
          <LinearGradient
            colors={['#0D4EB3', '#9413D0']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1.5}}
            style={{
              width: '100%',
              height: hp(50),
              borderRadius: 25,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              bottom: 30,
            }}>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins400,
              }}>
              Save Changes
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UserEditProfileScreen;
