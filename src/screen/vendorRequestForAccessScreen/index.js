import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';

const VendorRequestForAccessScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const {vendorData, vendorId, location, category, previousScreen} =
    route.params || {};

  console.log(' === var ===> ', vendorData?.address?.pinCode);

  const profileImage =
    vendorData?.userProfilePic?.find(item => item?.isDeleted === false)?.url ||
    vendorData?.userProfilePic?.[0]?.url;

  const capitalizeWords = text => {
    if (!text) {
      return '';
    }

    return text
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* Header */}
      <View
        style={{
          height: hp(54),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: 0,
            width: wp(50),
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{
              width: hp(14),
              height: hp(14),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins600,
          }}>
          Request for Access
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Vendor Card */}
        <View
          style={{
            marginHorizontal: wp(17),
            backgroundColor: '#FBF9FF',
            borderRadius: hp(18),
            paddingVertical: hp(25),
            alignItems: 'center',
          }}>
          {profileImage ? (
            <Image
              source={{uri: profileImage}}
              style={{
                width: hp(84),
                height: hp(84),
                borderRadius: hp(42),
                resizeMode: 'cover',
              }}
            />
          ) : (
            <View
              style={{
                width: hp(84),
                height: hp(84),
                borderRadius: hp(42),
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
                  ?.map(word => word?.charAt(0))
                  ?.join('')
                  ?.slice(0, 2) || 'U'}
              </Text>
            </View>
          )}

          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(18),
              fontFamily: fontFamily.poppins600,
              marginTop: hp(15),
            }}>
            {vendorData?.name || 'Business Name'}
          </Text>
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(13),
              fontFamily: fontFamily.poppins400,
              textAlign: 'center',
              marginTop: hp(12),
              paddingHorizontal: wp(9),
            }}>
            {`${capitalizeWords(
              vendorData?.address?.currentResidenceAddress,
            )}, ${capitalizeWords(
              vendorData?.address?.area,
            )}, ${capitalizeWords(
              vendorData?.address?.currentCity,
            )}, ${capitalizeWords(vendorData?.address?.currentState)} ${
              vendorData?.address?.pinCode || ''
            }`}
          </Text>
        </View>

        <View style={{marginHorizontal: wp(18), marginTop: hp(18)}}>
          <Text
            style={{
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins600,
              color: colors.pureBlack,
            }}>
            Is this your business?
          </Text>

          <Text
            style={{
              color: '#6A6A6A',
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
              marginTop: hp(11),
            }}>
            Claim this listing to manage your profile and{'\n'}receive customer
            enquiries.
          </Text>

          <View
            style={{
              width: '100%',
              height: hp(1),
              backgroundColor: '#DCDCDC',
              marginVertical: hp(23),
            }}
          />

          <Text
            style={{
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins600,
              color: colors.pureBlack,
            }}>
            Why claim your business?
          </Text>

          <View style={{paddingHorizontal: wp(10), marginTop: hp(12)}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View
                style={{
                  width: hp(5),
                  height: hp(5),
                  backgroundColor: '#6A6A6A',
                  borderRadius: hp(50),
                  marginRight: wp(10),
                }}
              />
              <Text
                style={{
                  color: '#6A6A6A',
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins400,
                }}>
                Edit your business information
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(5),
              }}>
              <View
                style={{
                  width: hp(5),
                  height: hp(5),
                  backgroundColor: '#6A6A6A',
                  borderRadius: hp(50),
                  marginRight: wp(10),
                }}
              />
              <Text
                style={{
                  color: '#6A6A6A',
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins400,
                }}>
                Update photos, services, and pricing
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(5),
              }}>
              <View
                style={{
                  width: hp(5),
                  height: hp(5),
                  backgroundColor: '#6A6A6A',
                  borderRadius: hp(50),
                  marginRight: wp(10),
                }}
              />
              <Text
                style={{
                  color: '#6A6A6A',
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins400,
                }}>
                Receive customer enquiries
              </Text>
            </View>

            {/*<View*/}
            {/*  style={{*/}
            {/*    flexDirection: 'row',*/}
            {/*    alignItems: 'center',*/}
            {/*    marginTop: hp(5),*/}
            {/*  }}>*/}
            {/*  <View*/}
            {/*    style={{*/}
            {/*      width: hp(5),*/}
            {/*      height: hp(5),*/}
            {/*      backgroundColor: '#6A6A6A',*/}
            {/*      borderRadius: hp(50),*/}
            {/*      marginRight: wp(10),*/}
            {/*    }}*/}
            {/*  />*/}
            {/*  <Text*/}
            {/*    style={{*/}
            {/*      color: '#6A6A6A',*/}
            {/*      fontSize: fontSize(14),*/}
            {/*      fontFamily: fontFamily.poppins400,*/}
            {/*    }}>*/}
            {/*    Respond to reviews (if available)*/}
            {/*  </Text>*/}
            {/*</View>*/}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(5),
              }}>
              <View
                style={{
                  width: hp(5),
                  height: hp(5),
                  backgroundColor: '#6A6A6A',
                  borderRadius: hp(50),
                  marginRight: wp(10),
                }}
              />
              <Text
                style={{
                  color: '#6A6A6A',
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins400,
                }}>
                Keep your profile accurate and up to date
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(5),
              }}>
              <View
                style={{
                  width: hp(5),
                  height: hp(5),
                  backgroundColor: '#6A6A6A',
                  borderRadius: hp(50),
                  marginRight: wp(10),
                  top: hp(-10),
                }}
              />
              <Text
                style={{
                  color: '#6A6A6A',
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins400,
                }}>
                Build trust with a verified business badge (if{'\n'}eligible)
              </Text>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              height: hp(1),
              backgroundColor: '#DCDCDC',
              marginVertical: hp(23),
            }}
          />

          <Text
            style={{
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins600,
              color: colors.pureBlack,
            }}>
            Hapmeet Verifies
          </Text>

          <Text
            style={{
              color: '#6A6A6A',
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
              marginTop: hp(11),
            }}>
            Hapmeet verifies ownership before granting{'\n'}editing rights.
          </Text>

          <View
            style={{
              width: '100%',
              height: hp(1),
              backgroundColor: '#DCDCDC',
              marginVertical: hp(23),
            }}
          />

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('VendorClaimYourBusinessScreen', {
                vendorData,
                vendorId,
                location,
                category,
                previousScreen,
              });
            }}
            activeOpacity={0.6}
            style={{
              height: hp(50),
              width: '100%',
              backgroundColor: '#7045EB',
              borderRadius: hp(100),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins500,
              }}>
              Request for Access
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{height: hp(50)}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorRequestForAccessScreen;
