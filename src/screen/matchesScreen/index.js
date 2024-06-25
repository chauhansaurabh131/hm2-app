import React, {useEffect, useState} from 'react';
import {
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
} from '../../actions/homeActions';
import {USER_LIST} from '../../utils/data';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {getAllDeclineFriend, getAllFriends} from '../../actions/chatActions';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const MatchesScreen = ({navigation}) => {
  const [selectedTab, setSelectedTab] = useState('new');
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [userActions, setUserActions] = useState({});
  const [requestStatus, setRequestStatus] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRequest());
    dispatch(getAllDeclineFriend());
    dispatch(getAllFriends());
  }, [dispatch]);

  const {getAllRequestData, isFriendRequestDataLoading} = useSelector(
    state => state.home,
  );
  const {declineFriends, myAllFriends, isUserDataLoading} = useSelector(
    state => state.chat,
  );

  const tabsData = [
    {id: 'new', label: 'New'},
    {id: 'accepted', label: 'Accepted'},
    {id: 'receive', label: 'Received'},
    {id: 'saved', label: 'Saved'},
    {id: 'declined', label: 'Declined'},
    {id: 'sent', label: 'Sent'},
    {id: 'deleted', label: 'Deleted'},
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
    const {user, id} = item; // Destructure `user` and `id` from `item`
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
    } = user;

    const userId = item.friend.address.userId;

    const jobTitle = item.user?.userProfessional?.jobTitle;
    const workCountry = item.user?.userProfessional?.workCountry;

    const calculateAge = dob => {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const age = calculateAge(dateOfBirth);

    const height = user.height || 'N/A';

    return (
      <View style={style.renderContainer}>
        <TouchableOpacity activeOpacity={1}>
          <View>
            <Image
              source={profilePic ? {uri: profilePic} : images.empty_male_Image}
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
                  {firstName || 'NAN'} {lastName || 'NAN'}
                </Text>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>{gender}</Text>
                  <Text style={style.userDetailsTextStyle}>{age},</Text>
                  <Text style={style.userDetailsTextStyle}>{height}</Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>{motherTongue}</Text>
                  <Text style={style.userDetailsTextStyle}>{cast}</Text>
                </View>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>
                    {jobTitle || 'N/A'}
                  </Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>{workCountry}</Text>
                </View>
              </TouchableOpacity>

              <View style={style.RenderBottomImageContainer}>
                <TouchableOpacity>
                  <Image source={icons.image_icon} style={style.imageStyle} />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Image source={icons.video_icon} style={style.videoStyle} />
                </TouchableOpacity>

                <TouchableOpacity style={style.starImageContainer}>
                  <Image
                    source={icons.starIcon}
                    style={style.startImageStyle}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.renderBottomButtonContainer}>
                {/*{userActions[userId] === 'declined' ? (*/}
                {requestStatus === 'declined' ? (
                  <TouchableOpacity style={style.requestDeclineContainer}>
                    <Text style={style.requestTextStyle}>Request Decline</Text>
                  </TouchableOpacity>
                ) : // ) : userActions[userId] === 'accepted' ? (
                requestStatus === 'accepted' ? (
                  <TouchableOpacity style={style.acceptedButtonContainer}>
                    <Text style={style.acceptedTextStyle}>
                      Request Accepted
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      style={{
                        width: wp(142),
                        height: hp(40),
                        borderRadius: hp(20),
                        backgroundColor: colors.white,
                        justifyContent: 'center',
                      }}
                      onPress={() => handleDecline(id, userId)}>
                      <Text style={style.declineTextStyle}>Decline</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => handleAccept(id, userId)}>
                      <LinearGradient
                        colors={['#0D4EB3', '#9413D0']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1.5}}
                        style={style.acceptButtonGradient}>
                        <Text style={style.acceptTextStyle}>Accept</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderUserDeclineItem = ({item}) => {
    const {user, id} = item;
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
    } = user;

    const jobTitle = item.user?.userProfessional?.jobTitle;
    const workCountry = item.user?.userProfessional?.workCountry;

    const calculateAge = dob => {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const age = calculateAge(dateOfBirth);

    const height = user.height || 'N/A';

    return (
      <View style={style.renderContainer}>
        <TouchableOpacity activeOpacity={1}>
          <View>
            <Image
              source={profilePic ? {uri: profilePic} : images.empty_male_Image}
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
                  {firstName || 'NAN'} {lastName || 'NAN'}
                </Text>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>{gender}</Text>
                  <Text style={style.userDetailsTextStyle}>{age},</Text>
                  <Text style={style.userDetailsTextStyle}>{height}</Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>{motherTongue}</Text>
                  <Text style={style.userDetailsTextStyle}>{cast}</Text>
                </View>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>
                    {jobTitle || 'N/A'}
                  </Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>{workCountry}</Text>
                </View>
              </TouchableOpacity>

              <View style={style.RenderBottomImageContainer}>
                <TouchableOpacity>
                  <Image source={icons.image_icon} style={style.imageStyle} />
                </TouchableOpacity>

                <TouchableOpacity>
                  <Image source={icons.video_icon} style={style.videoStyle} />
                </TouchableOpacity>

                <TouchableOpacity style={style.starImageContainer}>
                  <Image
                    source={icons.starIcon}
                    style={style.startImageStyle}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.renderBottomButtonContainer}>
                <View style={style.requestDeclineContainer}>
                  <Text style={style.requestTextStyle}>Request Decline</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // TOP LIST DATA SHOW //
  const renderTabItem = ({item}) => (
    <TouchableOpacity onPress={() => handleTabPress(item.id)}>
      <View
        style={[
          style.statusBarContainerStyle,
          {backgroundColor: selectedTab === item.id ? '#F0F9FF' : colors.white},
        ]}>
        <Image
          source={images.user_one_Image}
          style={style.statusBarIconStyle}
        />
        <Text style={style.statusBarTittleTextStyle}>{item.label}</Text>
      </View>
    </TouchableOpacity>
  );

  // USER NEW RENDER LIST //
  const renderUserItem = ({item}) => {
    return (
      <View style={{marginHorizontal: 17}}>
        <TouchableOpacity activeOpacity={1}>
          <View>
            <Image source={item.image} style={style.userImageStyle} />
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
                <Text style={style.userNameTextStyle}>{item.name}</Text>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>{item.gender}</Text>
                  <Text style={style.userDetailsTextStyle}>{item.age},</Text>
                  <Text style={style.userDetailsTextStyle}>{item.height}</Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>{item.state}</Text>
                  <Text style={style.userDetailsTextStyle}>{item.surname}</Text>
                </View>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>
                    {item.occupation}
                  </Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>{item.city}</Text>
                  <Text style={style.userDetailsTextStyle}>{item.state}</Text>
                  <Text style={style.userDetailsTextStyle}>{item.country}</Text>
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
                    85% Match
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
    // console.log(' === item ===> ', item);

    const {user, id} = item;
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
    } = user;

    const jobTitle = item.user.userProfessional.jobTitle;
    const workCountry = item.user.userProfessional.workCountry;

    const calculateAge = dob => {
      const birthDate = new Date(dob);
      const difference = Date.now() - birthDate.getTime();
      const ageDate = new Date(difference);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const age = calculateAge(dateOfBirth);

    const height = user.height || 'N/A';

    return (
      <View style={{marginHorizontal: 17}}>
        <TouchableOpacity activeOpacity={1}>
          <View>
            <Image
              source={profilePic ? {uri: profilePic} : images.empty_male_Image}
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
                  <Text style={style.userDetailsTextStyle}>{cast}</Text>
                </View>

                <View style={style.userDetailsDescriptionContainer}>
                  <Text style={style.userDetailsTextStyle}>{jobTitle}</Text>

                  <View style={style.verticalLineStyle} />

                  <Text style={style.userDetailsTextStyle}>{workCountry}</Text>
                  <Text style={style.userDetailsTextStyle}>{item.state}</Text>
                  <Text style={style.userDetailsTextStyle}>{item.country}</Text>
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
            <FlatList
              data={USER_LIST}
              keyExtractor={item => item.id}
              renderItem={renderUserItem}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={{height: 130}} />}
            />
          </View>
        );
      case 'accepted':
        // <Text>Accepted</Text>;
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
            ) : myAllFriends.data.length === 0 ? (
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
                data={myAllFriends.data}
                keyExtractor={item => item.id}
                renderItem={renderAccptedUserItem}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={<View style={{height: 130}} />}
              />
            )}
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
        return <Text>Saved</Text>;
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
                data={declineFriends?.data}
                keyExtractor={item => item.id}
                renderItem={renderUserDeclineItem}
                ListFooterComponent={<View style={{height: 130}} />}
              />
            )}
          </View>
        );
      case 'sent':
        return <Text>Sent</Text>;
      case 'deleted':
        return <Text>Deleted</Text>;
      case 'blocked':
        return <Text>Blocked</Text>;
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
              source={images.profileDisplayImage}
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
