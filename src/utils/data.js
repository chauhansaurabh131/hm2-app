import {images} from '../assets';

export const CurrentState = [
  {label: 'gujarat', value: '1'},
  {label: 'assam', value: '2'},
  {label: 'andhra-pradesh', value: '3'},
  {label: 'arunachal-pradesh', value: '4'},
  {label: 'Bihar', value: '5'},
  {label: 'Chhattisgarh', value: '6'},
  {label: 'goa', value: '7'},
  {label: 'haryana', value: '8'},
];

export const CurrentCity = [
  {label: 'Bardoli', value: '1'},
  {label: 'Navsari', value: '2'},
  {label: 'Mandvi', value: '3'},
  {label: 'Valod', value: '4'},
  {label: 'Surat', value: '5'},
];

export const Area_Code = [
  {label: '+ 91', value: '1'},
  {label: '+ 92', value: '2'},
  {label: '+ 87', value: '3'},
  {label: '+ 69', value: '4'},
  {label: '+ 93', value: '5'},
  {label: '+ 95', value: '6'},
  {label: '+ 88', value: '7'},
  {label: '+ 90', value: '8'},
];

export const COUNTRY_LIST = [
  {label: 'india', value: '1'},
  {label: 'canada', value: '2'},
  {label: 'us', value: '3'},
  {label: 'afghanistan', value: '4'},
  {label: 'china', value: '5'},
  {label: 'Myanmar', value: '6'},
  {label: 'nepal', value: '7'},
  {label: 'sri-lanka', value: '8'},
];

export const Language = [
  {label: 'hindi', value: '1'},
  {label: 'english', value: '2'},
  {label: 'gujarati', value: '3'},
];

export const RELIGION_LIST = [
  {label: 'Hinduism', value: '1'},
  {label: 'Christianity', value: '2'},
  {label: 'Islam', value: '3'},
  {label: 'Buddhism', value: '4'},
  {label: 'Sikhism', value: '5'},
  {label: 'Judaism', value: '6'},
  {label: 'Jainism', value: '7'},
  {label: 'Shinto', value: '8'},
];

export const CASTE_LIST = [
  {label: 'Brahmins', value: '1'},
  {label: 'Kshatriyas', value: '2'},
  {label: 'Vaishyas', value: '3'},
  {label: 'Shudras', value: '4'},
  {label: 'Pariash', value: '5'},
];

export const ANNUAL_SALARY = [
  {label: '10,000 to 15000', value: '1'},
  {label: '15000 to 30,000', value: '2'},
  {label: '30,000 to 45,000', value: '3'},
  {label: '45,000 to 60,000', value: '4'},
  {label: '60,000 to 80,000', value: '5'},
];

export const CREATIVE = [
  {label: 'Writing', value: '1'},
  {label: 'painting', value: '2'},
  // {label: 'Play Instrument', value: '2'},
  // {label: 'Poetry', value: '3'},
  // {label: 'Cooking', value: '4'},
  // {label: 'Gardening', value: '6'},
  // {label: 'Singing', value: '7'},
  // {label: 'DIY Crafts', value: '8'},
  // {label: 'Blogging', value: '9'},
  // {label: 'Photography', value: '10'},
  // {label: 'Dancing', value: '11'},
  // {label: 'Content Creation', value: '12'},
];

export const Diet = [
  {label: 'vegetarian', value: '1'},
  {label: 'non_vegetarian', value: '2'},
];

export const Fun = [
  {label: 'Movie', value: '1'},
  {label: 'Sports', value: '2'},
  {label: 'Biking', value: '3'},
  {label: 'Music', value: '4'},
  {label: 'Social Media', value: '5'},
  {label: 'Clubbing', value: '6'},
  {label: 'Travelling', value: '7'},
  {label: 'Gaming', value: '8'},
  {label: 'Shopping', value: '9'},
  {label: 'Reading', value: '10'},
  {label: 'Binge-Watching', value: '11'},
  {label: 'Theater & Events', value: '12'},
];

export const DemoImage = [
  {label: '1', image: require('../assets/images/demo_4.png')},
  {label: '2', image: require('../assets/images/demo_3.png')},
  {label: '3', image: require('../assets/images/demo_2.png')},
  {label: '4', image: require('../assets/images/demo_1.png')},
  {label: '5', image: require('../assets/images/demo_3.png')},
  {label: '6', image: require('../assets/images/demo_1.png')},
  {label: '7', image: require('../assets/images/demo_4.png')},
  {label: '8', image: require('../assets/images/demo_1.png')},
];

export const userData = [
  {
    id: '1',
    name: 'Rohan Patel',
    image: images.demo_Five_Image,
    age: '32',
    state: 'Gujarat',
    city: 'Mahesana',
    county: 'India',
    isOnline: true,
    km: '2.1km',
    gender: 'Male',
  },
  {
    id: '2',
    name: 'Aarav Bakshi ',
    image: images.demo_Six_Image,
    age: '30',
    state: 'Gujarat',
    city: 'Vododara',
    county: 'India',
    isOnline: true,
    km: '1km',
    gender: 'Male',
  },
  {
    id: '3',
    name: 'Darshan Raval',
    image: images.demo_Seven_Image,
    age: '29',
    state: 'Gujarat',
    city: 'Vododara',
    county: 'India',
    km: '2km',
    gender: 'Male',
  },
  {
    id: '4',
    name: 'mac',
    image: images.demo_Six_Image,
    age: '32',
    state: 'Surat',
    city: 'Mahesana',
    county: 'India',
    km: '2.5km',
    gender: 'Male',
  },
  {
    id: '5',
    name: 'jenny',
    image: images.demo_Seven_Image,
    age: '27',
    state: 'Gujarat',
    city: 'Ahmedabad',
    county: 'India',
    isOnline: true,
    km: '3km',
    gender: 'Male',
  },
  {
    id: '6',
    name: 'denies',
    image: images.demo_Six_Image,
    age: '35',
    state: 'Gujarat',
    city: 'Mahesana',
    county: 'India',
    km: '5km',
    gender: 'Male',
  },
  {
    id: '7',
    name: 'joy',
    image: images.demo_Four_Image,
    age: '32',
    state: 'Gujarat',
    city: 'Mahesana',
    county: 'India',
    km: '0.6km',
    gender: 'Male',
  },
];

export const NEW_MATCHES = [
  {
    id: 1,
    name: 'Daksh Acharya',
    image: require('../assets/images/demo_6.png'),
    age: '32',
    state: 'Gujarat',
    city: 'Mahesana',
    county: 'India',
    km: '2.1 km',
    gender: 'Male',
  },
  {
    id: 2,
    name: 'Aadi Adhvaryu ',
    image: require('../assets/images/demo_5.png'),
    age: '30',
    state: 'Gujarat',
    city: 'Vododara',
    county: 'India',
    km: '1 km',
    gender: 'Male',
  },
  {
    id: 3,
    name: 'Aadvik Patel',
    image: require('../assets/images/demo_3.png'),
    age: '29',
    state: 'Gujarat',
    city: 'Vododara',
    county: 'India',
    km: '1 km',
    gender: 'Male',
  },
  {
    id: '4',
    name: 'denies',
    image: require('../assets/images/demo_6.png'),
    age: '35',
    state: 'Gujarat',
    city: 'Mahesana',
    county: 'India',
    km: '3 km',
    gender: 'Male',
  },
];

export const USER_LIST = [
  {
    id: 1,
    name: 'Rohan Patel',
    image: require('../assets/images/user_one.png'),
    gender: 'Male',
    age: '36',
    height: '4\'55"',
    state: 'Gujarat',
    surname: 'Patel',
    occupation: 'Software Engineer',
    country: 'NY United States',
    city: '',
  },
  {
    id: 2,
    name: 'Aarav Joshi',
    image: require('../assets/images/user_two.png'),
    gender: 'Male',
    age: '36',
    height: '4\'55"',
    state: 'Gujarat',
    surname: 'Joshi',
    occupation: 'Software Developer',
    country: 'India',
    city: 'Rajkot',
  },
  {
    id: 3,
    name: 'Jigar Barot',
    image: require('../assets/images/user_three.png'),
    gender: 'Male',
    age: '31',
    height: '4\'55"',
    state: 'Gujarat',
    surname: 'Barot',
    occupation: 'Software Engineer',
    country: 'India',
    city: '',
  },
  {
    id: 4,
    name: 'Vinod Maheta',
    image: require('../assets/images/user_four.png'),
    gender: 'Male',
    age: '36',
    height: '4\'55"',
    state: 'Gujarat',
    surname: 'Maheta',
    occupation: 'Engineer',
    country: 'India',
    city: 'Mahesana',
  },
];
