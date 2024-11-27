import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
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

const DatingProfileScreen = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);

  console.log(' === user... ===> ', user?.user?.datingData[0]?.annualIncome);

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

  const writeBoutYourSelf = user?.user?.writeBoutYourSelf;

  const interestedIn = user?.user?.datingData?.[0]?.interestedIn || [];

  const birthDate = user?.user?.dateOfBirth
    ? formatDate(user.user.dateOfBirth)
    : '';

  const motherTongue = user?.user?.motherTongue?.split(', ') || [];

  const religion = user?.user?.religion;

  const ethnicity = user?.user?.datingData[0]?.Ethnicity;

  const hobbies = user?.user?.hobbies || [];
  const educationLevel = user?.user?.datingData[0]?.educationLevel;
  const annualIncome = user?.user?.datingData[0]?.annualIncome;

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headingTittleContainer}>
        <AppColorLogo />
        <TouchableOpacity activeOpacity={0.7}>
          <Image
            source={images.profileDisplayImage}
            style={style.profileLogoStyle}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() => {
          navigation.navigate('DatingEditProfileScreen');
        }}
        activeOpacity={0.7}
        style={{
          // backgroundColor: 'red',
          position: 'absolute',
          zIndex: 99,
          right: 17,
          bottom: 15,
        }}>
        <Image source={icons.edit_gradient_icon} style={style.editButton} />
      </TouchableOpacity>

      <ScrollView>
        <View style={style.bodyContainer}>
          <ImagePaginationComponent imageUrls={imageUrls} />
          <View style={style.imageTextContainer}>
            <Text style={style.imageNameText}>
              {fullName || name} , {age}
            </Text>

            <Text style={{color: colors.white}}>
              {Occupation} | {currentlyLiving}
            </Text>
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
                <Text style={style.TittleTextStyle}>1200</Text>
                <Text style={style.subTittleTextStyle}>Likes</Text>
              </View>
            </View>

            <View style={style.profileLikeDislikeSeparateContainer}>
              <Image
                source={icons.light_arrow_icon}
                style={style.upArrowIcon}
              />
              <View>
                <Text style={style.TittleTextStyle}>50</Text>
                <Text style={style.subTittleTextStyle}>Sent</Text>
              </View>
            </View>

            <View style={style.profileLikeDislikeSeparateContainer}>
              <Image
                source={icons.light_arrow_icon}
                style={style.downArrowIcon}
              />
              <View>
                <Text style={style.TittleTextStyle}>180</Text>
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

            {/*<TouchableOpacity activeOpacity={0.7}>*/}
            {/*  <Image*/}
            {/*    source={icons.edit_gradient_icon}*/}
            {/*    style={style.editButton}*/}
            {/*  />*/}
            {/*</TouchableOpacity>*/}
          </View>

          <View style={style.interestContainer}>
            {interestedIn.length > 0 ? (
              interestedIn.map((interest, index) => (
                <View key={index} style={style.interestBody}>
                  <Text style={style.interestText}>{interest}</Text>
                </View>
              ))
            ) : (
              <Text style={style.interestText}>No interests available</Text>
            )}
          </View>
        </View>

        <View style={[style.backGroundSpace, {marginTop: 10}]} />

        <View style={style.purposeContainer}>
          <Text style={style.basicInfoText}>Basic Info</Text>

          <Text style={style.subTittleText}>Date of Birth</Text>
          <Text style={style.TittleText}>{birthDate}</Text>

          <Text style={style.subTittleText}>Currently Living</Text>
          <Text style={style.TittleText}>{currentlyLiving || 'N/A'}</Text>

          <Text style={style.subTittleText}>Language Spoken</Text>

          <View style={style.interestContainer}>
            {motherTongue.length > 0 ? (
              motherTongue.map((language, index) => (
                <View key={index} style={style.languageContainer}>
                  <Text style={style.TittleText}>
                    {capitalizeFirstLetter(language)}
                  </Text>
                </View>
              ))
            ) : (
              <Text>No mother tongue available</Text>
            )}
          </View>

          <Text style={style.subTittleText}>Religion</Text>
          <Text style={style.TittleText}>{religion}</Text>

          <Text style={style.subTittleText}>Ethnicity</Text>
          <Text style={style.TittleText}>{ethnicity}</Text>
        </View>

        <View style={[style.backGroundSpace, {marginTop: 10}]} />

        <View style={style.purposeContainer}>
          <Text style={style.basicInfoText}>Professional Details</Text>

          <Text style={style.subTittleText}>Education Level</Text>
          <Text style={style.TittleText}>{educationLevel}</Text>

          <Text style={style.subTittleText}>Occupation</Text>
          <Text style={style.TittleText}>{Occupation}</Text>

          <Text style={style.subTittleText}>Annual Income</Text>
          <Text style={style.TittleText}>{annualIncome}</Text>
        </View>

        <View style={[style.backGroundSpace, {marginTop: 20}]} />

        <View style={style.purposeContainer}>
          <Text style={style.basicInfoText}>Hobbies & Interest</Text>

          <View style={style.interestContainer}>
            {hobbies.length > 0 ? (
              hobbies.map((hobby, index) => (
                <View key={index} style={style.languageContainer}>
                  <Text style={style.TittleText}>
                    {capitalizeFirstLetter(hobby)}
                  </Text>
                </View>
              ))
            ) : (
              <Text>No mother tongue available</Text>
            )}
          </View>
          <View style={{height: hp(50)}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DatingProfileScreen;
