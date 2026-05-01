import React, {useCallback, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

import {hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';
import ProfileAvatar from '../../components/letterProfileComponent';
import {fontSize} from '../../utils/helpers';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
const {width} = Dimensions.get('window');

const UserProfileSlideAllImageComponent = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {matchesUserData} = route.params;
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();

  // 🔥 FETCH API
  const fetchUserDetails = async () => {
    if (!matchesUserData?.id || !accessToken) {
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/user/${matchesUserData.id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const data = await response.json();

      if (data?.data?.length > 0) {
        setUserDetails(data.data[0]);
      } else {
        setUserDetails(matchesUserData?.userData?.friend);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserDetails();
    }, [matchesUserData?.id, accessToken]),
  );

  // 🔥 IMAGE LOGIC
  const profilePic = userDetails?.profilePic;

  const userImages = Array.isArray(userDetails?.userProfilePic)
    ? userDetails.userProfilePic
    : [];

  const filteredUserImages = userImages.filter(
    item =>
      item?.url &&
      item.url.trim().toLowerCase() !== profilePic?.trim().toLowerCase(),
  );

  const images = [
    ...(profilePic ? [{url: profilePic}] : []),
    ...filteredUserImages,
  ];

  const hasImages = images.length > 0 && images.some(img => img?.url);

  // 🔥 RENDER ITEM
  const renderItem = ({item}) => {
    if (!item?.url) {
      return null;
    }

    return (
      <View style={{width}}>
        <Image
          source={{uri: item.url}}
          style={{
            width,
            height: hp(447),
            resizeMode: 'cover',
          }}
        />
      </View>
    );
  };

  // 🔥 SHIMMER LOADER
  if (loading) {
    return (
      <View style={{height: hp(447), width: '100%'}}>
        {/* MAIN IMAGE */}
        <ShimmerPlaceholder
          shimmerColors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
          style={{
            width: '100%',
            height: hp(447),
          }}
        />

        {/* PAGINATION */}
        <View
          style={{
            position: 'absolute',
            bottom: hp(20),
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          {[1, 2, 3].map((_, index) => (
            <ShimmerPlaceholder
              key={index}
              style={{
                width: wp(40),
                height: hp(7),
                marginHorizontal: 3,
                borderRadius: hp(100),
              }}
            />
          ))}
        </View>

        <ShimmerPlaceholder
          shimmerColors={['#E0E0E0', '#F5F5F5', '#E0E0E0']}
          style={{
            width: '100%',
            height: hp(220),
          }}
        />

        {/* BACK */}
        <View
          style={{
            position: 'absolute',
            top: hp(16),
            left: wp(24),
          }}>
          <ShimmerPlaceholder
            style={{
              height: hp(30),
              width: hp(30),
              borderRadius: hp(20),
            }}
          />
        </View>

        {/* MENU */}
        <View
          style={{
            position: 'absolute',
            top: hp(16),
            right: wp(24),
          }}>
          <ShimmerPlaceholder
            style={{
              height: hp(30),
              width: hp(30),
              borderRadius: hp(20),
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={{height: hp(447)}}>
      {hasImages ? (
        <FlatList
          ref={flatListRef}
          data={images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          onMomentumScrollEnd={event => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setActiveIndex(index);
          }}
        />
      ) : (
        <ProfileAvatar
          firstName={userDetails?.firstName}
          lastName={userDetails?.lastName}
          textStyle={{
            width,
            height: hp(447),
            justifyContent: 'center',
            alignItems: 'center',
          }}
          profileTexts={{fontSize: fontSize(80)}}
        />
      )}

      {/* BACK */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{
          position: 'absolute',
          top: hp(16),
          left: wp(24),
        }}>
        <View
          style={{
            height: hp(30),
            width: hp(30),
            borderRadius: hp(20),
            backgroundColor: 'rgba(0,0,0,0.35)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={icons.left_arrow_icon}
            style={{
              width: hp(9),
              height: hp(12),
              tintColor: colors.white,
              transform: [{rotate: '180deg'}],
            }}
          />
        </View>
      </TouchableOpacity>

      {/* MENU */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: hp(16),
          right: wp(24),
        }}>
        <View
          style={{
            height: hp(30),
            width: hp(30),
            borderRadius: hp(20),
            backgroundColor: 'rgba(0,0,0,0.35)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            source={icons.three_dots_icon}
            style={{
              width: hp(15),
              height: hp(15),
              tintColor: colors.white,
            }}
          />
        </View>
      </TouchableOpacity>

      {/* PAGINATION */}
      {hasImages && (
        <View
          style={{
            position: 'absolute',
            bottom: hp(20),
            alignSelf: 'center',
            flexDirection: 'row',
          }}>
          {images.map((_, index) => (
            <View
              key={index}
              style={{
                width: wp(40),
                height: hp(7),
                marginHorizontal: 3,
                borderRadius: hp(100),
                backgroundColor:
                  activeIndex === index ? '#fff' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default UserProfileSlideAllImageComponent;
