import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {icons, images} from '../../../assets';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {colors} from '../../../utils/colors';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesInAcceptedScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  // console.log(' === accessToken ===> ', accessToken);

  // Function to fetch data from the API
  const fetchData = async (pageNumber = 1) => {
    if (!hasMoreData) {
      return;
    }

    try {
      console.log('Fetching data for page:', pageNumber);

      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/friend/get-frd-mobile?page=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const json = await response.json();
      console.log('API response:', json);

      const newData = json?.data?.results?.flat() || [];

      if (newData.length === 0) {
        console.log('No data found for this page.');
        setHasMoreData(false);
      } else {
        console.log('Fetched data:', newData); // Log fetched data
        setData(prevData => [...prevData, ...newData]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMoreData = () => {
    if (!isFetchingMore && hasMoreData) {
      setIsFetchingMore(true);
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchData(nextPage);
        return nextPage;
      });
    }
  };

  const renderAccptedUserItem = ({item}) => {
    // console.log(
    //   ' === friendList ===> ',
    //   item.friendList?.userProfessional?.jobTitle,
    // );

    // console.log(' === var ===> ', item.friendList);

    const userAllImage = Array.isArray(item.friendList?.userProfilePic)
      ? item.friendList?.userProfilePic.map(pic => pic.url)
      : [];

    const calculateAge = dob => {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const profileImage = item?.friendList?.profilePic;
    const name = item?.friendList?.name;
    // const firstName = item?.friendList?.firstName;
    // const lastName = item?.friendList?.lastName;
    const gender = item?.friendList?.gender;
    const age = calculateAge(item.friendList?.dateOfBirth);
    const height = item.friendList?.height;
    const motherTongue = item.friendList?.motherTongue;
    const cast = item.friendList?.cast;
    const jobTitle = item.friendList?.userProfessional?.jobTitle;
    const workCountry = item.friendList?.userProfessional?.workCountry;
    const userState = item.friendList?.userProfessional?.state;
    const workCity = item.friendList?.userProfessional?.workCity;
    // const currentCity = item.friendList?.address?.currentCity;
    // const currentCountry = item.friendList?.address?.currentCountry;

    const firstName = item?.friendList?.firstName
      ? item?.friendList?.firstName.charAt(0).toUpperCase() +
        item?.friendList?.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item?.friendList?.lastName
      ? item?.friendList?.lastName.charAt(0).toUpperCase() +
        item?.friendList?.lastName.slice(1).toLowerCase()
      : '';

    const currentCity = item.friendList?.address?.currentCity
      ? item.friendList?.address?.currentCity.charAt(0).toUpperCase() +
        item.friendList?.address?.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item.friendList?.address?.currentCountry
      ? item.friendList?.address?.currentCountry.charAt(0).toUpperCase() +
        item.friendList?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    // console.log(' === name ===> ', lastName);

    const imageCount = Array.isArray(item.friendList?.userProfilePic)
      ? item.friendList?.userProfilePic.length
      : 0;

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    return (
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
                <Text style={styles.userDetailsTextStyle}>{age} yrs,</Text>
                <Text style={styles.userDetailsTextStyle}>{height}</Text>

                <View style={styles.verticalLineStyle} />

                <Text style={styles.userDetailsTextStyle}>
                  {jobTitle || 'N/A'}
                </Text>
              </View>

              <View style={styles.userDetailsDescriptionContainer}>
                <Text style={styles.userDetailsTextStyle}>{currentCity}, </Text>

                <Text style={styles.userDetailsTextStyle}>
                  {currentCountry}
                </Text>
              </View>

              <View
                style={{
                  marginTop: hp(15),
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={images.gradient_button_background_img}
                  style={{
                    width: wp(105),
                    height: hp(30),
                    resizeMode: 'stretch',
                    borderRadius: 50, // Adjust the radius as needed
                    overflow: 'hidden', // Ensure rounded corners clip the image
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
    );
  };

  if (loading && page === 1) {
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

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderAccptedUserItem}
        keyExtractor={item => item._id || item.id || item.name}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        // ListFooterComponent={isFetchingMore ? <ActivityIndicator /> : null}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={{alignItems: 'center'}}>
              <Text style={{color: 'black'}}>Loading Data..</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading && !isFetchingMore ? (
            <View style={styles.emptyListContainer}>
              <View
                style={{
                  alignItems: 'center',
                  marginTop: hp(250),
                  justifyContent: 'center',
                }}>
                <Image
                  source={icons.no_Profile_Found_img}
                  style={{width: hp(44), height: hp(44), resizeMode: 'contain'}}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(18),
                    lineHeight: hp(27),
                    fontFamily: fontFamily.poppins400,
                    marginTop: hp(12),
                  }}>
                  No Profiles Found
                </Text>
              </View>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContainer} // Added this line
      />
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
    borderRadius: 18,
    marginBottom: hp(13),
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    // borderRadius: 18,
    width: '100%',
    height: '40%',
    marginBottom: hp(13),
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
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
    marginTop: 5,
  },
  userDetailsDescriptionContainer: {
    flexDirection: 'row',
    marginTop: hp(1),
  },
  userDetailsTextStyle: {
    color: colors.white,
    fontSize: fontSize(10),
    lineHeight: hp(14),
    fontFamily: fontFamily.poppins400,
    marginRight: wp(2),
  },
  verticalLineStyle: {
    width: hp(0.5),
    height: '100%',
    backgroundColor: colors.gray,
    marginHorizontal: wp(5),
  },
});

export default MatchesInAcceptedScreen;
