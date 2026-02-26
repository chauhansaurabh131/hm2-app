import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../../utils/helpers';
import {colors} from '../../../utils/colors';

// Import your images here (make sure the path is correct)
import profileLogo from '../../../assets/icons/profile_logo.png';
import addressLocationLogo from '../../../assets/icons/address_location_logo.png';
import hobbiesLogo from '../../../assets/icons/interner_logo.png';
import locationLogo from '../../../assets/icons/address_location_logo.png';
import educationLogo from '../../../assets/icons/education_logo.png';
import professionalLogo from '../../../assets/icons/professional_logo.png';
import LinearGradient from 'react-native-linear-gradient';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {icons} from '../../../assets';

const RemainingDataUiScreen = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const [data, setData] = useState(null); // State to store the API response
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(null); // State to track any errors

  // console.log(' === data+++ ===> ', data);

  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true); // reset loading on re-fetch
          const response = await fetch(
            'https://stag.mntech.website/api/v1/user/user/pending-fields-for-mobile',
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          if (response.ok) {
            const jsonResponse = await response.json();
            console.log(' === jsonResponse ===> ', jsonResponse?.data);
            setData(jsonResponse?.data);
          } else {
            throw new Error('Failed to fetch data');
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      if (accessToken) {
        fetchData();
      }
    }, [accessToken]), // will re-run when screen focuses
  );

  // Loading, Error, and Success rendering
  if (loading) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: 'white',
          alignItems: 'center',
          marginBottom: hp(20),
        }}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView
        style={{flex: 1, backgroundColor: 'white', alignItems: 'center'}}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  // const handleAddPress = item => {
  //   console.log(' === handleAddPress ===> ', item);
  //   if (item.category === 'basicDetails') {
  //     navigation.navigate('EditGeneralScreen');
  //   } else if (item.category === 'contactDetails') {
  //     navigation.navigate('EditContactScreen');
  //   } else if (item.category === 'hobbiesAndInterest') {
  //     navigation.navigate('EditHobbiesScreen');
  //   } else if (item.category === 'locationDetails') {
  //     navigation.navigate('EditLocationScreen');
  //   } else if (item.category === 'educationDetails') {
  //     navigation.navigate('EditEducationScreen');
  //   } else if (item.category === 'professional') {
  //     navigation.navigate('EditProfessionalScreen');
  //   }
  // };

  const handleAddPress = item => {
    console.log(' === handleAddPress ===> ', item);
    if (item.category === 'basicDetails') {
      navigation.navigate('EditGeneralScreen');
    } else if (item.category === 'contactDetails') {
      navigation.navigate('EditContactScreen');
    } else if (item.category === 'locationDetails') {
      navigation.navigate('EditLocationScreen');
    } else if (item.category === 'locationDetails') {
      navigation.navigate('EditLocationScreen');
    } else if (item.category === 'professional') {
      navigation.navigate('EditProfessionalScreen');
    } else if (item.category === 'hobbiesAndInterest') {
      navigation.navigate('EditHobbiesScreen');
    }
  };

  const capitalizeCategory = category => {
    // Replace camelCase with spaces and capitalize first letter of each word
    return category
      .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space between camelCase words
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
  };

  const renderItem = ({item}) => {
    // console.log(' === item ===> ', item);

    // If the category is empty or the fields array is empty, return nothing or null
    if (!item.category || item.fields.length === 0) {
      return null;
    }

    // Determine the background color and image based on the category
    let backgroundColor;
    let borderColor;
    let imageSource;
    let imageStyle;

    switch (item.category) {
      case 'basicDetails':
        backgroundColor = '#F2F7FF'; // Light blue for basicDetails
        borderColor = '#0D4EB3'; // blue
        imageSource = profileLogo; // Profile image for basicDetails
        imageStyle = styles.profileImage; // Style for profile image
        break;
      case 'contactDetails':
        backgroundColor = '#e8f5d6'; // Light purple for contactDetails
        borderColor = '#4CAF50'; // green
        imageSource = addressLocationLogo; // Address logo for contactDetails
        imageStyle = styles.addressImage; // Style for address logo
        break;
      case 'hobbiesAndInterest':
        backgroundColor = '#ECFAFF'; // Light yellow for hobbiesAndInterest
        borderColor = '#00BFFF'; // sky blue
        imageSource = hobbiesLogo; // Hobbies image for hobbiesAndInterest
        imageStyle = styles.hobbiesImage; // Style for hobbies image
        break;
      case 'locationDetails':
        backgroundColor = '#FAF1FF'; // Light green for locationDetails
        borderColor = '#9C27B0'; // purple
        imageSource = locationLogo; // Location logo for locationDetails
        imageStyle = styles.locationImage; // Style for location logo
        break;
      case 'educationDetails':
        backgroundColor = '#F4F1FF'; // Light pink for educationDetails
        borderColor = '#673AB7'; // deep purple
        imageSource = educationLogo; // Education image for educationDetails
        imageStyle = styles.educationImage; // Style for education image
        break;
      case 'professional':
        backgroundColor = '#FFEBF7'; // Light lavender for professional
        borderColor = '#E91E63'; // pink
        imageSource = professionalLogo; // Professional image for professional
        imageStyle = styles.professionalImage; // Style for professional image
        break;
      default:
        backgroundColor = '#FFFFFF'; // Default background color
        borderColor = '#E0E0E0';
        imageSource = null; // No image for unknown categories
        imageStyle = styles.defaultImage; // Default image style
        break;
    }

    return (
      <View>
        {/*<View style={{width: hp(190), marginHorizontal: 10}}>*/}
        <TouchableOpacity
          style={{width: '100%'}}
          onPress={() => handleAddPress(item)}>
          <View style={{alignItems: 'center'}}>
            <View
              style={[
                styles.categoryContainer,
                {backgroundColor, borderColor},
              ]}>
              {imageSource && (
                <Image
                  source={imageSource}
                  style={[styles.categoryImage, imageStyle]}
                />
              )}
              <Text style={styles.categoryTitle}>
                {capitalizeCategory(item.category)}
              </Text>

              <TouchableOpacity onPress={() => handleAddPress(item)}>
                <Image
                  source={icons.plus_icon}
                  style={{
                    tintColor: colors.black,
                    width: hp(15),
                    height: hp(15),
                    resizeMode: 'contain',
                    marginTop: hp(18),
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const validData = data?.filter(
    item => item.category && item.fields?.length > 0,
  );

  return (
    <View style={{backgroundColor: 'white'}}>
      {validData?.length > 0 && (
        <Text
          style={{
            color: 'black',
            fontSize: fontSize(16),
            lineHeight: hp(26),
            fontFamily: fontFamily.poppins500,
            marginBottom: hp(22),
            marginHorizontal: 17,
            marginTop: hp(20),
          }}>
          Add Details for Better Matches
        </Text>
      )}
      <FlatList
        // data={data}
        data={validData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 17, marginBottom: hp(5)}}
      />

      {validData?.length > 0 && (
        <View
          style={{
            width: '100%',
            height: hp(4),
            backgroundColor: '#F8F8F8',
            marginTop: hp(25),
            marginBottom: 20,
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  listContainer: {
    width: '100%',
  },
  categoryContainer: {
    borderRadius: hp(10),
    alignItems: 'center',
    // justifyContent: 'center',
    width: hp(156), // You can adjust the width
    height: hp(156), // You can adjust the height
    // marginRight: hp(23),
    marginRight: wp(14),
    borderWidth: 1,
    backgroundColor: '#fff',
    // elevation: 3,
    // shadowColor: '#000', // iOS
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
  },
  categoryTitle: {
    fontSize: fontSize(12),
    color: colors.black,
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
  },
  categoryImage: {
    width: hp(42), // Base size for images
    height: hp(32), // Base size for images
    marginBottom: 10, // Add some spacing between image and title
    marginTop: hp(27),
  },
  profileImage: {
    width: hp(37),
    height: hp(34),
    tintColor: colors.black,
    marginBottom: hp(18),
    resizeMode: 'contain',
  },
  addressImage: {
    width: hp(34),
    height: hp(34),
    tintColor: colors.black,
    marginBottom: hp(20),
    resizeMode: 'contain',
  },
  hobbiesImage: {
    width: hp(34),
    height: hp(34),
    tintColor: colors.black,
    marginBottom: hp(20),
    resizeMode: 'contain',
  },
  locationImage: {
    width: hp(27),
    height: hp(34),
    tintColor: colors.black,
    marginBottom: hp(20),
    resizeMode: 'contain',
  },
  educationImage: {
    width: hp(42),
    height: hp(34),
    tintColor: colors.black,
    marginBottom: hp(20),
    resizeMode: 'contain',
  },
  professionalImage: {
    width: hp(34),
    height: hp(34),
    tintColor: colors.black,
    marginBottom: hp(20),
    resizeMode: 'contain',
  },
  defaultImage: {
    width: hp(50), // Default image size
    height: hp(50),
  },
  fieldText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
  },
  addButtonBody: {
    borderRadius: 25, // <-- Inner Border Radius
    flex: 1,
    justifyContent: 'center',
    margin: isIOS ? 0 : 1.5,
  },
  addButtonContainer: {
    width: wp(145),
    height: hp(50),
    borderRadius: 50,
    borderWidth: 1.5,
    justifyContent: 'center',
    borderColor: 'transparent',
    marginTop: 20,
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
