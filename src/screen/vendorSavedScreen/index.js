import React, {useCallback, useState} from 'react';

import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {useSelector} from 'react-redux';

import LinearGradient from 'react-native-linear-gradient';

import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';

import {colors} from '../../utils/colors';

import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

import {BASE_URL} from '../../utils/constants';

import {icons} from '../../assets';

const VendorSavedScreen = () => {
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);

  const accessToken = user?.tokens?.access?.token;

  const userId = user?.user?.id;

  const [savedVendors, setSavedVendors] = useState([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);

  const [hasMoreData, setHasMoreData] = useState(true);

  const [paginationLoading, setPaginationLoading] = useState(false);

  // =====================================
  // SCREEN FOCUS
  // =====================================

  useFocusEffect(
    useCallback(() => {
      setPage(1);

      setHasMoreData(true);

      setSavedVendors([]);

      getSavedVendors(1, true);
    }, []),
  );

  // =====================================
  // GET SAVED VENDORS
  // =====================================

  const getSavedVendors = async (currentPage = 1, isFirst = false) => {
    try {
      if (isFirst) {
        setLoading(true);
      } else {
        setPaginationLoading(true);
      }

      const response = await fetch(
        `${BASE_URL}/api/v1/user/shortlist/get-short-list-vendor/${userId}?page=${currentPage}&limit=10`,
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${accessToken}`,

            'Content-Type': 'application/json',
          },
        },
      );

      const result = await response.json();

      console.log('SAVED VENDORS ===>', result);

      const newData = result?.data || [];

      // FIRST PAGE
      if (isFirst) {
        setSavedVendors(newData);
      } else {
        setSavedVendors(prev => [...prev, ...newData]);
      }

      // PAGINATION
      setHasMoreData(result?.hasNextPage);
    } catch (error) {
      console.log('SAVED API ERROR ===>', error);
    } finally {
      setLoading(false);

      setPaginationLoading(false);
    }
  };

  // =====================================
  // LOAD MORE
  // =====================================

  const loadMoreData = () => {
    if (hasMoreData && !paginationLoading) {
      const nextPage = page + 1;

      setPage(nextPage);

      getSavedVendors(nextPage, false);
    }
  };

  // =====================================
  // SHIMMER ITEM
  // =====================================

  const renderShimmerItem = () => {
    return (
      <View
        style={{
          marginTop: hp(10),

          marginHorizontal: wp(17),

          backgroundColor: '#FFF',

          borderRadius: 15,

          borderWidth: 1,

          borderColor: '#EFEFEF',

          overflow: 'hidden',
        }}>
        {/* BG IMAGE */}
        <ShimmerPlaceHolder
          LinearGradient={LinearGradient}
          style={{
            width: '100%',

            height: hp(167),
          }}
        />

        {/* PROFILE */}
        <View
          style={{
            marginTop: -25,

            marginLeft: wp(17),
          }}>
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={{
              width: hp(50),

              height: hp(50),

              borderRadius: hp(50),
            }}
          />
        </View>

        <View
          style={{
            paddingHorizontal: wp(17),

            marginTop: hp(10),

            marginBottom: hp(20),
          }}>
          {/* NAME */}
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={{
              width: wp(150),

              height: hp(18),

              borderRadius: 6,
            }}
          />

          {/* ADDRESS */}
          <ShimmerPlaceHolder
            LinearGradient={LinearGradient}
            style={{
              width: wp(220),

              height: hp(12),

              borderRadius: 6,

              marginTop: hp(10),
            }}
          />

          {/* TAGS */}
          <View
            style={{
              flexDirection: 'row',

              marginTop: hp(18),
            }}>
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{
                width: wp(120),

                height: hp(33),

                borderRadius: 50,

                marginRight: wp(10),
              }}
            />

            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{
                width: wp(60),

                height: hp(33),

                borderRadius: 50,
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  // =====================================
  // RENDER ITEM
  // =====================================

  const renderItem = ({item}) => {
    const vendor = item?.shortlistId;

    const services = vendor?.vendorData?.[0]?.servicesProvided || [];

    // FORMAT SERVICES
    const formattedServices = services.map(service =>
      service.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    );

    // FIRST
    const firstService = formattedServices[0];

    // SECOND
    const secondService = formattedServices[1];

    // LENGTH CHECK
    const firstLength = firstService?.length || 0;

    const secondLength = secondService?.length || 0;

    // SHOW SECOND
    const showSecondTag = firstLength < 18 && secondLength < 18;

    // COUNT
    const remainingCount = showSecondTag
      ? formattedServices.length - 2
      : formattedServices.length - 1;

    return (
      <TouchableOpacity
        style={{
          marginTop: hp(10),
          alignItems: 'center',
          marginHorizontal: 17,
        }}
        activeOpacity={0.6}
        onPress={() => {
          navigation.navigate('ServicesProfileScreen', {
            vendorId: vendor?._id,
            previousScreen: 'VendorSavedScreen',
          });
        }}>
        <View
          style={{
            width: '100%',
          }}>
          <View
            style={{
              width: '100%',
              borderWidth: 1,
              borderColor: '#EFEFEF',
              borderRadius: hp(15),
              backgroundColor: '#FFF',
            }}>
            {/* BG IMAGE */}

            {vendor?.userProfilePic?.[0]?.url ? (
              <Image
                source={{
                  uri: vendor?.userProfilePic?.[0]?.url,
                }}
                style={{
                  width: '100%',
                  height: hp(167),
                  borderRadius: hp(15),
                }}
              />
            ) : (
              <View
                style={{
                  width: '100%',
                  height: hp(167),
                  borderRadius: hp(15),
                  backgroundColor: '#FAF8FF',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={icons.box_image_Icon}
                  style={{
                    tintColor: '#7148E4',
                    width: hp(20),
                    height: hp(26),
                    resizeMode: 'contain',
                  }}
                />

                <Text
                  style={{
                    color: '#7148E43D',
                    fontSize: fontSize(10),
                    fontFamily: fontFamily.poppins600,
                  }}>
                  No Image Found
                </Text>
              </View>
            )}

            {/* PROFILE */}
            <View
              style={{
                top: -25,
                marginLeft: wp(17),
              }}>
              {vendor?.profilePic ? (
                <Image
                  source={{
                    uri: vendor?.profilePic,
                  }}
                  style={{
                    width: hp(50),
                    height: hp(50),
                    borderRadius: hp(50),
                    backgroundColor: 'white',
                  }}
                />
              ) : (
                <View
                  style={{
                    width: hp(50),
                    height: hp(50),
                    borderRadius: hp(50),
                    backgroundColor: '#7B2CBF',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      color: colors.white,
                      fontSize: fontSize(18),
                      fontFamily: fontFamily.poppins600,
                      textTransform: 'uppercase',
                    }}>
                    {vendor?.name
                      ?.split(' ')
                      ?.map(word => word[0])
                      ?.join('')
                      ?.slice(0, 2) || 'U'}
                  </Text>
                </View>
              )}
            </View>

            {/* DETAILS */}
            <View
              style={{
                marginHorizontal: wp(17),

                marginTop: -10,
              }}>
              {/* NAME */}
              <Text
                style={{
                  color: colors.pureBlack,

                  fontSize: fontSize(18),

                  fontFamily: fontFamily.poppins600,
                }}>
                {vendor?.name || 'NA'}
              </Text>

              {/* ADDRESS */}
              <Text
                style={{
                  color: '#6E6E6E',

                  marginTop: hp(4),

                  fontFamily: fontFamily.poppins400,

                  fontSize: fontSize(11),
                }}>
                {vendor?.address?.currentResidenceAddress ||
                vendor?.address?.area ||
                vendor?.address?.currentCity ||
                vendor?.address?.currentState
                  ? `${vendor?.address?.currentResidenceAddress || 'NA'}, ${
                      vendor?.address?.area || 'NA'
                    }, ${vendor?.address?.currentCity || 'NA'}, ${
                      vendor?.address?.currentState || 'NA'
                    }`
                  : 'NA'}
              </Text>

              {/* TAGS */}
              <View
                style={{
                  flexDirection: 'row',

                  alignItems: 'center',

                  marginTop: hp(15),

                  marginBottom: hp(16),
                }}>
                {/* FIRST */}
                {firstService && (
                  <View
                    style={{
                      height: hp(33),

                      backgroundColor: '#F9F6FF',

                      borderRadius: 50,

                      justifyContent: 'center',

                      alignItems: 'center',

                      flexDirection: 'row',

                      paddingHorizontal: wp(14),

                      marginRight: wp(10),
                    }}>
                    <Image
                      source={icons.wedding_Studio_icon}
                      style={{
                        width: hp(13),

                        height: hp(13),

                        resizeMode: 'contain',

                        marginRight: wp(8),

                        tintColor: '#7148E4',
                      }}
                    />

                    <Text
                      style={{
                        color: colors.pureBlack,

                        fontSize: fontSize(12),

                        fontFamily: fontFamily.poppins400,
                      }}>
                      {firstService}
                    </Text>
                  </View>
                )}

                {/* SECOND */}
                {showSecondTag && secondService && (
                  <View
                    style={{
                      height: hp(33),

                      backgroundColor: '#F9F6FF',

                      borderRadius: 50,

                      justifyContent: 'center',

                      alignItems: 'center',

                      flexDirection: 'row',

                      paddingHorizontal: wp(14),

                      marginRight: wp(10),
                    }}>
                    <Image
                      source={icons.wedding_Studio_icon}
                      style={{
                        width: hp(13),

                        height: hp(13),

                        resizeMode: 'contain',

                        marginRight: wp(8),

                        tintColor: '#7148E4',
                      }}
                    />

                    <Text
                      style={{
                        color: colors.pureBlack,

                        fontSize: fontSize(12),

                        fontFamily: fontFamily.poppins400,
                      }}>
                      {secondService}
                    </Text>
                  </View>
                )}

                {/* COUNT */}
                {remainingCount > 0 && (
                  <View
                    style={{
                      width: hp(55),

                      height: hp(33),

                      backgroundColor: '#F9F6FF',

                      borderRadius: 50,

                      justifyContent: 'center',

                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        color: colors.pureBlack,

                        fontSize: fontSize(12),

                        fontFamily: fontFamily.poppins400,
                      }}>
                      +{remainingCount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,

        backgroundColor: colors.white,
      }}>
      {/* HEADER */}
      <View
        style={{
          width: '100%',

          height: hp(60),

          justifyContent: 'center',

          alignItems: 'center',
        }}>
        <Text
          style={{
            color: colors.pureBlack,

            fontSize: fontSize(14),

            fontFamily: fontFamily.poppins500,
          }}>
          Saved Listing
        </Text>
      </View>

      {/* SHIMMER LOADER */}
      {loading ? (
        <FlatList
          data={[1, 2, 3, 4]}
          keyExtractor={(item, index) => index.toString()}
          renderItem={() => renderShimmerItem()}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={savedVendors}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: hp(30),

            paddingTop: hp(10),
          }}
          onEndReached={() => {
            loadMoreData();
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() =>
            paginationLoading ? (
              <ActivityIndicator
                size="small"
                color="#7148E4"
                style={{
                  marginVertical: hp(20),
                }}
              />
            ) : null
          }
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,

                justifyContent: 'center',

                alignItems: 'center',

                marginTop: hp(250),
              }}>
              <Image
                source={icons.black_heart_icon}
                style={{
                  width: hp(50),

                  height: hp(50),

                  resizeMode: 'contain',

                  tintColor: '#CFCFCF',
                }}
              />

              <Text
                style={{
                  color: '#999',

                  marginTop: hp(15),

                  fontSize: fontSize(15),

                  fontFamily: fontFamily.poppins500,
                }}>
                No Saved Vendors
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default VendorSavedScreen;
