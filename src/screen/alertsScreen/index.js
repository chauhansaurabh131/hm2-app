import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import style from './style';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import ProfileAvatar from '../../components/letterProfileComponent';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const AlertsScreen = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;

  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(false);
  const [requestResponses, setRequestResponses] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const topModalBottomSheetRef = useRef(null);

  const navigation = useNavigation();

  // Function to open bottom sheet from Abc component
  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  useFocusEffect(
    useCallback(() => {
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
          setNotification(data.data?.results || []);
        } catch (error) {
          console.error('Error fetching notification:', error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchNotification();
    }, [accessToken]),
  );

  const onRefresh = async () => {
    try {
      setRefreshing(true);
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
      setNotification(data.data?.results || []);
    } catch (error) {
      console.error('Error refreshing notifications:', error.message);
    } finally {
      setRefreshing(false);
    }
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
      setNotification([]);
    } catch (error) {
      console.error('Error clearing notifications:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const getCompactTimeAgo = createdAt => {
    const now = new Date();
    const past = new Date(createdAt);
    const diffInSeconds = Math.floor((now - past) / 1000);

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(diffInSeconds / 3600);
    const days = Math.floor(diffInSeconds / 86400);
    const weeks = Math.floor(diffInSeconds / 604800);

    if (diffInSeconds < 60) {
      return 'just now';
    }
    if (minutes < 60) {
      return `${minutes}m ago`;
    }
    if (hours < 24) {
      return `${hours}h ago`;
    }
    if (days < 7) {
      return `${days}d ago`;
    }
    return `${weeks}w ago`;
  };

  const handlePress = item => {
    const matchesUserData = {
      firstName: item?.otherUserId?.name,
      id: item?.otherUserId?.id,
    };

    console.log(' === handlePress__ ===> ', matchesUserData);

    navigation.navigate('NewUserDetailsScreen', {matchesUserData});
  };

  const renderItem = ({item}) => {
    const notification = item;

    // console.log(' === item ===> ', item?.createdAt);

    return (
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', padding: 10, flex: 1}}>
          <Image
            source={{uri: notification?.otherUserId?.profilePic}}
            style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}}
          />

          <View style={{position: 'absolute', right: 0, top: 10}}>
            <Text style={{color: '#D1D1D1', fontSize: fontSize(12)}}>
              {getCompactTimeAgo(item?.createdAt)}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                handlePress(item);
              }}>
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
                      handleFriendRequestResponse(
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
    <SafeAreaView style={style.container}>
      <View style={style.bodyContainer}>
        {/*{user?.user?.appUsesType !== 'dating' && (*/}
        {/*  <View style={style.headerContainer}>*/}
        {/*    <Image*/}
        {/*      source={images.happyMilanColorLogo}*/}
        {/*      style={{*/}
        {/*        width: wp(96),*/}
        {/*        height: hp(24),*/}
        {/*        resizeMode: 'contain',*/}
        {/*        marginTop: hp(14),*/}
        {/*      }}*/}
        {/*    />*/}

        {/*    <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>*/}
        {/*      {userImage ? (*/}
        {/*        <Image*/}
        {/*          source={{uri: userImage}}*/}
        {/*          style={{*/}
        {/*            width: hp(24),*/}
        {/*            height: hp(24),*/}
        {/*            borderRadius: 50,*/}
        {/*            resizeMode: 'stretch',*/}
        {/*            marginTop: hp(14),*/}
        {/*            marginRight: wp(2),*/}
        {/*          }}*/}
        {/*        />*/}
        {/*      ) : (*/}
        {/*        <ProfileAvatar*/}
        {/*          firstName={user?.user?.firstName || user?.user?.name}*/}
        {/*          lastName={user?.user?.lastName}*/}
        {/*          textStyle={{*/}
        {/*            width: hp(24),*/}
        {/*            height: hp(24),*/}
        {/*            borderRadius: 50,*/}
        {/*            resizeMode: 'stretch',*/}
        {/*            marginTop: hp(14),*/}
        {/*            marginRight: wp(2),*/}
        {/*          }}*/}
        {/*          profileTexts={{fontSize: fontSize(10)}}*/}
        {/*        />*/}
        {/*      )}*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*)}*/}

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View
          style={{
            marginTop: hp(16),
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: hp(20),
            // backgroundColor: 'red',
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
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              opacity: notification.length === 0 ? 0.3 : 1,
            }}
            activeOpacity={0.5}
            onPress={handleClearNotifications}
            disabled={notification.length === 0}>
            <Text
              style={{
                color: colors.blue,
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins400,
                marginRight: wp(9),
              }}>
              Clear
            </Text>
            <Image
              source={icons.clear_delete_icon}
              style={{
                width: hp(12),
                height: hp(12),
                resizeMode: 'contain',
                marginRight: 7,
                alignSelf: 'center',
                tintColor: colors.blue,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{marginHorizontal: 17}}>
        {loading ? (
          <FlatList
            data={[1, 1, 1, 1, 1, 1, 1, 1]}
            renderItem={({item, index}) => (
              <View
                style={{
                  width: '100%',
                  height: 65,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <ShimmerPlaceholder
                  style={{
                    width: 47,
                    height: 47,
                    borderRadius: 25,
                    marginRight: wp(19),
                  }}
                />
                <View style={{marginLeft: 3}}>
                  <ShimmerPlaceholder
                    style={{width: 100, height: 15, marginRight: wp(10)}}
                  />
                  <ShimmerPlaceholder
                    style={{width: '100%', height: 10, marginTop: 5}}
                  />
                </View>
              </View>
            )}
          />
        ) : notification.length > 0 ? (
          <FlatList
            data={notification}
            renderItem={renderItem}
            keyExtractor={(item, index) =>
              item.id?.toString() ?? index.toString()
            }
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignSelf: 'center',
              alignItems: 'center',
              marginTop: hp(100),
            }}>
            <Image
              source={icons.no_notification_icon}
              style={{width: hp(250), height: hp(200), resizeMode: 'contain'}}
            />
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(20),
                lineHeight: hp(30),
                fontFamily: fontFamily.poppins600,
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
        )}
      </View>
    </SafeAreaView>
  );
};

export default AlertsScreen;
