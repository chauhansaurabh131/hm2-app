import React, {useCallback, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import style from './style';
import UsersProfileDetailsScreen from '../usersProfileDetailsScreen';
import ImagePaginationComponent from '../../components/imagePaginationComponent';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';
import {accepted_Decline_Request, userLike} from '../../actions/homeActions';
import {useDispatch, useSelector} from 'react-redux';
import NewAddStoryScreen from '../newAddStoryScreen';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';

const UserDetailScreen = ({navigation}) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [imageRotation, setImageRotation] = useState('90deg');
  const [isUnFriendModalVisible, setIsUnFriendModalVisible] = useState(false);
  const [isBlockModalVisible, setIsBlockModalVisible] = useState(false);
  const [SpamModalVisible, setSpamModalVisible] = useState(false); // State to control the modal visibility
  const [showWarning, setShowWarning] = useState(false); // State to control if we show the warning message
  const [submitted, setSubmitted] = useState(false); // State to track if the form is submitted
  const [topModalVisible, setTopModalVisible] = useState(false);

  const bottomSheetRef = useRef(null);
  const unFrinedBottomSheetRef = useRef(null);
  const dispatch = useDispatch();

  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;

  const route = useRoute();
  const {selectedBox} = route.params ?? {};

  const {userData, matchesUserData} = route.params;

  const topModalBottomSheetRef = useRef(null);

  const openTopBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const {isSendRequestLoading} = useSelector(state => state.home);

  const fullName = `${userData?.friendList?.firstName} ${userData?.friendList?.lastName}`;
  const name = userData?.friendList?.name;

  const unFriendUserId = userData?.lastInitiatorUser;
  const unFriendReqId = userData?._id;

  const blockUserId = userData?.lastInitiatorUser;
  const blockReqId = userData?._id;

  // console.log(' === UserDetailScreen_userData ===> ', userData?.status);

  // console.log(' === matchesUserData ===> ', matchesUserData.age);

  useFocusEffect(
    useCallback(() => {
      setTopModalVisible(false);
    }, []),
  );

  const openTopSheetModal = () => {
    toggleModal();
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const onThreeDotPress = () => {
    console.log(' === onThreeDotPress ===> ');

    // Check if the status is 'accepted'
    if (userData?.status !== 'accepted') {
      // If not accepted, open the bottom sheet
      console.log('User is not friend. Modal will not open.');
      unFriendOpenBottomSheet();
    } else {
      // If status is 'accepted', do nothing or provide feedback
      openBottomSheet();
    }
  };

  const openBottomSheet = () => {
    bottomSheetRef.current.open();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current.close();
  };

  const onSendMessagePress = () => {
    navigation.goBack();
    bottomSheetRef.current.close();
  };

  const handleUnFriendProfilePress = () => {
    bottomSheetRef.current.close();
    setIsUnFriendModalVisible(true);
  };

  const unFriendOpenBottomSheet = () => {
    unFrinedBottomSheetRef.current.open();
  };

  const unFriendcloseBottomSheet = () => {
    unFrinedBottomSheetRef.current.close();
  };

  const handleConfirmUnFriend = () => {
    dispatch(
      accepted_Decline_Request(
        {
          user: unFriendUserId,
          request: unFriendReqId,
          status: 'removed',
        },
        () => {
          navigation.navigate('HomeTabs');
          setIsUnFriendModalVisible(false);
        },
      ),
    );
  };

  const handleCancelUnFriend = () => {
    setIsUnFriendModalVisible(false);
  };

  const handleBlockProfilePress = () => {
    bottomSheetRef.current.close();
    setIsBlockModalVisible(true);
    console.log(' === handleBlockProfilePress ===> ');
  };

  const handleConfirmBlock = () => {
    // Logic to block the user

    console.log(
      ' === handleConfirmBlock ===> ',
      userData?.userList?._id,
      userData?.friendList?._id,
    );

    dispatch(
      accepted_Decline_Request(
        {
          user: blockUserId,
          request: blockReqId,
          status: 'blocked',
        },
        () => {
          navigation.goBack();
        },
      ),
    );

    console.log('User blocked!');
    setIsBlockModalVisible(false); // Close the modal after confirming
  };

  const handleCancelBlock = () => {
    setIsBlockModalVisible(false); // Close the modal if canceled
  };

  // SPAM ALL FUNCTION
  const spamHandleOpenModal = () => {
    bottomSheetRef.current.close();
    setSpamModalVisible(true);
  };

  const spamHandleSubmitModal = () => {
    dispatch(
      accepted_Decline_Request(
        {
          user: blockUserId,
          request: blockReqId,
          status: 'blocked',
        },
        () => {
          setSpamModalVisible(false);
          setShowWarning(false);
          setSubmitted(false);
          navigation.goBack();
        },
      ),
    );

    // setSpamModalVisible(false);
    // setShowWarning(false); // Reset the warning state to false when closing the modal
    // setSubmitted(false); // Reset the submitted state when closing
  };

  const spamHandleCloseModal = () => {
    setSpamModalVisible(false);
    setShowWarning(false); // Reset the warning state to false when closing the modal
    setSubmitted(false); // Reset the submitted state when closing
  };

  const spamHandleContinue = () => {
    // When continue is clicked, remove the content and show the warning message
    setShowWarning(true);
  };

  const spamHandleBack = () => {
    // Reset the state to show the initial view
    setShowWarning(false);
  };

  const spamHandleSubmit = () => {
    // When "Submit" is clicked, hide everything and show the thank you message
    setSubmitted(true);
  };

  // const imageUrls =
  //   userData?.friendList?.userProfilePic.map(pic => pic.url) ||
  //   matchesUserData?.userAllImage;

  const profileImage = matchesUserData?.profileImage;

  const imageCount = Array.isArray(matchesUserData?.userAllImage)
    ? matchesUserData?.userAllImage.length
    : 0;

  const userAllImageShare = () => {
    const allImages = matchesUserData?.userAllImage;
    navigation.navigate('UserUploadImageFullScreen', {allImages});
  };

  // const imageUrls = matchesUserData?.userAllImage || [];

  const convertHeightToFeetAndInches = heightInCm => {
    const heightInInches = heightInCm / 2.54;
    const feet = Math.floor(heightInInches / 12);
    const inches = Math.round(heightInInches % 12);
    return `${feet}'${inches}"`;
  };

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

  const capitalizeFirstLetter = string => {
    if (!string) {
      return '';
    } // Handle null or undefined strings
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const Name =
    capitalizeFirstLetter(userData?.friendList?.firstName) ||
    capitalizeFirstLetter(matchesUserData?.firstName);

  const LastName =
    capitalizeFirstLetter(userData?.friendList?.lastName) ||
    capitalizeFirstLetter(matchesUserData?.lastName);

  const dateOfBirth = userData?.friendList?.dateOfBirth;

  // const age = calculateAge(dateOfBirth);
  const age = userData?.friendList?.age || matchesUserData?.age;
  const gender = userData?.friendList?.gender || matchesUserData?.gender;
  const heightInCm = userData?.friendList?.height || matchesUserData?.height;
  // const heightFormatted = convertHeightToFeetAndInches(heightInCm);
  const motherTongue = userData?.friendList?.motherTongue;
  const cast = userData?.friendList?.cast;
  const jobTitle = userData?.friendList?.userProfessional?.jobTitle;
  const workCity = userData?.friendList?.userProfessional?.workCity;
  const workCountry = userData?.friendList?.userProfessional?.workCountry;
  const aboutMe = userData?.friendList?.writeBoutYourSelf;
  const matchPercentage = matchesUserData?.matchPercentage;
  const Designation = matchesUserData?.Designation;
  const like = matchesUserData?.userLikeDetails;
  console.log(' === like ===> ', like);

  // matchesUserData?.age

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
    setImageRotation(showFullDescription ? '90deg' : '-90deg');
  };

  const onLikePress = item => {
    console.log(' === onLikePress ===> ', item?._id);
    // dispatch(
    //   userLike({
    //     likedUserId: item?._id,
    //     isLike: true,
    //   }),
    // );
  };

  const handleLikePress = () => {
    if (matchesUserData?.userLikeDetails?.isLike) {
      // If already liked, log the message
      console.log(
        'new_user_like_icon press',
        matchesUserData?.userLikeDetails?.isLike,
      );
      // onDisLikePress(item);
    } else {
      // If not liked, call the onLikePress function
      onLikePress(matchesUserData);
    }
  };

  // const handleLikePress = () => {
  //   console.log(' === var ===> ', matchesUserData?.userLikeDetails?.isLike);
  // };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        <Image
          source={images.happyMilanColorLogo}
          style={style.customHeaderLogo}
        />

        {/*<TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>*/}
        <TouchableOpacity activeOpacity={0.7} onPress={openTopBottomSheet}>
          <Image
            // source={images.profileDisplayImage}
            source={userImage ? {uri: userImage} : images.empty_male_Image}
            style={style.profileLogoStyle}
          />
        </TouchableOpacity>
      </View>

      <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

      <View style={style.userStoryContainer}>
        <NewAddStoryScreen />
      </View>

      {/*TOP SHEET*/}
      <HomeTopSheetComponent
        isVisible={topModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
      />

      <ScrollView>
        <View>
          {/*<ImagePaginationComponent imageUrls={imageUrls} />*/}
          <Image
            source={
              profileImage ? {uri: profileImage} : images.empty_male_Image
            }
            style={{width: '100%', height: hp(449), resizeMode: 'cover'}}
          />

          <LinearGradient
            colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 150,
            }}
          />
          <View style={style.UserDetailsContainer}>
            <View
              style={{
                position: 'absolute',
                bottom: 20,
                width: '100%',
                // backgroundColor: 'rgba(0,0,0,0.09)',
              }}>
              <View style={style.onlineBodyStyle}>
                <Text style={style.bodyTextStyle}>Online</Text>
              </View>

              <View style={{flexDirection: 'row', marginTop: 3}}>
                <Text style={style.userNameTextStyle}>
                  {Name} {LastName}
                </Text>
                {/*<View style={style.onlineBodyStyle} />*/}
              </View>

              <View
                style={[style.userDetailsDescriptionContainer, {marginTop: 3}]}>
                <Text style={style.userDetailsTextStyle}>{age} yrs, </Text>
                <Text style={style.userDetailsTextStyle} />
                <Text style={style.userDetailsTextStyle}>
                  {heightInCm || matchesUserData?.height}
                </Text>

                <View style={style.verticalLineStyle} />

                <Text style={style.userDetailsTextStyle}>
                  {' '}
                  {jobTitle || matchesUserData?.JobTittle}
                </Text>
              </View>

              <View style={style.userDetailsDescriptionContainer}>
                <Text style={style.userDetailsTextStyle}>
                  {workCity || matchesUserData?.workCity},
                </Text>
                <Text style={style.userDetailsTextStyle}>
                  {workCountry || matchesUserData?.workCountry}
                </Text>
              </View>

              <View style={style.bottomImageContainer}>
                <View
                  style={{
                    // flexDirection: 'row',
                    // flex: 1,
                    alignSelf: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Image
                    source={images.gradient_button_background_img}
                    style={{
                      width: wp(105),
                      height: hp(30),
                      resizeMode: 'stretch',
                    }}
                  />

                  <View
                    style={{
                      position: 'absolute',
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={icons.couple_icon}
                      style={{
                        width: hp(16),
                        height: hp(14),
                        resizeMode: 'contain',
                        tintColor: 'white',
                        marginRight: 8,
                      }}
                    />

                    <Text style={style.matchesText}>
                      {matchPercentage}% Match
                    </Text>
                  </View>
                </View>

                <View
                  style={{
                    position: 'absolute',
                    right: 10,
                    flexDirection: 'row',
                  }}>
                  <TouchableOpacity
                    onPress={userAllImageShare}
                    activeOpacity={0.5}
                    style={{
                      width: hp(60),
                      height: hp(30),
                      borderRadius: 15,
                      backgroundColor: '#282727',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginRight: hp(12),
                    }}>
                    <Image
                      source={icons.simple_camera_icon}
                      style={{
                        tintColor: colors.white,
                        width: hp(16),
                        height: hp(14),
                        resizeMode: 'contain',
                        marginRight: hp(5),
                      }}
                    />
                    <Text style={{color: colors.white}}>{imageCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      width: hp(30),
                      height: hp(30),
                      borderRadius: 50,
                      backgroundColor: '#282727',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      marginRight: hp(12),
                    }}>
                    <Image
                      source={icons.starIcon}
                      style={{
                        tintColor: colors.white,
                        width: hp(15),
                        height: hp(14),
                        resizeMode: 'contain',
                        // marginRight: hp(5),
                      }}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onThreeDotPress}
                    style={{
                      width: hp(30),
                      height: hp(30),
                      borderRadius: 50,
                      backgroundColor: '#282727',
                      justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <Image
                      source={icons.new_three_dot}
                      style={{
                        tintColor: colors.white,
                        width: hp(4),
                        height: hp(14),
                        resizeMode: 'contain',
                        // marginRight: hp(5),
                      }}
                    />
                  </TouchableOpacity>
                </View>

                {/*<Text>{matchPercentage}% Match</Text>*/}
              </View>
            </View>
          </View>
        </View>

        {/* DESCRIPTION VIEW */}
        <View style={style.descriptionTextContainer}>
          {userData?.status === 'accepted' ? (
            ''
          ) : (
            <View style={style.likeSharContainer}>
              <TouchableOpacity activeOpacity={0.5}>
                <Image
                  source={icons.new_rectangle_send_icon}
                  style={style.likeIcon}
                />
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.5} onPress={handleLikePress}>
                {/*<Image source={icons.new_like_icon} style={style.shareIcon} />*/}
                <Image
                  source={
                    like?.isLike
                      ? icons.new_user_like_icon
                      : icons.new_like_icon
                  }
                  style={style.shareIcon}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View
          style={{
            width: '100',
            height: hp(4),
            backgroundColor: '#F8F8F8',
            marginTop: 10,
            marginBottom: 20,
          }}
        />

        <View style={{marginHorizontal: 17}}>
          <View style={style.aboutTextContainer}>
            <Text style={style.descriptionTittleText}>About Me</Text>

            {/*<TouchableOpacity onPress={onThreeDotPress}>*/}
            {/*  /!*<TouchableOpacity onPress={openBottomSheet}>*!/*/}
            {/*  <Image*/}
            {/*    source={icons.three_dots_icon}*/}
            {/*    style={style.threeDotIcon}*/}
            {/*  />*/}
            {/*</TouchableOpacity>*/}
          </View>

          {/*BOTTOM SHEET*/}
          <RBSheet
            ref={bottomSheetRef}
            height={300}
            closeOnPressMask={true} // Allows closing when clicking outside the bottom sheet
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
              },
            }}>
            <View style={style.bottomSheetBodyContainer}>
              <TouchableOpacity
                onPress={closeBottomSheet}
                style={style.bottomSheetContainer}>
                <Image
                  source={icons.share_icon}
                  style={style.bottomSheetShareIcon}
                />
                <Text style={style.bottomSheetTextStyle}>Share Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleBlockProfilePress}
                style={style.bottomSheetImageTextSpace}>
                <Image
                  source={icons.block_icon}
                  style={style.sendMessageIcon}
                />
                <Text style={style.bottomSheetTextStyle}>Block</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={spamHandleOpenModal}
                style={style.bottomSheetImageTextSpace}>
                <Image
                  source={icons.report_icon}
                  style={style.sendMessageIcon}
                />
                <Text style={style.bottomSheetTextStyle}>Report Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={closeBottomSheet}
                style={style.bottomSheetImageTextSpace}>
                <Image source={icons.copy_icon} style={style.sendMessageIcon} />
                <Text style={style.bottomSheetTextStyle}>Copy URL</Text>
              </TouchableOpacity>

              <TouchableOpacity
                // onPress={closeBottomSheet}
                onPress={onSendMessagePress}
                style={style.bottomSheetImageTextSpace}>
                <Image
                  source={icons.send_message_icon}
                  style={style.sendMessageIcon}
                />
                <Text style={style.bottomSheetTextStyle}>Send Message</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleUnFriendProfilePress}
                style={style.bottomSheetImageTextSpace}>
                <Image
                  source={icons.unFriend_icon}
                  style={style.unfriendIcon}
                />
                <Text style={style.bottomSheetTextStyle}>Unfriend</Text>
              </TouchableOpacity>
            </View>
          </RBSheet>

          <RBSheet
            ref={unFrinedBottomSheetRef}
            height={130}
            closeOnPressMask={true} // Allows closing when clicking outside the bottom sheet
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                padding: 20,
              },
            }}>
            <View style={style.bottomSheetBodyContainer}>
              <TouchableOpacity
                onPress={unFriendcloseBottomSheet}
                style={style.bottomSheetContainer}>
                <Image
                  source={icons.share_icon}
                  style={style.bottomSheetShareIcon}
                />
                <Text style={style.bottomSheetTextStyle}>Share Profile</Text>
              </TouchableOpacity>

              {/*<TouchableOpacity*/}
              {/*  onPress={handleBlockProfilePress}*/}
              {/*  style={style.bottomSheetImageTextSpace}>*/}
              {/*  <Image*/}
              {/*    source={icons.block_icon}*/}
              {/*    style={style.sendMessageIcon}*/}
              {/*  />*/}
              {/*  <Text style={style.bottomSheetTextStyle}>Block</Text>*/}
              {/*</TouchableOpacity>*/}

              {/*<TouchableOpacity*/}
              {/*  onPress={spamHandleOpenModal}*/}
              {/*  style={style.bottomSheetImageTextSpace}>*/}
              {/*  <Image*/}
              {/*    source={icons.report_icon}*/}
              {/*    style={style.sendMessageIcon}*/}
              {/*  />*/}
              {/*  <Text style={style.bottomSheetTextStyle}>Report Profile</Text>*/}
              {/*</TouchableOpacity>*/}

              <TouchableOpacity
                onPress={unFriendcloseBottomSheet}
                style={style.bottomSheetImageTextSpace}>
                <Image source={icons.copy_icon} style={style.sendMessageIcon} />
                <Text style={style.bottomSheetTextStyle}>Copy URL</Text>
              </TouchableOpacity>

              {/*<TouchableOpacity*/}
              {/*  // onPress={closeBottomSheet}*/}
              {/*  onPress={onSendMessagePress}*/}
              {/*  style={style.bottomSheetImageTextSpace}>*/}
              {/*  <Image*/}
              {/*    source={icons.send_message_icon}*/}
              {/*    style={style.sendMessageIcon}*/}
              {/*  />*/}
              {/*  <Text style={style.bottomSheetTextStyle}>Send Message</Text>*/}
              {/*</TouchableOpacity>*/}

              {/*<TouchableOpacity*/}
              {/*  onPress={handleUnFriendProfilePress}*/}
              {/*  style={style.bottomSheetImageTextSpace}>*/}
              {/*  <Image*/}
              {/*    source={icons.unFriend_icon}*/}
              {/*    style={style.unfriendIcon}*/}
              {/*  />*/}
              {/*  <Text style={style.bottomSheetTextStyle}>Unfriend</Text>*/}
              {/*</TouchableOpacity>*/}
            </View>
          </RBSheet>

          {/* Modal for UnFriend confirmation */}
          <Modal
            visible={isUnFriendModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsUnFriendModalVisible(false)}>
            <View style={style.modalContainer}>
              <View style={style.unfriendModalBody}>
                <View>
                  <Text style={style.unfriendModalTittleText}>
                    Are yor sure want to unfriend?
                  </Text>

                  <View style={style.unfriendModalButtonContainer}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handleConfirmUnFriend}>
                      <LinearGradient
                        colors={['#2D46B9', '#8D1D8D']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1}}
                        style={style.unfriendYesButtonContainer}>
                        <Text style={style.unfriendButtonTextButton}>Yes</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handleCancelUnFriend}>
                      <LinearGradient
                        colors={['#0D4EB3', '#9413D0']}
                        style={style.unfriendNoButtonContainer}>
                        <View style={style.unfriendNoButtonBody}>
                          <Text style={style.unfriendNoButtonText}>No</Text>
                        </View>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>

          {/*//BLOCK MODAL */}
          <Modal
            visible={isBlockModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setIsBlockModalVisible(false)}>
            <View style={style.modalContainer}>
              <View style={style.blockModalBodyContainer}>
                <Text style={style.blockModalTittleText}>
                  Are you sure you want to
                </Text>
                <Text style={style.blockModalSubTittleText}>
                  Block This User?
                </Text>

                <View style={style.blockModalButtonContainer}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleConfirmBlock}>
                    <LinearGradient
                      colors={['#2D46B9', '#8D1D8D']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={style.blockModalYesButtonContainer}>
                      <Text style={style.blockModalYesButtonText}>Yes</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleCancelBlock}>
                    <LinearGradient
                      colors={['#0D4EB3', '#9413D0']}
                      style={style.blockModalMoButtonContainer}>
                      <View style={style.blockModalNoButtonBody}>
                        <Text style={style.blockModalNoButtonText}>No</Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/*//REPORT & SPAM MODAL */}
          <Modal
            transparent={true}
            visible={SpamModalVisible}
            animationType="none"
            onRequestClose={spamHandleCloseModal}>
            <View style={style.spamModalContainer}>
              <View style={style.spamModalBody}>
                <View style={style.spamModalBodySpace}>
                  {/* Header with "Report" centered and "X" or back arrow on the right */}
                  {!submitted && (
                    <View style={style.spamModalTittleContainer}>
                      {/* Centered "Report" */}
                      <Text style={style.spamModalReportText}>Report</Text>

                      {/* "X" button or back arrow */}
                      {!showWarning ? (
                        <TouchableOpacity
                          onPress={spamHandleCloseModal}
                          style={style.spamModalCancelContainer}>
                          <Image
                            source={icons.x_cancel_icon}
                            style={style.spamModalCancelIcon}
                          />
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          onPress={spamHandleBack}
                          style={style.spamModalBackContainer}>
                          <Image
                            source={icons.back_arrow_icon}
                            style={style.spamModalBackIcon}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {/* Conditional content based on 'showWarning' and 'submitted' state */}
                  {!submitted ? (
                    !showWarning ? (
                      <>
                        <View style={style.spamModalUnderLine} />

                        <Text style={style.spamModalTittle}>
                          Please select the problems
                        </Text>

                        {/* Problem dropdown */}
                        <View style={style.spamModalBoxBody}>
                          <View style={style.spamModalBocBodyStyle}>
                            <Text style={style.spamModalBoxTextStyle}>
                              Spam
                            </Text>
                            <Image
                              source={icons.drooDownLogo}
                              style={style.spamModalDropDownIcon}
                            />
                          </View>
                        </View>

                        {/* Continue button */}
                        <View style={style.spamModalContinueContainer}>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={spamHandleContinue}>
                            <LinearGradient
                              colors={['#2D46B9', '#8D1D8D']}
                              start={{x: 0, y: 0}}
                              end={{x: 1, y: 1}}
                              style={style.spamModalContinueButtonBody}>
                              <Text style={style.spamModalContinueButtonText}>
                                Continue
                              </Text>
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : (
                      <>
                        <View style={style.spamModalUnderLine} />

                        <Text style={style.spamModalSpaceTwoTittle}>Spam</Text>

                        <Text style={style.spamModalSpaceSubTittle}>
                          We don't allow things such as:
                        </Text>

                        <View style={style.spamModalSpaceBodyContainer}>
                          <View style={style.spamModalSpaceBodyDotStyle} />
                          <Text style={style.spamModalSpaceSubBodyTittle}>
                            Encouraging people to engage with
                          </Text>
                        </View>
                        <Text style={style.spamModalSpaceSubBodyTittles}>
                          content under false pretences
                        </Text>

                        <View style={style.spamModalSpaceBodyContainerStyle}>
                          <View style={style.spamModalSpaceBodyDotStyle} />
                          <Text style={style.spamModalSpaceSubBodyTittle}>
                            Directing people away from HappyMilan
                          </Text>
                        </View>
                        <Text style={style.spamModalSpaceSubBodyTittles}>
                          through the misleading use of links
                        </Text>

                        <View style={style.spamModalSpaceButtonContainer}>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={spamHandleSubmit}>
                            <LinearGradient
                              colors={['#2D46B9', '#8D1D8D']}
                              start={{x: 0, y: 0}}
                              end={{x: 1, y: 1}}
                              style={style.spamModalSpaceSubmitContainer}>
                              <Text style={style.spamModalSubmitButton}>
                                Submit
                              </Text>
                            </LinearGradient>
                          </TouchableOpacity>

                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={spamHandleCloseModal}>
                            <LinearGradient
                              colors={['#0D4EB3', '#9413D0']}
                              style={style.spamModalCloseContainer}>
                              <View style={style.spamModalCloseBodyStyle}>
                                <Text style={style.spamModalCloseButtonText}>
                                  Close
                                </Text>
                              </View>
                            </LinearGradient>
                          </TouchableOpacity>
                        </View>
                      </>
                    )
                  ) : (
                    // Show "Thanks for letting us know" after submission
                    <>
                      <Text style={style.spamModalFinalTittleText}>
                        Thanks for letting us know
                      </Text>

                      <View style={style.spamModalUnderLine} />

                      <View style={style.spamModalFinalBodyStyle}>
                        <Text style={style.spamModalSubTittleText}>
                          We’ll use this information to improve our
                        </Text>

                        <Text style={style.spamModalSubTittleText}>
                          process. We may also use it to find and
                        </Text>

                        <Text style={style.spamModalSubTittleText}>
                          remove more spam.
                        </Text>

                        <Text style={style.spamModalFinalMiddleText}>
                          One More Step You Can Take
                        </Text>
                      </View>

                      <Image
                        source={icons.spam_icon}
                        style={style.spamModalSpamIcon}
                      />

                      <Text style={style.spamModalSpamText}>
                        Block {fullName || name} Profile
                      </Text>

                      <Text style={style.spamModalSpamSubText}>
                        You won’t able to see or contact each other
                      </Text>

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={spamHandleSubmitModal}
                        disabled={isSendRequestLoading}>
                        <LinearGradient
                          colors={['#2D46B9', '#8D1D8D']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 1}}
                          style={style.spamModalFinalSubmitContainer}>
                          {isSendRequestLoading ? (
                            <ActivityIndicator size="large" color="#FFFFFF" />
                          ) : (
                            <Text style={style.spamModalFinalSubmitButtonText}>
                              Submit
                            </Text>
                          )}
                        </LinearGradient>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            </View>
          </Modal>

          <Text
            numberOfLines={showFullDescription ? undefined : 4}
            style={style.descriptionBodyText}>
            {aboutMe || matchesUserData?.about}
          </Text>
          <TouchableOpacity
            onPress={toggleDescription}
            style={{alignItems: 'center'}}>
            <Image
              source={icons.rightSideIcon}
              style={{
                width: 8,
                height: 8,
                tintColor: colors.blue,
                marginTop: hp(20),
                transform: [{rotate: imageRotation}],
                resizeMode: 'contain',
              }}
            />
          </TouchableOpacity>
          {/*<UsersProfileDetailsScreen userData={userData || matchesUserData} />*/}
        </View>
        <UsersProfileDetailsScreen userData={userData || matchesUserData} />
        <View style={{height: 50}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserDetailScreen;
