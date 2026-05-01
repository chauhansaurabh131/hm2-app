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
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
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
    // console.log(' === var ===> ', item?.user);

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

    // const profilePrivacy =
    //   item?.user?.privacySettingCustom?.profilePhotoPrivacy === true ||
    //   item?.user?.privacySettingCustom?.showPhotoToFriendsOnly === true;

    const profilePrivacy =
      (item?.user?.privacySettingCustom?.profilePhotoPrivacy === true ||
        item?.user?.privacySettingCustom?.showPhotoToFriendsOnly === true) &&
      item?.friendsDetails?.status !== 'accepted';

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

      // navigation.navigate('NewUserDetailsScreen', {matchesUserData});
      navigation.navigate('UserProfileDetailsScreen', {matchesUserData});
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
            width: wp(156),
            height: hp(251),
            // height: 'auto',
            borderRadius: hp(20),
            backgroundColor: '#FFFFFF',
            borderWidth: hp(1),
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
                  width: '100%',
                  height: hp(184),
                  justifyContent: 'center',
                  overflow: 'hidden',
                  borderTopRightRadius: hp(20),
                  borderTopLeftRadius: hp(20),
                }}
              />
              {profilePrivacy && (
                <Image
                  source={icons.logLogo} // make sure you have a `lock` icon inside `icons`
                  style={{
                    position: 'absolute',
                    tintColor: '#fff',
                    resizeMode: 'contain',
                    width: hp(20),
                    height: hp(20),
                    alignSelf: 'center',
                    top: hp(85),
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
                lastName={item?.user?.lastName}
                textStyle={{
                  width: '100%',
                  height: hp(184),
                  borderTopRightRadius: hp(20),
                  borderTopLeftRadius: hp(20),
                  borderBottomRightRadius: hp(0),
                  borderBottomLeftRadius: hp(0),
                }}
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

          <View
            style={{
              alignItems: 'center',
              marginTop: hp(11),
              marginBottom: hp(15),
            }}>
            <Text
              style={{
                fontSize: fontSize(12),
                lineHeight: hp(15),
                fontFamily: fontFamily.poppins700,
                color: colors.black,
              }}>
              {firstName || name} {lastName}
            </Text>

            <View style={{flexDirection: 'row', marginTop: hp(8)}}>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{
                  fontSize: fontSize(9),
                  lineHeight: hp(12),
                  color: '#9C9C9C',
                  fontFamily: fontFamily.poppins400,
                }}>
                {item?.user?.age} yr, {item?.user?.height},{' '}
                {currentCity || 'N/A'}, {currentCountry || 'N/A'}
              </Text>

              {/*<Text*/}
              {/*  style={{*/}
              {/*    fontSize: fontSize(9),*/}
              {/*    lineHeight: hp(12),*/}
              {/*    color: colors.black,*/}
              {/*    fontFamily: fontFamily.poppins400,*/}
              {/*  }}>*/}
              {/*  {currentCity || 'N/A'}, {currentCountry || 'N/A'}*/}
              {/*</Text>*/}
            </View>

            {/*<Text*/}
            {/*  style={{*/}
            {/*    fontSize: fontSize(9),*/}
            {/*    lineHeight: hp(12),*/}
            {/*    color: colors.black,*/}
            {/*    fontFamily: fontFamily.poppins400,*/}
            {/*    top: 5,*/}
            {/*  }}>*/}
            {/*  {currentCity || 'N/A'}, {currentCountry || 'N/A'}*/}
            {/*</Text>*/}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {(loading || profileData.length > 0) && (
        <>
          <View style={{marginTop: hp(56)}}>
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(16),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins600,
                marginRight: hp(3),
                marginBottom: hp(10),
                paddingLeft: wp(17), // ✅ CONTROL LEFT SPACE HERE
              }}>
              Recently Viewed
            </Text>

            {loading ? (
              <FlatList
                data={[1, 2, 3, 4]}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingLeft: wp(17)}}
                renderItem={() => (
                  <View style={{marginRight: 10}}>
                    <View
                      style={{
                        width: wp(156),
                        height: hp(230),
                        borderRadius: hp(20),
                        backgroundColor: '#E0E0E0',
                        padding: hp(10),
                      }}>
                      <ShimmerPlaceholder
                        style={{
                          width: '100%',
                          height: hp(150),
                          borderRadius: hp(10),
                        }}
                      />

                      <ShimmerPlaceholder
                        style={{
                          width: '60%',
                          height: hp(10),
                          marginTop: hp(10),
                          borderRadius: hp(5),
                        }}
                      />

                      <ShimmerPlaceholder
                        style={{
                          width: '40%',
                          height: hp(10),
                          marginTop: hp(8),
                          borderRadius: hp(5),
                        }}
                      />
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
                contentContainerStyle={{
                  paddingRight: hp(10),
                  paddingLeft: wp(17),
                }}
              />
            )}
          </View>

          {/*<TouchableHighlight*/}
          {/*  activeOpacity={0.6}*/}
          {/*  underlayColor="#F9FBFF"*/}
          {/*  onPress={() => {*/}
          {/*    navigation.navigate('Matches', {initialTab: 'viewed'}); // 👈 passing "viewed"*/}
          {/*  }}*/}
          {/*  // onPress={() => {*/}
          {/*  //   navigation.navigate('Matches');*/}
          {/*  // }}*/}
          {/*  style={{*/}
          {/*    // backgroundColor: 'red',*/}
          {/*    height: 45,*/}
          {/*    justifyContent: 'center',*/}
          {/*  }}>*/}
          {/*  <Text*/}
          {/*    style={{*/}
          {/*      color: colors.black,*/}
          {/*      textAlign: 'center',*/}
          {/*      fontSize: fontSize(14),*/}
          {/*      lineHeight: hp(16),*/}
          {/*      fontFamily: fontFamily.poppins500,*/}
          {/*      justifyContent: 'center',*/}
          {/*    }}>*/}
          {/*    Show Me All*/}
          {/*  </Text>*/}
          {/*</TouchableHighlight>*/}

          {/*<View*/}
          {/*  style={{*/}
          {/*    width: '100%',*/}
          {/*    height: hp(4),*/}
          {/*    backgroundColor: '#F8F8F8',*/}
          {/*    // marginTop: hp(10),*/}
          {/*    // marginBottom: 20,*/}
          {/*  }}*/}
          {/*/>*/}
        </>
      )}
    </SafeAreaView>
  );
};

export default RecentlyViewComponent;
