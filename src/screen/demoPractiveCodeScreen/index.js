import React, {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  View,
  FlatList,
  Image,
  StyleSheet,
} from 'react-native';
import {getAllFriends} from '../../actions/chatActions';
import {useDispatch, useSelector} from 'react-redux';

const DemoPractiveCodeScreen = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllFriends());
  }, [dispatch]);

  const {myAllFriends, isUserDataLoading} = useSelector(state => state.chat);

  // Extracting friend data from myAllFriends
  const friends = myAllFriends.data?.results || [];

  // Render function for each item in the FlatList
  const renderFriendItem = ({item}) => (
    <View style={styles.friendContainer}>
      <Image
        source={{uri: item.friendList.profilePic}}
        style={styles.profileImage}
      />
      <Text style={styles.friendName}>
        {item.friendList.firstName} {item.friendList.lastName}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isUserDataLoading ? (
        <Text>Loading...</Text>
      ) : (
        <FlatList
          data={friends}
          renderItem={renderFriendItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  friendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DemoPractiveCodeScreen;
