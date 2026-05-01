import React, {useEffect, useRef, useState} from 'react';
import {View, Image, TouchableOpacity, Text, Clipboard} from 'react-native';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import {colors} from '../../utils/colors';
import {ScrollView} from 'react-native-virtualized-view';
import MyProfileSlideAllImageComponent from '../../components/myProfileSlideAllImageComponent';
import {useNavigation} from '@react-navigation/native';
import RBSheet from 'react-native-raw-bottom-sheet';
import Toast from 'react-native-toast-message';

const MyNewProfileScreen = () => {
  const {user} = useSelector(state => state.auth);
  const {dataCount} = useSelector(state => state.home);
  const accessToken = user?.tokens?.access?.token;
  const navigation = useNavigation();

  const [selectedTab, setSelectedTab] = useState('Profile Info');
  const [planDetails, setPlanDetails] = useState('');

  const bottomSheetRef = useRef(null);

  console.log(' === var ===> ', user?.user?.userUniqueId);

  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!accessToken) {
        console.warn('No access token found');
        return;
      }

      try {
        const response = await fetch(
          'https://stag.mntech.website/api/v1/user/user-plan/get-user-planbyId',
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        const data = await response.json();

        if (response.ok) {
          // console.log('User Plan:', data);
          setPlanDetails(data?.data);
        } else {
          console.error('API Error:', data);
          // Alert.alert('Error', data.message || 'Something went wrong');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        // Alert.alert('Network Error', 'Unable to fetch user plan');
      }
    };

    fetchUserPlan();
  }, [accessToken]);

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

  // console.log(' === var... ===> ', user?.user?.userPartner?.hobbies);

  const capitalize = text => {
    if (!text) {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatHobby = item => {
    if (!item) {
      return '';
    }

    return item
      .replace(/_/g, ' ') // play_instrument → play instrument
      .replace(/\b\w/g, char => char.toUpperCase()); // capitalize each word
  };

  const formatText = item => {
    if (!item) {
      return '';
    }

    return item.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  };

  const formatManglikStatus = value => {
    if (!value) {
      return '';
    }

    return value
      .replace('-', ' ') // 🔥 remove hyphen
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const calculateAge = dob => {
    if (!dob) {
      return 'N/A';
    } // Handle missing date of birth
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = calculateAge(user?.user?.dateOfBirth);

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

  // console.log(' === formattedDate ===> ', formattedDate);

  const formatTime = isoString => {
    if (!isoString) {
      return 'N/A';
    }

    const date = new Date(isoString);

    return date
      .toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        // second: '2-digit',
        hour12: true, // 🔥 AM/PM
      })
      .toUpperCase(); // 🔥 force AM/PM capital
  };

  const formatMaskedMobile = number => {
    if (!number) {
      return 'N/A';
    }

    let numStr = number.toString().replace(/\D/g, '');

    // 🔥 ensure max 10 digits
    if (numStr.length > 10) {
      numStr = numStr.slice(-10);
    }

    // 🔥 get last 3 digits
    const lastThree = numStr.slice(-3);

    return `+91 ***** **${lastThree}`;
  };

  const formatMaskedEmail = email => {
    if (!email) {
      return 'N/A';
    }

    const [name, domain] = email.split('@');

    if (!name || !domain) {
      return email;
    }

    const firstThree = name.slice(0, 3);

    return `${firstThree}****@${domain}`;
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

  const CopyId = () => {
    Toast.show({
      type: 'Copied',
      text1: 'Your ID has been copied!',
      visibilityTime: 1000,
    });
  };

  const onCopyIdPress = async selectedUniqueId => {
    console.log(' === selectedUniqueId ===> ', selectedUniqueId);
    await Clipboard.setString(selectedUniqueId);
    bottomSheetRef.current.close();
    CopyId();
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
        <MyProfileSlideAllImageComponent
          onBackPress={() => navigation.goBack()}
          onMenuPress={() => bottomSheetRef.current.open()}
        />

        <View
          style={{
            height: hp(186),
            // backgroundColor: colors.white,
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
          <View style={{paddingHorizontal: wp(17), marginTop: hp(8)}}>
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
              <Text
                style={{
                  color: '#64748B',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                }}>
                {age ? `${age} yrs` : 'N/A'},{' '}
              </Text>

              <Text
                style={{
                  color: '#64748B',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                }}>
                {user.user?.height}
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
                {capitalize(user?.user?.userProfessional?.jobTitle || 'N/A')}
              </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: '#64748B',
                  fontSize: fontSize(13),
                  fontFamily: fontFamily.poppins400,
                }}>
                {capitalize(user?.user?.address?.currentCity || 'N/A')},{' '}
                {capitalize(user?.user?.address?.currentState || 'N/A')}
              </Text>
            </View>

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
                  {dataCount?.totalLikes}{' '}
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
                  {dataCount?.totalRequestsSent}{' '}
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
                  {dataCount?.totalRequestsReceived}{' '}
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

        <View style={{paddingHorizontal: wp(17), marginTop: hp(29)}}>
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
          {/* 🔥 TAB CONTAINER */}
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: '#EBF2FE',
              borderRadius: hp(25),
              padding: hp(4),
            }}>
            {/* 🔥 PROFILE INFO TAB */}
            <TouchableOpacity
              onPress={() => setSelectedTab('Profile Info')}
              style={{
                flex: 1,
                height: hp(36),
                borderRadius: hp(25),
                backgroundColor:
                  selectedTab === 'Profile Info' ? '#FFFFFF' : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins500,
                }}>
                Profile Info
              </Text>
            </TouchableOpacity>

            {/* 🔥 PARTNER PREFERENCES TAB */}
            <TouchableOpacity
              onPress={() => setSelectedTab('Partner Preferences')}
              style={{
                flex: 1,
                height: hp(36),
                borderRadius: hp(25),
                backgroundColor:
                  selectedTab === 'Partner Preferences'
                    ? '#FFFFFF'
                    : 'transparent',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.pureBlack,
                  fontSize: fontSize(14),
                  fontFamily: fontFamily.poppins500,
                }}>
                Partner Preferences
              </Text>
            </TouchableOpacity>
          </View>

          {/* 🔥 TAB CONTENT */}
          <View style={{marginTop: hp(16)}}>
            {selectedTab === 'Profile Info' ? (
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
                      Basic Info
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ModifyBasicInfoScreen', {
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
                      marginTop: hp(31),
                      flexDirection: 'row',
                    }}>
                    <View style={{width: '55%'}}>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
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
                    </View>

                    <View>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Birth of Time
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {formatTime(user?.user?.birthTime)}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      marginTop: hp(26),
                      flexDirection: 'row',
                    }}>
                    <View style={{width: '55%'}}>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
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
                        {/*{capitalize(user?.user?.religion || 'N/A')}*/}

                        {user?.user?.religion
                          ? capitalize(user.user.religion)
                          : 'N/A'}
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Caste/Sub Caste
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {user?.user?.caste
                          ? capitalize(user?.user?.caste)
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      marginTop: hp(26),
                      flexDirection: 'row',
                    }}>
                    <View style={{width: '55%'}}>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Height & Weight
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {user?.user?.height || 'N/A'},{' '}
                        {user?.user?.weight
                          ? `${user?.user?.weight} kg`
                          : 'N/A'}
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Marital Status
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {user?.user?.maritalStatus
                          ? capitalize(user?.user?.maritalStatus)
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      marginTop: hp(26),
                      flexDirection: 'row',
                    }}>
                    <View style={{width: '55%'}}>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Manglik Status
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {user?.user?.manglikStatus
                          ? formatManglikStatus(user?.user?.manglikStatus)
                          : 'N/A'}
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Gothras
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {user?.user?.gothra
                          ? capitalize(user?.user?.gothra)
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      marginTop: hp(26),
                      flexDirection: 'row',
                    }}>
                    <View style={{width: '55%'}}>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Zodiac Sign
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {user?.user?.zodiac
                          ? capitalize(user?.user?.zodiac)
                          : 'N/A'}
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Mother Tongue
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
                          : 'N/A'}
                      </Text>
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
                    marginTop: hp(17),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={icons.addressLogo}
                      style={{
                        tintColor: '#7045EB',
                        width: hp(16),
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
                      Location
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ModifyLocationScreen', {
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
                      marginTop: hp(29),
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        City & State
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {user?.user?.address?.currentCity
                          ? capitalize(user?.user?.address?.currentCity)
                          : 'N/A'}
                        ,{' '}
                        {user?.user?.address?.currentState
                          ? capitalize(user?.user?.address?.currentState)
                          : 'N/A'}
                      </Text>
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
                    marginTop: hp(17),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={icons.phoneLogo}
                      style={{
                        tintColor: '#7045EB',
                        width: hp(20),
                        height: hp(20),
                        resizeMode: 'contain',
                        top: 2,
                      }}
                    />
                    <Text
                      style={{
                        color: colors.pureBlack,
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins600,
                        marginLeft: wp(19),
                      }}>
                      Contact
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ModifyContactScreen', {
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
                      marginTop: hp(29),
                      flexDirection: 'row',
                    }}>
                    <View>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Phone
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {formatMaskedMobile(user?.user?.mobileNumber)}
                      </Text>
                    </View>
                  </View>

                  <View style={{marginTop: hp(27)}}>
                    <Text
                      style={{
                        color: '#878787',
                        fontSize: fontSize(13),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Email
                    </Text>
                    <Text
                      style={{
                        color: colors.pureBlack,
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins600,
                        marginTop: hp(3),
                      }}>
                      {user?.user?.email
                        ? formatMaskedEmail(user?.user?.email)
                        : 'N/A'}
                    </Text>
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
                    marginTop: hp(17),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={icons.educationLogo}
                      style={{
                        tintColor: '#7045EB',
                        width: hp(24),
                        height: hp(19),
                        resizeMode: 'contain',
                        top: 2,
                      }}
                    />
                    <Text
                      style={{
                        color: colors.pureBlack,
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins600,
                        marginLeft: wp(19),
                      }}>
                      Education
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ModifyEducationScreen', {
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
                      marginTop: hp(31),
                      // flexDirection: 'row',
                    }}>
                    <View>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Degree
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {user?.user?.userEducation?.degree
                          ? capitalize(user?.user?.userEducation?.degree)
                          : 'N/A'}
                      </Text>
                    </View>

                    <View style={{marginTop: hp(26)}}>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        College / Uni.
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {user?.user?.userEducation?.collage
                          ? user?.user?.userEducation?.collage
                              .charAt(0)
                              .toUpperCase() +
                            user?.user?.userEducation?.collage.slice(1)
                          : 'N/A'}
                      </Text>
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
                    marginTop: hp(17),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={icons.professionalLogo}
                      style={{
                        tintColor: '#7045EB',
                        width: hp(22),
                        height: hp(20),
                        resizeMode: 'contain',
                        top: 2,
                      }}
                    />
                    <Text
                      style={{
                        color: colors.pureBlack,
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins600,
                        marginLeft: wp(19),
                      }}>
                      Occupation
                    </Text>

                    <TouchableOpacity
                      onPress={() => {
                        navigation.navigate('ModifyOccupationScreen', {
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
                      marginTop: hp(31),
                      flexDirection: 'row',
                    }}>
                    <View style={{width: '55%'}}>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Current Job
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {user?.user?.userProfessional?.jobTitle
                          ? capitalize(user?.user?.userProfessional?.jobTitle)
                          : 'N/A'}
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Job Type
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {user?.user?.userProfessional?.jobType
                          ? capitalize(user?.user?.userProfessional?.jobType)
                          : 'N/A'}
                      </Text>
                    </View>
                  </View>

                  <View
                    style={{
                      marginTop: hp(27),
                      flexDirection: 'row',
                    }}>
                    <View style={{width: '55%'}}>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Company
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {user?.user?.userProfessional?.companyName
                          ? capitalize(
                              user?.user?.userProfessional?.companyName,
                            )
                          : 'N/A'}
                      </Text>
                    </View>

                    <View>
                      <Text
                        style={{
                          color: '#878787',
                          fontSize: fontSize(13),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Annual Income
                      </Text>
                      <Text
                        style={{
                          color: colors.pureBlack,
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins600,
                          marginTop: hp(3),
                        }}>
                        {user?.user?.userProfessional?.currentSalary
                          ? `${user?.user?.userProfessional?.currentSalary} LPA`
                          : 'N/A'}
                      </Text>
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
                    marginTop: hp(17),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={icons.internetLogo}
                      style={{
                        tintColor: '#7045EB',
                        width: hp(20),
                        height: hp(20),
                        resizeMode: 'contain',
                        top: 2,
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
                        navigation.navigate('ModifyHobbiesAndInterestScreen', {
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
                      marginTop: hp(27),
                    }}>
                    {user?.user?.hobbies?.length > 0 ? (
                      user?.user?.hobbies.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            paddingHorizontal: wp(20),
                            paddingVertical: hp(7),
                            backgroundColor: '#F5F2FF',
                            borderRadius: hp(30),
                            marginRight: wp(8),
                            marginBottom: hp(8),
                          }}>
                          <Text
                            style={{
                              color: '#7148E4',
                              fontSize: fontSize(14),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            {formatHobby(item)}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text
                        style={{
                          color: 'gray',
                          fontSize: fontSize(14),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Add Hobbies & Interest
                      </Text>
                    )}
                  </View>

                  <View
                    style={{
                      width: '100%',
                      height: hp(1),
                      backgroundColor: '#DDDDDD',
                      marginTop: hp(34),
                      marginBottom: hp(21),
                    }}
                  />

                  <Text
                    style={{
                      color: colors.pureBlack,
                      fontSize: fontSize(16),
                      fontFamily: fontFamily.poppins600,
                    }}>
                    Language Known
                  </Text>

                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      marginTop: hp(10),
                    }}>
                    {user?.user?.language?.length > 0 ? (
                      user?.user?.language.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            paddingHorizontal: wp(20),
                            paddingVertical: hp(7),
                            backgroundColor: '#F5F2FF',
                            borderRadius: hp(30),
                            marginRight: wp(8),
                            marginBottom: hp(8),
                          }}>
                          <Text
                            style={{
                              color: '#7148E4',
                              fontSize: fontSize(14),
                              fontFamily: fontFamily.poppins400,
                            }}>
                            {formatText(item)}
                          </Text>
                        </View>
                      ))
                    ) : (
                      <Text
                        style={{
                          color: 'gray',
                          fontSize: fontSize(14),
                          fontFamily: fontFamily.poppins400,
                        }}>
                        Add Language
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            ) : (
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
                    Partner Preference
                  </Text>

                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ModifyPartnerPreferenceScreen', {
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
                    color: '#878787',
                    fontSize: fontSize(13),
                    fontFamily: fontFamily.poppins400,
                    marginTop: hp(29),
                  }}>
                  Select Age Range
                </Text>

                <Text
                  style={{
                    color: colors.pureBlack,
                    fontSize: fontSize(16),
                    fontFamily: fontFamily.poppins600,
                    marginTop: hp(3),
                  }}>
                  {user?.user?.userPartner?.age?.min} to{' '}
                  {user?.user?.userPartner?.age?.max} age
                </Text>

                <Text
                  style={{
                    color: '#878787',
                    fontSize: fontSize(13),
                    fontFamily: fontFamily.poppins400,
                    marginTop: hp(19),
                  }}>
                  Prefer Heights
                </Text>

                <Text
                  style={{
                    color: colors.pureBlack,
                    fontSize: fontSize(16),
                    fontFamily: fontFamily.poppins600,
                    marginTop: hp(3),
                  }}>
                  {user?.user?.userPartner?.height?.min} to{' '}
                  {user?.user?.userPartner?.height?.max} ft
                </Text>

                <Text
                  style={{
                    color: '#878787',
                    fontSize: fontSize(13),
                    fontFamily: fontFamily.poppins400,
                    marginTop: hp(19),
                  }}>
                  Prefer States
                </Text>

                <Text
                  style={{
                    color: colors.pureBlack,
                    fontSize: fontSize(16),
                    fontFamily: fontFamily.poppins600,
                    marginTop: hp(3),
                  }}>
                  {user?.user?.userPartner?.state?.length > 0
                    ? user?.user?.userPartner?.state
                        .map(item =>
                          item
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, char => char.toUpperCase()),
                        )
                        .join(', ')
                    : 'N/A'}
                </Text>

                <Text
                  style={{
                    color: '#878787',
                    fontSize: fontSize(13),
                    fontFamily: fontFamily.poppins400,
                    marginTop: hp(19),
                  }}>
                  Prefer Cities
                </Text>

                <Text
                  style={{
                    color: colors.pureBlack,
                    fontSize: fontSize(16),
                    fontFamily: fontFamily.poppins600,
                    marginTop: hp(3),
                  }}>
                  {user?.user?.userPartner?.city?.length > 0
                    ? user?.user?.userPartner?.city
                        .map(item =>
                          item
                            .replace(/-/g, ' ')
                            .replace(/\b\w/g, char => char.toUpperCase()),
                        )
                        .join(', ')
                    : 'N/A'}
                </Text>

                <Text
                  style={{
                    color: '#878787',
                    fontSize: fontSize(13),
                    fontFamily: fontFamily.poppins400,
                    marginTop: hp(19),
                  }}>
                  Prefer Diets
                </Text>

                <Text
                  style={{
                    color: colors.pureBlack,
                    fontSize: fontSize(16),
                    fontFamily: fontFamily.poppins600,
                    marginTop: hp(3),
                  }}>
                  {user?.user?.userPartner?.diet?.length > 0
                    ? user?.user?.userPartner?.diet
                        .map(
                          item =>
                            item
                              .split('_') // ["occasionally", "non", "vegetarian"]
                              .map(
                                word =>
                                  word.charAt(0).toUpperCase() + word.slice(1),
                              )
                              .join('-'), // join with dash
                        )
                        .join(', ')
                    : 'N/A'}
                </Text>

                <Text
                  style={{
                    color: '#878787',
                    fontSize: fontSize(13),
                    fontFamily: fontFamily.poppins400,
                    marginTop: hp(19),
                  }}>
                  Prefer Diets
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: hp(10),
                  }}>
                  {user?.user?.userPartner?.hobbies?.length > 0 ? (
                    user?.user?.userPartner?.hobbies.map((item, index) => (
                      <View
                        key={index}
                        style={{
                          paddingHorizontal: wp(20),
                          paddingVertical: hp(7),
                          backgroundColor: '#F5F2FF',
                          borderRadius: hp(30),
                          marginRight: wp(8),
                          marginBottom: hp(8),
                        }}>
                        <Text
                          style={{
                            color: '#7148E4',
                            fontSize: fontSize(14),
                            fontFamily: fontFamily.poppins400,
                          }}>
                          {formatText(item)}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text
                      style={{
                        color: 'gray',
                        fontSize: fontSize(14),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Add Language
                    </Text>
                  )}
                </View>
              </View>
            )}
          </View>
        </View>

        <View style={{height: hp(50)}} />
      </ScrollView>

      {/* Three Bottom Sheet */}
      <RBSheet
        ref={bottomSheetRef}
        height={hp(180)}
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
            onPress={() => bottomSheetRef.current.close()}
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
              Copy URL
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
              source={icons.copy_id_card_icon}
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
              Copy ID :{' '}
              <Text style={{textTransform: 'uppercase'}}>
                {user?.user?.userUniqueId}
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate('UserProfileUploadImageFullScreen')
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <Image
              source={icons.profileLogo}
              style={{
                width: hp(16),
                height: hp(16),
                resizeMode: 'contain',
                marginRight: hp(15),
                tintColor: colors.pureBlack,
              }}
            />
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
                top: 1,
              }}>
              Edit Profile Picture
            </Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default MyNewProfileScreen;
