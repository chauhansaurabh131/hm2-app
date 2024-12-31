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
import {useSelector} from 'react-redux';
import {icons} from '../../assets';
import {hp} from '../../utils/helpers';
import axios from 'axios';

const Abc = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const fetchData = async (pageNumber = 1) => {
    if (!hasMoreData) {
      return;
    }

    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/shortlist/get-short-list-paginat/${userId}?page=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const json = await response.json();
      console.log('API response:', json);

      const newData = json?.data?.[0]?.paginatedResults || [];
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
      const nextPage = page + 1;
      setPage(nextPage);
      fetchData(nextPage);
    }
  };

  const renderAcceptedUserItem = ({item}) => {
    console.log(' === var ===> ', item);
    const profilePic = item?.user?.profilePic || 'default-image-url';
    const name = item?.friendList?.firstName || item?.user?.name || 'Unknown';
    const starIconSource = item.shortlistId
      ? icons.black_check_icon
      : icons.black_start_icon;

    return (
      <SafeAreaView style={{marginLeft: 20, marginTop: 20}}>
        <Image
          source={{uri: profilePic}}
          style={{width: 150, height: 150, borderRadius: 10}}
        />
        <Text style={{marginTop: 5}}>{name}</Text>
        <TouchableOpacity
          // onPress={() => handleShortListPress(item)}
          style={{
            width: hp(30),
            height: hp(30),
            backgroundColor: '#282727',
            borderRadius: 50,
            marginTop: 5,
            marginLeft: 30,
            marginBottom: 50,
          }}>
          <Image
            source={starIconSource}
            style={{width: hp(30), height: hp(30), resizeMode: 'contain'}}
          />
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
                <Text style={{color: 'black'}}>Loading Data..</Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Abc;
