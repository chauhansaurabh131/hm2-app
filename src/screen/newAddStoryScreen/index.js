import React, {useState, useEffect, useCallback} from 'react';
import {
  Image,
  SafeAreaView,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Alert,
  Text,
} from 'react-native';
import {useSelector} from 'react-redux';
import {hp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import ImagePicker from 'react-native-image-crop-picker';
import {useNavigation} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';

const NewAddStoryScreen = () => {
  const {user} = useSelector(state => state.auth);
  const navigation = useNavigation();
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;

  // console.log(' === USER_ID ===> ', user?.user?.id, user?.user?.name);

  const [selectedImage, setSelectedImage] = useState(user?.user?.profilePic);
  const [statuses, setStatuses] = useState([]);

  // Function to fetch all statuses
  const fetchStatuses = useCallback(async () => {
    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/status/get-all-status',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.ok) {
        const data = await response.json();
        console.log('Fetched Statuses:', data?.data[0]?.userId?.id);
        setStatuses(data.data); // Set the statuses to state
      } else {
        console.log('Failed to fetch statuses:', response.status);
        Alert.alert('Error', 'Failed to fetch statuses');
      }
    } catch (error) {
      console.error('Error fetching statuses:', error);
      Alert.alert('Error', 'Failed to fetch statuses');
    }
  }, [accessToken]);

  // Use Focus Effect to fetch statuses when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchStatuses();
    }, [fetchStatuses]),
  );

  // Open gallery with useCallback to prevent re-creation on every render
  const openGallery = useCallback(() => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      mediaType: 'photo',
    })
      .then(image => {
        setSelectedImage(image.path);
        navigation.navigate('AddSetStoryImageComponent', {
          imageUri: image.path,
        });
      })
      .catch(error => {
        console.log('Error opening gallery:', error);
        Alert.alert('Error', 'Could not open the gallery.');
      });
  }, [navigation]);

  // Check if the user has a status
  const userStatus = statuses.find(
    status => status.userId.id === user?.user?.id,
  );

  // Handle image click based on the conditions
  const handleImageClick = () => {
    if (userStatus?.content) {
      // Log a message if userStatus.content exists
      console.log('User has a status content:', userStatus);

      navigation.navigate('ViewUserStatusScreen', {userStatus});
    } else if (userImage) {
      // Open gallery if userImage exists
      openGallery();
    }
  };

  // Filter out the current user's status from the list to display other users' statuses
  const otherUserStatuses = statuses.filter(
    status => status.userId.id !== user?.user?.id,
  );

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        style={styles.statusContainer}
        onPress={() => {
          // Pass all statuses and the selected index to ViewStatusScreen
          navigation.navigate('ViewStatusScreen', {
            allStatuses: otherUserStatuses, // Pass all statuses
            selectedIndex: index, // Pass the index of the selected item
          });
        }}>
        <Image
          source={{uri: item.content}} // Use the content URL from the statuses
          style={styles.statusImage}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: 'white'}}>
      <View style={styles.container}>
        <View>
          <View style={styles.imageContainer}>
            {/* Update the onPress logic here */}
            <TouchableOpacity activeOpacity={0.7} onPress={handleImageClick}>
              <Image
                source={
                  userStatus?.content
                    ? {uri: userStatus.content} // If status image exists, use it
                    : userImage
                    ? {uri: userImage}
                    : images.empty_male_Image // Fallback to profile image or default image
                }
                // Apply conditional styling for the blue border
                style={[
                  styles.profileImage,
                  userStatus?.content && styles.blueBorder, // Add blue border if userStatus.content exists
                ]}
              />
            </TouchableOpacity>

            <View style={styles.iconWrapper}>
              <Image
                source={
                  userStatus?.content
                    ? icons.check_gradient_box_icon
                    : icons.add_story_icon
                }
                style={styles.addStoryIcon}
              />
            </View>
          </View>
        </View>

        {/* FlatList to display other users' statuses */}
        <FlatList
          data={otherUserStatuses} // Filtered list of statuses (excluding current user)
          renderItem={renderItem}
          keyExtractor={item => item.id} // Unique key for each status
          horizontal // To display images horizontally like stories
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statusList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'silver',
    flexDirection: 'row',
    // flex: 1,
  },
  imageContainer: {
    position: 'relative',
    // marginLeft: 12,
    width: hp(40),
    height: hp(40),
    // marginTop: 10,
    marginBottom: 10,
  },
  profileImage: {
    width: hp(40),
    height: hp(40),
    borderRadius: hp(20),
  },
  blueBorder: {
    borderWidth: 2, // Add a border width for the blue border
    borderColor: '#0F52BA', // Set the border color to blue
  },
  iconWrapper: {
    position: 'absolute',
    bottom: 0,
    right: -5,
    backgroundColor: 'white',
    borderRadius: hp(10),
    padding: 0.8,
  },
  addStoryIcon: {
    width: hp(18),
    height: hp(18),
    resizeMode: 'contain',
  },
  statusList: {
    // marginTop: 10,
    paddingLeft: 12,
  },
  statusContainer: {
    marginRight: 10,
  },
  statusImage: {
    width: hp(40),
    height: hp(40),
    borderRadius: hp(50),
    borderWidth: 2,
    borderColor: '#0F52BA',
  },
});

export default NewAddStoryScreen;
