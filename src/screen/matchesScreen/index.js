import React, {useState} from 'react';
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

const MatchesScreen = ({navigation}) => {
  // const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('new'); // Default selected tab is 'new'
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [step, setStep] = useState(1);

  const tabsData = [
    {id: 'new', label: 'New'},
    {id: 'accepted', label: 'Accepted'},
    {id: 'declined', label: 'Declined'},
    {id: 'sent', label: 'Sent'},
    {id: 'deleted', label: 'Deleted'},
    {id: 'blocked', label: 'Blocked'},
  ];

  const USER_LIST = [
    {
      id: 1,
      name: 'Rohan Patel',
      image: require('../../assets/images/user_one.png'),
      gender: 'Male',
      age: '36',
      height: '4\'55"',
      state: 'Gujarat',
      surname: 'Patel',
      occupation: 'Software Engineer',
      country: 'NY United States',
      city: '',
    },
    {
      id: 2,
      name: 'Aarav Joshi',
      image: require('../../assets/images/user_two.png'),
      gender: 'Male',
      age: '36',
      height: '4\'55"',
      state: 'Gujarat',
      surname: 'Joshi',
      occupation: 'Software Developer',
      country: 'India',
      city: 'Rajkot',
    },
    {
      id: 3,
      name: 'Jigar Barot',
      image: require('../../assets/images/user_three.png'),
      gender: 'Male',
      age: '31',
      height: '4\'55"',
      state: 'Gujarat',
      surname: 'Barot',
      occupation: 'Software Engineer',
      country: 'India',
      city: '',
    },
    {
      id: 4,
      name: 'Vinod Maheta',
      image: require('../../assets/images/user_four.png'),
      gender: 'Male',
      age: '36',
      height: '4\'55"',
      state: 'Gujarat',
      surname: 'Maheta',
      occupation: 'Engineer',
      country: 'India',
      city: 'Mahesana',
    },
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

  const renderItem = ({item}) => (
    <View>
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

            {/*<View style={style.bottomImageContainer}>*/}
            {/*  <TouchableOpacity*/}
            {/*    onPress={() => {*/}
            {/*      console.log(' === var ===> ', '.....');*/}
            {/*      navigation.navigate('UserUploadImageFullScreen');*/}
            {/*    }}>*/}
            {/*    <Image*/}
            {/*      source={icons.image_icon}*/}
            {/*      style={{*/}
            {/*        width: hp(20),*/}
            {/*        height: hp(20),*/}
            {/*        resizeMode: 'contain',*/}
            {/*        marginRight: wp(22),*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </TouchableOpacity>*/}

            {/*  <TouchableOpacity>*/}
            {/*    <Image*/}
            {/*      source={icons.video_icon}*/}
            {/*      style={{*/}
            {/*        width: hp(24.1),*/}
            {/*        height: hp(20),*/}
            {/*        resizeMode: 'contain',*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </TouchableOpacity>*/}

            {/*  <TouchableOpacity style={{position: 'absolute', right: 40}}>*/}
            {/*    <Image*/}
            {/*      source={icons.starIcon}*/}
            {/*      style={{*/}
            {/*        width: hp(21.67),*/}
            {/*        height: hp(20),*/}
            {/*        resizeMode: 'contain',*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </TouchableOpacity>*/}
            {/*</View>*/}

            <View
              style={{
                marginTop: hp(22),
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={openModal}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={icons.couple_icon}
                  style={{width: hp(16), height: hp(14), resizeMode: 'contain'}}
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

  const handleTabPress = tab => {
    setSelectedTab(tab);
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
            // contentContainerStyle={{
            //   flexDirection: 'row',
            //   paddingHorizontal: wp(17), // Add horizontal padding
            //   marginTop: hp(22),
            //   alignItems: 'center', // Align items to center
            //   justifyContent: 'flex-start', // Align content to the sta
            // }}
          />
        </View>
      </View>

      <View style={style.containerBodyStyle}>
        <FlatList
          data={USER_LIST}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/*MATCH RASIO MODAL*/}

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

export default MatchesScreen;
