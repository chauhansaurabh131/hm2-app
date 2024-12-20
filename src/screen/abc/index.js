import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useSelector} from 'react-redux';
import {hp} from '../../utils/helpers';
import {icons} from '../../assets';
import axios from 'axios';

const Abc = ({route}) => {
  const {data} = route.params;

  // Getting the access token from Redux
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  console.log(' === route.params____ ===> ', data);

  // State to store the API response data
  const [singleUserData, setSingleUserData] = useState(null); // For single user fetched by ID
  const [searchUserData, setSearchUserData] = useState([]); // For multiple users fetched by search

  // Function to fetch user data by ID (single user)
  const fetchUserDataById = async userId => {
    try {
      const response = await axios.get(
        `https://stag.mntech.website/api/v1/user/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('User data fetched by ID:', response.data);
      // Set the single user data into the state
      setSingleUserData(response.data.data[0]); // Assuming the response has a 'data' field
    } catch (error) {
      console.error('Error fetching data by ID:', error);
      Alert.alert('Error', 'Failed to fetch user data by ID.');
    }
  };

  // Function to fetch user data via search query (multiple users)
  const fetchUserData = async () => {
    if (!accessToken) {
      console.error('No access token found');
      return;
    }

    const url = 'https://stag.mntech.website/api/v1/user/search/search-user';
    const requestBody = {
      minAge: data.minAge,
      maxAge: data.maxAge,
      maritalStatus: data.maritalStatus,
      religion: data.religion,
      motherTongue: data.motherTongue,
      minHeight: data.minHeight,
      maxHeight: data.maxHeight,
      currentCountry: data.currentCountry,
      state: [], // Assuming you will populate this field as needed
      currentCity: data.currentCity,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);

      // Store the search results (multiple users)
      setSearchUserData(responseData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch user data.');
    }
  };

  // UseEffect to trigger the correct API call based on the type of 'data'
  useEffect(() => {
    if (accessToken) {
      if (data && data.length === 24) {
        // If the data is an ID (length 24 is common for MongoDB ObjectIds)
        fetchUserDataById(data); // Fetch user data by ID (single user)
      } else {
        fetchUserData(); // Fetch user data for the search query (multiple users)
      }
    }
  }, [accessToken, data]);

  // Function to add user to shortlist
  const addToShortlist = async shortlistId => {
    try {
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/shortlist/create-shortlist',
        {
          shortlistId: shortlistId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('Shortlist created successfully:', response.data);
      // Re-fetch the user data after adding to shortlist
      // fetchUserData(); // Re-fetch the user data
      if (data && data.length === 24) {
        // If the data is an ID (length 24 is common for MongoDB ObjectIds)
        fetchUserDataById(data); // Fetch user data by ID (single user)
      } else {
        fetchUserData(); // Fetch user data for the search query (multiple users)
      }
    } catch (error) {
      console.error('Error adding to shortlist:', error);
      Alert.alert('Error', 'Failed to add to shortlist.');
    }
  };

  // Function to remove user from shortlist
  const removeFromShortlist = async shortlistId => {
    try {
      const response = await axios.delete(
        `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${shortlistId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('Shortlist removed successfully:', response.data);
      // Re-fetch the user data after removing from shortlist
      // fetchUserData(); // Re-fetch the user data
      if (data && data.length === 24) {
        // If the data is an ID (length 24 is common for MongoDB ObjectIds)
        fetchUserDataById(data); // Fetch user data by ID (single user)
      } else {
        fetchUserData(); // Fetch user data for the search query (multiple users)
      }
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      Alert.alert('Error', 'Failed to remove from shortlist.');
    }
  };

  // FlatList render item
  const renderItem = ({item}) => {
    console.log(' === renderItem ===> ', item?.userShortListDetails);

    const starIconSource = item?.userShortListDetails
      ? icons.black_check_icon
      : icons.black_start_icon;
    return (
      <View style={styles.itemContainer}>
        <Image source={{uri: item.profilePic}} style={styles.image} />
        <Text style={styles.name}>
          {item.firstName} {item.lastName}
        </Text>

        <TouchableOpacity
          onPress={() => {
            if (item?.userShortListDetails) {
              // If the user is already in the shortlist, remove them
              removeFromShortlist(item.userShortListDetails._id);
            } else {
              // If the user is not in the shortlist, add them
              addToShortlist(item._id);
            }
          }}>
          <Image
            source={starIconSource}
            style={{
              width: hp(25),
              height: hp(25),
              resizeMode: 'contain',
              marginLeft: 35,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  // FlatList render item
  const SearchUserDataRenderItem = ({item}) => {
    console.log(' === SearchUserDataRenderItem ===> ', item);

    const starIconSource = item?.userShortListDetails
      ? icons.black_check_icon
      : icons.black_start_icon;
    return (
      <View style={styles.itemContainer}>
        <Image source={{uri: item.profilePic}} style={styles.image} />
        <Text style={styles.name}>
          {item.firstName} {item.lastName}
        </Text>

        <TouchableOpacity
          onPress={() => {
            if (item?.userShortListDetails) {
              // If the user is already in the shortlist, remove them
              removeFromShortlist(item.userShortListDetails._id);
            } else {
              // If the user is not in the shortlist, add them
              addToShortlist(item._id);
            }
          }}>
          <Image
            source={starIconSource}
            style={{
              width: hp(25),
              height: hp(25),
              resizeMode: 'contain',
              marginLeft: 35,
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text>Total User Data: {singleUserData ? 1 : searchUserData.length}</Text>
      {/* FlatList for single user (by ID) */}
      {singleUserData && (
        <FlatList
          data={[singleUserData]} // Wrap the single user data in an array
          renderItem={renderItem}
          keyExtractor={item => item._id}
          ListHeaderComponent={() => (
            <Text style={styles.header}>Single User</Text>
          )}
        />
      )}

      {/* FlatList for multiple users (by search) */}
      {searchUserData.length > 0 && (
        <FlatList
          data={searchUserData}
          renderItem={SearchUserDataRenderItem}
          keyExtractor={item => item._id}
          ListHeaderComponent={() => (
            <Text style={styles.header}>Search Results</Text>
          )}
        />
      )}
    </SafeAreaView>
  );
};

// Styles for the FlatList items and overall layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
});

export default Abc;
