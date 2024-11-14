import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import style from './style';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import LinearGradient from 'react-native-linear-gradient';
import {useDispatch, useSelector} from 'react-redux';
import {
  accepted_Decline_Request,
  getAllRequest,
  userDatas,
} from '../../actions/homeActions';
import {USER_LIST} from '../../utils/data';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {getAllDeclineFriend, getAllFriends} from '../../actions/chatActions';
import {it} from '@jest/globals';
import DatingHomeScreen from '../DatingHomeScreen';
import DemoNewPagination from '../../components/demoNewPagination';
import MatchesInNewScreen from '../matchesAllScreen/matchesInNewScreen';
import MatchesInAcceptedScreen from '../matchesAllScreen/matchesInAcceptedScreen';
import MatchesInBlockedScreen from '../matchesAllScreen/matchesInBlockedScreen';
import MatchesInSavedScreen from '../matchesAllScreen/matchesInSavedScreen';
import MatchesInSentScreen from '../matchesAllScreen/matchesInSentScreen';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesScreen = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState('new');
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [userActions, setUserActions] = useState({});
  const [requestStatus, setRequestStatus] = useState(null);

  // const [currentPage, setCurrentPage] = useState(1);
  // const [users, setUsers] = useState([]); // Store combined users here
  // const [loadingMore, setLoadingMore] = useState(false); // Track if loading more data
  //
  // const totalPages = userData?.data?.[0]?.totalPages || 1;
  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;

  useEffect(() => {
    dispatch(getAllRequest());
    dispatch(getAllDeclineFriend());
    // dispatch(getAllFriends());
    dispatch(userDatas({page: 1}));
  }, [dispatch]);

  // useEffect(() => {
  //   dispatch(userDatas({page: 1})); // Load the first page on mount
  // }, []);
  //
  // useEffect(() => {
  //   if (userData?.data?.[0]?.paginatedResults) {
  //     if (currentPage === 1) {
  //       // On the first page, replace users
  //       setUsers(userData.data[0].paginatedResults);
  //     } else {
  //       // On subsequent pages, append users
  //       setUsers(prevUsers => [
  //         ...prevUsers,
  //         ...userData.data[0].paginatedResults,
  //       ]);
  //     }
  //     setLoadingMore(false); // Stop loading after data is appended
  //   }
  // }, [userData]);

  // const loadMoreData = () => {
  //   if (currentPage < totalPages && !loadingMore) {
  //     setLoadingMore(true); // Start loading more
  //     const nextPage = currentPage + 1;
  //     setCurrentPage(nextPage); // Increment the current page
  //     dispatch(userDatas({page: nextPage})); // Fetch the next page
  //   }
  // };

  // const renderFooter = () => {
  //   return (
  //     <View>
  //       {loadingMore ? (
  //         <View style={{paddingVertical: 20, alignItems: 'center'}}>
  //           <ActivityIndicator size="large" color="#0000ff" />
  //         </View>
  //       ) : (
  //         // Add an empty view with margin for extra space when loading is finished
  //         <View style={{height: 150}} />
  //       )}
  //     </View>
  //   );
  // };

  const dispatch = useDispatch();

  const {getAllRequestData, isFriendRequestDataLoading} = useSelector(
    state => state.home,
  );

  // console.log(' === userData/////// ===> ', userData?.data[0].paginatedResults);

  const {declineFriends, myAllFriends, isUserDataLoading} = useSelector(
    state => state.chat,
  );

  const friends = myAllFriends.data?.results || [];

  // console.log(' === friends.... ===> ', friends);

  const tabsData = [
    {id: 'new', label: 'New'},
    {id: 'accepted', label: 'Accepted'},
    {id: 'receive', label: 'Received'},
    {id: 'saved', label: 'Saved'},
    {id: 'sent', label: 'Sent'},
    {id: 'declined', label: 'Declined'},
    // {id: 'deleted', label: 'Deleted'},
    {id: 'blocked', label: 'Blocked'},
  ];

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

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  const handleDecline = (requestId, userId) => {
    // setUserActions(prevActions => ({...prevActions, [requestId]: 'declined'}));
    setRequestStatus('declined');
    dispatch(
      accepted_Decline_Request({
        user: userId,
        request: requestId,
        status: 'rejected',
      }),
    );
  };

  const handleAccept = (requestId, userId) => {
    console.log(' === requestId, userId ===> ', requestId, userId);
    // setUserActions(prevActions => ({...prevActions, [requestId]: 'accepted'}));
    setRequestStatus('accepted');
    dispatch(
      accepted_Decline_Request({
        user: userId,
        request: requestId,
        status: 'accepted',
      }),
    );
  };
  // USER REQUEST LIST RENDER ITEM //
  const renderUserRequestItem = ({item}) => {
    // console.log(' === renderUserRequestItem ===> ', item);

    // Ensure 'user' and its properties are defined before destructuring
    const user = item?.user || {};
    const {id, _id} = item; // Destructure `id` and `_id` from `item`

    // Destructure with default values to prevent undefined or null errors
    const {
      firstName = 'N/A',
      lastName = 'N/A',
      profilePic = null,
      address = {},
      gender = 'N/A',
      dateOfBirth = null,
      userProfessional = {},
      motherTongue = 'N/A',
      cast = 'N/A',
    } = user;

    console.log(' === userProfessional ===> ', user?.userProfilePic);

    const userAllImage = Array.isArray(user?.userProfilePic)
      ? user?.userProfilePic.map(pic => pic.url)
      : [];

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    const imageCount = Array.isArray(user?.userProfilePic)
      ? user?.userProfilePic.length
      : 0;

    const firstNames = firstName
      ? firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
      : '';

    const lastNames = lastName
      ? lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()
      : '';

    const CurrentCity = user?.address?.currentCity
      ? user?.address?.currentCity.charAt(0).toUpperCase() +
        user?.address?.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = user?.address?.currentCountry
      ? user?.address?.currentCountry.charAt(0).toUpperCase() +
        user?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    const userId = item?.friend?.address?.userId;

    const jobTitle = userProfessional?.jobTitle || 'N/A';
    const workCountry = userProfessional?.workCountry || 'N/A';

    const calculateAge = dob => {
      if (!dob) {
        return 'N/A';
      } // Handle missing date of birth
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const age = calculateAge(dateOfBirth);
    const height = user?.height || 'N/A';

    return (
      <View>
        <View style={style.renderContainer}>
          <TouchableOpacity activeOpacity={1}>
            <View>
              <Image
                source={
                  profilePic ? {uri: profilePic} : images.empty_male_Image
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
                  onPress={() => {
                    // navigation.navigate('UserDetailsScreen');
                  }}>
                  <Text style={style.userNameTextStyle}>
                    {firstNames} {lastNames}
                  </Text>

                  <View
                    style={[
                      style.userDetailsDescriptionContainer,
                      {marginTop: 3},
                    ]}>
                    {/*<Text style={style.userDetailsTextStyle}>{gender}</Text>*/}
                    <Text style={style.userDetailsTextStyle}>{age} yrs,</Text>
                    <Text style={style.userDetailsTextStyle}>{height}</Text>

                    <View style={style.verticalLineStyle} />

                    <Text style={style.userDetailsTextStyle}>{jobTitle}</Text>
                  </View>

                  <View style={style.userDetailsDescriptionContainer}>
                    <Text style={style.userDetailsTextStyle}>
                      {CurrentCity},
                    </Text>

                    <Text style={style.userDetailsTextStyle}>
                      {' '}
                      {currentCountry}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/*<View style={style.RenderBottomImageContainer}>*/}
                {/*  <TouchableOpacity>*/}
                {/*    <Image source={icons.image_icon} style={style.imageStyle} />*/}
                {/*  </TouchableOpacity>*/}

                {/*  <TouchableOpacity>*/}
                {/*    <Image source={icons.video_icon} style={style.videoStyle} />*/}
                {/*  </TouchableOpacity>*/}

                {/*  <TouchableOpacity style={style.starImageContainer}>*/}
                {/*    <Image*/}
                {/*      source={icons.starIcon}*/}
                {/*      style={style.startImageStyle}*/}
                {/*    />*/}
                {/*  </TouchableOpacity>*/}
                {/*</View>*/}

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
                      width: wp(105),
                      height: hp(30),
                      resizeMode: 'stretch',
                      borderRadius: 50, // Adjust the radius as needed
                      overflow: 'hidden', // Ensure rounded corners clip the image
                    }}
                  />
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={openModal}
                    style={{
                      position: 'absolute',
                      left: 10,
                      // top: 12,
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
                      // onPress={onThreeDotPress}
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
          </TouchableOpacity>
        </View>

        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 15,
          }}>
          {requestStatus === 'declined' ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins500,
                  color: colors.black,
                  marginRight: 15,
                }}>
                Declined Request
              </Text>
              <Image
                source={icons.matched_declined_icon}
                tintColor={'#BE6D6B'}
                style={{width: hp(22), height: hp(22), resizeMode: 'contain'}}
              />
            </View>
          ) : requestStatus === 'accepted' ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins500,
                  color: colors.black,
                  marginRight: 15,
                }}>
                Accepted Request
              </Text>
              <Image
                source={icons.matches_accp_icon}
                tintColor={'#17C270'}
                style={{width: hp(22), height: hp(22), resizeMode: 'contain'}}
              />
            </View>
          ) : (
            <>
              <Text
                style={{
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins500,
                  color: colors.black,
                }}>
                Want to accept?
              </Text>

              <TouchableOpacity onPress={() => handleAccept(id || _id, userId)}>
                <Image
                  source={icons.received_accept_icon}
                  style={{
                    width: hp(63),
                    height: hp(40),
                    resizeMode: 'contain',
                    marginRight: 15,
                    marginLeft: 18,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDecline(id || _id, userId)}>
                <Image
                  source={icons.received_declined_icon}
                  style={{width: hp(63), height: hp(40), resizeMode: 'contain'}}
                />
              </TouchableOpacity>
            </>
          )}
        </View>

        <View
          style={{
            width: '100%',
            borderColor: '#E8E8E8',
            borderWidth: 0.7,
            marginTop: 23,
            marginBottom: 23,
          }}
        />
      </View>
    );
  };

  const renderUserDeclineItem = ({item}) => {
    // console.log(
    //   ' === renderUserDeclineItem ===> ',
    //   item.friend?.userProfilePic,
    // );
    const {friend, id} = item || {};
    const {
      firstName = 'N/A',
      lastName = 'N/A',
      profilePic,
      dateOfBirth,
    } = friend || {};

    const firstNames = firstName
      ? firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase()
      : '';

    const lastNames = lastName
      ? lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()
      : '';

    const jobTitle = item.friend?.userProfessional?.jobTitle
      ? item.friend?.userProfessional?.jobTitle.charAt(0).toUpperCase() +
        item.friend?.userProfessional?.jobTitle.slice(1).toLowerCase()
      : '';

    const companyName = item.friend?.userProfessional?.companyName
      ? item.friend?.userProfessional?.companyName.charAt(0).toUpperCase() +
        item.friend?.userProfessional?.companyName.slice(1).toLowerCase()
      : '';

    const currentCity = item.friend?.address?.currentCity
      ? item.friend?.address?.currentCity.charAt(0).toUpperCase() +
        item.friend?.address?.currentCity.slice(1).toLowerCase()
      : '';

    const workCountry = item.friend?.address?.currentCountry
      ? item.friend?.address?.currentCountry.charAt(0).toUpperCase() +
        item.friend?.address?.currentCountry.slice(1).toLowerCase()
      : '';

    const calculateAge = dob => {
      if (!dob) {
        return 'N/A';
      }
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const age = calculateAge(dateOfBirth);
    const height = friend?.height || 'N/A';

    const imageCount = Array.isArray(item.friend?.userProfilePic)
      ? item.friend?.userProfilePic.length
      : 0;

    const userAllImage = Array.isArray(item.friend?.userProfilePic)
      ? item.friend?.userProfilePic.map(pic => pic.url)
      : [];

    const userAllImageShare = () => {
      const allImages = {
        userAllImage,
      };
      // console.log(' === userAllImage ===> ', userAllImage);
      navigation.navigate('UserUploadImageFullScreen', {allImages});
    };

    return (
      <View>
        <View style={style.renderContainer}>
          <TouchableOpacity activeOpacity={1}>
            <View>
              <Image
                source={
                  profilePic ? {uri: profilePic} : images.empty_male_Image
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
                  onPress={() => {
                    navigation.navigate('UserDetailsScreen');
                  }}>
                  <Text style={style.userNameTextStyle}>
                    {firstNames} {lastNames}
                  </Text>

                  <View style={style.userDetailsDescriptionContainer}>
                    <Text style={style.userDetailsTextStyle}>
                      {age || 'N/A'} yrs,
                    </Text>
                    <Text style={style.userDetailsTextStyle}>
                      {' '}
                      {height || 'N/A'}
                    </Text>

                    <View style={style.verticalLineStyle} />

                    <Text style={style.userDetailsTextStyle}>
                      {jobTitle || 'N/A'} at {companyName || 'N/A'}
                    </Text>
                  </View>

                  <View style={style.userDetailsDescriptionContainer}>
                    <Text style={style.userDetailsTextStyle}>
                      {currentCity || 'N/A'},{' '}
                    </Text>
                    <Text style={style.userDetailsTextStyle}>
                      {workCountry || 'N/A'}
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
                      width: wp(105),
                      height: hp(30),
                      resizeMode: 'stretch',
                      borderRadius: 50, // Adjust the radius as needed
                      overflow: 'hidden',
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
                      // onPress={onThreeDotPress}
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
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: hp(10),
                marginBottom: hp(25),
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins500,
                  marginRight: hp(15),
                }}>
                Declined Request
              </Text>
              <Image
                source={icons.matched_declined_icon}
                style={{tintColor: '#BE6D6B', height: hp(22), width: hp(22)}}
              />
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            borderWidth: 0.7,
            borderColor: '#E8E8E8',
            marginBottom: hp(23),
          }}
        />
      </View>
    );
  };

  // TOP LIST DATA SHOW //
  const renderTabItem = ({item}) => {
    // Map each tab to a different image
    const getImageForTab = id => {
      switch (id) {
        case 'new':
          return icons.matches_new_icon; // Replace with your actual image reference for "New"
        case 'accepted':
          return icons.matches_accp_icon; // Replace with your actual image reference for "Accepted"
        case 'receive':
          return icons.matches_received_icon; // Replace with your actual image reference for "Received"
        case 'saved':
          return icons.starIcon; // Replace with your actual image reference for "Saved"
        case 'sent':
          return icons.matches_sent_icon; // Replace with your actual image reference for "Sent"
        case 'declined':
          return icons.matched_declined_icon; // Replace with your actual image reference for "Declined"
        // case 'deleted':
        //   return icons.delete_Profile_icon; // Replace with your actual image reference for "Deleted"
        case 'blocked':
          return icons.block_icon; // Replace with your actual image reference for "Blocked"
        default:
          return images.user_Three_Image; // Fallback image if none matches
      }
    };

    const getImageStyleForTab = id => {
      switch (id) {
        case 'new':
          return {
            width: hp(14),
            height: hp(14),
            marginRight: 15,
            resizeMode: 'contain',
          };
        case 'accepted':
          return {
            width: hp(14),
            height: hp(14),
            marginRight: 10,
            resizeMode: 'contain',
          };
        case 'receive':
          return {
            width: hp(17),
            height: hp(14),
            marginRight: 10,
            resizeMode: 'contain',
          };
        case 'saved':
          return {
            width: hp(14.73),
            height: hp(14),
            marginRight: 10,
            resizeMode: 'contain',
            top: -2,
          };
        case 'sent':
          return {
            width: hp(15.42),
            height: hp(13),
            marginRight: 10,
            resizeMode: 'contain',
          };
        case 'declined':
          return {
            width: hp(14),
            height: hp(14),
            marginRight: 10,
            resizeMode: 'contain',
          };
        // case 'deleted':
        //   return {
        //     width: hp(19.21),
        //     height: hp(14),
        //     marginRight: 10,
        //     resizeMode: 'contain',
        //   };
        case 'blocked':
          return {
            width: hp(14),
            height: hp(14),
            marginRight: 10,
            resizeMode: 'contain',
          };
        case 'Demo':
          return {width: 27, height: 27};
        default:
          return {width: 24, height: 24};
      }
    };

    const imageSource = getImageForTab(item.id);
    const imageStyle = getImageStyleForTab(item.id);

    return (
      <TouchableOpacity onPress={() => handleTabPress(item.id)}>
        <LinearGradient
          colors={
            selectedTab === item.id
              ? ['#0F52BA', '#8225AF'] // Gradient when selected
              : ['#F9F9F9', '#F9F9F9'] // Default white background when not selected
          }
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0.7}}
          style={style.statusBarContainerStyle}>
          <Image
            source={imageSource} // Dynamically use the image based on the tab's id
            style={[
              imageStyle,
              {
                tintColor: selectedTab === item.id ? colors.white : '#5F6368',
              }, // Apply dynamic tintColor
            ]}
          />
          <Text
            style={[
              style.statusBarTittleTextStyle,
              {color: selectedTab === item.id ? colors.white : colors.black}, // Conditional text color
            ]}>
            {item.label}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  // USER NEW RENDER LIST //
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
                <TouchableOpacity
                  activeOpacity={0.5}
                  onPress={openModal}
                  style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={icons.couple_icon}
                    style={{
                      width: hp(16),
                      height: hp(14),
                      resizeMode: 'contain',
                    }}
                  />
                  <Text
                    style={{
                      color: '#FFA5F6',
                      marginLeft: 9,
                      fontSize: fontSize(12),
                      lineHeight: hp(18),
                      fontFamily: fontFamily.poppins500,
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
                      source={icons.video_icon}
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

  const renderAccptedUserItem = ({item}) => {
    const {friendList, id} = item;
    const {
      firstName,
      lastName,
      profilePic,
      address,
      gender,
      dateOfBirth,
      userProfessional,
      motherTongue,
      cast,
    } = friendList;

    const jobTitle = item.friendList?.userProfessional?.jobTitle;
    const workCountry = item.friendList?.userProfessional?.workCountry;

    const calculateAge = dob => {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };
    const age = calculateAge(dateOfBirth);

    const height = friendList.height || 'N/A';

    return (
      <View style={{marginHorizontal: 17}}>
        <TouchableOpacity activeOpacity={1}>
          <View>
            <Image
              source={
                profilePic
                  ? {uri: item.friendList.profilePic}
                  : images.empty_male_Image
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
                onPress={() => {
                  // navigation.navigate('UserDetailsScreen');
                }}>
                <Text style={style.userNameTextStyle}>
                  {firstName} {lastName}
                </Text>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>{gender}</Text>
                  <Text style={style.userDetailsTextStyle}>{age},</Text>
                  <Text style={style.userDetailsTextStyle}>{height}</Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>
                    {motherTongue || 'N/A'}
                  </Text>
                  <Text style={style.userDetailsTextStyle}>
                    {cast || 'N/A'}
                  </Text>
                </View>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>
                    {jobTitle || 'N/A'}
                  </Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>
                    {workCountry || 'N/A'}
                  </Text>
                  <Text style={style.userDetailsTextStyle}>
                    {item.state || 'N/A'}
                  </Text>
                  <Text style={style.userDetailsTextStyle}>
                    {item.country || 'N/A'}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={{marginTop: hp(22), flexDirection: 'row'}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    top: 1,
                    flex: 1,
                  }}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    // onPress={() => {
                    //   navigation.navigate('UserUploadImageFullScreen');
                    // }}
                  >
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
                      source={icons.video_icon}
                      style={{width: 20, height: 16, resizeMode: 'contain'}}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity style={{position: 'absolute', right: 40}}>
                    <Image
                      source={icons.starIcon}
                      style={{
                        width: hp(22),
                        height: hp(20),
                        resizeMode: 'contain',
                      }}
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

  const handleTabPress = tab => {
    setSelectedTab(tab);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'new':
        return (
          <View>
            {/*<FlatList*/}
            {/*  data={userData.data}*/}
            {/*  keyExtractor={item => item.id}*/}
            {/*  renderItem={renderUserItem}*/}
            {/*  showsVerticalScrollIndicator={false}*/}
            {/*  ListFooterComponent={<View style={{height: 130}} />}*/}
            {/*/>*/}
            <MatchesInNewScreen />
          </View>
        );
      case 'accepted':
        // <Text>Accepted</Text>;
        return (
          <View>
            {/*{isUserDataLoading ? (*/}
            {/*  <View style={style.receivedShimmerContainer}>*/}
            {/*    <ShimmerPlaceholder style={style.receivedShimmerImageBody} />*/}
            {/*    <View style={style.receivedShimmerImageBodyInside}>*/}
            {/*      <ShimmerPlaceholder style={style.receivedShimmerName} />*/}

            {/*      <View style={style.receivedShimmerInsideOne}>*/}
            {/*        <ShimmerPlaceholder style={style.receivedShimmerData} />*/}
            {/*      </View>*/}

            {/*      <View style={style.receivedShimmerButtonContainer}>*/}
            {/*        <ShimmerPlaceholder style={style.receivedShimmerButton} />*/}
            {/*        <ShimmerPlaceholder style={style.receivedShimmerButton} />*/}
            {/*      </View>*/}
            {/*    </View>*/}
            {/*  </View>*/}
            {/*) : myAllFriends?.data?.length === 0 ? (*/}
            {/*  <View*/}
            {/*    style={{*/}
            {/*      alignItems: 'center',*/}
            {/*      marginTop: hp(250),*/}
            {/*      justifyContent: 'center',*/}
            {/*    }}>*/}
            {/*    <Text*/}
            {/*      style={{*/}
            {/*        color: colors.gray,*/}
            {/*        fontSize: fontSize(21),*/}
            {/*        lineHeight: hp(26),*/}
            {/*      }}>*/}
            {/*      No friend requests*/}
            {/*    </Text>*/}
            {/*  </View>*/}
            {/*) : (*/}
            {/*  <FlatList*/}
            {/*    data={friends}*/}
            {/*    keyExtractor={item => item.friendList._id}*/}
            {/*    renderItem={renderAccptedUserItem}*/}
            {/*    showsVerticalScrollIndicator={false}*/}
            {/*    ListFooterComponent={<View style={{height: 130}} />}*/}
            {/*  />*/}
            {/*)}*/}
            <MatchesInAcceptedScreen />
          </View>
        );

      case 'receive':
        // return <Text>Receive</Text>;
        return (
          <View>
            {isFriendRequestDataLoading ? (
              <View style={style.receivedShimmerContainer}>
                <ShimmerPlaceholder style={style.receivedShimmerImageBody} />
                <View style={style.receivedShimmerImageBodyInside}>
                  <ShimmerPlaceholder style={style.receivedShimmerName} />

                  <View style={style.receivedShimmerInsideOne}>
                    <ShimmerPlaceholder style={style.receivedShimmerData} />
                  </View>

                  <View style={style.receivedShimmerButtonContainer}>
                    <ShimmerPlaceholder style={style.receivedShimmerButton} />
                    <ShimmerPlaceholder style={style.receivedShimmerButton} />
                  </View>
                </View>
              </View>
            ) : getAllRequestData?.data.length === 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: hp(250),
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: colors.gray,
                    fontSize: fontSize(21),
                    lineHeight: hp(26),
                  }}>
                  No friend requests
                </Text>
              </View>
            ) : (
              <FlatList
                data={getAllRequestData?.data}
                keyExtractor={item => item.id}
                renderItem={renderUserRequestItem}
                ListFooterComponent={<View style={{height: 130}} />}
              />
            )}
          </View>
        );
      case 'saved':
        // return <Text>Saved</Text>;
        return (
          <View>
            <MatchesInSavedScreen />
          </View>
        );
      case 'declined':
        // <Text>Declined</Text>;
        return (
          <View>
            {isUserDataLoading ? (
              <View style={style.receivedShimmerContainer}>
                <ShimmerPlaceholder style={style.receivedShimmerImageBody} />
                <View style={style.receivedShimmerImageBodyInside}>
                  <ShimmerPlaceholder style={style.receivedShimmerName} />

                  <View style={style.receivedShimmerInsideOne}>
                    <ShimmerPlaceholder style={style.receivedShimmerData} />
                  </View>

                  <View style={style.receivedShimmerButtonContainer}>
                    <ShimmerPlaceholder style={style.receivedShimmerButton} />
                    <ShimmerPlaceholder style={style.receivedShimmerButton} />
                  </View>
                </View>
              </View>
            ) : declineFriends?.data.length === 0 ? (
              <View
                style={{
                  alignItems: 'center',
                  marginTop: hp(250),
                  justifyContent: 'center',
                }}>
                <Image
                  source={icons.no_Profile_Found_img}
                  style={{width: hp(44), height: hp(44), resizeMode: 'contain'}}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(18),
                    lineHeight: hp(27),
                    fontFamily: fontFamily.poppins400,
                    marginTop: hp(12),
                  }}>
                  No friend requests
                </Text>
              </View>
            ) : (
              <FlatList
                data={declineFriends?.data}
                keyExtractor={item => item.id}
                renderItem={renderUserDeclineItem}
                ListFooterComponent={<View style={{height: 130}} />}
              />
            )}
          </View>
        );
      case 'sent':
        // return <Text>Sent</Text>;
        return (
          <View>
            <MatchesInSentScreen />
          </View>
        );
      // case 'deleted':
      //   return <Text>Deleted</Text>;
      case 'blocked':
        return (
          <View>
            {/*<Text>Blocked</Text>*/}
            <MatchesInBlockedScreen />
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <View style={style.headerContainerTittleStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderLogo}
          />

          <TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.profileLogoStyle}
            />
          </TouchableOpacity>
        </View>

        <HomeTopSheetComponent
          isVisible={topModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        />

        <View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={tabsData}
            renderItem={renderTabItem}
            keyExtractor={item => item.id}
            contentContainerStyle={style.flatListStatusBarStyle}
          />
        </View>
      </View>

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

      <View>{renderContent()}</View>
    </SafeAreaView>
  );
};

export default MatchesScreen;
