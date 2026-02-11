import React, {useRef} from 'react';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import ProfileAvatar from '../../components/letterProfileComponent';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';

const ConnectToWebScreen = () => {
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);

  const userImage = user?.user?.profilePic;

  const hasValidImage =
    user?.user?.profilePic &&
    user?.user?.profilePic !== 'null' &&
    user?.user?.profilePic.trim() !== '';

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  return (
    <SafeAreaView
      edges={['top', 'left', 'right']}
      style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17), marginTop: hp(14)}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Image
            source={images.happyMilanColorLogo}
            style={{width: wp(96), height: hp(24), resizeMode: 'contain'}}
          />
          {/*<Image*/}
          {/*  source={images.profileDisplayImage}*/}
          {/*  style={{width: hp(24), height: hp(24), borderRadius: 50}}*/}
          {/*/>*/}

          <TouchableOpacity activeOpacity={0.6} onPress={openBottomSheet}>
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
        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View
          style={{
            flexDirection: 'row',
            marginTop: hp(37),
            marginBottom: hp(20),
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              width: hp(24),
              height: hp(24),
              marginRight: hp(18),
              justifyContent: 'center',
            }}>
            <Image
              source={icons.back_arrow_icon}
              style={{width: hp(16), height: hp(16), resizeMode: 'contain'}}
            />
          </TouchableOpacity>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(21),
              fontFamily: fontFamily.poppins600,
            }}>
            Connect to Web
          </Text>
        </View>
      </View>

      <View style={{backgroundColor: colors.black, flex: 1}}>
        <Text
          style={{
            fontSize: fontSize(16),
            lineHeight: hp(20),
            fontFamily: fontFamily.poppins400,
            color: colors.white,
            textAlign: 'center',
            marginTop: hp(57),
          }}>
          Login to Hapmeet Web
        </Text>

        <Image
          source={icons.connect_web_icon}
          style={{
            width: wp(145),
            height: hp(90),
            alignSelf: 'center',
            marginTop: hp(72),
            resizeMode: 'contain',
          }}
        />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            navigation.navigate('QRCodeScreen');
          }}>
          <LinearGradient
            colors={['#0D4EB3', '#9413D0']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0.5}}
            style={{
              marginTop: hp(72),
              width: wp(300),
              height: hp(50),
              borderRadius: 25,
              justifyContent: 'center',
              alignSelf: 'center',
            }}>
            <Text
              style={{
                color: colors.white,
                textAlign: 'center',
                fontSize: fontSize(16),
                lineHeight: hp(20),
                fontFamily: fontFamily.poppins400,
              }}>
              Connect to Web
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ConnectToWebScreen;
