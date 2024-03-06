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

const AdminEducationDetailsScreen = () => {
  const [degree, setDegree] = useState('BCA');
  const [college, setCollege] = useState('Delhi University');
  const [city, setCity] = useState('Noida');
  const [state, setState] = useState('Delhi');
  const [country, setCountry] = useState('India');
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
              value={degree}
              onChangeText={setDegree}
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
              {degree}
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
              value={college}
              onChangeText={setCollege}
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
              {college}
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
              value={city}
              onChangeText={setCity}
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
              {city}
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
              value={state}
              onChangeText={setState}
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
              {state}
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
              value={country}
              onChangeText={setCountry}
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
              {country}
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

export default AdminEducationDetailsScreen;
