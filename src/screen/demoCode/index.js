import React, {useCallback, useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';

const DemoCode = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchProfile = useCallback(
    async (page = 1) => {
      if (!userId || !accessToken) {
        return;
      }

      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/profile-viewer/get-profile-viewerv2/${userId}?page=${page}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        const newProfiles = data?.data[0]?.paginatedResults || [];
        const total = data?.data[0]?.totalPages || 1;

        if (page === 1) {
          setProfileData(newProfiles);
        } else {
          setProfileData(prev => [...prev, ...newProfiles]);
        }
        setTotalPages(total);
        setCurrentPage(page);
      } catch (error) {
        console.error('Error fetching profile data:', error.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [userId, accessToken],
  );

  useEffect(() => {
    fetchProfile(1);
  }, [fetchProfile]);

  const loadMoreProfiles = () => {
    if (!loadingMore && currentPage < totalPages) {
      fetchProfile(currentPage + 1);
    }
  };

  const renderItem = ({item}) => {
    const user = item?.user;

    return (
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 15,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
        }}>
        {/* Profile Image */}
        {}
        <Image
          source={
            user?.profilePic
              ? {uri: user.profilePic}
              : require('../../assets/images/demo_7.png') // add default image
          }
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            marginRight: 15,
          }}
        />

        {/* Name */}
        <View>
          <Text style={{fontSize: 16, fontWeight: '600', color: 'black'}}>
            {user?.firstName || ''} {user?.lastName || ''}
          </Text>

          {/* Optional: City */}
          <Text style={{color: '#777', marginTop: 4}}>
            {user?.address?.currentCity || ''}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <FlatList
        data={profileData}
        extraData={profileData}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 200}}
        ListEmptyComponent={
          <Text style={{marginTop: 20, textAlign: 'center', color: '#888'}}>
            No profiles viewed recently.
          </Text>
        }
        onEndReached={loadMoreProfiles}
        showsVerticalScrollIndicator={false}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default DemoCode;
