import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {icons, images} from '../../assets';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import ImagePaginationAndPinableComponent from '../../components/imagePaginationAndPinableComponent';
import axios from 'axios';
import {updateDetails} from '../../actions/homeActions';
import LinearGradient from 'react-native-linear-gradient';
import ProfileAvatar from '../../components/letterProfileComponent';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';

const UserProfileUploadImageFullScreen = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const apiDispatch = useDispatch();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [localImages, setLocalImages] = useState([]);
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  // console.log(' === localImages ===> ', localImages);

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const userImage = user?.user?.profilePic;
  const currentImage = localImages[currentImageIndex];
  const profilePic = user?.user?.profilePic;

  // Load initial images from user
  // useEffect(() => {
  //   if (user?.user?.userProfilePic?.length) {
  //     setLocalImages(user.user.userProfilePic);
  //   }
  // }, [user?.user?.userProfilePic]);

  useEffect(() => {
    if (user?.user?.userProfilePic?.length) {
      const seenUrls = new Set();
      const uniqueImages = user.user.userProfilePic
        .filter(img => !img.isDeleted) // Optional: filter deleted ones
        .filter(img => {
          if (seenUrls.has(img.url)) {
            return false;
          }
          seenUrls.add(img.url);
          return true;
        });
      setLocalImages(uniqueImages);
    }
  }, [user?.user?.userProfilePic]);

  const openTopSheetModal = () => setTopModalVisible(true);
  const toggleModal = () => setTopModalVisible(!topModalVisible);
  const OnEditButtonPress = () => navigation.navigate('UserEditProfileScreen');

  const deleteCurrentImage = async () => {
    const currentImage = localImages[currentImageIndex];
    const profilePic = user?.user?.profilePic;

    if (!currentImage) {
      Alert.alert('Error', 'No image found to delete.');
      return;
    }

    const isProfilePic = currentImage.url === profilePic;

    // Step 1: Clear profile pic if deleting the current one
    if (isProfilePic) {
      apiDispatch(updateDetails({profilePic: ''}));
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    // Step 2: Delete image from backend
    try {
      await axios.post(
        `https://stag.mntech.website/api/v1/user/user/delete-profile-image/${user?.user?.id}`,
        {
          profileImageUrl: currentImage.url,
          name: currentImage.name,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.tokens?.access?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      // Alert.alert('Deleted', 'Image was successfully deleted.');

      // Step 3: Refresh Redux data
      await apiDispatch(updateDetails());

      // Step 4: Update local image list
      const updatedImages = localImages.filter(
        img => img.url !== currentImage.url,
      );

      let nextIndex = currentImageIndex;
      if (nextIndex >= updatedImages.length) {
        nextIndex = Math.max(updatedImages.length - 1, 0);
      }

      setCurrentImageIndex(nextIndex);
      setLocalImages(updatedImages);
    } catch (error) {
      console.error('❌ Error deleting image:', error);
      Alert.alert('Error', 'Failed to delete image.');
    }
  };

  return (
    <SafeAreaView style={style.container}>
      {/* Header */}
      <View style={style.headerBody}>
        <View style={style.headerImageContainer}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customHeaderLogo}
          />
          <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>
            {/*<Image*/}
            {/*  source={userImage ? {uri: userImage} : images.empty_male_Image}*/}
            {/*  style={style.profileLogoStyle}*/}
            {/*/>*/}

            {userImage ? (
              <Image source={{uri: userImage}} style={style.profileLogoStyle} />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName || user?.user?.name}
                lastName={user?.user?.lastName}
                textStyle={style.profileLogoStyle}
                profileTexts={{fontSize: fontSize(10)}}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />
      </View>

      {/* TOP SHEET */}
      <HomeTopSheetComponent
        isVisible={topModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
      />

      {/* Display Images */}
      {localImages.length > 0 ? (
        <ImagePaginationAndPinableComponent
          key={localImages.length} // force re-render on deletion
          images={localImages}
          onPageChange={index => setCurrentImageIndex(index)}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, color: 'gray'}}>Add Profile Image </Text>
        </View>
      )}

      {/* Footer Buttons */}
      <View
        style={{
          position: 'absolute',
          flexDirection: 'row',
          bottom: 30,
          justifyContent: 'center',
          alignSelf: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.5}
          style={style.cancelButton}>
          <Image source={icons.back_arrow_icon} style={style.cancelIcon} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.6}
          onPress={OnEditButtonPress}
          style={{
            // width: hp(44),
            // height: hp(44),
            // backgroundColor: colors.black,
            // borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: hp(17),
          }}>
          <Image
            source={icons.plus_button_gradient}
            style={{
              width: hp(44),
              height: hp(44),
              resizeMode: 'contain',
              // tintColor: colors.white,
            }}
          />
        </TouchableOpacity>

        {/*<TouchableOpacity*/}
        {/*  style={{marginTop: 10, marginLeft: 10}}*/}
        {/*  // onPress={deleteCurrentImage}>*/}
        {/*  onPress={() => setIsDeleteModalVisible(true)}>*/}
        {/*  <Text style={{color: 'white'}}>Edit</Text>*/}
        {/*</TouchableOpacity>*/}

        {currentImage && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => setIsDeleteModalVisible(true)}
            style={{
              width: hp(44),
              height: hp(44),
              backgroundColor: colors.black,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={icons.delete_icon}
              style={{
                width: hp(14),
                height: hp(18),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        )}
      </View>

      {currentImage && (
        <Modal
          transparent
          visible={isDeleteModalVisible}
          animationType="fade"
          onRequestClose={() => setIsDeleteModalVisible(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '80%',
                backgroundColor: 'white',
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: fontSize(16),
                  color: colors.black,
                  marginBottom: hp(29),
                  textAlign: 'center',
                  marginTop: hp(37),
                  lineHeight: hp(22),
                  fontFamily: fontFamily.poppins400,
                }}>
                {currentImage?.url === profilePic
                  ? 'This is your profile Photo.\nAre you sure want delete\nthis Photo?'
                  : 'Are you sure want delete\nthis Photo?'}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: hp(35),
                }}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    setIsDeleteModalVisible(false);
                    deleteCurrentImage();
                  }}>
                  <LinearGradient
                    colors={['#9413D0', '#0D4EB3']}
                    start={{x: 1, y: 0}}
                    end={{x: 0, y: 0}}
                    style={{
                      borderRadius: 50,
                      justifyContent: 'center',
                      width: hp(122),
                      height: hp(50),
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Yes
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginLeft: 10}}
                  activeOpacity={0.7}
                  onPress={() => setIsDeleteModalVisible(false)}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    style={{
                      width: wp(122),
                      height: hp(50),
                      borderRadius: 50,
                      borderWidth: 1,
                      justifyContent: 'center',
                      borderColor: 'transparent',
                    }}>
                    <View
                      style={{
                        borderRadius: 50, // <-- Inner Border Radius
                        flex: 1,
                        backgroundColor: colors.white,
                        justifyContent: 'center',
                        margin: isIOS ? 0 : 1,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          backgroundColor: 'transparent',
                          color: colors.black,
                          margin: 10,
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        No
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default UserProfileUploadImageFullScreen;
