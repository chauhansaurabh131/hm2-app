import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../actions/homeActions';

const validateSocialLinks = links => {
  const patterns = {
    Website: /^https?:\/\/.+/i,
    Facebook: /facebook\.com/i,
    Whatsapp: /^(\+?\d{10,15}|https?:\/\/(wa\.me|whatsapp\.com).+)$/i,
    Instagram: /instagram\.com/i,
    Twitter: /(twitter\.com|x\.com)/i,
    Youtube: /(youtube\.com|youtu\.be)/i,
  };

  for (const item of links) {
    if (!item.media) {
      Alert.alert('Validation', 'Please select media type');
      return false;
    }

    if (!item.url?.trim()) {
      Alert.alert('Validation', `Please enter ${item.media} URL`);
      return false;
    }

    const regex = patterns[item.media];

    if (regex && !regex.test(item.url)) {
      Alert.alert('Invalid URL', `Please enter a valid ${item.media} URL`);
      return false;
    }
  }

  return true;
};

const VendorSocialMediaLinkScreen = () => {
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const {user} = useSelector(state => state.auth);

  console.log(' === var ===> ', user?.user?.vendorData[0]?.social);

  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedIndex, setSelectedIndex] = useState(null);

  const [socialLinks, setSocialLinks] = useState([]);

  const refMediaSheet = useRef();

  useEffect(() => {
    const socialData = user?.user?.vendorData?.[0]?.social || [];

    if (socialData.length > 0) {
      const formattedData = socialData.map(item => ({
        id: item._id || Date.now() + Math.random(),
        media:
          item.platform?.charAt(0).toUpperCase() +
          item.platform?.slice(1).toLowerCase(),
        url: item.url || '',
      }));

      setSocialLinks(formattedData);
    } else {
      setSocialLinks([
        {
          id: Date.now(),
          media: '',
          url: '',
        },
      ]);
    }
  }, [user]);

  const mediaOptions = [
    'Website',
    'Facebook',
    'Whatsapp',
    'Instagram',
    'Twitter',
    'Youtube',
  ];

  useEffect(() => {
    const showListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const hideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  const onSavePress = () => {
    const isValid = validateSocialLinks(socialLinks);

    if (!isValid) {
      return;
    }

    setLoading(true);

    const vendor = {...user?.user?.vendorData?.[0]};
    delete vendor._id;

    const formattedSocialLinks = socialLinks.map(item => ({
      platform: item.media.toLowerCase(),
      url:
        item.media === 'Whatsapp' && !item.url.includes('wa.me')
          ? `https://wa.me/${item.url.replace(/\D/g, '')}`
          : item.url,
    }));

    const payload = {
      vendorData: [
        {
          ...vendor,
          social: formattedSocialLinks,
        },
      ],
    };

    apiDispatch(
      updateDetails(
        payload,
        () => {
          setLoading(false);
          navigation.goBack();
        },
        error => {
          setLoading(false);
          console.log('Update Failed =>', error);
        },
      ),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* 🔥 HEADER */}
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
          Social Media Links
        </Text>

        <TouchableOpacity
          onPress={() => {
            setSocialLinks(prev => [
              ...prev,
              {
                id: Date.now(),
                media: '',
                url: '',
              },
            ]);
          }}
          style={{
            position: 'absolute',
            right: 0,
            width: wp(50),
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.add_image_icon}
            style={{
              width: hp(18),
              height: hp(18),
              resizeMode: 'contain',
              tintColor: 'black',
            }}
          />
        </TouchableOpacity>
      </View>

      {/* 🔥 DIVIDER */}
      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#EDEDED',
        }}
      />
      <ScrollView
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        showsVerticalScrollIndicator={false}>
        <View style={{marginHorizontal: wp(17), marginTop: hp(12)}}>
          {socialLinks.map((item, index) => (
            <View
              key={`${item.id}`}
              style={{
                width: '100%',
                backgroundColor: '#FAF9FF',
                borderRadius: hp(14),
                marginBottom: hp(12),
              }}>
              {socialLinks.length > 1 && (
                <TouchableOpacity
                  onPress={() => {
                    setSocialLinks(prev =>
                      prev.filter(link => link.id !== item.id),
                    );
                  }}
                  style={{
                    position: 'absolute',
                    right: 0,
                    width: hp(40),
                    height: hp(35),
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1,
                  }}>
                  <Image
                    source={icons.date_cancel_icon}
                    style={{
                      width: hp(10),
                      height: hp(10),
                      resizeMode: 'contain',
                      tintColor: 'black',
                    }}
                  />
                </TouchableOpacity>
              )}

              <View style={{padding: wp(15)}}>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedIndex(index);
                    refMediaSheet.current?.open();
                  }}
                  activeOpacity={0.6}
                  style={{
                    backgroundColor: colors.white,
                    width: wp(185),
                    height: hp(40),
                    borderRadius: hp(8),
                    justifyContent: 'center',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: wp(15),
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color: colors.pureBlack,
                        fontSize: fontSize(14),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      {item.media || 'Select Media'}
                    </Text>

                    <Image
                      source={icons.dropDown_Icon}
                      style={{
                        width: hp(10),
                        height: hp(5),
                        resizeMode: 'contain',
                      }}
                    />
                  </View>
                </TouchableOpacity>

                <View style={{marginTop: hp(12)}}>
                  <TextInput
                    value={item.url}
                    onChangeText={text => {
                      setSocialLinks(prev =>
                        prev.map((link, i) =>
                          i === index
                            ? {
                                ...link,
                                url: text,
                              }
                            : link,
                        ),
                      );
                    }}
                    placeholder={
                      item.media === 'Whatsapp'
                        ? 'Enter WhatsApp Number'
                        : item.media
                        ? `Enter ${item.media} URL`
                        : 'Enter URL'
                    }
                    placeholderTextColor="#999"
                    autoCorrect={false}
                    autoCapitalize="none"
                    blurOnSubmit={false}
                    returnKeyType="done"
                    style={{
                      height: hp(46),
                      borderRadius: hp(8),
                      paddingHorizontal: wp(15),
                      color: colors.pureBlack,
                      fontSize: fontSize(14),
                      fontFamily: fontFamily.poppins400,
                      backgroundColor: colors.white,
                    }}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={{height: hp(100)}} />
      </ScrollView>

      {!keyboardVisible && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'white',
            height: hp(80),
          }}>
          <TouchableOpacity
            onPress={onSavePress}
            activeOpacity={0.6}
            style={{
              height: hp(44),
              backgroundColor: loading ? '#9D84E8' : '#7148E4',
              marginHorizontal: wp(17),
              borderRadius: hp(30),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: hp(13),
            }}>
            {loading ? (
              <ActivityIndicator color="white" size="large" />
            ) : (
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins400,
                }}>
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      <RBSheet
        ref={refMediaSheet}
        closeOnDragDown
        closeOnPressMask
        height={hp(410)}
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
          },
        }}>
        <Text
          style={{
            fontSize: fontSize(18),
            fontFamily: fontFamily.poppins600,
            color: colors.pureBlack,
            marginTop: hp(10),
            marginHorizontal: wp(20),
          }}>
          Select Media
        </Text>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(10),
          }}
        />

        {mediaOptions.map(item => {
          const isSelected =
            selectedIndex !== null &&
            socialLinks[selectedIndex]?.media === item;

          return (
            <TouchableOpacity
              key={item}
              activeOpacity={0.7}
              onPress={() => {
                const updated = [...socialLinks];

                updated[selectedIndex] = {
                  ...updated[selectedIndex],
                  media: item,
                };

                setSocialLinks(updated);

                refMediaSheet.current?.close();
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: wp(20),
                height: hp(55),
                borderBottomWidth: hp(0.8),
                borderBottomColor: '#E9E9E9',
              }}>
              <Text
                style={{
                  fontSize: fontSize(15),
                  color: colors.pureBlack,
                  fontFamily: fontFamily.poppins400,
                }}>
                {item}
              </Text>

              {isSelected && (
                <Image
                  source={icons.new_Circle_Check_Icon}
                  style={{
                    width: hp(22),
                    height: hp(22),
                    resizeMode: 'contain',
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </RBSheet>
    </SafeAreaView>
  );
};

export default VendorSocialMediaLinkScreen;
