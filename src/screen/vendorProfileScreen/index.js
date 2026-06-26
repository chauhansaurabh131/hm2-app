import React, {useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import {useDispatch, useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useNavigation} from '@react-navigation/native';

import {addProfilePicture, updateDetails} from '../../actions/homeActions';
import ImagePicker from 'react-native-image-crop-picker';
import RNBlobUtil from 'react-native-blob-util';
import VendorAddMediaImageComponent from '../../components/vendorAddMediaImageComponent';

const VendorProfileScreen = () => {
  const {user} = useSelector(state => state.auth);

  // console.log(' === user------ ===> ', user?.user);

  const navigation = useNavigation();
  const apiDispatch = useDispatch();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const refProfileSheet = useRef();

  const socialData = user?.user?.vendorData?.[0]?.social || [];

  const services = user?.user?.vendorData?.[0]?.servicesProvided || [];

  const hasProfileImage =
    user?.user?.profilePic &&
    user?.user?.profilePic !== 'null' &&
    user?.user?.profilePic.trim() !== '';

  const capitalizeWords = text => {
    if (!text) {
      return '';
    }

    return text
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatServiceName = service => {
    return service
      ?.split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatBusinessType = value => {
    if (!value) {
      return '';
    }

    return value
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const openGallery = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 600,
        height: 800,
        cropping: true,
        compressImageQuality: 0.8,
        mediaType: 'photo',
      });

      uploadProfileImage(image);
    } catch (error) {
      console.log('Gallery Cancelled', error);
    }
  };

  const uploadProfileImage = async image => {
    try {
      setLoading(true);

      const imagePath = image.path;

      const imageNameKey = imagePath.split('/').pop();
      const baseName = imageNameKey.replace(/\.[^/.]+$/, '');
      const imageName = `${baseName}.jpg`;

      const getContentType = ext => {
        switch (ext) {
          case 'png':
            return 'image/png';
          case 'jpg':
          case 'jpeg':
            return 'image/jpeg';
          case 'webp':
            return 'image/webp';
          default:
            return 'image/jpeg';
        }
      };

      const contentType = getContentType('jpg');

      dispatch(
        addProfilePicture(
          {
            key: imageName,
            contentType,
            isProfilePic: true,
            profileType: 'profileImage',
          },
          async response => {
            try {
              const presignedUrl = response?.data?.data?.url;

              await RNBlobUtil.fetch(
                'PUT',
                presignedUrl,
                {
                  'Content-Type': contentType,
                  'x-amz-acl': 'public-read',
                },
                RNBlobUtil.wrap(imagePath),
              );

              const imageUrl = presignedUrl.split('?')[0];

              apiDispatch(
                updateDetails(
                  {
                    profilePic: imageUrl,
                  },
                  () => {
                    console.log('Profile Updated');
                    refProfileSheet.current?.close();
                    setLoading(false);
                  },
                ),
              );
            } catch (error) {
              console.log('Upload Error =>', error);
              setLoading(false);
            }
          },
        ),
      );
    } catch (error) {
      console.log('Upload Failed =>', error);
      setLoading(false);
    }
  };

  const removeProfilePhoto = () => {
    refProfileSheet.current?.close();

    apiDispatch(
      updateDetails(
        {
          profilePic: '',
        },
        () => {
          console.log('Profile photo removed');
        },
      ),
    );
  };

  const openLink = async url => {
    try {
      let finalUrl = url;

      // WhatsApp number support
      if (!url.startsWith('http') && /^\+?\d+$/.test(url.replace(/\s/g, ''))) {
        finalUrl = `https://wa.me/${url.replace(/\D/g, '')}`;
      }

      const supported = await Linking.canOpenURL(finalUrl);

      if (supported) {
        await Linking.openURL(finalUrl);
      } else {
        Alert.alert('Error', 'Unable to open link');
      }
    } catch (error) {
      console.log('Open Link Error =>', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            width: '100%',
            height: hp(77),
            backgroundColor: '#7148E4',
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('VendorAccountSettingScreen');
            }}
            style={{
              position: 'absolute',
              right: 0,
              width: hp(60),
              height: hp(55),
              alignItems: 'center',
            }}>
            <Image
              source={icons.white_Setting_Icon}
              style={{
                width: hp(20),
                height: hp(20),
                resizeMode: 'contain',
                tintColor: 'white',
                top: 15,
              }}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => {
            if (loading) {
              return;
            }

            if (hasProfileImage) {
              refProfileSheet.current?.open();
            } else {
              openGallery();
            }
          }}
          style={{
            alignSelf: 'center',
            top: hp(-55),
            borderRadius: hp(50),
          }}>
          {loading ? (
            <View
              style={{
                width: hp(100),
                height: hp(100),
                borderRadius: hp(50),
                backgroundColor: '#F9F6FF',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: hp(3),
                borderColor: 'white',
              }}>
              <ActivityIndicator size="large" color="#7148E4" />
            </View>
          ) : hasProfileImage ? (
            <Image
              source={{uri: user?.user?.profilePic}}
              style={{
                width: hp(100),
                height: hp(100),
                borderRadius: hp(50),
                resizeMode: 'cover',
              }}
            />
          ) : (
            <View
              style={{
                width: hp(100),
                height: hp(100),
                backgroundColor: '#F9F6FF',
                borderRadius: hp(50),
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: hp(3),
                borderColor: 'white',
              }}>
              <Image
                source={icons.box_image_Icon}
                style={{width: hp(25), height: hp(25)}}
              />

              <Text
                style={{
                  color: '#7148E43D',
                  marginTop: hp(5),
                  fontSize: fontSize(10),
                  fontFamily: fontFamily.poppins600,
                }}>
                Add Profile
              </Text>
            </View>
          )}

          {!loading && (
            <View style={{position: 'absolute', right: 5, bottom: 0}}>
              <View
                style={{
                  width: hp(28),
                  height: hp(27),
                  borderRadius: hp(50),
                  backgroundColor: '#7148E4',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={icons.vendor_camera_Icon}
                  style={{
                    width: hp(10),
                    height: hp(10),
                    resizeMode: 'contain',
                  }}
                />
              </View>
            </View>
          )}
        </TouchableOpacity>

        <View
          style={{
            // backgroundColor: 'orange',
            marginTop: hp(-30),
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(22),
              fontFamily: fontFamily.poppins600,
            }}>
            {capitalizeWords(user?.user?.vendorData?.[0]?.businessName)}
          </Text>

          <View
            style={{
              backgroundColor: '#F9F6FF',
              paddingHorizontal: hp(20),
              borderRadius: hp(50),
              paddingVertical: hp(3),
              marginTop: hp(5),
            }}>
            <Text
              style={{
                color: '#7148E4',
                fontSize: fontSize(12),
                fontFamily: fontFamily.poppins400,
              }}>
              {formatBusinessType(user?.user?.vendorData?.[0]?.businessType)}
            </Text>
          </View>

          <View
            style={{
              marginHorizontal: wp(20),
              marginTop: hp(20),
            }}>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
                alignSelf: 'center',
                textAlign: 'center',
              }}>
              {capitalizeWords(user?.user?.address?.currentResidenceAddress)},{' '}
              {capitalizeWords(user?.user?.address?.area)},{' '}
              {capitalizeWords(user?.user?.address?.currentCity)},{' '}
              {capitalizeWords(user?.user?.address?.currentState)},{' '}
              {capitalizeWords(user?.user?.address?.currentCountry)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => {
            navigation.navigate('VendorModifyDetailScreen');
          }}
          style={{
            height: hp(44),
            marginTop: hp(22),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: '#7148E4',
              fontSize: fontSize(13),
              fontFamily: fontFamily.poppins500,
            }}>
            Edit Details
          </Text>
        </TouchableOpacity>

        <View
          style={{width: '100%', height: hp(1), backgroundColor: '#D1D1D1'}}
        />

        <View
          style={{
            marginTop: hp(17),
            marginHorizontal: wp(18),
            // backgroundColor: 'orange',
          }}>
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins500,
            }}>
            Social Media Links
          </Text>

          {socialData.length === 0 ? (
            <TouchableOpacity
              onPress={() => navigation.navigate('VendorSocialMediaLinkScreen')}
              activeOpacity={0.6}
              style={{
                height: hp(76),
                backgroundColor: '#F9F6FF',
                marginTop: hp(20),
                borderRadius: hp(14),
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  color: '#AB8FFB',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins500,
                }}>
                Add Links
              </Text>

              <Image
                source={icons.vendor_Link_Icon}
                style={{
                  width: hp(20),
                  height: hp(13),
                  resizeMode: 'contain',
                  marginLeft: wp(10),
                }}
              />
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() =>
                  navigation.navigate('VendorSocialMediaLinkScreen')
                }
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: hp(20),
                  paddingHorizontal: wp(2),
                }}>
                {socialData.map((item, index) => {
                  const iconSource =
                    item.platform === 'instagram'
                      ? icons.instagram_icon
                      : item.platform === 'youtube'
                      ? icons.youtube_icon
                      : item.platform === 'facebook'
                      ? icons.facebookLogo
                      : item.platform === 'twitter'
                      ? icons.twitter_Icon
                      : item.platform === 'whatsapp'
                      ? icons.whatsapp_icon
                      : item.platform === 'website'
                      ? icons.internetLogo
                      : icons.vendor_Link_Icon;

                  return (
                    <TouchableOpacity
                      key={item._id || index}
                      activeOpacity={0.6}
                      onPress={() => openLink(item.url)}
                      style={{
                        width: '16.66%', // 6 items per row
                        alignItems: 'center',
                        marginBottom: hp(12),
                      }}>
                      <View
                        style={{
                          width: hp(44),
                          height: hp(44),
                          borderRadius: hp(50),
                          backgroundColor: '#F9F6FF',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Image
                          source={iconSource}
                          style={{
                            width: hp(20),
                            height: hp(20),
                            resizeMode: 'contain',
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() =>
                  navigation.navigate('VendorSocialMediaLinkScreen')
                }
                style={{
                  height: hp(44),
                  marginTop: hp(15),
                  alignItems: 'center',
                  justifyContent: 'center',
                  // backgroundColor: 'red',
                }}>
                <Text
                  style={{
                    color: '#7148E4',
                    fontSize: fontSize(13),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  Add More Link
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {socialData.length === 0 ? (
          <View
            style={{
              width: '100%',
              height: hp(1),
              backgroundColor: '#D1D1D1',
              marginTop: hp(23),
            }}
          />
        ) : (
          <View
            style={{
              width: '100%',
              height: hp(1),
              backgroundColor: '#D1D1D1',
              marginTop: hp(0),
            }}
          />
        )}

        <View style={{marginHorizontal: wp(17), marginTop: hp(22)}}>
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
              marginTop: hp(18),
            }}>
            {services.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: '#F9F6FF',
                  borderRadius: hp(30),
                  paddingHorizontal: wp(16),
                  height: hp(40),
                  marginRight: wp(12),
                  marginBottom: hp(12),
                }}>
                <Image
                  source={icons.wedding_Studio_icon} // your service icon
                  style={{
                    width: hp(16),
                    height: hp(16),
                    resizeMode: 'contain',
                    // tintColor: '#8B6AE8',
                    tintColor: 'black',
                  }}
                />

                <Text
                  style={{
                    marginLeft: wp(10),
                    color: colors.pureBlack,
                    fontSize: fontSize(12),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  {formatServiceName(item)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.navigate('VendorModifyServicesScreen')}
          style={{
            height: hp(44),
            marginTop: hp(15),
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'red',
          }}>
          <Text
            style={{
              color: '#7148E4',
              fontSize: fontSize(13),
              fontFamily: fontFamily.poppins500,
            }}>
            Edit Services
          </Text>
        </TouchableOpacity>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#D1D1D1',
            // marginTop: hp(23),
          }}
        />

        <VendorAddMediaImageComponent />

        <RBSheet
          ref={refProfileSheet}
          closeOnDragDown
          closeOnPressMask
          height={hp(200)}
          customStyles={{
            wrapper: {
              backgroundColor: 'rgba(0,0,0,0.5)',
            },
            draggableIcon: {
              backgroundColor: '#D9D9D9',
            },
            container: {
              borderTopLeftRadius: hp(25),
              borderTopRightRadius: hp(25),
              // paddingHorizontal: hp(20),
            },
          }}>
          <Text
            style={{
              fontSize: fontSize(18),
              fontFamily: fontFamily.poppins600,
              color: colors.pureBlack,
              marginTop: hp(10),
              textAlign: 'center',
            }}>
            Profile Photo
          </Text>

          <View
            style={{
              width: '100%',
              height: hp(1),
              backgroundColor: '#E9E9E9',
              marginTop: hp(15),
            }}
          />

          <TouchableOpacity
            on
            activeOpacity={0.7}
            style={{
              height: hp(55),
              justifyContent: 'center',
              marginTop: hp(10),
              paddingHorizontal: hp(20),
            }}
            onPress={() => {
              refProfileSheet.current.close();

              navigation.navigate('VendorImageViewScreen', {
                imageUrl: user?.user?.profilePic,
              });
            }}>
            <Text
              style={{
                fontSize: fontSize(15),
                color: colors.pureBlack,
                fontFamily: fontFamily.poppins500,
              }}>
              View Photo
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              // height: hp(55),
              justifyContent: 'center',
              paddingHorizontal: hp(20),
            }}
            onPress={removeProfilePhoto}>
            <Text
              style={{
                fontSize: fontSize(15),
                color: colors.pureBlack,
                fontFamily: fontFamily.poppins500,
              }}>
              Remove Photo
            </Text>
          </TouchableOpacity>
        </RBSheet>

        <View style={{height: hp(50)}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default VendorProfileScreen;
