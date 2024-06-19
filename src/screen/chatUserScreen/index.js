import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {colors} from '../../utils/colors';
import {wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import style from './style';

const ChatUserScreen = ({route}) => {
  // const {userData: initialUserData} = route.params;
  // const [userData, setUserData] = useState(initialUserData);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   if (route.params && route.params.userData) {
  //     setUserData(route.params.userData);
  //   }
  // }, [route.params]);

  const handleSendMessage = () => {
    if (message.trim() === '') {
      return;
    }
    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date().getTime(),
    };
    setMessages([newMessage, ...messages]); // Add new message to the beginning of the array
    console.log('Message sent:', message);
    setMessage('');
  };

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

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
          {/*{userData && (*/}
          {/*  <Image source={userData.image} style={style.userProfileIcon} />*/}
          {/*)}*/}
          <View style={style.detailsContainer}>
            <Text style={style.userNameTextStyle}>
              {/*{userData ? userData.name : ''}*/}
            </Text>
            {/*<Text*/}
            {/*  style={[*/}
            {/*    style.statusTextStyle,*/}
            {/*    {*/}
            {/*      color:*/}
            {/*        userData && userData.online === 'online'*/}
            {/*          ? colors.blue*/}
            {/*          : colors.black,*/}
            {/*    },*/}
            {/*  ]}>*/}
            {/*  {userData ? userData.online : ''}*/}
            {/*</Text>*/}
          </View>
          <TouchableOpacity activeOpacity={0.5}>
            <Image source={icons.three_dots_icon} style={style.threeDotIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView
        style={{flex: 1, paddingHorizontal: wp(17)}}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'flex-end'}}>
        {messages
          .slice(0)
          .reverse()
          .map(msg => (
            <View
              key={msg.id}
              style={{
                flexDirection: 'row',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                marginBottom: 8,
              }}>
              {/*{msg.sender !== 'user' && (*/}
              {/*  <Image*/}
              {/*    source={userData.image}*/}
              {/*    style={{*/}
              {/*      width: 40,*/}
              {/*      height: 40,*/}
              {/*      borderRadius: 20,*/}
              {/*      marginRight: 8,*/}
              {/*    }}*/}
              {/*  />*/}
              {/*)}*/}
              <View
                style={{
                  maxWidth: '70%',
                  padding: 12,
                  borderRadius: 8,
                  backgroundColor: '#E3F3FF',
                }}>
                <Text style={{fontSize: 16, color: '#000'}}>{msg.text}</Text>
                <Text style={{fontSize: 12, color: '#999'}}>
                  {formatDate(msg.timestamp)}
                </Text>
              </View>
              {msg.sender === 'user' && (
                <Image
                  source={images.profileDisplayImage}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginLeft: 8,
                  }}
                />
              )}
            </View>
          ))}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 17,
        }}>
        <View
          style={{
            width: 300,
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: '#DDDDDD',
            borderRadius: 10,
            borderWidth: 1,
            paddingHorizontal: 10,
          }}>
          <TextInput
            style={{flex: 1, height: 50}}
            placeholder="Type message"
            placeholderTextColor="black"
            multiline={true}
            numberOfLines={4}
            value={message}
            onChangeText={text => setMessage(text)}
          />
          <TouchableOpacity>
            <Image
              source={icons.simple_camera_icon}
              style={{
                width: 22.5,
                height: 20,
                marginLeft: 10,
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={handleSendMessage}
          style={{
            width: 50,
            height: 50,
            backgroundColor: '#E3F3FF',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.send_icon}
            style={{width: 24.29, height: 20, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChatUserScreen;
