import React, {useEffect} from 'react';
import {
  SafeAreaView,
  FlatList,
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getSuccessStories} from '../../actions/homeActions';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import SuccessStoryPageScreen from '../../screen/successStoryPageScreen';
import Abc from '../../screen/abc';

const SuccessStoryFlatListComponent = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {storiesData, loading, error} = useSelector(state => state.home);

  useEffect(() => {
    dispatch(getSuccessStories());
  }, [dispatch]);

  // Render a single story card
  const renderStoryCard = ({item}) => {
    // Ensure the `item` is defined and has the necessary properties
    if (!item || !item.images || !item.title) {
      return null;
    }

    return (
      <View style={styles.cardContainer}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('SuccessStoryPageScreen', {story: item});
            // navigation.navigate('Abc', {story: item});
          }}>
          <Image source={{uri: item?.images[0]}} style={styles.storyImage} />
          <View style={{marginHorizontal: 14}}>
            <Text style={styles.storyTitle}>{item?.title}</Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: hp(14),
                marginBottom: hp(14),
              }}>
              <Text style={styles.readMoreText}>Read Story</Text>

              <Image
                source={icons.back_arrow_icon}
                style={{
                  width: hp(14),
                  height: hp(14),
                  transform: [{rotate: '180deg'}],
                  tintColor: '#7D7D7D',
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // Show loading spinner while fetching data
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  // Show error message if there is an error
  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>Error fetching stories: {error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={storiesData?.data?.results || []} // Fallback to empty array if results are undefined
        keyExtractor={(item, index) => index.toString()} // Use index as key (ensure unique)
        renderItem={renderStoryCard} // Render each story card
        contentContainerStyle={styles.flatListContainer} // Style for FlatList
        horizontal // Display stories horizontally
        showsHorizontalScrollIndicator={false} // Hide horizontal scrollbar
        ListEmptyComponent={<Text>No stories available.</Text>} // Show this when no data
      />
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    paddingVertical: 10,
  },
  cardContainer: {
    width: hp(143), // Adjust width of the card
    borderRadius: 6,
    backgroundColor: '#fff',
    marginRight: 15, // Spacing between cards
    marginLeft: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2, // Adds shadow/elevation for Android
    // alignItems: 'center',
  },
  storyImage: {
    width: '100%',
    height: hp(150), // Adjust height of the image
    borderRadius: 6,
    marginBottom: 10,
  },
  storyTitle: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins600,
    color: colors.black,
  },

  readMoreText: {
    color: '#7D7D7D',
    fontSize: fontSize(10),
    lineHeight: hp(12),
    fontFamily: fontFamily.poppins400,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
});

export default SuccessStoryFlatListComponent;
