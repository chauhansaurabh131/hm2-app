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
    console.log(
      ' === friendList ===> ',
      item.friendList?.userProfessional?.jobTitle,
    );

    const calculateAge = dob => {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const profileImage = item?.friendList?.profilePic;
    const name = item?.friendList?.name;
    const firstName = item?.friendList?.firstName;
    const lastName = item?.friendList?.lastName;
    const gender = item?.friendList?.gender;
    const age = calculateAge(item.friendList?.dateOfBirth);
    const height = item.friendList?.height;
    const motherTongue = item.friendList?.motherTongue;
    const cast = item.friendList?.cast;
    const jobTitle = item.friendList?.userProfessional?.jobTitle;
    const workCountry = item.friendList?.userProfessional?.workCountry;
    const userState = item.friendList?.userProfessional?.state;
    const workCity = item.friendList?.userProfessional?.workCity;
    console.log(' === age ===> ', age);

    // console.log(' === name ===> ', lastName);

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

              <View style={styles.userDetailsDescriptionContainer}>
                <Text style={styles.userDetailsTextStyle}>{gender}</Text>
                <Text style={styles.userDetailsTextStyle}>{age},</Text>
                <Text style={styles.userDetailsTextStyle}>{height}</Text>

                <View style={styles.verticalLineStyle} />

                <Text style={styles.userDetailsTextStyle}>
                  {motherTongue || 'N/A'}
                </Text>
                <Text style={styles.userDetailsTextStyle}>{cast || 'N/A'}</Text>
              </View>

              <View style={styles.userDetailsDescriptionContainer}>
                <Text style={styles.userDetailsTextStyle}>{jobTitle}</Text>
                <View style={styles.verticalLineStyle} />
                <Text style={styles.userDetailsTextStyle}>{workCountry}</Text>
                <Text style={styles.userDetailsTextStyle}>
                  {userState || 'N/A'}
                </Text>
                <Text style={styles.userDetailsTextStyle}>
                  {workCity || 'N/A'}
                </Text>
              </View>

              <View style={{marginTop: hp(22), flexDirection: 'row'}}>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                  <TouchableOpacity activeOpacity={0.5}>
                    <Image
                      source={icons.image_icon}
                      style={{
                        width: 16,
                        height: 16,
                        resizeMode: 'contain',
                        marginRight: wp(14),
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.5}>
                    <Image
                      source={icons.video_icon}
                      style={{width: 20, height: 16, resizeMode: 'contain'}}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={{position: 'absolute', right: 40}}>
                    <Image
                      source={icons.starIcon}
                      style={{
                        width: hp(22),
                        height: hp(20),
                        resizeMode: 'contain',
                      }}
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
    backgroundColor: '#24FF00',
    justifyContent: 'center',
  },
  bodyTextStyle: {
    color: colors.black,
    fontSize: fontSize(8),
    lineHeight: hp(12),
    textAlign: 'center',
  },
  userNameTextStyle: {
    color: colors.white,
    fontSize: fontSize(20),
    lineHeight: hp(30),
    fontFamily: fontFamily.poppins700,
  },
  userDetailsDescriptionContainer: {
    flexDirection: 'row',
  },
  userDetailsTextStyle: {
    color: colors.white,
    fontSize: fontSize(10),
    lineHeight: hp(14),
    fontFamily: fontFamily.poppins400,
    marginRight: wp(2),
  },
  verticalLineStyle: {
    width: hp(1),
    height: '100%',
    backgroundColor: colors.white,
    marginHorizontal: wp(5),
  },
});

export default MatchesInAcceptedScreen;
