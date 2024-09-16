import React, {useCallback, useRef, useState} from 'react';
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
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import CommonGradientButton from '../../components/commonGradientButton';
import Toast from 'react-native-toast-message';
import {launchImageLibrary} from 'react-native-image-picker';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';

const KycDetailsScreen = () => {
  const refRBSheet = useRef();
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [selectedID, setSelectedID] = useState(''); // State for selected ID
  const [selectedImage, setSelectedImage] = useState(null); // State for selected image

  console.log(' === topModalVisible ===> ', topModalVisible);

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

  const handleSelect = idType => {
    setSelectedID(idType); // Update the state with the selected value
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
          }
        }
      });
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
          <TouchableOpacity onPress={openTopSheetModal}>
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

      <View style={{marginHorizontal: wp(17), flex: 1, marginTop: hp(13)}}>
        {selectedImage ? (
          <View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  color: colors.black,
                  fontFamily: fontFamily.poppins500,
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                }}>
                Upload ID
              </Text>
              <Text
                style={{
                  color: '#B1B1B1',
                  fontFamily: fontFamily.poppins500,
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                }}>
                : In Progress
              </Text>
            </View>
            <Text
              style={{
                color: 'black',
                fontSize: fontSize(11),
                lineHeight: hp(16),
                fontFamily: fontFamily.poppins400,
                marginTop: hp(14),
              }}>
              Thank you for submitting the document. We’ll review it and update
              the status within{' '}
              <Text style={{color: '#8225AF'}}>2 working days.</Text>
            </Text>
          </View>
        ) : (
          <>
            <Text
              style={{
                color: colors.black,
                fontFamily: fontFamily.poppins500,
                fontSize: fontSize(14),
                lineHeight: hp(21),
              }}>
              Upload ID
            </Text>

            <Text
              style={{
                color: colors.black,
                fontFamily: fontFamily.poppins400,
                fontSize: fontSize(11),
                lineHeight: hp(16),
                marginTop: hp(11),
              }}>
              Please submit a government issued-ID. Your ID will be{'\n'}deleted
              once we verify your identity
            </Text>

            <View style={{position: 'relative', marginTop: 20}}>
              {/* TouchableOpacity to open the bottom sheet when the TextInput is pressed */}
              <TouchableOpacity onPress={() => refRBSheet.current.open()}>
                <TextInput
                  style={{
                    width: '100%',
                    height: hp(45),
                    borderWidth: 1,
                    borderColor: 'black',
                    borderRadius: 25,
                    paddingLeft: 20,
                    paddingRight: 50, // Adding padding to the right to avoid overlap with the icon
                    color: 'black',
                  }}
                  placeholder={'Select ID Type'}
                  placeholderTextColor={'black'}
                  value={selectedID} // Display the selected value here
                  editable={false} // Make the TextInput non-editable to use it for modal trigger only
                />
                {/* Image or icon on the right */}
                <Image
                  source={icons.drooDownLogo} // Replace with your image URL or local image
                  style={{
                    width: 10,
                    height: 6,
                    position: 'absolute',
                    right: 25,
                    top: 20,
                    tintColor: 'black',
                  }}
                />
              </TouchableOpacity>

              {/* Bottom Sheet */}
              <RBSheet
                ref={refRBSheet}
                height={300}
                openDuration={250}
                customStyles={{
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                }}>
                <View
                  style={{
                    backgroundColor: 'orange',
                    flex: 1,
                    marginHorizontal: 30,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                      marginTop: hp(24),
                      marginBottom: hp(23),
                    }}>
                    Select Photo ID Type
                  </Text>

                  <View
                    style={{
                      width: '100%',
                      borderColor: '#DADADA',
                      borderWidth: 0.5,
                      marginBottom: hp(23),
                    }}
                  />

                  {/* Options to select the ID type */}
                  <TouchableOpacity onPress={() => handleSelect('Passport')}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: fontSize(14),
                        lineHeight: hp(21),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Passport
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleSelect('Driving License')}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: fontSize(14),
                        lineHeight: hp(21),
                        fontFamily: fontFamily.poppins400,
                        marginTop: hp(15),
                      }}>
                      Driving License
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => handleSelect('Aadhar Card')}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: fontSize(14),
                        lineHeight: hp(21),
                        fontFamily: fontFamily.poppins400,
                        marginTop: hp(15),
                      }}>
                      Aadhar Card
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleSelect('Election Card')}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: fontSize(14),
                        lineHeight: hp(21),
                        fontFamily: fontFamily.poppins400,
                        marginTop: hp(15),
                      }}>
                      Election Card
                    </Text>
                  </TouchableOpacity>
                </View>
              </RBSheet>

              <CommonGradientButton
                buttonName={'Select Files'}
                containerStyle={{
                  width: '100%',
                  height: hp(50),
                  marginTop: hp(20),
                }}
                onPress={onSelectFilesPress} // Attach the modified function here
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default KycDetailsScreen;
