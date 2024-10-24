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
import {useDispatch, useSelector} from 'react-redux';

import {icons} from '../../assets';
import {
  accepted_Decline_Request,
  getAllRequest,
  sendRequest,
} from '../../actions/homeActions';
import {getAllFriends} from '../../actions/chatActions'; // Ensure you have icons properly imported

const DemoCode = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [isShortlistProcessing, setIsShortlistProcessing] = useState(null); // Track the current processing item
  const [likedItems, setLikedItems] = useState({}); // To track liked items

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const dispatch = useDispatch();

  // console.log(' === accessToken ===> ', accessToken);

  // Function to fetch data from the API
  const fetchData = async (pageNumber = 1) => {
    if (!hasMoreData) {
      return;
    }

    try {
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
        setHasMoreData(false); // No more data to fetch
      } else {
        setData(prevData => {
          const mergedData = [...prevData];
          newData.forEach(newItem => {
            if (!mergedData.some(item => item._id === newItem._id)) {
              mergedData.push(newItem); // Avoid duplicates
            }
          });
          return mergedData; // Update with merged data
        });
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
        fetchData(nextPage); // Fetch more data when reaching the end
        return nextPage;
      });
    }
  };

  const likeOrUnlikeUser = async (likedUserId, isAlreadyLiked, deleteId) => {
    console.log(
      ' === likedUserId, isAlreadyLiked,deleteId ===> ',
      likedUserId,
      isAlreadyLiked,
      deleteId,
    );

    try {
      const url = isAlreadyLiked
        ? `https://stag.mntech.website/api/v1/user/like/update-like/${deleteId}`
        : 'https://stag.mntech.website/api/v1/user/like/create-like';
      const method = isAlreadyLiked ? 'PUT' : 'POST';
      const body = JSON.stringify({
        likedUserId,
        isLike: !isAlreadyLiked,
      });

      console.log(`Calling ${isAlreadyLiked ? 'PUT' : 'POST'} API for like`);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body,
      });

      const result = await response.json();
      console.log('Response:', result);

      if (response.ok) {
        return !isAlreadyLiked; // Toggle the like state
      } else {
        throw new Error(result.message || 'Error liking user');
      }
    } catch (error) {
      console.error('Error liking/unliking user:', error.message);
      // Alert.alert('Error', 'Failed to like/unlike user. Please try again.');
      return null;
    }
  };

  const handleLikePress = async item => {
    const deleteId = item?.userLikeDetails?._id;
    const isAlreadyLiked = item?.userLikeDetails?.isLike || false;

    const success = await likeOrUnlikeUser(
      item._id || item.id,
      isAlreadyLiked,
      deleteId,
    );

    if (success !== null) {
      // After a successful API call, update the state to trigger a re-render
      setData(prevData =>
        prevData.map(user =>
          user._id === item._id
            ? {
                ...user,
                userLikeDetails: {
                  ...user.userLikeDetails,
                  isLike: success, // Toggle the like state in the UI
                },
              }
            : user,
        ),
      );
    }
  };

  // SEND REQUEST FUNCTION
  const onFriendRequestButtonPress = async item => {
    console.log(' === onFriendRequestButtonPress ===> ', item?.friendsDetails);

    const requestId = item?.friendsDetails?._id;

    console.log(' === Friend Request ID ===> ', requestId);

    // Check if the status is 'accepted'
    if (item?.friendsDetails?.status === 'accepted') {
      // If the status is 'accepted', remove the friend request
      try {
        await dispatch(
          accepted_Decline_Request({
            user: item?._id,
            request: requestId, // Use the existing request ID
            status: 'removed',
          }),
        );

        // Update the UI after removing the friend request
        setData(prevData =>
          prevData.map(userItem =>
            userItem._id === item._id
              ? {
                  ...userItem,
                  friendsDetails: {
                    ...userItem.friendsDetails,
                    status: 'none', // Update status locally to reflect removal
                  },
                }
              : userItem,
          ),
        );
      } catch (error) {
        console.error('Error removing friend request:', error);
        Alert.alert(
          'Error',
          'Failed to remove friend request. Please try again.',
        );
      }
    } else if (item?.friendsDetails?.status === 'requested') {
      // If the status is 'requested', reject the friend request
      try {
        await dispatch(
          accepted_Decline_Request({
            user: item?._id,
            request: requestId, // Use the existing request ID
            status: 'removed',
          }),
        );

        // Update the UI after rejecting the request
        setData(prevData =>
          prevData.map(userItem =>
            userItem._id === item._id
              ? {
                  ...userItem,
                  friendsDetails: {
                    ...userItem.friendsDetails,
                    status: 'none', // Update status locally to reflect rejection
                  },
                }
              : userItem,
          ),
        );
      } catch (error) {
        console.error('Error rejecting friend request:', error);
        Alert.alert(
          'Error',
          'Failed to reject friend request. Please try again.',
        );
      }
    } else {
      // Otherwise, send a new friend request
      try {
        const token = user?.tokens?.access?.token;

        await dispatch(sendRequest({friend: item?._id, user: user.user.id}));

        // Update the specific item in the data array to reflect the friend request status
        setData(prevData =>
          prevData.map(userItem =>
            userItem._id === item._id
              ? {
                  ...userItem,
                  friendsDetails: {
                    ...userItem.friendsDetails,
                    status: 'requested', // Update the status locally
                  },
                }
              : userItem,
          ),
        );
      } catch (error) {
        console.error('Error sending friend request:', error);
        Alert.alert(
          'Error',
          'Failed to send friend request. Please try again.',
        );
      }
    }
  };

  const renderUserItem = ({item}) => {
    console.log(' === renderUserItem ===> ', item);
    const defaultImage = require('../../assets/images/empty_Male_img.jpg');
    const friendStatus = item?.friendsDetails?.status;

    const likeIconSource = item?.userLikeDetails?.isLike
      ? icons.new_user_like_icon // Show this if user liked the item
      : icons.new_like_icon;

    const friendIconSource =
      friendStatus === 'accepted'
        ? icons.new_user_send_icon // Request already accepted
        : friendStatus === 'requested'
        ? icons.new_user_send_icon // Request already sent, allow for rejection
        : icons.new_send_icon; // No request sent, allow sending a request

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

        {/* Like icon changes based on whether the user has been liked */}
        <TouchableOpacity onPress={() => handleLikePress(item)}>
          <Image
            source={likeIconSource}
            style={{width: 32, height: 20, marginTop: 10}}
          />
        </TouchableOpacity>
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
