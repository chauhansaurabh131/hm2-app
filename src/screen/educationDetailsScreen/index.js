import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import TextInputWithDropDownComponent from '../../components/textInputWithDropDownComponent';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TextInputSearchAndDropDowm from '../../components/textInputSearchAndDropDown';

const EducationDetailsScreen = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <KeyboardAwareScrollView>
        <View style={{marginHorizontal: 17}}>
          <Text
            style={{
              // marginLeft: wp(12),
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              fontWeight: '400',
              marginTop: hp(10),
            }}>
            Degree
          </Text>
          {/*<TextInputWithDropDownComponent*/}
          {/*  dropdownItems={['B.com', 'BCA', 'BBA']}*/}
          {/*/>*/}

          <TextInputSearchAndDropDowm
            placeholder={'Select'}
            dropdownItems={['B.com', 'BCA', 'BBA']}
          />

          <Text
            style={{
              // marginLeft: wp(12),
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              fontWeight: '400',
              marginTop: hp(10),
            }}>
            Collage/University
          </Text>

          {/*<TextInputWithDropDownComponent*/}
          {/*  dropdownItems={['ABC', 'XYZ', 'AAA']}*/}
          {/*/>*/}
          <TextInputSearchAndDropDowm
            placeholder={'Select'}
            dropdownItems={['ABC', 'XYZ', 'AAA']}
          />

          <Text
            style={{
              // marginLeft: wp(12),
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              fontWeight: '400',
              marginTop: hp(10),
            }}>
            City
          </Text>

          {/*<TextInputWithDropDownComponent*/}
          {/*  dropdownItems={['GUJARAT', 'MUMBAI', 'DELHI']}*/}
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
              // marginLeft: wp(12),
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              fontWeight: '400',
              marginTop: hp(10),
            }}>
            State
          </Text>

          {/*<TextInputWithDropDownComponent*/}
          {/*  dropdownItems={['GUJARAT', 'MUMBAI', 'DELHI']}*/}
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
              // marginLeft: wp(12),
              color: colors.black,
              fontSize: fontSize(14),
              lineHeight: hp(18),
              fontFamily: fontFamily.poppins500,
              fontWeight: '400',
              marginTop: hp(10),
            }}>
            Country
          </Text>

          {/*<TextInputWithDropDownComponent*/}
          {/*  dropdownItems={['GUJARAT', 'MUMBAI', 'DELHI']}*/}
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
        </View>
        <View style={{height: 150}} />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EducationDetailsScreen;
