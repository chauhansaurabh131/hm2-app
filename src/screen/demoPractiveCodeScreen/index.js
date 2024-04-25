import React, {useEffect, useState} from 'react';
import {SafeAreaView, Text, TouchableOpacity, View} from 'react-native';

const DemoPractiveCodeScreen = () => {
  const [timer, setTimer] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(true); // Add state to track timer running status

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer === 1) {
            clearInterval(interval);
            setIsTimerRunning(false); // Timer is not running anymore
          }
          return prevTimer - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    } else {
      setIsTimerRunning(false); // Timer is not running anymore
    }
  }, [timer]);

  const handleResend = () => {
    // Reset timer and start again
    setTimer(10);
    setIsTimerRunning(true);
  };

  return (
    <SafeAreaView
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Text>OTP </Text>
        <Text>{timer === 0 ? 0 : timer}</Text>
      </View>
      {isTimerRunning ? (
        <TouchableOpacity style={{marginTop: 50}} disabled={true}>
          <Text>RESEND</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={{marginTop: 50}} onPress={handleResend}>
          <Text>RESEND</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default DemoPractiveCodeScreen;
