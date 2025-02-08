import React, {useRef, useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import {icons} from '../../assets';
import {useDispatch, useSelector} from 'react-redux';
import {style} from '../adminProfileDetailsScreen/adminProfessionalDetailsScreen/style';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import {partnerReferences, updateDetails} from '../../actions/homeActions';

const Abc = () => {
  const {user} = useSelector(state => state.auth);

  const userData = user?.user;

  console.log(' === userData ===> ', userData?.hobbies);
  const apiDispatch = useDispatch();

  const [hobbies, setHobbies] = useState(userData?.hobbies); // State for selected hobbies
  const [isEditing, setIsEditing] = useState(false);

  const HobbiesRefRBSheet = useRef(); // Reference for the Bottom Sheet

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
    ...userData?.hobbies.filter(
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

  const onSavePress = () => {
    console.log(' === onSavePress ===> ', hobbies);
    apiDispatch(partnerReferences({hobbies: hobbies}));
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={{marginHorizontal: 17, marginTop: 50}}>
        {/*<TouchableOpacity*/}
        {/*  style={{*/}
        {/*    flexDirection: 'row',*/}
        {/*    justifyContent: 'space-between',*/}
        {/*    alignItems: 'center',*/}
        {/*  }}>*/}
        {/*  <Text style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>*/}
        {/*    Select Hobbies and Interest*/}
        {/*  </Text>*/}
        {/*  <Image source={icons.rightSideIcon} style={{width: 10, height: 15}} />*/}
        {/*</TouchableOpacity>*/}

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
              Job Details
            </Text>
          ) : (
            <Text
              style={{
                color: 'black',
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins500,
              }}>
              Modify Job Details
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
                style={{tintColor: 'black', width: hp(16), height: hp(16)}}
              />
            </TouchableOpacity>
          )}
        </View>

        <View
          style={{
            width: '100%',
            height: 4,
            backgroundColor: 'black',
            marginBottom: 20,
          }}
        />

        {!isEditing ? (
          <>
            <View style={{marginHorizontal: 17}}>
              <Text style={{color: 'black'}}>Hobbies and Interest</Text>

              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginTop: hp(15),
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
          </>
        ) : (
          <>
            <View style={{marginHorizontal: 17}}>
              <TouchableOpacity
                onPress={() => {
                  HobbiesRefRBSheet.current.open();
                }}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text
                  style={{color: 'black', fontSize: 16, fontWeight: 'bold'}}>
                  Select Hobbies and Interest
                </Text>
                <Image
                  source={icons.rightSideIcon}
                  style={{width: 10, height: 15}}
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

              <TouchableOpacity
                onPress={onSavePress}
                style={{
                  backgroundColor: 'orange',
                  position: 'absolute',
                  flex: 1,
                  bottom: -250,
                  width: '100%',
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 10,
                }}>
                <Text style={{color: 'black', fontSize: 24}}>Save</Text>
              </TouchableOpacity>

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
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Abc;
