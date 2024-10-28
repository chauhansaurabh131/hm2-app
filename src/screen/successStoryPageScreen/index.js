import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import SuccessStoryFlatListComponent from '../../components/SuccessStoryFlatListComponent';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {useNavigation} from '@react-navigation/native';
import AppColorLogo from '../../components/appColorLogo';
import {useSelector} from 'react-redux';

const SuccessStoryPageScreen = ({route}) => {
  const {story} = route.params;

  const [topModalVisible, setTopModalVisible] = useState(false);
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;

  const {images, title, content, marriageDate} = story;
  const imageCount = images.length;

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        <View style={style.headerContainer}>
          <AppColorLogo />

          <TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.profileLogo}
            />
          </TouchableOpacity>
        </View>

        <View style={style.headerTittleContainer}>
          <Text style={style.headerTittleTextStyle}>
            Story of {story?.title || 'Riya & Rohan'}
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            style={style.addPhotoContainer}
            onPress={() => {
              navigation.navigate('SuccessStoryEditInformationScreen');
            }}>
            <Image source={icons.plus_icon} style={style.addPhotoImageStyle} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between', // Keep space between only when there are 3 or more images
            alignItems: 'center',
            // marginBottom: 20,
            marginHorizontal: 17,
          }}>
          {images.map((imageUrl, index) => (
            <Image
              key={index}
              source={{uri: imageUrl}}
              style={[
                {
                  height: 200, // Fixed height for the image
                  borderRadius: 15, // Rounded corners
                  // marginHorizontal: 5, // Space between images
                  resizeMode: 'cover',
                  backgroundColor: 'red',
                },
                {width: (Dimensions.get('window').width - 50) / imageCount}, // Adjust width based on image count
              ]}
            />
          ))}
        </View>

        <View style={style.bodyContainer}>
          <View style={style.bodyHeadingTittleContainer}>
            <Text style={style.bodyTittleHeadingText}>Our Story</Text>
            <View style={style.bodyTittleHeadingContainer}>
              <View>
                <Text style={style.readTextNumberStyle}>10K</Text>
                <Text style={style.readTextStyle}>Read</Text>
              </View>
              <View style={style.headingTittleStyle}>
                <Text style={style.heartNumberStyle}>9K</Text>
                <Text style={style.heartTextStyle}>Heart</Text>
              </View>
            </View>
          </View>

          <Text style={style.headingDescriptionTextStyle}>
            {story?.content ||
              `When the Tudor king fell for a young lady-in-waiting, Anne Boleyn,
            who possessed eyes "black and beautiful," he was long married to a
            Spanish princess. But Anne refused to be a royal mistress, and the
            king rocked the Western world to win his divorce and make Anne
            queen. Ambassadors could not believe how enslaved the king was by
            his love for Anne. "This accursed Anne has her foot in the stirrup,"
            {'  '} {'\n'} {'\n'}complained the Spanish emissary. To comprehend
            the king's passion, one need only read his 16th century love
            letters, revealing his torment over how elusive she remained: "I beg
            to know expressly your intention touching the love between us…having
            been more than a year wounded by the dart of love, and not yet sure
            whether I shall fail or find a place in your affection." (Their love
            affair ended when he had her beheaded.)`}
          </Text>

          <View style={style.shareImageContainer}>
            <TouchableOpacity activeOpacity={0.6}>
              <Image source={icons.share_icon} style={style.shareIconStyle} />
              <Text style={{color: 'black', fontSize: 10}}>Share</Text>
            </TouchableOpacity>

            <View style={style.spaceStyle} />

            <TouchableOpacity activeOpacity={0.6}>
              <Image source={icons.heart_icon} style={style.heartIconStyle} />
            </TouchableOpacity>
          </View>

          {/*<Text style={style.userNameTextStyle}>Riya & Rohan</Text>*/}
          <Text style={style.userNameTextStyle}>
            Story of {story?.title || 'Riya & Rohan'}
          </Text>

          <Text style={style.userDateTextStyle}>Married on 19 Apr 2023</Text>

          <Text
            style={{
              marginTop: 40,
              color: colors.black,
              fontSize: hp(14),
              lineHeight: hp(21),
              fontFamily: fontFamily.poppins400,
            }}>
            Read More Stories
          </Text>

          <SuccessStoryFlatListComponent />

          <HomeTopSheetComponent
            isVisible={topModalVisible}
            onBackdropPress={toggleModal}
            onBackButtonPress={toggleModal}
          />

          <View style={{height: 150}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SuccessStoryPageScreen;
