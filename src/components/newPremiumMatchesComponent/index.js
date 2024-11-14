import React, {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {userDatas, userDis_Like, userLike} from '../../actions/homeActions';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import {colors} from '../../utils/colors';

const NewPremiumMatchesComponent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userDatas());
  }, [dispatch]);

  const {userData} = useSelector(state => state.home);

  console.log(' === userData ===> ', userData);

  // Extract the paginatedResults from the userData
  const paginatedResults = userData?.data?.[0]?.paginatedResults || [];

  // console.log(' === paginatedResults ===> ', paginatedResults);

  const onLikePress = item => {
    // console.log(' === onLikePress ===> ', item?._id);
    dispatch(
      userLike({
        likedUserId: item?._id,
        isLike: true,
      }),
    );
  };

  // const onDisLikePress = item => {
  //   console.log(' === onDisLikePress ===> ', item?.userLikeDetails?._id);
  //   dispatch(
  //     userDis_Like({
  //       data: item?.userLikeDetails?._id,
  //       likedUserId: item?._id,
  //       isLike: false,
  //     }),
  //   );
  // };

  const onDisLikePress = item => {
    const payload = {
      data: item?.userLikeDetails?._id, // Keep as is
      likedUserId: item?._id,
      isLike: false,
    };

    console.log(' === Payload to dispatch ===> ', payload);

    dispatch(userDis_Like(payload));
  };

  // Render each item in the list
  const renderItem = ({item}) => {
    // console.log(' === var ===> ', item);

    const firstName = item?.firstName
      ? item.firstName.charAt(0).toUpperCase() +
        item.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item?.lastName
      ? item.lastName.charAt(0).toUpperCase() +
        item.lastName.slice(1).toLowerCase()
      : '';

    const currentCity = item.address?.currentCity
      ? item.address.currentCity.charAt(0).toUpperCase() +
        item.address.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item.address?.currentCountry
      ? item.address.currentCountry.charAt(0).toUpperCase() +
        item.address.currentCountry.slice(1).toLowerCase()
      : '';

    // Determine the icon based on `isLike` value
    const likeIcon = item?.userLikeDetails?.isLike
      ? icons.new_user_like_icon // If liked, show `new_user_like_icon`
      : icons.new_like_icon; // If not liked, show `new_like_icon`

    const handleLikePress = () => {
      if (item?.userLikeDetails?.isLike) {
        // If already liked, log the message
        console.log('new_user_like_icon press', item?.userLikeDetails?._id);
        // onDisLikePress(item);
      } else {
        // If not liked, call the onLikePress function
        onLikePress(item);
      }
    };

    return (
      <View style={styles.itemContainer}>
        <View
          style={{
            height: hp(225),
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#EFEFEF',
          }}>
          <Image
            style={
              item.profilePic
                ? styles.image
                : [styles.image, styles.imageWithBorder]
            }
            source={
              item.profilePic ? {uri: item.profilePic} : images.empty_male_Image
            }
          />

          <View style={styles.overlayContainer}>
            <TouchableOpacity
              style={{position: 'absolute', right: 0, padding: 10}}>
              <Image source={icons.new_star_icon} style={styles.starIcon} />
            </TouchableOpacity>
          </View>

          <View style={{alignItems: 'center'}}>
            <Text style={styles.itemText}>
              {firstName} {lastName}
            </Text>

            <View style={{flexDirection: 'row'}}>
              <Text style={styles.nameDetailTextStyle}>{item?.age} yrs,</Text>
              <Text style={styles.nameDetailTextStyle}> {item?.height}</Text>
            </View>

            <Text style={styles.nameDetailTextStyle}>
              {currentCity || 'N/A'}, {currentCountry || 'N/A'}
            </Text>

            <View style={{flexDirection: 'row', marginTop: hp(12)}}>
              <TouchableOpacity
                // onPress={() => {
                //   onLikePress(item);
                // }}
                onPress={handleLikePress}>
                <Image
                  source={likeIcon}
                  style={{
                    width: hp(38),
                    height: hp(22),
                    resizeMode: 'stretch',
                    marginRight: 8,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity>
                <Image
                  source={icons.new_send_icon}
                  style={{
                    width: hp(38),
                    height: hp(22),
                    resizeMode: 'stretch',
                    // marginRight: 8,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Check if there are paginatedResults to display */}
      {paginatedResults.length > 0 ? (
        <FlatList
          data={paginatedResults}
          keyExtractor={(item, index) => String(index)} // Use a unique key or index for now
          renderItem={renderItem}
          horizontal // Make the FlatList horizontal
          showsHorizontalScrollIndicator={false} // Optionally hide the horizontal scroll indicator
          contentContainerStyle={styles.listContainer} // Optional styling for the list
        />
      ) : (
        <Text style={{textAlign: 'center', marginTop: 20}}>
          No Premium Matches Found
        </Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
  },
  listContainer: {
    // paddingLeft: 10, // Padding for the first item
    paddingRight: 10, // Padding for the last item
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 13,
    marginLeft: -12,
  },

  imagePlaceholder: {
    width: 150, // Placeholder width
    height: 150, // Placeholder height
    backgroundColor: '#ccc', // Placeholder background color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 75, // Match the image's border radius
    marginBottom: 10,
  },
  itemText: {
    fontSize: fontSize(12),
    lineHeight: hp(15),
    fontFamily: fontFamily.poppins700,
    color: colors.black,
  },
  image: {
    width: wp(110),
    height: hp(136),
    borderRadius: 6,
    marginBottom: 8,
  },
  imageWithBorder: {
    borderWidth: 0.5,
    borderColor: '#D3D3D3',
  },
  overlayContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  starIcon: {
    width: hp(10.83),
    height: hp(10),
    resizeMode: 'contain',
  },
  nameDetailTextStyle: {
    fontSize: fontSize(9),
    lineHeight: hp(12),
    color: colors.black,
    fontFamily: fontFamily.poppins400,
    top: 5,
  },
});

export default NewPremiumMatchesComponent;
