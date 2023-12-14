import React from 'react';
import {View, Text, Image} from 'react-native';
import style from './style';
import LinearGradient from 'react-native-linear-gradient';
import {images} from '../../assets';
import Button from '../../components/Button';

const MainScreen = ({navigation}) => {
  return (
    <LinearGradient
      colors={['#184AB5', '#7D1DCC']}
      locations={[0, 0.8, 3]}
      // locations={[0.1, 10]}
      style={style.container}>
      <Image source={images.happyMilan} style={style.logoStyle} />

      <View style={style.logoContainer}>
        <Image source={images.coupleLogo} style={style.coupleLogoStyle} />
      </View>
      <Image source={images.intersect} style={style.intersectLogoStyle} />

      <View style={style.textDescriptionContainer}>
        <Text style={style.textDescriptionStyle}>
          Discover Your {'\n'}
          <Text style={style.textDescriptionStyle}>
            Perfect Match with {'\n'}
            <Text style={style.textDescriptionStyle}>Connect.</Text>{' '}
          </Text>
        </Text>
      </View>

      <Button
        buttonName={'Free Registration'}
        buttonTextStyle={style.buttonTextStyle}
        containerStyle={{marginTop: 40}}
        onPress={() => navigation.navigate('RegistrationScreen')}
      />

      <View style={style.memberLoginTextContainer}>
        <Text style={style.loginTextStyle}>Member Login</Text>
        <Image
          source={images.profileVectorLogo}
          style={style.profileVectorStyle}
        />
      </View>
    </LinearGradient>
  );
};

export default MainScreen;
