import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../actions/homeActions';
import {fontFamily, fontSize, hp} from '../../utils/helpers';

import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import axios from 'axios';
import ProfileAvatar from '../../components/letterProfileComponent';

const CustomCheckbox = ({isChecked, onPress}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        width: hp(20),
        height: hp(20),
        borderWidth: 1,
        borderColor: '#8225AF',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginRight: 10,
        backgroundColor: isChecked ? 'purple' : 'white',
      }}>
      {isChecked && (
        <Text style={{color: 'white', fontSize: 12, fontWeight: 'bold'}}>
          ✓
        </Text>
      )}
    </TouchableOpacity>
  );
};

const PROFILE_TYPES = {
  PUBLIC: 'publicProfile',
  PREMIUM: 'premiumProfile',
  PRIVATE: 'privateProfile',
};

const PrivacyScreen = ({route}) => {
  const {planData} = route.params;
  console.log(' === planData ===> ', planData);

  const [selectedPrivacy, setSelectedPrivacy] = useState('');
  const [checkedOptions, setCheckedOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;

  const privacySetting = user?.user?.privacySetting;

  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  useEffect(() => {
    if (privacySetting) {
      setSelectedPrivacy(privacySetting);
    }

    if (
      (privacySetting === PROFILE_TYPES.PUBLIC ||
        privacySetting === PROFILE_TYPES.PRIVATE) &&
      user?.user?.privacySettingCustom?.showPhotoToFriendsOnly === true
    ) {
      setCheckedOptions(prevState => ({
        ...prevState,
        [PROFILE_TYPES.PUBLIC]: ['Photos visible on accept'],
      }));
    } else {
      setCheckedOptions(prevState => ({
        ...prevState,
        [PROFILE_TYPES.PUBLIC]: [],
      }));
    }

    if (privacySetting === PROFILE_TYPES.PREMIUM) {
      const customSettings = user?.user?.privacySettingCustom || {};
      const newCheckedOptions = {};

      if (customSettings.profilePhotoPrivacy) {
        newCheckedOptions[PROFILE_TYPES.PREMIUM] = [
          'Hide Photos for Everyone.',
        ];
      }

      if (customSettings.address) {
        newCheckedOptions[PROFILE_TYPES.PREMIUM] = [
          ...(newCheckedOptions[PROFILE_TYPES.PREMIUM] || []),
          'Hide Address Info for Everyone.',
        ];
      }

      if (customSettings.contact) {
        newCheckedOptions[PROFILE_TYPES.PREMIUM] = [
          ...(newCheckedOptions[PROFILE_TYPES.PREMIUM] || []),
          'Hide Contact Info for Everyone.',
        ];
      }

      if (customSettings.professional) {
        newCheckedOptions[PROFILE_TYPES.PREMIUM] = [
          ...(newCheckedOptions[PROFILE_TYPES.PREMIUM] || []),
          'Hide Professional Info for Everyone.',
        ];
      }

      setCheckedOptions(prevState => ({
        ...prevState,
        [PROFILE_TYPES.PREMIUM]: newCheckedOptions[PROFILE_TYPES.PREMIUM] || [],
      }));
    }
  }, [privacySetting, user]);

  const handleCheckboxToggle = (value, label) => {
    setCheckedOptions(prevState => {
      const newCheckedOptions = {...prevState};

      if (newCheckedOptions[value]?.includes(label)) {
        newCheckedOptions[value] = newCheckedOptions[value].filter(
          item => item !== label,
        );
      } else {
        newCheckedOptions[value] = [...(newCheckedOptions[value] || []), label];
      }

      return newCheckedOptions;
    });
  };

  const handleSave = async () => {
    const token = user?.tokens?.access?.token; // Replace with the actual token
    const apiUrl = 'https://stag.mntech.website/api/v1/user/user/update-user';

    setLoading(true);

    let privacySettingCustom = {
      profilePhotoPrivacy:
        checkedOptions[selectedPrivacy]?.includes(
          'Hide Photos for Everyone.',
        ) || false,
      showPhotoToFriendsOnly:
        checkedOptions[selectedPrivacy]?.includes('Photos visible on accept') ||
        false,
      address:
        checkedOptions[selectedPrivacy]?.includes(
          'Hide Address Info for Everyone.',
        ) || false,
      contact:
        checkedOptions[selectedPrivacy]?.includes(
          'Hide Contact Info for Everyone.',
        ) || false,
      professional:
        checkedOptions[selectedPrivacy]?.includes(
          'Hide Professional Info for Everyone.',
        ) || false,
    };

    // Add only the selected profile type
    if (selectedPrivacy === 'publicProfile') {
      privacySettingCustom.publicProfile = [
        'profilePic',
        'userProfilePic',
        'userProfileVideo',
        'firstName',
        'lastName',
        'dateOfBirth',
        'birthTime',
        'religion',
        'caste',
        'height',
        'weight',
        'displayName',
        'name',
        'randomId',
        'maritalStatus',
        'userEducation',
        'userProfessional',
        'hobbies',
        'userPartnerDetails',
        'userUniqueId',
        'privacySetting',
        'motherTongue',
        'isUserActive',
        'age',
        'maritalStatus',
        'writeBoutYourSelf',
        'gender',
        'address',
        'privacySettingCustom',
        'language',
        'manglikStatus',
        'gothra',
        'zodiac',
      ];
    } else if (selectedPrivacy === 'privateProfile') {
      privacySettingCustom.privateProfile = [
        'profilePic',
        'userProfilePic',
        'userProfileVideo',
        'firstName',
        'lastName',
        'dateOfBirth',
        'birthTime',
        'religion',
        'caste',
        'height',
        'weight',
        'displayName',
        'name',
        'randomId',
        'maritalStatus',
        'userEducation',
        'userProfessional',
        'hobbies',
        'userPartnerDetails',
        'userUniqueId',
        'privacySetting',
        'motherTongue',
        'isUserActive',
        'age',
        'maritalStatus',
        'writeBoutYourSelf',
        'gender',
        'address',
        'privacySettingCustom',
        'language',
        'manglikStatus',
        'gothra',
        'zodiac',
      ];
      // Automatically set showPhotoToFriendsOnly to true for privateProfile
      privacySettingCustom.showPhotoToFriendsOnly = true;
      privacySettingCustom.profilePhotoPrivacy = true;
    } else if (selectedPrivacy === 'premiumProfile') {
      privacySettingCustom.premiumProfile = [
        // 'profilePic',
        // 'userProfilePic',
        // 'userProfileVideo',
        // 'firstName',
        // 'lastName',
        // 'dateOfBirth',
        // 'birthTime',
        // 'religion',
        // 'caste',
        // 'height',
        // 'weight',
        // 'displayName',
        // 'name',
        // 'randomId',
        // 'maritalStatus',
        // 'userEducation',
        // 'userProfessional',
        // 'hobbies',
        // 'userPartnerDetails',
        // 'privacySetting',
        'profilePic',
        'userProfilePic',
        'userProfileVideo',
        'firstName',
        'lastName',
        'dateOfBirth',
        'birthTime',
        'religion',
        'caste',
        'height',
        'weight',
        'displayName',
        'name',
        'randomId',
        'maritalStatus',
        'userEducation',
        'userProfessional',
        'hobbies',
        'userPartnerDetails',
        'userUniqueId',
        'privacySetting',
        'motherTongue',
        'isUserActive',
        'age',
        'maritalStatus',
        'writeBoutYourSelf',
        'gender',
        'address',
        'privacySettingCustom',
        'language',
        'manglikStatus',
        'gothra',
        'zodiac',
      ];
    }

    const payload = {
      privacySetting: selectedPrivacy,
      privacySettingCustom: privacySettingCustom,
    };

    try {
      const response = await axios.put(apiUrl, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('API Response:', response.data);
      apiDispatch(updateDetails());
      setLoading(false);

      // Set the appropriate message based on the selectedPrivacy
      let message = '';
      if (selectedPrivacy === PROFILE_TYPES.PUBLIC) {
        message = 'Profile set to Public.\nChanges are saved.';
      } else if (selectedPrivacy === PROFILE_TYPES.PREMIUM) {
        message = 'Profile set to Premier Member only.\nChanges are saved.';
      } else if (selectedPrivacy === PROFILE_TYPES.PRIVATE) {
        message = 'Profile set to Private.';
      }

      setModalMessage(message); // Set the modal message
      setIsModalVisible(true); // Show the modal

      // alert('Privacy settings updated successfully!');
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      alert('Failed to update privacy settings.');
      setLoading(false);
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

        <View style={style.headingTittleContainer}>
          <Text style={style.headingCredentialsText}>Privacy Setting</Text>
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

      <View style={{marginHorizontal: 17, marginTop: hp(17)}}>
        {[
          {
            label: 'Public Profile',
            labelTwo: 'All info visible except contact & email',
            defaultText: 'Default',
            value: PROFILE_TYPES.PUBLIC,
            extraTexts: ['Photos visible on accept'],
          },
          {
            label: 'Premium Members Only',
            labelTwo:
              'Photos, contact will be hidden from unregistered\nmembers.',
            defaultText: [],
            value: PROFILE_TYPES.PREMIUM,
            extraTexts: [
              'Hide Photos for Everyone.',
              'Hide Contact Info for Everyone.',
              'Hide Address Info for Everyone.',
              'Hide Professional Info for Everyone.',
            ],
          },
          {
            label: 'Private Profile',
            labelTwo: 'All information will be hidden.',
            defaultText: [],
            value: PROFILE_TYPES.PRIVATE,
            extraTexts: [],
          },
        ].map(option => {
          const isSelected = selectedPrivacy === option.value;
          const shouldShowExtraText =
            isSelected && option.extraTexts.length > 0;

          // const isDisabled =
          //   privacySetting === 'publicProfile' &&
          //   option.value === 'premiumProfile';

          const isDisabled =
            option.value === 'premiumProfile' && !planData?.isActive;

          return (
            <View
              key={option.value}
              style={{marginTop: 10, opacity: isDisabled ? 0.5 : 1}}>
              <TouchableOpacity
                activeOpacity={isDisabled ? 1 : 0.6}
                onPress={() => !isDisabled && setSelectedPrivacy(option.value)}
                style={{
                  width: '100%',
                  borderTopLeftRadius: 15,
                  borderTopRightRadius: 15,
                  borderBottomLeftRadius: shouldShowExtraText ? 0 : 15,
                  borderBottomRightRadius: shouldShowExtraText ? 0 : 15,
                  overflow: 'hidden',
                }}>
                {isSelected ? (
                  <LinearGradient
                    colors={['#0F52BA', '#8225AF']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0.1}}
                    style={{
                      padding: 15,
                      height: 80,
                      justifyContent: 'center',
                    }}>
                    <View style={{position: 'absolute', right: 15, top: 12}}>
                      <Image
                        source={icons.white_tran_check_box}
                        style={{
                          width: hp(16),
                          height: hp(16),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: fontSize(14),
                          lineHeight: hp(18),
                          fontFamily: fontFamily.poppins500,
                        }}>
                        {option.label}
                      </Text>

                      {option.label === 'Public Profile' && (
                        <View
                          style={{
                            width: hp(54),
                            height: hp(18),
                            borderRadius: 50,
                            backgroundColor: '#FFFFFF29',
                            marginLeft: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                            top: -1,
                          }}>
                          <Text
                            style={{
                              color: 'white',
                              fontSize: fontSize(9),
                              lineHeight: hp(12),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            {option.defaultText}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={{
                        color: 'white',
                        marginTop: hp(5),
                        fontSize: fontSize(10),
                        lineHeight: hp(14),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      {option.labelTwo}
                    </Text>
                  </LinearGradient>
                ) : (
                  <View
                    style={{
                      padding: 15,
                      height: hp(83),
                      backgroundColor: '#FAFAFA',
                      justifyContent: 'center',
                    }}>
                    <View style={{position: 'absolute', right: 25}}>
                      <Image
                        source={icons.rightSideIcon}
                        style={{
                          width: hp(6),
                          height: hp(11),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>

                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: 'black',
                          fontSize: fontSize(14),
                          lineHeight: hp(18),
                          fontFamily: fontFamily.poppins500,
                        }}>
                        {option.label}
                      </Text>

                      {option.label === 'Public Profile' && (
                        <View
                          style={{
                            width: hp(54),
                            height: hp(18),
                            borderRadius: 50,
                            backgroundColor: '#EFF5FF',
                            marginLeft: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                            top: -1,
                          }}>
                          <Text
                            style={{
                              color: 'black',
                              fontSize: fontSize(9),
                              lineHeight: hp(12),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            {option.defaultText}
                          </Text>
                        </View>
                      )}
                    </View>

                    <Text
                      style={{
                        color: 'black',
                        marginTop: hp(5),
                        fontSize: fontSize(10),
                        lineHeight: hp(14),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      {option.labelTwo}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {shouldShowExtraText && !isDisabled && (
                <LinearGradient
                  colors={['#0F52BA', '#8225AF']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0.1}}
                  style={{
                    padding: 1,
                    borderBottomLeftRadius: 15,
                    borderBottomRightRadius: 15,
                  }}>
                  <View
                    style={{
                      backgroundColor: 'white',
                      padding: 15,
                      borderBottomLeftRadius: 15,
                      borderBottomRightRadius: 15,
                    }}>
                    <Text
                      style={{
                        color: 'black',
                        marginBottom: hp(12),
                        fontSize: fontSize(12),
                        lineHeight: hp(16),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      More Privacy Options
                    </Text>
                    {option.extraTexts.map((text, index) => (
                      <TouchableOpacity
                        key={index}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: hp(10),
                        }}
                        onPress={() =>
                          text !== 'More Privacy Options.' &&
                          handleCheckboxToggle(option.value, text)
                        }
                        disabled={isDisabled}>
                        {text !== 'More Privacy Options.' && (
                          <CustomCheckbox
                            isChecked={
                              checkedOptions[option.value]?.includes(text) ||
                              false
                            }
                            onPress={() =>
                              handleCheckboxToggle(option.value, text)
                            }
                          />
                        )}
                        <Text
                          style={{
                            color: 'black',
                            fontSize: fontSize(14),
                            lineHeight: hp(18),
                            fontFamily: fontFamily.poppins400,
                          }}>
                          {text}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </LinearGradient>
              )}
            </View>
          );
        })}
      </View>

      <Modal
        visible={isModalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}>
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
              backgroundColor: 'white',
              borderRadius: 10,
              alignItems: 'center',
            }}>
            <Image
              source={icons.check_gradient_icon}
              style={{
                width: hp(34),
                height: hp(34),
                resizeMode: 'contain',
                marginTop: hp(43),
                marginBottom: hp(30),
              }}
            />
            <Text
              style={{
                fontSize: fontSize(16),
                textAlign: 'center',
                fontFamily: fontFamily.poppins500,
                lineHeight: hp(24),
                color: colors.black,
                marginBottom: hp(30),
              }}>
              {modalMessage}
            </Text>
            {/*<TouchableOpacity onPress={() => setIsModalVisible(false)}>*/}
            {/*  <Text style={{color: '#007BFF', fontSize: 14}}>Close</Text>*/}
            {/*</TouchableOpacity>*/}

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsModalVisible(false)}>
              <LinearGradient
                colors={['#0F52BA', '#8225AF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1.2}}
                style={{
                  width: hp(114),
                  height: hp(50),
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  marginBottom: hp(39),
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Okay
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View
        style={{
          // marginHorizontal: 17,
          position: 'absolute',
          bottom: 26,
          width: '100%',
        }}>
        <View style={{marginHorizontal: 17}}>
          <TouchableOpacity activeOpacity={0.7} onPress={handleSave}>
            <LinearGradient
              colors={['#0F52BA', '#8225AF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1.2}}
              style={{
                width: '100%',
                height: hp(44),
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                // marginTop: hp(75),
              }}>
              {loading ? (
                <ActivityIndicator size="large" color={colors.white} />
              ) : (
                <Text style={{color: 'white'}}>Save Changes</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PrivacyScreen;
