import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import AppColorLogo from '../../../components/appColorLogo';
import DropDownMutipleValueComponent from '../../../components/DropDownMutipleValueComponent';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../../actions/homeActions';
import Toast from 'react-native-toast-message';
import {style} from './style';
import DOBTextInputComponent from '../../../components/DOBTextInputComponent';
import {icons} from '../../../assets';

const DatingCreatingProfile = () => {
  const [datingSelectedOption, setDatingSelectedOption] = useState([]);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const dropdownData = [
    {label: 'Meet New Friends', value: '1'},
    {label: 'Looking for Love', value: '2'},
    {label: 'Movie Date', value: '3'},
    {label: 'Foodies', value: '4'},
    {label: 'Travel Buddies', value: '5'},
    {label: 'Game Lover', value: '6'},
    {label: 'Chit-Chat', value: '7'},
    {label: 'Adventurous', value: '8'},
  ];

  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const {isUpdatingProfile} = useSelector(state => state.auth);
  // console.log(' === isUpdatingProfile ===> ', isUpdatingProfile);

  const toKebabCase = str => {
    return str
      .toLowerCase()
      .replace(/[\s-]+/g, '-') // Replace spaces and hyphens with a single hyphen
      .replace(/[^a-z0-9-]/g, ''); // Remove any non-alphanumeric characters (except hyphen)
  };

  const onStartNowPress = () => {
    if (datingSelectedOption.length > 3) {
      Alert.alert(
        'Selection Limit',
        'You can only select up to 3 options.',
        [{text: 'OK'}],
        {cancelable: false},
      );
      return;
    }

    const selectedLabels = datingSelectedOption
      .map(option => {
        const found = dropdownData.find(item => item.value === option);
        return found ? toKebabCase(found.label) : null; // Transform to kebab case
      })
      .filter(label => label !== null); // Filter out null values

    const [day, month, year] = dateOfBirth.split('/');
    const dob = new Date(`${year}-${month}-${day}`);

    if (selectedLabels.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please select an option.',
      });
      return;
    }

    // Check for empty firstName and lastName
    if (!firstName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please enter your first name.',
      });
      return;
    }

    if (!lastName.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please enter your last name.',
      });
      return;
    }

    if (isNaN(dob.getTime())) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Date',
        text2: 'Please enter a valid date.',
      });
      return;
    }

    // Create the expected object structure
    const payload = {
      datingData: [
        {
          interestedIn: selectedLabels,
        },
      ],

      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dob,
    };

    // Dispatch the payload and handle navigation based on success
    apiDispatch(
      updateDetails(payload, () => {
        navigation.navigate('AddDatingPersonalInfo');
      }),
    );
  };

  // navigation.navigate('AddDatingPersonalInfo'),

  return (
    <SafeAreaView style={style.container}>
      <View style={style.bodyContainer}>
        <AppColorLogo />
        <Text style={style.headingTextStyle}>I’m Looking for?</Text>

        <View style={style.bodyHeightStyle}>
          <DropDownMutipleValueComponent
            data={dropdownData}
            height={35}
            searchPlaceholder={'Search Option'}
            placeholder={'Select Interested In'}
            selectedItems={datingSelectedOption}
            setSelectedItems={setDatingSelectedOption}
          />

          <View style={style.bodySpaceStyle}>
            <FloatingLabelInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={style.bodySpaceStyle}>
            <FloatingLabelInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={style.bodySpaceStyle}>
            <DOBTextInputComponent
              label="Date of Birth"
              value={dateOfBirth} // Bind the value to dateOfBirth state
              onChangeText={setDateOfBirth} // Set the onChangeText handler
              imageSource={icons.calendar_icon}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onStartNowPress}
            disabled={isUpdatingProfile}
            style={style.startButtonContainer}>
            {isUpdatingProfile ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <Text style={style.buttonText}>Start Now</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default DatingCreatingProfile;
