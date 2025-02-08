import React, {useRef, useState} from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {useSelector} from 'react-redux';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {launchImageLibrary} from 'react-native-image-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import style from './style';
import {colors} from '../../utils/colors';

const ChangeNameRequestScreen = () => {
  const {user} = useSelector(state => state.auth);
  const profileImage = user?.user?.profilePic;
  const userData = user?.user;

  console.log(' === userData ===> ', userData?.firstName);

  const navigation = useNavigation();

  const [firstName, setFirstName] = useState(userData?.firstName || ' ');
  const [lastName, setLastName] = useState(userData?.lastName || ' ');
  const [selectedID, setSelectedID] = useState('');
  const [imagePath, setImagePath] = useState('');
  const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);

  const refRBSheet = useRef();
  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const handleSelect = idType => {
    setSelectedID(idType); // Update the state with the selected value
    console.log('Selected ID Type:', idType); // Log the selected ID type
    refRBSheet.current.close(); // Close the bottom sheet
  };

  const handleSelectFile = () => {
    // Check if no ID is selected, show a toast message
    if (!selectedID) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'ID Type Required',
        text2: 'Please select an ID type before uploading a file.',
        visibilityTime: 3000,
        autoHide: true,
      });
      return; // Stop further execution if no ID is selected
    }

    // Open the gallery to select an image
    launchImageLibrary(
      {
        mediaType: 'photo', // Only select images
        quality: 0.5, // Image quality (optional)
      },
      response => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.log('ImagePicker Error: ', response.errorMessage);
        } else {
          // Successfully picked an image
          const selectedImage = response.assets[0].uri; // Get the URI of the selected image
          setImagePath(selectedImage); // Update the state with the image path
          console.log('Selected Image Path:', selectedImage);
        }
      },
    );
  };

  const handleRemoveImage = () => {
    setImagePath(''); // Reset the image path
  };

  const getFileName = filePath => {
    // Split by slashes and return the last part (file name)
    const parts = filePath.split('/');
    return parts[parts.length - 1]; // Return the last part (file name)
  };

  const handleSave = () => {
    // Handle the save action here, e.g., make an API call or update the state.

    if (!firstName) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'FirstName Required',
        text2: 'Please Add First Name.',
        visibilityTime: 3000,
        autoHide: true,
      });
      return; // Stop further execution if no ID is selected
    }

    if (!lastName) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'LastName Required',
        text2: 'Please Add Last Name.',
        visibilityTime: 3000,
        autoHide: true,
      });
      return; // Stop further execution if no ID is selected
    }

    if (!selectedID) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'ID Type Required',
        text2: 'Please select an ID type before saving.',
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    // Check if image is selected
    if (!imagePath) {
      Toast.show({
        type: 'error',
        position: 'top',
        text1: 'Image Required',
        text2: 'Please select an image before saving.',
        visibilityTime: 3000,
        autoHide: true,
      });
      return;
    }

    console.log('Saved First Name: ', firstName);
    console.log('Saved Last Name: ', lastName);
    console.log('Selected ID Type:', selectedID);
    console.log('Selected Image Path:', imagePath);
    setSuccessModalVisible(true);
  };

  const handleCloseSuccessModal = () => {
    setSuccessModalVisible(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <Image source={images.happyMilanColorLogo} style={style.appLogoStyle} />

        <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>
          <Image
            source={
              profileImage ? {uri: profileImage} : images.empty_male_Image
            }
            style={style.profileLogoStyle}
          />
        </TouchableOpacity>
      </View>

      <View style={style.headerSubContainer}>
        <Text style={style.headerSubTittle}>Change Name Request</Text>

        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
          style={style.backArrowStyle}>
          <Image source={icons.back_arrow_icon} style={style.backArrowIcon} />
        </TouchableOpacity>
      </View>

      <View>
        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />
      </View>

      <View style={style.headerUnderLine} />

      <View style={style.bodyContainer}>
        <Text style={style.bodyTittle}>New First Name</Text>

        <TextInput
          style={style.textInputStyle}
          value={firstName}
          onChangeText={setFirstName} // Update the firstName state
        />

        <Text style={[style.bodyTittle, {marginTop: hp(25)}]}>
          New Last Name
        </Text>
        <TextInput
          style={style.textInputStyle}
          value={lastName}
          onChangeText={setLastName} // Update the lastName state
        />
      </View>

      <View style={style.bodyUnderLine} />

      <View style={style.bodySubContainer}>
        <Text style={style.bodySubTittle}>Upload ID</Text>

        <Text style={style.bodySubTittleSub}>
          Please upload Government issued ID as per your new name
        </Text>

        <TouchableOpacity
          onPress={() => {
            refRBSheet.current.open();
          }}
          style={style.idTypeContainer}>
          <Text style={style.selectedIdText}>
            {selectedID ? selectedID : 'Select ID Type'}{' '}
          </Text>
          <View style={style.rightArrowContainer}>
            <Image source={icons.rightSideIcon} style={style.rightArrowIcon} />
          </View>
        </TouchableOpacity>

        <RBSheet
          ref={refRBSheet}
          height={hp(270)}
          openDuration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}>
          <View>
            <Text style={style.bottomSheetTitle}>Select Photo ID Type</Text>

            <View style={style.bottomSheetUnderLine} />

            <TouchableOpacity onPress={() => handleSelect('passport')}>
              <Text style={style.bottomSheetOptionText}>Passport</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginTop: hp(10)}}
              onPress={() => handleSelect('driving-license')}>
              <Text style={style.bottomSheetOptionText}>Driving License</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginTop: hp(10)}}
              onPress={() => handleSelect('aadhar-card')}>
              <Text style={style.bottomSheetOptionText}>Aadhar Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{marginTop: hp(10)}}
              onPress={() => handleSelect('election-card')}>
              <Text style={style.bottomSheetOptionText}>Election Card</Text>
            </TouchableOpacity>
          </View>
        </RBSheet>

        <View>
          {/* Only show the "Select File" button if no file is selected */}
          {!imagePath ? (
            <TouchableOpacity
              activeOpacity={0.7}
              style={{marginTop: 20}}
              onPress={handleSelectFile}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={style.selectImageContainer}>
                <View style={style.notSelectedImageBody}>
                  <Text style={style.selectedFileText}>Select File</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <View activeOpacity={0.7} style={{marginTop: 20}}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={style.selectImageContainer}>
                <View style={style.selectedImageBody}>
                  <Text style={style.selectedImageText}>
                    {getFileName(imagePath)} {/* Display only the file name */}
                  </Text>
                  <TouchableOpacity
                    onPress={handleRemoveImage}
                    style={style.cancelContainer}>
                    <Text style={style.cancelTextStyle}>X</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </View>
          )}
        </View>

        {/* Success Modal */}
        <Modal
          transparent={true}
          animationType="fade"
          visible={isSuccessModalVisible}
          onRequestClose={handleCloseSuccessModal}>
          <View style={style.modalContainer}>
            <View style={style.modalBodyContainer}>
              <Image
                source={icons.check_gradient_icon}
                style={style.gradientCircleIcon}
              />

              <Text style={style.modalTextStyle}>
                We’ve received your request. We’ll
              </Text>

              <Text style={style.modalTextStyle}>
                review your request and will be
              </Text>

              <Text style={style.modalTextStyle}>update within 24 hours.</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleCloseSuccessModal}>
                <LinearGradient
                  colors={['#0F52BA', '#8225AF']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1.5}}
                  style={style.modalOkButtonContainer}>
                  <Text style={style.applyButtonText}>OK</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      <View style={style.applyButtonContainer}>
        <TouchableOpacity activeOpacity={0.7} onPress={handleSave}>
          <LinearGradient
            colors={['#0F52BA', '#8225AF']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1.5}}
            style={style.applyButtonBody}>
            <Text style={style.applyButtonText}>Apply</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default ChangeNameRequestScreen;
