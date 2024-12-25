import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  FlatList,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  accepted_Decline_Request,
  sendRequest,
  userDatas,
  userDis_Like,
  userLike,
} from '../../actions/homeActions';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import {colors} from '../../utils/colors';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const NewPremiumMatchesComponent = ({toastConfigs}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const [users, setUsers] = useState([]); // State to store the user data
  const [loading, setLoading] = useState(false); // Loading state

  console.log(' === users ===> ', users);

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
  const ProfileLike = () => {
    Toast.show({
      type: 'ProfileLike',
      text1: 'Profile Like',
      visibilityTime: 1000,
    });
  };
  const ProfileDisLike = () => {
    Toast.show({
      type: 'ProfileDisLike',
      text1: 'Profile Disliked',
      visibilityTime: 1000,
    });
  };

  useEffect(() => {
    if (accessToken) {
      fetchData();
    }
  }, [accessToken]);

  const fetchData = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.get(
        'https://stag.mntech.website/api/v1/user/user/getNewUser',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      // Extract user data from the response
      const userData = response.data?.data[0]?.paginatedResults || []; // Access the paginatedResults array
      setUsers(userData); // Set the fetched user data to the state
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      Alert.alert('Error', 'Failed to fetch data.');
      setLoading(false);
    }
  };

  const createLike = async likedUserId => {
    try {
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/like/create-like',
        {
          likedUserId: likedUserId,
          isLike: true,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      // Handle successful response, maybe update local state or show success message
      console.log('Like created successfully:', response.data);
      ProfileLike();
      fetchData();
    } catch (error) {
      console.error('Error creating like:', error);
      Alert.alert('Error', 'Failed to create like.');
      fetchData();
    }
  };

  const updateLike = async likedUserId => {
    try {
      const response = await axios.put(
        `https://stag.mntech.website/api/v1/user/like/update-like/${likedUserId}`,
        {
          likedUserId: likedUserId,
          isLike: false,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      // Handle successful response, maybe update local state or show success message
      console.log('Like updated successfully:', response.data);
      ProfileDisLike();
      fetchData();
    } catch (error) {
      console.error('Error updating like:', error);
      Alert.alert('Error', 'Failed to update like.');
      fetchData();
    }
  };

  const handleLikePress = item => {
    const isLiked = item?.userLikeDetails?.isLike; // Access the isLike property

    if (isLiked) {
      // If already liked, call the update-like API to unlike
      updateLike(item?.userLikeDetails?._id);
    } else {
      // If not liked, call the create-like API to like
      createLike(item._id);
    }
  };

  const OnsendRequestedSend = item => {
    console.log(' === item>>> ===> ', item);
    dispatch(
      sendRequest({friend: item?._id, user: user.user.id}, () => {
        fetchData();
      }),
    );
  };

  const handleRequestAction = (item, requestId) => {
    if (item?.friendsDetails?.status === 'requested') {
      // If the request status is 'requested', decline or remove the request
      dispatch(
        accepted_Decline_Request(
          {
            user: item?._id,
            request: requestId, // Use the existing request ID
            status: 'removed', // Decline the request or remove it
          },
          () => {
            fetchData();
          },
        ),
      );
    }
  };

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
            Authorization: `Bearer ${accessToken}`, // Ensure you use the correct access token here
          },
        },
      );
      console.log('Shortlist created successfully:', response.data);
      ShowToast();
      fetchData(); // Refresh the user data after adding to shortlist
    } catch (error) {
      console.error('Error adding to shortlist:', error);
      Alert.alert('Error', 'Failed to add to shortlist.');
    }
  };

  const removeFromShortlist = async shortlistId => {
    console.log(' === removeFromShortlist_______ ===> ', shortlistId);
    try {
      const response = await axios.delete(
        `https://stag.mntech.website/api/v1/user/shortlist/delete-short-list/${shortlistId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // Ensure you use the correct access token here
          },
        },
      );
      console.log('Shortlist removed successfully:', response.data);
      RemoveShortlisted();
      fetchData(); // Refresh the user data after removing from the shortlist
    } catch (error) {
      console.error('Error removing from shortlist:', error);
      Alert.alert('Error', 'Failed to remove from shortlist.');
    }
  };

  // Render each item in the list
  const renderItem = ({item}) => {
    // console.log(' === var ===> ', item?.friendsDetails);

    const firstName = item?.firstName
      ? item.firstName.charAt(0).toUpperCase() +
        item.firstName.slice(1).toLowerCase()
      : '';

    const lastName = item?.lastName
      ? item.lastName.charAt(0).toUpperCase() +
        item.lastName.slice(1).toLowerCase()
      : '';

    const currentCity = item.address?.currentCity
      ? item.address.currentCity.charAt(0).toUpperCase() +
        item.address.currentCity.slice(1).toLowerCase()
      : '';

    const currentCountry = item.address?.currentCountry
      ? item.address.currentCountry.charAt(0).toUpperCase() +
        item.address.currentCountry.slice(1).toLowerCase()
      : '';

    const userAllImage = Array.isArray(item?.userProfilePic)
      ? item.userProfilePic.map(pic => pic.url)
      : [];

    const profileImage = item.profilePic;
    const birthTime = item.birthTime;

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

    const handlePress = () => {
      console.log(' === item........... ===> ', item);
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
        userLikeDetails: item?.userLikeDetails,
      };

      // console.log('User Data:', matchesUserData);

      // Navigate to UserDetailsScreen
      navigation.navigate('UserDetailsScreen', {matchesUserData});
    };

    const isLiked = item?.userLikeDetails?.isLike; // Access the isLike property

    const friendStatus = item?.friendsDetails?.status;

    // Set the icon based on the friend request status
    const friendIconSource =
      friendStatus === 'accepted'
        ? icons.new_user_send_icon // Request already accepted
        : friendStatus === 'requested'
        ? icons.new_user_send_icon // Request already sent, allow for rejection
        : icons.new_send_icon; // No request sent, allow sending a request

    // Determine the star icon based on userShortListDetails
    const starIconSource = item?.userShortListDetails
      ? icons.black_check_icon
      : icons.black_start_icon;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.6}
        onPress={handlePress}>
        <View
          style={{
            height: hp(225),
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#EFEFEF',
          }}>
          <Image
            style={
              item.profilePic
                ? styles.image
                : [styles.image, styles.imageWithBorder]
            }
            source={
              item.profilePic ? {uri: item.profilePic} : images.empty_male_Image
            }
          />

          <View style={styles.overlayContainer}>
            <TouchableOpacity
              onPress={() => {
                if (item?.userShortListDetails) {
                  // If the user is already in the shortlist, remove them
                  removeFromShortlist(item.userShortListDetails._id);
                } else {
                  // If the user is not in the shortlist, add them
                  addToShortlist(item._id);
                }
              }}
              style={{position: 'absolute', right: 0, padding: 10}}>
              <Image source={starIconSource} style={styles.starIcon} />
            </TouchableOpacity>
          </View>

          <View style={{alignItems: 'center'}}>
            <Text style={styles.itemText}>
              {firstName} {lastName}
            </Text>

            <View style={{flexDirection: 'row'}}>
              <Text style={styles.nameDetailTextStyle}>{item?.age} yrs,</Text>
              <Text style={styles.nameDetailTextStyle}> {item?.height}</Text>
            </View>

            <Text style={styles.nameDetailTextStyle}>
              {currentCity || 'N/A'}, {currentCountry || 'N/A'}
            </Text>

            <View style={{flexDirection: 'row', marginTop: hp(12)}}>
              <TouchableOpacity onPress={() => handleLikePress(item)}>
                <Image
                  source={
                    isLiked ? icons.new_user_like_icon : icons.new_like_icon
                  }
                  style={{
                    width: hp(38),
                    height: hp(22),
                    resizeMode: 'stretch',
                    marginRight: 8,
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  OnsendRequestedSend(item);
                  handleRequestAction(item, item?.friendsDetails?._id); // Call the new function
                }}>
                <Image
                  source={friendIconSource}
                  style={{
                    width: hp(38),
                    height: hp(22),
                    resizeMode: 'stretch',
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // const toastConfigs = {
  //   AddShortlisted: ({text1}) => (
  //     <View style={styles.toastContainer}>
  //       <Text style={styles.toastText}>{text1}</Text>
  //     </View>
  //   ),
  //   RemoveShortlisted: ({text1}) => (
  //     <View style={styles.toastContainer}>
  //       <Text style={styles.toastText}>{text1}</Text>
  //     </View>
  //   ),
  //   ProfileLike: ({text1}) => (
  //     <View style={styles.toastContainer}>
  //       <Text style={styles.toastText}>{text1}</Text>
  //     </View>
  //   ),
  //   ProfileDisLike: ({text1}) => (
  //     <View style={styles.toastContainer}>
  //       <Text style={styles.toastText}>{text1}</Text>
  //     </View>
  //   ),
  // };

  return (
    <SafeAreaView style={{flex: 1}}>
      {/* Check if there are paginatedResults to display */}
      {loading ? (
        <FlatList
          data={[1, 1, 1, 1]}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={() => {
            return (
              <View
                style={{
                  width: 120,
                  height: 200,
                  borderRadius: 10,
                  // backgroundColor: 'orange',
                }}>
                <View
                  style={{
                    width: 100,
                    height: 170,
                    backgroundColor: '#9e9e9e',
                    opacity: 0.4,
                    alignItems: 'center',
                    borderRadius: 10,
                  }}>
                  <ShimmerPlaceholder
                    style={{
                      width: '80%',
                      height: 80,
                      backgroundColor: 'black',
                      marginTop: 10,
                      borderRadius: 10,
                    }}
                  />
                  <ShimmerPlaceholder
                    style={{
                      width: '60%',
                      height: 10,
                      backgroundColor: 'black',
                      marginTop: 30,
                    }}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: 12,
                    }}>
                    <ShimmerPlaceholder
                      style={{
                        width: 30,
                        height: 15,
                        backgroundColor: 'black',
                        borderRadius: 25,
                      }}
                    />
                    <ShimmerPlaceholder
                      style={{
                        width: 30,
                        height: 15,
                        backgroundColor: 'black',
                        borderRadius: 25,
                        marginLeft: 15,
                      }}
                    />
                  </View>
                </View>
              </View>
            );
          }}
        />
      ) : users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item, index) => String(index)} // Use a unique key or index for now
          renderItem={renderItem}
          horizontal // Make the FlatList horizontal
          showsHorizontalScrollIndicator={false} // Optionally hide the horizontal scroll indicator
          contentContainerStyle={styles.listContainer} // Optional styling for the list
        />
      ) : (
        <Text style={{textAlign: 'center', marginTop: 20, color: 'black'}}>
          No Premium Matches Found
        </Text>
      )}

      <Toast config={toastConfigs} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 10,
  },
  listContainer: {
    // paddingLeft: 10, // Padding for the first item
    paddingRight: 10, // Padding for the last item
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 13,
    marginLeft: -12,
  },

  imagePlaceholder: {
    width: 150, // Placeholder width
    height: 150, // Placeholder height
    backgroundColor: '#ccc', // Placeholder background color
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 75, // Match the image's border radius
    marginBottom: 10,
  },
  itemText: {
    fontSize: fontSize(12),
    lineHeight: hp(15),
    fontFamily: fontFamily.poppins700,
    color: colors.black,
  },
  image: {
    width: wp(110),
    height: hp(136),
    borderRadius: 6,
    marginBottom: 8,
  },
  imageWithBorder: {
    borderWidth: 0.5,
    borderColor: '#D3D3D3',
  },
  overlayContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: 10,
  },
  starIcon: {
    width: hp(18),
    height: hp(18),
    resizeMode: 'contain',
  },
  nameDetailTextStyle: {
    fontSize: fontSize(9),
    lineHeight: hp(12),
    color: colors.black,
    fontFamily: fontFamily.poppins400,
    top: 5,
  },
  toastContainer: {
    backgroundColor: '#333333', // Toast background color
    // padding: 10,
    borderRadius: 100,
    marginHorizontal: 20,
    // marginTop: -25,
    width: wp(300),
    height: hp(55),
    justifyContent: 'center',
    position: 'absolute',
    top: 1,
  },
  toastText: {
    color: 'white', // Toast text color
    fontSize: fontSize(16),
    textAlign: 'center',
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
});

export default NewPremiumMatchesComponent;
