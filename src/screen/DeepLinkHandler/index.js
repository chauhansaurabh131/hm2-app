import {useEffect} from 'react';
import {Alert, Linking} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const DeepLinkHandler = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleDeepLink = event => {
      const url = event.url;
      console.log('Received deep link:', url);

      if (url.includes('payment/success')) {
        navigation.navigate('Abc');
      } else if (url.includes('payment/failure')) {
        Alert.alert('Payment Failed', 'Please try again.');
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Check if app opened with link (cold start)
    Linking.getInitialURL().then(url => {
      if (url && url.includes('payment/success')) {
        navigation.navigate('Abc');
      }
    });

    return () => subscription.remove();
  }, [navigation]);

  return null;
};

export default DeepLinkHandler;
