import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import style from './style';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import {colors} from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getAllFriends} from '../../actions/chatActions';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const ChatScreen = ({navigation}) => {
  const [userInput, setUserInput] = useState('');

  const {myAllFriends, isUserDataLoading} = useSelector(state => state.chat);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllFriends());
  }, [dispatch]);

  const FilterData = item => {
    const onlineStatusColor =
      item.online === 'online' ? colors.blue : '#A7A7A7';

    const handleItemPress = userData => {
      navigation.navigate('ChatUserScreen', {
        screen: 'ChatUserScreen',
        params: {userData},
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
          source={{uri: item.user.profilePic}}
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
              {item.user.firstName} {item.user.lastName}
            </Text>
            <Text
              style={{
                fontSize: fontSize(8),
                lineHeight: hp(12),
                fontFamily: fontFamily.poppins500,
                color: onlineStatusColor,
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
            Hi, I am busy, I’ll drop you a message after a some time ago
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
                backgroundColor: '#F5FBFF',
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

      <View style={{marginHorizontal: wp(26)}}>
        {isUserDataLoading ? (
          //SHIMMER LOADER DATA
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
        ) : myAllFriends?.data?.length === 0 ? (
          <View style={{alignItems: 'center', marginTop: hp(20)}}>
            <Text style={{color: colors.black, fontSize: fontSize(14)}}>
              No friend
            </Text>
          </View>
        ) : (
          <FlatList
            data={myAllFriends?.data}
            renderItem={({item}) => FilterData(item)}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{height: hp(120)}} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;
