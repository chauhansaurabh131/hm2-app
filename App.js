import React from 'react';
import MainScreen from './src/screen/mainScreen';
import RegistrationScreen from './src/screen/registrationScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import {LogBox} from 'react-native';

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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
