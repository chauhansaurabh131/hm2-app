import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {icons} from '../../../assets';
import {style} from './style';
import {useDispatch, useSelector} from 'react-redux';
import {partnerReferences} from '../../../actions/homeActions';
import RBSheet from 'react-native-raw-bottom-sheet';
import AgeRangeSlider from '../../../components/ageRangeSlider';
import LinearGradient from 'react-native-linear-gradient';
import HeightRangeSlider from '../../../components/heightRangeSlider';
import MultipleValueSelectTextInput from '../../../components/mutipleValueSelectTextInput';

const AdminPartnerPreferenceScreen = (...params) => {
  const userPersonalData = params[0];

  console.log(' === userPersonalData ===> ', userPersonalData);

  const {isUpdatingProfile} = useSelector(state => state.auth);

  // console.log(' === isUpdatingProfile ===> ', isUpdatingProfile);

  // console.log(' === userPersonalData ===> ', userPersonalData?.userPartner);

  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [minAge, setMinAge] = useState(
    userPersonalData?.userPartner?.age?.min || [],
  );
  const [maxAge, setMaxAge] = useState(
    userPersonalData?.userPartner?.age?.max || [],
  );

  const [minPreferHeight, setMinPreferHeight] = useState(
    userPersonalData?.userPartner?.height?.min || [],
  );

  const [maxPreferHeight, setMaxPreferHeight] = useState(
    userPersonalData?.userPartner?.height?.max || [],
  );

  const [country, setCountry] = useState(
    userPersonalData?.userPartner?.country || [],
  );

  const [state, setState] = useState(
    userPersonalData?.userPartner?.state || [],
  );

  const [text, setText] = useState('');
  const [city, setCity] = useState(userPersonalData?.userPartner?.city || []);

  const [preferDiet, setPreferDiet] = useState(
    userPersonalData?.userPartner?.diet || [],
  );

  const [minAnnualIncome, setMinAnnualIncome] = useState(
    userPersonalData?.userPartner?.income?.min || [],
  );

  const [maxAnnualIncome, setMaxAnnualIncome] = useState(
    userPersonalData?.userPartner?.income?.max || [],
  );

  const [hobbies, setHobbies] = useState(
    userPersonalData?.userPartner?.hobbies || [],
  );

  const [ageRange, setAgeRange] = useState([minAge, maxAge]);
  const [heightRange, setHeightRange] = useState([
    minPreferHeight,
    maxPreferHeight,
  ]);
  const [annualIncomeRange, setAnnualIncomeRange] = useState([
    minAnnualIncome,
    maxAnnualIncome,
  ]);

  const ageRefRBSheet = useRef();
  const heightRefRBSheet = useRef();
  const countryRBSheet = useRef();
  const StateRefRBSheet = useRef();
  const CityRefRBSheet = useRef();
  const DietRefRBSheet = useRef();
  const IncomeRefRBSheet = useRef();
  const HobbiesRefRBSheet = useRef();

  const handleAgeRangeSubmit = range => {
    setAgeRange(range); // Update the state with the selected age range
    setMinAge(range[0]); // Update minAge
    setMaxAge(range[1]); // Update maxAge
  };

  const handleHeightRangeSubmit = range => {
    setHeightRange(range); // Update the state with the selected age range
    setMinPreferHeight(range[0]); // Update minAge
    setMaxPreferHeight(range[1]); // Update maxAge
  };

  const handleIncomeRangeSubmit = range => {
    setAnnualIncomeRange(range); // Update the state with the selected age range
    setMinAnnualIncome(range[0]); // Update minAge
    setMaxAnnualIncome(range[1]); // Update maxAge
  };

  // const toggleCountry = countries => {
  //   if (country.includes(countries)) {
  //     // Remove hobby if already selected
  //     setCountry(country.filter(item => item !== countries));
  //   } else {
  //     // Add hobby if not selected
  //     setCountry([...country, countries]);
  //   }
  //   // refRBSheet.current.close(); // Close BottomSheet after selection
  // };
  const toggleCountry = countries => {
    if (country.includes(countries)) {
      // Remove country if already selected
      setCountry(country.filter(item => item !== countries));
    } else {
      // Check if already 5 countries are selected
      if (country.length >= 5) {
        Alert.alert(
          'Maximum Selection Reached',
          'You can select a maximum of 5 country.',
          [{text: 'OK'}],
        );
        return; // Exit the function without adding
      }
      // Add country if not selected and under limit
      setCountry([...country, countries]);
    }
  };

  const toggleState = states => {
    if (state.includes(states)) {
      // Remove hobby if already selected
      setState(state.filter(item => item !== states));
    } else {
      if (state.length >= 5) {
        Alert.alert(
          'Maximum Selection Reached',
          'You can select a maximum of 5 state.',
          [{text: 'OK'}],
        );
        return; // Exit the function without adding
      }

      // Add hobby if not selected
      setState([...state, states]);
    }
    // refRBSheet.current.close(); // Close BottomSheet after selection
  };

  const toggleCity = cites => {
    if (city.includes(cites)) {
      // Remove hobby if already selected
      setCity(city.filter(item => item !== cites));
    } else {
      if (city.length >= 5) {
        Alert.alert(
          'Maximum Selection Reached',
          'You can select a maximum of 5 city.',
          [{text: 'OK'}],
        );
        return; // Exit the function without adding
      }
      // Add hobby if not selected
      setCity([...city, cites]);
    }
    // refRBSheet.current.close(); // Close BottomSheet after selection
  };

  const handleAddCity = () => {
    const newCity = text.trim();

    if (newCity === '') {
      return;
    }

    if (city.length >= 5) {
      Alert.alert('Limit Reached', 'You can only add up to 5 cities.');
      return;
    }

    // Case-insensitive check for duplicates
    const alreadyExists = city.some(
      c => c.toLowerCase() === newCity.toLowerCase(),
    );

    if (alreadyExists) {
      Alert.alert('Duplicate City', 'This city is already added.');
      setText('');
      return;
    }

    setCity(prev => [...prev, newCity]);
    setText('');
  };

  const handleRemoveCity = cityToRemove => {
    setCity(prevCities => prevCities.filter(city => city !== cityToRemove));
  };

  const toggleDiet = diets => {
    if (preferDiet.includes(diets)) {
      // Remove hobby if already selected
      setPreferDiet(preferDiet.filter(item => item !== diets));
    } else {
      if (preferDiet.length >= 3) {
        Alert.alert(
          'Maximum Selection Reached',
          'You can select a maximum of 3 Diet.',
          [{text: 'OK'}],
        );
        return; // Exit the function without adding
      }
      // Add hobby if not selected
      setPreferDiet([...preferDiet, diets]);
    }
    // refRBSheet.current.close(); // Close BottomSheet after selection
  };

  const handleSelectDiet = profileType => {
    setPreferDiet(profileType); // Update the state with the selected profile type
    DietRefRBSheet.current.close(); // Close the bottom sheet
  };

  const toggleHobby = hobby => {
    if (hobbies.includes(hobby)) {
      // Remove hobby if already selected
      setHobbies(hobbies.filter(item => item !== hobby));
    } else {
      if (hobbies.length >= 5) {
        Alert.alert(
          'Maximum Selection Reached',
          'You can select a maximum of 5 hobbies.',
          [{text: 'OK'}],
        );
        return; // Exit the function without adding
      }

      // Add hobby if not selected
      setHobbies([...hobbies, hobby]);
    }
    // refRBSheet.current.close(); // Close BottomSheet after selection
  };

  const availableCountry = [
    'india',

    ...(Array.isArray(userPersonalData?.country)
      ? userPersonalData.country.filter(
          con => !['india'].includes(con.toLowerCase()),
        )
      : []), // Default to empty array if country is undefined or not an array
  ];

  const availableState = [
    'andhra-pradesh',
    'arunachal-pradesh',
    'assam',
    'bihar',
    'chhattisgarh',
    'goa',
    'gujarat',
    'haryana',
    'himachal-pradesh',
    'jharkhand',
    'karnataka',
    'kerala',
    'madhya-pradesh',
    'maharashtra',
    'manipur',
    'meghalaya',
    'mizoram',
    'nagaland',
    'odisha',
    'punjab',
    'rajasthan',
    'sikkim',
    'tamil-nadu',
    'telangana',
    'tripura',
    'uttar-pradesh',
    'uttarakhand',
    'west-bengal',

    ...(Array.isArray(userPersonalData?.state)
      ? userPersonalData.state.filter(
          con =>
            ![
              'andhra-pradesh',
              'arunachal-pradesh',
              'assam',
              'bihar',
              'chhattisgarh',
              'goa',
              'gujarat',
              'haryana',
              'himachal-pradesh',
              'jharkhand',
              'karnataka',
              'kerala',
              'madhya-pradesh',
              'maharashtra',
              'manipur',
              'meghalaya',
              'mizoram',
              'nagaland',
              'odisha',
              'punjab',
              'rajasthan',
              'sikkim',
              'tamil-nadu',
              'telangana',
              'tripura',
              'uttar-pradesh',
              'uttarakhand',
              'west-bengal',
            ].includes(con.toLowerCase()),
        )
      : []), // Default to empty array if country is undefined or not an array
  ];

  const availableCity = [
    'surat',
    'navsari',
    'bardoli',
    'vadodara',
    'valod',
    'mumbai',
    'delhi',
    'daman',
    'sirdi',
    ...(Array.isArray(userPersonalData?.city)
      ? userPersonalData.city.filter(
          con =>
            ![
              'surat',
              'navsari',
              'bardoli',
              'vadodara',
              'valod',
              'mumbai',
              'delhi',
              'daman',
              'sirdi',
            ].includes(con.toLowerCase()),
        )
      : []), // Default to empty array if country is undefined or not an array
  ];

  const preferDietPlan = [
    'vegetarian',
    'eggetarian',
    'non_vegetarian',
    'vegan',
    'jain',
    'occasionally_non_vegetarian',
    'occasionally_vegetarian',
    'satvik',
    'other',
    ...(Array.isArray(userPersonalData?.diet)
      ? userPersonalData.diet.filter(
          con =>
            ![
              'vegetarian',
              'eggetarian',
              'non_vegetarian',
              'vegan',
              'jain',
              'occasionally_non_vegetarian',
              'occasionally_vegetarian',
              'satvik',
              'other',
            ].includes(con.toLowerCase()),
        )
      : []), // Default to empty array if country is undefined or not an array
  ];

  const availableHobbies = [
    'writing',
    'play_instrument',
    'writing',
    'poetry',
    'cooking',
    'painting',
    'gardening',
    'singing',
    'diy_crafts',
    'blogging',
    'photography',
    'dancing',
    'content_creation',
    'movie',
    'sports',
    'biking',
    'music',
    'social_media',
    'clubbing',
    'travelling',
    'gaming',
    'shopping',
    'reading',
    'binge_watching',
    'theater_events',
    'running',
    'cycling',
    'yoga',
    'walking',
    'working_out',
    'trekking',
    'aerobics_zumba',
    'swimming',
    ...userPersonalData?.hobbies.filter(
      hobby =>
        ![
          'writing',
          'play_instrument',
          'writing',
          'poetry',
          'cooking',
          'painting',
          'gardening',
          'singing',
          'diy_crafts',
          'blogging',
          'photography',
          'dancing',
          'content_creation',
          'movie',
          'sports',
          'biking',
          'music',
          'social_media',
          'clubbing',
          'travelling',
          'gaming',
          'shopping',
          'reading',
          'binge_watching',
          'theater_events',
          'running',
          'cycling',
          'yoga',
          'walking',
          'working_out',
          'trekking',
          'aerobics_zumba',
          'swimming',
        ].includes(hobby.toLowerCase()),
    ),
  ];

  const formatState = state => {
    return state
      .replace(/[-_]/g, ' ') // replace - and _ with space
      .split(' ') // split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatHobby = hobby => {
    return hobby
      .replace(/[-_]/g, ' ') // replace - and _ with space
      .split(' ') // split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatDiet = diet => {
    return diet
      .replace(/_/g, ' ') // replace underscores with spaces
      .split(' ') // split into words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const handleSave = () => {
    console.log(' === handleSave--- ===> ', preferDiet);

    setLoading(true);
    dispatch(
      partnerReferences(
        {
          age: {min: minAge, max: maxAge},
          height: {min: minPreferHeight, max: maxPreferHeight},
          country: country,
          state: state,
          city: city,
          diet: preferDiet,
          income: {min: minAnnualIncome, max: maxAnnualIncome},
          hobbies: hobbies,
        },
        () => {
          // setIsEditing(false);
          setLoading(false);
        },
      ),
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headingContainer}>
        {!isEditing ? (
          <Text style={style.headingText}>Partner Preference</Text>
        ) : (
          <Text style={style.headingText}>Partner Preference</Text>
        )}

        {!isEditing && (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={style.editIconContainer}>
            <Image source={icons.new_edit_icon} style={style.editIcon} />
          </TouchableOpacity>
        )}
      </View>

      <View style={style.horizontalLineOne} />

      <View style={style.bodyContainer}>
        {!isEditing ? (
          // <View style={style.bodyContainerStyle}>
          <View>
            <View style={{marginHorizontal: 17, marginTop: 5}}>
              <Text style={style.tittleText}>Select Age Range</Text>
              <Text style={style.subTittleText}>
                {minAge} - {maxAge}
              </Text>
            </View>

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#EFEFEF',
                marginTop: hp(25),
              }}
            />

            <View style={[style.subTittleContainer, {marginHorizontal: 17}]}>
              <Text style={style.tittleText}>Select Height Range</Text>
              <Text style={style.subTittleText}>
                {minPreferHeight} - {maxPreferHeight}
              </Text>
            </View>

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#EFEFEF',
                marginTop: hp(25),
              }}
            />

            <View style={[style.subTittleContainer, {marginHorizontal: 17}]}>
              <Text style={style.tittleTexts}>Select Prefer Country</Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: hp(15),
                }}>
                {country.map((countries, index) => (
                  <View
                    key={index}
                    style={{
                      borderColor: '#DEDEDE',
                      borderWidth: 1,
                      borderRadius: 25,
                      paddingHorizontal: wp(18),
                      paddingVertical: hp(8),
                      marginRight: wp(10),
                      marginBottom: hp(10),
                      backgroundColor: colors.white,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins500,
                        color: colors.black,
                        lineHeight: hp(24),
                      }}>
                      {countries.charAt(0).toUpperCase() + countries.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#EFEFEF',
                marginTop: hp(15),
              }}
            />

            <View style={[style.subTittleContainer, {marginHorizontal: 17}]}>
              <Text style={style.tittleTexts}>Select Prefer State</Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: hp(15),
                }}>
                {state.map((states, index) => (
                  <View
                    key={index}
                    style={{
                      borderColor: '#DEDEDE',
                      borderWidth: 1,
                      borderRadius: 25,
                      paddingHorizontal: wp(18),
                      paddingVertical: hp(8),
                      marginRight: wp(10),
                      marginBottom: hp(10),
                      backgroundColor: colors.white,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins500,
                        color: colors.black,
                        lineHeight: hp(24),
                      }}>
                      {formatState(states)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#EFEFEF',
                marginTop: hp(15),
              }}
            />

            <View style={[style.subTittleContainer, {marginHorizontal: 17}]}>
              <Text style={style.tittleTexts}>Select Prefer City</Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: hp(15),
                }}>
                {city.map((states, index) => (
                  <View
                    key={index}
                    style={{
                      borderColor: '#DEDEDE',
                      borderWidth: 1,
                      borderRadius: 25,
                      paddingHorizontal: wp(18),
                      paddingVertical: hp(8),
                      marginRight: wp(10),
                      marginBottom: hp(10),
                      backgroundColor: colors.white,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins500,
                        color: colors.black,
                        lineHeight: hp(24),
                      }}>
                      {states.charAt(0).toUpperCase() + states.slice(1)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#EFEFEF',
                marginTop: hp(15),
              }}
            />

            <View style={[style.subTittleContainer, {marginHorizontal: 17}]}>
              <Text style={style.tittleText}>Prefer Diet</Text>
              {/*<Text style={style.subTittleText}>{preferDiet} </Text>*/}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: hp(15),
                }}>
                {preferDiet.map((diets, index) => (
                  <View
                    key={index}
                    style={{
                      borderColor: '#DEDEDE',
                      borderWidth: 1,
                      borderRadius: 25,
                      paddingHorizontal: wp(18),
                      paddingVertical: hp(8),
                      marginRight: wp(10),
                      marginBottom: hp(10),
                      backgroundColor: colors.white,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins500,
                        color: colors.black,
                        lineHeight: hp(24),
                      }}>
                      {formatDiet(diets)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#EFEFEF',
                marginTop: hp(15),
              }}
            />

            <View style={[style.subTittleContainer, {marginHorizontal: 17}]}>
              <Text style={style.tittleText}>Select Annual Income</Text>
              <Text style={style.subTittleText}>
                {minAnnualIncome} - {maxAnnualIncome} Lacs
              </Text>
            </View>

            <View
              style={{
                width: '100%',
                height: 1,
                backgroundColor: '#EFEFEF',
                marginTop: hp(15),
              }}
            />

            <View style={[style.subTittleContainer, {marginHorizontal: 17}]}>
              <Text style={style.tittleTexts}>Select Hobbies</Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: hp(15),
                  marginBottom: hp(25),
                }}>
                {hobbies.map((hobby, index) => (
                  <View
                    key={index}
                    style={{
                      borderColor: '#DEDEDE',
                      borderWidth: 1,
                      borderRadius: 25,
                      paddingHorizontal: wp(18),
                      paddingVertical: hp(8),
                      marginRight: wp(10),
                      marginBottom: hp(10),
                      backgroundColor: colors.white,
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        fontFamily: fontFamily.poppins500,
                        color: colors.black,
                        lineHeight: hp(24),
                      }}>
                      {/*{hobby.charAt(0).toUpperCase() + hobby.slice(1)}*/}
                      {formatHobby(hobby)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : (
          <View>
            {/*<View style={style.bodyContainerStyle}>*/}
            <View>
              <View style={{marginHorizontal: 17}}>
                <Text style={style.tittleText}>Select Age Range</Text>
                <TouchableOpacity
                  onPress={() => {
                    ageRefRBSheet.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {minAge} - {maxAge}
                  </Text>

                  <View style={{position: 'absolute', right: 5, top: -3}}>
                    <Image
                      source={icons.rightSideIcon}
                      style={style.rightSideIcon}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: '#EFEFEF',
                  marginTop: hp(25),
                }}
              />

              <View style={[style.subTittleContainer, {marginHorizontal: 17}]}>
                <Text style={style.tittleText}>Select Height Range</Text>

                <TouchableOpacity
                  onPress={() => {
                    heightRefRBSheet.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {minPreferHeight} - {maxPreferHeight}
                  </Text>

                  <View style={{position: 'absolute', right: 5, top: -3}}>
                    <Image
                      source={icons.rightSideIcon}
                      style={style.rightSideIcon}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: '#EFEFEF',
                  marginTop: hp(25),
                }}
              />

              <View style={[style.subTittleContainer, {marginHorizontal: 17}]}>
                <TouchableOpacity
                  onPress={() => {
                    countryRBSheet.current.open();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={style.tittleTexts}>Select Prefer Country</Text>

                  <View
                    style={{
                      position: 'absolute',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      alignItems: 'center',
                      right: 5,
                      // top: 35,
                    }}>
                    <Image
                      source={icons.rightSideIcon}
                      style={style.rightSideIcon}
                    />
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: hp(15),
                  }}>
                  {country.map((countries, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => toggleCountry(countries)} // Remove hobby on press
                      style={{
                        borderColor: '#DEDEDE',
                        borderWidth: 1,
                        borderRadius: 25,
                        paddingHorizontal: wp(15),
                        paddingVertical: hp(10),
                        marginRight: wp(10),
                        marginBottom: hp(10),
                        backgroundColor: colors.white,
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins500,
                          color: colors.black,
                          lineHeight: hp(24),
                        }}>
                        {countries.charAt(0).toUpperCase() + countries.slice(1)}
                      </Text>

                      <View
                        style={{
                          marginLeft: 15,
                          width: hp(16),
                          height: hp(16),
                          backgroundColor: '#5F6368',
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 9,
                            fontWeight: 'bold',
                          }}>
                          X
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: '#EFEFEF',
                  marginTop: hp(15),
                }}
              />

              <View style={[style.subTittleContainer, {marginHorizontal: 17}]}>
                <TouchableOpacity
                  onPress={() => {
                    StateRefRBSheet.current.open();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={style.tittleTexts}>Select Prefer State</Text>

                  <View
                    style={{
                      position: 'absolute',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      alignItems: 'center',
                      right: 5,
                      // top: 35,
                    }}>
                    <Image
                      source={icons.rightSideIcon}
                      style={style.rightSideIcon}
                    />
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: hp(15),
                  }}>
                  {state.map((states, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => toggleState(states)} // Remove hobby on press
                      style={{
                        borderColor: '#DEDEDE',
                        borderWidth: 1,
                        borderRadius: 25,
                        paddingHorizontal: wp(15),
                        paddingVertical: hp(10),
                        marginRight: wp(10),
                        marginBottom: hp(10),
                        backgroundColor: colors.white,
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins500,
                          color: colors.black,
                          lineHeight: hp(24),
                        }}>
                        {/*{states.charAt(0).toUpperCase() + states.slice(1)}*/}
                        {formatState(states)}
                      </Text>

                      <View
                        style={{
                          marginLeft: 15,
                          width: hp(16),
                          height: hp(16),
                          backgroundColor: '#5F6368',
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 9,
                            fontWeight: 'bold',
                          }}>
                          X
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: '#EFEFEF',
                  marginTop: hp(15),
                }}
              />

              <View style={[style.subTittleContainer, {marginHorizontal: 17}]}>
                {/*<TouchableOpacity*/}
                {/*  // onPress={() => {*/}
                {/*  //   CityRefRBSheet.current.open();*/}
                {/*  // }}*/}
                {/*  style={{*/}
                {/*    flexDirection: 'row',*/}
                {/*    alignItems: 'center',*/}
                {/*    justifyContent: 'space-between',*/}
                {/*  }}>*/}
                {/*  <Text style={style.tittleTexts}>Select Prefer City</Text>*/}

                {/*  <View*/}
                {/*    style={{*/}
                {/*      position: 'absolute',*/}
                {/*      justifyContent: 'center',*/}
                {/*      alignSelf: 'center',*/}
                {/*      alignItems: 'center',*/}
                {/*      right: 5,*/}
                {/*      // top: 35,*/}
                {/*    }}>*/}
                {/*    <Image*/}
                {/*      source={icons.rightSideIcon}*/}
                {/*      style={style.rightSideIcon}*/}
                {/*    />*/}
                {/*  </View>*/}
                {/*</TouchableOpacity>*/}

                <TextInput
                  style={{
                    height: 50,
                    borderWidth: 0.8,
                    borderColor: 'black',
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins500,
                    color: colors.black,
                    borderTopWidth: 0,
                    borderRightWidth: 0,
                    borderLeftWidth: 0,
                    width: '95%',
                  }}
                  placeholder="Enter Prefer City"
                  placeholderTextColor={colors.black}
                  value={text}
                  onChangeText={setText}
                  onSubmitEditing={handleAddCity} // add city when pressing enter
                  returnKeyType="done"
                />

                {/*<MultipleValueSelectTextInput*/}
                {/*  placeholder="Select Prefer City"*/}
                {/*  maxItems={5}*/}
                {/*  value={city}*/}
                {/*  onChange={setCity}*/}
                {/*/>*/}

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: hp(25),
                  }}>
                  {city.map((Cities, index) => (
                    <TouchableOpacity
                      key={index}
                      style={{
                        borderColor: '#DEDEDE',
                        borderWidth: 1,
                        borderRadius: 25,
                        paddingHorizontal: wp(15),
                        paddingVertical: hp(10),
                        marginRight: wp(10),
                        marginBottom: hp(10),
                        backgroundColor: colors.white,
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}
                      onPress={() => handleRemoveCity(Cities)}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins500,
                          color: colors.black,
                          lineHeight: hp(24),
                        }}>
                        {Cities.charAt(0).toUpperCase() + Cities.slice(1)}
                      </Text>
                      <View
                        style={{
                          marginLeft: 15,
                          width: hp(16),
                          height: hp(16),
                          backgroundColor: '#5F6368',
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 9,
                            fontWeight: 'bold',
                          }}>
                          ✕
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>

                {/*<View*/}
                {/*  style={{*/}
                {/*    flexDirection: 'row',*/}
                {/*    flexWrap: 'wrap',*/}
                {/*    marginTop: hp(15),*/}
                {/*  }}>*/}
                {/*  {city.map((cites, index) => (*/}
                {/*    <TouchableOpacity*/}
                {/*      key={index}*/}
                {/*      onPress={() => toggleCity(cites)} // Remove hobby on press*/}
                {/*      style={{*/}
                {/*        borderColor: '#DEDEDE',*/}
                {/*        borderWidth: 1,*/}
                {/*        borderRadius: 25,*/}
                {/*        paddingHorizontal: wp(15),*/}
                {/*        paddingVertical: hp(10),*/}
                {/*        marginRight: wp(10),*/}
                {/*        marginBottom: hp(10),*/}
                {/*        backgroundColor: colors.white,*/}
                {/*        alignItems: 'center',*/}
                {/*        flexDirection: 'row',*/}
                {/*      }}>*/}
                {/*      <Text*/}
                {/*        style={{*/}
                {/*          fontSize: fontSize(16),*/}
                {/*          fontFamily: fontFamily.poppins500,*/}
                {/*          color: colors.black,*/}
                {/*          lineHeight: hp(24),*/}
                {/*        }}>*/}
                {/*        {cites.charAt(0).toUpperCase() + cites.slice(1)}*/}
                {/*      </Text>*/}

                {/*      <View*/}
                {/*        style={{*/}
                {/*          marginLeft: 15,*/}
                {/*          width: hp(16),*/}
                {/*          height: hp(16),*/}
                {/*          backgroundColor: '#5F6368',*/}
                {/*          borderRadius: 50,*/}
                {/*          alignItems: 'center',*/}
                {/*          justifyContent: 'center',*/}
                {/*        }}>*/}
                {/*        <Text*/}
                {/*          style={{*/}
                {/*            color: 'white',*/}
                {/*            fontSize: 9,*/}
                {/*            fontWeight: 'bold',*/}
                {/*          }}>*/}
                {/*          X*/}
                {/*        </Text>*/}
                {/*      </View>*/}
                {/*    </TouchableOpacity>*/}
                {/*  ))}*/}
                {/*</View>*/}
              </View>

              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: '#EFEFEF',
                  marginTop: hp(15),
                }}
              />

              <View style={[style.subTittleContainer, {marginHorizontal: 17}]}>
                {/*<Text style={style.tittleText}>Prefer Diet</Text>*/}

                {/*<TouchableOpacity*/}
                {/*  onPress={() => {*/}
                {/*    DietRefRBSheet.current.open();*/}
                {/*  }}*/}
                {/*  style={style.subTittleContainerStyle}>*/}
                {/*  /!*<Text style={style.subTittleText}>{preferDiet}</Text>*!/*/}

                {/*  <View style={{position: 'absolute', right: 5, top: -3}}>*/}
                {/*    <Image*/}
                {/*      source={icons.rightSideIcon}*/}
                {/*      style={style.rightSideIcon}*/}
                {/*    />*/}
                {/*  </View>*/}
                {/*</TouchableOpacity>*/}

                <TouchableOpacity
                  onPress={() => {
                    DietRefRBSheet.current.open();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={style.tittleTexts}>Select Prefer Diet</Text>

                  <View
                    style={{
                      position: 'absolute',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      alignItems: 'center',
                      right: 5,
                      // top: 35,
                    }}>
                    <Image
                      source={icons.rightSideIcon}
                      style={style.rightSideIcon}
                    />
                  </View>
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: hp(15),
                  }}>
                  {preferDiet.map((diets, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => toggleDiet(diets)} // Remove hobby on press
                      style={{
                        borderColor: '#DEDEDE',
                        borderWidth: 1,
                        borderRadius: 25,
                        paddingHorizontal: wp(15),
                        paddingVertical: hp(10),
                        marginRight: wp(10),
                        marginBottom: hp(10),
                        backgroundColor: colors.white,
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins500,
                          color: colors.black,
                          lineHeight: hp(24),
                        }}>
                        {/*{preferDiet}*/}
                        {/*{diets.charAt(0).toUpperCase() + diets.slice(1)}*/}
                        {formatDiet(diets)}
                      </Text>

                      <View
                        style={{
                          marginLeft: 15,
                          width: hp(16),
                          height: hp(16),
                          backgroundColor: '#5F6368',
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 9,
                            fontWeight: 'bold',
                          }}>
                          X
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: '#EFEFEF',
                  marginTop: hp(15),
                }}
              />

              <View
                style={[
                  style.subTittleContainer,
                  {
                    marginTop: hp(26),
                    marginHorizontal: 17,
                  },
                ]}>
                <Text style={style.tittleText}>Select Annual Income</Text>

                <TouchableOpacity
                  onPress={() => {
                    IncomeRefRBSheet.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {minAnnualIncome} - {maxAnnualIncome} Lacs
                  </Text>

                  <View style={{position: 'absolute', right: 5, top: -3}}>
                    <Image
                      source={icons.rightSideIcon}
                      style={style.rightSideIcon}
                    />
                  </View>
                </TouchableOpacity>
              </View>

              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: '#EFEFEF',
                  marginTop: hp(15),
                }}
              />

              <View
                style={[
                  style.subTittleContainer,
                  {marginTop: hp(26), marginHorizontal: 17},
                ]}>
                <TouchableOpacity
                  onPress={() => {
                    HobbiesRefRBSheet.current.open();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={style.tittleTexts}>Select Hobbies</Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    marginTop: hp(15),
                  }}>
                  {hobbies.map((hobby, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => toggleHobby(hobby)} // Remove hobby on press
                      style={{
                        borderColor: '#DEDEDE',
                        borderWidth: 1,
                        borderRadius: 25,
                        paddingHorizontal: wp(15),
                        paddingVertical: hp(10),
                        marginRight: wp(10),
                        marginBottom: hp(10),
                        backgroundColor: colors.white,
                        alignItems: 'center',
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          fontFamily: fontFamily.poppins500,
                          color: colors.black,
                          lineHeight: hp(24),
                        }}>
                        {/*{hobby.charAt(0).toUpperCase() + hobby.slice(1)}*/}
                        {formatHobby(hobby)}
                      </Text>

                      <View
                        style={{
                          marginLeft: 15,
                          width: hp(16),
                          height: hp(16),
                          backgroundColor: '#5F6368',
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: 'white',
                            fontSize: 9,
                            fontWeight: 'bold',
                          }}>
                          X
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View
                style={{
                  width: '100%',
                  height: 1,
                  backgroundColor: '#EFEFEF',
                  marginTop: hp(15),
                }}
              />

              {/* AGE Bottom Sheet */}
              <RBSheet
                ref={ageRefRBSheet}
                height={300}
                openDuration={250}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                }}>
                {/* Bottom Sheet Content */}

                <Text
                  style={{
                    marginHorizontal: 17,
                    color: colors.black,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins500,
                    marginTop: hp(5),
                  }}>
                  Select Age Range
                </Text>

                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E7E7E7',
                    marginTop: hp(15),
                  }}
                />

                <View style={{marginTop: 15, marginHorizontal: 17}}>
                  <View style={{alignItems: 'center', marginTop: hp(37)}}>
                    <AgeRangeSlider
                      initialRange={ageRange}
                      onSubmitRange={handleAgeRangeSubmit}
                      tittleLabelText={'Select Age Range'}
                      min={18}
                      max={50}
                      containerStyle={{width: '100%'}}
                      labelContainerStyle={{
                        marginHorizontal: 3,
                        marginBottom: 5,
                      }}
                      rangeLabel={{
                        fontsize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins600,
                        marginTop: 10,
                      }}
                      tittleLabel={{
                        fontsize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                        color: '#9A9A9A',
                        marginTop: 10,
                      }}
                      trackStyle={{height: 3}}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    ageRefRBSheet.current.close();
                  }}>
                  <LinearGradient
                    colors={['#2D46B9', '#8D1D8D']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{
                      width: hp(162),
                      height: hp(44),
                      borderRadius: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginTop: hp(32),
                    }}>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Add
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </RBSheet>

              {/* HEIGHT Bottom Sheet */}
              <RBSheet
                ref={heightRefRBSheet}
                height={300}
                openDuration={250}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    // paddingHorizontal: 20,
                  },
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                }}>
                {/* Bottom Sheet Content */}

                <Text
                  style={{
                    marginHorizontal: 17,
                    color: colors.black,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins500,
                    marginTop: hp(5),
                  }}>
                  Select Height Range
                </Text>

                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E7E7E7',
                    marginTop: hp(15),
                  }}
                />

                <View style={{marginTop: 15, marginHorizontal: 17}}>
                  <View style={{alignItems: 'center', marginTop: hp(37)}}>
                    <HeightRangeSlider
                      initialRange={heightRange}
                      onSubmitRange={handleHeightRangeSubmit}
                      tittleLabelText={'Select Height Range'}
                      containerStyle={{width: '100%'}}
                      labelContainerStyle={{
                        marginHorizontal: 3,
                        marginBottom: 5,
                      }}
                      rangeLabel={{
                        fontsize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins600,
                      }}
                      tittleLabel={{
                        fontsize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                        color: '#9A9A9A',
                      }}
                      trackStyle={{height: 3}}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    heightRefRBSheet.current.close();
                  }}>
                  <LinearGradient
                    colors={['#2D46B9', '#8D1D8D']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{
                      width: hp(162),
                      height: hp(44),
                      borderRadius: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginTop: hp(32),
                    }}>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Add
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </RBSheet>

              {/*COUNTRY BOTTOM SHEET*/}
              <RBSheet
                ref={countryRBSheet}
                height={hp(150)}
                openDuration={250}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingHorizontal: wp(5),
                  },
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: fontSize(16),
                      fontFamily: fontFamily.poppins500,
                      marginBottom: hp(10),
                      color: colors.black,
                      marginHorizontal: 17,
                    }}>
                    Select Country
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 0.7,
                      backgroundColor: '#E7E7E7',
                    }}
                  />

                  <View style={{marginHorizontal: 17, marginTop: 5}}>
                    {availableCountry.map((countries, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => toggleCountry(countries)} // Add/remove hobby on press
                        style={{
                          marginTop: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: fontSize(16),
                            marginRight: wp(5),
                            lineHeight: hp(24),
                            fontFamily: fontFamily.poppins400,
                            color: country.includes(countries)
                              ? colors.gray
                              : colors.black,
                          }}>
                          {countries.charAt(0).toUpperCase() +
                            countries.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </RBSheet>

              {/*STATE BOTTOM SHEET*/}
              <RBSheet
                ref={StateRefRBSheet}
                height={hp(500)}
                openDuration={250}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingHorizontal: wp(5),
                  },
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: fontSize(16),
                      fontFamily: fontFamily.poppins500,
                      marginBottom: hp(10),
                      color: colors.black,
                      marginHorizontal: 17,
                    }}>
                    Select State
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 0.7,
                      backgroundColor: '#E7E7E7',
                    }}
                  />

                  <ScrollView
                    style={{marginHorizontal: 17, marginTop: 5}}
                    contentContainerStyle={{paddingBottom: hp(80)}}>
                    {availableState.map((states, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => toggleState(states)} // Add/remove hobby on press
                        style={{
                          marginTop: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: fontSize(16),
                            marginRight: wp(5),
                            lineHeight: hp(24),
                            fontFamily: fontFamily.poppins400,
                            color: state.includes(states)
                              ? colors.gray
                              : colors.black,
                          }}>
                          {states.charAt(0).toUpperCase() + states.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </RBSheet>

              {/*CITY BOTTOM SHEET*/}
              <RBSheet
                ref={CityRefRBSheet}
                height={hp(380)}
                openDuration={250}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingHorizontal: wp(5),
                  },
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: fontSize(16),
                      fontFamily: fontFamily.poppins500,
                      marginBottom: hp(10),
                      color: colors.black,
                      marginHorizontal: 17,
                    }}>
                    Select City
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 0.7,
                      backgroundColor: '#E7E7E7',
                    }}
                  />

                  <View style={{marginHorizontal: 17}}>
                    {availableCity.map((cites, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => toggleCity(cites)} // Add/remove hobby on press
                        style={{
                          marginTop: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: fontSize(16),
                            marginRight: wp(5),
                            lineHeight: hp(24),
                            fontFamily: fontFamily.poppins400,
                            color: city.includes(cites)
                              ? colors.gray
                              : colors.black,
                          }}>
                          {cites.charAt(0).toUpperCase() + cites.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </RBSheet>

              {/*DIET BOTTOM SHEET*/}
              <RBSheet
                ref={DietRefRBSheet}
                closeOnDragDown={true} // Allows drag to close
                closeOnPressMask={true} // Allows closing when clicking outside the sheet
                height={hp(400)} // Adjust height of Bottom Sheet
                customStyles={{
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                }}>
                <Text style={style.bottomSheetTittleText}>
                  Select Prefer Diet
                </Text>

                <View style={style.bottomSheetUnderLine} />

                <View style={{marginHorizontal: 17}}>
                  {preferDietPlan.map((diets, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => toggleDiet(diets)} // Add/remove diet on press
                      style={{
                        marginTop: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: fontSize(16),
                          marginRight: wp(5),
                          lineHeight: hp(24),
                          fontFamily: fontFamily.poppins400,
                          color: preferDiet.includes(diets)
                            ? colors.gray
                            : colors.black,
                        }}>
                        {diets
                          .replace(/_/g, ' ')
                          .split(' ')
                          .map(
                            word =>
                              word.charAt(0).toUpperCase() +
                              word.slice(1).toLowerCase(),
                          )
                          .join(' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </RBSheet>

              {/*ANNUAL INCOME BOTTOM SHEET */}
              <RBSheet
                ref={IncomeRefRBSheet}
                height={300}
                openDuration={250}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    // paddingHorizontal: 20,
                  },
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                }}>
                {/* Bottom Sheet Content */}

                <Text
                  style={{
                    marginHorizontal: 17,
                    color: colors.black,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins500,
                    marginTop: hp(5),
                  }}>
                  Select Annual Income
                </Text>

                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E7E7E7',
                    marginTop: hp(15),
                  }}
                />

                <View style={{marginTop: 15, marginHorizontal: 17}}>
                  <View style={{alignItems: 'center', marginTop: hp(37)}}>
                    <AgeRangeSlider
                      initialRange={annualIncomeRange}
                      onSubmitRange={handleIncomeRangeSubmit}
                      tittleLabelText={'Annual Income'}
                      rangeDatalabel={' Lacs'}
                      min={5}
                      max={30}
                      containerStyle={{width: '100%'}}
                      labelContainerStyle={{
                        marginHorizontal: 3,
                        marginBottom: 5,
                      }}
                      rangeLabel={{
                        fontsize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins600,
                        marginTop: 10,
                      }}
                      tittleLabel={{
                        fontsize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                        color: '#9A9A9A',
                        marginTop: 10,
                      }}
                      trackStyle={{height: 3}}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    IncomeRefRBSheet.current.close();
                  }}>
                  <LinearGradient
                    colors={['#2D46B9', '#8D1D8D']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={{
                      width: hp(162),
                      height: hp(44),
                      borderRadius: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      marginTop: hp(32),
                    }}>
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Add
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </RBSheet>

              {/*HOBBIES BOTTOM SHEET*/}
              <RBSheet
                ref={HobbiesRefRBSheet}
                height={hp(500)}
                openDuration={250}
                closeOnDragDown={true}
                closeOnPressMask={true}
                // onClose={() => setIsEditing(false)} // Close editing mode when bottom sheet closes
                customStyles={{
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    paddingHorizontal: wp(5),
                  },
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                }}>
                <View>
                  <Text
                    style={{
                      fontSize: fontSize(16),
                      fontFamily: fontFamily.poppins500,
                      marginBottom: hp(10),
                      color: colors.black,
                      marginHorizontal: 17,
                    }}>
                    Edit Hobbies
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 0.7,
                      backgroundColor: '#E7E7E7',
                    }}
                  />

                  <ScrollView
                    style={{marginHorizontal: 17}}
                    contentContainerStyle={{paddingBottom: hp(80)}}>
                    {availableHobbies.map((hobby, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => toggleHobby(hobby)} // Add/remove hobby on press
                        style={{
                          marginTop: 10,
                          flexDirection: 'row',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: fontSize(16),
                            marginRight: wp(5),
                            lineHeight: hp(24),
                            fontFamily: fontFamily.poppins400,
                            color: hobbies.includes(hobby)
                              ? colors.gray
                              : colors.black,
                          }}>
                          {hobby.charAt(0).toUpperCase() + hobby.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </RBSheet>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSave}
                style={{marginHorizontal: 17}}>
                <LinearGradient
                  colors={['#0F52BA', '#8225AF']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0.5}}
                  style={{
                    width: '100%',
                    height: hp(44),
                    borderRadius: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'center',
                    marginTop: hp(32),
                    marginBottom: hp(25),
                  }}>
                  {loading ? (
                    <ActivityIndicator size="large" color={colors.white} />
                  ) : (
                    <Text
                      style={{
                        color: colors.white,
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Save Changes
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdminPartnerPreferenceScreen;
