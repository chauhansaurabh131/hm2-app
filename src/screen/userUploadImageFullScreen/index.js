import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import StoryComponent from '../../components/storyComponent';
import ImagePaginationComponent from '../../components/imagePaginationComponent';
import ImagePaginationAndPinableComponent from '../../components/imagePaginationAndPinableComponent ';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../utils/colors';

const {width, height} = Dimensions.get('window');

const UserUploadImageFullScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={style.container}>
      <View
        style={{
          marginHorizontal: wp(17),
          // flex: 1,
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: hp(14),
          }}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customHeaderLogo}
          />

          <TouchableOpacity activeOpacity={0.7}>
            <Image
              source={images.profileDisplayImage}
              style={style.profileLogoStyle}
            />
          </TouchableOpacity>
        </View>
        <View style={style.userStoryContainer}>
          <StoryComponent />
        </View>
      </View>

      {/*<ImagePaginationComponent />*/}
      <ImagePaginationAndPinableComponent />

      <View
        style={{
          position: 'absolute',
          bottom: 42,
          alignSelf: 'center',
          flexDirection: 'row',
        }}>
        <Image
          source={icons.image_icon}
          style={{
            width: hp(22.06),
            height: hp(20),
            resizeMode: 'contain',
            tintColor: colors.blue,
          }}
        />

        <Image
          source={icons.video_icon}
          style={{
            width: hp(26.59),
            height: hp(20),
            resizeMode: 'contain',
            marginLeft: 25,
          }}
        />
      </View>
      {/*<View*/}
      {/*  style={{*/}
      {/*    backgroundColor: 'orange',*/}
      {/*    position: 'absolute',*/}
      {/*    bottom: 42,*/}
      {/*    right: 20,*/}
      {/*  }}>*/}
      <TouchableOpacity
        activeOpacity={0.5}
        style={{
          position: 'absolute',
          bottom: 42,
          right: 35,
        }}
        onPress={() => navigation.goBack()}>
        <Image
          source={icons.back_arrow_icon}
          style={{
            width: hp(20),
            height: hp(20),
            resizeMode: 'contain',
            tintColor: 'white',
            // marginLeft: wp(50),
          }}
        />
      </TouchableOpacity>
      {/*</View>*/}
    </SafeAreaView>
  );
};

export default UserUploadImageFullScreen;
