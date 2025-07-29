import React, {useRef, useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
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
  const [selectUnDurationModal, setSelectUnDurationModal] = useState(false);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null); // Start as null to track no selection
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customReason, setCustomReason] = useState('');

  // console.log(' === selectedOption ===> ', selectedOption);

  const bottomSheetRef = useRef(null);
  const deleteBottomSheetRef = useRef(null);

  const apiDispatch = useDispatch();

  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const token = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;
  const isProfileHide = user?.user?.profileHideAndDelete[0]?.isProfileHide;

  const deleteReasons = {
    FOUND_SUITABLE_PARTNER: {
      label: 'I’ve found a suitable partner.',
      value: 'found-suitable-partner',
    },
    MARRIED_OR_ENGAGED: {
      label: 'I’m now married or engaged',
      value: 'married-or-engaged',
    },
    TAKING_BREAK: {
      label: 'Taking a break from matchmaking',
      value: 'taking-break',
    },
    PRIVACY_OR_SAFETY_CONCERNS: {
      label: 'I have privacy or safety concerns.',
      value: 'privacy-or-safety-concerns',
    },
    DIFFICULT_TO_USE: {
      label: 'I found the app/website difficult to use.',
      value: 'difficult-to-use',
    },
    TOO_MANY_UNRELATED_MATCHES: {
      label: 'I received too many unrelated matches.',
      value: 'too-many-unrelated-matches',
    },
    DID_NOT_GET_EXPECTED_RESPONSES: {
      label: 'Did not get expected responses',
      value: 'did-not-get-expected-responses',
    },
    TOO_COSTLY_OR_NOT_VALUABLE: {
      label: 'The platform is too costly or not valuable',
      value: 'too-costly-or-not-valuable',
    },
    OTHER: {
      label: 'Other (Please Specify)',
      value: 'other',
    },
  };

  const getDeleteReasonLabel = value => {
    const found = Object.values(deleteReasons).find(
      item => item.value === value,
    );
    return found?.label || 'Select Reason';
  };

  // console.log(' === user++ ===> ', isProfileHide);

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const handleOptionSelect = duration => {
    const formattedText = formatDurationText(duration);
    setSelectedDuration(duration); // Store the original value if needed for API calls
    setSelectedOption(formattedText); // Store the formatted text for display
    bottomSheetRef.current.close();
  };

  // const handleDeleteOptionSelect = option => {
  //   setSelectedDelete(option); // Update selected option
  //   deleteBottomSheetRef.current.close(); // Close the bottom sheet
  // };

  const handleDeleteOptionSelect = value => {
    setSelectedDelete(value);
    deleteBottomSheetRef.current.close();

    if (value === 'other') {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      setCustomReason('');
    }
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

  const formatDurationText = duration => {
    switch (duration) {
      case 'oneWeek':
        return 'One Week';
      case 'twoWeek':
        return 'Two Weeks';
      case 'oneMonth':
        return 'One Month';
      case 'threeMonth':
        return 'Three Months';
      case 'sixMonth':
        return 'Six Months';
      default:
        return duration;
    }
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

  // const onDeleteAccountPress = async () => {
  //   console.log(' === ID ===> ', user?.user.id);
  //   try {
  //     const response = await axios.delete(
  //       'https://stag.mntech.website/api/v1/user/user/', // Adjust the URL as needed
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`, // Include the authentication token
  //           'Content-Type': 'application/json',
  //         },
  //       },
  //     );
  //
  //     if (response.status === 200) {
  //       // Successfully deleted
  //       setModalVisible(false); // Close the delete confirmation modal
  //       dispatch(logout(), () => dispatch(changeStack()));
  //     }
  //   } catch (error) {
  //     // Log detailed error response
  //     console.error('Error deleting account:', {
  //       status: error.response?.status,
  //       data: error.response?.data,
  //       message: error.message,
  //     });
  //     Alert.alert('Failed to delete account. Please try again later.'); // Show error message
  //   }
  // };

  // const onDeleteAccountPress = () => {
  //   console.log('Selected Reason Value:', selectedDelete);
  //
  //   if (selectedDelete === 'other') {
  //     console.log('Custom Reason:', customReason);
  //   }
  //
  //   setModalVisible(false);
  // };

  const onDeleteAccountPress = async () => {
    console.log('Selected Reason Value:', selectedDelete);

    let payload = {
      profileHideAndDelete: {
        isProfileDelete: true,
      },
    };

    if (selectedDelete === 'other') {
      console.log('Custom Reason:', customReason);
      payload.profileHideAndDelete.reason = 'delete profile';
    } else {
      payload.profileHideAndDelete.reasonForProfileDelete = selectedDelete;
    }

    const token = user?.tokens?.access?.token;

    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/auth/update-user',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log('Account deletion request successful:', data);
        dispatch(logout(), () => dispatch(changeStack()));
        // Show success message or navigate
      } else {
        console.error('Failed to delete account:', data);
        // Handle API error
      }
    } catch (error) {
      console.error('Network error:', error);
    }

    setModalVisible(false);
  };

  const selectSetDurationModalOPen = () => {
    setSelectDurationModal(true);
  };

  const selectSetUnDurationModalOPen = () => {
    setSelectUnDurationModal(true);
  };

  const SelectSetDurationModalClose = () => {
    setSelectDurationModal(false);
  };

  const onHideProfilePress = () => {
    // console.log('Selected Duration:', selectedDuration);
    // if (!selectedDuration) {
    //   Alert.alert(
    //     'Please select a duration',
    //     'You need to select a duration before hiding your profile.',
    //   );
    // } else {
    //   apiDispatch(
    //     updateDetails({
    //       profileHideAndDelete: {
    //         // timeForProfileHide: selectedDuration,
    //         isProfileHide: true,
    //       },
    //     }),
    //   );
    //   setSelectDurationModal(false);
    // }

    apiDispatch(
      updateDetails(
        {
          profileHideAndDelete: {
            // timeForProfileHide: selectedDuration,
            isProfileHide: true,
          },
        },
        () => {
          setSelectDurationModal(false);
        },
      ),
    );
  };

  const onUnHideProfilePress = () => {
    apiDispatch(
      updateDetails(
        {
          profileHideAndDelete: {
            isProfileHide: false,
          },
        },
        () => {
          setSelectUnDurationModal(false);
        },
      ),
    );
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

          {/*<View style={{flex: 1, alignItems: 'flex-end'}}>*/}
          <View style={{flex: 1}}>
            {isProfileHide ? (
              <CommonGradientButton
                onPress={selectSetUnDurationModalOPen}
                buttonName={'Unhide Profile'}
                containerStyle={{
                  width: '100%',
                  height: hp(50),
                  marginTop: hp(15),
                }}
              />
            ) : (
              <CommonGradientButton
                onPress={selectSetDurationModalOPen}
                buttonName={'Hide Profile'}
                containerStyle={{
                  width: '100%',
                  height: hp(50),
                  marginTop: hp(15),
                }}
              />
            )}
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
                onPress={() => deleteBottomSheetRef.current.open()}>
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                    color: colors.black,
                    flex: 1,
                  }}>
                  {getDeleteReasonLabel(selectedDelete)}
                </Text>
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

            {showOtherInput && (
              <View
                style={{
                  // marginHorizontal: 17,
                  marginTop: hp(25),
                  borderWidth: 1,
                  borderColor: '#D3D3D3',
                  borderRadius: 10,
                  padding: 10,
                }}>
                <TextInput
                  placeholder="Describe Here"
                  multiline
                  numberOfLines={4}
                  value={customReason}
                  onChangeText={setCustomReason}
                  style={{
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins400,
                    textAlignVertical: 'top',
                    color: colors.black,
                  }}
                />
              </View>
            )}

            <RBSheet
              ref={deleteBottomSheetRef}
              height={hp(550)}
              // openDuration={250}
              customStyles={{
                draggableIcon: {
                  backgroundColor: '#ffffff',
                },
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
              }}>
              <View style={{flex: 1}}>
                <Text
                  style={{
                    marginTop: hp(15),
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
                  {Object.values(deleteReasons).map((reason, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleDeleteOptionSelect(reason.value)}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins400,
                          color: colors.black,
                          marginTop: hp(24),
                        }}>
                        {reason.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </RBSheet>

            <TouchableOpacity
              onPress={!selectedDelete ? null : handleDeleteButtonPress} // Disable press when no reason selected
              activeOpacity={0.7}
              disabled={!selectedDelete} // Disable touch when no reason selected
              style={{
                flex: 1,
                alignItems: 'flex-end',
                marginTop: hp(24),
                marginBottom: 50,
              }}>
              <LinearGradient
                colors={
                  !selectedDelete
                    ? ['#0D4EB3', '#9413D0']
                    : ['#0D4EB3', '#9413D0']
                } // Gray when disabled
                start={{x: 0, y: 0}}
                end={{x: 0.9, y: 0.7}}
                style={{
                  width: '100%',
                  height: hp(50),
                  borderRadius: 50,
                  justifyContent: 'center',
                  opacity: !selectedDelete ? 0.6 : 1, // Reduce opacity when disabled
                }}>
                <Text
                  style={{
                    color: colors.white,
                    textAlign: 'center',
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Delete Profile
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
                {/*<Text style={style.modalTittleText}>Are you sure want</Text>*/}

                <Text style={style.modalTittleDescriptionText}>
                  Proceed to Delete your profile?
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
                        Cancel
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
                width: '90%',
                // height: hp(264),
                backgroundColor: 'white',
                // padding: 20,
                borderRadius: 20,
                justifyContent: 'center',
              }}>
              {/*<Text*/}
              {/*  style={{*/}
              {/*    textAlign: 'center',*/}
              {/*    fontSize: fontSize(24),*/}
              {/*    lineHeight: hp(36),*/}
              {/*    color: colors.black,*/}
              {/*    fontFamily: fontFamily.poppins400,*/}
              {/*  }}>*/}
              {/*  Are you sure want*/}
              {/*</Text>*/}
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fontSize(18),
                  lineHeight: hp(30),
                  color: colors.black,
                  marginTop: hp(51),
                  fontFamily: fontFamily.poppins400,
                }}>
                Proceed to Hide your profile?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(38),
                  justifyContent: 'space-evenly',
                  marginBottom: hp(39),
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
                      borderWidth: 1.5,
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
                        Cancel
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

        <Modal
          animationType="none"
          transparent={true}
          visible={selectUnDurationModal}
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
                width: '90%',
                // height: hp(264),
                backgroundColor: 'white',
                // padding: 20,
                borderRadius: 20,
                justifyContent: 'center',
              }}>
              {/*<Text*/}
              {/*  style={{*/}
              {/*    textAlign: 'center',*/}
              {/*    fontSize: fontSize(24),*/}
              {/*    lineHeight: hp(36),*/}
              {/*    color: colors.black,*/}
              {/*    fontFamily: fontFamily.poppins400,*/}
              {/*  }}>*/}
              {/*  Are you sure want*/}
              {/*</Text>*/}
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fontSize(18),
                  lineHeight: hp(30),
                  color: colors.black,
                  marginTop: hp(51),
                  fontFamily: fontFamily.poppins400,
                }}>
                Proceed to Unhide your profile?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: hp(38),
                  marginBottom: hp(39),
                  justifyContent: 'space-evenly',
                  // backgroundColor: 'grey',
                  // marginHorizontal: 34,
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectUnDurationModal(false);
                  }}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    style={{
                      width: wp(126),
                      height: hp(50),
                      borderRadius: 50,
                      borderWidth: 1.5,
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
                        Cancel
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <CommonGradientButton
                  onPress={onUnHideProfilePress}
                  buttonName={'Yes, Unhide'}
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
