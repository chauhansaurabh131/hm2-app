import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
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
import {hp} from '../../utils/helpers';

import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import RBSheet from 'react-native-raw-bottom-sheet';

const PrivacyScreen = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;

  console.log(' === var ===> ', user?.user);

  const apiDispatch = useDispatch();

  const profileMapping = {
    publicProfile: 'Public Profile',
    premiumProfile: 'Premium Members Only',
    privateProfile: 'Private Profile',
  };

  const mappedProfile = profileMapping[user?.user?.privacySetting];

  const [selectedProfile, setSelectedProfile] = useState(
    mappedProfile || 'Public Profile',
  );

  const [selectedPublicVisibility, setSelectedPublicVisibility] =
    useState('Public');

  const [selectedPremiumVisibility, setSelectedPremiumVisibility] =
    useState('Public');

  const [selectedPrivateVisibility, setSelectedPrivateVisibility] =
    useState('Private');

  const [loading, setLoading] = useState(false);

  const bottomSheetRef = useRef(null);
  const bottomPremiumSheetRef = useRef(null);
  const bottomPrivateSheetRef = useRef(null);

  // useEffect(() => {
  //   updateDetails();
  // }, []);

  useEffect(() => {
    let formattedVisibility;
    if (user?.user?.privacySettingCustom?.profilePhotoPrivacy === 'public') {
      formattedVisibility = 'Public';
    } else if (
      user?.user?.privacySettingCustom?.profilePhotoPrivacy === 'private'
    ) {
      formattedVisibility = 'Blur Profile Picture';
    } else if (
      user?.user?.privacySettingCustom?.profilePhotoPrivacy === 'no-photo'
    ) {
      formattedVisibility = 'No Photo';
    } else if (
      user?.user?.privacySettingCustom?.profilePhotoPrivacy === 'Premium'
    ) {
      formattedVisibility = 'Visible to Premium Members Only';
    }

    if (selectedProfile === 'Public Profile') {
      setSelectedPublicVisibility(formattedVisibility || 'Public');
    } else if (selectedProfile === 'Premium Members Only') {
      setSelectedPublicVisibility(
        formattedVisibility || 'Visible to Premium Members Only',
      );
    } else if (selectedProfile === 'Private Profile') {
      setSelectedPublicVisibility(formattedVisibility || 'Public');
    }
  }, [selectedProfile]);

  useEffect(() => {
    let formattedPhoto;
    if (user?.user?.privacySettingCustom?.photoGallery === 'public') {
      formattedPhoto = 'Public';
    } else if (user?.user?.privacySettingCustom?.photoGallery === 'private') {
      formattedPhoto = 'Private';
    } else if (user?.user?.privacySettingCustom?.photoGallery === 'Premium') {
      formattedPhoto = 'Visible to Premium Members Only';
    }

    if (selectedProfile === 'Public Profile') {
      setSelectedPremiumVisibility(formattedPhoto || 'Public');
    } else if (selectedProfile === 'Private Profile') {
      setSelectedPremiumVisibility(formattedPhoto || 'private');
    } else if (selectedProfile === 'Premium Members Only') {
      setSelectedPremiumVisibility(
        formattedPhoto || 'Visible to Premium Members Only',
      );
    }
  }, [selectedProfile]);

  useEffect(() => {
    let formattedContect;
    if (user?.user?.privacySettingCustom?.contact === 'private') {
      formattedContect = 'Private';
    } else if (
      user?.user?.privacySettingCustom?.contact === 'Premium Members Only'
    ) {
      formattedContect = 'Visible to Premium Members Only';
    }

    if (selectedProfile === 'Premium Members Only') {
      setSelectedPrivateVisibility(formattedContect || 'Premium Members Only');
    } else {
      setSelectedPrivateVisibility(formattedContect || 'Private');
    }
  }, [selectedProfile]);

  const onSavePress = async () => {
    setLoading(true);
    const profileMapping = {
      'Public Profile': 'publicProfile',
      'Premium Members Only': 'premiumProfile',
      'Private Profile': 'privateProfile',
    };

    const mappedProfile = profileMapping[selectedProfile];

    let formattedVisibilitys;
    if (selectedPublicVisibility === 'Public') {
      formattedVisibilitys = 'public';
    } else if (selectedPublicVisibility === 'Blur Profile Picture') {
      formattedVisibilitys = 'private';
    } else if (selectedPublicVisibility === 'No Photo') {
      formattedVisibilitys = 'no-photo';
    } else if (selectedPublicVisibility === 'Visible to Premium Members Only') {
      formattedVisibilitys = 'premium';
    }

    let formattedPhotoGallery;
    if (selectedPremiumVisibility === 'Public') {
      formattedPhotoGallery = 'public';
    } else if (selectedPremiumVisibility === 'Private') {
      formattedPhotoGallery = 'private';
    } else if (
      selectedPremiumVisibility === 'Visible to Premium Members Only'
    ) {
      formattedPhotoGallery = 'premium';
    }

    let formattedContact;
    if (selectedPrivateVisibility === 'Private') {
      formattedContact = 'private';
    } else if (
      selectedPrivateVisibility === 'Visible to Premium Members Only'
    ) {
      formattedContact = 'premium';
    }

    // Define the profile data
    const profileData = {
      publicProfile: [
        'privacySettingCustom',
        'profilePic',
        'userProfilePic',
        'userProfileVideo',
        'age',
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
        'homeMobileNumber',
        'mobileNumber',
        'email',
      ],
      privateProfile: [
        'privacySettingCustom',
        'profilePic',
        'userProfilePic',
        'userProfileVideo',
        'age',
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
        'homeMobileNumber',
        'mobileNumber',
        'email',
      ],
      premiumProfile: [
        'privacySettingCustom',
        'profilePic',
        'userProfilePic',
        'userProfileVideo',
        'age',
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
        'homeMobileNumber',
        'mobileNumber',
        'email',
      ],
    };

    // Conditionally remove `profilePic` based on `selectedPublicVisibility`
    // if (
    //   selectedPublicVisibility === 'Blur Profile Picture' ||
    //   selectedPublicVisibility === 'No Photo'
    // ) {
    //   // Remove profilePic from all profiles if the condition matches
    //   Object.keys(profileData).forEach(profileKey => {
    //     profileData[profileKey] = profileData[profileKey].filter(
    //       item => item !== 'profilePic',
    //     );
    //   });
    // }

    // Conditionally remove `userProfilePic` based on `selectedPremiumVisibility`
    if (selectedPremiumVisibility === 'Private') {
      // Remove userProfilePic if Premium visibility is Private
      Object.keys(profileData).forEach(profileKey => {
        profileData[profileKey] = profileData[profileKey].filter(
          item => item !== 'userProfilePic' && item !== 'userProfileVideo',
        );
      });
    }

    if (selectedPrivateVisibility === 'Private') {
      // Remove 'homeMobileNumber', 'mobileNumber', and 'email' if Private visibility is selected
      Object.keys(profileData).forEach(profileKey => {
        profileData[profileKey] = profileData[profileKey].filter(
          item =>
            item !== 'homeMobileNumber' &&
            item !== 'mobileNumber' &&
            item !== 'email',
        );
      });
    }

    // console.log(
    //   ' === selectedPublicVisibility ===> ',
    //   selectedPublicVisibility,
    // );

    // Create the request body dynamically
    const requestBody = {
      privacySetting: mappedProfile,
      privacySettingCustom: {
        profilePhotoPrivacy: formattedVisibilitys,
        photoGallery: formattedPhotoGallery,
        contact: formattedContact,
        [mappedProfile]: profileData[mappedProfile], // Only include the selected profile's data
      },
    };

    try {
      // Uncomment below to call the API
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/user/update-user',
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(requestBody),
        },
      );

      if (!response.ok) {
        throw new Error('Error updating user information');
      }

      console.log(' === response__ ===> ', response);
      const data = await response.json();
      console.log('API response:', data);

      apiDispatch(updateDetails());
      setLoading(false);

      // console.log(' === requestBody ===> ', requestBody);
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  const profiles = [
    {
      title: 'Public Profile',
      description: 'Visible to all members. Contact will be hidden',
    },
    {
      title: 'Premium Members Only',
      description:
        'Name, photos, contact, and address are hidden \nfrom unregistered members.',
    },
    {title: 'Private Profile', description: 'Visible on accepted.'},
  ];

  const visibilityPublicOptions = [
    {value: 'Public', label: 'Anyone can view it'},
    {value: 'Blur Profile Picture', label: 'Private'},
    {
      value: 'Visible to Premium Members Only',
      label: 'Visible to Premium Members Only',
    },
    {value: 'No Photo', label: 'No Photo'},
  ];

  const visibilityPremiumOptions = [
    {value: 'Public', label: 'Anyone can view it'},
    {
      value: 'Visible to Premium Members Only',
      label: 'Visible to Premium Members Only',
    },
    {value: 'Private', label: 'Private'},
  ];

  const visibilityPrivateOptions = [
    'Private',
    'Visible to Premium Members Only',
  ];
  const navigation = useNavigation();

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
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
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.profileImageStyle}
            />
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View style={style.headingTittleContainer}>
          <Text style={style.headingCredentialsText}>Privacy setting</Text>
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
        <View style={style.bodyContainer}>
          <Text style={style.bodyTittle}>Select Profile Privacy Option</Text>

          {profiles.map((profile, index) => {
            const isSelected = selectedProfile === profile.title;
            const isDefault = profile.title === 'Public Profile';

            return (
              <TouchableOpacity
                activeOpacity={0.6}
                key={index}
                onPress={() => setSelectedProfile(profile.title)}
                style={{
                  borderRadius: 14,
                  marginTop: index !== 0 ? hp(10) : 10,
                  height: hp(101),
                }}>
                {isSelected ? (
                  <LinearGradient
                    colors={['#8225AF', '#0F52BA']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1.1}}
                    style={style.gradientContainer}>
                    <View style={style.profileTittleStyle}>
                      <Text style={style.profileText}>{profile.title}</Text>

                      {isDefault && (
                        <View style={style.defaultContainer}>
                          <Text style={style.defaultText}>Default</Text>
                        </View>
                      )}
                    </View>
                    <Text style={style.descriptionText}>
                      {profile.description}
                    </Text>

                    <Image
                      source={require('../../assets/icons/white_tran_check_box.png')}
                      style={style.checkIcon}
                    />
                  </LinearGradient>
                ) : (
                  <View style={style.secondProfileTittle}>
                    <Text style={style.secondProfileTittleText}>
                      {profile.title}
                    </Text>

                    <Text style={style.secondDescriptionText}>
                      {profile.description}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={style.moreSettingContainer}>
          <Text style={style.moreSettingText}>
            More Setting for
            <Text style={{color: colors.black}}> {selectedProfile}</Text>
          </Text>
        </View>

        <View style={style.horizontalLine} />

        <View style={style.thirdContainer}>
          <Text style={style.bodyTittleText}>Profile Photo</Text>

          <TouchableHighlight
            activeOpacity={0.3}
            style={style.dataTouchableContainer}
            underlayColor="#F9FBFF"
            onPress={() => {
              bottomSheetRef.current.open();
            }}>
            <View style={style.dataTouchableBody}>
              <View style={style.dataTouchableBodyContainer}>
                <Text style={style.selectedDataText}>
                  {selectedPublicVisibility}
                </Text>

                {selectedPublicVisibility === 'Public' && (
                  <View style={style.anyOneContainer}>
                    <Text style={style.anyOneText}>Anyone can view it</Text>
                  </View>
                )}
              </View>

              <Image source={icons.rightSideIcon} style={style.rightSideIcon} />
            </View>
          </TouchableHighlight>
        </View>

        {/* Bottom Sheet */}
        <RBSheet
          ref={bottomSheetRef}
          height={hp(250)}
          openDuration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}>
          <Text style={style.bottomSheetTittle}>Profile Photo Privacy</Text>

          <View style={style.bottomSheetHorizontalLine} />

          <View style={style.bottomSheetBodyContainer}>
            {visibilityPublicOptions
              .filter(option => {
                return !(
                  (selectedProfile === 'Public Profile' &&
                    option.value === 'Visible to Premium Members Only') ||
                  (selectedProfile === 'Premium Members Only' &&
                    option.value === 'Public') ||
                  (selectedProfile === 'Private Profile' &&
                    option.value === 'Visible to Premium Members Only')
                );
              })
              .map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedPublicVisibility(option.value);
                    bottomSheetRef.current.close();
                  }}
                  style={style.bottomSheetValueContainer}>
                  <View style={style.bottomSheetValueBody}>
                    <Text style={style.bottomSheetValueText}>
                      {option.value}
                    </Text>
                  </View>

                  {option.value === 'Public' && (
                    <View style={style.bottomSheetLabelContainer}>
                      <Text style={style.bottomSheetLabelText}>
                        {option.label}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
          </View>
        </RBSheet>

        <View style={style.horizontalSecondLine} />

        <View style={style.thirdContainer}>
          <Text style={style.bodyTittleText}>Photo Gallery</Text>

          <TouchableHighlight
            activeOpacity={0.3}
            style={style.dataTouchableContainer}
            underlayColor="#F9FBFF"
            onPress={() => {
              bottomPremiumSheetRef.current.open();
            }}>
            <View style={style.dataTouchableBody}>
              <View style={style.dataTouchableBodyContainer}>
                <Text style={style.selectedDataText}>
                  {selectedPremiumVisibility}
                </Text>

                {selectedPremiumVisibility === 'Public' && (
                  <View style={style.anyOneContainer}>
                    <Text style={style.anyOneText}>Anyone can view it</Text>
                  </View>
                )}
              </View>

              <Image source={icons.rightSideIcon} style={style.rightSideIcon} />
            </View>
          </TouchableHighlight>
        </View>

        {/* Photo Gallery Bottom Sheet */}
        <RBSheet
          ref={bottomPremiumSheetRef}
          height={hp(200)}
          openDuration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}>
          <Text style={style.bottomSheetTittle}>Photo Gallery Privacy</Text>

          <View style={style.bottomSheetHorizontalLine} />

          <View style={style.bottomSheetBodyContainer}>
            {visibilityPremiumOptions
              .filter(option => {
                // Remove options that should be disabled
                return !(
                  (selectedProfile === 'Public Profile' &&
                    option.value === 'Visible to Premium Members Only') ||
                  (selectedProfile === 'Premium Members Only' &&
                    option.value === 'Public') ||
                  (selectedProfile === 'Private Profile' &&
                    option.value === 'Visible to Premium Members Only')
                );
              })
              .map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedPremiumVisibility(option.value);
                    bottomPremiumSheetRef.current.close();
                  }}
                  style={style.bottomSheetValueContainer}>
                  <View style={style.bottomSheetValueBody}>
                    <Text style={style.bottomSheetValueText}>
                      {option.value}
                    </Text>
                  </View>

                  {option.value === 'Public' && (
                    <View style={style.bottomSheetLabelContainer}>
                      <Text style={style.bottomSheetLabelText}>
                        {option.label}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
          </View>
        </RBSheet>

        <View style={style.horizontalLine} />

        <View style={style.thirdContainer}>
          <Text style={style.bodyTittleText}>Contact</Text>

          <TouchableHighlight
            activeOpacity={0.3}
            style={style.dataTouchableContainer}
            underlayColor="#F9FBFF"
            onPress={() => bottomPrivateSheetRef.current.open()}>
            <View style={style.dataTouchableBody}>
              <View style={style.dataTouchableBodyContainer}>
                <Text style={style.selectedDataText}>
                  {selectedPrivateVisibility}
                </Text>

                {selectedPrivateVisibility === 'Public' && (
                  <View style={style.anyOneContainer}>
                    <Text style={style.anyOneText}>Anyone can view it</Text>
                  </View>
                )}
              </View>

              <Image source={icons.rightSideIcon} style={style.rightSideIcon} />
            </View>
          </TouchableHighlight>
        </View>

        {/* Contact Privacy Bottom Sheet */}
        <RBSheet
          ref={bottomPrivateSheetRef}
          height={hp(180)}
          openDuration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}>
          <Text style={style.bottomSheetTittle}>Contact Privacy</Text>

          <View style={style.bottomSheetHorizontalLine} />

          <View style={style.bottomSheetBodyContainer}>
            {visibilityPrivateOptions
              .filter(option => {
                // Remove options that should be disabled
                return !(
                  (selectedProfile === 'Public Profile' &&
                    option === 'Visible to Premium Members Only') ||
                  (selectedProfile === 'Premium Members Only' &&
                    option === 'Public') ||
                  (selectedProfile === 'Private Profile' &&
                    option === 'Visible to Premium Members Only')
                );
              })
              .map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSelectedPrivateVisibility(option);
                    bottomPrivateSheetRef.current.close();
                  }}
                  style={style.bottomSheetValueContainer}>
                  <Text style={style.bottomSheetValueText}>{option}</Text>
                </TouchableOpacity>
              ))}
          </View>
        </RBSheet>

        <View style={style.horizontalLine} />

        <TouchableOpacity
          activeOpacity={0.7}
          style={style.saveButtonContainer}
          onPress={onSavePress}>
          <LinearGradient
            colors={['#0D4EB3', '#9413D0']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0.5}}
            style={style.saveButtonBody}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.white} />
            ) : (
              <Text style={style.saveButtonText}>Save Changes</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={{height: hp(30)}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacyScreen;
