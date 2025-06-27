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
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../../actions/homeActions';
import RBSheet from 'react-native-raw-bottom-sheet';
import {style} from '../adminProfessionalDetailsScreen/style';
import LinearGradient from 'react-native-linear-gradient';

const AdminHobbiesAndInterestScreen = (...params) => {
  const userPersonalData = params[0];

  // const {user} = useSelector(state => state.auth);
  // const userData = user.user;
  //
  // console.log(' === userData ===> ', userData);

  // console.log(' === userPersonalData ===> ', userPersonalData?.hobbies);

  const {isUpdatingProfile} = useSelector(state => state.auth);

  // console.log(' === isUpdatingProfile ===> ', isUpdatingProfile);

  // console.log(' === userPersonalData ===> ', userPersonalData?.language);

  const initialHobbies = userPersonalData?.hobbies || [];
  const initialLanguage = userPersonalData?.language || [];

  const [hobbies, setHobbies] = useState(initialHobbies); // State for selected hobbies
  const [language, setLanguage] = useState(initialLanguage); // State for selected hobbies
  const [isEditing, setIsEditing] = useState(false);
  const refRBSheet = useRef(); // Reference for the Bottom Sheet
  const refRBSheetLanguage = useRef(); // Reference for the Bottom Sheet
  const apiDispatch = useDispatch();

  // console.log(' === isEditing ===> ', isEditing);

  // List of all available hobbies for selection
  const availableHobbies = [
    'dancing',
    'singing',
    'writing',
    'running',
    'racing',
    'gambler',
    ...initialHobbies.filter(
      hobby =>
        ![
          'dancing',
          'singing',
          'writing',
          'running',
          'racing',
          'gambler',
        ].includes(hobby.toLowerCase()),
    ),
  ];

  const availableLanguage = [
    'hindi',
    'gujarati',
    'english',
    ...initialLanguage.filter(
      lan => !['hindi', 'gujarati', 'english'].includes(lan.toLowerCase()),
    ),
  ];

  // Function to handle hobby selection/deselection
  const toggleHobby = hobby => {
    if (hobbies.includes(hobby)) {
      // Remove hobby if already selected
      setHobbies(hobbies.filter(item => item !== hobby));
    } else {
      // Add hobby if not selected
      setHobbies([...hobbies, hobby]);
    }
    // refRBSheet.current.close();
  };

  const toggleLanguage = lan => {
    if (language.includes(lan)) {
      // Remove hobby if already selected
      setLanguage(language.filter(item => item !== lan));
    } else {
      // Add hobby if not selected
      setLanguage([...language, lan]);
    }
    // refRBSheetLanguage.current.close();
  };

  // Function to handle Save button click
  const handleSave = () => {
    console.log('Selected Hobbies:', hobbies); // Log selected hobbies

    apiDispatch(
      updateDetails({hobbies: hobbies, language: language}, () => {
        setIsEditing(false);
      }),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View
        style={{
          marginHorizontal: 17,
          top: -20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        {!isEditing ? (
          <Text
            style={{
              color: 'black',
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins500,
            }}>
            Hobbies Details
          </Text>
        ) : (
          <Text
            style={{
              color: 'black',
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins500,
            }}>
            Modify Hobbies Details
          </Text>
        )}

        {!isEditing && (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={{
              width: hp(30),
              height: hp(30),
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: hp(5),
            }}>
            <Image
              source={icons.new_edit_icon}
              style={{
                tintColor: 'black',
                width: hp(16),
                height: hp(16),
              }}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={{width: '100%', height: 4, backgroundColor: '#F8F8F8'}} />

      <View style={{marginTop: hp(19)}}>
        {!isEditing ? (
          <View style={{marginHorizontal: 17}}>
            <Text
              style={{
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins500,
                color: colors.black,
              }}>
              Select Hobbies and Interest
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: hp(20),
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

            <Text
              style={{
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins500,
                color: colors.black,
              }}>
              Select Language You Known
            </Text>

            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: hp(20),
                marginBottom: hp(25),
              }}>
              {language.map((lan, index) => (
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
                    {lan.charAt(0).toUpperCase() + lan.slice(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <>
            <View style={{marginHorizontal: 17}}>
              <TouchableOpacity
                onPress={() => {
                  refRBSheet.current.open();
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: hp(5),
                }}>
                <Text
                  style={{
                    fontSize: fontSize(16),
                    fontFamily: fontFamily.poppins500,
                    color: colors.black,
                    lineHeight: hp(24),
                  }}>
                  Select Hobbies and Interest
                </Text>
                <Image
                  source={icons.rightSideIcon}
                  style={{
                    width: hp(8),
                    height: hp(15),
                    marginRight: 8,
                    tintColor: '#5F6368',
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: hp(20),
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

              <RBSheet
                ref={refRBSheet}
                height={hp(420)}
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
                onPress={() => {
                  refRBSheetLanguage.current.open();
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: hp(20),
                }}>
                <Text
                  style={{
                    fontSize: fontSize(16),
                    fontFamily: fontFamily.poppins500,
                    color: colors.black,
                    lineHeight: hp(24),
                  }}>
                  Select Language You Known
                </Text>
                <Image
                  source={icons.rightSideIcon}
                  style={{
                    width: hp(8),
                    height: hp(15),
                    marginRight: 8,
                    tintColor: '#5F6368',
                  }}
                />
              </TouchableOpacity>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: hp(20),
                }}>
                {language.map((lan, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => toggleLanguage(lan)} // Remove hobby on press
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
                      {lan.charAt(0).toUpperCase() + lan.slice(1)}
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

              <RBSheet
                ref={refRBSheetLanguage}
                height={hp(200)}
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
                    Edit Language
                  </Text>
                  <View
                    style={{
                      width: '100%',
                      height: 0.7,
                      backgroundColor: '#E7E7E7',
                    }}
                  />

                  <View style={{marginHorizontal: 17}}>
                    {availableLanguage.map((lan, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => toggleLanguage(lan)} // Add/remove hobby on press
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
                            color: language.includes(lan)
                              ? colors.gray
                              : colors.black,
                          }}>
                          {lan.charAt(0).toUpperCase() + lan.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </RBSheet>

              <TouchableOpacity activeOpacity={0.7} onPress={handleSave}>
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
                  {isUpdatingProfile ? (
                    // Show a loader when profile is being updated (i.e., when `isUpdatingProfile` is true)
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
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdminHobbiesAndInterestScreen;
