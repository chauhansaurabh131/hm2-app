import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {hp} from '../../utils/helpers'; // Replace with your actual helper
import {colors} from '../../utils/colors'; // Replace with your actual colors

const DemoCode = () => {
  const refRBSheet = useRef();

  const [timer, setTimer] = useState(120); // 2 minutes
  const [resendAvailable, setResendAvailable] = useState(false);

  // Countdown logic
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else {
      setResendAvailable(true);
    }

    return () => clearInterval(interval);
  }, [timer]);

  // Format seconds as MM:SS
  const formatTime = seconds => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => refRBSheet.current.open()}>
        <Text style={styles.openText}>Open BottomSheet</Text>
      </TouchableOpacity>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={300}
        onOpen={() => {
          setTimer(120); // Start timer when opened
          setResendAvailable(false);
        }}
        onClose={() => {
          setTimer(120); // Reset timer when closed
          setResendAvailable(false);
        }}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: '#000',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
          },
        }}>
        {/* Bottom Sheet Content */}
        <View>
          <Text style={{fontSize: 18, fontWeight: '600', textAlign: 'center'}}>
            OTP Verification
          </Text>

          <View style={{alignSelf: 'center', marginTop: hp(20)}}>
            {resendAvailable ? (
              <TouchableOpacity
                onPress={() => {
                  setTimer(120);
                  setResendAvailable(false);
                  // Trigger resend OTP API here if needed
                }}>
                <Text style={{color: colors.black, fontWeight: 'bold'}}>
                  Resend OTP
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={{color: colors.lightGray}}>
                Resend in{' '}
                <Text style={{color: colors.black}}>
                  {formatTime(timer)} Min
                </Text>
              </Text>
            )}
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default DemoCode;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  openText: {
    fontSize: 18,
    color: 'blue',
  },
});
