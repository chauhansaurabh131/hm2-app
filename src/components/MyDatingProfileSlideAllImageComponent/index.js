import React, {useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {fontSize, hp, wp} from '../../utils/helpers';
import ProfileAvatar from '../letterProfileComponent';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';

const {width} = Dimensions.get('window');

const MyDatingProfileSlideAllImageComponent = ({onBackPress, onMenuPress}) => {
  const {user} = useSelector(state => state.auth);

  // console.log(' === var ===> ', user?.user);

  const images = user?.user?.userProfilePic || [];

  const hasImages =
    Array.isArray(images) && images.length > 0 && images.some(img => img?.url);

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef();

  const renderItem = ({item}) => {
    if (!item?.url) {
      return null;
    }

    return (
      <View style={{width}}>
        <Image
          source={{uri: item.url}}
          style={{
            width: width,
            height: hp(447),
            resizeMode: 'cover',
          }}
        />
      </View>
    );
  };

  return (
    <View>
      <View style={{height: hp(447)}}>
        {/* ✅ CONDITION */}
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
              const index = Math.round(
                event.nativeEvent.contentOffset.x / width,
              );
              setActiveIndex(index);
            }}
          />
        ) : (
          // 🔥 AVATAR FALLBACK
          <ProfileAvatar
            firstName={user?.user?.firstName}
            lastName={user?.user?.lastName}
            textStyle={{
              width: width,
              height: hp(447),
              borderRadius: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            profileTexts={{fontSize: fontSize(80)}}
          />
        )}

        {/* 🔙 BACK BUTTON */}
        <TouchableOpacity
          onPress={onBackPress}
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

        {/* ⋮ MENU */}
        <TouchableOpacity
          onPress={onMenuPress}
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

        {/* 🔥 PAGINATION */}
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
    </View>
  );
};

export default MyDatingProfileSlideAllImageComponent;
