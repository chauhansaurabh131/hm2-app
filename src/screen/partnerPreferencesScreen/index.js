import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {images} from '../../assets';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import style from './style';
import * as Progress from 'react-native-progress';
import DropDownMutipleValueComponent from '../../components/DropDownMutipleValueComponent';
import {
  ANNUAL_SALARY,
  Area_Code,
  COUNTRY_LIST,
  CREATIVE,
  CurrentCity,
  Fun,
} from '../../utils/data';
import CommonGradientButton from '../../components/commonGradientButton';
import {useNavigation, useRoute} from '@react-navigation/native';
import DropDownTextInputComponent from '../../components/DropDownTextInputComponent';
import DemoPractiveCodeScreen from '../demoPractiveCodeScreen';
import DropdownHeightAndAgeComponent from '../../components/DropdownHeightAndAgeComponent';

const PartnerPreferencesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const {selectedBox} = route.params ?? {};

  console.log(' === selectedBox_PartnerPreferencesScreen ===> ', selectedBox);

  const AGE_LIST = [
    {label: '22', value: '1'},
    {label: '23', value: '2'},
    {label: '24', value: '3'},
    {label: '25', value: '4'},
    {label: '26', value: '5'},
    {label: '27', value: '6'},
    {label: '28', value: '7'},
    {label: '29', value: '8'},
  ];

  const HEIGHT_LIST = [
    {label: '3.5ft', value: '1'},
    {label: '4.5ft', value: '2'},
    {label: '5.5ft', value: '3'},
    {label: '6ft', value: '4'},
    {label: '6.1ft', value: '5'},
    {label: '6.3ft', value: '6'},
    {label: '6.5ft', value: '7'},
    {label: '7ft', value: '8'},
  ];
  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        <Image
          source={images.happyMilanColorLogo}
          style={style.headerImageStyle}
        />

        <View style={style.headerTittleContainer}>
          <Text style={style.partnerPreferencesTextStyle}>
            Partner Preferences
          </Text>
          <TouchableOpacity activeOpacity={0.5}>
            <Text style={style.doItLaterTextStyle}>I’ll do it later</Text>
          </TouchableOpacity>
        </View>

        <Progress.Bar
          progress={0.85}
          width={Dimensions.get('window').width * 0.9}
          color={'#17C270'}
          borderWidth={0.5}
          borderColor={colors.gray}
          height={0.7}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginTop: hp(19)}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(12),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                    marginBottom: hp(7),
                  }}>
                  Choose Age
                </Text>
                <View
                  style={{
                    flexDirection: 'row',

                    alignSelf: 'center',
                  }}>
                  <View style={{marginRight: 10}}>
                    <DropdownHeightAndAgeComponent
                      data={AGE_LIST}
                      placeholder={25}
                    />
                    {/*<DropdownHeightAndAgeComponent />*/}
                  </View>
                  <Text
                    style={{
                      marginRight: 10,
                      color: colors.black,
                      fontSize: fontSize(12),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                      alignSelf: 'center',
                    }}>
                    to
                  </Text>
                  <View>
                    <DropdownHeightAndAgeComponent
                      data={AGE_LIST}
                      placeholder={25}
                    />
                  </View>
                </View>
              </View>

              {/*<View style={{marginLeft: -150}} />*/}
              <View>
                <Text
                  style={{
                    color: colors.black,
                    fontSize: fontSize(12),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                    marginBottom: hp(7),
                  }}>
                  Choose Age
                </Text>
                <View style={{flexDirection: 'row'}}>
                  <View style={{marginRight: 10}}>
                    <DropdownHeightAndAgeComponent
                      data={HEIGHT_LIST}
                      placeholder={'3.5ft'}
                      dropdownContainer={{width: 70}}
                    />
                  </View>
                  <Text
                    style={{
                      marginRight: 10,
                      color: colors.black,
                      fontSize: fontSize(12),
                      lineHeight: hp(21),
                      fontFamily: fontFamily.poppins400,
                      alignSelf: 'center',
                    }}>
                    to
                  </Text>
                  <View>
                    <DropdownHeightAndAgeComponent
                      data={HEIGHT_LIST}
                      placeholder={'3.5ft'}
                      dropdownContainer={{width: 70}}
                    />
                  </View>
                </View>
              </View>
            </View>
            <Text style={style.bodyTittleTextStyle}>Choose Country</Text>
            <DropDownMutipleValueComponent
              data={COUNTRY_LIST}
              height={50}
              searchPlaceholder={'Search Country'}
              placeholder={'Choose Country'}
            />
            <Text style={style.bodyTittleTextStyle}>Choose State</Text>
            <DropDownMutipleValueComponent
              data={CurrentCity}
              height={50}
              searchPlaceholder={'Search State'}
              placeholder={'Choose State'}
            />
            <Text style={style.bodyTittleTextStyle}>Choose City</Text>
            <DropDownMutipleValueComponent
              data={CurrentCity}
              height={50}
              searchPlaceholder={'Search City'}
              placeholder={'Choose City'}
            />
            <Text style={style.bodyTittleTextStyle}>Income</Text>
            <DropDownMutipleValueComponent
              data={ANNUAL_SALARY}
              height={50}
              searchPlaceholder={'Search Income'}
              placeholder={'Choose Income'}
            />
            <Text style={style.bodyTittleTextStyle}>Creative</Text>
            <DropDownMutipleValueComponent
              data={CREATIVE}
              height={50}
              searchPlaceholder={'Search Creative'}
              placeholder={'Choose Creative'}
            />
            <Text style={style.bodyTittleTextStyle}>Fun</Text>
            <DropDownMutipleValueComponent
              data={Fun}
              height={50}
              searchPlaceholder={'Search Fun'}
              placeholder={'Choose Fun'}
            />
          </View>
          <View style={{height: 20}} />
        </ScrollView>

        <View style={style.bottomButtonContainer}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              navigation.goBack();
            }}
            style={style.backButtonContainer}>
            <Text style={style.backButtonText}>Back</Text>
          </TouchableOpacity>

          <CommonGradientButton
            onPress={() => {
              navigation.navigate('HomeTabs', {selectedBox});
            }}
            buttonName={'Continue'}
            containerStyle={style.continueButtonContainer}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PartnerPreferencesScreen;
