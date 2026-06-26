import React, {useEffect, useRef, useState} from 'react';

import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {useNavigation} from '@react-navigation/native';

import {useSelector} from 'react-redux';

import axios from 'axios';

import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import LinearGradient from 'react-native-linear-gradient';

import {colors} from '../../utils/colors';

import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

import {icons, images} from '../../assets';

import {BASE_URL} from '../../utils/constants';

import ServicesRecentlyComponent from '../../components/servicesRecentlyComponent';
import SignInOrLogInComponent from '../../components/signInOrLogInComponent';

// =========================================
// SHIMMER
// =========================================

const renderShimmer = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <ShimmerPlaceHolder
        LinearGradient={LinearGradient}
        style={{
          width: '100%',
          height: hp(375),
        }}
      />

      <View
        style={{
          alignItems: 'center',
          marginTop: -50,
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{
            width: hp(100),
            height: hp(100),
            borderRadius: hp(100),
          }}
        />
      </View>

      <View
        style={{
          alignItems: 'center',
          marginTop: hp(20),
        }}>
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{
            width: wp(160),
            height: hp(20),
            borderRadius: 8,
          }}
        />

        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{
            width: wp(250),
            height: hp(15),
            borderRadius: 8,
            marginTop: hp(12),
          }}
        />
      </View>
    </ScrollView>
  );
};

const ServicesProfileScreen = ({route}) => {
  const {vendorId, location, category, previousScreen} = route.params;

  // console.log(' === ServicesProfileScreen ===> ', previousScreen);

  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);

  const accessToken = user?.tokens?.access?.token;

  const [vendorData, setVendorData] = useState(null);

  const [loading, setLoading] = useState(false);

  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [activeIndex, setActiveIndex] = useState(0);

  const [loginModal, setLoginModal] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  // console.log(' === vendorData ===> ', vendorData?.userProfilePic);

  const onScroll = event => {
    const slideSize = wp(100);

    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);

    setActiveIndex(index);
  };

  // =========================================
  // FIRST API
  // =========================================

  // useEffect(() => {
  //   // CLEAR OLD DATA
  //   setVendorData(null);
  //
  //   // CALL NEW API
  //   getVendorDetails();
  // }, [vendorId]);

  useEffect(() => {
    // CLEAR OLD DATA
    setVendorData(null);

    // GET DETAILS
    getVendorDetails();

    // CREATE PROFILE VIEW
    if (user && vendorId) {
      createProfileViewer();
    }
  }, [vendorId]);
  // =========================================
  // GET DETAILS
  // =========================================

  const getVendorDetails = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/api/v1/user/user/get-vendor/${vendorId}`,
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${accessToken}`,

            'Content-Type': 'application/json',
          },
        },
      );

      const result = await response.json();

      console.log('VENDOR DETAILS ===>', result);

      setVendorData(result?.data);
    } catch (error) {
      console.log('DETAILS API ERROR ===>', error);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // REFRESH DATA
  // =========================================

  const refreshVendorData = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/user/user/get-vendor/${vendorId}`,
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${accessToken}`,

            'Content-Type': 'application/json',
          },
        },
      );

      const result = await response.json();

      console.log('REFRESH DATA ===>', result);

      setVendorData(result?.data);
    } catch (error) {
      console.log('REFRESH ERROR ===>', error);
    }
  };

  // =========================================
  // CREATE SHORTLIST
  // =========================================

  const createShortlist = async () => {
    try {
      if (vendorData?.isShortlisted) {
        return;
      }

      setWishlistLoading(true);

      const response = await fetch(
        `${BASE_URL}/api/v1/user/shortlist/create-shortlist`,
        {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${accessToken}`,

            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            shortlistId: vendorId,
          }),
        },
      );

      const result = await response.json();

      console.log('SHORTLIST RESPONSE ===>', result);

      if (result?.status === 'Success') {
        refreshVendorData();
      }
    } catch (error) {
      console.log('SHORTLIST ERROR ===>', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  // =========================================
  // DELETE SHORTLIST
  // =========================================

  const deleteShortlist = async () => {
    try {
      if (!vendorData?.isShortlisted) {
        return;
      }

      setWishlistLoading(true);

      const shortlistId =
        vendorData?.shortlistData?.[0]?._id ||
        vendorData?.shortlistData?.[0]?.id;

      if (!shortlistId) {
        console.log('Shortlist ID not found');

        return;
      }

      const response = await axios.delete(
        `${BASE_URL}/api/v1/user/shortlist/delete-short-list/${shortlistId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log('DELETE SHORTLIST ===>', response?.data);

      refreshVendorData();
    } catch (error) {
      console.log('DELETE ERROR ===>', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const createProfileViewer = async () => {
    try {
      // USER NOT LOGIN
      if (!user) {
        return;
      }

      const response = await fetch(
        `${BASE_URL}/api/v1/user/profile-viewer/create-profile-viewer?appUsesType=vendor`,
        {
          method: 'POST',

          headers: {
            Authorization: `Bearer ${accessToken}`,

            'Content-Type': 'application/json',
          },

          body: JSON.stringify({
            viewerId: vendorId,
          }),
        },
      );

      const result = await response.json();

      console.log('PROFILE VIEW RESPONSE ===>', result);
    } catch (error) {
      console.log('PROFILE VIEW ERROR ===>', error);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.white,
      }}>
      <SignInOrLogInComponent
        visible={loginModal}
        onClose={() => {
          setLoginModal(false);
        }}
        onSignUp={() => {
          setLoginModal(false);

          navigation.replace('NewSignUpScreen');
        }}
        onLogin={() => {
          setLoginModal(false);

          navigation.replace('NewLogInScreen');
        }}
      />
      {/* HEADER */}
      <View
        style={{
          width: '100%',
          height: hp(50),
          justifyContent: 'center',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {/* BACK */}
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              if (previousScreen === 'VendorSavedScreen') {
                navigation.navigate('VendorSavedScreen');
              } else if (previousScreen === 'ServiceHomeScreen') {
                navigation.navigate('Discover');
              } else {
                navigation.navigate('VendorSearchFilterScreen', {
                  location: location,

                  category: category,
                });
              }
            }}
            style={{
              width: hp(50),
              height: hp(50),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={icons.back_arrow_icon}
              style={{
                width: hp(14),
                height: hp(14),
                resizeMode: 'contain',
                left: -3,
              }}
            />
          </TouchableOpacity>

          {/* TITLE */}
          {loading ? (
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{
                width: wp(120),

                height: hp(18),

                borderRadius: 8,
              }}
            />
          ) : (
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins500,
              }}>
              {vendorData?.name || 'NA'}
            </Text>
          )}

          {/* HEART */}
          <TouchableOpacity
            activeOpacity={0.6}
            disabled={wishlistLoading || loading}
            onPress={() => {
              // LOGIN CHECK
              if (!user) {
                // navigation.replace('NewSignUpScreen');
                setLoginModal(true);

                return;
              }

              // TOGGLE
              if (vendorData?.isShortlisted) {
                deleteShortlist();
              } else {
                createShortlist();
              }
            }}
            style={{
              width: hp(50),
              height: hp(60),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {loading ? (
              <ShimmerPlaceHolder
                LinearGradient={LinearGradient}
                style={{
                  width: hp(20),

                  height: hp(18),

                  borderRadius: 50,
                }}
              />
            ) : wishlistLoading ? (
              <ActivityIndicator size="small" color="#7148E4" />
            ) : (
              <Image
                source={
                  vendorData?.isShortlisted
                    ? icons.dating_white_heart
                    : icons.black_heart_icon
                }
                style={{
                  width: hp(20),
                  height: hp(18),
                  resizeMode: 'contain',
                  tintColor: vendorData?.isShortlisted ? 'red' : '#000',
                }}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
      {/* SHIMMER */}
      {loading ? (
        renderShimmer()
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* BANNER */}

          <View
            style={{
              width: screenWidth,
              height: hp(375),
            }}>
            {vendorData?.userProfilePic?.length > 0 ? (
              <>
                <FlatList
                  data={vendorData?.userProfilePic}
                  horizontal
                  pagingEnabled
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => index.toString()}
                  onMomentumScrollEnd={event => {
                    const index = Math.round(
                      event.nativeEvent.contentOffset.x / screenWidth,
                    );

                    setActiveIndex(index);
                  }}
                  renderItem={({item}) => {
                    return (
                      <Image
                        source={{
                          uri: item?.url,
                        }}
                        style={{
                          width: screenWidth,
                          height: hp(375),
                        }}
                      />
                    );
                  }}
                />

                {/* PAGINATION */}
                <View
                  style={{
                    position: 'absolute',
                    top: hp(10),
                    width: '100%',
                    flexDirection: 'row',
                    paddingHorizontal: wp(15),
                  }}>
                  {vendorData?.userProfilePic?.map((_, index) => {
                    const isActive = activeIndex === index;

                    return (
                      <View
                        key={index}
                        style={{
                          flex: 1,
                          height: hp(1),
                          backgroundColor: isActive
                            ? colors.white
                            : 'rgba(255,255,255,0.4)',
                          marginHorizontal: wp(2),
                          borderRadius: hp(10),
                        }}
                      />
                    );
                  })}
                </View>
              </>
            ) : (
              <View
                style={{
                  width: '100%',
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FAF8FF',
                }}>
                <Image
                  source={icons.box_image_Icon}
                  style={{
                    tintColor: '#7148E4',
                    width: hp(24),
                    height: hp(24),
                    resizeMode: 'contain',
                    marginBottom: hp(10),
                  }}
                />

                <Text
                  style={{
                    color: '#7148E43D',
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  No Image Found
                </Text>
              </View>
            )}
          </View>

          {/*<Image*/}
          {/*  source={images.photo_studio_background_img}*/}
          {/*  style={{*/}
          {/*    width: '100%',*/}
          {/*    height: hp(375),*/}
          {/*  }}*/}
          {/*/>*/}

          {/* PROFILE */}
          <View
            style={{
              alignItems: 'center',
              top: -50,
            }}>
            {vendorData?.profilePic ? (
              <Image
                source={{uri: vendorData?.profilePic}}
                style={{
                  width: hp(100),
                  height: hp(100),
                  borderRadius: hp(50),
                }}
              />
            ) : (
              <View
                style={{
                  width: hp(100),
                  height: hp(100),
                  borderRadius: hp(50),
                  backgroundColor: '#7B2CBF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: colors.white,
                    fontSize: fontSize(26),
                    fontFamily: fontFamily.poppins600,
                    textTransform: 'uppercase',
                  }}>
                  {vendorData?.name
                    ?.split(' ')
                    ?.map(word => word[0])
                    ?.join('')
                    ?.slice(0, 2) || 'U'}
                </Text>
              </View>
            )}
          </View>

          {/* NAME */}
          <View
            style={{
              marginTop: -20,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: colors.pureBlack,
                fontSize: fontSize(22),
                fontFamily: fontFamily.poppins600,
              }}>
              {vendorData?.name || 'NA'}
            </Text>

            {/* ADDRESS */}
            <Text
              style={{
                color: colors.pureBlack,

                textAlign: 'center',

                fontSize: fontSize(14),

                fontFamily: fontFamily.poppins400,

                marginTop: hp(5),
              }}>
              {vendorData?.address?.currentResidenceAddress ||
              vendorData?.address?.area ||
              vendorData?.address?.currentCity ||
              vendorData?.address?.currentState
                ? `${vendorData?.address?.currentResidenceAddress || 'NA'}, ${
                    vendorData?.address?.area || 'NA'
                  }, ${vendorData?.address?.currentCity || 'NA'}, ${
                    vendorData?.address?.currentState || 'NA'
                  }`
                : 'NA'}
            </Text>
          </View>

          {/* SOCIAL */}
          <View
            style={{
              flexDirection: 'row',

              justifyContent: 'center',

              marginTop: hp(23),

              flexWrap: 'wrap',
            }}>
            {vendorData?.vendorData?.[0]?.social?.map((item, index) => {
              let iconSource = icons.instagram_icon;

              switch (item?.platform) {
                case 'instagram':
                  iconSource = icons.instagram_icon;
                  break;

                case 'facebook':
                  iconSource = icons.facebookLogo;
                  break;

                case 'twitter':
                  iconSource = icons.twitter_Icon;
                  break;

                case 'youtube':
                  iconSource = icons.youtube_icon;
                  break;

                case 'whatsapp':
                  iconSource = icons.whatsapp_icon;
                  break;
              }

              return (
                <TouchableOpacity
                  key={index}
                  activeOpacity={0.6}
                  onPress={() => {
                    if (item?.url) {
                      Linking.openURL(item?.url);
                    }
                  }}
                  style={{
                    width: hp(44),

                    height: hp(44),

                    borderRadius: 50,

                    backgroundColor: '#F9F6FF',

                    justifyContent: 'center',

                    alignItems: 'center',

                    marginRight: hp(19),

                    marginBottom: hp(10),
                  }}>
                  <Image
                    source={iconSource}
                    style={{
                      width: item?.platform === 'youtube' ? hp(30) : hp(20),

                      height: item?.platform === 'youtube' ? hp(21) : hp(20),

                      resizeMode: 'contain',
                    }}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* SERVICES */}
          <View
            style={{
              marginTop: hp(35),
              marginHorizontal: hp(15),
            }}>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(16),
                fontFamily: fontFamily.poppins500,
              }}>
              Our Services
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: hp(23),
              }}>
              {vendorData?.vendorData?.[0]?.servicesProvided?.map(
                (service, index) => {
                  const formattedService = service
                    ?.replace(/-/g, ' ')
                    ?.replace(/\b\w/g, l => l.toUpperCase());

                  return (
                    <View
                      key={index}
                      style={{
                        height: hp(33),
                        backgroundColor: '#F9F6FF',
                        borderRadius: hp(50),
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        paddingHorizontal: wp(14),
                        marginRight: wp(10),
                        marginBottom: hp(10),
                      }}>
                      <Image
                        source={icons.wedding_Studio_icon}
                        style={{
                          width: hp(18),
                          height: hp(18),
                          resizeMode: 'contain',
                          marginRight: wp(10),
                          tintColor: '#7148E4',
                        }}
                      />

                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(12),
                          fontFamily: fontFamily.poppins500,
                        }}>
                        {formattedService}
                      </Text>
                    </View>
                  );
                },
              )}
            </View>
          </View>

          {/* LINE */}
          {/*<View*/}
          {/*  style={{*/}
          {/*    width: '100%',*/}
          {/*    height: 4,*/}
          {/*    backgroundColor: '#F7F7F7',*/}
          {/*    marginTop: hp(31),*/}
          {/*  }}*/}
          {/*/>*/}

          {/* SIMILAR */}
          {/*<ServicesRecentlyComponent labelHeading={'More Similars'} />*/}

          <View
            style={{
              height: 30,
            }}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ServicesProfileScreen;
