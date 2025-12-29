import React from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import ServicesRecentlyComponent from '../../components/servicesRecentlyComponent';

const ServicesProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View
        style={{
          width: '100%',
          height: hp(70),
          justifyContent: 'center',
          paddingHorizontal: 22,
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={{
              width: hp(24),
              height: hp(24),
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => {
              navigation.goBack();
            }}>
            <Image
              source={icons.back_arrow_icon}
              style={{width: hp(14), height: hp(14)}}
            />
          </TouchableOpacity>

          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins500,
              top: 2,
            }}>
            Chandra Studio
          </Text>

          <TouchableOpacity style={{top: 3}}>
            <Image
              source={icons.black_heart_icon}
              style={{width: hp(20), height: hp(18)}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={images.photo_studio_background_img}
          style={{width: '100%', height: hp(375)}}
        />

        <View style={{alignItems: 'center', top: -50}}>
          <Image
            source={images.photo_studio_img}
            style={{width: hp(100), height: hp(100)}}
          />
        </View>

        <View style={{marginTop: -20}}>
          <Text
            style={{
              textAlign: 'center',
              color: colors.pureBlack,
              fontSize: fontSize(22),
              fontFamily: fontFamily.poppins600,
            }}>
            Chandra Studio
          </Text>

          <Text
            style={{
              color: colors.pureBlack,
              textAlign: 'center',
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
              // marginHorizontal: 17,
              marginTop: hp(5),
            }}>
            304, Doubledaker, Sector 24, Gandhinagar,{'\n'}Gujarat 382024, India
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: hp(23),
          }}>
          <TouchableOpacity
            style={{
              width: hp(44),
              height: hp(44),
              borderRadius: 50,
              backgroundColor: '#F9F6FF',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: hp(19),
            }}
            activeOpacity={0.6}>
            <Image
              source={icons.purple_phone_icon}
              style={{width: hp(20), height: hp(20), resizeMode: 'contain'}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: hp(44),
              height: hp(44),
              borderRadius: 50,
              backgroundColor: '#F9F6FF',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: hp(19),
            }}
            activeOpacity={0.6}>
            <Image
              source={icons.instagram_icon}
              style={{width: hp(20), height: hp(20), resizeMode: 'contain'}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: hp(44),
              height: hp(44),
              borderRadius: 50,
              backgroundColor: '#F9F6FF',
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: hp(19),
            }}
            activeOpacity={0.6}>
            <Image
              source={icons.youtube_icon}
              style={{width: hp(30), height: hp(21), resizeMode: 'contain'}}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: hp(44),
              height: hp(44),
              borderRadius: 50,
              backgroundColor: '#F9F6FF',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={0.6}>
            <Image
              source={icons.whatsapp_icon}
              style={{width: hp(20), height: hp(20), resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>

        <View style={{marginTop: hp(35), marginHorizontal: hp(15)}}>
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins500,
            }}>
            Our Services
          </Text>

          <View style={{flexDirection: 'row', marginTop: hp(23)}}>
            <View
              style={{
                width: hp(145),
                height: hp(33),
                backgroundColor: '#F9F6FF',
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginRight: 13,
              }}>
              <Image
                source={icons.wedding_Studio_icon}
                style={{
                  width: hp(16),
                  height: hp(16),
                  resizeMode: 'contain',
                  marginRight: wp(10),
                }}
              />
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(12),
                  fontFamily: fontFamily.poppins400,
                }}>
                Birthday Shoot
              </Text>
            </View>

            <View
              style={{
                width: hp(88),
                height: hp(33),
                backgroundColor: '#F9F6FF',
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Image
                source={icons.wedding_Studio_icon}
                style={{
                  width: hp(16),
                  height: hp(16),
                  resizeMode: 'contain',
                  marginRight: wp(10),
                }}
              />
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(12),
                  fontFamily: fontFamily.poppins400,
                }}>
                Events
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: hp(10)}}>
            <View
              style={{
                width: hp(120),
                height: hp(33),
                backgroundColor: '#F9F6FF',
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginRight: 13,
              }}>
              <Image
                source={icons.wedding_Studio_icon}
                style={{
                  width: hp(16),
                  height: hp(16),
                  resizeMode: 'contain',
                  marginRight: wp(10),
                }}
              />
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(12),
                  fontFamily: fontFamily.poppins400,
                }}>
                Modelling
              </Text>
            </View>

            <View
              style={{
                width: hp(145),
                height: hp(33),
                backgroundColor: '#F9F6FF',
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
              }}>
              <Image
                source={icons.wedding_Studio_icon}
                style={{
                  width: hp(16),
                  height: hp(16),
                  resizeMode: 'contain',
                  marginRight: wp(10),
                }}
              />
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(12),
                  fontFamily: fontFamily.poppins400,
                }}>
                Wedding Shoot
              </Text>
            </View>
          </View>

          <View style={{flexDirection: 'row', marginTop: hp(10)}}>
            <View
              style={{
                width: hp(145),
                height: hp(33),
                backgroundColor: '#F9F6FF',
                borderRadius: 50,
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'row',
                marginRight: 13,
              }}>
              <Image
                source={icons.wedding_Studio_icon}
                style={{
                  width: hp(16),
                  height: hp(16),
                  resizeMode: 'contain',
                  marginRight: wp(10),
                }}
              />
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(12),
                  fontFamily: fontFamily.poppins400,
                }}>
                Outdoor Shoot
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            width: '100%',
            height: 4,
            backgroundColor: '#F7F7F7',
            marginTop: hp(31),
          }}
        />

        <ServicesRecentlyComponent labelHeading={'More Similars'} />

        <View style={{height: 30}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServicesProfileScreen;
