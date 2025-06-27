import React, {useEffect, useRef, useState} from 'react';
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
  userDatas,
} from '../../actions/homeActions';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
import {getAllDeclineFriend, getAllFriends} from '../../actions/chatActions';
import MatchesInNewScreen from '../matchesAllScreen/matchesInNewScreen';
import MatchesInAcceptedScreen from '../matchesAllScreen/matchesInAcceptedScreen';
import MatchesInBlockedScreen from '../matchesAllScreen/matchesInBlockedScreen';
import MatchesInSavedScreen from '../matchesAllScreen/matchesInSavedScreen';
import MatchesInSentScreen from '../matchesAllScreen/matchesInSentScreen';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import MatchesInReceivedScreen from '../matchesAllScreen/matchesInReceivedScreen';
import MatchesInDeclinedScreen from '../matchesAllScreen/MatchesInDeclinedScreen';
import ProfileAvatar from '../../components/letterProfileComponent';
import MatchesInRecentlyViewedScreen from '../matchesAllScreen/matchesInRecentlyViewedScreen';

const MatchesScreen = ({navigation, route}) => {
  const initialTab = route?.params?.initialTab || 'new'; // 👈 get from params
  const [selectedTab, setSelectedTab] = useState(initialTab);
  // const [selectedTab, setSelectedTab] = useState('new');
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [requestStatus, setRequestStatus] = useState(null);

  useEffect(() => {
    const tab = route?.params?.initialTab;

    if (tab) {
      setSelectedTab(tab);

      if (tab === 'viewed') {
        setTimeout(() => {
          scrollToEnd();
        }, 100);
      } else {
        // Optional: scroll to start if not "viewed"
        setTimeout(() => {
          scrollToStart();
        }, 100);
      }

      // Clear the param after use
      navigation.setParams({initialTab: undefined});
    }
  }, [route?.params?.initialTab]);

  const scrollToStart = () => {
    flatListRef.current?.scrollToOffset({animated: true, offset: 0});
  };

  const topModalBottomSheetRef = useRef(null);
  const flatListRef = useRef(null);

  const scrollToEnd = () => {
    flatListRef.current?.scrollToEnd({animated: true});
  };

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };
  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;

  const dispatch = useDispatch();
  const tabsData = [
    {id: 'new', label: 'New'},
    {id: 'accepted', label: 'Accepted'},
    {id: 'receive', label: 'Received'},
    {id: 'saved', label: 'Saved'},
    {id: 'sent', label: 'Sent'},
    {id: 'declined', label: 'Declined'},
    {id: 'blocked', label: 'Blocked'},
    {id: 'viewed', label: 'Viewed'},
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
        case 'blocked':
          return icons.block_icon; // Replace with your actual image reference for "Blocked"
        case 'viewed':
          return icons.recent_view_icon; // Replace with your actual image reference for "Deleted"
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
        case 'blocked':
          return {
            width: hp(14),
            height: hp(14),
            marginRight: 10,
            resizeMode: 'contain',
          };
        case 'viewed':
          return {
            width: hp(19.21),
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

  // const handleTabPress = tab => {
  //   setSelectedTab(tab);
  // };

  const handleTabPress = tab => {
    setSelectedTab(tab);

    if (tab === 'viewed') {
      setTimeout(() => {
        scrollToEnd(); // Scroll to end if 'viewed' tab is selected
      }, 100); // Small delay to ensure FlatList is rendered
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'new':
        return (
          <View>
            <MatchesInNewScreen />
          </View>
        );

      case 'accepted':
        return (
          <View>
            <MatchesInAcceptedScreen />
          </View>
        );

      case 'receive':
        return (
          <View>
            <MatchesInReceivedScreen />
          </View>
        );

      case 'saved':
        return (
          <View>
            <MatchesInSavedScreen />
          </View>
        );

      case 'declined':
        return (
          <View>
            <MatchesInDeclinedScreen />
          </View>
        );

      case 'sent':
        return (
          <View>
            <MatchesInSentScreen />
          </View>
        );

      case 'blocked':
        return (
          <View>
            <MatchesInBlockedScreen />
          </View>
        );

      case 'viewed':
        return (
          <View>
            <MatchesInRecentlyViewedScreen />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainer}>
        {/*<View style={style.headerContainerTittleStyle}>*/}
        {/*  <Image*/}
        {/*    source={images.happyMilanColorLogo}*/}
        {/*    style={style.customerHeaderLogo}*/}
        {/*  />*/}

        {/*  /!*<TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>*!/*/}
        {/*  <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>*/}
        {/*    {userImage ? (*/}
        {/*      <Image*/}
        {/*        source={userImage ? {uri: userImage} : images.empty_male_Image}*/}
        {/*        style={style.profileLogoStyle}*/}
        {/*      />*/}
        {/*    ) : (*/}
        {/*      <ProfileAvatar*/}
        {/*        firstName={user?.user?.firstName}*/}
        {/*        lastName={user?.user?.lastName}*/}
        {/*        textStyle={style.profileLogoStyle}*/}
        {/*        profileTexts={{fontSize: fontSize(10)}}*/}
        {/*      />*/}
        {/*    )}*/}
        {/*  </TouchableOpacity>*/}
        {/*</View>*/}

        <View>
          <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />
        </View>

        <HomeTopSheetComponent
          isVisible={topModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        />

        <View>
          {/*<FlatList*/}
          {/*  horizontal*/}
          {/*  showsHorizontalScrollIndicator={false}*/}
          {/*  data={tabsData}*/}
          {/*  renderItem={renderTabItem}*/}
          {/*  keyExtractor={item => item.id}*/}
          {/*  contentContainerStyle={style.flatListStatusBarStyle}*/}
          {/*/>*/}
          <FlatList
            ref={flatListRef}
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
