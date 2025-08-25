import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  Image,
  View,
  TouchableOpacity,
  Alert,
  Share,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {useSelector} from 'react-redux';
import {colors} from '../../utils/colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {style} from './style';
import ProfileAvatar from '../../components/letterProfileComponent';

const SearchUserDataScreen = ({route}) => {
  const {data} = route.params; // Retrieve data from navigation params

  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;
  const userImage = user?.user?.profilePic;
  const sheetRef = useRef(null);
  const [selectedFirstName, setSelectedFirstName] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState('');
  const [friendStatus, setFriendStatus] = useState('');
  const [sheetHeight, setSheetHeight] = useState(hp(280));
  const [selectedUniqueId, setSelectedUniqueId] = useState('');
  const [selectedUnfriendId, setSelectedUnfriendId] = useState('');
  const [allDataShare, setAllDataShare] = useState('');
  const [percentageLoader, setPercentageLoader] = useState(null);
  const [percentageMatchData, setPercentageMatchData] = useState([]);

  const openBottomSheets = status => {
    setFriendStatus(status); // update friend status

    const height = status === 'accepted' ? hp(340) : hp(280);
    setSheetHeight(height);

    // Wait for height to apply before opening
    setTimeout(() => {
      sheetRef.current?.open();
    }, 0);
  };

  // console.log(' === data ===> ', data);

  const [singleUserData, setSingleUserData] = useState(null); // For single user fetched by ID
  const [searchUserData, setSearchUserData] = useState([]); // For multiple users fetched by search
  const [mode, setMode] = useState('search');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [questionText, setQuestionText] = useState(
    'Why are you reporting this?',
  );
  const [isAboutClicked, setIsAboutClicked] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [isUnFriendModalVisible, setIsUnFriendModalVisible] = useState(false);
  const topModalBottomSheetRef = useRef(null);
  const ReportBottomSheetRef = useRef();
  const [totalDocs, setTotalDocs] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   if (friendStatus === 'green') {
  //     setFriendStatus(null);
  //   }
  // }, [friendStatus]);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const closeBottomSheet = () => {
    sheetRef.current.close();
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

  const capitalizeFirstLetter = str => {
    if (!str) {
      return '';
    }
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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

  useEffect(() => {
    if (accessToken) {
      if (data && data.length === 24) {
        // If the data is an ID (length 24 is common for MongoDB ObjectIds)
        fetchUserDataById(data); // Fetch user data by ID (single user)
      } else {
        fetchUserData(1); // Fetch user data for the search query (multiple users)
      }
    }
  }, [accessToken, data]);

  // Function to fetch user data by ID (single user)
  const fetchUserDataById = async userId => {
    try {
      const response = await axios.get(
        `https://stag.mntech.website/api/v1/user/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('User data fetched by ID:', response.data);

      // setTotalDocs(response.data?.data);

      // Set the single user data into the state
      setSingleUserData(response.data.data[0]); // Assuming the response has a 'data' field
      setMode('single');
      // setSingleUserFullData
    } catch (error) {
      console.error('Error fetching data by ID:', error);
      Alert.alert('Error', 'Failed to fetch user data by ID.');
    }
  };

  // Function to fetch user data via search query (multiple users)
  // const fetchUserData = async (pageNumber = 1) => {
  //   if (!accessToken || isFetching) {
  //     return;
  //   }
  //   if (totalPages && pageNumber > totalPages) {
  //     return;
  //   } // ✅ Prevent extra call
  //   setIsFetching(true);
  //
  //   const url = `https://stag.mntech.website/api/v1/user/search/search-user?page=${pageNumber}`;
  //   const requestBody = {
  //     minAge: data.minAge,
  //     maxAge: data.maxAge,
  //     maritalStatus: data.maritalStatus,
  //     religion: data.religion,
  //     motherTongue: data.motherTongue,
  //     minHeight: data.minHeight,
  //     maxHeight: data.maxHeight,
  //     currentCountry: data.currentCountry,
  //     state: [], // Assuming you will populate this field as needed
  //     currentCity: data.currentCity,
  //   };
  //
  //   try {
  //     const response = await fetch(url, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //       body: JSON.stringify(requestBody),
  //     });
  //
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //
  //     const responseData = await response.json();
  //     // console.log('API Response:', responseData);
  //
  //     // Store the search results (multiple users)
  //     setSearchUserData(responseData.data);
  //     setMode('list');
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //     Alert.alert('Error', 'Failed to fetch user data.');
  //   }
  // };

  const fetchUserData = async (pageNumber = 1) => {
    if (!accessToken || isFetching) {
      return;
    }
    if (totalPages && pageNumber > totalPages) {
      return;
    }

    setIsFetching(true);

    const url = `https://stag.mntech.website/api/v1/user/search/search-user?page=${pageNumber}`;
    const requestBody = {
      minAge: data.minAge,
      maxAge: data.maxAge,
      maritalStatus: data.maritalStatus,
      religion: data.religion,
      motherTongue: data.motherTongue,
      minHeight: data.minHeight,
      maxHeight: data.maxHeight,
      currentCountry: data.currentCountry,
      state: [],
      currentCity: data.currentCity,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      const users = responseData?.data ?? [];

      console.log(
        ' === responseData ===> ',
        responseData?.pagination?.totalDocs,
      );

      setMode('search');
      setSingleUserData(null);
      setTotalDocs(responseData?.pagination?.totalDocs);

      if (pageNumber === 1) {
        setSearchUserData(users);
      } else {
        setSearchUserData(prev => [...prev, ...users]);
      }

      if (responseData?.totalPages) {
        setTotalPages(responseData.totalPages);
      }

      setPage(pageNumber);

      if (users.length === 0 || pageNumber >= responseData?.totalPages) {
        console.log('No more data. Stopping further API calls.');
        setTotalPages(pageNumber); // Lock further fetches
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch user data.');
    } finally {
      setIsFetching(false);
    }
  };

  const loadMoreData = () => {
    if (!isFetching && (!totalPages || page < totalPages)) {
      fetchUserData(page + 1);
    }
  };

  // UseEffect to trigger the correct API call based on the type of 'data'

  // Function to add user to shortlist
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

      setSearchUserData(prevData =>
        prevData.map(user =>
          user._id === shortlistId
            ? {
                ...user,
                userShortListDetails: response.data.data, // Updated shortlist details
              }
            : user,
        ),
      );
      // Re-fetch the user data after adding to shortlist
      // fetchUserData(); // Re-fetch the user data
      ShowToast();
      // if (data && data.length === 24) {
      //   // If the data is an ID (length 24 is common for MongoDB ObjectIds)
      //   fetchUserDataById(data); // Fetch user data by ID (single user)
      // } else {
      //   fetchUserData(); // Fetch user data for the search query (multiple users)
      // }
    } catch (error) {
      console.error('Error adding to shortlist:', error);
      Alert.alert('Error', 'Failed to add to shortlist.');
    }
  };

  // Function to remove user from shortlist
  const removeFromShortlist = async shortlistId => {
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
      // Re-fetch the user data after removing from shortlist
      // fetchUserData(); // Re-fetch the user data

      setSearchUserData(prevData =>
        prevData.map(user =>
          user.userShortListDetails?.id === shortlistId ||
          user.userShortListDetails?._id === shortlistId
            ? {...user, userShortListDetails: null}
            : user,
        ),
      );
      RemoveShortlisted();
      // if (data && data.length === 24) {
      //   // If the data is an ID (length 24 is common for MongoDB ObjectIds)
      //   fetchUserDataById(data); // Fetch user data by ID (single user)
      // } else {
      //   fetchUserData(); // Fetch user data for the search query (multiple users)
      // }
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      Alert.alert('Error', 'Failed to remove from shortlist.');
    }
  };

  const addSingleToShortlist = async shortlistId => {
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

      setSingleUserData(prevUser =>
        prevUser && prevUser._id === shortlistId
          ? {
              ...prevUser,
              userShortListDetails: response.data.data,
            }
          : prevUser,
      );
      // Re-fetch the user data after adding to shortlist
      // fetchUserData(); // Re-fetch the user data
      ShowToast();
      // if (data && data.length === 24) {
      //   // If the data is an ID (length 24 is common for MongoDB ObjectIds)
      //   fetchUserDataById(data); // Fetch user data by ID (single user)
      // } else {
      //   fetchUserData(); // Fetch user data for the search query (multiple users)
      // }
    } catch (error) {
      console.error('Error adding to shortlist:', error);
      Alert.alert('Error', 'Failed to add to shortlist.');
    }
  };

  const removeSingleFromShortlist = async shortlistId => {
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
      // Re-fetch the user data after removing from shortlist
      // fetchUserData(); // Re-fetch the user data

      setSingleUserData(prevUser =>
        prevUser &&
        (prevUser.userShortListDetails?.id === shortlistId ||
          prevUser.userShortListDetails?._id === shortlistId)
          ? {
              ...prevUser,
              userShortListDetails: null,
            }
          : prevUser,
      );
      RemoveShortlisted();
      // if (data && data.length === 24) {
      //   // If the data is an ID (length 24 is common for MongoDB ObjectIds)
      //   fetchUserDataById(data); // Fetch user data by ID (single user)
      // } else {
      //   fetchUserData(); // Fetch user data for the search query (multiple users)
      // }
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      Alert.alert('Error', 'Failed to remove from shortlist.');
    }
  };

  const handleShare = async () => {
    // Close the bottom sheet before sharing
    closeBottomSheet();

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
              spamUserId: selectedFriendId, // Example spam user ID, update with actual ID if needed
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
              spamUserId: selectedFriendId, // Example spam user ID, update with actual ID if needed
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

  const onUnfriendPress = () => {
    console.log(
      ' === onUnfriendPress ===> ',
      selectedUnfriendId,
      selectedFriendId,
    );
    closeBottomSheet();
    setIsUnFriendModalVisible(true);
  };

  const handleConfirmUnFriend = async () => {
    console.log(
      ' === onUnfriendPress ===> ',
      selectedUnfriendId,
      selectedFriendId,
    );

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
            user: selectedFriendId,
            request: selectedUnfriendId,
            status: 'removed',
          }),
        },
      );

      if (response.status === 200) {
        // ✅ Update searchUserData
        setSearchUserData(prevData =>
          prevData.map(user =>
            user._id === selectedFriendId
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

        // ✅ Also update singleUserData if it matches
        setSingleUserData(prev =>
          prev && prev._id === selectedFriendId
            ? {
                ...prev,
                friendsDetails: {
                  ...prev.friendsDetails,
                  status: 'removed',
                },
              }
            : prev,
        );

        setIsUnFriendModalVisible(false);
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

  const onSendMessagePress = userData => {
    closeBottomSheet();
    console.log(' === onSendMessagePress ===> ', userData);
    // navigation.navigate('ChatUserScreen', {
    //   userData,
    // });
  };

  const handlePress = items => {
    const matchesUserData = {
      firstName: items?.firstName,
      id: items?._id,
      userData: items,
    };

    // console.log(' === handlePress ===> ', matchesUserData);
    navigation.navigate('NewUserDetailsScreen', {matchesUserData});
  };

  const renderItem = ({item}) => {
    // console.log(' === var ===> ', item?.friendsDetails?.status);
    // console.log(' === var ===> ', item?.userUniqueId);

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

    const starIconSource = item?.userShortListDetails?.id
      ? icons.black_check_icon
      : icons.black_start_icon;

    const profileImage = item.profilePic;

    const userUniqueId = item?.userUniqueId;
    const friendID = item?._id;
    const unfriendID = item?.friendsDetails?._id;

    const firstName = item.firstName
      ? item.firstName.charAt(0).toUpperCase() +
        item.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item.lastName
      ? item.lastName.charAt(0).toUpperCase() +
        item.lastName.slice(1).toLowerCase()
      : '';

    const name = item.name
      ? item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()
      : '';

    const friendStatusData = item?.friendsDetails?.status;

    const jobTitle = item?.userProfessional?.jobTitle
      ? item?.userProfessional?.jobTitle.charAt(0).toUpperCase() +
        item?.userProfessional?.jobTitle.slice(1).toLowerCase()
      : '';

    const currentCity = item?.address?.currentCity
      ? item?.address?.currentCity.charAt(0).toUpperCase() +
        item?.address?.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item?.address?.currentCountry
      ? item?.address?.currentCountry.charAt(0).toUpperCase() +
        item?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    const imageCount = Array.isArray(item?.userProfilePic)
      ? item.userProfilePic.length
      : 0;

    const userAllImage = Array.isArray(item?.userProfilePic)
      ? item.userProfilePic.map(pic => pic.url)
      : [];

    const JobTittle = item.userProfessional?.jobTitle
      ? item.userProfessional?.jobTitle.charAt(0).toUpperCase() +
        item.userProfessional?.jobTitle.slice(1).toLowerCase()
      : '';

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

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    const onThreeDotPress = () => {
      const status = item?.friendsDetails?.status;

      setSelectedFirstName(name);
      setSelectedUniqueId(userUniqueId);
      setSelectedFriendId(friendID);
      setSelectedUnfriendId(unfriendID);
      openBottomSheets(status);
    };

    return (
      <View style={style.flatListContainer}>
        {/*<Image*/}
        {/*  source={*/}
        {/*    item.profilePic ? {uri: item.profilePic} : images.empty_male_Image*/}
        {/*  }*/}
        {/*  style={style.flatListImageBody}*/}
        {/*  resizeMode={'cover'}*/}
        {/*/>*/}

        {hasValidImage ? (
          <>
            <Image
              source={{uri: item.profilePic}}
              style={style.flatListImageBody}
            />
            {profilePrivacy && item?.friendsDetails?.status !== 'accepted' && (
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
              firstName={item.firstName || item.name}
              lastName={item.lastName}
              textStyle={{
                width: '100%',
                height: hp(449),
                borderRadius: 18,
                marginBottom: hp(13),
              }}
              profileTexts={{fontSize: fontSize(60), marginTop: -80}}
            />
          </>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
          style={style.imageBottomShadow}
        />

        <View style={style.imageBodyDetailContainer}>
          <View style={style.onlineTextBody}>
            <Text style={style.onlineText}>Online</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              handlePress(item);
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.nameText}>
                {firstName || name} {lastName}
              </Text>
              {subPlan && (
                <View
                  style={{
                    height: 22,
                    backgroundColor: 'orange',
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

            <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={style.userAge}>{item?.age || 'N/A'} yrs,</Text>
              <Text style={style.userHeightStyle}>{item?.height}</Text>

              <View style={style.verticalLineStyle} />

              <Text style={style.jobTittleText}>{jobTitle || 'N/A'}</Text>
            </View>

            <View style={style.userAddressDetailsContainer}>
              <Text style={style.currentCityStyle}>
                {currentCity || 'N/A'},
              </Text>

              <Text style={style.currentCountryStyle}>
                {' '}
                {currentCountry || 'N/A'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={style.imageBottomImageContainer}>
            <Image
              source={images.gradient_button_background_img}
              style={style.gradientImageContainer}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              // onPress={openModal}
              onPress={() => {
                openModal(item);
              }}
              style={style.gradientImageButton}>
              {/*<Image source={icons.couple_icon} style={style.coupleImage} />*/}
              {/*<Text style={style.matchesText}>*/}
              {/*  {item?.matchPercentage}% Match*/}
              {/*</Text>*/}
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
                  <Image source={icons.couple_icon} style={style.coupleImage} />
                  <Text style={style.matchesText}>
                    {item?.matchPercentage}% Match
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View style={style.bottomImageContainer}>
              {(!profilePrivacy ||
                item?.friendsDetails?.status === 'accepted') && (
                <TouchableOpacity
                  style={style.cameraImageContainer}
                  activeOpacity={0.5}
                  // onPress={() => {
                  //   navigation.navigate('UserUploadImageFullScreen');
                  // }}
                  onPress={userAllImageShare}>
                  <Image
                    source={icons.new_camera_icon}
                    style={style.cameraImage}
                  />

                  <Text style={{color: colors.white}}>{imageCount}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  if (item?.userShortListDetails?.id) {
                    removeSingleFromShortlist(
                      item.userShortListDetails.id ||
                        item.userShortListDetails._id,
                    ); // Remove from shortlist
                  } else {
                    addSingleToShortlist(item._id); // Add to shortlist
                  }
                }}
                activeOpacity={0.5}
                style={style.starIconContainer}>
                <Image source={starIconSource} style={style.startIcon} />
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
    );
  };

  const SearchUserDataRenderItem = ({item}) => {
    // console.log(
    //   ' === SearchUserDataRenderItem___ ===> ',
    //   item?.friendsDetails?._id,
    // );

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

    const starIconSource = item?.userShortListDetails?.id
      ? icons.black_check_icon // Check icon if shortlisted
      : icons.black_start_icon; // Star icon if not shortlisted

    // console.log(' === uniqueId ===> ', item?.userUniqueId);

    const userUniqueId = item?.userUniqueId;
    const friendID = item?._id;
    const unfriendID = item?.friendsDetails?._id;
    const AllDetailsPass = item;

    const firstName = item.firstName
      ? item.firstName.charAt(0).toUpperCase() +
        item.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item.lastName
      ? item.lastName.charAt(0).toUpperCase() +
        item.lastName.slice(1).toLowerCase()
      : '';

    const name = item.name
      ? item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()
      : '';

    const friendStatusData = item?.friendsDetails?.status;

    const jobTitle = item?.userProfessional?.jobTitle
      ? item?.userProfessional?.jobTitle.charAt(0).toUpperCase() +
        item?.userProfessional?.jobTitle.slice(1).toLowerCase()
      : '';

    const currentCity = item?.address?.currentCity
      ? item?.address?.currentCity.charAt(0).toUpperCase() +
        item?.address?.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item?.address?.currentCountry
      ? item?.address?.currentCountry.charAt(0).toUpperCase() +
        item?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    const calculateAge = dateOfBirth => {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    };

    const age = calculateAge(item.dateOfBirth);

    const imageCount = Array.isArray(item?.userProfilePic)
      ? item.userProfilePic.length
      : 0;

    const userAllImage = Array.isArray(item?.userProfilePic)
      ? item.userProfilePic.map(pic => pic.url)
      : [];

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    const onThreeDotPress = () => {
      const status = item?.friendsDetails?.status;

      setSelectedFirstName(name);
      setSelectedUniqueId(userUniqueId);
      setSelectedFriendId(friendID);
      setSelectedUnfriendId(unfriendID);
      setAllDataShare(AllDetailsPass);

      openBottomSheets(status);
    };

    return (
      <View style={style.flatListContainer}>
        {/*<Image*/}
        {/*  source={*/}
        {/*    item.profilePic ? {uri: item.profilePic} : images.empty_male_Image*/}
        {/*  }*/}
        {/*  style={style.flatListImageBody}*/}
        {/*  resizeMode={'cover'}*/}
        {/*/>*/}

        {hasValidImage ? (
          <>
            <Image
              source={{uri: item.profilePic}}
              style={style.flatListImageBody}
            />
            {profilePrivacy && item?.friendsDetails?.status !== 'accepted' && (
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
              firstName={item.firstName || item.name}
              lastName={item.lastName}
              textStyle={{
                width: '100%',
                height: hp(449),
                borderRadius: 18,
                marginBottom: hp(13),
              }}
              profileTexts={{fontSize: fontSize(60), marginTop: -80}}
            />
          </>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
          style={style.imageBottomShadow}
        />
        <View style={style.imageBodyDetailContainer}>
          <View style={style.onlineTextBody}>
            <Text style={style.onlineText}>Online</Text>
          </View>

          <TouchableOpacity
            onPress={() => {
              handlePress(item);
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.nameText}>
                {firstName || name} {lastName}
              </Text>
              {subPlan && (
                <View
                  style={{
                    height: 22,
                    backgroundColor: 'orange',
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

            <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={style.userAge}>{age || 'N/A'} yrs,</Text>
              <Text style={style.userHeightStyle}>{item?.height}</Text>

              <View style={style.verticalLineStyle} />

              <Text style={style.jobTittleText}>{jobTitle || 'N/A'}</Text>
            </View>

            <View style={style.userAddressDetailsContainer}>
              <Text style={style.currentCityStyle}>
                {currentCity || 'N/A'},
              </Text>

              <Text style={style.currentCountryStyle}>
                {' '}
                {currentCountry || 'N/A'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={style.imageBottomImageContainer}>
            <Image
              source={images.gradient_button_background_img}
              style={style.gradientImageContainer}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              // onPress={openModal}
              onPress={() => {
                openModal(item);
              }}
              style={style.gradientImageButton}
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
                  <Image source={icons.couple_icon} style={style.coupleImage} />
                  <Text style={style.matchesText}>
                    {item?.matchPercentage}% Match
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <View style={style.bottomImageContainer}>
              {(!profilePrivacy ||
                item?.friendsDetails?.status === 'accepted') && (
                <TouchableOpacity
                  style={style.cameraImageContainer}
                  activeOpacity={0.5}
                  // onPress={() => {
                  //   navigation.navigate('UserUploadImageFullScreen');
                  // }}
                  onPress={userAllImageShare}>
                  <Image
                    source={icons.new_camera_icon}
                    style={style.cameraImage}
                  />

                  <Text style={{color: colors.white}}>{imageCount}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  if (item?.userShortListDetails?.id) {
                    removeFromShortlist(
                      item.userShortListDetails.id ||
                        item.userShortListDetails._id,
                    ); // Remove from shortlist
                  } else {
                    addToShortlist(item._id); // Add to shortlist
                  }
                }}
                activeOpacity={0.5}
                style={style.starIconContainer}>
                <Image source={starIconSource} style={style.startIcon} />
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
    );
  };

  const toastConfigs = {
    AddShortlisted: ({text1}) => (
      <View style={style.toastMessageBody}>
        <Text style={style.toastMessageText}>{text1}</Text>
      </View>
    ),
    RemoveShortlisted: ({text1}) => (
      <View style={style.toastMessageBody}>
        <Text style={style.toastMessageText}>{text1}</Text>
      </View>
    ),
  };

  const onBlockPress = friendId => {
    console.log(' === friendId ===> ', friendId);
    closeBottomSheet();
    setIsBlockModalVisible(true);
  };

  const handleConfirmBlock = async () => {
    if (!selectedFriendId || !userId) {
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
            friend: selectedFriendId, // Pass the friend's ID here
            user: userId,
          }),
        },
      );

      if (response.status === 200) {
        setIsBlockModalVisible(false);
        // Alert.alert('Success', 'User has been blocked.');

        // Remove blocked user from the search list (setSearchUserData)
        setSearchUserData(prev =>
          prev.filter(item => item._id !== selectedFriendId),
        );

        // If single user data is set, remove the blocked user from it (setSingleUserData)
        if (singleUserData && singleUserData._id === selectedFriendId) {
          setSingleUserData(null); // or you can set it to a fallback value
        }
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

  const onReportPress = () => {
    console.log(' === onReportPress ===> ');
    closeBottomSheet();
    ReportBottomSheetRef.current.open();
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={{zIndex: 99}}>
        <Toast config={toastConfigs} />
      </View>

      <View style={style.headerContainer}>
        <View style={style.headerBody}>
          <Image source={images.happyMilanColorLogo} style={style.appLogo} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openBottomSheet}
            style={{alignSelf: 'center'}}>
            {userImage ? (
              <Image
                source={{uri: userImage}}
                style={style.topBottomSheetLogo}
              />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName || user?.user?.name}
                lastName={user?.user?.lastName}
                textStyle={style.topBottomSheetLogo}
                profileTexts={{fontSize: fontSize(10)}}
              />
            )}
          </TouchableOpacity>
        </View>

        <View style={style.headerBottomContainer}>
          <Text style={style.headerBottomTittle}>
            {/*{' '}*/}
            {/*{singleUserData ? 1 : totalDocs} Search Results*/}
            {mode === 'single' ? 1 : totalDocs || 0} Search Results
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SearchFilterScreen');
            }}
            activeOpacity={0.5}
            style={style.searchFilterContainer}>
            <Image source={icons.filter_icon} style={style.searchIcon} />
          </TouchableOpacity>
        </View>

        <View>
          <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />
        </View>
      </View>

      <View style={style.bodyContainer}>
        {/* FlatList for single user (by ID) */}
        {data && data.length === 24 ? (
          <FlatList
            data={singleUserData ? [singleUserData] : []} // Wrap the single user data in an array
            renderItem={renderItem}
            keyExtractor={item => item._id}
            ListFooterComponent={<View style={{height: 130}} />}
            ListEmptyComponent={
              <View style={{alignItems: 'center', marginTop: hp(250)}}>
                <Text style={{color: 'gray'}}>No user found.</Text>
              </View>
            }
          />
        ) : (
          <FlatList
            data={searchUserData}
            keyExtractor={item => item._id}
            renderItem={SearchUserDataRenderItem}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={
              isFetching ? (
                <View style={{alignItems: 'center', padding: 20}}>
                  <Text style={{color: 'black'}}>Loading more...</Text>
                </View>
              ) : !isFetching && searchUserData.length === 0 ? (
                <View
                  style={{
                    alignItems: 'center',
                    // padding: 20,
                    marginTop: hp(250),
                  }}>
                  <Text style={{color: 'gray'}}>No user found.</Text>
                </View>
              ) : page >= totalPages && searchUserData.length > 0 ? (
                <View style={{alignItems: 'center', padding: 20}}>
                  <Text style={{color: 'gray'}}>No more data to load.</Text>
                </View>
              ) : null
            }
            contentContainerStyle={{paddingBottom: 100}}
          />
        )}
      </View>

      {/* Bottom Sheet */}
      <RBSheet
        ref={sheetRef}
        // height={hp(420)} // Height of the bottom sheet
        // height={friendStatus === 'accepted' ? hp(420) : hp(280)}
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
          {/*<Text style={{fontSize: 18}}>*/}
          {/*  First Name: {selectedFirstName} {selectedUserUniqueId}*/}
          {/*</Text>*/}

          <View style={{marginHorizontal: 30, marginTop: 20}}>
            <TouchableOpacity
              onPress={handleShare}
              style={style.bottomSheetShareContainer}>
              <Image source={icons.share_icon} style={style.bottomSheetIcon} />
              <Text style={style.bottomSheetText}>Share Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeBottomSheet}
              style={style.bottomBodyContainers}>
              <Image
                source={icons.copy_id_card_icon}
                style={style.bottomSheetIcon}
              />
              <Text style={style.bottomSheetText}>
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
              // onPress={closeBottomSheet}
              onPress={() => {
                onReportPress();
              }}
              style={style.bottomBodyContainers}>
              <Image
                source={icons.new_report_icon}
                style={[style.bottomSheetIcon, {top: -8}]}
              />

              <View>
                <Text style={style.bottomSheetText}>Report</Text>
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
              // onPress={closeBottomSheet}
              onPress={() => {
                onBlockPress(selectedFriendId);
              }}
              style={style.bottomBodyContainers}>
              <Image
                source={icons.block_icon}
                style={[style.bottomSheetIcon, {top: -8}]}
              />

              <View>
                <Text style={style.bottomSheetText}>
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
                  // onPress={closeBottomSheet}
                  onPress={() => {
                    onUnfriendPress();
                  }}
                  style={style.bottomBodyContainers}>
                  <Image
                    source={icons.unFriend_icon}
                    style={[style.bottomSheetIcon, {top: -8}]}
                  />

                  <View>
                    <Text style={style.bottomSheetText}>Unfriend</Text>

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
                {/*  style={style.bottomBodyContainers}>*/}
                {/*  <Image*/}
                {/*    source={icons.send_message_icon}*/}
                {/*    style={[style.bottomSheetIcon, {top: -8}]}*/}
                {/*  />*/}

                {/*  <View>*/}
                {/*    <Text style={style.bottomSheetText}>Send Message</Text>*/}

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

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
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
      </Modal>
    </SafeAreaView>
  );
};

export default SearchUserDataScreen;
