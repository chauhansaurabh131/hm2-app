import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
  Text,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import {hp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import ImagePicker from 'react-native-image-crop-picker';
import {useNavigation} from '@react-navigation/native'; // Import for navigation

const NewStoryComponent = () => {
  const {user} = useSelector(state => state.auth);
  const navigation = useNavigation(); // Get the navigation object

  // console.log(' === var ===> ', user);

  const userImage = user?.user?.profilePic;

  const [selectedImage, setSelectedImage] = useState(user?.user?.profilePic);
  const [statusData, setStatusData] = useState([]); // State to hold the status data

  useEffect(() => {
    // Function to call the API
    const fetchStatusData = async () => {
      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/status/get-all-status',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user?.tokens?.access?.token}`, // Use the user's access token from Redux
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          setStatusData(data.data); // Set the status data to state (accessing the 'data' field)
          console.log('Status data:', data); // Log the response
        } else {
          console.error('Failed to fetch status data');
        }
      } catch (error) {
        console.error('Error fetching status data:', error);
      }
    };

    // Call the function to fetch the data when the component mounts
    fetchStatusData();
  }, [user?.tokens?.access?.token]); // Dependency to re-fetch if the token changes

  const openGallery = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      mediaType: 'photo',
    })
      .then(image => {
        setSelectedImage(image.path);
        navigation.navigate('AddSetStoryImageComponent', {
          imageUri: image.path,
        }); // Navigate to the next screen and pass the selected image path
      })
      .catch(error => {
        console.log('Error opening gallery:', error);
        Alert.alert('Error', 'Could not open the gallery.');
      });
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <TouchableOpacity activeOpacity={0.7} onPress={openGallery}>
          <View style={styles.imageContainer}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={styles.profileImage}
            />
            <View style={styles.iconWrapper}>
              <Image
                source={icons.add_story_icon}
                style={styles.addStoryIcon}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Display the status data */}
        <ScrollView>
          {statusData.length > 0 ? (
            statusData.map((status, index) => (
              <View key={index} style={styles.statusItem}>
                <Image
                  source={{uri: status.content}}
                  style={styles.statusImage}
                />
                <Text>Status ID: {status.id}</Text>
                <Text>
                  Added: {new Date(status.statusAddTime).toLocaleString()}
                </Text>
                <Text>
                  Ends: {new Date(status.statusEndTime).toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <Text>No status data available</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'silver',
  },
  imageContainer: {
    position: 'relative',
    marginLeft: 12,
    width: hp(40),
    height: hp(40),
  },
  profileImage: {
    width: hp(40),
    height: hp(40),
    borderRadius: hp(20), // Make the image circular
  },
  iconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    backgroundColor: 'white', // Optional: Add a background for the icon if you want it to stand out
    borderRadius: hp(10), // To make the icon circular
    padding: 0.8, // Optional: Padding around the icon
  },
  addStoryIcon: {
    width: hp(18),
    height: hp(18),
    resizeMode: 'contain',
  },
  statusItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  statusImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
});

export default NewStoryComponent;
