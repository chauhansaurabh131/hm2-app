import React, {useState} from 'react';
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
import {hp, wp} from '../../utils/helpers';
import StoryComponent from '../../components/storyComponent';
import style from './style';
import UsersProfileDetailsScreen from '../usersProfileDetailsScreen';
import ImagePaginationComponent from '../../components/imagePaginationComponent';
import {useRoute} from '@react-navigation/native';

const UserDetailScreen = ({navigation}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageRotation, setImageRotation] = useState('90deg');

  const route = useRoute();
  const {selectedBox} = route.params ?? {};

  const {userData, matchesUserData} = route.params;

  // console.log(' === userData ===> ', userData);
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
    capitalizeFirstLetter(userData?.friendList?.firstName) &&
    capitalizeFirstLetter(matchesUserData?.firstName);

  const LastName =
    capitalizeFirstLetter(userData?.friendList?.lastName) ||
    capitalizeFirstLetter(matchesUserData?.lastName);

  const dateOfBirth = userData?.friendList?.dateOfBirth;

  const age = calculateAge(dateOfBirth);
  const gender = userData?.friendList?.gender || matchesUserData?.gender;
  const heightInCm = userData?.friendList?.height;
  const heightFormatted = convertHeightToFeetAndInches(heightInCm);
  const motherTongue = userData?.friendList?.motherTongue;
  const cast = userData?.friendList?.cast;
  const jobTitle = userData?.friendList?.userProfessional?.jobTitle;
  const workCity = userData?.friendList?.userProfessional?.workCity;
  const workCountry = userData?.friendList?.userProfessional?.workCountry;
  const aboutMe = userData?.friendList?.writeBoutYourSelf;

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
              <View style={style.onlineBodyStyle}>
                <Text style={style.bodyTextStyle}>Online</Text>
              </View>
              <Text style={style.userNameTextStyle}>
                {Name} {LastName}
              </Text>

              <View style={style.userDetailsDescriptionContainer}>
                <Text style={style.userDetailsTextStyle}>{gender}</Text>
                <Text style={style.userDetailsTextStyle}>
                  {age || matchesUserData.age} ,
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
              </View>
            </View>
          </View>
        </View>

        {/* DESCRIPTION VIEW */}
        <View style={style.descriptionTextContainer}>
          {selectedBox === 'dating' && (
            <>
              <View style={style.likeSharContainer}>
                <TouchableOpacity activeOpacity={0.5}>
                  <Image
                    source={icons.disLike_icon}
                    style={style.dislikeIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5}>
                  <Image source={icons.likeIcon} style={style.likeIcon} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5}>
                  <Image
                    source={icons.star_border_icon}
                    style={style.startIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5}>
                  <Image source={icons.shareIcon} style={style.shareIcon} />
                </TouchableOpacity>
              </View>
            </>
          )}
          <Text style={style.descriptionTittleText}>About Me</Text>

          <Text
            numberOfLines={showFullDescription ? undefined : 4}
            style={style.descriptionBodyText}>
            {/*I'd describe myself as someone who's reliable, trendy, smart and*/}
            {/*someone who always has a smile on the face. I am a big Nature &*/}
            {/*Animal lover. I have lived in different parts of India and*/}
            {/*appreciate all cultures & customs.... I'd describe myself as someone*/}
            {/*who's reliable, trendy, smart and someone who always has a smile on*/}
            {/*the face. I am a big Nature & Animal lover. I have lived in*/}
            {/*different parts of India and appreciate all cultures & customs.*/}
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
