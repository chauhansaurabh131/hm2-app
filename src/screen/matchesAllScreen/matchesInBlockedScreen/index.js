import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  Image,
  View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {icons, images} from '../../../assets';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../utils/colors';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesInBlockedScreen = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  const fetchBlockedUsers = async () => {
    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/friend/get-block-listv2',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const jsonResponse = await response.json();
      console.log('Blocked Users Response:', jsonResponse);

      // Check if results exist
      const results = jsonResponse.data?.results || [];
      setBlockedUsers(results); // Update state with the blocked users
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        {/*<ActivityIndicator size="large" color="#0000ff" />*/}
        <View style={{height: hp(449), marginHorizontal: 17}}>
          <ShimmerPlaceholder
            style={{
              width: '100%',
              height: hp(449),
              borderRadius: 10,
              marginBottom: hp(13),
            }}
          />
          <View style={{marginTop: -180, marginHorizontal: 17}}>
            <ShimmerPlaceholder style={{width: 100, height: 20}} />

            <View style={{marginTop: 10}}>
              <ShimmerPlaceholder style={{width: 100, height: 5}} />
            </View>

            <View style={{marginTop: 50, flexDirection: 'row'}}>
              <ShimmerPlaceholder
                style={{
                  width: wp(142),
                  height: hp(40),
                  justifyContent: 'center',
                  marginRight: 40,
                }}
              />
              <ShimmerPlaceholder
                style={{
                  width: wp(142),
                  height: hp(40),
                  justifyContent: 'center',
                  marginRight: 40,
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const renderBlockedUser = ({item}) => {
    // console.log(' === item ===> ', item?.friend?.userProfilePic);
    const profileImage = item?.friend?.profilePic;
    const user = item?.blockedUser; // Adjust this based on actual data structure

    const calculateAge = dob => {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const name = item?.friend?.name;
    const firstName = item?.friend?.firstName;
    const lastName = item?.friend?.lastName;
    const age = calculateAge(item?.friend?.dateOfBirth);
    const height = item?.friend?.height;
    const jobTitle = item?.friend?.userProfessional?.jobTitle;
    const currentCity = item?.friend?.address?.currentCity
      ? item?.friend?.address?.currentCity.charAt(0).toUpperCase() +
        item?.friend?.address?.currentCity.slice(1).toLowerCase()
      : '';
    const currentCountry = item?.friend?.address?.currentCountry
      ? item?.friend?.address?.currentCountry.charAt(0).toUpperCase() +
        item?.friend?.address?.currentCountry.slice(1).toLowerCase()
      : '';

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

    return (
      <View>
        <View style={{marginHorizontal: 17}}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              /* navigation.navigate('UserDetailsScreen'); */
            }}>
            <View>
              <Image
                source={
                  profileImage ? {uri: profileImage} : images.empty_male_Image
                }
                style={styles.userImageStyle}
                resizeMode={'cover'}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
                style={styles.gradient}
              />

              <View style={styles.UserDetailsContainer}>
                <View style={styles.onlineBodyStyle}>
                  <Text style={styles.bodyTextStyle}>Online</Text>
                </View>

                <Text style={styles.userNameTextStyle}>
                  {firstName} {lastName || name}
                </Text>

                <View
                  style={[
                    styles.userDetailsDescriptionContainer,
                    {marginTop: 3},
                  ]}>
                  {/*<Text style={styles.userDetailsTextStyle}>{gender}</Text>*/}
                  <Text style={styles.userDetailsTextStyle}>{age} yrs,</Text>
                  <Text style={styles.userDetailsTextStyle}> {height}</Text>

                  <View style={styles.verticalLineStyle} />

                  <Text style={styles.userDetailsTextStyle}>
                    {' '}
                    {jobTitle || 'N/A'}
                  </Text>
                </View>

                <View style={styles.userDetailsDescriptionContainer}>
                  <Text style={styles.userDetailsTextStyle}>
                    {currentCity},{' '}
                  </Text>
                  <Text style={styles.userDetailsTextStyle}>
                    {currentCountry || 'N/A'}
                  </Text>
                </View>

                {/*<View style={{marginTop: hp(22), flexDirection: 'row'}}>*/}
                {/*  <View style={styles.renderBottomButtonContainer}>*/}
                {/*    <View style={styles.requestDeclineContainer}>*/}
                {/*      <Text style={styles.requestTextStyle}>Blocked</Text>*/}
                {/*    </View>*/}
                {/*  </View>*/}
                {/*</View>*/}

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
                      // top: 12,
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
          </TouchableOpacity>
        </View>
        <View style={{alignSelf: 'center', flexDirection: 'row', marginTop: 5}}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins500,
              marginRight: hp(11),
            }}>
            Blocked by you
          </Text>
          <Image
            source={icons.block_icon}
            style={{
              tintColor: '#FF0000',
              height: hp(22),
              width: hp(22),
              resizeMode: 'contain',
            }}
          />
        </View>

        <View
          style={{
            width: '100%',
            borderColor: '#E8E8E8',
            borderWidth: 0.7,
            marginTop: 21,
            marginBottom: 23,
          }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView>
      {blockedUsers.length > 0 ? (
        <FlatList
          data={blockedUsers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderBlockedUser}
        />
      ) : (
        <Text>No blocked users found.</Text>
      )}
    </SafeAreaView>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    // flex: 1, // Ensures the SafeAreaView takes up full height
  },
  loadingContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  emptyListContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gender: {
    fontSize: 14,
    color: '#555',
  },
  listContainer: {
    paddingBottom: 200, // Adjust this value for more or less space
  },
  userImageStyle: {
    width: '100%',
    height: hp(449),
    borderRadius: 10,
    marginBottom: hp(13),
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
    width: '100%',
    height: '40%',
    marginBottom: hp(13),
  },
  UserDetailsContainer: {
    position: 'absolute',
    bottom: 35,
    width: '100%',
    marginLeft: wp(21),
    // backgroundColor: 'grey',
    // backgroundColor: 'rgba(0,0,0,0.05)',
  },
  onlineBodyStyle: {
    width: wp(34.8),
    height: hp(12),
    borderRadius: 5,
    backgroundColor: '#24FF00A8',
    justifyContent: 'center',
  },
  bodyTextStyle: {
    color: colors.black,
    fontSize: fontSize(9),
    lineHeight: hp(12),
    textAlign: 'center',
  },
  userNameTextStyle: {
    color: colors.white,
    fontSize: fontSize(24),
    lineHeight: hp(36),
    fontFamily: fontFamily.poppins700,
    marginTop: 3,
  },
  userDetailsDescriptionContainer: {
    flexDirection: 'row',
  },
  userDetailsTextStyle: {
    color: colors.white,
    fontSize: fontSize(11),
    lineHeight: hp(14),
    fontFamily: fontFamily.poppins400,
    marginRight: wp(2),
  },
  verticalLineStyle: {
    width: hp(1),
    height: '100%',
    backgroundColor: colors.darkGray,
    marginHorizontal: wp(5),
  },
  renderBottomButtonContainer: {
    flexDirection: 'row',
    // marginTop: hp(20),
    justifyContent: 'space-between',
  },
  requestDeclineContainer: {
    width: wp(310),
    height: hp(40),
    borderRadius: 20,
    backgroundColor: '#303030',
    justifyContent: 'center',
  },
  requestTextStyle: {
    color: colors.white,
    textAlign: 'center',
    fontFamily: fontFamily.poppins500,
    lineHeight: hp(21),
    fontSize: fontSize(14),
  },
});

export default MatchesInBlockedScreen;
