import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  FlatList,
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
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
  const {selectedImages, setSelectedImages} = route.params;
  const [images, setImages] = useState(selectedImages);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const {user} = useSelector(state => state.auth);

  console.log(' === SetProfilePictureScreen ===> ', user?.user?.appUsesType);

  const appUsesType = user?.user?.appUsesType;

  // console.log(' === selectedImages..... ===> ', selectedImages);

  useEffect(() => {
    setImages(selectedImages);
  }, [selectedImages]);

  const onAddPress = () => {
    const allImages = selectedImages;

    console.log(' === allImages ===> ', allImages);

    // Check if there are images selected
    if (allImages.length === 0) {
      console.log('No images selected');
      return;
    }

    // Assuming you want to upload the first image in the array
    const selectedImage = allImages[0]; // Change the index as needed
    const imageName = selectedImage.uri.split('/').pop(); // Extracts the filename from the URI
    console.log('Selected image name:', imageName);

    // Extract the file extension from the image name
    const fileExtension = imageName.split('.').pop().toLowerCase();
    console.log('File extension:', fileExtension);

    // Get the content type based on the file extension
    const contentType = getContentType(fileExtension);
    console.log(' === getContentType ===> ', contentType);

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
          RNBlobUtil.wrap(selectedImage.uri), // Use the selected image's URI
        );

        console.log('Image uploaded successfully:', data);
        // navigation.navigate('HomeTabs');
        // Optionally navigate or perform other actions
        AAA();
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
  };

  const AAA = async () => {
    console.log(' === SECOND ===> ');
    const notSelectedImages = selectedImages;

    // Extract filenames and file extensions
    const imageNamesKey = notSelectedImages.map(image =>
      image.uri.split('/').pop(),
    );

    const fileExtensions = imageNamesKey.map(imageName =>
      imageName.split('.').pop().toLowerCase(),
    );

    // Iterate over each selected image/video
    for (let i = 0; i < notSelectedImages.length; i++) {
      const contentType = getContentType(fileExtensions[i]);

      const imageUri = notSelectedImages[i].uri;

      const imageName = imageNamesKey[i];

      const callBack = async response => {
        try {
          const presignedUrl = response.data?.data?.url;

          // Upload the image/video using the presigned URL
          const data = await RNBlobUtil.fetch(
            'PUT',
            presignedUrl,
            {
              'Content-Type': contentType,
              'x-amz-acl': 'public-read',
            },
            RNBlobUtil.wrap(imageUri), // Correctly use the image URI
          );

          console.log(' === contentType ===> ', contentType);
          console.log('File uploaded successfully:', data);

          {
            appUsesType === 'dating'
              ? navigation.navigate('DatingPartnerPreferenceScreen')
              : navigation.navigate('PartnerPreferencesScreen', {
                  userProfileCompleted: true,
                });
          }

          // navigation.navigate('DatingPartnerPreferenceScreen');
          // navigation.navigate('PartnerPreferencesScreen');
          // userPartnerPreCompleted();
        } catch (err) {
          console.log(' === err ===> ', err);
        }
      };

      // Dispatch the action to get the presigned URL and upload the file
      await dispatch(
        addProfilePicture(
          {
            key: imageName, // Use the specific image name as the key
            contentType: contentType,
            profileType: 'profileImage',
          },
          callBack,
        ),
      );
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
          }}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17)}}>
        <AppColorLogo />
      </View>
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

        <TouchableOpacity onPress={onAddPress} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleText: {
    color: 'black',
    fontSize: fontSize(20),
    lineHeight: hp(30),
    textAlign: 'center',
    fontFamily: fontFamily.poppins600,
    marginTop: hp(10),
    marginBottom: hp(43),
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
    backgroundColor: '#F1F1F1',
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
    backgroundColor: 'rgba(15, 82, 186, 0.7)',
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
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: 'center',
  },
  backButtonText: {
    textAlign: 'center',
    fontSize: fontSize(16),
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
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
});

export default SetProfilePictureScreen;
