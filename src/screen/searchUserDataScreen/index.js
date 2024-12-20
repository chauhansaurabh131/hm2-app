import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  Image,
  View,
  TouchableOpacity,
  Alert,
  Share,
} from 'react-native';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {useSelector} from 'react-redux';
import {colors} from '../../utils/colors';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {style} from './style';

const SearchUserDataScreen = ({route}) => {
  const {data} = route.params; // Retrieve data from navigation params
  const navigation = useNavigation();
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;
  const sheetRef = useRef(null);
  const [selectedFirstName, setSelectedFirstName] = useState('');
  const [selectedUserUniqueId, setSelectedUserUniqueId] = useState('');

  console.log(' === data ===> ', data);

  const [singleUserData, setSingleUserData] = useState(null); // For single user fetched by ID
  const [searchUserData, setSearchUserData] = useState([]); // For multiple users fetched by search

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const closeBottomSheet = () => {
    sheetRef.current.close();
  };

  const ShowToast = () => {
    Toast.show({
      type: 'AddShortlisted',
      text1: 'Profile has been shortlisted',
      visibilityTime: 1000,
    });
  };

  const RemoveShortlisted = () => {
    Toast.show({
      type: 'RemoveShortlisted',
      text1: 'Shortlisted has been removed',
      visibilityTime: 1000,
    });
  };

  // Function to fetch user data by ID (single user)
  const fetchUserDataById = async userId => {
    try {
      const response = await axios.get(
        `https://stag.mntech.website/api/v1/user/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('User data fetched by ID:', response.data);
      // Set the single user data into the state
      setSingleUserData(response.data.data[0]); // Assuming the response has a 'data' field
    } catch (error) {
      console.error('Error fetching data by ID:', error);
      Alert.alert('Error', 'Failed to fetch user data by ID.');
    }
  };

  // Function to fetch user data via search query (multiple users)
  const fetchUserData = async () => {
    if (!accessToken) {
      console.error('No access token found');
      return;
    }

    const url = 'https://stag.mntech.website/api/v1/user/search/search-user';
    const requestBody = {
      minAge: data.minAge,
      maxAge: data.maxAge,
      maritalStatus: data.maritalStatus,
      religion: data.religion,
      motherTongue: data.motherTongue,
      minHeight: data.minHeight,
      maxHeight: data.maxHeight,
      currentCountry: data.currentCountry,
      state: [], // Assuming you will populate this field as needed
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

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const responseData = await response.json();
      console.log('API Response:', responseData);

      // Store the search results (multiple users)
      setSearchUserData(responseData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch user data.');
    }
  };

  // UseEffect to trigger the correct API call based on the type of 'data'
  useEffect(() => {
    if (accessToken) {
      if (data && data.length === 24) {
        // If the data is an ID (length 24 is common for MongoDB ObjectIds)
        fetchUserDataById(data); // Fetch user data by ID (single user)
      } else {
        fetchUserData(); // Fetch user data for the search query (multiple users)
      }
    }
  }, [accessToken, data]);

  // Function to add user to shortlist
  const addToShortlist = async shortlistId => {
    try {
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/shortlist/create-shortlist',
        {
          shortlistId: shortlistId,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('Shortlist created successfully:', response.data);
      // Re-fetch the user data after adding to shortlist
      // fetchUserData(); // Re-fetch the user data
      ShowToast();
      if (data && data.length === 24) {
        // If the data is an ID (length 24 is common for MongoDB ObjectIds)
        fetchUserDataById(data); // Fetch user data by ID (single user)
      } else {
        fetchUserData(); // Fetch user data for the search query (multiple users)
      }
    } catch (error) {
      console.error('Error adding to shortlist:', error);
      Alert.alert('Error', 'Failed to add to shortlist.');
    }
  };

  // Function to remove user from shortlist
  const removeFromShortlist = async shortlistId => {
    try {
      const response = await axios.delete(
        `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${shortlistId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('Shortlist removed successfully:', response.data);
      // Re-fetch the user data after removing from shortlist
      // fetchUserData(); // Re-fetch the user data
      RemoveShortlisted();
      if (data && data.length === 24) {
        // If the data is an ID (length 24 is common for MongoDB ObjectIds)
        fetchUserDataById(data); // Fetch user data by ID (single user)
      } else {
        fetchUserData(); // Fetch user data for the search query (multiple users)
      }
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      Alert.alert('Error', 'Failed to remove from shortlist.');
    }
  };

  const handleShare = async () => {
    // Close the bottom sheet before sharing
    closeBottomSheet();

    try {
      // You can add a slight delay to allow the bottom sheet to close first if necessary
      await new Promise(resolve => setTimeout(resolve, 50)); // Adjust delay as needed

      // Now trigger the Share dialog
      const result = await Share.share({
        // message: 'Happy Milan App', // Message to share
        message: selectedFirstName, // Message to share
        // title: selectedFirstName,
      });

      if (result.action === Share.sharedAction) {
        console.log('Content shared successfully');
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed');
      }
    } catch (error) {
      console.error('Error sharing content:', error);
    }
  };

  const renderItem = ({item}) => {
    const starIconSource = item?.userShortListDetails
      ? icons.black_check_icon // Check icon if shortlisted
      : icons.black_start_icon; // Star icon if not shortlisted

    const handlePress = () => {
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

    const currentCity = item?.address[0]?.currentCity
      ? item?.address[0]?.currentCity.charAt(0).toUpperCase() +
        item?.address[0]?.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item?.address[0]?.currentCountry
      ? item?.address[0]?.currentCountry.charAt(0).toUpperCase() +
        item?.address[0]?.currentCountry.slice(1).toLowerCase()
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
      <View style={style.flatListContainer}>
        <Image
          source={
            item.profilePic ? {uri: item.profilePic} : images.empty_male_Image
          }
          style={style.flatListImageBody}
          resizeMode={'cover'}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
          style={style.imageBottomShadow}
        />

        <View style={style.imageBodyDetailContainer}>
          <View style={style.onlineTextBody}>
            <Text style={style.onlineText}>Online</Text>
          </View>

          <TouchableOpacity onPress={handlePress}>
            <Text style={style.nameText}>{name || 'No Name Available'}</Text>

            <View style={{flexDirection: 'row', marginTop: 3}}>
              <Text style={style.userAge}>{item?.age || 'N/A'} yrs,</Text>
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
              <TouchableOpacity
                style={style.cameraImageContainer}
                activeOpacity={0.5}
                // onPress={() => {
                //   navigation.navigate('UserUploadImageFullScreen');
                // }}
                onPress={userAllImageShare}>
                <Image
                  source={icons.new_camera_icon}
                  style={style.cameraImage}
                />

                <Text style={{color: colors.white}}>{imageCount}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (item?.userShortListDetails) {
                    console.log(
                      ' === item?.userShortListDetails ===> ',
                      item?.userShortListDetails,
                    );
                    removeFromShortlist(
                      item.userShortListDetails._id ||
                        item.userShortListDetails.id,
                    ); // Remove from shortlist
                  } else {
                    addToShortlist(item._id); // Add to shortlist
                  }
                }}
                activeOpacity={0.5}
                style={style.starIconContainer}>
                <Image source={starIconSource} style={style.startIcon} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onThreeDotPress}
                style={style.threeDotContainer}>
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

  const SearchUserDataRenderItem = ({item}) => {
    const starIconSource = item?.userShortListDetails
      ? icons.black_check_icon // Check icon if shortlisted
      : icons.black_start_icon; // Star icon if not shortlisted

    console.log(' === uniqueId ===> ', item?.userUniqueId);

    const userUniqueId = item?.userUniqueId;

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
      setSelectedUserUniqueId(userUniqueId);

      sheetRef.current.open();
      // console.log(' === onThreeDotPress ===> ', userDetailsThreeDot);
    };

    return (
      <View style={style.flatListContainer}>
        <Image
          source={
            item.profilePic ? {uri: item.profilePic} : images.empty_male_Image
          }
          style={style.flatListImageBody}
          resizeMode={'cover'}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
          style={style.imageBottomShadow}
        />
        <View style={style.imageBodyDetailContainer}>
          <View style={style.onlineTextBody}>
            <Text style={style.onlineText}>Online</Text>
          </View>

          <TouchableOpacity>
            <Text style={style.nameText}>{name || 'No Name Available'}</Text>

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
              <TouchableOpacity
                style={style.cameraImageContainer}
                activeOpacity={0.5}
                // onPress={() => {
                //   navigation.navigate('UserUploadImageFullScreen');
                // }}
                onPress={userAllImageShare}>
                <Image
                  source={icons.new_camera_icon}
                  style={style.cameraImage}
                />

                <Text style={{color: colors.white}}>{imageCount}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  if (item?.userShortListDetails) {
                    removeFromShortlist(
                      item.userShortListDetails._id ||
                        item.userShortListDetails.id,
                    ); // Remove from shortlist
                  } else {
                    addToShortlist(item._id); // Add to shortlist
                  }
                }}
                activeOpacity={0.5}
                style={style.starIconContainer}>
                <Image source={starIconSource} style={style.startIcon} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={onThreeDotPress}
                style={style.threeDotContainer}>
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

  const toastConfigs = {
    AddShortlisted: ({text1}) => (
      <View style={style.toastMessageBody}>
        <Text style={style.toastMessageText}>{text1}</Text>
      </View>
    ),
    RemoveShortlisted: ({text1}) => (
      <View style={style.toastMessageBody}>
        <Text style={style.toastMessageText}>{text1}</Text>
      </View>
    ),
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={{flex: 1, zIndex: 99}}>
        <Toast config={toastConfigs} />
      </View>
      <View style={style.headerContainer}>
        <View style={style.headerBody}>
          <Image source={images.happyMilanColorLogo} style={style.appLogo} />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openBottomSheet}
            style={{alignSelf: 'center'}}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.topBottomSheetLogo}
            />
          </TouchableOpacity>
        </View>

        <View style={style.headerBottomContainer}>
          <Text style={style.headerBottomTittle}>
            {' '}
            {singleUserData ? 1 : searchUserData.length} Search Results
          </Text>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('SearchFilterScreen');
            }}
            activeOpacity={0.5}
            style={style.searchFilterContainer}>
            <Image source={icons.filter_icon} style={style.searchIcon} />
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />
      </View>

      <View style={style.bodyContainer}>
        {/* FlatList for single user (by ID) */}
        {data && data.length === 24 ? (
          <FlatList
            data={singleUserData ? [singleUserData] : []} // Wrap the single user data in an array
            renderItem={renderItem}
            keyExtractor={item => item._id}
            ListFooterComponent={<View style={{height: 130}} />}
          />
        ) : (
          // FlatList for multiple users (by search)
          <FlatList
            data={searchUserData}
            keyExtractor={item => item._id}
            rr
            renderItem={SearchUserDataRenderItem}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{height: 130}} />}
          />
        )}
      </View>

      {/* Bottom Sheet */}
      <RBSheet
        ref={sheetRef}
        height={hp(280)} // Height of the bottom sheet
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
          {/*<Text style={{fontSize: 18}}>*/}
          {/*  First Name: {selectedFirstName} {selectedUserUniqueId}*/}
          {/*</Text>*/}

          <View style={{marginHorizontal: 30, marginTop: 20}}>
            <TouchableOpacity
              onPress={handleShare}
              style={style.bottomSheetShareContainer}>
              <Image source={icons.share_icon} style={style.bottomSheetIcon} />
              <Text style={style.bottomSheetText}>Share Profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeBottomSheet}
              style={style.bottomBodyContainers}>
              <Image source={icons.block_icon} style={style.bottomSheetIcon} />
              <Text style={style.bottomSheetText}>
                Block {selectedFirstName}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeBottomSheet}
              style={style.bottomBodyContainers}>
              <Image source={icons.report_icon} style={style.bottomSheetIcon} />
              <Text style={style.bottomSheetText}>Copy URL</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeBottomSheet}
              style={style.bottomBodyContainers}>
              <Image source={icons.report_icon} style={style.bottomSheetIcon} />
              <Text style={style.bottomSheetText}>Report this profile</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={closeBottomSheet}
              style={style.bottomBodyContainers}>
              <Image
                source={icons.copy_id_card_icon}
                style={style.bottomSheetIcon}
              />
              <Text style={style.bottomSheetText}>
                Copy ID : {selectedUserUniqueId}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default SearchUserDataScreen;
