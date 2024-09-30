import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useNavigation} from '@react-navigation/native';
import AppColorLogo from '../../components/appColorLogo';

const Abc = () => {
  const navigation = useNavigation();
  const [selectedImages, setSelectedImages] = useState([]);

  const openGallery = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'All',
    })
      .then(images => {
        const formattedImages = images.map(image => ({
          uri: image.path,
        }));
        setSelectedImages(formattedImages);
        navigation.navigate('SetProfilePictureScreen', {
          selectedImages: formattedImages,
          setSelectedImages, // Pass the setter function
        });
      })
      .catch(error => {
        console.log('Error opening gallery:', error);
      });
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <AppColorLogo />
      <TouchableOpacity style={styles.button} onPress={openGallery}>
        <Text style={{color: 'black', fontSize: 20}}>Add Photos</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    marginTop: 50,
    alignItems: 'center',
  },
});

export default Abc;
