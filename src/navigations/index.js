import {createStackNavigator} from '@react-navigation/stack';
import GeneralInformationScreen from '../screen/generalInformationScreen';
import AddressDetailsScreen from '../screen/addressDetailsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="GeneralInformation"
        component={GeneralInformationScreen}
      />
      <Stack.Screen name="AddressDetails" component={AddressDetailsScreen} />
      {/* Add other screens as needed */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
