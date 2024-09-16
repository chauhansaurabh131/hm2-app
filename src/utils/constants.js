import AddressDetailsScreen from '../screen/addressDetailsScreen';
import ContactDetailsScreen from '../screen/contactDetailsScreen';
import EducationDetailsScreen from '../screen/educationDetailsScreen';
import ProfessionalsDetailsScreen from '../screen/professionalDetailsScreen';
import HobbiesAndInterestScreen from '../screen/hobbiesAndInterestScreen';

import GeneralInformationDetailsScreen from '../screen/generalInformationDetailsScreen';
import UserGeneralDetailInformation from '../screen/usersProfileDetailsScreen/userGeneralDetailInformation';
import UserAddressDetails from '../screen/usersProfileDetailsScreen/userAddressDetails';
import UserContactDetail from '../screen/usersProfileDetailsScreen/userContactDetail';
import UserEducationDetail from '../screen/usersProfileDetailsScreen/userEducationDetail';
import UserProfessionalsDetails from '../screen/usersProfileDetailsScreen/userProfessionalsDetails';
import UserHobbiesAndInterest from '../screen/usersProfileDetailsScreen/userHobbiesAndInterest';
import AdminGeneralInformationScreen from '../screen/adminProfileDetailsScreen/adminGeneralInformationScreen';
import AdminAddressDetailsScreen from '../screen/adminProfileDetailsScreen/adminAddressDetailsScreen';
import AdminContactDetailsScreen from '../screen/adminProfileDetailsScreen/adminContactDetailsScreen';
import AdminEducationDetailsScreen from '../screen/adminProfileDetailsScreen/adminEducationDetailsScreen';
import AdminProfessionalDetailsScreen from '../screen/adminProfileDetailsScreen/adminProfessionalDetailsScreen';
import AdminHobbiesAndInterestScreen from '../screen/adminProfileDetailsScreen/adminHobbiesAndInterestScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const STANDARD_SCREEN_HEIGHT = 764;
export const STANDARD_SCREEN_WIDTH = 390;

export const TOKEN = 'TOKEN';
export const REFRESH_TOKEN = 'REFRESH_TOKEN';
// export const BASE_URL = 'https://happymilan.tech';
export const BASE_URL = 'https://stag.mntech.website';

// https://happymilan.tech/api/v1/user/auth/register

// const images = [
//   require('../../assets/icons/address_location_logo.png'),
//   require('../../assets/icons/phone_logo.png'),
//   require('../../assets/icons/education_logo.png'),
//   require('../../assets/icons/professional_logo.png'),
//   require('../../assets/icons/interner_logo.png'),
// ];

export const PersonalInfoPhases = [
  {
    phaseName: 'General Information',
    component: <GeneralInformationDetailsScreen />,
    icon: require('../assets/icons/profile_logo.png'),
  },
  {
    phaseName: 'Address Details',
    component: <AddressDetailsScreen />,
    icon: require('../assets/icons/address_location_logo.png'),
  },
  {
    phaseName: 'Contact Details',
    component: <ContactDetailsScreen />,
    icon: require('../assets/icons/phone_logo.png'),
  },
  {
    phaseName: 'Education Details',
    component: <EducationDetailsScreen />,
    icon: require('../assets/icons/education_logo.png'),
  },
  {
    phaseName: 'Professional Details',
    component: <ProfessionalsDetailsScreen />,
    icon: require('../assets/icons/professional_logo.png'),
  },
  {
    phaseName: 'Hobbies and Interest',
    component: <HobbiesAndInterestScreen />,
    icon: require('../assets/icons/interner_logo.png'),
  },
];

export const UserDetailsProfile = [
  {
    phaseName: 'General Information',
    component: <UserGeneralDetailInformation />,
    icon: require('../assets/icons/profile_logo.png'),
  },
  {
    phaseName: 'Address Details',
    component: <UserAddressDetails />,
    icon: require('../assets/icons/address_location_logo.png'),
  },
  {
    phaseName: 'Contact Details',
    component: <UserContactDetail />,
    icon: require('../assets/icons/phone_logo.png'),
  },
  {
    phaseName: 'Education Details',
    component: <UserEducationDetail />,
    icon: require('../assets/icons/education_logo.png'),
  },
  {
    phaseName: 'Professional Details',
    component: <UserProfessionalsDetails />,
    icon: require('../assets/icons/professional_logo.png'),
  },
  {
    phaseName: 'Hobbies and Interest',
    component: <UserHobbiesAndInterest />,
    icon: require('../assets/icons/interner_logo.png'),
  },
];

export const UserDetailsProfile1 = [
  {
    phaseName: 'General Information',
    component: params => <UserGeneralDetailInformation {...params} />,
    icon: require('../assets/icons/profile_logo.png'),
  },
  {
    phaseName: 'Address Details',
    component: params => <UserAddressDetails {...params} />,
    icon: require('../assets/icons/address_location_logo.png'),
  },
  {
    phaseName: 'Contact Details',
    component: params => <UserContactDetail {...params} />,
    icon: require('../assets/icons/phone_logo.png'),
  },
  {
    phaseName: 'Education Details',
    component: params => <UserEducationDetail {...params} />,
    icon: require('../assets/icons/education_logo.png'),
  },
  {
    phaseName: 'Professional Details',
    component: params => <UserProfessionalsDetails {...params} />,
    icon: require('../assets/icons/professional_logo.png'),
  },
  {
    phaseName: 'Hobbies and Interest',
    component: params => <UserHobbiesAndInterest {...params} />,
    icon: require('../assets/icons/interner_logo.png'),
  },
];

export const AdminDetailsProfile = [
  {
    phaseName: 'General Information',
    component: params => <AdminGeneralInformationScreen {...params} />,
    icon: require('../assets/icons/profile_logo.png'),
  },
  {
    phaseName: 'Address Details',
    component: params => <AdminAddressDetailsScreen {...params} />,
    icon: require('../assets/icons/address_location_logo.png'),
  },
  {
    phaseName: 'Contact Details',
    component: <AdminContactDetailsScreen />,
    icon: require('../assets/icons/phone_logo.png'),
  },
  {
    phaseName: 'Education Details',
    component: <AdminEducationDetailsScreen />,
    icon: require('../assets/icons/education_logo.png'),
  },
  {
    phaseName: 'Professional Details',
    component: <AdminProfessionalDetailsScreen />,
    icon: require('../assets/icons/professional_logo.png'),
  },
  {
    phaseName: 'Hobbies and Interest',
    component: <AdminHobbiesAndInterestScreen />,
    icon: require('../assets/icons/interner_logo.png'),
  },
];

export const globalUse = {
  ACCESSTOKEN: '',
};
