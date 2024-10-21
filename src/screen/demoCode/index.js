import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  ActivityIndicator,
  View,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';

import {icons} from '../../assets'; // Ensure you have icons properly imported

const DemoCode = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isShortlistProcessing, setIsShortlistProcessing] = useState(null); // Track the current processing item

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  // Function to fetch data from the API
  const fetchData = async (pageNumber = 1) => {
    if (!hasMoreData) {
      return;
    }

    try {
      console.log('Fetching data for page:', pageNumber);
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/user/getUserByGender?page=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const json = await response.json();
      const newData = json?.data[0]?.paginatedResults || [];

      if (newData.length === 0) {
        setHasMoreData(false);
      } else {
        setData(prevData => [...prevData, ...newData]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMoreData = () => {
    if (!isFetchingMore && hasMoreData) {
      setIsFetchingMore(true);
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchData(nextPage);
        return nextPage;
      });
    }
  };

  // API call to shortlist a user
  const addToShortlist = async shortlistId => {
    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/shortlist/create-shortlist',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({shortlistId}),
        },
      );

      const result = await response.json();
      if (response.ok) {
        return true;
      } else {
        throw new Error(result.message || 'Error adding user to shortlist');
      }
    } catch (error) {
      console.error('Error adding to shortlist:', error.message);
      Alert.alert('Error', 'Failed to add to shortlist. Please try again.');
      return false;
    }
  };

  // API call to remove user from shortlist
  const removeFromShortlist = async deleteId => {
    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${deleteId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const result = await response.json();
      if (response.ok) {
        return true;
      } else {
        throw new Error(result.message || 'Error removing user from shortlist');
      }
    } catch (error) {
      console.error('Error removing from shortlist:', error.message);
      Alert.alert(
        'Error',
        'Failed to remove from shortlist. Please try again.',
      );
      return false;
    }
  };

  const handleShortlistPress = async item => {
    const isShortlisted = !!item.userShortListDetails;
    const shortlistId = item._id;

    setIsShortlistProcessing(shortlistId); // Set processing state for the current item

    if (isShortlisted) {
      const success = await removeFromShortlist(item.userShortListDetails._id);
      if (success) {
        setData(prevData =>
          prevData.map(user =>
            user._id === item._id
              ? {
                  ...user,
                  userShortListDetails: null,
                }
              : user,
          ),
        );
      }
    } else {
      const success = await addToShortlist(shortlistId);
      if (success) {
        setData(prevData =>
          prevData.map(user =>
            user._id === item._id
              ? {
                  ...user,
                  userShortListDetails: {_id: shortlistId},
                }
              : user,
          ),
        );
      }
    }

    setIsShortlistProcessing(null); // Reset processing state after the API call
  };

  const renderUserItem = ({item}) => {
    const defaultImage = require('../../assets/images/empty_Male_img.jpg');

    const shortlistIconSource = item.userShortListDetails
      ? icons.upgradeIcon
      : icons.starIcon;

    const isProcessing = isShortlistProcessing === item._id;

    return (
      <View style={styles.userContainer}>
        <View>
          <Image
            source={item.profilePic ? {uri: item.profilePic} : defaultImage}
            style={styles.userImage}
          />

          <TouchableOpacity
            style={{position: 'absolute', right: 20, top: 18}}
            onPress={() => handleShortlistPress(item)}
            disabled={isProcessing}>
            {/* Disable button while processing */}
            <Image
              source={shortlistIconSource}
              style={{
                width: 20,
                height: 20,
                opacity: isProcessing ? 0.5 : 1, // Show opacity if processing
              }}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.userName}>{item.name}</Text>
      </View>
    );
  };

  if (loading && page === 1) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderUserItem}
        keyExtractor={(item, index) =>
          (item._id || item.id || item.name) + index
        }
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        horizontal={true}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={styles.footerContainer}>
              <Text>Loading Data...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading && !isFetchingMore ? (
            <View style={styles.emptyListContainer}>
              <Text>No data available</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyListContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  userImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
    margin: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconStyle: {
    width: 20,
    height: 20,
    marginHorizontal: 10,
  },
  footerContainer: {
    alignItems: 'center',
  },
  listContainer: {
    paddingBottom: 200,
  },
});

export default DemoCode;
