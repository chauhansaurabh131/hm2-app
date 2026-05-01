import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {icons} from '../../../assets';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';
import {addressDetails, educationDetails} from '../../../actions/homeActions';

const ModifyEducationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const userData = route?.params?.UserData || {};

  console.log(' === userData--- ===> ', userData?.userEducation?.collage);

  const [selectedDegreeStatus, setSelectedDegreeStatus] = useState(
    userData?.userEducation?.degree || '',
  );
  const [selectedCollegeStatus, setSelectedCollegeStatus] = useState(
    userData?.userEducation?.collage || '',
  );

  const degreeDropdownData = [
    'Bachelors Arts',
    'Science',
    'Commerce',
    'B Phil',
    'Bachelors Engineering',
    'Computers',
    'BCA',
    'MCA',
    'BBA',
    'BSC',
    'MSC',
    'Diploma',
    'Higher Secondary',
    'Secondary',
    'Legal BL',
    'ML',
    'LLB',
    'LLM',
    'Management BBA',
    'MBA',
    'Masters Arts',
    'Masters Science',
    'Masters Commerce',
    'M Phil',
    'Masters Engineering',
    'Computers (Masters)',
    'Medicine General',
    'Dental',
    'Surgeon',
    'Ph.D',
    'IAS',
    'IPS',
  ];

  const onSavePress = async () => {
    if (loading) {
      return;
    }

    try {
      setLoading(true);

      await apiDispatch(
        educationDetails({
          degree: selectedDegreeStatus,
          collage: selectedCollegeStatus,
        }),
      );

      setLoading(false);
      navigation.goBack();
    } catch (error) {
      console.log('API Error:', error);
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* 🔥 HEADER */}
      <View
        style={{
          height: hp(54),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: 0,
            width: wp(50),
            height: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{
              width: hp(14),
              height: hp(14),
              resizeMode: 'contain',
            }}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins600,
          }}>
          Modify Education
        </Text>
      </View>

      {/* 🔥 DIVIDER */}
      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#EDEDED',
        }}
      />

      <View style={{marginTop: hp(20), paddingHorizontal: wp(17)}}>
        <NewSelectValueComponent
          title="Select Degree"
          value={selectedDegreeStatus}
          dropdownData={degreeDropdownData}
          onValueChange={value => {
            setSelectedDegreeStatus(value);
          }}
          bottomSheetHeight={hp(450)}
        />

        <View style={{marginTop: hp(20)}}>
          <NewEnterSelectValueComponent
            title="College / Uni."
            value={selectedCollegeStatus}
            emptyText="Add"
            modalTitle="College / Uni."
            EnterModalPlaceholderTittle={'Enter College / Uni.'}
            onValueChange={value => {
              setSelectedCollegeStatus(value);
            }}
          />
        </View>
      </View>

      {/* 🔥 SAVE BUTTON */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          alignItems: 'center',
          height: hp(100),
          // backgroundColor: 'white',
        }}>
        <TouchableOpacity
          onPress={onSavePress}
          activeOpacity={0.6}
          style={{
            width: '93%',
            height: hp(50),
            borderRadius: hp(25),
            backgroundColor: colors.pureBlack,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            marginTop: hp(30),
          }}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text
              style={{
                color: 'white',
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
              }}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ModifyEducationScreen;
