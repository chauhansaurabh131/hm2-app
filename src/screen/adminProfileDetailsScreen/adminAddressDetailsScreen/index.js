import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';
import {icons} from '../../../assets';

const AdminAddressDetailsScreen = () => {
  const [residingAddress, setResidingAddress] = useState(
    '01-02, Delhi Street, Delhi, India',
  );
  const [currentCity, setCurrentCity] = useState('Delhi');
  const [currentCountry, setCurrentCountry] = useState('India');
  const [permanentAddress, setPermanentAddress] = useState(
    '01-02, Delhi Street, Delhi, India',
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Save data to your backend or perform any other necessary action
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginTop: hp(60)}}>
        <View style={{marginBottom: hp(15)}}>
          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(21),
              fontFamily: fontFamily.poppins500,
              color: colors.black,
            }}>
            Date of Birth
          </Text>
          {isEditing ? (
            <TextInput
              value={residingAddress}
              onChangeText={setResidingAddress}
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
              }}
            />
          ) : (
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(18),
                lineHeight: hp(28),
                fontFamily: fontFamily.poppins600,
                marginTop: hp(2),
              }}>
              {residingAddress}
            </Text>
          )}
        </View>

        <View style={{marginBottom: hp(15)}}>
          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(21),
              fontFamily: fontFamily.poppins500,
              color: colors.black,
            }}>
            Date of Birth
          </Text>
          {isEditing ? (
            <TextInput
              value={currentCity}
              onChangeText={setCurrentCity}
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
              }}
            />
          ) : (
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(18),
                lineHeight: hp(28),
                fontFamily: fontFamily.poppins600,
                marginTop: hp(2),
              }}>
              {currentCity}
            </Text>
          )}
        </View>

        <View style={{marginBottom: hp(15)}}>
          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(21),
              fontFamily: fontFamily.poppins500,
              color: colors.black,
            }}>
            Date of Birth
          </Text>
          {isEditing ? (
            <TextInput
              value={currentCountry}
              onChangeText={setCurrentCountry}
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
              }}
            />
          ) : (
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(18),
                lineHeight: hp(28),
                fontFamily: fontFamily.poppins600,
                marginTop: hp(2),
              }}>
              {currentCountry}
            </Text>
          )}
        </View>

        <View style={{marginBottom: hp(15)}}>
          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(21),
              fontFamily: fontFamily.poppins500,
              color: colors.black,
            }}>
            Date of Birth
          </Text>
          {isEditing ? (
            <TextInput
              value={permanentAddress}
              onChangeText={setPermanentAddress}
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
              }}
            />
          ) : (
            <Text
              style={{
                color: colors.black,
                fontSize: fontSize(18),
                lineHeight: hp(28),
                fontFamily: fontFamily.poppins600,
                marginTop: hp(2),
              }}>
              {permanentAddress}
            </Text>
          )}
        </View>
      </View>
      {isEditing ? (
        <View style={{position: 'absolute', right: 0}}>
          <TouchableOpacity
            onPress={handleSave}
            style={{
              marginTop: hp(10),
              borderRadius: 5,
              backgroundColor: '#F0F9FF',
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={icons.save_icon}
              style={{
                width: 20,
                height: 20,
                resizeMode: 'contain',
                tintColor: 'ree',
              }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            position: 'absolute',
            right: 0,
          }}>
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={{
              marginTop: hp(10),
              borderRadius: 5,
              backgroundColor: '#F0F9FF',
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={icons.edit_icon}
              style={{width: 25, height: 25, tintColor: colors.blue}}
            />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default AdminAddressDetailsScreen;
