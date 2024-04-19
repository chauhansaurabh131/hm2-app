import React from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {icons, images} from '../../assets';
import {fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const renderItem = ({item, onPress, isOnline, OnImagePress}) => (
  <View style={styles.itemContainer}>
    <View>
      <TouchableOpacity activeOpacity={0.6} onPress={OnImagePress}>
        <Image style={styles.image} source={item.image} />
      </TouchableOpacity>
      <View style={styles.overlayContainer}>
        {isOnline && (
          <View style={styles.onlineBodyContainer}>
            <Text style={styles.onlineText}>Online</Text>
          </View>
        )}

        <View style={{position: 'absolute', right: 0, padding: 10}}>
          <TouchableOpacity>
            <Image style={styles.starIcon} source={icons.starIcon} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <Text style={styles.name}>{item.name}</Text>
    <View style={styles.nameContainer}>
      <Text style={styles.nameDetailTextStyle}>{item.age}</Text>
      <Text style={styles.nameDetailTextStyle}>yrs,</Text>
      <Text style={styles.nameDetailTextStyle}>{item.gender}</Text>
    </View>
    <View style={styles.nameContainer}>
      <Text style={styles.nameDetailTextStyle}>{item.city} </Text>
      <Text style={styles.nameDetailTextStyle}>({item.km})</Text>
    </View>
    {/*<View style={styles.shareImageContainer}>*/}
    {/*  <View style={styles.shareImageContainerStyle}>*/}
    {/*    <TouchableOpacity>*/}
    {/*      <Image source={icons.thumsDownIcon} style={styles.shareImageStyle} />*/}
    {/*    </TouchableOpacity>*/}
    {/*  </View>*/}
    {/*  <View style={styles.shareImageContainerStyle}>*/}
    {/*    <TouchableOpacity>*/}
    {/*      <Image source={icons.likeIcon} style={styles.shareImageStyle} />*/}
    {/*    </TouchableOpacity>*/}
    {/*  </View>*/}
    {/*  <View style={styles.shareImageContainerStyle}>*/}
    {/*    <TouchableOpacity onPress={() => onPress(item)}>*/}
    {/*      <Image source={icons.shareIcon} style={styles.shareImageStyle} />*/}
    {/*    </TouchableOpacity>*/}
    {/*  </View>*/}
    {/*</View>*/}
  </View>
);

const RecentlyAcceptedFlatlistComponent = ({
  data,
  shareButtonPress,
  isOnline,
  OnImagePress,
}) => {
  const renderItemWithPress = ({item}) =>
    renderItem({item, onPress: shareButtonPress, isOnline, OnImagePress});

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      // renderItem={renderItem}
      renderItem={renderItemWithPress}
      horizontal // Set the horizontal prop to true
      showsHorizontalScrollIndicator={false} // Optional: Hide horizontal scroll indicator
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'column', // Use 'column' to arrange items vertically inside the FlatList
    alignItems: 'center',
    padding: 14,
    marginLeft: -12,
  },
  image: {
    width: wp(110),
    height: hp(136),
    borderRadius: 6,
    marginBottom: 8, // Adjust spacing between image and text
  },
  overlayContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  onlineText: {
    color: 'black', // Adjust the color as needed
    fontSize: fontSize(6),
    alignItems: 'center',
    textAlign: 'center',
  },
  starIcon: {
    width: hp(10.83),
    height: hp(10),
    resizeMode: 'contain',
  },
  name: {
    fontSize: fontSize(10),
    lineHeight: hp(15),
    fontWeight: '700',
    color: colors.black,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  nameDetailTextStyle: {
    fontSize: fontSize(8),
    lineHeight: hp(12),
    color: colors.black,
    fontWeight: '400',
    marginRight: 2,
  },
  onlineBodyContainer: {
    width: wp(24),
    height: hp(8),
    backgroundColor: '#24FF00',
    borderRadius: 8,
  },
  shareImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: hp(6),
  },
  shareImageContainerStyle: {
    flex: 1,
    alignItems: 'center',
  },
  shareImageStyle: {
    width: hp(20),
    height: hp(20),
  },
});

export default RecentlyAcceptedFlatlistComponent;
