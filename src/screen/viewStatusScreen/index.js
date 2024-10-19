import React, {useState, useEffect, useRef} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  View,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useRoute, useNavigation} from '@react-navigation/native';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const STATUS_DURATION = 3000; // 3 seconds for each status

const ViewStatusScreen = () => {
  const route = useRoute(); // Get the route object
  const navigation = useNavigation(); // Get the navigation object
  const {allStatuses, selectedIndex} = route.params || {}; // Access the passed data
  const [currentIndex, setCurrentIndex] = useState(selectedIndex); // Track current status index
  const [isPaused, setIsPaused] = useState(false); // Track if the progress is paused
  const progress = useRef(new Animated.Value(0)).current; // Animated value for progress bar
  const timeoutRef = useRef(null); // Reference to store the timeout for status change
  const startTimeRef = useRef(0); // Track the start time of the animation
  const elapsedTimeRef = useRef(0); // Track the elapsed time
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    // Calculate the time difference on component mount
    calculateTimeAgo();

    startProgress();

    return () => {
      clearTimeout(timeoutRef.current); // Clean up timer on unmount or index change
    };
  }, [currentIndex]);

  // Function to calculate time ago
  const calculateTimeAgo = () => {
    const currentTime = new Date(); // Current time
    const statusTime = new Date(allStatuses[currentIndex]?.statusAddTime); // Status added time
    const timeDifference = currentTime - statusTime; // Time difference in milliseconds

    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(timeDifference / (1000 * 60 * 60));
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

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

  // Function to start the progress bar animation
  const startProgress = () => {
    startTimeRef.current = new Date().getTime(); // Record start time
    animateProgress(STATUS_DURATION - elapsedTimeRef.current); // Start the animation with remaining time

    // Set a timeout to move to the next status after the remaining time
    timeoutRef.current = setTimeout(() => {
      handleNextStatus();
    }, STATUS_DURATION - elapsedTimeRef.current);
  };

  // Function to animate the progress bar
  const animateProgress = duration => {
    Animated.timing(progress, {
      toValue: 1, // Animate to full width
      duration,
      useNativeDriver: false,
    }).start();
  };

  // Function to reset the progress bar
  const resetProgress = () => {
    progress.setValue(0); // Reset progress bar value
    elapsedTimeRef.current = 0; // Reset elapsed time
  };

  // Function to go to the next status
  const handleNextStatus = () => {
    resetProgress(); // Reset the progress bar before moving to the next status
    if (currentIndex < allStatuses.length - 1) {
      setCurrentIndex(currentIndex + 1); // Move to the next status
    } else {
      navigation.goBack(); // If no next status, go back to the previous screen
    }
  };

  // Function to go to the previous status
  const handlePreviousStatus = () => {
    resetProgress(); // Reset the progress bar before moving to the previous status
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1); // Move to the previous status
    }
  };

  // Function to pause the progress bar animation
  const pauseProgress = () => {
    if (!isPaused) {
      setIsPaused(true); // Mark as paused
      clearTimeout(timeoutRef.current); // Clear the timeout for status change

      const currentTime = new Date().getTime(); // Get the current time
      elapsedTimeRef.current += currentTime - startTimeRef.current; // Update elapsed time
      progress.stopAnimation(); // Stop the progress animation
    }
  };

  // Function to resume the progress bar animation
  const resumeProgress = () => {
    if (isPaused) {
      setIsPaused(false); // Mark as resumed
      startProgress(); // Resume progress from the elapsed time
    }
  };

  // Function to handle screen taps (toggle pause and resume)
  const handleScreenPressIn = () => {
    pauseProgress(); // Pause the timer on press
  };

  const handleScreenPressOut = () => {
    resumeProgress(); // Resume the timer on release
  };

  // Get the current status based on the currentIndex
  const currentStatus = allStatuses[currentIndex];

  console.log(' === currentStatus______++++ ===> ', currentStatus?.caption);

  // Interpolate the progress to create the color transition effect
  const progressBarColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['#0F52BA', '#8225AF'], // Transition from #0F52BA to #8225AF
  });

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.black}}>
      {/* Container for Image and Progress Bar */}
      <View style={{flex: 1}}>
        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <Animated.View
            style={[
              styles.progressBarBackground,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
                backgroundColor: progressBarColor,
              },
            ]}>
            <LinearGradient
              colors={['#0F52BA', '#8225AF']} // Gradient colors for progress
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{flex: 1}}
            />
          </Animated.View>
        </View>

        <View style={{flexDirection: 'row', marginTop: hp(18)}}>
          <Image
            source={{uri: currentStatus?.userId?.profilePic}}
            style={{
              width: hp(40),
              height: hp(40),
              resizeMode: 'cover',
              borderRadius: 50,
              marginLeft: wp(20),
              marginRight: wp(18),
            }}
          />
          <View>
            <Text style={styles.userName}>{currentStatus.userId?.name}</Text>
            <Text style={styles.timeAgoText}>{timeAgo}</Text>
            {/* Time ago display */}
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            activeOpacity={0.7}
            style={{
              position: 'absolute',
              right: 20,
              height: hp(24),
              width: hp(24),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={icons.x_cancel_icon}
              style={{
                tintColor: colors.white,
                width: hp(14),
                height: hp(14),
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>

        {/* Touchable area to detect taps */}
        <TouchableWithoutFeedback
          onPressIn={handleScreenPressIn} // Pause on press
          onPressOut={handleScreenPressOut} // Resume on release
        >
          <Image
            source={{uri: currentStatus.content}}
            style={styles.statusImage}
          />
        </TouchableWithoutFeedback>

        {/* Conditionally render left side navigation if there is a previous status */}
        {currentIndex > 0 && (
          <TouchableOpacity
            style={styles.leftSide}
            onPress={handlePreviousStatus}>
            <Image
              source={icons.rightSideIcon}
              style={{
                tintColor: 'white',
                transform: [{rotate: '180deg'}],
              }}
            />
          </TouchableOpacity>
        )}

        {/* Conditionally render right side navigation if there is a next status */}
        {currentIndex < allStatuses.length - 1 && (
          <TouchableOpacity style={styles.rightSide} onPress={handleNextStatus}>
            <Image source={icons.rightSideIcon} style={{tintColor: 'white'}} />
          </TouchableOpacity>
        )}

        <Text
          style={{
            color: colors.white,
            fontSize: fontSize(18),
            lineHeight: hp(27),
            fontFamily: fontFamily.poppins400,
            textAlign: 'center',
            marginTop: 30,
          }}>
          {currentStatus?.caption || ''}
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  progressBarContainer: {
    height: 4,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  progressBarBackground: {
    height: 4, // Height of the progress bar
    backgroundColor: 'transparent',
  },
  statusImage: {
    width: '100%',
    height: '75%',
    resizeMode: 'stretch',
    marginTop: 30,
  },
  userName: {
    color: colors.white,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
  },
  timeAgoText: {
    color: colors.gray,
    fontSize: fontSize(12),
    fontFamily: fontFamily.poppins400,
    marginTop: 3,
  },
  leftSide: {
    position: 'absolute',
    top: '50%',
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
  rightSide: {
    position: 'absolute',
    top: '50%',
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 20,
  },
});

export default ViewStatusScreen;
