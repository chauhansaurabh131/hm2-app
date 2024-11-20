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

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const ChatScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;

  const [userInput, setUserInput] = useState(''); // User input for search
  const [status, setStatus] = useState('Disconnected');
  const [socket, setSocket] = useState(null);
  const [topModalVisible, setTopModalVisible] = useState(false);

  const dispatch = useDispatch();

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  useFocusEffect(
    React.useCallback(() => {
      // Fetch the friends list when the screen is focused
      dispatch(getAllFriends());
    }, [dispatch]),
  );

  const {myAllFriends, isUserDataLoading} = useSelector(state => state.chat);

  const friends = myAllFriends.data?.results || [];

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    // Initialize socket connection
    const socketIo = io('https://happymilan.tech', {
      path: '/api/socket.io',
      query: {token: accessToken},
    });

    socketIo.on('connect', () => {
      console.log('Connected to socket');
      socketIo.emit('userActive');
    });

    socketIo.on('onlineUser', data => {
      console.log('Data from socket:', data);
    });

    socketIo.on('disconnect', () => {
      setStatus('Disconnected');
      console.log('Disconnected from socket');
      socketIo.emit('userInActive');
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
      setSocket(null);
    };
  }, [accessToken]);

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  // Function to filter friends based on user input
  const filteredFriends = friends.filter(friend => {
    const fullName =
      `${friend.friendList.firstName} ${friend.friendList.lastName}`.toLowerCase();
    return fullName.includes(userInput.toLowerCase());
  });

  const FilterData = ({item}) => {
    if (!item || !item.friendList) {
      return null;
    }

    const onlineStatusColor = item.friendList.isUserActive
      ? colors.blue
      : '#A7A7A7';
    const onlineStatusText = item.friendList.isUserActive
      ? 'Online'
      : 'Offline';

    const handleItemPress = userData => {
      navigation.navigate('ChatUserScreen', {
        userData,
      });
    };

    return (
      <TouchableOpacity
        onPress={() => handleItemPress(item)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: hp(20),
        }}>
        <Image
          source={{uri: item.friendList.profilePic}}
          style={{
            width: 47,
            height: 47,
            borderRadius: 25,
            marginRight: wp(19),
          }}
        />

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
              {item.friendList.firstName} {item.friendList.lastName}
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
            Hi, I am busy, I’ll drop you a message after some time.
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={{marginHorizontal: wp(17)}}>
        <View style={style.headerContainerTittleStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderLogo}
          />

          {/*<TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>*/}
          <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>
            {userImage ? (
              <Image source={{uri: userImage}} style={style.profileLogoStyle} />
            ) : (
              <Image
                source={images.empty_male_Image}
                style={style.profileLogoStyle}
              />
            )}
          </TouchableOpacity>
        </View>

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
        {isUserDataLoading ? (
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
          <FlatList
            data={filteredFriends} // Use the filtered data
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
