import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Share,
  Clipboard,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {icons, images} from '../../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../utils/colors';

import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import Toast from 'react-native-toast-message';
import RBSheet from 'react-native-raw-bottom-sheet';
import style from '../../matchesScreen/style';
import ProfileAvatar from '../../../components/letterProfileComponent';
import axios from 'axios';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesInSentScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
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
  const [percentageMatchData, setPercentageMatchData] = useState([]);
  const [percentageLoader, setPercentageLoader] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const sheetRef = useRef(null);
  const ReportBottomSheetRef = useRef();

  // useEffect(() => {
  //   dispatch(getAllSendRequest());
  // }, [dispatch]);
  //
  // const {sendRequestData, isDataStoriesLoader} = useSelector(
  //   state => state.home,
  // );

  // console.log(' === isDataStoriesLoader ===> ', isDataStoriesLoader);

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

  const capitalizeFirstLetter = str => {
    if (!str) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const openModal = async item => {
    // console.log(' === openModal___ ===> ', item?._id, item?.firstName);

    console.log(' === openModal ===> ', item?.friendList?._id);

    try {
      // setLoading(true); // Show loading indicator
      setPercentageLoader(item._id);

      // Call the API to get match details
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/user/get-match-user/${item?.friendList?._id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const matchData = await response.json();

      if (response.ok) {
        console.log('Match data:', matchData);
        setPercentageMatchData(matchData?.data[0]);

        setPercentageLoader(null);
        setModalVisible(true); // Open the modal after data is fetched
        setStep(1); // Reset step to 1 when modal opens
      } else {
        console.error('Failed to fetch match data:', matchData);
        Alert.alert('Error', 'Failed to fetch match details');
      }
    } catch (error) {
      console.error('Error fetching match data:', error);
      Alert.alert('Error', 'Failed to fetch match details');
    } finally {
      setLoading(false); // Hide loading indicator
      setPercentageLoader(null);
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

  const fetchData = async (pageNumber = 1) => {
    if (!hasMoreData) {
      return;
    }

    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/friend/get-request-sent?page=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const json = await response.json();
      console.log('API response:', json);

      const newData = json?.data?.results || [];
      setHasMoreData(json?.data?.hasNextPage || false);

      setData(prevData => [...prevData, ...newData]);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // useEffect(() => {
  //   fetchData();
  // }, []);

  useFocusEffect(
    useCallback(() => {
      setData([]);
      setLoading(true);
      setPage(1); // Reset page to 1
      setHasMoreData(true); // Reset to ensure fetching more data on next load
      fetchData(1); // Fetch the first page of data
    }, []),
  );

  const loadMoreData = () => {
    if (!isFetchingMore && hasMoreData) {
      setIsFetchingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage);
    }
  };

  // const handleShortListPress = async item => {
  //   const shortlistId = item?.shortlistData?._id ?? item?.shortlistData?._id;
  //   const userId = item?.friendList?._id; // Ensure you're using the correct ID
  //
  //   // console.log(' === var ===> ', {item, shortlistId});
  //
  //   if (shortlistId) {
  //     // If the item is already shortlisted, remove it from the shortlist
  //     try {
  //       const response = await fetch(
  //         `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${shortlistId}`,
  //         {
  //           method: 'DELETE',
  //           headers: {
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //         },
  //       );
  //
  //       const result = await response.json();
  //
  //       if (response.ok) {
  //         // Successfully removed from shortlist
  //         // Alert.alert('Success', 'Removed from shortlist');
  //         RemoveShortlisted();
  //
  //         // Update the data by removing the shortlistData
  //         setData(prevData => {
  //           return prevData.map(dataItem => {
  //             // console.log(
  //             //   ' === 111 ===> ',
  //             //   dataItem.shortlistData?._id,
  //             //   shortlistId,
  //             // );
  //             return dataItem.shortlistData?._id === shortlistId
  //               ? {...dataItem, shortlistData: null} // Remove shortlistData
  //               : dataItem;
  //           });
  //         });
  //       } else {
  //         Alert.alert('Error', 'Failed to remove from shortlist');
  //       }
  //     } catch (error) {
  //       console.error('Error removing from shortlist:', error);
  //       Alert.alert('Error', 'Failed to remove from shortlist');
  //     }
  //   } else {
  //     // If the item is not shortlisted, create a new shortlist
  //     try {
  //       const response = await fetch(
  //         'https://stag.mntech.website/api/v1/user/shortlist/create-shortlist',
  //         {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             Authorization: `Bearer ${accessToken}`,
  //           },
  //           body: JSON.stringify({
  //             shortlistId: userId, // Correctly passing the userId
  //           }),
  //         },
  //       );
  //
  //       const result = await response.json();
  //
  //       if (response.ok) {
  //         // Successfully added to shortlist
  //         // Alert.alert('Success', 'Added to shortlist');
  //         ShowToast();
  //         // Update the data with the new shortlist data
  //         setData(prevData => {
  //           return prevData.map(dataItem => {
  //             return dataItem.friendList?._id === userId
  //               ? {
  //                   ...dataItem,
  //                   shortlistData: {_id: result?.data?.id, ...result.data},
  //                 } // Add the shortlistData
  //               : dataItem;
  //           });
  //         });
  //       } else {
  //         Alert.alert('Error', 'Failed to add to shortlist');
  //       }
  //     } catch (error) {
  //       console.error('Error adding to shortlist:', error);
  //       Alert.alert('Error', 'Failed to add to shortlist');
  //     }
  //   }
  // };

  const addToShortlist = async shortlistId => {
    try {
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/shortlist/create-shortlist',
        {shortlistId},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('Shortlist created successfully:', response.data);

      // Update the state immutably and ensure the new shortlist data is associated with the user
      setData(prevData => {
        return prevData.map(user =>
          user?.friendList?._id === shortlistId
            ? {
                ...user,
                friendList: {
                  ...user.friendList,
                  userShortListDetails: response.data.data, // Updated shortlist details
                },
              }
            : user,
        );
      });

      ShowToast();
    } catch (error) {
      console.error('Error adding to shortlist:', error);
      Alert.alert('Error', 'Failed to add to shortlist.');
    }
  };

  const removeFromShortlist = async shortlistId => {
    try {
      // Call the remove from shortlist API
      const response = await axios.delete(
        `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${shortlistId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log('Shortlist removed successfully:', response.data?.data);

      // Directly update the state to remove the shortlist details without re-fetching data
      setData(prevData => {
        return prevData.map(user =>
          // Ensure you are checking for the correct ID
          user?.friendList?.userShortListDetails?.id === shortlistId
            ? {
                ...user,
                friendList: {
                  ...user?.friendList,
                  userShortListDetails: {}, // Set to null after removal
                },
              }
            : user,
        );
      });

      RemoveShortlisted();
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      Alert.alert('Error', 'Failed to remove from shortlist.');
    }
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

  const onCopyIdPress = async selectedUniqueId => {
    await Clipboard.setString(selectedUniqueId);
    sheetRef.current.close();
    CopyId();
  };

  const handleBlockProfilePress = () => {
    sheetRef.current.close();
    setIsBlockModalVisible(true);
  };

  const handleConfirmBlock = async () => {
    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/friend/block-user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            friend: blockedFriendId,
            user: userId,
          }),
        },
      );

      if (response.status === 200) {
        setData(prevData =>
          prevData.filter(
            dataItem => dataItem.friendList?._id !== blockedFriendId,
          ),
        );
        setIsBlockModalVisible(false);
      } else {
        const errorResponse = await response.json();
        console.error('Block failed:', errorResponse);
        Alert.alert('Error', 'Failed to block the user.');
      }
    } catch (error) {
      console.error('Error during API call:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  // Function to open the bottom sheet
  const openBottomSheet = () => {
    sheetRef.current.close();
    ReportBottomSheetRef.current.open();
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
    handleBack();
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

  const handlePress = items => {
    const matchesUserData = {
      firstName: items?.friendList?.name,
      id: items?.friendList?._id,
      userData: items,
      screen: 'SendScreen',
    };
    // console.log(' === var ===> ', matchesUserData);
    navigation.navigate('NewUserDetailsScreen', {matchesUserData});
  };

  const renderItem = ({item}) => {
    // console.log(' === var ===> ', item?.friendList);

    const planName = item?.friendList?.subscriptionDetails?.selectedPlan
      ? item?.friendList?.subscriptionDetails?.selectedPlan
          .charAt(0)
          .toUpperCase() +
        item?.friendList?.subscriptionDetails?.selectedPlan
          .slice(1)
          .toLowerCase()
      : '';

    const hasValidImage =
      item?.friendList?.profilePic &&
      item?.friendList?.profilePic !== 'null' &&
      item?.friendList?.profilePic.trim() !== '';

    const profilePrivacy =
      item?.friendList?.privacySettingCustom?.profilePhotoPrivacy === true ||
      item?.friendList?.privacySettingCustom?.showPhotoToFriendsOnly === true;

    const {selectedPlan, status} = item?.friendList?.subscriptionDetails || {};

    // Determine if the selected plan is 'gold' (for the crown icon)
    const isGoldPlan = selectedPlan === 'gold';
    const isSilverPlan = selectedPlan === 'silver';
    const isPlatinumPlan = selectedPlan === 'Platinum';

    const subPlan = isGoldPlan || isSilverPlan || isPlatinumPlan;

    let crownTintColor = 'white'; // Default to white
    if (isGoldPlan) {
      crownTintColor = 'orange'; // Gold plan -> orange tint
    } else if (isSilverPlan) {
      crownTintColor = 'silver'; // Silver plan -> silver tint
    } else if (isPlatinumPlan) {
      crownTintColor = 'green'; // Platinum plan -> red tint
    }

    const uniqueId = item?.friendList?.userUniqueId;

    const blockedFriendIds = item?.friendList?._id;

    const profileImage = item?.friendList?.profilePic;

    const firstName = item?.friendList?.firstName
      ? item?.friendList?.firstName.charAt(0).toUpperCase() +
        item?.friendList?.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item?.friendList?.lastName
      ? item?.friendList?.lastName.charAt(0).toUpperCase() +
        item?.friendList?.lastName.slice(1).toLowerCase()
      : '';

    const name = item?.friendList?.name
      ? item?.friendList?.name.charAt(0).toUpperCase() +
        item?.friendList?.name.slice(1).toLowerCase()
      : '';

    const JobTittle = item?.friendList?.userProfessional?.jobTitle
      ? item?.friendList?.userProfessional?.jobTitle.charAt(0).toUpperCase() +
        item?.friendList?.userProfessional?.jobTitle.slice(1).toLowerCase()
      : '';

    const currentCity = item?.friendList?.address?.currentCity
      ? item?.friendList?.address?.currentCity.charAt(0).toUpperCase() +
        item?.friendList?.address?.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item?.friendList?.address?.currentCountry
      ? item?.friendList?.address?.currentCountry.charAt(0).toUpperCase() +
        item?.friendList?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    const calculateAge = dob => {
      if (!dob) {
        return 'N/A';
      } // Handle missing date of birth
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const age = calculateAge(item?.friendList?.dateOfBirth);

    const height = item?.friendList?.height;

    const imageCount = Array.isArray(item?.friendList?.userProfilePic)
      ? item?.friendList?.userProfilePic.length
      : 0;

    const userAllImage = Array.isArray(item?.friendList?.userProfilePic)
      ? item?.friendList?.userProfilePic.map(pic => pic.url)
      : [];

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    const starIconSource = item?.friendList?.userShortListDetails?.id
      ? icons.black_check_icon // Check icon if shortlisted
      : icons.black_start_icon; // Star icon if not shortlisted

    const onThreeDotPress = () => {
      setSelectedFirstName(firstName || name);
      setSelectedUniqueId(uniqueId);
      setBlockedFriendId(blockedFriendIds);

      sheetRef.current.open();
    };

    return (
      <View style={{marginHorizontal: 17}}>
        <TouchableOpacity activeOpacity={1}>
          <View>
            {/*<Image*/}
            {/*  source={*/}
            {/*    profileImage ? {uri: profileImage} : images.empty_male_Image*/}
            {/*  }*/}
            {/*  style={{*/}
            {/*    width: '100%',*/}
            {/*    height: hp(449),*/}
            {/*    borderRadius: 18,*/}
            {/*    marginBottom: hp(13),*/}
            {/*  }}*/}
            {/*  resizeMode={'cover'}*/}
            {/*/>*/}

            {hasValidImage ? (
              <>
                <Image
                  source={{uri: item?.friendList?.profilePic}}
                  style={style.userImageStyle}
                />
                {profilePrivacy && (
                  <Image
                    source={icons.logLogo} // make sure you have a `lock` icon inside `icons`
                    style={{
                      position: 'absolute',
                      tintColor: '#fff',
                      resizeMode: 'contain',
                      width: hp(33),
                      height: hp(44),
                      alignSelf: 'center',
                      marginTop: hp(200),
                    }}
                  />
                )}
              </>
            ) : (
              <>
                <ProfileAvatar
                  firstName={
                    item?.friendList?.firstName || item?.friendList?.name
                  }
                  lastName={item?.friendList?.lastName}
                  textStyle={style.userImageStyle}
                  profileTexts={{fontSize: fontSize(60), marginTop: -80}}
                />
              </>
            )}

            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                borderRadius: 18,
                width: '100%',
                height: '40%',
                marginBottom: hp(13),
              }}
            />

            <View
              style={{
                position: 'absolute',
                bottom: 35,
                width: '100%',
                marginLeft: wp(21),
              }}>
              <View
                style={{
                  width: wp(34.8),
                  height: hp(12),
                  borderRadius: 5,
                  backgroundColor: '#24FF00A8',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(9),
                    lineHeight: hp(12),
                    textAlign: 'center',
                  }}>
                  Online
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  handlePress(item);
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: fontSize(24),
                      lineHeight: hp(36),
                      fontFamily: fontFamily.poppins700,
                      marginTop: 5,
                    }}>
                    {firstName || item.name} {lastName}
                  </Text>

                  {subPlan && (
                    <View
                      style={{
                        height: 22,
                        backgroundColor: crownTintColor,
                        marginLeft: 11,
                        borderRadius: 50,
                        flexDirection: 'row',
                        paddingHorizontal: 7,
                      }}>
                      <Image
                        source={icons.crownIcon}
                        style={{
                          width: 11,
                          height: 11,
                          tintColor: 'white',
                          alignSelf: 'center',
                          resizeMode: 'contain',
                        }}
                      />
                      <Text
                        style={{
                          color: 'white',
                          fontSize: fontSize(12),
                          fontWeight: 'bold',
                          alignSelf: 'center',
                          marginLeft: 3,
                        }}>
                        {planName}
                      </Text>
                    </View>
                  )}
                </View>

                <View style={[{flexDirection: 'row'}, {marginTop: 3}]}>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: fontSize(11),
                      lineHeight: hp(16),
                      fontFamily: fontFamily.poppins400,
                      marginRight: wp(2),
                    }}>
                    {age || 'N/A'} yrs,
                  </Text>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: fontSize(11),
                      lineHeight: hp(16),
                      fontFamily: fontFamily.poppins400,
                      marginRight: wp(2),
                    }}>
                    {height}
                  </Text>

                  <View
                    style={{
                      width: hp(1),
                      backgroundColor: colors.gray,
                      marginHorizontal: wp(10),
                    }}
                  />

                  <Text
                    style={{
                      color: colors.white,
                      fontSize: fontSize(11),
                      lineHeight: hp(16),
                      fontFamily: fontFamily.poppins400,
                      marginRight: wp(2),
                    }}>
                    {JobTittle || 'N/A'}
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: fontSize(11),
                      lineHeight: hp(16),
                      fontFamily: fontFamily.poppins400,
                      marginRight: wp(2),
                    }}>
                    {currentCity || ' N/A'},
                  </Text>

                  <Text
                    style={{
                      color: colors.white,
                      fontSize: fontSize(11),
                      lineHeight: hp(16),
                      fontFamily: fontFamily.poppins400,
                      marginRight: wp(2),
                    }}>
                    {' '}
                    {currentCountry || 'N/A'}
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
                  onPress={() => {
                    openModal(item);
                  }}
                  style={{
                    position: 'absolute',
                    left: 10,
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                  disabled={percentageLoader !== null}>
                  {percentageLoader === item._id ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                      style={{
                        marginLeft: hp(35),
                      }}
                    />
                  ) : (
                    <>
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
                        {item?.matchPercentage}% Match
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    position: 'absolute',
                    right: 35,
                    // top: 5,
                  }}>
                  {!profilePrivacy && (
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
                  )}
                  {/*</View>*/}

                  <TouchableOpacity
                    // onPress={() => handleShortListPress(item)}
                    onPress={() => {
                      if (item?.friendList?.userShortListDetails?.id) {
                        // If the user is already in the shortlist, remove them
                        removeFromShortlist(
                          item?.friendList?.userShortListDetails.id,
                        );
                      } else {
                        // If the user is not in the shortlist, add them
                        addToShortlist(item?.friendList?._id);
                      }
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
          alignSelf: 'center',
          top: -130,
        }}>
        <Toast config={toastConfigs} />
      </View>
      {loading ? (
        <View style={styles.receivedShimmerContainer}>
          <ShimmerPlaceholder style={styles.receivedShimmerImageBody} />
          <View style={styles.receivedShimmerImageBodyInside}>
            <ShimmerPlaceholder style={styles.receivedShimmerName} />

            <View style={styles.receivedShimmerInsideOne}>
              <ShimmerPlaceholder style={styles.receivedShimmerData} />
            </View>

            <View style={styles.receivedShimmerButtonContainer}>
              <ShimmerPlaceholder style={styles.receivedShimmerButton} />
              <ShimmerPlaceholder style={styles.receivedShimmerButton} />
            </View>
          </View>
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item?._id || item?.id || `item-${index}`
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(150)}}
          ListFooterComponent={
            isFetchingMore ? (
              <View style={{alignItems: 'center', marginVertical: 10}}>
                <Text style={{color: 'black'}}>Loading Data...</Text>
              </View>
            ) : null
          }
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
      )}

      {/* Bottom Sheet */}
      <RBSheet
        ref={sheetRef}
        height={hp(280)}
        closeOnDragDown={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        {/* Content inside the bottom sheet */}
        <View style={{flex: 1}}>
          <View style={{marginHorizontal: 30, marginTop: 20}}>
            <TouchableOpacity
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

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#EBEBEB',
                marginTop: hp(22),
              }}
            />

            <TouchableOpacity
              onPress={openBottomSheet}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(20),
              }}>
              <Image
                source={icons.new_report_icon}
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
                  Report
                </Text>

                <Text
                  style={{
                    fontSize: fontSize(12),
                    lineHeight: hp(16),
                    fontFamily: fontFamily.poppins400,
                    color: '#7B7B7B',
                  }}>
                  Your report will be anonymous.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
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
                  Block {selectedFirstName}
                </Text>
                <Text
                  style={{
                    fontSize: fontSize(12),
                    lineHeight: hp(16),
                    fontFamily: fontFamily.poppins400,
                    color: '#7B7B7B',
                  }}>
                  You can't contact this user again.
                </Text>
              </View>
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

      {/*REPORT BOTTOM SHEET*/}
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

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        {/*<TouchableWithoutFeedback onPress={closeModal}>*/}

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              width: wp(340),
              height: hp(550),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(25),
                marginHorizontal: 20,
              }}>
              <Text
                style={{
                  fontSize: fontSize(20),
                  lineHeight: hp(30),
                  fontFamily: fontFamily.poppins500,
                  color: colors.black,
                }}>
                Your Match :
                <Text
                  style={{
                    color: colors.blue,
                    fontSize: fontSize(20),
                    lineHeight: hp(30),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  {' '}
                  {percentageMatchData?.matchPercentage}%
                </Text>
              </Text>

              <TouchableOpacity
                style={{
                  position: 'absolute',
                  right: -5,
                  height: hp(25),
                  width: hp(25),
                  justifyContent: 'center',
                  alignItems: 'center',
                  top: -15,
                }}
                onPress={closeModal}>
                <Image
                  source={icons.x_cancel_icon}
                  style={{
                    width: hp(13),
                    height: hp(13),
                    tintColor: 'black',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                marginTop: hp(26),
                flexDirection: 'row',
                alignSelf: 'center',
              }}>
              <Image
                source={{uri: user?.user?.profilePic}}
                style={{
                  width: hp(64),
                  height: hp(64),
                  borderRadius: 50,
                  marginRight: -15,
                  zIndex: 1,
                }}
              />

              <Image
                source={{uri: percentageMatchData?.profilePic}}
                style={{width: hp(64), height: hp(64), borderRadius: 50}}
              />
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: hp(15),
              }}>
              <Image
                source={icons.couple_icon}
                style={{
                  width: hp(16),
                  height: hp(14),
                  resizeMode: 'contain',
                  tintColor: '#8225AF',
                  marginRight: wp(10),
                }}
              />

              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(12),
                  lineHeight: hp(18),
                  fontFamily: fontFamily.poppins500,
                }}>
                You &{' '}
                {capitalizeFirstLetter(
                  percentageMatchData?.firstName || percentageMatchData?.name,
                )}{' '}
                Matched
              </Text>
            </View>

            <View
              style={{
                width: '100%',
                borderWidth: 0.8,
                borderColor: '#EAEAEA',
                marginTop: hp(17),
              }}
            />

            <Text
              style={{
                color: colors.blue,
                fontSize: fontSize(12),
                lineHeight: hp(18),
                fontFamily: fontFamily.poppins500,
                textAlign: 'center',
                marginTop: hp(17),
              }}>
              Based on Your Partner Preference
            </Text>

            <View style={{marginHorizontal: 20, marginTop: hp(13)}}>
              {step === 1 && (
                <>
                  <Text
                    style={{
                      fontSize: fontSize(12),
                      lineHeight: hp(18),
                      fontFamily: fontFamily.poppins400,
                      color: colors.black,
                    }}>
                    {percentageMatchData?.matchedFields?.[0]?.field
                      ? capitalizeFirstLetter(
                          percentageMatchData.matchedFields[0].field,
                        )
                      : 'N/A'}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(14),
                        lineHeight: hp(22),
                        fontFamily: fontFamily.poppins700,
                        color: colors.black,
                        width: '90%',
                      }}>
                      {percentageMatchData?.matchedFields?.[0]?.expected?.min ??
                        'N/A'}{' '}
                      to{' '}
                      {percentageMatchData?.matchedFields?.[0]?.expected?.max ??
                        'N/A'}
                    </Text>

                    <Image
                      source={
                        percentageMatchData?.matchedFields?.[0]?.isMatched
                          ? icons.check_gradient_icon
                          : icons.circle_cancel_icon
                      }
                      style={{
                        width: hp(18),
                        height: hp(18),
                        resizeMode: 'contain',
                      }}
                    />
                  </View>

                  <View style={{marginTop: hp(10)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      {percentageMatchData?.matchedFields?.[1]?.field
                        ? capitalizeFirstLetter(
                            percentageMatchData.matchedFields[1].field,
                          )
                        : 'N/A'}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(14),
                          lineHeight: hp(22),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                          width: '90%',
                        }}>
                        {percentageMatchData?.matchedFields?.[1]?.expected
                          ?.min ?? 'N/A'}{' '}
                        to{' '}
                        {percentageMatchData?.matchedFields?.[1]?.expected
                          ?.max ?? 'N/A'}
                      </Text>

                      <Image
                        source={
                          percentageMatchData?.matchedFields?.[1]?.isMatched
                            ? icons.check_gradient_icon
                            : icons.circle_cancel_icon
                        }
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </View>

                  <View style={{marginTop: hp(10)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      {percentageMatchData?.matchedFields?.[2]?.field
                        ? capitalizeFirstLetter(
                            percentageMatchData.matchedFields[2].field,
                          )
                        : 'N/A'}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(14),
                          lineHeight: hp(22),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                          width: '90%',
                        }}>
                        {percentageMatchData?.matchedFields?.[2]?.expected
                          ?.min ?? 'N/A'}{' '}
                        to{' '}
                        {percentageMatchData?.matchedFields?.[2]?.expected
                          ?.max ?? 'N/A'}{' '}
                        Lacs.
                      </Text>

                      <Image
                        source={
                          percentageMatchData?.matchedFields?.[2]?.isMatched
                            ? icons.check_gradient_icon
                            : icons.circle_cancel_icon
                        }
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </View>

                  <View style={{marginTop: hp(10)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      {percentageMatchData?.matchedFields?.[3]?.field
                        ? capitalizeFirstLetter(
                            percentageMatchData.matchedFields[3].field,
                          )
                        : 'N/A'}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(14),
                          lineHeight: hp(22),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                          width: '90%',
                        }}>
                        {percentageMatchData?.matchedFields?.[3]?.expected
                          ?.map(item => capitalizeFirstLetter(item))
                          ?.join(', ') ?? 'N/A'}
                      </Text>

                      <Image
                        source={
                          percentageMatchData?.matchedFields?.[3]?.isMatched
                            ? icons.check_gradient_icon
                            : icons.circle_cancel_icon
                        }
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </View>
                </>
              )}

              {step === 2 && (
                <>
                  <Text
                    style={{
                      fontSize: fontSize(12),
                      lineHeight: hp(18),
                      fontFamily: fontFamily.poppins400,
                      color: colors.black,
                    }}>
                    {percentageMatchData?.matchedFields?.[4]?.field
                      ? capitalizeFirstLetter(
                          percentageMatchData.matchedFields[4].field,
                        )
                      : 'N/A'}
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(14),
                        lineHeight: hp(22),
                        fontFamily: fontFamily.poppins700,
                        color: colors.black,
                        width: '90%',
                      }}>
                      {percentageMatchData?.matchedFields?.[4]?.expected
                        ?.map(item => capitalizeFirstLetter(item))
                        ?.join(', ') ?? 'N/A'}
                    </Text>

                    <Image
                      source={
                        percentageMatchData?.matchedFields?.[4]?.isMatched
                          ? icons.check_gradient_icon
                          : icons.circle_cancel_icon
                      }
                      style={{
                        width: hp(18),
                        height: hp(18),
                        resizeMode: 'contain',
                      }}
                    />
                  </View>

                  <View style={{marginTop: hp(10)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      {percentageMatchData?.matchedFields?.[5]?.field
                        ? capitalizeFirstLetter(
                            percentageMatchData.matchedFields[5].field,
                          )
                        : 'N/A'}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(14),
                          lineHeight: hp(22),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                          width: '90%',
                        }}>
                        {percentageMatchData?.matchedFields?.[5]?.expected
                          ?.map(item => capitalizeFirstLetter(item))
                          ?.join(', ') ?? 'N/A'}
                      </Text>

                      <Image
                        source={
                          percentageMatchData?.matchedFields?.[5]?.isMatched
                            ? icons.check_gradient_icon
                            : icons.circle_cancel_icon
                        }
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </View>

                  <View style={{marginTop: hp(10)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      {percentageMatchData?.matchedFields?.[6]?.field
                        ? capitalizeFirstLetter(
                            percentageMatchData.matchedFields[6].field,
                          )
                        : 'N/A'}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(14),
                          lineHeight: hp(22),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                          width: '90%',
                        }}>
                        {percentageMatchData?.matchedFields?.[6]?.expected
                          ?.map(capitalizeFirstLetter)
                          ?.join(', ') ?? 'N/A'}
                      </Text>

                      <Image
                        source={
                          percentageMatchData?.matchedFields?.[6]?.isMatched
                            ? icons.check_gradient_icon
                            : icons.circle_cancel_icon
                        }
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </View>

                  <View style={{marginTop: hp(10)}}>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(18),
                        fontFamily: fontFamily.poppins400,
                        color: colors.black,
                      }}>
                      {percentageMatchData?.matchedFields?.[7]?.field
                        ? capitalizeFirstLetter(
                            percentageMatchData.matchedFields[7].field,
                          )
                        : 'N/A'}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(14),
                          lineHeight: hp(22),
                          fontFamily: fontFamily.poppins700,
                          color: colors.black,
                          width: '90%',
                        }}>
                        {percentageMatchData?.matchedFields?.[7]?.expected
                          ?.map(item => capitalizeFirstLetter(item))
                          ?.join(', ') ?? 'N/A'}
                      </Text>

                      <Image
                        source={
                          percentageMatchData?.matchedFields?.[7]?.isMatched
                            ? icons.check_gradient_icon
                            : icons.circle_cancel_icon
                        }
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>

            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                width: '70%',
                position: 'absolute',
                bottom: 25,
                justifyContent: 'space-evenly',
                alignSelf: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleBackArrow}
                disabled={step === 1}
                style={{width: wp(30), alignItems: 'center'}}>
                <Image
                  source={icons.rightSideIcon}
                  style={[
                    {
                      width: hp(12),
                      height: hp(24),
                      resizeMode: 'contain',
                      transform: [{rotate: '180deg'}],
                    },
                    {tintColor: step === 1 ? '#E4E4E4' : 'black'},
                  ]}
                />
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {[1, 2].map(item => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setStep(item)}
                    style={[
                      {
                        width: 14,
                        height: 14,
                        borderRadius: 50,
                        marginHorizontal: 10,
                      },
                      {backgroundColor: step === item ? '#0F52BA' : '#ECECEC'},
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleNext}
                disabled={step === 2}
                style={{width: wp(30), alignItems: 'center'}}>
                <Image
                  source={icons.rightSideIcon}
                  style={[
                    {width: hp(12), height: hp(24), resizeMode: 'contain'},
                    {tintColor: step === 2 ? '#E4E4E4' : 'black'},
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/*</TouchableWithoutFeedback>*/}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
  },
  profileImage: {
    width: '100%',
    height: hp(449),
    borderRadius: 18,
    marginBottom: hp(13),
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  jobTitle: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  userDetailsTextStyle: {
    color: colors.white,
    fontSize: fontSize(11),
    lineHeight: hp(16),
    fontFamily: fontFamily.poppins400,
    marginRight: wp(2),
  },
  verticalLineStyle: {
    width: hp(1),
    backgroundColor: colors.darkGray,
    marginHorizontal: wp(10),
  },
  receivedShimmerContainer: {
    height: hp(449),
    marginHorizontal: 17,
  },
  receivedShimmerImageBody: {
    width: '100%',
    height: hp(449),
    borderRadius: 10,
    marginBottom: hp(13),
  },
  receivedShimmerImageBodyInside: {
    marginTop: -180,
    marginHorizontal: 17,
  },
  receivedShimmerName: {
    width: 100,
    height: 20,
  },
  receivedShimmerInsideOne: {
    marginTop: 10,
  },
  receivedShimmerData: {
    width: 100,
    height: 5,
  },
  receivedShimmerButtonContainer: {
    marginTop: 50,
    flexDirection: 'row',
  },
  receivedShimmerButton: {
    width: wp(142),
    height: hp(40),
    justifyContent: 'center',
    marginRight: 40,
  },
});

export default MatchesInSentScreen;
