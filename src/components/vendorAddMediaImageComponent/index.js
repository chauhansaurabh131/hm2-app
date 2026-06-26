import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Alert,
  Text,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNBlobUtil from 'react-native-blob-util';
import {useDispatch, useSelector} from 'react-redux';

import {icons} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {addProfilePicture, updateDetails} from '../../actions/homeActions';
import axios from 'axios';
import {BASE_URL} from '../../utils/constants';
import {colors} from '../../utils/colors';

const MAX_IMAGES = 6;

const VendorAddMediaImageComponent = () => {
  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);

  console.log(' === var ===> ', user?.user?.userProfilePic);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(null);

  useEffect(() => {
    const apiImages =
      user?.user?.userProfilePic
        ?.filter(item => item?.isDeleted === false)
        ?.slice(0, 6) || [];

    setImages(apiImages);
  }, [user?.user?.userProfilePic]);

  const getContentType = ext => {
    switch (ext) {
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg';
    }
  };

  const uploadImageToS3 = imagePath => {
    return new Promise((resolve, reject) => {
      const imageNameKey = imagePath.split('/').pop();

      const baseName = imageNameKey.replace(/\.[^/.]+$/, '');

      const imageName = `${baseName}.jpg`;

      const fileExtension = imageName.split('.').pop().toLowerCase();

      const contentType = getContentType(fileExtension);

      dispatch(
        addProfilePicture(
          {
            key: imageName,
            contentType,
            profileType: 'profileImage',
          },
          async response => {
            try {
              const presignedUrl = response?.data?.data?.url;

              await RNBlobUtil.fetch(
                'PUT',
                presignedUrl,
                {
                  'Content-Type': contentType,
                  'x-amz-acl': 'public-read',
                },
                RNBlobUtil.wrap(imagePath),
              );

              resolve(imagePath);
            } catch (error) {
              reject(error);
            }
          },
        ),
      );
    });
  };

  const openGallery = async index => {
    try {
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        compressImageQuality: 0.8,
      });

      setLoadingIndex(index);

      await uploadImageToS3(image.path);

      // Show immediately
      const tempImage = {
        _id: Date.now().toString(),
        url: image.path,
        name: '',
        isDeleted: false,
      };

      let updatedImages = [...images];

      if (index < images.length) {
        updatedImages[index] = tempImage;
      } else {
        updatedImages.push(tempImage);
      }

      setImages(updatedImages);

      // Refresh from backend
      dispatch(
        updateDetails(
          {},
          () => {
            setLoadingIndex(null);
          },
          () => {
            setLoadingIndex(null);
          },
        ),
      );
    } catch (error) {
      console.log('Gallery Error =>', error);
      setLoadingIndex(null);
    }
  };

  const displayData = [
    ...images.slice(0, MAX_IMAGES),
    ...Array(Math.max(0, MAX_IMAGES - images.length)).fill(null),
  ];

  const deleteImageFromServer = async index => {
    try {
      const currentImage = images[index];

      if (!currentImage?.url) {
        Alert.alert('Error', 'Image not found');
        return;
      }

      setLoadingIndex(index);

      await axios.post(
        `${BASE_URL}/api/v1/user/user/delete-profile-image/${user?.user?.id}`,
        {
          profileImageUrl: currentImage.url,
          name: currentImage.name,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.tokens?.access?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Remove instantly from UI
      const updatedImages = [...images];
      updatedImages.splice(index, 1);
      setImages(updatedImages);

      dispatch(
        updateDetails(
          {},
          () => {
            setLoadingIndex(null);
          },
          () => {
            setLoadingIndex(null);
          },
        ),
      );
    } catch (error) {
      console.log('Delete Image Error =>', error);
      Alert.alert('Error', 'Failed to delete image');
      setLoadingIndex(null);
    }
  };

  return (
    <View
      style={{
        marginHorizontal: wp(17),
        marginTop: hp(20),
      }}>
      <Text
        style={{
          color: colors.pureBlack,
          fontSize: fontSize(16),
          fontFamily: fontFamily.poppins500,
          marginBottom: hp(15),
        }}>
        Media
      </Text>
      <FlatList
        data={displayData}
        numColumns={3}
        scrollEnabled={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => openGallery(index)}
            style={{
              width: '31%',
              aspectRatio: 1,
              marginBottom: hp(12),
              marginRight: index % 3 !== 2 ? '3.5%' : 0,
              borderRadius: hp(14),
              backgroundColor: '#F9F6FF',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {item?.url ? (
              <>
                <Image
                  source={{uri: item.url}}
                  style={{
                    width: '100%',
                    height: '100%',
                    resizeMode: 'cover',
                  }}
                />

                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => deleteImageFromServer(index)}
                  style={{
                    position: 'absolute',
                    top: hp(5),
                    right: hp(5),
                    width: hp(22),
                    height: hp(22),
                    borderRadius: hp(11),
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={icons.date_cancel_icon}
                    style={{
                      width: hp(8),
                      height: hp(8),
                      tintColor: 'white',
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <Image
                source={icons.new_camera_icon}
                style={{
                  width: hp(26),
                  height: hp(26),
                  resizeMode: 'contain',
                  tintColor: '#C4B5FD',
                }}
              />
            )}

            {loadingIndex === index && (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color="#7148E4" />
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default VendorAddMediaImageComponent;
