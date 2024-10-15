import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ImageCropPicker from 'react-native-image-crop-picker';
import {icons} from '../../assets';
import {hp, wp} from '../../utils/helpers';
import {useNavigation} from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;
const imageWidth = screenWidth / 3 - 20; // Adjust the margins and width for better fit

const DateEditImageProfile = () => {
  const {user} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  // State to hold selected images
  const [selectedImages, setSelectedImages] = useState(
    user?.user?.userProfilePic || [],
  );

  // State to track selected image index
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Function to open the gallery and select multiple images
  const openGallery = () => {
    ImageCropPicker.openPicker({
      multiple: true, // Allow multiple image selection
      mediaType: 'photo', // Only allow photos
    })
      .then(images => {
        // Add selected images to the state
        const newImages = images.map(image => ({
          url: image.path, // Use the image path as the URL
        }));
        setSelectedImages([...selectedImages, ...newImages]);
      })
      .catch(error => {
        console.log('Error selecting images: ', error);
      });
  };

  // Function to remove an image from the list
  const removeImage = indexToRemove => {
    setSelectedImages(
      selectedImages.filter((_, index) => index !== indexToRemove),
    );
  };

  // Function to handle image selection
  const handleImagePress = index => {
    setSelectedIndex(index === selectedIndex ? null : index); // Toggle selection
  };

  // Add placeholder for the "Add Image" box
  const dataWithAddBox = [...selectedImages, {addImageBox: true}];

  const renderItem = ({item, index}) => {
    if (item.addImageBox) {
      // Render "Add Image" box
      return (
        <TouchableOpacity onPress={openGallery}>
          <View style={styles.addImageBox}>
            <Text style={styles.addImageText}>+</Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Render profile picture with "X" button to remove the image
    return (
      <SafeAreaView
        style={{
          // backgroundColor: 'red',
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          flex: 1,
          marginHorizontal: wp(17),
        }}>
        <TouchableOpacity onPress={() => handleImagePress(index)}>
          <View style={styles.imageContainer}>
            <Image
              source={{uri: item.url}}
              style={[
                styles.image,
                selectedIndex === index ? styles.selectedImage : null,
              ]}
              resizeMode="cover"
            />

            {/* Checkmark overlay if image is selected */}
            {selectedIndex === index && (
              <View style={styles.overlay}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            )}

            {/* Remove Button (X) */}
            <TouchableOpacity
              onPress={() => removeImage(index)}
              style={styles.removeButton}>
              <Image source={icons.delete_icon} style={styles.deleteIcon} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar with Back Button */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={icons.back_arrow} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      {/* User Name */}
      <Text style={styles.username}>{user?.user?.name}</Text>

      {/* Image Grid */}
      <FlatList
        data={dataWithAddBox}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={3} // Display 3 images per row
        contentContainerStyle={styles.flatListContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFC107',
  },
  backIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  username: {
    fontSize: 18,
    fontWeight: '600',
    padding: 15,
    textAlign: 'left',
  },
  addImageBox: {
    width: imageWidth,
    height: imageWidth,
    margin: 10,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  addImageText: {
    fontSize: 40,
    color: '#007bff',
  },
  imageContainer: {
    margin: 5,
    position: 'relative',
    width: imageWidth,
    height: imageWidth,
    borderRadius: 10,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  selectedImage: {
    borderColor: '#007bff',
    borderWidth: 3,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 123, 255, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  checkmark: {
    color: 'white',
    fontSize: 40,
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#00000066',
    borderRadius: 15,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteIcon: {
    width: 20,
    height: 20,
    tintColor: '#fff',
  },
  flatListContent: {
    padding: 10,
  },
});

export default DateEditImageProfile;
