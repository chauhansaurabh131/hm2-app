import React, {useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import style from './style';
import {icons, images} from '../../assets';
import {hp, wp} from '../../utils/helpers';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {useNavigation} from '@react-navigation/native';

const MatchesScreen = ({navigation}) => {
  // const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('new'); // Default selected tab is 'new'
  const [topModalVisible, setTopModalVisible] = useState(false);

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

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    // Call toggleModal to show the top modal
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
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        navigation.navigate(
          'UserDetailsScreen',
          //   {
          //   userName: 'saurabh',
          // }
        );
      }}>
      <Image source={item.image} style={style.userImageStyle} />

      <View style={style.UserDetailsContainer}>
        <View style={style.onlineBodyStyle}>
          <Text style={style.bodyTextStyle}>Online</Text>
        </View>

        <TouchableOpacity>
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
            <Text style={style.userDetailsTextStyle}>{item.occupation}</Text>

            <View style={style.verticalLineStyle} />

            <Text style={style.userDetailsTextStyle}>{item.city}</Text>
            <Text style={style.userDetailsTextStyle}>{item.state}</Text>
            <Text style={style.userDetailsTextStyle}>{item.country}</Text>
          </View>
        </TouchableOpacity>

        <View style={style.bottomImageContainer}>
          <TouchableOpacity
            onPress={() => {
              console.log(' === var ===> ', '.....');
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
              style={{width: hp(24.1), height: hp(20), resizeMode: 'contain'}}
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
      </View>
    </TouchableOpacity>
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
    </SafeAreaView>
  );
};

export default MatchesScreen;
