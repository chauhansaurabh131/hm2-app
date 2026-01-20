import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import NewDropDownTextInput from '../../../components/newDropdownTextinput';
import {useDispatch, useSelector} from 'react-redux';
import {professionalDetail} from '../../../actions/homeActions';
import NewEnterSelectValueComponent from '../../../components/newEnterSelectValueComponent';
import NewSelectValueComponent from '../../../components/newSelectValueComponent';

const EditProfessionalScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);

  // console.log(' === var ===> ', user?.user?.userProfessional?.currentSalary);

  const apiDispatch = useDispatch();

  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [salary, setSalary] = useState('');
  const [workInCity, setWorkInCity] = useState('');
  const [workInCountry, setWorkInCountry] = useState('');
  const [loading, setLoading] = useState(false); // Loader state

  const jobTypeDropdownData = ['Government', 'Private', 'Retired', 'Homemaker'];
  const jobWorkCityDropdownData = ['Surat', 'Ahmadabad', 'Navsari', 'Bardoli'];
  const jobWorkContryDropdownData = ['India'];
  const anuallSalary = [
    '1 LPA.',
    '2 LPA.',
    '3 LPA.',
    '5 LPA.',
    '10 LPA.',
    '12 LPA.',
    '15 LPA.',
    '20 LPA.',
  ];

  // Dynamic height assignment based on dropdown type
  const getDropdownHeight = dropdownType => {
    switch (dropdownType) {
      case 'Job Type':
        return hp(230); // Set height for gender dropdown
      case 'Annual Salary':
        return hp(400); // Set height for marital status dropdown
      case 'Work City':
        return hp(230); // Set height for caste dropdown
      case 'Country':
        return hp(150); // Set height for caste dropdown
      default:
        return 300; // Default height
    }
  };

  useEffect(() => {
    if (user?.user?.userProfessional?.jobTitle) {
      setJobTitle(user?.user?.userProfessional?.jobTitle);
    }
    if (user?.user?.userProfessional?.jobType) {
      setJobType(user?.user?.userProfessional?.jobType);
    }
    if (user?.user?.userProfessional?.companyName) {
      setCompanyName(user?.user?.userProfessional?.companyName);
    }
    if (user?.user?.userProfessional?.currentSalary) {
      setSalary(user?.user?.userProfessional?.currentSalary);
    }
    if (user?.user?.userProfessional?.workCity) {
      setWorkInCity(user?.user?.userProfessional?.workCity);
    }
    if (user?.user?.userProfessional?.workCountry) {
      setWorkInCountry(user?.user?.userProfessional?.workCountry);
    }
  }, [
    user?.user?.userProfessional?.jobTitle,
    user?.user?.userProfessional?.jobType,
    user?.user?.userProfessional?.companyName,
    user?.user?.userProfessional?.currentSalary,
    user?.user?.userProfessional?.workCity,
    user?.user?.userProfessional?.workCountry,
  ]);

  const onSubmitPress = () => {
    const numericSalary = salary
      ? parseInt(String(salary).replace(/\D/g, ''), 10)
      : 0;

    // console.log(' === salary ===> ', numericSalary);

    // console.log(
    //   ' === onSubmitPress ===> ',
    //   jobTitle,
    //   jobType.toLowerCase(),
    //   companyName,
    //   numericSalary,
    //   workInCity,
    //   workInCountry.toLowerCase(),
    // );

    setLoading(true);
    apiDispatch(
      professionalDetail(
        {
          jobTitle: jobTitle,
          jobType: jobType.toLowerCase(),
          companyName: companyName,
          currentSalary: numericSalary,
          workCity: workInCity,
          workCountry: workInCountry.toLowerCase(),
        },
        () => {
          setLoading(false);
          navigation.goBack();
        },
      ),
    );
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const capitalizeFirstLetter = text => {
    if (!text) {
      return text;
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <Text
        style={{
          color: colors.black,
          fontSize: fontSize(16),
          lineHeight: hp(30),
          fontFamily: fontFamily.poppins600,
          textAlign: 'center',
          marginTop: hp(12),
          marginBottom: hp(12),
        }}>
        Occupation Details
      </Text>

      <View
        style={{width: '100%', height: hp(4), backgroundColor: '#F9F7FF'}}
      />

      <NewEnterSelectValueComponent
        title="Current Designation"
        value={capitalizeFirstLetter(jobTitle)}
        emptyText="Add"
        modalTitle="Current Designation"
        EnterModalPlaceholderTittle={'Enter Current Designation'}
        onValueChange={value => {
          // setSelectedDesignationStatus(value);
          setJobTitle?.(value);
        }}
      />

      <View style={{marginTop: hp(10)}}>
        <NewSelectValueComponent
          title="Job Type"
          value={jobType}
          dropdownData={jobTypeDropdownData}
          onValueChange={value => {
            // setSelectedJobStatus(value);
            setJobType?.(value);
          }}
          bottomSheetHeight={hp(250)}
        />
      </View>

      <View style={{marginTop: hp(10)}}>
        <NewEnterSelectValueComponent
          title="Company"
          value={companyName}
          emptyText="Add"
          modalTitle="Company"
          EnterModalPlaceholderTittle={'Enter Company Name'}
          onValueChange={value => {
            // setSelectedCompanyStatus(value);
            setCompanyName?.(value);
          }}
        />
      </View>

      <View style={{marginTop: hp(10)}}>
        <NewSelectValueComponent
          title="Annual Salary"
          value={salary}
          dropdownData={anuallSalary}
          onValueChange={value => {
            // setSelectedSalaryStatus(value);
            setSalary?.(value);
          }}
          bottomSheetHeight={hp(300)}
        />
      </View>

      <View style={{marginTop: hp(10)}}>
        <NewEnterSelectValueComponent
          title="Work City"
          value={workInCity}
          emptyText="Add"
          modalTitle="Work City"
          EnterModalPlaceholderTittle={'Enter Work City'}
          onValueChange={value => {
            // setSelectedCityStatus(value);
            setWorkInCity?.(value);
          }}
        />
      </View>

      <View style={{marginTop: hp(10)}}>
        <NewSelectValueComponent
          title="Work Country"
          value={workInCountry}
          dropdownData={jobWorkContryDropdownData}
          onValueChange={value => {
            // setSelectedCountryStatus(value);
            setWorkInCountry?.(value);
          }}
          bottomSheetHeight={hp(100)}
        />
      </View>

      <View style={{marginHorizontal: 17, flex: 1}}>
        {/*<AppColorLogo />*/}

        {/*<View style={{marginTop: 30}}>*/}
        {/*  <FloatingLabelInput*/}
        {/*    label="Current Designation"*/}
        {/*    value={capitalizeFirstLetter(jobTitle)}*/}
        {/*    onChangeText={setJobTitle}*/}
        {/*  />*/}
        {/*</View>*/}

        {/*<View style={{marginTop: hp(37)}}>*/}
        {/*  <NewDropDownTextInput*/}
        {/*    placeholder="Job Type"*/}
        {/*    dropdownData={jobTypeDropdownData}*/}
        {/*    onValueChange={setJobType}*/}
        {/*    value={capitalizeFirstLetter(jobType)}*/}
        {/*    bottomSheetHeight={getDropdownHeight('Job Type')} // Dynamic height*/}
        {/*  />*/}
        {/*</View>*/}

        {/*<View style={{marginTop: hp(37)}}>*/}
        {/*  <FloatingLabelInput*/}
        {/*    label="Company Name"*/}
        {/*    value={capitalizeFirstLetter(companyName)}*/}
        {/*    onChangeText={setCompanyName}*/}
        {/*  />*/}
        {/*</View>*/}

        {/*<View style={{marginTop: hp(37)}}>*/}
        {/*  <NewDropDownTextInput*/}
        {/*    placeholder="Annual Salary"*/}
        {/*    dropdownData={anuallSalary}*/}
        {/*    onValueChange={setSalary}*/}
        {/*    value={salary.toString()}*/}
        {/*    bottomSheetHeight={getDropdownHeight('Annual Salary')} // Dynamic height*/}
        {/*  />*/}
        {/*</View>*/}

        {/*<View style={{marginTop: hp(37)}}>*/}
        {/*  <NewDropDownTextInput*/}
        {/*    placeholder="Work City"*/}
        {/*    dropdownData={jobWorkCityDropdownData}*/}
        {/*    onValueChange={setWorkInCity}*/}
        {/*    value={capitalizeFirstLetter(workInCity)}*/}
        {/*    bottomSheetHeight={getDropdownHeight('Work City')} // Dynamic height*/}
        {/*  />*/}

        {/*  <FloatingLabelInput*/}
        {/*    label="Work City"*/}
        {/*    value={workInCity}*/}
        {/*    onChangeText={setWorkInCity}*/}
        {/*  />*/}
        {/*</View>*/}

        {/*<View style={{marginTop: hp(37)}}>*/}
        {/*  <NewDropDownTextInput*/}
        {/*    placeholder="Country"*/}
        {/*    dropdownData={jobWorkContryDropdownData}*/}
        {/*    onValueChange={setWorkInCountry}*/}
        {/*    value={capitalizeFirstLetter(workInCountry)}*/}
        {/*    bottomSheetHeight={getDropdownHeight('Country')} // Dynamic height*/}
        {/*  />*/}
        {/*</View>*/}

        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 15,
            width: '100%',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={onBackPress}
              activeOpacity={0.7}
              style={{
                width: wp(133),
                height: hp(44),
                borderRadius: 25,
                borderWidth: 1,
                borderColor: colors.black,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                  color: colors.black,
                }}>
                Back
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onSubmitPress}
              activeOpacity={0.6}
              disabled={
                !jobTitle ||
                !jobType ||
                !companyName ||
                !salary ||
                !workInCity ||
                !workInCountry
              } // Disable if any field is empty
              style={{
                width: wp(176),
                height: hp(44),
                borderRadius: 30,
                backgroundColor:
                  !jobTitle ||
                  !jobType ||
                  !companyName ||
                  !salary ||
                  !workInCity ||
                  !workInCountry
                    ? colors.gray // Disabled color
                    : colors.black, // Active color
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {loading ? (
                <ActivityIndicator size="large" color={colors.white} />
              ) : (
                <Text
                  style={{
                    color: colors.white,
                    fontSize: fontSize(16),
                    lineHeight: hp(24),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Submit
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditProfessionalScreen;
