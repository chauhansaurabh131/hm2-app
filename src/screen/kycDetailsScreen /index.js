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

const KycDetailsScreen = () => {
  const refRBSheet = useRef();
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [selectedID, setSelectedID] = useState(''); // State for selected ID
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image
  const [imageName, setImageName] = useState(''); // State for image file name
  const [isSubmitted, setIsSubmitted] = useState(false); // State to track if submission is done
  const [kycData, setKycData] = useState(null); // State to hold KYC data

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  // Function to fetch KYC details
  const fetchKycDetails = async () => {
    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/kyc/by-user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Use your auth token here
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log('KYC Details:', result);
        setKycData(result?.data?.[0]); // Save KYC details to state (first entry)
      } else {
        console.error('Failed to fetch KYC details');
        Toast.show({
          type: 'error',
          text1: 'Failed to Fetch KYC',
          text2: 'Could not retrieve KYC details.',
        });
      }
    } catch (error) {
      console.error('Error fetching KYC details:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while fetching KYC details.',
      });
    }
  };

  useEffect(() => {
    // Fetch KYC details when the component mounts
    fetchKycDetails();
  }, []);

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
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
    // Your handleSubmit logic here
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
          <TouchableOpacity onPress={toggleModal}>
            <Image
              source={images.profileDisplayImage}
              style={style.profileImageStyle}
            />
          </TouchableOpacity>
        </View>
        <View style={style.headingTittleContainer}>
          <Image
            source={icons.notification_icon}
            style={style.headingCredentialsImageStyle}
          />
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
        {kycData?.isDocUpload ? (
          <Text style={style.finalSubmitText}>
            Thank you for submitting documents. We will review and update you
            within 24 hours.
          </Text>
        ) : (
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

                  <TouchableOpacity onPress={() => handleSelect('passport')}>
                    <Text style={style.passwordText}>Passport</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleSelect('driving-license')}>
                    <Text style={style.bottomSheetText}>Driving License</Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleSelect('aadhar-card')}>
                    <Text style={style.bottomSheetText}>Aadhar Card</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleSelect('election-card')}>
                    <Text style={style.bottomSheetText}>Election Card</Text>
                  </TouchableOpacity>
                </View>
              </RBSheet>

              <CommonGradientButton
                buttonName={'Select Files'}
                containerStyle={style.selectedFileButton}
                onPress={onSelectFilesPress}
              />
            </View>

            {selectedImage && (
              <View style={style.selectedImageContainer}>
                <Text style={style.selectedImageText}>{imageName}</Text>

                <TouchableOpacity
                  onPress={handleRemoveImage}
                  style={style.cancelImageContainer}>
                  <Text style={style.cancelText}>X</Text>
                </TouchableOpacity>

                <CommonGradientButton
                  buttonName={'Submit'}
                  containerStyle={style.submitButton}
                  onPress={handleSubmit} // Submit the form when the button is clicked
                />
              </View>
            )}
          </>
        )}
      </View>
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default KycDetailsScreen;
