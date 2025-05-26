import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  ScrollView,
  Share,
  Clipboard,
  Modal,
  TextInput,
  Alert,
  ImageBackground,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import UsersProfileDetailsScreen from '../usersProfileDetailsScreen';

import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {style} from './style';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import NewAddStoryScreen from '../newAddStoryScreen';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {
  accepted_Decline_Request,
  non_friend_Blocked,
} from '../../actions/homeActions';
import Toast from 'react-native-toast-message';
import RBSheet from 'react-native-raw-bottom-sheet';
import ProfileAvatar from '../../components/letterProfileComponent';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const NewUserDetailsScreen = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageRotation, setImageRotation] = useState('90deg');
  const [requestStatus, setRequestStatus] = useState('pending'); // Default state is 'pending'
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [isUnFriendModalVisible, setIsUnFriendModalVisible] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [questionText, setQuestionText] = useState(
    'Why are you reporting this?',
  );
  const [isAboutClicked, setIsAboutClicked] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [isReportModalVisible, setReportModalVisible] = useState(false);

  const route = useRoute();
  const {matchesUserData} = route.params;
  console.log(' === matchesUserData ===> ', matchesUserData?.id);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;
  const userImage = user?.user?.profilePic;

  const topModalBottomSheetRef = useRef(null);
  const friendBottomSheetRef = useRef(null);
  const ReportBottomSheetRef = useRef();

  // console.log(
  //   ' === _________userDetails_________ ===> ',
  //   matchesUserData?.userData?.friend,
  // );

  // console.log(
  //   ' === var ===> ',
  //   userDetails?.privacySettingCustom?.profilePhotoPrivacy,
  // );

  const openBottomSheet = () => {
    friendBottomSheetRef.current.close();
    ReportBottomSheetRef.current.open();
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
    setImageRotation(showFullDescription ? '90deg' : '-90deg');
  };

  const openTopBottomSheet = () => {
    topModalBottomSheetRef.current.open();
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

  const ProfileLike = () => {
    Toast.show({
      type: 'ProfileLike',
      text1: 'Profile Like',
      visibilityTime: 1000,
    });
  };
  const ProfileDisLike = () => {
    Toast.show({
      type: 'ProfileDisLike',
      text1: 'Profile Disliked',
      visibilityTime: 1000,
    });
  };

  const fetchUserDetails = async () => {
    if (!matchesUserData?.id || !accessToken) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/user/${matchesUserData.id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();

      // Assuming the data is an array and we need the first item
      if (data.data && data.data.length > 0) {
        setUserDetails(data.data[0]); // Set the first element of the data array
      } else {
        // setError('No user data available');
        setUserDetails(matchesUserData?.userData?.friend);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createProfileViewer = async () => {
    if (!userId || !accessToken) {
      return;
    }

    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/profile-viewer/create-profile-viewer',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            viewerId: matchesUserData?.id,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to create profile viewer');
      }

      const result = await response.json();
      console.log('Profile viewer created:', result);
    } catch (error) {
      console.error('Error creating profile viewer:', error.message);
    }
  };

  // Initial fetch when component mounts
  // useEffect(() => {
  //   fetchUserDetails();
  // }, [matchesUserData?.id, accessToken]);

  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
      createProfileViewer();
    }, [matchesUserData?.id, accessToken]),
  );

  if (loading) {
    return (
      // <SafeAreaView style={style.centered}>
      //   <ActivityIndicator size="large" color="#0000ff" />
      // </SafeAreaView>
      <SafeAreaView style={{flex: 1}}>
        <View
          style={{
            marginHorizontal: 17,
            position: 'absolute',
            top: 20,
            width: '90%',
            flex: 1,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <ShimmerPlaceholder style={{width: 120, height: 25}} />

            <ShimmerPlaceholder
              style={{width: 30, height: 30, borderRadius: 50, marginRight: 10}}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
            }}>
            <ShimmerPlaceholder
              style={{width: 50, height: 50, borderRadius: 50}}
            />
            <ShimmerPlaceholder
              style={{width: 50, height: 50, borderRadius: 50}}
            />
            <ShimmerPlaceholder
              style={{width: 50, height: 50, borderRadius: 50}}
            />
            <ShimmerPlaceholder
              style={{width: 50, height: 50, borderRadius: 50}}
            />
            <ShimmerPlaceholder
              style={{width: 50, height: 50, borderRadius: 50}}
            />
          </View>

          <ShimmerPlaceholder
            style={{
              width: '100%',
              height: hp(500),
              justifyContent: 'center',
              marginRight: 40,
              marginTop: 30,
              borderRadius: 10,
            }}
          />

          <View
            style={{
              marginTop: 30,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginLeft: 30,
              borderRadius: 25,
            }}>
            <ShimmerPlaceholder
              style={{
                width: wp(142),
                height: hp(40),
                justifyContent: 'center',
                marginRight: 40,
                borderRadius: 25,
              }}
            />
            <ShimmerPlaceholder
              style={{
                width: wp(142),
                height: hp(40),
                justifyContent: 'center',
                marginRight: 40,
                borderRadius: 25,
              }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={style.centered}>
        <Text style={{color: 'red'}}>{error}</Text>
      </SafeAreaView>
    );
  }

  const handleShortlist = async () => {
    const loggedInUserId = userDetails._id; // Get the logged-in user's ID
    const currentShortlistId =
      userDetails?.userShortListDetails?._id ||
      userDetails?.userShortListDetails?.id;

    console.log(' === currentShortlistId ===> ', currentShortlistId);

    if (currentShortlistId) {
      // If the user is already in the shortlist, delete them
      try {
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${currentShortlistId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to delete from shortlist');
        }

        RemoveShortlisted();

        // Optimistically update the UI by setting the state before calling API
        setUserDetails(prevState => {
          const updatedState = {
            ...prevState,
            userShortListDetails: null, // Remove shortlistId as the user is no longer in the shortlist
          };
          return updatedState;
        });
      } catch (err) {
        alert('Error removing from shortlist');
        console.error(err);
      }
    } else {
      // If the user is not in the shortlist, add them

      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/shortlist/create-shortlist',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              shortlistId: loggedInUserId, // Use the logged-in user's ID for the request
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to add to shortlist');
        }

        // Assuming the response contains the created shortlist details
        const data = await response.json();

        ShowToast();

        // Extract the created shortlist ID (this is the ID you want to store)
        const createdShortlistId = data?.data?.id; // Extract the ID from the API response

        if (createdShortlistId) {
          // Optimistically update the UI by setting the state before calling API
          setUserDetails(prevState => {
            const updatedState = {
              ...prevState,
              userShortListDetails: {
                _id: createdShortlistId, // Store the newly created shortlist ID here
              },
            };
            console.log(
              'User Details after Adding to Shortlist:',
              updatedState,
            ); // Log the updated state
            return updatedState;
          });
        } else {
          alert('Shortlist creation failed: No valid ID returned');
        }
      } catch (err) {
        alert('Error adding to shortlist');
        console.error(err);
      }
    }
  };

  // Function to handle like action (add or remove)
  const handleLike = async () => {
    const likedUserId = userDetails._id; // The user you want to like/unlike
    const currentIsLike = userDetails?.userLikeDetails?.isLike;
    const currentIsLikeId = userDetails?.userLikeDetails?._id;

    console.log(' === currentIsLikeId ===> ', currentIsLikeId);

    if (currentIsLike === true) {
      // If already liked, remove the like

      try {
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/like/update-like/${currentIsLikeId}`,
          {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              likedUserId: likedUserId,
              isLike: false,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to remove like');
        }
        ProfileDisLike();

        // Update user details after removing the like
        setUserDetails(prevState => ({
          ...prevState,
          userLikeDetails: {
            ...prevState.userLikeDetails,
            isLike: false, // Update the isLike to false
          },
        }));
      } catch (err) {
        alert('Error removing like');
        console.error(err);
      }
    } else {
      // If not liked, add the like
      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/like/create-like',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              likedUserId: likedUserId,
              isLike: true,
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to add like');
        }

        ProfileLike();

        // Update user details after adding the like
        setUserDetails(prevState => ({
          ...prevState,
          userLikeDetails: {
            ...prevState.userLikeDetails,
            isLike: true, // Update the isLike to true
          },
        }));
      } catch (err) {
        alert('Error adding like');
        console.error(err);
      }
    }
  };

  // Function to remove friend (respond to request)
  const removeFriendRequest = async () => {
    const {_id: requestId} = userDetails?.friendsDetails;

    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/friend/respond-friend-req',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user: userDetails?._id,
            request: requestId,
            status: 'rejected', // Reject the friend request
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to remove friend request');
      }

      setUserDetails(prevState => ({
        ...prevState,
        friendsDetails: {...prevState.friendsDetails, status: 'removed'},
      }));
    } catch (err) {
      alert('Error removing friend');
      console.error(err);
    }
  };

  // Function to create a new friend request
  const sendFriendRequest = async () => {
    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/friend/create-friend',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            friend: userDetails?._id,
            user: userId,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }

      setUserDetails(prevState => ({
        ...prevState,
        friendsDetails: {...prevState.friendsDetails, status: 'requested'},
      }));
    } catch (err) {
      alert('Error sending friend request');
      console.error(err);
    }
  };

  const receivedFriendRequestedDecline = item => {
    const requestedId = item?.friendsDetails?._id;

    dispatch(
      accepted_Decline_Request(
        {
          user: userId,
          request: requestedId,
          status: 'rejected',
        },
        () => {
          // Updating the status to 'declined' in the user data after a successful API call
          setRequestStatus('declined'); // Update request status to 'declined'

          // Update userDetails to reflect the declined status
          setUserDetails(prevData => {
            return {
              ...prevData, // Keep the existing data
              friendsDetails: {
                ...prevData.friendsDetails,
                status: 'declined', // Update the status of the declined request
              },
            };
          });
        },
      ),
    );
  };

  const receivedFriendRequestedAccepted = item => {
    const requestedId = item?.friendsDetails?._id;

    // console.log(' === var ===> ', item?._id);

    dispatch(
      accepted_Decline_Request(
        {
          user: userId,
          request: requestedId,
          status: 'accepted',
        },
        () => {
          setRequestStatus('accepted');
          setUserDetails(prevData => {
            return {
              ...prevData, // Keep the existing data
              friendsDetails: {
                ...prevData.friendsDetails,
                status: 'accepted', // Update the status of the declined request
              },
            };
          });
        },
      ),
    );
  };

  const onSendMessagePress = allData => {
    const userData = allData?.userData;
    // console.log(' === onSendMessagePress_____ ===> ', userData);

    navigation.navigate('ChatUserScreen', {
      userData,
    });
  };

  const onThreeDotPress = () => {
    const status = userDetails?.friendsDetails?.status;

    console.log(' === onThreeDotPress__ ===> ', status);

    // if (status === 'accepted') {
    //   friendBottomSheetRef.current.open();
    // } else if (status === 'requested') {
    //   friendBottomSheetRef.current.open();
    // }

    // if (
    //   status === 'accepted' ||
    //   status === 'requested' ||
    //   status === 'rejected' ||
    //   status === undefined
    // ) {
    //   friendBottomSheetRef.current.open();
    // }

    friendBottomSheetRef.current.open();
  };

  const handleShare = async () => {
    friendBottomSheetRef.current.close();

    try {
      await new Promise(resolve => setTimeout(resolve, 50));

      const result = await Share.share({
        // message: 'Happy Milan App', // Message to share
        message: userDetails?.firstName, // Message to share
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

  const onCopyIdPress = async () => {
    await Clipboard.setString(userDetails?.userUniqueId);
    friendBottomSheetRef.current.close();
    CopyId();
  };

  // BLOCKED USER FUNCTION
  const handleBlockProfilePress = () => {
    friendBottomSheetRef.current.close();
    setIsBlockModalVisible(true);
  };

  const handleConfirmBlock = () => {
    dispatch(
      non_friend_Blocked({friend: userDetails?._id, user: userId}, () => {
        setIsBlockModalVisible(false);
        // Re-fetch user details after blocking
        // fetchUserDetails();
        navigation.goBack();
      }),
    );
  };

  const handleUnBlockedPress = async () => {
    const usersId = matchesUserData?.userData?.friend?._id;
    const ReqId = matchesUserData?.userData?._id;
    console.log(' === handleUnBlockedPress ===> ', usersId, ReqId);

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
            user: usersId,
            request: ReqId,
            status: 'removed',
          }),
        },
      );

      const json = await response.json();
      console.log('Unfriend API response:', json);

      if (response.ok) {
        // setUserDetails(prevData =>
        //   prevData.filter(dataItem => dataItem._id !== ReqId),
        // );

        setIsBlockModalVisible(false);
        navigation.goBack();
      } else {
        Alert.alert('Error', json?.message || 'Failed to unfriend user.');
      }
    } catch (error) {
      console.error('Error unfriending user:', error);
      Alert.alert(
        'Error',
        'An error occurred while trying to unfriend the user.',
      );
    }
  };

  const handleUnFriendPress = () => {
    friendBottomSheetRef.current.close();
    setIsUnFriendModalVisible(true);
  };

  // UN-FRIEND FUNCTION
  const handleConfirmUnFriend = () => {
    dispatch(
      accepted_Decline_Request(
        {
          user: userDetails?._id,
          request: userDetails?.friendsDetails?._id,
          status: 'removed',
        },
        () => {
          // navigation.navigate('HomeTabs');
          setIsUnFriendModalVisible(false);
          fetchUserDetails();
        },
      ),
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
              spamUserId: userDetails?._id, // Example spam user ID, update with actual ID if needed
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
              spamUserId: userDetails?._id, // Example spam user ID, update with actual ID if needed
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

  const bottomSheetSendMessagePress = userData => {
    // console.log(' === bottomSheetSendMessagePress ===> ', userData);

    friendBottomSheetRef.current.close();

    navigation.navigate('ChatUserScreen', {
      userData,
    });
  };

  const blockedUnfriendFunction = () => {
    console.log(
      ' === blockedUnfriendFunction ===> ',
      matchesUserData?.userData,
    );
    friendBottomSheetRef.current.close();
    setIsBlockModalVisible(true);
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
    ProfileLike: ({text1}) => (
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
    ProfileDisLike: ({text1}) => (
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

  // console.log(
  //   ' === userDetails___ ===> ',
  //   userDetails?.subscriptionDetails?.selectedPlan,
  // );

  // console.log(' === userDetails___ ===> ', userDetails?.friendsDetails?.status);

  const profilePrivacy =
    (userDetails.privacySettingCustom?.profilePhotoPrivacy === true ||
      userDetails.privacySettingCustom?.showPhotoToFriendsOnly === true) &&
    userDetails?.friendsDetails?.status !== 'accepted';

  const {selectedPlan, status} = userDetails?.subscriptionDetails || {};

  // Determine if the selected plan is 'gold' (for the crown icon)
  const isGoldPlan = selectedPlan === 'gold';
  const isSilverPlan = selectedPlan === 'silver';
  const isPlatinumPlan = selectedPlan === 'Platinum';

  const subPlan = isGoldPlan || isSilverPlan || isPlatinumPlan;

  const hasValidImage =
    userDetails.profilePic &&
    userDetails.profilePic !== 'null' &&
    userDetails.profilePic.trim() !== '';

  const calculateAge = dob => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle null or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const planName = capitalizeFirstLetter(
    userDetails?.subscriptionDetails?.selectedPlan,
  );

  const firstName = capitalizeFirstLetter(userDetails?.firstName);
  const lastName = capitalizeFirstLetter(userDetails?.lastName);
  const name = capitalizeFirstLetter(userDetails?.name);

  const jobTittle = capitalizeFirstLetter(
    userDetails?.userProfessional?.jobTitle,
  );
  const currentCity = capitalizeFirstLetter(userDetails?.address?.currentCity);
  const currentCountry = capitalizeFirstLetter(
    userDetails?.address?.currentCountry,
  );

  const age = calculateAge(userDetails?.dateOfBirth);

  const imageCount = Array.isArray(userDetails?.userProfilePic)
    ? userDetails?.userProfilePic.length
    : 0;

  const userAllImageShare = () => {
    const allImages = userDetails?.userProfilePic?.map(image => image.url);
    navigation.navigate('UserUploadImageFullScreen', {allImages});
  };

  const receivedScreeData = matchesUserData?.userData?.status || [];

  const friendStatus = userDetails?.friendsDetails?.status || [];

  const friendIconSource =
    friendStatus === 'accepted'
      ? icons.new_request_sent_icon // Request already accepted
      : friendStatus === 'requested'
      ? icons.new_request_sent_icon // Request already sent, allow for rejection
      : icons.new_rectangle_send_icon; // No request sent, allow sending a request

  return (
    <SafeAreaView style={style.container}>
      <View
        style={{
          flex: 1,
          zIndex: 99,
          position: 'absolute',
          alignSelf: 'center',
          top: -10,
        }}>
        <Toast config={toastConfigs} />
      </View>

      <View style={style.headerContainer}>
        <Image
          source={images.happyMilanColorLogo}
          style={style.customHeaderLogo}
        />

        <TouchableOpacity activeOpacity={0.7} onPress={openTopBottomSheet}>
          {userImage ? (
            <Image source={{uri: userImage}} style={style.profileLogoStyle} />
          ) : (
            <ProfileAvatar
              firstName={user?.user?.firstName}
              lastName={user?.user?.firstName}
              textStyle={style.profileLogoStyle}
              profileTexts={{fontSize: fontSize(10)}}
            />
          )}
          {/*<Image*/}
          {/*  source={userImage ? {uri: userImage} : images.empty_male_Image}*/}
          {/*  style={style.profileLogoStyle}*/}
          {/*/>*/}
        </TouchableOpacity>
      </View>

      <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

      <View style={style.userStoryContainer}>
        <NewAddStoryScreen />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {/*<Image*/}
          {/*  source={*/}
          {/*    userDetails.profilePic*/}
          {/*      ? {uri: userDetails.profilePic}*/}
          {/*      : images.empty_male_Image*/}
          {/*  }*/}
          {/*  style={{width: '100%', height: hp(449), resizeMode: 'cover'}}*/}
          {/*/>*/}

          <View
            style={{
              width: '100%',
              height: hp(449),
              resizeMode: 'cover',
            }}>
            {hasValidImage ? (
              <>
                <Image
                  source={{uri: userDetails.profilePic}}
                  style={{
                    width: '100%',
                    height: hp(449),
                    resizeMode: 'cover',
                  }}
                />
                {profilePrivacy && (
                  <Image
                    source={icons.logLogo} // make sure you have a `lock` icon inside `icons`
                    style={{
                      position: 'absolute',
                      tintColor: '#fff',
                      resizeMode: 'contain',
                      width: 33,
                      height: 44,
                      alignSelf: 'center',
                      top: 200,
                    }}
                  />
                )}
              </>
            ) : (
              <>
                <ProfileAvatar
                  firstName={userDetails.firstName || userDetails.name}
                  lastName={userDetails.lastName}
                  textStyle={{
                    width: '100%',
                    height: hp(449),
                    resizeMode: 'cover',
                    borderRadius: 0,
                  }}
                  profileTexts={{fontSize: fontSize(60)}}
                />
              </>
            )}
          </View>

          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
            style={style.imageBottomShadow}
          />
          <View style={style.UserDetailsContainer}>
            <View style={style.imageBottomContainer}>
              <View style={style.onlineBodyStyle}>
                <Text style={style.bodyTextStyle}>Online</Text>
              </View>

              <View
                style={[style.userDetailsDescriptionContainer, {marginTop: 3}]}>
                <Text style={style.userNameTextStyle}>
                  {firstName || name} {lastName}
                </Text>

                {subPlan && (
                  <View
                    style={{
                      // width: 57,
                      // width: '100%',
                      height: 22,
                      backgroundColor: 'orange',
                      marginLeft: 11,
                      marginTop: 5,
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
                        // marginLeft: 6,
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

              <View
                style={[style.userDetailsDescriptionContainer, {marginTop: 3}]}>
                <Text style={style.userDetailsTextStyle}>
                  {userDetails?.age || age} yrs,{' '}
                </Text>
                <Text style={style.userDetailsTextStyle} />
                <Text style={style.userDetailsTextStyle}>
                  {userDetails?.height}
                </Text>

                <View style={style.verticalLineStyle} />

                <Text style={style.userDetailsTextStyle}> {jobTittle}</Text>
              </View>

              <View style={style.userDetailsDescriptionContainer}>
                <Text style={style.userDetailsTextStyle}>
                  {currentCity || 'N/A'},
                </Text>
                <Text style={style.userDetailsTextStyle}>
                  {' '}
                  {currentCountry || 'N/A'}
                </Text>
              </View>

              <View style={style.bottomImagesContainer}>
                <Image
                  source={images.gradient_button_background_img}
                  style={style.gradientImageContainer}
                />
                <TouchableOpacity
                  activeOpacity={0.5}
                  // onPress={openModal}
                  style={style.gradientImageBody}>
                  <Image source={icons.couple_icon} style={style.coupleImage} />
                  <Text style={style.percentageText}>
                    {userDetails?.matchPercentage}% Match
                  </Text>
                </TouchableOpacity>

                <View style={style.bottomSecondImagesContainer}>
                  {!profilePrivacy && (
                    <TouchableOpacity
                      style={style.cameraImageContainer}
                      activeOpacity={0.5}
                      onPress={userAllImageShare}>
                      <Image
                        source={icons.new_camera_icon}
                        style={style.cameraIcon}
                      />
                      <Text style={{color: colors.white}}>{imageCount}</Text>
                    </TouchableOpacity>
                  )}

                  {matchesUserData?.userData?.status !== 'blocked' && (
                    <TouchableOpacity
                      onPress={handleShortlist}
                      activeOpacity={0.5}
                      style={style.starIconContainer}>
                      <Image
                        source={
                          userDetails?.userShortListDetails?._id ||
                          userDetails?.userShortListDetails?.id
                            ? icons.black_check_icon
                            : icons.black_start_icon
                        }
                        style={style.starIcon}
                      />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    onPress={onThreeDotPress}
                    style={style.threeDotImageContainer}>
                    <Image
                      source={icons.new_three_dot}
                      style={style.threeDotImage}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        {matchesUserData?.userData?.status !== 'blocked' && (
          <View style={style.bodyMiddleContainer}>
            <View style={style.BodyContainer}>
              {matchesUserData?.screen === 'SendScreen' ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={
                    friendStatus === 'requested'
                      ? removeFriendRequest
                      : sendFriendRequest
                  }>
                  <Image
                    source={friendIconSource}
                    style={style.sendRequestIcon}
                  />
                </TouchableOpacity>
              ) : receivedScreeData === 'requested' ? (
                <View
                  style={{
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 15,
                  }}>
                  {requestStatus === 'declined' ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins500,
                          color: colors.black,
                          marginRight: 15,
                        }}>
                        Declined Request
                      </Text>
                      <Image
                        source={icons.matched_declined_icon}
                        tintColor={'#BE6D6B'}
                        style={{
                          width: hp(22),
                          height: hp(22),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  ) : requestStatus === 'accepted' ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins500,
                          color: colors.black,
                          marginRight: 15,
                        }}>
                        Accepted Request
                      </Text>
                      <Image
                        source={icons.matches_accp_icon}
                        tintColor={'#17C270'}
                        style={{
                          width: hp(22),
                          height: hp(22),
                          resizeMode: 'contain',
                        }}
                      />
                    </View>
                  ) : (
                    <>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins500,
                          color: colors.black,
                        }}>
                        Want to accept?
                      </Text>

                      <TouchableOpacity
                        onPress={() => {
                          receivedFriendRequestedAccepted(userDetails);
                        }}>
                        <Image
                          source={icons.received_accept_icon}
                          style={{
                            width: hp(63),
                            height: hp(40),
                            resizeMode: 'contain',
                            marginRight: 15,
                            marginLeft: 18,
                          }}
                        />
                      </TouchableOpacity>

                      <TouchableOpacity
                        // onPress={() => handleDecline(item?.friend?._id, item?._id)}
                        onPress={() => {
                          receivedFriendRequestedDecline(userDetails);
                        }}>
                        <Image
                          source={icons.received_declined_icon}
                          style={{
                            width: hp(63),
                            height: hp(40),
                            resizeMode: 'contain',
                          }}
                        />
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              ) : friendStatus === 'accepted' ? (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={() => {
                    onSendMessagePress(matchesUserData);
                  }}>
                  <Image
                    source={icons.new_send_message_icon}
                    style={style.sendRequestIcon}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={
                    friendStatus === 'requested'
                      ? removeFriendRequest
                      : sendFriendRequest
                  }>
                  <Image
                    source={friendIconSource}
                    style={style.sendRequestIcon}
                  />
                </TouchableOpacity>
              )}

              {/*//////////////*/}
              {(receivedScreeData !== 'requested' ||
                matchesUserData?.screen === 'SendScreen') && (
                <TouchableOpacity activeOpacity={0.5} onPress={handleLike}>
                  <Image
                    source={
                      userDetails?.userLikeDetails?.isLike
                        ? icons.new_user_like_icon
                        : icons.new_like_icon
                    }
                    style={style.likeIcon}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {matchesUserData?.userData?.status !== 'blocked' && (
          <View
            style={{
              width: '100%',
              height: 4,
              backgroundColor: '#F8F8F8',
              marginTop: hp(10),
            }}
          />
        )}

        <View
          style={{
            marginTop: hp(17),
            marginHorizontal: 17,
          }}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(21),
              fontFamily: fontFamily.poppins600,
            }}>
            About
          </Text>
          <Text
            numberOfLines={showFullDescription ? undefined : 4}
            style={{
              color: colors.black,
              fontFamily: fontFamily.poppins400,
              fontSize: fontSize(12),
              lineHeight: hp(18),
              marginTop: hp(19),
            }}>
            {userDetails?.writeBoutYourSelf || 'No Description'}
          </Text>

          <TouchableOpacity
            onPress={toggleDescription}
            style={{alignItems: 'center'}}>
            <Image
              source={icons.rightSideIcon}
              style={{
                width: hp(15),
                height: hp(12),
                tintColor: colors.blue,
                marginTop: hp(20),
                transform: [{rotate: imageRotation}],
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>
        {/*FRIEND BOTTOM SHEET */}
        <RBSheet
          ref={friendBottomSheetRef}
          // height={hp(310)} // Height of the bottom sheet
          height={
            userDetails?.friendsDetails?.status === 'accepted'
              ? hp(430)
              : hp(300)
          }
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
                  onCopyIdPress();
                }}
                style={style.threeDotBottomSheetContainers}>
                <Image
                  source={icons.copy_id_card_icon}
                  style={style.threeDotBottomSheetIcon}
                />
                <Text style={style.threeDotBottomSheetTittleText}>
                  Copy ID : {userDetails?.userUniqueId}
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
                  <Text style={style.threeDotBottomSheetTittleText}>
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

              {/*<Text>Your report will be anonymous.</Text>*/}

              {matchesUserData?.userData?.status === 'blocked' ? (
                <TouchableOpacity
                  style={style.threeDotBottomSheetContainers}
                  onPress={() => {
                    blockedUnfriendFunction();
                  }}>
                  <Image
                    source={icons.block_icon}
                    style={style.threeDotBottomSheetIcon}
                  />

                  <Text style={style.threeDotBottomSheetTittleText}>
                    Unblock{' '}
                    {userDetails?.firstName?.charAt(0).toUpperCase() +
                      userDetails?.firstName?.slice(1)}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    handleBlockProfilePress();
                  }}
                  style={style.threeDotBottomSheetContainers}>
                  <Image
                    source={icons.block_icon}
                    style={[style.threeDotBottomSheetIcon, {top: -8}]}
                  />

                  <View>
                    <Text style={style.threeDotBottomSheetTittleText}>
                      Block{' '}
                      {userDetails?.firstName?.charAt(0).toUpperCase() +
                        userDetails?.firstName?.slice(1) ||
                        userDetails?.name?.charAt(0).toUpperCase() +
                          userDetails?.name?.slice(1)}
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
              )}

              {userDetails?.friendsDetails?.status !== 'requested' &&
                userDetails?.friendsDetails?.status !== 'rejected' &&
                userDetails?.friendsDetails?.status !== 'removed' &&
                userDetails?.friendsDetails?.status !== undefined && (
                  <>
                    <TouchableOpacity
                      onPress={() => {
                        handleUnFriendPress();
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

                    <View
                      style={{
                        width: '100%',
                        height: 1,
                        backgroundColor: '#EBEBEB',
                        marginTop: hp(22),
                      }}
                    />

                    <TouchableOpacity
                      onPress={() => {
                        bottomSheetSendMessagePress(matchesUserData?.userData);
                      }}
                      style={style.threeDotBottomSheetContainers}>
                      <Image
                        source={icons.send_message_icon}
                        style={[style.threeDotBottomSheetIcon, {top: -8}]}
                      />

                      <View>
                        <Text style={style.threeDotBottomSheetTittleText}>
                          Send Message
                        </Text>

                        <Text
                          style={{
                            fontSize: fontSize(12),
                            lineHeight: hp(16),
                            fontFamily: fontFamily.poppins400,
                            color: '#7B7B7B',
                          }}>
                          Send a direct message.
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
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
              <Text style={style.blockModalSubTittleText}>
                {matchesUserData?.userData?.status === 'blocked'
                  ? 'Unblock This User?'
                  : 'Block This User?'}
              </Text>

              <View style={style.blockModalButtonContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    matchesUserData?.userData?.status === 'blocked'
                      ? handleUnBlockedPress()
                      : handleConfirmBlock();
                  }}>
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
                    onPress={() => {
                      setIsUnFriendModalVisible(false);
                    }}>
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

        <View style={{marginTop: hp(10)}}>
          <UsersProfileDetailsScreen userData={userDetails} />
        </View>
        {/*<View style={{height: 50}} />*/}
        <View style={{paddingVertical: 30}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewUserDetailsScreen;
