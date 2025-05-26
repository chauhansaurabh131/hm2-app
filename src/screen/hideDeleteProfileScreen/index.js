import React, {useRef, useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import style from './style';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

import DropDownTextInputComponent from '../../components/DropDownTextInputComponent';
import CommonGradientButton from '../../components/commonGradientButton';
import {useDispatch, useSelector} from 'react-redux';
import axios from 'axios';
import {changeStack, logout} from '../../actions/authActions';
import {updateDetails} from '../../actions/homeActions';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import RBSheet from 'react-native-raw-bottom-sheet';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import ProfileAvatar from '../../components/letterProfileComponent';

const HideDeleteProfileScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectDurationModal, setSelectDurationModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState('');
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // Start as null to track no selection
  const [selectedDelete, setSelectedDelete] = useState(null);

  const bottomSheetRef = useRef(null);
  const deleteBottomSheetRef = useRef(null);

  const apiDispatch = useDispatch();

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const token = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const handleOptionSelect = option => {
    setSelectedOption(option); // Update selected option
    bottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleDeleteOptionSelect = option => {
    setSelectedDelete(option); // Update selected option
    deleteBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  const getLabelFromValue = value => {
    const selectedItem = SELECT_DURATION.find(item => item.value === value);
    return selectedItem ? selectedItem.label : '';
  };

  const handleDurationChange = value => {
    const label = getLabelFromValue(value);
    setSelectedDuration(label);
  };

  const SELECT_DURATION = [
    {label: 'oneWeek', value: '1'},
    {label: 'twoWeek', value: '2'},
    {label: 'oneMonth', value: '3'},
    {label: 'threeMonth', value: '4'},
    {label: 'sixMonth', value: '5'},
  ];

  const SELECT_REASON = [
    {label: 'Found My Match', value: '1'},
    {label: 'Wants to take a break', value: '2'},
    {label: 'Not Satisfied by matches', value: '3'},
    {label: 'Other Reason', value: '4'},
  ];

  const handleDeleteButtonPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    // console.log(' === Deleted Account ===> ');
  };

  const onDeleteAccountPress = async () => {
    console.log(' === ID ===> ', user?.user.id);
    try {
      const response = await axios.delete(
        'https://stag.mntech.website/api/v1/user/user/', // Adjust the URL as needed
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the authentication token
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        // Successfully deleted
        setModalVisible(false); // Close the delete confirmation modal
        dispatch(logout(), () => dispatch(changeStack()));
      }
    } catch (error) {
      // Log detailed error response
      console.error('Error deleting account:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      Alert.alert('Failed to delete account. Please try again later.'); // Show error message
    }
  };

  const selectSetDurationModalOPen = () => {
    setSelectDurationModal(true);
  };

  const SelectSetDurationModalClose = () => {
    setSelectDurationModal(false);
  };

  const onHideProfilePress = () => {
    // setSelectDurationModal(false);
    // console.log('Selected Duration:', selectedDuration);
    if (!selectedDuration) {
      Alert.alert(
        'Please select a duration',
        'You need to select a duration before hiding your profile.',
      );
    } else {
      // console.log('Selected Duration:', selectedDuration);
      apiDispatch(
        updateDetails({
          profileHideAndDelete: {
            timeForProfileHide: selectedDuration,
            isProfileHide: true,
          },
        }),
      );
      setSelectDurationModal(false);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />

          {/*<TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>*/}
          <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>
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

        <HomeTopSheetComponent
          isVisible={topModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        />

        <View style={style.headingTittleContainer}>
          {/*<Image*/}
          {/*  source={icons.delete_Profile_icon}*/}
          {/*  style={style.headingCredentialsImageStyle}*/}
          {/*/>*/}
          <Text style={style.headingCredentialsText}>Profile Visibility</Text>
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.bodyContainerView}>
          <Text style={style.bodyTittleTextStyle}>Hide Profile</Text>

          <View style={style.tittleDescriptionTextContainer}>
            <Text style={style.tittleDescriptionTextStyle}>
              Taking this action makes your profile temporarily
            </Text>
            <Text style={style.tittleDescriptionTextStyle}>
              invisible. Invites or chats are inaccessible
            </Text>
            {/*<Text style={style.tittleDescriptionTextStyle}>inaccessible</Text>*/}
          </View>

          {/*<DropDownTextInputComponent*/}
          {/*  data={SELECT_DURATION}*/}
          {/*  placeholder={'Select Duration'}*/}
          {/*  searchPlaceholder={'Search Select Duration'}*/}
          {/*  height={55}*/}
          {/*  placeholderStyle={{color: colors.black, marginLeft: 15}}*/}
          {/*  onChange={handleDurationChange}*/}
          {/*/>*/}

          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              activeOpacity={0.9}
              style={{
                marginTop: 10,
                width: '100%',
                height: 50,
                borderColor: '#E5E5E5',
                borderWidth: 1,
                borderRadius: 50,
                paddingLeft: 20,
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onPress={() => bottomSheetRef.current.open()} // Open the bottom sheet
            >
              <Text
                style={{
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  color: colors.black,
                }}>
                {selectedOption || 'Select Duration'}
              </Text>
              <Image
                source={icons.drooDownLogo}
                style={{
                  width: 14,
                  height: 8,
                  marginRight: 21,
                  tintColor: colors.black,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>

          <RBSheet
            ref={bottomSheetRef}
            height={hp(300)}
            openDuration={250}
            customStyles={{
              draggableIcon: {
                backgroundColor: '#ffffff',
              },
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
            }}>
            <View>
              <Text
                style={{
                  marginTop: hp(23),
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  color: colors.black,
                  marginBottom: hp(21),
                  marginHorizontal: 30,
                }}>
                Select Duration
              </Text>

              <View
                style={{
                  width: '100%',
                  height: 0.7,
                  backgroundColor: '#E7E7E7',
                }}
              />

              <View style={{marginHorizontal: 30}}>
                <TouchableOpacity
                  // style={{marginTop: 10}}
                  onPress={() => handleOptionSelect('1 Month')}>
                  <Text
                    style={{
                      fontSize: fontSize(16),
                      lineHeight: hp(24),
                      fontFamily: fontFamily.poppins400,
                      color: colors.black,
                      marginTop: 24,
                    }}>
                    1 Month{' '}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleOptionSelect('3 Month')}>
                  <Text
                    style={{
                      fontSize: fontSize(16),
                      lineHeight: hp(24),
                      fontFamily: fontFamily.poppins400,
                      color: colors.black,
                      marginTop: 24,
                    }}>
                    3 Month
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleOptionSelect('6 Month')}>
                  <Text
                    style={{
                      fontSize: fontSize(16),
                      lineHeight: hp(24),
                      fontFamily: fontFamily.poppins400,
                      color: colors.black,
                      marginTop: 24,
                    }}>
                    6 Month
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleOptionSelect('Till I activate')}>
                  <Text
                    style={{
                      fontSize: fontSize(16),
                      lineHeight: hp(24),
                      fontFamily: fontFamily.poppins400,
                      color: colors.black,
                      marginTop: 24,
                    }}>
                    Till I activate
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </RBSheet>

          {/*<View style={{flex: 1, alignItems: 'flex-end'}}>*/}
          <View style={{flex: 1}}>
            <CommonGradientButton
              onPress={selectSetDurationModalOPen}
              buttonName={'Hide'}
              disabled={!selectedOption}
              containerStyle={{
                width: '100%',
                height: hp(50),
                marginTop: hp(15),
              }}
            />
          </View>
        </View>

        <View style={style.descriptionBodyUnderlineStyleDropdown} />

        <View style={{marginHorizontal: 17}}>
          <View style={{marginTop: hp(22)}}>
            <Text style={style.bodyTittleTextStyle}>Delete Your Profile</Text>

            <Text
              style={[style.tittleDescriptionTextStyle, {marginTop: hp(19)}]}>
              You'll lose all profile details, Match interactions,
            </Text>
            <Text
              style={[
                style.tittleDescriptionTextStyle,
                {marginBottom: hp(16)},
              ]}>
              and paid memberships permanently.
            </Text>

            {/*<DropDownTextInputComponent*/}
            {/*  data={SELECT_REASON}*/}
            {/*  placeholder={'Select Reason'}*/}
            {/*  searchPlaceholder={'Search Select Reason'}*/}
            {/*  height={55}*/}
            {/*  placeholderStyle={{*/}
            {/*    color: colors.black,*/}
            {/*    marginLeft: hp(15),*/}
            {/*  }}*/}
            {/*/>*/}

            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  marginTop: 10,
                  width: '100%',
                  height: 50,
                  borderColor: '#E5E5E5',
                  borderWidth: 1,
                  borderRadius: 50,
                  paddingLeft: 20,
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
                onPress={() => deleteBottomSheetRef.current.open()} // Open the bottom sheet
              >
                <Text
                  style={{
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                    color: colors.black,
                  }}>
                  {selectedDelete || 'Select Reason'}
                </Text>
                {/* Display selected option or "Open" */}
                <Image
                  source={icons.drooDownLogo}
                  style={{
                    width: 13,
                    height: 10,
                    marginRight: 21,
                    tintColor: colors.black,
                  }}
                />
              </TouchableOpacity>
            </View>

            <RBSheet
              ref={deleteBottomSheetRef}
              height={300}
              openDuration={250}
              customStyles={{
                draggableIcon: {
                  backgroundColor: '#ffffff',
                },
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
              }}>
              <View>
                <Text
                  style={{
                    marginTop: hp(23),
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                    color: colors.black,
                    marginBottom: hp(21),
                    marginHorizontal: 30,
                  }}>
                  Select the reason
                </Text>

                <View
                  style={{
                    width: '100%',
                    height: 0.7,
                    backgroundColor: '#E7E7E7',
                  }}
                />

                <View style={{marginHorizontal: 30}}>
                  <TouchableOpacity
                    // style={{marginTop: 10}}
                    onPress={() =>
                      handleDeleteOptionSelect(' Found my match on HappyMilan')
                    }>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                        marginTop: 24,
                      }}>
                      Found my match on HappyMilan
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      handleDeleteOptionSelect(
                        'Found my match through other sources',
                      )
                    }>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                        marginTop: 24,
                      }}>
                      Found my match through other sources
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() =>
                      handleDeleteOptionSelect('I changed my decision')
                    }>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                        marginTop: 24,
                      }}>
                      I changed my decision
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteOptionSelect('I will do later')}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                        marginTop: 24,
                      }}>
                      I will do later
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </RBSheet>

            <TouchableOpacity
              onPress={handleDeleteButtonPress}
              activeOpacity={0.7}
              style={{flex: 1, alignItems: 'flex-end', marginTop: hp(15)}}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 0.9, y: 0.7}}
                style={{
                  width: '100%',
                  height: hp(50),
                  borderRadius: 50,
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: colors.white,
                    textAlign: 'center',
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Delete
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/*MODAL FOR DELETE*/}

      <View style={style.modalContainer}>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleModalClose}>
          <View style={style.modalBodyContainer}>
            <View style={style.modalBodyStyle}>
              <View style={style.modalTittleContainer}>
                <Text style={style.modalTittleText}>Are you sure want</Text>

                <Text style={style.modalTittleDescriptionText}>
                  Delete Your Profile?
                </Text>
              </View>

              <View style={style.modalButtonContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleModalClose}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    style={{
                      width: wp(126),
                      height: hp(50),
                      borderRadius: 50,
                      borderWidth: 1,
                      justifyContent: 'center',
                      borderColor: 'transparent', // Set border color to transparent
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
                          fontSize: fontSize(14),
                          lineHeight: hp(21),
                          fontFamily: fontFamily.poppins600,
                        }}>
                        Not Now
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={onDeleteAccountPress}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={style.confirmButtonStyle}>
                    <Text style={style.confirmButtonTextStyle}>
                      Yes, Delete
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/*HIDE PROFILE MODAL*/}
        <Modal
          animationType="none"
          transparent={true}
          visible={selectDurationModal}
          onRequestClose={SelectSetDurationModalClose}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                width: wp(340),
                height: hp(264),
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fontSize(24),
                  lineHeight: hp(36),
                  color: colors.black,
                  fontFamily: fontFamily.poppins400,
                }}>
                Are you sure want
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fontSize(18),
                  lineHeight: hp(30),
                  color: colors.black,
                  marginTop: hp(3),
                  fontFamily: fontFamily.poppins400,
                }}>
                Hide Your Profile?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 50,
                  justifyContent: 'space-evenly',
                  // backgroundColor: 'grey',
                  // marginHorizontal: 34,
                }}>
                {/*<CommonGradientButton*/}
                {/*  buttonName={'not now'}*/}
                {/*  containerStyle={{width: wp(126), height: hp(50)}}*/}
                {/*/>*/}

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={SelectSetDurationModalClose}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    style={{
                      width: wp(126),
                      height: hp(50),
                      borderRadius: 50,
                      borderWidth: 1,
                      justifyContent: 'center',
                      borderColor: 'transparent', // Set border color to transparent
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
                          fontSize: fontSize(14),
                          lineHeight: hp(21),
                          fontFamily: fontFamily.poppins600,
                        }}>
                        Not Now
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <CommonGradientButton
                  onPress={onHideProfilePress}
                  buttonName={'Yes, Hide'}
                  containerStyle={{
                    width: hp(126),
                    height: hp(50),
                    borderRadius: 50,
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default HideDeleteProfileScreen;
