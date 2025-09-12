import React, {useEffect, useRef} from 'react';
import {Animated, Easing, SafeAreaView} from 'react-native';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';

const CustomGradientLoader = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.8,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1.2,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [rotateValue, scaleValue]);

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const radius = 20;
  const circumference = 2 * Math.PI * radius;

  return (
    <SafeAreaView>
      <Animated.View
        style={{
          transform: [{rotate: spin}, {scale: scaleValue}],
        }}>
        <Svg height="80" width="80" viewBox="0 0 100 100">
          <Defs>
            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#0D4EB3" />
              <Stop offset="100%" stopColor="#9413D0" />
            </LinearGradient>
          </Defs>
          <Circle
            cx="50"
            cy="50"
            r={radius}
            stroke="url(#grad)"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={`${circumference * 0.85} ${circumference}`}
            strokeDashoffset={circumference * 0.1}
          />
        </Svg>
      </Animated.View>
    </SafeAreaView>
  );
};

export default CustomGradientLoader;
