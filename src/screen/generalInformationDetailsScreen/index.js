import React, {useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import TextInputSearchAndDropDowm from '../../components/textInputSearchAndDropDown';

const GeneralInformationDetailsScreen = () => {
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionSelected = option => {
    setSelectedOption(option.label); // Update the selected option to the label
  };

  const handleGenderSelection = gender => {
    setSelectedGender(gender);
  };

  const getGradientColors = gender => {
    if (selectedGender === gender) {
      return {
        colors: ['#0D4EB3', '#9413D0'],
        textColor: 'white',
      };
    }
    return {
      colors: ['transparent', 'transparent'],
      textColor: 'black',
    };
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            marginHorizontal: wp(18),
            marginTop: hp(8),
          }}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(19),
              fontFamily: fontFamily.poppins600,
              marginTop: hp(16),
            }}>
            Give us your name as per ID
          </Text>

          <TextInput
            placeholder={'First Name'}
            placeholderTextColor={colors.black}
            style={{
              width: '100%',
              height: hp(50),
              borderWidth: 1,
              borderColor: colors.lightGreyBorder,
              padding: 15,
              borderRadius: 10,
              marginTop: hp(7),
              paddingLeft: 16,
              color: colors.black,
            }}
          />

          <TextInput
            placeholder={'Last Name'}
            placeholderTextColor={colors.black}
            style={[
              {
                width: '100%',
                height: hp(50),
                borderWidth: 1,
                borderColor: colors.lightGreyBorder,
                padding: 15,
                borderRadius: 10,
                marginTop: hp(13),
                paddingLeft: 16,
                color: colors.black,
              },
            ]}
          />

          <Text
            style={{
              fontSize: hp(14),
              lineHeight: hp(18),
              marginTop: hp(16),
              color: colors.black,
              fontFamily: fontFamily.poppins600,
            }}>
            Gender
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: hp(5),
            }}>
            {['Male', 'Female', 'Other'].map(gender => (
              <TouchableOpacity
                key={gender}
                activeOpacity={0.5}
                style={[
                  {
                    width: 105,
                    height: 50,
                    borderColor: colors.lightGreyBorder,
                    borderRadius: 10,
                    justifyContent: 'center',
                    color: colors.black,
                  },
                  {borderWidth: selectedGender === gender ? 0 : 1},
                ]}
                onPress={() => handleGenderSelection(gender)}>
                <LinearGradient
                  colors={getGradientColors(gender).colors}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={{
                    flex: 1,
                    borderRadius: 10,
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      color: getGradientColors(gender).textColor,
                    }}>
                    {gender}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            style={{
              fontSize: hp(14),
              lineHeight: hp(18),
              marginTop: hp(16),
              color: colors.black,
              fontFamily: fontFamily.poppins600,
            }}>
            Date of Birth
          </Text>

          <View
            style={{
              width: '100%',
              height: hp(55),
              borderWidth: 1,
              borderColor: colors.lightGreyBorder,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
              marginTop: hp(9),
            }}>
            <TextInput
              placeholder={'18.08.1992'}
              keyboardType={'numeric'}
              placeholderTextColor={colors.black}
              style={{flex: 1, color: colors.black}}
            />
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}>
              <Image
                source={icons.calendar_icon}
                style={{
                  width: hp(21.34),
                  height: hp(24),
                  marginLeft: wp(10),
                  marginRight: wp(5),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>

          <Text
            style={{
              fontSize: hp(14),
              lineHeight: hp(18),
              marginTop: hp(16),
              color: colors.black,
              fontFamily: fontFamily.poppins600,
            }}>
            Birth of Time
          </Text>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: hp(9),
            }}>
            <TextInput
              placeholder={'HH'}
              keyboardType={'numeric'}
              placeholderTextColor={colors.black}
              style={{
                width: wp(103),
                height: hp(50),
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.lightGreyBorder,
                textAlign: 'center', // Align text in center
                color: colors.black,
              }}
            />

            {/* Add a transparent placeholder text to align the cursor */}
            <TextInput
              placeholder={'MM'}
              keyboardType={'numeric'}
              placeholderTextColor={colors.black} // Make placeholder text transparent
              style={{
                width: wp(103),
                height: hp(50),
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.lightGreyBorder,
                textAlign: 'center', // Align text in center
                color: colors.black,
              }}
            />

            <TextInput
              placeholder={'SS'}
              keyboardType={'numeric'}
              placeholderTextColor={colors.black}
              style={{
                width: wp(103),
                height: hp(50),
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.lightGreyBorder,
                textAlign: 'center', // Align text in center
                color: colors.black,
                textAlignVertical: 'center',
              }}
            />
          </View>

          <Text
            style={{
              fontSize: hp(14),
              lineHeight: hp(18),
              marginTop: hp(16),
              marginBottom: hp(9),
              color: colors.black,
              fontFamily: fontFamily.poppins600,
            }}>
            Religion
          </Text>

          {/*<DropDownTextInputComponent*/}
          {/*  placeholder={'Select or Type'}*/}
          {/*  data={RELIGION_LIST}*/}
          {/*  height={50}*/}
          {/*  placeholderStyle={{paddingLeft: 10}}*/}
          {/*  iconStyle={{marginRight: 3}}*/}
          {/*/>*/}

          <TextInputSearchAndDropDowm
            placeholder={'Select'}
            dropdownItems={[
              'Hinduism',
              'Christianity',
              'Islam',
              'Buddhism',
              'Sikhism',
              'Judaism',
              'Jainism',
              'Shinto',
            ]}
          />

          <Text
            style={{
              fontSize: hp(14),
              lineHeight: hp(18),
              marginTop: hp(16),
              color: colors.black,
              fontFamily: fontFamily.poppins600,
              marginBottom: hp(9),
            }}>
            Caste / Sub Caste
          </Text>

          {/*<DropDownTextInputComponent*/}
          {/*  placeholder={'Type'}*/}
          {/*  data={CASTE_LIST}*/}
          {/*  height={50}*/}
          {/*  placeholderStyle={{paddingLeft: 10}}*/}
          {/*  iconStyle={{marginRight: 3}}*/}
          {/*/>*/}

          <TextInputSearchAndDropDowm
            placeholder={'Select'}
            dropdownItems={[
              'Brahmins',
              'Kshatriyas',
              'Vaishyas',
              'Shudras',
              'Pariash',
            ]}
          />

          <Text
            style={{
              fontSize: hp(14),
              lineHeight: hp(18),
              marginTop: hp(16),
              color: colors.black,
              fontFamily: fontFamily.poppins600,
              marginBottom: hp(9),
            }}>
            Current City
          </Text>

          {/*<DropDownTextInputComponent*/}
          {/*  placeholder={'Select'}*/}
          {/*  data={CurrentCity}*/}
          {/*  height={50}*/}
          {/*  placeholderStyle={{paddingLeft: 10}}*/}
          {/*  iconStyle={{marginRight: 3}}*/}
          {/*/>*/}

          <TextInputSearchAndDropDowm
            placeholder={'Select'}
            dropdownItems={[
              'GUJARAT',
              'MUMBAI',
              'DELHI',
              'SURAT',
              'VADODARA',
              'AHAMADABAD',
              'ANAND',
              'NAVSARI',
            ]}
          />
          <Text
            style={{
              fontSize: hp(14),
              lineHeight: hp(18),
              marginTop: hp(16),
              color: colors.black,
              fontFamily: fontFamily.poppins600,
              marginBottom: hp(9),
            }}>
            Country of Living
          </Text>

          {/*<DropDownTextInputComponent*/}
          {/*  placeholder={'Select'}*/}
          {/*  data={COUNTRY_LIST}*/}
          {/*  height={50}*/}
          {/*  placeholderStyle={{paddingLeft: 10}}*/}
          {/*  iconStyle={{marginRight: 3}}*/}
          {/*/>*/}

          <TextInputSearchAndDropDowm
            placeholder={'Select'}
            dropdownItems={[
              'INDIA',
              'SRI LANKA',
              'Germany',
              'Malaysia',
              'Australia',
              'Belize',
              'Brazil',
              'NAVSARI',
            ]}
          />

          <Text
            style={{
              fontSize: hp(14),
              lineHeight: hp(18),
              marginTop: hp(16),
              color: colors.black,
              fontFamily: fontFamily.poppins600,
            }}>
            Write About Yourself
          </Text>

          <TextInput
            numberOfLines={10}
            multiline={true}
            placeholderTextColor={colors.black}
            style={{
              height: hp(90),
              borderWidth: 1,
              borderColor: colors.lightGreyBorder,
              borderRadius: 10,
              justifyContent: 'flex-start',
              marginTop: hp(12),
              color: colors.black,
              textAlignVertical: 'top',
            }}
          />

          <View style={{marginBottom: 50}} />
        </View>
      </ScrollView>
      {/*</KeyboardAwareScrollView>*/}
    </SafeAreaView>
  );
};

export default GeneralInformationDetailsScreen;
