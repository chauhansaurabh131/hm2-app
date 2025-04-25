import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {style} from '../matchesAllScreen/matchesInAcceptedScreen/style';
import {icons, images} from '../../assets';
import {hp} from '../../utils/helpers';
import axios from 'axios';

const DemoCode = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  // Function to fetch data from the API
  const fetchData = async (pageNumber = 1) => {
    if (!hasMoreData) {
      return;
    }

    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/friend/get-request-sent?page=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const json = await response.json();
      const newData = json?.data?.results || [];
      const combinedData = [...data, ...newData];

      // Deduplicate based on _id
      const uniqueData = Array.from(
        new Map(combinedData.map(item => [item._id, item])).values(),
      );

      setData(uniqueData);
      setHasMoreData(json?.data?.hasNextPage || false);
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
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage);
    }
  };

  const addToShortlist = async shortlistId => {
    try {
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/shortlist/create-shortlist',
        {shortlistId},
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('Shortlist created successfully:', response.data);

      // Update the state immutably and ensure the new shortlist data is associated with the user
      setData(prevData => {
        return prevData.map(user =>
          user?.friendList?._id === shortlistId
            ? {
                ...user,
                friendList: {
                  ...user.friendList,
                  userShortListDetails: response.data.data, // Updated shortlist details
                },
              }
            : user,
        );
      });

      // Optionally, trigger another API to refresh the list if needed
      // fetchNewUserData(); // Re-fetch user data
    } catch (error) {
      console.error('Error adding to shortlist:', error);
      Alert.alert('Error', 'Failed to add to shortlist.');
    }
  };

  const removeFromShortlist = async shortlistId => {
    try {
      // Call the remove from shortlist API
      const response = await axios.delete(
        `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${shortlistId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log('Shortlist removed successfully:', response.data?.data);

      // Directly update the state to remove the shortlist details without re-fetching data
      setData(prevData => {
        return prevData.map(user =>
          // Ensure you are checking for the correct ID
          user?.friendList?.userShortListDetails?.id === shortlistId
            ? {
                ...user,
                friendList: {
                  ...user?.friendList,
                  userShortListDetails: {}, // Set to null after removal
                },
              }
            : user,
        );
      });
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      Alert.alert('Error', 'Failed to remove from shortlist.');
    }
  };

  const renderAccptedUserItem = ({item}) => {
    const profileImage = item?.friendList?.profilePic;
    // console.log(' === profileImage ===> ', profileImage);

    console.log(
      ' === shortlistData ===> ',
      item?.friendList?.userShortListDetails?.id,
    );

    const starIconSource = item?.friendList?.userShortListDetails?.id
      ? icons.black_check_icon // Check icon if shortlisted
      : icons.black_start_icon; // Star icon if not shortlisted

    return (
      <View style={{marginHorizontal: 17, marginTop: 20}}>
        <View style={{flexDirection: 'row'}}>
          <Image
            source={
              profileImage ? {uri: profileImage} : images.empty_male_Image
            }
            style={{width: 150, height: 150, borderWidth: 10}}
            resizeMode={'cover'}
          />

          <Text
            style={{
              marginLeft: 10,
              color: 'black',
              textAlign: 'center',
              alignItems: 'center',
            }}>
            {item?.friendList?.firstName}
          </Text>

          <TouchableOpacity
            onPress={() => {
              if (item?.friendList?.userShortListDetails?.id) {
                // If the user is already in the shortlist, remove them
                removeFromShortlist(item?.friendList?.userShortListDetails.id);
              } else {
                // If the user is not in the shortlist, add them
                addToShortlist(item?.friendList?._id);
              }
            }}
            style={{position: 'absolute', right: 0, padding: 10}}>
            <Image
              source={starIconSource}
              style={{width: hp(18), height: hp(18), resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        data={data}
        renderItem={renderAccptedUserItem}
        keyExtractor={item => item._id || item.id || item.name}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={{alignItems: 'center', padding: 10}}>
              <Text style={{color: 'black'}}>Loading more data...</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading && !isFetchingMore ? (
            <View style={style.emptyListContainer}>
              <View style={style.emptyListBody}>
                <Image
                  source={icons.no_Profile_Found_img}
                  style={style.noImage}
                />
                <Text style={style.noImageText}>No Profiles Found</Text>
              </View>
            </View>
          ) : null
        }
        contentContainerStyle={style.listContainer}
      />
    </SafeAreaView>
  );
};
export default DemoCode;
