import React, {useState, useEffect} from 'react';
import {
  Text,
  Image,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import style from '../addProfilePictureScreen/style';
import {launchImageLibrary} from 'react-native-image-picker';
import AppColorLogo from '../../components/appColorLogo';
import {colors} from '../../utils/colors';
import RNBlobUtil from 'react-native-blob-util';
import {addProfilePicture, updateDetails} from '../../actions/homeActions';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const SetProfilePictureScreen = ({route}) => {
  // console.log(' === SetProfilePictureScreen_route ===> ', route);

  // const {selectedImages, setSelectedImages} = route.params;
  const {selectedImages = [], setSelectedImages = () => {}} =
    route.params || {};

  // console.log(' === selectedImages ===> ', selectedImages);

  const [images, setImages] = useState(selectedImages);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const {user} = useSelector(state => state.auth);

  // console.log(' === SetProfilePictureScreen ===> ', user?.user?.appUsesType);

  const appUsesType = user?.user?.appUsesType;

  // console.log(' === selectedImages..... ===> ', selectedImages);

  useEffect(() => {
    setImages(selectedImages);
  }, [selectedImages]);

  const onAddPress = () => {
    if (!selectedImageUri) {
      Alert.alert('Please select an image as your profile picture.');
      return;
    }

    console.log(' === images___ ===> ', images);
    setLoading(true);

    const selectedImage = images.find(img => img.uri === selectedImageUri);
    if (!selectedImage) {
      console.log('No valid image found for upload');
      setLoading(false);
      return;
    }

    console.log(' === var ===> ', selectedImage);

    const imageNameKey = selectedImage.uri.split('/').pop(); // use uri, not object
    const baseName = imageNameKey.replace(/\.[^/.]+$/, ''); // remove extension
    const imageName = `${baseName}.jpg`;

    // const imageName = selectedImage.uri.split('/').pop();
    const fileExtension = imageName.split('.').pop().toLowerCase();
    const contentType = getContentType(fileExtension);

    // ✅ Dispatch API to get presigned URL
    dispatch(
      addProfilePicture(
        {
          key: imageName,
          contentType: contentType,
          isProfilePic: true,
          profileType: 'profileImage',
        },
        async response => {
          try {
            const presignedUrl = response.data?.data?.url;

            await RNBlobUtil.fetch(
              'PUT',
              presignedUrl,
              {
                'Content-Type': contentType,
                'x-amz-acl': 'public-read',
              },
              RNBlobUtil.wrap(selectedImage.uri),
            );

            console.log('Profile picture uploaded:', imageName);

            // ✅ Upload remaining images
            const remainingImages = images.filter(
              img => img.uri !== selectedImageUri,
            );

            if (remainingImages.length > 0) {
              await AAA(remainingImages);
            }

            setLoading(false);

            // ✅ Navigate after everything is done
            navigateNext();
          } catch (err) {
            console.log('Upload error:', err);
            setLoading(false);
          }
        },
      ),
    );
  };

  const AAA = async imagesToUpload => {
    for (let img of imagesToUpload) {
      const imageNameKey = img.uri.split('/').pop();
      const baseName = imageNameKey.replace(/\.[^/.]+$/, '');
      const imageName = `${baseName}.jpg`;

      const fileExtension = imageName.split('.').pop().toLowerCase();
      const contentType = getContentType(fileExtension);

      await dispatch(
        addProfilePicture(
          {
            key: imageName,
            contentType: contentType,
            profileType: 'profileImage',
          },
          async response => {
            try {
              const presignedUrl = response.data?.data?.url;

              await RNBlobUtil.fetch(
                'PUT',
                presignedUrl,
                {
                  'Content-Type': contentType,
                  'x-amz-acl': 'public-read',
                },
                RNBlobUtil.wrap(img.uri),
              );

              console.log('Uploaded extra image:', imageName);
            } catch (err) {
              console.log('Extra image upload error:', err);
            }
          },
        ),
      );

      console.log(' === Not profile image ===> ', imageName);
    }
  };

  const navigateNext = () => {
    if (appUsesType === 'dating') {
      // navigation.navigate('DatingPartnerPreferenceScreen');
      navigation.navigate('HomeTabs');
    } else {
      navigation.navigate('HomeTabs', {
        userProfileCompleted: true,
      });
    }
  };

  // const userPartnerPreCompleted = () => {
  //   console.log(' === userPartnerPreCompleted _function ===> ');
  //   apiDispatch(
  //     updateDetails(
  //       {
  //         userPartnerPreCompleted: true,
  //         // userProfileCompleted: true,
  //       },
  //       () => navigation.navigate('PartnerPreferencesScreen'),
  //     ),
  //   );
  // };

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

  const handleDelete = uri => {
    const updatedImages = images.filter(item => item.uri !== uri);
    setImages(updatedImages);
    setSelectedImages(updatedImages);

    if (selectedImageUri === uri) {
      setSelectedImageUri(null);
    }
  };

  const handleSelect = uri => {
    const isVideo = uri.endsWith('.mp4') || uri.endsWith('.mov');

    if (isVideo) {
      Alert.alert(
        'Invalid Selection',
        'You can only select an image for your profile picture.',
      );
    } else {
      setSelectedImageUri(prevUri => (prevUri === uri ? null : uri));
    }
  };

  const handleAddImage = () => {
    if (images.length >= 6) {
      Alert.alert('Limit Reached', 'You can only add up to 6 images.');
      return;
    }

    const options = {
      mediaType: 'mixed',
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const newImage = {uri: asset.uri};
        const updatedImages = [...images, newImage];
        setImages(updatedImages);
        setSelectedImages(updatedImages);
      }
    });
  };

  const renderMediaItem = ({item}) => {
    const isVideo = item.uri.endsWith('.mp4') || item.uri.endsWith('.mov');

    return (
      <TouchableOpacity
        style={styles.mediaContainer}
        onPress={() => handleSelect(item.uri)}>
        <View style={styles.imageWrapper}>
          <Image source={{uri: item.uri}} style={styles.imageStyle} />
          {isVideo && (
            <View style={styles.videoIconContainer}>
              <Image source={icons.video_play_icon} style={styles.videoIcon} />
            </View>
          )}
          {selectedImageUri === item.uri && (
            <View style={styles.selectedOverlay}>
              <Image
                source={icons.select_borderWhite_icon}
                style={styles.selectedIcon}
              />
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.deleteIconContainer}
          onPress={() => handleDelete(item.uri)}>
          <View style={styles.deleteIconStyle}>
            <Image source={icons.delete_icon} style={styles.deleteIcon} />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderAddImageItem = () => (
    <TouchableOpacity style={styles.mediaContainer} onPress={handleAddImage}>
      <View style={styles.imageWrapper}>
        <Image
          source={icons.add_image_icon}
          style={{
            width: 50,
            height: 50,
            resizeMode: 'contain',
            tintColor: '#7148E4',
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/*<View style={{marginHorizontal: wp(17)}}>*/}
      {/*  <AppColorLogo />*/}
      {/*</View>*/}
      <Text style={styles.titleText}>Select Photo as Profile Picture</Text>
      <View style={styles.container}>
        {images.length > 0 && (
          <FlatList
            data={[...images, {uri: 'add_image'}]}
            renderItem={({item}) => {
              if (item.uri === 'add_image') {
                return renderAddImageItem();
              }
              return renderMediaItem({item});
            }}
            keyExtractor={item => item.uri}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.imageContainer}
            numColumns={3}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        {/*<TouchableOpacity onPress={onAddPress} style={styles.addButton}>*/}
        {/*  {loading ? (*/}
        {/*    <ActivityIndicator size="large" color={colors.white} />*/}
        {/*  ) : (*/}
        {/*    <Text style={styles.addButtonText}>Add</Text>*/}
        {/*  )}*/}
        {/*</TouchableOpacity>*/}

        <TouchableOpacity
          onPress={onAddPress}
          style={[
            styles.addButton,
            !selectedImageUri && {backgroundColor: colors.gray}, // gray when disabled
          ]}
          disabled={!selectedImageUri || loading} // 🔥 disable when no image or loading
          activeOpacity={0.5}>
          {loading ? (
            <ActivityIndicator size="large" color={colors.white} />
          ) : (
            <Text style={styles.addButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleText: {
    color: 'black',
    fontSize: fontSize(16),
    lineHeight: hp(30),
    textAlign: 'center',
    fontFamily: fontFamily.poppins700,
    marginTop: hp(16),
    marginBottom: hp(16),
  },
  container: {
    flex: 1,
    marginHorizontal: wp(18),
  },
  mediaContainer: {
    margin: 5,
    position: 'relative',
    width: hp(108),
    height: hp(108),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F1F1F1',
    backgroundColor: '#F9F7FF',
  },
  imageWrapper: {
    position: 'relative',
  },
  imageStyle: {
    width: hp(108),
    height: hp(108),
    borderRadius: 10,
  },
  selectedOverlay: {
    ...StyleSheet.absoluteFillObject,
    // backgroundColor: 'rgba(15, 82, 186, 0.7)',
    backgroundColor: '#7148E4C7',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  selectedIcon: {
    width: 30,
    height: 30,
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  deleteIcon: {
    width: 6,
    height: 7,
    resizeMode: 'contain',
  },
  imageContainer: {
    paddingBottom: 20,
  },
  deleteIconStyle: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  videoIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{translateX: -15}, {translateY: -15}],
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(17),
    height: hp(87),
    alignItems: 'center',
  },
  backButton: {
    width: wp(133),
    height: hp(44),
    borderRadius: hp(25),
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: 'center',
  },
  backButtonText: {
    textAlign: 'center',
    fontSize: fontSize(14),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  addButton: {
    width: wp(176),
    height: hp(44),
    borderRadius: 30,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.white,
    fontSize: fontSize(14),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
});

export default SetProfilePictureScreen;
