import React from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';

// ===== Dummy data for studios =====
const studioList = [
  {
    id: 1,
    title: 'Happy Moments Studio',
    location: '304, Doubledaker, Sector 24, Gandhinagar, Gujarat 382024, India',
    image: images.photo_studio_img,
    bgImage: images.photo_studio_background_img,
  },
  {
    id: 2,
    title: 'Memories Click Studio',
    location: 'Science City Road, Ahmedabad, Gujarat 380060, India',
    image: images.photo_studio_img,
    bgImage: images.photo_studio_background_img,
  },
  {
    id: 3,
    title: 'Shutter Art Studio',
    location: 'CG Road, Navrangpura, Ahmedabad, Gujarat 380009, India',
    image: images.photo_studio_img,
    bgImage: images.photo_studio_background_img,
  },
  {
    id: 4,
    title: 'Capture House Studio',
    location: 'Prahlad Nagar, Ahmedabad, Gujarat 380015, India',
    image: images.photo_studio_img,
    bgImage: images.photo_studio_background_img,
  },
  {
    id: 5,
    title: 'Wedding Dreams Studio',
    location: 'Maninagar, Ahmedabad, Gujarat 380008, India',
    image: images.photo_studio_img,
    bgImage: images.photo_studio_background_img,
  },
  {
    id: 6,
    title: 'Royal Frames Studio',
    location: 'Bopal, Ahmedabad, Gujarat 380058, India',
    image: images.photo_studio_img,
    bgImage: images.photo_studio_background_img,
  },
];

const ServicesSearchScreen = () => {
  const navigation = useNavigation();

  const renderStudioCard = ({item}) => {
    return (
      <TouchableOpacity
        style={{marginTop: hp(10), alignItems: 'center', marginHorizontal: 17}}
        activeOpacity={0.6}
        onPress={() => {
          navigation.navigate('ServicesProfileScreen', {studio: item});
        }}>
        <View style={{width: '100%'}}>
          <View
            style={{
              width: '100%',
              borderWidth: 1,
              borderColor: '#EFEFEF',
              borderRadius: 15,
            }}>
            {/* Background image */}
            <Image
              source={item.bgImage}
              style={{
                width: '100%',
                height: hp(167),
                borderRadius: 15,
              }}
            />

            {/* Studio main image (logo/profile) */}
            <View style={{top: -25}}>
              <Image
                source={item.image}
                style={{width: hp(50), height: hp(50), marginLeft: wp(17)}}
              />
            </View>

            {/* Studio info */}
            <View style={{marginHorizontal: wp(17)}}>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(18),
                  fontFamily: fontFamily.poppins600,
                }}>
                {item.title}
              </Text>

              <Text
                style={{
                  color: '#6E6E6E',
                  marginTop: hp(4),
                  fontFamily: fontFamily.poppins400,
                  fontSize: fontSize(11),
                }}>
                {item.location}
              </Text>

              {/* Tags */}
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    marginBottom: 16,
                    marginTop: hp(15),
                    width: hp(145),
                    height: hp(33),
                    backgroundColor: '#F9F6FF',
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={icons.wedding_Studio_icon}
                    style={{
                      width: hp(16),
                      height: hp(16),
                      resizeMode: 'contain',
                      marginRight: wp(10),
                    }}
                  />
                  <Text
                    style={{
                      color: colors.pureBlack,
                      fontSize: fontSize(12),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Birthday Shoot
                  </Text>
                </View>

                <View
                  style={{
                    marginBottom: 16,
                    marginTop: hp(15),
                    width: hp(88),
                    height: hp(33),
                    backgroundColor: '#F9F6FF',
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={icons.wedding_Studio_icon}
                    style={{
                      width: hp(16),
                      height: hp(16),
                      resizeMode: 'contain',
                      marginRight: wp(10),
                    }}
                  />
                  <Text
                    style={{
                      color: colors.pureBlack,
                      fontSize: fontSize(12),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Events
                  </Text>
                </View>

                <View
                  style={{
                    marginBottom: 16,
                    marginTop: hp(15),
                    width: hp(55),
                    height: hp(33),
                    backgroundColor: '#F9F6FF',
                    borderRadius: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      color: colors.pureBlack,
                      fontSize: fontSize(12),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    +5
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* Header */}
      <View
        style={{
          width: '100%',
          height: hp(70),
          paddingHorizontal: 22,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={{
            width: hp(30),
            height: hp(30),
            justifyContent: 'center',
            left: -8,
            alignItems: 'center',
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{width: hp(14), height: hp(14), resizeMode: 'contain'}}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontFamily: fontFamily.poppins400,
            fontSize: fontSize(14),
            marginLeft: 60,
          }}>
          Studios in Ahmedabad
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={studioList}
        keyExtractor={item => item.id.toString()}
        renderItem={renderStudioCard}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: hp(20),
          // paddingTop: hp(5),
        }}
      />
    </SafeAreaView>
  );
};

export default ServicesSearchScreen;
