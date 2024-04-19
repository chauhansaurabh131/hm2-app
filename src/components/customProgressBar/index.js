import React, {useRef} from 'react';
import {View, StyleSheet, PanResponder} from 'react-native';
import LinearGradient from 'react-native-linear-gradient'; // Import LinearGradient

const ProgressBar = ({progress, onMoveCircle}) => {
  const circleRef = useRef(null);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      const newProgress = (gestureState.moveX - 40) / 240; // Adjusted for container width
      if (newProgress >= 0 && newProgress <= 1) {
        onMoveCircle(newProgress);
      }
    },
  });

  return (
    <View style={styles.progressBar}>
      <View style={[styles.progressLine, {width: `${progress * 100}%`}]} />
      <LinearGradient
        colors={['#0F52BA', '#BA0FA9']} // Gradient colors
        start={{x: 0, y: 0}}
        end={{x: 1.5, y: 0}}
        style={[styles.progressCircleContainer, {left: `${progress * 100}%`}]}>
        <View
          ref={circleRef}
          style={styles.progressCircle}
          {...panResponder.panHandlers}
        />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    width: '100%', // Adjust as needed
    height: 2, // Adjust as needed
    backgroundColor: '#ddd', // Background color of the progress bar
    borderRadius: 10, // Border radius of the progress bar
    overflow: 'visible', // Allow contents to overflow
    position: 'relative',
  },
  progressLine: {
    height: '100%',
    backgroundColor: 'blue', // Color of the progress indicator
    position: 'absolute',
    top: 0,
    left: 0,
    borderRadius: 10, // Border radius to match the progress bar
  },
  progressCircleContainer: {
    width: 20, // Diameter of the circle
    height: 20, // Diameter of the circle
    borderRadius: 10, // Radius half of the width/height to make it a circle
    position: 'absolute',
    marginLeft: -10, // Adjusted left position for alignment (half of circle width)
    top: -10,
  },
  progressCircle: {
    width: '100%',
    height: '100%',
    borderRadius: 10, // Radius half of the width/height to make it a circle
  },
});

export default ProgressBar;
