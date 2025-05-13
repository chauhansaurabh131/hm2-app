import React, {useEffect} from 'react';
import {SafeAreaView, Text} from 'react-native';
import messaging from '@react-native-firebase/messaging';

const DemoCode = () => {
  // async function requestUserPermission() {
  //   const authStatus = await messaging().requestPermission();
  //   const enabled =
  //     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
  //     authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  //
  //   if (enabled) {
  //     console.log('Authorization status:', authStatus);
  //   }
  // }
  //
  // const getToken = async () => {
  //   const token = await messaging().getToken();
  //   console.log(' === Token ===> ', token);
  // };
  //
  // useEffect(() => {
  //   requestUserPermission();
  //   getToken();
  // }, []);

  return (
    <SafeAreaView>
      <Text>svjn</Text>
    </SafeAreaView>
  );
};

export default DemoCode;
