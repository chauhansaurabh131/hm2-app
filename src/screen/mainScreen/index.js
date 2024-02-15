import React from 'react';
import {View, Text, Image, TouchableOpacity, SafeAreaView} from 'react-native';
import style from './style';
import LinearGradient from 'react-native-linear-gradient';
import {icons, images} from '../../assets';

const MainScreen = ({navigation}) => {
  return (
    <LinearGradient
      colors={['#184AB5', '#7D1DCC']}
      // locations={[0, 0.8, 3]}
      locations={[0, 0.8]}
      style={style.container}>
      <SafeAreaView style={{flex: 1}}>
        <Image source={images.happyMilan} style={style.logoStyle} />

        <View style={{alignSelf: 'center'}}>
          <Image source={images.coupleLogo} style={style.coupleLogoStyle} />
        </View>
        <Image source={images.intersect} style={style.intersectLogoStyle} />

        <View style={style.BodyContainer}>
          <Text style={style.textDescriptionStyle}>Discover Your </Text>
          <Text style={style.textDescriptionStyle}>Perfect Match with </Text>
          <Text style={style.textDescriptionStyle}>Connect.</Text>

          <Image
            source={icons.dots_icon}
            style={{width: 96, height: 12, marginTop: 34}}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('RegistrationScreen')}>
            <View style={style.buttonContainer}>
              <View style={style.buttonTextContainerStyle}>
                <Text style={style.buttonTextStyle}>Free Registration</Text>
                <Image
                  source={images.rightArrowLogo}
                  style={style.buttonImageStyle}
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={style.memberLoginTextContainer}>
          <Text style={style.loginTextStyle}>Member Login</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('LoginScreen');
            }}>
            <Image
              source={images.profileVectorLogo}
              style={style.profileVectorStyle}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default MainScreen;
