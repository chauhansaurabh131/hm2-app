// import React from 'react';
// import {
//   Alert,
//   Image,
//   SafeAreaView,
//   Text,
//   TouchableOpacity,
//   View,
//   StyleSheet,
// } from 'react-native';
// import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
// import {icons, images} from '../../assets';
// import {colors} from '../../utils/colors';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import {useNavigation} from '@react-navigation/native';
// import {useSelector} from 'react-redux';
//
// const QRCodeScreen = () => {
//   const navigation = useNavigation();
//
//   const {user} = useSelector(state => state.auth);
//
//   const toke = user?.tokens?.access?.token;
//
//   console.log(' === toke ===> ', toke);
//
//   const onQRCodeRead = async e => {
//     // Assume e.data is a JSON string containing token and channel
//     try {
//       const {token, channel} = JSON.parse(e.data);
//
//       // Display scanned data (optional)
//       Alert.alert('QR Code Scanned', `Token: ${token}\nChannel: ${channel}`);
//       console.log(' === QR Code Scanned ===> ', e.data);
//
//       // Call the API with the token and channel
//       await triggerLogin(channel, token);
//     } catch (error) {
//       console.error('Error parsing QR code data:', error);
//       Alert.alert('Error', 'Failed to parse QR code data.');
//     }
//   };
//
//   const triggerLogin = async (channel, token) => {
//     try {
//       const response = await fetch(
//         'https://happymilan.tech/api/v1/user/auth/trigger-login',
//         {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${toke}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             channel,
//             token,
//           }),
//         },
//       );
//
//       const result = await response.json();
//
//       if (response.ok) {
//         Alert.alert('Success', 'Logged in successfully!');
//         console.log('API response:', result);
//         // Optionally navigate to another screen or handle success
//       } else {
//         Alert.alert('Failed', result.message || 'Failed to log in.');
//         console.log('API error:', result);
//       }
//     } catch (error) {
//       console.error('Error calling API:', error);
//       Alert.alert('Error', 'Failed to call the API.');
//     }
//   };
//
//   return (
//     <SafeAreaView style={styles.container}>
//       <View style={styles.header}>
//         <View style={styles.headerContent}>
//           <Image source={images.happyMilanColorLogo} style={styles.logo} />
//           <Image
//             source={images.profileDisplayImage}
//             style={styles.profileImage}
//           />
//         </View>
//
//         <View style={styles.titleContainer}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}>
//             <Image source={icons.back_arrow_icon} style={styles.backIcon} />
//           </TouchableOpacity>
//           <Text style={styles.title}>Scan QR Code</Text>
//         </View>
//       </View>
//
//       <View style={styles.scannerContainer}>
//         <View style={styles.customScannerWrapper}>
//           <QRCodeScanner
//             onRead={onQRCodeRead}
//             cameraProps={{captureAudio: false}}
//           />
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.white,
//   },
//   header: {
//     marginHorizontal: wp(17),
//     marginTop: hp(14),
//   },
//   headerContent: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   logo: {
//     width: wp(96),
//     height: hp(24),
//     resizeMode: 'contain',
//   },
//   profileImage: {
//     width: hp(24),
//     height: hp(24),
//     borderRadius: 50,
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     marginTop: hp(37),
//     marginBottom: hp(20),
//     alignItems: 'center',
//   },
//   backButton: {
//     width: hp(24),
//     height: hp(24),
//     marginRight: hp(18),
//     justifyContent: 'center',
//   },
//   backIcon: {
//     width: hp(16),
//     height: hp(16),
//     resizeMode: 'contain',
//   },
//   title: {
//     color: colors.black,
//     fontSize: fontSize(14),
//     lineHeight: hp(21),
//     fontFamily: fontFamily.poppins600,
//   },
//   scannerContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: colors.black,
//   },
//   customScannerWrapper: {
//     width: wp(300), // Set the width of the scanner view
//     height: wp(300), // Set the height of the scanner view
//     borderRadius: 20, // Apply border radius for rounded corners
//     borderColor: colors.white,
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
//
// export default QRCodeScreen;

import React from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {useSelector} from 'react-redux';

const QRCodeScreen = () => {
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);

  const toke = user?.tokens?.access?.token;

  console.log(' === toke ===> ', toke);

  const onQRCodeRead = async e => {
    // Assume e.data is a JSON string containing token and channel
    try {
      const {token, channel} = JSON.parse(e.data);

      // Display scanned data (optional)
      Alert.alert('QR Code Scanned', `Token: ${token}\nChannel: ${channel}`);
      console.log(' === QR Code Scanned ===> ', e.data);

      // Call the API with the token and channel
      await triggerLogin(channel, token);
    } catch (error) {
      console.error('Error parsing QR code data:', error);
      Alert.alert('Error', 'Failed to parse QR code data.');
    }
  };

  const triggerLogin = async (channel, token) => {
    try {
      const response = await fetch(
        'https://happymilan.tech/api/v1/user/auth/trigger-login',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${toke}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            channel,
            token,
          }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Logged in successfully!');
        console.log('API response:', result);
        // Optionally navigate to another screen or handle success
      } else {
        Alert.alert('Failed', result.message || 'Failed to log in.');
        console.log('API error:', result);
      }
    } catch (error) {
      console.error('Error calling API:', error);
      Alert.alert('Error', 'Failed to call the API.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image source={images.happyMilanColorLogo} style={styles.logo} />
          <Image
            source={images.profileDisplayImage}
            style={styles.profileImage}
          />
        </View>

        <View style={styles.titleContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Image source={icons.back_arrow_icon} style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.title}>Scan QR Code</Text>
        </View>
      </View>

      <View style={{flex: 1}}>
        <QRCodeScanner
          onRead={onQRCodeRead}
          flashMode={RNCamera.Constants.FlashMode.auto}
          topContent={<View />} // Empty topContent to avoid extra space
          bottomContent={<View />} // Empty bottomContent to avoid extra space
          cameraStyle={styles.camera} // Make the camera view full screen
        />
        {/* Darkened Overlay with Rounded Square Cutout */}
        <View style={styles.overlay}>
          {/* Top dark overlay */}
          <View style={styles.darkOverlayTop} />

          {/* Middle overlay with transparent rounded square */}
          <View style={styles.middleRow}>
            <View style={styles.darkOverlaySide} />
            <View style={styles.transparentBox} />
            <View style={styles.darkOverlaySide} />
          </View>

          {/* Bottom dark overlay */}
          <View style={styles.darkOverlayBottom} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container take up the full screen
  },
  camera: {
    flex: 1, // Make the camera view fill the container
    height: '100%',
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Fill the parent container
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Darker background for better contrast
  },
  darkOverlayTop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fully black overlay on top
    width: '100%',
  },
  darkOverlayBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fully black overlay on bottom
    width: '100%',
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  darkOverlaySide: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black on the left and right sides
    height: 250, // Height same as the transparent box
  },
  transparentBox: {
    width: 250,
    height: 250,
    // borderRadius: 30, // Slightly rounded corners for a modern look
    backgroundColor: 'transparent', // Make the center box transparent
    borderWidth: 0.3,
    borderColor: colors.blue, // WhatsApp-like color
  },
  header: {
    marginHorizontal: wp(17),
    marginTop: hp(14),
    // flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logo: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
  },
  profileImage: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
  },
  titleContainer: {
    flexDirection: 'row',
    marginTop: hp(37),
    marginBottom: hp(20),
    alignItems: 'center',
  },
  backButton: {
    width: hp(24),
    height: hp(24),
    marginRight: hp(18),
    justifyContent: 'center',
  },
  backIcon: {
    width: hp(16),
    height: hp(16),
    resizeMode: 'contain',
  },
  title: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
  },
});

export default QRCodeScreen;
