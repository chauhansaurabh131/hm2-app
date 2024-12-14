import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  FlatList,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {useSelector} from 'react-redux';
import RNBlobUtil from 'react-native-blob-util';

const SuccessStoryEditInformationScreen = ({route}) => {
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescrition] = useState('');
  const [birthday, setBirthday] = useState('');
  const [partnerId, setPartnerId] = useState('');
  // const [selectedImages, setSelectedImages] = useState([null, null, null]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePaths, setImagePaths] = useState([]); // Add this state to store image paths
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;

  const handlePublish = async () => {
    console.log(' === partnerId ===> ', partnerId);
    console.log(' === name ===> ', name);
    console.log(' === birthday ===> ', birthday);
    console.log(' === description ===> ', description);

    // Check if description length is at least 150 characters
    if (description.length < 200) {
      Alert.alert(
        'Error',
        'Please enter at least 150 characters in the description.',
      );
    } else {
      // Log the description to the terminal (console)
      console.log('Description: ', description);
      // Here you can do other submit-related actions (e.g., send data to server)
    }

    const validImages = selectedImages.filter(image => image !== null);

    if (validImages.length === 0) {
      alert('No images selected to publish.');
      return;
    }

    setImagePaths(validImages);

    console.log(' === setImagePaths ===> ', validImages);

    // Get all image filenames
    const imageNames = validImages.map(imageUri => imageUri.split('/').pop());
    console.log('Selected image names:', imageNames);

    // Extract file extensions for all images
    const fileExtensions = imageNames.map(imageName =>
      imageName.split('.').pop().toLowerCase(),
    );
    console.log('File extensions:', fileExtensions);

    // Get content types for all file extensions
    const contentTypes = fileExtensions.map(ext => getContentType(ext));
    console.log(' === getContentType ===> ', contentTypes);

    let imageUrls = []; // Array to store all ImageUrls
    let partnerUserId = ''; // Variable to store partnerUserId

    try {
      // Get Partner User ID by calling the second API
      const partnerApiUrl = `https://stag.mntech.website/api/v1/user/user/userUniqueId/${partnerId}`;
      const partnerResponse = await fetch(partnerApiUrl, {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const partnerApiResponse = await partnerResponse.json();
      console.log('API Response for Partner ID:', partnerApiResponse);
      partnerUserId = partnerApiResponse?.data[0]?.id;
      console.log(' === partnerUserId+++++++ ===> ', partnerUserId);

      if (!partnerUserId) {
        console.error('Failed to get Partner ID');
        return;
      }

      // Upload each image and gather all ImageUrls
      for (let i = 0; i < validImages.length; i++) {
        const imageUri = validImages[i];
        const imageName = imageNames[i];
        const contentType = contentTypes[i];

        const formData = {
          key: imageName,
          contentType: contentType,
          name: `Image ${i + 1}`,
        };

        // 1. Call the first API to get the presigned URL
        const response = await fetch(
          'https://stag.mntech.website/api/v1/s3/uploadstoryimage',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(formData),
          },
        );

        const jsonResponse = await response.json();
        const ImageUrl = jsonResponse?.data?.ImageUrl;
        console.log('API Response for image upload:', jsonResponse);
        console.log(' === ImageUrl++++++++++ ===> ', ImageUrl);

        const presignedUrl = jsonResponse?.data?.url;

        if (presignedUrl) {
          // 2. Upload the image to S3 using the presigned URL
          const uploadResponse = await RNBlobUtil.fetch(
            'PUT',
            presignedUrl,
            {
              'Content-Type': contentType,
              'x-amz-acl': 'public-read',
            },
            RNBlobUtil.wrap(imageUri),
          );

          console.log(`Image ${i + 1} uploaded successfully:`, uploadResponse);

          // Collect the ImageUrl in the imageUrls array
          imageUrls.push(ImageUrl);
        } else {
          console.error(`Failed to get presigned URL for Image ${i + 1}.`);
        }
      }

      // Now that all images are uploaded, make the final API call to create the story
      const createStoryUrl =
        'https://stag.mntech.website/api/v1/user/story/create-story';
      const createStoryBody = {
        partnerUserId: partnerUserId, // Use the fetched partnerUserId
        images: imageUrls, // All the uploaded image URLs
        content: description, // Content (story description)
        title: name, // Title (name entered in the form)
        marriageDate: birthday, // Marriage Date (birthday field)
      };

      const createStoryResponse = await fetch(createStoryUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(createStoryBody),
      });

      const createStoryApiResponse = await createStoryResponse.json();
      console.log('Create Story API Response:', createStoryApiResponse);

      if (createStoryResponse.ok) {
        navigation.goBack();
        console.log('Story created successfully');
        // Handle success (e.g., navigate to a success screen or show a success message)
      } else {
        console.error('Failed to create story', createStoryApiResponse);
      }
    } catch (error) {
      console.error('Error in story creation process:', error);
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
    }
  };

  const ImagePicker = index => {
    let options = {
      StorageOptions: {
        path: 'image',
      },
    };

    launchImageLibrary(options, response => {
      if (response.assets && response.assets.length > 0) {
        const updatedSelectedImages = [...selectedImages];
        updatedSelectedImages[index] = response.assets[0].uri;
        setSelectedImages(updatedSelectedImages);
      }
    });
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 1, // Limit selection to 1 image per selection
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('Image Picker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const newImageUri = response.assets[0].uri;

        // Check if adding the new image exceeds the 3-image limit
        if (selectedImages.length >= 1) {
          Alert.alert('Edit Thumbnail', 'You can only add 1 images.');
        } else {
          // Add the new image URI to the selectedImages array
          setSelectedImages(prevImages => [...prevImages, newImageUri]);
        }
      }
    });
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  const handleBirthdayChange = text => {
    const numericValue = text.replace(/\D/g, '');
    let formattedBirthday = '';
    if (numericValue.length <= 2) {
      formattedBirthday = numericValue;
    } else if (numericValue.length <= 4) {
      formattedBirthday =
        numericValue.substring(0, 2) + '/' + numericValue.substring(2);
    } else if (numericValue.length <= 6) {
      formattedBirthday =
        numericValue.substring(0, 2) +
        '/' +
        numericValue.substring(2, 4) +
        '/' +
        numericValue.substring(4);
    } else {
      formattedBirthday =
        numericValue.substring(0, 2) +
        '/' +
        numericValue.substring(2, 4) +
        '/' +
        numericValue.substring(4, 8);
    }

    setBirthday(formattedBirthday);
  };

  const removeImage = uri => {
    setSelectedImages(prevImages => prevImages.filter(image => image !== uri));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={images.happyMilanColorLogo} style={styles.logo} />
        <TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>
          <Image
            source={userImage ? {uri: userImage} : images.empty_male_Image}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.introText}>Share Your Story</Text>
      <Text
        style={{
          color: '#9D9D9D',
          marginHorizontal: 17,
          fontSize: fontSize(12),
          lineHeight: hp(18),
          fontFamily: fontFamily.poppins400,
          marginBottom: hp(20),
          marginTop: 2,
        }}>
        Found your partner on HappyMilan?
      </Text>

      <View style={{width: '100', height: 2, backgroundColor: '#F8F8F8'}} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.label}>Your & Your Partner Name</Text>

          <TextInput
            placeholder={'Name'}
            placeholderTextColor={'#D9D9D9'}
            value={name.toString()}
            onChangeText={setName}
            style={styles.input}
          />

          <Text style={styles.label}>When did you get married?</Text>

          <TextInput
            placeholder={'DD/MM/YYYY'}
            placeholderTextColor={'#D9D9D9'}
            style={styles.input}
            onChangeText={handleBirthdayChange}
            value={birthday}
            keyboardType="numeric"
          />

          <Text style={styles.label}>
            Your Partner's ID{' '}
            <Text
              style={{
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins400,
                color: '#8D8D8D',
              }}>
              (Ex. B100023)
            </Text>
          </Text>

          <TextInput
            placeholder={'Enter Here'}
            placeholderTextColor={'#D9D9D9'}
            maxLength={8}
            value={partnerId} // Ensure state is bound to this input
            onChangeText={setPartnerId} // Ensure this updates the state
            style={styles.input}
          />

          <Text style={styles.label}>Type or Paste Your Story</Text>

          <TextInput
            numberOfLines={20}
            multiline={true}
            placeholderTextColor={colors.black}
            value={description.toString()}
            onChangeText={setDescrition}
            style={styles.textArea}
          />

          {/*<View style={styles.imageContainer}>*/}
          {/*  <TouchableOpacity*/}
          {/*    onPress={() => ImagePicker(0)}*/}
          {/*    style={styles.imagePicker}>*/}
          {/*    {selectedImages[0] ? (*/}
          {/*      <Image*/}
          {/*        source={{uri: selectedImages[0]}}*/}
          {/*        style={styles.selectedImage}*/}
          {/*      />*/}
          {/*    ) : (*/}
          {/*      <>*/}
          {/*        <Image source={icons.add_image_icon} style={styles.icon} />*/}
          {/*        <Text style={styles.addPhotoText}>Add Photo</Text>*/}
          {/*      </>*/}
          {/*    )}*/}
          {/*  </TouchableOpacity>*/}

          {/*  <TouchableOpacity*/}
          {/*    onPress={() => ImagePicker(1)}*/}
          {/*    style={styles.imagePicker}>*/}
          {/*    {selectedImages[1] ? (*/}
          {/*      <Image*/}
          {/*        source={{uri: selectedImages[1]}}*/}
          {/*        style={styles.selectedImage}*/}
          {/*      />*/}
          {/*    ) : (*/}
          {/*      <>*/}
          {/*        <Image source={icons.add_image_icon} style={styles.icon} />*/}
          {/*        <Text style={styles.addPhotoText}>Add Photo</Text>*/}
          {/*      </>*/}
          {/*    )}*/}
          {/*  </TouchableOpacity>*/}
          {/*</View>*/}

          {/*<TouchableOpacity*/}
          {/*  onPress={() => ImagePicker(2)}*/}
          {/*  style={styles.imagePickerFull}>*/}
          {/*  {selectedImages[2] ? (*/}
          {/*    <Image*/}
          {/*      source={{uri: selectedImages[2]}}*/}
          {/*      style={styles.selectedImageFull}*/}
          {/*    />*/}
          {/*  ) : (*/}
          {/*    <>*/}
          {/*      <Image source={icons.add_image_icon} style={styles.icon} />*/}
          {/*      <Text style={styles.addPhotoText}>Add Photo</Text>*/}
          {/*    </>*/}
          {/*  )}*/}
          {/*</TouchableOpacity>*/}

          <TouchableOpacity
            style={{
              width: '100%',
              height: 50,
              borderRadius: 100,
              borderColor: '#E6E6E6',
              borderWidth: 1,
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 27,
            }}
            onPress={openGallery} // Open the gallery when the button is pressed
          >
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
              }}>
              Add Thumbnail
            </Text>
          </TouchableOpacity>

          <FlatList
            data={selectedImages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              // <Image
              //   source={{uri: item}}
              //   style={{
              //     width: '50%',
              //     height: 200,
              //     marginTop: 20,
              //     marginRight: 10, // Add space between images
              //     borderRadius: 10,
              //     // justifyContent: 'center',
              //     // alignItems: 'center',
              //     alignSelf: 'center',
              //   }}
              //   // resizeMode="cover"
              // />
              <View style={{marginTop: 20}}>
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <Image
                    source={{uri: item}}
                    style={{
                      width: '70%',
                      height: hp(250),
                      // marginTop: 20,
                      // marginRight: 10, // Add space between images
                      borderRadius: 10,
                      // justifyContent: 'center',
                      // alignItems: 'center',
                    }}
                    // resizeMode="stretch"
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(item)} // Remove the image when pressed
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background for the X button
                      borderRadius: 50,
                      // padding: 5,
                      height: hp(20),
                      width: hp(20),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 9,
                        fontWeight: 'bold',
                        // top: -2,
                      }}>
                      X
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
          />

          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.notNowButton}>
              <Text style={styles.notNowText}>Not now</Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={handlePublish}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.publishButton}>
                <Text style={styles.publishButtonText}>Publish</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{height: 30}} />
        </View>

        <HomeTopSheetComponent
          isVisible={topModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(12),
    marginHorizontal: 17,
  },
  logo: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
    marginTop: hp(2),
  },
  profileImage: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    marginRight: hp(10.5),
    resizeMode: 'stretch',
    right: -7,
    marginTop: hp(2),
  },
  introText: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
    marginTop: hp(35),
    // marginBottom: hp(20),
    marginHorizontal: 17,
  },
  content: {
    marginHorizontal: 17,
    marginTop: 10,
  },
  label: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },
  input: {
    width: '100%',
    height: hp(50),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.black,
    marginTop: hp(8),
    // padding: 10,
    color: colors.black,
    marginBottom: 25,
    paddingLeft: 20,
    paddingRight: 15,
  },
  textArea: {
    height: hp(150),
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: 10,
    justifyContent: 'flex-start',
    marginTop: hp(12),
    padding: 10,
    textAlignVertical: 'top',
    color: colors.black,
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  imagePicker: {
    width: wp(165),
    height: hp(245),
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedImage: {
    width: wp(165),
    height: hp(245),
    borderRadius: 10,
  },
  icon: {
    width: 50,
    height: 50,
  },
  addPhotoText: {
    color: colors.black,
    marginTop: 5,
  },
  imagePickerFull: {
    width: '100%',
    height: hp(245),
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 14,
  },
  selectedImageFull: {
    width: '100%',
    height: hp(245),
    borderRadius: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 35,
  },
  notNowButton: {
    width: hp(140),
    height: 50,
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  notNowText: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
  publishButton: {
    width: hp(180),
    height: 50,
    borderRadius: 100,
    justifyContent: 'center',
  },
  publishButtonText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
});

export default SuccessStoryEditInformationScreen;
