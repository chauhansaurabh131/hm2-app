import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../../utils/colors';
import {useSelector} from 'react-redux';
import {icons, images} from '../../../assets';
import style from '../../matchesScreen/style';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesInSavedScreen = () => {
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Start loading
      try {
        const response = await fetch(
          `https://stag.mntech.website/api/v1/user/shortlist/get-short-list-paginat/${userId}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const result = await response.json();
        console.log('API Response:', result);
        setData(result.data.results);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false); // End loading
      }
    };

    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  const renderItem = ({item}) => {
    console.log(' === var ===> ', item?.shortlistId?.userProfilePic);

    const profileImage = item?.shortlistId?.profilePic;

    const firstName = item?.shortlistId?.firstName
      ? item?.shortlistId?.firstName.charAt(0).toUpperCase() +
        item?.shortlistId?.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item?.shortlistId?.lastName
      ? item?.shortlistId?.lastName.charAt(0).toUpperCase() +
        item?.shortlistId?.lastName.slice(1).toLowerCase()
      : '';

    const calculateAge = dob => {
      if (!dob) {
        return 'N/A';
      } // Handle missing date of birth
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const age = calculateAge(item?.shortlistId?.dateOfBirth);

    const height = item?.shortlistId?.height;

    const jobTittle = item?.shortlistId?.userProfessional?.jobTitle
      ? item?.shortlistId?.userProfessional?.jobTitle.charAt(0).toUpperCase() +
        item?.shortlistId?.userProfessional?.jobTitle.slice(1).toLowerCase()
      : '';

    const currentCity = item?.shortlistId?.address?.currentCity
      ? item?.shortlistId?.address?.currentCity.charAt(0).toUpperCase() +
        item?.shortlistId?.address?.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item?.shortlistId?.address?.currentCountry
      ? item?.shortlistId?.address?.currentCountry.charAt(0).toUpperCase() +
        item?.shortlistId?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    const imageCount = Array.isArray(item?.shortlistId?.userProfilePic)
      ? item?.shortlistId?.userProfilePic.length
      : 0;

    const userAllImage = Array.isArray(item?.shortlistId?.userProfilePic)
      ? item?.shortlistId?.userProfilePic.map(pic => pic.url)
      : [];

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    return (
      <View style={{marginHorizontal: 17}}>
        <TouchableOpacity activeOpacity={1}>
          <View>
            <Image
              source={
                profileImage ? {uri: profileImage} : images.empty_male_Image
              }
              style={styles.image}
              resizeMode={'cover'}
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
                  {firstName} {lastName}
                </Text>

                <View style={{flexDirection: 'row', marginTop: 3}}>
                  <Text style={styles.userDetailsTextStyle}>{age} yrs,</Text>
                  <Text style={styles.userDetailsTextStyle}> {height}</Text>

                  <View style={styles.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>{jobTittle}</Text>
                </View>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>{currentCity},</Text>

                  <Text style={style.userDetailsTextStyle}>
                    {' '}
                    {currentCountry}
                  </Text>
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
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: colors.white}}>
      {loading ? (
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
      ) : data.length === 0 ? (
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
          data={data}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListFooterComponent={<View style={{height: 130}} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  image: {
    width: '100%',
    height: hp(449),
    borderRadius: 18,
    marginBottom: hp(13),
  },
  name: {
    fontSize: 16,
    color: 'black',
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
    backgroundColor: colors.gray,
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

export default MatchesInSavedScreen;
