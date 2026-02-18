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
import NewSelectValueComponent from '../../components/newSelectValueComponent';
import NewMultiSelectValueComponent from '../../components/newMultiSelectValueComponent';
import NewEnterMultipleSelectValueComponent from '../../components/newEnterMultipleSelectValueComponent';
import {partnerReferences, updateDetails} from '../../actions/homeActions';
import {useDispatch} from 'react-redux';
import {changeStack} from '../../actions/authActions';

const LongTermPartnerPreferenceScreen = () => {
  const [ageRanges, setAgeRanges] = useState(['Select']); // Initial age range
  const [heightRanges, setHeightRanges] = useState(['Select']); // Initial age range
  const [preferStates, setPreferStates] = useState([]);
  const [preferCity, setPreferCity] = useState([]);
  const [preferDiets, setPreferDiets] = useState([]);
  const [hobbies, setHobbies] = useState([]);
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

  const Prefer_State = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya-Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
  ];

  const Prefer_Diet = [
    'Vegetarian',
    'Eggetarian',
    'Non Vegetarian',
    'Vegan',
    'Jain',
    'Occasionally Non Vegetarian',
    'Occasionally Vegetarian',
    'Satvik',
    'Other',
  ];

  const Prefer_hobbies = [
    'Writing',
    'Play Instrument',
    'Poetry',
    'Cooking',
    'Painting',
    'Gardening',
    'Singing',
    'Diy Crafts',
    'Blogging',
    'Photography',
    'Dancing',
    'Content Creation',
    'Movie',
    'Sports',
    'Biking',
    'Music',
    'Social Media',
    'Clubbing',
    'Travelling',
    'Gaming',
    'Shopping',
    'Reading',
    'Binge Watching',
    'Theater Events',
    'Running',
    'Cycling',
    'Yoga',
    'Walking',
    'Working_out',
    'Trekking',
    'Aerobics Zumba',
    'Swimming',
  ];

  const isFormValid = ageRanges;
  //   &&
  // ageRanges !== 'Select' &&
  // heightRanges &&
  // heightRanges !== 'Select' &&
  // preferStates.length > 0 &&
  // preferCity.length > 0 &&
  // preferDiets.length > 0 &&
  // hobbies.length > 0;

  const onGoToDashBoardPress = () => {
    console.log(' === var ===> ');

    setLoading(true);

    const getAgeRange = range => {
      if (!range || range === 'Select') {
        return {};
      }

      const [min, max] = range.split('-').map(v => v.trim());
      return {min, max};
    };
    const ageRange = getAgeRange(ageRanges);

    const getHeightRange = range => {
      if (!range || range === 'Select') {
        return {};
      }

      // Remove "ft" and extra spaces
      const clean = range.replace('ft', '').trim();

      const [min, max] = clean.split('-').map(v => v.trim());
      return {min, max};
    };
    const heightRange = getHeightRange(heightRanges);

    const payload = {
      age: ageRange,
      height: heightRange,
      state: preferStates.map(state =>
        state.toLowerCase().replace(/\s+/g, '-'),
      ),
      city: preferCity.map(city => city.toLowerCase().replace(/\s+/g, '-')),
      diet: Array.isArray(preferDiets)
        ? preferDiets.map(diet => diet.toLowerCase().replace(/\s+/g, '_'))
        : [preferDiets.toLowerCase().replace(/\s+/g, '_')], // convert single string to array
      hobbies: Array.isArray(hobbies)
        ? hobbies.map(hobby => hobby.toLowerCase().replace(/\s+/g, '_'))
        : [hobbies.toLowerCase().replace(/\s+/g, '_')],
    };

    dispatch(
      partnerReferences(payload, () => {
        apiDispatch(
          updateDetails(
            {
              userPartnerPreCompleted: true,
            },
            () => {
              setLoading(false);
              // navigation.navigate('HomeStack');
              dispatch(changeStack());
            },
            () => {
              setLoading(false);
            },
          ),
        );
      }),
    );

    // dispatch(
    //   partnerReferences(payload, () => {
    //     // On success of partnerReferences, call updateDetails
    //     apiDispatch(
    //       updateDetails(
    //         {
    //           userPartnerPreCompleted: false, // Setting the userPartnerPreCompleted to true
    //         },
    //         () => {
    //           // On success of updateDetails, navigate to HomeTabs
    //           setLoading(false);
    //           navigation.navigate('HomeTabs');
    //         },
    //         () => {
    //           setLoading(false);
    //         },
    //       ),
    //     );
    //   }),
    // );
  };

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

      {/* Form Content */}
      <ScrollView
        contentContainerStyle={{
          // paddingHorizontal: wp(17),
          paddingTop: hp(20),
          // backgroundColor: 'orange',
          // marginHorizontal: 17,
        }}>
        <View style={{marginHorizontal: 17}}>
          <NewSelectValueComponent
            title="Select Age Range"
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
            bottomSheetHeight={hp(380)}
            showDivider={false}
          />

          <View style={{marginTop: hp(20)}}>
            <NewSelectValueComponent
              title="Select Height Range"
              value={heightRanges}
              dropdownData={[
                '3 - 4 ft',
                '4 - 5 ft',
                '6 - 7 ft',
                '7 - 8 ft',
                '9 - 10 ft',
              ]}
              onValueChange={setHeightRanges}
              bottomSheetHeight={hp(310)}
              showDivider={false}
            />
          </View>
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
          <Text
            style={{
              color: '#7148E4',
              fontSize: fontSize(14),
              fontFamily: fontFamily.poppins400,
            }}>
            Select Preferred Location
          </Text>

          <View style={{marginTop: hp(10)}}>
            <NewMultiSelectValueComponent
              title="State"
              value={preferStates} // 👈 ARRAY
              dropdownData={Prefer_State}
              onValueChange={setPreferStates} // 👈 ARRAY SETTER
              bottomSheetHeight={hp(500)}
              showDivider={false}
              showSearch={true}
              selectedContainerStyle={{top: -10}}
              maxSelection={5}
            />
          </View>

          <View style={{marginTop: hp(10)}}>
            <NewEnterMultipleSelectValueComponent
              title="City"
              value={preferCity}
              onValueChange={setPreferCity}
              modalTitle="City"
              EnterModalPlaceholderTittle="Enter City"
              showDivider={false}
              valuesBelowContainerStyle={{top: -12}}
            />
          </View>
        </View>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(15),
          }}
        />

        <View style={{marginTop: hp(20), marginHorizontal: 17}}>
          <NewMultiSelectValueComponent
            title="Prefer Diet"
            value={preferDiets} // 👈 ARRAY
            dropdownData={Prefer_Diet}
            onValueChange={setPreferDiets} // 👈 ARRAY SETTER
            bottomSheetHeight={hp(450)}
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

        <View style={{marginTop: hp(20), marginHorizontal: 17}}>
          <NewMultiSelectValueComponent
            title="Prefer Hobbies"
            value={hobbies}
            dropdownData={Prefer_hobbies}
            onValueChange={setHobbies}
            bottomSheetHeight={hp(520)}
            showDivider={false}
            selectedContainerStyle={{top: -10}}
            maxSelection={5}
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

        <View style={{height: hp(100)}} />
      </ScrollView>

      {/* Bottom Button */}
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
            disabled={!isFormValid || loading}
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
              <ActivityIndicator size="large" color="#FFF" />
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

export default LongTermPartnerPreferenceScreen;
