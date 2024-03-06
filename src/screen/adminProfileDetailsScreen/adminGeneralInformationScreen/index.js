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

const AdminGeneralInformationScreen = () => {
  const [dateOfBirth, setDateOfBirth] = useState('02.03.1986');
  const [birthTime, setBirthTime] = useState('10:01:20 AM');
  const [religion, setReligion] = useState('Hindu');
  const [caste, setCaste] = useState('Patel, Kadva Patidar');
  const [currentCity, setCurrentCity] = useState('New York');
  const [country, setCountry] = useState('United States of America');
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
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
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
              {dateOfBirth}
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
            Birth Time
          </Text>
          {isEditing ? (
            <TextInput
              value={birthTime}
              onChangeText={setBirthTime}
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
              {birthTime}
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
            Religion
          </Text>
          {isEditing ? (
            <TextInput
              value={religion}
              onChangeText={setReligion}
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
              {religion}
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
            Cast/Sub Caste
          </Text>
          {isEditing ? (
            <TextInput
              value={caste}
              onChangeText={setCaste}
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
              {caste}
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
            Current City
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
            Country of Living
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

        {/* Similar pattern for other fields */}
      </View>

      {isEditing ? (
        <View style={{position: 'absolute', right: 0}}>
          <TouchableOpacity
            onPress={handleSave}
            style={{
              // backgroundColor: colors.blue,
              // backgroundColor: '#F0F9FF',
              // paddingVertical: 12,
              // paddingHorizontal: 24,
              // borderRadius: 5,
              // alignSelf: 'flex-end',
              // marginTop: hp(20),
              // alignItems: 'flex-end',
              marginTop: hp(10),
              borderRadius: 5,
              backgroundColor: '#F0F9FF',
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/*<Text*/}
            {/*  style={{*/}
            {/*    color: colors.white,*/}
            {/*    fontSize: fontSize(16),*/}
            {/*    fontFamily: fontFamily.poppins500,*/}
            {/*  }}>*/}
            {/*  Save*/}
            {/*</Text>*/}
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
              // backgroundColor: colors.blue,
              // paddingVertical: 12,
              // paddingHorizontal: 24,
              // alignSelf: 'flex-end',
              // alignItems: 'flex-end',
              marginTop: hp(10),
              borderRadius: 5,
              backgroundColor: '#F0F9FF',
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {/*<Text*/}
            {/*  style={{*/}
            {/*    color: colors.white,*/}
            {/*    fontSize: fontSize(16),*/}
            {/*    fontFamily: fontFamily.poppins500,*/}
            {/*  }}>*/}
            {/*  Edit*/}
            {/*</Text>*/}

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

export default AdminGeneralInformationScreen;
