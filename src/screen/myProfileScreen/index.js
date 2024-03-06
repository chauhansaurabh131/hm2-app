import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import StoryComponent from '../../components/storyComponent';
import {hp, wp} from '../../utils/helpers';
import AdminProfileDetailsScreen from '../adminProfileDetailsScreen';

const MyProfileScreen = () => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageRotation, setImageRotation] = useState('90deg');
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(
    "I'd describe myself as someone who's reliable, trendy, smart and someone who always has a smile on the face. I am a big Nature & Animal lover. I have lived in different parts of India and appreciate all cultures & customs.... I'd describe myself as someone who's reliable, trendy, smart and someone who always has a smile on the face. I am a big Nature & Animal lover. I have lived in different parts of India and appreciate all cultures & customs.",
  );
  const [editedDescription, setEditedDescription] = useState(description);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
    setImageRotation(showFullDescription ? '90deg' : '-90deg');
  };

  const handleEditDescription = () => {
    setIsEditing(true);
  };

  const handleSaveDescription = () => {
    setDescription(editedDescription);
    setIsEditing(false);
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
            source={images.profileDisplayImage}
            style={style.userProfileImage}
          />

          {/*<View style={{position: 'absolute', bottom: 50}}>*/}
          {/*  <Text>hjvkbv</Text>*/}
          {/*</View>*/}

          <View style={style.UserDetailsContainer}>
            <View
              style={{
                position: 'absolute',
                // bottom: 35,
                bottom: -1,
                width: '100%',
                backgroundColor: 'rgba(0,0,0,0.1)',
                height: 150,
              }}>
              <View style={{marginLeft: wp(18.16)}}>
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
                      // navigation.navigate('UserUploadImageFullScreen');
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
        </View>

        {/*HEADER TO LIKE DISLIKE*/}
        <View style={style.profileLikeDislikeContainer}>
          <View style={style.profileLikeDislikeContainerBody}>
            <View style={style.profileLikeDislikeSeparateContainer}>
              <Image
                source={icons.heart_like_icon}
                style={style.likeProfileIcon}
              />
              <View>
                <Text style={style.TittleTextStyle}>1200</Text>
                <Text style={style.subTittleTextStyle}>Likes</Text>
              </View>
            </View>

            <View style={style.profileLikeDislikeSeparateContainer}>
              <Image
                source={icons.light_arrow_icon}
                style={style.upArrowIcon}
              />
              <View>
                <Text style={style.TittleTextStyle}>50</Text>
                <Text style={style.subTittleTextStyle}>Sent</Text>
              </View>
            </View>

            <View style={style.profileLikeDislikeSeparateContainer}>
              <Image
                source={icons.light_arrow_icon}
                style={style.downArrowIcon}
              />
              <View>
                <Text style={style.TittleTextStyle}>180</Text>
                <Text style={style.subTittleTextStyle}>Received</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={style.bodyContainerStyle}>
          <View style={style.underLineStyle} />
        </View>

        <View style={style.bodyContainer}>
          <Text style={style.TittleTextStyle}>About Me</Text>

          {/*<Text*/}
          {/*  numberOfLines={showFullDescription ? undefined : 4}*/}
          {/*  style={style.descriptionBodyText}>*/}
          {/*  I'd describe myself as someone who's reliable, trendy, smart and*/}
          {/*  someone who always has a smile on the face. I am a big Nature &*/}
          {/*  Animal lover. I have lived in different parts of India and*/}
          {/*  appreciate all cultures & customs.... I'd describe myself as someone*/}
          {/*  who's reliable, trendy, smart and someone who always has a smile on*/}
          {/*  the face. I am a big Nature & Animal lover. I have lived in*/}
          {/*  different parts of India and appreciate all cultures & customs.*/}
          {/*</Text>*/}

          {isEditing ? (
            <TextInput
              multiline
              style={style.descriptionBodyText}
              value={editedDescription}
              onChangeText={setEditedDescription}
            />
          ) : (
            <Text
              numberOfLines={showFullDescription ? undefined : 4}
              style={style.descriptionBodyText}>
              {description}
            </Text>
          )}

          <TouchableOpacity
            onPress={toggleDescription}
            style={style.toggleButtonStyle}>
            <Image
              source={icons.rightSideIcon}
              style={[
                style.toggleImageStyle,
                {transform: [{rotate: imageRotation}]},
              ]}
            />
          </TouchableOpacity>

          <AdminProfileDetailsScreen
            onEditButtonPress={handleEditDescription}
          />

          {isEditing && (
            <TouchableOpacity onPress={handleSaveDescription}>
              <Text style={{color: 'blue', textDecorationLine: 'underline'}}>
                Save
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileScreen;
