import React, {useEffect} from 'react';
import {View, Text, FlatList, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {userDatas} from '../../actions/homeActions';
import {getAllFriends} from '../../actions/chatActions';

const ChatScreen = () => {
  const {myAllFriends} = useSelector(state => state.chat);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(userDatas());
  // }, [dispatch]);

  useEffect(() => {
    dispatch(getAllFriends());
  }, [dispatch]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>My Friends</Text>
      <FlatList
        data={myAllFriends.data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <Image
              source={{uri: item.friend.profilePic}}
              style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}}
            />
            <View>
              <Text style={{fontSize: 16}}>
                {item.friend.firstName} {item.friend.lastName}
              </Text>
              {/* Additional info if needed */}
              {/* <Text>{item.friend.email}</Text> */}
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ChatScreen;
