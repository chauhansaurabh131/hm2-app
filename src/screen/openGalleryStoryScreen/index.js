import React, {useState, useEffect} from 'react';
import {
  View,
  Image,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {colors} from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import Video from 'react-native-video';
import ImagePicker from 'react-native-image-crop-picker';

const OpenGalleryStoryScreen = () => {
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [showAlbums, setShowAlbums] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchRecentMedia();
    fetchAlbums();
  }, []);

  const fetchRecentMedia = async () => {
    try {
      const options = {
        first: 9999, // Fetch 20 recent media
        assetType: 'All', // Fetch both photos and videos
      };
      const {edges} = await CameraRoll.getPhotos(options);
      const media = edges.map(edge => ({
        uri: edge.node.image.uri,
        type: edge.node.type,
      }));
      setSelectedMedia(media);
    } catch (error) {
      console.error('Error fetching recent media:', error);
    }
  };

  const fetchAlbums = async () => {
    try {
      const albumsResponse = await CameraRoll.getAlbums();
      setAlbums(albumsResponse);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  const handleAlbumPress = async album => {
    try {
      const options = {
        first: 9999, // Fetch all available media
        assetType: 'All', // Fetch both photos and videos
        groupName: album.title,
      };
      const {edges} = await CameraRoll.getPhotos(options);
      const media = edges.map(edge => ({
        uri: edge.node.image.uri,
        type: edge.node.type,
      }));
      setSelectedMedia(media);
    } catch (error) {
      console.error('Error fetching media from album:', error);
    } finally {
      setShowAlbums(false); // Close dropdown after selecting an album
    }
  };

  const handleImagePress = item => {
    navigation.navigate('SetStoryScreen', {mediaUri: item.uri});
  };

  const handleVideoPress = item => {
    navigation.navigate('SetStoryScreen', {mediaUri: item.uri});
  };

  const renderItem = ({item}) => {
    if (item.type.startsWith('image')) {
      return (
        <View style={styles.renderContainer}>
          <TouchableOpacity onPress={() => handleImagePress(item)}>
            <Image
              source={{uri: item.uri}}
              style={styles.image}
              resizeMode="cover"
            />
          </TouchableOpacity>
        </View>
      );
    } else if (item.type.startsWith('video')) {
      return (
        <View style={styles.renderContainer}>
          <TouchableOpacity onPress={() => handleVideoPress(item)}>
            <Video
              source={{uri: item.uri}}
              style={styles.video}
              resizeMode="cover"
              // paused={true}
              muted={true}
            />
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  };

  const keyExtractor = (item, index) => index.toString();

  return (
    <SafeAreaView style={styles.renderContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              // navigation.goBack();
              navigation.navigate('HomeTabs');
            }}>
            <Image source={icons.x_cancel_icon} style={styles.cancelIcon} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={images.profileDisplayImage}
              style={styles.profileLogo}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.galleryHeader}>
          <TouchableOpacity
            style={styles.galleryButton}
            onPress={() => setShowAlbums(!showAlbums)}>
            <Text style={styles.galleryButtonText}>Gallery</Text>

            <Image source={icons.drooDownLogo} style={styles.dropDownIcon} />
          </TouchableOpacity>

          <Text style={styles.addStatusText}>Add Status</Text>
        </View>

        {showAlbums && (
          <View style={styles.dropdownContainer}>
            <ScrollView style={styles.albumContainer}>
              {albums.map(album => (
                <TouchableOpacity
                  key={album.id}
                  onPress={() => handleAlbumPress(album)}
                  style={styles.albumButton}>
                  <Text style={styles.albumText}>{album.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <FlatList
          data={selectedMedia}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={3} // Change to display 3 media items per row
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.cameraIconContainer}
          onPress={() => {
            ImagePicker.openCamera({
              width: 300,
              height: 400,
              cropping: true,
            }).then(image => {
              navigation.navigate('SetStoryScreen', {mediaUri: image.path});
            });
          }}>
          <Image source={icons.camera_icon} style={styles.cameraIcon} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(17),
    marginTop: hp(18),
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    alignItems: 'center',
    marginHorizontal: wp(17),
    marginTop: hp(30),
    marginBottom: hp(10),
  },
  galleryButton: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  galleryButtonText: {
    textAlign: 'center',
    color: 'black',
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
  addStatusText: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
  listContainer: {
    paddingBottom: 10,
    backgroundColor: colors.black,
  },
  image: {
    width: wp(129), // Adjusted width for 3 media items per row
    height: hp(150),
    margin: '1%', // Adjusted margin for spacing
  },
  video: {
    width: wp(129), // Adjusted width for 3 media items per row
    height: hp(150),
    margin: '1%', // Adjusted margin for spacing
  },
  dropdownContainer: {
    position: 'absolute',
    top: 130, // Adjust top position as needed
    left: 17,
    right: 0,
    zIndex: 1, // Ensure the dropdown is above other content
  },
  albumContainer: {
    maxHeight: 200,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    width: '70%',
  },
  albumButton: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  albumText: {
    fontSize: fontSize(16),
    color: 'black',
  },
  renderContainer: {
    flex: 1,
  },
  cancelIcon: {
    width: hp(16),
    height: hp(16),
  },
  profileLogo: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
  },
  dropDownIcon: {
    width: hp(10),
    height: hp(10),
    tintColor: 'black',
    marginLeft: wp(13),
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 25,
    right: 25,
  },
  cameraIcon: {
    width: hp(64),
    height: hp(64),
  },
});

export default OpenGalleryStoryScreen;
