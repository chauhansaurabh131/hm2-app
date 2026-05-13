import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {hp, wp, fontSize, fontFamily} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {BASE_URL} from '../../utils/constants';
import ImagePicker from 'react-native-image-crop-picker';

// 🔥 SHIMMER
import LinearGradient from 'react-native-linear-gradient';
import {createShimmerPlaceholder} from 'react-native-shimmer-placeholder';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

// 🔥 CATEGORY CONFIG
const CATEGORY_CONFIG = {
  profilePic: {
    title: 'Photos',
    subtitle: 'Add Your\nLatest Pictures',
    icon: icons.image_icon,
  },
  educationDetails: {
    title: 'Education',
    subtitle: 'Add Your\nQualification',
    icon: icons.educationLogo,
  },
  hobbiesAndInterest: {
    title: 'Hobbies',
    subtitle: 'Add Your\nHobbies',
    icon: icons.internetLogo,
  },
  professional: {
    title: 'Occupation',
    subtitle: 'Add Your\nOccupation',
    icon: icons.professionalLogo,
  },
  basicDetails: {
    title: 'Basic Info',
    subtitle: 'Add Your\nBasic Info',
    icon: icons.profileLogo,
  },
  contactDetails: {
    title: 'Contact',
    subtitle: 'Add Your\nContact',
    icon: icons.phoneLogo,
  },
  locationDetails: {
    title: 'Location',
    subtitle: 'Add Your\nLocation',
    icon: icons.addressLogo,
  },
};

const HomeRemainingDataComponent = () => {
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const navigation = useNavigation();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 API CALL
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          setLoading(true);

          const response = await fetch(
            `${BASE_URL}/api/v1/user/user/pending-fields-for-mobile`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          const json = await response.json();

          if (response.ok) {
            setData(json?.data || []);
          } else {
            console.log('API Error', json);
          }
        } catch (err) {
          console.log('Error:', err);
        } finally {
          setLoading(false);
        }
      };

      if (accessToken) {
        fetchData();
      }
    }, [accessToken]),
  );

  // 🔥 GALLERY
  const openGallery = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'photo',
    })
      .then(images => {
        const formattedImages = images.map(image => ({
          uri: image.path,
        }));

        navigation.navigate('SetProfilePictureScreen', {
          selectedImages: formattedImages,
        });
      })
      .catch(error => {
        console.log('Error opening gallery:', error);
      });
  };

  // 🔥 NAVIGATION
  const handleNavigation = category => {
    switch (category) {
      case 'profilePic':
        openGallery();
        break;
      case 'educationDetails':
        navigation.navigate('EditEducationScreen');
        break;
      case 'hobbiesAndInterest':
        navigation.navigate('EditHobbiesScreen');
        break;
      case 'professional':
        navigation.navigate('EditProfessionalScreen');
        break;
      case 'basicDetails':
        navigation.navigate('EditGeneralScreen');
        break;
      case 'contactDetails':
        navigation.navigate('EditContactScreen');
        break;
      case 'locationDetails':
        navigation.navigate('EditLocationScreen');
        break;
      default:
        break;
    }
  };

  const validData = data?.filter(
    item => item.category && item.fields?.length > 0,
  );

  // 🔥 SHIMMER UI
  const renderShimmer = () => (
    <FlatList
      data={[1, 2, 3, 4]}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingLeft: wp(16),
        marginTop: hp(17),
      }}
      keyExtractor={(item, index) => index.toString()}
      renderItem={() => (
        <View
          style={{
            width: wp(156),
            marginRight: wp(19),
            alignItems: 'center',
          }}>
          <ShimmerPlaceholder
            style={{
              width: hp(30),
              height: hp(30),
              borderRadius: 10,
              marginTop: hp(27),
            }}
          />

          <ShimmerPlaceholder
            style={{
              width: wp(80),
              height: hp(14),
              borderRadius: 5,
              marginTop: hp(20),
            }}
          />

          <ShimmerPlaceholder
            style={{
              width: wp(100),
              height: hp(12),
              borderRadius: 5,
              marginTop: hp(6),
            }}
          />

          <ShimmerPlaceholder
            style={{
              width: hp(15),
              height: hp(15),
              borderRadius: 50,
              marginTop: hp(17),
            }}
          />
        </View>
      )}
    />
  );

  return (
    <SafeAreaView style={{backgroundColor: colors.white}}>
      {loading ? (
        renderShimmer() // 🔥 SHOW SHIMMER
      ) : (
        <>
          {validData?.length > 0 && (
            <Text
              style={{
                color: colors.pureBlack,
                fontSize: fontSize(18),
                fontFamily: fontFamily.poppins500,
                marginTop: hp(40),
                marginHorizontal: wp(17),
              }}>
              Complete Your Profile
            </Text>
          )}

          <FlatList
            data={validData}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: wp(16),
              paddingRight: wp(10),
              marginTop: hp(17),
              marginBottom: hp(20),
            }}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item, index}) => {
              const config = CATEGORY_CONFIG[item.category];
              if (!config) {
                return null;
              }

              const isEven = index % 2 === 0;
              const backgroundColor = isEven ? '#FBF3F8' : '#F1F6FE';
              const iconColor = isEven ? '#E91E63' : '#3F51B5';

              return (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => handleNavigation(item.category)}
                  style={{
                    width: wp(156),
                    backgroundColor,
                    borderRadius: hp(20),
                    marginRight: wp(19),
                    alignItems: 'center',
                  }}>
                  <Image
                    source={config.icon}
                    style={{
                      width: hp(30),
                      height: hp(30),
                      tintColor: iconColor,
                      marginTop: hp(27),
                      resizeMode: 'contain',
                    }}
                  />

                  <Text
                    style={{
                      fontSize: fontSize(14),
                      fontFamily: fontFamily.poppins600,
                      color: colors.black,
                      marginTop: hp(20),
                    }}>
                    {config.title}
                  </Text>

                  <Text
                    style={{
                      fontSize: fontSize(10),
                      fontFamily: fontFamily.poppins400,
                      color: '#8B8B8B',
                      textAlign: 'center',
                      marginTop: hp(6),
                    }}>
                    {config.subtitle}
                  </Text>

                  <Image
                    source={icons.plus_icon}
                    style={{
                      width: hp(15),
                      height: hp(15),
                      tintColor: iconColor,
                      marginTop: hp(17),
                      marginBottom: hp(22),
                    }}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default HomeRemainingDataComponent;
