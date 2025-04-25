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
  Modal,
  TextInput,
  Clipboard,
} from 'react-native';
import {colors} from '../../../utils/colors';
import {useDispatch, useSelector} from 'react-redux';
import {icons, images} from '../../../assets';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../../utils/helpers';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import Toast from 'react-native-toast-message';
import RBSheet from 'react-native-raw-bottom-sheet';
import {accepted_Decline_Request} from '../../../actions/homeActions';
import style from '../../matchesScreen/style';
import ProfileAvatar from '../../../components/letterProfileComponent';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesInSavedScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [selectedFirstName, setSelectedFirstName] = useState('');
  const [selectedUniqueId, setSelectedUniqueId] = useState('');
  const [selectUserFriendId, setSelectUserFriendId] = useState('');
  const [selectUserUnfriendId, setSelectUserUnfriendId] = useState('');
  const [allDataShare, setAllDataShare] = useState('');
  const [blockedFriendId, setBlockedFriendId] = useState('');
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [isUnFriendModalVisible, setIsUnFriendModalVisible] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [questionText, setQuestionText] = useState(
    'Why are you reporting this?',
  );
  const [isAboutClicked, setIsAboutClicked] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [isReportModalVisible, setReportModalVisible] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;
  const unFriendBottomSheet = useRef(null);
  const friendBottomSheet = useRef(null);
  const ReportBottomSheetRef = useRef();

  // console.log(' === userId ===> ', user?.user);

  // const status = userDetails?.friendsDetails?.status;
  //
  // // console.log(' === onThreeDotPress__ ===> ', status);
  //
  // if (status === 'accepted') {

  // Function to open the bottom sheet
  const openBottomSheet = () => {
    unFriendBottomSheet.current.close();
    friendBottomSheet.current.close();
    ReportBottomSheetRef.current.open();
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
        `https://stag.mntech.website/api/v1/user/shortlist/get-short-list-mobile/${userId}?page=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const json = await response.json();
      console.log('API response:', json);

      const newData = json?.data?.[0]?.paginatedResults || [];
      if (newData.length === 0) {
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

  const handleShortListPress = async item => {
    const deleteShortListId = item?._id;

    if (!deleteShortListId) {
      Alert.alert('Error', 'Shortlist ID is missing.');
      return;
    }

    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${deleteShortListId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status === 200) {
        // Alert.alert('Success', 'Item successfully removed from the shortlist.');
        RemoveShortlisted();

        // Remove the deleted item from the list
        setData(prevData =>
          prevData.filter(dataItem => dataItem._id !== deleteShortListId),
        );
      } else {
        const errorResponse = await response.json();
        console.error('Delete failed:', errorResponse);
        Alert.alert('Error', 'Failed to delete shortlist item.');
      }
    } catch (error) {
      console.error('Error during API call:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  // UN-FRIEND BOTTOM SHEET SHARE FUNCTION
  const handleShare = async () => {
    // Close the bottom sheet before sharing
    unFriendBottomSheet.current.close();
    friendBottomSheet.current.close();

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

  const onUnfriendBottomSheetBlockPress = blockedFriendIds => {
    unFriendBottomSheet.current.close();
    friendBottomSheet.current.close();
    setIsBlockModalVisible(true);
    console.log(' === onUnfriendBottomSheetBlockPress ===> ', blockedFriendIds);
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
        setIsBlockModalVisible(false);
        setData(prevData =>
          prevData.filter(
            dataItem => dataItem.friendList[0]?._id !== blockedFriendId,
          ),
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

  const onCopyIdPress = async selectedUniqueId => {
    console.log(' === selectedUniqueId ===> ', selectedUniqueId);
    await Clipboard.setString(selectedUniqueId);
    unFriendBottomSheet.current.close();
    friendBottomSheet.current.close();
    CopyId();
  };

  const onSendMessagePress = userData => {
    friendBottomSheet.current.close();
    console.log(' === onSendMessagePress ===> ', userData);
    navigation.navigate('ChatUserScreen', {
      userData,
    });
  };

  const handleUnFriendProfilePress = () => {
    friendBottomSheet.current.close();
    setIsUnFriendModalVisible(true);
  };

  const handleConfirmUnFriend = async () => {
    console.log(
      ' === handleConfirmUnFriend ===> ',
      selectUserFriendId,
      selectUserUnfriendId,
    );
    // setIsUnFriendModalVisible(false);
    // dispatch(
    //   accepted_Decline_Request(
    //     {
    //       user: unFriendUserId,
    //       request: unFriendReqId,
    //       status: 'removed',
    //     },
    //     () => {
    //       navigation.navigate('HomeTabs');
    //       setIsUnFriendModalVisible(false);
    //     },
    //   ),
    // );

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
            user: selectUserFriendId,
            request: selectUserUnfriendId,
            status: 'removed', // Status for unfriending
          }),
        },
      );

      if (response.status === 200) {
        // Alert.alert('Success', 'User successfully unfriended.');

        // Update the specific user's status to "removed"
        setData(prevData =>
          prevData.map(dataItem =>
            dataItem.friendsDetails?._id === selectUserUnfriendId
              ? {
                  ...dataItem,
                  friendsDetails: {
                    ...dataItem.friendsDetails,
                    status: 'removed',
                  },
                }
              : dataItem,
          ),
        );

        setIsUnFriendModalVisible(false);
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

  const handleCancelUnFriend = () => {
    setIsUnFriendModalVisible(false);
  };

  const handlePress = items => {
    const matchesUserData = {
      firstName: items?.friendList?.name,
      id: items?.friendList?._id,
      userData: items,
    };
    // console.log(' === var ===> ', matchesUserData);
    navigation.navigate('NewUserDetailsScreen', {matchesUserData});
  };

  const renderItem = ({item}) => {
    const hasValidImage =
      item?.friendList?.profilePic &&
      item?.friendList?.profilePic !== 'null' &&
      item?.friendList?.profilePic.trim() !== '';

    // const profilePrivacy =
    //   item?.friendList?.privacySettingCustom?.profilePhotoPrivacy === true ||
    //   item?.friendList?.privacySettingCustom?.showPhotoToFriendsOnly === true;

    const profilePrivacy =
      (item?.friendList?.privacySettingCustom?.profilePhotoPrivacy === true ||
        item?.friendList?.privacySettingCustom?.showPhotoToFriendsOnly ===
          true) &&
      item?.friendsDetails?.status !== 'accepted';

    const userId = item?.friendList?._id;
    const unFrinendRequestId = item?.friendsDetails?._id;
    const AllDetailsPass = item;
    const profileImage = item?.friendList?.profilePic;

    const UniqueId = item?.friendList?.userUniqueId;
    const friendId = item?.friendList?._id;

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

    const jobTittle = item?.friendList?.writeBoutYourSelf
      ? item?.friendList?.writeBoutYourSelf.charAt(0).toUpperCase() +
        item?.friendList?.writeBoutYourSelf.slice(1).toLowerCase()
      : '';

    const currentCity = item?.friendList?.address?.currentCity
      ? item?.friendList?.address?.currentCity.charAt(0).toUpperCase() +
        item?.friendList?.address?.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item?.friendList?.address?.currentCountry
      ? item?.friendList?.address?.currentCountry.charAt(0).toUpperCase() +
        item?.friendList?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    const imageCount = Array.isArray(item?.friendList?.userProfilePic)
      ? item?.friendList?.userProfilePic?.length
      : 0;

    const userAllImage = Array.isArray(item?.friendList?.userProfilePic)
      ? item?.friendList?.userProfilePic.map(pic => pic.url)
      : [];

    // console.log(' === userAllImage ===> ', userAllImage);

    const starIconSource = item.shortlistId
      ? icons.black_check_icon
      : icons.black_start_icon;

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    const onThreeDotPress = item => {
      setSelectedFirstName(firstName || name);
      setSelectedUniqueId(UniqueId);
      setBlockedFriendId(friendId);
      setAllDataShare(AllDetailsPass);
      setSelectUserFriendId(userId);
      setSelectUserUnfriendId(unFrinendRequestId);

      if (item?.friendsDetails?.status === 'accepted') {
        console.log('User is a friend');
        // You can also display an alert or perform any other action
        // Alert.alert('Friend Status', 'User is a friend');
        friendBottomSheet.current.open();
      } else {
        console.log('User is not a friend');
        // Alert.alert('Friend Status', 'User is not a friend');
        unFriendBottomSheet.current.open();
      }
    };

    return (
      <View style={styles.renderItemContainer}>
        <TouchableOpacity activeOpacity={1}>
          <View>
            {/*<Image*/}
            {/*  source={*/}
            {/*    profileImage ? {uri: profileImage} : images.empty_male_Image*/}
            {/*  }*/}
            {/*  style={styles.image}*/}
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
              style={styles.imageBorderBottomShadow}
            />

            <View style={styles.imageBottomDataContainer}>
              <View style={styles.onlineTextBody}>
                <Text style={styles.onlineText}>Online</Text>
              </View>

              <View>
                <TouchableOpacity
                  onPress={() => {
                    handlePress(item);
                  }}>
                  <Text style={styles.nameText}>
                    {firstName || name} {lastName}
                  </Text>

                  <View style={styles.detailsContainer}>
                    <Text style={styles.userDetailsTextStyle}>{age} yrs,</Text>
                    <Text style={styles.userDetailsTextStyle}> {height}</Text>

                    <View style={styles.verticalLineStyle} />

                    <Text style={styles.userDetailsTextStyle}>
                      {jobTittle || 'N/A'}
                    </Text>
                  </View>

                  <View style={styles.userDetailsDescriptionContainer}>
                    <Text style={styles.userDetailsTextStyle}>
                      {currentCity},
                    </Text>

                    <Text style={styles.userDetailsTextStyle}>
                      {' '}
                      {currentCountry}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.bottomImagesContainer}>
                  <Image
                    source={images.gradient_button_background_img}
                    style={styles.gradientImageBody}
                  />
                  <TouchableOpacity
                    activeOpacity={0.5}
                    // onPress={openModal}
                    style={styles.coupleImageContainer}>
                    <Image
                      source={icons.couple_icon}
                      style={styles.coupleIcon}
                    />
                    <Text style={styles.matchesDataText}>
                      {item?.matchPercentage}% Match
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.bottomImagesSecondContainer}>
                    <TouchableOpacity
                      style={styles.counterImageContainer}
                      activeOpacity={0.5}
                      onPress={userAllImageShare}>
                      <Image
                        source={icons.new_camera_icon}
                        style={styles.cameraIcon}
                      />

                      <Text style={{color: colors.white}}>{imageCount}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleShortListPress(item)}
                      activeOpacity={0.5}
                      style={styles.starImageContainer}>
                      <Image source={starIconSource} style={styles.starIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        onThreeDotPress(item);
                      }}
                      style={styles.threeDotContainer}>
                      <Image
                        source={icons.new_three_dot}
                        style={styles.threeDotImage}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const toastConfigs = {
    RemoveShortlisted: ({text1}) => (
      <View style={styles.ToastMessageBodyContainer}>
        <Text style={styles.ToastMessageBodyContainerText}>{text1}</Text>
      </View>
    ),

    Copied: ({text1}) => (
      <View style={styles.ToastMessageBodyContainer}>
        <Text style={styles.ToastMessageBodyContainerText}>{text1}</Text>
      </View>
    ),
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.white}}>
      <View style={styles.toastMessageDisplayContainer}>
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
      ) : data?.length === 0 ? (
        <View style={styles.noFriendDataContaier}>
          <Image source={icons.no_Profile_Found_img} style={styles.noImage} />
          <Text style={styles.noFriendText}>No Saved friend's</Text>
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
          contentContainerStyle={styles.flatListContentContainer}
          ListFooterComponent={
            isFetchingMore ? (
              <View style={{alignItems: 'center', marginVertical: 10}}>
                <Text style={{color: 'black'}}>Loading Data..</Text>
              </View>
            ) : null
          }
        />
      )}

      {/*FRIEND BOTTOM SHEET */}

      <RBSheet
        ref={unFriendBottomSheet}
        height={hp(240)} // Height of the bottom sheet
        closeOnDragDown={true} // Allow closing the sheet by dragging it down
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
              // onPress={() => {
              //   handleBlockProfilePress(blockedFriendId);
              // }}

              onPress={() => {
                onUnfriendBottomSheetBlockPress(blockedFriendId);
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

      <RBSheet
        ref={friendBottomSheet}
        height={hp(310)} // Height of the bottom sheet
        closeOnDragDown={true} // Allow closing the sheet by dragging it down
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
              // onPress={() => {
              //   handleBlockProfilePress(blockedFriendId);
              // }}

              onPress={() => {
                onUnfriendBottomSheetBlockPress(blockedFriendId);
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

            <TouchableOpacity
              onPress={() => {
                onSendMessagePress(allDataShare);
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(20),
              }}>
              <Image
                source={icons.send_message_icon}
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
                Send Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleUnFriendProfilePress}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(20),
              }}>
              <Image
                source={icons.unFriend_icon}
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
                Unfriend
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>

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
                  onPress={handleCancelUnFriend}>
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

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: '100%',
    height: hp(449),
    borderRadius: 18,
    marginBottom: hp(13),
  },
  name: {
    fontSize: 16,
    color: 'black',
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
    backgroundColor: colors.gray,
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
  toastMessageDisplayContainer: {
    flex: 1,
    zIndex: 99,
    position: 'absolute',
    alignSelf: 'center',
    top: -130,
  },
  ToastMessageBodyContainer: {
    backgroundColor: '#333333', // Toast background color
    borderRadius: 100,
    marginHorizontal: 20,
    width: wp(300),
    height: hp(55),
    justifyContent: 'center',
  },
  ToastMessageBodyContainerText: {
    color: 'white', // Toast text color
    fontSize: fontSize(16),
    textAlign: 'center',
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
  flatListContentContainer: {
    paddingBottom: 200,
  },
  renderItemContainer: {
    marginHorizontal: 17,
  },
  imageBorderBottomShadow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '40%',
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    marginBottom: hp(13),
  },
  imageBottomDataContainer: {
    position: 'absolute',
    bottom: 35,
    width: '100%',
    marginLeft: wp(21),
  },
  onlineTextBody: {
    width: wp(34.8),
    height: hp(12),
    borderRadius: 5,
    backgroundColor: '#24FF00A8',
    justifyContent: 'center',
  },
  onlineText: {
    color: colors.black,
    fontSize: fontSize(9),
    lineHeight: hp(12),
    textAlign: 'center',
  },
  nameText: {
    color: colors.white,
    fontSize: fontSize(24),
    lineHeight: hp(36),
    fontFamily: fontFamily.poppins700,
    marginTop: 5,
  },
  detailsContainer: {
    flexDirection: 'row',
    marginTop: 3,
  },
  bottomImagesContainer: {
    marginTop: hp(15),
    flexDirection: 'row',
    alignItems: 'center',
  },
  gradientImageBody: {
    width: wp(105),
    height: hp(30),
    resizeMode: 'stretch',
    borderRadius: 50, // Adjust the radius as needed
    overflow: 'hidden', // Ensure rounded corners clip the image
  },
  coupleImageContainer: {
    position: 'absolute',
    left: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  coupleIcon: {
    width: hp(16),
    height: hp(14),
    resizeMode: 'contain',
    tintColor: 'white',
  },
  matchesDataText: {
    color: 'white',
    marginLeft: 9,
    fontSize: fontSize(10),
    lineHeight: hp(15),
    fontFamily: fontFamily.poppins600,
    top: 1,
  },
  bottomImagesSecondContainer: {
    flexDirection: 'row',
    position: 'absolute',
    right: 35,
  },
  counterImageContainer: {
    width: hp(60),
    height: hp(30),
    backgroundColor: '#282727',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  cameraIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    marginRight: wp(10),
  },
  starImageContainer: {
    width: hp(30),
    height: hp(30),
    backgroundColor: '#282727',
    borderRadius: 50,
  },
  starIcon: {
    width: hp(30),
    height: hp(30),
    resizeMode: 'contain',
  },
  threeDotContainer: {
    width: hp(30),
    height: hp(30),
    backgroundColor: '#282727',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginHorizontal: 5,
  },
  threeDotImage: {
    width: 4,
    height: 14,
    tintColor: colors.white,
  },
  userDetailsDescriptionContainer: {
    flexDirection: 'row',
  },
  noFriendDataContaier: {
    alignItems: 'center',
    marginTop: hp(200),
    justifyContent: 'center',
  },
  noImage: {
    width: hp(44),
    height: hp(44),
    resizeMode: 'contain',
  },
  noFriendText: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(27),
    marginTop: hp(12),
    fontFamily: fontFamily.poppins400,
  },
});

export default MatchesInSavedScreen;
