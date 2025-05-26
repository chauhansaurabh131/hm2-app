import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  SafeAreaView,
  Text,
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Share,
  Clipboard,
  TextInput,
  Modal,
} from 'react-native';
import {useSelector} from 'react-redux';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../../utils/helpers';
import ProfileAvatar from '../../../components/letterProfileComponent';
import {icons, images} from '../../../assets';
import {style} from './style';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import RBSheet from 'react-native-raw-bottom-sheet';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesInRecentlyViewedScreen = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false); // Loading more indicator
  const [profileData, setProfileData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFirstName, setSelectedFirstName] = useState('');
  const [selectedUniqueId, setSelectedUniqueId] = useState('');
  const [blockedFriendId, setBlockedFriendId] = useState('');
  const [selectedUnfriendId, setSelectedUnfriendId] = useState('');
  const [reportReasons, setReportReasons] = useState([]);
  const [isAboutClicked, setIsAboutClicked] = useState(false);
  const [questionText, setQuestionText] = useState(
    'Why are you reporting this?',
  );
  const [aboutText, setAboutText] = useState('');
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [sheetHeight, setSheetHeight] = useState(hp(280));
  const [friendStatus, setFriendStatus] = useState('');
  const [isUnFriendModalVisible, setIsUnFriendModalVisible] = useState(false);
  const [allDataShare, setAllDataShare] = useState('');

  const sheetRef = useRef(null);
  const ReportBottomSheetRef = useRef();

  const openBottomSheets = status => {
    setFriendStatus(status); // update friend status

    const height = status === 'accepted' ? hp(340) : hp(280);
    setSheetHeight(height);

    // Wait for height to apply before opening
    setTimeout(() => {
      sheetRef.current?.open();
    }, 0);
  };

  const fetchProfile = useCallback(
    async (page = 1) => {
      if (!userId || !accessToken) {
        return;
      }

      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/profile-viewer/get-profile-viewerv2/${userId}?page=${page}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        const newProfiles = data?.data[0]?.paginatedResults || [];
        const total = data?.data[0]?.totalPages || 1;

        if (page === 1) {
          setProfileData(newProfiles);
        } else {
          setProfileData(prev => [...prev, ...newProfiles]);
        }
        setTotalPages(total);
        setCurrentPage(page);
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [userId, accessToken],
  );

  useEffect(() => {
    fetchProfile(1);
  }, [fetchProfile]);

  const loadMoreProfiles = () => {
    if (!loadingMore && currentPage < totalPages) {
      fetchProfile(currentPage + 1);
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
      setProfileData(prevData => {
        return prevData.map(user =>
          user._id === shortlistId
            ? {
                ...user,
                shortlistData: {
                  ...response.data.data,
                  _id: response.data.data.id, // normalize to _id
                },
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
      setProfileData(prevData => {
        return prevData.map(user =>
          user.shortlistData?.id === shortlistId
            ? {
                ...user,
                shortlistData: null, // or undefined
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

  // ON SHARE FUNCTION
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

  // COPY ID FUNCTION
  const onCopyIdPress = async selectedUniqueId => {
    await Clipboard.setString(selectedUniqueId);
    sheetRef.current.close();
    CopyId();
  };

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

  // BLOCKED USER FUNCTION
  const handleBlockProfilePress = () => {
    sheetRef.current.close();
    setIsBlockModalVisible(true);
  };

  const handleConfirmBlock = async () => {
    if (!blockedFriendId || !userId) {
      return;
    }

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
        setIsBlockModalVisible(false);

        // ✅ Correctly remove the blocked user by matching `item.user._id`
        setProfileData(prev =>
          prev.filter(item => item?.user?._id !== blockedFriendId),
        );
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

  const onUnfriendPress = () => {
    console.log(
      ' === onUnfriendPress ===> ',
      blockedFriendId,
      selectedUnfriendId,
    );
    sheetRef.current.close();
    setIsUnFriendModalVisible(true);
  };

  const handleConfirmUnFriend = async () => {
    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/friend/respond-friend-req',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user: blockedFriendId,
            request: selectedUnfriendId,
            status: 'removed',
          }),
        },
      );

      if (response.status === 200) {
        // ✅ Update profileData using user.user._id
        setProfileData(prevData =>
          prevData.map(user =>
            user.user?._id === blockedFriendId
              ? {
                  ...user,
                  friendsDetails: {
                    ...user.friendsDetails,
                    status: 'removed',
                  },
                }
              : user,
          ),
        );

        setIsUnFriendModalVisible(false);
        // Optional success message
        // Alert.alert('Success', 'User successfully unfriended.');
      } else {
        const errorResponse = await response.json();
        console.error('Unfriend failed:', errorResponse);
        Alert.alert('Error', 'Failed to unfriend the user.');
      }
    } catch (error) {
      console.error('Error during API call:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const handlePress = items => {
    console.log(' === handlePress ===> ', items?.user?._id);

    const matchesUserData = {
      firstName: items?.user?.name,
      id: items?.user?._id,
      userData: items,
    };
    // console.log(' === items____ ===> ', matchesUserData);
    navigation.navigate('NewUserDetailsScreen', {matchesUserData});
  };

  const renderItem = ({item}) => {
    const {selectedPlan, status} = item?.user?.subscriptionDetails || {};

    // Determine if the selected plan is 'gold' (for the crown icon)
    const isGoldPlan = selectedPlan === 'gold';
    const isSilverPlan = selectedPlan === 'silver';
    const isPlatinumPlan = selectedPlan === 'Platinum';

    const subPlan = isGoldPlan || isSilverPlan || isPlatinumPlan;

    const planName = item?.user?.subscriptionDetails?.selectedPlan
      ? item?.user?.subscriptionDetails?.selectedPlan.charAt(0).toUpperCase() +
        item?.user?.subscriptionDetails?.selectedPlan.slice(1).toLowerCase()
      : '';

    const imageUrl = item?.user?.profilePic;

    const profilePrivacy =
      (item?.user?.privacySettingCustom?.profilePhotoPrivacy === true ||
        item?.user?.privacySettingCustom?.showPhotoToFriendsOnly === true) &&
      item?.friendsDetails?.status !== 'accepted';

    const firstName = item?.user?.firstName
      ? item?.user?.firstName.charAt(0).toUpperCase() +
        item?.user?.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item?.user?.lastName
      ? item?.user?.lastName.charAt(0).toUpperCase() +
        item?.user?.lastName.slice(1).toLowerCase()
      : '';

    const name = item?.user?.name
      ? item?.user?.name.charAt(0).toUpperCase() +
        item?.user?.name.slice(1).toLowerCase()
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

    const age = calculateAge(item?.user?.dateOfBirth);

    const height = item?.user?.height;

    const jobTittle = item?.user?.userProfessional?.jobTitle
      ? item?.user?.userProfessional?.jobTitle.charAt(0).toUpperCase() +
        item?.user?.userProfessional?.jobTitle.slice(1).toLowerCase()
      : '';

    const currentCity = item?.user?.address?.currentCity
      ? item?.user?.address?.currentCity.charAt(0).toUpperCase() +
        item?.user?.address?.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item?.user?.address?.currentCountry
      ? item?.user?.address?.currentCountry.charAt(0).toUpperCase() +
        item?.user?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    const imageCount = Array.isArray(item?.user?.userProfilePic)
      ? item?.user?.userProfilePic?.length
      : 0;

    const userAllImage = Array.isArray(item?.user?.userProfilePic)
      ? item?.user?.userProfilePic.map(pic => pic.url)
      : [];

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    const uniqueId = item?.user?.userUniqueId;
    const blockedFriendIds = item?.user?._id;
    const unfriendID = item?.friendsDetails?._id;
    const AllDetailsPass = item;

    // console.log(' === var ===> ', item?.friendsDetails?._id);

    const onThreeDotPress = () => {
      const status = item?.friendsDetails?.status;

      setSelectedFirstName(firstName || name);
      setSelectedUniqueId(uniqueId);
      setBlockedFriendId(blockedFriendIds);
      setSelectedUnfriendId(unfriendID);
      setAllDataShare(AllDetailsPass);

      openBottomSheets(status);

      // sheetRef.current.open();
    };

    const starIconSource =
      item?.shortlistData?.id || item?.shortlistData?._id
        ? icons.black_check_icon
        : icons.black_start_icon;

    return (
      <SafeAreaView style={style.container}>
        <View>
          {imageUrl ? (
            <>
              <Image source={{uri: imageUrl}} style={style.profileImage} />
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
            <ProfileAvatar
              firstName={item?.user?.firstName || item?.user?.name}
              lastName={item?.user?.lastName}
              textStyle={{
                width: '100%',
                height: hp(449),
                borderRadius: 18,
                marginBottom: hp(13),
              }}
              profileTexts={{fontSize: fontSize(60), marginTop: -80}}
            />
          )}
          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
            style={style.imageBorderBottomShadow}
          />

          <View style={style.imageBottomDataContainer}>
            <View style={style.onlineTextBody}>
              <Text style={style.onlineText}>Online</Text>
            </View>

            <View>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  handlePress(item);
                }}>
                <View style={style.cardNameContainer}>
                  <Text style={style.nameText}>
                    {firstName || name} {lastName}
                  </Text>
                  {subPlan && (
                    <View style={style.subPlanContainer}>
                      <Image source={icons.crownIcon} style={style.crowIcon} />
                      <Text style={style.planNameText}>{planName}</Text>
                    </View>
                  )}
                </View>

                <View style={style.detailsContainer}>
                  <Text style={style.userDetailsTextStyle}>{age} yrs,</Text>
                  <Text style={style.userDetailsTextStyle}> {height}</Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>
                    {jobTittle || 'N/A'}
                  </Text>
                </View>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>{currentCity},</Text>

                  <Text style={style.userDetailsTextStyle}>
                    {' '}
                    {currentCountry}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={style.bottomImagesContainer}>
              <Image
                source={images.gradient_button_background_img}
                style={style.gradientImageBody}
              />

              <TouchableOpacity
                activeOpacity={0.5}
                // onPress={openModal}
                style={style.coupleImageContainer}>
                <Image source={icons.couple_icon} style={style.coupleIcon} />
                <Text style={style.matchesDataText}>
                  {item?.matchPercentage}% Match
                </Text>
              </TouchableOpacity>

              <View style={style.bottomImagesSecondContainer}>
                {(!profilePrivacy ||
                  item?.friendsDetails?.status === 'accepted') && (
                  <TouchableOpacity
                    style={style.counterImageContainer}
                    activeOpacity={0.5}
                    onPress={userAllImageShare}>
                    <Image
                      source={icons.new_camera_icon}
                      style={style.cameraIcon}
                    />

                    <Text style={{color: colors.white}}>{imageCount}</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  // onPress={() => handleShortListPress(item)}
                  onPress={() => {
                    if (item?.shortlistData?._id) {
                      removeFromShortlist(item.shortlistData._id);
                    } else {
                      addToShortlist(item._id);
                    }
                  }}
                  activeOpacity={0.5}
                  style={style.starImageContainer}>
                  <Image source={starIconSource} style={style.starIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={onThreeDotPress}
                  style={style.threeDotContainer}>
                  <Image
                    source={icons.new_three_dot}
                    style={style.threeDotImage}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  };

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
    <SafeAreaView>
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

      {loading && currentPage === 1 ? (
        // <ActivityIndicator size="large" color="#0000ff" />
        <View style={style.receivedShimmerContainer}>
          <ShimmerPlaceholder style={style.receivedShimmerImageBody} />
          <View style={style.receivedShimmerImageBodyInside}>
            <ShimmerPlaceholder style={style.receivedShimmerName} />

            <View style={style.receivedShimmerInsideOne}>
              <ShimmerPlaceholder style={style.receivedShimmerData} />
            </View>

            <View style={style.receivedShimmerButtonContainer}>
              <ShimmerPlaceholder style={style.receivedShimmerButton} />
              <ShimmerPlaceholder style={style.receivedShimmerButton} />
            </View>
          </View>
        </View>
      ) : profileData?.length === 0 ? (
        <View style={style.noFriendDataContaier}>
          <Image source={icons.no_Profile_Found_img} style={style.noImage} />
          <Text style={style.noFriendText}>No Recently Viewed</Text>
        </View>
      ) : (
        <FlatList
          data={profileData}
          extraData={profileData}
          keyExtractor={(item, index) =>
            item?.id?.toString() || index.toString()
          }
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 200}}
          ListEmptyComponent={
            <Text style={style.emptyText}>No profiles viewed recently.</Text>
          }
          onEndReached={loadMoreProfiles}
          showsVerticalScrollIndicator={false}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : null
          }
        />
      )}

      {/*//THREE DOT BOTTOM SHEET OPEN*/}
      <RBSheet
        ref={sheetRef}
        // height={hp(430)} // Height of the bottom sheet
        height={sheetHeight}
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
          <View style={style.threeDotBottomSheetContainer}>
            <TouchableOpacity
              onPress={handleShare}
              style={style.threeDotBottomSheetBody}>
              <Image
                source={icons.share_icon}
                style={style.threeDotBottomSheetIcon}
              />
              <Text style={style.threeDotBottomSheetTittleText}>
                Share Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onCopyIdPress(selectedUniqueId);
              }}
              style={style.threeDotBottomSheetContainers}>
              <Image
                source={icons.copy_id_card_icon}
                style={style.threeDotBottomSheetIcon}
              />
              <Text style={style.threeDotBottomSheetTittleText}>
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
              style={style.threeDotBottomSheetContainers}>
              <Image
                source={icons.new_report_icon}
                style={[style.threeDotBottomSheetIcon, {top: -8}]}
              />
              <View>
                <Text style={style.threeDotBottomSheetTittleText}>Report</Text>

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
              style={style.threeDotBottomSheetContainers}>
              <Image
                source={icons.block_icon}
                style={[style.threeDotBottomSheetIcon, {top: -8}]}
              />

              <View>
                <Text style={style.threeDotBottomSheetTittleText}>
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

            {friendStatus === 'accepted' && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    onUnfriendPress();
                  }}
                  style={style.threeDotBottomSheetContainers}>
                  <Image
                    source={icons.unFriend_icon}
                    style={[style.threeDotBottomSheetIcon, {top: -8}]}
                  />

                  <View>
                    <Text style={style.threeDotBottomSheetTittleText}>
                      Unfriend
                    </Text>
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        lineHeight: hp(16),
                        fontFamily: fontFamily.poppins400,
                        color: '#7B7B7B',
                      }}>
                      This user will be permanently deleted.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/*<View*/}
                {/*  style={{*/}
                {/*    width: '100%',*/}
                {/*    height: 1,*/}
                {/*    backgroundColor: '#EBEBEB',*/}
                {/*    marginTop: hp(22),*/}
                {/*  }}*/}
                {/*/>*/}

                {/*<TouchableOpacity*/}
                {/*  onPress={() => {*/}
                {/*    onSendMessagePress(allDataShare);*/}
                {/*  }}*/}
                {/*  style={style.threeDotBottomSheetContainers}>*/}
                {/*  <Image*/}
                {/*    source={icons.send_message_icon}*/}
                {/*    style={[style.threeDotBottomSheetIcon, {top: -8}]}*/}
                {/*  />*/}

                {/*  <View>*/}
                {/*    <Text style={style.threeDotBottomSheetTittleText}>*/}
                {/*      Send Message*/}
                {/*    </Text>*/}

                {/*    <Text*/}
                {/*      style={{*/}
                {/*        fontSize: fontSize(12),*/}
                {/*        lineHeight: hp(16),*/}
                {/*        fontFamily: fontFamily.poppins400,*/}
                {/*        color: '#7B7B7B',*/}
                {/*      }}>*/}
                {/*      Send a direct message.*/}
                {/*    </Text>*/}
                {/*  </View>*/}
                {/*</TouchableOpacity>*/}
              </>
            )}
          </View>
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
          <View style={style.reportBottomSheetContainer}>
            {(reportReasons.length > 0 || isAboutClicked) && (
              <TouchableOpacity
                onPress={handleBackArrow}
                style={style.ReportBottomSheetBackButtonContainer}>
                <Image
                  source={icons.back_arrow_icon}
                  style={style.RBSBackArrowIcon}
                />
              </TouchableOpacity>
            )}

            <Text style={style.BRSTittleText}>Report</Text>
          </View>

          <View style={style.RBSUnderLine} />

          <Text style={style.RBSQuestionText}>{questionText}</Text>

          {reportReasons.length < 1 && !isAboutClicked && (
            <View style={style.RBSSubTittleTextContainer}>
              <Text style={style.RBSSubTittleText}>
                Your identity will remain anonymous to the
              </Text>
              <Text style={style.RBSSubTittleSubText}>reported user.</Text>
            </View>
          )}

          {/* Show the list of reasons if there are any */}
          {isAboutClicked ? (
            // If "About" is clicked, show the TextInput and Submit button
            <View style={style.RBSTextInputContainer}>
              <TextInput
                style={style.RBSTextInputBody}
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
                  style={style.RBSSubmitButtonContainer}>
                  <Text style={style.RBSSubmitButtonText}>Submit Report</Text>
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
                <Text style={style.RBSReasonText}>{reason}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={style.RBSSpamTextContainer}>
              <TouchableOpacity onPress={handleInappropriateContent}>
                <Text style={style.RBSSpamText}>Inappropriate content</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={style.RBSSpamTextBody}
                onPress={handleHarassmentOrBullying}>
                <Text style={style.RBSSpamText}>Harassment or bullying.</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={style.RBSSpamTextBody}
                onPress={handleFakeMisleadingProfile}>
                <Text style={style.RBSSpamText}>
                  Fake or misleading profile.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={style.RBSSpamTextBody}
                onPress={handleSpamPromotionalContent}>
                <Text style={style.RBSSpamText}>
                  Spam or promotional content.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={style.RBSSpamTextBody}
                onPress={handleScamsFraudulentActivity}>
                <Text style={style.RBSSpamText}>
                  Scams or fraudulent activity.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={style.RBSSpamTextBody}
                onPress={() => setIsAboutClicked(true)} // Handle About click
              >
                <Text style={style.RBSSpamText}>Others</Text>
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
        <View style={style.RBSSubmitModalContainer}>
          <View style={style.RBSSubmitModalBody}>
            <Text style={style.RBSSubmitModalTittle}>
              Thank you for your report.
            </Text>

            <View style={style.RBSSubmitModalSubContainer}>
              <Text style={style.RBSSubmitModalSubTittle}>
                We’ll review it soon to help keep
              </Text>
              <Text style={style.RBSSubmitModalSubTittles}>
                our community safe.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={style.RBSSubmitModalOkButton}
              onPress={handleCloseModal}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1.5}}
                style={style.RBSSubmitModalOkButtonBody}>
                <Text style={style.RBSSubmitModalOkButtonText}>Okay</Text>
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
        <View style={style.blockModalContainer}>
          <View style={style.blockModalContainerBody}>
            <Text style={style.blockModalTittleText}>
              Are you sure you want to
            </Text>
            <Text style={style.blockModalSubTittleText}>Block This User ?</Text>

            <View style={style.blockModalButtonContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleConfirmBlock}>
                <LinearGradient
                  colors={['#2D46B9', '#8D1D8D']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={style.blockModalYesButtonBody}>
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
                  style={style.blockModalNoButtonContainer}>
                  <View style={style.blockModalNoButtonBody}>
                    <Text style={style.blockModalNoButtonText}>No</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for UnFriend confirmation */}
      <Modal
        visible={isUnFriendModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsUnFriendModalVisible(false)}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: wp(320),
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
            }}>
            <View>
              <Text
                style={{
                  fontSize: fontSize(16),
                  color: 'black',
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  marginTop: hp(30),
                  textAlign: 'center',
                }}>
                Are yor sure want to unfriend?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp(42),
                }}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleConfirmUnFriend}>
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
                    setIsUnFriendModalVisible(false);
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
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default MatchesInRecentlyViewedScreen;
