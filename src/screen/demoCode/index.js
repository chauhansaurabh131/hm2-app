import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import io from 'socket.io-client';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {style} from '../matchesAllScreen/matchesInBlockedScreen/style';

const DemoCode = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const navigation = useNavigation();

  const [friends, setFriends] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (!accessToken) {
        return;
      }
      setIsConnecting(true);

      const socketIo = io('https://stag.mntech.website', {
        path: '/api/socket.io',
        query: {token: accessToken},
      });

      console.log('📡 Trying to connect socket...');

      socketIo.on('connect', () => {
        console.log('✅ Connected to socket');

        socketIo.emit('userActive');
        socketIo.emit('MessagesOfFriends');
      });

      socketIo.on('MessagesOfFriends', data => {
        setIsConnecting(false);
        console.log('📨 Received friends list:', data);
        if (data?.data) {
          setFriends(data.data);
        }
      });

      socketIo.emit('MessagesOfFriends', data => {
        console.log('📤 Requesting friends messages:', data);
      });

      socketIo.on('onlineUser', data => {
        console.log('👥 Online users:', data);
      });

      // ✅ Listen for "message" event instead of "newMessage"
      socketIo.on('message', messageData => {
        console.log('📩 Incoming message data:', messageData);

        const {data, from} = messageData;
        const messages = data?.sendMessage?.results;

        if (!Array.isArray(messages) || messages.length === 0) {
          console.warn('📭 No valid messages received');
          return;
        }

        const lastMessage = messages[0];
        const messageText = lastMessage.message;

        // 🔄 Update the matching friend using the `from` field
        setFriends(prevFriends => {
          const updatedFriends = [...prevFriends];

          const friendIndex = updatedFriends.findIndex(
            f => f.friendId === from || f.friendList?._id === from,
          );

          if (friendIndex !== -1) {
            const updatedFriend = {
              ...updatedFriends[friendIndex],
              lastMessage: {
                ...updatedFriends[friendIndex].lastMessage,
                message: messageText,
              },
              unreadCount: (updatedFriends[friendIndex].unreadCount || 0) + 1,
            };

            // Move updated friend to top
            updatedFriends.splice(friendIndex, 1);
            updatedFriends.unshift(updatedFriend);
          } else {
            console.warn('⚠️ Sender not found in friends list:', from);
          }

          return updatedFriends;
        });
      });

      socketIo.on('disconnect', () => {
        console.log('❌ Disconnected from socket');
        setIsConnecting(false);
        socketIo.emit('userInActive');
      });

      setSocket(socketIo);

      return () => {
        if (socketIo) {
          socketIo.off('message');
          socketIo.disconnect();
          setSocket(null);
          console.log('🛑 Socket disconnected on screen blur');
        }
      };
    }, [accessToken]),
  );
  // 👉 Render function for FlatList
  const renderFriendItem = ({item}) => {
    // console.log(' === var ===> ', item?.lastMessage?.fileUrl);

    const handlePress = userData => {
      console.log('🧑 User clicked:', userData);

      navigation.navigate('ChatUserScreen', {
        userData,
      });
    };

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 10,
        }}>
        <TouchableOpacity
          style={{flexDirection: 'row', flex: 1}}
          onPress={() => {
            handlePress(item);
          }}>
          <Image
            source={{uri: item?.friendList?.profilePic}}
            style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}}
          />
          <View style={{flex: 1}}>
            <Text style={{fontSize: 18, color: 'black', marginBottom: hp(2)}}>
              {item?.friendList?.firstName}
            </Text>

            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(12),
                lineHeight: hp(14),
                fontFamily: fontFamily.poppins400,
              }}>
              {item?.lastMessage?.message
                ? item.lastMessage.message.length > 40
                  ? `${item.lastMessage.message.slice(0, 40)}...`
                  : item.lastMessage.message
                : item?.lastMessage?.fileUrl
                ? 'Image'
                : ''}
            </Text>

            {item?.unreadCount > 0 && (
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={{
                  position: 'absolute',
                  right: 5,
                  bottom: 8,
                  width: hp(20),
                  height: hp(20),
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: fontSize(12),
                    lineHeight: hp(14),
                  }}>
                  {item?.unreadCount}
                </Text>
              </LinearGradient>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <Text
        style={{fontSize: 18, fontWeight: 'bold', color: 'black', margin: 10}}>
        Total Unread Messages:{' '}
        {friends.reduce((total, item) => total + (item.unreadCount || 0), 0)}
      </Text>

      {isConnecting ? (
        <ActivityIndicator size="large" color={colors.blue} />
      ) : (
        <Text>skvl</Text>
      )}
    </SafeAreaView>
  );
};

export default DemoCode;
