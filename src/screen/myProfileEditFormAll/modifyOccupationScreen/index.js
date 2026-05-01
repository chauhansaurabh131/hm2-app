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
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';
import {addressDetails, professionalDetail} from '../../../actions/homeActions';

const ModifyOccupationScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const [loading, setLoading] = useState(false);

  const userData = route?.params?.UserData || {};

  // console.log(
  //   ' === userData--- ===> ',
  //   userData?.userProfessional?.currentSalary,
  // );

  const [selectedDesignationStatus, setSelectedDesignationStatus] = useState(
    userData?.userProfessional?.jobTitle || '',
  );

  const [selectedJobStatus, setSelectedJobStatus] = useState(
    userData?.userProfessional?.jobType || '',
  );

  const [selectedCompanyStatus, setSelectedCompanyStatus] = useState(
    userData?.userProfessional?.companyName || '',
  );

  const [selectedSalaryStatus, setSelectedSalaryStatus] = useState(
    userData?.userProfessional?.currentSalary || '',
  );

  const jobTypeDropdownData = ['Government', 'Private', 'Retired', 'Homemaker'];

  const anuallSalary = ['1 LPA', '2 LPA', '3 LPA', '5 LPA', '10 LPA'];

  const capitalize = text => {
    if (!text) {
      return '';
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const onSavePress = async () => {
    if (loading) {
      return;
    }

    const numericSalary = parseInt(selectedSalaryStatus.replace(/\D/g, ''), 10); // This removes all non-digit characters

    try {
      setLoading(true);

      await apiDispatch(
        professionalDetail({
          jobTitle: selectedDesignationStatus,
          jobType: selectedJobStatus.toLowerCase(),
          companyName: selectedCompanyStatus,
          currentSalary: numericSalary,
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
          Modify Occupation
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

      <NewEnterSelectValueComponent
        title="Current Designation"
        value={capitalize(selectedDesignationStatus)}
        emptyText="Add"
        modalTitle="Current Designation"
        EnterModalPlaceholderTittle={'Enter Current Designation'}
        onValueChange={value => {
          setSelectedDesignationStatus(value);
        }}
      />

      <View style={{marginTop: hp(15)}}>
        <NewSelectValueComponent
          title="Job Type"
          value={capitalize(selectedJobStatus)}
          dropdownData={jobTypeDropdownData}
          onValueChange={value => {
            setSelectedJobStatus(value);
          }}
          bottomSheetHeight={hp(250)}
        />
      </View>

      <View style={{marginTop: hp(15)}}>
        <NewEnterSelectValueComponent
          title="Company"
          value={capitalize(selectedCompanyStatus)}
          emptyText="Add"
          modalTitle="Company"
          EnterModalPlaceholderTittle={'Enter Company Name'}
          onValueChange={value => {
            setSelectedCompanyStatus(value);
          }}
        />
      </View>

      <View style={{marginTop: hp(15)}}>
        <NewSelectValueComponent
          title="Annual Salary"
          value={selectedSalaryStatus}
          dropdownData={anuallSalary}
          onValueChange={value => {
            setSelectedSalaryStatus(value);
          }}
          bottomSheetHeight={hp(300)}
        />
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

export default ModifyOccupationScreen;
