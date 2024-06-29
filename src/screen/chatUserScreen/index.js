import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import style from './style';
import io from 'socket.io-client';
import {useSelector} from 'react-redux';

const formatTime = timestamp => {
  const date = new Date(timestamp);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hours}:${strMinutes} ${ampm}`;
};

const ChatUserScreen = ({route}) => {
  const {userData} = route.params;

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const {user} = useSelector(state => state.auth);

  const accessToken = user?.tokens?.access?.token;
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    if (accessToken) {
      const socket = io('https://happymilan.tech', {
        path: '/api/socket.io',
        query: {
          token: accessToken,
        },
      });

      socket.on('connect', () => {
        console.log('Connected to server');
      });

      socket.on('message', data => {
        console.log(
          'Received message:',
          JSON.stringify(data.data.sendMessage.results, null, 2),
        );
        if (data?.data?.sendMessage?.results) {
          setMessages(prevMessages => {
            const newMessages = data.data.sendMessage.results.filter(
              newMsg => !prevMessages.some(prevMsg => prevMsg.id === newMsg.id),
            );
            return [...prevMessages, ...newMessages].sort(
              (a, b) => new Date(a.sendAt) - new Date(b.sendAt),
            );
          });
          flatListRef.current.scrollToEnd({animated: true});
        }
      });

      socket.on('disconnect', reason => {
        console.log('Disconnected from server:', reason);
      });

      // Emitting getLastConversation events
      socket.emit('getLastConversation', {
        from: userData.userList._id,
        to: userData.friendList._id,
      });
      socket.emit('getLastConversation', {
        to: userData.userList._id,
        from: userData.friendList._id,
      });

      // Handling getLastConversation event
      socket.on('getLastConversation', data => {
        console.log('Received last conversation data:', data);
        setMessages(
          data
            .reverse()
            .sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt)),
        );
        flatListRef.current.scrollToEnd({animated: true});
      });

      socketRef.current = socket;

      return () => {
        socket.disconnect();
        console.log('Socket disconnected');
      };
    }
  }, [accessToken, userData]);

  const handleSendMessage = () => {
    const trimmedMessage = message?.trim();

    if (!trimmedMessage) {
      return;
    }

    const newMessage = {
      from: userData?.userList?._id,
      to: userData?.friendList?._id,
      message: trimmedMessage,
      sendAt: new Date().toISOString(), // Ensure the timestamp format matches your data
      id: Math.random().toString(36).substr(2, 9), // Temporary ID for local rendering
      isTemporary: true, // Flag to indicate the message is temporary
    };

    console.log('Sending message:', newMessage);

    // Update local state immediately for a responsive UI
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, newMessage].sort(
        (a, b) => new Date(a.sendAt) - new Date(b.sendAt),
      );
      return updatedMessages;
    });

    // Send the message to the server
    socketRef.current.emit('sendMessage', newMessage);

    setMessage(''); // Clear the message input after sending
  };

  const renderItem = ({item}) => (
    <View
      style={{
        flexDirection: 'row',
        alignSelf:
          item.from === userData?.userList?._id ? 'flex-end' : 'flex-start',
        marginBottom: 8,
      }}>
      {item.from !== userData?.userList?._id && (
        <Image
          source={{uri: userData.friendList.profilePic}}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginRight: 8,
          }}
        />
      )}
      <View
        style={{
          maxWidth: '70%',
          padding: 12,
          borderRadius: 18,
          backgroundColor:
            item.from === userData?.userList?._id ? '#FBF4FF' : '#EDF4FF',
        }}>
        <Text
          style={{
            fontSize: fontSize(14),
            color: 'black',
            lineHeight: hp(21),
            fontFamily: fontFamily.poppins400,
          }}>
          {item.message}
        </Text>
        <Text
          style={{
            fontSize: fontSize(10),
            color: '#000000',
            marginTop: hp(4),
            lineHeight: hp(15),
            fontFamily: fontFamily.poppins400,
          }}>
          {formatTime(item.sendAt)} {/* Display formatted timestamp */}
        </Text>
      </View>
      {item.from === userData?.userList?._id && (
        <Image
          source={{uri: userData.userList.profilePic}}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            marginLeft: 8,
          }}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <View style={style.headerImageAndIconStyle}>
          <Image source={images.happyMilanColorLogo} style={style.logoStyle} />
          <TouchableOpacity activeOpacity={0.7}>
            <Image
              source={images.profileDisplayImage}
              style={style.profileIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={style.userDetailsContainer}>
          {userData && (
            <Image
              source={{uri: userData.friendList?.profilePic}}
              style={style.userProfileIcon}
            />
          )}
          <View style={style.detailsContainer}>
            <Text style={style.userNameTextStyle}>
              {userData
                ? `${userData?.friendList?.firstName} ${userData?.friendList?.lastName}`
                : ''}
            </Text>
            <Text
              style={[
                style.statusTextStyle,
                {
                  color:
                    userData && userData.online === 'online'
                      ? colors.blue
                      : colors.black,
                },
              ]}>
              {userData ? userData.online : ''}
            </Text>
          </View>
          <TouchableOpacity activeOpacity={0.5}>
            <Image source={icons.three_dots_icon} style={style.threeDotIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        ref={flatListRef}
        data={messages.filter(msg => !msg.isTemporary)} // Filter out temporary messages
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()} // Ensure the key extractor matches your data structure
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'flex-end', // Start from the bottom
          paddingHorizontal: wp(17),
        }}
        onContentSizeChange={() =>
          flatListRef.current.scrollToEnd({animated: true})
        }
        onLayout={() => flatListRef.current.scrollToEnd({animated: true})}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 17,
          marginBottom: hp(16),
        }}>
        <View
          style={{
            width: wp(320),
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#DDDDDD',
            borderRadius: 25,
            borderWidth: 1,
            paddingHorizontal: 10,
          }}>
          <TouchableOpacity>
            <Image
              source={icons.smile_emoji_icon}
              style={{
                width: hp(18),
                height: hp(18),
                marginLeft: 8,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          <TextInput
            style={{flex: 1, height: 50, color: 'black', padding: 10}}
            placeholder="Message"
            placeholderTextColor={'black'}
            multiline={true}
            numberOfLines={4}
            value={message}
            onChangeText={text => setMessage(text)}
            onSubmitEditing={handleSendMessage} // Ensure handleSendMessage is called correctly
          />
          <TouchableOpacity>
            <Image
              source={icons.simple_camera_icon}
              style={{
                width: 22.5,
                height: 20,
                marginLeft: 10,
                resizeMode: 'contain',
                tintColor: colors.black,
                marginRight: 5,
              }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleSendMessage}
          style={{
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.send_icon}
            style={{width: hp(26), height: hp(26), resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatUserScreen;
