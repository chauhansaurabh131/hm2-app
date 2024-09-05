import React, {useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import StoryComponent from '../../components/storyComponent';
import style from './style';
import UsersProfileDetailsScreen from '../usersProfileDetailsScreen';
import ImagePaginationComponent from '../../components/imagePaginationComponent';
import {useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';

const UserDetailScreen = ({navigation}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageRotation, setImageRotation] = useState('90deg');

  const bottomSheetRef = useRef(null);

  const route = useRoute();
  const {selectedBox} = route.params ?? {};

  const {userData, matchesUserData} = route.params;

  // console.log(' === matchesUserData ===> ', matchesUserData.age);

  const openBottomSheet = () => {
    bottomSheetRef.current.open();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current.close();
  };

  // console.log(
  //   ' === matchesUserData/// ===> ',
  //   matchesUserData?.matchPercentage,
  // );

  // console.log(' === userData...0000 ===> ', userData?.friendList?.height);

  const imageUrls =
    userData?.friendList?.userProfilePic.map(pic => pic.url) ||
    matchesUserData?.userAllImage;

  // const imageUrls = matchesUserData?.userAllImage || [];

  const convertHeightToFeetAndInches = heightInCm => {
    const heightInInches = heightInCm / 2.54;
    const feet = Math.floor(heightInInches / 12);
    const inches = Math.round(heightInInches % 12);
    return `${feet}'${inches}"`;
  };

  const calculateAge = dateOfBirth => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Adjust age if the current date is before the birthday in the current year
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle null or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const Name =
    capitalizeFirstLetter(userData?.friendList?.firstName) ||
    capitalizeFirstLetter(matchesUserData?.firstName);

  const LastName =
    capitalizeFirstLetter(userData?.friendList?.lastName) ||
    capitalizeFirstLetter(matchesUserData?.lastName);

  const dateOfBirth = userData?.friendList?.dateOfBirth;

  const age = calculateAge(dateOfBirth);
  const gender = userData?.friendList?.gender || matchesUserData?.gender;
  const heightInCm = userData?.friendList?.height || matchesUserData?.height;
  const heightFormatted = convertHeightToFeetAndInches(heightInCm);
  const motherTongue = userData?.friendList?.motherTongue;
  const cast = userData?.friendList?.cast;
  const jobTitle = userData?.friendList?.userProfessional?.jobTitle;
  const workCity = userData?.friendList?.userProfessional?.workCity;
  const workCountry = userData?.friendList?.userProfessional?.workCountry;
  const aboutMe = userData?.friendList?.writeBoutYourSelf;
  const matchPercentage = matchesUserData?.matchPercentage;

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
    setImageRotation(showFullDescription ? '90deg' : '-90deg');
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <Image
          source={images.happyMilanColorLogo}
          style={style.customHeaderLogo}
        />

        <TouchableOpacity activeOpacity={0.7}>
          <Image
            source={images.profileDisplayImage}
            style={style.profileLogoStyle}
          />
        </TouchableOpacity>
      </View>
      <View style={style.userStoryContainer}>
        <StoryComponent />
      </View>
      <ScrollView>
        <View>
          {/*<ImagePaginationComponent />*/}

          <ImagePaginationComponent imageUrls={imageUrls} />
          <View style={style.UserDetailsContainer}>
            <View
              style={{
                position: 'absolute',
                bottom: 35,
                width: '100%',
                // backgroundColor: 'rgba(0,0,0,0.09)',
              }}>
              {/*<View style={style.onlineBodyStyle}>*/}
              {/*  <Text style={style.bodyTextStyle}>Online</Text>*/}
              {/*</View>*/}
              <View style={{flexDirection: 'row'}}>
                <Text style={style.userNameTextStyle}>
                  {Name} {LastName}
                </Text>
                <View style={style.onlineBodyStyle} />
              </View>

              <View style={style.userDetailsDescriptionContainer}>
                <Text style={style.userDetailsTextStyle}>{gender}</Text>
                <Text style={style.userDetailsTextStyle}>
                  {/*{age || matchesUserData.age} ,*/}
                </Text>
                <Text style={style.userDetailsTextStyle}>
                  {heightFormatted || matchesUserData?.height}
                </Text>

                <View style={style.verticalLineStyle} />

                <Text style={style.userDetailsTextStyle}>
                  {motherTongue || matchesUserData?.motherTongue}
                </Text>
                <Text style={style.userDetailsTextStyle}>
                  {cast || matchesUserData?.cast}
                </Text>
                {/*<Text style={style.userDetailsTextStyle}>(2.1km)</Text>*/}
              </View>

              <View style={style.userDetailsDescriptionContainer}>
                <Text style={style.userDetailsTextStyle}>
                  {jobTitle || matchesUserData?.JobTittle}
                </Text>

                <View style={style.verticalLineStyle} />

                <Text style={style.userDetailsTextStyle}>
                  {workCity || matchesUserData?.workCity}
                </Text>
                <Text style={style.userDetailsTextStyle}>
                  {workCountry || matchesUserData?.workCountry}
                </Text>
                {/*<Text style={style.userDetailsTextStyle}>States</Text>*/}
              </View>

              <View style={style.bottomImageContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('UserUploadImageFullScreen');
                  }}>
                  <Image source={icons.image_icon} style={style.imageIcon} />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Image source={icons.video_icon} style={style.videoIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={style.startIconContainer}>
                  <Image source={icons.starIcon} style={style.starIcon} />
                </TouchableOpacity>

                <LinearGradient
                  colors={['#0F52BA', '#9413D0']}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 0}}
                  style={style.matchesContainer}>
                  <Text style={style.matchesText}>
                    {matchPercentage}% Match
                  </Text>
                </LinearGradient>

                {/*<Text>{matchPercentage}% Match</Text>*/}
              </View>
            </View>
          </View>
        </View>

        {/* DESCRIPTION VIEW */}
        <View style={style.descriptionTextContainer}>
          {/*{selectedBox === 'dating' && (*/}
          {/*<>*/}
          <View style={style.likeSharContainer}>
            <TouchableOpacity activeOpacity={0.5}>
              <Image source={icons.disLike_icon} style={style.dislikeIcon} />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.5}>
              <Image source={icons.likeIcon} style={style.likeIcon} />
            </TouchableOpacity>

            {/*<TouchableOpacity activeOpacity={0.5}>*/}
            {/*  <Image source={icons.star_border_icon} style={style.startIcon} />*/}
            {/*</TouchableOpacity>*/}

            <TouchableOpacity activeOpacity={0.5}>
              <Image source={icons.not_share_icon} style={style.shareIcon} />
            </TouchableOpacity>
          </View>
          {/*</>*/}
          {/*// )}*/}

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text style={style.descriptionTittleText}>About Me</Text>

            <TouchableOpacity onPress={openBottomSheet}>
              <Image
                source={icons.three_dots_icon}
                style={{width: hp(20), height: hp(20), resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>

          {/*BOTTOM SHEET*/}
          <RBSheet
            ref={bottomSheetRef}
            height={300}
            closeOnPressMask={true} // Allows closing when clicking outside the bottom sheet
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
              },
            }}>
            <View style={{flex: 1, marginTop: hp(15)}}>
              <TouchableOpacity
                onPress={closeBottomSheet}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.share_icon}
                  style={{width: hp(17), height: hp(17), resizeMode: 'contain'}}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                    marginLeft: wp(20),
                  }}>
                  Share Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={closeBottomSheet}
                style={{
                  flexDirection: 'row',
                  // backgroundColor: 'red',
                  alignItems: 'center',
                  marginTop: hp(20),
                }}>
                <Image
                  source={icons.block_icon}
                  style={{width: hp(17), height: hp(17), resizeMode: 'contain'}}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                    marginLeft: wp(20),
                  }}>
                  Block
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={closeBottomSheet}
                style={{
                  flexDirection: 'row',
                  // backgroundColor: 'red',
                  alignItems: 'center',
                  marginTop: hp(20),
                }}>
                <Image
                  source={icons.report_icon}
                  style={{width: hp(17), height: hp(17), resizeMode: 'contain'}}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                    marginLeft: wp(20),
                  }}>
                  Report Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={closeBottomSheet}
                style={{
                  flexDirection: 'row',
                  // backgroundColor: 'red',
                  alignItems: 'center',
                  marginTop: hp(20),
                }}>
                <Image
                  source={icons.copy_icon}
                  style={{width: hp(17), height: hp(17), resizeMode: 'contain'}}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                    marginLeft: wp(20),
                  }}>
                  Copy URL
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={closeBottomSheet}
                style={{
                  flexDirection: 'row',
                  // backgroundColor: 'red',
                  alignItems: 'center',
                  marginTop: hp(20),
                }}>
                <Image
                  source={icons.copy_icon}
                  style={{width: hp(17), height: hp(17), resizeMode: 'contain'}}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                    marginLeft: wp(20),
                  }}>
                  Unfriend
                </Text>
              </TouchableOpacity>

              {/*<TouchableOpacity*/}
              {/*  style={{marginTop: 50, alignItems: 'center'}}*/}
              {/*  onPress={closeBottomSheet} // Close the bottom sheet when pressed*/}
              {/*>*/}
              {/*  <Text style={{color: 'black'}}>Close</Text>*/}
              {/*</TouchableOpacity>*/}
            </View>
          </RBSheet>

          <Text
            numberOfLines={showFullDescription ? undefined : 4}
            style={style.descriptionBodyText}>
            {aboutMe || matchesUserData.about}
          </Text>
          <TouchableOpacity
            onPress={toggleDescription}
            style={{alignItems: 'center'}}>
            <Image
              source={icons.rightSideIcon}
              style={{
                width: 8,
                height: 8,
                tintColor: colors.blue,
                marginTop: hp(20),
                transform: [{rotate: imageRotation}],
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <UsersProfileDetailsScreen userData={userData || matchesUserData} />
          <View style={{height: 50}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserDetailScreen;
