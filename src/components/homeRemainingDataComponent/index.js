import React, {useCallback, useState} from 'react';
import {SafeAreaView, View, Text, Image, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {hp, wp, fontSize, fontFamily} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

const HomeRemainingDataComponent = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const profilePic = user?.user?.profilePic;
  const navigation = useNavigation();

  const [data, setData] = useState(null); // State to store the API response
  const [loading, setLoading] = useState(true); // State to track loading state
  const [error, setError] = useState(null); // State to track any errors

  // 🔥 CHECK IMAGE VALID OR NOT
  const hasImage =
    profilePic && profilePic !== 'null' && profilePic.trim() !== '';

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true); // reset loading on re-fetch
          const response = await fetch(
            'https://stag.mntech.website/api/v1/user/user/pending-fields-for-mobile',
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          if (response.ok) {
            const jsonResponse = await response.json();
            console.log(' === jsonResponse ===> ', jsonResponse?.data);
            setData(jsonResponse?.data);
          } else {
            throw new Error('Failed to fetch data');
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      if (accessToken) {
        fetchData();
      }
    }, [accessToken]), // will re-run when screen focuses
  );

  console.log(' === data----**** ===> ', data);

  return (
    <SafeAreaView style={{flex: 1, alignItems: 'center'}}>
      {!hasImage ? (
        // 🔥 EMPTY UI (YOUR DESIGN)
        <TouchableOpacity
          activeOpacity={0.6}
          style={{
            width: wp(156),
            height: hp(191),
            backgroundColor: '#FBF3F8',
            borderRadius: hp(20),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {/* ICON */}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={icons.color_Image_Icon} // 👉 replace with your icon
              style={{
                width: hp(30),
                height: hp(30),
                resizeMode: 'contain',
              }}
            />
          </View>

          {/* TITLE */}
          <Text
            style={{
              marginTop: hp(13),
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins600,
              color: colors.pureBlack,
            }}>
            Photos
          </Text>

          {/* SUB TEXT */}
          <Text
            style={{
              marginTop: hp(13),
              fontSize: fontSize(11),
              fontFamily: fontFamily.poppins400,
              color: '#8B8B8B',
              textAlign: 'center',
            }}>
            Add Your Latest{'\n'}Pictures
          </Text>

          {/* PLUS BUTTON */}
          <View
            style={{
              marginTop: hp(17),
            }}>
            <Image
              source={icons.plus_icon}
              style={{
                width: hp(12),
                height: hp(12),
                resizeMode: 'contain',
                tintColor: '#C93B75',
              }}
            />
          </View>
        </TouchableOpacity>
      ) : (
        // ✅ IMAGE UI
        <Image
          source={{uri: profilePic}}
          style={{
            width: wp(160),
            height: hp(200),
            borderRadius: hp(20),
            resizeMode: 'cover',
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default HomeRemainingDataComponent;
