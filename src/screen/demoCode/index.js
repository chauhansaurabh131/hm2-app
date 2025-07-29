import React, {useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {icons} from '../../assets';

const DemoCode = () => {
  const [selectedDelete, setSelectedDelete] = useState(null);
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [customReason, setCustomReason] = useState('');

  const deleteBottomSheetRef = useRef(null);

  const handleDeleteOptionSelect = option => {
    setSelectedDelete(option);
    deleteBottomSheetRef.current.close();

    if (option === 'Other (Please Specify)') {
      setShowOtherInput(true);
    } else {
      setShowOtherInput(false);
      setCustomReason('');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      {/* Reason Selector Dropdown */}
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            marginTop: 10,
            width: '100%',
            height: 50,
            borderColor: '#E5E5E5',
            borderWidth: 1,
            borderRadius: 50,
            paddingLeft: 20,
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          onPress={() => deleteBottomSheetRef.current.open()}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins400,
              color: colors.black,
              flex: 1,
            }}>
            {selectedDelete || 'Select Reason'}
          </Text>
          <Image
            source={icons.drooDownLogo}
            style={{
              width: 13,
              height: 10,
              marginRight: 21,
              tintColor: colors.black,
            }}
          />
        </TouchableOpacity>
      </View>

      {/* Conditionally show input when 'Other' is selected */}
      {showOtherInput && (
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 20,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            padding: 10,
          }}>
          <TextInput
            placeholder="Please specify your reason"
            multiline
            numberOfLines={4}
            value={customReason}
            onChangeText={setCustomReason}
            style={{
              fontSize: fontSize(16),
              fontFamily: fontFamily.poppins400,
              textAlignVertical: 'top',
              color: colors.black,
            }}
          />
        </View>
      )}

      {/* Submit Button */}
      <TouchableOpacity
        style={{marginTop: 50, justifyContent: 'center', alignItems: 'center'}}
        onPress={() => {
          // Example submit action
          console.log('Selected Reason:', selectedDelete);
          if (selectedDelete === 'Other (Please Specify)') {
            console.log('Custom Reason:', customReason);
          }
        }}>
        <Text style={{color: 'black', fontSize: fontSize(30)}}>Submit</Text>
      </TouchableOpacity>

      {/* Bottom Sheet with reasons */}
      <RBSheet
        ref={deleteBottomSheetRef}
        height={hp(520)}
        openDuration={250}
        customStyles={{
          draggableIcon: {
            backgroundColor: '#ffffff',
          },
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}>
        <View>
          <Text
            style={{
              marginTop: hp(23),
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins400,
              color: colors.black,
              marginBottom: hp(21),
              marginHorizontal: 30,
            }}>
            Select the reason
          </Text>

          <View
            style={{
              width: '100%',
              height: 0.7,
              backgroundColor: '#E7E7E7',
            }}
          />

          <View style={{marginHorizontal: 30}}>
            {[
              'I’ve found a suitable partner.',
              'I’m now married or engaged',
              'Taking a break from matchmaking',
              'I have privacy or safety concerns.',
              'I found the app/website difficult to use.',
              'I received too many unrelated matches.',
              'Did not get expected responses',
              'The platform is too costly or not valuable',
              'Other (Please Specify)',
            ].map((reason, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleDeleteOptionSelect(reason)}>
                <Text
                  style={{
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                    color: colors.black,
                    marginTop: 24,
                  }}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </RBSheet>
    </SafeAreaView>
  );
};

export default DemoCode;
