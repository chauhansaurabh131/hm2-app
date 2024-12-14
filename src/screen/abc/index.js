import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {launchImageLibrary} from 'react-native-image-picker';

const Abc = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [description, setDescrition] = useState('');

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

        // Check if adding the new image exceeds the 1-image limit
        if (selectedImages.length >= 1) {
          Alert.alert('Edit Thumbnail', 'You can only add 1 image.');
        } else {
          // Add the new image URI to the selectedImages array
          setSelectedImages(prevImages => [...prevImages, newImageUri]);
        }
      }
    });
  };

  const removeImage = uri => {
    setSelectedImages(prevImages => prevImages.filter(image => image !== uri));
  };

  // Function to handle submit action
  const handleSubmit = () => {
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
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{marginHorizontal: 17}}>
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
            Add Marriage Photos
          </Text>
        </TouchableOpacity>

        {/* FlatList to display selected images */}
        <FlatList
          data={selectedImages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <View style={{backgroundColor: 'orange', marginTop: 20}}>
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <Image
                  source={{uri: item}}
                  style={{
                    width: '50%',
                    height: 200,
                    borderRadius: 10,
                    alignSelf: 'center',
                  }}
                />
                <TouchableOpacity
                  onPress={() => removeImage(item)} // Remove the image when pressed
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent background for the X button
                    borderRadius: 50,
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
                    }}>
                    X
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          horizontal={true} // Set to true for horizontal scrolling
          showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
        />

        {/* Description TextInput */}
        <TextInput
          numberOfLines={20}
          multiline={true}
          placeholderTextColor={colors.black}
          value={description}
          onChangeText={setDescrition} // Update description state
          style={{
            height: hp(150),
            borderWidth: 1,
            borderColor: colors.black,
            borderRadius: 10,
            justifyContent: 'flex-start',
            marginTop: hp(12),
            padding: 10,
            textAlignVertical: 'top',
            color: colors.black,
          }}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={{
          marginTop: 50,
          alignItems: 'center',
          paddingVertical: 12,
          backgroundColor: colors.blue,
          borderRadius: 8,
        }}
        onPress={handleSubmit} // Call handleSubmit on press
      >
        <Text
          style={{
            fontSize: fontSize(16),
            color: 'white',
            fontFamily: fontFamily.poppins600,
          }}>
          Submit
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Abc;
