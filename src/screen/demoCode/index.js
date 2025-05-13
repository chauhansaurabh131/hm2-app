import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import dayjs from 'dayjs';
import ProfileAvatar from '../../components/letterProfileComponent';

const DemoCode = () => {
  const [totalResults, setTotalResults] = useState(null);
  const [viewers, setViewers] = useState([]);
  const bottomSheetRef = useRef();

  const route = useRoute();
  const {userStatus} = route.params || {};

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const navigation = useNavigation();

  useEffect(() => {
    const fetchStoryViews = async () => {
      try {
        if (!userId) {
          console.warn('User ID is missing');
          return;
        }

        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/story-view/paginated/${userStatus?.id}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        const rawResults = responseData?.data?.results || [];

        setTotalResults(responseData?.data?.totalResults);
        setViewers(rawResults);
      } catch (error) {
        console.error('Error fetching story views:', error);
      }
    };

    if (accessToken && userId) {
      fetchStoryViews();
    }
  }, [accessToken, userId]);

  const formatCustomTime = time => {
    const now = dayjs();
    const posted = dayjs(time);
    const diffInMinutes = now.diff(posted, 'minute');
    const diffInHours = now.diff(posted, 'hour');

    if (diffInMinutes < 1) {
      return 'Just now';
    }
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    if (diffInHours < 3) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }

    return posted.format('hh:mm A'); // e.g., "10:12 AM"
  };

  const clickedOnUser = viewerId => {
    const matchesUserData = {
      firstName: viewerId.name,
      id: viewerId?.id,
    };

    // console.log('Clicked user ID:', viewerId);
    navigation.navigate('NewUserDetailsScreen', {matchesUserData});
  };

  const renderViewer = ({item}) => {
    console.log(' === var ===> ', item?.createdAt);
    const viewer = item.viewerId;

    const hasValidImage =
      viewer.profilePic &&
      viewer.profilePic !== 'null' &&
      viewer.profilePic.trim() !== '';

    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 5,
          marginTop: 5,
        }}>
        <View style={{width: '100%'}}>
          <TouchableOpacity
            activeOpacity={0.3}
            onPress={() => clickedOnUser(viewer)}
            style={{paddingHorizontal: 25}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              {hasValidImage ? (
                <>
                  {viewer?.profilePic && (
                    <Image
                      source={{uri: viewer.profilePic}}
                      style={{
                        width: hp(40),
                        height: hp(40),
                        borderRadius: 20,
                        marginRight: 10,
                      }}
                    />
                  )}
                </>
              ) : (
                <ProfileAvatar
                  firstName={viewer.firstName || viewer.name}
                  lastName={viewer.lastName}
                  textStyle={{
                    width: hp(40),
                    height: hp(40),
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                  profileTexts={{
                    fontSize: fontSize(14),
                  }}
                />
              )}

              <View style={{top: -3}}>
                <Text style={{fontSize: 16, color: 'white'}}>
                  {viewer?.name || 'Unnamed User'}
                </Text>
                <Text style={{fontSize: 12, color: 'white'}}>
                  {item?.createdAt ? formatCustomTime(item.createdAt) : ''}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Text style={{textAlign: 'center', marginTop: 20}}>
        Story View API Demo
      </Text>

      <TouchableOpacity
        onPress={() => bottomSheetRef.current?.open()}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 50,
          padding: 20,
          backgroundColor: '#e0e0e0',
          borderRadius: 10,
        }}>
        <Text>
          Total Results: {totalResults !== null ? totalResults : 'Loading...'}
        </Text>
      </TouchableOpacity>

      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={hp(300)}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0,0,0,0.5)',
          },
          draggableIcon: {
            backgroundColor: 'black',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            backgroundColor: 'black',
          },
        }}>
        <View style={{flex: 1, backgroundColor: 'black'}}>
          <Text
            style={{
              color: 'white',
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins400,
              paddingHorizontal: 25,
              marginBottom: hp(15),
            }}>
            Who viewed?
          </Text>

          <View
            style={{width: '100%', height: 1.5, backgroundColor: '#3F3F3F'}}
          />

          <FlatList
            data={viewers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderViewer}
            contentContainerStyle={{paddingBottom: 20, marginTop: 10}}
          />
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default DemoCode;
