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
import {useRoute} from '@react-navigation/native';

const UserDetailScreen = ({navigation}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageRotation, setImageRotation] = useState('90deg');

  const route = useRoute();
  const {selectedBox} = route.params ?? {};

  console.log(' === selectedBox ===> ', selectedBox);

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
                // backgroundColor: 'rgba(0,0,0,0.09)',
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
                <Text style={style.userDetailsTextStyle}>(2.1km)</Text>
              </View>

              {/*<View style={style.userDetailsDescriptionContainer}>*/}
              {/*  <Text style={style.userDetailsTextStyle}>*/}
              {/*    Software Engineer*/}
              {/*  </Text>*/}

              {/*  <View style={style.verticalLineStyle} />*/}

              {/*  <Text style={style.userDetailsTextStyle}>NY</Text>*/}
              {/*  <Text style={style.userDetailsTextStyle}>United</Text>*/}
              {/*  <Text style={style.userDetailsTextStyle}>States</Text>*/}
              {/*</View>*/}

              <View style={style.bottomImageContainer}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('UserUploadImageFullScreen');
                  }}>
                  <Image source={icons.image_icon} style={style.imageIcon} />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Image source={icons.video_icon} style={style.videoIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={style.startIconContainer}>
                  <Image source={icons.starIcon} style={style.starIcon} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* DESCRIPTION VIEW */}
        <View style={style.descriptionTextContainer}>
          {selectedBox === 'dating' && (
            <>
              <View style={style.likeSharContainer}>
                <TouchableOpacity activeOpacity={0.5}>
                  <Image
                    source={icons.disLike_icon}
                    style={style.dislikeIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5}>
                  <Image source={icons.likeIcon} style={style.likeIcon} />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5}>
                  <Image
                    source={icons.star_border_icon}
                    style={style.startIcon}
                  />
                </TouchableOpacity>

                <TouchableOpacity activeOpacity={0.5}>
                  <Image source={icons.shareIcon} style={style.shareIcon} />
                </TouchableOpacity>
              </View>
            </>
          )}
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
                width: 8,
                height: 8,
                tintColor: colors.blue,
                marginTop: hp(20),
                transform: [{rotate: imageRotation}],
                resizeMode: 'contain',
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
