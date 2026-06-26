import React, {useEffect, useRef, useState} from 'react';

import {
  Animated,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

import {colors} from '../../utils/colors';

import {icons} from '../../assets';

import {useNavigation} from '@react-navigation/native';

import style from './style';

import {useSelector} from 'react-redux';
import ServiceHomeScreen from '../../screen/serviceHomeScreen';
import {BASE_URL} from '../../utils/constants';

const CARD_WIDTH = wp(365);

const ServicesFeaturedComponent = () => {
  const [index, setIndex] = useState(0);

  const translateX = useRef(new Animated.Value(0)).current;

  const [featuredData, setFeaturedData] = useState([]);

  const [loading, setLoading] = useState(false);

  const {user} = useSelector(state => state.auth);

  const accessToken = user?.tokens?.access?.token;

  const navigation = useNavigation();

  // =====================================
  // API CALL
  // =====================================

  useEffect(() => {
    getFeaturedVendors();
  }, []);

  const getFeaturedVendors = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/api/v1/user/user/vendors?page=1`,
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${accessToken}`,

            'Content-Type': 'application/json',
          },
        },
      );

      const result = await response.json();

      // console.log('FEATURED API ===>', result);

      setFeaturedData(result?.data || []);
    } catch (error) {
      console.log('FEATURED ERROR ===>', error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // AUTO SLIDER
  // =====================================

  useEffect(() => {
    if (featuredData.length === 0) {
      return;
    }

    const timer = setInterval(() => {
      // START FROM RIGHT
      translateX.setValue(CARD_WIDTH);

      setIndex(prev => {
        const next = (prev + 1) % featuredData.length;

        return next;
      });
    }, 4000);

    return () => clearInterval(timer);
  }, [translateX, featuredData]);

  // =====================================
  // ANIMATION
  // =====================================

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: 0,

      duration: 400,

      useNativeDriver: true,
    }).start();
  }, [index, translateX]);

  const item = featuredData[index];

  // =====================================
  // SERVICES
  // =====================================

  const services = item?.vendorData?.[0]?.servicesProvided || [];

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
    <SafeAreaView style={style.container}>
      {/* HEADING */}
      <Text style={style.featuredHeadingText}>Latest Joined</Text>

      {/* LOADER */}
      {loading ? (
        <View
          style={{
            width: '100%',
            height: hp(300),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="#7148E4" />
        </View>
      ) : featuredData.length === 0 ? (
        <View
          style={{
            width: '100%',
            height: hp(300),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: colors.pureBlack,
            }}>
            No Data Found
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          style={style.featuredBodyContainer}
          activeOpacity={0.6}
          onPress={() => {
            navigation.navigate('ServicesProfileScreen', {
              vendorId: item?._id,
              previousScreen: 'ServiceHomeScreen',
            });
          }}>
          <Animated.View
            style={{
              width: CARD_WIDTH,

              transform: [
                {
                  translateX,
                },
              ],
            }}>
            <View style={style.animatedContainer}>
              {/* BG IMAGE */}

              {item?.userProfilePic?.[0]?.url ? (
                <Image
                  source={{
                    uri: item?.userProfilePic?.[0]?.url,
                  }}
                  style={{
                    width: '100%',
                    height: hp(167),
                    borderBottomRightRadius: 15,
                    borderBottomLeftRadius: 15,
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
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
                    borderBottomRightRadius: 15,
                    borderBottomLeftRadius: 15,
                    borderTopRightRadius: 15,
                    borderTopLeftRadius: 15,
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

              {/* PROFILE IMAGE */}
              <View
                style={{
                  top: -25,
                  marginLeft: wp(17),
                }}>
                {item?.profilePic ? (
                  <Image
                    source={{
                      uri: item?.profilePic,
                    }}
                    style={{
                      width: hp(50),
                      height: hp(50),
                      borderRadius: hp(50),
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
                      {item?.name
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
                  marginTop: hp(-10),
                }}>
                {/* NAME */}
                <Text
                  style={{
                    color: colors.pureBlack,

                    fontSize: fontSize(18),

                    fontFamily: fontFamily.poppins600,
                  }}>
                  {item?.name || 'NA'}
                </Text>

                {/* ADDRESS */}
                <Text
                  style={{
                    color: '#6E6E6E',

                    marginTop: hp(4),

                    fontSize: fontSize(11),

                    fontFamily: fontFamily.poppins400,
                  }}>
                  {item?.address?.currentResidenceAddress ||
                  item?.address?.area ||
                  item?.address?.currentCity ||
                  item?.address?.currentState
                    ? `${item?.address?.currentResidenceAddress || 'NA'}, ${
                        item?.address?.area || 'NA'
                      }, ${item?.address?.currentCity || 'NA'}, ${
                        item?.address?.currentState || 'NA'
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
          </Animated.View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default ServicesFeaturedComponent;
