import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  Button,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import style from './style';
import io from 'socket.io-client';
import {useDispatch, useSelector} from 'react-redux';
import {launchImageLibrary} from 'react-native-image-picker';
import RNBlobUtil from 'react-native-blob-util';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {MenuProvider} from 'react-native-popup-menu';
import DropdownMenu from '../message';
import ChatThreeDotComponent from '../../components/chatThreeDotComponent';
import {accepted_Decline_Request} from '../../actions/homeActions';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import EmojiSelector from 'react-native-emoji-selector';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import ProfileAvatar from '../../components/letterProfileComponent';
import Toast from 'react-native-toast-message';

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

  console.log(' === userData ===> ', userData?.friendList?._id);

  // console.log(' === ChatUserScreen___ ===> ', userData);

  const blockUserId = userData?.lastInitiatorUser;
  const blockReqId = userData?._id;

  const navigation = useNavigation();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mediaType, setMediaType] = useState('');
  const [recording, setRecording] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState(null);
  const [recordingDuration, setRecordingDuration] = useState('');
  const audioRecorderPlayer = useRef(new AudioRecorderPlayer()).current;
  const [durationTimer, setDurationTimer] = useState(null);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [typing, setTyping] = useState(false);
  const [audioProgress, setAudioProgress] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [playbackPosition, setPlaybackPosition] = useState(0); // dont remove
  const [playbackDuration, setPlaybackDuration] = useState(0); // dont remove
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [fullscreenVideoUri, setFullscreenVideoUri] = useState(null);
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [isEmojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const [hasMessageConsent, setHasMessageConsent] = useState(null);

  console.log(' === messages.length ===> ', messages.length);

  const safetyTips = [
    'Do not share your personal details, \nsuch as your bank account or address,\nuntil trust has been established',
    'Avoid meeting at unknown places. If \nyou choose to go, inform a trusted\nperson about your plans.',
    'Share your live location with your\nparents for easy tracking during\ndifficult times.',
  ];

  const [tipIndex, setTipIndex] = useState(0);

  const handleNext = () => {
    if (tipIndex < safetyTips.length - 1) {
      setTipIndex(prev => prev + 1);
    } else {
      console.log('✅ User agreed to safety tips, proceed to start chat.');
      handleConsentSubmit();
      // Optional: Call handleConsentSubmit() here
    }
  };

  // Reset tipIndex when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      setTipIndex(0);
    }, []),
  );

  const CopyId = () => {
    Toast.show({
      type: 'Copied',
      text1: ' Message Copied!',
      visibilityTime: 1000,
    });
  };

  // console.log(' === messages ===> ', messages);
  const lastMessageId = messages[messages.length - 1]?.id;
  // console.log('Last Message ID:', lastMessageId);

  const threeDotBottomSheetRef = useRef();
  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const {user} = useSelector(state => state.auth);
  const userImage = userData?.userList?.profilePic;

  const accessToken = user?.tokens?.access?.token;
  const socketRef = useRef(null);
  const flatListRef = useRef(null);
  const dispatch = useDispatch();

  const getMessageConsent = async () => {
    try {
      const friendId = userData?.friendList?._id;
      const accessToken = user?.tokens?.access?.token;

      if (!friendId || !accessToken) {
        console.error('Missing friend ID or access token');
        return;
      }

      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/message-consent/get-message-consent/${friendId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const result = await response.json();
      if (response.ok) {
        console.log('✅ Message Consent Response:', result);
        setHasMessageConsent(result.data.length > 0); // true if data is not empty, false otherwise
      } else {
        console.error('❌ API Error:', result);
        setHasMessageConsent(false);
      }
    } catch (error) {
      console.error('❌ Fetch error:', error);
      setHasMessageConsent(false);
    }
  };

  useEffect(() => {
    getMessageConsent();
  }, []);

  const handleConsentSubmit = async () => {
    const senderId = userData?.userList?._id;
    const receiverId = userData?.friendList?._id;
    const accessToken = user?.tokens?.access?.token;

    if (!senderId || !receiverId || !accessToken) {
      console.error('Missing required IDs or token');
      return;
    }

    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/message-consent/create-message-consent',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            senderId: senderId,
            receiverId: receiverId,
            primaryConsent: true,
          }),
        },
      );

      const result = await response.json();
      if (response.ok) {
        console.log('✅ Consent submitted:', result);
        // After successful consent, refetch message consent
        setHasMessageConsent(true);
      } else {
        console.error('❌ Failed to submit consent:', result);
      }
    } catch (error) {
      console.error('❌ API error:', error);
    }
  };

  const handleBlockProfilePress = () => {
    setIsBlockModalVisible(true); // Open the modal when block profile is pressed
  };

  const handleConfirmBlock = () => {
    // Logic to block the user

    console.log(
      ' === handleConfirmBlock ===> ',
      userData?.userList?._id,
      userData?.friendList?._id || userData?.friendList[0]?._id,
    );
    // const blockUserId = userData?.lastInitiatorUser;
    // const blockReqId = userData?._id;

    dispatch(
      accepted_Decline_Request(
        {
          user: blockUserId,
          request: blockReqId,
          status: 'blocked',
        },
        () => {
          navigation.goBack();
        },
      ),
    );

    console.log('User blocked!');
    setIsBlockModalVisible(false); // Close the modal after confirming
  };

  const handleCancelBlock = () => {
    setIsBlockModalVisible(false); // Close the modal if canceled
  };

  useEffect(() => {
    if (accessToken) {
      // const socket = io('https://happymilan.tech', {
      const socket = io('https://stag.mntech.website', {
        path: '/api/socket.io',
        query: {
          token: accessToken,
        },
      });

      socket.on('connect', () => {
        console.log('Connected to server=====');
        socket.emit('userActive');
      });

      socket.on('typing', data => {
        if (data.to === userData?.userList?._id) {
          setTyping(true);
        }
      });

      socket.on('stopTyping', data => {
        if (data.to === userData?.userList?._id) {
          setTyping(false);
        }
      });

      socket.on('MessagesOfFriends', data => {
        console.log('=== MessagesOfFriends_______ ===>', data);
      });

      socket.on('message', async data => {
        // console.log(
        //   ' === +++++message+++ ===> ',
        //   JSON.stringify(data.data, null, 2),
        // );

        // console.log(' === +++++message+++ ===> ', data.data);

        // socket.emit('message');

        // if (data?.data?.message === 'messages received') {
        //   setMessages(prevMessages => {
        //     const newMessages = data.data.sendMessage.results.filter(
        //       newMsg => !prevMessages.some(prevMsg => prevMsg.id === newMsg.id),
        //     );
        //     return [...prevMessages, ...newMessages].sort(
        //       (a, b) => new Date(a.sendAt) - new Date(b.sendAt),
        //     );
        //   });
        if (data?.data?.message === 'messages received') {
          const results = data?.data?.sendMessage?.results;

          if (!Array.isArray(results)) {
            console.warn(
              '⚠️ sendMessage.results is missing or not an array:',
              data?.data?.sendMessage,
            );
            return;
          }

          setMessages(prevMessages => {
            const newMessages = results.filter(
              newMsg => !prevMessages.some(prevMsg => prevMsg.id === newMsg.id),
            );
            return [...prevMessages, ...newMessages].sort(
              (a, b) => new Date(a.sendAt) - new Date(b.sendAt),
            );
          });
        } else if (data?.data?.message === 'file upload url generated') {
          // console.log(' === file upload url generated ===> ', data?.data);
          // console.log(' === data?.data?.message ===> ', data?.data?.message);

          const getContentType = imageType => {
            switch (imageType) {
              case 'video/mp4':
                return 'video/mp4';
              case 'image/jpeg':
              case 'image/jpg':
                return 'image/jpeg';
              case 'image/png':
                return 'image/png';
              default:
                return 'image/jpeg';
            }
          };

          const imageUrl = data.data.result.url;
          try {
            await RNBlobUtil.fetch(
              'PUT',
              imageUrl,
              {
                // 'Content-Type': getContentType(data.data.result.type),
                'Content-Type': 'video/mp4$(mediaType)',
                // 'Content-Type': getContentType(mediaType),
              },
              RNBlobUtil.wrap(data.data.result.key),
            );

            const imagesMessage = data.data.chatMessage.message;
            const Types = data.data.chatMessage.type;
            console.log(' === Types ===> ', data.data.chatMessage.type);
            const isAudio = data.data.chatMessage.type === 'audio';

            const newImageMessage = {
              from: userData?.userList?._id,
              to: userData?.friendList?._id || userData?.friendList[0]?._id,
              // message: 'image',
              // message: isAudio ? '' : 'image',
              message: imagesMessage,
              fileUrl: imageUrl,
              // type: 'image',
              // type: isAudio ? 'audio' : 'image',
              // type: isAudio ? 'audio' : 'image',
              type: Types,
              sendAt: new Date().toISOString(),
              id: data.data.chatMessage.id,
              isTemporary: false,
            };

            socketRef.current.emit('sendMessage', newImageMessage);

            setMessages(prevMessages => [...prevMessages, newImageMessage]);
          } catch (err) {
            console.log('Error uploading image:', err);
          }

          setSelectedImage(null);
        }
        flatListRef.current.scrollToEnd({animated: true});
      });

      // const payload = {
      //   to: userData?.userList?._id,
      //   from: userData?.friendList?._id || userData?.friendList?.[0]?._id,
      //   messageId: messages[messages.length - 1]?.id,
      // };
      //
      // console.log('Emitting readMessage with payload:', payload);
      //
      // socket.on('readMessage', payload);

      socket.on('disconnect', reason => {
        console.log('Disconnected from server:', reason);
        socket.emit('userInactive');
      });

      socket.emit('getLastConversation', {
        from: userData?.userList?._id,
        to: userData?.friendList._id || userData?.friendList[0]._id,
      });
      socket.emit('getLastConversation', {
        to: userData?.userList?._id,
        from: userData?.friendList._id || userData?.friendList[0]._id,
      });

      socket.on('getLastConversation', data => {
        setMessages(
          data
            .reverse()
            .sort((a, b) => new Date(a.sendAt) - new Date(b.sendAt)),
        );
        flatListRef.current.scrollToEnd({animated: true});
      });

      // ✅ Add this block here
      // socket.on('messageDeleted', data => {
      //   console.log('Message deleted from server:', data.messageId);
      //   setMessages(prev => prev.filter(msg => msg.id !== data.messageId));
      // });

      socket.on('messageDeleted', data => {
        console.log('🗑️ Message deleted from server:', data.messageId);
        setMessages(prev =>
          prev.map(msg =>
            msg.id === data.messageId
              ? {
                  ...msg,
                  message: 'This message was deleted',
                  type: 'deleted',
                }
              : msg,
          ),
        );
      });

      socket.on('chatDeleted', data => {
        const isCurrentChat =
          (data.from === userData?.friendList?._id &&
            data.to === userData?.userList?._id) ||
          (data.to === userData?.friendList?._id &&
            data.from === userData?.userList?._id);

        if (isCurrentChat) {
          console.log('🔄 Chat deleted by other user');
          setMessages([]);
        }
      });

      socketRef.current = socket;

      return () => {
        socket.disconnect();
        console.log('Socket disconnected');
      };
    }
  }, [accessToken, userData]);

  useEffect(() => {
    if (!socketRef.current || messages.length === 0) {
      return;
    }

    const lastMessageId = messages[messages.length - 1]?.id;
    const payload = {
      to: userData?.userList?._id,
      from: userData?.friendList?._id || userData?.friendList?.[0]?._id,
      messageId: lastMessageId,
    };

    if (lastMessageId) {
      console.log('Emitting readMessage with payload:', payload);
      socketRef.current.emit('readMessage', payload);
    } else {
      console.log('Last message ID is undefined, not emitting readMessage');
    }
  }, [messages]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({animated: true});
    }
  }, [messages]);

  const handleEmojiSelect = emoji => {
    setMessage(message + emoji);
  };

  const handleSendMessage = async () => {
    const trimmedMessage = message?.trim();

    if (!trimmedMessage && !selectedImage && !recordedAudio) {
      return;
    }

    if (selectedImage) {
      const chatContent = {
        from: userData?.userList?._id,
        to: userData?.friendList?._id || userData?.friendList[0]._id,
        // message: mediaType === 'image' ? 'image' : 'video',
        message: trimmedMessage,
        fileName: selectedImage,
        type: mediaType,
      };

      socketRef.current.emit('uploadContent', chatContent);
      console.log(' === chatContent ===> ', chatContent);
    } else if (trimmedMessage) {
      const newMessage = {
        from: userData?.userList?._id,
        to: userData?.friendList?._id || userData?.friendList[0]._id,
        message: trimmedMessage,
        sendAt: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9),
        isTemporary: true,
      };

      socketRef.current.emit('sendMessage', newMessage);
    } else if (recordedAudio) {
      const chatContentAudio = {
        from: userData?.userList?._id,
        to: userData?.friendList?._id || userData?.friendList[0]._id,
        // message: 'audio',
        fileName: recordedAudio, // Ensure this is a correct path
        type: 'audio',
      };

      socketRef.current.emit('uploadContent', chatContentAudio);

      // console.log(' === chatContentAudio ===> ', chatContentAudio);
      setRecordedAudio(null);
    }

    setMessage('');
    setSelectedImage(null);
    setRecordingDuration(''); // Clear recording duration
  };

  // const onStartRecord = async () => {
  //   try {
  //     const result = await audioRecorderPlayer.startRecorder();
  //     audioRecorderPlayer.addRecordBackListener(e => {
  //       setRecordingDuration(formatDuration(e.currentPosition));
  //       return;
  //     });
  //     setRecording(true);
  //     console.log('Recording started:', result);
  //
  //     const timer = setInterval(() => {
  //       setRecordingDuration(prevDuration =>
  //         formatDuration(
  //           parseInt(prevDuration.split(':')[1] || '0', 10) + 1000,
  //         ),
  //       );
  //     }, 1000);
  //
  //     setDurationTimer(timer);
  //   } catch (err) {
  //     console.log('Error starting recording:', err);
  //   }
  // };

  const onStartRecord = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener(e => {
        const durationInMilliseconds = e.currentPosition;
        const durationInSeconds = Math.floor(durationInMilliseconds / 1000);
        const minutes = Math.floor(durationInSeconds / 60);
        const seconds = durationInSeconds % 60;

        const formattedDuration = `${minutes}:${String(seconds).padStart(
          2,
          '0',
        )}`;
        setRecordingDuration(formattedDuration); // Update live recording duration
        return;
      });
      setRecording(true);
      console.log('Recording started:', result);
    } catch (err) {
      console.log('Error starting recording:', err);
    }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecording(false);
      setRecordedAudio(result);
      console.log('Recording stopped:', result);

      clearInterval(durationTimer);
    } catch (err) {
      console.log('Error stopping recording:', err);
    }
  };

  const formatDuration = duration => {
    const seconds = Math.floor(duration / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const onStartPlay = async uri => {
    try {
      setPlayingAudio(uri); // Set the currently playing audio
      const msg = await audioRecorderPlayer.startPlayer(uri);
      console.log(msg);

      audioRecorderPlayer.addPlayBackListener(e => {
        setAudioProgress(prevProgress => ({
          ...prevProgress,
          [uri]: {
            currentTime: formatDuration(e.currentPosition),
            duration: formatDuration(e.duration),
            progress: e.currentPosition / e.duration,
          },
        }));

        if (e.currentPosition === e.duration) {
          // Audio playback finished
          onPlaybackComplete(uri);
        }
        return;
      });
    } catch (err) {
      console.log('Error starting playback:', err);
    }
  };

  const onStopPlay = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      onPlaybackComplete(playingAudio); // Handle reset on stop
    } catch (err) {
      console.log('Error stopping playback:', err);
    }
  };

  const onPlaybackComplete = uri => {
    setPlayingAudio(null); // Reset playing state
    setAudioProgress(prevProgress => ({
      ...prevProgress,
      [uri]: {
        ...prevProgress[uri],
        progress: 0,
        currentTime: '00:00',
      },
    }));
  };

  const handleMicIconPressIn = () => {
    if (!message.trim() && !selectedImage && !recordedAudio) {
      onStartRecord();
    }
  };

  const handleMicIconPressOut = () => {
    if (recording) {
      onStopRecord();
    }
  };

  const handleIconPress = () => {
    if (recording) {
      onStopRecord();
    } else if (message.trim() || selectedImage || recordedAudio) {
      handleSendMessage();
    }
  };
  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'mixed'}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const selectedAsset = response.assets[0];
        const selectedUri = selectedAsset.uri;
        const mediaType = selectedAsset.type.startsWith('image/')
          ? 'image'
          : 'video'; // Detect media type

        console.log(' === mediaType ===> ', mediaType);

        setSelectedImage(selectedUri);
        setMediaType(mediaType); // Set media type
        setMessage('');
      }
    });
  };

  const formatDate = dateString => {
    const date = moment(dateString);
    const today = moment().startOf('day');
    const yesterday = moment().subtract(1, 'day').startOf('day');

    if (date.isSame(today, 'd')) {
      return 'Today';
    } else if (date.isSame(yesterday, 'd')) {
      return 'Yesterday';
    } else {
      return date.format('MMM DD, YYYY');
    }
  };

  const getDateHeader = (current, previous) => {
    if (!previous) {
      return formatDate(current.sendAt);
    }

    const currentDate = moment(current.sendAt).startOf('day');
    const previousDate = moment(previous.sendAt).startOf('day');

    if (!currentDate.isSame(previousDate)) {
      return formatDate(current.sendAt);
    }
    return null;
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    // Call toggleModal to show the top modal
    toggleModal();
  };

  const onViewProfilePress = () => {
    // console.log(' === var ===> ', user?.user?.appUsesType);
    const appUsesType = user?.user?.appUsesType;

    threeDotBottomSheetRef.current.close();

    const matchesUserData = {
      firstName: userData?.friendList?.firstName,
      id: userData?.friendList?._id || userData?.id,
      userData: userData,
    };

    console.log(' === matchesUserData ===> ', matchesUserData);

    // navigation.navigate('NewUserDetailsScreen', {matchesUserData});

    if (appUsesType === 'dating') {
      // navigation.navigate('DatingUserDetailsScreen', {matchesUserData});
      // console.log(' === var ===> ', userData?.friendList);
      navigation.navigate('DatingUserDetailsScreen', {
        userData: userData?.friendList,
      });
    } else {
      navigation.navigate('NewUserDetailsScreen', {matchesUserData});
    }
  };

  const renderItem = ({item, index}) => {
    // JSON.stringify(data.data, null, 2)

    const previousItem = messages[index - 1];
    const dateHeader = getDateHeader(item, previousItem);

    return (
      <View>
        {dateHeader && (
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              marginVertical: 10,
              color: '#888',
            }}>
            {dateHeader}
          </Text>
        )}
        <TouchableOpacity
          onLongPress={() => {
            if (item.from === userData?.userList?._id) {
              setSelectedMessage(item);
              setShowModal(true);
              // console.log(' === item ===> ', item.message);
              console.log(' === item ===> ', item);
              console.log(' === From ===> ', item?.from, item?.to, item?.id);
              console.log(
                'Pressed bubble with background color: #FBF4FF (my message)',
              );
            } else {
              console.log(
                'Pressed bubble with background color: #EDF4FF (other user message)',
              );
            }
          }}
          delayLongPress={500}
          activeOpacity={0.6}
          style={{
            flexDirection: 'row',
            alignSelf:
              item.from === userData?.userList?._id ? 'flex-end' : 'flex-start',
            marginBottom: 8,
          }}>
          <View
            style={{
              maxWidth: '70%',
              padding: 12,
              borderRadius: 18,
              backgroundColor:
                item.from === userData?.userList?._id ? '#FBF4FF' : '#EDF4FF',
            }}>
            {item.type === 'image' && item.fileUrl.split('?')[0] && (
              <TouchableOpacity
                onPress={() => {
                  setFullScreenImage(item.fileUrl.split('?')[0]);
                  setIsModalVisible(true);
                }}>
                <Image
                  source={{uri: item.fileUrl.split('?')[0]}}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: 10,
                    marginBottom: 8,
                  }}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            )}

            {item.type === 'video' && item.fileUrl.split('?')[0] && (
              <TouchableOpacity
                onPress={() => {
                  setFullscreenVideoUri(item.fileUrl.split('?')[0]);
                  setIsVideoModalVisible(true);
                }}
                style={{position: 'relative', marginBottom: 8}}>
                <Video
                  source={{uri: item.fileUrl.split('?')[0]}}
                  style={{width: 200, height: 200, borderRadius: 10}}
                  resizeMode="cover"
                />
                <Image
                  source={icons.video_play_icon}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: [{translateX: -25}, {translateY: -25}],
                    width: 50,
                    height: 50,
                  }}
                />
              </TouchableOpacity>
            )}

            {item.type === 'audio' && item.fileUrl.split('?')[0] && (
              <View style={{position: 'relative', height: 30}}>
                <TouchableOpacity
                  style={{
                    width: wp(219),
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    if (playingAudio === item.fileUrl.split('?')[0]) {
                      onStopPlay();
                    } else {
                      onStartPlay(item.fileUrl.split('?')[0]);
                    }
                  }}>
                  <View style={{height: 5, width: 20, marginLeft: -5}}>
                    <Image
                      source={
                        playingAudio === item.fileUrl.split('?')[0]
                          ? icons.pause_audio_icon
                          : icons.audio_play_icon
                      }
                      style={{
                        width: hp(14),
                        height: hp(17),
                        tintColor: 'black',
                        resizeMode: 'contain',
                        marginLeft: 5,
                        // marginTop: '50%',
                        marginTop: 9,
                      }}
                    />
                  </View>
                </TouchableOpacity>

                <Progress.Bar
                  progress={
                    audioProgress[item.fileUrl]
                      ? audioProgress[item.fileUrl].progress
                      : audioProgress[item.fileUrl.split('?')[0]]
                      ? audioProgress[item.fileUrl.split('?')[0]].progress
                      : 0
                  }
                  width={200}
                  style={{
                    marginLeft: 20,
                    marginTop: 10,
                    height: 5,
                    backgroundColor: '#E1E1E1',
                    padding: 0.5,
                    borderWidth: 0,
                    borderRadius: 10,
                  }}
                />

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      marginLeft: 20,
                      color: '#B4B4B4',
                      fontSize: fontSize(14),
                      marginBottom: -10,
                      marginTop: 10,
                    }}>
                    {audioProgress[item.fileUrl.split('?')[0]]
                      ? audioProgress[item.fileUrl.split('?')[0]].currentTime
                      : '00:00'}
                  </Text>

                  <Text style={{marginTop: 10, color: '#B4B4B4'}}>
                    {formatTime(item.sendAt)}
                  </Text>
                </View>
              </View>
            )}

            {/*<Text style={{fontSize: fontSize(14), color: 'black'}}>*/}
            {/*  {item.message}*/}
            {/*</Text>*/}

            {item.type === 'deleted' ? (
              <Text
                style={{
                  fontSize: fontSize(14),
                  color: '#999',
                  fontStyle: 'italic',
                  fontFamily: fontFamily.poppins400,
                }}>
                {item.message}
              </Text>
            ) : (
              <Text style={{fontSize: fontSize(14), color: 'black'}}>
                {item.message}
              </Text>
            )}

            {item.type !== 'audio' && (
              <Text
                style={{
                  fontSize: fontSize(12),
                  color: '#B4B4B4',
                  fontFamily: fontFamily.poppins400,
                  marginTop: 5,
                }}>
                {formatTime(item.sendAt)}
              </Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const handleTyping = text => {
    if (text.trim()) {
      socketRef.current.emit('typing', {
        from: userData?.userList?._id,
        to: userData?.friendList?._id || userData?.friendList[0]._id,
      });
    } else {
      handleStopTyping();
    }
  };

  const handleStopTyping = () => {
    socketRef.current.emit('stopTyping', {
      from: userData?.userList?._id,
      to: userData?.friendList?._id || userData?.friendList[0]._id,
    });
  };

  const onlineStatusColor =
    userData?.friendList?.isUserActive || userData?.friendList[0]?.isUserActive
      ? colors.blue
      : '#A7A7A7';
  const onlineStatusText =
    userData?.friendList?.isUserActive || userData?.friendList[0]?.isUserActive
      ? 'Online'
      : 'Offline';

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle null or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const hasValidImage =
    userData?.friendList?.profilePic ||
    (userData?.friendList[0]?.profilePic && userData?.friendList?.profilePic) ||
    (userData?.friendList[0]?.profilePic !== 'null' &&
      userData?.friendList?.profilePic) ||
    userData?.friendList[0]?.profilePic.trim() !== '';

  const toastConfigs = {
    Copied: ({text1}) => (
      <View
        style={{
          backgroundColor: '#333333', // Toast background color
          // padding: 10,
          borderRadius: 100,
          marginHorizontal: 20,
          // marginTop: -200,
          width: wp(180),
          height: hp(55),
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white', // Toast text color
            fontSize: fontSize(16),
            textAlign: 'center',
            lineHeight: hp(24),
            fontFamily: fontFamily.poppins400,
          }}>
          {text1}
        </Text>
      </View>
    ),
  };

  return (
    <MenuProvider>
      <SafeAreaView style={style.container}>
        <View
          style={{
            flex: 1,
            zIndex: 99,
            position: 'absolute',
            alignSelf: 'center',
            // top: -130,
          }}>
          <Toast config={toastConfigs} />
        </View>
        <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
          <View style={style.headerContainer}>
            {/*<View style={style.headerImageAndIconStyle}>*/}
            {/*  <Image*/}
            {/*    source={images.happyMilanColorLogo}*/}
            {/*    style={style.logoStyle}*/}
            {/*  />*/}
            {/*  <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>*/}
            {/*    {userImage ? (*/}
            {/*      <Image source={{uri: userImage}} style={style.profileIcon} />*/}
            {/*    ) : (*/}
            {/*      <Image*/}
            {/*        source={images.profileDisplayImage}*/}
            {/*        style={style.profileIcon}*/}
            {/*      />*/}
            {/*    )}*/}
            {/*  </TouchableOpacity>*/}
            {/*</View>*/}

            {/*<NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />*/}

            <View style={style.userDetailsContainer}>
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                  width: hp(24),
                  height: hp(24),
                  marginTop: -5,
                  marginRight: wp(5),
                }}>
                <Image
                  source={icons.back_arrow_icon}
                  style={{
                    width: hp(16),
                    height: hp(16),
                    resizeMode: 'contain',
                    top: 4,
                  }}
                />
              </TouchableOpacity>

              {userData?.friendList?.profilePic ||
              userData?.friendList[0]?.profilePic ? (
                <Image
                  source={{
                    uri:
                      userData?.friendList?.profilePic ||
                      userData?.friendList[0]?.profilePic,
                  }}
                  style={style.userProfileIcon}
                />
              ) : (
                <ProfileAvatar
                  firstName={
                    userData?.friendList?.firstName ||
                    userData?.friendList[0]?.firstName
                  }
                  lastName={
                    userData?.friendList?.lastName ||
                    userData?.friendList[0]?.lastName
                  }
                  textStyle={style.userProfileIcon}
                  profileTexts={{fontSize: fontSize(18)}}
                />
              )}

              <View style={style.detailsContainer}>
                <Text style={style.userNameTextStyle}>
                  {userData
                    ? `${capitalizeFirstLetter(
                        userData?.friendList?.firstName ||
                          userData?.friendList[0]?.firstName ||
                          '',
                      )} ${capitalizeFirstLetter(
                        userData?.friendList?.lastName ||
                          userData?.friendList[0]?.lastName ||
                          '',
                      )}`
                    : ''}
                </Text>

                <Text
                  style={{
                    fontStyle: 'italic',
                    color: onlineStatusColor,
                    fontSize: hp(10),
                  }}>
                  {typing ? 'Typing...' : onlineStatusText}
                </Text>
                <Text style={{color: 'black'}}>
                  {userData?.friendList?.isOnline ||
                    userData?.friendList[0]?.isOnline}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() => {
                  threeDotBottomSheetRef.current.open();
                }}
                style={{
                  width: hp(30),
                  height: hp(30),
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.three_dots_icon}
                  style={{width: hp(15), height: hp(25)}}
                />
              </TouchableOpacity>
            </View>
          </View>

          <RBSheet
            ref={threeDotBottomSheetRef}
            closeOnDragDown={true} // Allows drag to close
            closeOnPressMask={true} // Allows closing when clicking outside the sheet
            height={hp(180)} // Adjust height of Bottom Sheet
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
              },
            }}>
            <View
              style={{
                flex: 1,
                marginHorizontal: 17,
                marginTop: 10,
              }}>
              <TouchableOpacity
                onPress={() => {
                  onViewProfilePress();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: hp(30),
                    height: hp(30),
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={icons.view_profile_icon}
                    style={{
                      width: hp(16),
                      height: hp(16),
                      resizeMode: 'contain',
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: colors.black,
                    marginLeft: wp(5),
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                    textAlign: 'center',
                  }}>
                  View Profile
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  threeDotBottomSheetRef.current.close();
                  handleBlockProfilePress();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: hp(10),
                }}>
                <View
                  style={{
                    width: hp(30),
                    height: hp(30),
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={icons.block_icon}
                    style={{
                      width: hp(16),
                      height: hp(16),
                      resizeMode: 'contain',
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: colors.black,
                    marginLeft: wp(5),
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Block
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  threeDotBottomSheetRef.current.close();
                  // handleBlockProfilePress();
                  setDeleteAllModal(true);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: hp(10),
                }}>
                <View
                  style={{
                    width: hp(30),
                    height: hp(30),
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={icons.clear_delete_icon}
                    style={{
                      width: hp(16),
                      height: hp(16),
                      resizeMode: 'contain',
                      tintColor: colors.black,
                    }}
                  />
                </View>
                <Text
                  style={{
                    color: colors.black,
                    marginLeft: wp(5),
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Clear Chat
                </Text>
              </TouchableOpacity>
            </View>
          </RBSheet>

          {/* Modal for Block Confirmation */}
          <Modal
            visible={isBlockModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsBlockModalVisible(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}>
              <View
                style={{
                  width: wp(350),
                  padding: 20,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontSize: fontSize(16),
                    color: 'black',
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                    marginTop: 20,
                  }}>
                  Are you sure you want to
                </Text>
                <Text
                  style={{
                    fontSize: fontSize(16),
                    color: 'black',
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Block This User?
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: hp(30),
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleConfirmBlock}>
                    <LinearGradient
                      colors={['#2D46B9', '#8D1D8D']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={{
                        width: hp(122),
                        height: hp(50),
                        borderRadius: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 20,
                      }}>
                      <Text
                        style={{
                          color: colors.white,
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Yes
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleCancelBlock}>
                    <LinearGradient
                      colors={['#0D4EB3', '#9413D0']}
                      style={{
                        width: wp(122),
                        height: hp(50),
                        borderRadius: 50,
                        borderWidth: 1,
                        justifyContent: 'center',
                        borderColor: 'transparent', // Set border color to transparent
                      }}>
                      <View
                        style={{
                          borderRadius: 50, // <-- Inner Border Radius
                          flex: 1,
                          backgroundColor: colors.white,
                          justifyContent: 'center',
                          margin: isIOS ? 0 : 1,
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            backgroundColor: 'transparent',
                            color: colors.black,
                            margin: 10,
                            fontSize: fontSize(16),
                            lineHeight: hp(24),
                            fontFamily: fontFamily.poppins400,
                          }}>
                          No
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <HomeTopSheetComponent
            isVisible={topModalVisible}
            onBackdropPress={toggleModal}
            onBackButtonPress={toggleModal}
          />

          {hasMessageConsent === null ? (
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size="large" color={colors.black} />
            </View>
          ) : hasMessageConsent === false ? (
            // <View
            //   style={{
            //     backgroundColor: 'white',
            //     flex: 1,
            //     justifyContent: 'center',
            //     alignItems: 'center',
            //   }}>
            //   <View
            //     style={{
            //       width: '90%',
            //       height: hp(272),
            //       backgroundColor: '#E5BDF8',
            //       borderRadius: 15,
            //       alignItems: 'center',
            //     }}>
            //     <Text style={{color: 'black'}}>Safety Tips</Text>
            //
            //     <TouchableOpacity
            //       style={{marginTop: 50}}
            //       onPress={handleConsentSubmit}>
            //       <Text style={{backgroundColor: 'red'}}>Next</Text>
            //     </TouchableOpacity>
            //   </View>
            // </View>
            <View
              style={{
                backgroundColor: 'white',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View
                style={{
                  width: '90%',
                  height: hp(272),
                  backgroundColor: '#FAF0FF',
                  borderRadius: 15,
                  alignItems: 'center',
                  borderWidth: 1.5,
                  borderColor: '#E5BDF8',
                  paddingHorizontal: 15,
                }}>
                {/* Header */}
                <View style={{flexDirection: 'row', marginTop: hp(25)}}>
                  <Image
                    source={icons.blub_icon}
                    style={{
                      width: hp(15),
                      height: hp(16),
                      resizeMode: 'contain',
                      marginRight: hp(10),
                    }}
                  />
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: fontSize(14),
                      lineHeight: hp(20),
                      fontFamily: fontFamily.poppins500,
                    }}>
                    Safety Tips
                  </Text>
                </View>

                {/* Tip Text */}
                <View style={{marginTop: hp(40), paddingHorizontal: 10}}>
                  <Text
                    style={{
                      color: 'black',
                      fontSize: fontSize(14),
                      fontFamily: fontFamily.poppins400,
                      textAlign: 'center',
                    }}>
                    {safetyTips[tipIndex]}
                  </Text>
                </View>

                {/* Pagination Dots */}
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    marginTop: 25,
                    gap: 8,
                  }}>
                  {safetyTips.map((_, index) => (
                    <View
                      key={index}
                      style={{
                        width: hp(10),
                        height: hp(10),
                        borderRadius: 5,
                        backgroundColor:
                          tipIndex === index ? '#8225AF' : '#D3C1E4',
                      }}
                    />
                  ))}
                </View>

                {/* Button */}
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={{
                    marginTop: hp(25),
                    backgroundColor: '#0F52BA',
                    borderRadius: 50,
                    paddingVertical: 10,
                    paddingHorizontal: 30,
                  }}
                  onPress={handleNext}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: fontSize(14),
                      lineHeight: hp(18),
                      fontFamily: fontFamily.poppins500,
                    }}>
                    {tipIndex === safetyTips.length - 1
                      ? 'I agree, start chat'
                      : 'Next'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : messages.length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: hp(20),
              }}>
              <Image
                source={icons.new_no_message_icon}
                style={{width: hp(212), height: hp(170), resizeMode: 'contain'}}
              />
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(18),
                  fontFamily: fontFamily.poppins500,
                }}>
                No Messages
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages.filter(msg => !msg.isTemporary)}
              renderItem={renderItem}
              contentContainerStyle={{
                flexGrow: 1,
                justifyContent: 'flex-end',
                paddingHorizontal: wp(17),
              }}
              onContentSizeChange={() =>
                flatListRef.current.scrollToEnd({animated: true})
              }
              onLayout={() => flatListRef.current.scrollToEnd({animated: true})}
            />
          )}

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="none"
            onRequestClose={() => setIsModalVisible(false)}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={{uri: fullScreenImage}}
                style={{width: '90%', height: '90%', resizeMode: 'contain'}}
              />
            </View>
          </Modal>

          <Modal
            visible={isVideoModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => {
              setIsVideoModalVisible(false);
              setFullscreenVideoUri(null);
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {fullscreenVideoUri && (
                <Video
                  source={{uri: fullscreenVideoUri}}
                  style={{width: '100%', height: '100%'}}
                  resizeMode="contain"
                  controls={true} // This adds video controls (play, pause, etc.)
                />
              )}
              <TouchableOpacity
                onPress={() => {
                  setIsVideoModalVisible(false);
                  setFullscreenVideoUri(null);
                }}
                style={{
                  position: 'absolute',
                  top: 40,
                  right: 20,
                  width: 30,
                  height: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.x_cancel_icon}
                  style={{width: 30, height: 30, tintColor: 'white'}}
                />
              </TouchableOpacity>
            </View>
          </Modal>

          {hasMessageConsent !== false && (
            <View style={{height: isEmojiPickerOpen ? '40%' : 'auto'}}>
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
                  <TouchableOpacity
                    onPress={() => {
                      if (!recordingDuration) {
                        // console.log('Clicked smile_emoji_icon');
                        // Add any additional actions here if needed
                        setEmojiPickerOpen(true);
                      }
                    }}>
                    <Image
                      source={
                        recordingDuration
                          ? icons.red_mic_icon
                          : icons.smile_emoji_icon
                      }
                      style={{
                        width: hp(18),
                        height: hp(18),
                        marginLeft: 8,
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      alignItems: 'center',
                    }}>
                    {selectedImage && (
                      <View
                        style={{
                          width: 55,
                          height: 50,
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={{uri: selectedImage}}
                          style={{
                            width: hp(40),
                            height: hp(40),
                            borderRadius: 5,
                            marginRight: 5,
                            marginLeft: 5,
                          }}
                        />
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedImage(null);
                          }}
                          style={{
                            position: 'absolute',
                            top: isIOS ? 7 : 8,
                            right: isIOS ? 8 : 12,
                          }}>
                          <Image
                            source={icons.x_cancel_icon}
                            style={{
                              width: wp(10),
                              height: hp(8),
                              tintColor: colors.white,
                              resizeMode: 'contain',
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    <TextInput
                      style={{flex: 1, height: 50, color: 'black', padding: 10}}
                      placeholder="Message"
                      placeholderTextColor={'black'}
                      multiline={true}
                      numberOfLines={4}
                      value={message || recordingDuration}
                      editable={!recordingDuration} // Disable editing when recording
                      onChangeText={text => {
                        setMessage(text);
                        handleTyping(text);
                      }}
                      onBlur={handleStopTyping}
                      onFocus={() => handleTyping(message)}
                    />
                  </View>
                  {recordingDuration ? (
                    // Display "X" button when recording
                    <TouchableOpacity
                      style={{
                        width: hp(20),
                        height: hp(20),
                        // borderWidth: 1,
                        borderRadius: 50,
                        marginRight: 15,
                        backgroundColor: 'red',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() => {
                        setRecordingDuration(null); // Clear recording
                        setMessage(''); // Clear the TextInput
                        setSelectedImage(null); // Clear selected image if any
                        setRecordedAudio(null); // Clear recorded audio if any
                      }}>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 12,
                          fontWeight: 'bold',
                        }}>
                        X
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    // Show camera icon when not recording
                    <TouchableOpacity onPress={handleSelectImage}>
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
                  )}
                </View>
                <TouchableOpacity
                  // onPressIn={handleMicIconPressIn}
                  // onPressOut={handleMicIconPressOut}
                  onPress={handleIconPress}
                  style={{
                    width: 50,
                    height: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  {/*<Image*/}
                  {/*  source={*/}
                  {/*    message.trim() || selectedImage || recordedAudio*/}
                  {/*      ? icons.send_icon*/}
                  {/*      : icons.mic_icon*/}
                  {/*  }*/}
                  {/*  style={{width: hp(26), height: hp(26), resizeMode: 'contain'}}*/}
                  {/*/>*/}

                  <Image
                    source={
                      message.trim() || selectedImage
                        ? icons.send_icon
                        : icons.send_icon
                    }
                    style={{
                      width: hp(26),
                      height: hp(26),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Modal
            transparent={true}
            animationType="slide"
            visible={isEmojiPickerOpen}
            onRequestClose={() => setEmojiPickerOpen(false)}>
            <Pressable
              style={{flex: 1, justifyContent: 'flex-end'}}
              onPress={() => setEmojiPickerOpen(false)}>
              <View
                style={{
                  height: hp(245),
                  width: '100%',
                  backgroundColor: 'silver',
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                }}>
                <Pressable style={{flex: 1}} onPress={() => {}}>
                  <EmojiSelector
                    onEmojiSelected={handleEmojiSelect}
                    showSearchBar={false}
                    columns={8}
                  />
                </Pressable>
              </View>
            </Pressable>
          </Modal>

          <Modal visible={showModal} transparent={true} animationType="fade">
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#00000088',
              }}>
              <View
                style={{
                  // padding: 20,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  width: '90%',
                }}>
                {selectedMessage?.type === 'image' ? (
                  <Text
                    style={{
                      color: colors.black,
                      textAlign: 'center',
                      marginTop: hp(24),
                      fontSize: fontSize(14),
                      fontFamily: fontFamily.poppins500,
                    }}>
                    Delete image?
                  </Text>
                ) : selectedMessage?.type === 'video' ? (
                  <Text
                    style={{
                      color: colors.black,
                      textAlign: 'center',
                      marginTop: hp(24),
                      fontSize: fontSize(14),
                      fontFamily: fontFamily.poppins500,
                    }}>
                    Delete video?
                  </Text>
                ) : (
                  <>
                    <Text
                      style={{
                        color: colors.black,
                        // textAlign: 'center',
                        marginTop: hp(15),
                        fontSize: fontSize(14),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                        marginLeft: hp(17),
                      }}>
                      Select an option
                    </Text>

                    {/*<View*/}
                    {/*  style={{*/}
                    {/*    width: '90%',*/}
                    {/*    height: hp(66),*/}
                    {/*    backgroundColor: '#EDF4FF',*/}
                    {/*    alignItems: 'center',*/}
                    {/*    justifyContent: 'center',*/}
                    {/*    alignSelf: 'center',*/}
                    {/*    borderRadius: 14,*/}
                    {/*    marginTop: hp(20),*/}
                    {/*  }}>*/}
                    {/*  <Text*/}
                    {/*    style={{*/}
                    {/*      color: 'black',*/}
                    {/*      fontSize: fontSize(14),*/}
                    {/*      lineHeight: hp(18),*/}
                    {/*      fontFamily: fontFamily.poppins500,*/}
                    {/*    }}>*/}
                    {/*    {selectedMessage?.message?.length > 35*/}
                    {/*      ? `${selectedMessage.message.slice(0, 35)}...`*/}
                    {/*      : selectedMessage?.message}*/}
                    {/*  </Text>*/}
                    {/*</View>*/}
                  </>
                )}

                {selectedMessage?.type === 'image' ? (
                  <View
                    style={{
                      alignSelf: 'center',
                      marginTop: hp(28),
                      marginBottom: hp(31),
                      flexDirection: 'row',
                      width: '90%',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: '50%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}
                      onPress={() => {
                        // ✅ Corrected socket emit
                        socketRef.current.emit('DeleteMessage', {
                          to: selectedMessage?.to,
                          from: selectedMessage?.from,
                          messageId: selectedMessage?.id,
                          messageDeletedAll: true,
                        });

                        // ✅ Optional local deletion
                        setMessages(prevMessages =>
                          prevMessages.filter(
                            msg => msg.id !== selectedMessage?.id,
                          ),
                        );

                        setShowModal(false);
                        setSelectedMessage(null);
                      }}>
                      <Text
                        style={{
                          color: '#0F52BA',
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        height: hp(27),
                        width: 1,
                        backgroundColor: '#DEDEDE',
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        width: '50%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}
                      onPress={() => setShowModal(false)}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : selectedMessage?.type === 'video' ? (
                  <View
                    style={{
                      alignSelf: 'center',
                      marginTop: hp(28),
                      marginBottom: hp(31),
                      flexDirection: 'row',
                      width: '90%',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: '50%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}
                      onPress={() => {
                        // ✅ Corrected socket emit
                        socketRef.current.emit('DeleteMessage', {
                          to: selectedMessage?.to,
                          from: selectedMessage?.from,
                          messageId: selectedMessage?.id,
                          messageDeletedAll: true,
                        });

                        // ✅ Optional local deletion
                        setMessages(prevMessages =>
                          prevMessages.filter(
                            msg => msg.id !== selectedMessage?.id,
                          ),
                        );

                        setShowModal(false);
                        setSelectedMessage(null);
                      }}>
                      <Text
                        style={{
                          color: '#0F52BA',
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        height: hp(27),
                        width: 1,
                        backgroundColor: '#DEDEDE',
                      }}
                    />
                    <TouchableOpacity
                      style={{
                        width: '50%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                      }}
                      onPress={() => setShowModal(false)}>
                      <Text
                        style={{
                          color: colors.black,
                          fontSize: fontSize(16),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Cancel
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      padding: 20,
                    }}>
                    {/* Left empty space */}
                    <View style={{flex: 1}} />

                    {/* Right-side modal content */}
                    <View style={{width: 180, alignItems: 'flex-end'}}>
                      <TouchableOpacity
                        style={{marginBottom: 15}}
                        onPress={() => {
                          // ✅ Corrected socket emit
                          socketRef.current.emit('DeleteMessage', {
                            to: selectedMessage?.to,
                            from: selectedMessage?.from,
                            messageId: selectedMessage?.id,
                            messageDeletedAll: true,
                          });

                          // ✅ Optional local deletion
                          setMessages(prevMessages =>
                            prevMessages.filter(
                              msg => msg.id !== selectedMessage?.id,
                            ),
                          );

                          setShowModal(false);
                          setSelectedMessage(null);
                        }}>
                        <Text
                          style={{
                            textAlign: 'right',
                            fontSize: fontSize(16),
                            lineHeight: hp(20),
                            fontFamily: fontFamily.poppins400,
                            color: colors.black,
                          }}>
                          Delete Message for All
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{
                          marginBottom: 15,

                          color: colors.black,
                        }}
                        onPress={() => {
                          Clipboard.setString(selectedMessage?.message);
                          CopyId();
                          setShowModal(false);
                        }}>
                        <Text
                          style={{
                            textAlign: 'right',
                            fontSize: fontSize(16),
                            lineHeight: hp(20),
                            fontFamily: fontFamily.poppins400,
                            color: colors.black,
                          }}>
                          Copy Message
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={{marginBottom: 5}}
                        onPress={() => setShowModal(false)}>
                        <Text
                          style={{
                            textAlign: 'right',
                            color: '#0F52BA',
                            fontSize: fontSize(16),
                            lineHeight: hp(20),
                            fontFamily: fontFamily.poppins400,
                          }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          </Modal>

          <Modal
            visible={deleteAllModal}
            transparent={true}
            animationType="fade">
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#00000088',
              }}>
              <View
                style={{
                  // padding: 20,
                  backgroundColor: 'white',
                  borderRadius: 10,
                  width: '90%',
                }}>
                <Text
                  style={{
                    color: colors.black,
                    textAlign: 'center',
                    marginTop: hp(24),
                    fontSize: fontSize(12),
                    lineHeight: hp(14),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Are you sure want clear all chat?
                </Text>

                {/*<View*/}
                {/*  style={{*/}
                {/*    width: '90%',*/}
                {/*    height: hp(66),*/}
                {/*    backgroundColor: '#EDF4FF',*/}
                {/*    alignItems: 'center',*/}
                {/*    justifyContent: 'center',*/}
                {/*    alignSelf: 'center',*/}
                {/*    borderRadius: 14,*/}
                {/*    marginTop: hp(20),*/}
                {/*  }}>*/}
                {/*  <Text*/}
                {/*    style={{*/}
                {/*      color: 'black',*/}
                {/*      fontSize: fontSize(14),*/}
                {/*      lineHeight: hp(18),*/}
                {/*      fontFamily: fontFamily.poppins500,*/}
                {/*    }}>*/}
                {/*    {selectedMessage?.message?.length > 35*/}
                {/*      ? `${selectedMessage.message.slice(0, 35)}...`*/}
                {/*      : selectedMessage?.message}*/}
                {/*  </Text>*/}
                {/*</View>*/}

                <View
                  style={{
                    alignSelf: 'center',
                    marginTop: hp(45),
                    marginBottom: hp(31),
                    flexDirection: 'row',
                    width: '90%',
                    justifyContent: 'space-between',
                  }}>
                  <TouchableOpacity
                    style={{
                      width: '50%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}
                    onPress={() => {
                      // ✅ Corrected socket emit
                      socketRef.current.emit('DeleteChat', {
                        from: userData?.userList?._id,
                        to: userData?.friendList?._id,
                        deleteChat: true,
                      });

                      // socketRef.current.emit('chatDeleted');
                      console.log('DeleteChat event emitted'); // ✅ Add this

                      setMessages([]);
                      setDeleteAllModal(false);
                    }}>
                    <Text
                      style={{
                        color: '#0F52BA',
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Yes Clear
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{
                      height: hp(27),
                      width: 1,
                      backgroundColor: '#DEDEDE',
                    }}
                  />
                  <TouchableOpacity
                    style={{
                      width: '50%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}
                    onPress={() => setDeleteAllModal(false)}>
                    <Text
                      style={{
                        color: colors.black,
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </MenuProvider>
  );
};

export default ChatUserScreen;
