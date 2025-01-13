import React, {useEffect, useRef, useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {non_friend_Blocked} from '../../../actions/homeActions';
import Toast from 'react-native-toast-message';
import {style} from './style';

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

  const navigation = useNavigation();
  const sheetRef = useRef(null);
  const ReportBottomSheetRef = useRef();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

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

  useEffect(() => {
    fetchData();
  }, []);

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
    const matchesUserData = {
      firstName: items?.friend?.name,
      id: items?.friend?._id,
      userData: items,
    };
    navigation.navigate('NewUserDetailsScreen', {matchesUserData});
    console.log(' === var ===> ', items?.friend?.name);
  };

  const renderBlockedUser = ({item}) => {
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
                </TouchableOpacity>

                <View style={style.renderBottomContainer}>
                  <Image
                    source={images.gradient_button_background_img}
                    style={style.gradientImageBody}
                  />
                  <TouchableOpacity
                    activeOpacity={0.5}
                    // onPress={openModal}
                    style={style.gradientImageContainer}>
                    <Image
                      source={icons.couple_icon}
                      style={style.coupleImage}
                    />
                    <Text style={style.percentageText}>
                      {matchPercentage}% Match
                    </Text>
                  </TouchableOpacity>

                  <View style={style.imageAndThreeDotContainer}>
                    <TouchableOpacity
                      style={style.ImagesContainer}
                      activeOpacity={0.5}
                      onPress={userAllImageShare}>
                      <Image
                        source={icons.new_camera_icon}
                        style={style.cameraIcon}
                      />

                      <Text style={{color: colors.white}}>{imageCount}</Text>
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
        height={hp(240)} // Height of the bottom sheet
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
                handleBlockProfilePress(blockedFriendId);
              }}
              style={style.TDBBodySecondContainer}>
              <Image source={icons.block_icon} style={style.TDBImages} />
              <Text style={style.TDBTittleText}>
                Unblock {selectedFirstName}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={openBottomSheet}
              style={style.TDBBodySecondContainer}>
              <Image source={icons.report_icon} style={style.TDBImages} />
              <Text style={style.TDBTittleText}>Report this profile</Text>
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
