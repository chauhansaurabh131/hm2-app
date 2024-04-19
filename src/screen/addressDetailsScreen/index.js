import React, {useState} from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, View} from 'react-native';
import style from './style';
import {colors} from '../../utils/colors';
import CheckBox from 'react-native-check-box';
import {fontFamily, fontSize, hp, isIOS} from '../../utils/helpers';
import TextInputSearchAndDropDowm from '../../components/textInputSearchAndDropDown';

const AddressDetailsScreen = ({navigation}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [isChecked, setChecked] = useState(false); // Add state for checkbox

  return (
    <SafeAreaView style={style.container}>
      <ScrollView>
        <View style={{marginHorizontal: 15, marginTop: 20}}>
          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontWeight: '400',
              fontFamily: fontFamily.poppins600,
            }}>
            Current Residing Address
          </Text>

          {/*<TextInput*/}
          {/*  IconNameDesign={icons.profileLogo}*/}
          {/*  placeholder={'Block No, Street '}*/}
          {/*  editable={true}*/}
          {/*  iconSource={icons.profileLogo}*/}
          {/*  containerStyle={{*/}
          {/*    alignSelf: 'flex-start',*/}
          {/*    marginLeft: isIOS ? hp(0) : hp(-20),*/}
          {/*    marginTop: isIOS ? hp(5) : hp(-11),*/}
          {/*  }}*/}
          {/*  inputContainer={{height: hp(50), width: '100%'}}*/}
          {/*/>*/}

          <TextInput
            placeholder={'Block No, Street '}
            placeholderTextColor={colors.black}
            style={{
              width: '100%',
              height: hp(50),
              borderWidth: 1,
              borderColor: colors.lightGreyBorder,
              padding: 15,
              borderRadius: 10,
              marginTop: hp(9),
              color: colors.black,
            }}
          />

          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontWeight: '400',
              fontFamily: fontFamily.poppins600,
              marginTop: hp(15),
              marginBottom: hp(9),
            }}>
            Current City
          </Text>

          {/*<DropDownTextInputComponent*/}
          {/*  data={CurrentCity}*/}
          {/*  placeholder={'select'}*/}
          {/*  searchPlaceholder={'Search Current City...'}*/}
          {/*  height={55}*/}
          {/*  placeholderStyle={colors.black}*/}
          {/*/>*/}

          <TextInputSearchAndDropDowm
            placeholder={'Select'}
            dropdownItems={[
              'Ahmedabad',
              'Surat',
              'vadodara',
              'Delhi',
              'Mumbai',
              'Chennai',
              'Kolkata',
              'Bangalore',
            ]}
          />

          {/*<DropDownTextInputComponent*/}
          {/*  placeholder={'select'}*/}
          {/*  data={CurrentCity}*/}
          {/*  searchPlaceholder={'Search Current City...'}*/}
          {/*  placeholderStyle={colors.black}*/}
          {/*  height={50}*/}
          {/*/>*/}

          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontWeight: '400',
              fontFamily: fontFamily.poppins600,
              marginTop: hp(15),
              // marginBottom: hp(15),
              marginBottom: hp(9),
            }}>
            Current Residing Country
          </Text>

          {/*<DropDownTextInputComponent*/}
          {/*  data={CurrentCity}*/}
          {/*  placeholder={'select'}*/}
          {/*  searchPlaceholder={'Search Current City...'}*/}
          {/*  placeholderStyle={colors.black}*/}
          {/*  height={55}*/}
          {/*/>*/}

          <TextInputSearchAndDropDowm
            placeholder={'Select'}
            dropdownItems={[
              'Ahmedabad',
              'Surat',
              'vadodara',
              'Delhi',
              'Mumbai',
              'Chennai',
              'Kolkata',
              'Bangalore',
            ]}
          />

          <Text
            style={{
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins600,
              marginTop: isIOS ? hp(15) : hp(15),
            }}>
            Same as current address
          </Text>

          <TextInput
            placeholder={'Add Your Origin'}
            placeholderTextColor={colors.black}
            style={{
              width: '100%',
              height: hp(50),
              borderWidth: 1,
              borderColor: colors.lightGreyBorder,
              padding: 15,
              borderRadius: 10,
              marginTop: hp(9),
              color: colors.black,
            }}
          />

          <View
            style={{
              width: '100%',
              height: hp(55),
              borderWidth: 1,
              borderRadius: 10,
              borderColor: colors.lightGreyBorder,
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: hp(10),
              marginTop: hp(15),
            }}>
            {/* CheckBox */}
            <CheckBox
              isChecked={isChecked}
              onClick={() => setChecked(!isChecked)}
              checkBoxColor={colors.blue}
            />

            {/* Text next to CheckBox */}
            <Text
              style={{
                marginLeft: hp(10),
                color: colors.black,
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontWeight: '400',
                fontFamily: fontFamily.poppins500,
              }}>
              Same as current address
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddressDetailsScreen;
