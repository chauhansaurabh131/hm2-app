import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const useDelayedNavigation = (condition, screenName, params = {}) => {
  const navigation = useNavigation();

  useEffect(() => {
    if (condition) {
      // Delay navigation by 400ms
      setTimeout(() => {
        navigation.navigate(screenName, params);
      }, 400);

      // Clear the timer on component unmount to avoid memory leaks
    }
  }, [condition, navigation]);
};

export default useDelayedNavigation;
