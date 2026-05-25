import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Text, TouchableOpacity} from 'react-native';
import SignInOrLogInComponent from '../../components/signInOrLogInComponent';
import {hp} from '../../utils/helpers';

const DemoCode = () => {
  const [loginModal, setSetLoginModal] = useState(false);
  return (
    <SafeAreaView>
      <TouchableOpacity
        onPress={() => {
          setSetLoginModal(true);
        }}
        style={{
          width: '100%',
          height: hp(50),
          backgroundColor: 'black',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text style={{color: 'white'}}>Open</Text>
      </TouchableOpacity>

      <SignInOrLogInComponent
        visible={loginModal}
        onClose={() => setSetLoginModal(false)}
        onSignUp={() => {
          setSetLoginModal(false);
          // navigation.navigate('NewSignUpScreen');
        }}
        onLogin={() => {
          setSetLoginModal(false);
          // navigation.navigate('LoginScreen');
        }}
      />
    </SafeAreaView>
  );
};

export default DemoCode;
