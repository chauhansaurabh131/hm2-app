import React, {useState} from 'react';
import {
  SafeAreaView,
  Image,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';
import LinearGradient from 'react-native-linear-gradient';
import EmojiSelector from 'react-native-emoji-selector';
import {useDispatch, useSelector} from 'react-redux';
import {addProfilePicture} from '../../actions/homeActions';
import RNBlobUtil from 'react-native-blob-util';
import {useNavigation} from '@react-navigation/native';

const AddSetStoryImageComponent = ({route}) => {
  const [imageUri, setImageUri] = useState(route.params.imageUri);
  const [caption, setCaption] = useState('');
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const handleEmojiSelect = emoji => {
    setCaption(caption + emoji);
  };

  const handleShare = async () => {
    if (loading) {
      return;
    } // Prevent double submission
    setLoading(true); // Set loading state to true to prevent further presses

    if (!imageUri) {
      Alert.alert('Error', 'Please select an image');
      setLoading(false);
      return;
    }

    const imageName = imageUri.split('/').pop();
    const fileExtension = imageUri.split('.').pop().toLowerCase();
    const contentType = getContentType(fileExtension);

    // Create the request body dynamically, only include the caption if it exists
    const requestBody = {
      key: imageName,
      contentType: contentType,
      profileType: 'statusImage',
    };

    if (caption.trim()) {
      requestBody.caption = caption;
    }

    try {
      // Step 1: Fetch the presigned URL from the API
      const presignedUrlResponse = await fetch(
        'https://stag.mntech.website/api/v1/s3/presignedurl',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody), // Dynamically built request body
        },
      );

      const presignedUrlData = await presignedUrlResponse.json();
      if (presignedUrlResponse.ok) {
        const presignedUrl = presignedUrlData?.data?.url;

        if (presignedUrl) {
          // Step 2: Upload the image using the presigned URL
          try {
            await RNBlobUtil.fetch(
              'PUT',
              presignedUrl,
              {
                'Content-Type': contentType,
              },
              RNBlobUtil.wrap(imageUri),
            );

            console.log('Image uploaded successfully');
            Alert.alert('Success', 'Image shared successfully');
            navigation.goBack(); // Navigate back on success
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
            Alert.alert('Error', 'Failed to upload image');
          }
        } else {
          console.log('Presigned URL is null:', presignedUrlData);
          Alert.alert('Error', 'Failed to retrieve presigned URL');
        }
      } else {
        console.log(
          'Failed to fetch presigned URL. Status:',
          presignedUrlResponse.status,
        );
        Alert.alert(
          'Error',
          `Failed to fetch presigned URL. Status: ${presignedUrlResponse.status}`,
        );
      }
    } catch (error) {
      console.error('Error fetching presigned URL:', error);
      Alert.alert('Error', 'Failed to share the image');
    } finally {
      setLoading(false); // Reset loading state after API call completes
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

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const selectedImageUri = response.assets[0].uri;
        setImageUri(selectedImageUri);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{position: 'absolute', zIndex: 99, right: 15, top: 15}}
            onPress={openGallery}>
            <Image
              source={icons.edit_gradient_icon}
              style={{
                width: 44,
                height: 44,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <Image
            source={{uri: imageUri}}
            style={[
              styles.storyImage,
              {height: isEmojiPickerOpen ? '50%' : '80%'},
            ]}
          />

          <View style={styles.captionContainer}>
            <TouchableOpacity onPress={() => setEmojiPickerOpen(true)}>
              <Image source={icons.smile_emoji_icon} style={styles.smileIcon} />
            </TouchableOpacity>
            <TextInput
              style={styles.textInput}
              multiline
              placeholder={'Write caption'}
              placeholderTextColor={'white'}
              value={caption}
              onChangeText={setCaption}
            />
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.laterButtonContainer}>
            <Text style={styles.buttonText}>later</Text>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} onPress={handleShare}>
            <LinearGradient
              colors={['#0D4EB3', '#9413D0']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1.5}}
              style={styles.shareButtonContainer}>
              <Text style={styles.buttonText}>Share</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal
        transparent={true}
        animationType="slide"
        visible={isEmojiPickerOpen}
        onRequestClose={() => setEmojiPickerOpen(false)}>
        <Pressable
          style={styles.modalBackground}
          onPress={() => setEmojiPickerOpen(false)}>
          <View style={styles.emojiPickerContainer}>
            <Pressable style={styles.emojiSelectorWrapper} onPress={() => {}}>
              <EmojiSelector
                onEmojiSelected={handleEmojiSelect}
                showSearchBar={false}
                columns={8}
              />
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  storyImage: {
    width: '100%',
    resizeMode: 'contain',
  },
  captionContainer: {
    flexDirection: 'row',
    backgroundColor: '#2B2B2B',
    padding: 15,
  },
  smileIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
    marginRight: 10,
    marginTop: 12,
  },
  textInput: {
    flex: 1,
    height: 100,
    color: 'white',
    fontSize: 16,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: hp(17),
    justifyContent: 'space-between',
    marginTop: hp(16),
  },
  laterButtonContainer: {
    width: hp(120),
    height: hp(50),
    backgroundColor: '#2F2F2F',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
  shareButtonContainer: {
    width: hp(202),
    height: hp(50),
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  emojiPickerContainer: {
    height: 280,
    width: '100%',
    backgroundColor: 'silver',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  emojiSelectorWrapper: {
    flex: 1,
  },
});

export default AddSetStoryImageComponent;
