import React from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer, useTheme} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import 'react-native-gesture-handler';
import {Image, LogBox, Text, TouchableOpacity} from 'react-native';
import MainScreen from './src/screen/mainScreen';
import RegistrationScreen from './src/screen/registrationScreen';
import LoginScreen from './src/screen/loginScreen';
import VerificationScreen from './src/screen/verificationScreen';
import SetPasswordScreen from './src/screen/setPasswordScreen';
import NumberRegistrationScreen from './src/screen/numberRegistrationScreen';
import TextInputWithDropDownComponent from './src/components/textInputWithDropDownComponent';
import DemoScreen from './src/screen/demoScreen';
import NumberRegistrationTextInput from './src/components/numberRegistrationTextInput';
import StartExploreScreen from './src/screen/startExploreScreen';
import HomeScreen from './src/screen/HomeScreen';
import MatchesScreen from './src/screen/matchesScreen';
import ChatScreen from './src/screen/chatScreen';
import AlertsScreen from './src/screen/alertsScreen';
import UpgradeScreen from './src/screen/upgradeScreen';
import {icons} from './src/assets';
import {fontSize, hp, isIOS} from './src/utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import AddPersonalInfo from './src/screen/addPersonalInfo';
import SetProfilePictureScreen from './src/screen/setProfilePictureScreen';
import AccountsScreen from './src/screen/accountsScreen';
import CredentialsScreen from './src/screen/CredentialsScreen';
import HideDeleteProfileScreen from './src/screen/hideDeleteProfileScreen';
import PrivacyScreen from './src/screen/privacyScreen';
import MainScreenDemo from './src/screen/mainScreenDemo';
import Xyz from './src/screen/xyz';
import EmailSmsAlertScreen from './src/screen/emailSmsAlertScreen';
import UserDetailsScreen from './src/screen/userDetailsScreen';

LogBox.ignoreAllLogs();

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const ExtraStack = createStackNavigator();
const ExtrasStack = createStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator initialRouteName="StartExploreScreen">
      {/*<Stack.Screen*/}
      {/*  name="MainScreen"*/}
      {/*  component={MainScreen}*/}
      {/*  options={{headerShown: false}}*/}
      {/*/>*/}
      <Stack.Screen
        name="MainScreenDemo"
        component={MainScreenDemo}
        options={{headerShown: false}}
      />

      <Stack.Screen name="Xyz" component={Xyz} options={{headerShown: false}} />

      <Stack.Screen
        name="RegistrationScreen"
        component={RegistrationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="VerificationScreen"
        component={VerificationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="SetPasswordScreen"
        component={SetPasswordScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NumberRegistrationScreen"
        component={NumberRegistrationScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        // name="GeneralInformationScreen"
        name="GeneralInformationScreen"
        component={AddPersonalInfo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="TextInputWithDropDownComponent"
        component={TextInputWithDropDownComponent}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="DemoScreen"
        component={DemoScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="NumberRegistrationTextInput"
        component={NumberRegistrationTextInput}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="StartExploreScreen"
        component={StartExploreScreen}
        options={{headerShown: false}}
      />

      <Stack.Screen
        name="SetProfilePictureScreen"
        component={SetProfilePictureScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
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

      <ExtraStack.Screen
        name="HomeTabs"
        component={HomeTabs}
        options={{headerShown: false}}
      />

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
    </ExtraStack.Navigator>
  );
};

const ExtrasScreens = () => {
  return (
    <ExtrasStack.Navigator>
      <ExtrasStack.Screen
        name="UserDetailsScreen"
        component={UserDetailsScreen}
        options={{headerShown: false}}
      />
    </ExtrasStack.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="MainStack"
          component={MainStack}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="HomeTabs"
          component={HomeTabs}
          // name="Upgrader"
          // component={UpgradeScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

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

const HomeTabs = () => {
  const {colors} = useTheme();

  const getIconStyle = isFocused => {
    return {
      width: hp(17.76),
      height: hp(20),
      tintColor: isFocused ? 'white' : '#120FBA',
    };
  };

  const getLabelStyle = isFocused => {
    return {
      color: isFocused ? 'white' : 'black',
    };
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: isIOS ? hp(100) : hp(80),
          borderTopRightRadius: 10,
          borderTopLeftRadius: 10,
        },
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <Image source={icons.homeIcon} style={getIconStyle(focused)} />
          ),
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                getLabelStyle(focused),
                {
                  fontSize: fontSize(10),
                  lineHeight: hp(15),
                  fontWeight: '500',
                },
              ]}>
              Home
            </Text>
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Matches"
        component={MatchesScreen}
        options={{
          tabBarIcon: ({color, size, focused}) => (
            <Image
              source={icons.matchesIcon}
              style={[getIconStyle(focused), {width: hp(22.5), height: hp(20)}]}
            />
          ),
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                getLabelStyle(focused),
                {
                  fontSize: fontSize(10),
                  lineHeight: hp(15),
                  fontWeight: '500',
                },
              ]}>
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
              style={[getIconStyle(focused), {width: hp(20.5), height: hp(20)}]}
            />
          ),
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                getLabelStyle(focused),
                {
                  fontSize: fontSize(10),
                  lineHeight: hp(15),
                  fontWeight: '500',
                },
              ]}>
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
              style={[getIconStyle(focused), {width: hp(16.1), height: hp(20)}]}
            />
          ),
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                getLabelStyle(focused),
                {
                  fontSize: fontSize(10),
                  lineHeight: hp(15),
                  fontWeight: '500',
                },
              ]}>
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
              style={[
                getIconStyle(focused),
                {width: hp(20.98), height: hp(20)},
              ]}
            />
          ),
          tabBarLabel: ({focused}) => (
            <Text
              style={[
                getLabelStyle(focused),
                {
                  fontSize: fontSize(10),
                  lineHeight: hp(15),
                  fontWeight: '500',
                },
              ]}>
              Upgrader
            </Text>
          ),
          tabBarButton: props => <CustomTabBarButton {...props} />,
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="AccountsScreen"
        component={ExtraScreens}
        options={{tabBarButton: () => null, headerShown: false}}
      />
      <Tab.Screen
        name="UserDetailsScreen"
        component={ExtrasScreens}
        options={{tabBarButton: () => null, headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default App;
