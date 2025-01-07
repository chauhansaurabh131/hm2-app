import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {icons} from '../../assets';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import axios from 'axios';
import {colors} from '../../utils/colors';
import {accepted_Decline_Request} from '../../actions/homeActions';

const Abc = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [requestStatus, setRequestStatus] = useState(null);

  // console.log(' === var ===> ', data);

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const dispatch = useDispatch();

  const fetchData = async (pageNumber = 1) => {
    if (!hasMoreData) {
      return;
    }

    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/friend/get-rejected-frds?page=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const json = await response.json();
      console.log('API response:', json);

      const newData = json?.data?.results || [];
      setHasMoreData(json?.data?.hasNextPage || false);

      setData(prevData => [...prevData, ...newData]);
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

  // const handleShortListPress = async item => {
  //   const shortlistId = item?.shortlistData?._id;
  //   const createId = item?.user?._id;
  // };

  const handleShortListPress = async item => {
    const shortlistId = item?.shortlistData?._id ?? item?.shortlistData?._id;
    const userId = item?.user?._id; // Ensure you're using the correct ID

    console.log(' === var ===> ', {item, shortlistId});

    if (shortlistId) {
      // If the item is already shortlisted, remove it from the shortlist
      try {
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${shortlistId}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const result = await response.json();

        if (response.ok) {
          // Successfully removed from shortlist
          Alert.alert('Success', 'Removed from shortlist');

          // Update the data by removing the shortlistData
          setData(prevData => {
            return prevData.map(dataItem => {
              console.log(
                ' === 111 ===> ',
                dataItem.shortlistData?._id,
                shortlistId,
              );
              return dataItem.shortlistData?._id === shortlistId
                ? {...dataItem, shortlistData: null} // Remove shortlistData
                : dataItem;
            });
          });
        } else {
          Alert.alert('Error', 'Failed to remove from shortlist');
        }
      } catch (error) {
        console.error('Error removing from shortlist:', error);
        Alert.alert('Error', 'Failed to remove from shortlist');
      }
    } else {
      // If the item is not shortlisted, create a new shortlist
      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/shortlist/create-shortlist',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              shortlistId: userId, // Correctly passing the userId
            }),
          },
        );

        const result = await response.json();

        if (response.ok) {
          // Successfully added to shortlist
          Alert.alert('Success', 'Added to shortlist');

          // Update the data with the new shortlist data
          setData(prevData => {
            return prevData.map(dataItem => {
              return dataItem.user?._id === userId
                ? {
                    ...dataItem,
                    shortlistData: {_id: result?.data?.id, ...result.data},
                  } // Add the shortlistData
                : dataItem;
            });
          });
        } else {
          Alert.alert('Error', 'Failed to add to shortlist');
        }
      } catch (error) {
        console.error('Error adding to shortlist:', error);
        Alert.alert('Error', 'Failed to add to shortlist');
      }
    }
  };

  const onBlockPress = async item => {
    console.log(' === onBlockPress ===> ', item?.friend?._id);

    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/friend/block-user',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            friend: item?.user?._id,
            user: userId,
          }),
        },
      );

      if (response.status === 200) {
        // setIsBlockModalVisible(false);
        setData(prevData =>
          prevData.filter(dataItem => dataItem.user?._id !== item?.user?._id),
        );
      } else {
        const errorResponse = await response.json();
        console.error('Block failed:', errorResponse);
        Alert.alert('Error', 'Failed to block the user.');
      }
    } catch (error) {
      console.error('Error during API call:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const renderAcceptedUserItem = ({item}) => {
    // console.log(' === shortlistData ===> ', item?.shortlistData);

    const profilePic = item?.user?.profilePic || 'default-image-url';
    const name = item?.user?.firstName || item?.user?.name || 'Unknown';

    const starIconSource = item?.shortlistData
      ? icons.black_check_icon
      : icons.black_start_icon;

    return (
      <SafeAreaView style={{marginLeft: 20, marginTop: 20}}>
        <Image
          source={{uri: profilePic}}
          style={{width: 150, height: 150, borderRadius: 10}}
        />
        <Text style={{marginTop: 5, marginLeft: 50}}>{name}</Text>

        <TouchableOpacity
          onPress={() => handleShortListPress(item)}
          activeOpacity={0.5}
          style={{width: 50, height: 50, marginTop: 15, marginLeft: 50}}>
          <Image source={starIconSource} style={{width: 30, height: 30}} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            onBlockPress(item);
          }}>
          <Text style={{marginLeft: 50, marginBottom: 10}}>Blocked</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  };

  return (
    <SafeAreaView>
      {loading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderAcceptedUserItem}
          keyExtractor={(item, index) =>
            item?._id || item?.id || `item-${index}`
          }
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={
            isFetchingMore ? (
              <View style={{alignItems: 'center', marginVertical: 10}}>
                <Text style={{color: 'black'}}>Loading Data...</Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View style={{alignItems: 'center', marginTop: 20}}>
                <Text style={{color: 'black', fontSize: 16}}>
                  No profiles found.
                </Text>
              </View>
            )
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Abc;
