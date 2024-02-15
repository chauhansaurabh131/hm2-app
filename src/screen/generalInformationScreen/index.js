import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {colors} from '../../utils/colors';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../../components/GradientButton';
import CustomHeaderLogo from '../../components/customHeaderLogo';

import {hp, wp} from '../../utils/helpers';

const images = [
  require('../../assets/icons/profile_logo.png'),
  require('../../assets/icons/address_location_logo.png'),
  require('../../assets/icons/phone_logo.png'),
  require('../../assets/icons/education_logo.png'),
  require('../../assets/icons/professional_logo.png'),
  require('../../assets/icons/interner_logo.png'),
];

const GeneralInformationScreen = ({navigation}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleNext = () => {
    if (selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handleBack = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleImagePress = index => {
    console.log('Selected Index:', index);
    setSelectedImageIndex(index);

    // Move the switch statement here
    switch (index) {
      case 0:
        navigation.navigate('GeneralInformation');
        break;
      case 1:
        navigation.navigate('AddressDetailsScreen');
        break;
      // Add cases for other screens
      default:
        break;
    }
  };

  const handleNextButtonPress = () => {
    handleNext();
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeaderLogo headerImage={{marginLeft: 15}} />
      <View style={styles.imageContainer}>
        <View style={styles.spacer} />
        {images.map((image, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleImagePress(index)}
            style={[
              styles.imageBox,
              index <= selectedImageIndex && styles.greenBox,
              index === selectedImageIndex && styles.selectedBox,
            ]}>
            {index === selectedImageIndex && (
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={[
                  styles.imageBox,
                  styles.selectedBox,
                  {borderRadius: 10, marginLeft: -1},
                ]}>
                <Image
                  source={image}
                  style={[
                    styles.image,
                    styles.selectedImage,
                    {tintColor: 'white'},
                  ]}
                />
              </LinearGradient>
            )}
            {index !== selectedImageIndex && (
              <Image
                source={image}
                style={[
                  styles.image,
                  index <= selectedImageIndex && {tintColor: 'white'},
                ]}
              />
            )}
          </TouchableOpacity>
        ))}
        <View style={styles.spacer} />
      </View>
      {/* Add your Next and Back buttons here */}

      {/*<AddressDetailsScreen />*/}
      <View style={styles.bottomButtonsContainer}>
        <GradientButton
          buttonName={'Back'}
          containerStyle={{
            width: wp(162),
            height: hp(50),
            borderColor: colors.blue,
            borderWidth: 1,
          }}
          buttonTextStyle={{color: colors.black}}
          whiteBackground
          onPress={handleBack}
        />
        <View style={{width: 20}} />

        <GradientButton
          buttonName={'Next'}
          containerStyle={{width: wp(162), height: hp(50)}}
          buttonTextStyle={{color: colors.white}}
          onPress={handleNextButtonPress}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    // backgroundColor: 'red',
    // marginHorizontal: hp(10),
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    // marginLeft: -5,
    // justifyContent: 'center',
  },
  spacer: {
    // flex: 1,
  },
  imageBox: {
    width: hp(48),
    height: hp(48),
    borderRadius: hp(10),
    // padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: 10,
    backgroundColor: colors.lightWhite,
  },
  selectedBox: {
    borderColor: 'green',
    backgroundColor: colors.blue,
  },
  greenBox: {
    backgroundColor: colors.lightGreen,
  },
  image: {
    width: hp(16),
    height: hp(16),
    resizeMode: 'stretch',
    tintColor: colors.black,
  },
  selectedImage: {
    borderColor: 'green',
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    marginBottom: 30,
    alignSelf: 'center',
    // marginLeft: -10,
    // backgroundColor: 'red',
  },
  bottomButton: {
    // marginRight: 10,
  },
});

export default GeneralInformationScreen;
