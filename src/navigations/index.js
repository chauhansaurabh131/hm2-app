import React, {useMemo, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Image, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GeneralInformationScreen from '../screen/generalInformationScreen';
import RegistrationScreen from '../screen/registrationScreen';
import LoginScreen from '../screen/loginScreen';
import VerificationScreen from '../screen/verificationScreen';
import SetPasswordScreen from '../screen/setPasswordScreen';
import NumberRegistrationScreen from '../screen/numberRegistrationScreen';
import AddPersonalInfo from '../screen/addPersonalInfo';
import NumberRegistrationTextInput from '../components/numberRegistrationTextInput';
import StartExploreScreen from '../screen/startExploreScreen';
import HomeScreen from '../screen/HomeScreen';
import MatchesScreen from '../screen/matchesScreen';
import ChatScreen from '../screen/chatScreen';
import AlertsScreen from '../screen/alertsScreen';
import UpgradeScreen from '../screen/upgradeScreen';
import {icons} from '../assets';
import {fontSize, hp, isIOS} from '../utils/helpers';
import MainScreenDemo from '../screen/mainScreenDemo';
import ExploreScreen from '../screen/exploreScreen';
import DemoPractiveCodeScreen from '../screen/demoPractiveCodeScreen';
import ChatUserScreen from '../screen/chatUserScreen';
import {useSelector} from 'react-redux';
import SetProfilePictureScreen from '../screen/setProfilePictureScreen';
import SelectImageScreen from '../screen/selectImageScreen';
import AddProfilePictureScreen from '../screen/addProfilePictureScreen';
import PartnerPreferencesScreen from '../screen/partnerPreferencesScreen';
import UserDetailsScreen from '../screen/userDetailsScreen';
import Message from '../screen/message';
import {style} from './style';
import NewSignUpScreen from '../screen/newSignUpScreen';
import NewLogInScreen from '../screen/newLogInScreen';
import VerifyEmailOtpScreen from '../screen/verifyEmailOtpScreen';
import NewSetPasswordScreen from '../screen/newSetPasswordScreen';
import NewStartExploreScreen from '../screen/newStartExploreScreen';
import NewMainScreen from '../screen/newMainScreen';
import ResetPasswordScreen from '../screen/resetPasswordScreen';
import ResetVerifyScreen from '../screen/resetVerifyScreen';
import VerifySetPasswordScreen from '../screen/verifySetPasswordScreen';
import DemoCode from '../screen/demoCode';
import MyProfileScreen from '../screen/myProfileScreen';
import AccountsScreen from '../screen/accountsScreen';
import CredentialsScreen from '../screen/CredentialsScreen';
import HideDeleteProfileScreen from '../screen/hideDeleteProfileScreen';
import PrivacyScreen from '../screen/privacyScreen';
import ConnectToWebScreen from '../screen/connectToWebScreen ';
import QRCodeScreen from '../screen/QRCodeScreen';
import EmailSmsAlertScreen from '../screen/emailSmsAlertScreen';
import {createStackNavigator} from '@react-navigation/stack';
import PlanScreen from '../screen/planScreen';
import KycDetailsScreen from '../screen/kycDetailsScreen ';
import CreatingProfileScreen from '../screen/creatingProfileScreen';
import DatingHomeScreen from '../screen/DatingHomeScreen';
import DatingExploreScreen from '../screen/datingExploreScreen';
import Abc from '../screen/abc';
import SuccessStoryPageScreen from '../screen/successStoryPageScreen';
import SuccessStoryEditInformationScreen from '../screen/successStoryEditInformationScreen';
import DatingCreatingProfile from '../screen/datingAllScreen/DatingCreatingProfile';
import AddDatingPersonalInfo from '../screen/datingAllScreen/addDatingPersonalInfo';
import DatingPartnerPreferenceScreen from '../screen/datingAllScreen/datingPartnerPreferenceScreen';
import DatingProfileScreen from '../screen/datingAllScreen/datingProfileScreen';
import DatingEditProfileScreen from '../screen/datingAllScreen/datingEditProfileScreen';

import AddSetStoryImageComponent from '../components/addSetStoryImageComponent';
import NewAddStoryScreen from '../screen/newAddStoryScreen';
import ViewStatusScreen from '../screen/viewStatusScreen';
import ViewUserStatusScreen from '../screen/viewUserStatusScreen';
import UserUploadImageFullScreen from '../screen/userUploadImageFullScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ExtrasStack = createNativeStackNavigator();
const ExtraStack = createStackNavigator();

const MainNavigator = () => {
  const [isDatingSelected, setIsDatingSelected] = useState(false);

  const {isLoggedIn, appUsesType, user} = useSelector(state => state.auth);

  // console.log(' === user ===> ', user?.user?.appUsesType);

  const appType = user?.user?.appUsesType;

  console.log(' === appType ===> ', appType);

  console.log(' === appType ===> ', appUsesType);
  // console.log(' === isDating ===> ', appUsesType === 'dating');

  const AuthStack = () => (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="NewMainScreen">
      <Stack.Screen name="DemoCode" component={DemoCode} />
      <Stack.Screen name="MainScreenDemo" component={MainScreenDemo} />
      <Stack.Screen name="NewMainScreen" component={NewMainScreen} />
      <Stack.Screen name="NewSignUpScreen" component={NewSignUpScreen} />
      <Stack.Screen name="NewLogInScreen" component={NewLogInScreen} />

      <Stack.Screen
        name="VerifyEmailOtpScreen"
        component={VerifyEmailOtpScreen}
      />
      <Stack.Screen
        name="NewSetPasswordScreen"
        component={NewSetPasswordScreen}
      />
      <Stack.Screen
        name="NewStartExploreScreen"
        component={NewStartExploreScreen}
      />

      <Stack.Screen
        name="ResetPasswordScreen"
        component={ResetPasswordScreen}
      />

      <Stack.Screen name="ResetVerifyScreen" component={ResetVerifyScreen} />
      <Stack.Screen
        name="VerifySetPasswordScreen"
        component={VerifySetPasswordScreen}
      />

      <Stack.Screen
        name="GeneralInformation"
        component={GeneralInformationScreen}
      />
      <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      <Stack.Screen name="SetPasswordScreen" component={SetPasswordScreen} />
      <Stack.Screen
        name="NumberRegistrationScreen"
        component={NumberRegistrationScreen}
      />
      {/*<Stack.Screen*/}
      {/*  name="GeneralInformationScreen"*/}
      {/*  component={AddPersonalInfo}*/}
      {/*/>*/}
      <Stack.Screen
        name="NumberRegistrationTextInput"
        component={NumberRegistrationTextInput}
      />
      <Stack.Screen name="StartExploreScreen" component={StartExploreScreen} />
    </Stack.Navigator>
  );

  const CustomTabBarButton = ({accessibilityState, children, onPress}) => {
    const focused = accessibilityState.selected;

    const gradientColors = focused
      ? ['#0D4EB3', '#9413D0']
      : ['transparent', 'transparent'];

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 5,
          marginBottom: 10,
          height: hp(65),
          width: hp(60),
          marginTop: 5,
        }}>
        <LinearGradient
          colors={gradientColors}
          start={{x: 0, y: 0}}
          end={{x: 0, y: 1.5}}
          style={{
            borderRadius: 10,
            padding: 5,
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {children}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const ExtraScreens = () => {
    return (
      <ExtraStack.Navigator>
        <ExtraStack.Screen
          name="AccountsScreen"
          component={AccountsScreen}
          options={{headerShown: false}}
        />

        <ExtraStack.Screen
          name="CredentialsScreen"
          component={CredentialsScreen}
          options={{headerShown: false}}
        />

        <ExtraStack.Screen
          name="HideDeleteProfileScreen"
          component={HideDeleteProfileScreen}
          options={{headerShown: false}}
        />

        {/*<ExtraStack.Screen*/}
        {/*  name="HomeTabs"*/}
        {/*  component={HomeTabs}*/}
        {/*  options={{headerShown: false}}*/}
        {/*/>*/}

        <ExtraStack.Screen
          name="PrivacyScreen"
          component={PrivacyScreen}
          options={{headerShown: false}}
        />

        <ExtraStack.Screen
          name="EmailSmsAlertScreen"
          component={EmailSmsAlertScreen}
          options={{headerShown: false}}
        />

        <ExtraStack.Screen
          name="PlanScreen"
          component={PlanScreen}
          options={{headerShown: false}}
        />

        <ExtraStack.Screen
          name="KycDetailsScreen"
          component={KycDetailsScreen}
          options={{headerShown: false}}
        />
      </ExtraStack.Navigator>
    );
  };

  const UsersChatsScreen = ({route}) => {
    const {selectedBox} = route.params ?? {};
    return (
      <ExtrasStack.Navigator>
        <ExtrasStack.Screen
          name="ChatUserScreen"
          component={ChatUserScreen}
          initialParams={{
            selectedBox: selectedBox,
            userData: route.params?.userData,
          }}
          options={{headerShown: false}}
        />
      </ExtrasStack.Navigator>
    );
  };

  // const HomeStack = () => {
  //   return (
  //     <Stack.Navigator
  //       screenOptions={{headerShown: false}}
  //       initialRouteName={'HomeTabs'}>
  //       <Stack.Screen name="DemoCode" component={DemoCode} />
  //       <Stack.Screen name="Abc" component={Abc} />
  //       <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
  //       <Stack.Screen name={'DatingHomeScreen'} component={DatingHomeScreen} />
  //       <Stack.Screen
  //         name={'DatingExploreScreen'}
  //         component={DatingExploreScreen}
  //       />
  //       <Stack.Screen name={'HomeTabs'} component={HomeTabs} />
  //       <Stack.Screen name={'ChatUserScreen'} component={ChatUserScreen} />
  //       <Stack.Screen
  //         name={'DemoPractiveCodeScreen'}
  //         component={DemoPractiveCodeScreen}
  //       />
  //       <Stack.Screen
  //         name="CreatingProfileScreen"
  //         component={CreatingProfileScreen}
  //       />
  //       <Stack.Screen
  //         name={'GeneralInformationScreen'}
  //         component={AddPersonalInfo}
  //       />
  //       <Stack.Screen
  //         name={'SetProfilePictureScreen'}
  //         component={SetProfilePictureScreen}
  //       />
  //       <Stack.Screen
  //         name={'SelectImageScreen'}
  //         component={SelectImageScreen}
  //       />
  //       <Stack.Screen
  //         name={'AddProfilePictureScreen'}
  //         component={AddProfilePictureScreen}
  //       />
  //       <Stack.Screen
  //         name={'PartnerPreferencesScreen'}
  //         component={PartnerPreferencesScreen}
  //       />
  //       <Stack.Screen
  //         name={'UserDetailsScreen'}
  //         component={UserDetailsScreen}
  //       />
  //       <Stack.Screen
  //         name={'ConnectToWebScreen'}
  //         component={ConnectToWebScreen}
  //       />
  //       <Stack.Screen
  //         name={'SuccessStoryPageScreen'}
  //         component={SuccessStoryPageScreen}
  //       />
  //       <Stack.Screen
  //         name={'SuccessStoryEditInformationScreen'}
  //         component={SuccessStoryEditInformationScreen}
  //       />
  //       <Stack.Screen
  //         name="DatingCreatingProfile"
  //         component={DatingCreatingProfile}
  //       />
  //       `
  //       <Stack.Screen
  //         name={'AddDatingPersonalInfo'}
  //         component={AddDatingPersonalInfo}
  //       />
  //       <Stack.Screen
  //         name={'DatingPartnerPreferenceScreen'}
  //         component={DatingPartnerPreferenceScreen}
  //       />
  //       <Stack.Screen
  //         name={'DatingEditProfileScreen'}
  //         component={DatingEditProfileScreen}
  //       />
  //       <Stack.Screen name={'QRCodeScreen'} component={QRCodeScreen} />
  //       <Stack.Screen name={'Message'} component={Message} />
  //     </Stack.Navigator>
  //   );
  // };

  const HomeStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={'HomeTabs'}>
        <Stack.Screen
          name="AddSetStoryImageComponent"
          component={AddSetStoryImageComponent}
        />

        <Stack.Screen
          name="ViewUserStatusScreen"
          component={ViewUserStatusScreen}
        />
        <Stack.Screen name="ViewStatusScreen" component={ViewStatusScreen} />
        <Stack.Screen name="NewAddStoryScreen" component={NewAddStoryScreen} />

        <Stack.Screen name="DemoCode" component={DemoCode} />

        <Stack.Screen name="Abc" component={Abc} />
        <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
        <Stack.Screen name={'DatingHomeScreen'} component={DatingHomeScreen} />

        <Stack.Screen
          name={'DatingExploreScreen'}
          component={DatingExploreScreen}
        />
        <Stack.Screen name={'HomeTabs'} component={HomeTabs} />
        <Stack.Screen name={'ChatUserScreen'} component={ChatUserScreen} />
        <Stack.Screen
          name={'DemoPractiveCodeScreen'}
          component={DemoPractiveCodeScreen}
        />
        <Stack.Screen
          name="CreatingProfileScreen"
          component={CreatingProfileScreen}
        />
        <Stack.Screen
          name={'GeneralInformationScreen'}
          component={AddPersonalInfo}
        />
        <Stack.Screen
          name={'SetProfilePictureScreen'}
          component={SetProfilePictureScreen}
        />
        <Stack.Screen
          name={'SelectImageScreen'}
          component={SelectImageScreen}
        />
        <Stack.Screen
          name={'AddProfilePictureScreen'}
          component={AddProfilePictureScreen}
        />
        <Stack.Screen
          name={'PartnerPreferencesScreen'}
          component={PartnerPreferencesScreen}
        />
        <Stack.Screen
          name={'UserDetailsScreen'}
          component={UserDetailsScreen}
        />
        <Stack.Screen
          name={'ConnectToWebScreen'}
          component={ConnectToWebScreen}
        />
        <Stack.Screen
          name={'SuccessStoryPageScreen'}
          component={SuccessStoryPageScreen}
        />
        <Stack.Screen
          name={'SuccessStoryEditInformationScreen'}
          component={SuccessStoryEditInformationScreen}
        />
        <Stack.Screen
          name="DatingCreatingProfile"
          component={DatingCreatingProfile}
        />
        <Stack.Screen
          name="AddDatingPersonalInfo"
          component={AddDatingPersonalInfo}
        />
        <Stack.Screen
          name="DatingPartnerPreferenceScreen"
          component={DatingPartnerPreferenceScreen}
        />
        <Stack.Screen
          name="DatingEditProfileScreen"
          component={DatingEditProfileScreen}
        />
        <Stack.Screen name={'QRCodeScreen'} component={QRCodeScreen} />
        <Stack.Screen name={'Message'} component={Message} />
        <Stack.Screen
          name={'UserUploadImageFullScreen'}
          component={UserUploadImageFullScreen}
        />
      </Stack.Navigator>
    );
  };

  const HomeTabs = ({route}) => {
    console.log(' === HomeTabs ===> ', appType);
    // const {colors} = useTheme();
    const getIconStyle = isFocused => {
      return {
        width: hp(17.76),
        height: hp(20),
        tintColor: isFocused ? 'white' : '#120FBA',
        resizeMode: 'contain',
      };
    };

    const getDatingIconStyle = isFocused => {
      return {
        width: hp(24),
        height: hp(20),
        tintColor: isFocused ? 'white' : '#120FBA',
        resizeMode: 'contain',
      };
    };

    const getLabelStyle = isFocused => {
      return {
        color: isFocused ? 'white' : 'black',
      };
    };

    return (
      <Tab.Navigator
        tabBarOptions={{
          keyboardHidesTabBar: true,
        }}
        screenOptions={{
          tabBarStyle: style.bottomTabNavigationContainer,
        }}>
        <Tab.Screen
          name="Home"
          component={appType === 'dating' ? DatingHomeScreen : HomeScreen}
          // initialParams={{selectedBox: selectedBox}}
          options={{
            tabBarIcon: ({color, size, focused}) => (
              <Image
                source={
                  appType === 'dating' ? icons.swipe_icon : icons.homeIcon
                }
                // style={getIconStyle(focused)}
                style={
                  appType === 'dating'
                    ? getDatingIconStyle(focused)
                    : getIconStyle(focused)
                } // Default style for home icon
              />
            ),
            tabBarLabel: ({focused}) => (
              <Text style={[getLabelStyle(focused), style.bottomTabTextStyle]}>
                {appType === 'dating' ? 'Swipe' : 'Home'}
              </Text>
            ),
            tabBarButton: props => <CustomTabBarButton {...props} />,
            headerShown: false,
          }}
        />

        {/*<Tab.Screen*/}
        {/*  name="Home"*/}
        {/*  component={appType === 'dating' ? ChatScreen : HomeScreen}*/}
        {/*  // initialParams={{selectedBox: selectedBox}}*/}
        {/*  options={{*/}
        {/*    tabBarIcon: ({color, size, focused}) => (*/}
        {/*      <Image source={icons.homeIcon} style={getIconStyle(focused)} />*/}
        {/*    ),*/}
        {/*    tabBarLabel: ({focused}) => (*/}
        {/*      <Text style={[getLabelStyle(focused), style.bottomTabTextStyle]}>*/}
        {/*        Home*/}
        {/*      </Text>*/}
        {/*    ),*/}
        {/*    tabBarButton: props => <CustomTabBarButton {...props} />,*/}
        {/*    headerShown: false,*/}
        {/*  }}*/}
        {/*/>*/}

        <Tab.Screen
          name="Matches"
          component={appType === 'dating' ? DatingExploreScreen : MatchesScreen}
          // component={appType === 'dating' ? DatingHomeScreen : HomeScreen}
          options={{
            tabBarIcon: ({color, size, focused}) => (
              <Image
                source={icons.matchesIcon}
                style={[getIconStyle(focused), style.matchesIconStyle]}
              />
            ),
            tabBarLabel: ({focused}) => (
              <Text style={[getLabelStyle(focused), style.bottomTabTextStyle]}>
                Matches
              </Text>
            ),
            tabBarButton: props => <CustomTabBarButton {...props} />,
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarIcon: ({color, size, focused}) => (
              <Image
                source={icons.chatIcon}
                style={[getIconStyle(focused), style.chatIconStyle]}
              />
            ),
            tabBarLabel: ({focused}) => (
              <Text style={[getLabelStyle(focused), style.bottomTabTextStyle]}>
                Chat
              </Text>
            ),
            tabBarButton: props => <CustomTabBarButton {...props} />,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Alerts"
          component={AlertsScreen}
          options={{
            tabBarIcon: ({color, size, focused}) => (
              <Image
                source={icons.alertsIcon}
                style={[getIconStyle(focused), style.alertIconStyle]}
              />
            ),
            tabBarLabel: ({focused}) => (
              <Text style={[getLabelStyle(focused), style.bottomTabTextStyle]}>
                Alerts
              </Text>
            ),
            tabBarButton: props => <CustomTabBarButton {...props} />,
            headerShown: false,
          }}
        />
        <Tab.Screen
          name="Upgrader"
          component={UpgradeScreen}
          options={{
            tabBarIcon: ({color, size, focused}) => (
              <Image
                source={icons.upgradeIcon}
                style={[getIconStyle(focused), style.upgradeIconStyle]}
              />
            ),
            tabBarLabel: ({focused}) => (
              <Text style={[getLabelStyle(focused), style.bottomTabTextStyle]}>
                Upgrader
              </Text>
            ),
            tabBarButton: props => <CustomTabBarButton {...props} />,
            headerShown: false,
          }}
        />

        <Tab.Screen
          name="UserDetailsScreen"
          component={UserDetailsScreen}
          initialParams={
            {
              // selectedBox: selectedBox,
              // userData: route.params?.userData,
            }
          }
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="MyProfileScreen"
          component={MyProfileScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="DatingProfileScreen"
          component={DatingProfileScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        {/*<Tab.Screen*/}
        {/*  name="AccountsScreen"*/}
        {/*  component={AccountsScreen}*/}
        {/*  options={{tabBarButton: () => null, headerShown: false}}*/}
        {/*/>*/}

        {/*<Tab.Screen*/}
        {/*  name="CredentialsScreen"*/}
        {/*  component={CredentialsScreen}*/}
        {/*  options={{tabBarButton: () => null, headerShown: false}}*/}
        {/*/>*/}

        {/*<Tab.Screen*/}
        {/*  name="HideDeleteProfileScreen"*/}
        {/*  component={HideDeleteProfileScreen}*/}
        {/*  options={{tabBarButton: () => null, headerShown: false}}*/}
        {/*/>*/}
        {/*<Tab.Screen*/}
        {/*  name="PrivacyScreen"*/}
        {/*  component={PrivacyScreen}*/}
        {/*  options={{tabBarButton: () => null, headerShown: false}}*/}
        {/*/>*/}

        <Tab.Screen
          name="AccountsScreen"
          component={ExtraScreens}
          options={{tabBarButton: () => null, headerShown: false}}
        />
      </Tab.Navigator>
    );
  };

  return useMemo(
    () => (
      <NavigationContainer>
        {isLoggedIn ? <HomeStack /> : <AuthStack />}
      </NavigationContainer>
    ),
    [isLoggedIn],
  );
};

export default MainNavigator;
