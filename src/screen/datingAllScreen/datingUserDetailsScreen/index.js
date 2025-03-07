import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ImagePaginationComponent from '../../../components/imagePaginationComponent';
import {useSelector} from 'react-redux';
import {colors} from '../../../utils/colors';
import {icons, images} from '../../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../../utils/helpers';
import NewProfileBottomSheet from '../../../components/newProfileBottomSheet';
import {style} from './style';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import {getAllAcceptedDating} from '../../../actions/homeActions';

const DatingUserDetailsScreen = ({route}) => {
  const {userData, item} = route.params;

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;
  const userId = user?.user?.id;
  const imageUrls = userData?.userProfilePic?.map(image => image.url) || [];

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [isAboutClicked, setIsAboutClicked] = useState(false);
  const [questionText, setQuestionText] = useState(
    'Why are you reporting this?',
  );
  const [aboutText, setAboutText] = useState('');
  const [isReportModalVisible, setReportModalVisible] = useState(false);

  const navigation = useNavigation();
  const bottomNotFriendSheetRef = useRef(null);
  const bottomFriendSheetRef = useRef(null);
  const ReportBottomSheetRef = useRef();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/user/get-dating-user/${userData?._id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setUserDetails(data); // Store user details from the API response
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        setError('Request failed');
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userData?._id) {
      fetchUserData();
    }
  }, [userData, accessToken]);

  const topModalBottomSheetRef = useRef(null);
  const openTopBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  if (loading) {
    return (
      <SafeAreaView style={{flex: 1, justifyContent: 'center'}}>
        <ActivityIndicator size="large" color={colors.blue} />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  const onThreeDotPress = () => {
    const friendStatus = userDetails?.data[0]?.friendsDetails[0]?.status;

    if (friendStatus === 'accepted') {
      bottomFriendSheetRef.current.open();
    } else {
      bottomNotFriendSheetRef.current.open();
    }
  };

  const OnLikePress = async card => {
    const {userLikeDetails} = card;
    const likedUserId = card._id;
    const currentLikeStatus = userLikeDetails[0]?.isLike;
    const currentLikeStatusId = userLikeDetails[0]?._id;

    try {
      let response;
      let updatedLikeStatus;

      if (currentLikeStatus) {
        // Unliking the user
        response = await axios.put(
          `https://stag.mntech.website/api/v1/user/like/update-like/${currentLikeStatusId}`,
          {
            likedUserId: likedUserId,
            isLike: false,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        updatedLikeStatus = false;
      } else {
        // Liking the user
        response = await axios.post(
          'https://stag.mntech.website/api/v1/user/like/create-like?appUsesType=dating',
          {
            likedUserId: likedUserId,
            isLike: true,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );
        updatedLikeStatus = true;
      }

      if (response?.data?.status === 'Success') {
        setUserDetails(prevState => {
          return {
            ...prevState,
            data: [
              {
                ...prevState.data[0],
                userLikeDetails: [
                  {
                    ...prevState.data[0].userLikeDetails[0],
                    isLike: updatedLikeStatus,
                  },
                ],
              },
            ],
          };
        });
      } else {
        Alert.alert('Error', 'Unable to update like status. Please try again.');
      }
    } catch (error) {
      console.error('Error with like/unlike operation:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const onSendRequest = async () => {
    const friendStatus = userDetails?.data[0]?.friendsDetails[0]?.status;

    console.log(
      ' === userDetails ===> ',
      userDetails?.data[0]?.friendsDetails[0]?.friend,
    );

    if (friendStatus === 'requested') {
      // Call the API to respond to the friend request
      try {
        const response = await axios.post(
          'https://stag.mntech.website/api/v1/user/friend/respond-friend-req?appUsesType=dating',
          {
            // user: userDetails?.data[0]?._id, // Current user ID
            user: userDetails?.data[0]?.friendsDetails[0]?.friend, // Current user ID
            request: userDetails?.data[0]?.friendsDetails[0]?._id, // Friend request ID
            status: 'removed', // Status to remove request
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        console.log(
          'API Response for removing friend request:',
          response?.data,
        );

        if (response?.data?.success) {
          // Check for success
          setUserDetails(prevState => ({
            ...prevState,
            data: [
              {
                ...prevState.data[0],
                friendsDetails: [
                  {
                    ...prevState.data[0].friendsDetails[0],
                    status: 'removed',
                  },
                ],
              },
            ],
          }));
        } else {
          Alert.alert(
            'Error',
            'Unable to remove friend request. Please try again.',
          );
        }
      } catch (error) {
        console.error('Error removing friend request:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } else {
      // Call the original send friend request API
      try {
        const response = await axios.post(
          'https://stag.mntech.website/api/v1/user/friend/create-friend?appUsesType=dating',
          {
            friend: userDetails?.data[0]?._id, // Friend's user ID
            user: user?.user?.id, // Current user's ID
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        console.log('API Response for send request:', response?.data);

        if (response?.data?.status === 'Success') {
          setUserDetails(prevState => ({
            ...prevState,
            data: [
              {
                ...prevState.data[0],
                friendsDetails: [
                  {
                    ...prevState.data[0].friendsDetails[0],
                    status: 'requested',
                  },
                ],
              },
            ],
          }));
        } else {
          Alert.alert(
            'Error',
            'Unable to send friend request. Please try again.',
          );
        }
      } catch (error) {
        console.error('Error sending friend request:', error);
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    }
  };

  const handleShare = async data => {
    bottomNotFriendSheetRef.current.close();
    bottomFriendSheetRef.current.close();

    try {
      // You can add a slight delay to allow the bottom sheet to close first if necessary
      await new Promise(resolve => setTimeout(resolve, 50)); // Adjust delay as needed

      // Now trigger the Share dialog
      const result = await Share.share({
        // message: 'Happy Milan App', // Message to share
        message: data, // Message to share
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

  const onCopyIdPress = async userID => {
    console.log(' === selectedUniqueId ===> ', userID);
    await Clipboard.setString(userID);
    bottomNotFriendSheetRef.current.close();
    bottomFriendSheetRef.current.close();
  };

  const onSendMessagePress = userData => {
    bottomFriendSheetRef.current.close();
    navigation.navigate('ChatUserScreen', {
      userData,
    });
  };

  const handleBackArrow = () => {
    setReportReasons([]);
    setQuestionText('Why are you reporting this?'); // Reset question text when going back
    setIsAboutClicked(false); // Reset "About" state
  };

  // Handler when "Inappropriate content" is clicked
  const handleInappropriateContent = () => {
    setReportReasons(prevReasons => [
      ...prevReasons,
      'Hate Speech or Discrimination',
      'Harmful Language',
      'Misinformation',
      'Spam or Irrelevant Content',
    ]);
    setQuestionText('How is it Inappropriate content?');
  };

  // Handler when "Harassment or bullying" is clicked
  const handleHarassmentOrBullying = () => {
    setReportReasons(prevReasons => [
      ...prevReasons,
      'Threats or Intimidation',
      'Hate Speech',
      'Sexual Harassment',
      'Discriminatory Harassment',
    ]);
    setQuestionText('How is it harassment or bullying?'); // Change question text after selecting this option
  };

  // Handler when "Fake Misleading Profile" is clicked
  const handleFakeMisleadingProfile = () => {
    setReportReasons(prevReasons => [
      ...prevReasons,
      'Fake Identity',
      'Suspicious Behavior',
      'Inactive or Duplicate Account',
      'Age Misrepresentation',
    ]);
    setQuestionText('How is it Fake or misleading profile?'); // Change question text after selecting this option
  };

  // Handler when "Spam or promotional content." is clicked
  const handleSpamPromotionalContent = () => {
    setReportReasons(prevReasons => [
      ...prevReasons,
      'Unsolicited Advertising',
      'Malware or Harmful Content',
      'Phishing or Fraudulent Links',
      'Irrelevant Promotional Content',
    ]);
    setQuestionText('How is it Spam or promotional content?'); // Change question text after selecting this option
  };

  // Handler when "Scams or fraudulent activity" is clicked
  const handleScamsFraudulentActivity = () => {
    setReportReasons(prevReasons => [
      ...prevReasons,
      'Romance Scams',
      'Phishing Attempts',
      'Job or Employment Scams',
      'Counterfeit Products',
    ]);
    setQuestionText('How is it Scams or fraudulent activity?'); // Change question text after selecting this option
  };

  const handleReportReasonClick = (reason, category) => {
    // Remove "How is it " from the category string
    const cleanedCategory = category.replace(/^How is it /, '').trim();

    console.log(
      `Selected Report Reason: ${reason}, Category: ${cleanedCategory}`,
    );

    // Close the bottom sheet
    ReportBottomSheetRef.current.close();

    // Call the API to submit the report
    const submitReport = async () => {
      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/spam/create-spam?appUsesType=dating',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`, // Access token from Redux or state
            },
            body: JSON.stringify({
              // spamUserId: selectedFrinedId, // Example spam user ID, update with actual ID if needed
              spamUserId: userDetails?.data[0]?._id,
              reason: cleanedCategory, // Use cleaned category as reason
              remark: reason, // Use the specific report reason (like "Hate Speech") as remark
            }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          console.log('Report submitted successfully:', data);
          // Alert.alert('success', 'Report to User success.');
          setReportModalVisible(true);
        } else {
          console.error('Failed to submit report:', data);
        }
      } catch (error) {
        console.error('Error submitting report:', error);
      }
    };

    submitReport();

    // Optionally, reset or clear the report reasons state
    resetBottomSheet(); // Reset everything to the initial state when closing the bottom sheet
  };

  const handleSubmit = () => {
    console.log('About Text Submitted:', aboutText);
    // Close the bottom sheet after submission
    ReportBottomSheetRef.current.close();

    // Call the API to submit the report
    const submitReport = async () => {
      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/spam/create-spam?appUsesType=dating',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`, // Access token from Redux or state
            },
            body: JSON.stringify({
              // spamUserId: selectedFrinedId, // Example spam user ID, update with actual ID if needed
              spamUserId: userDetails?.data[0]?._id,
              reason: 'About', // Use cleaned category as reason
              remark: aboutText, // Use the specific report reason (like "Hate Speech") as remark
            }),
          },
        );

        const data = await response.json();

        if (response.ok) {
          console.log('Report submitted successfully:', data);
          // Alert.alert('success', 'Report to User success.');
          setReportModalVisible(true);
        } else {
          console.error('Failed to submit report:', data);
        }
      } catch (error) {
        console.error('Error submitting report:', error);
      }
    };

    submitReport();

    // Reset the bottom sheet state
    resetBottomSheet();
  };

  const resetBottomSheet = () => {
    setReportReasons([]);
    setQuestionText('Why are you reporting this?');
    setIsAboutClicked(false);
    setAboutText('');
  };

  const handleConfirmBlock = async () => {
    // console.log(
    //   ' === handleConfirmBlock ===> ',
    //   userDetails?.data[0]?.friendsDetails[0]?._id,
    // );
    try {
      setIsBlockModalVisible(false);

      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/friend/respond-friend-req?appUsesType=dating',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user: userDetails?.data[0]?.friendsDetails[0]?.friend,
            request: userDetails?.data[0]?.friendsDetails[0]?._id,
            status: 'removed',
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        navigation.goBack();
        setIsBlockModalVisible(false);
        // Handle the successful response
      } else {
        console.error('Error:', response.statusText);
        // Handle the error response
      }
    } catch (error) {
      console.error('Request failed', error);
      setIsBlockModalVisible(false);
      // Handle error if request fails
    }
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

  const firstName = capitalizeFirstLetter(
    userData?.firstName || userData?.name,
  );
  const lastName = capitalizeFirstLetter(userData?.lastName);
  const age = userData?.dateOfBirth
    ? calculateAge(userData.dateOfBirth)
    : 'N/A';
  const Occupation = capitalizeFirstLetter(
    userData?.userProfessional?.jobTitle,
  );
  const workCity = capitalizeFirstLetter(userData?.datingData[0]?.Ethnicity);
  const workCountry = capitalizeFirstLetter(
    userData?.datingData[0]?.CurrentlyLiving,
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
                <Text style={style.imageSubTittleText}>{Occupations}</Text>

                <View style={style.verticalLine} />

                <Text style={style.imageSubTittleText}>{workCity},</Text>
                <Text style={style.imageSubTittleText}> {workCountry}</Text>

                <TouchableOpacity
                  onPress={onThreeDotPress}
                  activeOpacity={0.6}
                  style={{
                    width: hp(30),
                    height: hp(30),
                    backgroundColor: '#282727',
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    top: -5,
                    position: 'absolute',
                    right: 10,
                  }}>
                  <Image
                    source={icons.three_dots_icon}
                    style={{width: hp(12), height: hp(15), tintColor: 'white'}}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <View style={style.iconsContainer}>
          {userDetails?.data[0]?.friendsDetails[0]?.status !== 'accepted' && (
            <View style={style.iconsBodyContainer}>
              <TouchableOpacity
                style={style.imagesContainer}
                onPress={() => {
                  navigation.navigate('Upgrader');
                }}>
                <Image
                  source={icons.date_boost_icon}
                  style={style.cancelIcon}
                />
              </TouchableOpacity>

              {userDetails?.data[0]?.userLikeDetails[0]?.isLike ? (
                <TouchableOpacity
                  style={{
                    width: hp(70),
                    height: hp(40),
                    backgroundColor: '#9E28D7',
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: hp(15),
                  }}
                  onPress={() => OnLikePress(userDetails?.data[0])}>
                  <Image
                    source={icons.dating_white_heart}
                    style={{
                      width: hp(19),
                      height: hp(17),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    width: hp(70),
                    height: hp(40),
                    backgroundColor: colors.white,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: hp(15),
                    borderWidth: 1.5,
                    borderColor: '#E5E5E5CC',
                  }}
                  onPress={() => OnLikePress(userDetails?.data[0])}>
                  <Image
                    source={icons.date_like_icon}
                    style={{
                      width: hp(19),
                      height: hp(17),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              )}

              {userDetails?.data[0]?.friendsDetails[0]?.status ===
              'requested' ? (
                <TouchableOpacity
                  style={{
                    width: hp(70),
                    height: hp(40),
                    backgroundColor: '#7045EB',
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={onSendRequest}>
                  <Image
                    source={icons.date_white_send_icon}
                    style={style.sendIcon}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{
                    width: hp(70),
                    height: hp(40),
                    backgroundColor: colors.white,
                    borderRadius: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: '#E5E5E5CC',
                  }}
                  onPress={onSendRequest}>
                  <Image source={icons.date_send_icon} style={style.sendIcon} />
                </TouchableOpacity>
              )}
            </View>
          )}

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

        {/*NOT FRIEND BOTTOM SHEET*/}
        <RBSheet
          ref={bottomNotFriendSheetRef}
          height={hp(180)}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            draggableIcon: {
              backgroundColor: colors.gray,
            },
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}>
          <View
            style={{
              flex: 1,
              marginHorizontal: wp(20),
              marginTop: hp(10),
            }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                handleShare(userDetails?.data[0]?.name);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={icons.share_icon}
                style={{
                  width: hp(20),
                  height: hp(14),
                  resizeMode: 'contain',
                  tintColor: 'black',
                }}
              />
              <Text
                style={{
                  color: colors.black,
                  marginLeft: wp(20),
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Share Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                bottomNotFriendSheetRef.current.close();
                ReportBottomSheetRef.current.open();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(21),
              }}>
              <Image
                source={icons.report_icon}
                style={{
                  width: hp(20),
                  height: hp(14),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: colors.black,
                  marginLeft: wp(20),
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Report Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                onCopyIdPress(userDetails?.data[0]?.userUniqueId);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(21),
              }}>
              <Image
                source={icons.copy_icon}
                style={{
                  width: hp(20),
                  height: hp(14),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: colors.black,
                  marginLeft: wp(20),
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Copy ID : {userDetails?.data[0]?.userUniqueId}
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>

        {/*FRIEND BOTTOM SHEET*/}
        <RBSheet
          ref={bottomFriendSheetRef}
          height={hp(270)}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            draggableIcon: {
              backgroundColor: colors.gray,
            },
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}>
          <View
            style={{
              flex: 1,
              marginHorizontal: wp(20),
              marginTop: hp(10),
            }}>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                handleShare(userDetails?.data[0]?.name);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={icons.share_icon}
                style={{
                  width: hp(20),
                  height: hp(14),
                  resizeMode: 'contain',
                  tintColor: 'black',
                }}
              />
              <Text
                style={{
                  color: colors.black,
                  marginLeft: wp(20),
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Share Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                bottomFriendSheetRef.current.close();
                ReportBottomSheetRef.current.open();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(21),
              }}>
              <Image
                source={icons.report_icon}
                style={{
                  width: hp(20),
                  height: hp(14),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: colors.black,
                  marginLeft: wp(20),
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Report Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                onCopyIdPress(userDetails?.data[0]?.userUniqueId);
                // console.log(' === var ===> ', userDetails?.data[0]);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(21),
              }}>
              <Image
                source={icons.copy_icon}
                style={{
                  width: hp(20),
                  height: hp(14),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: colors.black,
                  marginLeft: wp(20),
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Copy ID : {userDetails?.data[0]?.userUniqueId}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                bottomFriendSheetRef.current.close(); // Use close() instead of Close()
                setIsBlockModalVisible(true);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(21),
              }}>
              <Image
                source={icons.unFriend_icon}
                style={{
                  width: hp(20),
                  height: hp(14),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: colors.black,
                  marginLeft: wp(20),
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Unfriend
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => {
                onSendMessagePress(item);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(21),
              }}>
              <Image
                source={icons.send_message_icon}
                style={{
                  width: hp(14),
                  height: hp(14),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: colors.black,
                  marginLeft: wp(20),
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Send Message
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>

        {/*// REPORT BOTTOM SHEET*/}
        <RBSheet
          ref={ReportBottomSheetRef} // Attach the ref to control its visibility
          closeOnPressMask={true} // Allows closing the bottom sheet by clicking outside of it
          height={hp(500)} // Set the height of the bottom sheet
          customStyles={{
            container: {
              backgroundColor: 'white', // Background color of the bottom sheet
              borderTopLeftRadius: 20, // Optional: Rounded top corners
              borderTopRightRadius: 20, // Optional: Rounded top corners
            },
          }}>
          {/* Content inside the bottom sheet */}
          <View style={{flex: 1}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: hp(24),
                alignItems: 'center',
                marginHorizontal: 17,
              }}>
              {(reportReasons.length > 0 || isAboutClicked) && (
                <TouchableOpacity
                  onPress={handleBackArrow}
                  style={{
                    position: 'absolute',
                    left: 0,
                  }}>
                  <Image
                    source={icons.back_arrow_icon}
                    style={{width: hp(18), height: hp(18)}}
                  />
                </TouchableOpacity>
              )}

              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins500,
                }}>
                Report
              </Text>
            </View>

            <View
              style={{
                width: '100%',
                height: 0.7,
                backgroundColor: '#E7E7E7',
                marginTop: hp(20),
              }}
            />

            <Text
              style={{
                textAlign: 'center',
                marginTop: hp(15),
                color: colors.black,
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins500,
              }}>
              {questionText}
            </Text>

            {reportReasons.length < 1 && !isAboutClicked && (
              <View style={{alignItems: 'center', marginTop: hp(9)}}>
                <Text
                  style={{
                    color: '#8F8F8F',
                    fontSize: fontSize(16),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Your identity will remain anonymous to the
                </Text>
                <Text
                  style={{
                    color: '#8F8F8F',
                    fontSize: fontSize(16),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  reported user.
                </Text>
              </View>
            )}

            {/* Show the list of reasons if there are any */}
            {isAboutClicked ? (
              // If "About" is clicked, show the TextInput and Submit button
              <View style={{marginTop: hp(28), marginHorizontal: 17}}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: colors.black,
                    padding: 10,
                    marginBottom: 20,
                    borderRadius: 10,
                    height: hp(120),
                    textAlignVertical: 'top',
                  }}
                  placeholder="Please provide details..."
                  value={aboutText}
                  onChangeText={setAboutText}
                  multiline={true} // Enable multiline
                />

                <TouchableOpacity
                  activeOpacity={0.7}
                  style={{marginTop: hp(9)}}
                  onPress={handleSubmit}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1.5}}
                    style={{
                      width: '100%',
                      height: hp(50),
                      borderRadius: 50,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        color: colors.white,
                        marginLeft: hp(20),
                        fontSize: fontSize(16),
                        lineHeight: hp(21),
                        fontFamily: fontFamily.poppins500,
                      }}>
                      Submit Report
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            ) : reportReasons.length > 0 ? (
              reportReasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  // style={styles.reportReasonTouchable}
                  onPress={() => handleReportReasonClick(reason, questionText)} // Close the bottom sheet when clicked
                >
                  <Text
                    style={{
                      marginTop: hp(25),
                      marginHorizontal: 17,
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                      color: colors.black,
                    }}>
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <View
                style={{
                  marginTop: hp(26),
                  marginHorizontal: 17,
                }}>
                <TouchableOpacity onPress={handleInappropriateContent}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Inappropriate content
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    marginTop: hp(28),
                  }}
                  onPress={handleHarassmentOrBullying}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Harassment or bullying.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    marginTop: hp(28),
                  }}
                  onPress={handleFakeMisleadingProfile}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Fake or misleading profile.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    marginTop: hp(28),
                  }}
                  onPress={handleSpamPromotionalContent}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Spam or promotional content.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    marginTop: hp(28),
                  }}
                  onPress={handleScamsFraudulentActivity}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Scams or fraudulent activity.
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    marginTop: hp(28),
                  }}
                  onPress={() => setIsAboutClicked(true)} // Handle About click
                >
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Others
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </RBSheet>

        {/* Modal for success message */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isReportModalVisible}
          onRequestClose={() => {
            setReportModalVisible(false);
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                alignItems: 'center',
                width: '85%',
              }}>
              <Text
                style={{
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins600,
                  color: colors.black,
                  textAlign: 'center',
                  marginTop: hp(43),
                }}>
                Thank you for your report.
              </Text>

              <View
                style={{
                  marginTop: hp(38),
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                    color: colors.black,
                  }}>
                  We’ll review it soon to help keep
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                    color: colors.black,
                  }}>
                  our community safe.
                </Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                style={{
                  marginTop: hp(38),
                  marginBottom: hp(43),
                }}
                onPress={() => {
                  setReportModalVisible(false);
                }}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1.5}}
                  style={{
                    width: hp(131),
                    height: hp(50),
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: colors.white,
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

        {/*//BLOCK MODAL */}
        <Modal
          visible={isBlockModalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsBlockModalVisible(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                width: wp(350),
                padding: 20,
                backgroundColor: 'white',
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: fontSize(16),
                  color: 'black',
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins500,
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                Are yor sure want to unfriend?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp(30),
                  marginBottom: hp(15),
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleConfirmBlock}>
                  <LinearGradient
                    colors={['#2D46B9', '#8D1D8D']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{
                      width: hp(122),
                      height: hp(50),
                      borderRadius: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 20,
                    }}>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Yes
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    setIsBlockModalVisible(false);
                  }}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    style={{
                      width: wp(122),
                      height: hp(50),
                      borderRadius: 50,
                      borderWidth: 1,
                      justifyContent: 'center',
                      borderColor: 'transparent',
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
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        No
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={{height: hp(30)}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DatingUserDetailsScreen;
