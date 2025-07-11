// import React, {useEffect} from 'react';
// import 'react-native-gesture-handler';
// import {NavigationContainer, useTheme} from '@react-navigation/native';
// import {createStackNavigator} from '@react-navigation/stack';
// import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
// import 'react-native-gesture-handler';
// import {
//   Image,
//   LogBox,
//   PermissionsAndroid,
//   Platform,
//   Text,
//   TouchableOpacity,
// } from 'react-native';
// import MainScreen from './src/screen/mainScreen';
// import RegistrationScreen from './src/screen/registrationScreen';
// import LoginScreen from './src/screen/loginScreen';
// import VerificationScreen from './src/screen/verificationScreen';
// import SetPasswordScreen from './src/screen/setPasswordScreen';
// import NumberRegistrationScreen from './src/screen/numberRegistrationScreen';
// import TextInputWithDropDownComponent from './src/components/textInputWithDropDownComponent';
// import DemoScreen from './src/screen/demoScreen';
// import NumberRegistrationTextInput from './src/components/numberRegistrationTextInput';
// import StartExploreScreen from './src/screen/startExploreScreen';
// import HomeScreen from './src/screen/HomeScreen';
// import MatchesScreen from './src/screen/matchesScreen';
// import ChatScreen from './src/screen/chatScreen';
// import AlertsScreen from './src/screen/alertsScreen';
// import UpgradeScreen from './src/screen/upgradeScreen';
// import {icons} from './src/assets';
// import {fontSize, hp, isIOS} from './src/utils/helpers';
// import LinearGradient from 'react-native-linear-gradient';
// import AddPersonalInfo from './src/screen/addPersonalInfo';
// import SetProfilePictureScreen from './src/screen/setProfilePictureScreen';
// import AccountsScreen from './src/screen/accountsScreen';
// import CredentialsScreen from './src/screen/CredentialsScreen';
// import HideDeleteProfileScreen from './src/screen/hideDeleteProfileScreen';
// import PrivacyScreen from './src/screen/privacyScreen';
// import MainScreenDemo from './src/screen/mainScreenDemo';
// import Xyz from './src/screen/xyz';
// import EmailSmsAlertScreen from './src/screen/emailSmsAlertScreen';
// import UserDetailsScreen from './src/screen/userDetailsScreen';
// import UserUploadImageFullScreen from './src/screen/userUploadImageFullScreen';
// import DemoPractiveCodeScreen from './src/screen/demoPractiveCodeScreen';
// import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
// import MyProfileScreen from './src/screen/myProfileScreen';
// import SelectImageScreen from './src/screen/selectImageScreen';
// import AddProfilePictureScreen from './src/screen/addProfilePictureScreen';
// import PartnerPreferencesScreen from './src/screen/partnerPreferencesScreen';
// import ChatUserScreen from './src/screen/chatUserScreen';
// import SuccessStoryPageScreen from './src/screen/successStoryPageScreen';
// import SuccessStoryEditInformationScreen from './src/screen/successStoryEditInformationScreen';
// import StoryShowComponent from './src/components/storyShowComponent';
// import OpenGalleryStoryScreen from './src/screen/openGalleryStoryScreen';
// import SetStoryScreen from './src/screen/setStoryScreen';
// import ExploreScreen from './src/screen/exploreScreen';
//
// LogBox.ignoreAllLogs();
//
// const Stack = createStackNavigator();
// const Tab = createBottomTabNavigator();
// const ExtraStack = createStackNavigator();
// const ExtrasStack = createStackNavigator();
// const profileStack = createStackNavigator();
//
// const MainStack = () => {
//   return (
//     <Stack.Navigator initialRouteName="RegistrationScreen">
//       {/*<Stack.Screen*/}
//       {/*  name="MainScreen"*/}
//       {/*  component={MainScreen}*/}
//       {/*  options={{headerShown: false}}*/}
//       {/*/>*/}
//       <Stack.Screen
//         name="MainScreenDemo"
//         component={MainScreenDemo}
//         options={{headerShown: false}}
//       />
//
//       <Stack.Screen name="Xyz" component={Xyz} options={{headerShown: false}} />
//       <Stack.Screen
//         name="DemoPractiveCodeScreen"
//         component={DemoPractiveCodeScreen}
//         options={{headerShown: false}}
//       />
//
//       <Stack.Screen
//         name="RegistrationScreen"
//         component={RegistrationScreen}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="LoginScreen"
//         component={LoginScreen}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="VerificationScreen"
//         component={VerificationScreen}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="SetPasswordScreen"
//         component={SetPasswordScreen}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="NumberRegistrationScreen"
//         component={NumberRegistrationScreen}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         // name="GeneralInformationScreen"
//         name="GeneralInformationScreen"
//         component={AddPersonalInfo}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="TextInputWithDropDownComponent"
//         component={TextInputWithDropDownComponent}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="DemoScreen"
//         component={DemoScreen}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="NumberRegistrationTextInput"
//         component={NumberRegistrationTextInput}
//         options={{headerShown: false}}
//       />
//       <Stack.Screen
//         name="StartExploreScreen"
//         component={StartExploreScreen}
//         options={{headerShown: false}}
//       />
//
//       <Stack.Screen
//         name="SetProfilePictureScreen"
//         component={SetProfilePictureScreen}
//         options={{headerShown: false}}
//       />
//
//       <Stack.Screen
//         name="SelectImageScreen"
//         component={SelectImageScreen}
//         options={{headerShown: false}}
//       />
//
//       <Stack.Screen
//         name="AddProfilePictureScreen"
//         component={AddProfilePictureScreen}
//         options={{headerShown: false}}
//       />
//
//       <Stack.Screen
//         name="PartnerPreferencesScreen"
//         component={PartnerPreferencesScreen}
//         options={{headerShown: false}}
//       />
//
//       <Stack.Screen
//         name="OpenGalleryStoryScreen"
//         component={OpenGalleryStoryScreen}
//         options={{headerShown: false}}
//       />
//
//       <Stack.Screen
//         name="SetStoryScreen"
//         component={SetStoryScreen}
//         options={{headerShown: false}}
//       />
//     </Stack.Navigator>
//   );
// };
//
// const ExtraScreens = () => {
//   return (
//     <ExtraStack.Navigator>
//       <ExtraStack.Screen
//         name="AccountsScreen"
//         component={AccountsScreen}
//         options={{headerShown: false}}
//       />
//
//       <ExtraStack.Screen
//         name="CredentialsScreen"
//         component={CredentialsScreen}
//         options={{headerShown: false}}
//       />
//
//       <ExtraStack.Screen
//         name="HideDeleteProfileScreen"
//         component={HideDeleteProfileScreen}
//         options={{headerShown: false}}
//       />
//
//       <ExtraStack.Screen
//         name="HomeTabs"
//         component={HomeTabs}
//         options={{headerShown: false}}
//       />
//
//       {/*<ExtraStack.Screen*/}
//       {/*  name="PrivacyScreen"*/}
//       {/*  component={PrivacyScreen}*/}
//       {/*  options={{headerShown: false}}*/}
//       {/*/>*/}
//
//       <ExtraStack.Screen
//         name="EmailSmsAlertScreen"
//         component={EmailSmsAlertScreen}
//         options={{headerShown: false}}
//       />
//     </ExtraStack.Navigator>
//   );
// };
//
// const ExtrasScreens = ({route}) => {
//   const {selectedBox} = route.params ?? {};
//   return (
//     <ExtrasStack.Navigator>
//       <ExtrasStack.Screen
//         name="UserDetailsScreen"
//         component={UserDetailsScreen}
//         options={{headerShown: false}}
//         initialParams={{selectedBox: selectedBox}}
//       />
//       <ExtrasStack.Screen
//         name="UserUploadImageFullScreen"
//         component={UserUploadImageFullScreen}
//         options={{headerShown: false}}
//       />
//     </ExtrasStack.Navigator>
//   );
// };
//
// const UploadImageFullScreen = () => {
//   return (
//     <ExtrasStack.Navigator>
//       <ExtrasStack.Screen
//         name="UserUploadImageFullScreen"
//         component={UserUploadImageFullScreen}
//         options={{headerShown: false}}
//       />
//     </ExtrasStack.Navigator>
//   );
// };
//
// const UsersChatsScreen = ({route}) => {
//   const {selectedBox} = route.params ?? {};
//   return (
//     <ExtrasStack.Navigator>
//       <ExtrasStack.Screen
//         name="ChatUserScreen"
//         component={ChatUserScreen}
//         initialParams={{
//           selectedBox: selectedBox,
//           userData: route.params?.userData,
//         }}
//         options={{headerShown: false}}
//       />
//     </ExtrasStack.Navigator>
//   );
// };
//
// const PrivacyScreenStack = () => {
//   return (
//     <ExtrasStack.Navigator>
//       <ExtraStack.Screen
//         name="PrivacyScreen"
//         component={PrivacyScreen}
//         options={{headerShown: false}}
//       />
//     </ExtrasStack.Navigator>
//   );
// };
//
// const ProfileStack = () => {
//   return (
//     <ExtrasStack.Navigator>
//       <ExtraStack.Screen
//         name="MyProfileScreen"
//         component={MyProfileScreen}
//         options={{headerShown: false}}
//       />
//     </ExtrasStack.Navigator>
//   );
// };
//
// const SuccessStoryStack = () => {
//   return (
//     <ExtrasStack.Navigator>
//       <ExtraStack.Screen
//         name="SuccessStoryPageScreen"
//         component={SuccessStoryPageScreen}
//         options={{headerShown: false}}
//       />
//
//       <ExtraStack.Screen
//         name="SuccessStoryEditInformationScreen"
//         component={SuccessStoryEditInformationScreen}
//         options={{headerShown: false}}
//       />
//     </ExtrasStack.Navigator>
//   );
// };
//
// const App = () => {
//   useEffect(() => {
//     hasPermission();
//   }, []);
//
//   const hasPermission = async () => {
//     const permission =
//       Platform.Version >= 33
//         ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
//         : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
//
//     const hasPermission = await PermissionsAndroid.check(permission);
//     if (hasPermission) {
//       return true;
//     }
//     let status = await PermissionsAndroid.request(permission); // Change from const to let
//     return status === PermissionsAndroid.RESULTS.GRANTED;
//   };
//   return (
//     <BottomSheetModalProvider>
//       <NavigationContainer>
//         <Stack.Navigator>
//           <Stack.Screen
//             name="MainStack"
//             component={MainStack}
//             options={{headerShown: false}}
//           />
//           <Stack.Screen
//             name="HomeTabs"
//             component={HomeTabs}
//             options={{headerShown: false}}
//           />
//
//           <Stack.Screen
//             name="StoryShowComponent"
//             component={StoryShowComponent}
//             options={{headerShown: false}}
//           />
//         </Stack.Navigator>
//       </NavigationContainer>
//     </BottomSheetModalProvider>
//   );
// };
//
// const CustomTabBarButton = ({accessibilityState, children, onPress}) => {
//   const focused = accessibilityState.selected;
//
//   const gradientColors = focused
//     ? ['#0D4EB3', '#9413D0']
//     : ['transparent', 'transparent'];
//
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       style={{
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginHorizontal: 5,
//         marginBottom: 10,
//         height: hp(65),
//         width: hp(60),
//         marginTop: 5,
//       }}>
//       <LinearGradient
//         colors={gradientColors}
//         start={{x: 0, y: 0}}
//         end={{x: 0, y: 1.5}}
//         style={{
//           borderRadius: 10,
//           padding: 5,
//           width: '100%',
//           height: '100%',
//           alignItems: 'center',
//           justifyContent: 'center',
//         }}>
//         {children}
//       </LinearGradient>
//     </TouchableOpacity>
//   );
// };
//
// const HomeTabs = ({route}) => {
//   const {colors} = useTheme();
//   const {selectedBox} = route.params ?? {};
//
//   const getIconStyle = isFocused => {
//     return {
//       width: hp(17.76),
//       height: hp(20),
//       tintColor: isFocused ? 'white' : '#120FBA',
//     };
//   };
//
//   const getLabelStyle = isFocused => {
//     return {
//       color: isFocused ? 'white' : 'black',
//     };
//   };
//
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarStyle: {
//           height: isIOS ? hp(100) : hp(80),
//           borderTopRightRadius: 10,
//           borderTopLeftRadius: 10,
//         },
//       }}>
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         initialParams={{selectedBox: selectedBox}}
//         options={{
//           tabBarIcon: ({color, size, focused}) => (
//             <Image source={icons.homeIcon} style={getIconStyle(focused)} />
//           ),
//           tabBarLabel: ({focused}) => (
//             <Text
//               style={[
//                 getLabelStyle(focused),
//                 {
//                   fontSize: fontSize(10),
//                   lineHeight: hp(15),
//                   fontWeight: '500',
//                 },
//               ]}>
//               Home
//             </Text>
//           ),
//           tabBarButton: props => <CustomTabBarButton {...props} />,
//           headerShown: false,
//         }}
//       />
//
//       {selectedBox === 'marriage' ? (
//         <Tab.Screen
//           name="Matches"
//           component={MatchesScreen}
//           options={{
//             tabBarIcon: ({color, size, focused}) => (
//               <Image
//                 source={icons.matchesIcon}
//                 style={[
//                   getIconStyle(focused),
//                   {width: hp(22.5), height: hp(20)},
//                 ]}
//               />
//             ),
//             tabBarLabel: ({focused}) => (
//               <Text
//                 style={[
//                   getLabelStyle(focused),
//                   {
//                     fontSize: fontSize(10),
//                     lineHeight: hp(15),
//                     fontWeight: '500',
//                   },
//                 ]}>
//                 Matches
//               </Text>
//             ),
//             tabBarButton: props => <CustomTabBarButton {...props} />,
//             headerShown: false,
//           }}
//         />
//       ) : (
//         <Tab.Screen
//           name="Explore"
//           component={ExploreScreen}
//           initialParams={{selectedBox}}
//           options={{
//             tabBarIcon: ({color, size, focused}) => (
//               <Image
//                 source={icons.matchesIcon}
//                 style={[
//                   getIconStyle(focused),
//                   {width: hp(22.5), height: hp(20)},
//                 ]}
//               />
//             ),
//             tabBarLabel: ({focused}) => (
//               <Text
//                 style={[
//                   getLabelStyle(focused),
//                   {
//                     fontSize: fontSize(10),
//                     lineHeight: hp(15),
//                     fontWeight: '500',
//                   },
//                 ]}>
//                 Explore
//               </Text>
//             ),
//             tabBarButton: props => <CustomTabBarButton {...props} />,
//             headerShown: false,
//           }}
//         />
//       )}
//
//       <Tab.Screen
//         name="Chat"
//         component={ChatScreen}
//         options={{
//           tabBarIcon: ({color, size, focused}) => (
//             <Image
//               source={icons.chatIcon}
//               style={[getIconStyle(focused), {width: hp(20.5), height: hp(20)}]}
//             />
//           ),
//           tabBarLabel: ({focused}) => (
//             <Text
//               style={[
//                 getLabelStyle(focused),
//                 {
//                   fontSize: fontSize(10),
//                   lineHeight: hp(15),
//                   fontWeight: '500',
//                 },
//               ]}>
//               Chat
//             </Text>
//           ),
//           tabBarButton: props => <CustomTabBarButton {...props} />,
//           headerShown: false,
//         }}
//       />
//       <Tab.Screen
//         name="Alerts"
//         component={AlertsScreen}
//         options={{
//           tabBarIcon: ({color, size, focused}) => (
//             <Image
//               source={icons.alertsIcon}
//               style={[getIconStyle(focused), {width: hp(16.1), height: hp(20)}]}
//             />
//           ),
//           tabBarLabel: ({focused}) => (
//             <Text
//               style={[
//                 getLabelStyle(focused),
//                 {
//                   fontSize: fontSize(10),
//                   lineHeight: hp(15),
//                   fontWeight: '500',
//                 },
//               ]}>
//               Alerts
//             </Text>
//           ),
//           tabBarButton: props => <CustomTabBarButton {...props} />,
//           headerShown: false,
//         }}
//       />
//
//       <Tab.Screen
//         name="Upgrader"
//         component={UpgradeScreen}
//         options={{
//           tabBarIcon: ({color, size, focused}) => (
//             <Image
//               source={icons.upgradeIcon}
//               style={[
//                 getIconStyle(focused),
//                 {width: hp(20.98), height: hp(20)},
//               ]}
//             />
//           ),
//           tabBarLabel: ({focused}) => (
//             <Text
//               style={[
//                 getLabelStyle(focused),
//                 {
//                   fontSize: fontSize(10),
//                   lineHeight: hp(15),
//                   fontWeight: '500',
//                 },
//               ]}>
//               Upgrader
//             </Text>
//           ),
//           tabBarButton: props => <CustomTabBarButton {...props} />,
//           headerShown: false,
//         }}
//       />
//
//       <Tab.Screen
//         name="AccountsScreen"
//         component={ExtraScreens}
//         options={{tabBarButton: () => null, headerShown: false}}
//       />
//       <Tab.Screen
//         name="UserDetailsScreen"
//         component={ExtrasScreens}
//         options={{tabBarButton: () => null, headerShown: false}}
//       />
//       <Tab.Screen
//         name="UserUploadImageFullScreen"
//         component={UploadImageFullScreen}
//         options={{tabBarButton: () => null, headerShown: false}}
//       />
//
//       <Tab.Screen
//         name="MyProfileScreen"
//         component={ProfileStack}
//         options={{tabBarButton: () => null, headerShown: false}}
//       />
//
//       <Tab.Screen
//         name="PrivacyScreen"
//         component={PrivacyScreenStack}
//         options={{tabBarButton: () => null, headerShown: false}}
//       />
//
//       <Tab.Screen
//         name="ChatUserScreen"
//         component={UsersChatsScreen}
//         initialParams={{
//           selectedBox: selectedBox,
//           userData: route.params?.userData,
//         }}
//         options={{tabBarButton: () => null, headerShown: false}}
//       />
//       <Tab.Screen
//         name="SuccessStoryPageScreen"
//         component={SuccessStoryStack}
//         options={{tabBarButton: () => null, headerShown: false}}
//       />
//     </Tab.Navigator>
//   );
// };

// export default App;

// import React, {useEffect} from 'react';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
// import MainNavigator from './src/navigations';
// import {LogBox} from 'react-native';
// // import {PersistGate} from 'redux-persist/integration/react';
// import {Provider} from 'react-redux';
// import {persistor, store} from './src/reducer/store';
// import {RequestUserPermission} from './src/service/pushNotification';
// import {PersistGate} from 'redux-persist/integration/react';
// LogBox.ignoreAllLogs();
//
// const App = () => {
//   useEffect(() => {
//     RequestUserPermission();
//   });
//
//   return (
//     <SafeAreaProvider>
//       <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           <MainNavigator />
//         </PersistGate>
//       </Provider>
//     </SafeAreaProvider>
//   );
// };
//
// export default App;

// import React, {useEffect} from 'react';
// import {SafeAreaProvider} from 'react-native-safe-area-context';
// import MainNavigator from './src/navigations';
// import {LogBox, Platform, PermissionsAndroid} from 'react-native';
// import {Provider} from 'react-redux';
// import {persistor, store} from './src/reducer/store';
// import {RequestUserPermission} from './src/service/pushNotification';
// import {PersistGate} from 'redux-persist/integration/react';
// import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
//
// LogBox.ignoreAllLogs();
//
// const App = () => {
//   useEffect(() => {
//     RequestUserPermission();
//     requestPermissions();
//   }, []);
//
//   const requestPermissions = async () => {
//     if (Platform.OS === 'ios') {
//       const photoPermission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
//       if (photoPermission !== RESULTS.GRANTED) {
//         const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
//         if (result !== RESULTS.GRANTED) {
//           console.warn('Photo library access denied');
//         }
//       }
//     } else if (Platform.OS === 'android') {
//       const photoPermission = await PermissionsAndroid.check(
//         PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//       );
//       if (!photoPermission) {
//         const result = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           {
//             title: 'Photo Library Access',
//             message: 'This app needs access to your photo library',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         if (result !== PermissionsAndroid.RESULTS.GRANTED) {
//           console.warn('Photo library access denied');
//         }
//       }
//     }
//   };
//
//   return (
//     <SafeAreaProvider>
//       <Provider store={store}>
//         <PersistGate loading={null} persistor={persistor}>
//           <MainNavigator />
//         </PersistGate>
//       </Provider>
//     </SafeAreaProvider>
//   );
// };
//
// export default App;

import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import MainNavigator from './src/navigations';
import {
  LogBox,
  Platform,
  PermissionsAndroid,
  Alert,
  Text,
  Animated,
  StyleSheet,
} from 'react-native';
import {Provider, useSelector} from 'react-redux'; // Keep this import
import {persistor, store} from './src/reducer/store';
import {
  ForegroundMessages,
  NoificationListner,
  RequestUserPermission,
} from './src/service/pushNotification';
import {PersistGate} from 'redux-persist/integration/react';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import NetInfo from '@react-native-community/netinfo';
import {SocketProvider} from './src/utils/context/SocketContext';

LogBox.ignoreAllLogs();

// Create a separate component for the main app logic
const MainApp = () => {
  const [isConnect, setIsConnect] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const translateY = useRef(new Animated.Value(100)).current;
  const timerRef = useRef(null);

  const {user} = useSelector(state => state.auth);
  // console.log(' === user----- ===> ', user?.user);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      console.log(' === Connection Type ===> ', state.type);
      console.log(' === isConnected ? ===> ', state.isConnected);

      if (!state.isConnected) {
        setIsConnect(false);
        setShowMessage(true);
        slideIn();

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      } else {
        setIsConnect(true);
        setShowMessage(true);
        slideIn();

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          slideOut();
        }, 1500);
      }
    });

    return () => {
      unsubscribe();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const slideIn = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const slideOut = () => {
    Animated.timing(translateY, {
      toValue: 100,
      duration: 300,
      useNativeDriver: true,
    }).start(() => setShowMessage(false));
  };

  useEffect(() => {
    requestPermissionsAndroid();
    NoificationListner();
    ForegroundMessages();
    RequestUserPermission();
    requestPermissions();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('FCM message received:', remoteMessage);
      onDisplayNotification(remoteMessage);
    });

    return () => unsubscribe();
  }, []);

  const onDisplayNotification = async remoteMessage => {
    try {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        sound: 'default',
        importance: AndroidImportance.HIGH,
      });

      await notifee.displayNotification({
        title: remoteMessage.notification.title || 'Default Title',
        body: remoteMessage.notification.body || 'Default message content',
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.error('Error displaying notification:', error);
    }
  };

  const requestPermissions = async () => {
    // Request photo library permission
    if (Platform.OS === 'ios') {
      const photoPermission = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (photoPermission !== RESULTS.GRANTED) {
        const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (result !== RESULTS.GRANTED) {
          console.warn('Photo library access denied');
        }
      }

      // Request microphone permission
      const audioPermission = await check(PERMISSIONS.IOS.MICROPHONE);
      if (audioPermission !== RESULTS.GRANTED) {
        const result = await request(PERMISSIONS.IOS.MICROPHONE);
        if (result !== RESULTS.GRANTED) {
          console.warn('Microphone access denied');
        }
      }
    } else if (Platform.OS === 'android') {
      // Request photo library permission
      const photoPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
      if (!photoPermission) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Photo Library Access',
            message: 'This app needs access to your photo library',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Photo library access denied');
        }
      }

      const audioPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      );
      if (!audioPermission) {
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: 'Microphone Access',
            message:
              'This app needs access to your microphone for audio recording',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (result !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Microphone access denied');
        }
      }
    }
  };

  const requestPermissionsAndroid = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log(' === Permission Granted ===> ');
      } else {
        Alert.alert('Permission Denied');
      }
    } else {
      console.log(
        ' === POST_NOTIFICATIONS ===> ',
        'POST_NOTIFICATIONS permission not required for this Android version',
      );
    }
  };

  return (
    <>
      <MainNavigator />
      {showMessage && (
        <Animated.View
          style={[
            styles.banner,
            {
              transform: [{translateY}],
              backgroundColor: isConnect ? '#4CAF50' : '#f44336',
            },
          ]}>
          <Text style={styles.bannerText}>
            {isConnect ? 'Connected to Internet' : 'No Internet Connection'}
          </Text>
        </Animated.View>
      )}
    </>
  );
};

const App = () => {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <MainApp />
        </PersistGate>
      </Provider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  banner: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  bannerText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
