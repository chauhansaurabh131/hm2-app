import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Clipboard,
  Share,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {icons, images} from '../../../assets';
import style from '../../../screen/matchesScreen/style';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {colors} from '../../../utils/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import {
  addShortList,
  non_friend_Blocked,
  removeShortList,
  userDatas,
} from '../../../actions/homeActions';
import {home} from '../../../apis/homeApi';
import Toast from 'react-native-toast-message';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesInNewScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const sheetRef = useRef(null);
  const [selectedFirstName, setSelectedFirstName] = useState('');
  const [selectedUniqueId, setSelectedUniqueId] = useState('');
  const [blockedFriendId, setBlockedFriendId] = useState('');
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [questionText, setQuestionText] = useState(
    'Why are you reporting this?',
  );
  const [isAboutClicked, setIsAboutClicked] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [isReportModalVisible, setReportModalVisible] = useState(false);

  const ReportBottomSheetRef = useRef();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const Login_User_ID = user?.user?.id;

  // console.log(' === Login User ID ===> ', user?.user?.id);

  // Function to open the bottom sheet
  const openBottomSheet = () => {
    sheetRef.current.close();
    ReportBottomSheetRef.current.open();
  };

  const dispatch = useDispatch();

  const {
    userData = [],
    totalPages = 1,
    isUserDataLoading,
  } = useSelector(state => state.home);

  // console.log(' === userData ===> ', userData);

  useEffect(() => {
    dispatch(
      userDatas({
        page,
      }),
    );
  }, [dispatch, page]);

  const openModal = () => {
    setModalVisible(true);
    setStep(1); // Reset step to 1 when modal opens
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Function to fetch data from the API
  const fetchData = async (pageNumber = 1) => {
    if (!hasMoreData) {
      return;
    }

    try {
      console.log('Fetching data for page:', pageNumber);

      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/user/getUserByGender?page=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const json = await response.json();
      // console.log('API response:', json);

      const newData = json?.data[0]?.paginatedResults || [];

      if (newData.length === 0) {
        console.log('No data found for this page.');
        setHasMoreData(false);
      } else {
        setData(prevData => [...prevData, ...newData]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  //
  const loadMoreData = () => {
    if (!isFetchingMore && hasMoreData) {
      setIsFetchingMore(true);
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchData(nextPage);
        return nextPage;
      });
    }
  };

  const ShowToast = () => {
    Toast.show({
      type: 'AddShortlisted',
      text1: 'Profile has been shortlisted',
      visibilityTime: 1000,
    });
  };

  const RemoveShortlisted = () => {
    Toast.show({
      type: 'RemoveShortlisted',
      text1: 'Shortlisted has been removed',
      visibilityTime: 1000,
    });
  };

  const CopyId = () => {
    Toast.show({
      type: 'Copied',
      text1: 'Your ID has been copied!',
      visibilityTime: 1000,
    });
  };

  const onShortListPress = item => {
    if (item?.userShortListDetails) {
      home.removeShortListsData(item.userShortListDetails._id).then(() => {
        dispatch(removeShortList({userId: item._id}));
        RemoveShortlisted();
      });
    } else {
      home.addShortListsData({shortlistId: item._id}).then(({data: {data}}) => {
        dispatch(
          addShortList({
            userId: item._id,
            userShortListDetails: {...data, _id: data.id},
          }),
        );
        ShowToast();
      });
    }
  };

  const onCopyIdPress = async selectedUniqueId => {
    console.log(' === selectedUniqueId ===> ', selectedUniqueId);
    await Clipboard.setString(selectedUniqueId);
    sheetRef.current.close();
    CopyId();
  };

  const handleShare = async () => {
    // Close the bottom sheet before sharing
    sheetRef.current.close();

    try {
      // You can add a slight delay to allow the bottom sheet to close first if necessary
      await new Promise(resolve => setTimeout(resolve, 50)); // Adjust delay as needed

      // Now trigger the Share dialog
      const result = await Share.share({
        // message: 'Happy Milan App', // Message to share
        message: selectedFirstName, // Message to share
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

  const handleBlockProfilePress = () => {
    sheetRef.current.close();
    setIsBlockModalVisible(true);
    console.log(' === handleBlockProfilePress ===> ');
  };

  const handleConfirmBlock = () => {
    // console.log(' === handleConfirmBlock ===> ', blockedFriendId);
    dispatch(
      non_friend_Blocked({friend: blockedFriendId, user: Login_User_ID}, () => {
        setIsBlockModalVisible(false);
      }),
    );
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
          'https://stag.mntech.website/api/v1/user/spam/create-spam',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`, // Access token from Redux or state
            },
            body: JSON.stringify({
              spamUserId: blockedFriendId, // Example spam user ID, update with actual ID if needed
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

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setReportModalVisible(false);
  };

  // Handler for the back button to reset the state
  const handleBackArrow = () => {
    setReportReasons([]);
    setQuestionText('Why are you reporting this?'); // Reset question text when going back
    setIsAboutClicked(false); // Reset "About" state
  };

  // Handle the "Submit" action for "About" section
  const handleSubmit = () => {
    console.log('About Text Submitted:', aboutText);
    // Close the bottom sheet after submission
    ReportBottomSheetRef.current.close();

    // Call the API to submit the report
    const submitReport = async () => {
      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/spam/create-spam',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`, // Access token from Redux or state
            },
            body: JSON.stringify({
              spamUserId: blockedFriendId, // Example spam user ID, update with actual ID if needed
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

  // Reset the bottom sheet to its initial state
  const resetBottomSheet = () => {
    setReportReasons([]);
    setQuestionText('Why are you reporting this?');
    setIsAboutClicked(false);
    setAboutText('');
  };

  const renderUserItem = ({item}) => {
    // console.log(' === item_____ ===> ', item?.uniqueId);

    const userAllImage = Array.isArray(item?.userProfilePic)
      ? item.userProfilePic.map(pic => pic.url)
      : [];

    const blockedFriendId = item?._id;
    const uniqueId = item?.userUniqueId;
    const profileImage = item.profilePic;
    const birthTime = item.birthTime;
    const currentCountry = item.address?.currentCountry;

    const firstName = item.firstName
      ? item.firstName.charAt(0).toUpperCase() +
        item.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item.lastName
      ? item.lastName.charAt(0).toUpperCase() +
        item.lastName.slice(1).toLowerCase()
      : '';

    const JobTittle = item.userProfessional?.jobTitle
      ? item.userProfessional?.jobTitle.charAt(0).toUpperCase() +
        item.userProfessional?.jobTitle.slice(1).toLowerCase()
      : '';

    const currentCity = item.address?.currentCity
      ? item.address?.currentCity.charAt(0).toUpperCase() +
        item.address?.currentCity.slice(1).toLowerCase()
      : '';

    const workCountry = item.userProfessional?.workCountry
      ? item.userProfessional?.workCountry.charAt(0).toUpperCase() +
        item.userProfessional?.workCountry.slice(1).toLowerCase()
      : '';
    const imageCount = Array.isArray(item?.userProfilePic)
      ? item.userProfilePic.length
      : 0;

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

    const age = calculateAge(item.dateOfBirth);

    // const handlePress = () => {
    //   console.log(' === item........... ===> ', item);
    //   const matchesUserData = {
    //     userAllImage,
    //     profileImage,
    //     birthTime,
    //     currentCity,
    //     JobTittle,
    //     currentCountry,
    //     age,
    //     gender: item?.gender,
    //     height: item?.height,
    //     cast: item?.cast,
    //     firstName: item?.firstName,
    //     lastName: item?.lastName,
    //     motherTongue: item?.motherTongue,
    //     about: item?.writeBoutYourSelf,
    //     religion: item?.religion,
    //     dateOfBirth: item?.dateOfBirth,
    //     currentResidenceAddress: item?.address?.currentResidenceAddress,
    //     originResidenceAddress: item?.address?.originResidenceAddress,
    //     originCountry: item?.address?.originCountry,
    //     originCity: item?.address?.originCity,
    //     mobileNumber: item?.mobileNumber,
    //     homeMobileNumber: item?.homeMobileNumber,
    //     email: item?.email,
    //     degree: item?.userEducation?.degree,
    //     collage: item?.userEducation?.collage,
    //     educationCity: item?.userEducation?.city,
    //     educationState: item?.userEducation?.state,
    //     educationCountry: item?.userEducation?.country,
    //     Designation: item?.userProfessional?.jobTitle,
    //     companyName: item?.userProfessional?.companyName,
    //     jobType: item?.userProfessional?.jobType,
    //     currentSalary: item?.userProfessional?.currentSalary,
    //     workCity: item?.userProfessional?.workCity,
    //     workCountry: item?.userProfessional?.workCountry,
    //     hobbies: item?.hobbies,
    //     matchPercentage: item?.matchPercentage,
    //     userLikeDetails: item?.userLikeDetails,
    //   };
    //
    //   // console.log('User Data:', matchesUserData);
    //
    //   // Navigate to UserDetailsScreen
    //   navigation.navigate('UserDetailsScreen', {matchesUserData});
    // };

    const handlePress = items => {
      const matchesUserData = {
        firstName: items.name,
        id: items?._id,
      };
      // console.log(' === var ===> ', matchesUserData);
      navigation.navigate('NewUserDetailsScreen', {matchesUserData});
      // navigation.navigate('Abc', {matchesUserData});
    };

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    const onThreeDotPress = () => {
      // const userDetailsThreeDot = {
      //   firstName: item?.firstName,
      // };
      setSelectedFirstName(firstName);
      setSelectedUniqueId(uniqueId);
      setBlockedFriendId(blockedFriendId);

      sheetRef.current.open();
      // console.log(' === onThreeDotPress ===> ', userDetailsThreeDot);
    };

    const starIconSource = item?.userShortListDetails
      ? icons.black_check_icon // Check icon if shortlisted
      : icons.black_start_icon; // Star icon if not shortlisted

    return (
      <View style={{marginHorizontal: 17}}>
        <TouchableOpacity activeOpacity={1}>
          <View>
            <Image
              source={
                profileImage ? {uri: profileImage} : images.empty_male_Image
              }
              style={style.userImageStyle}
              resizeMode={'cover'}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
              style={style.gradient}
            />

            <View style={style.UserDetailsContainer}>
              <View style={style.onlineBodyStyle}>
                <Text style={style.bodyTextStyle}>Online</Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  handlePress(item);
                }}>
                <Text style={style.userNameTextStyle}>
                  {firstName || item.name} {lastName || ' '}
                </Text>

                <View
                  style={[
                    style.userDetailsDescriptionContainer,
                    {marginTop: 3},
                  ]}>
                  {/*<Text style={style.userDetailsTextStyle}>{item.gender}</Text>*/}
                  <Text style={style.userDetailsTextStyle}>
                    {age || 'N/A'} yrs,
                  </Text>
                  <Text style={style.userDetailsTextStyle}>{item.height}</Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>
                    {JobTittle || 'N/A'}
                  </Text>
                </View>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>
                    {currentCity || ' N/A'},
                  </Text>

                  {/*<View style={style.verticalLineStyle} />*/}

                  {/*<Text style={style.userDetailsTextStyle}> {'N/A'}</Text>*/}
                  {/*<Text style={style.userDetailsTextStyle}>*/}
                  {/*  {workCity || 'N/A'}*/}
                  {/*</Text>*/}
                  <Text style={style.userDetailsTextStyle}>
                    {' '}
                    {workCountry || 'N/A'}
                  </Text>
                </View>
              </TouchableOpacity>

              <View
                style={{
                  marginTop: hp(15),
                  flexDirection: 'row',
                  // backgroundColor: 'red',
                  alignItems: 'center',
                  // flex: 1,
                }}>
                <Image
                  source={images.gradient_button_background_img}
                  style={{
                    // width: wp(105),
                    // height: hp(30),
                    // resizeMode: 'stretch',
                    width: wp(105),
                    height: hp(30),
                    resizeMode: 'stretch',
                    borderRadius: 50, // Adjust the radius as needed
                    overflow: 'hidden', // Ensure rounded corners clip the image
                  }}
                />
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={openModal}
                  style={{
                    position: 'absolute',
                    left: 10,
                    // top: 12,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    // borderRadius: 10,
                  }}>
                  <Image
                    source={icons.couple_icon}
                    style={{
                      width: hp(16),
                      height: hp(14),
                      resizeMode: 'contain',
                      tintColor: 'white',
                    }}
                  />
                  <Text
                    style={{
                      color: 'white',
                      marginLeft: 9,
                      fontSize: fontSize(10),
                      lineHeight: hp(15),
                      fontFamily: fontFamily.poppins600,
                      top: 1,
                    }}>
                    {/*85% Match*/}
                    {item?.matchPercentage}% Match
                  </Text>
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    right: 35,
                    // top: 5,
                  }}>
                  <TouchableOpacity
                    style={{
                      width: hp(60),
                      height: hp(30),
                      backgroundColor: '#282727',
                      borderRadius: 15,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginHorizontal: 5,
                    }}
                    activeOpacity={0.5}
                    // onPress={() => {
                    //   navigation.navigate('UserUploadImageFullScreen');
                    // }}
                    onPress={userAllImageShare}>
                    <Image
                      source={icons.new_camera_icon}
                      style={{
                        width: 16,
                        height: 16,
                        resizeMode: 'contain',
                        marginRight: wp(10),
                      }}
                    />

                    <Text style={{color: colors.white}}>{imageCount}</Text>
                  </TouchableOpacity>
                  {/*</View>*/}

                  <TouchableOpacity
                    onPress={() => {
                      onShortListPress(item);
                    }}
                    activeOpacity={0.5}
                    style={{
                      width: hp(30),
                      height: hp(30),
                      backgroundColor: '#282727',
                      borderRadius: 50,
                    }}>
                    <Image
                      source={starIconSource}
                      style={{
                        width: hp(30),
                        height: hp(30),
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onThreeDotPress}
                    style={{
                      width: hp(30),
                      height: hp(30),
                      backgroundColor: '#282727',
                      borderRadius: 50,
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginHorizontal: 5,
                    }}>
                    <Image
                      source={icons.new_three_dot}
                      style={{width: 4, height: 14, tintColor: colors.white}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && page === 1) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        {/*<ActivityIndicator size="large" color="#0000ff" />*/}
        <View style={{height: hp(449), marginHorizontal: 17}}>
          <ShimmerPlaceholder
            style={{
              width: '100%',
              height: hp(449),
              borderRadius: 10,
              marginBottom: hp(13),
            }}
          />
          <View style={{marginTop: -180, marginHorizontal: 17}}>
            <ShimmerPlaceholder style={{width: 100, height: 20}} />

            <View style={{marginTop: 10}}>
              <ShimmerPlaceholder style={{width: 100, height: 5}} />
            </View>

            <View style={{marginTop: 50, flexDirection: 'row'}}>
              <ShimmerPlaceholder
                style={{
                  width: wp(142),
                  height: hp(40),
                  justifyContent: 'center',
                  marginRight: 40,
                }}
              />
              <ShimmerPlaceholder
                style={{
                  width: wp(142),
                  height: hp(40),
                  justifyContent: 'center',
                  marginRight: 40,
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const toastConfigs = {
    AddShortlisted: ({text1}) => (
      <View
        style={{
          backgroundColor: '#333333', // Toast background color
          // padding: 10,
          borderRadius: 100,
          marginHorizontal: 20,
          // marginTop: -200,
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
    RemoveShortlisted: ({text1}) => (
      <View
        style={{
          backgroundColor: '#333333', // Toast background color
          // padding: 10,
          borderRadius: 100,
          marginHorizontal: 20,
          // marginTop: -200,
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

    Copied: ({text1}) => (
      <View
        style={{
          backgroundColor: '#333333', // Toast background color
          // padding: 10,
          borderRadius: 100,
          marginHorizontal: 20,
          // marginTop: -200,
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
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          zIndex: 99,
          position: 'absolute',
          // alignItems: 'center',
          // justifyContent: 'center',
          alignSelf: 'center',
          // alignContent: 'center',
          top: -130,
        }}>
        <Toast config={toastConfigs} />
      </View>
      {/*<FlatList*/}
      {/*  data={data}*/}
      {/*  renderItem={renderUserItem}*/}
      {/*  keyExtractor={item => item._id || item.id || item.name}*/}
      {/*  onEndReached={loadMoreData}*/}
      {/*  onEndReachedThreshold={0.5}*/}
      {/*  showsVerticalScrollIndicator={false}*/}
      {/*  // ListFooterComponent={isFetchingMore ? <ActivityIndicator /> : null}*/}
      {/*  ListFooterComponent={*/}
      {/*    isFetchingMore ? (*/}
      {/*      <View style={{alignItems: 'center'}}>*/}
      {/*        <Text style={{color: 'black'}}>Loading Data..</Text>*/}
      {/*      </View>*/}
      {/*    ) : null*/}
      {/*  }*/}
      {/*  ListEmptyComponent={*/}
      {/*    !loading && !isFetchingMore ? (*/}
      {/*      <View style={styles.emptyListContainer}>*/}
      {/*        <Text style={{color: 'black'}}>No data available</Text>*/}
      {/*      </View>*/}
      {/*    ) : null*/}
      {/*  }*/}
      {/*  contentContainerStyle={styles.listContainer} // Added this line*/}
      {/*/>*/}
      {/*{isUserDataLoading ? (*/}
      {/*  <View>*/}
      {/*    <SafeAreaView style={styles.loadingContainer}>*/}
      {/*      /!*<ActivityIndicator size="large" color="#0000ff" />*!/*/}
      {/*      <View style={{height: hp(449), marginHorizontal: 17}}>*/}
      {/*        <ShimmerPlaceholder*/}
      {/*          style={{*/}
      {/*            width: '100%',*/}
      {/*            height: hp(449),*/}
      {/*            borderRadius: 10,*/}
      {/*            marginBottom: hp(13),*/}
      {/*          }}*/}
      {/*        />*/}
      {/*        <View style={{marginTop: -180, marginHorizontal: 17}}>*/}
      {/*          <ShimmerPlaceholder style={{width: 100, height: 20}} />*/}
      {/*          <View style={{marginTop: 10}}>*/}
      {/*            <ShimmerPlaceholder style={{width: 100, height: 5}} />*/}
      {/*          </View>*/}
      {/*          <View style={{marginTop: 50, flexDirection: 'row'}}>*/}
      {/*            <ShimmerPlaceholder*/}
      {/*              style={{*/}
      {/*                width: wp(142),*/}
      {/*                height: hp(40),*/}
      {/*                justifyContent: 'center',*/}
      {/*                marginRight: 40,*/}
      {/*              }}*/}
      {/*            />*/}
      {/*            <ShimmerPlaceholder*/}
      {/*              style={{*/}
      {/*                width: wp(142),*/}
      {/*                height: hp(40),*/}
      {/*                justifyContent: 'center',*/}
      {/*                marginRight: 40,*/}
      {/*              }}*/}
      {/*            />*/}
      {/*          </View>*/}
      {/*        </View>*/}
      {/*      </View>*/}
      {/*    </SafeAreaView>*/}
      {/*  </View>*/}
      {/*) : (*/}
      <FlatList
        data={userData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderUserItem}
        showsVerticalScrollIndicator={false}
        onEndReached={() => {
          if (page < totalPages) {
            setPage(prevState => prevState + 1);
          }
        }}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          !loading && !isFetchingMore ? (
            <View
              style={{
                padding: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: hp(250),
                  justifyContent: 'center',
                }}>
                <Image
                  source={icons.no_Profile_Found_img}
                  style={{
                    width: hp(44),
                    height: hp(44),
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(18),
                    lineHeight: hp(27),
                    fontFamily: fontFamily.poppins400,
                    marginTop: hp(12),
                  }}>
                  No Profiles Found
                </Text>
              </View>
            </View>
          ) : null
        }
      />
      {/*// )}*/}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        {/*<TouchableWithoutFeedback onPress={closeModal}>*/}

        <View style={style.modalContainer}>
          <View style={style.modalBodyStyle}>
            <View style={style.modalTittleContainer}>
              <Text style={style.tittleTextModal}>
                Your Match :<Text style={style.tittleTextNum}> 85%</Text>
              </Text>

              <TouchableOpacity
                style={style.cancelIconContainer}
                onPress={closeModal}>
                <Image source={icons.x_cancel_icon} style={style.cancelIcon} />
              </TouchableOpacity>
            </View>

            <View style={style.matchImageContainer}>
              <Image
                source={images.profileDisplayImage}
                style={style.firstImageStyle}
              />

              <Image
                source={images.demo_Five_Image}
                style={style.secondImageStyle}
              />
            </View>

            <View style={style.matchNameContainer}>
              <Image source={icons.couple_icon} style={style.coupleIcon} />

              <Text style={style.matchName}>You & Rohan Matched</Text>
            </View>

            <View style={style.underLineStyle} />

            <Text style={style.modalBodyDescription}>
              Based on Your Partner Preference
            </Text>

            <View style={style.modalBodyContainer}>
              {step === 1 && (
                <>
                  <Text style={style.tittleTextStyle}>Religion</Text>

                  <View style={style.subTittleContainer}>
                    <Text style={style.subTittleText}>Hindu</Text>

                    <Image
                      source={icons.check_gradient_icon}
                      style={style.checkIcon}
                    />
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Height</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>4.5 to 5.3ft</Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Age</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>27 - 34</Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Weight</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>52 to 68 kg</Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>
                </>
              )}

              {step === 2 && (
                <>
                  <Text style={style.tittleTextStyle}>Caste</Text>

                  <View style={style.subTittleContainer}>
                    <Text style={style.subTittleText}>Patel</Text>

                    <Image
                      source={icons.check_gradient_icon}
                      style={style.checkIcon}
                    />
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Sub Caste</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
                        Kadava Patidar, Leva Patidar
                      </Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Prefer City</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
                        Delhi, Mumbai, New Your
                      </Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Prefer Country</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>India, USA, UK</Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>
                </>
              )}

              {step === 3 && (
                <>
                  <Text style={style.tittleTextStyle}>Degree</Text>

                  <View style={style.subTittleContainer}>
                    <Text style={style.subTittleText}>BCA, Bsc, MBA</Text>

                    <Image
                      source={icons.check_gradient_icon}
                      style={style.checkIcon}
                    />
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Profession</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
                        Software, Medical Officer
                      </Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Annual Income</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>10 to 35 lac</Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Job Type</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
                        Government, Private
                      </Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>
                </>
              )}

              {step === 4 && (
                <>
                  <Text style={style.tittleTextStyle}>Prefer Diet</Text>

                  <View style={style.subTittleContainer}>
                    <Text style={style.subTittleText}>Vegetarian, All</Text>

                    <Image
                      source={icons.check_gradient_icon}
                      style={style.checkIcon}
                    />
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Creative</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
                        Writing, Painting, Reading
                      </Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Fun</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
                        Watching Movie, Traveling
                      </Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>

            <View style={style.modalBottomNavigationContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleBackArrow}
                disabled={step === 1}
                style={style.previousBackIconContainer}>
                <Image
                  source={icons.rightSideIcon}
                  style={[
                    style.previousBackIcon,
                    {tintColor: step === 1 ? '#E4E4E4' : 'black'},
                  ]}
                />
              </TouchableOpacity>

              <View style={style.bottomPagination}>
                {[1, 2, 3, 4].map(item => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setStep(item)}
                    style={[
                      style.bottomPaginationStyle,
                      {backgroundColor: step === item ? '#0F52BA' : '#ECECEC'},
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleNext}
                disabled={step === 4}
                style={style.nextIconContainer}>
                <Image
                  source={icons.rightSideIcon}
                  style={[
                    style.nextIcon,
                    {tintColor: step === 4 ? '#E4E4E4' : 'black'},
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/*</TouchableWithoutFeedback>*/}
      </Modal>
      {/* Bottom Sheet */}
      <RBSheet
        ref={sheetRef}
        height={hp(240)} // Height of the bottom sheet
        // openDuration={250} // Duration of the opening animation
        closeOnDragDown={true} // Allow closing the sheet by dragging it down
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        {/* Content inside the bottom sheet */}
        <View style={{flex: 1}}>
          {/*<Text style={{fontSize: 18}}>First Name: {selectedFirstName}</Text>*/}

          <View style={{marginHorizontal: 30, marginTop: 20}}>
            <TouchableOpacity
              // onPress={() => {
              //   sheetRef.current.close();
              // }}
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
              // onPress={() => {
              //   sheetRef.current.close();
              // }}
              // onPress={handleBlockProfilePress}
              onPress={() => {
                handleBlockProfilePress(blockedFriendId);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(20),
              }}>
              <Image
                source={icons.block_icon}
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
                Block {selectedFirstName}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              // onPress={() => {
              //   sheetRef.current.close();
              // }}
              onPress={openBottomSheet}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(20),
              }}>
              <Image
                source={icons.report_icon}
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
                Report this profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              // onPress={() => {
              //   sheetRef.current.close();
              // }}

              onPress={() => {
                onCopyIdPress(selectedUniqueId);
              }}
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
                Copy ID : {selectedUniqueId}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
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
                fontFamily: fontFamily.poppins400,
                marginTop: 20,
              }}>
              Are you sure you want to
            </Text>
            <Text
              style={{
                fontSize: fontSize(16),
                color: 'black',
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
              }}>
              Block This User?
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: hp(30),
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
          {/* Back button, only visible when a reason is selected or when in "About" section */}

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
                style={{position: 'absolute', left: 0}}>
                {/*<Text style={styles.backButtonText}>Back</Text>*/}
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
            <View
              style={{
                alignItems: 'center',
                marginTop: hp(9),
              }}>
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
                    // justifyContent: 'space-between',
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
            <View style={{marginTop: hp(26), marginHorizontal: 17}}>
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
                style={{marginTop: hp(28)}}
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
                style={{marginTop: hp(28)}}
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
                style={{marginTop: hp(28)}}
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
                style={{marginTop: hp(28)}}
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
                style={{marginTop: hp(28)}}
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
        onRequestClose={handleCloseModal}>
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
              // padding: 20,
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

            <View style={{marginTop: hp(38), alignItems: 'center'}}>
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
            {/*<TouchableOpacity*/}
            {/*  style={{backgroundColor: '#007BFF', padding: 10, borderRadius: 5}}*/}
            {/*  onPress={handleCloseModal}>*/}
            {/*  <Text style={{color: 'white', fontSize: 16}}>Close</Text>*/}
            {/*</TouchableOpacity>*/}

            <TouchableOpacity
              activeOpacity={0.7}
              style={{marginTop: hp(38), marginBottom: hp(43)}}
              onPress={handleCloseModal}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1.5}}
                style={{
                  width: hp(131),
                  height: hp(50),
                  borderRadius: 50,
                  // flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  // justifyContent: 'space-between',
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
    </SafeAreaView>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    // flex: 1, // Ensures the SafeAreaView takes up full height
  },
  loadingContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  emptyListContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gender: {
    fontSize: 14,
    color: '#555',
  },
  listContainer: {
    paddingBottom: 200, // Adjust this value for more or less space
  },
});

export default MatchesInNewScreen;
