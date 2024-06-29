import React, {useEffect, useMemo, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer, useTheme} from '@react-navigation/native';
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
import {MyContext} from '../utils/Provider';
import {useSelector} from 'react-redux';
import SetProfilePictureScreen from '../screen/setProfilePictureScreen';
import SelectImageScreen from '../screen/selectImageScreen';
import AddProfilePictureScreen from '../screen/addProfilePictureScreen';
import PartnerPreferencesScreen from '../screen/partnerPreferencesScreen';
import UserDetailsScreen from '../screen/userDetailsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ExtrasStack = createNativeStackNavigator();

const MainNavigator = () => {
  const [isDatingSelected, setIsDatingSelected] = useState(false);

  const {isLoggedIn} = useSelector(state => state.auth);

  const AuthStack = () => (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="MainScreenDemo">
      <Stack.Screen name="MainScreenDemo" component={MainScreenDemo} />
      <Stack.Screen
        name="DemoPractiveCodeScreen"
        component={DemoPractiveCodeScreen}
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
      <Stack.Screen
        name="GeneralInformationScreen"
        component={AddPersonalInfo}
      />
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

  const HomeStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={'HomeTabs'}>
        <Stack.Screen name={'ChatUserScreen'} component={ChatUserScreen} />
        {/*<Stack.Screen*/}
        {/*  name={'DemoPractiveCodeScreen'}*/}
        {/*  component={DemoPractiveCodeScreen}*/}
        {/*/>*/}

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

        <Stack.Screen name={'HomeTabs'} component={HomeTabs} />
      </Stack.Navigator>
    );
  };

  const HomeTabs = ({route}) => {
    // const {colors} = useTheme();
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
        tabBarOptions={{
          keyboardHidesTabBar: true,
        }}
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
          // initialParams={{selectedBox: selectedBox}}
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
        {!isDatingSelected ? (
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
        ) : (
          <Tab.Screen
            name="Explore"
            component={ExploreScreen}
            // initialParams={{selectedBox}}
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
                  Explore
                </Text>
              ),
              tabBarButton: props => <CustomTabBarButton {...props} />,
              headerShown: false,
            }}
          />
        )}

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

        {/*<Tab.Screen*/}
        {/*  name="ChatUserScreen"*/}
        {/*  component={UsersChatsScreen}*/}
        {/*  initialParams={*/}
        {/*    {*/}
        {/*      // selectedBox: selectedBox,*/}
        {/*      // userData: route.params?.userData,*/}
        {/*    }*/}
        {/*  }*/}
        {/*  options={{tabBarButton: () => null, headerShown: false}}*/}
        {/*/>*/}
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
