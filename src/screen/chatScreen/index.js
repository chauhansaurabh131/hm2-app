import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import style from './style';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import {colors} from '../../utils/colors';
import {useDispatch, useSelector} from 'react-redux';
import {getAllFriends} from '../../actions/chatActions';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import io from 'socket.io-client';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {useFocusEffect} from '@react-navigation/native';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import ProfileAvatar from '../../components/letterProfileComponent';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const ChatScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;

  console.log(' === var ===> ', user?.user?.appUsesType);

  const [userInput, setUserInput] = useState(''); // User input for search
  const [status, setStatus] = useState('Disconnected');
  // const [socket, setSocket] = useState(null);
  const [topModalVisible, setTopModalVisible] = useState(false);

  const [friends, setFriends] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);

  const dispatch = useDispatch();

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Fetch the friends list when the screen is focused
  //     dispatch(getAllFriends());
  //   }, [dispatch]),
  // );

  // const {myAllFriends, isUserDataLoading} = useSelector(state => state.chat);
  //
  // const friends = myAllFriends.data?.results || [];

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (!accessToken) {
  //       return;
  //     }
  //
  //     const socketIo = io('https://stag.mntech.website', {
  //       path: '/api/socket.io',
  //       query: {token: accessToken},
  //     });
  //
  //     socketIo.on('connect', () => {
  //       console.log('Connected to socket_____');
  //       socketIo.emit('userActive');
  //     });
  //
  //     socketIo.on('MessagesOfFriends', data => {
  //       console.log('📨 Received:', data);
  //     });
  //
  //     socketIo.emit('MessagesOfFriends', data => {
  //       console.log('Message Data :', data);
  //     });
  //
  //     socketIo.on('onlineUser', data => {
  //       console.log('Data from socket:', data);
  //     });
  //
  //     socketIo.on('disconnect', () => {
  //       setStatus('Disconnected');
  //       console.log('Disconnected from socket');
  //       socketIo.emit('userInActive');
  //     });
  //
  //     setSocket(socketIo);
  //
  //     // Cleanup function: disconnect socket when screen loses focus
  //     return () => {
  //       if (socketIo) {
  //         socketIo.disconnect();
  //         setSocket(null);
  //         console.log('Socket disconnected on screen blur');
  //       }
  //     };
  //   }, [accessToken]),
  // );

  // useFocusEffect(
  //   React.useCallback(() => {
  //     if (!accessToken) {
  //       return;
  //     }
  //     setIsConnecting(true);
  //
  //     const socketIo = io('https://stag.mntech.website', {
  //       path: '/api/socket.io',
  //       query: {token: accessToken},
  //     });
  //
  //     console.log('📡 Trying to connect socket...');
  //
  //     socketIo.on('connect', () => {
  //       console.log('✅ Connected to socket');
  //
  //       socketIo.emit('userActive');
  //       socketIo.emit('MessagesOfFriends');
  //     });
  //
  //     socketIo.on('MessagesOfFriends', data => {
  //       setIsConnecting(false);
  //       console.log('📨 Received:', data);
  //       if (data?.data) {
  //         setFriends(data.data);
  //       }
  //     });
  //
  //     socketIo.emit('MessagesOfFriends', data => {
  //       console.log('Message Data :', data);
  //     });
  //
  //     socketIo.on('onlineUser', data => {
  //       console.log('👥 Online users:', data);
  //     });
  //
  //     socketIo.on('disconnect', () => {
  //       console.log('❌ Disconnected from socket');
  //       setIsConnecting(false);
  //       socketIo.emit('userInActive');
  //     });
  //
  //     setSocket(socketIo);
  //
  //     return () => {
  //       if (socketIo) {
  //         socketIo.disconnect();
  //         setSocket(null);
  //         console.log('🛑 Socket disconnected on screen blur');
  //       }
  //     };
  //   }, [accessToken]),
  // );

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

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  // Function to filter friends based on user input
  const filteredFriends = friends.filter(friend => {
    const fullName =
      `${friend?.friendList?.firstName} ${friend?.friendList?.lastName}`.toLowerCase();
    return fullName.includes(userInput.toLowerCase());
  });

  const FilterData = ({item}) => {
    // console.log(' === item___ ===> ', item);

    const hasValidImage =
      item?.friendList?.profilePic &&
      item?.friendList?.profilePic !== 'null' &&
      item?.friendList?.profilePic.trim() !== '';

    if (!item || !item.friendList) {
      return null;
    }

    const firstname = item.friendList.lastName;

    const firstName = item?.friendList?.firstName
      ? item?.friendList?.firstName.charAt(0).toUpperCase() +
        item?.friendList?.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item?.friendList?.lastName
      ? item?.friendList?.lastName.charAt(0).toUpperCase() +
        item?.friendList?.lastName.slice(1).toLowerCase()
      : '';

    const name = item?.friendList?.name
      ? item?.friendList?.name.charAt(0).toUpperCase() +
        item?.friendList?.name.slice(1).toLowerCase()
      : '';

    // console.log(' === firstname ===> ', firstname);

    const onlineStatusColor = item?.friendList?.isUserActive
      ? colors.blue
      : '#A7A7A7';
    const onlineStatusText = item?.friendList?.isUserActive
      ? 'Online'
      : 'Offline';

    const handleItemPress = userData => {
      // console.log(' === handleItemPress_chatScreen ===> ', userData);

      navigation.navigate('ChatUserScreen', {
        userData,
      });

      // navigation.navigate('DemoPractiveCodeScreen', {
      //   userData,
      // });
    };

    return (
      <TouchableOpacity
        onPress={() => handleItemPress(item)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: hp(20),
        }}>
        {hasValidImage ? (
          <Image
            source={{uri: item?.friendList?.profilePic}}
            style={{
              width: 47,
              height: 47,
              borderRadius: 25,
              marginRight: wp(19),
            }}
          />
        ) : (
          <ProfileAvatar
            firstName={
              item?.friendList?.firstName || item?.friendList?.lastName
            }
            lastName={item?.friendList?.lastName}
            textStyle={{
              width: 47,
              height: 47,
              borderRadius: 25,
              marginRight: wp(19),
            }}
          />
        )}

        <View style={{flexDirection: 'column', flex: 1}}>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins600,
                color: colors.black,
                marginRight: wp(10),
              }}>
              {/*{item.friendList.firstName} {item.friendList.lastName}*/}
              {firstName || name} {lastName}
              {/*{item?.friendList?.firstName}*/}
            </Text>
            <Text
              style={{
                fontSize: fontSize(8),
                lineHeight: hp(12),
                fontFamily: fontFamily.poppins500,
                color: onlineStatusColor,
                marginTop: 5,
              }}>
              {onlineStatusText}
            </Text>
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: fontSize(12),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins400,
              color: colors.black,
            }}>
            {/*Hi, I am busy, I’ll drop you a message after some time.*/}
            {/*{item?.lastMessage?.message?.length > 40*/}
            {/*  ? `${item.lastMessage.message.slice(0, 40)}...`*/}
            {/*  : item.lastMessage.message}*/}

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
                  fontSize: fontSize(10),
                  lineHeight: hp(12),
                  fontWeight: 'bold',
                }}>
                {item?.unreadCount}
              </Text>
            </LinearGradient>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={{marginHorizontal: wp(17)}}>
        {/*{user?.user?.appUsesType !== 'dating' && (*/}
        {/*  <View style={style.headerContainerTittleStyle}>*/}
        {/*    <Image*/}
        {/*      source={images.happyMilanColorLogo}*/}
        {/*      style={style.customerHeaderLogo}*/}
        {/*    />*/}

        {/*    /!*<TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>*!/*/}
        {/*    <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>*/}
        {/*      {userImage ? (*/}
        {/*        <Image*/}
        {/*          source={{uri: userImage}}*/}
        {/*          style={style.profileLogoStyle}*/}
        {/*        />*/}
        {/*      ) : (*/}
        {/*        <ProfileAvatar*/}
        {/*          firstName={user?.user?.firstName}*/}
        {/*          lastName={user?.user?.lastName}*/}
        {/*          textStyle={style.profileLogoStyle}*/}
        {/*          profileTexts={{fontSize: fontSize(10)}}*/}
        {/*        />*/}
        {/*      )}*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}
        {/*)}*/}

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View
            style={{
              position: 'relative',
              flex: 1,
              marginTop: 22,
              marginBottom: 18,
            }}>
            <TextInput
              style={{
                height: 50,
                borderWidth: 1,
                borderRadius: 25,
                paddingLeft: 20,
                borderColor: '#F0F0F0',
                color: colors.black,
              }}
              placeholder="Search Member"
              placeholderTextColor="black"
              autoCorrect={false}
              onChangeText={text => setUserInput(text)} // Update userInput on text change
            />

            <View
              style={{
                position: 'absolute',
                right: 10,
                top: 5,
                width: 42,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity>
                <Image
                  source={icons.search_icon}
                  style={{width: 16, height: 16, tintColor: colors.black}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <HomeTopSheetComponent
        isVisible={topModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
      />

      <View style={{marginHorizontal: wp(26)}}>
        {isConnecting ? (
          // SHIMMER LOADER DATA
          <FlatList
            data={[1, 1, 1, 1, 1, 1, 1, 1]}
            renderItem={({item, index}) => {
              return (
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
              );
            }}
          />
        ) : filteredFriends.length === 0 && userInput ? (
          <View
            style={{
              alignItems: 'center',
              marginTop: hp(200),
            }}>
            <Image
              source={icons.no_Profile_Found_img}
              style={{width: hp(44), height: hp(44), resizeMode: 'contain'}}
            />
            <Text
              style={{
                marginTop: hp(14),
                color: colors.black,
                fontSize: fontSize(18),
                lineHeight: hp(27),
                fontFamily: fontFamily.poppins400,
              }}>
              No Profiles Found
            </Text>
          </View>
        ) : filteredFriends.length === 0 && !userInput ? (
          <View style={{alignItems: 'center', marginTop: hp(200)}}>
            <Image
              source={icons.no_message_icon}
              style={{width: hp(48), height: hp(44), resizeMode: 'contain'}}
            />
            <Text
              style={{
                marginTop: hp(14),
                color: colors.black,
                fontSize: fontSize(18),
                lineHeight: hp(27),
                fontFamily: fontFamily.poppins400,
              }}>
              No messages
            </Text>
            <Text
              style={{
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins400,
                color: colors.gray,
              }}>
              New messages will appear here.
            </Text>
          </View>
        ) : (
          // <FlatList
          //   data={filteredFriends} // Use the filtered data
          //   renderItem={FilterData}
          //   keyExtractor={item =>
          //     item.friendList?._id || item.id || Math.random().toString()
          //   }
          //   showsVerticalScrollIndicator={false}
          //   ListFooterComponent={<View style={{height: hp(120)}} />}
          // />

          <FlatList
            data={friends} // Use the filtered data
            renderItem={FilterData}
            keyExtractor={item =>
              item.friendList?._id || item.id || Math.random().toString()
            }
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{height: hp(120)}} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
