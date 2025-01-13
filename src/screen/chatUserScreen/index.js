import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
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
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {MenuProvider} from 'react-native-popup-menu';
import DropdownMenu from '../message';
import ChatThreeDotComponent from '../../components/chatThreeDotComponent';
import {accepted_Decline_Request} from '../../actions/homeActions';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';

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

  const threeDotBottomSheetRef = useRef();

  const {user} = useSelector(state => state.auth);
  const userImage = userData?.userList?.profilePic;

  const accessToken = user?.tokens?.access?.token;
  const socketRef = useRef(null);
  const flatListRef = useRef(null);
  const dispatch = useDispatch();

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
        console.log('Connected to server');
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

      socket.on('message', async data => {
        // console.log(' === message ===> ', JSON.stringify(data.data, null, 2));

        if (data?.data?.message === 'messages received') {
          setMessages(prevMessages => {
            const newMessages = data.data.sendMessage.results.filter(
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

            const Types = data.data.chatMessage.type;
            console.log(' === Types ===> ', data.data.chatMessage.type);
            const isAudio = data.data.chatMessage.type === 'audio';

            const newImageMessage = {
              from: userData?.userList?._id,
              to: userData?.friendList?._id || userData?.friendList[0]?._id,
              // message: 'image',
              // message: isAudio ? '' : 'image',
              message: Types,
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

      socketRef.current = socket;

      return () => {
        socket.disconnect();
        console.log('Socket disconnected');
      };
    }
  }, [accessToken, userData]);

  const handleSendMessage = async () => {
    const trimmedMessage = message?.trim();

    if (!trimmedMessage && !selectedImage && !recordedAudio) {
      return;
    }

    if (selectedImage) {
      const chatContent = {
        from: userData?.userList?._id,
        to: userData?.friendList?._id || userData?.friendList[0]._id,
        message: mediaType === 'image' ? 'image' : 'video',
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

  const onStartRecord = async () => {
    try {
      const result = await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener(e => {
        setRecordingDuration(formatDuration(e.currentPosition));
        return;
      });
      setRecording(true);
      console.log('Recording started:', result);

      const timer = setInterval(() => {
        setRecordingDuration(prevDuration =>
          formatDuration(
            parseInt(prevDuration.split(':')[1] || '0', 10) + 1000,
          ),
        );
      }, 1000);

      setDurationTimer(timer);
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
      setPlayingAudio(uri);
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
          setPlayingAudio(null);
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
      setPlayingAudio(null); // Reset playback state
      setAudioProgress(prevProgress => ({
        ...prevProgress,
        [playingAudio]: {
          ...prevProgress[playingAudio],
          progress: 0,
          currentTime: '00:00',
        },
      }));
    } catch (err) {
      console.log('Error stopping playback:', err);
    }
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
    threeDotBottomSheetRef.current.close();

    const matchesUserData = {
      firstName: userData?.friendList?.firstName,
      id: userData?.friendList?._id,
      userData: userData,
    };
    navigation.navigate('NewUserDetailsScreen', {matchesUserData});
    // console.log(' === onViewProfilePress ===> ', userData);
  };

  const renderItem = ({item, index}) => {
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
        <View
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
              <View style={{position: 'relative'}}>
                <TouchableOpacity
                  style={{
                    width: wp(219),
                    // height: hp(-15),
                    borderRadius: 10,
                    // justifyContent: 'center',
                    // backgroundColor: 'red',
                    // marginTop: '20%',
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
                        marginTop: '90%',
                      }}
                    />
                  </View>
                </TouchableOpacity>

                <Progress.Bar
                  progress={
                    audioProgress[item.fileUrl]
                      ? audioProgress[item.fileUrl].progress
                      : 0
                  }
                  width={200}
                  style={{
                    marginLeft: 20,
                    marginTop: 20,
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
                    {audioProgress[item.fileUrl]
                      ? audioProgress[item.fileUrl].currentTime
                      : '00:00'}
                  </Text>

                  <Text style={{marginTop: 10}}>{formatTime(item.sendAt)}</Text>
                </View>
              </View>
            )}

            <Text style={{fontSize: fontSize(14), color: 'black'}}>
              {item.message}
            </Text>

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
        </View>
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

  return (
    <MenuProvider>
      <SafeAreaView style={style.container}>
        <View style={style.headerContainer}>
          <View style={style.headerImageAndIconStyle}>
            <Image
              source={images.happyMilanColorLogo}
              style={style.logoStyle}
            />
            <TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>
              {userImage ? (
                <Image source={{uri: userImage}} style={style.profileIcon} />
              ) : (
                <Image
                  source={images.profileDisplayImage}
                  style={style.profileIcon}
                />
              )}
            </TouchableOpacity>
          </View>
          <View style={style.userDetailsContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                width: hp(24),
                height: hp(24),
                marginTop: -5,
                marginRight: wp(13),
              }}>
              <Image
                source={icons.back_arrow_icon}
                style={{
                  width: hp(14),
                  height: hp(14),
                  resizeMode: 'contain',

                  top: 4,
                }}
              />
            </TouchableOpacity>

            {userData && (
              <Image
                source={{
                  uri:
                    userData?.friendList?.profilePic ||
                    userData?.friendList[0]?.profilePic,
                }}
                style={style.userProfileIcon}
              />
            )}
            <View style={style.detailsContainer}>
              <Text style={style.userNameTextStyle}>
                {userData
                  ? `${
                      userData?.friendList?.firstName ||
                      userData?.friendList[0]?.firstName
                    } ${
                      userData?.friendList?.lastName ||
                      userData?.friendList[0]?.lastName
                    }`
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
            {/*<TouchableOpacity activeOpacity={0.5}>*/}
            {/*  <Image*/}
            {/*    source={icons.three_dots_icon}*/}
            {/*    style={style.threeDotIcon}*/}
            {/*  />*/}
            {/*</TouchableOpacity>*/}

            {/*<View>*/}
            {/*  <ChatThreeDotComponent*/}
            {/*    onViewProfilePress={() => {*/}
            {/*      navigation.navigate('UserDetailsScreen', {userData});*/}
            {/*    }}*/}
            {/*    onBlockProfilePress={handleBlockProfilePress}*/}
            {/*  />*/}
            {/*</View>*/}

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
          height={hp(170)} // Adjust height of Bottom Sheet
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
              // onPress={() => {
              //   threeDotBottomSheetRef.current.close();
              //   navigation.navigate('NewUserDetailsScreen', {
              //     matchesUserData: userData?.friendList?._id,
              //   });
              // }}

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
                  style={{width: hp(16), height: hp(16), resizeMode: 'contain'}}
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
                  style={{width: hp(16), height: hp(16), resizeMode: 'contain'}}
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
                  source={icons.report_icon}
                  style={{width: hp(16), height: hp(16), resizeMode: 'contain'}}
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
                Report
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
                // source={icons.smile_emoji_icon}
                source={recording ? icons.red_mic_icon : icons.smile_emoji_icon}
                style={{
                  width: hp(18),
                  height: hp(18),
                  marginLeft: 8,
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
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
                // onChangeText={text => setMessage(text)}
                onChangeText={text => {
                  setMessage(text);
                  handleTyping(text);
                }}
                onBlur={handleStopTyping}
                onFocus={() => handleTyping(message)}
              />
            </View>
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
          </View>
          <TouchableOpacity
            onPressIn={handleMicIconPressIn}
            onPressOut={handleMicIconPressOut}
            onPress={handleIconPress}
            style={{
              width: 50,
              height: 50,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={
                message.trim() || selectedImage || recordedAudio
                  ? icons.send_icon
                  : icons.mic_icon
              }
              style={{width: hp(26), height: hp(26), resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </MenuProvider>
  );
};

export default ChatUserScreen;
