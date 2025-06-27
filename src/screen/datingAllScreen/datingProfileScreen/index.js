import React, {useEffect, useRef, useState} from 'react';
import {
  Clipboard,
  Image,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {icons, images} from '../../../assets';
import {useSelector} from 'react-redux';
import ImagePaginationComponent from '../../../components/imagePaginationComponent';
import {style} from './style';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import NewProfileBottomSheet from '../../../components/newProfileBottomSheet';
import ProfileAvatar from '../../../components/letterProfileComponent';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-toast-message';

const DatingProfileScreen = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;
  const accessToken = user?.tokens?.access?.token;

  // console.log(' === var ===> ', user?.user?.userUniqueId);

  const [statusCount, setStatusCount] = useState(null);

  const bottomSheetRef = useRef(null);

  useEffect(() => {
    if (accessToken) {
      // API call to fetch status count
      fetch('https://stag.mntech.website/api/v1/user/user/getStatusCount', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setStatusCount(data);
        })
        .catch(err => {
          console.log(' === err ===> ', err);
        });
    }
  }, [accessToken]); // Only call API when accessToken changes

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const CopyId = () => {
    Toast.show({
      type: 'Copied',
      text1: 'Your ID has been copied!',
      visibilityTime: 1000,
    });
  };

  const onCopyIdPress = async () => {
    await Clipboard.setString(user?.user?.userUniqueId);
    bottomSheetRef.current.close();
    CopyId();
  };

  const handleShare = async () => {
    bottomSheetRef.current.close();

    try {
      await new Promise(resolve => setTimeout(resolve, 50));

      const result = await Share.share({
        // message: 'Happy Milan App', // Message to share
        message: user?.user?.firstName, // Message to share
        // title: selectedFirstName,
      });

      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  const calculateAge = dateOfBirth => {
    const dob = new Date(dateOfBirth); // Parse the date of birth string into a Date object
    const diffMs = Date.now() - dob.getTime(); // Get the difference in milliseconds
    const ageDate = new Date(diffMs); // Convert the difference into a date object
    return Math.abs(ageDate.getUTCFullYear() - 1970); // Subtract 1970 to get the age in years
  };

  // Function to format date in "30 August 2001" format
  const formatDate = dateString => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', {month: 'long'}); // Get full month name
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const imageUrls =
    user?.user?.userProfilePic.map(pic => pic.url) || user?.user?.profilePic;

  const name = user?.user?.name;

  const fullName = `${user?.user?.firstName || ''} ${
    user?.user?.lastName || ''
  }`.trim();

  const age = calculateAge(user?.user?.dateOfBirth);

  const Occupation = user?.user?.datingData[0]?.Occupation;

  const currentlyLiving = user?.user?.datingData[0]?.CurrentlyLiving;

  const currentlyEthnicityLiving = user?.user?.datingData[0]?.Ethnicity;

  const writeBoutYourSelf = user?.user?.writeBoutYourSelf;

  const interestedIn = user?.user?.datingData?.[0]?.interestedIn || [];

  // console.log(' === interestedIn ===> ', interestedIn);

  const birthDate = user?.user?.dateOfBirth
    ? formatDate(user.user.dateOfBirth)
    : '';

  const motherTongue = user?.user?.motherTongue?.split(', ') || [];

  const religion = user?.user?.religion;

  const ethnicity = user?.user?.datingData[0]?.Ethnicity;

  const hobbies = user?.user?.hobbies || [];
  const educationLevel = user?.user?.datingData[0]?.educationLevel;
  const annualIncome = user?.user?.datingData[0]?.annualIncome;

  console.log(' === imageCount ===> ', user?.user?.userProfilePic);

  // const imageCount = Array.isArray(user?.user?.userProfilePic)
  //   ? user?.user?.userProfilePic.length
  //   : 0;

  const imageList = Array.isArray(user?.user?.userProfilePic)
    ? user.user.userProfilePic.filter(img => !img.isDeleted)
    : [];

  const uniqueUrls = new Set(imageList.map(img => img.url));
  const imageCount = uniqueUrls.size;

  const hasValidImage =
    user?.user?.profilePic &&
    user?.user?.profilePic !== 'null' &&
    user?.user?.profilePic.trim() !== '';

  const profileImage = user?.user?.profilePic;

  const toastConfigs = {
    Copied: ({text1}) => (
      <View
        style={{
          backgroundColor: '#333333', // Toast background color
          borderRadius: 100,
          marginHorizontal: 20,
          width: wp(300),
          height: hp(55),
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white', // Toast text color
            fontSize: fontSize(16),
            textAlign: 'center',
            lineHeight: hp(24),
            fontFamily: fontFamily.poppins400,
          }}>
          {text1}
        </Text>
      </View>
    ),
  };

  return (
    <SafeAreaView style={style.container}>
      <View
        style={{
          flex: 1,
          zIndex: 99,
          position: 'absolute',
          alignSelf: 'center',
          top: -10,
        }}>
        <Toast config={toastConfigs} />
      </View>

      <View style={style.headingTittleContainer}>
        <AppColorLogo />

        <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>
          {hasValidImage ? (
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

      <View>
        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />
      </View>

      {/*<TouchableOpacity*/}
      {/*  onPress={() => {*/}
      {/*    navigation.navigate('DatingEditProfileScreen');*/}
      {/*  }}*/}
      {/*  activeOpacity={0.7}*/}
      {/*  style={{*/}
      {/*    // backgroundColor: 'red',*/}
      {/*    position: 'absolute',*/}
      {/*    zIndex: 99,*/}
      {/*    right: 17,*/}
      {/*    bottom: 15,*/}
      {/*  }}>*/}
      {/*  <Image source={icons.edit_gradient_icon} style={style.editButton} />*/}
      {/*</TouchableOpacity>*/}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.bodyContainer}>
          {/*<ImagePaginationComponent imageUrls={imageUrls} />*/}

          {hasValidImage ? (
            <Image
              source={{uri: profileImage}}
              style={{width: '100%', height: hp(449), resizeMode: 'cover'}}
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

          <View style={style.imageTextContainer}>
            <Text style={style.imageNameText}>
              {fullName || name} , {age}
            </Text>

            <Text style={{color: colors.white}}>
              {Occupation} | {currentlyEthnicityLiving}, {currentlyLiving}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                marginTop: hp(20),
                justifyContent: 'space-between',
                // backgroundColor: 'red',
                flex: 1,
                width: '100%',
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  width: hp(60),
                  height: hp(30),
                  backgroundColor: '#282727',
                  borderRadius: 15,
                  justifyContent: 'center',
                  // alignSelf: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  // marginTop: hp(20),
                }}
                onPress={() => {
                  navigation.navigate('UserProfileUploadImageFullScreen');
                }}>
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
                  {statusCount?.totalLikes || '0'}
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
                  {statusCount?.totalRequestsSent || '0'}
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
                  {statusCount?.totalAcceptedRequests || '0'}
                </Text>
                <Text style={style.subTittleTextStyle}>Received</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={style.horizontalLine} />

        <Text style={style.writeBoutYourSelfText}>{writeBoutYourSelf}</Text>
        {/*</View>*/}

        <View style={style.backGroundSpace} />

        <View style={style.purposeContainer}>
          <View style={style.purposeContainerStyle}>
            <Text style={style.purposeTextStyle}>Purpose</Text>
          </View>

          {/*<View style={style.interestContainer}>*/}
          {/*  {interestedIn.length > 0 ? (*/}
          {/*    interestedIn.map((interest, index) => (*/}
          {/*      <View key={index} style={style.interestBody}>*/}
          {/*        <Text style={style.interestText}>{interest}</Text>*/}
          {/*      </View>*/}
          {/*    ))*/}
          {/*  ) : (*/}
          {/*    <Text style={style.interestText}>No interests available</Text>*/}
          {/*  )}*/}
          {/*</View>*/}

          <View style={style.interestContainer}>
            {interestedIn.length > 0 ? (
              interestedIn.map((interest, index) => {
                const formattedInterest = interest
                  .split('-') // Split by hyphen
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
                  .join(' '); // Join back with space

                return (
                  <View key={index} style={style.interestBody}>
                    <Text style={style.interestText}>{formattedInterest}</Text>
                  </View>
                );
              })
            ) : (
              <Text style={style.interestText}>No interests available</Text>
            )}
          </View>
        </View>

        <View style={[style.backGroundSpace, {marginTop: 10}]} />

        <View style={style.purposeContainer}>
          <Text style={style.basicInfoText}>Basic Info</Text>

          <Text style={style.subTittleText}>Date of Birth</Text>
          <Text style={style.TittleText}>{birthDate || 'N/A'}</Text>

          <Text style={style.subTittleText}>Currently Living</Text>
          <Text style={style.TittleText}>{currentlyLiving || 'N/A'}</Text>

          <Text style={style.subTittleText}>Language Spoken</Text>

          <View style={[style.interestContainer, {marginTop: hp(10)}]}>
            {motherTongue.length > 0 ? (
              motherTongue.map((language, index) => (
                <View key={index} style={style.interestBody}>
                  <Text style={style.interestText}>
                    {capitalizeFirstLetter(language)}
                  </Text>
                </View>
              ))
            ) : (
              <Text>No mother tongue available</Text>
            )}
          </View>

          <Text style={style.subTittleText}>Religion</Text>
          <Text style={style.TittleText}>{religion || 'N/A'}</Text>

          <Text style={style.subTittleText}>Ethnicity</Text>
          <Text style={style.TittleText}>{ethnicity || 'N/A'}</Text>
        </View>

        <View style={[style.backGroundSpace, {marginTop: 10}]} />

        <View style={style.purposeContainer}>
          <Text style={style.basicInfoText}>Professional Details</Text>

          <Text style={style.subTittleText}>Education Level</Text>
          <Text style={style.TittleText}>{educationLevel || 'N/A'}</Text>

          <Text style={style.subTittleText}>Occupation</Text>
          <Text style={style.TittleText}>{Occupation || 'N/A'}</Text>

          <Text style={style.subTittleText}>Annual Income</Text>
          <Text style={style.TittleText}>{annualIncome || 'N/A'}</Text>
        </View>

        <View style={[style.backGroundSpace, {marginTop: 20}]} />

        <View style={style.purposeContainer}>
          <Text style={style.basicInfoText}>Hobbies & Interest</Text>

          <View style={[style.interestContainer, {marginTop: hp(10)}]}>
            {hobbies.length > 0 ? (
              hobbies.map((hobby, index) => (
                <View key={index} style={style.interestBody}>
                  <Text style={style.interestText}>
                    {capitalizeFirstLetter(hobby)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{color: 'black'}}>
                No Hobby & Interest available
              </Text>
            )}
          </View>
          <View style={{height: hp(50)}} />
        </View>
      </ScrollView>

      {/* Bottom Sheet */}
      <RBSheet
        ref={bottomSheetRef}
        height={hp(210)}
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
            // onPress={() => bottomSheetRef.current.close()}
            onPress={handleShare}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={icons.share_icon}
              style={{
                width: hp(17),
                height: hp(17),
                resizeMode: 'contain',
                marginRight: hp(22),
              }}
            />
            <Text
              style={{
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
                color: colors.black,
              }}>
              Share Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            // onPress={() => bottomSheetRef.current.close()}
            onPress={onCopyIdPress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: hp(20),
            }}>
            <Image
              source={icons.copy_id_card_icon}
              style={{
                width: hp(17),
                height: hp(17),
                resizeMode: 'contain',
                marginRight: hp(22),
              }}
            />
            <Text
              style={{
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
                color: colors.black,
              }}>
              Copy ID : {user?.user?.userUniqueId}
            </Text>
          </TouchableOpacity>

          <View
            style={{
              width: '100%',
              height: 1,
              backgroundColor: '#EBEBEB',
              marginTop: hp(22),
            }}
          />

          <TouchableOpacity
            onPress={() => {
              bottomSheetRef.current.close();
              navigation.navigate('DatingEditProfileScreen');
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: hp(20),
            }}>
            <Image
              source={icons.view_profile_icon}
              style={{
                width: hp(17),
                height: hp(17),
                resizeMode: 'contain',
                marginRight: hp(22),
                top: -8,
              }}
            />
            <View>
              <Text
                style={{
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  color: colors.black,
                }}>
                Edit Profile
              </Text>

              <Text
                style={{
                  fontSize: fontSize(12),
                  lineHeight: hp(16),
                  fontFamily: fontFamily.poppins400,
                  color: '#7B7B7B',
                }}>
                Update info and preferences for better matches.
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default DatingProfileScreen;
