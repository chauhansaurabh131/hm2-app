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
import {getAllSendRequest} from '../../../actions/homeActions';
import {icons, images} from '../../../assets';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../utils/colors';
import style from '../../matchesScreen/style';
import {useNavigation} from '@react-navigation/native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesInSentScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(getAllSendRequest());
  }, [dispatch]);

  const {sendRequestData, isDataStoriesLoader} = useSelector(
    state => state.home,
  );

  console.log(' === isDataStoriesLoader ===> ', isDataStoriesLoader);

  const renderItem = ({item}) => {
    // console.log(' === var ===> ', item?.friend?.userProfilePic);

    const friend = item?.friend;
    const profilePic = friend?.profilePic || 'https://via.placeholder.com/150';
    const fullName = `${friend?.firstName || ''} ${friend?.lastName || ''}`;
    const city = friend?.address?.currentCity || 'N/A';
    const country = friend?.address?.currentCountry || 'N/A';
    const jobTitle = friend?.userProfessional?.jobTitle || 'N/A';
    const company = friend?.userProfessional?.companyName || 'N/A';

    const calculateAge = dob => {
      if (!dob) {
        return 'N/A';
      } // Handle missing date of birth
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };
    const age = calculateAge(friend?.dateOfBirth);
    const height = friend?.height;

    const imageCount = Array.isArray(item?.friend?.userProfilePic)
      ? item?.friend?.userProfilePic.length
      : 0;

    const userAllImage = Array.isArray(item?.friend?.userProfilePic)
      ? item?.friend?.userProfilePic.map(pic => pic.url)
      : [];

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    // console.log(' === var ===> ', height);

    return (
      <View style={{marginHorizontal: 17}}>
        <Image
          source={profilePic ? {uri: profilePic} : images.empty_male_Image}
          style={styles.profileImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            width: '100%',
            height: '40%',
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
            marginBottom: hp(13),
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 35,
            width: '100%',
            marginLeft: wp(21),
          }}>
          <View
            style={{
              width: wp(34.8),
              height: hp(12),
              borderRadius: 5,
              backgroundColor: '#24FF00A8',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(9),
                lineHeight: hp(12),
                textAlign: 'center',
              }}>
              Online
            </Text>
          </View>

          <View>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(24),
                lineHeight: hp(36),
                fontFamily: fontFamily.poppins700,
                marginTop: 5,
              }}>
              {fullName}
            </Text>

            <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={styles.userDetailsTextStyle}>{age} yrs,</Text>
              <Text style={styles.userDetailsTextStyle}> {height}</Text>

              <View style={styles.verticalLineStyle} />

              <Text style={style.userDetailsTextStyle}>
                {' '}
                {jobTitle} at {company}
              </Text>
            </View>
            <View style={style.userDetailsDescriptionContainer}>
              <Text style={style.userDetailsTextStyle}>{city},</Text>

              <Text style={style.userDetailsTextStyle}> {country}</Text>
            </View>
          </View>

          <View
            style={{
              marginTop: hp(15),
              flexDirection: 'row',
              // backgroundColor: 'red',
              alignItems: 'center',
              // flex: 1,
            }}>
            <Image
              source={images.gradient_button_background_img}
              style={{
                width: wp(105),
                height: hp(30),
                resizeMode: 'stretch',
                borderRadius: 50, // Adjust the radius as needed
                overflow: 'hidden',
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              // onPress={openModal}
              style={{
                position: 'absolute',
                left: 10,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <Image
                source={icons.couple_icon}
                style={{
                  width: hp(16),
                  height: hp(14),
                  resizeMode: 'contain',
                  tintColor: 'white',
                }}
              />
              <Text
                style={{
                  color: 'white',
                  marginLeft: 9,
                  fontSize: fontSize(10),
                  lineHeight: hp(15),
                  fontFamily: fontFamily.poppins600,
                  top: 1,
                }}>
                {/*85% Match*/}
                {item?.matchPercentage}% Match
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                right: 35,
                // top: 5,
              }}>
              <TouchableOpacity
                style={{
                  width: hp(60),
                  height: hp(30),
                  backgroundColor: '#282727',
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginHorizontal: 5,
                }}
                activeOpacity={0.5}
                onPress={userAllImageShare}>
                <Image
                  source={icons.new_camera_icon}
                  style={{
                    width: 16,
                    height: 16,
                    resizeMode: 'contain',
                    marginRight: wp(10),
                  }}
                />

                <Text style={{color: colors.white}}>{imageCount}</Text>
              </TouchableOpacity>
              {/*</View>*/}

              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  width: hp(30),
                  height: hp(30),
                  backgroundColor: '#282727',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginHorizontal: 5,
                }}>
                <Image
                  source={icons.starIcon}
                  style={{
                    width: hp(20),
                    height: hp(16),
                    resizeMode: 'contain',
                    tintColor: colors.white,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                // onPress={onThreeDotPress}
                style={{
                  width: hp(30),
                  height: hp(30),
                  backgroundColor: '#282727',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginHorizontal: 5,
                }}>
                <Image
                  source={icons.new_three_dot}
                  style={{width: 4, height: 14, tintColor: colors.white}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {isDataStoriesLoader ? (
        <View style={styles.receivedShimmerContainer}>
          <ShimmerPlaceholder style={styles.receivedShimmerImageBody} />
          <View style={styles.receivedShimmerImageBodyInside}>
            <ShimmerPlaceholder style={styles.receivedShimmerName} />

            <View style={styles.receivedShimmerInsideOne}>
              <ShimmerPlaceholder style={styles.receivedShimmerData} />
            </View>

            <View style={styles.receivedShimmerButtonContainer}>
              <ShimmerPlaceholder style={styles.receivedShimmerButton} />
              <ShimmerPlaceholder style={styles.receivedShimmerButton} />
            </View>
          </View>
        </View>
      ) : (sendRequestData?.data || []).length === 0 ? (
        <View
          style={{
            alignItems: 'center',
            marginTop: hp(250),
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: colors.gray,
              fontSize: fontSize(21),
              lineHeight: hp(26),
            }}>
            No shortList friend
          </Text>
        </View>
      ) : (
        <FlatList
          data={sendRequestData?.data || []}
          renderItem={renderItem}
          keyExtractor={item => item.friend?.id || Math.random().toString()}
          ListFooterComponent={<View style={{height: 130}} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 16,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 2,
  },
  profileImage: {
    width: '100%',
    height: hp(449),
    borderRadius: 18,
    marginBottom: hp(13),
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  jobTitle: {
    fontSize: 14,
    color: '#333',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  userDetailsTextStyle: {
    color: colors.white,
    fontSize: fontSize(11),
    lineHeight: hp(16),
    fontFamily: fontFamily.poppins400,
    marginRight: wp(2),
  },
  verticalLineStyle: {
    width: hp(1),
    backgroundColor: colors.darkGray,
    marginHorizontal: wp(10),
  },
  receivedShimmerContainer: {
    height: hp(449),
    marginHorizontal: 17,
  },
  receivedShimmerImageBody: {
    width: '100%',
    height: hp(449),
    borderRadius: 10,
    marginBottom: hp(13),
  },
  receivedShimmerImageBodyInside: {
    marginTop: -180,
    marginHorizontal: 17,
  },
  receivedShimmerName: {
    width: 100,
    height: 20,
  },
  receivedShimmerInsideOne: {
    marginTop: 10,
  },
  receivedShimmerData: {
    width: 100,
    height: 5,
  },
  receivedShimmerButtonContainer: {
    marginTop: 50,
    flexDirection: 'row',
  },
  receivedShimmerButton: {
    width: wp(142),
    height: hp(40),
    justifyContent: 'center',
    marginRight: 40,
  },
});

export default MatchesInSentScreen;
