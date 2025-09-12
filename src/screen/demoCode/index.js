import React from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {style} from '../newUserDetailsScreen/style';
import {images} from '../../assets';
import ProfileAvatar from '../../components/letterProfileComponent';
import {fontSize, hp, wp} from '../../utils/helpers';
import {useSelector} from 'react-redux';

const DemoCode = () => {
  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;

  const hasValidImage =
    user?.user?.profilePic &&
    user?.user?.profilePic !== 'null' &&
    user?.user?.profilePic.trim() !== '';

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Image
          source={images.happyMilanColorLogo}
          style={{width: wp(96), height: hp(24), resizeMode: 'contain'}}
        />

        <TouchableOpacity
          activeOpacity={0.6}
          // onPress={openBottomSheet}
        >
          {hasValidImage ? (
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={{width: hp(24), height: hp(24), borderRadius: 50}}
            />
          ) : (
            <ProfileAvatar
              firstName={user?.user?.firstName || user?.user?.name}
              lastName={user?.user?.lastName}
              textStyle={{width: hp(24), height: hp(24), borderRadius: 50}}
              profileTexts={{fontSize: fontSize(10)}}
            />
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default DemoCode;
