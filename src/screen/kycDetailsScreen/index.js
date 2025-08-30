import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {icons, images} from '../../assets';
import {style} from './style';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import CommonGradientButton from '../../components/commonGradientButton';
import Toast from 'react-native-toast-message';
import {launchImageLibrary} from 'react-native-image-picker';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import RNBlobUtil from 'react-native-blob-util'; // Import RNBlobUtil
import {useSelector} from 'react-redux';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import ProfileAvatar from '../../components/letterProfileComponent';

const KycDetailsScreen = ({route}) => {
  const {kycData} = route.params; // Retrieve kycData from route params
  const refRBSheet = useRef();
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [selectedID, setSelectedID] = useState(''); // State for selected ID
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const [imageName, setImageName] = useState(''); // State for image file name
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track if submission is done
  const [loading, setLoading] = useState(false);
  // const [kycData, setKycData] = useState(null); // State to hold KYC data

  // console.log(' === selectedID ===> ', selectedID);

  console.log('Received KYC Data:======>', kycData); // Use the KYC data in this screen

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  useFocusEffect(
    useCallback(() => {
      setTopModalVisible(false);
    }, []),
  );

  // Log and set selected ID type
  const handleSelect = idType => {
    setSelectedID(idType); // Update the state with the selected value
    console.log('Selected ID Type:', idType); // Log the selected ID type
    refRBSheet.current.close(); // Close the bottom sheet
  };

  const onSelectFilesPress = () => {
    if (selectedID === '') {
      // Show toast if no ID type is selected
      Toast.show({
        type: 'error', // Can be 'success', 'info', 'error'
        text1: 'ID Type Required',
        text2: 'Please select an ID type before selecting files.',
      });
    } else {
      // Open the gallery and allow user to select an image
      const options = {
        mediaType: 'photo',
        includeBase64: false,
      };
      launchImageLibrary(options, response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorMessage) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          const {assets} = response;
          if (assets && assets.length > 0) {
            setSelectedImage(assets[0].uri); // Set the selected image URI
            setImageName(assets[0].fileName); // Set the selected image file name
          }
        }
      });
    }
  };

  // Function to remove the selected image
  const handleRemoveImage = () => {
    setSelectedImage(null); // Clear the selected image
    setImageName(''); // Clear the image file name
  };

  const handleSubmit = async () => {
    const formattedID = selectedID.toLowerCase().replace(/\s+/g, '-');

    console.log(' === selectedID__+++ ===> ', formattedID);

    setLoading(true);

    try {
      // Log the selected ID type and image path when the form is submitted
      console.log('Selected ID Type:', selectedID);
      console.log('Selected Image Path:', selectedImage);

      const imageName = selectedImage.split('/').pop(); // Extracts the filename from the URI
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
          RNBlobUtil.wrap(selectedImage), // Correctly pass the image URI
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
                kycDocName: formattedID, // This will be the selected ID type (e.g., passport, driving-license)
                kycDocImagePath: docUrl, // The URL of the uploaded document from S3
                // isDocUpload: true,
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
            setIsSubmitted(true);

            // setTimeout(() => {
            //   navigation.goBack();
            // }, 1500);
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
    }finally {
      loading(false)
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

  const navigation = useNavigation();
  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />
          {/*<TouchableOpacity onPress={openTopSheetModal}>*/}
          <TouchableOpacity onPress={openBottomSheet}>
            {userImage ? (
              <Image
                source={{uri: userImage}}
                style={style.profileImageStyle}
              />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName}
                lastName={user?.user?.lastName}
                textStyle={style.profileImageStyle}
                profileTexts={{fontSize: fontSize(10)}}
              />
            )}
            {/*<Image*/}
            {/*  source={userImage ? {uri: userImage} : images.empty_male_Image}*/}
            {/*  style={style.profileImageStyle}*/}
            {/*/>*/}
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View style={style.headingTittleContainer}>
          {/*<Image*/}
          {/*  source={icons.notification_icon}*/}
          {/*  style={style.headingCredentialsImageStyle}*/}
          {/*/>*/}
          <Text style={style.headingCredentialsText}>KYC Details</Text>
          <TouchableOpacity
            style={style.backButtonContainer}
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back_arrow_icon}
              style={style.backButtonIconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={style.underLineHeaderStyle} />

      <HomeTopSheetComponent
        isVisible={topModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
      />

      <View style={style.submitFunctionContainer}>
        {kycData?.document[0]?.verify ? (
            // ✅ CASE 1: Verified
            <>
              <View style={{flexDirection:'row', alignItems:'center'}}>
              <Text style={style.uploadIdText}>Upload ID</Text>
              <Image source={icons.green_check_icon} style={{width: hp(14), height: hp(14), resizeMode:'contain', marginLeft: wp(14), top: -1}}/>
              </View>

              <Text style={style.finalSubmitText}>
                Your document has been verified successfully.
              </Text>
            </>
        ) : (kycData?.document[0]?.isDocUpload && !kycData?.document[0]?.isDocRejected) || isSubmitted ? (
            // 📩 CASE 2: Submitted, waiting for review
            <>
              <Text style={style.uploadIdText}>Upload ID</Text>
              <Text style={style.finalSubmitText}>
                Thank you for submitting documents. We will review and update you
                within 24 hours.
              </Text>
            </>
        ) : selectedImage ? (
            // 📤 CASE 3A: Image selected but not submitted yet
            <View>
              <Text style={style.uploadIdText}>Upload ID</Text>

              <Text style={style.subSubmitTextTittle}>
                Please submit a government issued-ID. Your ID will be{'\n'}deleted
                once we verify your identity.
              </Text>

              <View style={style.selectedImageContainer}>
                <Text style={style.selectedImageText}>{imageName}</Text>

                <TouchableOpacity
                    onPress={handleRemoveImage}
                    style={style.cancelImageContainer}>
                  <Text style={style.cancelText}>X</Text>
                </TouchableOpacity>
              </View>

              <CommonGradientButton
                  buttonName={'Submit'}
                  containerStyle={style.submitButton}
                  loading={loading}
                  onPress={handleSubmit}
              />
            </View>
        ) : (
            // 📤 CASE 3B: No file selected yet
            <>
              <Text style={style.uploadIdText}>Upload ID</Text>

              <Text style={style.subSubmitTextTittle}>
                Please submit a government issued-ID. Your ID will be{'\n'}deleted
                once we verify your identity.
              </Text>

              <View style={style.bottomSheetContainer}>
                <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                  <TextInput
                      style={style.selectedDocumentTextInput}
                      placeholder={'Select ID Type'}
                      placeholderTextColor={'black'}
                      value={selectedID}
                      editable={false}
                  />
                  <Image source={icons.drooDownLogo} style={style.dropDownIcon} />
                </TouchableOpacity>

                <RBSheet
                    ref={refRBSheet}
                    height={320}
                    openDuration={250}
                    customStyles={{
                      container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                      },
                    }}>
                  <View style={style.textInputContainer}>
                    <Text style={style.photoTypeText}>Select Photo ID Type</Text>
                    <View style={style.bottomSheetUnderLine} />

                    <TouchableOpacity onPress={() => handleSelect('Passport')}>
                      <Text style={style.passwordText}>Passport</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleSelect('Driving license')}>
                      <Text style={style.bottomSheetText}>Driving License</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleSelect('Aadhar Card')}>
                      <Text style={style.bottomSheetText}>Aadhar Card</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleSelect('Election Card')}>
                      <Text style={style.bottomSheetText}>Election Card</Text>
                    </TouchableOpacity>
                  </View>
                </RBSheet>

                <CommonGradientButton
                    buttonName={'Select Files'}
                    containerStyle={style.selectedFileButton}
                    onPress={onSelectFilesPress}
                    disabled={!selectedID}
                    buttonTextStyle={{
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                    }}
                />
              </View>
            </>
        )}
      </View>

      {/*Photo Verify*/}
      <View style={style.horizontalLine} />

      <View style={style.secondBodyContainer}>
        {/*<View style={style.verifyTittleContainer}>*/}
        {/*  <Text style={style.photoVerifyText}>Photo Verify</Text>*/}
        {/*  {kycData?.selfie[0]?.isSelfieUpload && (*/}
        {/*    <Text style={style.reviewProgressText}>Review In Progress</Text>*/}
        {/*  )}*/}
        {/*</View>*/}

        {/*<View style={{marginTop: 15}}>*/}
        {/*  {kycData?.selfie[0]?.isSelfieUpload ? (*/}
        {/*    <>*/}
        {/*      <Text style={style.kycPictureSubTittle}>*/}
        {/*        Thank you! Your selfie has been submitted successfully*/}
        {/*      </Text>*/}

        {/*      <Text style={[style.kycPictureSubTittle, {marginTop: hp(15)}]}>*/}
        {/*        We'll notify you once verification is complete. Contact{'\n'}*/}
        {/*        support if you have questions*/}
        {/*      </Text>*/}
        {/*    </>*/}
        {/*  ) : (*/}
        {/*    <Text style={style.SubTextTittle}>*/}
        {/*      To verify your profile photo with a selfie. Download{'\n'}app and*/}
        {/*      Complete Verification*/}
        {/*    </Text>*/}
        {/*  )}*/}
        {/*</View>*/}

        {/*{!kycData?.selfie[0]?.isSelfieUpload && (*/}
        {/*  <TouchableOpacity*/}
        {/*    activeOpacity={0.7}*/}
        {/*    style={style.verifyButtonContainer}*/}
        {/*    onPress={() => {*/}
        {/*      navigation.navigate('VerifyIdentityScreen');*/}
        {/*    }}>*/}
        {/*    <LinearGradient*/}
        {/*      colors={['#0D4EB3', '#9413D0']}*/}
        {/*      start={{x: 0, y: 0}}*/}
        {/*      end={{x: 1, y: 1.5}}*/}
        {/*      style={style.verifyButtonBody}>*/}
        {/*      <Text style={style.verifyButtonText}>Start Verification</Text>*/}
        {/*      <Image*/}
        {/*        source={icons.back_arrow_icon}*/}
        {/*        style={style.verifyButtonIconStyle}*/}
        {/*      />*/}
        {/*    </LinearGradient>*/}
        {/*  </TouchableOpacity>*/}
        {/*)}*/}



        {kycData?.selfie[0]?.verify ? (
            // ✅ CASE 3: Verified
            <>
            <View style={{flexDirection:'row', alignItems:'center', marginBottom: hp(12)}}>
              <Text style={style.photoVerifyText}>Photo Verify</Text>
              <Image source={icons.green_check_icon} style={{width: hp(14), height: hp(14), resizeMode:'contain', marginLeft: wp(14), top: -1}}/>
            </View>
              <Text style={style.kycPictureSubTittle}>
                Thank you for verified your identity
              </Text>

            </>
        ) : kycData?.selfie[0]?.isDocRejected || !kycData?.selfie[0]?.isSelfieUpload ? (
            // 📤 CASE 1: Not uploaded OR rejected
            <>
              <Text style={style.photoVerifyText}>Photo Verify</Text>

              <Text style={[style.SubTextTittle,{marginTop: hp(12)}]}>
                To verify your profile photo with a selfie. Download{'\n'}app and
                Complete Verification
              </Text>

              <TouchableOpacity
                  activeOpacity={0.7}
                  style={style.verifyButtonContainer}
                  onPress={() => {
                    navigation.navigate('VerifyIdentityScreen');
                  }}>
                <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1.5}}
                    style={style.verifyButtonBody}>
                  <Text style={style.verifyButtonText}>Start Verification</Text>
                  <Image
                      source={icons.back_arrow_icon}
                      style={style.verifyButtonIconStyle}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </>
        ) : (
            // ⏳ CASE 2: Uploaded (waiting for verification)
            <>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: hp(13)}}>
                <Text style={style.photoVerifyText}>Photo Verify</Text>
                <Text style={style.reviewProgressText}>Review In Progress</Text>
              </View>

              <Text style={style.kycPictureSubTittle}>
                Thank you! Your selfie has been submitted successfully
              </Text>

              <Text style={[style.kycPictureSubTittle, {marginTop: hp(15)}]}>
                We'll notify you once verification is complete. Contact{'\n'}
                support if you have questions
              </Text>
            </>
        )}
      </View>

      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default KycDetailsScreen;
