import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import AdminProfileDetailsScreen from '../adminProfileDetailsScreen';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import NewAddStoryScreen from '../newAddStoryScreen';
import {dataCountingList, userDatas} from '../../actions/homeActions';
import ImagePaginationComponent from '../../components/imagePaginationComponent';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors} from '../../utils/colors';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import ProfileAvatar from '../../components/letterProfileComponent';

const MyProfileScreen = () => {
  const {user} = useSelector(state => state.auth);
  const userData = user.user;

  // console.log(' === userData.... ===> ', userData?.writeBoutYourSelf);

  // console.log(' === userData--+++ ===> ', userData);

  const [topModalVisible, setTopModalVisible] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageRotation, setImageRotation] = useState('90deg');
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState('Write about yourself...');
  const displayText = userData?.writeBoutYourSelf || description;
  const [editedDescription, setEditedDescription] = useState(description);

  const bottomSheetRef = useRef(null);

  const navigation = useNavigation();
  const topModalBottomSheetRef = useRef(null);

  const [planDetails, setPlanDetails] = useState('');

  // const imageUrls = userData?.userProfilePic.map(pic => pic.url);

  const profileImage = user?.user?.profilePic;

  const dispatch = useDispatch();

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };
  const {dataCount} = useSelector(state => state.home);
  console.log(' === dataCount ===> ', dataCount);
  const accessToken = user?.tokens?.access?.token;

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!accessToken) {
        console.warn('No access token found');
        return;
      }

      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/user-plan/get-user-planbyId',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          console.log('User Plan:', data);
          setPlanDetails(data?.data);
        } else {
          console.error('API Error:', data);
          Alert.alert('Error', data.message || 'Something went wrong');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        Alert.alert('Network Error', 'Unable to fetch user plan');
      }
    };

    fetchUserPlan();
  }, [accessToken]);

  useEffect(() => {
    // dataCountingList();
    dispatch(dataCountingList());
  }, []);

  useFocusEffect(
    useCallback(() => {
      setTopModalVisible(false);
    }, []),
  );

  const openTopSheetModal = () => {
    toggleModal();
  };

  const toggleModal = () => {
    // console.log(' === toggleModal ===> ', topModalVisible);
    setTopModalVisible(!topModalVisible);
  };

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle null or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  // console.log(' === user?.user____ ===> ', user?.user);

  const firstName = capitalizeFirstLetter(user?.user?.firstName);
  const lastName = capitalizeFirstLetter(user?.user?.lastName);
  const jobTitle = capitalizeFirstLetter(
    user?.user?.userProfessional?.jobTitle,
  );
  const currentCity = capitalizeFirstLetter(user?.user?.address?.currentCity);
  const currentCountry = capitalizeFirstLetter(
    user?.user?.address?.currentCountry,
  );

  const calculateAge = dob => {
    if (!dob) {
      return 'N/A';
    } // Handle missing date of birth
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };
  const age = calculateAge(user?.user?.dateOfBirth);

  // console.log(' === user?.user?.dateOfBirth ===> ', user?.user?.dateOfBirth);
  // console.log(' === age ===> ', age);

  const height = user.user?.height;

  // const imageCount = Array.isArray(user?.user?.userProfilePic)
  //   ? user?.user?.userProfilePic.length
  //   : 0;

  const imageList = Array.isArray(user?.user?.userProfilePic)
    ? user.user.userProfilePic.filter(img => !img.isDeleted)
    : [];

  const uniqueUrls = new Set(imageList.map(img => img.url));
  const imageCount = uniqueUrls.size;

  const getBackgroundColor = () => {
    const planName = planDetails?.planId?.planName?.toLowerCase();
    if (planName === 'silver') {
      return 'gray';
    }
    if (planName === 'gold') {
      return 'orange';
    }
    return '#f0f0f0'; // default
  };

  // const userAllImage = Array.isArray(user?.user?.userProfilePic)
  //   ? user?.user?.userProfilePic.map(pic => pic.url)
  //   : [];

  const userAllImageShare = () => {
    // const allImages = {
    //   userAllImage,
    // };
    // console.log(' === userAllImage ===> ', userAllImage);
    // navigation.navigate('UserProfileUploadImageFullScreen', {allImages});
    navigation.navigate('UserProfileUploadImageFullScreen');
  };

  // console.log(' === user.user.age ===> ', user?.user?.userProfilePic);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
    setImageRotation(showFullDescription ? '90deg' : '-90deg');
  };

  const handleEditDescription = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSaveDescription = () => {
    setDescription(editedDescription);
    setIsEditing(false);
  };
  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <Image
          source={images.happyMilanColorLogo}
          style={style.customHeaderLogo}
        />

        {/*<TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>*/}
        <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>
          {profileImage ? (
            <Image
              source={{uri: profileImage}}
              style={style.profileLogoStyle}
            />
          ) : (
            <ProfileAvatar
              firstName={user?.user?.firstName}
              lastName={user?.user?.lastName}
              textStyle={style.profileLogoStyle}
              profileTexts={{fontSize: fontSize(10)}}
            />
          )}

          {/* <Image
            source={
              profileImage ? {uri: profileImage} : images.empty_male_Image
            }
            style={style.profileLogoStyle}
          />*/}
        </TouchableOpacity>
      </View>

      <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

      <View style={style.userStoryContainer}>
        <NewAddStoryScreen />
      </View>

      {/*TOP SHEET*/}
      <HomeTopSheetComponent
        isVisible={topModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {profileImage ? (
            <Image
              source={{uri: profileImage}}
              style={style.userProfileImage}
            />
          ) : (
            <ProfileAvatar
              firstName={user?.user?.firstName}
              lastName={user?.user?.lastName}
              textStyle={{
                width: '100%',
                height: hp(449),
                resizeMode: 'cover',
                borderRadius: 0,
              }}
              profileTexts={{fontSize: fontSize(60)}}
            />
          )}
          {/*<Image*/}
          {/*  source={*/}
          {/*    profileImage ? {uri: profileImage} : images.empty_male_Image*/}
          {/*  }*/}
          {/*  style={style.userProfileImage}*/}
          {/*/>*/}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 150,
            }}
          />

          <View style={style.UserDetailsContainer}>
            <View
              style={{
                position: 'absolute',
                bottom: -1,
                width: '100%',
                height: 130,
              }}>
              <View style={{marginLeft: wp(18.16)}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={style.userNameTextStyle}>
                    {firstName} {lastName}
                  </Text>

                  {planDetails?.planId?.planName && (
                    <View
                      style={{
                        backgroundColor: getBackgroundColor(),
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 2, // internal padding
                        borderRadius: 50,
                        alignSelf: 'flex-start', // ensures the box only takes needed width
                        paddingHorizontal: 10,
                        marginLeft: wp(7),
                      }}>
                      <Image
                        source={icons.crownIcon}
                        style={{
                          width: hp(10),
                          height: hp(10),
                          marginRight: 5,
                          tintColor: 'white',
                        }}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          fontSize: fontSize(12),
                          color: 'white',
                          fontFamily: fontFamily.poppins400,
                          top: 2,
                        }}>
                        {planDetails?.planId?.planName
                          ? planDetails.planId.planName
                              .charAt(0)
                              .toUpperCase() +
                            planDetails.planId.planName.slice(1).toLowerCase()
                          : 'Plan Name'}
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={[
                    style.userDetailsDescriptionContainer,
                    {marginTop: 5},
                  ]}>
                  <Text style={style.userDetailsTextStyle}>{age} yrs,</Text>
                  <Text style={style.userDetailsTextStyle}>{height}</Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>{jobTitle}</Text>
                </View>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>
                    {currentCity},{' '}
                  </Text>

                  <Text style={style.userDetailsTextStyle}>
                    {currentCountry}
                  </Text>
                </View>

                <View style={style.bottomImageContainer}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    style={{
                      width: hp(60),
                      height: hp(30),
                      backgroundColor: '#282727',
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignSelf: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}
                    onPress={userAllImageShare}>
                    <Image
                      source={icons.new_camera_icon}
                      style={{
                        width: hp(15),
                        height: hp(14),
                        resizeMode: 'contain',
                        marginRight: wp(11),
                      }}
                    />
                    <Text style={{color: 'white'}}>{imageCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => bottomSheetRef.current.open()}
                    activeOpacity={0.5}
                    style={{
                      width: hp(30),
                      height: hp(30),
                      borderRadius: 50,
                      backgroundColor: '#282727',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: hp(19),
                    }}>
                    <Image
                      source={icons.new_three_dot}
                      style={{width: hp(4), height: hp(14)}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Sheet */}
        <RBSheet
          ref={bottomSheetRef}
          height={130}
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
          <View style={{marginHorizontal: 17, marginTop: 30}}>
            <TouchableOpacity
              onPress={() => bottomSheetRef.current.close()}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={icons.share_icon}
                style={{
                  width: hp(16),
                  height: hp(16),
                  resizeMode: 'contain',
                  marginRight: hp(15),
                }}
              />
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Share Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => bottomSheetRef.current.close()}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Image
                source={icons.copy_icon}
                style={{
                  width: hp(16),
                  height: hp(16),
                  resizeMode: 'contain',
                  marginRight: hp(15),
                }}
              />
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Copy URL
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>

        {/*HEADER TO LIKE DISLIKE*/}
        <View style={style.profileLikeDislikeContainer}>
          <View style={style.profileLikeDislikeContainerBody}>
            <View style={style.profileLikeDislikeSeparateContainer}>
              <Image
                source={icons.heart_like_icon}
                style={style.likeProfileIcon}
              />
              <View>
                <Text style={style.TittleTextStyle}>
                  {dataCount?.totalLikes}
                </Text>
                <Text style={style.subTittleTextStyle}>Likes</Text>
              </View>
            </View>

            <View style={style.profileLikeDislikeSeparateContainer}>
              <Image
                source={icons.light_arrow_icon}
                style={style.upArrowIcon}
              />
              <View>
                <Text style={style.TittleTextStyle}>
                  {dataCount?.totalRequestsSent}
                </Text>
                <Text style={style.subTittleTextStyle}>Sent</Text>
              </View>
            </View>

            <View style={style.profileLikeDislikeSeparateContainer}>
              <Image
                source={icons.light_arrow_icon}
                style={style.downArrowIcon}
              />
              <View>
                <Text style={style.TittleTextStyle}>
                  {dataCount?.totalRequestsReceived}
                </Text>
                <Text style={style.subTittleTextStyle}>Received</Text>
              </View>
            </View>
          </View>
        </View>

        {/*<View style={style.underLineStyle} />*/}

        <View
          style={{
            width: '100%',
            height: 4,
            backgroundColor: '#F8F8F8',
            marginTop: 15,
          }}
        />

        <View style={style.bodyContainer}>
          <Text style={style.TittleTextStyle}>About Me</Text>

          {isEditing ? (
            <TextInput
              multiline
              style={style.descriptionBodyText}
              value={editedDescription}
              onChangeText={setEditedDescription}
            />
          ) : (
            <Text
              numberOfLines={showFullDescription ? undefined : 4}
              style={style.descriptionBodyText}>
              {displayText}
            </Text>
          )}

          <TouchableOpacity
            onPress={toggleDescription}
            style={style.toggleButtonStyle}>
            <Image
              source={icons.rightSideIcon}
              style={[
                style.toggleImageStyle,
                {transform: [{rotate: imageRotation}]},
              ]}
            />
          </TouchableOpacity>

          {/*<AdminProfileDetailsScreen*/}
          {/*  onEditButtonPress={handleEditDescription}*/}
          {/*  userData={userData}*/}
          {/*/>*/}

          {isEditing && (
            <TouchableOpacity onPress={handleSaveDescription}>
              <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
                Save
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <AdminProfileDetailsScreen
          onEditButtonPress={handleEditDescription}
          userData={userData}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileScreen;
