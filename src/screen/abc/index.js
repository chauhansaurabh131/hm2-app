import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {useDispatch, useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import {icons} from '../../assets';
import {updateDetails} from '../../actions/homeActions';

const Abc = () => {
  const {user} = useSelector(state => state.auth);
  const initialHobbies = user?.user?.hobbies || []; // Default to empty array if undefined

  console.log(' === initialHobbies ===> ', initialHobbies);

  const [hobbies, setHobbies] = useState(initialHobbies); // State for selected hobbies
  const [creative, setCreative] = useState(''); // TextInput value
  const [isEditing, setIsEditing] = useState(false); // State for Edit/Save toggle
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
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {/* Edit/Save Button */}
      {isEditing ? (
        <View>
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
        <View>
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

      <View style={{marginHorizontal: 17, marginTop: 50}}>
        <TextInput
          value={creative}
          onChangeText={setCreative}
          placeholder={'Hobbies and Interest'}
          editable={false}
          style={{
            color: colors.black,
            fontSize: fontSize(18),
            lineHeight: hp(28),
            fontFamily: fontFamily.poppins600,
            marginTop: hp(2),
            borderWidth: 1,
            borderColor: colors.gray,
            paddingVertical: 10,
            paddingHorizontal: 12,
            borderRadius: 5,
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
            marginTop: hp(10),
          }}>
          {hobbies.map((hobby, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => toggleHobby(hobby)} // Remove hobby on press
              style={{
                borderColor: colors.gray,
                borderWidth: 1,
                borderRadius: 20,
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
              fontSize: fontSize(18),
              fontFamily: fontFamily.poppins600,
              marginBottom: hp(2),
            }}>
            Edit Hobbies
          </Text>
          <View style={{width: '100%', height: 1, backgroundColor: 'red'}} />

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
                    color: hobbies.includes(hobby)
                      ? colors.green
                      : colors.black,
                  }}>
                  {hobby.charAt(0).toUpperCase() + hobby.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default Abc;
