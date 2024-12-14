import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  Image,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import style from '../HomeScreen/style';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {useSelector} from 'react-redux';
import {colors} from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';

const SearchUserDataScreen = ({route}) => {
  const {data} = route.params; // Retrieve data from navigation params
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;
  const sheetRef = useRef(null);
  const [selectedFirstName, setSelectedFirstName] = useState('');

  console.log(' === route ===> ', data?.data);

  const isListData =
    Array.isArray(data?.data?.users) && data?.data?.users.length > 0; // Check if the data is a list
  const isSingleUserData = Array.isArray(data?.data) && data?.data.length > 0; // Check if the data is a single user object

  console.log(' === isListData ===> ', isListData);

  const totalResults = isListData
    ? data?.data?.pagination?.totalResults
    : isSingleUserData
    ? data?.data.length
    : 0;

  // console.log(' === data ===> ', data);

  const renderListData = ({item}) => {
    console.log(' === item ===> ', item);
    const handlePress = () => {
      console.log(' === item........... ===> ', item);
      const matchesUserData = {
        userAllImage,
        profileImage,
        // birthTime,
        currentCity,
        JobTittle,
        currentCountry,
        age,
        gender: item?.gender,
        height: item?.height,
        cast: item?.cast,
        firstName: item?.firstName,
        lastName: item?.lastName,
        motherTongue: item?.motherTongue,
        about: item?.writeBoutYourSelf,
        religion: item?.religion,
        dateOfBirth: item?.dateOfBirth,
        currentResidenceAddress: item?.address?.currentResidenceAddress,
        originResidenceAddress: item?.address?.originResidenceAddress,
        originCountry: item?.address?.originCountry,
        originCity: item?.address?.originCity,
        mobileNumber: item?.mobileNumber,
        homeMobileNumber: item?.homeMobileNumber,
        email: item?.email,
        degree: item?.userEducation?.degree,
        collage: item?.userEducation?.collage,
        educationCity: item?.userEducation?.city,
        educationState: item?.userEducation?.state,
        educationCountry: item?.userEducation?.country,
        Designation: item?.userProfessional?.jobTitle,
        companyName: item?.userProfessional?.companyName,
        jobType: item?.userProfessional?.jobType,
        currentSalary: item?.userProfessional?.currentSalary,
        workCity: item?.userProfessional?.workCity,
        workCountry: item?.userProfessional?.workCountry,
        hobbies: item?.hobbies,
        matchPercentage: item?.matchPercentage,
        userLikeDetails: item?.userLikeDetails,
      };

      // console.log('User Data:', matchesUserData);

      // Navigate to UserDetailsScreen
      navigation.navigate('UserDetailsScreen', {matchesUserData});
    };
    const profileImage = item.profilePic;

    const name = item.name
      ? item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()
      : '';

    const jobTitle = item?.userProfessional?.jobTitle
      ? item?.userProfessional?.jobTitle.charAt(0).toUpperCase() +
        item?.userProfessional?.jobTitle.slice(1).toLowerCase()
      : '';

    const currentCity = item?.address?.currentCity
      ? item?.address?.currentCity.charAt(0).toUpperCase() +
        item?.address?.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item?.address?.currentCountry
      ? item?.address?.currentCountry.charAt(0).toUpperCase() +
        item?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    const imageCount = Array.isArray(item?.userProfilePic)
      ? item.userProfilePic.length
      : 0;

    const userAllImage = Array.isArray(item?.userProfilePic)
      ? item.userProfilePic.map(pic => pic.url)
      : [];

    const JobTittle = item.userProfessional?.jobTitle
      ? item.userProfessional?.jobTitle.charAt(0).toUpperCase() +
        item.userProfessional?.jobTitle.slice(1).toLowerCase()
      : '';

    const calculateAge = dateOfBirth => {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();

      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      // Adjust age if the current date is before the birthday in the current year
      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      return age;
    };

    const age = calculateAge(item.dateOfBirth);

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    const onThreeDotPress = () => {
      // const userDetailsThreeDot = {
      //   firstName: item?.firstName,
      // };
      setSelectedFirstName(name);

      sheetRef.current.open();
      // console.log(' === onThreeDotPress ===> ', userDetailsThreeDot);
    };

    return (
      <View style={{marginHorizontal: 17}}>
        <Image
          source={
            item.profilePic ? {uri: item.profilePic} : images.empty_male_Image
          }
          style={{
            width: '100%',
            height: hp(449),
            borderRadius: 18,
            marginBottom: hp(13),
          }}
          resizeMode={'cover'}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 18,
            width: '100%',
            height: '40%',
            marginBottom: hp(13),
          }}
        />

        <View
          style={{
            position: 'absolute',
            bottom: 35,
            width: '100%',
            marginLeft: wp(21),
          }}>
          <View
            style={{
              width: wp(34.8),
              height: hp(12),
              borderRadius: 5,
              backgroundColor: '#24FF00A8',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(9),
                lineHeight: hp(12),
                textAlign: 'center',
              }}>
              Online
            </Text>
          </View>

          <TouchableOpacity onPress={handlePress}>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(24),
                lineHeight: hp(36),
                fontFamily: fontFamily.poppins700,
                marginTop: 5,
              }}>
              {name || 'No Name Available'}
            </Text>

            <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(11),
                  lineHeight: hp(16),
                  fontFamily: fontFamily.poppins400,
                  marginRight: wp(2),
                }}>
                {item?.age || 'N/A'} yrs,
              </Text>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(11),
                  lineHeight: hp(16),
                  fontFamily: fontFamily.poppins400,
                  marginRight: wp(2),
                }}>
                {item?.height}
              </Text>

              <View
                style={{
                  width: hp(1),
                  backgroundColor: colors.gray,
                  marginHorizontal: wp(10),
                }}
              />

              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(11),
                  lineHeight: hp(16),
                  fontFamily: fontFamily.poppins400,
                  marginRight: wp(2),
                }}>
                {jobTitle || 'N/A'}
              </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(11),
                  lineHeight: hp(16),
                  fontFamily: fontFamily.poppins400,
                  marginRight: wp(2),
                }}>
                {currentCity || 'N/A'},
              </Text>

              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(11),
                  lineHeight: hp(16),
                  fontFamily: fontFamily.poppins400,
                  marginRight: wp(2),
                }}>
                {' '}
                {currentCountry || 'N/A'}
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              marginTop: hp(15),
              flexDirection: 'row',
              // backgroundColor: 'red',
              alignItems: 'center',
              // flex: 1,
            }}>
            <Image
              source={images.gradient_button_background_img}
              style={{
                // width: wp(105),
                // height: hp(30),
                // resizeMode: 'stretch',
                width: wp(105),
                height: hp(30),
                resizeMode: 'stretch',
                borderRadius: 50, // Adjust the radius as needed
                overflow: 'hidden', // Ensure rounded corners clip the image
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              // onPress={openModal}
              style={{
                position: 'absolute',
                left: 10,
                // top: 12,
                flexDirection: 'row',
                justifyContent: 'center',
                // borderRadius: 10,
              }}>
              <Image
                source={icons.couple_icon}
                style={{
                  width: hp(16),
                  height: hp(14),
                  resizeMode: 'contain',
                  tintColor: 'white',
                }}
              />
              <Text
                style={{
                  color: 'white',
                  marginLeft: 9,
                  fontSize: fontSize(10),
                  lineHeight: hp(15),
                  fontFamily: fontFamily.poppins600,
                  top: 1,
                }}>
                {/*85% Match*/}
                {item?.matchPercentage}% Match
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                right: 35,
                // top: 5,
              }}>
              <TouchableOpacity
                style={{
                  width: hp(60),
                  height: hp(30),
                  backgroundColor: '#282727',
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginHorizontal: 5,
                }}
                activeOpacity={0.5}
                // onPress={() => {
                //   navigation.navigate('UserUploadImageFullScreen');
                // }}
                onPress={userAllImageShare}>
                <Image
                  source={icons.new_camera_icon}
                  style={{
                    width: 16,
                    height: 16,
                    resizeMode: 'contain',
                    marginRight: wp(10),
                  }}
                />

                <Text style={{color: colors.white}}>{imageCount}</Text>
              </TouchableOpacity>
              {/*</View>*/}

              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  width: hp(30),
                  height: hp(30),
                  backgroundColor: '#282727',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginHorizontal: 5,
                }}>
                <Image
                  source={icons.starIcon}
                  style={{
                    width: hp(20),
                    height: hp(16),
                    resizeMode: 'contain',
                    tintColor: colors.white,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onThreeDotPress}
                style={{
                  width: hp(30),
                  height: hp(30),
                  backgroundColor: '#282727',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginHorizontal: 5,
                }}>
                <Image
                  source={icons.new_three_dot}
                  style={{width: 4, height: 14, tintColor: colors.white}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderSingleUserData = ({item}) => {
    // console.log(' === var ===> ', item?.dateOfBirth);

    const name = item.name
      ? item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()
      : '';

    const jobTitle = item?.userProfessional?.jobTitle
      ? item?.userProfessional?.jobTitle.charAt(0).toUpperCase() +
        item?.userProfessional?.jobTitle.slice(1).toLowerCase()
      : '';

    const currentCity = item?.address?.currentCity
      ? item?.address?.currentCity.charAt(0).toUpperCase() +
        item?.address?.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item?.address?.currentCountry
      ? item?.address?.currentCountry.charAt(0).toUpperCase() +
        item?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    const calculateAge = dateOfBirth => {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age;
    };

    const age = calculateAge(item.dateOfBirth);

    const imageCount = Array.isArray(item?.userProfilePic)
      ? item.userProfilePic.length
      : 0;

    const userAllImage = Array.isArray(item?.userProfilePic)
      ? item.userProfilePic.map(pic => pic.url)
      : [];

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    const onThreeDotPress = () => {
      // const userDetailsThreeDot = {
      //   firstName: item?.firstName,
      // };
      setSelectedFirstName(name);

      sheetRef.current.open();
      // console.log(' === onThreeDotPress ===> ', userDetailsThreeDot);
    };

    return (
      <View style={{marginHorizontal: 17}}>
        <Image
          source={
            item.profilePic ? {uri: item.profilePic} : images.empty_male_Image
          }
          style={{
            width: '100%',
            height: hp(449),
            borderRadius: 18,
            marginBottom: hp(13),
          }}
          resizeMode={'cover'}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 18,
            width: '100%',
            height: '40%',
            marginBottom: hp(13),
          }}
        />
        <View
          style={{
            position: 'absolute',
            bottom: 35,
            width: '100%',
            marginLeft: wp(21),
          }}>
          <View
            style={{
              width: wp(34.8),
              height: hp(12),
              borderRadius: 5,
              backgroundColor: '#24FF00A8',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(9),
                lineHeight: hp(12),
                textAlign: 'center',
              }}>
              Online
            </Text>
          </View>

          <TouchableOpacity>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(24),
                lineHeight: hp(36),
                fontFamily: fontFamily.poppins700,
                marginTop: 5,
              }}>
              {name || 'No Name Available'}
            </Text>

            <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(11),
                  lineHeight: hp(16),
                  fontFamily: fontFamily.poppins400,
                  marginRight: wp(2),
                }}>
                {age || 'N/A'} yrs,
              </Text>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(11),
                  lineHeight: hp(16),
                  fontFamily: fontFamily.poppins400,
                  marginRight: wp(2),
                }}>
                {item?.height}
              </Text>

              <View
                style={{
                  width: hp(1),
                  backgroundColor: colors.gray,
                  marginHorizontal: wp(10),
                }}
              />

              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(11),
                  lineHeight: hp(16),
                  fontFamily: fontFamily.poppins400,
                  marginRight: wp(2),
                }}>
                {jobTitle || 'N/A'}
              </Text>
            </View>

            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(11),
                  lineHeight: hp(16),
                  fontFamily: fontFamily.poppins400,
                  marginRight: wp(2),
                }}>
                {currentCity || 'N/A'},
              </Text>

              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(11),
                  lineHeight: hp(16),
                  fontFamily: fontFamily.poppins400,
                  marginRight: wp(2),
                }}>
                {' '}
                {currentCountry || 'N/A'}
              </Text>
            </View>
          </TouchableOpacity>

          <View
            style={{
              marginTop: hp(15),
              flexDirection: 'row',
              // backgroundColor: 'red',
              alignItems: 'center',
              // flex: 1,
            }}>
            <Image
              source={images.gradient_button_background_img}
              style={{
                // width: wp(105),
                // height: hp(30),
                // resizeMode: 'stretch',
                width: wp(105),
                height: hp(30),
                resizeMode: 'stretch',
                borderRadius: 50, // Adjust the radius as needed
                overflow: 'hidden', // Ensure rounded corners clip the image
              }}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              // onPress={openModal}
              style={{
                position: 'absolute',
                left: 10,
                // top: 12,
                flexDirection: 'row',
                justifyContent: 'center',
                // borderRadius: 10,
              }}>
              <Image
                source={icons.couple_icon}
                style={{
                  width: hp(16),
                  height: hp(14),
                  resizeMode: 'contain',
                  tintColor: 'white',
                }}
              />
              <Text
                style={{
                  color: 'white',
                  marginLeft: 9,
                  fontSize: fontSize(10),
                  lineHeight: hp(15),
                  fontFamily: fontFamily.poppins600,
                  top: 1,
                }}>
                {/*85% Match*/}
                {item?.matchPercentage}% Match
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: 'row',
                position: 'absolute',
                right: 35,
                // top: 5,
              }}>
              <TouchableOpacity
                style={{
                  width: hp(60),
                  height: hp(30),
                  backgroundColor: '#282727',
                  borderRadius: 15,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginHorizontal: 5,
                }}
                activeOpacity={0.5}
                // onPress={() => {
                //   navigation.navigate('UserUploadImageFullScreen');
                // }}
                onPress={userAllImageShare}>
                <Image
                  source={icons.new_camera_icon}
                  style={{
                    width: 16,
                    height: 16,
                    resizeMode: 'contain',
                    marginRight: wp(10),
                  }}
                />

                <Text style={{color: colors.white}}>{imageCount}</Text>
              </TouchableOpacity>
              {/*</View>*/}

              <TouchableOpacity
                activeOpacity={0.5}
                style={{
                  width: hp(30),
                  height: hp(30),
                  backgroundColor: '#282727',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginHorizontal: 5,
                }}>
                <Image
                  source={icons.starIcon}
                  style={{
                    width: hp(20),
                    height: hp(16),
                    resizeMode: 'contain',
                    tintColor: colors.white,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onThreeDotPress}
                style={{
                  width: hp(30),
                  height: hp(30),
                  backgroundColor: '#282727',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  marginHorizontal: 5,
                }}>
                <Image
                  source={icons.new_three_dot}
                  style={{width: 4, height: 14, tintColor: colors.white}}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{marginHorizontal: 17}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: hp(12),
            alignItems: 'center',
          }}>
          <Image
            source={images.happyMilanColorLogo}
            style={{
              width: wp(96),
              height: hp(24),
              resizeMode: 'contain',
              marginTop: hp(2),
            }}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            style={style.headerTopSheetImageContainer}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.headerTopSheetImageStyle}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: hp(33),
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 10,
          }}>
          <Text
            style={{
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins500,
              color: colors.black,
              textAlign: 'center',
            }}>
            {totalResults} Search Results
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SearchFilterScreen');
            }}
            activeOpacity={0.5}
            style={{
              width: hp(28),
              height: hp(28),
              borderWidth: 1,
              borderColor: '#CCCCCC',
              borderRadius: 7,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              right: 2,
            }}>
            <Image
              source={icons.filter_icon}
              style={{width: hp(20), height: hp(20), resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{marginTop: hp(10)}}>
        {isListData ? (
          <FlatList
            data={data?.data[0]?.paginatedResults || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderListData}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            )}
            contentContainerStyle={{paddingBottom: hp(150)}}
          />
        ) : isSingleUserData ? (
          <FlatList
            data={data?.data[0]?.paginatedResults || data?.data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderSingleUserData}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            )}
            contentContainerStyle={{paddingBottom: hp(120)}}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        )}
      </View>

      {/* Bottom Sheet */}
      <RBSheet
        ref={sheetRef}
        height={hp(150)} // Height of the bottom sheet
        // openDuration={250} // Duration of the opening animation
        closeOnDragDown={true} // Allow closing the sheet by dragging it down
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        {/* Content inside the bottom sheet */}
        <View style={{flex: 1}}>
          {/*<Text style={{fontSize: 18}}>First Name: {selectedFirstName}</Text>*/}

          <View style={{marginHorizontal: 30, marginTop: 20}}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Image
                source={icons.share_icon}
                style={{
                  width: hp(17),
                  height: hp(17),
                  resizeMode: 'contain',
                  marginRight: hp(22),
                }}
              />
              <Text
                style={{
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  color: colors.black,
                }}>
                Share Profile
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: hp(20),
              }}>
              <Image
                source={icons.copy_icon}
                style={{
                  width: hp(17),
                  height: hp(17),
                  resizeMode: 'contain',
                  marginRight: hp(22),
                }}
              />
              <Text
                style={{
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  color: colors.black,
                }}>
                Copy URL
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userName: {
    fontSize: fontSize(18),
    color: colors.black,
    fontFamily: fontFamily.poppins500,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
});

export default SearchUserDataScreen;
