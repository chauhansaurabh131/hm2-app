import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator, // Import ActivityIndicator for the loader
} from 'react-native';
import {
  addShortList,
  removeShortList,
  userDatas,
} from '../../actions/homeActions';
import {useDispatch, useSelector} from 'react-redux';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {style} from '../searchUserDataScreen/style';
import {icons} from '../../assets';
import {home} from '../../apis/homeApi';
import Toast from 'react-native-toast-message';

const Abc = () => {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  // Use isUserDataLoading from Redux state to manage the loader
  const {
    userData = [],
    totalPages = 1,
    isUserDataLoading,
  } = useSelector(state => state.home);

  useEffect(() => {
    dispatch(
      userDatas({
        page,
      }),
    );
  }, [dispatch, page]);

  const ShowToast = () => {
    Toast.show({
      type: 'AddShortlisted',
      text1: 'Profile has been shortlisted',
      visibilityTime: 1000,
    });
  };

  const RemoveShortlisted = () => {
    Toast.show({
      type: 'RemoveShortlisted',
      text1: 'Shortlisted has been removed',
      visibilityTime: 1000,
    });
  };

  const onShortListPress = item => {
    if (item?.userShortListDetails) {
      home.removeShortListsData(item.userShortListDetails._id).then(() => {
        dispatch(removeShortList({userId: item._id}));
        ShowToast();
      });
    } else {
      home.addShortListsData({shortlistId: item._id}).then(({data: {data}}) => {
        dispatch(
          addShortList({
            userId: item._id,
            userShortListDetails: {...data, _id: data.id},
          }),
        );
        RemoveShortlisted();
      });
    }
  };

  const toastConfigs = {
    AddShortlisted: ({text1}) => (
      <View
        style={{
          backgroundColor: '#333333', // Toast background color
          borderRadius: 100,
          marginHorizontal: 20,
          marginTop: -25,
          width: wp(300),
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
    RemoveShortlisted: ({text1}) => (
      <View
        style={{
          backgroundColor: '#333333', // Toast background color
          borderRadius: 100,
          marginHorizontal: 20,
          marginTop: -25,
          width: wp(300),
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

  const renderItem = ({item, index}) => {
    const starIconSource = item?.userShortListDetails
      ? icons.black_check_icon // Check icon if shortlisted
      : icons.black_start_icon; // Star icon if not shortlisted

    const profileImage = item?.profilePic
      ? {uri: item?.profilePic}
      : require('../../assets/images/empty_Male_img.jpg');

    return (
      <View style={{padding: 10, borderBottomWidth: 1}}>
        <Image
          source={profileImage}
          style={{width: 100, height: 100, borderRadius: 20}}
        />
        <Text style={{fontSize: fontSize(16)}}>{item.name}</Text>

        <TouchableOpacity
          onPress={() => {
            onShortListPress(item);
          }}
          style={{
            width: hp(30),
            height: hp(30),
            marginBottom: 50,
            marginTop: 10,
            marginLeft: 30,
          }}>
          <Image
            source={starIconSource}
            style={{
              width: hp(30),
              height: hp(30),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Show loader when data is loading */}
      {isUserDataLoading ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : (
        <FlatList
          data={userData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          onEndReached={() => {
            if (page < totalPages) {
              setPage(prevState => prevState + 1);
            }
          }}
        />
      )}

      <Toast config={toastConfigs} />
    </SafeAreaView>
  );
};

export default Abc;
