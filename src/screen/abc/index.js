import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';

const Abc = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [declinedRequests, setDeclinedRequests] = useState({});
  const [requestResponses, setRequestResponses] = useState({});

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const fetchNotification = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/notification/get-notification-byid',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch notifications');
        }

        const data = await response.json();
        console.log('Notification data:', data);
        setNotification(data.data?.results || []);
      } catch (error) {
        console.error('Error fetching notification:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotification();
  }, [accessToken]);

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

      if (!response.ok) {
        throw new Error('Failed to respond to friend request');
      }

      const data = await response.json();
      console.log('Friend request response:', data);

      setRequestResponses(prev => ({...prev, [notificationId]: status}));
    } catch (error) {
      console.error('Error responding to friend request:', error.message);
    }
  };

  const handleFriendRequestAccepted = async (
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
            status: status,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Failed to respond to friend request');
      }

      const data = await response.json();
      console.log('Friend request response:', data);

      // ✅ Mark as declined
      setRequestResponses(prev => ({...prev, [notificationId]: status}));
    } catch (error) {
      console.error('Error responding to friend request:', error.message);
    }
  };

  const handleClearNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/notification/delete-notification-byid',
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to clear notifications');
      }

      console.log('Notifications cleared');
      setNotification([]); // Clear UI list
    } catch (error) {
      console.error('Error clearing notifications:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const groupNotificationsByDate = notifications => {
    const grouped = {};

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (d1, d2) =>
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear();

    notifications.forEach(item => {
      const date = new Date(item.createdAt);
      let label = '';

      if (isSameDay(date, today)) {
        label = 'Today';
      } else if (isSameDay(date, yesterday)) {
        label = 'Yesterday';
      } else {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        label = `${day}-${month}-${year}`;
      }

      if (!grouped[label]) {
        grouped[label] = [];
      }

      grouped[label].push(item);
    });

    // Flatten to an array with headers
    const finalList = [];
    Object.entries(grouped).forEach(([label, items]) => {
      finalList.push({type: 'header', label});
      items.forEach(item => {
        finalList.push({type: 'item', data: item});
      });
    });

    return finalList;
  };

  const groupedData = groupNotificationsByDate(notification);

  const renderItem = ({item}) => {
    if (item.type === 'header') {
      return (
        <View style={{marginVertical: 10}}>
          <Text
            style={{
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins600,
              color: '#888',
            }}>
            {item.label}
          </Text>
        </View>
      );
    }

    const notification = item.data;

    return (
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', padding: 10, flex: 1}}>
          <Image
            source={{uri: notification?.otherUserId?.profilePic}}
            style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}}
          />
          <View style={{flex: 1}}>
            <TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginTop: 3,
                }}>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins600,
                  }}>
                  {notification?.otherUserId?.name}
                </Text>
              </View>

              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(12),
                  lineHeight: hp(18),
                  fontFamily: fontFamily.poppins400,
                }}>
                {requestResponses[notification.id] === 'accepted'
                  ? 'Accepted your request'
                  : requestResponses[notification.id] === 'rejected'
                  ? 'Declined your request'
                  : notification.title}
              </Text>
            </TouchableOpacity>

            {/* Accept / Not Now buttons */}
            {notification.title === 'Sent you a request' &&
              !requestResponses[notification.id] && (
                <View style={{flexDirection: 'row', marginTop: 6}}>
                  <TouchableOpacity
                    onPress={() =>
                      handleFriendRequestResponse(
                        notification?.userId,
                        notification?.reqId,
                        'rejected',
                        notification?.id,
                      )
                    }
                    activeOpacity={0.5}
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
                      Not now
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() =>
                      handleFriendRequestAccepted(
                        notification?.userId,
                        notification?.reqId,
                        'accepted',
                        notification?.id,
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
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, padding: 16, backgroundColor: 'white'}}>
      <TouchableOpacity
        style={{marginBottom: 10}}
        onPress={handleClearNotifications}>
        <Text>Clear Notification</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : notification.length > 0 ? (
        <FlatList
          data={groupedData}
          renderItem={renderItem}
          keyExtractor={(item, index) => {
            if (item.type === 'header') {
              return `header-${item.label}`;
            }
            return item.data?.id?.toString() ?? index.toString();
          }}
        />
      ) : (
        <Text>No notification data</Text>
      )}
    </SafeAreaView>
  );
};

export default Abc;
