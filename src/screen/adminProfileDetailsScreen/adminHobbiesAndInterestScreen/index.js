import React, {useRef, useState} from 'react';
import {
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
import {useDispatch} from 'react-redux';
import {updateDetails} from '../../../actions/homeActions';
import RBSheet from 'react-native-raw-bottom-sheet';

const AdminHobbiesAndInterestScreen = (...params) => {
  const userPersonalData = params[0];

  console.log(' === userPersonalData ===> ', userPersonalData?.hobbies);

  const initialHobbies = userPersonalData?.hobbies || [];

  const [hobbies, setHobbies] = useState(initialHobbies); // State for selected hobbies
  const [creative, setCreative] = useState(''); // TextInput value
  const [isEditing, setIsEditing] = useState(false);
  const refRBSheet = useRef(); // Reference for the Bottom Sheet
  const apiDispatch = useDispatch();

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

  // Function to handle hobby selection/deselection
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

  // Function to handle Save button click
  const handleSave = () => {
    console.log('Selected Hobbies:', hobbies); // Log selected hobbies
    setIsEditing(false); // Toggle back to Edit mode

    apiDispatch(updateDetails({hobbies: hobbies}));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {isEditing ? (
        <View style={{position: 'absolute', right: 20, top: -45}}>
          <TouchableOpacity
            onPress={handleSave}
            style={{
              marginTop: hp(10),
              borderRadius: 25,
              backgroundColor: '#F0F9FF',
              width: hp(40),
              height: hp(40),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={icons.new_Save_icon}
              style={{
                width: hp(15),
                height: hp(15),
                tintColor: colors.blue,
              }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            position: 'absolute',
            right: 20,
            top: -45,
          }}>
          <TouchableOpacity
            onPress={() => {
              refRBSheet.current.open(); // Open BottomSheet
              setIsEditing(true);
            }}
            style={{
              marginTop: hp(10),
              borderRadius: 25,
              backgroundColor: '#F0F9FF',
              width: hp(40),
              height: hp(40),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={icons.new_edit_icon}
              style={{width: hp(15), height: hp(15), tintColor: colors.blue}}
            />
          </TouchableOpacity>
        </View>
      )}

      <View
        style={{
          width: '100%',
          borderColor: '#E8E8E8',
          borderWidth: 0.7,
          marginTop: hp(25),
        }}
      />

      <View style={{marginTop: 15}}>
        <View style={{marginHorizontal: 17}}>
          <TextInput
            value={creative}
            onChangeText={setCreative}
            editable={false}
            placeholder={' Selected Hobbies'}
            placeholderTextColor={'black'}
            style={{
              color: colors.black,
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins500,
              // marginTop: hp(2),
              borderWidth: 1,
              borderColor: colors.black,
              // paddingVertical: 10,
              // paddingHorizontal: 12,
              // borderRadius: 5,
              borderTopWidth: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
            }}
          />

          {/* Display hobbies as tags */}
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
                  paddingVertical: hp(5),
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
              </TouchableOpacity>
            ))}
          </View>

          <View style={{height: 50}} />
        </View>

        {/* Bottom Sheet */}
        <RBSheet
          ref={refRBSheet}
          height={hp(300)}
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
              style={{width: '100%', height: 0.7, backgroundColor: '#E7E7E7'}}
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
    </SafeAreaView>
  );
};

export default AdminHobbiesAndInterestScreen;
