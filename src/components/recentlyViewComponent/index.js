import React, {useCallback, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {icons} from '../../assets';
import ProfileAvatar from '../letterProfileComponent';
import {colors} from '../../utils/colors';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const RecentlyViewComponent = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const navigation = useNavigation();

  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(false); // Loading state

  const fetchProfile = useCallback(async () => {
    if (!userId || !accessToken) {
      return;
    }
    setLoading(true); // Start loading

    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/profile-viewer/get-profile-viewerv2/${userId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();
      // console.log('Profile data:', data?.data[0]?.paginatedResults);
      setProfileData(data?.data[0]?.paginatedResults || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile data:', error.message);
      setLoading(false);
    }
  }, [userId, accessToken]);

  useFocusEffect(
    useCallback(() => {
      fetchProfile();
    }, []),
  );

  const renderItem = ({item}) => {
    const {selectedPlan, status} = item?.user?.subscriptionDetails || {};

    const isGoldPlan = selectedPlan === 'gold';
    const isSilverPlan = selectedPlan === 'silver';
    const isPlatinumPlan = selectedPlan === 'Platinum';

    const subPlan = isGoldPlan || isSilverPlan || isPlatinumPlan;

    let crownTintColor = 'white'; // Default to white
    if (isGoldPlan) {
      crownTintColor = 'orange'; // Gold plan -> orange tint
    } else if (isSilverPlan) {
      crownTintColor = 'silver'; // Silver plan -> silver tint
    } else if (isPlatinumPlan) {
      crownTintColor = 'green'; // Platinum plan -> red tint
    }

    const hasValidImage =
      item?.user?.profilePic &&
      item.user?.profilePic !== 'null' &&
      item.user?.profilePic.trim() !== '';

    const profilePrivacy =
      item?.user?.privacySettingCustom?.profilePhotoPrivacy === true ||
      item?.user?.privacySettingCustom?.showPhotoToFriendsOnly === true;

    const firstName = item?.user?.firstName
      ? item?.user?.firstName.charAt(0).toUpperCase() +
        item?.user?.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item?.user?.lastName
      ? item?.user?.lastName.charAt(0).toUpperCase() +
        item?.user?.lastName.slice(1).toLowerCase()
      : '';

    const name = item?.user?.name
      ? item?.user?.name.charAt(0).toUpperCase() +
        item?.user?.name.slice(1).toLowerCase()
      : '';

    const currentCity = item?.user?.address?.currentCity
      ? item?.user?.address.currentCity.charAt(0).toUpperCase() +
        item?.user?.address.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item?.user?.address?.currentCountry
      ? item?.user?.address.currentCountry.charAt(0).toUpperCase() +
        item?.user?.address.currentCountry.slice(1).toLowerCase()
      : '';

    const handlePress = items => {
      const matchesUserData = {
        firstName: items?.user?.name,
        id: items?.user?._id,
      };

      navigation.navigate('NewUserDetailsScreen', {matchesUserData});
    };

    return (
      <TouchableOpacity
        onPress={() => {
          handlePress(item);
        }}
        style={{
          flex: 1,
          flexDirection: 'column',
          alignItems: 'center',
          padding: 13,
          marginLeft: -12,
        }}>
        <View
          style={{
            height: hp(200),
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#EFEFEF',
          }}>
          {/*<Image*/}
          {/*  source={{uri: item?.user?.profilePic}}*/}
          {/*  style={{width: 60, height: 60, borderRadius: 30, marginBottom: 6}}*/}
          {/*/>*/}

          {hasValidImage ? (
            <>
              <Image
                source={{uri: item?.user?.profilePic}}
                style={{
                  width: 110,
                  height: 136,
                  justifyContent: 'center',
                  borderRadius: 10,
                  overflow: 'hidden',
                  marginBottom: 10,
                }}
              />
              {profilePrivacy && (
                <Image
                  source={icons.logLogo} // make sure you have a `lock` icon inside `icons`
                  style={{
                    position: 'absolute',
                    tintColor: '#fff',
                    resizeMode: 'contain',
                    width: 12,
                    height: 16,
                    alignSelf: 'center',
                    top: 65,
                  }}
                />
              )}

              {subPlan && (
                <Image
                  source={icons.crownIcon} // Crown icon
                  style={{
                    position: 'absolute',
                    top: 12,
                    resizeMode: 'contain',
                    height: hp(12),
                    width: hp(12),
                    tintColor: crownTintColor,
                    left: 15,
                  }}
                />
              )}
            </>
          ) : (
            <>
              <ProfileAvatar
                firstName={item?.user?.firstName || item?.user?.name}
                lastName={item.lastName}
                textStyle={{width: 110, height: 136, marginBottom: 10}}
              />
              {subPlan && (
                <Image
                  source={icons.crownIcon} // Crown icon
                  style={{
                    position: 'absolute',
                    top: 12,
                    resizeMode: 'contain',
                    height: hp(12),
                    width: hp(12),
                    // tintColor: 'white',
                    tintColor: crownTintColor,
                    left: 15,
                  }}
                />
              )}
            </>
          )}

          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                fontSize: fontSize(12),
                lineHeight: hp(15),
                fontFamily: fontFamily.poppins700,
                color: colors.black,
              }}>
              {firstName || name} {lastName}
            </Text>

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: fontSize(9),
                  lineHeight: hp(12),
                  color: colors.black,
                  fontFamily: fontFamily.poppins400,
                  top: 5,
                }}>
                {item?.user?.age} yrs,
              </Text>
              <Text
                style={{
                  fontSize: fontSize(9),
                  lineHeight: hp(12),
                  color: colors.black,
                  fontFamily: fontFamily.poppins400,
                  top: 5,
                }}>
                {' '}
                {item?.user?.height}
              </Text>
            </View>

            <Text
              style={{
                fontSize: fontSize(9),
                lineHeight: hp(12),
                color: colors.black,
                fontFamily: fontFamily.poppins400,
                top: 5,
              }}>
              {currentCity || 'N/A'}, {currentCountry || 'N/A'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {(loading || profileData.length > 0) && (
        <>
          <View style={{marginHorizontal: 17}}>
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(16),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins600,
                marginRight: hp(3),
                marginBottom: 10,
              }}>
              Recently Viewed
            </Text>

            {loading ? (
              <FlatList
                data={[1, 1, 1, 1]}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={() => (
                  <View
                    style={{
                      width: 115,
                      height: 200,
                      borderRadius: 10,
                      marginRight: 5,
                      marginTop: 15,
                    }}>
                    <View
                      style={{
                        width: 100,
                        height: 170,
                        backgroundColor: '#9e9e9e',
                        opacity: 0.4,
                        alignItems: 'center',
                        borderRadius: 10,
                      }}>
                      <ShimmerPlaceholder
                        style={{
                          width: '80%',
                          height: 80,
                          backgroundColor: 'black',
                          marginTop: 10,
                          borderRadius: 10,
                        }}
                      />
                      <ShimmerPlaceholder
                        style={{
                          width: '60%',
                          height: 10,
                          backgroundColor: 'black',
                          marginTop: 30,
                        }}
                      />
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 12,
                        }}>
                        <ShimmerPlaceholder
                          style={{
                            width: 30,
                            height: 15,
                            backgroundColor: 'black',
                            borderRadius: 25,
                          }}
                        />
                        <ShimmerPlaceholder
                          style={{
                            width: 30,
                            height: 15,
                            backgroundColor: 'black',
                            borderRadius: 25,
                            marginLeft: 15,
                          }}
                        />
                      </View>
                    </View>
                  </View>
                )}
              />
            ) : (
              <FlatList
                data={profileData}
                keyExtractor={(item, index) => String(index)}
                renderItem={renderItem}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingRight: 10}}
              />
            )}
          </View>

          <TouchableHighlight
            activeOpacity={0.6}
            underlayColor="#F9FBFF"
            // onPress={() => {
            //   navigation.navigate('Matches', {initialTab: 'saved'}); // 👈 pass tab
            // }}
            onPress={() => {
              navigation.navigate('Matches');
            }}
            style={{
              // backgroundColor: 'red',
              height: 45,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: colors.black,
                textAlign: 'center',
                fontSize: fontSize(14),
                lineHeight: hp(16),
                fontFamily: fontFamily.poppins500,
                justifyContent: 'center',
              }}>
              Show Me All
            </Text>
          </TouchableHighlight>

          <View
            style={{
              width: '100%',
              height: 8,
              backgroundColor: '#F8F8F8',
              // marginTop: hp(10),
              marginBottom: 20,
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default RecentlyViewComponent;
