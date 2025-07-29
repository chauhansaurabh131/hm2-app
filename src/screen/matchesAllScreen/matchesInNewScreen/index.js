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
import style from './style';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {colors} from '../../../utils/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import {non_friend_Blocked} from '../../../actions/homeActions';
import Toast from 'react-native-toast-message';
import ProfileAvatar from '../../../components/letterProfileComponent';
import axios from 'axios';

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
  const [percentageLoader, setPercentageLoader] = useState(null);
  const [percentageMatchData, setPercentageMatchData] = useState([]);

  // console.log(
  //   ' === percentageMatchData---- ===> ',
  //   percentageMatchData?.matchedFields,
  // );

  const ReportBottomSheetRef = useRef();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const Login_User_ID = user?.user?.id;

  // Function to open the bottom sheet
  const openBottomSheet = () => {
    sheetRef.current.close();
    ReportBottomSheetRef.current.open();
  };

  const dispatch = useDispatch();

  // const openModal = item => {
  //   console.log(' === openModal___ ===> ', item?._id, item?.firstName);
  //
  //   // setModalVisible(true);
  //   setStep(1); // Reset step to 1 when modal opens
  // };

  const capitalizeFirstLetter = str => {
    if (!str) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const openModal = async item => {
    console.log(' === openModal___ ===> ', item?._id, item?.firstName);

    try {
      // setLoading(true); // Show loading indicator
      setPercentageLoader(item._id);

      // Call the API to get match details
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/user/get-match-user/${item._id}`,
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
        // Here you can process the match data and update your modal content
        // For example, you might want to store it in state:
        // setMatchDetails(matchData);
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
          user._id === shortlistId
            ? {
                ...user,
                userShortListDetails: response.data.data, // Updated shortlist details
              }
            : user,
        );
      });

      ShowToast();

      // Optionally, trigger another API to refresh the list if needed
      // fetchNewUserData(); // Re-fetch user data
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
          user.userShortListDetails?.id === shortlistId
            ? {
                ...user,
                userShortListDetails: {}, // Set to null after removal
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

  const renderUserItem = ({item}) => {
    const planName = item?.subscriptionDetails?.selectedPlan
      ? item?.subscriptionDetails?.selectedPlan.charAt(0).toUpperCase() +
        item?.subscriptionDetails?.selectedPlan.slice(1).toLowerCase()
      : '';

    const hasValidImage =
      item.profilePic &&
      item.profilePic !== 'null' &&
      item.profilePic.trim() !== '';

    const profilePrivacy =
      item.privacySettingCustom?.profilePhotoPrivacy === true ||
      item.privacySettingCustom?.showPhotoToFriendsOnly === true;

    const {selectedPlan, status} = item?.subscriptionDetails || {};

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

    const userAllImage = Array.isArray(item?.userProfilePic)
      ? item.userProfilePic.map(pic => pic.url)
      : [];

    const blockedFriendId = item?._id;
    const uniqueId = item?.userUniqueId;

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

    const handlePress = items => {
      const matchesUserData = {
        firstName: items.name,
        id: items?._id,
      };
      navigation.navigate('NewUserDetailsScreen', {matchesUserData});
    };

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    const onThreeDotPress = () => {
      setSelectedFirstName(firstName);
      setSelectedUniqueId(uniqueId);
      setBlockedFriendId(blockedFriendId);

      sheetRef.current.open();
    };

    const starIconSource = item?.userShortListDetails?.id
      ? icons.black_check_icon
      : icons.black_start_icon;

    return (
      <View style={{marginHorizontal: 17}}>
        <TouchableOpacity activeOpacity={1}>
          <View>
            {/*<Image*/}
            {/*  source={*/}
            {/*    profileImage ? {uri: profileImage} : images.empty_male_Image*/}
            {/*  }*/}
            {/*  style={style.userImageStyle}*/}
            {/*  resizeMode={'cover'}*/}
            {/*/>*/}

            {hasValidImage ? (
              <>
                <Image
                  source={{uri: item.profilePic}}
                  style={style.userImageStyle}
                />
                {profilePrivacy && (
                  <Image
                    source={icons.logLogo} // make sure you have a `lock` icon inside `icons`
                    style={style.logoIcon}
                  />
                )}
              </>
            ) : (
              <>
                <ProfileAvatar
                  firstName={item.firstName || item.name}
                  lastName={item.lastName}
                  textStyle={style.userImageStyle}
                  profileTexts={style.profileAvatarText}
                />
              </>
            )}

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
                <View style={style.cardNameContainer}>
                  <Text style={style.userNameTextStyle}>
                    {firstName || item.name} {lastName || ' '}
                  </Text>

                  {subPlan && (
                    <View style={style.subPlanContainer}>
                      <Image source={icons.crownIcon} style={style.crowIcon} />
                      <Text style={style.planNameText}>{planName}</Text>
                    </View>
                  )}
                </View>

                <View
                  style={[
                    style.userDetailsDescriptionContainer,
                    {marginTop: 3},
                  ]}>
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

                  <Text style={style.userDetailsTextStyle}>
                    {' '}
                    {workCountry || 'N/A'}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={style.cardBottomContainer}>
                <Image
                  source={images.gradient_button_background_img}
                  style={style.gradientButtonBG}
                />

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    openModal(item);
                  }}
                  style={style.coupleImgContainer}
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
                        style={style.coupleImg}
                      />
                      <Text style={style.couplePercentageContainer}>
                        {item?.matchPercentage}% Match
                      </Text>
                    </>
                  )}
                </TouchableOpacity>

                <View style={style.cardBottomRightCon}>
                  {!profilePrivacy && (
                    <TouchableOpacity
                      style={style.imageCountCon}
                      activeOpacity={0.5}
                      onPress={userAllImageShare}>
                      <Image
                        source={icons.new_camera_icon}
                        style={style.cameraImg}
                      />

                      <Text style={{color: colors.white}}>{imageCount}</Text>
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={() => {
                      if (item?.userShortListDetails?.id) {
                        removeFromShortlist(item.userShortListDetails.id);
                      } else {
                        addToShortlist(item._id);
                      }
                    }}
                    activeOpacity={0.5}
                    style={style.shortListCon}>
                    <Image source={starIconSource} style={style.shortListImg} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onThreeDotPress}
                    style={style.threeDotCon}>
                    <Image
                      source={icons.new_three_dot}
                      style={style.threeDotImg}
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
      <SafeAreaView style={style.loadingContainer}>
        <View style={style.loadingBodyCon}>
          <ShimmerPlaceholder style={style.loadingBodyMain} />

          <View style={style.loadingCenterCon}>
            <ShimmerPlaceholder style={style.loadingCenterOne} />

            <View style={{marginTop: 10}}>
              <ShimmerPlaceholder style={style.loadingCenterTwo} />
            </View>

            <View style={style.loadingBottomCon}>
              <ShimmerPlaceholder style={style.loadingBottomButton} />
              <ShimmerPlaceholder style={style.loadingBottomButton} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const toastConfigs = {
    AddShortlisted: ({text1}) => (
      <View style={style.staticToastBody}>
        <Text style={style.staticToastText}>{text1}</Text>
      </View>
    ),

    RemoveShortlisted: ({text1}) => (
      <View style={style.staticToastBody}>
        <Text style={style.staticToastText}>{text1}</Text>
      </View>
    ),

    Copied: ({text1}) => (
      <View style={style.staticToastBody}>
        <Text style={style.staticToastText}>{text1}</Text>
      </View>
    ),
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.toastDisplayContainer}>
        <Toast config={toastConfigs} />
      </View>

      <FlatList
        data={data}
        renderItem={renderUserItem}
        // keyExtractor={item => item._id || item.id || item.name}
        keyExtractor={(item, index) => `${item._id}_${index}`}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        // ListFooterComponent={isFetchingMore ? <ActivityIndicator /> : null}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={{alignItems: 'center'}}>
              <Text style={{color: 'black'}}>Loading Data..</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading && !isFetchingMore ? (
            <View style={style.emptyListContainer}>
              <Text style={{color: 'black'}}>No data available</Text>
            </View>
          ) : null
        }
        contentContainerStyle={style.listContainer} // Added this line
      />

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
                Your Match :
                <Text style={style.tittleTextNum}>
                  {' '}
                  {percentageMatchData?.matchPercentage}%
                </Text>
              </Text>

              <TouchableOpacity
                style={style.cancelIconContainer}
                onPress={closeModal}>
                <Image source={icons.x_cancel_icon} style={style.cancelIcon} />
              </TouchableOpacity>
            </View>

            <View style={style.matchImageContainer}>
              <Image
                source={{uri: user?.user?.profilePic}}
                style={style.firstImageStyle}
              />

              <Image
                source={{uri: percentageMatchData?.profilePic}}
                style={style.secondImageStyle}
              />
            </View>

            <View style={style.matchNameContainer}>
              <Image source={icons.couple_icon} style={style.coupleIcon} />

              <Text style={style.matchName}>
                You &{' '}
                {capitalizeFirstLetter(
                  percentageMatchData?.firstName || percentageMatchData?.name,
                )}{' '}
                Matched
              </Text>
            </View>

            <View style={style.underLineStyle} />

            <Text style={style.modalBodyDescription}>
              Based on Your Partner Preference
            </Text>

            <View style={style.modalBodyContainer}>
              {step === 1 && (
                <>
                  <Text style={style.tittleTextStyle}>
                    {percentageMatchData?.matchedFields?.[0]?.field
                      ? capitalizeFirstLetter(
                          percentageMatchData.matchedFields[0].field,
                        )
                      : 'N/A'}
                  </Text>

                  <View style={style.subTittleContainer}>
                    <Text style={style.subTittleText}>
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
                      style={style.checkIcon}
                    />
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>
                      {percentageMatchData?.matchedFields?.[1]?.field
                        ? capitalizeFirstLetter(
                            percentageMatchData.matchedFields[1].field,
                          )
                        : 'N/A'}
                    </Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
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
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>
                      {percentageMatchData?.matchedFields?.[2]?.field
                        ? capitalizeFirstLetter(
                            percentageMatchData.matchedFields[2].field,
                          )
                        : 'N/A'}
                    </Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
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
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>
                      {percentageMatchData?.matchedFields?.[3]?.field
                        ? capitalizeFirstLetter(
                            percentageMatchData.matchedFields[3].field,
                          )
                        : 'N/A'}
                    </Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
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
                        style={style.checkIcon}
                      />
                    </View>
                  </View>
                </>
              )}

              {step === 2 && (
                <>
                  <Text style={style.tittleTextStyle}>
                    {percentageMatchData?.matchedFields?.[4]?.field
                      ? capitalizeFirstLetter(
                          percentageMatchData.matchedFields[4].field,
                        )
                      : 'N/A'}
                  </Text>

                  <View style={style.subTittleContainer}>
                    <Text style={style.subTittleText}>
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
                      style={style.checkIcon}
                    />
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>
                      {percentageMatchData?.matchedFields?.[5]?.field
                        ? capitalizeFirstLetter(
                            percentageMatchData.matchedFields[5].field,
                          )
                        : 'N/A'}
                    </Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
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
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>
                      {percentageMatchData?.matchedFields?.[6]?.field
                        ? capitalizeFirstLetter(
                            percentageMatchData.matchedFields[6].field,
                          )
                        : 'N/A'}
                    </Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
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
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>
                      {percentageMatchData?.matchedFields?.[7]?.field
                        ? capitalizeFirstLetter(
                            percentageMatchData.matchedFields[7].field,
                          )
                        : 'N/A'}
                    </Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
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
                {[1, 2].map(item => (
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
                disabled={step === 2}
                style={style.nextIconContainer}>
                <Image
                  source={icons.rightSideIcon}
                  style={[
                    style.nextIcon,
                    {tintColor: step === 2 ? '#E4E4E4' : 'black'},
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
        height={hp(300)}
        closeOnDragDown={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <View style={{flex: 1}}>
          <View style={style.bottomSheetContainer}>
            <TouchableOpacity
              onPress={handleShare}
              style={style.firstLitterContainer}>
              <Image source={icons.share_icon} style={style.bottomSheetIcon} />

              <Text style={style.bottomSheetText}>Share Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onCopyIdPress(selectedUniqueId);
              }}
              style={[style.firstLitterContainer, {marginTop: hp(20)}]}>
              <Image
                source={icons.copy_id_card_icon}
                style={style.bottomSheetIcon}
              />

              <Text style={style.bottomSheetText}>
                Copy ID : {selectedUniqueId}
              </Text>
            </TouchableOpacity>

            <View style={style.bottomSheetLine} />

            <TouchableOpacity
              onPress={openBottomSheet}
              style={[style.firstLitterContainer, {marginTop: hp(20)}]}>
              <Image
                source={icons.new_report_icon}
                style={[style.bottomSheetIcon, {top: -8}]}
              />

              <View>
                <Text style={style.bottomSheetText}>Report</Text>

                <Text style={style.bottomSheetSubTittle}>
                  Your report will be anonymous.
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleBlockProfilePress(blockedFriendId);
              }}
              style={[style.firstLitterContainer, {marginTop: hp(20)}]}>
              <Image
                source={icons.block_icon}
                style={[style.bottomSheetIcon, {top: -8}]}
              />

              <View>
                <Text style={style.bottomSheetText}>
                  Block {selectedFirstName}
                </Text>

                <Text style={style.bottomSheetSubTittle}>
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
        <View style={style.blockModalContainer}>
          <View style={style.blockModalBody}>
            <Text style={style.blockModalTittle}>Are you sure you want to</Text>
            <Text style={style.blockModalSubTittle}>Block This User?</Text>

            <View style={style.blockModalButtonCon}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleConfirmBlock}>
                <LinearGradient
                  colors={['#2D46B9', '#8D1D8D']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={style.blockModalYesBTNCon}>
                  <Text style={style.blockModalYesText}>Yes</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  setIsBlockModalVisible(false);
                }}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  style={style.blockModalBoBTNCon}>
                  <View style={style.blockModalBoBTNBody}>
                    <Text style={style.blockModalNoText}>No</Text>
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
          <View style={style.reportCon}>
            {(reportReasons.length > 0 || isAboutClicked) && (
              <TouchableOpacity
                onPress={handleBackArrow}
                style={style.reportBackArrowContainer}>
                <Image
                  source={icons.back_arrow_icon}
                  style={style.reportBackIcon}
                />
              </TouchableOpacity>
            )}

            <Text style={style.reportText}>Report</Text>
          </View>

          <View style={style.reportLine} />

          <Text style={style.reportQuesText}>{questionText}</Text>

          {reportReasons.length < 1 && !isAboutClicked && (
            <View style={style.reportReasonCon}>
              <Text style={style.reportReasonTittle}>
                Your identity will remain anonymous to the
              </Text>
              <Text style={style.reportReasonTittle}>reported user.</Text>
            </View>
          )}

          {/* Show the list of reasons if there are any */}
          {isAboutClicked ? (
            // If "About" is clicked, show the TextInput and Submit button
            <View style={style.reportAboutCon}>
              <TextInput
                style={style.reportAboutTextInput}
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
                  style={style.submitReportCon}>
                  <Text style={style.submitReportText}>Submit Report</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : reportReasons.length > 0 ? (
            reportReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleReportReasonClick(reason, questionText)} // Close the bottom sheet when clicked
              >
                <Text style={style.reportReasonText}>{reason}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={style.reportReasonContainer}>
              <TouchableOpacity onPress={handleInappropriateContent}>
                <Text style={style.reportReasonTexts}>
                  Inappropriate content
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginTop: hp(28)}}
                onPress={handleHarassmentOrBullying}>
                <Text style={style.reportReasonTexts}>
                  Harassment or bullying.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginTop: hp(28)}}
                onPress={handleFakeMisleadingProfile}>
                <Text style={style.reportReasonTexts}>
                  Fake or misleading profile.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginTop: hp(28)}}
                onPress={handleSpamPromotionalContent}>
                <Text style={style.reportReasonTexts}>
                  Spam or promotional content.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginTop: hp(28)}}
                onPress={handleScamsFraudulentActivity}>
                <Text style={style.reportReasonTexts}>
                  Scams or fraudulent activity.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginTop: hp(28)}}
                onPress={() => setIsAboutClicked(true)} // Handle About click
              >
                <Text style={style.reportReasonTexts}>Others</Text>
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
        <View style={style.successModalCon}>
          <View style={style.successModalBody}>
            <Text style={style.successModalTittle}>
              Thank you for your report.
            </Text>

            <View style={style.successModalSubTittleCon}>
              <Text style={style.successModalSubTittle}>
                We’ll review it soon to help keep
              </Text>
              <Text
                style={[style.successModalSubTittle, {textAlign: 'center'}]}>
                our community safe.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={style.successOkCon}
              onPress={handleCloseModal}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1.5}}
                style={style.successOkBody}>
                <Text style={style.successOkBtnText}>Okay</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MatchesInNewScreen;
