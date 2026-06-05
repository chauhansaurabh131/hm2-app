import React, {useEffect, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Clipboard,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MyDatingProfileSlideAllImageComponent from '../../../components/MyDatingProfileSlideAllImageComponent';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {colors} from '../../../utils/colors';
import {icons} from '../../../assets';

import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-toast-message';

const DatingProfileScreens = () => {
  const {user} = useSelector(state => state.auth);
  const {dataCount} = useSelector(state => state.home);
  const accessToken = user?.tokens?.access?.token;
  const navigation = useNavigation();

  const [planDetails, setPlanDetails] = useState('');

  // console.log(' === User****** ===> ', user?.user?.language);

  const [statusCount, setStatusCount] = useState(null);

  const bottomSheetRef = useRef(null);

  const hobbies =
    user?.user?.hobbies?.[0]?.split(',')?.map(item =>
      item
        .trim()
        .replace(/_/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' '),
    ) || [];

  useEffect(() => {
    if (accessToken) {
      // API call to fetch status count
      fetch('https://test.mntech.website/api/v1/user/user/getStatusCount', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then(response => response.json())
        .then(data => {
          setStatusCount(data);
        })
        .catch(err => {
          console.log(' === err ===> ', err);
        });
    }
  }, [accessToken]);

  const capitalize = text => {
    if (!text) {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const getBackgroundColor = () => {
    const planName = planDetails?.planId?.planName?.toLowerCase();
    if (planName === 'silver') {
      return 'gray';
    }
    if (planName === 'gold') {
      return 'orange';
    }
    return '#f0f0f0'; // default
  };

  // Function to format the date to DD/MM/YYYY
  const formatDate = date => {
    if (!date) {
      return '';
    }

    // If the date is in ISO format, convert it to a Date object
    if (typeof date === 'string' && date.includes('T')) {
      date = new Date(date); // Convert ISO string to Date object
    }

    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
    const year = date.getFullYear();

    // Return the date in MM/DD/YYYY format
    return `${day}. ${month}. ${year}`;
  };

  const formattedDate = formatDate(
    user?.user?.dateOfBirth
      ? new Date(user?.user?.dateOfBirth)
      : user?.user?.dateOfBirth,
  );

  const onCopyIdPress = () => {
    const userId = user?.user?.userUniqueId;

    if (!userId) {
      return;
    }

    Clipboard.setString(userId);
    bottomSheetRef.current.close();
    CopyId();
  };

  const userAllImageShare = () => {
    navigation.navigate('UserProfileUploadImageFullScreen');
  };

  const CopyId = () => {
    Toast.show({
      type: 'Copied',
      text1: 'Your ID has been copied!',
      visibilityTime: 1000,
    });
  };

  const toastConfigs = {
    Copied: ({text1}) => (
      <View
        style={{
          backgroundColor: '#333333',
          borderRadius: 100,
          marginHorizontal: 20,
          width: wp(300),
          height: hp(55),
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white', // Toast text color
            fontSize: fontSize(16),
            textAlign: 'center',
            lineHeight: hp(24),
            fontFamily: fontFamily.poppins400,
          }}>
          {text1}
        </Text>
      </View>
    ),
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#F8FAFC'}}>
      <View
        style={{
          zIndex: 99,
          top: -20,
        }}>
        <Toast config={toastConfigs} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <MyDatingProfileSlideAllImageComponent
          onBackPress={() => navigation.goBack()}
          onMenuPress={() => bottomSheetRef.current.open()}
        />

        <View
          style={{
            height: hp(170),
            borderBottomLeftRadius: hp(34),
            borderBottomRightRadius: hp(34),

            // 🔥 SHADOW (apply here)
            backgroundColor: '#fff',

            // 🔥 PERFECT SOFT SHADOW
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1, // 🔥 more distance
            },
            shadowOpacity: 0.1,
            shadowRadius: 10, // 🔥 spread blur

            elevation: 10, // 🔥 Android
          }}>
          <View style={{paddingHorizontal: wp(17), marginTop: hp(20)}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(24),
                  fontFamily: fontFamily.poppins700,
                }}>
                {capitalize(user?.user?.firstName || user?.user?.Name)}{' '}
                {capitalize(user?.user?.lastName)}
              </Text>

              <View style={{top: -3, marginLeft: wp(10)}}>
                {planDetails?.planId?.planName && (
                  <View
                    style={{
                      backgroundColor: getBackgroundColor(),
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 2, // internal padding
                      borderRadius: 50,
                      alignSelf: 'flex-start', // ensures the box only takes needed width
                      paddingHorizontal: 10,
                      // marginLeft: wp(7),
                    }}>
                    <Image
                      source={icons.crownIcon}
                      style={{
                        width: hp(10),
                        height: hp(10),
                        marginRight: 5,
                        tintColor: 'white',
                      }}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        fontSize: fontSize(12),
                        color: 'white',
                        fontFamily: fontFamily.poppins400,
                        top: 2,
                      }}>
                      {planDetails?.planId?.planName
                        ? planDetails.planId.planName.charAt(0).toUpperCase() +
                          planDetails.planId.planName.slice(1).toLowerCase()
                        : 'Plan Name'}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View style={{flexDirection: 'row'}}>
              {/*<Text*/}
              {/*  style={{*/}
              {/*    color: '#64748B',*/}
              {/*    fontSize: fontSize(13),*/}
              {/*    fontFamily: fontFamily.poppins400,*/}
              {/*  }}>*/}
              {/*  {age ? `${age} yrs` : 'N/A'},{' '}*/}
              {/*</Text>*/}

              {/*<Text*/}
              {/*  style={{*/}
              {/*    color: '#64748B',*/}
              {/*    fontSize: fontSize(13),*/}
              {/*    fontFamily: fontFamily.poppins400,*/}
              {/*  }}>*/}
              {/*  {user.user?.height}*/}
              {/*</Text>*/}

              {/*<View*/}
              {/*  style={{*/}
              {/*    height: hp(15),*/}
              {/*    width: hp(2),*/}
              {/*    backgroundColor: '#D5D5D5',*/}
              {/*    marginHorizontal: wp(10),*/}
              {/*    top: 3,*/}
              {/*  }}*/}
              {/*/>*/}

              <Text
                style={{
                  color: '#64748B',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                }}>
                {capitalize(user.user?.datingData[0]?.Occupation || 'N/A')}
              </Text>

              <View
                style={{
                  height: hp(15),
                  width: hp(2),
                  backgroundColor: '#D5D5D5',
                  marginHorizontal: wp(10),
                  top: 3,
                }}
              />

              <Text
                style={{
                  color: '#64748B',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                }}>
                {/*{capitalize(user.user?.datingData[0]?.CurrentlyLiving || 'N/A')}*/}
                {(user.user?.datingData[0]?.CurrentlyLiving || 'N/A')
                  .split(',')
                  .map(
                    item =>
                      item.trim().charAt(0).toUpperCase() +
                      item.trim().slice(1).toLowerCase(),
                  )
                  .join(', ')}
              </Text>
            </View>

            {/*<View style={{flexDirection: 'row'}}>*/}
            {/*  <Text*/}
            {/*    style={{*/}
            {/*      color: '#64748B',*/}
            {/*      fontSize: fontSize(13),*/}
            {/*      fontFamily: fontFamily.poppins400,*/}
            {/*    }}>*/}
            {/*    /!*{capitalize(user.user?.datingData[0]?.CurrentlyLiving || 'N/A')}*!/*/}
            {/*    {(user.user?.datingData[0]?.CurrentlyLiving || 'N/A')*/}
            {/*      .split(',')*/}
            {/*      .map(*/}
            {/*        item =>*/}
            {/*          item.trim().charAt(0).toUpperCase() +*/}
            {/*          item.trim().slice(1).toLowerCase(),*/}
            {/*      )*/}
            {/*      .join(', ')}*/}
            {/*  </Text>*/}
            {/*</View>*/}

            <View
              style={{
                width: '100%',
                height: hp(1),
                backgroundColor: '#EDEDED',
                marginVertical: hp(18),
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Image
                  source={icons.dating_white_heart}
                  style={{
                    tintColor: '#9E28D7',
                    width: hp(14),
                    height: hp(14),
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    color: 'black',
                    marginTop: hp(5),
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins600,
                  }}>
                  {statusCount?.totalLikes}{' '}
                  <Text
                    style={{
                      color: '#8B8B8B',
                      fontSize: fontSize(14),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Likes
                  </Text>
                </Text>
              </View>

              <View>
                <Image
                  source={icons.light_arrow_icon}
                  style={{
                    tintColor: '#0091FF',
                    height: hp(10),
                    width: hp(10),
                    resizeMode: 'contain',
                  }}
                />
                <Text
                  style={{
                    color: 'black',
                    marginTop: hp(5),
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins600,
                  }}>
                  {statusCount?.totalRequestsSent}{' '}
                  <Text
                    style={{
                      color: '#8B8B8B',
                      fontSize: fontSize(14),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Sent
                  </Text>
                </Text>
              </View>

              <View>
                <Image
                  source={icons.light_arrow_icon}
                  style={{
                    tintColor: '#FF3D00',
                    height: hp(10),
                    width: hp(10),
                    resizeMode: 'contain',
                    transform: [{rotate: '180deg'}],
                  }}
                />
                <Text
                  style={{
                    color: 'black',
                    marginTop: hp(5),
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins600,
                  }}>
                  {statusCount?.totalRequestsReceived}{' '}
                  <Text
                    style={{
                      color: '#8B8B8B',
                      fontSize: fontSize(14),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Received
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{marginHorizontal: wp(17), marginTop: hp(29)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(18),
                fontFamily: fontFamily.poppins700,
              }}>
              About Me
            </Text>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AboutEditScreen', {
                  aboutText: user?.user?.writeBoutYourSelf,
                });
              }}
              style={{
                width: hp(31),
                height: hp(31),
                borderRadius: hp(50),
                backgroundColor: '#3B82F61A',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={icons.fill_Edit_Icon}
                style={{
                  tintColor: '#7045EB',
                  width: hp(15),
                  height: hp(15),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              color: '#475569',
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins400,
              marginTop: hp(26),
            }}>
            {user?.user?.writeBoutYourSelf}
          </Text>
        </View>

        <View style={{marginTop: hp(19), paddingHorizontal: wp(17)}}>
          <View style={{marginTop: hp(16)}}>
            <View>
              <View
                style={{
                  width: '100%',
                  height: 'auto',
                  backgroundColor: colors.white,
                  borderRadius: hp(20),
                  paddingVertical: hp(22),
                  paddingHorizontal: wp(18),
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={icons.profileLogo}
                    style={{
                      tintColor: '#7045EB',
                      width: hp(21),
                      height: hp(20),
                      resizeMode: 'contain',
                    }}
                  />
                  <Text
                    style={{
                      color: colors.pureBlack,
                      fontSize: fontSize(16),
                      fontFamily: fontFamily.poppins600,
                      marginLeft: wp(19),
                    }}>
                    Purpose
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('DatingPurposeScreen', {
                        UserData: user?.user,
                      });
                    }}
                    style={{
                      width: hp(31),
                      height: hp(31),
                      borderRadius: hp(50),
                      backgroundColor: '#3B82F61A',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'absolute',
                      right: -5,
                      top: -5,
                    }}>
                    <Image
                      source={icons.fill_Edit_Icon}
                      style={{
                        tintColor: '#7045EB',
                        width: hp(15),
                        height: hp(15),
                        resizeMode: 'contain',
                      }}
                    />
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    marginTop: hp(25),
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                  }}>
                  {user?.user?.datingData?.[0]?.interestedIn?.map(
                    (item, index) => (
                      <View
                        key={index}
                        style={{
                          backgroundColor: '#F5F2FF',
                          borderRadius: hp(50),
                          paddingHorizontal: wp(18),
                          paddingVertical: hp(8),
                          marginRight: wp(10),
                          marginBottom: hp(12),
                        }}>
                        <Text
                          style={{
                            color: '#7148E4',
                            fontSize: fontSize(14),
                            fontFamily: fontFamily.poppins400,
                          }}>
                          {item
                            .split('-')
                            .map(
                              word =>
                                word.charAt(0).toUpperCase() +
                                word.slice(1).toLowerCase(),
                            )
                            .join(' ')}
                        </Text>
                      </View>
                    ),
                  )}
                </View>
              </View>
            </View>
          </View>

          <View
            style={{
              width: '100%',
              height: 'auto',
              backgroundColor: colors.white,
              borderRadius: hp(20),
              paddingVertical: hp(22),
              paddingHorizontal: wp(18),
              marginTop: hp(15),
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                source={icons.profileLogo}
                style={{
                  tintColor: '#7045EB',
                  width: hp(21),
                  height: hp(20),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins600,
                  marginLeft: wp(19),
                }}>
                Basic Info
              </Text>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ModifyDatingBasicScreen', {
                    UserData: user?.user,
                  });
                }}
                style={{
                  width: hp(31),
                  height: hp(31),
                  borderRadius: hp(50),
                  backgroundColor: '#3B82F61A',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: -5,
                  top: -5,
                }}>
                <Image
                  source={icons.fill_Edit_Icon}
                  style={{
                    tintColor: '#7045EB',
                    width: hp(15),
                    height: hp(15),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                marginTop: hp(20),
                fontSize: fontSize(13),
                fontFamily: fontFamily.poppins400,
                color: '#878787',
              }}>
              Date of Birth
            </Text>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(16),
                fontFamily: fontFamily.poppins600,
                marginTop: hp(3),
              }}>
              {formattedDate}
            </Text>

            <Text
              style={{
                color: '#878787',
                fontSize: fontSize(13),
                fontFamily: fontFamily.poppins400,
                marginTop: hp(20),
              }}>
              Currently Living
            </Text>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(16),
                fontFamily: fontFamily.poppins600,
                marginTop: hp(3),
              }}>
              {user?.user?.datingData?.[0]?.CurrentlyLiving?.split(',')
                ?.slice(0, 2)
                ?.map(
                  item =>
                    item.trim().charAt(0).toUpperCase() +
                    item.trim().slice(1).toLowerCase(),
                )
                ?.join(', ') || 'N/A'}
            </Text>

            <Text
              style={{
                color: '#878787',
                fontSize: fontSize(13),
                fontFamily: fontFamily.poppins400,
                marginTop: hp(20),
              }}>
              Religion
            </Text>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(16),
                fontFamily: fontFamily.poppins600,
                marginTop: hp(3),
              }}>
              {user?.user?.religion ? capitalize(user.user.religion) : 'NA'}
            </Text>

            <Text
              style={{
                color: '#878787',
                fontSize: fontSize(13),
                fontFamily: fontFamily.poppins400,
                marginTop: hp(20),
              }}>
              Ethnicity
            </Text>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(16),
                fontFamily: fontFamily.poppins600,
                marginTop: hp(3),
              }}>
              {user?.user?.datingData[0]?.Ethnicity
                ? capitalize(user?.user?.datingData[0]?.Ethnicity)
                : 'NA'}
            </Text>

            <Text
              style={{
                color: '#878787',
                fontSize: fontSize(13),
                fontFamily: fontFamily.poppins400,
                marginTop: hp(20),
              }}>
              Spoken Language
            </Text>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(16),
                fontFamily: fontFamily.poppins600,
                marginTop: hp(3),
              }}>
              {user?.user?.motherTongue
                ? capitalize(user?.user?.motherTongue)
                : 'NA'}
            </Text>
          </View>

          <View
            style={{
              width: '100%',
              height: 'auto',
              backgroundColor: colors.white,
              borderRadius: hp(20),
              paddingVertical: hp(22),
              paddingHorizontal: wp(18),
              marginTop: hp(15),
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                source={icons.profileLogo}
                style={{
                  tintColor: '#7045EB',
                  width: hp(21),
                  height: hp(20),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins600,
                  marginLeft: wp(19),
                }}>
                Professional Details
              </Text>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ModifyDatingProfessionalScreen', {
                    UserData: user?.user,
                  });
                }}
                style={{
                  width: hp(31),
                  height: hp(31),
                  borderRadius: hp(50),
                  backgroundColor: '#3B82F61A',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: -5,
                  top: -5,
                }}>
                <Image
                  source={icons.fill_Edit_Icon}
                  style={{
                    tintColor: '#7045EB',
                    width: hp(15),
                    height: hp(15),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={{
                marginTop: hp(20),
                fontSize: fontSize(13),
                fontFamily: fontFamily.poppins400,
                color: '#878787',
              }}>
              Education Level
            </Text>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(16),
                fontFamily: fontFamily.poppins600,
                marginTop: hp(3),
              }}>
              {user?.user?.datingData[0]?.educationLevel
                ? capitalize(user?.user?.datingData[0]?.educationLevel)
                : 'NA'}
            </Text>

            <Text
              style={{
                marginTop: hp(20),
                fontSize: fontSize(13),
                fontFamily: fontFamily.poppins400,
                color: '#878787',
              }}>
              Occupation
            </Text>
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(16),
                fontFamily: fontFamily.poppins600,
                marginTop: hp(3),
              }}>
              {user?.user?.datingData[0]?.Occupation
                ? capitalize(user?.user?.datingData[0]?.Occupation)
                : 'NA'}
            </Text>
          </View>

          <View
            style={{
              width: '100%',
              height: 'auto',
              backgroundColor: colors.white,
              borderRadius: hp(20),
              paddingVertical: hp(22),
              paddingHorizontal: wp(18),
              marginTop: hp(15),
            }}>
            <View
              style={{
                flexDirection: 'row',
              }}>
              <Image
                source={icons.profileLogo}
                style={{
                  tintColor: '#7045EB',
                  width: hp(21),
                  height: hp(20),
                  resizeMode: 'contain',
                }}
              />
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(16),
                  fontFamily: fontFamily.poppins600,
                  marginLeft: wp(19),
                }}>
                Hobbies & Interest
              </Text>

              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ModifyDatingHobbiesScreen', {
                    UserData: user?.user,
                  });
                }}
                style={{
                  width: hp(31),
                  height: hp(31),
                  borderRadius: hp(50),
                  backgroundColor: '#3B82F61A',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'absolute',
                  right: -5,
                  top: -5,
                }}>
                <Image
                  source={icons.fill_Edit_Icon}
                  style={{
                    tintColor: '#7045EB',
                    width: hp(15),
                    height: hp(15),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: hp(15),
              }}>
              {hobbies.map((item, index) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: '#F5F2FF',
                    borderRadius: hp(20),
                    paddingHorizontal: wp(15),
                    paddingVertical: hp(6),
                    marginRight: hp(10),
                    marginBottom: hp(10),
                  }}>
                  <Text
                    style={{
                      color: '#7148E4',
                      fontSize: fontSize(14),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={{height: hp(50)}} />
      </ScrollView>

      {/* Three Bottom Sheet */}
      <RBSheet
        ref={bottomSheetRef}
        height={hp(200)}
        openDuration={250}
        customStyles={{
          draggableIcon: {
            backgroundColor: '#ffffff',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <View style={{marginHorizontal: 17, marginTop: 30}}>
          <TouchableOpacity
            onPress={() => bottomSheetRef.current.close()}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Image
              source={icons.share_icon}
              style={{
                width: hp(16),
                height: hp(16),
                resizeMode: 'contain',
                marginRight: hp(15),
              }}
            />
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
              }}>
              Share Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onCopyIdPress()}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Image
              source={icons.copy_icon}
              style={{
                width: hp(16),
                height: hp(16),
                resizeMode: 'contain',
                marginRight: hp(15),
              }}
            />
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
              }}>
              Copy ID
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              bottomSheetRef.current.close();
              navigation.navigate('ModifyDatingPartnerPreferenceScreen', {
                UserData: user?.user,
              });
            }}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Image
              source={icons.edit_partner_preference}
              style={{
                width: hp(18),
                height: hp(18),
                resizeMode: 'contain',
                marginRight: hp(15),
                tintColor: 'black',
              }}
            />
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
              }}>
              Change Preferences
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={userAllImageShare}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Image
              source={icons.image_Gallery_Icon}
              style={{
                width: hp(17),
                height: hp(17),
                resizeMode: 'contain',
                marginRight: hp(15),
                tintColor: 'black',
              }}
            />
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
              }}>
              Photo Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default DatingProfileScreens;
