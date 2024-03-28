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
import {hp} from '../../utils/helpers';
import style from './style';
import * as Progress from 'react-native-progress';
import DropDownMutipleValueComponent from '../../components/DropDownMutipleValueComponent';
import {
  ANNUAL_SALARY,
  COUNTRY_LIST,
  CREATIVE,
  CurrentCity,
  Fun,
} from '../../utils/data';
import CommonGradientButton from '../../components/commonGradientButton';
import {useNavigation} from '@react-navigation/native';

const PartnerPreferencesScreen = () => {
  const navigation = useNavigation();
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
              navigation.navigate('HomeTabs');
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
