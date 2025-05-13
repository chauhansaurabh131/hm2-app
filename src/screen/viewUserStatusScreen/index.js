// const ViewUserStatusScreen

import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Modal,
  Pressable,
  Alert,
  FlatList,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import {useSelector} from 'react-redux';
import CommonGradientButton from '../../components/commonGradientButton';
import RBSheet from 'react-native-raw-bottom-sheet';
import ProfileAvatar from '../../components/letterProfileComponent';
import dayjs from 'dayjs';

const ViewUserStatusScreen = () => {
  const route = useRoute(); // Get the route object
  const {userStatus, statusData} = route.params || {}; // Access the passed status data
  const [totalResults, setTotalResults] = useState(null);
  const [viewers, setViewers] = useState([]);
  const navigation = useNavigation();
  const bottomSheetRef = useRef();

  const {user} = useSelector(state => state.auth);

  const accessToken = user?.tokens?.access?.token;
  const statusId = userStatus?.id; // Get status ID from statusData

  const statusImage = userStatus?.content || statusData?.content;
  const userImage =
    userStatus?.userId?.profilePic || statusData?.userId?.profilePic;
  const userName = userStatus?.userId?.name || statusData?.userId?.name;
  const statusAddTime = userStatus?.statusAddTime || statusData?.statusAddTime;
  const statusCaption = userStatus?.caption || statusData?.caption || [];

  const [timeAgo, setTimeAgo] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // State to manage modal visibility

  // Animated value for progress bar
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Track whether to navigate back
  const shouldNavigateBack = useRef(true);

  useEffect(() => {
    // Function to calculate time difference
    const calculateTimeAgo = () => {
      const currentTime = new Date();
      const statusTime = new Date(statusAddTime);
      const timeDifference = currentTime - statusTime;

      const minutes = Math.floor(timeDifference / 1000 / 60);
      const hours = Math.floor(minutes / 60);
      const days = Math.floor(hours / 24);

      if (days > 0) {
        setTimeAgo(`${days} day${days > 1 ? 's' : ''} ago`);
      } else if (hours > 0) {
        setTimeAgo(`${hours} hour${hours > 1 ? 's' : ''} ago`);
      } else if (minutes > 0) {
        setTimeAgo(`${minutes} minute${minutes > 1 ? 's' : ''} ago`);
      } else {
        setTimeAgo('Just now');
      }
    };

    // Start progress bar animation
    startAnimation();
    calculateTimeAgo(); // Call when component mounts

    return () => {
      progressAnim.stopAnimation(); // Stop the animation on component unmount
    };
  }, [statusAddTime]);

  useEffect(() => {
    const fetchStoryViews = async () => {
      try {
        if (!statusId) {
          console.warn('User ID is missing');
          return;
        }

        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/story-view/paginated/${userStatus?.id}`,
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

        const responseData = await response.json();
        const rawResults = responseData?.data?.results || [];

        setTotalResults(responseData?.data?.totalResults);
        setViewers(rawResults);
      } catch (error) {
        console.error('Error fetching story views:', error);
      }
    };

    if (accessToken && statusId) {
      fetchStoryViews();
    }
  }, [accessToken, statusId]);

  // Function to start animation
  const startAnimation = (duration = 9000) => {
    shouldNavigateBack.current = true; // Reset the flag when starting animation
    Animated.timing(progressAnim, {
      toValue: 1, // Finish progress
      duration: duration, // Duration can be custom or remaining time
      useNativeDriver: false,
    }).start(() => {
      // Check if we should navigate back
      if (shouldNavigateBack.current) {
        navigation.goBack(); // Navigate back when animation finishes if not paused
      }
    });
  };

  // Interpolate progress bar width from 0% to 100%
  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Function to pause animation
  const handlePressIn = () => {
    setIsPaused(true);
    shouldNavigateBack.current = false; // Prevent navigation on press
    progressAnim.stopAnimation(); // Pause animation
  };

  // Function to resume animation
  const handlePressOut = () => {
    setIsPaused(false);
    const currentProgress = progressAnim._value; // Get current progress
    const remainingTime = (1 - currentProgress) * 3000; // Calculate remaining time
    shouldNavigateBack.current = true; // Reset the flag to allow navigation
    startAnimation(remainingTime); // Restart animation with remaining time
  };

  // Handle delete confirmation and pause the timer
  const handleDeletePress = () => {
    handlePressIn(); // Pause the timer when modal opens
    setModalVisible(true); // Show the delete confirmation modal
  };

  // Handle delete confirmation
  const handleDelete = () => {
    setModalVisible(false); // Close the modal
    deleteStatus(); // Call the delete function
  };

  // Function to delete status via API
  const deleteStatus = async () => {
    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/status/delete-status/${statusId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`, // Use accessToken here
          },
        },
      );

      if (response.ok) {
        // Status deleted successfully
        console.log('Status deleted successfully');
        navigation.goBack(); // Navigate back after successful deletion
      } else {
        console.log('Failed to delete status');
        Alert.alert('Error', 'Failed to delete status');
      }
    } catch (error) {
      console.error('Error deleting status:', error);
      Alert.alert('Error', 'An error occurred while deleting the status');
    }
  };

  // Handle cancel delete and resume the timer
  const handleCancel = () => {
    setModalVisible(false); // Close the modal
    handlePressOut(); // Resume the timer when modal closes
  };

  const formatCustomTime = time => {
    const now = dayjs();
    const posted = dayjs(time);
    const diffInMinutes = now.diff(posted, 'minute');
    const diffInHours = now.diff(posted, 'hour');

    if (diffInMinutes < 1) {
      return 'Just now';
    }
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    if (diffInHours < 3) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    return posted.format('hh:mm A'); // e.g., "10:12 AM"
  };

  const clickedOnUser = viewerId => {
    const matchesUserData = {
      firstName: viewerId.name,
      id: viewerId?.id,
    };
    navigation.navigate('NewUserDetailsScreen', {matchesUserData});
  };

  const renderViewer = ({item}) => {
    const viewer = item.viewerId;

    const hasValidImage =
      viewer.profilePic &&
      viewer.profilePic !== 'null' &&
      viewer.profilePic.trim() !== '';

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 5,
          marginTop: 5,
        }}>
        <View style={{width: '100%'}}>
          <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => clickedOnUser(viewer)}
            style={{paddingHorizontal: 25}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {hasValidImage ? (
                <>
                  {viewer?.profilePic && (
                    <Image
                      source={{uri: viewer.profilePic}}
                      style={{
                        width: hp(40),
                        height: hp(40),
                        borderRadius: 20,
                        marginRight: 10,
                      }}
                    />
                  )}
                </>
              ) : (
                <ProfileAvatar
                  firstName={viewer.firstName || viewer.name}
                  lastName={viewer.lastName}
                  textStyle={{
                    width: hp(40),
                    height: hp(40),
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                  profileTexts={{
                    fontSize: fontSize(14),
                  }}
                />
              )}

              <View style={{top: -3}}>
                <Text
                  style={{
                    fontSize: 14,
                    color: 'white',
                    fontFamily: fontFamily.poppins400,
                  }}>
                  {viewer?.name || 'Unnamed User'}
                </Text>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {item?.createdAt ? formatCustomTime(item.createdAt) : ''}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
      {/*<View style={{height: 10}} />*/}

      {/* Horizontal Gradient Progress Bar */}
      <View
        style={{
          height: 4,
          // backgroundColor: colors.gray,
          width: '100%',
          marginBottom: 15,
        }}>
        <Animated.View
          style={{
            height: '100%',
            width: progressBarWidth, // Animated width
          }}>
          <LinearGradient
            colors={['#0F52BA', '#8225AF']} // Gradient colors for progress
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
            style={{flex: 1}}
          />
        </Animated.View>
      </View>

      <View style={{height: 10}} />

      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={{alignSelf: 'center'}}
          activeOpacity={0.7}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{
              tintColor: colors.white,
              width: hp(20),
              height: hp(20),
              marginLeft: 15,
              marginRight: 15,
            }}
          />
        </TouchableOpacity>

        <Image
          source={{uri: userImage}}
          style={{
            width: hp(40),
            height: hp(40),
            resizeMode: 'cover',
            borderRadius: 50,
          }}
        />

        <View style={{marginLeft: wp(18)}}>
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize(14),
              lineHeight: hp(21),
              fontFamily: fontFamily.poppins600,
            }}>
            {userName}
          </Text>

          <Text
            style={{
              color: colors.gray,
              fontSize: fontSize(12),
              fontFamily: fontFamily.poppins400,
            }}>
            {timeAgo} {/* Display time ago */}
          </Text>
        </View>

        {/* Delete Icon with modal trigger */}
        {userStatus && ( // Only show the delete icon if userStatus exists
          <TouchableOpacity
            style={{position: 'absolute', alignSelf: 'center', right: 10}}
            onPress={handleDeletePress} // Show modal and stop the timer
          >
            <Image
              source={icons.clear_delete_icon}
              style={{
                tintColor: 'white',
                width: 25,
                height: 20,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}>
        <View style={{height: 20}} />

        <Image
          source={{uri: statusImage}}
          style={{width: '100%', height: '80%', marginTop: hp(10)}}
        />

        <Text
          style={{
            color: colors.white,
            fontSize: fontSize(18),
            lineHeight: hp(27),
            fontFamily: fontFamily.poppins400,
            textAlign: 'center',
            marginTop: 30,
          }}>
          {statusCaption}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => bottomSheetRef.current?.open()}
        activeOpacity={0.5}
        style={{
          position: 'absolute',
          bottom: 10,
          alignSelf: 'center',
          flexDirection: 'row',
        }}>
        <Image
          source={icons.view_status_icon}
          style={{width: hp(22), height: hp(15), resizeMode: 'contain'}}
        />
        <Text
          style={{
            color: 'white',
            fontSize: fontSize(14),
            lineHeight: hp(16),
            fontFamily: fontFamily.poppins400,
            top: 2,
            marginLeft: hp(8),
          }}>
          {totalResults !== null ? totalResults : '0'}
        </Text>
      </TouchableOpacity>

      {/* Modal for Delete Confirmation */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          handleCancel(); // Close modal on back press and resume timer
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 10,
              width: hp(340),
            }}>
            <View style={{marginHorizontal: hp(38)}}>
              <Text
                style={{
                  fontSize: fontSize(18),
                  lineHeight: hp(27),
                  fontFamily: fontFamily.poppins400,
                  color: colors.black,
                  marginTop: hp(64),
                  textAlign: 'center',
                }}>
                Confirm to delete this status?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: hp(44),
                  marginBottom: hp(38),
                }}>
                <TouchableOpacity activeOpacity={0.7} onPress={handleCancel}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    style={{
                      width: wp(126),
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
                        margin: isIOS ? 0 : 1.5,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          backgroundColor: 'transparent',
                          color: colors.black,
                          margin: 10,
                          fontSize: fontSize(14),
                          lineHeight: hp(21),
                          fontFamily: fontFamily.poppins500,
                        }}>
                        Not Now
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <CommonGradientButton
                  onPress={handleDelete}
                  buttonName={'Yes, Delete'}
                  containerStyle={{
                    width: hp(126),
                    height: hp(50),
                    borderRadius: 50,
                  }}
                  buttonTextStyle={{
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins500,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={hp(350)}
        onOpen={handlePressIn} // 👈 Pause progress when opened
        onClose={handlePressOut}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: 'black',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: 'black',
          },
        }}>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <Text
            style={{
              color: 'white',
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins400,
              paddingHorizontal: 25,
              marginBottom: hp(15),
            }}>
            Who viewed?
          </Text>

          <View
            style={{width: '100%', height: 1.5, backgroundColor: '#3F3F3F'}}
          />

          <FlatList
            data={viewers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderViewer}
            contentContainerStyle={{paddingBottom: 20, marginTop: 10}}
          />
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default ViewUserStatusScreen;
