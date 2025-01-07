import React, {useEffect, useRef, useState} from 'react';
import {
  Alert,
  Clipboard,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  Share,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {icons, images} from '../../../assets';
import style from '../../matchesScreen/style';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../../utils/helpers';
import {colors} from '../../../utils/colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import RBSheet from 'react-native-raw-bottom-sheet';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesInDeclinedScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [selectedFirstName, setSelectedFirstName] = useState('');
  const [selectedUniqueId, setSelectedUniqueId] = useState('');
  const [blockedFriendId, setBlockedFriendId] = useState('');
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [reportReasons, setReportReasons] = useState([]);
  const [questionText, setQuestionText] = useState(
    'Why are you reporting this?',
  );
  const [isAboutClicked, setIsAboutClicked] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [isReportModalVisible, setReportModalVisible] = useState(false);

  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const sheetRef = useRef(null);
  const ReportBottomSheetRef = useRef();

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

  const fetchData = async (pageNumber = 1) => {
    if (!hasMoreData) {
      return;
    }

    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/friend/get-rejected-frds?page=${pageNumber}`,
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

  const onCopyIdPress = async selectedUniqueId => {
    await Clipboard.setString(selectedUniqueId);
    sheetRef.current.close();
    CopyId();
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
          prevData.filter(dataItem => dataItem.user?._id !== blockedFriendId),
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

  // Function to open the bottom sheet
  const openBottomSheet = () => {
    sheetRef.current.close();
    ReportBottomSheetRef.current.open();
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

  const handleShortListPress = async item => {
    const shortlistId = item?.shortlistData?._id ?? item?.shortlistData?._id;
    const userId = item?.user?._id; // Ensure you're using the correct ID

    // console.log(' === var ===> ', {item, shortlistId});

    if (shortlistId) {
      // If the item is already shortlisted, remove it from the shortlist
      try {
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${shortlistId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const result = await response.json();

        if (response.ok) {
          // Successfully removed from shortlist
          // Alert.alert('Success', 'Removed from shortlist');
          RemoveShortlisted();

          // Update the data by removing the shortlistData
          setData(prevData => {
            return prevData.map(dataItem => {
              // console.log(
              //   ' === 111 ===> ',
              //   dataItem.shortlistData?._id,
              //   shortlistId,
              // );
              return dataItem.shortlistData?._id === shortlistId
                ? {...dataItem, shortlistData: null} // Remove shortlistData
                : dataItem;
            });
          });
        } else {
          Alert.alert('Error', 'Failed to remove from shortlist');
        }
      } catch (error) {
        console.error('Error removing from shortlist:', error);
        Alert.alert('Error', 'Failed to remove from shortlist');
      }
    } else {
      // If the item is not shortlisted, create a new shortlist
      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/shortlist/create-shortlist',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              shortlistId: userId, // Correctly passing the userId
            }),
          },
        );

        const result = await response.json();

        if (response.ok) {
          // Successfully added to shortlist
          // Alert.alert('Success', 'Added to shortlist');
          ShowToast();
          // Update the data with the new shortlist data
          setData(prevData => {
            return prevData.map(dataItem => {
              return dataItem.user?._id === userId
                ? {
                    ...dataItem,
                    shortlistData: {_id: result?.data?.id, ...result.data},
                  } // Add the shortlistData
                : dataItem;
            });
          });
        } else {
          Alert.alert('Error', 'Failed to add to shortlist');
        }
      } catch (error) {
        console.error('Error adding to shortlist:', error);
        Alert.alert('Error', 'Failed to add to shortlist');
      }
    }
  };

  const renderAcceptedUserItem = ({item}) => {
    // console.log(' === var ===> ', item?.user?._id);

    const profilePic = item?.user?.profilePic;

    const uniqueId = item?.user?.userUniqueId;

    const blockedFriendIds = item?.user?._id;

    const firstName = item?.user?.firstName
      ? item?.user?.firstName.charAt(0).toUpperCase() +
        item?.user?.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item?.user?.lastName
      ? item?.user?.lastName.charAt(0).toUpperCase() +
        item?.user?.lastName.slice(1).toLowerCase()
      : '';

    const name = item?.user?.name
      ? item?.user?.name.charAt(0).toUpperCase() +
        item?.user?.name.slice(1).toLowerCase()
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

    const age = calculateAge(item?.user?.dateOfBirth);

    const height = item?.user?.height;

    const jobTittle = item?.user?.userProfessional?.jobTitle
      ? item?.user?.userProfessional?.jobTitle.charAt(0).toUpperCase() +
        item?.user?.userProfessional?.jobTitle.slice(1).toLowerCase()
      : '';

    const currentCity = item?.user?.address?.currentCity
      ? item?.user?.address?.currentCity.charAt(0).toUpperCase() +
        item?.user?.address?.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item?.user?.address?.currentCountry
      ? item?.user?.address?.currentCountry.charAt(0).toUpperCase() +
        item?.user?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    const imageCount = Array.isArray(item?.user?.userProfilePic)
      ? item?.user?.userProfilePic?.length
      : 0;

    const userAllImage = Array.isArray(item?.user?.userProfilePic)
      ? item?.user?.userProfilePic.map(pic => pic.url)
      : [];

    const starIconSource = item?.shortlistData
      ? icons.black_check_icon
      : icons.black_start_icon;

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    const onThreeDotPress = () => {
      setSelectedFirstName(firstName || name);
      setSelectedUniqueId(uniqueId);
      setBlockedFriendId(blockedFriendIds);

      sheetRef.current.open();
    };

    return (
      <View>
        <View style={style.renderContainer}>
          <TouchableOpacity activeOpacity={1}>
            <View>
              <Image
                source={
                  profilePic ? {uri: profilePic} : images.empty_male_Image
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
                    // navigation.navigate('UserDetailsScreen');
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
                    <Text style={style.userDetailsTextStyle}> {height}</Text>

                    <View style={style.verticalLineStyle} />

                    <Text style={style.userDetailsTextStyle}>{jobTittle}</Text>
                  </View>

                  <View style={style.userDetailsDescriptionContainer}>
                    <Text style={style.userDetailsTextStyle}>
                      {currentCity},
                    </Text>

                    <Text style={style.userDetailsTextStyle}>
                      {' '}
                      {currentCountry}
                    </Text>
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    marginTop: hp(15),
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={images.gradient_button_background_img}
                    style={{
                      width: wp(105),
                      height: hp(30),
                      resizeMode: 'stretch',
                      borderRadius: 50, // Adjust the radius as needed
                      overflow: 'hidden', // Ensure rounded corners clip the image
                    }}
                  />
                  <TouchableOpacity
                    activeOpacity={0.5}
                    // onPress={openModal}
                    style={{
                      position: 'absolute',
                      left: 10,
                      // top: 12,
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}>
                    <Image
                      source={icons.couple_icon}
                      style={{
                        width: hp(16),
                        height: hp(14),
                        resizeMode: 'contain',
                        tintColor: 'white',
                      }}
                    />
                    <Text
                      style={{
                        color: 'white',
                        marginLeft: 9,
                        fontSize: fontSize(10),
                        lineHeight: hp(15),
                        fontFamily: fontFamily.poppins600,
                        top: 1,
                      }}>
                      {/*85% Match*/}
                      {item?.matchPercentage}% Match
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      flexDirection: 'row',
                      position: 'absolute',
                      right: 35,
                      // top: 5,
                    }}>
                    <TouchableOpacity
                      style={{
                        width: hp(60),
                        height: hp(30),
                        backgroundColor: '#282727',
                        borderRadius: 15,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginHorizontal: 5,
                      }}
                      activeOpacity={0.5}
                      onPress={userAllImageShare}>
                      <Image
                        source={icons.new_camera_icon}
                        style={{
                          width: 16,
                          height: 16,
                          resizeMode: 'contain',
                          marginRight: wp(10),
                        }}
                      />

                      <Text style={{color: colors.white}}>{imageCount}</Text>
                    </TouchableOpacity>
                    {/*</View>*/}

                    <TouchableOpacity
                      onPress={() => handleShortListPress(item)}
                      activeOpacity={0.5}
                      style={{
                        width: hp(30),
                        height: hp(30),
                        backgroundColor: '#282727',
                        borderRadius: 50,
                      }}>
                      <Image
                        source={starIconSource}
                        style={{
                          width: hp(30),
                          height: hp(30),
                          resizeMode: 'contain',
                        }}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={onThreeDotPress}
                      style={{
                        width: hp(30),
                        height: hp(30),
                        backgroundColor: '#282727',
                        borderRadius: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginHorizontal: 5,
                      }}>
                      <Image
                        source={icons.new_three_dot}
                        style={{width: 4, height: 14, tintColor: colors.white}}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View
          style={{
            width: '100%',
            borderColor: '#E8E8E8',
            borderWidth: 0.7,
            marginTop: 23,
            marginBottom: 23,
          }}
        />
      </View>
    );
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
  };

  return (
    <SafeAreaView>
      <View
        style={{
          flex: 1,
          zIndex: 99,
          position: 'absolute',
          alignSelf: 'center',
          top: -130,
        }}>
        <Toast config={toastConfigs} />
      </View>
      {loading ? (
        // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        //   <ActivityIndicator size="large" color="#0000ff" />
        // </View>
        <SafeAreaView>
          {/*<ActivityIndicator size="large" color="#0000ff" />*/}
          <View style={{height: hp(449), marginHorizontal: 17}}>
            <ShimmerPlaceholder
              style={{
                width: '100%',
                height: hp(449),
                borderRadius: 10,
                marginBottom: hp(13),
              }}
            />
            <View style={{marginTop: -180, marginHorizontal: 17}}>
              <ShimmerPlaceholder style={{width: 100, height: 20}} />

              <View style={{marginTop: 10}}>
                <ShimmerPlaceholder style={{width: 100, height: 5}} />
              </View>

              <View style={{marginTop: 50, flexDirection: 'row'}}>
                <ShimmerPlaceholder
                  style={{
                    width: wp(142),
                    height: hp(40),
                    justifyContent: 'center',
                    marginRight: 40,
                  }}
                />
                <ShimmerPlaceholder
                  style={{
                    width: wp(142),
                    height: hp(40),
                    justifyContent: 'center',
                    marginRight: 40,
                  }}
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
      ) : (
        <FlatList
          data={data}
          renderItem={renderAcceptedUserItem}
          keyExtractor={(item, index) =>
            item?._id || item?.id || `item-${index}`
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isFetchingMore ? (
              <View style={{alignItems: 'center', marginVertical: 10}}>
                <Text style={{color: 'black'}}>Loading Data..</Text>
              </View>
            ) : null
          }
          contentContainerStyle={{paddingBottom: hp(130)}}
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
              onPress={() => {
                handleBlockProfilePress(blockedFriendId);
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

      {/*REPORT BOTTOM SHEET*/}
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
    </SafeAreaView>
  );
};

export default MatchesInDeclinedScreen;
