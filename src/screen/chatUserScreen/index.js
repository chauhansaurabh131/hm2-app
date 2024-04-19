import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const ChatUserScreen = ({navigation, route}) => {
  const {userData} = route.params || {};
  const [user, setUser] = useState(userData);

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  console.log(' === userData ..... ===> ', userData);
  console.log(' === var ===> ', userData.name);
  //

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: wp(17), backgroundColor: 'grey'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Image
            source={images.happyMilanColorLogo}
            style={{
              width: wp(96),
              height: hp(24),
              resizeMode: 'contain',
              marginTop: hp(14),
            }}
          />
          <TouchableOpacity activeOpacity={0.7}>
            <Image
              source={images.profileDisplayImage}
              style={{
                width: hp(24),
                height: hp(24),
                borderRadius: 50,
                resizeMode: 'stretch',
                marginRight: wp(2),
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginTop: hp(22),
            flexDirection: 'row',
            alignItems: 'center', // Align items vertically
            backgroundColor: 'orange',
          }}>
          <Image
            // source={userData.image}
            style={{
              width: 47,
              height: 47,
              borderRadius: 50,
              marginRight: wp(14),
            }}
          />
          <View style={{flex: 1}}>
            <Text
              style={{
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins600,
                color: colors.black,
              }}>
              {/*{name?.name || ''}*/}
            </Text>

            <Text>{userData.name}</Text>
          </View>

          {/* Display the ellipsis */}
          <Image
            source={icons.three_dots_icon}
            style={{width: hp(25), height: hp(24)}}
          />
        </View>
      </View>

      <View style={{position: 'absolute', bottom: 0}}>
        <Text>dvjb</Text>
      </View>
    </SafeAreaView>
  );
};

export default ChatUserScreen;
