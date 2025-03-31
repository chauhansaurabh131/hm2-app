import React, {useState, useEffect} from 'react';
import {SafeAreaView, Text, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import axios from 'axios'; // Import axios

const Abc = () => {
  const [seconds, setSeconds] = useState(120); // 120 seconds (2 minutes)
  const [timerActive, setTimerActive] = useState(true);

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token; // Get the access token from Redux

  // Start the timer when the component mounts
  useEffect(() => {
    let interval;

    if (timerActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000); // Decrease by 1 second every second
    } else if (seconds === 0) {
      setTimerActive(false); // Stop the timer when it reaches 0
    }

    // Clear the interval when the component is unmounted or timer is inactive
    return () => clearInterval(interval);
  }, [timerActive, seconds]);

  // Format the seconds to MM:SS
  const formatTime = time => {
    const minutes = Math.floor(time / 60);
    const remainingSeconds = time % 60;
    return `${String(minutes).padStart(2, '0')}:${String(
      remainingSeconds,
    ).padStart(2, '0')}`;
  };

  // Format the display based on time remaining
  const formatDisplay = seconds => {
    if (seconds >= 60) {
      // If more than 60 seconds, display MM:SS Min
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${String(remainingSeconds).padStart(2, '0')} Min`;
    } else {
      // If less than 60 seconds, display SS Sec
      return `${String(seconds).padStart(2, '0')} Sec`;
    }
  };

  // Handle Resend Click
  const handleResend = async () => {
    try {
      // Make the API request to send OTP
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/2fa/send-otp',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Use the access token from Redux store
          },
        },
      );
      if (response.status === 200) {
        console.log('OTP resend successful:', response.data);
        // Reset the timer and start again
        setSeconds(120); // Reset the timer to 2 minutes
        setTimerActive(true); // Start the timer again
      } else {
        console.error('Failed to resend OTP:', response.data);
      }
    } catch (error) {
      console.error('Error resending OTP:', error.message);
    }
  };

  return (
    <SafeAreaView>
      <Text style={{marginTop: 50, textAlign: 'center'}}>
        {timerActive ? `Resend in ${formatDisplay(seconds)}` : null}
      </Text>

      {!timerActive && (
        <TouchableOpacity onPress={handleResend}>
          <Text style={{textAlign: 'center', color: 'blue', marginTop: 20}}>
            Resend
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default Abc;
