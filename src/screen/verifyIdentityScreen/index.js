import React, {useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import RNBlobUtil from 'react-native-blob-util';

const VerifyIdentityScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  // console.log(' === var ===> ', userId, accessToken);

  const topModalBottomSheetRef = useRef(null);
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null); // Store captured image URI
  const [loading, setLoading] = useState(false); // Manage loader state

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      try {
        const options = {quality: 0.5, base64: true, mirrorImage: false}; // Prevent mirroring
        const data = await cameraRef.current.takePictureAsync(options);
        setCapturedImage(data.uri); // Save the captured image URI to the state
        console.log('Captured Image URI:', data.uri);
      } catch (error) {
        console.error('Error capturing image:', error);
      }
    }
  };

  const handleContinue = async () => {
    try {
      setLoading(true); // Start the loader
      console.log(' === capturedImage ===> ', capturedImage);

      const imageName = capturedImage.split('/').pop(); // Extracts the filename from the URI
      const fileExtension = imageName.split('.').pop().toLowerCase();
      const contentType = getContentType(fileExtension);

      console.log('Selected image name:', imageName);
      console.log('File extension:', fileExtension);
      console.log('Content-Type:', contentType);

      const formData = new FormData();
      formData.append('key', imageName);
      formData.append('contentType', contentType);
      formData.append('name', 'upload');

      // Call your API to get the presigned URL
      const response = await fetch(
        'https://stag.mntech.website/api/v1/s3/uploadkycdoc',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Use your auth token here
          },
          body: JSON.stringify({
            key: imageName,
            contentType: contentType,
            name: 'upload',
          }),
        },
      );

      const result = await response.json();
      console.log('API Response:', result);

      const presignedUrl = result?.data?.url; // Get presigned URL for upload
      console.log('Presigned URL:', presignedUrl);

      const docUrl = result?.data?.docUrl;

      console.log(' === docUrl ===> ', docUrl);

      if (presignedUrl) {
        // Upload the image using the presigned URL
        const uploadResponse = await RNBlobUtil.fetch(
          'PUT',
          presignedUrl,
          {
            'Content-Type': contentType,
            'x-amz-acl': 'public-read', // Set ACL for public read access
          },
          RNBlobUtil.wrap(capturedImage), // Correctly pass the image URI
        );

        if (uploadResponse.respInfo.status === 200) {
          // Success case for image upload
          console.log('Image uploaded successfully to S3');

          // Now call the second API with kycDocName and kycDocImagePath
          const kycResponse = await fetch(
            'https://stag.mntech.website/api/v1/user/kyc/',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`, // Use your auth token here
              },
              body: JSON.stringify({
                kycDocName: 'selfie', // This will be the selected ID type (e.g., passport, driving-license)
                kycDocImagePath: docUrl, // The URL of the uploaded document from S3
                isSelfieUpload: true,
              }),
            },
          );

          const kycResult = await kycResponse.json();
          console.log('KYC API Response:', kycResult);

          if (kycResponse.ok) {
            Toast.show({
              type: 'success',
              text1: 'KYC Submission Successful',
              text2: 'Your KYC document has been submitted successfully.',
            });
          } else {
            Toast.show({
              type: 'error',
              text1: 'KYC Submission Failed',
              text2: 'There was an issue submitting your KYC document.',
            });
          }
        } else {
          console.log('Failed to upload image to S3', uploadResponse.respInfo);
          Toast.show({
            type: 'error',
            text1: 'Upload Failed',
            text2: 'There was an issue uploading your document.',
          });
        }
      } else {
        console.error('Error: Presigned URL not found.');
        Toast.show({
          type: 'error',
          text1: 'Upload Failed',
          text2: 'Presigned URL could not be retrieved.',
        });
      }
    } catch (error) {
      console.error('Error during API call or upload:', error);
      Toast.show({
        type: 'error',
        text1: 'Upload Error',
        text2: 'Something went wrong during the upload process.',
      });
    } finally {
      setLoading(false); // Stop the loader
      navigation.goBack();
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
      // return 'image/jpeg';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.headerBodyContainer}>
          <Image source={images.happyMilanColorLogo} style={styles.appLogo} />

          <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={styles.profileImageStyle}
            />
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View style={styles.headerTittleContainer}>
          <Text style={styles.headerTittle}>
            {capturedImage ? 'Congrats!' : 'Verify Your Identity'}
          </Text>

          <TouchableOpacity
            style={styles.backArrowContainer}
            onPress={() => navigation.goBack()}>
            <Image source={icons.back_arrow_icon} style={styles.backArrow} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.horizontalLine} />

      {/* Circular Camera or Captured Image */}
      <View style={styles.cameraContainer}>
        <View style={styles.circularFrame}>
          {capturedImage ? (
            <Image
              source={{uri: capturedImage}} // Show the captured image
              style={[styles.cameraStyle, {transform: [{scaleX: -1}]}]} // Flip image back horizontally
              resizeMode="cover"
            />
          ) : (
            <RNCamera
              ref={cameraRef}
              style={styles.cameraStyle}
              type={RNCamera.Constants.Type.front} // Use the front camera
              flashMode={RNCamera.Constants.FlashMode.off}
            />
          )}
        </View>
      </View>

      <View style={styles.upLoadImageTextContainer}>
        {capturedImage && (
          <Image source={icons.green_check_icon} style={styles.checkIcon} />
        )}

        <Text
          style={[
            styles.upLoadImageText,
            {marginTop: capturedImage ? hp(26) : hp(47)},
          ]}>
          {capturedImage
            ? 'Thank you! Your selfie has been\nsubmitted successfully'
            : 'Place your face within the circle'}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {!capturedImage ? (
          <TouchableOpacity
            style={{alignItems: 'center'}}
            activeOpacity={0.5}
            onPress={handleCapture} // Capture the image on button press
          >
            <LinearGradient
              colors={['#0D4EB3', '#9413D0']}
              start={{x: 0, y: 0.2}}
              end={{x: 1, y: 1.5}}
              style={styles.buttonBody}>
              {loading ? (
                <ActivityIndicator size="large" color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Capture</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{alignItems: 'center'}}
            activeOpacity={0.5}
            onPress={handleContinue} // Capture the image on button press
          >
            <LinearGradient
              colors={['#0D4EB3', '#9413D0']}
              start={{x: 0, y: 0.2}}
              end={{x: 1, y: 1.5}}
              style={styles.buttonBody}>
              {loading ? (
                <ActivityIndicator size="large" color={colors.white} />
              ) : (
                <Text style={styles.buttonText}>Continue</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    marginHorizontal: wp(17),
    marginTop: hp(14),
  },
  headerBodyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  appLogo: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
  },
  profileImageStyle: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
  },
  headerTittleContainer: {
    flexDirection: 'row',
    marginTop: hp(31),
    justifyContent: 'center',
  },
  headerTittle: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
    color: colors.black,
    textAlign: 'center',
  },
  backArrowContainer: {
    width: hp(24),
    height: hp(24),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 0,
  },
  backArrow: {
    width: hp(14),
    height: hp(14),
  },
  horizontalLine: {
    width: '100%',
    height: hp(1),
    backgroundColor: '#F2F2F2',
    marginTop: hp(12),
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(87),
  },
  circularFrame: {
    width: hp(262),
    height: hp(262),
    borderRadius: hp(131), // Half of width/height to create a circle
    overflow: 'hidden', // Clip the camera feed or image inside the circle
    backgroundColor: 'grey', // Fallback background color
  },
  cameraStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute', // Ensure the camera or image fills the container
  },
  upLoadImageTextContainer: {
    flex: 1,
    marginTop: hp(47),
  },
  checkIcon: {
    width: hp(28),
    height: hp(28),
    alignItems: 'center',
    alignSelf: 'center',
  },
  upLoadImageText: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    textAlign: 'center',
    // marginTop: capturedImage ? hp(26) : hp(47),
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 35,
    alignSelf: 'center',
  },
  buttonBody: {
    width: wp(178),
    height: hp(50),
    borderRadius: 25,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: fontSize(16),
    lineHeight: hp(20),
    fontFamily: fontFamily.poppins400,
  },
});

export default VerifyIdentityScreen;
