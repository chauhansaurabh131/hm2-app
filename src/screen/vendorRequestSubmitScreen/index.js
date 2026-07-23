import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Image, Text, TouchableOpacity, View} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import {useNavigation, useRoute} from '@react-navigation/native';
import ServicesProfileScreen from '../servicesProfileScreen';

const VendorRequestSubmitScreen = () => {
  const route = useRoute();

  const {vendorData, vendorId, location, category, previousScreen} =
    route.params || {};

  const navigation = useNavigation();

  const [submittedDateTime, setSubmittedDateTime] = useState('');
  const [accessDate, setAccessDate] = useState('');

  useEffect(() => {
    const now = new Date();

    // Current date & time
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
    });

    const formattedTime = now.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    setSubmittedDateTime(`${formattedDate}, ${formattedTime}`);

    // +3 days date
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 3);

    const formattedFutureDate = futureDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    setAccessDate(formattedFutureDate);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* Header */}
      <View
        style={{
          height: hp(54),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: 0,
            width: wp(50),
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{
              width: hp(14),
              height: hp(14),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins600,
          }}>
          Submitted
        </Text>
      </View>
      <View
        style={{width: '100%', height: hp(1), backgroundColor: '#E6E6E6'}}
      />

      <View style={{alignItems: 'center'}}>
        <Image
          source={icons.check_gradient_icon}
          tintColor={'#7148E4'}
          style={{
            width: hp(40),
            height: hp(40),
            resizeMode: 'contain',
            marginTop: hp(100),
          }}
        />

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(20),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(19),
          }}>
          Request Submitted
        </Text>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(13),
            fontFamily: fontFamily.poppins400,
          }}>
          {submittedDateTime}
        </Text>

        <View
          style={{
            width: '75%',
            height: hp(1),
            backgroundColor: '#D8D8D8',
            marginTop: hp(37),
          }}
        />

        <View
          style={{
            marginHorizontal: wp(30),
            alignItems: 'center',
            marginTop: hp(36),
          }}>
          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins400,
              textAlign: 'center',
            }}>
            Your request is being reviewed.{'\n'}Verification typically takes{' '}
            <Text style={{fontFamily: fontFamily.poppins600}}>
              1–3{'\n'}business days.
            </Text>{' '}
            We'll notify you once{'\n'}your claim has been approved or if we
            {'\n'}need additional information.
          </Text>

          <Text
            style={{
              color: colors.pureBlack,
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins400,
              textAlign: 'center',
              marginTop: hp(25),
            }}>
            If the owner doesn't respond by{' '}
            <Text style={{fontFamily: fontFamily.poppins600}}>
              {accessDate},
            </Text>{' '}
            you may gain access.
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            navigation.replace('ServicesProfileScreen', {
              vendorData,
              vendorId,
              location,
              category,
              previousScreen,
            });
          }}
          activeOpacity={0.6}
          style={{
            height: hp(50),
            width: '80%',
            borderRadius: hp(50),
            backgroundColor: '#7148E4',
            marginTop: hp(47),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: colors.white,
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins400,
            }}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default VendorRequestSubmitScreen;
