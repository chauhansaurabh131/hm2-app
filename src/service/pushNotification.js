import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import {Platform} from 'react-native';

export async function RequestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    checkToken();
  }
}

const checkToken = async () => {
  const fcmToken = await messaging().getToken();
  if (fcmToken) {
    console.log('=============fcmToken========>', fcmToken);
  }
};

export const NoificationListner = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      ' === Notification caused app to open from background state: ===> ',
      remoteMessage.notification,
    );
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          ' === Notification caused app to open from quit state: ===> ',
          remoteMessage.notification,
        );
      }
    });

  messaging().onMessage(async remoteMessage => {
    console.log(
      ' === notification on froground state..... ===> ',
      remoteMessage,
    );
  });
};

export const createChannel = () => {
  const key = Date.now().toString();
  PushNotification.createChannel(
    {
      channelId: key, // (required)
      // channelId: '1234', // (required)
      channelName: 'My channel', // (required)
      channelDescription: 'A channel to categorise your notifications',
      playSound: false,
      soundName: 'default',
      vibrate: true,
      importance: 4,
    },
    created => console.log(`createChannel returned '${created}'`),
  );
};

export const ForegroundMessages = async () => {
  {
    Platform.OS === 'android' &&
      (await messaging().onMessage(async remoteMessage => {
        console.log(' === ForegroundMessages ===> ', remoteMessage);

        await PushNotification.localNotification({
          channelId: '1234',
          message: remoteMessage?.notification?.body,
          title: remoteMessage?.notification?.title,
          bigPictureUrl: remoteMessage?.notification?.android?.imageUrl,
          smallIcon: remoteMessage?.notification?.android?.imageUrl,
        });
      }));
  }
  return ForegroundMessages;
};
