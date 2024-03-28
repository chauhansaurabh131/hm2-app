import React from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, View} from 'react-native';
import {colors} from '../../utils/colors';
import style from './style';
import DropDownTextInputComponent from '../../components/DropDownTextInputComponent';
import {ANNUAL_SALARY, COUNTRY_LIST, RELIGION_LIST} from '../../utils/data';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import TextInputSearchAndDropDowm from '../../components/textInputSearchAndDropDown';

const ProfessionalsDetailsScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginHorizontal: wp(17)}}>
          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              color: colors.black,
              marginTop: hp(19),
            }}>
            Current Designation (Job Title)
          </Text>

          <TextInput
            placeholder={'Type'}
            style={{
              width: '100%',
              height: hp(50),
              borderColor: colors.lightGreyBorder,
              borderRadius: 10,
              borderWidth: 1,
              marginTop: hp(7),
              padding: 10,
            }}
            placeholderTextColor={colors.black}
          />

          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              color: colors.black,
              marginTop: hp(15),
              marginBottom: hp(12),
            }}>
            Job Type
          </Text>

          {/*<DropDownTextInputComponent*/}
          {/*  placeholder={'Select or Type'}*/}
          {/*  data={RELIGION_LIST}*/}
          {/*  height={50}*/}
          {/*  searchPlaceholder={'Search Or Type'}*/}
          {/*/>*/}

          <TextInputSearchAndDropDowm
            placeholder={'Select'}
            dropdownItems={['AA', 'VV', 'BB', 'DD', 'SS', 'GG', 'SDS', 'NG']}
          />

          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              color: colors.black,
              marginTop: hp(19),
            }}>
            Company Name
          </Text>

          <TextInput
            placeholder={'Enter Name Here'}
            placeholderTextColor={colors.black}
            style={{
              width: '100%',
              height: hp(50),
              borderColor: colors.lightGreyBorder,
              borderRadius: 10,
              borderWidth: 1,
              marginTop: hp(7),
              padding: 10,
            }}
          />

          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              color: colors.black,
              marginTop: hp(15),
              marginBottom: hp(12),
            }}>
            Annual Salary
          </Text>

          {/*<DropDownTextInputComponent*/}
          {/*  placeholder={'10,000 To 15,000'}*/}
          {/*  data={ANNUAL_SALARY}*/}
          {/*  height={50}*/}
          {/*/>*/}

          <TextInputSearchAndDropDowm
            placeholder={'10,000 To 15,000'}
            dropdownItems={[
              '10,000 to 15000',
              '15000 to 30,000',
              '30,000 to 45,000',
              '45,000 to 60,000',
              '60,000 to 80,000',
            ]}
          />

          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              color: colors.black,
              marginTop: hp(15),
              marginBottom: hp(12),
            }}>
            Work In City
          </Text>

          {/*<DropDownTextInputComponent*/}
          {/*  placeholder={'Select or Type'}*/}
          {/*  data={COUNTRY_LIST}*/}
          {/*  height={50}*/}
          {/*/>*/}

          <TextInputSearchAndDropDowm
            placeholder={'Select or Type'}
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
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              color: colors.black,
              marginTop: hp(15),
              marginBottom: hp(12),
            }}>
            Work In Country
          </Text>

          {/*<DropDownTextInputComponent*/}
          {/*  placeholder={'Select or Type'}*/}
          {/*  data={COUNTRY_LIST}*/}
          {/*  height={50}*/}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfessionalsDetailsScreen;
