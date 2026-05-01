import React, {useCallback, useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Platform,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import UserProfileSlideAllImageComponent from '../../components/userProfileSlideAllImageComponent';
import {ScrollView} from 'react-native-virtualized-view';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {style} from '../newUserDetailsScreen/style';
import {icons} from '../../assets';
import {
  accepted_Decline_Request,
  non_friend_Blocked,
} from '../../actions/homeActions';
import Toast from 'react-native-toast-message';

import ProfileAvatar from '../../components/letterProfileComponent';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import RBSheet from 'react-native-raw-bottom-sheet';
import CompleteYourProfileModalComponent from '../../components/completeYourProfileModalComponent';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const {width} = Dimensions.get('window');

const UserProfileDetailsScreen = () => {
  const route = useRoute();
  const {userIds} = route.params || {}; // 👈 get userId from deep link
  // console.log(' === userIds******* ===> ', userIds);
  const {matchesUserData} = route.params;
  const navigation = useNavigation();
  // console.log(' === matchesUserData--- ===> ', matchesUserData);
  const flatListRef = useRef();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;
  const isProfileCompletedForReq = user?.user?.isUserprofileCompletedForReq;

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestStatus, setRequestStatus] = useState('pending'); // Default state is 'pending'
  const [selectedUserForRequest, setSelectedUserForRequest] = useState(null);
  const [profileCompleteModal, setProfileCompleteModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('Profile Info');
  const [planStatus, setPlanStatus] = useState(null);
  const [accessibleContact, setAccessibleContact] = useState(null); // NEW STATE
  const [percentageLoader, setPercentageLoader] = useState(null);
  const [percentageMatchData, setPercentageMatchData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [activeIndex, setActiveIndex] = useState(0);

  const [numberSendRequestModal, setNumberSendRequestModal] = useState(false);
  const [numberSendRequestLimitModal, setNumberSendRequestLimitModal] =
    useState(false);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [isUnFriendModalVisible, setIsUnFriendModalVisible] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [isAboutClicked, setIsAboutClicked] = useState(false);

  const [questionText, setQuestionText] = useState(
    'Why are you reporting this?',
  );

  const [aboutText, setAboutText] = useState('');

  const [isReportModalVisible, setReportModalVisible] = useState(false);

  const friendBottomSheetRef = useRef(null);
  const ReportBottomSheetRef = useRef();

  const dispatch = useDispatch();
  // console.log(' === userDetails---- ===> ', userDetails);

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

  // 🔥 IMAGE LOGIC
  const profilePic = userDetails?.profilePic;

  const userImages = Array.isArray(userDetails?.userProfilePic)
    ? userDetails.userProfilePic
    : [];

  const filteredUserImages = userImages.filter(
    item =>
      item?.url &&
      item.url.trim().toLowerCase() !== profilePic?.trim().toLowerCase(),
  );

  const images = [
    ...(profilePic ? [{url: profilePic}] : []),
    ...filteredUserImages,
  ];

  const hasImages = images.length > 0 && images.some(img => img?.url);

  // 🔥 FINAL
  const showPrivateUI =
    userDetails?.friendsDetails?.status !== 'accepted' &&
    Array.isArray(userDetails?.privacySettingCustom?.privateProfile) &&
    userDetails?.privacySettingCustom?.privateProfile.length > 0 &&
    !userDetails?.privacySettingCustom?.publicProfile?.length &&
    !userDetails?.privacySettingCustom?.premiumProfile?.length;

  const fetchSubscription = async () => {
    if (!accessToken) {
      console.warn('No access token available');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/subscription/get-user-subscription',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('User subscription data:', result);
      setPlanStatus(result?.data?.status);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAccessibleById = async () => {
    if (!accessToken || !userDetails?._id) {
      return;
    }

    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/mobile-number-request/accessible-ById/${userDetails?._id}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Accessible by ID data:', result);

      setAccessibleContact(result?.data || null);
    } catch (error) {
      console.error('Error fetching accessible by ID:', error);
    }
  };

  const handleRequestMobileNumber = async () => {
    if (!accessToken || !userDetails?._id) {
      console.warn('Missing accessToken or targetUserId');
      return;
    }

    try {
      setLoading(true); // 👉 start loader

      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/mobile-number-request/create',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            targetUserId: userDetails?._id,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        setNumberSendRequestModal(false);
        setNumberSendRequestLimitModal(true);
        // alert(result.message || 'Something went wrong');
        // console.log(' === result.message ===> ', result.message);
      } else {
        console.log('✅ Mobile number request created:', result);
        setNumberSendRequestModal(false);
      }
    } catch (error) {
      console.error('🚨 Unexpected error:', error);
    } finally {
      setLoading(false); // 👉 stop loader in both success & error
    }
  };

  const openModal = async item => {
    // console.log(' === openModal___ ===> ', item?._id, item?.firstName);

    console.log(' === var ===> ', item);

    try {
      // setLoading(true); // Show loading indicator
      setPercentageLoader(item._id);

      // Call the API to get match details
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/user/get-match-user/${item?._id}`,
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

  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
      fetchSubscription();
      fetchAccessibleById();
      // createProfileViewer();
    }, [matchesUserData?.id, accessToken, userDetails?._id]),
  );

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleBackArrow = () => {
    handleBack();
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const capitalize = text => {
    if (!text) {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle null or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const calculateAge = dob => {
    if (!dob) {
      return 'N/A';
    } // Handle missing date of birth
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(userDetails?.dateOfBirth);

  const friendStatus = userDetails?.friendsDetails?.status || [];
  const receivedScreeData = matchesUserData?.userData?.status || [];

  const friendIconSource =
    friendStatus === 'accepted'
      ? icons.new_Sent_Req_Icon // Request already accepted
      : friendStatus === 'requested'
      ? icons.new_Req_Sent_Icon // Request already sent, allow for rejection
      : icons.new_Sent_Req_Icon; // No request sent, allow sending a request

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

  const RequestSent = () => {
    Toast.show({
      type: 'RequestSent',
      text1: 'Request Sent',
      visibilityTime: 1000,
    });
  };

  const RequestDeclined = () => {
    Toast.show({
      type: 'RequestDeclined',
      text1: 'Request Declined',
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

  const RequestedAccepted = () => {
    Toast.show({
      type: 'RequestAccepted',
      text1: 'Requested Accepted',
      visibilityTime: 1000,
    });
  };

  const receivedFriendRequestedAccepted = item => {
    const requestedId = item?.friendsDetails?._id;

    dispatch(
      accepted_Decline_Request(
        {
          user: userId,
          request: requestedId,
          status: 'accepted',
        },
        () => {
          setRequestStatus('accepted');
          RequestedAccepted();
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
          RequestDeclined();

          // Update userDetails to reflect the declined status
          setUserDetails(prevData => {
            return {
              ...prevData, // Keep the existing data
              friendsDetails: {
                ...prevData.friendsDetails,
                status: 'rejected', // Update the status of the declined request
              },
            };
          });
        },
      ),
    );
  };

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
            status: 'removed', // Reject the friend request
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to remove friend request');
      }

      RequestDeclined();

      setUserDetails(prevState => ({
        ...prevState,
        friendsDetails: {...prevState.friendsDetails, status: 'removed'},
      }));
    } catch (err) {
      alert('Error removing friend');
      console.error(err);
    }
  };

  const sendFriendRequest = async () => {
    console.log(' === sendFriendRequest ===> ');

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
            friend: userDetails?._id, // the person you're sending request to
            user: userId, // current logged in user
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to send friend request');
      }

      const data = await response.json(); // 👈 get API response
      RequestSent();

      // ✅ Update both friend id & status immediately
      setUserDetails(prevState => ({
        ...prevState,
        friendsDetails: {
          ...prevState?.friendsDetails,
          friend: userDetails?._id, // update friend id here
          status: 'requested', // update status
          _id: data?.data?._id || prevState?.friendsDetails?._id, // update request id if API returns it
        },
      }));
    } catch (err) {
      alert('Error sending friend request');
      console.error(err);
    }
  };

  const onSendMessagePress = allData => {
    const userData = {
      friendList: allData,
      userList: user?.user,
    };

    navigation.navigate('ChatUserScreen', {
      userData,
    });
  };

  const handleLike = async () => {
    const likedUserId = userDetails?._id; // The user you want to like/unlike
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

  const handleShortlist = async () => {
    const loggedInUserId = userDetails?._id; // Get the logged-in user's ID
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

    RequestDeclined: ({text1}) => (
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

    RequestSent: ({text1}) => (
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
    RequestAccepted: ({text1}) => (
      <View
        style={{
          backgroundColor: '#333333',
          borderRadius: 100,
          marginHorizontal: 20,
          width: wp(300),
          height: hp(55),
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white',
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

  // Function to format the date to DD/MM/YYYY
  const formatDate = date => {
    if (!date) {
      return '';
    }

    // If the date is in ISO format, convert it to a Date object
    if (typeof date === 'string' && date.includes('T')) {
      date = new Date(date); // Convert ISO string to Date object
    }

    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
    const year = date.getFullYear();

    // Return the date in MM/DD/YYYY format
    return `${day}. ${month}. ${year}`;
  };

  const formatTime = isoString => {
    if (!isoString) {
      return 'NA';
    }

    const date = new Date(isoString);

    return date
      .toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hour12: true, // 🔥 AM/PM
      })
      .toUpperCase(); // 🔥 force AM/PM capital
  };

  const formattedDate = formatDate(
    userDetails?.dateOfBirth
      ? new Date(userDetails?.dateOfBirth)
      : userDetails?.dateOfBirth,
  );

  const formatManglikStatus = value => {
    if (!value) {
      return '';
    }

    return value
      .replace('-', ' ') // 🔥 remove hyphen
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatMaskedMobile = number => {
    if (!number) {
      return 'N/A';
    }

    let numStr = number.toString().replace(/\D/g, '');

    // 🔥 ensure max 10 digits
    if (numStr.length > 10) {
      numStr = numStr.slice(-10);
    }

    // 🔥 get last 3 digits
    const lastThree = numStr.slice(-3);

    return `+91 ***** **${lastThree}`;
  };

  const formatHobby = item => {
    if (!item) {
      return '';
    }

    return item
      .replace(/_/g, ' ') // play_instrument → play instrument
      .replace(/\b\w/g, char => char.toUpperCase()); // capitalize each word
  };

  const formatText = item => {
    if (!item) {
      return '';
    }

    return item.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  const handleShare = async () => {
    const userId = userDetails?._id;
    const isAndroid = Platform.OS === 'android';
    const appDeepLink = isAndroid
      ? `intent://user?userId=${userId}#Intent;scheme=happymilan;package=com.happymilan2;end`
      : `happymilan://user?userId=${userId}`;
    const webFallbackUrl = `https://happymilan.tech/openApp?userId=${userId}`;

    try {
      await Share.share({
        message: `Check out this profile: ${appDeepLink}\nIf not opening, try this link: ${webFallbackUrl}`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      Alert.alert('Error', 'Unable to share the link. Please try again.');
    }
  };

  const onCopyIdPress = async () => {
    await Clipboard.setString(userDetails?.userUniqueId);
    friendBottomSheetRef.current.close();
    CopyId();
  };

  const openBottomSheet = () => {
    friendBottomSheetRef.current.close();

    if (Platform.OS === 'ios') {
      setTimeout(() => {
        ReportBottomSheetRef.current.open();
      }, 200);
    } else {
      ReportBottomSheetRef.current.open();
    }
  };

  const blockedUnfriendFunction = () => {
    console.log(
      ' === blockedUnfriendFunction ===> ',
      matchesUserData?.userData,
    );
    friendBottomSheetRef.current.close();
    setIsBlockModalVisible(true);
  };

  // BLOCKED USER FUNCTION
  const handleBlockProfilePress = () => {
    friendBottomSheetRef.current.close();

    if (Platform.OS === 'ios') {
      setTimeout(() => {
        setIsBlockModalVisible(true);
      }, 200);
    } else {
      setIsBlockModalVisible(true);
    }
  };

  const userAllImageShare = () => {
    const allImages = userDetails?.userProfilePic?.map(image => image.url);
    navigation.navigate('UserUploadImageFullScreen', {allImages});
  };

  const handleUnFriendPress = () => {
    friendBottomSheetRef.current.close();

    if (Platform.OS) {
      setTimeout(() => {
        setIsUnFriendModalVisible(true);
      }, 200);
    } else {
      setIsUnFriendModalVisible(true);
    }
  };

  const bottomSheetSendMessagePress = userDatas => {
    // console.log(' === bottomSheetSendMessagePress ===> ', userDatas);

    friendBottomSheetRef.current.close();
    const userData = {
      friendList: userDatas,
      userList: user?.user,
    };

    if (Platform.OS) {
      setTimeout(() => {
        navigation.navigate('ChatUserScreen', {
          userData,
        });
      }, 200);
    } else {
      navigation.navigate('ChatUserScreen', {
        userData,
      });
    }
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

  // Reset the bottom sheet to its initial state
  const resetBottomSheet = () => {
    setReportReasons([]);
    setQuestionText('Why are you reporting this?');
    setIsAboutClicked(false);
    setAboutText('');
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

  const onCompleteProfilePress = () => {
    setProfileCompleteModal(false);
    navigation.navigate('CreatingProfileScreen');
  };

  const onSendRequestPress = () => {
    if (selectedUserForRequest) {
      sendFriendRequest(selectedUserForRequest);
    }

    setProfileCompleteModal(false);
    setSelectedUserForRequest(null);
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

  // UN-FRIEND FUNCTION
  const handleConfirmUnFriend = () => {
    dispatch(
      accepted_Decline_Request(
        {
          user: userDetails?.friendsDetails?.friend,
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

  // 🔥 SHIMMER LOADER
  if (loading) {
    return (
      <View style={{height: hp(550), width: '100%'}}>
        {/* MAIN IMAGE */}
        <ShimmerPlaceholder
          shimmerColors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
          style={{
            width: '100%',
            height: '100%',
          }}
        />

        {/* PAGINATION */}
        <View
          style={{
            position: 'absolute',
            bottom: hp(20),
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          {[1, 2, 3].map((_, index) => (
            <ShimmerPlaceholder
              key={index}
              style={{
                width: wp(40),
                height: hp(7),
                marginHorizontal: 3,
                borderRadius: hp(100),
              }}
            />
          ))}
        </View>

        {/* BACK */}
        <View
          style={{
            position: 'absolute',
            top: hp(35),
            left: wp(24),
          }}>
          <ShimmerPlaceholder
            style={{
              height: hp(30),
              width: hp(30),
              borderRadius: hp(20),
            }}
          />
        </View>

        {/* MENU */}
        <View
          style={{
            position: 'absolute',
            top: hp(35),
            right: wp(24),
          }}>
          <ShimmerPlaceholder
            style={{
              height: hp(30),
              width: hp(30),
              borderRadius: hp(20),
            }}
          />
        </View>

        {/* CARD */}
        <View
          style={{
            marginTop: -hp(40),
            backgroundColor: '#fff',
            borderBottomRightRadius: hp(25),
            borderBottomLeftRadius: hp(25),
            padding: wp(20),
          }}>
          <ShimmerPlaceholder
            style={{width: '60%', height: 20, marginBottom: 10}}
          />
          <ShimmerPlaceholder
            style={{width: '80%', height: 14, marginBottom: 5}}
          />
          <ShimmerPlaceholder
            style={{width: '50%', height: 14, marginBottom: 15}}
          />

          <View
            style={{height: 1, backgroundColor: '#eee', marginVertical: 10}}
          />

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {[1, 2, 3].map((_, i) => (
              <View key={i} style={{alignItems: 'center'}}>
                <ShimmerPlaceholder
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    marginBottom: 6,
                  }}
                />
                <ShimmerPlaceholder
                  style={{width: 50, height: 12, marginBottom: 4}}
                />
                <ShimmerPlaceholder style={{width: 30, height: 10}} />
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  console.log(' === userDetails---- ===> ', userDetails?.subscriptionDetails);

  const profilePrivacy =
    (userDetails?.privacySettingCustom?.profilePhotoPrivacy === true ||
      userDetails?.privacySettingCustom?.showPhotoToFriendsOnly === true) &&
    userDetails?.friendsDetails?.status !== 'accepted';

  const {selectedPlan, status} = userDetails?.subscriptionDetails || {};

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
    // crownTintColor = '#9CA8C9'; // Silver plan -> silver tint
  } else if (isPlatinumPlan) {
    crownTintColor = 'green'; // Platinum plan -> red tint
  }

  const renderItem = ({item}) => {
    if (!item?.url) {
      return null;
    }

    return (
      <View style={{width}}>
        <Image
          source={{uri: item.url}}
          style={{
            width,
            height: hp(447),
            resizeMode: 'cover',
          }}
        />

        {profilePrivacy && (
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0, // 🔥 full overlay
              justifyContent: 'center',
              alignItems: 'center', // 🔥 perfect center
            }}>
            <Image
              source={icons.logLogo}
              style={{
                tintColor: '#fff',
                width: hp(50),
                height: hp(50),
                resizeMode: 'contain',
              }}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F8FAFC'}}>
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

      <ScrollView showsVerticalScrollIndicator={false}>
        {/*<UserProfileSlideAllImageComponent />*/}

        <View style={{height: hp(447)}}>
          {hasImages ? (
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              onMomentumScrollEnd={event => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width,
                );
                setActiveIndex(index);
              }}
            />
          ) : (
            <>
              <ProfileAvatar
                firstName={userDetails?.firstName}
                lastName={userDetails?.lastName}
                textStyle={{
                  width,
                  height: hp(447),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                profileTexts={{fontSize: fontSize(80)}}
              />
            </>
          )}

          {/* BACK */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{
              position: 'absolute',
              top: hp(16),
              left: wp(24),
            }}>
            <View
              style={{
                height: hp(30),
                width: hp(30),
                borderRadius: hp(20),
                backgroundColor: 'rgba(0,0,0,0.35)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={icons.left_arrow_icon}
                style={{
                  width: hp(9),
                  height: hp(12),
                  tintColor: colors.white,
                  transform: [{rotate: '180deg'}],
                }}
              />
            </View>
          </TouchableOpacity>

          {/* MENU */}
          <TouchableOpacity
            onPress={() => {
              friendBottomSheetRef.current.open();
            }}
            style={{
              position: 'absolute',
              top: hp(16),
              right: wp(24),
            }}>
            <View
              style={{
                height: hp(30),
                width: hp(30),
                borderRadius: hp(20),
                backgroundColor: 'rgba(0,0,0,0.35)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={icons.three_dots_icon}
                style={{
                  width: hp(15),
                  height: hp(15),
                  tintColor: colors.white,
                }}
              />
            </View>
          </TouchableOpacity>

          {/* PAGINATION */}
          {hasImages && (
            <View
              style={{
                position: 'absolute',
                bottom: hp(20),
                alignSelf: 'center',
                flexDirection: 'row',
              }}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={{
                    width: wp(40),
                    height: hp(7),
                    marginHorizontal: 3,
                    borderRadius: hp(100),
                    backgroundColor:
                      activeIndex === index ? '#fff' : 'rgba(255,255,255,0.3)',
                  }}
                />
              ))}
            </View>
          )}
        </View>

        <View
          style={{
            height: hp(217),
            borderBottomLeftRadius: hp(34),
            borderBottomRightRadius: hp(34),

            // 🔥 SHADOW (apply here)
            backgroundColor: '#fff',

            // 🔥 PERFECT SOFT SHADOW
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1, // 🔥 more distance
            },
            shadowOpacity: 0.1,
            shadowRadius: 10, // 🔥 spread blur

            elevation: 10, // 🔥 Android
          }}>
          <View style={{paddingHorizontal: wp(17), marginTop: hp(19)}}>
            <Text
              style={{
                color: userDetails?.isUserActive ? '#18C572' : '#C3C3C3',
                fontSize: fontSize(9),
                fontFamily: fontFamily.poppins700,
              }}>
              {userDetails?.isUserActive ? 'ONLINE' : 'OFFLINE'}
            </Text>

            <View style={{justifyContent: 'center'}}>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(24),
                  fontFamily: fontFamily.poppins700,
                  // marginRight: wp(10),
                }}>
                {capitalize(userDetails?.firstName || userDetails?.Name)}{' '}
                {capitalize(userDetails?.lastName)}
                <View>
                  {subPlan && (
                    <View
                      style={{
                        backgroundColor: crownTintColor,
                        borderRadius: hp(50),
                        flexDirection: 'row',
                        paddingHorizontal: hp(10),
                        paddingVertical: hp(2),
                        marginLeft: wp(10),
                        top: 5,
                      }}>
                      <Image
                        source={icons.crownIcon}
                        style={{
                          width: hp(11),
                          height: hp(11),
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
                        {capitalize(
                          userDetails?.subscriptionDetails?.selectedPlan,
                        )}
                      </Text>
                    </View>
                  )}
                </View>
              </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: '#64748B',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                }}>
                {age ? `${age} yrs` : 'N/A'},{' '}
              </Text>

              <Text
                style={{
                  color: '#64748B',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                }}>
                {userDetails?.height}
              </Text>

              <View
                style={{
                  height: hp(15),
                  width: hp(2),
                  backgroundColor: '#D5D5D5',
                  marginHorizontal: wp(10),
                  top: 3,
                }}
              />

              <Text
                style={{
                  color: '#64748B',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                }}>
                {capitalize(userDetails?.userProfessional?.jobTitle || 'N/A')}
              </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: '#64748B',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                }}>
                {capitalize(userDetails?.address?.currentCity || 'N/A')},{' '}
                {capitalize(userDetails?.address?.currentState || 'N/A')}
              </Text>
            </View>

            {matchesUserData?.userData?.status !== 'blocked' && (
              <View style={{marginHorizontal: wp(0), marginTop: hp(20)}}>
                <View
                  style={{
                    // flexDirection: 'row',
                    // justifyContent: 'center',
                    marginBottom: 10,
                  }}>
                  {matchesUserData?.userData?.status !== 'blocked' && (
                    <View style={{marginHorizontal: wp(0), marginTop: hp(0)}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          marginBottom: 10,
                          // backgroundColor: 'red',
                        }}>
                        {userDetails?.friendsDetails?.status === 'requested' &&
                        userId === userDetails?.friendsDetails?.friend ? (
                          // ✅ Only show Want to accept block
                          <>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontSize: fontSize(16),
                                  fontFamily: fontFamily.poppins500,
                                  color: '#7045EB',
                                }}>
                                Want to accept?
                              </Text>

                              <TouchableOpacity
                                onPress={() => {
                                  receivedFriendRequestedAccepted(userDetails);
                                }}>
                                <Image
                                  source={icons.new_Circle_Check_Icon}
                                  style={{
                                    width: hp(55),
                                    height: hp(55),
                                    resizeMode: 'contain',
                                    marginLeft: wp(42),
                                    marginRight: wp(20),
                                  }}
                                />
                              </TouchableOpacity>

                              <TouchableOpacity
                                onPress={() => {
                                  receivedFriendRequestedDecline(userDetails);
                                }}>
                                <Image
                                  source={icons.new_circle_Cancel_Icon}
                                  style={{
                                    width: hp(55),
                                    height: hp(55),
                                    resizeMode: 'contain',
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                          </>
                        ) : (
                          // ✅ Fallback to your existing logic
                          <>
                            {matchesUserData?.screen === 'SendScreen' ? (
                              <>
                                <TouchableOpacity
                                  activeOpacity={0.5}
                                  onPress={
                                    friendStatus === 'requested'
                                      ? removeFriendRequest
                                      : sendFriendRequest
                                  }>
                                  <Image
                                    source={friendIconSource}
                                    style={{
                                      width: hp(180),
                                      height: hp(55),
                                      resizeMode: 'contain',
                                      marginRight: 20,
                                    }}
                                  />
                                </TouchableOpacity>

                                <TouchableOpacity
                                  activeOpacity={0.5}
                                  onPress={handleLike}>
                                  <Image
                                    source={
                                      userDetails?.userLikeDetails?.isLike
                                        ? icons.new_Heart_Like_Icon
                                        : icons.new_Heart_Unlike_Icon
                                    }
                                    style={{
                                      width: hp(54),
                                      height: hp(53),
                                      resizeMode: 'contain',
                                    }}
                                  />
                                </TouchableOpacity>

                                {matchesUserData?.userData?.status !==
                                  'blocked' && (
                                  <TouchableOpacity
                                    onPress={handleShortlist}
                                    activeOpacity={0.5}
                                    style={{
                                      width: hp(54),
                                      height: hp(53),
                                      borderRadius: hp(50),
                                      marginLeft: wp(23),
                                    }}>
                                    <Image
                                      source={
                                        userDetails?.userShortListDetails
                                          ?._id ||
                                        userDetails?.userShortListDetails?.id
                                          ? icons.new_Short_List_Icon
                                          : icons.new_UnShort_List_Icon
                                      }
                                      style={{
                                        width: hp(54),
                                        height: hp(53),
                                        resizeMode: 'contain',
                                      }}
                                    />
                                  </TouchableOpacity>
                                )}

                                {/*<Text style={{color: 'red'}}>sdln</Text>*/}
                              </>
                            ) : receivedScreeData === 'requested' ? (
                              <View
                                style={{
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  // marginTop: 15,
                                }}>
                                {requestStatus === 'declined' ? (
                                  <View style={{flexDirection: 'row'}}>
                                    {/*<Text*/}
                                    {/*  style={{*/}
                                    {/*    fontSize: fontSize(16),*/}
                                    {/*    lineHeight: hp(24),*/}
                                    {/*    fontFamily: fontFamily.poppins500,*/}
                                    {/*    color: colors.black,*/}
                                    {/*    marginRight: 15,*/}
                                    {/*  }}>*/}
                                    {/*  Declined Request*/}
                                    {/*</Text>*/}
                                    {/*<Image*/}
                                    {/*  source={icons.matched_declined_icon}*/}
                                    {/*  tintColor={'#BE6D6B'}*/}
                                    {/*  style={{*/}
                                    {/*    width: hp(22),*/}
                                    {/*    height: hp(22),*/}
                                    {/*    resizeMode: 'contain',*/}
                                    {/*  }}*/}
                                    {/*/>*/}

                                    <View
                                      style={{
                                        width: wp(185),
                                        height: hp(55),
                                        backgroundColor: '#FFEEEE',
                                        borderRadius: hp(50),
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: wp(25),
                                        marginRight: wp(23),
                                      }}>
                                      <Text
                                        style={{
                                          color: '#EF4136',
                                          fontSize: fontSize(14),
                                          fontFamily: fontFamily.poppins500,
                                        }}>
                                        Rejected
                                      </Text>
                                      <Image
                                        source={icons.thum_Icon}
                                        style={{
                                          width: hp(18),
                                          height: hp(16),
                                          resizeMode: 'contain',
                                          // top: -5,
                                          transform: [{rotate: '180deg'}],
                                          tintColor: 'red', // 👈 color change
                                        }}
                                      />
                                    </View>

                                    <TouchableOpacity
                                      activeOpacity={0.5}
                                      onPress={handleLike}>
                                      <Image
                                        source={
                                          userDetails?.userLikeDetails?.isLike
                                            ? icons.new_Heart_Like_Icon
                                            : icons.new_Heart_Unlike_Icon
                                        }
                                        style={{
                                          width: hp(54),
                                          height: hp(53),
                                          resizeMode: 'contain',
                                        }}
                                      />
                                    </TouchableOpacity>

                                    {matchesUserData?.userData?.status !==
                                      'blocked' && (
                                      <TouchableOpacity
                                        onPress={handleShortlist}
                                        activeOpacity={0.5}
                                        style={{
                                          width: hp(54),
                                          height: hp(53),
                                          borderRadius: hp(50),
                                          marginLeft: wp(23),
                                        }}>
                                        <Image
                                          source={
                                            userDetails?.userShortListDetails
                                              ?._id ||
                                            userDetails?.userShortListDetails
                                              ?.id
                                              ? icons.new_Short_List_Icon
                                              : icons.new_UnShort_List_Icon
                                          }
                                          style={{
                                            width: hp(54),
                                            height: hp(53),
                                            resizeMode: 'contain',
                                          }}
                                        />
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                ) : requestStatus === 'accepted' ? (
                                  <View style={{flexDirection: 'row'}}>
                                    {/*<Text*/}
                                    {/*  style={{*/}
                                    {/*    fontSize: fontSize(16),*/}
                                    {/*    lineHeight: hp(24),*/}
                                    {/*    fontFamily: fontFamily.poppins500,*/}
                                    {/*    color: colors.black,*/}
                                    {/*    marginRight: 15,*/}
                                    {/*  }}>*/}
                                    {/*  Accepted Request*/}
                                    {/*</Text>*/}
                                    {/*<Image*/}
                                    {/*  source={icons.matches_accp_icon}*/}
                                    {/*  tintColor={'#17C270'}*/}
                                    {/*  style={{*/}
                                    {/*    width: hp(22),*/}
                                    {/*    height: hp(22),*/}
                                    {/*    resizeMode: 'contain',*/}
                                    {/*  }}*/}
                                    {/*/>*/}

                                    <View
                                      style={{
                                        width: wp(185),
                                        height: hp(55),
                                        backgroundColor: '#D8FDEB',
                                        borderRadius: hp(50),
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingHorizontal: wp(25),
                                        marginRight: wp(23),
                                      }}>
                                      <Text
                                        style={{
                                          color: '#109957',
                                          fontSize: fontSize(14),
                                          fontFamily: fontFamily.poppins500,
                                        }}>
                                        Accepted
                                      </Text>
                                      <Image
                                        source={icons.thum_Icon}
                                        style={{
                                          width: hp(18),
                                          height: hp(16),
                                          resizeMode: 'contain',
                                          top: -5,
                                        }}
                                      />
                                    </View>

                                    <TouchableOpacity
                                      activeOpacity={0.5}
                                      onPress={handleLike}>
                                      <Image
                                        source={
                                          userDetails?.userLikeDetails?.isLike
                                            ? icons.new_Heart_Like_Icon
                                            : icons.new_Heart_Unlike_Icon
                                        }
                                        style={{
                                          width: hp(54),
                                          height: hp(53),
                                          resizeMode: 'contain',
                                        }}
                                      />
                                    </TouchableOpacity>

                                    {matchesUserData?.userData?.status !==
                                      'blocked' && (
                                      <TouchableOpacity
                                        onPress={handleShortlist}
                                        activeOpacity={0.5}
                                        style={{
                                          width: hp(54),
                                          height: hp(53),
                                          borderRadius: hp(50),
                                          marginLeft: wp(23),
                                        }}>
                                        <Image
                                          source={
                                            userDetails?.userShortListDetails
                                              ?._id ||
                                            userDetails?.userShortListDetails
                                              ?.id
                                              ? icons.new_Short_List_Icon
                                              : icons.new_UnShort_List_Icon
                                          }
                                          style={{
                                            width: hp(54),
                                            height: hp(53),
                                            resizeMode: 'contain',
                                          }}
                                        />
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                ) : null}
                              </View>
                            ) : friendStatus === 'accepted' ? (
                              <>
                                <TouchableOpacity
                                  onPress={() => {
                                    onSendMessagePress(userDetails);
                                  }}
                                  activeOpacity={0.5}
                                  style={{
                                    width: '100%',
                                    height: hp(50),
                                    borderWidth: hp(1),
                                    borderColor: '#7045EB',
                                    borderRadius: hp(50),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <Text
                                    style={{
                                      color: '#7045EB',
                                      fontSize: fontSize(14),
                                      fontFamily: fontFamily.poppins500,
                                    }}>
                                    Send Message
                                  </Text>
                                </TouchableOpacity>
                              </>
                            ) : (
                              <>
                                <TouchableOpacity
                                  activeOpacity={0.5}
                                  onPress={() => {
                                    if (friendStatus === 'requested') {
                                      removeFriendRequest();
                                    } else {
                                      if (!isProfileCompletedForReq) {
                                        // ❌ Profile not completed → show modal
                                        setSelectedUserForRequest(userDetails);
                                        setProfileCompleteModal(true);
                                      } else {
                                        // ✅ Profile completed → send request directly
                                        sendFriendRequest();
                                      }
                                    }
                                  }}>
                                  <Image
                                    source={friendIconSource}
                                    style={{
                                      width: hp(180),
                                      height: hp(55),
                                      resizeMode: 'contain',
                                      marginRight: wp(18),
                                    }}
                                  />
                                </TouchableOpacity>

                                <TouchableOpacity
                                  activeOpacity={0.5}
                                  onPress={handleLike}>
                                  <Image
                                    source={
                                      userDetails?.userLikeDetails?.isLike
                                        ? icons.new_Heart_Like_Icon
                                        : icons.new_Heart_Unlike_Icon
                                    }
                                    style={{
                                      width: hp(54),
                                      height: hp(53),
                                      resizeMode: 'contain',
                                    }}
                                  />
                                </TouchableOpacity>

                                {matchesUserData?.userData?.status !==
                                  'blocked' && (
                                  <TouchableOpacity
                                    onPress={handleShortlist}
                                    activeOpacity={0.5}
                                    style={{
                                      width: hp(54),
                                      height: hp(53),
                                      borderRadius: hp(50),
                                      marginLeft: wp(23),
                                    }}>
                                    <Image
                                      source={
                                        userDetails?.userShortListDetails
                                          ?._id ||
                                        userDetails?.userShortListDetails?.id
                                          ? icons.new_Short_List_Icon
                                          : icons.new_UnShort_List_Icon
                                      }
                                      style={{
                                        width: hp(54),
                                        height: hp(53),
                                        resizeMode: 'contain',
                                      }}
                                    />
                                  </TouchableOpacity>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </View>
                    </View>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={{paddingHorizontal: wp(17), marginTop: hp(26)}}>
          <TouchableOpacity
            onPress={() => {
              openModal(userDetails);
            }}
            activeOpacity={0.5}
            style={{
              width: '100%',
              height: hp(89),
              backgroundColor: '#FAF5FF',
              borderWidth: hp(1),
              borderColor: '#E1D6FF',
              borderRadius: hp(20),
              justifyContent: 'center',
              paddingHorizontal: wp(20),
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Image
                source={icons.couple_icon}
                style={{
                  tintColor: '#7045EB',
                  width: hp(37),
                  height: hp(34),
                  resizeMode: 'contain',
                }}
              />

              <View>
                <Text
                  style={{
                    color: colors.pureBlack,
                    fontSize: fontSize(18),
                    fontFamily: fontFamily.poppins600,
                  }}>
                  {userDetails?.matchPercentage}% profile match
                </Text>
                <Text
                  style={{
                    color: colors.pureBlack,
                    fontSize: fontSize(12),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  View in Details
                </Text>
              </View>

              {/* 🔥 HERE IS MAGIC */}
              {percentageLoader === userDetails?._id ? (
                <ActivityIndicator size="small" color="#CC88ED" />
              ) : (
                <Image
                  source={icons.down_arrow_icon}
                  style={{
                    width: hp(12),
                    height: hp(10),
                    resizeMode: 'contain',
                    transform: [{rotate: '-90deg'}],
                    tintColor: '#CC88ED',
                  }}
                />
              )}
            </View>
          </TouchableOpacity>

          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(18),
              fontFamily: fontFamily.poppins700,
              marginTop: hp(19),
            }}>
            About Me
          </Text>

          <Text
            style={{
              color: '#475569',
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins400,
              marginTop: hp(10),
            }}>
            {userDetails?.writeBoutYourSelf
              ? capitalize(userDetails?.writeBoutYourSelf)
              : 'NA'}
          </Text>
        </View>

        <View style={{marginTop: hp(20), paddingHorizontal: wp(17)}}>
          {/* 🔥 TAB CONTAINER */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#EBF2FE',
              borderRadius: hp(25),
              padding: hp(4),
            }}>
            {/* 🔥 PROFILE INFO TAB */}
            <TouchableOpacity
              onPress={() => setSelectedTab('Profile Info')}
              style={{
                flex: 1,
                height: hp(36),
                borderRadius: hp(25),
                backgroundColor:
                  selectedTab === 'Profile Info' ? '#FFFFFF' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins500,
                }}>
                Profile Info
              </Text>
            </TouchableOpacity>

            {/* 🔥 PARTNER PREFERENCES TAB */}
            <TouchableOpacity
              onPress={() => setSelectedTab('Partner Preferences')}
              style={{
                flex: 1,
                height: hp(36),
                borderRadius: hp(25),
                backgroundColor:
                  selectedTab === 'Partner Preferences'
                    ? '#FFFFFF'
                    : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins500,
                }}>
                Partner Preferences
              </Text>
            </TouchableOpacity>
          </View>
          {/* 🔥 TAB CONTENT */}
          <View style={{marginTop: hp(16)}}>
            {selectedTab === 'Profile Info' ? (
              <View>
                {showPrivateUI ? (
                  <View>
                    <View
                      style={{
                        width: '100%',
                        height: hp(200),
                        backgroundColor: '#7148E4',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: hp(20),
                        marginTop: hp(10),
                      }}>
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: fontSize(18),
                          lineHeight: hp(26),
                          fontFamily: fontFamily.poppins500,
                        }}>
                        Private Profile
                      </Text>
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: fontSize(14),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins400,
                          marginTop: 2,
                        }}>
                        Send a request and wait for approval
                      </Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <View
                      style={{
                        width: '100%',
                        height: 'auto',
                        backgroundColor: colors.white,
                        borderRadius: hp(20),
                        paddingVertical: hp(22),
                        paddingHorizontal: wp(18),
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={icons.profileLogo}
                          style={{
                            tintColor: '#7045EB',
                            width: hp(21),
                            height: hp(20),
                            resizeMode: 'contain',
                          }}
                        />
                        <Text
                          style={{
                            color: colors.pureBlack,
                            fontSize: fontSize(16),
                            fontFamily: fontFamily.poppins600,
                            marginLeft: wp(19),
                          }}>
                          Basic Info
                        </Text>
                      </View>

                      <View
                        style={{
                          marginTop: hp(31),
                          flexDirection: 'row',
                        }}>
                        <View style={{width: '55%'}}>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Date of Birth
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {formattedDate}
                          </Text>
                        </View>

                        <View>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Birth of Time
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {/*{formatTime(user?.user?.birthTime)}*/}
                            {formatTime(userDetails?.birthTime)}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          marginTop: hp(26),
                          flexDirection: 'row',
                        }}>
                        <View style={{width: '55%'}}>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Religion
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {/*{capitalize(user?.user?.religion || 'N/A')}*/}

                            {userDetails?.religion
                              ? capitalize(userDetails?.religion)
                              : 'NA'}
                          </Text>
                        </View>

                        <View>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Caste/Sub Caste
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.caste
                              ? capitalize(userDetails?.caste)
                              : 'NA'}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          marginTop: hp(26),
                          flexDirection: 'row',
                        }}>
                        <View style={{width: '55%'}}>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Height & Weight
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.height || 'NA'},{' '}
                            {userDetails?.weight
                              ? `${userDetails.weight} kg`
                              : 'NA'}
                          </Text>
                        </View>

                        <View>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Marital Status
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {user?.user?.maritalStatus
                              ? capitalize(userDetails?.maritalStatus)
                              : 'NA'}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          marginTop: hp(26),
                          flexDirection: 'row',
                        }}>
                        <View style={{width: '55%'}}>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Manglik Status
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.manglikStatus
                              ? formatManglikStatus(userDetails?.manglikStatus)
                              : 'NA'}
                          </Text>
                        </View>

                        <View>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Gothras
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.gothra
                              ? capitalize(userDetails?.gothra)
                              : 'NA'}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          marginTop: hp(26),
                          flexDirection: 'row',
                        }}>
                        <View style={{width: '55%'}}>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Zodiac Sign
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.zodiac
                              ? capitalize(userDetails?.zodiac)
                              : 'NA'}
                          </Text>
                        </View>

                        <View>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Mother Tongue
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.motherTongue
                              ? capitalize(userDetails?.motherTongue)
                              : 'NA'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        width: '100%',
                        height: 'auto',
                        backgroundColor: colors.white,
                        borderRadius: hp(20),
                        paddingVertical: hp(22),
                        paddingHorizontal: wp(18),
                        marginTop: hp(17),
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={icons.addressLogo}
                          style={{
                            tintColor: '#7045EB',
                            width: hp(16),
                            height: hp(20),
                            resizeMode: 'contain',
                          }}
                        />
                        <Text
                          style={{
                            color: colors.pureBlack,
                            fontSize: fontSize(16),
                            fontFamily: fontFamily.poppins600,
                            marginLeft: wp(19),
                          }}>
                          Location
                        </Text>
                      </View>

                      <View
                        style={{
                          marginTop: hp(29),
                          flexDirection: 'row',
                        }}>
                        <View>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            City & State
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.address?.currentCity
                              ? capitalize(userDetails?.address?.currentCity)
                              : 'NA'}
                            ,{' '}
                            {userDetails?.address?.currentState
                              ? capitalize(userDetails?.address?.currentState)
                              : 'NA'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {planStatus === 'active' ? (
                      <View
                        style={{
                          width: '100%',
                          height: 'auto',
                          backgroundColor: colors.white,
                          borderRadius: hp(20),
                          paddingVertical: hp(22),
                          paddingHorizontal: wp(18),
                          marginTop: hp(17),
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Image
                            source={icons.phoneLogo}
                            style={{
                              tintColor: '#7045EB',
                              width: hp(20),
                              height: hp(20),
                              resizeMode: 'contain',
                              top: 2,
                            }}
                          />
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginLeft: wp(19),
                            }}>
                            Contact
                          </Text>
                        </View>

                        <View
                          style={{
                            marginTop: hp(29),
                            flexDirection: 'row',
                          }}>
                          <View>
                            <Text
                              style={{
                                color: '#878787',
                                fontSize: fontSize(13),
                                fontFamily: fontFamily.poppins400,
                              }}>
                              Phone
                            </Text>

                            <View style={{flexDirection: 'row'}}>
                              <Text
                                style={{
                                  color: colors.pureBlack,
                                  fontSize: fontSize(16),
                                  fontFamily: fontFamily.poppins600,
                                  marginTop: hp(3),
                                }}>
                                {/*{formatMaskedMobile(userDetails?.mobileNumber)}*/}
                                +91 {userDetails?.mobileNumber || '**********'}
                              </Text>

                              {!userDetails?.mobileNumber && (
                                <TouchableOpacity
                                  onPress={() =>
                                    setNumberSendRequestModal(true)
                                  }
                                  activeOpacity={0.5}
                                  style={{
                                    top: -4,
                                    height: hp(30),
                                    width: hp(50),
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}>
                                  <Image
                                    source={icons.blue_screen_eye}
                                    style={{
                                      width: wp(22),
                                      height: hp(15),
                                      resizeMode: 'contain',
                                      tintColor: '#7148E4',
                                    }}
                                  />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                        </View>

                        <View style={{marginTop: hp(27)}}>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Email
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.email ? userDetails?.email : 'NA'}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          width: '100%',
                          height: 'auto',
                          backgroundColor: colors.white,
                          borderRadius: hp(20),
                          paddingVertical: hp(22),
                          paddingHorizontal: wp(18),
                          marginTop: hp(17),
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                          }}>
                          <Image
                            source={icons.phoneLogo}
                            style={{
                              tintColor: '#7045EB',
                              width: hp(20),
                              height: hp(20),
                              resizeMode: 'contain',
                              top: 2,
                            }}
                          />
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginLeft: wp(19),
                            }}>
                            Contact
                          </Text>
                        </View>
                        <LinearGradient
                          colors={['#7045EB', '#4819CB']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 1}}
                          style={{
                            width: '100%',
                            height: hp(244),
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: hp(20),
                            marginTop: hp(15),
                          }}>
                          <Text
                            style={{
                              color: colors.white,
                              fontSize: fontSize(18),
                              lineHeight: hp(26),
                              fontFamily: fontFamily.poppins500,
                            }}>
                            Premium Members Only
                          </Text>
                          <Text
                            style={{
                              color: colors.white,
                              fontSize: fontSize(13),
                              lineHeight: hp(24),
                              fontFamily: fontFamily.poppins400,
                              marginTop: 2,
                            }}>
                            Upgrade to send a request.
                          </Text>

                          <TouchableOpacity
                            onPress={() => navigation.navigate('Upgrader')}
                            activeOpacity={0.6}
                            style={{
                              marginTop: hp(34),
                              width: hp(123),
                              height: hp(44),
                              backgroundColor: colors.white,
                              borderRadius: 22,
                              justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'row',
                            }}>
                            <Text
                              style={{
                                fontSize: fontSize(14),
                                lineHeight: hp(24),
                                fontFamily: fontFamily.poppins500,
                                color: colors.black,
                              }}>
                              Upgrade
                            </Text>

                            <Image
                              source={icons.crownIcon}
                              style={{
                                width: hp(18),
                                height: hp(18),
                                resizeMode: 'contain',
                                marginLeft: hp(8),
                                top: -2,
                              }}
                            />
                          </TouchableOpacity>
                        </LinearGradient>
                      </View>
                    )}

                    <View
                      style={{
                        width: '100%',
                        height: 'auto',
                        backgroundColor: colors.white,
                        borderRadius: hp(20),
                        paddingVertical: hp(22),
                        paddingHorizontal: wp(18),
                        marginTop: hp(17),
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={icons.educationLogo}
                          style={{
                            tintColor: '#7045EB',
                            width: hp(24),
                            height: hp(19),
                            resizeMode: 'contain',
                            top: 2,
                          }}
                        />
                        <Text
                          style={{
                            color: colors.pureBlack,
                            fontSize: fontSize(16),
                            fontFamily: fontFamily.poppins600,
                            marginLeft: wp(19),
                          }}>
                          Education
                        </Text>
                      </View>

                      <View
                        style={{
                          marginTop: hp(31),
                          // flexDirection: 'row',
                        }}>
                        <View>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Degree
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.userEducation?.degree
                              ? capitalize(userDetails?.userEducation?.degree)
                              : 'N/A'}
                          </Text>
                        </View>

                        <View style={{marginTop: hp(26)}}>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            College / Uni.
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.userEducation?.collage
                              ? userDetails?.userEducation?.collage
                                  .charAt(0)
                                  .toUpperCase() +
                                userDetails?.userEducation?.collage.slice(1)
                              : 'N/A'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        width: '100%',
                        height: 'auto',
                        backgroundColor: colors.white,
                        borderRadius: hp(20),
                        paddingVertical: hp(22),
                        paddingHorizontal: wp(18),
                        marginTop: hp(17),
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={icons.professionalLogo}
                          style={{
                            tintColor: '#7045EB',
                            width: hp(22),
                            height: hp(20),
                            resizeMode: 'contain',
                            top: 2,
                          }}
                        />
                        <Text
                          style={{
                            color: colors.pureBlack,
                            fontSize: fontSize(16),
                            fontFamily: fontFamily.poppins600,
                            marginLeft: wp(19),
                          }}>
                          Occupation
                        </Text>
                      </View>

                      <View
                        style={{
                          marginTop: hp(31),
                          flexDirection: 'row',
                        }}>
                        <View style={{width: '55%'}}>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Current Job
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.userProfessional?.jobTitle
                              ? capitalize(
                                  userDetails?.userProfessional?.jobTitle,
                                )
                              : 'N/A'}
                          </Text>
                        </View>

                        <View>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Job Type
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.userProfessional?.jobType
                              ? capitalize(
                                  userDetails?.userProfessional?.jobType,
                                )
                              : 'N/A'}
                          </Text>
                        </View>
                      </View>

                      <View
                        style={{
                          marginTop: hp(27),
                          flexDirection: 'row',
                        }}>
                        <View style={{width: '55%'}}>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Company
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.userProfessional?.companyName
                              ? capitalize(
                                  userDetails?.userProfessional?.companyName,
                                )
                              : 'N/A'}
                          </Text>
                        </View>

                        <View>
                          <Text
                            style={{
                              color: '#878787',
                              fontSize: fontSize(13),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Annual Income
                          </Text>
                          <Text
                            style={{
                              color: colors.pureBlack,
                              fontSize: fontSize(16),
                              fontFamily: fontFamily.poppins600,
                              marginTop: hp(3),
                            }}>
                            {userDetails?.userProfessional?.currentSalary
                              ? `${userDetails?.userProfessional?.currentSalary} LPA`
                              : 'N/A'}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View
                      style={{
                        width: '100%',
                        height: 'auto',
                        backgroundColor: colors.white,
                        borderRadius: hp(20),
                        paddingVertical: hp(22),
                        paddingHorizontal: wp(18),
                        marginTop: hp(17),
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <Image
                          source={icons.internetLogo}
                          style={{
                            tintColor: '#7045EB',
                            width: hp(20),
                            height: hp(20),
                            resizeMode: 'contain',
                            top: 2,
                          }}
                        />
                        <Text
                          style={{
                            color: colors.pureBlack,
                            fontSize: fontSize(16),
                            fontFamily: fontFamily.poppins600,
                            marginLeft: wp(19),
                          }}>
                          Hobbies & Interest
                        </Text>
                      </View>

                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          marginTop: hp(27),
                        }}>
                        {userDetails?.hobbies?.length > 0 ? (
                          userDetails?.hobbies.map((item, index) => (
                            <View
                              key={index}
                              style={{
                                paddingHorizontal: wp(20),
                                paddingVertical: hp(7),
                                backgroundColor: '#F5F2FF',
                                borderRadius: hp(30),
                                marginRight: wp(8),
                                marginBottom: hp(8),
                              }}>
                              <Text
                                style={{
                                  color: '#7148E4',
                                  fontSize: fontSize(14),
                                  fontFamily: fontFamily.poppins400,
                                }}>
                                {formatHobby(item)}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text
                            style={{
                              color: 'gray',
                              fontSize: fontSize(14),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Add Hobbies & Interest
                          </Text>
                        )}
                      </View>

                      <View
                        style={{
                          width: '100%',
                          height: hp(1),
                          backgroundColor: '#DDDDDD',
                          marginTop: hp(34),
                          marginBottom: hp(21),
                        }}
                      />

                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                        }}>
                        Language Known
                      </Text>

                      <View
                        style={{
                          flexDirection: 'row',
                          flexWrap: 'wrap',
                          marginTop: hp(10),
                        }}>
                        {userDetails?.language?.length > 0 ? (
                          userDetails.language.map((item, index) => (
                            <View
                              key={index}
                              style={{
                                paddingHorizontal: wp(20),
                                paddingVertical: hp(7),
                                backgroundColor: '#F5F2FF',
                                borderRadius: hp(30),
                                marginRight: wp(8),
                                marginBottom: hp(8),
                              }}>
                              <Text
                                style={{
                                  color: '#7148E4',
                                  fontSize: fontSize(14),
                                  fontFamily: fontFamily.poppins400,
                                }}>
                                {formatText(item)}
                              </Text>
                            </View>
                          ))
                        ) : (
                          <Text
                            style={{
                              color: 'gray',
                              fontSize: fontSize(14),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            Add Language
                          </Text>
                        )}
                      </View>
                    </View>
                  </>
                )}
              </View>
            ) : (
              <View>
                {showPrivateUI ? (
                  <View>
                    <View
                      style={{
                        width: '100%',
                        height: hp(200),
                        backgroundColor: '#7148E4',
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: hp(20),
                        marginTop: hp(10),
                      }}>
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: fontSize(18),
                          lineHeight: hp(26),
                          fontFamily: fontFamily.poppins500,
                        }}>
                        Private Profile
                      </Text>
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: fontSize(14),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins400,
                          marginTop: 2,
                        }}>
                        Send a request and wait for approval
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View
                    style={{
                      width: '100%',
                      height: 'auto',
                      backgroundColor: colors.white,
                      borderRadius: hp(20),
                      paddingVertical: hp(22),
                      paddingHorizontal: wp(18),
                    }}>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <Image
                        source={icons.profileLogo}
                        style={{
                          tintColor: '#7045EB',
                          width: hp(21),
                          height: hp(20),
                          resizeMode: 'contain',
                        }}
                      />
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginLeft: wp(19),
                        }}>
                        Partner Preference
                      </Text>
                    </View>

                    <Text
                      style={{
                        color: '#878787',
                        fontSize: fontSize(13),
                        fontFamily: fontFamily.poppins400,
                        marginTop: hp(29),
                      }}>
                      Select Age Range
                    </Text>

                    <Text
                      style={{
                        color: colors.pureBlack,
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins600,
                        marginTop: hp(3),
                      }}>
                      {userDetails?.userPartnerDetails?.age?.min} to{' '}
                      {userDetails?.userPartnerDetails?.age?.max} age
                    </Text>

                    <Text
                      style={{
                        color: '#878787',
                        fontSize: fontSize(13),
                        fontFamily: fontFamily.poppins400,
                        marginTop: hp(19),
                      }}>
                      Prefer Heights
                    </Text>

                    <Text
                      style={{
                        color: colors.pureBlack,
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins600,
                        marginTop: hp(3),
                      }}>
                      {userDetails?.userPartnerDetails?.height?.min} to{' '}
                      {userDetails?.userPartnerDetails?.height?.max} ft
                    </Text>

                    <Text
                      style={{
                        color: '#878787',
                        fontSize: fontSize(13),
                        fontFamily: fontFamily.poppins400,
                        marginTop: hp(19),
                      }}>
                      Prefer States
                    </Text>

                    <Text
                      style={{
                        color: colors.pureBlack,
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins600,
                        marginTop: hp(3),
                      }}>
                      {userDetails?.userPartnerDetails?.state?.length > 0
                        ? userDetails?.userPartnerDetails?.state
                            .map(item =>
                              item
                                .replace(/-/g, ' ')
                                .replace(/\b\w/g, char => char.toUpperCase()),
                            )
                            .join(', ')
                        : 'N/A'}
                    </Text>

                    <Text
                      style={{
                        color: '#878787',
                        fontSize: fontSize(13),
                        fontFamily: fontFamily.poppins400,
                        marginTop: hp(19),
                      }}>
                      Prefer Cities
                    </Text>

                    <Text
                      style={{
                        color: colors.pureBlack,
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins600,
                        marginTop: hp(3),
                      }}>
                      {userDetails?.userPartnerDetails?.city?.length > 0
                        ? userDetails?.userPartnerDetails?.city
                            .map(item =>
                              item
                                .replace(/-/g, ' ')
                                .replace(/\b\w/g, char => char.toUpperCase()),
                            )
                            .join(', ')
                        : 'N/A'}
                    </Text>

                    <Text
                      style={{
                        color: '#878787',
                        fontSize: fontSize(13),
                        fontFamily: fontFamily.poppins400,
                        marginTop: hp(19),
                      }}>
                      Prefer Diets
                    </Text>

                    <Text
                      style={{
                        color: colors.pureBlack,
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins600,
                        marginTop: hp(3),
                      }}>
                      {userDetails?.userPartnerDetails?.diet?.length > 0
                        ? userDetails?.userPartnerDetails?.diet
                            .map(
                              item =>
                                item
                                  .split('_') // ["occasionally", "non", "vegetarian"]
                                  .map(
                                    word =>
                                      word.charAt(0).toUpperCase() +
                                      word.slice(1),
                                  )
                                  .join('-'), // join with dash
                            )
                            .join(', ')
                        : 'N/A'}
                    </Text>

                    <Text
                      style={{
                        color: '#878787',
                        fontSize: fontSize(13),
                        fontFamily: fontFamily.poppins400,
                        marginTop: hp(19),
                      }}>
                      Prefer Hobbies
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        marginTop: hp(10),
                      }}>
                      {userDetails?.userPartnerDetails?.hobbies?.length > 0 ? (
                        userDetails?.userPartnerDetails?.hobbies.map(
                          (item, index) => (
                            <View
                              key={index}
                              style={{
                                paddingHorizontal: wp(20),
                                paddingVertical: hp(7),
                                backgroundColor: '#F5F2FF',
                                borderRadius: hp(30),
                                marginRight: wp(8),
                                marginBottom: hp(8),
                              }}>
                              <Text
                                style={{
                                  color: '#7148E4',
                                  fontSize: fontSize(14),
                                  fontFamily: fontFamily.poppins400,
                                }}>
                                {formatText(item)}
                              </Text>
                            </View>
                          ),
                        )
                      ) : (
                        <Text
                          style={{
                            color: 'gray',
                            fontSize: fontSize(14),
                            fontFamily: fontFamily.poppins400,
                          }}>
                          Add Hobbies
                        </Text>
                      )}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        </View>

        <View style={{height: hp(50)}} />
      </ScrollView>

      {/*SEND REQUESTED MOBILE NUMBER VIEW MODAL*/}
      <Modal
        transparent={true}
        animationType="none"
        visible={numberSendRequestModal}
        onRequestClose={() => setNumberSendRequestModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderRadius: 10,
              width: '90%',
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 5,
                width: hp(35),
                height: hp(35),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setNumberSendRequestModal(false);
              }}>
              <Image
                source={icons.x_cancel_icon}
                style={{width: hp(15), height: hp(15), resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: fontSize(16),
                marginTop: hp(65),
                fontFamily: fontFamily.poppins500,
                color: colors.pureBlack,
                textAlign: 'center',
              }}>
              Mobile number can be viewed{'\n'}with the user’s approval.
            </Text>

            <View
              style={{
                marginTop: hp(32),
                marginBottom: hp(31),
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={handleRequestMobileNumber}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={{
                    width: wp(270),
                    height: hp(50),
                    borderRadius: 50,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}>
                  {loading ? (
                    <ActivityIndicator size="large" color="white" />
                  ) : (
                    <Text
                      style={{
                        textAlign: 'center',
                        color: colors.white,
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Send View Request
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/*SEND REQUESTED MOBILE NUMBER LIMIT OVER MODAL*/}
      <Modal
        transparent={true}
        animationType="none"
        visible={numberSendRequestLimitModal}
        onRequestClose={() => setNumberSendRequestLimitModal(false)}>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View
            style={{
              backgroundColor: '#fff',
              // padding: 25,
              borderRadius: 10,
              width: '90%',
              // alignItems: 'center',
            }}>
            <TouchableOpacity
              style={{
                position: 'absolute',
                right: 5,
                width: hp(35),
                height: hp(35),
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                setNumberSendRequestLimitModal(false);
              }}>
              <Image
                source={icons.x_cancel_icon}
                style={{width: hp(15), height: hp(15), resizeMode: 'contain'}}
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: fontSize(16),
                marginTop: hp(65),
                fontFamily: fontFamily.poppins500,
                color: colors.pureBlack,
                textAlign: 'center',
              }}>
              Your limit has expired. Upgrade to{'\n'}access premium features.
            </Text>

            <View
              style={{
                marginTop: hp(32),
                marginBottom: hp(31),
                alignItems: 'center',
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                // onPress={handleRequestMobileNumber}
                onPress={() => {
                  setNumberSendRequestLimitModal(false);
                  navigation.navigate('Upgrader');
                }}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={{
                    width: wp(270),
                    height: hp(50),
                    borderRadius: 50,
                    justifyContent: 'center',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: colors.white,
                      fontSize: fontSize(16),
                      lineHeight: hp(24),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Upgrade
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
              {/*<Image*/}
              {/*  source={{uri: user?.user?.profilePic}}*/}
              {/*  style={style.firstImageStyle}*/}
              {/*/>*/}

              {user?.user?.profilePic ? (
                <Image
                  source={{uri: user?.user?.profilePic}}
                  style={style.firstImageStyle}
                />
              ) : (
                <ProfileAvatar
                  firstName={user?.user?.firstName || user?.user?.name}
                  lastName={user?.user?.lastName}
                  textStyle={style.firstImageStyle}
                  profileTexts={{fontSize: fontSize(20)}}
                />
              )}

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
                      {
                        backgroundColor: step === item ? '#0F52BA' : '#ECECEC',
                      },
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

      {/*FRIEND BOTTOM SHEET */}
      <RBSheet
        ref={friendBottomSheetRef}
        // height={hp(310)} // Height of the bottom sheet
        height={
          userDetails?.friendsDetails?.status === 'accepted' ? hp(470) : hp(350)
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
              <Text
                style={[
                  style.threeDotBottomSheetTittleText,
                  {textTransform: 'uppercase'},
                ]}>
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

            <TouchableOpacity
              onPress={userAllImageShare}
              style={style.threeDotBottomSheetContainers}>
              <Image
                source={icons.image_icon}
                style={[style.threeDotBottomSheetIcon, {top: -8}]}
              />
              <View>
                <Text style={style.threeDotBottomSheetTittleText}>
                  Image Gallery
                </Text>

                <Text
                  style={{
                    fontSize: fontSize(12),
                    lineHeight: hp(16),
                    fontFamily: fontFamily.poppins400,
                    color: '#7B7B7B',
                  }}>
                  View all Images to zoom in
                </Text>
              </View>
            </TouchableOpacity>

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
                      bottomSheetSendMessagePress(
                        matchesUserData?.userData || userDetails,
                      );
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
        onRequestClose={() => {
          setReportModalVisible(false);
        }}>
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
              onPress={() => {
                setReportModalVisible(false);
              }}>
              <LinearGradient
                colors={['#7045EB', '#4819CB']}
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
                  colors={['#7045EB', '#4819CB']}
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
                    colors={['#7045EB', '#4819CB']}
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

      <CompleteYourProfileModalComponent
        visible={profileCompleteModal}
        onClose={() => setProfileCompleteModal(false)}
        onPrimaryPress={onCompleteProfilePress}
        onSecondaryPress={onSendRequestPress}
      />
    </SafeAreaView>
  );
};
export default UserProfileDetailsScreen;
