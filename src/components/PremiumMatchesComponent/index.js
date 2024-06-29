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
import {useDispatch, useSelector} from 'react-redux';
import {sendRequest} from '../../actions/homeActions';

const PremiumMatchesComponent = ({data, shareButtonPress, isOnline}) => {
  const {userData} = useSelector(state => state.home);
  const {user} = useSelector(state => state.auth);

  const dispatch = useDispatch();

  const onFriendRequestButtonPress = item => {
    const token = user?.tokens?.access?.token;
    console.log(' === token ===> ', token);

    dispatch(sendRequest({friend: item.id, user: user.user.id}));
  };

  const calculateAge = dateOfBirth => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <FlatList
      data={userData.data}
      keyExtractor={item => item.id}
      renderItem={({item}) => {
        const currentCity = item.address ? item.address.currentCity : '';
        const currentCountry = item.address ? item.address.currentCountry : '';
        const age = calculateAge(item.dateOfBirth);

        const imageStyle = item.profilePic
          ? styles.image
          : [styles.image, styles.imageWithBorder];

        return (
          <View style={styles.itemContainer}>
            <View>
              <Image
                style={imageStyle}
                source={
                  item.profilePic
                    ? {uri: item.profilePic}
                    : images.empty_male_Image
                }
              />
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
            <Text style={styles.name}>
              {item.firstName} {item.lastName}
            </Text>
            <View style={styles.nameContainer}>
              <Text style={styles.nameDetailTextStyle}>{age || 'N/A'}</Text>
              <Text style={styles.nameDetailTextStyle}>yrs,</Text>
              <Text style={styles.nameDetailTextStyle}>
                {item.state || 'N/A'}
              </Text>
            </View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameDetailTextStyle}>
                {currentCity || 'N/A'}, {currentCountry || 'N/A'}
              </Text>
            </View>
            <View style={styles.shareImageContainer}>
              <View style={styles.shareImageContainerStyle}>
                <TouchableOpacity>
                  <Image
                    source={icons.thumsDownIcon}
                    style={styles.shareImageStyle}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.shareImageContainerStyle}>
                <TouchableOpacity>
                  <Image
                    source={icons.likeIcon}
                    style={styles.shareImageStyle}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.shareImageContainerStyle}>
                <TouchableOpacity
                  onPress={() => onFriendRequestButtonPress(item)}>
                  <Image
                    source={icons.shareIcon}
                    style={styles.shareImageStyle}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 13,
    marginLeft: -12,
  },
  image: {
    width: wp(110),
    height: hp(136),
    borderRadius: 6,
    marginBottom: 8,
  },
  imageWithBorder: {
    borderWidth: 0.5,
    borderColor: '#D3D3D3', // Adjust the border color as needed
  },
  overlayContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  onlineText: {
    color: 'black',
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

export default PremiumMatchesComponent;
