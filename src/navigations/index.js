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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ExtrasStack = createNativeStackNavigator();

const MainNavigator = () => {
  const [isDatingSelected, setIsDatingSelected] = useState(false);

  const {isLoggedIn} = useSelector(state => state.auth);

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
        {/*<Stack.Screen name="DemoCode" component={DemoCode} />*/}
        <Stack.Screen name={'HomeTabs'} component={HomeTabs} />
        <Stack.Screen name={'ChatUserScreen'} component={ChatUserScreen} />
        <Stack.Screen
          name={'DemoPractiveCodeScreen'}
          component={DemoPractiveCodeScreen}
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

        <Stack.Screen name={'Message'} component={Message} />
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
          tabBarStyle: style.bottomTabNavigationContainer,
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
              <Text style={[getLabelStyle(focused), style.bottomTabTextStyle]}>
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
                  style={[getIconStyle(focused), style.matchesIconStyle]}
                />
              ),
              tabBarLabel: ({focused}) => (
                <Text
                  style={[getLabelStyle(focused), style.bottomTabTextStyle]}>
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
                  style={[getIconStyle(focused), style.matchesIconStyle]}
                />
              ),
              tabBarLabel: ({focused}) => (
                <Text
                  style={[getLabelStyle(focused), style.bottomTabTextStyle]}>
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
          name="AccountsScreen"
          component={AccountsScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="CredentialsScreen"
          component={CredentialsScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="HideDeleteProfileScreen"
          component={HideDeleteProfileScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />
        <Tab.Screen
          name="PrivacyScreen"
          component={PrivacyScreen}
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
