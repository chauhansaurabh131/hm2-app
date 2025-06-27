import React, {useRef} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {style} from './style';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {icons, images} from '../../../assets';
import ProfileAvatar from '../../../components/letterProfileComponent';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';
import NewProfileBottomSheet from '../../../components/newProfileBottomSheet';
import {useEffect, useState} from 'react';
import {colors} from '../../../utils/colors';

const DatingBlockAllScreen = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;

  // console.log(' === var ===> ', user?.user);

  const [blockedProfiles, setBlockedProfiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  useEffect(() => {
    const fetchBlockedProfiles = async () => {
      setLoading(true); // Show loader
      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/friend/get-block-listv2?appUsesType=dating',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          setBlockedProfiles(data?.data?.results || []);
        } else {
          console.error('Failed to fetch blocked profiles:', data);
        }
      } catch (error) {
        console.error('API error:', error);
      } finally {
        setLoading(false); // Hide loader
      }
    };

    fetchBlockedProfiles();
  }, []);

  const onUnblockedPress = async item => {
    try {
      const payload = {
        user: item?.friend?._id, // logged-in user's ID
        request: item?._id, // the request ID or blocked item ID
        status: 'removed', // based on the API
      };

      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/friend/respond-friend-req',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Unblocked successfully:', data);
        // Refresh the list or remove the unblocked profile
        setBlockedProfiles(prev => prev.filter(p => p._id !== item._id));
      } else {
        console.error('❌ Unblock failed:', data);
      }
    } catch (error) {
      console.error('🚨 API error:', error);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={style.renderContainer}>
        <View style={style.renderBody}>
          {item?.friend?.profilePic ? (
            <Image
              source={{uri: item?.friend.profilePic}}
              style={style.renderUserProfile}
            />
          ) : (
            <ProfileAvatar
              firstName={item?.friend?.firstName || item?.friend?.name}
              lastName={item?.friend?.lastName}
              textStyle={style.renderUserProfile}
              profileTexts={{fontSize: fontSize(10)}}
            />
          )}

          <View>
            <Text style={style.renderNoProfileText}>
              {item?.friend?.firstName || item?.friend?.name}{' '}
              {item?.friend?.lastName}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => onUnblockedPress(item)}
          style={style.unblockButton}>
          <Text style={style.unblockText}>Unblock</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />
          <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>
            {userImage ? (
              <Image
                source={{uri: userImage}}
                style={style.profileImageStyle}
              />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName}
                lastName={user?.user?.lastName}
                textStyle={style.profileImageStyle}
                profileTexts={{fontSize: fontSize(10)}}
              />
            )}
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View style={style.headingTittleContainer}>
          <Text style={style.headingCredentialsText}>Blocked Profiles</Text>
          <TouchableOpacity
            style={style.backButtonContainer}
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back_arrow_icon}
              style={style.backButtonIconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={style.underLineHeaderStyle} />

      {loading ? (
        <View style={style.loaderContainer}>
          <ActivityIndicator size="large" color={colors.black || '#000'} />
        </View>
      ) : (
        <FlatList
          data={blockedProfiles}
          keyExtractor={item => item._id}
          renderItem={renderItem}
          ListEmptyComponent={
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignSelf: 'center',
                alignItems: 'center',
                marginTop: hp(250),
              }}>
              <Image
                source={icons.smile_emoji_icon}
                style={{width: hp(50), height: hp(50)}}
              />
              <Text
                style={{
                  color: colors.black,
                  marginTop: hp(10),
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins500,
                }}>
                No One Friend Block
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default DatingBlockAllScreen;
