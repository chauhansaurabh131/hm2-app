import React from 'react';
import {Image, SafeAreaView, Text, View} from 'react-native';
import style from './style';
import {images} from '../../assets';
import TextInput from '../../components/TextInput';

const RegistrationScreen = () => {
  return (
    <SafeAreaView style={style.container}>
      <Image
        source={images.happyMilanColorLogo}
        style={style.headerLogoStyle}
      />

      <Text style={style.signUpTextStyle}>Sign Up</Text>

      <View style={style.textInputStyle}>
        <TextInput iconName={images.profileLogo} />
      </View>

      <Text>Enter Your Name</Text>
    </SafeAreaView>
  );
};

export default RegistrationScreen;
