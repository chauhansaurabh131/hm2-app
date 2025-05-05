// import React from 'react';
// import {
//   SafeAreaView,
//   FlatList,
//   Text,
//   View,
//   StyleSheet,
//   Image,
//   TouchableOpacity,
// } from 'react-native';
// import {fontFamily, fontSize, hp, isIOS, wp} from '../../../utils/helpers';
// import {colors} from '../../../utils/colors';
// import LinearGradient from 'react-native-linear-gradient';
//
// import {useNavigation} from '@react-navigation/native';
// import EditGeneralScreen from '../editGeneralScreen';
//
// const RemainingDataUiScreen = () => {
//   // Example data array with different colors, image sources, and specific styles for each box
//   const navigation = useNavigation();
//   const data = [
//     {
//       id: '1',
//       title: 'Basic Details',
//       color: '#F2F7FF',
//       image: require('../../../assets/icons/profile_logo.png'),
//       imageStyle: styles.imageBasic, // Add a specific style for the image
//       navigateTo: 'EditGeneralScreen',
//     },
//     {
//       id: '2',
//       title: 'Location Details',
//       color: '#FAF1FF',
//       image: require('../../../assets/icons/address_location_logo.png'),
//       imageStyle: styles.imageLocation, // Style for this image
//       navigateTo: 'EditLocationScreen',
//     },
//     {
//       id: '3',
//       title: 'Contact Details',
//       color: '#e8f5d6',
//       // color: '#E4FFE0A8',
//       image: require('../../../assets/icons/phone_logo.png'),
//       imageStyle: styles.imageContact, // Style for this image
//       navigateTo: 'EditContactScreen',
//     },
//     {
//       id: '4',
//       title: 'Education Details',
//       color: '#F4F1FF',
//       image: require('../../../assets/icons/education_logo.png'),
//       imageStyle: styles.imageEducation, // Style for this image
//       navigateTo: 'EditEducationScreen',
//     },
//     {
//       id: '5',
//       title: 'Professional Details',
//       color: '#FFEBF7',
//       image: require('../../../assets/icons/professional_logo.png'),
//       imageStyle: styles.imageProfessional, // Style for this image
//       navigateTo: 'EditProfessionalScreen',
//     },
//     {
//       id: '6',
//       title: 'Hobbies & Interest',
//       color: '#ECFAFF',
//       image: require('../../../assets/icons/interner_logo.png'),
//       imageStyle: styles.imageHobbies, // Style for this image
//       navigateTo: 'EditHobbiesScreen',
//     },
//     {
//       id: '7',
//       title: 'Partner Preferences',
//       color: '#ECF2FF',
//       image: require('../../../assets/icons/edit_partner_preference.png'),
//       imageStyle: styles.imagePartner, // Style for this image
//       navigateTo: 'EditPartnerPreferencesScreen',
//     },
//   ];
//
//   return (
//     <SafeAreaView style={styles.container}>
//       <FlatList
//         data={data}
//         horizontal={true} // Make the list horizontal
//         keyExtractor={item => item.id}
//         showsHorizontalScrollIndicator={false}
//         renderItem={({item}) => (
//           <View style={[styles.box, {backgroundColor: item.color}]}>
//             {/* Image inside the box with dynamic style from the data */}
//             <Image source={item.image} style={item.imageStyle} />
//             <Text style={styles.text}>{item.title}</Text>
//
//             <TouchableOpacity
//               activeOpacity={0.7}
//               onPress={() => {
//                 navigation.navigate(item.navigateTo); // Navigate to the appropriate screen
//               }}>
//               <LinearGradient
//                 colors={['#0D4EB3', '#9413D0']}
//                 style={styles.addButtonContainer}>
//                 <View
//                   style={[styles.addButtonBody, {backgroundColor: item.color}]}>
//                   <Text style={styles.addButtonText}>Add Details</Text>
//                 </View>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         )}
//       />
//     </SafeAreaView>
//   );
// };
//
// const styles = StyleSheet.create({
//   container: {
//     justifyContent: 'center',
//     backgroundColor: 'white',
//     marginTop: hp(22),
//   },
//   box: {
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: hp(190), // You can adjust the width
//     height: hp(190), // You can adjust the height
//     marginRight: hp(23),
//   },
//   text: {
//     fontSize: fontSize(14),
//     color: colors.black,
//     lineHeight: hp(21),
//     fontFamily: fontFamily.poppins400,
//   },
//
//   // Specific image styles based on item id
//   imageBasic: {
//     width: hp(37),
//     height: hp(34),
//     tintColor: colors.black,
//     marginBottom: hp(18),
//     resizeMode: 'contain',
//   },
//   imageLocation: {
//     width: hp(27),
//     height: hp(34),
//     tintColor: colors.black,
//     marginBottom: hp(20),
//     resizeMode: 'contain',
//   },
//   imageContact: {
//     width: hp(34),
//     height: hp(34),
//     tintColor: colors.black,
//     marginBottom: hp(20),
//     resizeMode: 'contain',
//   },
//   imageEducation: {
//     width: hp(42),
//     height: hp(34),
//     tintColor: colors.black,
//     marginBottom: hp(20),
//     resizeMode: 'contain',
//   },
//   imageProfessional: {
//     width: hp(34),
//     height: hp(34),
//     tintColor: colors.black,
//     marginBottom: hp(20),
//     resizeMode: 'contain',
//   },
//   imageHobbies: {
//     width: hp(34),
//     height: hp(34),
//     tintColor: colors.black,
//     marginBottom: hp(20),
//     resizeMode: 'contain',
//   },
//   imagePartner: {
//     width: hp(49),
//     height: hp(34),
//     tintColor: colors.black,
//     marginBottom: hp(20),
//     resizeMode: 'contain',
//   },
//   addButtonContainer: {
//     width: wp(145),
//     height: hp(50),
//     borderRadius: 50,
//     borderWidth: 1,
//     justifyContent: 'center',
//     borderColor: 'transparent',
//     marginTop: 20,
//   },
//   addButtonBody: {
//     borderRadius: 50, // <-- Inner Border Radius
//     flex: 1,
//     // backgroundColor: item.color,
//     justifyContent: 'center',
//     margin: isIOS ? 0 : 1,
//   },
//   addButtonText: {
//     textAlign: 'center',
//     backgroundColor: 'transparent',
//     color: colors.black,
//     margin: 10,
//     fontSize: fontSize(14),
//     lineHeight: hp(18),
//     fontFamily: fontFamily.poppins500,
//   },
// });
//
// export default RemainingDataUiScreen;

import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
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
import {useNavigation} from '@react-navigation/native';

const RemainingDataUiScreen = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const [data, setData] = useState(null); // State to store the API response
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(null); // State to track any errors

  const navigation = useNavigation();

  useEffect(() => {
    // Call API when the component mounts
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/user/pending-fields-for-mobile',
          {
            method: 'GET', // Assuming GET method
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`, // Authorization header with token
            },
          },
        );

        if (response.ok) {
          const jsonResponse = await response.json();
          setData(jsonResponse?.data); // Set the response data to state
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (err) {
        setError(err.message); // If error occurs, set error state
      } finally {
        setLoading(false); // End the loading state
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]); // Dependency array ensures it runs when accessToken changes

  // Loading, Error, and Success rendering
  if (loading) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
        <Text>Error: {error}</Text>
      </SafeAreaView>
    );
  }

  const handleAddPress = item => {
    console.log(' === handleAddPress ===> ', item);
    if (item.category === 'basicDetails') {
      navigation.navigate('EditGeneralScreen');
    } else if (item.category === 'contactDetails') {
      navigation.navigate('EditContactScreen');
    } else if (item.category === 'hobbiesAndInterest') {
      navigation.navigate('EditHobbiesScreen');
    } else if (item.category === 'locationDetails') {
      navigation.navigate('EditLocationScreen');
    } else if (item.category === 'educationDetails') {
      navigation.navigate('EditEducationScreen');
    } else if (item.category === 'professional') {
      navigation.navigate('EditProfessionalScreen');
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
      return null; // Don't render this item if it's empty
    }

    // Determine the background color and image based on the category
    let backgroundColor;
    let imageSource;
    let imageStyle;

    switch (item.category) {
      case 'basicDetails':
        backgroundColor = '#F2F7FF'; // Light blue for basicDetails
        imageSource = profileLogo; // Profile image for basicDetails
        imageStyle = styles.profileImage; // Style for profile image
        break;
      case 'contactDetails':
        backgroundColor = '#e8f5d6'; // Light purple for contactDetails
        imageSource = addressLocationLogo; // Address logo for contactDetails
        imageStyle = styles.addressImage; // Style for address logo
        break;
      case 'hobbiesAndInterest':
        backgroundColor = '#ECFAFF'; // Light yellow for hobbiesAndInterest
        imageSource = hobbiesLogo; // Hobbies image for hobbiesAndInterest
        imageStyle = styles.hobbiesImage; // Style for hobbies image
        break;
      case 'locationDetails':
        backgroundColor = '#FAF1FF'; // Light green for locationDetails
        imageSource = locationLogo; // Location logo for locationDetails
        imageStyle = styles.locationImage; // Style for location logo
        break;
      case 'educationDetails':
        backgroundColor = '#F4F1FF'; // Light pink for educationDetails
        imageSource = educationLogo; // Education image for educationDetails
        imageStyle = styles.educationImage; // Style for education image
        break;
      case 'professional':
        backgroundColor = '#FFEBF7'; // Light lavender for professional
        imageSource = professionalLogo; // Professional image for professional
        imageStyle = styles.professionalImage; // Style for professional image
        break;
      default:
        backgroundColor = '#FFFFFF'; // Default background color
        imageSource = null; // No image for unknown categories
        imageStyle = styles.defaultImage; // Default image style
        break;
    }

    return (
      <SafeAreaView style={{width: '100%'}}>
        <View style={{marginHorizontal: 17}}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins500,
              marginTop: hp(22),
              marginBottom: hp(22),
            }}>
            Add Details for Better Matches
          </Text>
          <View
            style={[
              styles.categoryContainer,
              {backgroundColor}, // Apply the background color dynamically
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

            <TouchableOpacity
              onPress={() => {
                handleAddPress(item);
              }}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                style={styles.addButtonContainer}>
                <View style={[styles.addButtonBody, {backgroundColor}]}>
                  <Text style={styles.addButtonText}>Add Details</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: '100%',
            height: 4,
            backgroundColor: '#F8F8F8',
            // backgroundColor: 'red',
            marginTop: hp(25),
          }}
        />
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={data} // Data for the FlatList
        renderItem={renderItem} // Render each category and its fields
        keyExtractor={(item, index) => index.toString()} // Key extractor
        contentContainerStyle={styles.listContainer}
        horizontal={true}
      />
      {/*<View*/}
      {/*  style={{*/}
      {/*    width: '100%',*/}
      {/*    height: 4,*/}
      {/*    backgroundColor: '#F8F8F8',*/}
      {/*    marginTop: hp(25),*/}
      {/*  }}*/}
      {/*/>*/}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
  },
  listContainer: {
    // padding: 10,
    // marginTop: hp(22),
    width: '100%',
    // height: 4,
    // backgroundColor: '#F8F8F8',
    // marginTop: hp(25),
  },
  categoryContainer: {
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: hp(190), // You can adjust the width
    height: hp(190), // You can adjust the height
    marginRight: hp(23),
  },
  categoryTitle: {
    fontSize: fontSize(14),
    color: colors.black,
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },
  categoryImage: {
    width: hp(60), // Base size for images
    height: hp(60), // Base size for images
    marginBottom: 10, // Add some spacing between image and title
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
    // backgroundColor: item.color,
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
