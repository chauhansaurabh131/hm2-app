import React from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../../utils/helpers';
import {colors} from '../../../utils/colors';
import LinearGradient from 'react-native-linear-gradient';

import {useNavigation} from '@react-navigation/native';
import EditGeneralScreen from '../editGeneralScreen';

const RemainingDataUiScreen = () => {
  // Example data array with different colors, image sources, and specific styles for each box
  const navigation = useNavigation();
  const data = [
    {
      id: '1',
      title: 'Basic Details',
      color: '#F2F7FF',
      image: require('../../../assets/icons/profile_logo.png'),
      imageStyle: styles.imageBasic, // Add a specific style for the image
      navigateTo: 'EditGeneralScreen',
    },
    {
      id: '2',
      title: 'Location Details',
      color: '#FAF1FF',
      image: require('../../../assets/icons/address_location_logo.png'),
      imageStyle: styles.imageLocation, // Style for this image
      navigateTo: 'EditLocationScreen',
    },
    {
      id: '3',
      title: 'Contact Details',
      color: '#e8f5d6',
      // color: '#E4FFE0A8',
      image: require('../../../assets/icons/phone_logo.png'),
      imageStyle: styles.imageContact, // Style for this image
      navigateTo: 'EditContactScreen',
    },
    {
      id: '4',
      title: 'Education Details',
      color: '#F4F1FF',
      image: require('../../../assets/icons/education_logo.png'),
      imageStyle: styles.imageEducation, // Style for this image
      navigateTo: 'EditEducationScreen',
    },
    {
      id: '5',
      title: 'Professional Details',
      color: '#FFEBF7',
      image: require('../../../assets/icons/professional_logo.png'),
      imageStyle: styles.imageProfessional, // Style for this image
      navigateTo: 'EditProfessionalScreen',
    },
    {
      id: '6',
      title: 'Hobbies & Interest',
      color: '#ECFAFF',
      image: require('../../../assets/icons/interner_logo.png'),
      imageStyle: styles.imageHobbies, // Style for this image
      navigateTo: 'EditHobbiesScreen',
    },
    {
      id: '7',
      title: 'Partner Preferences',
      color: '#ECF2FF',
      image: require('../../../assets/icons/edit_partner_preference.png'),
      imageStyle: styles.imagePartner, // Style for this image
      navigateTo: 'EditPartnerPreferencesScreen',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        horizontal={true} // Make the list horizontal
        keyExtractor={item => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({item}) => (
          <View style={[styles.box, {backgroundColor: item.color}]}>
            {/* Image inside the box with dynamic style from the data */}
            <Image source={item.image} style={item.imageStyle} />
            <Text style={styles.text}>{item.title}</Text>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => {
                navigation.navigate(item.navigateTo); // Navigate to the appropriate screen
              }}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                style={styles.addButtonContainer}>
                <View
                  style={[styles.addButtonBody, {backgroundColor: item.color}]}>
                  <Text style={styles.addButtonText}>Add Details</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    backgroundColor: 'white',
    marginTop: hp(22),
  },
  box: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: hp(190), // You can adjust the width
    height: hp(190), // You can adjust the height
    marginRight: hp(23),
  },
  text: {
    fontSize: fontSize(14),
    color: colors.black,
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },

  // Specific image styles based on item id
  imageBasic: {
    width: hp(37),
    height: hp(34),
    tintColor: colors.black,
    marginBottom: hp(18),
    resizeMode: 'contain',
  },
  imageLocation: {
    width: hp(27),
    height: hp(34),
    tintColor: colors.black,
    marginBottom: hp(20),
    resizeMode: 'contain',
  },
  imageContact: {
    width: hp(34),
    height: hp(34),
    tintColor: colors.black,
    marginBottom: hp(20),
    resizeMode: 'contain',
  },
  imageEducation: {
    width: hp(42),
    height: hp(34),
    tintColor: colors.black,
    marginBottom: hp(20),
    resizeMode: 'contain',
  },
  imageProfessional: {
    width: hp(34),
    height: hp(34),
    tintColor: colors.black,
    marginBottom: hp(20),
    resizeMode: 'contain',
  },
  imageHobbies: {
    width: hp(34),
    height: hp(34),
    tintColor: colors.black,
    marginBottom: hp(20),
    resizeMode: 'contain',
  },
  imagePartner: {
    width: hp(49),
    height: hp(34),
    tintColor: colors.black,
    marginBottom: hp(20),
    resizeMode: 'contain',
  },
  addButtonContainer: {
    width: wp(145),
    height: hp(50),
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: 'transparent',
    marginTop: 20,
  },
  addButtonBody: {
    borderRadius: 50, // <-- Inner Border Radius
    flex: 1,
    // backgroundColor: item.color,
    justifyContent: 'center',
    margin: isIOS ? 0 : 1,
  },
  addButtonText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: colors.black,
    margin: 10,
    fontSize: fontSize(14),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins500,
  },
});

export default RemainingDataUiScreen;
