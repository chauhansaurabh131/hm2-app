import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {Alert, Image, Linking, Text, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GeneralInformationScreen from '../screen/generalInformationScreen';
import VerificationScreen from '../screen/verificationScreen';
import SetPasswordScreen from '../screen/setPasswordScreen';
import NumberRegistrationScreen from '../screen/numberRegistrationScreen';
import AddPersonalInfo from '../screen/addPersonalInfo';
import NumberRegistrationTextInput from '../components/numberRegistrationTextInput';
import HomeScreen from '../screen/HomeScreen';
import MatchesScreen from '../screen/matchesScreen';
import ChatScreen from '../screen/chatScreen';
import AlertsScreen from '../screen/alertsScreen';
import UpgradeScreen from '../screen/upgradeScreen';
import {icons} from '../assets';
import {fontSize, hp, isIOS} from '../utils/helpers';
import ExploreScreen from '../screen/exploreScreen';
import DemoPractiveCodeScreen from '../screen/demoPractiveCodeScreen';
import ChatUserScreen from '../screen/chatUserScreen';
import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../actions/authActions';
import {store} from '../reducer/store/index';
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
import ConnectToWebScreen from '../screen/connectToWebScreen';
import QRCodeScreen from '../screen/QRCodeScreen';
import EmailSmsAlertScreen from '../screen/emailSmsAlertScreen';
import {createStackNavigator} from '@react-navigation/stack';
import PlanScreen from '../screen/planScreen';
import KycDetailsScreen from '../screen/kycDetailsScreen';
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
import UserProfileUploadImageFullScreen from '../screen/userProfileUploadImageFullScreen';
import UserEditProfileScreen from '../screen/userEditProfileScreen';
import DatingUserDetailsScreen from '../screen/datingAllScreen/datingUserDetailsScreen';
import VerifyIdentityScreen from '../screen/verifyIdentityScreen';
import SearchFilterScreen from '../screen/searchFilterScreen';
import SearchUserDataScreen from '../screen/searchUserDataScreen';
import NewUserDetailsScreen from '../screen/newUserDetailsScreen';
import RemainingDataUiScreen from '../screen/editRemainingFillUpData/remainingDataUiScreen';
import EditGeneralScreen from '../screen/editRemainingFillUpData/editGeneralScreen';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import EditLocationScreen from '../screen/editRemainingFillUpData/editLocationScreen';
import EditContactScreen from '../screen/editRemainingFillUpData/editContactScreen';
import EditEducationScreen from '../screen/editRemainingFillUpData/editEducationScreen';
import EditProfessionalScreen from '../screen/editRemainingFillUpData/editProfessionalScreen';
import EditHobbiesScreen from '../screen/editRemainingFillUpData/editHobbiesScreen';
import EditPartnerPreferencesScreen from '../screen/editRemainingFillUpData/editPartnerPreferencesScreen';
import ChangeNameRequestScreen from '../screen/changeNameRequestScreen';
import MeetNewFriendsScreen from '../screen/datingExploreAllScreen/meetNewFriendsScreen';
import DatingSearchFilterScreen from '../screen/datingAllScreen/datingSearchFilterScreen';
import TwoFactorAuthenticationScreen from '../screen/twoFactorAuthenticationScreen';
import StepForAuthenticationOnScreen from '../screen/stepForAuthenticationOnScreen';
import EmailNumberAuthenticationNumber from '../screen/emailNumberAuthenticationNumber';
import LoginAuthenticationCodeScreen from '../screen/loginAuthenticationCodeScreen';
import AuthenticationEnterOtpScreen from '../screen/authenticationEnterOtpScreen';
import BottomSheetPrivacySettingScreen from '../screen/bottomSheetPrivacySettingScreen';
import DatingBlockAllScreen from '../screen/datingAllScreen/datingBlockAllScreen';
import PlanCancelScreen from '../screen/planCancelScreen';
import DatingUpgradeScreen from '../screen/datingUpgradeScreen';
import ServiceHomeScreen from '../screen/serviceHomeScreen';
import ServicesProfileScreen from '../screen/servicesProfileScreen';

import LongTermBasicDetailScreen from '../screen/longTermBasicDetailScreen';
import LongTermPartnerPreferenceScreen from '../screen/longTermPartnerPreferenceScreen';
import DatingBasicDetailScreen from '../screen/datingBasicDetailScreen';
import DatingNewPartnerPreferenceScreen from '../screen/datingNewPartnerPreferenceScreen';
import MyNewProfileScreen from '../screen/myNewProfileScreen';
import AboutEditScreen from '../screen/myProfileEditFormAll/aboutEditScreen';
import ModifyBasicInfoScreen from '../screen/myProfileEditFormAll/modifyBasicInfoScreen';
import ModifyLocationScreen from '../screen/myProfileEditFormAll/ModifyLocationScreen';
import ModifyContactScreen from '../screen/myProfileEditFormAll/modifyContactScreen';
import ModifyEducationScreen from '../screen/myProfileEditFormAll/modifyEducationScreen';
import ModifyOccupationScreen from '../screen/myProfileEditFormAll/modifyOccupationScreen';
import ModifyHobbiesAndInterestScreen from '../screen/myProfileEditFormAll/modifyHobbiesAndInterestScreen';
import ModifyPartnerPreferenceScreen from '../screen/myProfileEditFormAll/modifyPartnerPreferenceScreen';
import UserProfileDetailsScreen from '../screen/userProfileDetailsScreen';
import TestDemoScreen from '../screen/testDemoScreen';
import VendorSignUpScreen from '../screen/vendorSignUpScreen';
import {colors} from '../utils/colors';
import VendorSearchFilterScreen from '../screen/vendorSearchFilterScreen';
import VendorSavedScreen from '../screen/vendorSavedScreen';
import VendorAlertScreen from '../screen/vendorAlertScreen';
import LongTermUserDataScreen from '../screen/longTermUserDataScreen';
import SignInOrLogInComponent from '../components/signInOrLogInComponent';
import DatingProfileScreens from '../screen/datingAllScreen/datingProfileScreens';
import DatingPurposeScreen from '../screen/myProfileEditFormAll/DatingPurposeScreen';
import ModifyDatingBasicScreen from '../screen/myProfileEditFormAll/modifyDatingBasicScreen';
import ModifyDatingProfessionalScreen from '../screen/myProfileEditFormAll/modifyDatingProfessionalScreen';
import ModifyDatingHobbiesScreen from '../screen/myProfileEditFormAll/modifyDatingHobbiesScreen';
import ModifyDatingPartnerPreferenceScreen from '../screen/myProfileEditFormAll/modifyDatingPartnerPreferenceScreen';
import DatingUserProfileScreen from '../screen/datingAllScreen/datingUserProfileScreen';
import VendorLoginScreen from '../screen/vendorLoginScreen';
import VendorBasicDetailScreen from '../screen/vendorBasicDetailScreen';
import VendorOtpVerificationScreen from '../screen/vendorOtpVerificationScreen';
import VendorSetPasswordScreen from '../screen/vendorSetPasswordScreen';
import VendorProfileScreen from '../screen/vendorProfileScreen';
import VendorImageViewScreen from '../screen/vendorImageViewScreen';
import VendorModifyDetailScreen from '../screen/vendorModifyDetailScreen';
import VendorSocialMediaLinkScreen from '../screen/vendorSocialMediaLinkScreen';
import VendorModifyServicesScreen from '../screen/vendorModifyServicesScreen';
import VendorAccountSettingScreen from '../screen/VendorAccountSettingScreen';
import VendorRequestForAccessScreen from '../screen/vendorRequestForAccessScreen';
import VendorClaimYourBusinessScreen from '../screen/vendorClaimYourBusinessScreen';
import VendorRequestSubmitScreen from '../screen/vendorRequestSubmitScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const ExtraStack = createStackNavigator();
const ServiceStack = createNativeStackNavigator();

export const navigationRef = React.createRef();

// const linking = {
//   prefixes: ['happymilan://'],
//   config: {screens: {NewUserDetailsScreen: 'user'}},
// };

const MainNavigator = () => {
  const dispatch = useDispatch();
  const {isLoggedIn, user} = useSelector(state => state.auth);

  console.log(' === isLoggedIn ===> ', isLoggedIn);

  const appType = user?.user?.appUsesType;

  console.log(' === appType ===> ', appType);

  const isReadyRef = useRef(false);

  useEffect(() => {
    const handleDeepLink = ({url}) => {
      console.log('🔗 Deep link opened:', url);
      if (!url) {
        return;
      }
      try {
        let userId = null;
        let sharedUserAppUsesType = null;
        let sharedUserRole = null;

        if (url.includes('?')) {
          const queryString = url.split('?')[1];
          const queryPairs = queryString.split('&');
          queryPairs.forEach(pair => {
            const [key, value] = pair.split('=');
            const decodedValue = decodeURIComponent(value || '');
            if (key === 'appUsesType' || key === 'appType') {
              sharedUserAppUsesType = decodedValue;
            }
            if (key === 'role') {
              sharedUserRole = decodedValue;
            }
            if (key === 'userId' || key === 'id') {
              userId = decodedValue;
            }
          });
        }

        if (!userId) {
          const cleanUrl = url.split('#')[0].split('?')[0];
          const parts = cleanUrl.split('/');
          const lastPart = parts[parts.length - 1];
          if (
            lastPart &&
            lastPart !== 'share' &&
            lastPart !== 'openApp' &&
            lastPart.length > 5
          ) {
            userId = lastPart;
          }
        }

        console.log('🔗 Extracted deep link params:', {
          userId,
          sharedUserAppUsesType,
          sharedUserRole,
        });

        if (!userId) {
          return;
        }

        // Get LIVE user state directly from Redux store to avoid stale closure / hydration delays
        const liveUser = store.getState()?.auth?.user;
        const currentUserAppUsesType =
          liveUser?.user?.appUsesType ||
          liveUser?.appUsesType ||
          user?.user?.appUsesType;

        console.log(
          '🔗 Current logged-in user appUsesType:',
          currentUserAppUsesType,
        );

        const normalizeMode = mode => {
          if (!mode) {
            return null;
          }
          const m = mode.toLowerCase();
          if (m === 'dating') {
            return 'dating';
          }
          if (m === 'vendor') {
            return 'vendor';
          }
          if (m === 'marriage' || m === 'longterm' || m === 'matrimony') {
            return 'marriage';
          }
          return m;
        };

        const normalizedShared =
          normalizeMode(sharedUserAppUsesType) || 'marriage';
        const normalizedCurrent =
          normalizeMode(currentUserAppUsesType) || 'marriage';

        console.log('🔗 Normalized mode comparison:', {
          normalizedShared,
          normalizedCurrent,
        });

        // Rule 1: Vendor Profile -> Allow ANY user to view
        if (normalizedShared === 'vendor' || sharedUserRole === 'vendor') {
          navigationRef.current?.navigate('ServicesProfileScreen', {
            vendorId: userId,
            id: userId,
          });
          return;
        }

        // Rule 2: Matching Mode (Marriage/Longterm -> Marriage/Longterm OR Dating -> Dating)
        if (normalizedShared === normalizedCurrent) {
          const targetScreen =
            normalizedCurrent === 'dating'
              ? 'DatingUserProfileScreen'
              : 'UserProfileDetailsScreen';
          navigationRef.current?.navigate(targetScreen, {
            userIds: userId,
            matchesUserData: {id: userId, _id: userId},
            userData: {id: userId, _id: userId},
          });
          return;
        }

        // Rule 3: Mismatching Mode (Marriage/Longterm link opened by Dating user or vice versa)
        const targetModeName =
          normalizedShared === 'dating' ? 'Dating' : 'Longterm';

        Alert.alert(
          'Mode Mismatch',
          `This shared link belongs to a ${targetModeName} profile. To view this profile, please first create or switch to a ${targetModeName} account.`,
          [
            {
              text: `Switch / Create ${targetModeName} Account`,
              onPress: () => {
                dispatch(logout());
              },
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ],
        );
      } catch (err) {
        console.log('URL parse error:', err);
      }
    };

    const init = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        // Wait until navigation is ready
        const checkReady = setInterval(() => {
          if (isReadyRef.current && navigationRef.current) {
            clearInterval(checkReady);
            handleDeepLink({url: initialUrl});
          }
        }, 300);
      }
    };
    init();

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, []);

  const AuthStack = () => (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="TestDemoScreen">
      {/*initialRouteName="TestDemoScreen">*/}
      <Stack.Screen name="DemoCode" component={DemoCode} />

      <Stack.Screen name="TestDemoScreen" component={TestDemoScreen} />

      <Stack.Screen name="VendorLoginScreen" component={VendorLoginScreen} />

      {/*<Stack.Screen name="ServiceTabs" component={ServiceTabs} />*/}
      <Stack.Screen name="ServiceTabs" component={ServiceStackScreen} />

      {/*<Stack.Screen*/}
      {/*  name="ServicesProfileScreen"*/}
      {/*  component={ServicesProfileScreen}*/}
      {/*/>*/}

      <Stack.Screen name="NewMainScreen" component={NewMainScreen} />
      <Stack.Screen name="NewSignUpScreen" component={NewSignUpScreen} />
      <Stack.Screen name="NewLogInScreen" component={NewLogInScreen} />
      <Stack.Screen name="VendorSignUpScreen" component={VendorSignUpScreen} />

      <Stack.Screen
        name="VerifyEmailOtpScreen"
        component={VerifyEmailOtpScreen}
      />

      <Stack.Screen
        name="VendorOtpVerificationScreen"
        component={VendorOtpVerificationScreen}
      />

      <Stack.Screen
        name="LoginAuthenticationCodeScreen"
        component={LoginAuthenticationCodeScreen}
      />

      <Stack.Screen
        name="NewSetPasswordScreen"
        component={NewSetPasswordScreen}
      />

      <Stack.Screen
        name="VendorSetPasswordScreen"
        component={VendorSetPasswordScreen}
      />

      <Stack.Screen
        name="NewStartExploreScreen"
        component={NewStartExploreScreen}
      />

      <Stack.Screen
        name="LongTermBasicDetailScreen"
        component={LongTermBasicDetailScreen}
      />

      <Stack.Screen
        name="LongTermPartnerPreferenceScreen"
        component={LongTermPartnerPreferenceScreen}
      />

      <Stack.Screen
        name="DatingBasicDetailScreen"
        component={DatingBasicDetailScreen}
      />

      <Stack.Screen
        name="DatingNewPartnerPreferenceScreen"
        component={DatingNewPartnerPreferenceScreen}
      />

      <Stack.Screen
        name="VendorBasicDetailScreen"
        component={VendorBasicDetailScreen}
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
      <Stack.Screen name="VerificationScreen" component={VerificationScreen} />
      <Stack.Screen name="SetPasswordScreen" component={SetPasswordScreen} />
      <Stack.Screen
        name="NumberRegistrationScreen"
        component={NumberRegistrationScreen}
      />

      <Stack.Screen
        name="NumberRegistrationTextInput"
        component={NumberRegistrationTextInput}
      />
    </Stack.Navigator>
  );

  const ServiceStackScreen = () => {
    return (
      <ServiceStack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {/* TABS */}
        <ServiceStack.Screen name="ServiceTabsMain" component={ServiceTabs} />

        {/* FILTER */}
        <ServiceStack.Screen
          name="VendorSearchFilterScreen"
          component={VendorSearchFilterScreen}
        />

        <Tab.Screen name="Profile" component={VendorProfileScreen} />

        {/* PROFILE */}
        <ServiceStack.Screen
          name="ServicesProfileScreen"
          component={ServicesProfileScreen}
        />

        <ServiceStack.Screen
          name="VendorRequestForAccessScreen"
          component={VendorRequestForAccessScreen}
        />

        <ServiceStack.Screen
          name="VendorClaimYourBusinessScreen"
          component={VendorClaimYourBusinessScreen}
        />

        <ServiceStack.Screen
          name="VendorRequestSubmitScreen"
          component={VendorRequestSubmitScreen}
        />

        <ServiceStack.Screen
          name="VendorImageViewScreen"
          component={VendorImageViewScreen}
        />

        <ServiceStack.Screen
          name="VendorModifyDetailScreen"
          component={VendorModifyDetailScreen}
        />

        <ServiceStack.Screen
          name="VendorSocialMediaLinkScreen"
          component={VendorSocialMediaLinkScreen}
        />

        <ServiceStack.Screen
          name="VendorModifyServicesScreen"
          component={VendorModifyServicesScreen}
        />

        <ServiceStack.Screen
          name="VendorAccountSettingScreen"
          component={VendorAccountSettingScreen}
        />

        <ServiceStack.Screen
          name="CredentialsScreen"
          component={CredentialsScreen}
        />

        <ServiceStack.Screen
          name="KycDetailsScreen"
          component={KycDetailsScreen}
        />
      </ServiceStack.Navigator>
    );
  };

  const ServiceTabs = () => {
    const [loginModal, setSetLoginModal] = useState(false);
    const getIconStyle = (focused, width, height, top = 0, left = 0) => {
      return {
        width,
        height,
        tintColor: focused ? '#7148E4' : '#8E8E8E',
        resizeMode: 'contain',
        top,
        left,
      };
    };

    const getLabelStyle = focused => {
      return {
        color: focused ? '#7148E4' : '#8E8E8E',
        fontSize: fontSize(10),
        top: -3,
      };
    };

    return (
      <>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,

            tabBarStyle: {
              height: hp(70),
              paddingTop: hp(10),
              paddingBottom: hp(10),
              backgroundColor: colors.white,

              borderTopWidth: 0,
              elevation: 10,

              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 10,
              shadowOffset: {
                width: 0,
                height: -2,
              },
            },

            tabBarActiveTintColor: '#7148E4',
            tabBarInactiveTintColor: '#8E8E8E',
          }}>
          {/* DISCOVER */}
          <Tab.Screen
            name="Discover"
            component={ServiceHomeScreen}
            options={{
              tabBarIcon: ({focused}) => (
                <Image
                  source={icons.search_icon}
                  style={getIconStyle(
                    focused,
                    hp(18), // width
                    hp(18), // height
                    -2, // top
                    0, // left
                  )}
                />
              ),

              tabBarLabel: ({focused}) => (
                <Text style={getLabelStyle(focused)}>Discover</Text>
              ),
            }}
          />

          {/* SAVED */}
          <Tab.Screen
            name="VendorSavedScreen"
            component={VendorSavedScreen}
            listeners={({navigation}) => ({
              tabPress: e => {
                e.preventDefault();

                // LOGIN CHECK
                if (isLoggedIn) {
                  navigation.navigate('VendorSavedScreen');
                } else {
                  setSetLoginModal(true);
                  // navigation.replace('NewLogInScreen');
                }
              },
            })}
            options={{
              tabBarIcon: ({focused}) => (
                <Image
                  source={icons.heart_like_icon}
                  style={getIconStyle(focused, hp(21), hp(19), -1, 0)}
                />
              ),

              tabBarLabel: ({focused}) => (
                <Text style={getLabelStyle(focused)}>Saved</Text>
              ),
            }}
          />

          {/* ALERTS */}
          <Tab.Screen
            name="VendorAlertScreen"
            component={VendorAlertScreen}
            listeners={({navigation}) => ({
              tabPress: e => {
                e.preventDefault();

                // LOGIN CHECK
                if (isLoggedIn) {
                  navigation.navigate('VendorAlertScreen');
                } else {
                  setSetLoginModal(true);
                }
              },
            })}
            options={{
              tabBarIcon: ({focused}) => (
                <Image
                  source={icons.alertsIcon}
                  style={getIconStyle(focused, hp(15), hp(19), -2, 0)}
                />
              ),

              tabBarLabel: ({focused}) => (
                <Text style={getLabelStyle(focused)}>Alerts</Text>
              ),
            }}
          />

          {/* PROFILE */}
          {/*<Tab.Screen*/}
          {/*  name="Profile"*/}
          {/*  component={ServicesProfileScreen}*/}
          {/*  listeners={({navigation}) => ({*/}
          {/*    tabPress: e => {*/}
          {/*      e.preventDefault();*/}

          {/*      if (isLoggedIn) {*/}
          {/*        navigation.navigate('HomeTabs');*/}
          {/*      } else {*/}
          {/*        // navigation.replace('NewLogInScreen');*/}
          {/*        setSetLoginModal(true);*/}
          {/*      }*/}
          {/*    },*/}
          {/*  })}*/}
          {/*  options={{*/}
          {/*    tabBarIcon: ({focused}) => (*/}
          {/*      <Image*/}
          {/*        source={*/}
          {/*          isLoggedIn*/}
          {/*            ? icons.hm_Logo_Icon // after login*/}
          {/*            : icons.view_profile_icon // before login*/}
          {/*        }*/}
          {/*        style={getIconStyle(focused, hp(18), hp(19), -3, 0)}*/}
          {/*      />*/}
          {/*    ),*/}

          {/*    tabBarLabel: ({focused}) => (*/}
          {/*      <Text style={getLabelStyle(focused)}>Profile</Text>*/}
          {/*    ),*/}
          {/*  }}*/}
          {/*/>*/}

          <Tab.Screen
            name="Profile"
            component={VendorProfileScreen}
            listeners={({navigation}) => ({
              tabPress: e => {
                e.preventDefault();

                if (!isLoggedIn) {
                  setSetLoginModal(true);
                  return;
                }

                // Vendor User
                if (appType === 'vendor') {
                  navigation.navigate('Profile');
                  return;
                }

                // Normal User
                navigation.navigate('HomeTabs');
              },
            })}
            options={{
              tabBarIcon: ({focused}) => (
                <Image
                  source={
                    isLoggedIn && appType === 'vendor'
                      ? icons.view_profile_icon
                      : isLoggedIn
                      ? icons.hm_Logo_Icon
                      : icons.view_profile_icon
                  }
                  style={getIconStyle(focused, hp(18), hp(19), -3, 0)}
                />
              ),

              tabBarLabel: ({focused}) => (
                <Text style={getLabelStyle(focused)}>Profile</Text>
              ),
            }}
          />

          <Tab.Screen
            name="VendorSearchFilterScreen"
            component={VendorSearchFilterScreen}
            options={{
              headerShown: false,

              // HIDE TAB BUTTON
              tabBarButton: () => null,

              // NO LABEL
              tabBarLabel: '',

              // NO ICON
              tabBarIcon: () => null,
            }}
          />

          <Tab.Screen
            name="ServicesProfileScreen"
            component={ServicesProfileScreen}
            options={{
              headerShown: false,

              // HIDE TAB BUTTON
              tabBarButton: () => null,

              // NO LABEL
              tabBarLabel: '',

              // NO ICON
              tabBarIcon: () => null,
            }}
          />
        </Tab.Navigator>

        {/* LOGIN MODAL */}
        <SignInOrLogInComponent
          visible={loginModal}
          onClose={() => setSetLoginModal(false)}
          onSignUp={() => {
            setSetLoginModal(false);

            navigationRef.current?.navigate('NewSignUpScreen');
          }}
          onLogin={() => {
            setSetLoginModal(false);

            navigationRef.current?.navigate('NewLogInScreen');
          }}
        />
      </>
    );
  };

  const CustomTabBarButton = ({accessibilityState, children, onPress}) => {
    const focused = accessibilityState.selected;

    // const gradientColors = focused
    //   ? ['#0D4EB3', '#9413D0']
    //   : ['transparent', 'transparent'];

    const gradientColors = focused
      ? ['transparent', 'transparent']
      : ['transparent', 'transparent'];

    return (
      <TouchableOpacity
        onPress={onPress}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginHorizontal: 5,
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
    const appType = user?.user?.appUsesType;

    return (
      <ExtraStack.Navigator>
        {appType === 'vendor' ? (
          <ExtraStack.Screen
            name="VendorAccountSettingScreen"
            component={VendorAccountSettingScreen}
            options={{headerShown: false}}
          />
        ) : (
          <ExtraStack.Screen
            name="AccountsScreen"
            component={AccountsScreen}
            options={{headerShown: false}}
          />
        )}

        {/*<ExtraStack.Screen*/}
        {/*  name="AccountsScreen"*/}
        {/*  component={AccountsScreen}*/}
        {/*  options={{headerShown: false}}*/}
        {/*/>*/}

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
          name="PlanCancelScreen"
          component={PlanCancelScreen}
          options={{headerShown: false}}
        />

        <ExtraStack.Screen
          name="KycDetailsScreen"
          component={KycDetailsScreen}
          options={{headerShown: false}}
        />

        <ExtraStack.Screen
          name="TwoFactorAuthenticationScreen"
          component={TwoFactorAuthenticationScreen}
          options={{headerShown: false}}
        />

        <ExtraStack.Screen
          name="StepForAuthenticationOnScreen"
          component={StepForAuthenticationOnScreen}
          options={{headerShown: false}}
        />

        <ExtraStack.Screen
          name="EmailNumberAuthenticationNumber"
          component={EmailNumberAuthenticationNumber}
          options={{headerShown: false}}
        />

        <ExtraStack.Screen
          name="AuthenticationEnterOtpScreen"
          component={AuthenticationEnterOtpScreen}
          options={{headerShown: false}}
        />

        <ExtraStack.Screen
          name="DatingBlockAllScreen"
          component={DatingBlockAllScreen}
          options={{headerShown: false}}
        />
      </ExtraStack.Navigator>
    );
  };

  const HomeStack = () => {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName={'HomeTabs'}
        // initialRouteName={'MyNewProfileScreen'}
      >
        {/*<Stack.Screen*/}
        {/*  name="MyNewProfileScreen"*/}
        {/*  component={MyNewProfileScreen}*/}
        {/*/>*/}

        {/*<Stack.Screen name="DemoCode" component={DemoCode} />*/}
        <Stack.Screen
          name="LongTermUserDataScreen"
          component={LongTermUserDataScreen}
        />

        <Stack.Screen name="ServiceTabs" component={ServiceStackScreen} />

        <Stack.Screen name="Abc" component={Abc} />
        <Stack.Screen name="Message" component={Message} />

        <Stack.Screen name={'HomeTabs'} component={HomeTabs} />

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

        <Stack.Screen name="ExploreScreen" component={ExploreScreen} />
        <Stack.Screen name={'DatingHomeScreen'} component={DatingHomeScreen} />

        <Stack.Screen
          name={'DatingExploreScreen'}
          component={DatingExploreScreen}
        />

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

        <Stack.Screen
          name={'UserUploadImageFullScreen'}
          component={UserUploadImageFullScreen}
        />
        <Stack.Screen
          name={'UserProfileUploadImageFullScreen'}
          component={UserProfileUploadImageFullScreen}
        />
        <Stack.Screen
          name={'UserEditProfileScreen'}
          component={UserEditProfileScreen}
        />
        <Stack.Screen
          name={'DatingUserDetailsScreen'}
          component={DatingUserDetailsScreen}
        />

        <Stack.Screen
          name={'DatingUserProfileScreen'}
          component={DatingUserProfileScreen}
        />

        <Stack.Screen
          name={'VerifyIdentityScreen'}
          component={VerifyIdentityScreen}
        />

        <Stack.Screen
          name={'RemainingDataUiScreen'}
          component={RemainingDataUiScreen}
        />

        <Stack.Screen
          name={'EditGeneralScreen'}
          component={EditGeneralScreen}
        />

        <Stack.Screen
          name={'EditLocationScreen'}
          component={EditLocationScreen}
        />

        <Stack.Screen
          name={'EditContactScreen'}
          component={EditContactScreen}
        />

        <Stack.Screen
          name={'EditEducationScreen'}
          component={EditEducationScreen}
        />

        <Stack.Screen
          name={'EditProfessionalScreen'}
          component={EditProfessionalScreen}
        />

        <Stack.Screen
          name={'EditHobbiesScreen'}
          component={EditHobbiesScreen}
        />

        <Stack.Screen
          name={'EditPartnerPreferencesScreen'}
          component={EditPartnerPreferencesScreen}
        />

        <Stack.Screen
          name={'ChangeNameRequestScreen'}
          component={ChangeNameRequestScreen}
        />

        {/*myProfileEditForm*/}
        <Stack.Screen name="AboutEditScreen" component={AboutEditScreen} />
        <Stack.Screen
          name="ModifyBasicInfoScreen"
          component={ModifyBasicInfoScreen}
        />
        <Stack.Screen
          name="ModifyLocationScreen"
          component={ModifyLocationScreen}
        />
        <Stack.Screen
          name="ModifyContactScreen"
          component={ModifyContactScreen}
        />
        <Stack.Screen
          name="ModifyEducationScreen"
          component={ModifyEducationScreen}
        />
        <Stack.Screen
          name="ModifyOccupationScreen"
          component={ModifyOccupationScreen}
        />
        <Stack.Screen
          name="ModifyHobbiesAndInterestScreen"
          component={ModifyHobbiesAndInterestScreen}
        />
        <Stack.Screen
          name="ModifyPartnerPreferenceScreen"
          component={ModifyPartnerPreferenceScreen}
        />

        <Stack.Screen
          name="DatingPurposeScreen"
          component={DatingPurposeScreen}
        />

        <Stack.Screen
          name="ModifyDatingBasicScreen"
          component={ModifyDatingBasicScreen}
        />

        <Stack.Screen
          name="ModifyDatingProfessionalScreen"
          component={ModifyDatingProfessionalScreen}
        />

        <Stack.Screen
          name="ModifyDatingHobbiesScreen"
          component={ModifyDatingHobbiesScreen}
        />

        <Stack.Screen
          name="ModifyDatingPartnerPreferenceScreen"
          component={ModifyDatingPartnerPreferenceScreen}
        />

        {/*<Stack.Screen*/}
        {/*  name={'ServiceHomeScreen'}*/}
        {/*  component={ServiceHomeScreen}*/}
        {/*/>*/}
      </Stack.Navigator>
    );
  };

  const HomeTabs = ({route}) => {
    console.log(' === HomeTabs ===> ', appType);

    const getIconStyle = isFocused => {
      return {
        width: hp(17.76),
        height: hp(20),
        tintColor: isFocused ? '#4819CB' : '#5F6368', // 👈 red if focused, green if not
        resizeMode: 'contain',
        // top: -5,
      };
    };

    const getDatingIconStyle = isFocused => {
      return {
        width: hp(24),
        height: hp(20),
        tintColor: isFocused ? '#4819CB' : '#5F6368', // 👈 same here
        resizeMode: 'contain',
        // top: -20,
      };
    };

    const getLabelStyle = isFocused => {
      return {
        color: isFocused ? '#4819CB' : '#5F6368', // 👈 red if focused, green if not
        top: -10,
      };
    };

    const insets = useSafeAreaInsets();
    return (
      <Tab.Navigator
        tabBarOptions={{
          keyboardHidesTabBar: true,
        }}
        screenOptions={{
          tabBarStyle: [
            style.bottomTabNavigationContainer,
            {
              height:
                (isIOS ? hp(70) : hp(70)) +
                (isIOS
                  ? insets.bottom
                  : insets.bottom > 0
                  ? insets.bottom
                  : hp(0)),
              paddingBottom: insets.bottom > 0 ? insets.bottom : hp(5),
            },
          ],
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
                {/*Explore*/}
                {appType === 'dating' ? 'Explore' : 'Matches'}
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
          // component={UpgradeScreen}
          component={appType === 'dating' ? DatingUpgradeScreen : UpgradeScreen}
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
          name="MyNewProfileScreen"
          component={MyNewProfileScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="DatingProfileScreen"
          component={DatingProfileScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="DatingProfileScreens"
          component={DatingProfileScreens}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="AccountsScreen"
          component={ExtraScreens}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="SearchFilterScreen"
          component={SearchFilterScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="SearchUserDataScreen"
          component={SearchUserDataScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="SuccessStoryPageScreen"
          component={SuccessStoryPageScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="MeetNewFriendsScreen"
          component={MeetNewFriendsScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="DatingSearchFilterScreen"
          component={DatingSearchFilterScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="NewUserDetailsScreen"
          component={NewUserDetailsScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="UserProfileDetailsScreen"
          component={UserProfileDetailsScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />

        <Tab.Screen
          name="BottomSheetPrivacySettingScreen"
          component={BottomSheetPrivacySettingScreen}
          options={{tabBarButton: () => null, headerShown: false}}
        />
      </Tab.Navigator>
    );
  };

  return useMemo(
    () => (
      // <NavigationContainer ref={navigationRef} linking={linking}>
      <NavigationContainer
        ref={navigationRef}
        onReady={() => {
          isReadyRef.current = true;
        }}
        linking={{
          prefixes: [
            'hapmeet://',
            'happymilan://',
            'https://stag.mntech.website/api',
            'https://stag.mntech.website',
            'https://happymilan.com',
            'https://www.happymilan.com',
            'https://happymilan.tech',
          ],
          config: {
            screens: {
              HomeScreen: 'home',
            },
          },
        }}>
        {/*{isLoggedIn ? <HomeStack /> : <AuthStack />}*/}

        {!isLoggedIn ? (
          <AuthStack />
        ) : appType === 'vendor' ? (
          <ServiceStackScreen />
        ) : (
          <HomeStack />
        )}
      </NavigationContainer>
    ),
    [isLoggedIn],
  );
};

export default MainNavigator;
