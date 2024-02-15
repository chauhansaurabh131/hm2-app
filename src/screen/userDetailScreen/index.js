import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import StoryComponent from '../../components/storyComponent';
import style from './style';

const UserDetailScreen = ({route}) => {
  // const {userImage, userName, userGender, userAge, userHeight} = route.params;
  const {userImage, userName, userGender, userAge, userHeight} =
    route.params || {};

  console.log(
    ' === route ===> ',
    userImage,
    userGender,
    userName,
    userAge,
    userHeight,
  );
  // console.log('')

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
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
      <ScrollView>
        <View>
          <Image
            // source={userImage}
            source={images.user_one_Image}
            style={style.userProfileImageStyle}
          />
          <View style={style.UserDetailsContainer}>
            <View style={style.onlineBodyStyle}>
              <Text style={style.bodyTextStyle}>Online</Text>
            </View>

            <Text style={style.userNameTextStyle}>Roshan Patel</Text>

            <View style={style.userDetailsDescriptionContainer}>
              <Text style={style.userDetailsTextStyle}>Male</Text>
              <Text style={style.userDetailsTextStyle}>36,</Text>
              <Text style={style.userDetailsTextStyle}>4'5"</Text>

              <View style={style.verticalLineStyle} />

              <Text style={style.userDetailsTextStyle}>Gujarat</Text>
              <Text style={style.userDetailsTextStyle}>Patel</Text>
            </View>

            <View style={style.userDetailsDescriptionContainer}>
              <Text style={style.userDetailsTextStyle}>Software Engineer</Text>

              <View style={style.verticalLineStyle} />

              <Text style={style.userDetailsTextStyle} />
              <Text style={style.userDetailsTextStyle} />
              <Text style={style.userDetailsTextStyle}>NY United States</Text>
            </View>

            <View style={style.imageBottomContainer}>
              <Image source={icons.image_icon} style={style.bottomImageStyle} />

              <Image source={icons.video_icon} style={style.videoIconStyle} />

              <TouchableOpacity style={style.likeIconContainer}>
                <Image source={icons.starIcon} style={style.likeIconStyle} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/*DESCRIPTION VIEW*/}
        <View style={style.descriptionTextContainer}>
          <Text style={style.descriptionTittleText}>About Me</Text>

          <Text style={style.descriptionBodyText}>
            I'd describe myself as someone who's reliable, trendy, smart and
            someone who always has a smile on the face. I am a big Nature &
            Animal lover. I have lived in different parts of India and
            appreciate all cultures & customs.{' '}
          </Text>
        </View>

        <View style={{alignItems: 'center'}}>
          <Image
            source={icons.rightSideIcon}
            style={{
              width: 12,
              height: 7,
              tintColor: colors.blue,
              marginTop: hp(28),
              transform: [{rotate: '90deg'}],
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserDetailScreen;
