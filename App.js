import React from 'react';
import MainScreen from './src/screen/mainScreen';
import RegistrationScreen from './src/screen/registrationScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import {LogBox} from 'react-native';
import LoginScreen from './src/screen/loginScreen';
import VerificationScreen from './src/screen/verificationScreen';
import SetPasswordScreen from './src/screen/setPasswordScreen';

const Stack = createStackNavigator();

LogBox.ignoreAllLogs();
const App = () => {
  // return <MainScreen />;
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainScreen">
        <Stack.Screen
          name="MainScreen"
          component={MainScreen}
          options={{headerShown: false}}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
