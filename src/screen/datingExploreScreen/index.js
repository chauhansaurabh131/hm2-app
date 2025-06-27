import React, {useEffect, useRef, useState} from 'react';
import {
  Clipboard,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import LinearGradient from 'react-native-linear-gradient';
import {style} from './style';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAllRequestedDating,
  getAllAcceptedDating,
  non_friend_Blocked,
} from '../../actions/homeActions';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import {useNavigation} from '@react-navigation/native';

import axios from 'axios';
import ProfileAvatar from '../../components/letterProfileComponent';

const imageData = [
  {id: '1', source: images.meet_new_friends_img, title: 'Meet New Friends'},
  {id: '2', source: images.looking_love_img, title: 'Looking for Love'},
  {id: '3', source: images.movie_date_img, title: 'Movie Date'},
  {id: '4', source: images.foodies_img, title: 'Foodies'},
  {id: '5', source: images.travel_Buddies_img, title: 'Travel Buddies'},
  {id: '6', source: images.game_lover_img, title: 'Game Lover'},
  {id: '7', source: images.chit_chat_img, title: 'Chit-Chat'},
  {id: '8', source: images.adventurous_img, title: 'Adventurous'},
];

const DatingExploreScreen = () => {
  const [selectedText, setSelectedText] = useState('Category');
  const bottomSheetRef = useRef(null); // Create a ref for the bottom sheet
  const [selectedUser, setSelectedUser] = useState(null); //
  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [clickedUsers, setClickedUsers] = useState({});
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [unfriendVisible, setUnfriendVisible] = useState(false);
  const [selectedFirstName, setSelectedFirstName] = useState('');
  const [selectedFrinedId, setSelectedFriendId] = useState('');
  const [selectFriendRequestedId, setSelectFriendRequestId] = useState('');
  const [userFullDetails, setUserFullDetails] = useState('');
  const [selectedUniqueId, setSelectedUniqueId] = useState('');
  const [reportReasons, setReportReasons] = useState([]);
  const [isAboutClicked, setIsAboutClicked] = useState(false);
  const [questionText, setQuestionText] = useState(
    'Why are you reporting this?',
  );
  const [aboutText, setAboutText] = useState('');
  const [isReportModalVisible, setReportModalVisible] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRequestedDating());
    dispatch(getAllAcceptedDating());
  }, [dispatch]);

  const {user} = useSelector(state => state.auth);
  const {getAllRequest, getAllAccepted} = useSelector(state => state.home);
  const users = getAllRequest?.data?.results || [];

  const userId = user?.user?.id;
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;
  const acceptedUsers = getAllAccepted?.data?.results || [];

  const topModalBottomSheetRef = useRef(null);
  const ReportBottomSheetRef = useRef();
  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  useEffect(() => {
    // Filter the `acceptedUsers` list based on `searchText`
    if (searchText.trim() === '') {
      setFilteredUsers(getAllAccepted?.data?.results); // Show all users if search text is empty
    } else {
      const filtered = acceptedUsers.filter(item => {
        const user = item.friendList || item.userList; // Assuming `friendList` or `userList` contains the name
        return user?.name?.toLowerCase().includes(searchText.toLowerCase());
      });
      setFilteredUsers(filtered);
    }
  }, [searchText, acceptedUsers]);

  const handleImagePress = title => {
    console.log('Image clicked:', title);

    let categoryString = '';

    if (title === 'Meet New Friends') {
      categoryString = 'meet-new-friends';
    } else if (title === 'Looking for Love') {
      categoryString = 'looking-for-love';
    } else if (title === 'Movie Date') {
      categoryString = 'movie-date';
    } else if (title === 'Foodies') {
      categoryString = 'foodies';
    } else if (title === 'Travel Buddies') {
      categoryString = 'travel-buddies';
    } else if (title === 'Game Lover') {
      categoryString = 'game-lover';
    } else if (title === 'Chit-Chat') {
      categoryString = 'chit-chat';
    } else if (title === 'Adventurous') {
      categoryString = 'adventurous';
    }

    // navigation.navigate('Abc', {category: categoryString});
    navigation.navigate('MeetNewFriendsScreen', {category: categoryString});

    // if (title === 'Meet New Friends') {
    //   // navigation.navigate('MeetNewFriendsScreen'); // Navigate to Abc screen
    //   // navigation.navigate('Abc'); // Navigate to Abc screen
    // } else if (title === 'Looking for Love') {
    //   // navigation.navigate('DemoScreen'); // Navigate to DemoScreen
    // }
  };

  const handleConfirmBlockUnfriend = async item => {
    // console.log(' === handleConfirmBlockUnfriend ===> ', user?.user?.id);

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
            user: user?.user?.id,
            friend: item?.friendList?._id,
          }),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log('User blocked/unfriended successfully:', data);

        setFilteredUsers(prev => prev.filter(p => p._id !== item._id));
        // navigation.goBack();
        setUnfriendVisible(false);
      } else {
        console.error('Failed to block/unfriend:', data);
      }
    } catch (error) {
      console.error('Error during API call:', error);
      setUnfriendVisible(false);
    }
  };

  const renderItem = ({item}) => {
    // console.log(' === var ===> ', item);
    return (
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => handleImagePress(item.title)}>
        <View style={style.imageContainer}>
          <Image source={item.source} style={style.image} />
          <View style={style.textContainer}>
            <Text style={style.text}>{item.title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderAcceptedItem = ({item}) => {
    const user = item.friendList || [];
    const profilePic = user?.profilePic;
    const name = user?.firstName || user?.name;
    const Occupation = item?.friendList?.datingData[0]?.Occupation;
    const selectedId = user?._id;
    const friendRequestedId = item?.friendList?._id || item?._id;
    const userDetails = item;
    const usersUniqueId = user?.userUniqueId;

    // console.log(' === userDetails ===> ', userDetails?.friendList);

    // console.log(' === var... ===> ', userDetails);

    // console.log(' === var ===> ', user?.userUniqueId);

    const onThreeDotPress = () => {
      bottomSheetRef.current.open();
      setSelectedFirstName(name);
      setSelectedFriendId(selectedId);
      setSelectFriendRequestId(friendRequestedId);
      setUserFullDetails(userDetails);
      setSelectedUniqueId(usersUniqueId);
    };

    return (
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#F9FBFF"
        onPress={() => {
          navigation.navigate('DatingUserDetailsScreen', {
            userData: user,
            item,
          });
          // navigation.navigate('Abc', {userData: user});
        }}>
        <View
          style={{
            flexDirection: 'row', // Display items in a row
            alignItems: 'center', // Align image and text vertically
            paddingVertical: hp(10),
            position: 'relative',
          }}>
          {profilePic ? (
            <Image
              source={{uri: profilePic}}
              style={{
                width: wp(47),
                height: hp(47),
                borderRadius: 50,
                marginRight: wp(10),
                resizeMode: 'cover',
              }}
            />
          ) : (
            <ProfileAvatar
              firstName={user?.firstName || user?.name}
              lastName={user?.lastName}
              textStyle={{
                width: wp(47),
                height: hp(47),
                borderRadius: 50,
                marginRight: wp(10),
                resizeMode: 'cover',
              }}
              profileTexts={{fontSize: fontSize(17)}}
            />
          )}
          {/*<Image*/}
          {/*  source={profilePic ? {uri: profilePic} : images.empty_male_Image}*/}
          {/*  style={{*/}
          {/*    width: wp(47), // Adjust the size as needed*/}
          {/*    height: hp(47),*/}
          {/*    borderRadius: 50,*/}
          {/*    marginRight: wp(10),*/}
          {/*    resizeMode: 'cover',*/}
          {/*  }}*/}
          {/*/>*/}
          {/*source={profilePic ? {uri: profilePic} : images.empty_male_Image}*/}
          <View>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: fontSize(14),
                  color: colors.black,
                  fontFamily: fontFamily.poppins600,
                  lineHeight: hp(21),
                }}>
                {name}
              </Text>
              {item.labelOnline && (
                <View
                  style={{
                    width: hp(35),
                    height: hp(12),
                    borderRadius: 25,
                    backgroundColor: '#24FF00A8',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginLeft: wp(6),
                    top: 3,
                  }}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: fontSize(9),
                      lineHeight: hp(12),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    {item.labelOnline}
                  </Text>
                </View>
              )}
            </View>
            <Text
              style={{
                fontSize: fontSize(10),
                lineHeight: hp(14),
                fontFamily: fontFamily.poppins400,
                color: colors.black,
              }}>
              {Occupation}
            </Text>
          </View>
          <TouchableOpacity
            style={{
              position: 'absolute',
              right: 0,
              width: 30,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            // onPress={() => {
            //   setSelectedUser(item.title); // Set the selected user's name
            //   bottomSheetRef.current.open(); // Open the bottom sheet
            //   console.log(' === item.title ===> ', user);
            // }}
            onPress={onThreeDotPress}>
            <Image
              source={icons.three_dots_icon}
              style={{width: 20, height: 20, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      </TouchableHighlight>
    );
  };

  const timeAgo = timestamp => {
    const now = new Date();
    const createdDate = new Date(timestamp);
    const difference = now - createdDate;

    const seconds = Math.floor(difference / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7); // 7 days = 1 week
    const months = Math.floor(days / 30); // Approximate 30 days as 1 month
    const years = Math.floor(days / 365); // Approximate 365 days as 1 year

    if (seconds < 60) {
      return 'just now';
    }
    if (minutes < 60) {
      return `${minutes === 1 ? '1 min' : `${minutes} mins`} ago`;
    }
    if (hours < 24) {
      return `${hours === 1 ? '1h' : `${hours} hours`} ago`;
    }
    if (days < 7) {
      return `${days === 1 ? '1d' : `${days} days`} ago`;
    }
    if (weeks < 4) {
      return `${weeks === 1 ? '1 week' : `${weeks} weeks`} ago`;
    }
    if (months < 12) {
      return `${months === 1 ? '1 month' : `${months} months`} ago`;
    }
    return `${years === 1 ? '1 year' : `${years} years`} ago`;
  };

  const requestRenderItem = ({item}) => {
    const user = item.user; // Assuming `user` contains name, profilePic, and datingData
    const occupation = user?.datingData?.[0]?.Occupation;
    const relativeTime = timeAgo(item?.updatedAt);
    const profilePic = user?.profilePic;

    const isDeclined = clickedUsers[item._id]?.declined;
    const isAccepted = clickedUsers[item._id]?.accepted;

    const profilePrivacy =
      item?.user?.privacySettingCustom?.profilePhotoPrivacy === true ||
      item?.user?.privacySettingCustom?.showPhotoToFriendsOnly === true;

    // console.log(' === item__ ===> ', item?.user?.privacySettingCustom);

    const capitalizeFirstLetter = str =>
      str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : 'N/A';

    const handleCancelClick = async () => {
      try {
        // Make the API call to reject the request
        const response = await axios.post(
          'https://stag.mntech.website/api/v1/user/friend/respond-friend-req?appUsesType=dating',
          {
            user: userId, // Assuming you want to reject for the logged-in user
            request: item._id, // Assuming item._id is the request id
            status: 'rejected',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`, // Add the token dynamically from state
            },
          },
        );

        console.log('API Response:', response.data);

        // Only update the state if the API call was successful
        if (response.status === 200) {
          // Mark as declined when the cancel button is clicked and API is successful
          setClickedUsers(prev => ({
            ...prev,
            [item._id]: {declined: true, accepted: false},
          }));
        }
      } catch (error) {
        console.error('Error rejecting friend request:', error);
        // Handle the error (e.g., show an error message)
      }
    };

    const handleAcceptClick = async () => {
      // Mark as accepted when check button is clicked
      // setClickedUsers(prev => ({
      //   ...prev,
      //   [item._id]: {declined: false, accepted: true},
      // }));

      try {
        // Make the API call to reject the request
        const response = await axios.post(
          'https://stag.mntech.website/api/v1/user/friend/respond-friend-req?appUsesType=dating',
          {
            user: userId, // Assuming you want to reject for the logged-in user
            request: item._id, // Assuming item._id is the request id
            status: 'accepted',
          },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`, // Add the token dynamically from state
            },
          },
        );

        console.log('API Response:', response.data);

        // Only update the state if the API call was successful
        if (response.status === 200) {
          // Mark as declined when the cancel button is clicked and API is successful
          setClickedUsers(prev => ({
            ...prev,
            [item._id]: {declined: false, accepted: true},
          }));
        }
      } catch (error) {
        console.error('Error rejecting friend request:', error);
        // Handle the error (e.g., show an error message)
      }
    };

    const onClicked = () => {
      // console.log(' === onClicked ===> ', user);
      navigation.navigate('DatingUserDetailsScreen', {userData: user});
      // navigation.navigate('Abc', {userData: user});
    };

    return (
      <View style={style.requestRenderContainer}>
        <TouchableOpacity activeOpacity={0.6} onPress={onClicked}>
          {/*<Image*/}
          {/*  source={profilePic ? {uri: profilePic} : images.empty_male_Image}*/}
          {/*  style={style.renderUserProfileImage}*/}
          {/*/>*/}
          {profilePic ? (
            <>
              <Image
                source={{uri: profilePic}}
                style={style.renderUserProfileImage}
              />
              {profilePrivacy && (
                <Image
                  source={icons.logLogo} // make sure you have a `lock` icon inside `icons`
                  style={{
                    position: 'absolute',
                    tintColor: '#fff',
                    resizeMode: 'contain',
                    width: hp(20),
                    height: hp(20),
                    left: 17,
                    top: 17,
                  }}
                />
              )}
            </>
          ) : (
            <ProfileAvatar
              firstName={user.firstName || user.name}
              lastName={user.lastName}
              textStyle={style.renderUserProfileImage}
              profileTexts={{fontSize: fontSize(17)}}
            />
          )}
        </TouchableOpacity>

        <View style={style.requestRenderBodyContainer}>
          <TouchableOpacity activeOpacity={0.6} onPress={onClicked}>
            <View style={style.requestRenderNameContainer}>
              <Text style={style.requestRenderName}>
                {capitalizeFirstLetter(user?.name) || 'No Name'}
              </Text>

              <Text style={style.requestRenderRelative}>{relativeTime}</Text>
            </View>

            {/*<Text style={style.requestRenderOccupation}>*/}
            {/*  Sent you a request*/}
            {/*</Text>*/}

            {!isAccepted && !isDeclined && (
              <Text style={style.requestRenderOccupation}>
                Sent you a request
              </Text>
            )}

            {isDeclined && (
              <Text style={style.requestRenderOccupation}>Declined</Text>
            )}

            {/* Show "Accepted" if isAccepted is true */}
            {isAccepted && (
              <Text style={style.requestRenderOccupation}>Accepted</Text>
            )}
          </TouchableOpacity>

          {/*{isDeclined ? (*/}
          {/*  <Text style={style.requestRenderOccupation}>Declined</Text>*/}
          {/*) : isAccepted ? (*/}
          {/*  <Text style={style.requestRenderOccupation}>Accepted</Text>*/}
          {/*) : (*/}
          {/*  <View style={{flexDirection: 'row', top: 10}}>*/}
          {/*    <TouchableOpacity onPress={handleCancelClick}>*/}
          {/*      <Image*/}
          {/*        source={icons.dating_cancel_icon}*/}
          {/*        style={[style.requestRenderButton, {marginRight: hp(12)}]}*/}
          {/*      />*/}
          {/*    </TouchableOpacity>*/}

          {/*    <TouchableOpacity onPress={handleAcceptClick}>*/}
          {/*      <Image*/}
          {/*        source={icons.dating_check_icon}*/}
          {/*        style={style.requestRenderButton}*/}
          {/*      />*/}
          {/*    </TouchableOpacity>*/}
          {/*  </View>*/}
          {/*)}*/}

          {/*{!isAccepted && !isDeclined && (*/}
          {/*  <Text style={style.requestRenderOccupation}>*/}
          {/*    Sent you a request*/}
          {/*  </Text>*/}
          {/*)}*/}

          {/* Show "Declined" if isDeclined is true */}

          {/* If neither is accepted nor declined, show the action buttons */}
          <View style={{marginBottom: 10, marginTop: hp(13)}}>
            {!isAccepted && !isDeclined && (
              <View style={{flexDirection: 'row'}}>
                {/*<TouchableOpacity onPress={handleCancelClick}>*/}
                {/*  <Image*/}
                {/*    source={icons.dating_cancel_icon}*/}
                {/*    style={[style.requestRenderButton, {marginRight: hp(12)}]}*/}
                {/*  />*/}
                {/*</TouchableOpacity>*/}

                <TouchableOpacity
                  onPress={handleCancelClick}
                  activeOpacity={0.5}
                  style={{
                    backgroundColor: '#EEEEEE',
                    borderRadius: 20,
                    width: hp(96),
                    height: hp(40),
                    justifyContent: 'center',
                    marginRight: 14,
                  }}>
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

                {/*<TouchableOpacity onPress={handleAcceptClick}>*/}
                {/*  <Image*/}
                {/*    source={icons.dating_check_icon}*/}
                {/*    style={style.requestRenderButton}*/}
                {/*  />*/}
                {/*</TouchableOpacity>*/}

                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={handleAcceptClick}>
                  <LinearGradient
                    colors={['#9413D0', '#0D4EB3']}
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
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  const onAcceptedPress = () => {
    setSelectedText('Accepted');
    dispatch(getAllAcceptedDating());
  };

  const onRequestedPress = () => {
    setSelectedText('Requests');
    dispatch(getAllRequestedDating());
  };

  const handleConfirmBlock = async () => {
    // console.log(
    //   ' === handleConfirmBlock 333===> ',
    //   userId,
    //   selectFriendRequestedId,
    // );

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
            user: selectFriendRequestedId,
            request: userFullDetails?._id,
            status: 'removed',
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        dispatch(getAllAcceptedDating());
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

  const onSendMessagePress = userData => {
    bottomSheetRef.current.close();
    navigation.navigate('ChatUserScreen', {
      userData,
    });
  };

  const handleShare = async () => {
    // Close the bottom sheet before sharing
    bottomSheetRef.current.close();

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
    console.log(' === selectedUniqueId ===> ', selectedUniqueId);
    await Clipboard.setString(selectedUniqueId);
    bottomSheetRef.current.close();
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
              spamUserId: selectedFrinedId, // Example spam user ID, update with actual ID if needed
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
              spamUserId: selectedFrinedId, // Example spam user ID, update with actual ID if needed
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

  return (
    <SafeAreaView style={style.container}>
      {/*<View style={style.headerContainer}>*/}
      {/*  /!* Header *!/*/}
      {/*  <View style={style.headersContainer}>*/}
      {/*    <Image source={images.happyMilanColorLogo} style={style.logo} />*/}
      {/*    <TouchableOpacity*/}
      {/*      activeOpacity={0.7}*/}
      {/*      style={{alignSelf: 'center'}}*/}
      {/*      onPress={openBottomSheet}>*/}
      {/*      <Image*/}
      {/*        source={userImage ? {uri: userImage} : images.empty_male_Image}*/}
      {/*        style={style.profileImage}*/}
      {/*      />*/}
      {/*    </TouchableOpacity>*/}
      {/*  </View>*/}
      {/*</View>*/}

      {/*<View>*/}
      {/*  <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />*/}
      {/*</View>*/}

      {/* Category / Paired Buttons */}
      <View style={style.bodyContainer}>
        <View style={style.buttonGroup}>
          {/* Category Button */}
          <TouchableOpacity onPress={() => setSelectedText('Category')}>
            {selectedText === 'Category' ? (
              <LinearGradient
                colors={['#8225AF', '#0F52BA']}
                start={{x: 1.0, y: 0.5}}
                end={{x: 0.0, y: 0.5}}
                style={style.activeButton}>
                <Text style={style.activeButtonText}>Category</Text>
              </LinearGradient>
            ) : (
              <View style={style.inactiveButton}>
                <Text style={style.inactiveButtonText}>Category</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Paired Button */}

          {/*<TouchableOpacity onPress={() => setSelectedText('Accepted')}>*/}
          <TouchableOpacity onPress={onAcceptedPress}>
            {selectedText === 'Accepted' ? (
              <LinearGradient
                colors={['#8225AF', '#0F52BA']}
                start={{x: 1.0, y: 0.5}}
                end={{x: 0.0, y: 0.5}}
                style={style.activeButton}>
                <Text style={style.activeButtonText}>Accepted</Text>
              </LinearGradient>
            ) : (
              <View style={style.inactiveButton}>
                <Text style={style.inactiveButtonText}>Accepted</Text>
              </View>
            )}
          </TouchableOpacity>

          {/*<TouchableOpacity onPress={() => setSelectedText('Requests')}>*/}
          <TouchableOpacity onPress={onRequestedPress}>
            {selectedText === 'Requests' ? (
              <LinearGradient
                colors={['#8225AF', '#0F52BA']}
                start={{x: 1.0, y: 0.5}}
                end={{x: 0.0, y: 0.5}}
                style={style.activeButton}>
                <Text style={style.activeButtonText}>Requests</Text>
              </LinearGradient>
            ) : (
              <View style={style.inactiveButton}>
                <Text style={style.inactiveButtonText}>Requests</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Conditionally render based on selected button */}
        <View style={style.categoryBodyContainer}>
          {selectedText === 'Category' && (
            <FlatList
              data={imageData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              numColumns={2} // Grid layout with 2 columns
              columnWrapperStyle={style.row} // Space between columns
              contentContainerStyle={style.flatListContentContainer}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{height: 70}} />} // Spacer at the bottom
              key={`category-${selectedText}`}
            />
          )}
          {selectedText === 'Accepted' && (
            <>
              <View
                style={{
                  marginBottom: hp(10),
                  flexDirection: 'row',
                  alignItems: 'center',
                  // backgroundColor: '#f4f4f4',
                  borderRadius: 50,
                  paddingHorizontal: 17,
                  width: '100%',
                  height: hp(50),
                  borderWidth: 1,
                  borderColor: '#F0F0F0',
                  marginTop: hp(10),
                }}>
                <TextInput
                  style={{flex: 1, height: 40, fontSize: 16}}
                  placeholder="Search by name"
                  placeholderTextColor={'black'}
                  value={searchText}
                  onChangeText={setSearchText}
                />

                <Image
                  source={icons.search_icon}
                  style={{
                    width: hp(16),
                    height: hp(16),
                    tintColor: colors.black,
                  }}
                />
              </View>

              {filteredUsers?.length === 0 ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: hp(10),
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#999',
                      fontFamily: fontFamily.poppins400,
                    }}>
                    No Data Found
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={filteredUsers}
                  renderItem={renderAcceptedItem}
                  keyExtractor={item => item._id}
                  contentContainerStyle={{paddingBottom: hp(20)}}
                />
              )}
              <RBSheet
                ref={bottomSheetRef}
                height={hp(430)} // Adjust height as needed
                // openDuration={250}
                closeOnDragDown={true} // Allows drag to close
                closeOnPressMask={true} // Allows closing when clicking outside the sheet
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
                    onPress={() => {
                      bottomSheetRef.current.close(); // Use close() instead of Close()
                      ReportBottomSheetRef.current.open();
                    }}
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

                  <TouchableOpacity
                    onPress={() => {
                      bottomSheetRef.current.close(); // Use close() instead of Close()
                      setUnfriendVisible(true);
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

                  <TouchableOpacity
                    onPress={() => {
                      bottomSheetRef.current.close(); // Use close() instead of Close()
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
                      onSendMessagePress(userFullDetails);
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
                        onPress={() =>
                          handleReportReasonClick(reason, questionText)
                        } // Close the bottom sheet when clicked
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
                        onPress={() => {
                          handleConfirmBlockUnfriend(userFullDetails);
                        }}>
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
            </>
          )}
          {selectedText === 'Requests' && (
            // <View style={{marginTop: hp(34)}}>

            <>
              {users?.length === 0 ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: hp(10),
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: '#999',
                      fontFamily: fontFamily.poppins400,
                    }}>
                    No Data Found
                  </Text>
                </View>
              ) : (
                <FlatList
                  data={users}
                  keyExtractor={item => item._id}
                  renderItem={requestRenderItem}
                />
              )}
            </>

            // <View>
            //   <FlatList
            //     data={users}
            //     keyExtractor={item => item._id}
            //     renderItem={requestRenderItem}
            //   />
            // </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DatingExploreScreen;
