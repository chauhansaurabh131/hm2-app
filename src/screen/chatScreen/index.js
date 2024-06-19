import React, {useEffect, useState} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getAllFriends} from '../../actions/chatActions';

const ChatScreen = ({navigation}) => {
  const userDatas = [
    {
      id: '1',
      name: 'Rishikesh Shah',
      image: images.demo_Five_Image,
      status: 'Hi, I am busy,  I’ll drop you a message after a some time ago',
      online: '2h ago',
    },
    {
      id: '2',
      name: 'Ronit Kumar',
      image: images.demo_Six_Image,
      status: 'Hi, I am busy,  I’ll drop you a message after a some time ago',
      online: 'online',
    },
    {
      id: '3',
      name: 'Priyal Mehta',
      image: images.demo_Seven_Image,
      status: 'Hi, I am busy,  I’ll drop you a message after a some time ago',
      online: '2h ago',
    },
    {
      id: '4',
      name: 'Rhitik Gajjar',
      image: images.demo_Six_Image,
      status: 'Hi, I am busy,  I’ll drop you a message after a some time ago',
      online: '3h ago',
    },
    {
      id: '5',
      name: 'Meet Patel',
      image: images.demo_Seven_Image,
      status: 'Hi, I am busy,  I’ll drop you a message after a some time ago',
      online: 'online',
    },
    {
      id: '6',
      name: 'Niketan Sharma',
      image: images.demo_Six_Image,
      status: 'Hi, I am busy,  I’ll drop you a message after a some time ago',
      online: 'online',
    },
    {
      id: '7',
      name: 'Priyal Mehta',
      image: images.demo_Four_Image,
      status: 'Hi, I am busy,  I’ll drop you a message after a some time ago',
      online: 'online',
    },
    {
      id: '8',
      name: 'Rhitik Gajjar',
      image: images.demo_Four_Image,
      status: 'Hi, I am busy,  I’ll drop you a message after a some time ago',
      online: '2h ago',
    },
    {
      id: '9',
      name: 'Saurabh Singh',
      image: images.demo_Seven_Image,
      status: 'Hi, I am busy,  I’ll drop you a message after a some time ago',
      online: '2h ago',
    },
    {
      id: '10',
      name: 'Kunal Singh',
      image: images.user_one_Image,
      status: 'Hi, I am busy,  I’ll drop you a message after a some time ago',
      online: '2h ago',
    },
    {
      id: '11',
      name: 'Parag ',
      image: images.user_Two_Image,
      status: 'Hi, I am busy,  I’ll drop you a message after a some time ago',
      online: '2h ago',
    },
    {
      id: '12',
      name: 'Surjeet',
      image: images.user_Three_Image,
      status: 'Hi, I am busy,  I’ll drop you a message after a some time ago',
      online: '2h ago',
    },
    {
      id: '13',
      name: 'Vishal',
      image: images.user_Four_Image,
      status: 'Hi, I am busy,  I’ll drop you a message after a some time ago',
      online: '2h ago',
    },
  ];

  const [userInput, setUserInput] = useState('');

  const {myAllFriends} = useSelector(state => state.chat);

  console.log(' === myAllFriends ===> ', myAllFriends.data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllFriends());
  }, [dispatch]);

  const FilterData = item => {
    if (userInput === '') {
      const onlineStatusColor =
        item.online === 'online' ? colors.blue : '#A7A7A7';

      const handleItemPress = userData => {
        // console.log(' === userData______ChatScreen ===> ', userData);
        navigation.navigate('ChatUserScreen', {
          screen: 'ChatUserScreen',
          params: {userData},
        });
      };

      // const handleItemPress = () => {
      //   navigation.navigate('ChatUserScreen', {userData: item});
      // };

      return (
        <TouchableOpacity
          onPress={() => handleItemPress(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: hp(20),
          }}>
          <Image
            // source={item.image}
            source={{uri: item.friend.profilePic}}
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
                {/*{item.name}*/}
                {item.friend.firstName} {item.friend.lastName}
              </Text>
              <Text
                style={{
                  fontSize: fontSize(8),
                  lineHeight: hp(12),
                  fontFamily: fontFamily.poppins500,
                  color: onlineStatusColor, // Apply color based on online status
                  marginTop: 5,
                }}>
                {item.online}
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
              {/*{item.status}*/}
              Hi, I am busy, I’ll drop you a message after a some time ago
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
    if (item.name.toLowerCase().includes(userInput.toLowerCase())) {
      const onlineStatusColor =
        item.online === 'online' ? colors.blue : '#A7A7A7';

      const handleItemPress = () => {
        navigation.navigate('ChatUserScreen', {userData: item});
      };

      return (
        <TouchableOpacity
          onPress={handleItemPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: hp(20),
          }}>
          <Image
            source={item.image}
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
                {item.name}
              </Text>
              <Text
                style={{
                  fontSize: fontSize(8),
                  lineHeight: hp(12),
                  fontFamily: fontFamily.poppins500,
                  color: onlineStatusColor, // Apply color based on online status
                  marginTop: 5,
                }}>
                {item.online}
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
              {item.status}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={{marginHorizontal: wp(17)}}>
        <View style={style.headerContainerTittleStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderLogo}
          />

          <TouchableOpacity activeOpacity={0.7}>
            <Image
              source={images.profileDisplayImage}
              style={style.profileLogoStyle}
            />
          </TouchableOpacity>
        </View>
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
                borderRadius: 10,
                paddingLeft: 20,
                borderColor: '#F0F0F0',
              }}
              placeholder="Search Member"
              placeholderTextColor="black"
              autoCorrect={false}
              onChangeText={text => setUserInput(text)}
            />

            <View
              style={{
                position: 'absolute',
                right: 10,
                top: 5,
                width: 42,
                height: 40,
                backgroundColor: '#F5FBFF', // Change color as needed
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity>
                <Image
                  source={icons.search_icon}
                  style={{width: 16, height: 16}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      {/* FlatList to display user data */}
      <View
        style={{
          marginHorizontal: wp(26),
        }}>
        <FlatList
          // data={userDatas}
          data={myAllFriends.data}
          renderItem={({item, index}) => FilterData(item)}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{height: hp(120)}} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
