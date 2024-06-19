import {
  FlatList,
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';

import React, {useReducer, useState} from 'react';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import LinearGradient from 'react-native-linear-gradient';
import {images} from '../../assets';
import {useRoute} from '@react-navigation/native';
import GeneralInformationDetailsScreen from '../generalInformationDetailsScreen';
import CommonGradientButton from '../../components/commonGradientButton';
import AddressDetailsScreen from '../addressDetailsScreen';
import ContactDetailsScreen from '../contactDetailsScreen';
import EducationDetailsScreen from '../educationDetailsScreen';
import ProfessionalsDetailsScreen from '../professionalDetailsScreen';
import HobbiesAndInterestScreen from '../hobbiesAndInterestScreen';
import {
  addressDetails,
  professionalDetail,
  updateDetails,
} from '../../actions/homeActions';
import {useDispatch} from 'react-redux';

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
  const color = () => {
    if (index === activeIndex) {
      return ['#0D4EB3', '#9413D0'];
    } else {
      if (index < activeIndex) {
        return ['#17C270', '#17C270'];
      } else {
        return ['#FFFFFF', '#FFFFFF'];
      }
    }
  };

  const tintColor = () => (index <= activeIndex ? 'white' : 'black');

  return (
    <TouchableOpacity
      disabled={index > activeIndex + 1}
      activeOpacity={1}
      onPress={() => onPressIcon(index)}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={color()}
        style={{
          height: hp(48),
          width: hp(48),
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 50,
        }}>
        <Image
          source={item.icon}
          style={{
            height: hp(16),
            width: hp(16),
            tintColor: tintColor(),
          }}
          resizeMode={'contain'}
        />
      </LinearGradient>
    </TouchableOpacity>
  );
};

const AddPersonalInfo = ({navigation}) => {
  const phaseReducerInitialState = {
    activeIndex: 0,
  };

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

  const CREATIVE = [
    {label: 'Writing', value: '1'},
    {label: 'Play Instrument', value: '2'},
    {label: 'Game', value: '3'},
    // Add more options as needed
  ];

  const FUN = [
    {label: 'Movie', value: '1'},
    {label: 'Sports', value: '2'},
    // ... other options
  ];

  const FITNESS = [
    {label: 'Running', value: '1'},
    {label: 'Cycling', value: '2'},
    // ... other options
  ];

  // GENERAL INFORMATION SCREEN
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectHours, setSelectHours] = useState('');
  const [selectMinutes, setSelectMinutes] = useState('');
  const [selectSecond, setSelectSecond] = useState('');
  const [selectReligion, setSelectReligion] = useState('');
  const [selectCaste, setSelectCaste] = useState('');
  const [addDescription, setAddDescription] = useState('');

  //ADDRESS DETAILS SCREEN
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
  // const [selectedCreative, setSelectedCreative] = useState([]);

  //CONDITIONS
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');

  const PersonalInfoPhases = [
    {
      phaseName: 'General Information',
      Component: GeneralInformationDetailsScreen,
      icon: require('../../assets/icons/profile_logo.png'),
    },
    {
      phaseName: 'Address Details',
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
      phaseName: 'Professional Details',
      Component: ProfessionalsDetailsScreen,
      icon: require('../../assets/icons/professional_logo.png'),
    },
    {
      phaseName: 'Hobbies and Interest',
      Component: HobbiesAndInterestScreen,
      icon: require('../../assets/icons/interner_logo.png'),
    },
  ];

  const RenderComp = PersonalInfoPhases[activeIndex].Component;

  const navigateToScreen = screenNumber => {
    dispatch({type: NUMBER_SCREEN, screenNumber});
  };

  const mapSelectedValuesToLabels = (selectedValues, options) => {
    return selectedValues.map(value => {
      const option = options.find(option => option.value === value);
      return option ? option.label : null;
    });
  };

  const navigateToNext = () => {
    // if (!firstName.trim()) {
    //   setFirstNameError('Please enter your first name');
    //   return;
    // } else {
    //   console.log(' === var ===> 1');
    //   setFirstNameError('');
    // }
    //
    // if (!lastName.trim()) {
    //   setLastNameError('Please enter your last name');
    //   return;
    // } else {
    //   console.log(' === var ===> 2');
    //   setLastNameError('');
    // }

    const selectedCreativeLabels = mapSelectedValuesToLabels(
      selectedCreative,
      CREATIVE,
    );
    const selectedFunLabels = mapSelectedValuesToLabels(selectedFun, FUN);
    const selectedFitnessLabels = mapSelectedValuesToLabels(
      selectedFitness,
      FITNESS,
    );

    const hobbiesPayload = [
      {
        category: 'Creative',
        values: selectedCreativeLabels,
      },
      {
        category: 'Fun',
        values: selectedFunLabels,
      },
      {
        category: 'Fitness',
        values: selectedFitnessLabels,
      },
    ];

    console.log(' === var ===> ', selectedCreativeLabels);

    if (activeIndex === PersonalInfoPhases.length - 1) {
      navigation.navigate('SetProfilePictureScreen');
    } else {
      if (activeIndex === 0) {
        // Call updateDetails API for General Information
        const dateOfBirthISO = selectedDate ? selectedDate.toISOString() : null;
        apiDispatch(
          updateDetails(
            {
              firstName: firstName,
              lastName: lastName,
              gender: selectedGender,
              dateOfBirth: dateOfBirthISO,
              birthTime: [selectHours, selectMinutes, selectSecond],
              religion: selectReligion,
              cast: selectCaste,
              writeBoutYourSelf: addDescription,
              userProfileCompleted: true,
              // userProfileCompleted: false,
            },
            () => dispatch({type: NEXT_SCREEN}),
          ),
        );
      } else if (activeIndex === 1) {
        // Call addressDetails API for Address Details
        apiDispatch(
          addressDetails(
            {
              currentResidenceAddress: currentResidingAddress,
              currentCity: selectCurrentCity,
              currentCountry: selectCurrentLiving,
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
              // userProfileCompleted: false,
            },
            () => dispatch({type: NEXT_SCREEN}),
          ),
        );
      } else if (activeIndex === 3) {
        // Call addressDetails API for Address Details
        apiDispatch(
          updateDetails(
            {
              degree: degree,
              collage: collage,
              city: collageCity,
              state: collageState,
              country: collageCountry,
            },
            () => dispatch({type: NEXT_SCREEN}),
          ),
        );
      } else if (activeIndex === 4) {
        // Call addressDetails API for Address Details
        apiDispatch(
          professionalDetail(
            {
              jobTitle: jobTitle,
              jobType: jobType,
              companyName: companyName,
              currentSalary: salary,
              workCity: workInCity,
              workCountry: workInCountry,
            },
            () => dispatch({type: NEXT_SCREEN}),
          ),
        );
      } else if (activeIndex === 5) {
        apiDispatch(
          updateDetails(
            {
              hobbies: hobbiesPayload,
            },
            () => navigation.navigate('SetProfilePictureScreen'),
          ),
        );
      } else {
        // Just navigate to the next screen for other phases
        dispatch({type: NEXT_SCREEN});
      }
    }
  };

  const navigateToBack = () => {
    if (activeIndex > 0) {
      dispatch({type: BACK_SCREEN});
    } else {
      navigation.navigate('HomeTabs', {selectedBox});
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
            justifyContent: 'space-evenly',
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

      <Text
        style={{color: colors.black, marginTop: hp(15), marginLeft: hp(16)}}>
        {PersonalInfoPhases[activeIndex].phaseName}
      </Text>

      {RenderComp && (
        <RenderComp
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
          selectReligion={selectReligion}
          setSelectReligion={setSelectReligion}
          selectCaste={selectCaste}
          setSelectCaste={setSelectCaste}
          selectCurrentLiving={selectCurrentLiving}
          setSelectCurrentLiving={setSelectCurrentLiving}
          addDescription={addDescription}
          setAddDescription={setAddDescription}
          //CONTACT DETAILS SCREEN
          selectCurrentCity={selectCurrentCity}
          setSelectCurrentCity={setSelectCurrentCity}
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
          //CONDITIONS
          firstNameError={firstNameError}
          lastNameError={lastNameError}
        />
      )}

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
            width: wp(162),
            height: hp(50),
            borderRadius: 25,
            borderWidth: 1,
            borderColor: colors.blue,
            justifyContent: 'center',
          }}
          onPress={navigateToBack}>
          <Text
            style={{
              textAlign: 'center',
              fontSize: fontSize(14),
              lineHeight: hp(21),
              fontFamily: fontFamily.poppins400,
              color: colors.black,
            }}>
            Back
          </Text>
        </TouchableOpacity>

        <CommonGradientButton
          buttonName={'Next'}
          containerStyle={{width: wp(162), height: hp(50), borderRadius: 25}}
          onPress={navigateToNext}
        />
      </View>
    </SafeAreaView>
  );
};

export default AddPersonalInfo;
