import React, {useEffect, useState, useRef} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {icons} from '../../assets';

const ChatUserScreen = ({route}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollViewRef = useRef();

  const handleSendMessage = () => {
    if (message.trim() === '') {
      return;
    } // Prevent sending empty messages
    const newMessage = {
      id: messages.length + 1, // Generate unique id for each message
      text: message,
      sender: 'user', // Assuming user is the sender, you can adjust this as needed
      timestamp: new Date().getTime(), // Add timestamp for sorting or displaying time
    };
    setMessages([...messages, newMessage]); // Add new message to the end of the array
    console.log('Message sent:', message);
    setMessage('');
  };

  useEffect(() => {
    // Scroll to the bottom when a new message is added
    scrollViewRef.current.scrollToEnd({animated: true});
  }, [messages]);

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        ref={scrollViewRef}
        style={{flex: 1, paddingHorizontal: 16}}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={{flex: 1, justifyContent: 'flex-end'}}>
          {messages.map(msg => (
            <View
              key={msg.id}
              style={{
                maxWidth: '70%', // Adjust based on your design
                marginVertical: 8,
                padding: 12,
                borderRadius: 8,
                backgroundColor: '#E3F3FF',
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}>
              <Text style={{fontSize: 16, color: '#000'}}>{msg.text}</Text>
              <Text style={{fontSize: 12, color: '#999'}}>
                {formatDate(msg.timestamp)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderTopWidth: 1,
          borderTopColor: '#DDDDDD',
          paddingVertical: 8,
          paddingHorizontal: 16,
        }}>
        <TextInput
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: '#DDDDDD',
            borderRadius: 10,
            paddingHorizontal: 12,
          }}
          placeholder="Type message"
          placeholderTextColor="black"
          multiline={true}
          numberOfLines={4}
          value={message}
          onChangeText={text => setMessage(text)}
        />
        <TouchableOpacity
          onPress={handleSendMessage}
          style={{
            marginLeft: 12,
            padding: 8,
            backgroundColor: '#E3F3FF',
            borderRadius: 10,
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

// import React, {useEffect, useState} from 'react';
// import {
//   SafeAreaView,
//   Text,
//   Image,
//   View,
//   TouchableOpacity,
//   TextInput,
// } from 'react-native';
// import {colors} from '../../utils/colors';
// import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
// import {icons, images} from '../../assets';
// import {useNavigation} from '@react-navigation/native';
// import style from './style';
//
// const ChatUserScreen = ({route}) => {
//   const {userData: initialUserData} = route.params;
//   const [userData, setUserData] = useState(initialUserData);
//   const [message, setMessage] = useState('');
//
//   useEffect(() => {
//     if (route.params && route.params.userData) {
//       setUserData(route.params.userData);
//     }
//   }, [route.params]);
//
//   const handleSendMessage = () => {
//     // Implement sending message functionality here
//     console.log('Message sent:', message);
//     // Clear the message input field
//     setMessage('');
//   };
//
//   return (
//     <SafeAreaView style={style.container}>
//       <View style={style.headerContainer}>
//         <View style={style.headerImageAndIconStyle}>
//           <Image source={images.happyMilanColorLogo} style={style.logoStyle} />
//           <TouchableOpacity activeOpacity={0.7}>
//             <Image
//               source={images.profileDisplayImage}
//               style={style.profileIcon}
//             />
//           </TouchableOpacity>
//         </View>
//         <View style={style.userDetailsContainer}>
//           {userData && (
//             <Image source={userData.image} style={style.userProfileIcon} />
//           )}
//           <View style={style.detailsContainer}>
//             <Text style={style.userNameTextStyle}>
//               {userData ? userData.name : ''}
//             </Text>
//             <Text
//               style={[
//                 style.statusTextStyle,
//                 {
//                   color:
//                     userData && userData.online === 'online'
//                       ? colors.blue
//                       : colors.black,
//                 },
//               ]}>
//               {userData ? userData.online : ''}
//             </Text>
//           </View>
//           <TouchableOpacity activeOpacity={0.5}>
//             <Image source={icons.three_dots_icon} style={style.threeDotIcon} />
//           </TouchableOpacity>
//         </View>
//       </View>
//       <View
//         style={{
//           backgroundColor: 'red',
//           flex: 1,
//           marginHorizontal: wp(17),
//           justifyContent: 'flex-end',
//         }}>
//         <View style={{backgroundColor: 'green'}}>
//           <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
//             <View
//               style={{
//                 width: 300,
//                 flexDirection: 'row',
//                 alignItems: 'center',
//                 borderColor: '#DDDDDD',
//                 borderRadius: 10,
//                 borderWidth: 1,
//                 paddingHorizontal: 10,
//               }}>
//               <TextInput
//                 style={{flex: 1, height: 50}}
//                 placeholder="Type message"
//                 placeholderTextColor="black"
//                 multiline={true}
//                 numberOfLines={4}
//                 value={message}
//                 onChangeText={text => setMessage(text)}
//               />
//               <TouchableOpacity onPress={handleSendMessage}>
//                 <Image
//                   source={icons.simple_camera_icon}
//                   style={{
//                     width: 22.5,
//                     height: 20,
//                     marginLeft: 10,
//                     resizeMode: 'contain',
//                   }}
//                 />
//               </TouchableOpacity>
//             </View>
//             <TouchableOpacity
//               style={{
//                 width: 50,
//                 height: 50,
//                 backgroundColor: '#E3F3FF',
//                 borderRadius: 10,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}>
//               <Image
//                 source={icons.send_icon}
//                 style={{width: 24.29, height: 20, resizeMode: 'contain'}}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//       </View>
//     </SafeAreaView>
//   );
// };
//
// export default ChatUserScreen;
