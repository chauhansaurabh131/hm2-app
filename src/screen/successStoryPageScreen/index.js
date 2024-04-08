import React, {useState} from 'react';
import {
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

const SuccessStoryPageScreen = ({route}) => {
  const [topModalVisible, setTopModalVisible] = useState(false);
  const navigation = useNavigation();

  // const {name} = route.params;
  // const name = route.params?.name ?? 'Riya & Rohan';
  const {name, selectedImages, description} = route.params ?? {};

  console.log(' === name.... ===> ', name);
  console.log(' === selectedImages..... ===> ', selectedImages);
  console.log(' === selectedImages..... ===> ', description);

  // const data = [
  //   {id: '1', image: images.couple_One_Image},
  //   {id: '2', image: images.couple_Two_Image},
  //   {id: '3', image: images.couple_Three_Image},
  // ];

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  const renderItem = ({item}) => (
    <Image
      source={item.image}
      style={{
        width: wp(110),
        height: hp(150),
        borderRadius: 10,
        marginHorizontal: 4.5,
      }}
    />
  );

  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        <View style={style.headerContainer}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.headerLogoStyle}
          />

          <TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>
            <Image
              source={images.profileDisplayImage}
              style={style.profileLogo}
            />
          </TouchableOpacity>
        </View>

        <View style={style.headerTittleContainer}>
          <Text style={style.headerTittleTextStyle}>
            Story of {name || 'Riya & Rohan'}
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

      <View style={style.bodyContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/*<FlatList*/}
          {/*  data={data}*/}
          {/*  horizontal*/}
          {/*  showsHorizontalScrollIndicator={false}*/}
          {/*  keyExtractor={item => item.id}*/}
          {/*  renderItem={renderItem}*/}
          {/*/>*/}

          {/*<View style={{flexDirection: 'row', justifyContent: 'space-between'}}>*/}
          {/*  <Image*/}
          {/*    source={images.couple_One_Image}*/}
          {/*    style={{width: wp(115), height: hp(154)}}*/}
          {/*  />*/}

          {/*  <Image*/}
          {/*    source={images.couple_Two_Image}*/}
          {/*    style={{width: wp(115), height: hp(154)}}*/}
          {/*  />*/}

          {/*  <Image*/}
          {/*    source={images.couple_Three_Image}*/}
          {/*    style={{width: wp(115), height: hp(154)}}*/}
          {/*  />*/}
          {/*</View>*/}

          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            {selectedImages && selectedImages.length >= 3 ? (
              <>
                <Image
                  source={{uri: selectedImages[0]}}
                  style={{width: wp(115), height: hp(170), borderRadius: 10}}
                />
                <Image
                  source={{uri: selectedImages[1]}}
                  style={{width: wp(115), height: hp(170), borderRadius: 10}}
                />
                <Image
                  source={{uri: selectedImages[2]}}
                  style={{width: wp(115), height: hp(170), borderRadius: 10}}
                />
              </>
            ) : (
              <>
                <Image
                  source={images.couple_Three_Image} // Provide a default image source
                  style={{width: wp(115), height: hp(154), borderRadius: 10}}
                />
                <Image
                  source={images.couple_Two_Image} // Provide a default image source
                  style={{width: wp(115), height: hp(154), borderRadius: 10}}
                />
                <Image
                  source={images.couple_One_Image} // Provide a default image source
                  style={{width: wp(115), height: hp(154), borderRadius: 10}}
                />
              </>
            )}
          </View>

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
            affair ended when he had her beheaded.)`
          </Text>

          {/*<Text style={style.headingDescriptionStyle}>*/}
          {/*  complained the Spanish emissary. To comprehend the king's passion,*/}
          {/*  one need only read his 16th century love letters, revealing his*/}
          {/*  torment over how elusive she remained: "I beg to know expressly your*/}
          {/*  intention touching the love between us…having been more than a year*/}
          {/*  wounded by the dart of love, and not yet sure whether I shall fail*/}
          {/*  or find a place in your affection." (Their love affair ended when he*/}
          {/*  had her beheaded.)*/}
          {/*</Text>*/}

          <View style={style.shareImageContainer}>
            <TouchableOpacity activeOpacity={0.6}>
              <Image source={icons.share_icon} style={style.shareIconStyle} />
            </TouchableOpacity>

            <View style={style.spaceStyle} />

            <TouchableOpacity activeOpacity={0.6}>
              <Image source={icons.heart_icon} style={style.heartIconStyle} />
            </TouchableOpacity>
          </View>

          {/*<Text style={style.userNameTextStyle}>Riya & Rohan</Text>*/}
          <Text style={style.userNameTextStyle}>
            Story of {name || 'Riya & Rohan'}
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
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SuccessStoryPageScreen;
