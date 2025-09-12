import React, {useEffect, useRef} from 'react';
import {SafeAreaView, Text, Animated, Easing} from 'react-native';
import {useSelector} from 'react-redux';
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg';

const GradientArcLoader = () => {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Rotation animation
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Scale (pulse) animation
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
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference * 0.85} ${circumference}`}
          strokeDashoffset={circumference * 0.1}
        />
      </Svg>
    </Animated.View>
  );
};

const Abc = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const [creditData, setCreditData] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    const fetchCredit = async () => {
      if (!accessToken || !userId) {
        console.warn('Missing accessToken or userId');
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/user/get-credit/${userId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch credit data');
        }

        const data = await response.json();
        setCreditData(data);
      } catch (error) {
        console.error('Error fetching credit:', error.message);
      } finally {
        setLoading(true); // fix: should stop loader, not keep it running
      }
    };

    fetchCredit();
  }, [accessToken, userId]);

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {loading ? (
        <GradientArcLoader />
      ) : creditData ? (
        <Text>Credit: {JSON.stringify(creditData?.credit?.creditBalance)}</Text>
      ) : (
        <Text>No credit data</Text>
      )}
    </SafeAreaView>
  );
};

export default Abc;
