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

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesInBlockedScreen = () => {
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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
    console.log(' === item ===> ', item?.friend?.name);
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
    const gender = item?.friend?.gender;
    const age = calculateAge(item?.friend?.dateOfBirth);
    const height = item?.friend?.height;
    const motherTongue = item?.friend?.motherTongue;
    const cast = item?.friend?.cast;
    const jobTitle = item?.friend?.userProfessional?.jobTitle;
    const workCountry = item?.friend?.userProfessional?.workCountry;
    const userState = item?.friend?.userProfessional?.state;
    const workCity = item?.friend?.userProfessional?.workCity;

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
                <View style={styles.renderBottomButtonContainer}>
                  <View style={styles.requestDeclineContainer}>
                    <Text style={styles.requestTextStyle}>Blocked</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
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
