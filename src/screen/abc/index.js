import React, {useState, useEffect} from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {icons} from '../../assets';
import axios from 'axios';
import {updateDetails} from '../../actions/homeActions';
import {colors} from '../../utils/colors';
import {style} from '../adminProfileDetailsScreen/adminContactDetailsScreen/style';

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

const Abc = ({route}) => {
  const {planData} = route.params;
  console.log(' === planData ===> ', planData);

  const {user} = useSelector(state => state.auth);
  const privacySetting = user?.user?.privacySetting;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // console.log(' === privacySetting ===> ', privacySetting);
  //
  // console.log(' === User Details ===> ', user?.user?.privacySettingCustom);

  const [selectedPrivacy, setSelectedPrivacy] = useState(
    privacySetting || PROFILE_TYPES.PUBLIC,
  ); // Default to 'publicProfile' if no privacySetting
  const [checkedOptions, setCheckedOptions] = useState({});

  const apiDispatch = useDispatch();

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
    if (selectedPrivacy === PROFILE_TYPES.PUBLIC) {
      privacySettingCustom.publicProfile = [
        'privacySetting',
        'profilePic',
        'userProfilePic',
        'userProfileVideo',
        'firstName',
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
        'profilePhotoPrivacy',
        'privacySettingCustom',
        'datingData',
      ];
    } else if (selectedPrivacy === PROFILE_TYPES.PRIVATE) {
      privacySettingCustom.privateProfile = [
        'profilePic',
        'userProfilePic',
        'userProfileVideo',
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
      ];
      // Automatically set showPhotoToFriendsOnly to true for privateProfile
      privacySettingCustom.showPhotoToFriendsOnly = true;
    } else if (selectedPrivacy === PROFILE_TYPES.PREMIUM) {
      privacySettingCustom.premiumProfile = [
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

      // console.log('API Response:', response.data);
      apiDispatch(updateDetails());

      // console.log(' === selectedPrivacy___ ===> ', selectedPrivacy);

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
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{marginHorizontal: 17, marginTop: 20}}>
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

          const isDisabled =
            option.value === PROFILE_TYPES.PREMIUM && !planData?.isActive;

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

      <TouchableOpacity
        onPress={handleSave}
        style={{
          marginTop: 50,
          width: '90%',
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'center',
          borderRadius: 25,
          backgroundColor: 'gray',
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: fontSize(16),
            lineHeight: hp(24),
            fontFamily: fontFamily.poppins400,
          }}>
          Save
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Abc;
