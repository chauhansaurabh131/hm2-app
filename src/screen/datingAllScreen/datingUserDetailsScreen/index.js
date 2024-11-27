import React, {useRef} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePaginationComponent from '../../../components/imagePaginationComponent';
import {useSelector} from 'react-redux';
import {colors} from '../../../utils/colors';
import {icons, images} from '../../../assets';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import NewProfileBottomSheet from '../../../components/newProfileBottomSheet';
import {style} from './style';

const DatingUserDetailsScreen = ({route}) => {
  const {userData} = route.params;
  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;

  console.log(' === userData ===> ', userData?.hobbies);

  const imageUrls = userData?.userProfilePic?.map(image => image.url) || [];

  const topModalBottomSheetRef = useRef(null);
  const openTopBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const formatDate = dateString => {
    if (!dateString) {
      return 'N/A';
    } // Handle missing date

    const date = new Date(dateString);
    const day = date.getDate(); // Get the day
    const month = date.toLocaleString('default', {month: 'long'}); // Get the full month name
    const year = date.getFullYear(); // Get the year

    return `${day} ${month} ${year}`;
  };

  const calculateAge = dob => {
    const birthDate = new Date(dob);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    // Adjust age if the birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
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

  const firstName = capitalizeFirstLetter(userData?.firstName);
  const lastName = capitalizeFirstLetter(userData?.lastName);
  const age = userData?.dateOfBirth
    ? calculateAge(userData.dateOfBirth)
    : 'N/A';
  const Occupation = capitalizeFirstLetter(
    userData?.userProfessional?.jobTitle,
  );
  const workCity = capitalizeFirstLetter(userData?.userProfessional?.workCity);
  const workCountry = capitalizeFirstLetter(
    userData?.userProfessional?.workCountry,
  );
  const writeBoutYourSelf = userData?.writeBoutYourSelf;
  const formattedDate = formatDate(userData?.dateOfBirth);
  const CurrentlyLiving = capitalizeFirstLetter(
    userData?.datingData[0]?.CurrentlyLiving,
  );
  const Ethnicity = capitalizeFirstLetter(userData?.datingData[0]?.Ethnicity);
  const religion = capitalizeFirstLetter(userData?.religion);
  const languages =
    userData?.motherTongue?.split(',').map(lang => lang.trim()) || [];

  const educationLevel = capitalizeFirstLetter(
    userData?.datingData[0]?.educationLevel,
  );
  const Occupations = capitalizeFirstLetter(
    userData?.datingData[0]?.Occupation,
  );

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <Image source={images.happyMilanColorLogo} style={style.appLogo} />

        {/*<TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>*/}
        <TouchableOpacity activeOpacity={0.7} onPress={openTopBottomSheet}>
          <Image
            source={userImage ? {uri: userImage} : images.empty_male_Image}
            style={style.profileIcon}
          />
        </TouchableOpacity>
      </View>
      <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

      <ScrollView>
        <ImagePaginationComponent imageUrls={imageUrls} />

        <View>
          <View style={style.bodyImageContainer}>
            <View style={style.imageBodyContainer}>
              <View style={style.onlineBody}>
                <Text style={style.onlineText}>Online</Text>
              </View>

              <View style={style.imageTittleContainer}>
                <Text style={style.imageTittleText}>
                  {firstName} {lastName},
                </Text>

                <Text style={style.imageTittleText}> {age}</Text>
              </View>

              <View style={style.imageSubTittleContainer}>
                <Text style={style.imageSubTittleText}>{Occupation}</Text>

                <View style={style.verticalLine} />

                <Text style={style.imageSubTittleText}>{workCity},</Text>
                <Text style={style.imageSubTittleText}> {workCountry}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={style.iconsContainer}>
          <View style={style.iconsBodyContainer}>
            <TouchableOpacity style={style.imagesContainer}>
              <Image
                source={icons.date_Dislike_icon}
                style={style.disLikeIcon}
              />
            </TouchableOpacity>

            <TouchableOpacity style={style.imagesContainer}>
              <Image source={icons.date_cancel_icon} style={style.cancelIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={style.imagesContainer}>
              <Image source={icons.date_like_icon} style={style.likeIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={style.imagesContainer}>
              <Image source={icons.date_send_icon} style={style.sendIcon} />
            </TouchableOpacity>

            <TouchableOpacity style={style.threeDotContainer}>
              <Image
                source={icons.three_dots_icon}
                style={style.threeDotIcon}
              />
            </TouchableOpacity>
          </View>

          <Text style={style.descriptionText}>{writeBoutYourSelf}</Text>
        </View>
        <View style={style.verticalBreakLine} />

        <View style={style.purposeContainer}>
          <Text style={style.purposeText}>Purpose</Text>

          <View style={style.purposeSubTittleContainer}>
            {userData?.datingData[0]?.interestedIn?.map((purpose, index) => (
              <View key={index} style={style.purposeSubTittleBody}>
                <Text style={style.purposeSubTittleText}>
                  {capitalizeFirstLetter(purpose.replace('-', ' '))}{' '}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={style.verticalBreakLine} />

        <View style={style.baseInfoContainer}>
          <Text style={style.purposeText}>Basic Info</Text>

          <View style={style.baseInfoMargin}>
            <Text style={style.baseInfoTittle}>Date of Birth</Text>
            <Text style={style.baseInfoSubTittle}>{formattedDate}</Text>
          </View>

          <View style={style.baseInfoMargin}>
            <Text style={style.baseInfoTittle}>Currently Living</Text>
            <Text style={style.baseInfoSubTittle}>{CurrentlyLiving}</Text>
          </View>

          <View style={style.baseInfoMargin}>
            <Text style={style.baseInfoTittle}>Religion</Text>
            <Text style={style.baseInfoSubTittle}>{religion}</Text>
          </View>

          <View style={style.baseInfoMargin}>
            <Text style={style.baseInfoTittle}>Ethnicity</Text>
            <Text style={style.baseInfoSubTittle}>{Ethnicity}</Text>
          </View>

          <View style={style.baseInfoMargin}>
            <Text style={style.baseInfoTittle}>Language Spoken</Text>
            <View style={style.languageContainer}>
              {languages.map((language, index) => (
                <View key={index} style={style.languageContainerBody}>
                  <Text style={style.languageText}>
                    {language.charAt(0).toUpperCase() + language.slice(1)}{' '}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={style.verticalBreakLine} />

        <View style={style.baseInfoContainer}>
          <Text style={style.purposeText}>Professional Details</Text>

          <View style={style.baseInfoMargin}>
            <Text style={style.baseInfoTittle}>Education Level</Text>
            <Text style={style.baseInfoSubTittle}>{educationLevel}</Text>
          </View>

          <View style={style.baseInfoMargin}>
            <Text style={style.baseInfoTittle}>Occupation</Text>
            <Text style={style.baseInfoSubTittle}>{Occupations}</Text>
          </View>
        </View>

        <View style={[style.verticalBreakLine, {marginTop: hp(20)}]} />

        <View style={style.baseInfoContainer}>
          <Text style={style.purposeText}>Hobbies & Interest</Text>

          <View style={style.purposeSubTittleContainer}>
            {userData?.hobbies?.map((purpose, index) => (
              <View key={index} style={style.purposeSubTittleBody}>
                <Text style={style.purposeSubTittleText}>
                  {capitalizeFirstLetter(purpose.replace('-', ' '))}{' '}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{height: hp(30)}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DatingUserDetailsScreen;
