import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  Image,
  Alert,
  TouchableOpacity,
  Share,
  Clipboard,
  Modal,
  TextInput,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {icons, images} from '../../../assets';
import LinearGradient from 'react-native-linear-gradient';
import {hp} from '../../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {colors} from '../../../utils/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-toast-message';
import {
  accepted_Decline_Request,
  non_friend_Blocked,
} from '../../../actions/homeActions';
import axios from 'axios';
import {style} from './style';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesInAcceptedScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [selectedFirstName, setSelectedFirstName] = useState('');
  const [selectedUniqueId, setSelectedUniqueId] = useState('');
  const [blockedFriendId, setBlockedFriendId] = useState('');
  const [allDataShare, setAllDataShare] = useState('');
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [questionText, setQuestionText] = useState(
    'Why are you reporting this?',
  );
  const [isAboutClicked, setIsAboutClicked] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [isUnFriendModalVisible, setIsUnFriendModalVisible] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  const Login_User_ID = user?.user?.id;

  const sheetRef = useRef(null);
  const ReportBottomSheetRef = useRef();

  // console.log(' === accessToken ===> ', accessToken);

  const openBottomSheet = () => {
    sheetRef.current.close();
    ReportBottomSheetRef.current.open();
  };

  // Function to fetch data from the API
  const fetchData = async (pageNumber = 1) => {
    if (!hasMoreData) {
      return;
    }

    try {
      console.log('Fetching data for page:', pageNumber);

      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/friend/get-frd-mobile?page=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const json = await response.json();
      console.log('API response:', json);

      const newData = json?.data?.results?.flat() || [];

      if (newData.length === 0) {
        console.log('No data found for this page.');
        setHasMoreData(false);
      } else {
        console.log('Fetched data:', newData); // Log fetched data
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

  const addToShortlist = async shortlistId => {
    try {
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/shortlist/create-shortlist',
        {
          shortlistId: shortlistId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('Shortlist created successfully:', response.data);
      ShowToast();
      return response.data; // Return the response to handle it in the caller
    } catch (error) {
      console.error('Error adding to shortlist:', error);
      Alert.alert('Error', 'Failed to add to shortlist.');
      throw error; // Re-throw the error to handle it in the caller
    }
  };

  const removeFromShortlist = async shortlistId => {
    console.log(' === removeFromShortlist ===> ', shortlistId);
    try {
      const response = await axios.delete(
        `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${shortlistId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('Shortlist removed successfully:', response.data);
      RemoveShortlisted();
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      Alert.alert('Error', 'Failed to remove from shortlist.');
      throw error; // Re-throw the error to handle it in the caller
    }
  };

  const handleShortListPress = async item => {
    const shortList = item?.friendList?.shortlistData;

    try {
      if (shortList) {
        // Remove from shortlist
        const shortlistId = shortList?._id || shortList[0]?._id; // Use the correct shortlist ID
        console.log(' === shortList___ ===> ', shortList);
        await removeFromShortlist(shortlistId);

        // Update the state to reflect removal
        setData(prevData =>
          prevData.map(existingItem => {
            if (existingItem?.friendList?._id === item?.friendList?._id) {
              return {
                ...existingItem,
                friendList: {
                  ...existingItem.friendList,
                  shortlistData: null, // Set to null after removal
                },
              };
            }
            return existingItem;
          }),
        );
      } else {
        // Add to shortlist
        const response = await addToShortlist(item?.friendList?._id);
        const newShortlistId = response?.data?.id; // Extract the ID from the API response

        // Update the state to reflect addition
        setData(prevData =>
          prevData.map(existingItem => {
            if (existingItem?.friendList?._id === item?.friendList?._id) {
              return {
                ...existingItem,
                friendList: {
                  ...existingItem.friendList,
                  shortlistData: [{_id: newShortlistId}], // Update with actual ID
                },
              };
            }
            return existingItem;
          }),
        );
      }
    } catch (error) {
      console.error('Error handling shortlist press:', error);
      Alert.alert('Error', 'An error occurred while updating the shortlist.');
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
    console.log(' === selectedUniqueId ===> ', selectedUniqueId);
    await Clipboard.setString(selectedUniqueId);
    sheetRef.current.close();
    CopyId();
  };

  // BLOCKED USER FUNCTION
  const handleBlockProfilePress = () => {
    sheetRef.current.close();
    setIsBlockModalVisible(true);
  };

  const handleConfirmBlock = () => {
    dispatch(
      non_friend_Blocked({friend: blockedFriendId, user: Login_User_ID}, () => {
        setIsBlockModalVisible(false);
      }),
    );
  };

  // SEND MESSAGE FUNCTION
  const onSendMessagePress = userData => {
    // console.log(' === onSendMessagePress ===> ', userData);

    sheetRef.current.close();

    console.log(' === onSendMessagePress ===> ', userData);

    navigation.navigate('ChatUserScreen', {
      userData,
    });
  };

  const handleUnFriendPress = () => {
    sheetRef.current.close();
    setIsUnFriendModalVisible(true);
  };

  // UN-FRIEND FUNCTION
  const handleConfirmUnFriend = () => {
    dispatch(
      accepted_Decline_Request(
        {
          user: allDataShare?.friendList?._id,
          request: allDataShare?._id,
          status: 'removed',
        },
        () => {
          // navigation.navigate('HomeTabs');
          setIsUnFriendModalVisible(false);
        },
      ),
    );
  };

  // UN-FRIEND FUNCTION
  const handleCancelUnFriend = () => {
    setIsUnFriendModalVisible(false);
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

  const renderAccptedUserItem = ({item}) => {
    const AllDetailsPass = item;

    const userAllImage = Array.isArray(item.friendList?.userProfilePic)
      ? item.friendList?.userProfilePic.map(pic => pic.url)
      : [];

    const calculateAge = dob => {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const profileImage = item?.friendList?.profilePic;
    const age = calculateAge(item.friendList?.dateOfBirth);
    const height = item.friendList?.height;
    const jobTitle = item.friendList?.userProfessional?.jobTitle;
    const uniqueId = item?.friendList?.userUniqueId;
    const blockedFriendIds = item?.friendList?._id;

    const name = item?.friendList?.name
      ? item?.friendList?.name.charAt(0).toUpperCase() +
        item?.friendList?.name.slice(1).toLowerCase()
      : '';

    const firstName = item?.friendList?.firstName
      ? item?.friendList?.firstName.charAt(0).toUpperCase() +
        item?.friendList?.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item?.friendList?.lastName
      ? item?.friendList?.lastName.charAt(0).toUpperCase() +
        item?.friendList?.lastName.slice(1).toLowerCase()
      : '';

    const currentCity = item.friendList?.address?.currentCity
      ? item.friendList?.address?.currentCity.charAt(0).toUpperCase() +
        item.friendList?.address?.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item.friendList?.address?.currentCountry
      ? item.friendList?.address?.currentCountry.charAt(0).toUpperCase() +
        item.friendList?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    const imageCount = Array.isArray(item.friendList?.userProfilePic)
      ? item.friendList?.userProfilePic.length
      : 0;

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    const onThreeDotPress = () => {
      // const userDetailsThreeDot = {
      //   firstName: item?.firstName,
      // };
      setSelectedFirstName(firstName || name);
      setSelectedUniqueId(uniqueId);
      setBlockedFriendId(blockedFriendIds);
      setAllDataShare(AllDetailsPass);

      sheetRef.current.open();
    };

    // const handlePress = () => {
    //   console.log(' === item........... ===> ', item);
    //   const matchesUserData = {
    //     userAllImage,
    //     profileImage,
    //     // birthTime,
    //     currentCity,
    //     // JobTittle,
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
      // console.log(' === handlePress ===> ', item);

      const matchesUserData = {
        firstName: items?.friendList?.name,
        id: items?.friendList?._id,
        userData: item,
      };
      // console.log(' === items____ ===> ', matchesUserData);
      navigation.navigate('NewUserDetailsScreen', {matchesUserData});
      // navigation.navigate('Abc', {matchesUserData});
    };

    const starIconSource = item.friendList?.shortlistData
      ? icons.black_check_icon // Check icon if shortlisted
      : icons.black_start_icon; // Star icon if not shortlisted

    return (
      <View style={{marginHorizontal: 17}}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            /* navigation.navigate('UserDetailsScreen'); */
          }}>
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
                activeOpacity={0.5}
                onPress={() => {
                  handlePress(item);
                }}>
                <Text style={style.userNameTextStyle}>
                  {firstName || name} {lastName}
                </Text>

                <View
                  style={[
                    style.userDetailsDescriptionContainer,
                    {marginTop: 3},
                  ]}>
                  <Text style={style.userDetailsTextStyle}>{age} yrs,</Text>
                  <Text style={style.userDetailsTextStyle}>{height}</Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>
                    {jobTitle || 'N/A'}
                  </Text>
                </View>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>
                    {currentCity},{' '}
                  </Text>

                  <Text style={style.userDetailsTextStyle}>
                    {currentCountry}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={style.userDataBottomContainer}>
                <Image
                  source={images.gradient_button_background_img}
                  style={style.gradientButtonImage}
                />
                <TouchableOpacity
                  activeOpacity={0.5}
                  // onPress={openModal}
                  style={style.gradientButtonImageContainer}>
                  <Image source={icons.couple_icon} style={style.coupleIcon} />
                  <Text style={style.gradientImageTextContainer}>
                    {/*85% Match*/}
                    {item.friendList?.matchPercentage || 0}% Match
                  </Text>
                </TouchableOpacity>

                <View style={style.bottomSecondDataContainer}>
                  <TouchableOpacity
                    style={style.cameraButtonContainer}
                    activeOpacity={0.5}
                    onPress={userAllImageShare}>
                    <Image
                      source={icons.new_camera_icon}
                      style={style.cameraIcon}
                    />

                    <Text style={{color: colors.white}}>{imageCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleShortListPress(item)}
                    activeOpacity={0.5}
                    style={style.starIconContainer}>
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
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && page === 1) {
    return (
      <SafeAreaView style={style.loadingContainer}>
        <View style={style.shimmerLoaderContainer}>
          <ShimmerPlaceholder style={style.shimmerFirstContainer} />
          <View style={style.shimmerFirstContainerBody}>
            <ShimmerPlaceholder style={style.shimmerSecondContainer} />

            <View style={style.shimmerThirdBody}>
              <ShimmerPlaceholder style={style.shimmerThird} />
            </View>

            <View style={style.shimmerFourthContainer}>
              <ShimmerPlaceholder style={style.shimmerFourth} />
              <ShimmerPlaceholder style={style.shimmerFourth} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const toastConfigs = {
    AddShortlisted: ({text1}) => (
      <View style={style.ToastMessageBodyContainer}>
        <Text style={style.ToastMessageBodyContainerText}>{text1}</Text>
      </View>
    ),
    RemoveShortlisted: ({text1}) => (
      <View style={style.ToastMessageBodyContainer}>
        <Text style={style.ToastMessageBodyContainerText}>{text1}</Text>
      </View>
    ),

    Copied: ({text1}) => (
      <View style={style.ToastMessageBodyContainer}>
        <Text style={style.ToastMessageBodyContainerText}>{text1}</Text>
      </View>
    ),
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.toastMessageDisplayContainer}>
        <Toast config={toastConfigs} />
      </View>

      <FlatList
        data={data}
        renderItem={renderAccptedUserItem}
        keyExtractor={item => item._id || item.id || item.name}
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
              <View style={style.emptyListBody}>
                <Image
                  source={icons.no_Profile_Found_img}
                  style={style.noImage}
                />
                <Text style={style.noImageText}>No Profiles Found</Text>
              </View>
            </View>
          ) : null
        }
        contentContainerStyle={style.listContainer} // Added this line
      />

      {/*//THREE DOT BOTTOM SHEET OPEN*/}
      <RBSheet
        ref={sheetRef}
        height={hp(310)} // Height of the bottom sheet
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
                handleBlockProfilePress(blockedFriendId);
              }}
              style={style.threeDotBottomSheetContainers}>
              <Image
                source={icons.block_icon}
                style={style.threeDotBottomSheetIcon}
              />
              <Text style={style.threeDotBottomSheetTittleText}>
                Block {selectedFirstName}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openBottomSheet}
              style={style.threeDotBottomSheetContainers}>
              <Image
                source={icons.report_icon}
                style={style.threeDotBottomSheetIcon}
              />
              <Text style={style.threeDotBottomSheetTittleText}>
                Report this profile
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

            <TouchableOpacity
              onPress={() => {
                onSendMessagePress(allDataShare);
              }}
              style={style.threeDotBottomSheetContainers}>
              <Image
                source={icons.send_message_icon}
                style={style.threeDotBottomSheetIcon}
              />
              <Text style={style.threeDotBottomSheetTittleText}>
                Send Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleUnFriendPress(allDataShare);
              }}
              style={style.threeDotBottomSheetContainers}>
              <Image
                source={icons.unFriend_icon}
                style={style.threeDotBottomSheetIcon}
              />
              <Text style={style.threeDotBottomSheetTittleText}>Unfriend</Text>
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

      {/* Modal for UnFriend confirmation */}
      <Modal
        visible={isUnFriendModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsUnFriendModalVisible(false)}>
        <View style={style.unFriendModalContainer}>
          <View style={style.unFriendModalContainerBody}>
            <View>
              <Text style={style.unFriendModalTittle}>
                Are yor sure want to unfriend?
              </Text>

              <View style={style.unFriendModalButtonContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleConfirmUnFriend}>
                  <LinearGradient
                    colors={['#2D46B9', '#8D1D8D']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={style.unFriendModalYesButtonBody}>
                    <Text style={style.unFriendModalYesButtonText}>Yes</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleCancelUnFriend}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    style={style.unFriendModalNoButtonBodyContainer}>
                    <View style={style.unFriendModalNoButtonBody}>
                      <Text style={style.unFriendModalNoButtonText}>No</Text>
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

export default MatchesInAcceptedScreen;
