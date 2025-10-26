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
import ProfileAvatar from '../../../components/letterProfileComponent';
import Toast from 'react-native-toast-message';

const customToastConfig = {
  like: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 50,
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 15, fontWeight: '600'}}>
        {text1}
      </Text>
    </View>
  ),
  disLike: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 50,
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 15, fontWeight: '600'}}>
        {text1}
      </Text>
    </View>
  ),
  sentReq: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 50,
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 15, fontWeight: '600'}}>
        {text1}
      </Text>
    </View>
  ),
  cancelReq: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 50,
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 15, fontWeight: '600'}}>
        {text1}
      </Text>
    </View>
  ),
  copy: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 50,
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 15, fontWeight: '600'}}>
        {text1}
      </Text>
    </View>
  ),

  reqRejected: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 50,
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 15, fontWeight: '600'}}>
        {text1}
      </Text>
    </View>
  ),

  reqAccepted: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: 12,
        borderRadius: 25,
        marginTop: 50,
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text style={{color: 'white', fontSize: 15, fontWeight: '600'}}>
        {text1}
      </Text>
    </View>
  ),
};

const DatingUserDetailsScreen = ({route}) => {
  const {userData, item} = route.params;

  console.log(' === userData++ ===> ', userData?._id);

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;
  const userId = user?.user?.id;
  const imageUrls = userData?.userProfilePic?.map(image => image.url) || [];

  const loginUserData = user?.user;

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [unfriendVisible, setUnfriendVisible] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [isAboutClicked, setIsAboutClicked] = useState(false);
  const [questionText, setQuestionText] = useState(
    'Why are you reporting this?',
  );
  const [aboutText, setAboutText] = useState('');
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [freeCreditModal, setFreeCreditModal] = useState(false);
  const [creditOverModal, setCreditOverModal] = useState(false);

  const navigation = useNavigation();
  const bottomNotFriendSheetRef = useRef(null);
  const bottomFriendSheetRef = useRef(null);
  const ReportBottomSheetRef = useRef();

  // console.log(
  //   ' === +++ userDetails +++ ===> ',
  //   userDetails?.data?.[0]?.friendsDetails?.[0]?.user,
  // );
  //
  // console.log(' === frind id ===> ', userDetails?.data?.[0]?._id);
  //
  // console.log(
  //   ' === Status ===> ',
  //   userDetails?.data?.[0]?.friendsDetails?.[0]?.status,
  // );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/user/get-dating-user/${
            userData?._id || userData?.id
          }`,
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

    if (userData?._id || userData?.id) {
      fetchUserData();
    }
  }, [userData, accessToken]);

  // const onRejectRequest = async () => {
  //   const rejectedData = userDetails?.data?.[0]?.friendsDetails;
  //
  //   // console.log(' === onRejectRequest ===> ', rejectedData[0]?._id);
  //
  //   try {
  //     // Make the API call to reject the request
  //     const response = await axios.post(
  //       'https://stag.mntech.website/api/v1/user/friend/respond-friend-req?appUsesType=dating',
  //       {
  //         user: rejectedData[0]?.friend, // Assuming you want to reject for the logged-in user
  //         request: rejectedData[0]?._id, // Assuming item._id is the request id
  //         status: 'rejected',
  //       },
  //       {
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${accessToken}`, // Add the token dynamically from state
  //         },
  //       },
  //     );
  //
  //     console.log('API Response:', response.data);
  //
  //     // Only update the state if the API call was successful
  //     if (response.status === 200) {
  //       // Mark as declined when the cancel button is clicked and API is successful
  //
  //       console.log(' === response.status ===> ', response.status);
  //     }
  //   } catch (error) {
  //     console.error('Error rejecting friend request:', error);
  //     // Handle the error (e.g., show an error message)
  //   }
  // };

  const onRejectRequest = async () => {
    const rejectedData = userDetails?.data?.[0]?.friendsDetails;

    try {
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/friend/respond-friend-req?appUsesType=dating',
        {
          user: rejectedData[0]?.friend,
          request: rejectedData[0]?._id,
          status: 'rejected',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log('API Response:', response.data);

      if (response.status === 200) {
        setUserDetails(prev => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            data: prev.data.map(user => ({
              ...user,
              friendsDetails: user.friendsDetails.map(friend =>
                friend._id === rejectedData[0]?._id
                  ? {...friend, status: 'rejected'} // or filter it out
                  : friend,
              ),
            })),
          };
        });
        // 🔹 Show toast after unlike
        Toast.show({
          type: 'reqRejected',
          text1: 'Request Rejected',
          position: 'top',
          visibilityTime: 1500,
        });
      }
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  const onAcceptRequest = async () => {
    const rejectedData = userDetails?.data?.[0]?.friendsDetails;

    try {
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/friend/respond-friend-req?appUsesType=dating',
        {
          user: rejectedData[0]?.friend,
          request: rejectedData[0]?._id,
          status: 'accepted',
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log('API Response:', response.data);

      if (response.status === 200) {
        setUserDetails(prev => {
          if (!prev) {
            return prev;
          }
          return {
            ...prev,
            data: prev.data.map(user => ({
              ...user,
              friendsDetails: user.friendsDetails.map(friend =>
                friend._id === rejectedData[0]?._id
                  ? {...friend, status: 'accepted'} // 🔹 update status
                  : friend,
              ),
            })),
          };
        });

        Toast.show({
          type: 'reqAccepted',
          text1: 'Request Accepted',
          position: 'top',
          visibilityTime: 1500,
        });
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

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

    bottomNotFriendSheetRef.current.open();

    // if (friendStatus === 'accepted') {
    //   bottomFriendSheetRef.current.open();
    // } else {
    //   bottomNotFriendSheetRef.current.open();
    // }
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

        // 🔹 Show toast after unlike
        Toast.show({
          type: 'disLike',
          text1: 'Profile Disliked',
          position: 'top',
          visibilityTime: 1500,
        });
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
        Toast.show({
          type: 'like',
          text1: 'Profile Liked',
          position: 'top',
          visibilityTime: 1500,
        });
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

    // console.log(
    //   ' === userDetails ===> ',
    //   userDetails?.data[0]?.friendsDetails[0]?.friend,
    // );

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

          Toast.show({
            type: 'cancelReq',
            text1: 'Cancel Request ',
            position: 'top',
            visibilityTime: 1500,
          });
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

          Toast.show({
            type: 'sentReq',
            text1: 'Request Sent',
            position: 'top',
            visibilityTime: 1500,
          });
        } else {
          Alert.alert(
            'Error',
            'Unable to send friend request. Please try again.',
          );
        }
      } catch (error) {
        console.error('Error sending friend request:', error);
        // Alert.alert('Error', 'Something went wrong. Please try again...');

        const errorMessage =
          error?.response?.data?.message ||
          'Something went wrong. Please try again.';

        console.error('API Error:', errorMessage);

        if (errorMessage.includes('Credit record not found')) {
          setFreeCreditModal(true);
        } else {
          setCreditOverModal(true);
          // Alert.alert('Error', errorMessage);
        }
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
    Toast.show({
      type: 'copy',
      text1: 'Copied',
      position: 'top',
      visibilityTime: 1500,
    });
    await Clipboard.setString(userID);
    bottomNotFriendSheetRef.current.close();
    bottomFriendSheetRef.current.close();
  };

  const onSendMessagePress = userDetail => {
    bottomNotFriendSheetRef.current.close();

    const userData = {
      friendList: userDetail?.data[0],
      userList: loginUserData,
    };

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
    //   ' === var ===> ',
    //   userDetails?.data[0]?.friendsDetails[0]?.friend,
    // );

    // console.log(' === var ===> ', userDetails?.data[0]?._id);
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
        // navigation.goBack();
        navigation.navigate('Matches');
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

  const handleConfirmBlockUnfriend = async () => {
    // console.log(
    //   ' === userDetails__ ===> ',
    //   userDetails?.data[0]?.friendsDetails[0]?._id,
    // );

    // userDetails?.data[0]?._id
    // userDetails?.data[0]?.friendsDetails[0]?._id

    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/friend/block-user?appUsesType=dating',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user: userId,
            friend: userDetails?.data[0]?._id,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log('User blocked/unfriended successfully:', data);
        navigation.navigate('Matches');
        setUnfriendVisible(false);
      } else {
        console.error('Failed to block/unfriend:', data);
      }
    } catch (error) {
      console.error('Error during API call:', error);
      setUnfriendVisible(false);
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
    userDetails?.data[0]?.firstName || userDetails?.data[0]?.name,
  );
  const lastName = capitalizeFirstLetter(userDetails?.data[0]?.lastName);
  const age = userDetails?.data[0]?.dateOfBirth
    ? calculateAge(userDetails?.data[0].dateOfBirth)
    : 'N/A';
  const Occupation = capitalizeFirstLetter(
    userDetails?.data[0]?.userProfessional?.jobTitle,
  );

  // const workCity = capitalizeFirstLetter(
  //   userDetails?.data?.[0]?.datingData?.[0]?.Ethnicity || 'N/A',
  // );

  const workCity = capitalizeFirstLetter(
    userDetails?.data?.[0]?.datingData?.[0]?.Ethnicity || 'N/A',
  );
  const workCountry = capitalizeFirstLetter(
    userDetails?.data[0]?.datingData?.[0]?.CurrentlyLiving || 'N/A',
  );
  const writeBoutYourSelf = userDetails?.data[0]?.writeBoutYourSelf;
  const formattedDate = formatDate(userDetails?.data[0]?.dateOfBirth);
  const CurrentlyLiving = capitalizeFirstLetter(
    userDetails?.data[0]?.datingData?.[0]?.CurrentlyLiving || 'N/A',
  );
  const Ethnicity = capitalizeFirstLetter(
    userDetails?.data[0]?.datingData?.[0]?.Ethnicity || 'N/A',
  );
  const religion = capitalizeFirstLetter(userDetails?.data[0]?.religion);
  const languages =
    userDetails?.data[0]?.motherTongue?.split(',').map(lang => lang.trim()) ||
    [];

  const educationLevel = capitalizeFirstLetter(
    userDetails?.data[0]?.datingData?.[0]?.educationLevel || 'N/A',
  );
  const Occupations = capitalizeFirstLetter(
    userDetails?.data[0]?.datingData?.[0]?.Occupation || 'N/A',
  );

  const hasValidImage =
    userDetails?.data[0]?.profilePic &&
    userDetails?.data[0]?.profilePic !== 'null' &&
    userDetails?.data[0]?.profilePic.trim() !== '';

  const profilePrivacy =
    (userDetails?.data[0].privacySettingCustom?.profilePhotoPrivacy === true ||
      userDetails?.data[0].privacySettingCustom?.showPhotoToFriendsOnly ===
        true) &&
    userDetails?.data[0]?.friendsDetails?.status !== 'accepted';

  // const imageCount = Array.isArray(userData?.userProfilePic)
  //   ? userData?.userProfilePic.length
  //   : 0;

  const getUniqueImagesByFilename = images => {
    const seenFilenames = new Set();
    return images.filter(image => {
      const filename = image.name?.split('/').pop(); // extract filename from `name`
      if (seenFilenames.has(filename)) {
        return false;
      }
      seenFilenames.add(filename);
      return true;
    });
  };

  const uniqueImages = Array.isArray(userDetails?.data[0]?.userProfilePic)
    ? getUniqueImagesByFilename(userDetails?.data[0].userProfilePic)
    : [];

  const imageCount = uniqueImages.length;

  const userAllImageShare = () => {
    const allImages = userDetails?.data[0]?.userProfilePic?.map(
      image => image.url,
    );
    navigation.navigate('UserUploadImageFullScreen', {allImages});
  };

  const formatText = text => {
    if (!text) {
      return 'N.A';
    }
    return text
      .split('_') // split by underscore
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize
      .join(' '); // join with space
  };

  // console.log(' === var ===> ', userData);

  return (
    <SafeAreaView style={style.container}>
      <View style={{zIndex: 99, top: -60}}>
        <Toast config={customToastConfig} />
      </View>

      <View style={style.headerContainer}>
        <Image source={images.happyMilanColorLogo} style={style.appLogo} />

        {/*<TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>*/}
        <TouchableOpacity activeOpacity={0.7} onPress={openTopBottomSheet}>
          {userImage ? (
            <Image source={{uri: userImage}} style={style.profileIcon} />
          ) : (
            <ProfileAvatar
              firstName={user?.user?.firstName || user?.user?.name}
              lastName={user?.user?.lastName}
              textStyle={style.profileIcon}
              profileTexts={{fontSize: fontSize(10)}}
            />
          )}
        </TouchableOpacity>
      </View>
      <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/*<ImagePaginationComponent imageUrls={imageUrls} />*/}
        <View>
          {hasValidImage ? (
            <>
              <Image
                source={{uri: userData.profilePic}}
                style={{width: '100%', height: hp(449), resizeMode: 'cover'}}
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
            <ProfileAvatar
              firstName={userData?.firstName || userData?.name}
              lastName={userData?.lastName}
              textStyle={{
                width: '100%',
                height: hp(449),
                resizeMode: 'cover',
                borderRadius: 0,
              }}
              profileTexts={{fontSize: fontSize(60)}}
            />
          )}

          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 150,
            }}
          />

          <View>
            <View style={style.bodyImageContainer}>
              <View style={style.imageBodyContainer}>
                {userDetails?.data?.[0]?.isUserActive && (
                  <View style={style.onlineBody}>
                    <Text style={style.onlineText}>Online</Text>
                  </View>
                )}

                <View style={style.imageTittleContainer}>
                  <Text style={style.imageTittleText}>
                    {firstName} {lastName},
                  </Text>

                  <Text style={style.imageTittleText}> {age}</Text>
                </View>

                <View style={style.imageSubTittleContainer}>
                  <Text style={style.imageSubTittleText}>
                    {formatText(Occupations)}
                  </Text>

                  <View style={style.verticalLine} />

                  <Text style={style.imageSubTittleText}>
                    {formatText(workCity)},
                  </Text>
                  <Text style={style.imageSubTittleText}>
                    {' '}
                    {formatText(workCountry)}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {!profilePrivacy && (
                    <TouchableOpacity
                      activeOpacity={0.5}
                      style={{
                        width: hp(60),
                        height: hp(30),
                        backgroundColor: '#282727',
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginTop: hp(20),
                      }}
                      onPress={userAllImageShare}>
                      <Image
                        source={icons.new_camera_icon}
                        style={{
                          width: hp(15),
                          height: hp(14),
                          resizeMode: 'contain',
                          marginRight: wp(11),
                        }}
                      />
                      <Text style={{color: 'white'}}>{imageCount}</Text>
                    </TouchableOpacity>
                  )}

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
                      bottom: 0,
                      position: 'absolute',
                      right: 0,
                    }}>
                    <Image
                      source={icons.three_dots_icon}
                      style={{
                        width: hp(12),
                        height: hp(15),
                        tintColor: 'white',
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={style.iconsContainer}>
          {/*{userDetails?.data[0]?.friendsDetails[0]?.status !== 'accepted' && (*/}
          {/*  <View style={style.iconsBodyContainer}>*/}
          {/*    <TouchableOpacity*/}
          {/*      style={style.imagesContainer}*/}
          {/*      onPress={() => {*/}
          {/*        navigation.navigate('Upgrader');*/}
          {/*      }}>*/}
          {/*      <Image*/}
          {/*        source={icons.date_boost_icon}*/}
          {/*        style={style.cancelIcon}*/}
          {/*      />*/}
          {/*    </TouchableOpacity>*/}

          {/*    {userDetails?.data[0]?.userLikeDetails[0]?.isLike ? (*/}
          {/*      <TouchableOpacity*/}
          {/*        style={{*/}
          {/*          width: hp(70),*/}
          {/*          height: hp(40),*/}
          {/*          backgroundColor: '#9E28D7',*/}
          {/*          borderRadius: 30,*/}
          {/*          justifyContent: 'center',*/}
          {/*          alignItems: 'center',*/}
          {/*          marginRight: hp(15),*/}
          {/*        }}*/}
          {/*        onPress={() => OnLikePress(userDetails?.data[0])}>*/}
          {/*        <Image*/}
          {/*          source={icons.dating_white_heart}*/}
          {/*          style={{*/}
          {/*            width: hp(19),*/}
          {/*            height: hp(17),*/}
          {/*            resizeMode: 'contain',*/}
          {/*          }}*/}
          {/*        />*/}
          {/*      </TouchableOpacity>*/}
          {/*    ) : (*/}
          {/*      <TouchableOpacity*/}
          {/*        style={{*/}
          {/*          width: hp(70),*/}
          {/*          height: hp(40),*/}
          {/*          backgroundColor: colors.white,*/}
          {/*          borderRadius: 30,*/}
          {/*          justifyContent: 'center',*/}
          {/*          alignItems: 'center',*/}
          {/*          marginRight: hp(15),*/}
          {/*          borderWidth: 1.5,*/}
          {/*          borderColor: '#E5E5E5CC',*/}
          {/*        }}*/}
          {/*        onPress={() => OnLikePress(userDetails?.data[0])}>*/}
          {/*        <Image*/}
          {/*          source={icons.date_like_icon}*/}
          {/*          style={{*/}
          {/*            width: hp(19),*/}
          {/*            height: hp(17),*/}
          {/*            resizeMode: 'contain',*/}
          {/*          }}*/}
          {/*        />*/}
          {/*      </TouchableOpacity>*/}
          {/*    )}*/}

          {/*    {userDetails?.data[0]?.friendsDetails[0]?.status ===*/}
          {/*    'requested' ? (*/}
          {/*      <TouchableOpacity*/}
          {/*        style={{*/}
          {/*          width: hp(70),*/}
          {/*          height: hp(40),*/}
          {/*          backgroundColor: '#7045EB',*/}
          {/*          borderRadius: 30,*/}
          {/*          justifyContent: 'center',*/}
          {/*          alignItems: 'center',*/}
          {/*        }}*/}
          {/*        onPress={onSendRequest}>*/}
          {/*        <Image*/}
          {/*          source={icons.date_white_send_icon}*/}
          {/*          style={style.sendIcon}*/}
          {/*        />*/}
          {/*      </TouchableOpacity>*/}
          {/*    ) : (*/}
          {/*      <TouchableOpacity*/}
          {/*        style={{*/}
          {/*          width: hp(70),*/}
          {/*          height: hp(40),*/}
          {/*          backgroundColor: colors.white,*/}
          {/*          borderRadius: 30,*/}
          {/*          justifyContent: 'center',*/}
          {/*          alignItems: 'center',*/}
          {/*          borderWidth: 1.5,*/}
          {/*          borderColor: '#E5E5E5CC',*/}
          {/*        }}*/}
          {/*        onPress={onSendRequest}>*/}
          {/*        <Image source={icons.date_send_icon} style={style.sendIcon} />*/}
          {/*      </TouchableOpacity>*/}
          {/*    )}*/}
          {/*  </View>*/}
          {/*)}*/}

          {userDetails?.data?.[0]?.friendsDetails?.[0]?.status ===
            'requested' &&
          userDetails?.data?.[0]?.friendsDetails?.[0]?.user ===
            userDetails?.data?.[0]?._id ? (
            // ✅ Case 1: Show Accept + Reject buttons
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                gap: hp(10),
                marginTop: hp(25),
              }}>
              <TouchableOpacity activeOpacity={0.5} onPress={onAcceptRequest}>
                <LinearGradient
                  colors={['#7045EB', '#4819CB']}
                  start={{x: 1, y: 0}}
                  end={{x: 0, y: 0}}
                  style={{
                    borderRadius: 20,
                    justifyContent: 'center',
                    width: hp(96),
                    height: hp(40),
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Accept
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  backgroundColor: '#EEEEEE',
                  borderRadius: 20,
                  width: hp(96),
                  height: hp(40),
                  justifyContent: 'center',
                  marginRight: 14,
                }}
                onPress={onRejectRequest}>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Decline
                </Text>
              </TouchableOpacity>
            </View>
          ) : userDetails?.data?.[0]?.friendsDetails?.[0]?.status !==
            'accepted' ? (
            // ✅ Case 2: Normal icons block
            <View style={style.iconsBodyContainer}>
              <TouchableOpacity
                style={style.imagesContainer}
                onPress={() => navigation.navigate('Upgrader')}>
                <Image
                  source={icons.date_boost_icon}
                  style={style.cancelIcon}
                />
              </TouchableOpacity>

              {userDetails?.data?.[0]?.userLikeDetails?.[0]?.isLike ? (
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
                  onPress={() => OnLikePress(userDetails?.data?.[0])}>
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
                  onPress={() => OnLikePress(userDetails?.data?.[0])}>
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

              {userDetails?.data?.[0]?.friendsDetails?.[0]?.status ===
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
          ) : null}

          <Text style={style.descriptionText}>{writeBoutYourSelf}</Text>
        </View>
        <View style={style.verticalBreakLine} />

        <View style={style.purposeContainer}>
          <Text style={style.purposeText}>Purpose</Text>

          <View style={style.purposeSubTittleContainer}>
            {userDetails?.data[0]?.datingData?.[0]?.interestedIn?.map(
              (purpose, index) => {
                const formattedPurpose = purpose
                  .replace(/-/g, ' ') // replace all hyphens with space
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
                  .join(' ');

                return (
                  <View key={index} style={style.purposeSubTittleBody}>
                    <Text style={style.purposeSubTittleText}>
                      {formattedPurpose}
                    </Text>
                  </View>
                );
              },
            )}
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
            <Text style={style.baseInfoSubTittle}>
              {formatText(Occupations)}
            </Text>
          </View>
        </View>

        <View style={[style.verticalBreakLine, {marginTop: hp(20)}]} />

        <View style={style.baseInfoContainer}>
          <Text style={style.purposeText}>Hobbies & Interest</Text>

          <View style={style.purposeSubTittleContainer}>
            {userDetails?.data[0]?.hobbies?.map((purpose, index) => {
              const formattedPurpose = purpose
                .replace(/_/g, ' ') // replace underscores with space
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
                .join(' ');

              return (
                <View key={index} style={style.purposeSubTittleBody}>
                  <Text style={style.purposeSubTittleText}>
                    {formattedPurpose}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/*NOT FRIEND BOTTOM SHEET*/}
        <RBSheet
          ref={bottomNotFriendSheetRef}
          // height={hp(430)}
          height={
            userDetails?.data[0]?.friendsDetails[0]?.status === 'accepted'
              ? hp(430)
              : hp(230)
          }
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
              onPress={() => {
                handleShare(userDetails?.data[0]?.name);
              }}
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
                onCopyIdPress(userDetails?.data[0]?.userUniqueId);
              }}
              style={style.threeDotBottomSheetContainers}>
              <Image
                source={icons.copy_id_card_icon}
                style={style.threeDotBottomSheetIcon}
              />
              <Text style={style.threeDotBottomSheetTittleText}>
                Copy ID : {userDetails?.data[0]?.userUniqueId}
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
              onPress={() => {
                bottomNotFriendSheetRef.current.close();
                ReportBottomSheetRef.current.open();
              }}
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

            {userDetails?.data[0]?.friendsDetails[0]?.status === 'accepted' && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    bottomNotFriendSheetRef.current.close();
                    setUnfriendVisible(true);
                  }}
                  style={style.threeDotBottomSheetContainers}>
                  <Image
                    source={icons.block_icon}
                    style={[style.threeDotBottomSheetIcon, {top: -8}]}
                  />

                  <View>
                    <Text style={style.threeDotBottomSheetTittleText}>
                      Block{' '}
                      {userData?.firstName?.charAt(0).toUpperCase() +
                        userData?.firstName?.slice(1) ||
                        userData?.name?.charAt(0).toUpperCase() +
                          userData?.name?.slice(1)}
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

                <TouchableOpacity
                  onPress={() => {
                    bottomNotFriendSheetRef.current.close();
                    setIsBlockModalVisible(true);
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
                    // bottomSheetSendMessagePress(matchesUserData?.userData);
                    onSendMessagePress(userDetails);
                  }}
                  // onPress={() => {
                  //   // console.log(' === var ===> ', userDetails);
                  // }}
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
        </RBSheet>

        {/*FRIEND BOTTOM SHEET*/}
        {/*<RBSheet*/}
        {/*  ref={bottomFriendSheetRef}*/}
        {/*  height={hp(270)}*/}
        {/*  closeOnDragDown={true}*/}
        {/*  closeOnPressMask={true}*/}
        {/*  customStyles={{*/}
        {/*    draggableIcon: {*/}
        {/*      backgroundColor: colors.gray,*/}
        {/*    },*/}
        {/*    container: {*/}
        {/*      borderTopLeftRadius: 20,*/}
        {/*      borderTopRightRadius: 20,*/}
        {/*    },*/}
        {/*  }}>*/}
        {/*  <View*/}
        {/*    style={{*/}
        {/*      flex: 1,*/}
        {/*      marginHorizontal: wp(20),*/}
        {/*      marginTop: hp(10),*/}
        {/*    }}>*/}
        {/*    <TouchableOpacity*/}
        {/*      activeOpacity={0.5}*/}
        {/*      onPress={() => {*/}
        {/*        handleShare(userDetails?.data[0]?.name);*/}
        {/*      }}*/}
        {/*      style={{*/}
        {/*        flexDirection: 'row',*/}
        {/*        alignItems: 'center',*/}
        {/*      }}>*/}
        {/*      <Image*/}
        {/*        source={icons.share_icon}*/}
        {/*        style={{*/}
        {/*          width: hp(20),*/}
        {/*          height: hp(14),*/}
        {/*          resizeMode: 'contain',*/}
        {/*          tintColor: 'black',*/}
        {/*        }}*/}
        {/*      />*/}
        {/*      <Text*/}
        {/*        style={{*/}
        {/*          color: colors.black,*/}
        {/*          marginLeft: wp(20),*/}
        {/*          fontSize: fontSize(16),*/}
        {/*          lineHeight: hp(24),*/}
        {/*          fontFamily: fontFamily.poppins400,*/}
        {/*        }}>*/}
        {/*        Share Profile*/}
        {/*      </Text>*/}
        {/*    </TouchableOpacity>*/}

        {/*    <TouchableOpacity*/}
        {/*      activeOpacity={0.5}*/}
        {/*      onPress={() => {*/}
        {/*        bottomFriendSheetRef.current.close();*/}
        {/*        ReportBottomSheetRef.current.open();*/}
        {/*      }}*/}
        {/*      style={{*/}
        {/*        flexDirection: 'row',*/}
        {/*        alignItems: 'center',*/}
        {/*        marginTop: hp(21),*/}
        {/*      }}>*/}
        {/*      <Image*/}
        {/*        source={icons.report_icon}*/}
        {/*        style={{*/}
        {/*          width: hp(20),*/}
        {/*          height: hp(14),*/}
        {/*          resizeMode: 'contain',*/}
        {/*        }}*/}
        {/*      />*/}
        {/*      <Text*/}
        {/*        style={{*/}
        {/*          color: colors.black,*/}
        {/*          marginLeft: wp(20),*/}
        {/*          fontSize: fontSize(16),*/}
        {/*          lineHeight: hp(24),*/}
        {/*          fontFamily: fontFamily.poppins400,*/}
        {/*        }}>*/}
        {/*        Report Profile*/}
        {/*      </Text>*/}
        {/*    </TouchableOpacity>*/}

        {/*    <TouchableOpacity*/}
        {/*      activeOpacity={0.5}*/}
        {/*      onPress={() => {*/}
        {/*        onCopyIdPress(userDetails?.data[0]?.userUniqueId);*/}
        {/*        // console.log(' === var ===> ', userDetails?.data[0]);*/}
        {/*      }}*/}
        {/*      style={{*/}
        {/*        flexDirection: 'row',*/}
        {/*        alignItems: 'center',*/}
        {/*        marginTop: hp(21),*/}
        {/*      }}>*/}
        {/*      <Image*/}
        {/*        source={icons.copy_icon}*/}
        {/*        style={{*/}
        {/*          width: hp(20),*/}
        {/*          height: hp(14),*/}
        {/*          resizeMode: 'contain',*/}
        {/*        }}*/}
        {/*      />*/}
        {/*      <Text*/}
        {/*        style={{*/}
        {/*          color: colors.black,*/}
        {/*          marginLeft: wp(20),*/}
        {/*          fontSize: fontSize(16),*/}
        {/*          lineHeight: hp(24),*/}
        {/*          fontFamily: fontFamily.poppins400,*/}
        {/*        }}>*/}
        {/*        Copy ID : {userDetails?.data[0]?.userUniqueId}*/}
        {/*      </Text>*/}
        {/*    </TouchableOpacity>*/}

        {/*    <TouchableOpacity*/}
        {/*      activeOpacity={0.5}*/}
        {/*      onPress={() => {*/}
        {/*        bottomFriendSheetRef.current.close(); // Use close() instead of Close()*/}
        {/*        setIsBlockModalVisible(true);*/}
        {/*      }}*/}
        {/*      style={{*/}
        {/*        flexDirection: 'row',*/}
        {/*        alignItems: 'center',*/}
        {/*        marginTop: hp(21),*/}
        {/*      }}>*/}
        {/*      <Image*/}
        {/*        source={icons.unFriend_icon}*/}
        {/*        style={{*/}
        {/*          width: hp(20),*/}
        {/*          height: hp(14),*/}
        {/*          resizeMode: 'contain',*/}
        {/*        }}*/}
        {/*      />*/}
        {/*      <Text*/}
        {/*        style={{*/}
        {/*          color: colors.black,*/}
        {/*          marginLeft: wp(20),*/}
        {/*          fontSize: fontSize(16),*/}
        {/*          lineHeight: hp(24),*/}
        {/*          fontFamily: fontFamily.poppins400,*/}
        {/*        }}>*/}
        {/*        Unfriend*/}
        {/*      </Text>*/}
        {/*    </TouchableOpacity>*/}

        {/*    <TouchableOpacity*/}
        {/*      activeOpacity={0.5}*/}
        {/*      onPress={() => {*/}
        {/*        // onSendMessagePress(item);*/}
        {/*      }}*/}
        {/*      style={{*/}
        {/*        flexDirection: 'row',*/}
        {/*        alignItems: 'center',*/}
        {/*        marginTop: hp(21),*/}
        {/*      }}>*/}
        {/*      <Image*/}
        {/*        source={icons.send_message_icon}*/}
        {/*        style={{*/}
        {/*          width: hp(14),*/}
        {/*          height: hp(14),*/}
        {/*          resizeMode: 'contain',*/}
        {/*        }}*/}
        {/*      />*/}
        {/*      <Text*/}
        {/*        style={{*/}
        {/*          color: colors.black,*/}
        {/*          marginLeft: wp(20),*/}
        {/*          fontSize: fontSize(16),*/}
        {/*          lineHeight: hp(24),*/}
        {/*          fontFamily: fontFamily.poppins400,*/}
        {/*        }}>*/}
        {/*        Send Message*/}
        {/*      </Text>*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*</RBSheet>*/}

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
                  onPress={() => {
                    handleConfirmBlock();
                  }}>
                  <LinearGradient
                    colors={['#7045EB', '#4819CB']}
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

        <Modal
          visible={unfriendVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setUnfriendVisible(false)}>
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
                  onPress={handleConfirmBlockUnfriend}>
                  <LinearGradient
                    colors={['#7045EB', '#4819CB']}
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
                    setUnfriendVisible(false);
                  }}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    style={{
                      width: wp(122),
                      height: hp(50),
                      borderRadius: 50,
                      borderWidth: 1,
                      justifyContent: 'center',
                      borderColor: 'transparent', // Set border color to transparent
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

        {/*FREE CREDIT OVER MODAL*/}
        <Modal
          animationType="none"
          transparent={true}
          visible={freeCreditModal}
          onRequestClose={() => setFreeCreditModal(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.4)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '90%',
                backgroundColor: 'white',
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins400,
                  color: colors.pureBlack,
                  marginTop: hp(42),
                }}>
                Free plan ended — upgrade to
              </Text>
              <Text
                style={{
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins400,
                  color: colors.pureBlack,
                }}>
                send more requests.
              </Text>

              {/* Close Button */}
              <TouchableOpacity
                onPress={() => {
                  setFreeCreditModal(false);
                  navigation.navigate('Upgrader');
                }}
                activeOpacity={0.7}
                style={{marginTop: hp(23), marginBottom: hp(43)}}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1.5}}
                  style={{
                    width: wp(123),
                    height: hp(44),
                    borderRadius: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      marginLeft: hp(20),
                      fontSize: fontSize(14),
                      fontFamily: fontFamily.poppins400,
                      marginRight: wp(7),
                      top: 2,
                    }}>
                    Upgrade
                  </Text>
                  <Image
                    source={icons.crownIcon}
                    style={{
                      width: hp(16.52),
                      height: hp(14),
                      tintColor: colors.white,
                      marginRight: hp(22.12),
                    }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* PURCHASE CREDIT OVER MODAL */}
        <Modal
          animationType="none"
          transparent={true}
          visible={creditOverModal}
          onRequestClose={() => setCreditOverModal(false)}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.4)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                width: '90%',
                backgroundColor: 'white',
                borderRadius: 10,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins400,
                  color: colors.pureBlack,
                  marginTop: hp(42),
                }}>
                No credits left. Purchase more to
              </Text>
              <Text
                style={{
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins400,
                  color: colors.pureBlack,
                }}>
                send requests.
              </Text>

              {/* Close Button */}
              <TouchableOpacity
                onPress={() => {
                  setCreditOverModal(false);
                  navigation.navigate('Upgrader');
                }}
                activeOpacity={0.7}
                style={{marginTop: hp(23), marginBottom: hp(43)}}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1.5}}
                  style={{
                    width: wp(123),
                    height: hp(44),
                    borderRadius: 50,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      marginLeft: hp(20),
                      fontSize: fontSize(14),
                      fontFamily: fontFamily.poppins400,
                      marginRight: wp(7),
                      top: 2,
                    }}>
                    Upgrade
                  </Text>
                  <Image
                    source={icons.crownIcon}
                    style={{
                      width: hp(16.52),
                      height: hp(14),
                      tintColor: colors.white,
                      marginRight: hp(22.12),
                    }}
                  />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={{height: hp(30)}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default DatingUserDetailsScreen;
