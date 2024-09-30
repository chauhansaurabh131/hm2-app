import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import TextInputWithDropDownComponent from '../../components/textInputWithDropDownComponent';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import TextInputSearchAndDropDowm from '../../components/textInputSearchAndDropDown';
import NewDropDownTextInput from '../../components/newDropdownTextinput';
import FloatingLabelInput from '../../components/FloatingLabelInput';

const EducationDetailsScreen = ({
  degree,
  setDegree,
  collage,
  setCollage,
  collageCity,
  setCollageCity,
  collageState,
  setCollageState,
  collageCountry,
  setCollageCountry,
}) => {
  const degreeDropdownData = [
    'BCA',
    'MCA',
    'B.Com',
    'M.Com',
    'B.Tech',
    'M.Tech',
    'BBA',
    'MBA',
  ];

  const educationCityDropdownData = [
    'Gandhinagar',
    'Mehsana',
    'Himmatnagar',
    'Kalol',
  ];

  const educationStateDropdownData = ['Gujarat', 'Delhi', 'Kolkata', 'Mumbai'];

  const educationCountryDropdownData = ['India', 'Sri-Lanka', 'US', 'UK'];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/*<KeyboardAwareScrollView>*/}
      {/*  <View style={{marginHorizontal: 17}}>*/}
      {/*    <Text*/}
      {/*      style={{*/}
      {/*        // marginLeft: wp(12),*/}
      {/*        color: colors.black,*/}
      {/*        fontSize: fontSize(14),*/}
      {/*        lineHeight: hp(18),*/}
      {/*        fontFamily: fontFamily.poppins600,*/}
      {/*        fontWeight: '400',*/}
      {/*        marginTop: hp(20),*/}
      {/*        marginBottom: hp(7),*/}
      {/*      }}>*/}
      {/*      Degree*/}
      {/*    </Text>*/}

      {/*    <TextInputSearchAndDropDowm*/}
      {/*      value={degree}*/}
      {/*      onChangeText={setDegree}*/}
      {/*      placeholder={'Select'}*/}
      {/*      dropdownItems={['B.com', 'BCA', 'BBA']}*/}
      {/*    />*/}

      {/*    <Text*/}
      {/*      style={{*/}
      {/*        color: colors.black,*/}
      {/*        fontSize: fontSize(14),*/}
      {/*        lineHeight: hp(18),*/}
      {/*        fontFamily: fontFamily.poppins600,*/}
      {/*        fontWeight: '400',*/}
      {/*        marginTop: hp(15),*/}
      {/*        marginBottom: hp(7),*/}
      {/*      }}>*/}
      {/*      Collage/University*/}
      {/*    </Text>*/}

      {/*    <TextInputSearchAndDropDowm*/}
      {/*      value={collage}*/}
      {/*      onChangeText={setCollage}*/}
      {/*      placeholder={'Select'}*/}
      {/*      dropdownItems={['ABC', 'XYZ', 'AAA']}*/}
      {/*    />*/}

      {/*    <Text*/}
      {/*      style={{*/}
      {/*        color: colors.black,*/}
      {/*        fontSize: fontSize(14),*/}
      {/*        lineHeight: hp(18),*/}
      {/*        fontFamily: fontFamily.poppins600,*/}
      {/*        fontWeight: '400',*/}
      {/*        marginTop: hp(15),*/}
      {/*        marginBottom: hp(7),*/}
      {/*      }}>*/}
      {/*      City*/}
      {/*    </Text>*/}

      {/*    <TextInputSearchAndDropDowm*/}
      {/*      value={collageCity}*/}
      {/*      onChangeText={setCollageCity}*/}
      {/*      placeholder={'Select'}*/}
      {/*      dropdownItems={[*/}
      {/*        'GUJARAT',*/}
      {/*        'MUMBAI',*/}
      {/*        'DELHI',*/}
      {/*        'SURAT',*/}
      {/*        'VADODARA',*/}
      {/*        'AHAMADABAD',*/}
      {/*        'ANAND',*/}
      {/*        'NAVSARI',*/}
      {/*      ]}*/}
      {/*    />*/}
      {/*    <Text*/}
      {/*      style={{*/}
      {/*        color: colors.black,*/}
      {/*        fontSize: fontSize(14),*/}
      {/*        lineHeight: hp(18),*/}
      {/*        fontFamily: fontFamily.poppins600,*/}
      {/*        fontWeight: '400',*/}
      {/*        marginTop: hp(15),*/}
      {/*        marginBottom: hp(7),*/}
      {/*      }}>*/}
      {/*      State*/}
      {/*    </Text>*/}

      {/*    <TextInputSearchAndDropDowm*/}
      {/*      value={collageState}*/}
      {/*      onChangeText={setCollageState}*/}
      {/*      placeholder={'Select'}*/}
      {/*      dropdownItems={[*/}
      {/*        'GUJARAT',*/}
      {/*        'MUMBAI',*/}
      {/*        'DELHI',*/}
      {/*        'SURAT',*/}
      {/*        'VADODARA',*/}
      {/*        'AHAMADABAD',*/}
      {/*        'ANAND',*/}
      {/*        'NAVSARI',*/}
      {/*      ]}*/}
      {/*    />*/}

      {/*    <Text*/}
      {/*      style={{*/}
      {/*        // marginLeft: wp(12),*/}
      {/*        color: colors.black,*/}
      {/*        fontSize: fontSize(14),*/}
      {/*        lineHeight: hp(18),*/}
      {/*        fontFamily: fontFamily.poppins600,*/}
      {/*        fontWeight: '400',*/}
      {/*        marginTop: hp(15),*/}
      {/*        marginBottom: hp(7),*/}
      {/*      }}>*/}
      {/*      Country*/}
      {/*    </Text>*/}

      {/*    /!*<TextInputWithDropDownComponent*!/*/}
      {/*    /!*  dropdownItems={['GUJARAT', 'MUMBAI', 'DELHI']}*!/*/}
      {/*/>*/}

      {/*    <TextInputSearchAndDropDowm*/}
      {/*      value={collageCountry}*/}
      {/*      onChangeText={setCollageCountry}*/}
      {/*      placeholder={'Select'}*/}
      {/*      dropdownItems={[*/}
      {/*        'GUJARAT',*/}
      {/*        'MUMBAI',*/}
      {/*        'DELHI',*/}
      {/*        'SURAT',*/}
      {/*        'VADODARA',*/}
      {/*        'AHAMADABAD',*/}
      {/*        'ANAND',*/}
      {/*        'NAVSARI',*/}
      {/*      ]}*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*  <View style={{height: 150}} />*/}
      {/*</KeyboardAwareScrollView>*/}

      <View style={{marginHorizontal: wp(17)}}>
        <View style={{marginTop: 30}}>
          <NewDropDownTextInput
            placeholder="Degree"
            dropdownData={degreeDropdownData}
            onValueChange={setDegree}
          />
        </View>

        <View style={{marginTop: hp(37)}}>
          <FloatingLabelInput
            label="College/University"
            value={collage}
            onChangeText={setCollage}
          />
        </View>

        <View style={{marginTop: 37}}>
          <NewDropDownTextInput
            placeholder="City"
            dropdownData={educationCityDropdownData}
            onValueChange={setCollageCity}
          />
        </View>

        <View style={{marginTop: 37}}>
          <NewDropDownTextInput
            placeholder="State"
            dropdownData={educationStateDropdownData}
            onValueChange={setCollageState}
          />
        </View>

        <View style={{marginTop: 37}}>
          <NewDropDownTextInput
            placeholder="Country"
            dropdownData={educationCountryDropdownData}
            onValueChange={setCollageCountry}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EducationDetailsScreen;
