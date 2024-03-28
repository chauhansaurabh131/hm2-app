import React, {useState} from 'react';
import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import style from './style';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';

const AlertsScreen = () => {
  const [topModalVisible, setTopModalVisible] = useState(false);
  const data = [
    {
      id: '1',
      name: 'Rihan Shah',
      image: images.user_Four_Image,
      status: 'Sent you a following request',
      activity: '1h ago',
    },
    {
      id: '2',
      name: 'Rishikesh Shah',
      image: images.user_Two_Image,
      status: 'Likes you!',
      activity: '1h ago',
    },
    {
      id: '3',
      name: 'Ronit Kumar',
      image: images.user_one_Image,
      status: 'Likes you!',
      activity: '1h ago',
    },
    {
      id: '4',
      name: 'Priyal Mehta',
      image: images.demo_Seven_Image,
      status: 'Likes you!',
      activity: '1h ago',
    },
    {
      id: '5',
      name: 'Meet Patel',
      image: images.demo_Six_Image,
      status: 'Sent you a following request',
      activity: '1h ago',
    },
    {
      id: '6',
      name: 'Saurabh Singh',
      image: images.demo_Five_Image,
      status: 'Likes you!',
      activity: '50 min',
    },
    {
      id: '7',
      name: 'Kunal Sighh',
      image: images.demo_One_Image,
      status: 'Sent you a following request',
      activity: '1h ago',
    },
    {
      id: '8',
      name: 'Jeet',
      image: images.demo_Two_Image,
      status: 'Likes you!',
      activity: '2h ago',
    },
    {
      id: '9',
      name: 'Abhay Patel',
      image: images.demo_Three_Image,
      status: 'Likes you!',
      activity: '2h ago',
    },
    {
      id: '10',
      name: 'Jigar Shah',
      image: images.demo_Four_Image,
      status: 'Sent you a following request',
      activity: '1h ago',
    },
    {
      id: '11',
      name: 'Amit Jain',
      image: images.user_Two_Image,
      status: 'Likes you!',
      activity: '5h ago',
    },
    {
      id: '12',
      name: 'Kunal Chauhan',
      image: images.user_Three_Image,
      status: 'Likes you!',
      activity: '3h ago',
    },
    // Add more data as needed
  ];

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };
  const openTopSheetModal = () => {
    toggleModal();
  };

  const renderItem = ({item}) => (
    <View style={{flex: 1}}>
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          flex: 1,
        }}>
        <Image
          source={item.image}
          style={{width: 50, height: 50, borderRadius: 25, marginRight: 10}}
        />
        <View style={{flex: 1}}>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 3,
            }}>
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins600,
              }}>
              {item.name}
            </Text>
            <Text
              style={{
                color: '#D1D1D1',
                fontSize: fontSize(12),
                lineHeight: hp(18),
                fontFamily: fontFamily.poppins400,
              }}>
              {item.activity}
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(12),
                lineHeight: hp(18),
                fontFamily: fontFamily.poppins400,
              }}>
              {item.status}
            </Text>
            <Text style={{color: '#777'}}>{''}</Text>
          </View>
          <View>
            {item.status === 'Sent you a following request' && (
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  activeOpacity={0.5}
                  style={{
                    backgroundColor: '#EEEEEE',
                    borderRadius: 10,
                    width: 96,
                    height: 40,
                    justifyContent: 'center',
                    marginRight: 14,
                  }}>
                  <Text
                    style={{
                      color: 'black',
                      textAlign: 'center',
                      fontSize: fontSize(14),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                    }}>
                    Not now
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.5}>
                  <LinearGradient
                    colors={['#9413D0', '#0D4EB3']}
                    start={{x: 1, y: 0}}
                    end={{x: 0, y: 0}}
                    style={{
                      borderRadius: 10,
                      justifyContent: 'center',
                      width: 96,
                      height: 40,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        textAlign: 'center',
                        fontSize: fontSize(14),
                        lineHeight: hp(21),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Accept
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={style.container}>
      <View style={style.bodyContainer}>
        <View style={style.headerContainer}>
          <Image
            source={images.happyMilanColorLogo}
            style={{
              width: wp(96),
              height: hp(24),
              resizeMode: 'contain',
              marginTop: hp(14),
            }}
          />

          <TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>
            <Image
              source={images.profileDisplayImage}
              style={{
                width: hp(24),
                height: hp(24),
                borderRadius: 50,
                resizeMode: 'stretch',
                marginTop: hp(14),
                marginRight: wp(2),
              }}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            marginTop: hp(37),
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: hp(20),
          }}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(21),
              fontFamily: fontFamily.poppins400,
              marginLeft: wp(12),
            }}>
            All Notifications
          </Text>
          <TouchableOpacity style={{flexDirection: 'row'}} activeOpacity={0.5}>
            <Text
              style={{
                color: colors.blue,
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins400,
                marginRight: wp(9),
              }}>
              Clear
            </Text>
            <Image
              source={icons.clear_delete_icon}
              style={{
                width: hp(12),
                height: hp(12),
                resizeMode: 'contain',
                marginRight: 7,
                alignSelf: 'center',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={{marginHorizontal: wp(25), marginBottom: 130}}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <HomeTopSheetComponent
        isVisible={topModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
      />
    </SafeAreaView>
  );
};

export default AlertsScreen;
