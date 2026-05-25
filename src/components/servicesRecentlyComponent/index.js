import React, {useCallback, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

import {colors} from '../../utils/colors';

import {useFocusEffect, useNavigation} from '@react-navigation/native';

import {useSelector} from 'react-redux';
import {BASE_URL} from '../../utils/constants';
import {icons} from '../../assets';

const ServicesRecentlyComponent = ({labelHeading}) => {
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);

  const accessToken = user?.tokens?.access?.token;

  const userId = user?.user?.id;

  const [recentData, setRecentData] = useState([]);

  const [loading, setLoading] = useState(false);

  // =====================================
  // API CALL
  // =====================================

  const getRecentlyViewedVendors = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${BASE_URL}/api/v1/user/profile-viewer/get-vendor-profile-viewer/${userId}`,
        {
          method: 'GET',

          headers: {
            Authorization: `Bearer ${accessToken}`,

            'Content-Type': 'application/json',
          },
        },
      );

      const result = await response.json();

      // console.log('RECENTLY VIEWED ===>', result);

      setRecentData(result?.data || []);
    } catch (error) {
      console.log('RECENT API ERROR ===>', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getRecentlyViewedVendors();
    }, []),
  );

  // USER NOT LOGIN
  if (!user) {
    return null;
  }

  // =====================================
  // RENDER ITEM
  // =====================================

  const renderItem = ({item}) => {
    // console.log(' === vendor ===> ', item?.viewerId?.profilePic);

    const vendor = item?.vendorId;

    return (
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => {
          navigation.navigate('ServicesProfileScreen', {
            vendorId: vendor?._id,
            previousScreen: 'ServiceHomeScreen',
          });
        }}
        style={{
          marginRight: wp(15),
        }}>
        <View
          style={{
            borderWidth: 1,
            borderRadius: 15,
            borderColor: '#EFEFEF',
            width: hp(248),
            backgroundColor: '#FFF',
          }}>
          {/* IMAGE */}

          {item?.viewerId?.profilePic ? (
            <Image
              source={{
                uri: item?.viewerId?.profilePic,
              }}
              style={{
                width: hp(246),
                height: hp(245),
                borderRadius: hp(15),
              }}
            />
          ) : (
            <View
              style={{
                width: hp(246),
                height: hp(245),
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

          {/* DETAILS */}
          <View
            style={{
              marginTop: hp(16),
              alignItems: 'center',
              marginBottom: hp(17),
              paddingHorizontal: wp(10),
            }}>
            {/* NAME */}
            <Text
              numberOfLines={1}
              style={{
                fontSize: fontSize(14),

                fontFamily: fontFamily.poppins600,

                color: colors.pureBlack,
              }}>
              {item?.viewerId?.name || 'NA'}
            </Text>

            {/* LOCATION */}
            <Text
              numberOfLines={1}
              style={{
                color: '#9C9C9C',

                fontSize: fontSize(12),

                fontFamily: fontFamily.poppins400,

                marginTop: hp(2),
              }}>
              {item?.viewerId?.address?.currentResidenceAddress ||
              item?.viewerId?.address?.area ||
              item?.viewerId?.address?.currentCity ||
              item?.viewerId?.address?.currentState
                ? `${
                    item?.viewerId?.address?.currentResidenceAddress || 'NA'
                  }, ${item?.viewerId?.address?.area || 'NA'}, ${
                    item?.viewerId?.address?.currentCity || 'NA'
                  }, ${item?.viewerId?.address?.currentState || 'NA'}`
                : 'NA'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView>
      {/* HEADING */}
      <Text
        style={{
          marginTop: hp(27),

          color: colors.pureBlack,

          marginHorizontal: 17,

          fontSize: fontSize(14),

          fontFamily: fontFamily.poppins600,

          marginBottom: hp(26),
        }}>
        {labelHeading}
      </Text>

      {/* LOADER */}
      {loading ? (
        <View
          style={{
            height: hp(250),

            justifyContent: 'center',

            alignItems: 'center',
          }}>
          <ActivityIndicator size="large" color="#7148E4" />
        </View>
      ) : (
        <FlatList
          data={recentData}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: wp(15),
          }}
          ListEmptyComponent={() => (
            <View
              style={{
                width: wp(100),

                justifyContent: 'center',

                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: '#999',

                  fontSize: fontSize(13),

                  fontFamily: fontFamily.poppins400,
                }}>
                No Data Found
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default ServicesRecentlyComponent;
