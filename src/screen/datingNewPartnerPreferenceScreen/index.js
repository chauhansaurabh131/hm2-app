import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import NewMultiSelectValueComponent from '../../components/newMultiSelectValueComponent';
import NewSelectValueComponent from '../../components/newSelectValueComponent';
import NewEnterMultipleSelectValueComponent from '../../components/newEnterMultipleSelectValueComponent';
import {
  datingPartnerReferences,
  updateDetails,
} from '../../actions/homeActions';
import {useDispatch} from 'react-redux';
import {changeStack} from '../../actions/authActions';

const DatingNewPartnerPreferenceScreen = () => {
  const [Interested, setInterested] = useState([]);
  const [ageRanges, setAgeRanges] = useState(['Select']); // Initial age range
  const [preferCity, setPreferCity] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const apiDispatch = useDispatch();

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const Dating_List = [
    'Meet New Friends',
    'Looking for Love',
    'Movie Date',
    'Foodies',
    'Travel Buddies',
    'Game Lover',
    'Chit-Chat',
    'Adventurous',
  ];

  // Create a mapping for the labels to their corresponding values
  const DatingListMapping = {
    'Meet New Friends': 'meet-new-friends',
    'Looking for Love': 'looking-for-love',
    Foodies: 'foodies',
    'Travel Buddies': 'travel-buddies',
    'Movie Date': 'movie-date',
    'Game Lover': 'game-lover',
    'Chit-Chat': 'chit-chat', // Added the correct key with hyphen
    Adventurous: 'adventurous',
  };

  const getMappedDatingValues = selectedLabels => {
    console.log('Selected Labels: ', selectedLabels); // Log the selected labels
    return selectedLabels
      .map(label => DatingListMapping[label]) // Map to corresponding value
      .filter(mappedValue => mappedValue !== undefined); // Filter out undefined values
  };

  const onGoToDashBoardPress = () => {
    console.log(' === var ===> ');

    const mappedDatingList = getMappedDatingValues(Interested);

    const getAgeRange = range => {
      if (!range || typeof range !== 'string' || range === 'Select') {
        return {};
      }

      const [min, max] = range.split('-').map(v => v.trim());
      return {min, max};
    };

    const ageRange = getAgeRange(ageRanges);

    const payload = {
      interestedIn: mappedDatingList, // Send the mapped values instead of labels
      // age: {min: ageRange[0], max: ageRange[1]},
      age: ageRange,
      preferredLocation: preferCity,
    };

    setLoading(true);

    dispatch(
      datingPartnerReferences(payload, () => {
        apiDispatch(
          updateDetails(
            {userPartnerPreCompleted: true},
            () => {
              setLoading(false);
              // navigation.navigate('HomeTabs');
              dispatch(changeStack());
            },
            () => {
              setLoading(false);
            },
          ),
        );
      }),
    );
  };

  const isFormValid =
    Interested.length > 0 && ageRanges !== 'Select' && preferCity.length > 0;

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
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
            left: wp(15),
            height: '100%',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{height: hp(16), width: hp(16)}}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins600,
          }}>
          Partner Preferences
        </Text>
      </View>

      {/* Banner Image */}
      <Image
        source={images.cartoon_couple_two}
        style={{
          width: '100%',
          height: '15%', // ⭐ Control banner height here
        }}
        resizeMode="stretch" // ⭐ IMPORTANT
      />

      <ScrollView
        contentContainerStyle={{
          // paddingHorizontal: wp(17),
          paddingTop: hp(20),
          // backgroundColor: 'orange',
          // marginHorizontal: 17,
        }}>
        <View style={{marginTop: hp(5), marginHorizontal: 17}}>
          <NewMultiSelectValueComponent
            title="Select Prefer Interests"
            value={Interested} // 👈 ARRAY
            dropdownData={Dating_List}
            onValueChange={setInterested} // 👈 ARRAY SETTER
            bottomSheetHeight={hp(480)}
            showDivider={false}
            selectedContainerStyle={{top: -10}}
            maxSelection={3}
          />
        </View>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(20),
          }}
        />

        <View style={{marginTop: hp(15), marginHorizontal: 17}}>
          <NewSelectValueComponent
            title="Select Your Age Range"
            value={ageRanges}
            dropdownData={[
              '18 - 25',
              '26 - 35',
              '36 - 45',
              '46 - 52',
              '53 - 60',
              '60 - 70',
            ]}
            onValueChange={setAgeRanges}
            bottomSheetHeight={hp(500)}
            showDivider={false}
          />
        </View>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(15),
          }}
        />

        <View style={{marginHorizontal: 17, marginTop: hp(15)}}>
          <NewEnterMultipleSelectValueComponent
            title="Select Your Prefer Cities"
            value={preferCity}
            onValueChange={setPreferCity}
            modalTitle="City"
            EnterModalPlaceholderTittle="Enter City"
            showDivider={false}
            valuesBelowContainerStyle={{top: -12}}
          />
        </View>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(15),
          }}
        />
      </ScrollView>

      {!isKeyboardVisible && (
        <View
          style={{
            position: 'absolute',
            bottom: hp(0),
            width: '100%',
            alignItems: 'center',
            paddingHorizontal: wp(17),
            backgroundColor: 'white',
            height: hp(80),
          }}>
          <TouchableOpacity
            activeOpacity={isFormValid ? 0.7 : 1}
            disabled={!isFormValid}
            onPress={onGoToDashBoardPress}
            style={{
              width: '100%',
              height: hp(45),
              borderRadius: hp(25),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isFormValid ? '#7148E4' : '#EEE9FF',
              marginTop: hp(10),
            }}>
            {/* Center Text */}
            {loading ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <>
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins400,
                    textAlign: 'center',
                  }}>
                  Go to Dashboard
                </Text>

                {/* Right Arrow */}
                <Image
                  source={icons.back_arrow_icon}
                  style={{
                    position: 'absolute',
                    right: wp(20),
                    transform: [{rotate: '180deg'}],
                    width: hp(16),
                    height: hp(16),
                    resizeMode: 'contain',
                    tintColor: colors.white,
                  }}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default DatingNewPartnerPreferenceScreen;
