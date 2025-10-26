import React, {useState, useCallback} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  ActivityIndicator,
  View,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useFocusEffect} from '@react-navigation/native';

const Abc = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  const [data, setData] = useState([]); // full list
  const [loadings, setLoadings] = useState(false); // for first load
  const [loadingMores, setLoadingMores] = useState(false); // for pagination loader
  const [pages, setPages] = useState(1); // current page
  const [hasMores, setHasMores] = useState(true); // check if more data exists

  const fetchAccepted = async (pageNum = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMores(true);
      } else {
        setLoadings(true);
      }

      const response = await axios.get(
        `https://stag.mntech.website/api/v1/user/friend/get-frd-mobile?page=${pageNum}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const newData = response.data?.data?.results || [];
      const totalPages = response.data?.data?.totalPages || 1;

      if (isLoadMore) {
        setData(prev => [...prev, ...newData]);
      } else {
        setData(newData);
      }

      setHasMores(pageNum < totalPages);
    } catch (error) {
      console.error(
        'Error fetching requests:',
        error.response?.data || error.message,
      );
    } finally {
      setLoadings(false);
      setLoadingMores(false);
    }
  };

  // Call API when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setPages(1);
      fetchAccepted(1, false);
    }, [accessToken]),
  );

  const loadMores = () => {
    if (!loadingMores && hasMores) {
      const nextPage = pages + 1;
      setPages(nextPage);
      fetchAccepted(nextPage, true);
    }
  };

  const renderItem = ({item}) => {
    const profilePic = item?.friendList?.profilePic;
    const userName = item?.friendList?.name || 'No Name';

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
          borderBottomWidth: 1,
          borderColor: '#ddd',
        }}>
        {profilePic ? (
          <Image
            source={{uri: profilePic}}
            style={{
              width: 100,
              height: 100,
              borderRadius: 30,
              marginRight: 10,
            }}
          />
        ) : (
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              marginRight: 10,
              backgroundColor: '#ccc',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>
              {userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <Text style={{fontSize: 16, fontWeight: '500'}}>{userName}</Text>
      </View>
    );
  };

  return (
    // <SafeAreaView style={{flex: 1}}>
    <SafeAreaView style={{}}>
      {loadings && !loadingMores ? (
        <ActivityIndicator size="large" style={{marginTop: 20}} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderItem}
          onEndReached={loadMores} // triggered when scrolling to bottom
          onEndReachedThreshold={0.5} // load more when 50% away from bottom
          ListEmptyComponent={
            <Text style={{textAlign: 'center', marginTop: 20}}>
              No requests found
            </Text>
          }
          ListFooterComponent={
            loadingMores ? (
              <ActivityIndicator style={{margin: 10}} size="small" />
            ) : null
          }
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: 120}}
        />
      )}
    </SafeAreaView>
  );
};

export default Abc;
