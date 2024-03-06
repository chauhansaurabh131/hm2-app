import React, {useState} from 'react';
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
import {hp, wp} from '../../utils/helpers';
import StoryComponent from '../../components/storyComponent';
import style from './style';
import UsersProfileDetailsScreen from '../usersProfileDetailsScreen';
import ImagePaginationComponent from '../../components/imagePaginationComponent';

const UserDetailScreen = ({navigation}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageRotation, setImageRotation] = useState('90deg');

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
    setImageRotation(showFullDescription ? '90deg' : '-90deg');
  };

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
          {/*<Image*/}
          {/*  source={images.user_one_Image}*/}
          {/*  style={style.userProfileImageStyle}*/}
          {/*/>*/}
          <ImagePaginationComponent />

          <View style={style.UserDetailsContainer}>
            <View
              style={{
                position: 'absolute',
                bottom: 35,
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.09)',
              }}>
              <View style={style.onlineBodyStyle}>
                <Text style={style.bodyTextStyle}>Online</Text>
              </View>
              <Text style={style.userNameTextStyle}>Roshan Patel</Text>

              <View style={style.userDetailsDescriptionContainer}>
                <Text style={style.userDetailsTextStyle}>Male</Text>
                <Text style={style.userDetailsTextStyle}>36,</Text>
                <Text style={style.userDetailsTextStyle}>4’ 5”</Text>

                <View style={style.verticalLineStyle} />

                <Text style={style.userDetailsTextStyle}>Gujarati</Text>
                <Text style={style.userDetailsTextStyle}>Patel</Text>
              </View>

              <View style={style.userDetailsDescriptionContainer}>
                <Text style={style.userDetailsTextStyle}>
                  Software Engineer
                </Text>

                <View style={style.verticalLineStyle} />

                <Text style={style.userDetailsTextStyle}>NY</Text>
                <Text style={style.userDetailsTextStyle}>United</Text>
                <Text style={style.userDetailsTextStyle}>States</Text>
              </View>

              <View style={style.bottomImageContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('UserUploadImageFullScreen');
                  }}>
                  <Image
                    source={icons.image_icon}
                    style={{
                      width: hp(20),
                      height: hp(20),
                      resizeMode: 'contain',
                      marginRight: wp(22),
                    }}
                  />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Image
                    source={icons.video_icon}
                    style={{
                      width: hp(24.1),
                      height: hp(20),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>

                <TouchableOpacity style={{position: 'absolute', right: 10}}>
                  <Image
                    source={icons.starIcon}
                    style={{
                      width: hp(21.67),
                      height: hp(20),
                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* DESCRIPTION VIEW */}
        <View style={style.descriptionTextContainer}>
          <Text style={style.descriptionTittleText}>About Me</Text>

          <Text
            numberOfLines={showFullDescription ? undefined : 4}
            style={style.descriptionBodyText}>
            I'd describe myself as someone who's reliable, trendy, smart and
            someone who always has a smile on the face. I am a big Nature &
            Animal lover. I have lived in different parts of India and
            appreciate all cultures & customs.... I'd describe myself as someone
            who's reliable, trendy, smart and someone who always has a smile on
            the face. I am a big Nature & Animal lover. I have lived in
            different parts of India and appreciate all cultures & customs.
          </Text>

          <TouchableOpacity
            onPress={toggleDescription}
            style={{alignItems: 'center'}}>
            <Image
              source={icons.rightSideIcon}
              style={{
                width: 15,
                height: 15,
                tintColor: colors.blue,
                marginTop: hp(20),
                transform: [{rotate: imageRotation}],
              }}
            />
          </TouchableOpacity>

          <UsersProfileDetailsScreen />

          <View style={{height: 50}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserDetailScreen;
