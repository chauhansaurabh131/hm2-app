/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import 'react-native-gesture-handler';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';

// const navigation = useNavigation();
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log(
    ' === remoteMessage.data.screen ===> ',
    remoteMessage.data.screen,
  );
  if (remoteMessage?.data?.screen) {
    // navigation.navigate(remoteMessage?.data?.screen);
    console.log(
      ' === remoteMessage.data.screen555 ===> ',
      remoteMessage.data.screen,
    );
  }
  console.log('Message handled in the background!', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
