// import React from 'react';
// import {SafeAreaView, Text} from 'react-native';
//
// const MatchesInNewScreen = () => {
//   return (
//     <SafeAreaView>
//       <Text>NEw</Text>
//     </SafeAreaView>
//   );
// };
//
// export default MatchesInNewScreen;

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  ActivityIndicator,
  View,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useSelector} from 'react-redux';
import {icons, images} from '../../../assets';
import style from '../../../screen/matchesScreen/style';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesInNewScreen = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;

  // console.log(' === var ===> ', accessToken);

  const openModal = () => {
    setModalVisible(true);
    setStep(1); // Reset step to 1 when modal opens
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Function to fetch data from the API
  const fetchData = async (pageNumber = 1) => {
    if (!hasMoreData) {
      return;
    }

    try {
      console.log('Fetching data for page:', pageNumber);

      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/user/getUserByGender?page=${pageNumber}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      const json = await response.json();
      // console.log('API response:', json);

      const newData = json?.data[0]?.paginatedResults || [];

      if (newData.length === 0) {
        console.log('No data found for this page.');
        setHasMoreData(false);
      } else {
        setData(prevData => [...prevData, ...newData]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data. Please try again.');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const loadMoreData = () => {
    if (!isFetchingMore && hasMoreData) {
      setIsFetchingMore(true);
      setPage(prevPage => {
        const nextPage = prevPage + 1;
        fetchData(nextPage);
        return nextPage;
      });
    }
  };

  const renderUserItem = ({item}) => {
    const userAllImage = Array.isArray(item?.userProfilePic)
      ? item.userProfilePic.map(pic => pic.url)
      : [];

    const profileImage = item.profilePic;
    const birthTime = item.birthTime;
    const currentCity = item.address?.currentCity;
    const currentCountry = item.address?.currentCountry;
    const JobTittle = item.userProfessional?.jobTitle;
    const workCity = item.userProfessional?.workCity;
    const workCountry = item.userProfessional?.workCountry;

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

    const handlePress = () => {
      const matchesUserData = {
        userAllImage,
        profileImage,
        birthTime,
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
      };

      // console.log('User Data:', matchesUserData);

      // Navigate to UserDetailsScreen
      navigation.navigate('UserDetailsScreen', {matchesUserData});
    };

    return (
      <View style={{marginHorizontal: 17}}>
        <TouchableOpacity activeOpacity={1}>
          <View>
            {/*<Image source={item.image} style={style.userImageStyle} />*/}
            <Image
              source={
                profileImage ? {uri: profileImage} : images.empty_male_Image
              }
              style={style.userImageStyle}
              resizeMode={'cover'}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
              style={style.gradient}
            />

            <View style={style.UserDetailsContainer}>
              <View style={style.onlineBodyStyle}>
                <Text style={style.bodyTextStyle}>Online</Text>
              </View>

              <TouchableOpacity
                // onPress={() => {
                //   // navigation.navigate('UserDetailsScreen');
                //
                // }}
                onPress={handlePress}>
                {/*<Text style={style.userNameTextStyle}>{item.name}</Text>*/}
                <Text style={style.userNameTextStyle}>
                  {item.firstName || item.name} {item.lastName || ' '}
                </Text>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>{item.gender}</Text>
                  <Text style={style.userDetailsTextStyle}>
                    {age || 'N/A'},
                  </Text>
                  <Text style={style.userDetailsTextStyle}>{item.height}</Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>
                    {currentCity || ' N/A'}
                  </Text>
                  <Text style={style.userDetailsTextStyle}>{item.cast}</Text>
                </View>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>
                    {JobTittle || 'N/A'}
                  </Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}> {'N/A'}</Text>
                  <Text style={style.userDetailsTextStyle}>
                    {workCity || 'N/A'}
                  </Text>
                  <Text style={style.userDetailsTextStyle}>
                    {workCountry || 'N/A'}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={{marginTop: hp(22), flexDirection: 'row'}}>
                <Image
                  source={images.gradient_button_background_img}
                  style={{width: wp(105), height: hp(24), resizeMode: 'cover'}}
                />
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={openModal}
                  style={{
                    position: 'absolute',
                    left: 10,
                    top: 5,
                    flexDirection: 'row',
                    justifyContent: 'center',
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
                    right: 50,
                    alignItems: 'center',
                    top: 1,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => {
                      navigation.navigate('UserUploadImageFullScreen');
                    }}>
                    <Image
                      source={icons.image_icon}
                      style={{
                        width: 16,
                        height: 16,
                        resizeMode: 'contain',
                        marginRight: wp(14),
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity activeOpacity={0.5}>
                    <Image
                      source={icons.starIcon}
                      style={{width: 20, height: 16, resizeMode: 'contain'}}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading && page === 1) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        {/*<ActivityIndicator size="large" color="#0000ff" />*/}
        <View style={{height: hp(449), marginHorizontal: 17}}>
          <ShimmerPlaceholder
            style={{
              width: '100%',
              height: hp(449),
              borderRadius: 10,
              marginBottom: hp(13),
            }}
          />
          <View style={{marginTop: -180, marginHorizontal: 17}}>
            <ShimmerPlaceholder style={{width: 100, height: 20}} />

            <View style={{marginTop: 10}}>
              <ShimmerPlaceholder style={{width: 100, height: 5}} />
            </View>

            <View style={{marginTop: 50, flexDirection: 'row'}}>
              <ShimmerPlaceholder
                style={{
                  width: wp(142),
                  height: hp(40),
                  justifyContent: 'center',
                  marginRight: 40,
                }}
              />
              <ShimmerPlaceholder
                style={{
                  width: wp(142),
                  height: hp(40),
                  justifyContent: 'center',
                  marginRight: 40,
                }}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderUserItem}
        keyExtractor={item => item._id || item.id || item.name}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        showsVerticalScrollIndicator={false}
        // ListFooterComponent={isFetchingMore ? <ActivityIndicator /> : null}
        ListFooterComponent={
          isFetchingMore ? (
            <View style={{alignItems: 'center'}}>
              <Text style={{color: 'black'}}>Loading Data..</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading && !isFetchingMore ? (
            <View style={styles.emptyListContainer}>
              <Text style={{color: 'black'}}>No data available</Text>
            </View>
          ) : null
        }
        contentContainerStyle={styles.listContainer} // Added this line
      />

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        {/*<TouchableWithoutFeedback onPress={closeModal}>*/}

        <View style={style.modalContainer}>
          <View style={style.modalBodyStyle}>
            <View style={style.modalTittleContainer}>
              <Text style={style.tittleTextModal}>
                Your Match :<Text style={style.tittleTextNum}> 85%</Text>
              </Text>

              <TouchableOpacity
                style={style.cancelIconContainer}
                onPress={closeModal}>
                <Image source={icons.x_cancel_icon} style={style.cancelIcon} />
              </TouchableOpacity>
            </View>

            <View style={style.matchImageContainer}>
              <Image
                source={images.profileDisplayImage}
                style={style.firstImageStyle}
              />

              <Image
                source={images.demo_Five_Image}
                style={style.secondImageStyle}
              />
            </View>

            <View style={style.matchNameContainer}>
              <Image source={icons.couple_icon} style={style.coupleIcon} />

              <Text style={style.matchName}>You & Rohan Matched</Text>
            </View>

            <View style={style.underLineStyle} />

            <Text style={style.modalBodyDescription}>
              Based on Your Partner Preference
            </Text>

            <View style={style.modalBodyContainer}>
              {step === 1 && (
                <>
                  <Text style={style.tittleTextStyle}>Religion</Text>

                  <View style={style.subTittleContainer}>
                    <Text style={style.subTittleText}>Hindu</Text>

                    <Image
                      source={icons.check_gradient_icon}
                      style={style.checkIcon}
                    />
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Height</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>4.5 to 5.3ft</Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Age</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>27 - 34</Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Weight</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>52 to 68 kg</Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>
                </>
              )}

              {step === 2 && (
                <>
                  <Text style={style.tittleTextStyle}>Caste</Text>

                  <View style={style.subTittleContainer}>
                    <Text style={style.subTittleText}>Patel</Text>

                    <Image
                      source={icons.check_gradient_icon}
                      style={style.checkIcon}
                    />
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Sub Caste</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
                        Kadava Patidar, Leva Patidar
                      </Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Prefer City</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
                        Delhi, Mumbai, New Your
                      </Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Prefer Country</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>India, USA, UK</Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>
                </>
              )}

              {step === 3 && (
                <>
                  <Text style={style.tittleTextStyle}>Degree</Text>

                  <View style={style.subTittleContainer}>
                    <Text style={style.subTittleText}>BCA, Bsc, MBA</Text>

                    <Image
                      source={icons.check_gradient_icon}
                      style={style.checkIcon}
                    />
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Profession</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
                        Software, Medical Officer
                      </Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Annual Income</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>10 to 35 lac</Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Job Type</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
                        Government, Private
                      </Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>
                </>
              )}

              {step === 4 && (
                <>
                  <Text style={style.tittleTextStyle}>Prefer Diet</Text>

                  <View style={style.subTittleContainer}>
                    <Text style={style.subTittleText}>Vegetarian, All</Text>

                    <Image
                      source={icons.check_gradient_icon}
                      style={style.checkIcon}
                    />
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Creative</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
                        Writing, Painting, Reading
                      </Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>

                  <View style={style.subTittleUpperContainer}>
                    <Text style={style.tittleTextStyle}>Fun</Text>

                    <View style={style.subTittleContainer}>
                      <Text style={style.subTittleText}>
                        Watching Movie, Traveling
                      </Text>

                      <Image
                        source={icons.check_gradient_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>

            <View style={style.modalBottomNavigationContainer}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleBack}
                disabled={step === 1}
                style={style.previousBackIconContainer}>
                <Image
                  source={icons.rightSideIcon}
                  style={[
                    style.previousBackIcon,
                    {tintColor: step === 1 ? '#E4E4E4' : 'black'},
                  ]}
                />
              </TouchableOpacity>

              <View style={style.bottomPagination}>
                {[1, 2, 3, 4].map(item => (
                  <TouchableOpacity
                    key={item}
                    onPress={() => setStep(item)}
                    style={[
                      style.bottomPaginationStyle,
                      {backgroundColor: step === item ? '#0F52BA' : '#ECECEC'},
                    ]}
                  />
                ))}
              </View>

              <TouchableOpacity
                onPress={handleNext}
                disabled={step === 4}
                style={style.nextIconContainer}>
                <Image
                  source={icons.rightSideIcon}
                  style={[
                    style.nextIcon,
                    {tintColor: step === 4 ? '#E4E4E4' : 'black'},
                  ]}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/*</TouchableWithoutFeedback>*/}
      </Modal>
    </SafeAreaView>
  );
};

// Styling
const styles = StyleSheet.create({
  container: {
    // flex: 1, // Ensures the SafeAreaView takes up full height
  },
  loadingContainer: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  emptyListContainer: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  textContainer: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  gender: {
    fontSize: 14,
    color: '#555',
  },
  listContainer: {
    paddingBottom: 200, // Adjust this value for more or less space
  },
});

export default MatchesInNewScreen;
