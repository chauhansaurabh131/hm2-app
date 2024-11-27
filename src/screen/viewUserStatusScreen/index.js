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
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import {useSelector} from 'react-redux';
import CommonGradientButton from '../../components/commonGradientButton';

const ViewUserStatusScreen = () => {
  const route = useRoute(); // Get the route object
  const {userStatus, statusData} = route.params || {}; // Access the passed status data
  const navigation = useNavigation();

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

  // Function to start animation
  const startAnimation = (duration = 3000) => {
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
              // padding: 0,
              borderRadius: 10,
              // width: '80%',
              // alignItems: 'center',
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
                {/*<TouchableOpacity*/}
                {/*  style={{*/}
                {/*    backgroundColor: 'red',*/}
                {/*    padding: 10,*/}
                {/*    borderRadius: 5,*/}
                {/*    marginRight: 10,*/}
                {/*  }}*/}
                {/*  onPress={handleDelete}>*/}
                {/*  <Text style={{color: 'white'}}>Delete</Text>*/}
                {/*</TouchableOpacity>*/}

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
                        margin: isIOS ? 0 : 1,
                      }}>
                      <Text
                        style={{
                          textAlign: 'center',
                          backgroundColor: 'transparent',
                          color: colors.black,
                          margin: 10,
                          fontSize: fontSize(14),
                          lineHeight: hp(21),
                          fontFamily: fontFamily.poppins600,
                        }}>
                        Not Now
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                {/*<TouchableOpacity*/}
                {/*  style={{*/}
                {/*    backgroundColor: 'gray',*/}
                {/*    padding: 10,*/}
                {/*    borderRadius: 5,*/}
                {/*  }}*/}
                {/*  onPress={handleCancel}>*/}
                {/*  <Text style={{color: 'white'}}>Cancel</Text>*/}
                {/*</TouchableOpacity>*/}

                <CommonGradientButton
                  onPress={handleDelete}
                  buttonName={'Yes, Delete'}
                  containerStyle={{
                    width: hp(126),
                    height: hp(50),
                    borderRadius: 50,
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ViewUserStatusScreen;
