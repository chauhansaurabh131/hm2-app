import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image, Text, View} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {icons} from '../../assets';

const VendorAlertScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View
        style={{
          height: hp(60),
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins400,
          }}>
          Alerts
        </Text>
      </View>

      <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <View
          style={{
            backgroundColor: '#F8F6FF',
            width: hp(82),
            height: hp(82),
            borderRadius: hp(50),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.not_Notification_Icon}
            style={{width: hp(30), height: hp(32), resizeMode: 'contain'}}
          />
        </View>

        <View style={{alignItems: 'center'}}>
          <Text
            style={{
              marginTop: hp(21),
              color: '#959090',
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins500,
            }}>
            You don’t have any
          </Text>
          <Text
            style={{
              color: '#959090',
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins500,
            }}>
            notifications yet.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default VendorAlertScreen;
