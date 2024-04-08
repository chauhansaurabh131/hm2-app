import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, useTheme} from '@react-navigation/native';
import {Image, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GeneralInformationScreen from '../screen/generalInformationScreen';
import AddressDetailsScreen from '../screen/addressDetailsScreen';
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

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const MainNavigator = () => {
  const AuthStack = () => (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="MainScreenDemo">
      <Stack.Screen
        name="MainScreenDemo"
        component={MainScreenDemo}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="GeneralInformation"
        component={GeneralInformationScreen}
      />
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
        name="GeneralInformationScreen"
        component={AddPersonalInfo}
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
                style={[
                  getIconStyle(focused),
                  {width: hp(22.5), height: hp(20)},
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
                style={[
                  getIconStyle(focused),
                  {width: hp(20.5), height: hp(20)},
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
                style={[
                  getIconStyle(focused),
                  {width: hp(16.1), height: hp(20)},
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
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="AuthStack">
        <Stack.Screen name="AuthStack" component={AuthStack} />
        <Stack.Screen name="HomeTabs" component={HomeTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
