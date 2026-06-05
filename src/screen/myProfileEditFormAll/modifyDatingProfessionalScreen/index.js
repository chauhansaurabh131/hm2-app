import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {icons} from '../../../assets';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';
import {updateDetails} from '../../../actions/homeActions';

const ModifyDatingProfessionalScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const userData = route?.params?.UserData || {};

  console.log(' === userData ===> ', userData);

  const [loading, setLoading] = useState(false);

  const [selectedDegreeStatus, setSelectedDegreeStatus] = useState(
    userData?.datingData[0]?.educationLevel || '',
  );

  const [selectedOccupationStatus, setSelectedOccupationStatus] = useState(
    userData?.datingData[0]?.Occupation || '',
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

  const OccupationData = ['Government', 'Private', 'Retired', 'Homemaker'];

  const capitalize = text => {
    if (!text) {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const onSavePress = () => {
    if (loading) {
      return;
    }

    setLoading(true);

    const updatedDatingData = {
      ...userData?.datingData?.[0],
      educationLevel: selectedDegreeStatus,
      Occupation: selectedOccupationStatus.toLowerCase(),
    };

    apiDispatch(
      updateDetails(
        {
          datingData: [updatedDatingData],
        },
        response => {
          console.log('Success ===>', response);

          setLoading(false);
          navigation.goBack();
        },
        error => {
          console.log('Error ===>', error);

          setLoading(false);
        },
      ),
    );
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* Header */}
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
          Modify Professional Info
        </Text>
      </View>

      {/* Divider */}
      <View
        style={{
          width: '100%',
          height: hp(1),
          backgroundColor: '#EDEDED',
        }}
      />

      <View style={{marginTop: hp(20), marginHorizontal: wp(17)}}>
        <NewSelectValueComponent
          title="Education Level"
          value={capitalize(selectedDegreeStatus)}
          dropdownData={degreeDropdownData}
          onValueChange={value => {
            setSelectedDegreeStatus(value);
          }}
          bottomSheetHeight={hp(450)}
        />

        <View style={{marginTop: hp(10)}}>
          <NewSelectValueComponent
            title="Occupation"
            value={capitalize(selectedOccupationStatus)}
            dropdownData={OccupationData}
            onValueChange={value => {
              setSelectedOccupationStatus(value);
            }}
            bottomSheetHeight={hp(270)}
          />
        </View>
      </View>

      {/* Save Button */}
      <View
        style={{
          position: 'absolute',
          width: '100%',
          bottom: hp(30),
        }}>
        <TouchableOpacity
          onPress={onSavePress}
          activeOpacity={0.6}
          disabled={loading}
          style={{
            height: hp(44),
            backgroundColor: colors.pureBlack,
            borderRadius: hp(30),
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: wp(17),
          }}>
          {loading ? (
            <ActivityIndicator color="#FFF" size="large" />
          ) : (
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(14),
                fontFamily: fontFamily.poppins400,
              }}>
              Save Changes
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ModifyDatingProfessionalScreen;
