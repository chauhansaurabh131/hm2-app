import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
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

const AdminPartnerPreferenceScreen = (...params) => {
  const userPersonalData = params[0];

  const {isUpdatingProfile} = useSelector(state => state.auth);

  console.log(' === isUpdatingProfile ===> ', isUpdatingProfile);

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

  const toggleCountry = countries => {
    if (country.includes(countries)) {
      // Remove hobby if already selected
      setCountry(country.filter(item => item !== countries));
    } else {
      // Add hobby if not selected
      setCountry([...country, countries]);
    }
    // refRBSheet.current.close(); // Close BottomSheet after selection
  };

  const toggleState = states => {
    if (state.includes(states)) {
      // Remove hobby if already selected
      setState(state.filter(item => item !== states));
    } else {
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
      // Add hobby if not selected
      setCity([...city, cites]);
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
      // Add hobby if not selected
      setHobbies([...hobbies, hobby]);
    }
    // refRBSheet.current.close(); // Close BottomSheet after selection
  };

  const availableCountry = [
    'india',
    'canada',
    'us',
    'afghanistan',
    'china',
    'myanmar',
    'nepal',
    'sri-lanka',
    'pakistan',
    ...(Array.isArray(userPersonalData?.country)
      ? userPersonalData.country.filter(
          con =>
            ![
              'india',
              'canada',
              'us',
              'afghanistan',
              'china',
              'myanmar',
              'nepal',
              'sri-lanka',
              'pakistan',
            ].includes(con.toLowerCase()),
        )
      : []), // Default to empty array if country is undefined or not an array
  ];

  const availableState = [
    'gujarat',
    'assam',
    'andhra-pradesh',
    'arunachal-pradesh',
    'bihar',
    'chhattisgarh',
    'goa',
    'haryana',
    'himachal-pradesh',
    ...(Array.isArray(userPersonalData?.state)
      ? userPersonalData.state.filter(
          con =>
            ![
              'gujarat',
              'assam',
              'andhra-pradesh',
              'arunachal-pradesh',
              'bihar',
              'chhattisgarh',
              'goa',
              'haryana',
              'himachal-pradesh',
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

  const availableHobbies = [
    'dancing',
    'singing',
    'writing',
    'running',
    'racing',
    'gambler',
    'movie',
    'clubbing',
    'travelling',
    ...userPersonalData?.hobbies.filter(
      hobby =>
        ![
          'dancing',
          'singing',
          'writing',
          'running',
          'racing',
          'gambler',
          'movie',
          'clubbing',
          'travelling',
        ].includes(hobby.toLowerCase()),
    ),
  ];

  const handleSave = () => {
    // Save data to your backend or perform any other necessary action

    // const payload = {
    //   age: {min: minAge, max: maxAge},
    //   height: {min: minPreferHeight, max: maxPreferHeight},
    //   country: country,
    //   state: state,
    //   city: city,
    //   diet: preferDiet,
    //   income: {min: minAnnualIncome, max: maxAnnualIncome},
    //   hobbies: hobbies,
    //   // country: Array.isArray(country)
    //   //   ? country.map(con => con.trim()).filter(Boolean)
    //   //   : country
    //   //       .split(',')
    //   //       .map(con => con.trim())
    //   //       .filter(Boolean),
    //
    //   // city: Array.isArray(preferCity) ? preferCity : [preferCity],
    //   // state: Array.isArray(preferState)
    //   //   ? preferState.map(state => state.trim()).filter(Boolean) // Trim and remove empty entries
    //   //   : preferState
    //   //       .split(',')
    //   //       .map(state => state.trim())
    //   //       .filter(Boolean),
    //
    //   // income: Number(preferIncome),
    //   // diet: Array.isArray(preferDiet)
    //   //   ? preferDiet.map(diet => diet.trim()).filter(Boolean)
    //   //   : [preferDiet.trim()].filter(Boolean),
    //   // hobbies: Array.isArray(preferHobbies)
    //   //   ? preferHobbies.map(hobby => hobby.trim()).filter(Boolean)
    //   //   : [preferHobbies].filter(Boolean),
    //
    //   // hobbies: Array.isArray(preferHobbies)
    //   //   ? preferHobbies.map(hobby => hobby.trim()).filter(Boolean) // Trim and remove empty entries
    //   //   : preferHobbies
    //   //       .split(',')
    //   //       .map(hobby => hobby.trim())
    //   //       .filter(Boolean),
    // };

    // console.log(' === payload ===> ', payload);
    // dispatch(partnerReferences(payload), () => {
    //   setIsEditing(false);
    // });
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
              <Text style={style.subTittleText}>{preferDiet} </Text>
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
                      {hobby.charAt(0).toUpperCase() + hobby.slice(1)}
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
                      top: 35,
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
                      top: 35,
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
                        {states.charAt(0).toUpperCase() + states.slice(1)}
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
                    CityRefRBSheet.current.open();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={style.tittleTexts}>Select Prefer City</Text>

                  <View
                    style={{
                      position: 'absolute',
                      justifyContent: 'center',
                      alignSelf: 'center',
                      alignItems: 'center',
                      right: 5,
                      top: 35,
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
                  {city.map((cites, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => toggleCity(cites)} // Remove hobby on press
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
                        {cites.charAt(0).toUpperCase() + cites.slice(1)}
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
                <Text style={style.tittleText}>Prefer Diet</Text>

                <TouchableOpacity
                  onPress={() => {
                    DietRefRBSheet.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>{preferDiet}</Text>

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
                        {hobby.charAt(0).toUpperCase() + hobby.slice(1)}
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
                    Select State
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 0.7,
                      backgroundColor: '#E7E7E7',
                    }}
                  />

                  <View style={{marginHorizontal: 17, marginTop: 5}}>
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
                  </View>
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
                height={hp(170)} // Adjust height of Bottom Sheet
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
                  Select Prefer Diet{' '}
                </Text>

                <View style={style.bottomSheetUnderLine} />

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectDiet('Vegetarian')}>
                  <Text style={style.bottomSheetOptionText}>Vegetarian</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectDiet('Non_vegetarian')}>
                  <Text style={style.bottomSheetOptionText}>
                    Non_vegetarian
                  </Text>
                </TouchableOpacity>
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
                height={hp(390)}
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

                  <View style={{marginHorizontal: 17}}>
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
                  </View>
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
