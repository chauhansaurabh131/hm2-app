import React from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {images} from '../../assets';
import {colors} from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';

const studioData = [
  {id: 1, title: 'Chandra Photo Studio', location: 'Gandhinagar, Gujarat'},
  {id: 2, title: 'Smile Studio', location: 'Ahmedabad, Gujarat'},
  {id: 3, title: 'Rockey Studio', location: 'Surat, Gujarat'},
  {id: 4, title: 'First Try Studio', location: 'Rajkot, Gujarat'},
  {id: 5, title: 'Modern Click Studio', location: 'Vadodara, Gujarat'},
  {id: 6, title: 'Golden Pixel Studio', location: 'Bhavnagar, Gujarat'},
];

const ServicesRecentlyComponent = ({labelHeading}) => {
  const navigation = useNavigation();

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          navigation.navigate('ServicesProfileScreen');
        }}>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 15,
            borderColor: '#EFEFEF',
            width: hp(248),
            marginRight: wp(15),
          }}>
          <Image
            source={images.photo_studio_background_img}
            style={{
              width: hp(246),
              height: hp(245),
              borderRadius: 15,
            }}
          />

          <View
            style={{
              marginTop: hp(16),
              alignItems: 'center',
              marginBottom: hp(17),
            }}>
            <Text
              style={{
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins600,
                color: colors.pureBlack,
              }}>
              {item.title}
            </Text>

            <Text
              style={{
                color: '#9C9C9C',
                fontSize: fontSize(12),
                fontFamily: fontFamily.poppins400,
              }}>
              {item.location}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      <Text
        style={{
          marginTop: hp(27),
          color: colors.pureBlack,
          marginHorizontal: 17,
          fontSize: fontSize(14),
          fontFamily: fontFamily.poppins600,
          marginBottom: hp(26),
        }}>
        {labelHeading}
      </Text>
      <FlatList
        data={studioData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingLeft: wp(15)}}
      />
    </SafeAreaView>
  );
};

export default ServicesRecentlyComponent;
