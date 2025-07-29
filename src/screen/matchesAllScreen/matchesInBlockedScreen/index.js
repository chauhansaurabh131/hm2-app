import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
  Modal,
  TextInput,
  Clipboard,
} from 'react-native';
import {icons, images} from '../../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../utils/colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {non_friend_Blocked} from '../../../actions/homeActions';
import Toast from 'react-native-toast-message';
import {style} from './style';
import ProfileAvatar from '../../../components/letterProfileComponent';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesInBlockedScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [selectedFirstName, setSelectedFirstName] = useState('');
  const [selectedUniqueId, setSelectedUniqueId] = useState('');
  const [blockedFriendId, setBlockedFriendId] = useState('');
  const [selectFriendId, setSelectFriendID] = useState('');
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [questionText, setQuestionText] = useState(
    'Why are you reporting this?',
  );
  const [isAboutClicked, setIsAboutClicked] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [isReportModalVisible, setReportModalVisible] = useState(false);
  const [percentageMatchData, setPercentageMatchData] = useState([]);
  const [percentageLoader, setPercentageLoader] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);

  const navigation = useNavigation();
  const sheetRef = useRef(null);
  const ReportBottomSheetRef = useRef();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

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

  const openModal = async item => {
    // console.log(' === openModal___ ===> ', item?._id, item?.firstName);

    console.log(' === var ===> ', item?.friend?._id);

    try {
      // setLoading(true); // Show loading indicator
      setPercentageLoader(item._id);

      // Call the API to get match details
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/user/get-match-user/${item?.friend?._id}`,
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
        `https://stag.mntech.website/api/v1/user/friend/get-block-list?page=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const json = await response.json();
      console.log('API response:', json);

      const newData = json?.data?.results || [];
      setHasMoreData(json?.data?.hasNextPage || false);

      setData(prevData => [...prevData, ...newData]);
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

  const openBottomSheet = () => {
    sheetRef.current.close();
    ReportBottomSheetRef.current.open();
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
  };

  const handleConfirmBlock = async () => {
    console.log(' === user ===> ', selectFriendId);
    console.log(' === request ===> ', blockedFriendId);

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
            user: selectFriendId,
            request: blockedFriendId,
            status: 'removed',
          }),
        },
      );

      const json = await response.json();
      console.log('Unfriend API response:', json);

      if (response.ok) {
        setData(prevData =>
          prevData.filter(dataItem => dataItem._id !== blockedFriendId),
        );
        setIsBlockModalVisible(false);
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
              spamUserId: selectFriendId, // Example spam user ID, update with actual ID if needed
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
              spamUserId: selectFriendId, // Example spam user ID, update with actual ID if needed
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
    sheetRef.current.close();
    CopyId();
  };

  // if (loading) {
  //   return (
  //     <SafeAreaView style={styles.loadingContainer}>
  //       {/*<ActivityIndicator size="large" color="#0000ff" />*/}
  //       <View style={{height: hp(449), marginHorizontal: 17}}>
  //         <ShimmerPlaceholder
  //           style={{
  //             width: '100%',
  //             height: hp(449),
  //             borderRadius: 10,
  //             marginBottom: hp(13),
  //           }}
  //         />
  //         <View style={{marginTop: -180, marginHorizontal: 17}}>
  //           <ShimmerPlaceholder style={{width: 100, height: 20}} />
  //
  //           <View style={{marginTop: 10}}>
  //             <ShimmerPlaceholder style={{width: 100, height: 5}} />
  //           </View>
  //
  //           <View style={{marginTop: 50, flexDirection: 'row'}}>
  //             <ShimmerPlaceholder
  //               style={{
  //                 width: wp(142),
  //                 height: hp(40),
  //                 justifyContent: 'center',
  //                 marginRight: 40,
  //               }}
  //             />
  //             <ShimmerPlaceholder
  //               style={{
  //                 width: wp(142),
  //                 height: hp(40),
  //                 justifyContent: 'center',
  //                 marginRight: 40,
  //               }}
  //             />
  //           </View>
  //         </View>
  //       </View>
  //     </SafeAreaView>
  //   );
  // }

  const handlePress = items => {
    // console.log(' === handlePress__ ===> ', items);
    const matchesUserData = {
      firstName: items?.friend?.name,
      id: items?.friend?._id,
      userData: items,
    };
    navigation.navigate('NewUserDetailsScreen', {matchesUserData});
    // Alert.alert('Error', 'User Are Blocked.');
  };

  const renderBlockedUser = ({item}) => {
    const hasValidImage =
      item?.friend?.profilePic &&
      item?.friend?.profilePic !== 'null' &&
      item?.friend?.profilePic.trim() !== '';

    const profilePrivacy =
      item?.friend?.privacySettingCustom?.profilePhotoPrivacy === true ||
      item?.friend?.privacySettingCustom?.showPhotoToFriendsOnly === true;

    const profileImage = item?.friend?.profilePic;

    const uniqueId = item?.friend?.userUniqueId;

    const FriendID = item?.friend?._id;

    const blockedFriendIds = item?._id;

    const calculateAge = dob => {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const name = item?.friend?.name;
    const firstName = item?.friend?.firstName;
    const lastName = item?.friend?.lastName;
    const age = calculateAge(item?.friend?.dateOfBirth);
    const height = item?.friend?.height;
    const jobTitle = item?.friend?.userProfessional?.jobTitle;
    const currentCity = item?.friend?.address?.currentCity
      ? item?.friend?.address?.currentCity.charAt(0).toUpperCase() +
        item?.friend?.address?.currentCity.slice(1).toLowerCase()
      : '';
    const currentCountry = item?.friend?.address?.currentCountry
      ? item?.friend?.address?.currentCountry.charAt(0).toUpperCase() +
        item?.friend?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    const imageCount = Array.isArray(item?.friend?.userProfilePic)
      ? item?.friend?.userProfilePic.length
      : 0;

    const userAllImage = Array.isArray(item?.friend?.userProfilePic)
      ? item?.friend?.userProfilePic.map(pic => pic.url)
      : [];

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    const matchPercentage = item?.friend?.matchPercentage;

    const onThreeDotPress = () => {
      setSelectedFirstName(firstName || name);
      setSelectedUniqueId(uniqueId);
      setBlockedFriendId(blockedFriendIds);
      setSelectFriendID(FriendID);

      sheetRef.current.open();
    };

    return (
      <View>
        <View style={style.renderContainer}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              /* navigation.navigate('UserDetailsScreen'); */
            }}>
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
                    source={{uri: item?.friend?.profilePic}}
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
                    firstName={item?.friend?.firstName || item?.friend?.name}
                    lastName={item?.friend?.lastName}
                    textStyle={style.userImageStyle}
                    profileTexts={{fontSize: fontSize(60), marginTop: -80}}
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
                  <Text style={style.userNameTextStyle}>
                    {firstName || name} {lastName}
                  </Text>

                  <View
                    style={[
                      style.userDetailsDescriptionContainer,
                      {marginTop: 3},
                    ]}>
                    <Text style={style.userDetailsTextStyle}>
                      {age || 'N/A'} yrs,
                    </Text>
                    <Text style={style.userDetailsTextStyle}> {height}</Text>

                    <View style={style.verticalLineStyle} />

                    <Text style={style.userDetailsTextStyle}>
                      {' '}
                      {jobTitle || 'N/A'}
                    </Text>
                  </View>

                  <View style={style.userDetailsDescriptionContainer}>
                    <Text style={style.userDetailsTextStyle}>
                      {currentCity},{' '}
                    </Text>
                    <Text style={style.userDetailsTextStyle}>
                      {currentCountry || 'N/A'}
                    </Text>
                  </View>

                  <View style={{position: 'absolute', bottom: 0, right: 35}}>
                    <TouchableOpacity
                      onPress={onThreeDotPress}
                      style={style.threeDotContainer}>
                      <Image
                        source={icons.new_three_dot}
                        style={style.threeDotImage}
                      />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                {/*<View style={style.renderBottomContainer}>*/}
                {/*  <Image*/}
                {/*    source={images.gradient_button_background_img}*/}
                {/*    style={style.gradientImageBody}*/}
                {/*  />*/}
                {/*  <TouchableOpacity*/}
                {/*    activeOpacity={0.5}*/}
                {/*    onPress={() => {*/}
                {/*      openModal(item);*/}
                {/*    }}*/}
                {/*    style={style.gradientImageContainer}*/}
                {/*    disabled={percentageLoader !== null}>*/}
                {/*    {percentageLoader === item._id ? (*/}
                {/*      <ActivityIndicator*/}
                {/*        size="small"*/}
                {/*        color="#FFFFFF"*/}
                {/*        style={{*/}
                {/*          marginLeft: hp(35),*/}
                {/*        }}*/}
                {/*      />*/}
                {/*    ) : (*/}
                {/*      <>*/}
                {/*        <Image*/}
                {/*          source={icons.couple_icon}*/}
                {/*          style={style.coupleImage}*/}
                {/*        />*/}
                {/*        <Text style={style.percentageText}>*/}
                {/*          {matchPercentage}% Match*/}
                {/*        </Text>*/}
                {/*      </>*/}
                {/*    )}*/}
                {/*  </TouchableOpacity>*/}

                {/*  <View style={style.imageAndThreeDotContainer}>*/}
                {/*    {!profilePrivacy && (*/}
                {/*      <TouchableOpacity*/}
                {/*        style={style.ImagesContainer}*/}
                {/*        activeOpacity={0.5}*/}
                {/*        onPress={userAllImageShare}>*/}
                {/*        <Image*/}
                {/*          source={icons.new_camera_icon}*/}
                {/*          style={style.cameraIcon}*/}
                {/*        />*/}

                {/*        <Text style={{color: colors.white}}>{imageCount}</Text>*/}
                {/*      </TouchableOpacity>*/}
                {/*    )}*/}
                {/*  </View>*/}
                {/*</View>*/}
              </View>

              {/*<TouchableOpacity*/}
              {/*  onPress={onThreeDotPress}*/}
              {/*  style={style.threeDotContainer}>*/}
              {/*  <Image*/}
              {/*    source={icons.new_three_dot}*/}
              {/*    style={style.threeDotImage}*/}
              {/*  />*/}
              {/*</TouchableOpacity>*/}
            </View>
          </TouchableOpacity>
        </View>

        <View style={style.blockedTittleContainer}>
          <Text style={style.blockedText}>Blocked by you</Text>
          <Image source={icons.block_icon} style={style.blockedIcon} />
        </View>

        <View style={style.blockedUnderLine} />
      </View>
    );
  };

  const toastConfigs = {
    Copied: ({text1}) => (
      <View style={style.toastsBody}>
        <Text style={style.toastsText}>{text1}</Text>
      </View>
    ),
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.toastContainer}>
        <Toast config={toastConfigs} />
      </View>
      {loading ? (
        <SafeAreaView style={{flex: 1}}>
          <View style={style.shimmerContainer}>
            <ShimmerPlaceholder style={style.shimmerBox} />
            <View style={style.shimmerBoxBody}>
              <ShimmerPlaceholder style={style.shimmerSecondBox} />

              <View style={style.shimmerThirdBoxContainer}>
                <ShimmerPlaceholder style={style.shimmerThirdBox} />
              </View>

              <View style={style.shimmerBottomContainer}>
                <ShimmerPlaceholder style={style.shimmerBottomContainerBox} />
                <ShimmerPlaceholder style={style.shimmerBottomContainerBox} />
              </View>
            </View>
          </View>
        </SafeAreaView>
      ) : (
        <FlatList
          data={data}
          renderItem={renderBlockedUser}
          keyExtractor={(item, index) =>
            item?._id || item?.id || `item-${index}`
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: hp(130)}}
          ListFooterComponent={
            isFetchingMore ? (
              <View style={{alignItems: 'center', marginVertical: 10}}>
                <Text style={{color: 'black'}}>Loading Data...</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && !isFetchingMore ? (
              <View
                style={{
                  padding: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    alignItems: 'center',
                    marginTop: hp(250),
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={icons.no_Profile_Found_img}
                    style={{
                      width: hp(44),
                      height: hp(44),
                      resizeMode: 'contain',
                    }}
                  />
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: fontSize(18),
                      lineHeight: hp(27),
                      fontFamily: fontFamily.poppins400,
                      marginTop: hp(12),
                    }}>
                    No Profiles Found
                  </Text>
                </View>
              </View>
            ) : null
          }
        />
      )}

      {/* Bottom Sheet */}
      <RBSheet
        ref={sheetRef}
        height={hp(300)} // Height of the bottom sheet
        // openDuration={250} // Duration of the opening animation
        closeOnDragDown={true} // Allow closing the sheet by dragging it down
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        {/* Content inside the bottom sheet */}
        <View style={style.TDBContainer}>
          <View style={style.TDBBodyContainer}>
            <TouchableOpacity
              onPress={handleShare}
              style={style.TDBTopContainer}>
              <Image source={icons.share_icon} style={style.TDBImages} />
              <Text style={style.TDBTittleText}>Share Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                onCopyIdPress(selectedUniqueId);
              }}
              style={style.TDBBodySecondContainer}>
              <Image source={icons.copy_id_card_icon} style={style.TDBImages} />
              <Text style={style.TDBTittleText}>
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
              style={style.TDBBodySecondContainer}>
              <Image
                source={icons.new_report_icon}
                style={[style.TDBImages, {top: -8}]}
              />

              <View>
                <Text style={style.TDBTittleText}>Report</Text>

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
              style={style.TDBBodySecondContainer}>
              <Image
                source={icons.block_icon}
                style={[style.TDBImages, {top: -8}]}
              />

              <View>
                <Text style={style.TDBTittleText}>
                  Unblock {selectedFirstName}
                </Text>

                <Text
                  style={{
                    fontSize: fontSize(12),
                    lineHeight: hp(16),
                    fontFamily: fontFamily.poppins400,
                    color: '#7B7B7B',
                  }}>
                  You contact this user again.
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
        <View style={style.BlockModalContainer}>
          <View style={style.modalModalBody}>
            <Text style={style.blockModalFirstTittle}>
              Are you sure you want to
            </Text>
            <Text style={style.blockModalSecondTittle}>Unblock This User?</Text>

            <View style={style.blockModalButtonContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleConfirmBlock}>
                <LinearGradient
                  colors={['#2D46B9', '#8D1D8D']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={style.blockModalYesButtonContainer}>
                  <Text style={style.blockModalYesButtonText}>Yes</Text>
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
                  <View style={style.blockModalBoButtonSecondContainer}>
                    <Text style={style.blockModalNoButtonText}>No</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <RBSheet
        ref={ReportBottomSheetRef}
        closeOnPressMask={true}
        height={hp(500)}
        customStyles={{
          container: {
            backgroundColor: 'white',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <View style={style.ReportContainer}>
          <View style={style.ReportBody}>
            {(reportReasons.length > 0 || isAboutClicked) && (
              <TouchableOpacity
                onPress={handleBackArrow}
                style={style.reportBackButtonContainer}>
                <Image
                  source={icons.back_arrow_icon}
                  style={style.reportBackIcon}
                />
              </TouchableOpacity>
            )}

            <Text style={style.ReportText}>Report</Text>
          </View>

          <View style={style.reportUnderline} />

          <Text style={style.reportQuestionText}>{questionText}</Text>

          {reportReasons.length < 1 && !isAboutClicked && (
            <View style={style.reportBodyContainer}>
              <Text style={style.reportBodyText}>
                Your identity will remain anonymous to the
              </Text>
              <Text style={style.reportBodyText}>reported user.</Text>
            </View>
          )}

          {/* Show the list of reasons if there are any */}
          {isAboutClicked ? (
            // If "About" is clicked, show the TextInput and Submit button
            <View style={style.reportTextInputContainer}>
              <TextInput
                style={style.reportTextInput}
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
                  style={style.reportSubmitButtonContainer}>
                  <Text style={style.reportSubmitButtonText}>
                    Submit Report
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : reportReasons.length > 0 ? (
            reportReasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleReportReasonClick(reason, questionText)} // Close the bottom sheet when clicked
              >
                <Text style={style.reportTextInputReasonContainer}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={style.reportTittleContainer}>
              <TouchableOpacity onPress={handleInappropriateContent}>
                <Text style={style.reportTittleText}>
                  Inappropriate content
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={style.reportTittleBody}
                onPress={handleHarassmentOrBullying}>
                <Text style={style.reportTittleText}>
                  Harassment or bullying.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={style.reportTittleBody}
                onPress={handleFakeMisleadingProfile}>
                <Text style={style.reportTittleText}>
                  Fake or misleading profile.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={style.reportTittleBody}
                onPress={handleSpamPromotionalContent}>
                <Text style={style.reportTittleText}>
                  Spam or promotional content.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={style.reportTittleBody}
                onPress={handleScamsFraudulentActivity}>
                <Text style={style.reportTittleText}>
                  Scams or fraudulent activity.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={style.reportTittleBody}
                onPress={() => setIsAboutClicked(true)} // Handle About click
              >
                <Text style={style.reportTittleText}>Others</Text>
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
        <View style={style.reportModalContainer}>
          <View style={style.reportModalBody}>
            <Text style={style.reportModalTittle}>
              Thank you for your report.
            </Text>

            <View style={style.reportModalSecondTittleContainer}>
              <Text style={style.reportModalSecondTittle}>
                We’ll review it soon to help keep
              </Text>
              <Text style={style.reportModalSecondTittle}>
                our community safe.
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.7}
              style={style.reportModalButtonContainer}
              onPress={handleCloseModal}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1.5}}
                style={style.reportModalButtonBody}>
                <Text style={style.reportModalButtonText}>Okay</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        {/*<TouchableWithoutFeedback onPress={closeModal}>*/}

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
        {/*</TouchableWithoutFeedback>*/}
      </Modal>
    </SafeAreaView>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    // flex: 1, // Ensures the SafeAreaView takes up full height
  },

  emptyListContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gender: {
    fontSize: 14,
    color: '#555',
  },
  listContainer: {
    paddingBottom: 200, // Adjust this value for more or less space
  },

  renderBottomButtonContainer: {
    flexDirection: 'row',
    // marginTop: hp(20),
    justifyContent: 'space-between',
  },
  requestDeclineContainer: {
    width: wp(310),
    height: hp(40),
    borderRadius: 20,
    backgroundColor: '#303030',
    justifyContent: 'center',
  },
  requestTextStyle: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fontFamily.poppins500,
    lineHeight: hp(21),
    fontSize: fontSize(14),
  },
});

export default MatchesInBlockedScreen;
