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
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import StoryComponent from '../../components/storyComponent';
import style from './style';
import {useRoute} from '@react-navigation/native';

const UserDetailScreen = () => {
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
          <Image
            source={images.user_one_Image}
            style={style.userProfileImageStyle}
          />
          <View style={style.UserDetailsContainer}>
            {/* Other user details */}
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

          <View style={{height: 50}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserDetailScreen;
