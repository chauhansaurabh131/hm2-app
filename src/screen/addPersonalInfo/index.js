import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';

import React, {useEffect, useReducer, useState} from 'react';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {images} from '../../assets';
import {useRoute} from '@react-navigation/native';
import GeneralInformationDetailsScreen from '../generalInformationDetailsScreen';
import AddressDetailsScreen from '../addressDetailsScreen';
import ContactDetailsScreen from '../contactDetailsScreen';
import EducationDetailsScreen from '../educationDetailsScreen';
import ProfessionalsDetailsScreen from '../professionalDetailsScreen';
import HobbiesAndInterestScreen from '../hobbiesAndInterestScreen';
import {
  addressDetails,
  educationDetails,
  professionalDetail,
  updateDetails,
} from '../../actions/homeActions';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import ImagePicker from 'react-native-image-crop-picker';
import Abc from '../abc';

// Import other screens as needed

const NEXT_SCREEN = 'NEXT_SCREEN';
const NUMBER_SCREEN = 'NUMBER_SCREEN';
const BACK_SCREEN = 'BACK_SCREEN';

const phaseReducer = (state, action) => {
  switch (action.type) {
    case NEXT_SCREEN:
      return {
        activeIndex: state.activeIndex + 1,
      };
    case NUMBER_SCREEN:
      return {
        activeIndex: action.screenNumber,
      };
    case BACK_SCREEN:
      return {
        activeIndex: state.activeIndex - 1,
      };
    default:
      return state;
  }
};

const renderIcons = ({item, index, activeIndex, onPressIcon}) => {
  // const color = () => {
  //   if (index === activeIndex) {
  //     return ['#0D4EB3', '#9413D0'];
  //   } else {
  //     if (index < activeIndex) {
  //       return ['#17C270', '#17C270'];
  //     } else {
  //       return ['#FFFFFF', '#FFFFFF'];
  //     }
  //   }
  // };

  const tintColor = () => (index <= activeIndex ? '#000000' : '#B0B0B0');

  return (
    <TouchableOpacity
      disabled={index > activeIndex + 1}
      activeOpacity={1}
      onPress={() => onPressIcon(index)}>
      {/*<LinearGradient*/}
      {/*  start={{x: 0, y: 0}}*/}
      {/*  end={{x: 1, y: 0}}*/}
      {/*  // colors={color()}*/}
      {/*  style={{*/}
      {/*    height: hp(48),*/}
      {/*    width: hp(48),*/}
      {/*    alignItems: 'center',*/}
      {/*    justifyContent: 'center',*/}
      {/*    borderRadius: 50,*/}
      {/*  }}>*/}
      <Image
        source={item.icon}
        style={{
          height: hp(18),
          width: hp(18),
          tintColor: tintColor(),
          // backgroundColor: 'red',
        }}
        resizeMode={'contain'}
      />
      {/*</LinearGradient>*/}
    </TouchableOpacity>
  );
};

const AddPersonalInfo = ({navigation}) => {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const phaseReducerInitialState = {
    activeIndex: 0,
  };

  const [selectedImages, setSelectedImages] = useState([]);

  const {isUpdatingProfile} = useSelector(state => state.auth);
  const apiDispatch = useDispatch();
  const route = useRoute();

  const {sharedMedia, selectedBox} = route.params ?? {};

  const [{activeIndex}, dispatch] = useReducer(
    phaseReducer,
    phaseReducerInitialState,
  );

  const [selectedCreative, setSelectedCreative] = useState([]);
  const [selectedFun, setSelectedFun] = useState([]);
  const [selectedFitness, setSelectedFitness] = useState([]);

  // GENERAL INFORMATION SCREEN

  const [genderSelectedOption, genderSetSelectedOption] = useState('');
  const [maritalSelectedOption, maritalSetSelectedOption] = useState('');
  const [selectCaste, setSelectCaste] = useState('');
  const [selectReligion, setSelectReligion] = useState('');
  const [userHeight, setUserHeight] = useState('');
  const [userWeight, setUserWeight] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectHours, setSelectHours] = useState('');
  const [selectMinutes, setSelectMinutes] = useState('');
  const [selectSecond, setSelectSecond] = useState('');

  const [addDescription, setAddDescription] = useState('');

  //ADDRESS DETAILS SCREEN
  const [currentAddress, setCurrentAddress] = useState('');
  const [currentCountry, setCurrentCountry] = useState('');
  const [currentState, setCurrentState] = useState('');
  const [selectCurrentCity, setSelectCurrentCity] = useState('');

  const [selectCurrentLiving, setSelectCurrentLiving] = useState('');
  const [currentResidingAddress, setCurrentResidingAddress] = useState('');

  //CONTACT DETAILS SCREEN

  const [mobileNumber, setMobileNumber] = useState('');
  const [homeNumber, setHomeNumber] = useState('');

  //EDUCATIONS DETAILS
  const [degree, setDegree] = useState('');
  const [collage, setCollage] = useState('');
  const [collageCity, setCollageCity] = useState('');
  const [collageState, setCollageState] = useState('');
  const [collageCountry, setCollageCountry] = useState('');

  //PROFESSIONAL DETAILS
  const [jobTitle, setJobTitle] = useState('');
  const [jobType, setJobType] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [salary, setSalary] = useState('');
  const [workInCity, setWorkInCity] = useState('');
  const [workInCountry, setWorkInCountry] = useState('');

  //Select Hobbies
  const [selectedItems, setSelectedItems] = useState([]);

  const PersonalInfoPhases = [
    {
      phaseName: 'General Information',
      Component: GeneralInformationDetailsScreen,
      icon: require('../../assets/icons/profile_logo.png'),
    },
    {
      phaseName: 'Location Details',
      Component: AddressDetailsScreen,
      icon: require('../../assets/icons/address_location_logo.png'),
    },
    {
      phaseName: 'Contact Details',
      Component: ContactDetailsScreen,
      icon: require('../../assets/icons/phone_logo.png'),
    },
    {
      phaseName: 'Education Details',
      Component: EducationDetailsScreen,
      icon: require('../../assets/icons/education_logo.png'),
    },

    {
      phaseName: 'Job Details',
      Component: ProfessionalsDetailsScreen,
      icon: require('../../assets/icons/professional_logo.png'),
    },
    {
      phaseName: 'Hobbies',
      Component: HobbiesAndInterestScreen,
      // Component: Abc,
      icon: require('../../assets/icons/interner_logo.png'),
    },
  ];

  const RenderComp = PersonalInfoPhases[activeIndex].Component;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const openGallery = () => {
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'All',
    })
      .then(images => {
        const formattedImages = images.map(image => ({
          uri: image.path,
        }));
        setSelectedImages(formattedImages);
        navigation.navigate('SetProfilePictureScreen', {
          selectedImages: formattedImages,
          setSelectedImages, // Pass the setter function
        });
      })
      .catch(error => {
        console.log('Error opening gallery:', error);
      });
  };

  const navigateToScreen = screenNumber => {
    dispatch({type: NUMBER_SCREEN, screenNumber});
  };

  const navigateToNext = () => {
    if (!genderSelectedOption) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please select your gender.',
      });
      return;
    } else if (!maritalSelectedOption) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please select your marital.',
      });
      return;
    } else if (!selectCaste) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please select your caste.',
      });
      return;
    } else if (!selectReligion) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please select your caste.',
      });
      return;
    } else if (!userHeight) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please select your height.',
      });
      return;
    } else if (!userWeight) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please select your weight.',
      });
      return; // Stop navigation if caste is not religion
    }

    // if (activeIndex === PersonalInfoPhases.length - 1) {
    //   // navigation.navigate('SetProfilePictureScreen');
    //   openGallery();
    // } else {

    if (activeIndex === 0) {
      apiDispatch(
        updateDetails(
          {
            gender: genderSelectedOption.toLowerCase(),
            maritalStatus: maritalSelectedOption.toLowerCase(),
            caste: selectCaste.toLowerCase(),
            religion: selectReligion.toLowerCase(),
            height: userHeight,
            weight: userWeight,

            // firstName: firstName,
            // lastName: lastName,
            // dateOfBirth: dateOfBirthISO,
            // birthTime: [selectHours, selectMinutes, selectSecond],
            //
            // writeBoutYourSelf: addDescription,
            // userProfileCompleted: true,
          },
          () => dispatch({type: NEXT_SCREEN}),
        ),
      );
    } else if (activeIndex === 1) {
      // Call addressDetails API for Address Details
      const formattedCountry =
        currentCountry.charAt(0).toLowerCase() + currentCountry.slice(1);

      const formattedState =
        currentState.charAt(0).toLowerCase() + currentState.slice(1);

      const formattedCity =
        selectCurrentCity.charAt(0).toLowerCase() + selectCurrentCity.slice(1);

      apiDispatch(
        addressDetails(
          {
            currentResidenceAddress: currentAddress,
            currentCountry: formattedCountry,
            currentState: formattedState,
            currentCity: formattedCity,
          },
          () => dispatch({type: NEXT_SCREEN}),
        ),
      );
    } else if (activeIndex === 2) {
      // Call addressDetails API for Address Details

      apiDispatch(
        updateDetails(
          {
            mobileNumber: mobileNumber,
            homeMobileNumber: homeNumber,
            userProfileCompleted: true,
          },
          () => dispatch({type: NEXT_SCREEN}),
        ),
      );
    } else if (activeIndex === 3) {
      // Call addressDetails API for Address Details

      const convertFirstLetterToLowerCase = str => {
        return str.charAt(0).toLowerCase() + str.slice(1);
      };

      apiDispatch(
        // updateDetails(
        educationDetails(
          {
            degree: convertFirstLetterToLowerCase(degree),
            collage: convertFirstLetterToLowerCase(collage),
            city: convertFirstLetterToLowerCase(collageCity),
            state: convertFirstLetterToLowerCase(collageState),
            country: convertFirstLetterToLowerCase(collageCountry),
          },
          () => dispatch({type: NEXT_SCREEN}),
        ),
      );
    } else if (activeIndex === 4) {
      // Call addressDetails API for Address Details

      // Extract only the numeric part of the salary (e.g., '2 lakh' => 2)
      const numericSalary = parseInt(salary.replace(/\D/g, ''), 10); // This removes all non-digit characters

      // Check if numericSalary is valid
      if (isNaN(numericSalary)) {
        console.error('Invalid salary value!');
        return; // You can also show an error message to the user if needed
      }
      console.log(' === salary ===> ', salary);

      const convertFirstLetterToLowerCase = str => {
        return str.charAt(0).toLowerCase() + str.slice(1);
      };

      apiDispatch(
        professionalDetail(
          {
            jobTitle: jobTitle,
            jobType: jobType,
            companyName: companyName,
            currentSalary: numericSalary,
            workCity: convertFirstLetterToLowerCase(workInCity),
            workCountry: convertFirstLetterToLowerCase(workInCountry),
          },
          () => dispatch({type: NEXT_SCREEN}),
        ),
      );
    } else if (activeIndex === 5) {
      console.log(' === selectedItems ===> ', selectedItems);

      apiDispatch(
        updateDetails(
          {
            hobbies: selectedItems,
          },
          // () => navigation.navigate('SetProfilePictureScreen'),
        ),
      );
      openGallery();
      // } else {
      //   // Just navigate to the next screen for other phases
      //   dispatch({type: NEXT_SCREEN});
      // }
    }
  };

  const navigateToBack = () => {
    if (activeIndex > 0) {
      dispatch({type: BACK_SCREEN});
    } else {
      // navigation.navigate('HomeTabs', {selectedBox});
      navigation.navigate('CreatingProfileScreen', {selectedBox});
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <Image
        source={images.happyMilanColorLogo}
        style={{
          width: wp(96),
          height: hp(24),
          resizeMode: 'stretch',
          marginTop: hp(15),
          marginLeft: wp(18),
          marginBottom: hp(20),
        }}
      />

      <View style={{height: hp(48)}}>
        <FlatList
          horizontal
          scrollEnabled={false}
          contentContainerStyle={{
            flex: 1,
            height: hp(48),
            // justifyContent: 'space-evenly',
            justifyContent: 'space-between',
            marginHorizontal: 18,
            marginTop: 20,
          }}
          data={PersonalInfoPhases}
          renderItem={({item, index}) =>
            renderIcons({
              item,
              index,
              activeIndex,
              onPressIcon: navigateToScreen,
            })
          }
        />
      </View>

      <View
        style={{
          // flexDirection: 'row',
          // justifyContent: 'space-between',
          marginHorizontal: 17,
        }}>
        <Text
          style={{
            color: colors.black,
            marginTop: hp(37),
            // backgroundColor: 'red',
            // alignItems: 'center',
            textAlign: 'center',
            fontSize: fontSize(20),
            lineHeight: hp(30),
            fontFamily: fontFamily.poppins600,
          }}>
          {PersonalInfoPhases[activeIndex].phaseName}
        </Text>

        {/*{activeIndex > 0 && (*/}
        {/*  <TouchableOpacity*/}
        {/*    onPress={() => {*/}
        {/*      navigation.navigate('HomeTabs');*/}
        {/*    }}>*/}
        {/*    <Text*/}
        {/*      style={{*/}
        {/*        fontSize: fontSize(14),*/}
        {/*        lineHeight: hp(21),*/}
        {/*        fontFamily: fontFamily.poppins400,*/}
        {/*        color: colors.blue,*/}
        {/*        marginTop: hp(15),*/}
        {/*      }}>*/}
        {/*      Skip*/}
        {/*    </Text>*/}
        {/*  </TouchableOpacity>*/}
        {/*)}*/}
      </View>

      {RenderComp && (
        <RenderComp
          genderSelectedOption={genderSelectedOption}
          genderSetSelectedOption={genderSetSelectedOption}
          maritalSelectedOption={maritalSelectedOption}
          maritalSetSelectedOption={maritalSetSelectedOption}
          selectCaste={selectCaste}
          setSelectCaste={setSelectCaste}
          selectReligion={selectReligion}
          setSelectReligion={setSelectReligion}
          userHeight={userHeight}
          setUserHeight={setUserHeight}
          userWeight={userWeight}
          setUserWeight={setUserWeight}
          // OLD
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectHours={selectHours}
          setSelectHours={setSelectHours}
          selectMinutes={selectMinutes}
          setSelectMinutes={setSelectMinutes}
          selectSecond={selectSecond}
          setSelectSecond={setSelectSecond}
          selectCurrentLiving={selectCurrentLiving}
          setSelectCurrentLiving={setSelectCurrentLiving}
          addDescription={addDescription}
          setAddDescription={setAddDescription}
          //CONTACT DETAILS SCREEN

          currentAddress={currentAddress}
          setCurrentAddress={setCurrentAddress}
          currentCountry={currentCountry}
          setCurrentCountry={setCurrentCountry}
          currentState={currentState}
          setCurrentState={setCurrentState}
          selectCurrentCity={selectCurrentCity}
          setSelectCurrentCity={setSelectCurrentCity}
          //OLD
          currentResidingAddress={currentResidingAddress}
          setCurrentResidingAddress={setCurrentResidingAddress}
          //CONTACT SCREEN

          mobileNumber={mobileNumber}
          setMobileNumber={setMobileNumber}
          homeNumber={homeNumber}
          setHomeNumber={setHomeNumber}
          //EDUCATIONS DETAILS
          degree={degree}
          setDegree={setDegree}
          collage={collage}
          setCollage={setCollage}
          collageCity={collageCity}
          setCollageCity={setCollageCity}
          collageState={collageState}
          setCollageState={setCollageState}
          collageCountry={collageCountry}
          setCollageCountry={setCollageCountry}
          //PROFESSIONAL DETAILS
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          jobType={jobType}
          setJobType={setJobType}
          companyName={companyName}
          setCompanyName={setCompanyName}
          salary={salary}
          setSalary={setSalary}
          workInCity={workInCity}
          setWorkInCity={setWorkInCity}
          workInCountry={workInCountry}
          setWorkInCountry={setWorkInCountry}
          selectedCreative={selectedCreative}
          setSelectedCreative={setSelectedCreative}
          selectedFun={selectedFun}
          setSelectedFun={setSelectedFun}
          selectedFitness={selectedFitness}
          setSelectedFitness={setSelectedFitness}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />
      )}

      {!isKeyboardVisible && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 17,
            height: hp(87),
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: wp(133),
              height: hp(44),
              borderRadius: 25,
              borderWidth: 1,
              borderColor: colors.black,
              justifyContent: 'center',
            }}
            onPress={navigateToBack}>
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
            onPress={navigateToNext}
            style={{
              width: wp(176),
              height: hp(44),
              borderRadius: 30,
              backgroundColor: colors.black,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                color: colors.white,
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
              }}>
              {activeIndex === 5 ? 'Add Photos' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default AddPersonalInfo;
