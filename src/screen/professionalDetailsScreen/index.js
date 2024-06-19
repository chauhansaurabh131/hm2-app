import React from 'react';
import {SafeAreaView, ScrollView, Text, TextInput, View} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import TextInputSearchAndDropDowm from '../../components/textInputSearchAndDropDown';

const ProfessionalsDetailsScreen = ({
  jobTitle,
  setJobTitle,
  jobType,
  setJobType,
  companyName,
  setCompanyName,
  salary,
  setSalary,
  workInCity,
  setWorkInCity,
  workInCountry,
  setWorkInCountry,
}) => {
  const handleSalaryChange = value => {
    const numericValue = value.replace(/[^0-9]/g, '');
    setSalary(numericValue);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{marginHorizontal: wp(17)}}>
          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins600,
              color: colors.black,
              marginTop: hp(20),
            }}>
            Current Designation (Job Title)
          </Text>

          <TextInput
            placeholder={'Type'}
            value={jobTitle}
            onChangeText={setJobTitle}
            style={{
              width: '100%',
              height: hp(50),
              borderColor: colors.lightGreyBorder,
              borderRadius: 10,
              borderWidth: 1,
              marginTop: hp(7),
              padding: 10,
              color: colors.black,
            }}
            placeholderTextColor={colors.black}
          />

          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins600,
              color: colors.black,
              marginTop: hp(15),
              marginBottom: hp(7),
            }}>
            Job Type
          </Text>

          <TextInputSearchAndDropDowm
            value={jobType}
            onChangeText={setJobType}
            placeholder={'Select'}
            dropdownItems={['AA', 'VV', 'BB', 'DD', 'SS', 'GG', 'SDS', 'NG']}
          />

          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins600,
              color: colors.black,
              marginTop: hp(15),
            }}>
            Company Name
          </Text>

          <TextInput
            placeholder={'Enter Name Here'}
            value={companyName}
            onChangeText={setCompanyName}
            placeholderTextColor={colors.black}
            style={{
              width: '100%',
              height: hp(50),
              borderColor: colors.lightGreyBorder,
              borderRadius: 10,
              borderWidth: 1,
              marginTop: hp(7),
              padding: 10,
              color: colors.black,
            }}
          />

          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins600,
              color: colors.black,
              marginTop: hp(15),
              marginBottom: hp(7),
            }}>
            Annual Salary
          </Text>

          <TextInputSearchAndDropDowm
            placeholder={'10,000 To 15,000'}
            value={salary}
            onChangeText={handleSalaryChange}
            dropdownItems={[
              '10000',
              '15000',
              '30000',
              '45000',
              '60000',
              '80000',
            ]}
          />

          <Text
            style={{
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins600,
              color: colors.black,
              marginTop: hp(15),
              marginBottom: hp(7),
            }}>
            Work In City
          </Text>

          <TextInputSearchAndDropDowm
            placeholder={'Select or Type'}
            value={workInCity}
            onChangeText={setWorkInCity}
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
              fontFamily: fontFamily.poppins600,
              color: colors.black,
              marginTop: hp(15),
              marginBottom: hp(7),
            }}>
            Work In Country
          </Text>

          <TextInputSearchAndDropDowm
            value={workInCountry}
            onChangeText={setWorkInCountry}
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
          <View style={{height: 20}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfessionalsDetailsScreen;
