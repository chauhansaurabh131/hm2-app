import React, {useRef, useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {colors} from '../../utils/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import GradientButton from '../../components/GradientButton';
import CustomProgressBar from '../../components/customProgressBar';
import LinearGradient from 'react-native-linear-gradient';
import {hp, wp} from '../../utils/helpers';
import {useNavigation, useRoute} from '@react-navigation/native'; // Import the ProgressBar component

const ExploreScreen = () => {
  const [progress, setProgress] = useState(0.6); // Initial progress value
  const [ageprogress, setAgeProgress] = useState(0.1); // Initial progress value
  const [selectedTab, setSelectedTab] = useState('new'); // Default selected tab is 'new'
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [bottomsheetVisible, setBottomSheVisible] = useState(false);
  const RBSheetRef = useRef();

  const navigation = useNavigation();
  const route = useRoute();

  const {selectedBox} = route.params ?? {};

  console.log(' === selectedBox...... ===> ', selectedBox);

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
      Km: '2.1 km',
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
      Km: '2 km',
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
      Km: '3.5 km',
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
      Km: '1 km',
    },
  ];
  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

  const openBottomSheetModal = () => {
    setBottomSheVisible(!bottomsheetVisible);
  };

  const handleTabPress = tab => {
    setSelectedTab(tab);
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

  const closeBottomSheet = () => {
    RBSheetRef.current.close();
  };

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
                // navigation.navigate('UserDetailsScreen');
                navigation.navigate('UserDetailsScreen', {
                  selectedBox: selectedBox,
                });
              }}>
              <Text style={style.userNameTextStyle}>{item.name}</Text>

              <View style={style.userDetailsDescriptionContainer}>
                <Text style={style.userDetailsTextStyle}>{item.gender}</Text>
                <Text style={style.userDetailsTextStyle}>{item.age},</Text>
                <Text style={style.userDetailsTextStyle}>{item.height}</Text>

                <View style={style.verticalLineStyle} />

                <Text style={style.userDetailsTextStyle}>{item.state}</Text>
                <Text style={style.userDetailsTextStyle}>{item.surname}</Text>
                <Text style={style.userDetailsTextStyle}>({item.Km})</Text>
              </View>

              {/*<View style={style.userDetailsDescriptionContainer}>*/}
              {/*  <Text style={style.userDetailsTextStyle}>*/}
              {/*    {item.occupation}*/}
              {/*  </Text>*/}

              {/*  <View style={style.verticalLineStyle} />*/}

              {/*  <Text style={style.userDetailsTextStyle}>{item.city}</Text>*/}
              {/*  <Text style={style.userDetailsTextStyle}>{item.state}</Text>*/}
              {/*  <Text style={style.userDetailsTextStyle}>{item.country}</Text>*/}
              {/*</View>*/}
            </TouchableOpacity>

            <View style={style.bottomImageContainer}>
              <TouchableOpacity
                onPress={() => {
                  console.log(' === var ===> ', '.....');
                  navigation.navigate('UserUploadImageFullScreen');
                }}>
                <Image
                  source={icons.image_icon}
                  style={{
                    width: hp(20),
                    height: hp(20),
                    resizeMode: 'contain',
                    marginRight: wp(22),
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity>
                <Image
                  source={icons.video_icon}
                  style={{
                    width: hp(24.1),
                    height: hp(20),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>

              <TouchableOpacity style={{position: 'absolute', right: 40}}>
                <Image
                  source={icons.starIcon}
                  style={{
                    width: hp(21.67),
                    height: hp(20),
                    resizeMode: 'contain',
                  }}
                />
              </TouchableOpacity>
            </View>

            {/* Display text below the image */}
          </View>
        </View>
      </TouchableOpacity>

      <View style={style.ShareLikeContainer}>
        <TouchableOpacity activeOpacity={0.5}>
          <Image source={icons.disLike_icon} style={style.dislikeIcon} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.5}>
          <Image source={icons.likeIcon} style={style.likeIcon} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.5}>
          <Image source={icons.star_border_icon} style={style.starIcon} />
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.5}>
          <Image source={icons.shareIcon} style={style.shareIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );

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

      <View style={style.bodyContainer}>
        <View style={style.bodyTittleContainer}>
          <Text style={style.exploreTextStyle}>Explore</Text>

          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => RBSheetRef.current.open()}>
            <Image source={icons.filter_icon} style={style.filterIconStyle} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={USER_LIST}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <RBSheet
        ref={RBSheetRef}
        onClose={openBottomSheetModal}
        height={425}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
          draggableIcon: {
            backgroundColor: '#ffffff',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <View style={style.bottomSheetContainer}>
          <Text style={style.bottomSheetExploreText}>Explore By</Text>

          <View style={style.bottomSheetBodyContainer}>
            <TextInput
              placeholder={'Search by location'}
              placeholderTextColor={'black'}
              style={style.textInputBodyStyle}
            />

            <Image
              source={icons.search_icon}
              style={style.textInputIconStyle}
            />

            <View style={style.bottomSheetBodyTittleFirstStyle}>
              <Text style={style.distanceTextStyle}>Distance</Text>

              <Text style={style.kiloMeterTextStyle}>{`${Math.ceil(
                progress * 10,
              )} km`}</Text>
            </View>

            <CustomProgressBar
              progress={progress}
              onMoveCircle={newProgress => setProgress(newProgress)}
            />

            <View style={style.bottomSheetBodyTittleSecondStyle}>
              <Text style={style.ageTextStyle}>Age</Text>

              <Text style={style.ageFilterTextStyle}>{`18-${Math.max(
                Math.ceil(ageprogress * 50),
              )}`}</Text>
            </View>

            <CustomProgressBar
              progress={ageprogress}
              onMoveCircle={newProgress => setAgeProgress(newProgress)}
            />

            <GradientButton
              buttonName={'Show Me'}
              buttonTextStyle={style.bottomTextStyle}
              containerStyle={style.BottomSheetButtonContainer}
              onPress={closeBottomSheet}
            />
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default ExploreScreen;
