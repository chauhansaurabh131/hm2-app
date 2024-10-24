import React from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import {PermissionsAndroid, Platform} from 'react-native';

const Abc = () => {
  // Function to handle opening the front camera
  const openFrontCamera = async () => {
    // For Android, request camera permission
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission denied');
        return;
      }
    }

    // Open the front camera using launchCamera
    const options = {
      mediaType: 'photo',
      cameraType: 'front', // This will open the front camera
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled camera picker');
      } else if (response.errorMessage) {
        console.log('Camera Error: ', response.errorMessage);
      } else {
        console.log('Image URI: ', response.assets[0].uri);
      }
    });
  };

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={openFrontCamera}>
        <Text
          style={{
            color: 'black',
            fontSize: 16,
            justifyContent: 'center',
            textAlign: 'center',
            marginTop: 100,
          }}>
          Camera
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Abc;
