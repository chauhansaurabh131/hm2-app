import {Dimensions} from 'react-native';
import AddressDetailsScreen from '../screen/addressDetailsScreen';
import ContactDetailsScreen from '../screen/contactDetailsScreen';
import EducationDetailsScreen from '../screen/educationDetailsScreen';
import ProfessionalsDetailsScreen from '../screen/professionalDetailsScreen';
import HobbiesAndInterestScreen from '../screen/hobbiesAndInterestScreen';

import GeneralInformationDetailsScreen from '../screen/generalInformationDetailsScreen';

export const STANDARD_SCREEN_HEIGHT = 764;
export const STANDARD_SCREEN_WIDTH = 390;

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
