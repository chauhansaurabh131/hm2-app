import React, {useEffect, useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import NewDropDownTextInput from '../../components/newDropdownTextinput';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../actions/homeActions';
import style from './style';
import DOBTextInputComponent from '../../components/DOBTextInputComponent';
import BirthOfTimeTextInput from '../../components/BirthOfTimeTextInput';
import moment from 'moment-timezone';

const CreatingProfileScreen = () => {
  const dropdownData = [
    'My Self',
    'My Son',
    'My Daughter',
    'My Brother',
    'My Friend',
  ];

  const [selectedOption, setSelectedOption] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [birthOfTime, setBirthOfTime] = useState('');

  const navigation = useNavigation();
  const apiDispatch = useDispatch();
  const {isUpdatingProfile, user} = useSelector(state => state.auth);

  // console.log(' === user?.user ===> ', user?.user);
  // console.log(' === creatingProfileFor ===> ', user?.user?.creatingProfileFor);

  useEffect(() => {
    // Set first name and last name from the user object with proper formatting
    if (user?.user?.name) {
      const nameParts = user.user.name.split(' ');
      const formattedFirstName = nameParts[0]
        ? nameParts[0].charAt(0).toUpperCase() +
          nameParts[0].slice(1).toLowerCase()
        : '';
      const formattedLastName =
        nameParts.length > 1
          ? nameParts.slice(1).join(' ').charAt(0).toUpperCase() +
            nameParts.slice(1).join(' ').slice(1).toLowerCase()
          : '';
      setFirstName(formattedFirstName); // Update first name
      setLastName(formattedLastName); // Update last name
    }

    // Set birthTime if available and format it into 'hh:mm A' format (AM/PM)
    if (user?.user?.birthTime) {
      const formattedTime = moment(user?.user?.birthTime).format('hh:mm A');
      setBirthOfTime(formattedTime); // Set the formatted birth time
    }

    // Set the selectedOption based on the creatingProfileFor value
    if (user?.user?.creatingProfileFor) {
      setSelectedOption(user.user.creatingProfileFor); // Update selected option
    }

    // Set the formatted dateOfBirth
    if (user?.user?.dateOfBirth) {
      const formattedDateOfBirth = moment(user.user.dateOfBirth).format(
        'DD/MM/YYYY',
      );
      setDateOfBirth(formattedDateOfBirth); // Set formatted date
    }
  }, [user]); // Run this effect whenever `user` changes

  useEffect(() => {
    console.log('User creatingProfileFor:', user?.user?.creatingProfileFor); // Check user data
    if (user?.user?.creatingProfileFor) {
      setSelectedOption(user.user.creatingProfileFor); // Set the value for dropdown
    }
  }, [user?.user?.creatingProfileFor]);

  const onStartNowPress = () => {
    const formattedOption = selectedOption
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    const [day, month, year] = dateOfBirth.split('/');
    const dob = new Date(`${year}-${month}-${day}`);

    const currentDate = moment().format('YYYY-MM-DD');

    // Combine the current date with the time entered by the user
    const combinedDateTime = moment(
      `${currentDate} ${birthOfTime}`,
      'YYYY-MM-DD hh:mm A',
    );

    // Format to ISO string, while keeping local time (no UTC conversion)
    const formattedDateTime = combinedDateTime.format(); // Default format is ISO-8601 (local timezone)

    if (!selectedOption) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please select an option.',
      });
      return;
    } else if (!firstName) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please enter first name.',
      });
      return;
    } else if (!lastName) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please enter last name.',
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

    // Convert birthOfTime to ISO datetime string
    const [hours, minutes] = birthOfTime.split(':');
    const birthDateTime = new Date();
    birthDateTime.setHours(parseInt(hours, 10));
    birthDateTime.setMinutes(parseInt(minutes, 10));
    birthDateTime.setSeconds(0);

    console.log(' === birthDateTime ===> ', birthDateTime);

    if (isNaN(birthDateTime.getTime())) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Time',
        text2: 'Please enter a valid time.',
      });
      return;
    }

    apiDispatch(
      updateDetails(
        {
          creatingProfileFor: formattedOption,
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dob,
          birthTime: formattedDateTime, // Send as ISO string
        },
        () => {
          navigation.navigate('GeneralInformationScreen');
        },
      ),
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.containerBody}>
        <Image source={images.happyMilanColorLogo} style={style.appLogoStyle} />

        <Text style={style.tittleText}>I’m creating profile for?</Text>

        <View style={style.bodyContainer}>
          <NewDropDownTextInput
            placeholder="Select an option"
            dropdownData={dropdownData}
            onValueChange={setSelectedOption}
            value={selectedOption} // This will bind the selected value to the dropdown
          />
        </View>

        <View style={style.spaceMarginStyle}>
          <FloatingLabelInput
            label="First Name"
            value={firstName}
            onChangeText={text => {
              const nameParts = text.split(' ');
              setFirstName(nameParts[0]);
              setLastName(
                nameParts.length > 1 ? nameParts.slice(1).join(' ') : '',
              );
            }}
          />
        </View>

        <View style={style.spaceMarginStyle}>
          <FloatingLabelInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <View style={style.spaceMarginStyle}>
          <DOBTextInputComponent
            label="Date of Birth"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            imageSource={icons.calendar_icon}
          />
        </View>

        <View style={style.spaceMarginStyle}>
          <BirthOfTimeTextInput
            label="Time of Birth"
            value={birthOfTime}
            onChangeText={setBirthOfTime}
            showImage={true}
            imageSource={icons.select_time_icon}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onStartNowPress}
          style={style.startButton}
          disabled={isUpdatingProfile}>
          {isUpdatingProfile ? (
            <ActivityIndicator size="large" color="#FFFFFF" />
          ) : (
            <Text style={style.startText}>Start Now</Text>
          )}
        </TouchableOpacity>
      </View>
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default CreatingProfileScreen;
