import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  FlatList,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {images} from '../../assets';
import {userDatas} from '../../actions/homeActions';

const DatingHomeScreen = () => {
  const {userData, isUserDataLoading} = useSelector(state => state.home);
  const dispatch = useDispatch();

  // State to track the current page and total users
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]); // Store combined users here
  const [loadingMore, setLoadingMore] = useState(false); // Track if loading more data

  const totalPages = userData?.data?.totalPages || 1;

  // Load initial data (first page) when the component mounts
  useEffect(() => {
    dispatch(userDatas({page: 1})); // Load the first page on mount
  }, []);

  // Update the users list when userData changes
  useEffect(() => {
    if (userData?.data?.users) {
      if (currentPage === 1) {
        // On the first page, replace users
        setUsers(userData.data.users);
      } else {
        // On other pages, append users
        setUsers(prevUsers => [...prevUsers, ...userData.data.users]);
      }
      setLoadingMore(false); // Stop loading after data is appended
    }
  }, [userData]);

  // Function to load more data when the end is reached
  const loadMoreData = () => {
    if (currentPage < totalPages && !loadingMore) {
      setLoadingMore(true); // Start loading
      setCurrentPage(prevPage => prevPage + 1); // Increment page
      dispatch(userDatas({page: currentPage + 1})); // Fetch the next page
    }
  };

  const renderItem = ({item}) => (
    <View style={styles.userContainer}>
      <Image
        source={
          item?.profilePic ? {uri: item?.profilePic} : images.empty_male_Image
        }
        style={styles.userImage}
      />
      <Text style={styles.userName}>{item.name}</Text>
    </View>
  );

  const renderFooter = () => {
    if (loadingMore) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
    return null; // No more data or still loading, no footer needed
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListFooterComponent={renderFooter} // Show loading spinner when loading more data
        onEndReached={loadMoreData} // Trigger load more when the end is reached
        onEndReachedThreshold={0.5} // How close to the end the user must scroll before loading more data
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  userImage: {
    width: 80,
    height: 80,
    borderRadius: 25,
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    color: 'black',
  },
});

export default DatingHomeScreen;
