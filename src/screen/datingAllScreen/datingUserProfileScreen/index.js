import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  Share,
  Clipboard,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {hp, wp, fontSize, fontFamily, isIOS} from '../../../utils/helpers';
import ProfileAvatar from '../../../components/letterProfileComponent';
import {icons} from '../../../assets';
import {colors} from '../../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import {BASE_URL} from '../../../utils/constants';
import {useSelector} from 'react-redux';
import {style} from '../datingUserDetailsScreen/style';
import LinearGradient from 'react-native-linear-gradient';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import RBSheet from 'react-native-raw-bottom-sheet';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const {width} = Dimensions.get('window');

const customToastConfig = {
  like: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: hp(12),
        borderRadius: hp(25),
        marginTop: hp(15),
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: fontSize(14),
          fontFamily: fontFamily.poppins500,
        }}>
        {text1}
      </Text>
    </View>
  ),
  disLike: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: hp(12),
        borderRadius: hp(25),
        marginTop: hp(15),
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: fontSize(14),
          fontFamily: fontFamily.poppins500,
        }}>
        {text1}
      </Text>
    </View>
  ),
  sentReq: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: hp(12),
        borderRadius: hp(25),
        marginTop: hp(15),
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: fontSize(14),
          fontFamily: fontFamily.poppins500,
        }}>
        {text1}
      </Text>
    </View>
  ),
  cancelReq: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: hp(12),
        borderRadius: hp(25),
        marginTop: hp(15),
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: fontSize(15),
          fontFamily: fontFamily.poppins500,
        }}>
        {text1}
      </Text>
    </View>
  ),
  copy: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: hp(12),
        borderRadius: hp(25),
        marginTop: hp(15),
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: fontSize(14),
          fontFamily: fontFamily.poppins500,
        }}>
        {text1}
      </Text>
    </View>
  ),

  reqRejected: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: hp(12),
        borderRadius: hp(25),
        marginTop: hp(15),
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: fontSize(14),
          fontFamily: fontFamily.poppins500,
        }}>
        {text1}
      </Text>
    </View>
  ),

  reqAccepted: ({text1}) => (
    <View
      style={{
        backgroundColor: 'black',
        paddingVertical: hp(12),
        borderRadius: hp(25),
        marginTop: hp(15),
        alignSelf: 'center',
        width: wp(162),
        height: hp(45),
        alignItems: 'center',
      }}>
      <Text
        style={{
          color: 'white',
          fontSize: fontSize(14),
          fontFamily: fontFamily.poppins500,
        }}>
        {text1}
      </Text>
    </View>
  ),
};

const DatingUserProfileScreen = ({route}) => {
  const {userData} = route.params;
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const loginUserData = user?.user;

  // console.log(' === userData ** ===> ', userData);

  const [activeIndex, setActiveIndex] = useState(0);

  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [freeCreditModal, setFreeCreditModal] = useState(false);
  const [creditOverModal, setCreditOverModal] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [isAboutClicked, setIsAboutClicked] = useState(false);
  const [questionText, setQuestionText] = useState(
    'Why are you reporting this?',
  );
  const [aboutText, setAboutText] = useState('');
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [unfriendVisible, setUnfriendVisible] = useState(false);

  console.log(
    ' === var ===> ',
    userDetails?.data[0]?.datingData[0]?.Occupation,
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/user/user/get-dating-user/${
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

  // console.log(' === userData----- ===> ', userDetails?.data[0]);

  const profilePrivacy =
    (userDetails?.data[0]?.privacySettingCustom?.profilePhotoPrivacy === true ||
      userDetails?.data[0]?.privacySettingCustom?.showPhotoToFriendsOnly ===
        true) &&
    userDetails?.data[0]?.friendsDetails?.status !== 'accepted';

  const bottomNotFriendSheetRef = useRef(null);
  const ReportBottomSheetRef = useRef();

  const friendStatus = userDetails?.data?.[0]?.friendsDetails?.[0]?.status;

  const isIncomingRequest =
    friendStatus === 'requested' &&
    userDetails?.data?.[0]?.friendsDetails?.[0]?.user ===
      userDetails?.data?.[0]?._id;

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

  if (error) {
    return (
      <SafeAreaView>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  // const profilePicUrl = userData?.profilePic || '';
  //
  // const filteredUserProfilePics = (userData?.userProfilePic || []).filter(
  //   item => item?.url !== profilePicUrl,
  // );
  //
  // const allImages = [
  //   ...(profilePicUrl ? [{url: profilePicUrl}] : []),
  //   ...filteredUserProfilePics,
  // ];
  //
  // const hasImages = allImages.length > 0 && allImages.some(item => item?.url);

  const profilePicUrl = userDetails?.data?.[0]?.profilePic || '';

  const filteredUserProfilePics = (
    userDetails?.data?.[0]?.userProfilePic || []
  ).filter(
    item => item?.url !== profilePicUrl && !item?.isDeleted, // hide deleted images
  );

  const allImages = [
    ...(profilePicUrl ? [{url: profilePicUrl}] : []),
    ...filteredUserProfilePics,
  ];

  const hasImages = allImages.length > 0 && allImages.some(item => item?.url);

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle null or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const onRejectRequest = async () => {
    const rejectedData = userDetails?.data?.[0]?.friendsDetails;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/user/friend/respond-friend-req?appUsesType=dating`,
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
        `${BASE_URL}/api/v1/user/friend/respond-friend-req?appUsesType=dating`,
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
          `${BASE_URL}/api/v1/user/like/update-like/${currentLikeStatusId}`,
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
          `${BASE_URL}/api/v1/user/like/create-like?appUsesType=dating`,
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

    if (friendStatus === 'requested') {
      // Call the API to respond to the friend request
      try {
        const response = await axios.post(
          `${BASE_URL}/api/v1/user/friend/respond-friend-req?appUsesType=dating`,
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
          `${BASE_URL}/api/v1/user/friend/create-friend?appUsesType=dating`,
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

  const onSendMessage = userDetail => {
    // bottomNotFriendSheetRef.current.close();

    const userData = {
      friendList: userDetail?.data[0],
      userList: loginUserData,
    };

    navigation.navigate('ChatUserScreen', {
      userData,
    });
  };

  const capitalize = text => {
    if (!text) {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
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

  const formattedDate = formatDate(
    userDetails?.data[0]?.dateOfBirth
      ? new Date(userDetails?.data[0]?.dateOfBirth)
      : userDetails?.data[0]?.dateOfBirth,
  );

  const hobbies =
    userDetails?.data[0]?.hobbies?.[0]?.split(',')?.map(item =>
      item
        .trim()
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' '),
    ) || [];

  // console.log(' === var ===> ', userDetails?.data[0]?.hobbies);

  const handleShare = async data => {
    bottomNotFriendSheetRef.current.close();
    // bottomFriendSheetRef.current.close();

    console.log(' === data---- ===> ', data?.firstName);

    const profileId = data?._id || data?.id;

    if (!profileId) {
      Alert.alert('Error', 'Unable to find user profile to share.');
      return;
    }

    const userName =
      data?.firstName || data?.name
        ? `${data?.firstName || data?.name} ${data?.lastName || ''}`.trim()
        : 'User';

    const shareUrl = `https://stag.mntech.website/share/${profileId}?appUsesType=dating&role=user`;
    const message = `Check out ${userName}'s profile on Hapmeet App: ${shareUrl}`;

    try {
      await Share.share({
        title: 'Hapmeet Profile Share',
        message: message,
        url: shareUrl,
      });
    } catch (error) {
      console.error('Error sharing profile link:', error);
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
          `${BASE_URL}/api/v1/user/spam/create-spam?appUsesType=dating`,
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

  const resetBottomSheet = () => {
    setReportReasons([]);
    setQuestionText('Why are you reporting this?');
    setIsAboutClicked(false);
    setAboutText('');
  };

  const handleSubmit = () => {
    console.log('About Text Submitted:', aboutText);
    // Close the bottom sheet after submission
    ReportBottomSheetRef.current.close();

    // Call the API to submit the report
    const submitReport = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/api/v1/user/spam/create-spam?appUsesType=dating`,
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

  const handleConfirmBlock = async () => {
    try {
      setIsBlockModalVisible(false);

      const response = await fetch(
        `${BASE_URL}/api/v1/user/friend/respond-friend-req?appUsesType=dating`,
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
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/user/friend/block-user?appUsesType=dating`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user: user?.user?.id,
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

  const renderItem = ({item}) => (
    <View
      style={{
        width,
        height: hp(477),
      }}>
      <Image
        source={{
          uri: item?.url,
        }}
        style={{
          width: '100%',
          height: '100%',
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F8FAFC'}}>
      <View style={{zIndex: 99, top: -60}}>
        <Toast config={customToastConfig} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {hasImages ? (
          <View>
            <FlatList
              data={allImages}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) =>
                item?._id?.toString() || index.toString()
              }
              renderItem={renderItem}
              onMomentumScrollEnd={event => {
                const index = Math.round(
                  event.nativeEvent.contentOffset.x / width,
                );
                setActiveIndex(index);
              }}
            />

            {/* Tinder Style Pagination */}
            {allImages.length > 1 && (
              <View
                style={{
                  position: 'absolute',
                  bottom: hp(13),
                  left: wp(10),
                  right: wp(10),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                {allImages.map((_, index) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      height: hp(4),
                      borderRadius: hp(10),
                      marginHorizontal: wp(2),
                      backgroundColor:
                        activeIndex === index
                          ? '#fff'
                          : 'rgba(255,255,255,0.3)',
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        ) : (
          <ProfileAvatar
            firstName={userData?.firstName}
            lastName={userData?.lastName}
            textStyle={{
              width,
              height: hp(477),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            profileTexts={{
              fontSize: fontSize(80),
            }}
          />
        )}

        {/* BACK */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            top: hp(25),
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
            bottomNotFriendSheetRef.current.open();
          }}
          style={{
            position: 'absolute',
            top: hp(25),
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

        <View
          style={{
            height: hp(200),
            // height: 'auto',
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
          <View style={{marginHorizontal: wp(21), marginTop: hp(25)}}>
            {userDetails?.data?.[0]?.isUserActive && (
              <Text
                style={{
                  color: '#18C572',
                  fontSize: fontSize(9),
                  fontFamily: fontFamily.poppins700,
                }}>
                Online
              </Text>
            )}

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: fontSize(24),
                  fontFamily: fontFamily.poppins700,
                  color: colors.pureBlack,
                }}>
                {capitalizeFirstLetter(
                  userDetails?.data[0]?.firstName || userDetails?.data[0]?.name,
                )}{' '}
              </Text>
              <Text
                style={{
                  fontSize: fontSize(24),
                  fontFamily: fontFamily.poppins700,
                  color: colors.pureBlack,
                }}>
                {capitalizeFirstLetter(userDetails?.data[0]?.lastName)}
              </Text>
            </View>

            <View
              style={{
                marginTop: hp(5),
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                  color: '#64748B',
                }}>
                {userDetails?.data?.[0]?.datingData?.[0]?.Occupation?.replace(
                  /_/g,
                  ' ',
                )
                  ?.split(' ')
                  ?.map(
                    word =>
                      word.charAt(0).toUpperCase() +
                      word.slice(1).toLowerCase(),
                  )
                  ?.join(' ') || 'NA'}
              </Text>

              <View
                style={{
                  width: hp(1.2),
                  height: hp(13),
                  backgroundColor: '#E6E6E6',
                  marginHorizontal: wp(10),
                  top: -1,
                }}
              />

              <Text
                style={{
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                  color: '#64748B',
                }}>
                {userDetails?.data?.[0]?.datingData?.[0]?.CurrentlyLiving?.split(
                  ',',
                )
                  ?.slice(0, 2)
                  ?.map(
                    item =>
                      item.trim().charAt(0).toUpperCase() +
                      item.trim().slice(1).toLowerCase(),
                  )
                  ?.join(', ') || 'NA'}
              </Text>
            </View>

            {isIncomingRequest ? (
              // Accept / Reject
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: hp(30),
                }}>
                <Text
                  style={{
                    color: '#7045EB',
                    fontSize: fontSize(16),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  Want to Accept?
                </Text>

                <TouchableOpacity activeOpacity={0.6} onPress={onAcceptRequest}>
                  <Image
                    source={icons.new_Circle_Check_Icon}
                    style={{
                      width: hp(50),
                      height: hp(50),
                      resizeMode: 'contain',
                      marginLeft: wp(42),
                      marginRight: wp(21),
                    }}
                  />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.6} onPress={onRejectRequest}>
                  <Image
                    source={icons.new_circle_Cancel_Icon}
                    style={{
                      width: hp(50),
                      height: hp(50),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
            ) : friendStatus === 'accepted' ? (
              // Send Message Button
              <TouchableOpacity
                activeOpacity={0.6}
                // onPress={() => {
                //   navigation.navigate('ChatScreen', {
                //     userData: userDetails?.data?.[0],
                //   });
                // }}
                onPress={() => {
                  // bottomSheetSendMessagePress(matchesUserData?.userData);
                  onSendMessage(userDetails);
                }}
                style={{
                  height: hp(50),
                  backgroundColor: '#7045EB',
                  borderRadius: hp(25),
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: hp(30),
                  marginHorizontal: wp(20),
                }}>
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: fontSize(16),
                    fontFamily: fontFamily.poppins600,
                  }}>
                  Send Message
                </Text>

                <View style={{position: 'absolute', right: 30}}>
                  <Image
                    source={icons.send_icon}
                    style={{
                      tintColor: 'white',
                      width: hp(16),
                      height: hp(16),
                      resizeMode: 'contain',
                    }}
                  />
                </View>
              </TouchableOpacity>
            ) : (
              // Existing Request / Like / Upgrade Buttons
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp(26),
                }}>
                {friendStatus === 'requested' ? (
                  <TouchableOpacity onPress={onSendRequest}>
                    <Image
                      source={icons.new_Req_Sent_Icon}
                      style={{
                        width: hp(180),
                        height: hp(55),
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity activeOpacity={0.6} onPress={onSendRequest}>
                    <Image
                      source={icons.new_Sent_Req_Icon}
                      style={{
                        width: hp(180),
                        height: hp(55),
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                )}

                {userDetails?.data?.[0]?.userLikeDetails?.[0]?.isLike ? (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => OnLikePress(userDetails?.data?.[0])}>
                    <Image
                      source={icons.new_dating_Like_Icon}
                      style={{
                        width: hp(54),
                        height: hp(53),
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => OnLikePress(userDetails?.data?.[0])}>
                    <Image
                      source={icons.new_Dating_Dis_Like_Icon}
                      style={{
                        width: hp(54),
                        height: hp(53),
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => navigation.navigate('Upgrader')}>
                  <Image
                    source={icons.new_Upgrade_Icon}
                    style={{
                      width: hp(54),
                      height: hp(53),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        <View
          style={{
            marginTop: hp(19),
            paddingHorizontal: wp(17),
          }}>
          <View style={{marginTop: hp(16)}}>
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
                  Purpose
                </Text>
              </View>

              <View
                style={{
                  marginTop: hp(25),
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                {userDetails?.data[0]?.datingData[0]?.interestedIn?.map(
                  (item, index) => (
                    <View
                      key={index}
                      style={{
                        backgroundColor: '#F5F2FF',
                        borderRadius: hp(50),
                        paddingHorizontal: wp(18),
                        paddingVertical: hp(8),
                        marginRight: wp(10),
                        marginBottom: hp(12),
                      }}>
                      <Text
                        style={{
                          color: '#7148E4',
                          fontSize: fontSize(14),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        {item
                          .split('-')
                          .map(
                            word =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase(),
                          )
                          .join(' ')}
                      </Text>
                    </View>
                  ),
                )}
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
                marginTop: hp(15),
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

              <Text
                style={{
                  marginTop: hp(20),
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                  color: '#878787',
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

              <Text
                style={{
                  color: '#878787',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                  marginTop: hp(20),
                }}>
                Currently Living
              </Text>

              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins600,
                  marginTop: hp(3),
                }}>
                {userDetails?.data[0]?.datingData[0]?.CurrentlyLiving?.split(
                  ',',
                )
                  ?.slice(0, 2)
                  ?.map(
                    item =>
                      item.trim().charAt(0).toUpperCase() +
                      item.trim().slice(1).toLowerCase(),
                  )
                  ?.join(', ') || 'N/A'}
              </Text>

              <Text
                style={{
                  color: '#878787',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                  marginTop: hp(20),
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
                {userDetails?.data[0]?.religion
                  ? capitalize(userDetails?.data[0]?.religion)
                  : 'NA'}
              </Text>

              <Text
                style={{
                  color: '#878787',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                  marginTop: hp(20),
                }}>
                Ethnicity
              </Text>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins600,
                  marginTop: hp(3),
                }}>
                {userDetails?.data[0]?.datingData[0]?.Ethnicity
                  ? capitalize(userDetails?.data[0]?.datingData[0]?.Ethnicity)
                  : 'NA'}
              </Text>

              <Text
                style={{
                  color: '#878787',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                  marginTop: hp(20),
                }}>
                Spoken Language
              </Text>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins600,
                  marginTop: hp(3),
                }}>
                {userDetails?.data[0]?.motherTongue
                  ? capitalize(userDetails?.data[0]?.motherTongue)
                  : 'NA'}
              </Text>
            </View>

            <View
              style={{
                width: '100%',
                height: 'auto',
                backgroundColor: colors.white,
                borderRadius: hp(20),
                paddingVertical: hp(22),
                paddingHorizontal: wp(18),
                marginTop: hp(15),
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
                  Professional Details
                </Text>
              </View>

              <Text
                style={{
                  marginTop: hp(20),
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                  color: '#878787',
                }}>
                Education Level
              </Text>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins600,
                  marginTop: hp(3),
                }}>
                {userDetails?.data[0]?.datingData[0]?.educationLevel
                  ? capitalize(
                      userDetails?.data[0]?.datingData[0]?.educationLevel,
                    )
                  : 'NA'}
              </Text>

              <Text
                style={{
                  marginTop: hp(20),
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                  color: '#878787',
                }}>
                Occupation
              </Text>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins600,
                  marginTop: hp(3),
                }}>
                {userDetails?.data[0]?.datingData[0]?.Occupation
                  ? capitalize(userDetails?.data[0]?.datingData[0]?.Occupation)
                  : 'NA'}
              </Text>
            </View>

            <View
              style={{
                width: '100%',
                height: 'auto',
                backgroundColor: colors.white,
                borderRadius: hp(20),
                paddingVertical: hp(22),
                paddingHorizontal: wp(18),
                marginTop: hp(15),
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
                  Hobbies & Interest
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: hp(15),
                }}>
                {hobbies.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: '#F5F2FF',
                      borderRadius: hp(20),
                      paddingHorizontal: wp(15),
                      paddingVertical: hp(6),
                      marginRight: hp(10),
                      marginBottom: hp(10),
                    }}>
                    <Text
                      style={{
                        color: '#7148E4',
                        fontSize: fontSize(14),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      {item}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </View>

        <View style={{height: hp(50)}} />
      </ScrollView>

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

      {/*NOT FRIEND BOTTOM SHEET*/}
      <RBSheet
        ref={bottomNotFriendSheetRef}
        // height={hp(430)}
        height={
          userDetails?.data[0]?.friendsDetails[0]?.status === 'accepted'
            ? hp(300)
            : hp(180)
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
              // handleShare(userDetails?.data[0]?.name);
              handleShare(userDetails?.data[0]);
            }}
            style={{flexDirection: 'row', alignItems: 'center'}}>
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
              // handleShare(userDetails?.data[0]?.name);
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
              Report Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
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
              Copy ID : {userDetails?.data[0]?.userUniqueId}
            </Text>
          </TouchableOpacity>

          {userDetails?.data[0]?.friendsDetails[0]?.status === 'accepted' && (
            <>
              <TouchableOpacity
                onPress={() => {
                  bottomNotFriendSheetRef.current.close();
                  setUnfriendVisible(true);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: hp(21),
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
                  Block{' '}
                  {userData?.firstName?.charAt(0).toUpperCase() +
                    userData?.firstName?.slice(1) ||
                    userData?.name?.charAt(0).toUpperCase() +
                      userData?.name?.slice(1)}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  bottomNotFriendSheetRef.current.close();
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

              <TouchableOpacity
                onPress={() => {
                  onSendMessagePress(userDetails);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: hp(21),
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
            </>
          )}
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
    </SafeAreaView>
  );
};

export default DatingUserProfileScreen;
