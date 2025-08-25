import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import ProfileAvatar from '../../components/letterProfileComponent';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import style from './style';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const AlertsScreen = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  const navigation = useNavigation();
  const topModalBottomSheetRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [requestResponses, setRequestResponses] = useState({});

  console.log(' === notifications__ ===> ', notifications);

  // Fetch notifications page-wise
  const fetchNotifications = async (pageNumber = 1, isRefresh = false) => {
    if (!accessToken || loading) {
      return;
    }

    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await fetch(
        `https://stag.mntech.website/api/v1/user/notification/get-notification-byid?page=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const data = await res.json();

      const newResults = data.data?.results || [];

      if (isRefresh) {
        setNotifications(newResults);
      } else {
        setNotifications(prev => [...prev, ...newResults]);
      }

      setPage(data.data.page);
      setHasNextPage(data.data.hasNextPage);
    } catch (error) {
      console.error('Notification fetch error:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchNotifications(1, true);
    }, [accessToken]),
  );

  const handleLoadMore = () => {
    if (!loading && hasNextPage) {
      fetchNotifications(page + 1);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    fetchNotifications(1, true);
  };

  const handleFriendRequestResponse = async (
    userId,
    requestId,
    status,
    notificationId,
  ) => {
    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/friend/respond-friend-req',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            user: userId,
            request: requestId,
            status,
          }),
        },
      );

      const data = await response.json();

      setRequestResponses(prev => ({...prev, [notificationId]: status}));
    } catch (error) {
      console.error('Friend request response error:', error.message);
    }
  };

  const handleClearNotifications = async () => {
    try {
      setLoading(true);
      await fetch(
        'https://stag.mntech.website/api/v1/user/notification/delete-notification-byid',
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      setNotifications([]);
    } catch (error) {
      console.error('Clear notification error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const onDeclineNumberRequestedPress = async item => {
    try {
      console.log(' === onDeclineNumberRequestedPress ===> ', item?.reqId);

      const res = await fetch(
        `https://stag.mntech.website/api/v1/user/mobile-number-request/reject/${item?.reqId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = await res.json();
      console.log('Reject Response ===> ', data);

      if (res.ok) {
        // ✅ Optionally update UI state to hide buttons
        setRequestResponses(prev => ({
          ...prev,
          [item.id]: 'rejected',
        }));
      } else {
        console.error('Reject API failed:', data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Reject API error:', error.message);
    }
  };

  const onAcceptedNumberRequestedPress = async item => {
    try {
      console.log(' === onAcceptedNumberRequestedPress ===> ', item?.reqId);

      const res = await fetch(
        `https://stag.mntech.website/api/v1/user/mobile-number-request/accept/${item?.reqId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = await res.json();
      console.log('Reject Response ===> ', data);

      if (res.ok) {
        // ✅ Optionally update UI state to hide buttons
        setRequestResponses(prev => ({
          ...prev,
          [item.id]: 'accepted',
        }));
      } else {
        console.error('Reject API failed:', data?.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Reject API error:', error.message);
    }
  };

  const getCompactTimeAgo = createdAt => {
    const now = new Date();
    const past = new Date(createdAt);
    const diff = Math.floor((now - past) / 1000);
    if (diff < 60) {
      return 'just now';
    }
    const mins = Math.floor(diff / 60);
    if (mins < 60) {
      return `${mins}m ago`;
    }
    const hours = Math.floor(mins / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days}d ago`;
    }
    return `${Math.floor(days / 7)}w ago`;
  };

  const handlePress = item => {
    const userData = {
      firstName: item?.otherUserId?.name,
      id: item?.otherUserId?.id,
    };
    navigation.navigate('NewUserDetailsScreen', {matchesUserData: userData});
  };

  const getSubtitleText = (item, requestState) => {
    // Friend request
    if (item.title === 'Sent you a request') {
      if (requestState === 'accepted') {
        return 'Accepted your request';
      }
      if (requestState === 'rejected') {
        return 'Declined your request';
      }
      return 'Sent you a request';
    }

    // Mobile number request
    if (item.title === 'Mobile Number Request') {
      if (requestState === 'rejected') {
        return 'Request Rejected';
      }
      // If you add accept later, you can handle it:
      if (requestState === 'accepted') {
        return 'Request Accepted';
      }
      return 'Mobile Number Request';
    }

    // Fallback to original title
    return item.title || '';
  };

  const renderItem = ({item}) => {
    const requestState = requestResponses[item.id];

    console.log(' === requestState ===> ', requestState);

    const name = item?.otherUserId?.name
      ? item?.otherUserId?.name.charAt(0).toUpperCase() +
        item?.otherUserId?.name.slice(1).toLowerCase()
      : 'N/A';

    // const name = item?.otherUserId?.name || 'User';
    const notificationId = item.id;

    return (
      <View style={{flexDirection: 'row', padding: 10}}>
        {item.otherUserId?.profilePic ? (
          <Image
            source={{uri: item.otherUserId.profilePic}}
            style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}}
          />
        ) : (
          <ProfileAvatar
            firstName={name}
            textStyle={{
              width: 50,
              height: 50,
              borderRadius: 25,
              marginRight: 10,
            }}
            profileTexts={{fontSize: fontSize(20)}}
          />
        )}

        <View style={{flex: 1}}>
          <TouchableOpacity onPress={() => handlePress(item)}>
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins600,
              }}>
              {name}
            </Text>

            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(12),
                lineHeight: hp(18),
                fontFamily: fontFamily.poppins400,
              }}>
              {getSubtitleText(item, requestState)}
            </Text>
          </TouchableOpacity>

          {item.title === 'Sent you a request' && !requestState && (
            <View style={{flexDirection: 'row', marginTop: 6}}>
              <TouchableOpacity
                onPress={() =>
                  handleFriendRequestResponse(
                    item.userId,
                    item.reqId,
                    'rejected',
                    notificationId,
                  )
                }
                style={{
                  backgroundColor: '#EEEEEE',
                  borderRadius: 20,
                  width: 96,
                  height: 40,
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Decline
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  handleFriendRequestResponse(
                    item.userId,
                    item.reqId,
                    'accepted',
                    notificationId,
                  )
                }>
                <LinearGradient
                  colors={['#9413D0', '#0D4EB3']}
                  start={{x: 1, y: 0}}
                  end={{x: 0, y: 0}}
                  style={{
                    borderRadius: 20,
                    justifyContent: 'center',
                    width: 96,
                    height: 40,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Accept
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {item.title === 'Mobile Number Request' && !requestState && (
            <View style={{flexDirection: 'row', marginTop: 6}}>
              <TouchableOpacity
                onPress={() => onDeclineNumberRequestedPress(item)}
                style={{
                  backgroundColor: '#EEEEEE',
                  borderRadius: 20,
                  width: 96,
                  height: 40,
                  justifyContent: 'center',
                  marginRight: 14,
                }}>
                <Text
                  style={{
                    color: 'black',
                    textAlign: 'center',
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Decline
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onAcceptedNumberRequestedPress(item)}>
                <LinearGradient
                  colors={['#9413D0', '#0D4EB3']}
                  start={{x: 1, y: 0}}
                  end={{x: 0, y: 0}}
                  style={{
                    borderRadius: 20,
                    justifyContent: 'center',
                    width: 96,
                    height: 40,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Accept
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <Text style={{color: '#D1D1D1', fontSize: fontSize(12)}}>
          {getCompactTimeAgo(item.createdAt)}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      {/*<NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />*/}
      <View style={style.bodyContainer}>
        <View
          style={{
            marginTop: hp(16),
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: hp(20),
          }}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins400,
              marginLeft: wp(120),
            }}>
            All Notifications
          </Text>
          {notifications.length > 0 && (
            <TouchableOpacity
              onPress={handleClearNotifications}
              style={{
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins400,
                  color: colors.blue,
                  marginRight: 4,
                }}>
                Clear
              </Text>
              {/*<Image
      source={icons.clear_delete_icon}
      style={{width: 16, height: 16, tintColor: colors.blue}}
    />*/}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{marginHorizontal: 17, flex: 1}}>
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.id?.toString() ?? index.toString()
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
          onRefresh={handleRefresh}
          ListFooterComponent={
            loading && page > 1 ? (
              <ActivityIndicator size="small" color={colors.blue} />
            ) : null
          }
          ListEmptyComponent={
            !loading && (
              <View
                style={{
                  justifyContent: 'center',
                  alignSelf: 'center',
                  alignItems: 'center',
                  marginTop: hp(150),
                }}>
                <Image
                  source={icons.no_notification_icon}
                  style={{
                    width: hp(250),
                    height: hp(200),
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    fontSize: fontSize(18),
                    fontFamily: fontFamily.poppins600,
                    color: colors.black,
                  }}>
                  No Notifications
                </Text>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(18),
                    lineHeight: hp(28),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  New notification will appear here.
                </Text>
              </View>
            )
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default AlertsScreen;
