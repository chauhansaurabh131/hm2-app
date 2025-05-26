import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  Alert,
  FlatList,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useSelector} from 'react-redux';
import {icons, images} from '../../assets';
import {style} from '../searchUserDataScreen/style';
import {fontSize, hp} from '../../utils/helpers';
import ProfileAvatar from '../../components/letterProfileComponent';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';

const Abc = ({route}) => {
  const {data} = route.params;
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  // console.log(' === var ===> ', user?.user?.id);

  const [searchUserData, setSearchUserData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchUserData(1);
  }, []);

  const fetchUserData = async (pageNumber = 1) => {
    if (!accessToken || isFetching) {
      return;
    }
    if (totalPages && pageNumber > totalPages) {
      return;
    }

    setIsFetching(true);

    const url = `https://stag.mntech.website/api/v1/user/search/search-user?page=${pageNumber}`;
    const requestBody = {
      minAge: data.minAge,
      maxAge: data.maxAge,
      maritalStatus: data.maritalStatus,
      religion: data.religion,
      motherTongue: data.motherTongue,
      minHeight: data.minHeight,
      maxHeight: data.maxHeight,
      currentCountry: data.currentCountry,
      state: [],
      currentCity: data.currentCity,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      const users = responseData?.data ?? [];

      if (pageNumber === 1) {
        setSearchUserData(users);
      } else {
        setSearchUserData(prev => [...prev, ...users]);
      }

      if (responseData?.totalPages) {
        setTotalPages(responseData.totalPages);
      }

      setPage(pageNumber);

      if (users.length === 0 || pageNumber >= responseData?.totalPages) {
        console.log('No more data. Stopping further API calls.');
        setTotalPages(pageNumber); // Lock further fetches
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch user data.');
    } finally {
      setIsFetching(false);
    }
  };

  const loadMoreData = () => {
    if (!isFetching && (!totalPages || page < totalPages)) {
      fetchUserData(page + 1);
    }
  };

  const onThreeDotPress = item => {
    console.log(' === onThreeDotPress ===> ', item?._id);
    console.log(
      ' === onThreeDotPress_unfriend_id ===> ',
      item?.friendsDetails?._id,
    );
    // handleConfirmBlock(item?._id); // Call the API directly here
  };

  const SearchUserDataRenderItem = ({item}) => {
    // console.log(
    //   ' === SearchUserDataRenderItem___ ===> ',
    //   item?.friendsDetails?.status,
    // );

    const planName = item?.subscriptionDetails?.selectedPlan
      ? item?.subscriptionDetails?.selectedPlan.charAt(0).toUpperCase() +
        item?.subscriptionDetails?.selectedPlan.slice(1).toLowerCase()
      : '';

    const hasValidImage =
      item.profilePic &&
      item.profilePic !== 'null' &&
      item.profilePic.trim() !== '';

    const profilePrivacy =
      item.privacySettingCustom?.profilePhotoPrivacy === true ||
      item.privacySettingCustom?.showPhotoToFriendsOnly === true;

    const {selectedPlan, status} = item?.subscriptionDetails || {};

    // Determine if the selected plan is 'gold' (for the crown icon)
    const isGoldPlan = selectedPlan === 'gold';
    const isSilverPlan = selectedPlan === 'silver';
    const isPlatinumPlan = selectedPlan === 'Platinum';

    const subPlan = isGoldPlan || isSilverPlan || isPlatinumPlan;

    const starIconSource = item?.userShortListDetails?.id
      ? icons.black_check_icon // Check icon if shortlisted
      : icons.black_start_icon; // Star icon if not shortlisted

    // console.log(' === uniqueId ===> ', item?.userUniqueId);

    const userUniqueId = item?.userUniqueId;

    const name = item.name
      ? item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()
      : '';

    const friendStatusData = item?.friendsDetails?.status;

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

    return (
      <View style={style.flatListContainer}>
        {/*<Image*/}
        {/*  source={*/}
        {/*    item.profilePic ? {uri: item.profilePic} : images.empty_male_Image*/}
        {/*  }*/}
        {/*  style={style.flatListImageBody}*/}
        {/*  resizeMode={'cover'}*/}
        {/*/>*/}

        {hasValidImage ? (
          <>
            <Image
              source={{uri: item.profilePic}}
              style={style.flatListImageBody}
            />
            {profilePrivacy && item?.friendsDetails?.status !== 'accepted' && (
              <Image
                source={icons.logLogo} // make sure you have a `lock` icon inside `icons`
                style={{
                  position: 'absolute',
                  tintColor: '#fff',
                  resizeMode: 'contain',
                  width: hp(33),
                  height: hp(44),
                  alignSelf: 'center',
                  marginTop: hp(200),
                }}
              />
            )}
          </>
        ) : (
          <>
            <ProfileAvatar
              firstName={item.firstName || item.name}
              lastName={item.lastName}
              textStyle={{
                width: '100%',
                height: hp(449),
                borderRadius: 18,
                marginBottom: hp(13),
              }}
              profileTexts={{fontSize: fontSize(60), marginTop: -80}}
            />
          </>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
          style={style.imageBottomShadow}
        />
        <View style={style.imageBodyDetailContainer}>
          <View style={style.onlineTextBody}>
            <Text style={style.onlineText}>Online</Text>
          </View>

          <TouchableOpacity>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={style.nameText}>{name || 'No Name Available'}</Text>
              {subPlan && (
                <View
                  style={{
                    height: 22,
                    backgroundColor: 'orange',
                    marginLeft: 11,
                    borderRadius: 50,
                    flexDirection: 'row',
                    paddingHorizontal: 7,
                  }}>
                  <Image
                    source={icons.crownIcon}
                    style={{
                      width: 11,
                      height: 11,
                      tintColor: 'white',
                      alignSelf: 'center',
                      resizeMode: 'contain',
                    }}
                  />
                  <Text
                    style={{
                      color: 'white',
                      fontSize: fontSize(12),
                      fontWeight: 'bold',
                      alignSelf: 'center',
                      marginLeft: 3,
                    }}>
                    {planName}
                  </Text>
                </View>
              )}
            </View>

            <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={style.userAge}>{age || 'N/A'} yrs,</Text>
              <Text style={style.userHeightStyle}>{item?.height}</Text>

              <View style={style.verticalLineStyle} />

              <Text style={style.jobTittleText}>{jobTitle || 'N/A'}</Text>
            </View>

            <View style={style.userAddressDetailsContainer}>
              <Text style={style.currentCityStyle}>
                {currentCity || 'N/A'},
              </Text>

              <Text style={style.currentCountryStyle}>
                {' '}
                {currentCountry || 'N/A'}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={style.imageBottomImageContainer}>
            <Image
              source={images.gradient_button_background_img}
              style={style.gradientImageContainer}
            />
            <TouchableOpacity
              activeOpacity={0.5}
              // onPress={openModal}
              style={style.gradientImageButton}>
              <Image source={icons.couple_icon} style={style.coupleImage} />
              <Text style={style.matchesText}>
                {/*85% Match*/}
                {item?.matchPercentage}% Match
              </Text>
            </TouchableOpacity>

            <View style={style.bottomImageContainer}>
              {(!profilePrivacy ||
                item?.friendsDetails?.status === 'accepted') && (
                <TouchableOpacity
                  style={style.cameraImageContainer}
                  activeOpacity={0.5}>
                  <Image
                    source={icons.new_camera_icon}
                    style={style.cameraImage}
                  />
                  <Text style={{color: colors.white}}>{imageCount}</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                activeOpacity={0.5}
                style={style.starIconContainer}>
                <Image source={starIconSource} style={style.startIcon} />
              </TouchableOpacity>

              <TouchableOpacity
                style={style.threeDotContainer}
                onPress={() => {
                  onThreeDotPress(item);
                }}>
                <Image
                  source={icons.new_three_dot}
                  style={style.threeDotImage}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList
        data={searchUserData}
        keyExtractor={item => item._id}
        renderItem={SearchUserDataRenderItem}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetching ? (
            <View style={{alignItems: 'center', padding: 20}}>
              <Text style={{color: 'black'}}>Loading more...</Text>
            </View>
          ) : !isFetching && searchUserData.length === 0 ? (
            <View style={{alignItems: 'center', padding: 20}}>
              <Text style={{color: 'gray'}}>No user found.</Text>
            </View>
          ) : page >= totalPages && searchUserData.length > 0 ? (
            <View style={{alignItems: 'center', padding: 20}}>
              <Text style={{color: 'gray'}}>No more data to load.</Text>
            </View>
          ) : null
        }
      />
    </SafeAreaView>
  );
};

export default Abc;
