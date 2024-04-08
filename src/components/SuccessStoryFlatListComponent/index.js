import React from 'react';
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {images} from '../../assets';

const data = [
  {
    id: '1',
    image: require('../../assets/images/couple_img_one.png'),
    name: 'Riya & Roshan',
    married: '19 Apr 2023',
  },
  {
    id: '2',
    image: require('../../assets/images/couple_img_two.png'),
    name: 'Jinny & John',
    married: '9 Mar 2022',
  },
  {
    id: '3',
    image: require('../../assets/images/couple_img_three.png'),
    name: 'jesse & Max',
    married: '29 Apr 2023',
  },
  {
    id: '4',
    image: require('../../assets/images/couple_img_one.png'),
    name: 'Riya & Roshan',
    married: '19 Apr 2023',
  },
  {
    id: '5',
    image: require('../../assets/images/couple_img_two.png'),
    name: 'jesse & Max',
    married: '9 Mar 2022',
  },
  {
    id: '6',
    image: require('../../assets/images/couple_img_three.png'),
    name: 'jesse & Max',
    married: '29 Apr 2023',
  },
];

const SuccessStoryFlatListComponent = ({onStoryPagePress}) => {
  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity activeOpacity={0.6} onPress={onStoryPagePress}>
        <Image source={item.image} style={styles.image} />
      </TouchableOpacity>

      <View style={styles.imageTextContainer}>
        <Text style={styles.headingTextStyle}>{item.name}</Text>

        <Text style={styles.descriptionTextStyle}>
          (Married on {item.married})
        </Text>

        <View>
          <TouchableOpacity style={styles.circleImageContainer}>
            <Image
              source={images.rightArrowLogo}
              style={styles.buttonImageStyle}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      renderItem={renderItem}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    // margin: 5,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: wp(10),
    marginTop: hp(15),
    marginLeft: wp(2),
  },
  image: {
    width: wp(120),
    height: hp(170),
  },
  imageTextContainer: {
    position: 'absolute',
    bottom: 7,
    left: 10,
  },
  headingTextStyle: {
    color: colors.white,
    fontSize: fontSize(10),
    fontWeight: 'bold',
  },
  descriptionTextStyle: {
    color: colors.white,
    fontSize: fontSize(8),
    fontWeight: 'bold',
  },
  circleImageContainer: {
    height: hp(15),
    width: hp(15),
    borderRadius: 50,
    borderColor: colors.white,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(10),
  },
  buttonImageStyle: {
    width: hp(8),
    height: hp(8),
    tintColor: colors.white,
  },
});

export default SuccessStoryFlatListComponent;
