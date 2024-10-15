import React, {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {icons, images} from '../../assets';
import {colors} from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import CommonGradientButton from '../../components/commonGradientButton';
import {useDispatch} from 'react-redux';
import {addProfilePicture} from '../../actions/homeActions';
import style from './style';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {TOKEN} from '../../utils/constants';
import RNBlobUtil from 'react-native-blob-util';

const AddProfilePictureScreen = ({route}) => {
  const navigation = useNavigation();
  const {selectedItems: initialSelectedItems} = route.params;
  const [selectedItems, setSelectedItems] = useState(initialSelectedItems);
  const [selectedImageIndex, setSelectedImageIndex] = useState(-1);
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [authToken, setAuthToken] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        let token = await AsyncStorage.getItem(TOKEN);
        if (token) {
          token = token.replace(/^"(.*)"$/, '$1'); // Remove any extra double quotes
          setAuthToken(token.startsWith('Bearer ') ? token : `Bearer ${token}`);
        } else {
          // Redirect to login screen or handle authentication failure
          navigation.navigate('LoginScreen');
        }
      } catch (error) {
        console.error('Error fetching token:', error);
        // Handle error fetching token
      }
    };
    fetchToken();
  }, []);

  const handleImageClick = index => {
    setSelectedImageIndex(index);
    setIsImageSelected(true);
  };

  const handleUploadImage = async () => {
    try {
      const selectedImage = selectedItems[selectedImageIndex];

      // Check if selectedImage and its properties exist
      if (
        !selectedImage ||
        !selectedImage.node ||
        !selectedImage.node.image ||
        !selectedImage.node.image.uri
      ) {
        Alert.alert('Error', 'No image selected.');
        return;
      }

      // Logging selected image properties
      console.log('Selected Image:', selectedImage);

      const callBack = async response => {
        try {
          const presignedUrl = response.data?.data?.url;

          if (!presignedUrl) {
            console.error('Error: presignedUrl is undefined', response.data);
            Alert.alert('Error', 'Failed to get presigned URL.');
            return;
          }

          // Additional logging to verify the data being sent
          console.log('Uploading to presigned URL:', presignedUrl);
          console.log('Uploading image URI:', selectedImage.node.image.uri);

          // Verify the file exists and is accessible
          const fileInfo = await RNBlobUtil.fs.stat(
            selectedImage.node.image.uri,
          );
          console.log('File info:', fileInfo);

          // Ensure the file size is logged
          if (fileInfo.size) {
            console.log('File size:', fileInfo.size);
          } else {
            console.error('File size is undefined');
          }

          console.log(' === selectedImage ===> ', selectedImage.node.type);

          // Fetch the presigned URL with the image data
          const data = await RNBlobUtil.fetch(
            'PUT',
            presignedUrl,
            {
              'Content-Type': getContentType(selectedImage.node.type),
              'x-amz-acl': 'public-read',
            },
            RNBlobUtil.wrap(selectedImage.node.image.uri),
          );

          // If the fetch operation was successful
          console.log('Image uploaded successfully:', data);
          // navigation.navigate('PartnerPreferencesScreen');
          navigation.navigate('HomeTabs');
        } catch (err) {
          // Detailed error logging
          console.error('RNBlobUtil fetch error:', err);
          Alert.alert('Error', 'Failed to upload image.');
        }
      };

      dispatch(
        addProfilePicture(
          {
            key: `${selectedImage.node.id}.jpg`,
            contentType: getContentType(selectedImage.node.type),
            isProfilePic: true,
            profileType: 'profileImage',
          },
          callBack,
        ),
      );
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image.');
    }
  };

  const getContentType = imageType => {
    switch (imageType) {
      case 'video/mp4':
        return 'video/mp4';
      case 'image/jpeg':
      case 'image/jpg':
        return 'image/jpeg';
      case 'image/png':
        return 'image/png';
      default:
        return 'image/jpeg';
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        <Image
          source={images.happyMilanColorLogo} // Adjust source as per your imported images
          style={style.logoImageStyle}
        />

        <View style={style.headingContainer}>
          <Text style={style.headingTextStyle}>
            Select Photo to{' '}
            <Text style={{color: colors.blue}}>Set as profile picture</Text>
          </Text>
        </View>

        <FlatList
          data={[...selectedItems, {type: 'addButton'}]}
          numColumns={3}
          renderItem={({item, index}) => (
            <View style={style.flatListImageContainer}>
              {item.type === 'addButton' ? (
                <TouchableOpacity
                  style={style.addButtonStyle}
                  onPress={() => {
                    navigation.goBack();
                  }}>
                  <Text style={{color: colors.blue, fontSize: 30}}>+</Text>
                </TouchableOpacity>
              ) : (
                <>
                  <TouchableOpacity
                    onPress={() => handleImageClick(index)}
                    style={style.addButtonImageContainer}>
                    <Image
                      source={{uri: item.node.image.uri}}
                      style={style.addButtonImageStyle}
                    />

                    {selectedImageIndex === index && (
                      <View
                        style={{
                          ...StyleSheet.absoluteFillObject,
                          backgroundColor: 'rgba(15, 82, 186, 0.7)',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Image
                          source={icons.select_borderWhite_icon}
                          style={style.selectedImageStyle}
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                  {item.node.type === 'video/mp4' && (
                    <View style={style.videoIconStyle}>
                      <Image
                        source={icons.video_play_icon}
                        style={style.videoIcon}
                      />
                    </View>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      const updatedSelectedItems = [...selectedItems];
                      updatedSelectedItems.splice(index, 1); // Remove the item at the specified index
                      setSelectedItems(updatedSelectedItems);
                      setIsImageSelected(false); // Reset isImageSelected if no images are selected
                    }}
                    style={style.deleteIconContainer}>
                    <View style={style.deleteIconStyle}>
                      <Image
                        source={icons.delete_icon}
                        style={style.deleteIcon}
                      />
                    </View>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>

      <View style={style.bottomButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          activeOpacity={0.7}
          style={style.backButtonStyle}>
          <Text style={style.backButtonTextStyle}>Back</Text>
        </TouchableOpacity>

        <CommonGradientButton
          onPress={handleUploadImage}
          buttonName={'Continue'}
          containerStyle={style.continueButtonStyle}
          buttonTextStyle={style.continueTextStyle}
          disabled={!isImageSelected}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddProfilePictureScreen;
