import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
  Keyboard,
} from 'react-native';
import NewDropDownTextInput from '../../components/newDropdownTextinput';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import {icons} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../actions/homeActions';
import style from './style';
import DOBTextInputComponent from '../../components/DOBTextInputComponent';
import BirthOfTimeTextInput from '../../components/BirthOfTimeTextInput';
import moment from 'moment-timezone';
import {fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const CreatingProfileScreen = () => {
  const dropdownData = [
    'My Self',
    'My Son',
    'My Daughter',
    'My Brother',
    'My Friend',
    'My Relatives',
    'My Cousin',
    'My Nephew',
  ];

  const [selectedOption, setSelectedOption] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [birthOfTime, setBirthOfTime] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();
  const apiDispatch = useDispatch();
  const {isUpdatingProfile, user} = useSelector(state => state.auth);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const onStartNowPress = () => {
    const formattedOption = selectedOption
      .split(' ')
      .map((word, index) => {
        if (index === 0) {
          // first word lowercase
          return word.toLowerCase();
        }
        // capitalize first letter of next words
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');

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

    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    const dayDiff = today.getDate() - dob.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

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
    } else if (age < 18) {
      Toast.show({
        type: 'error',
        text1: 'Age Restriction',
        text2: 'You must be at least 18 years old.',
      });
      return; // stop here if under 18
    }

    if (isNaN(dob.getTime())) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Birth Date',
        text2: 'Please enter a valid Birth date.',
      });
      return;
    }

    // Convert birthOfTime to ISO datetime string
    const [hours, minutes] = birthOfTime.split(':');
    const birthDateTime = new Date();
    birthDateTime.setHours(parseInt(hours, 10));
    birthDateTime.setMinutes(parseInt(minutes, 10));
    birthDateTime.setSeconds(0);

    // console.log(' === birthDateTime ===> ', birthDateTime);

    if (isNaN(birthDateTime.getTime())) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Time',
        text2: 'Please enter a valid time.',
      });
      return;
    } else if (!description) {
      Toast.show({
        type: 'error',
        text1: 'Add Description',
        text2: 'Please enter Description.',
      });
      return; // stop here if under 18
    }

    apiDispatch(
      updateDetails(
        {
          creatingProfileFor: formattedOption,
          firstName: firstName,
          lastName: lastName,
          dateOfBirth: dob,
          birthTime: formattedDateTime, // Send as ISO string
          writeBoutYourSelf: description,
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
        <View
          style={{
            width: '100%',
            height: hp(54),
            justifyContent: 'center',
          }}>
          <Text style={style.tittleText}>Profile Info</Text>
        </View>

        <View style={style.bodyContainer}>
          <NewDropDownTextInput
            placeholder="Creating for Profile?"
            dropdownData={dropdownData}
            onValueChange={setSelectedOption}
            value={selectedOption} // This will bind the selected value to the dropdown
            bottomSheetHeight={hp(400)}
          />
        </View>

        <View
          style={{
            marginTop: hp(37),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '45%'}}>
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

          <View style={{width: '45%'}}>
            <FloatingLabelInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        <View
          style={{
            marginTop: hp(37),
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View style={{width: '45%'}}>
            <DOBTextInputComponent
              label="Date of Birth"
              value={dateOfBirth}
              onChangeText={setDateOfBirth}
              imageSource={icons.drooDownLogo}
            />
          </View>

          <View style={{width: '45%'}}>
            <BirthOfTimeTextInput
              label="Time of Birth"
              value={birthOfTime}
              onChangeText={setBirthOfTime}
              showImage={true}
              imageSource={icons.drooDownLogo}
            />
          </View>
        </View>

        <Text
          style={{
            marginTop: hp(36),
            color: '#7148E4',
            fontSize: fontSize(14),
            fontWeight: '600',
            fontFamily: 'inter',
          }}>
          About Yourself
        </Text>

        <View style={{marginTop: hp(18)}}>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Write description..."
            placeholderTextColor={'gray'}
            multiline
            numberOfLines={5}
            textAlignVertical="top" // 🔥 very important for Android
            style={{
              height: hp(230),
              borderWidth: 1,
              borderColor: '#B1B1B1',
              borderRadius: 8,
              fontSize: fontSize(16),
              padding: 10,
              backgroundColor: '#fff',
              fontWeight: '800',
              fontFamily: 'inter',
              color: colors.pureBlack,
            }}
          />
        </View>
      </View>

      {!isKeyboardVisible && (
        <View style={{position: 'absolute', bottom: 17, width: '100%'}}>
          <View style={{marginHorizontal: 17}}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onStartNowPress}
              style={style.startButton}
              disabled={isUpdatingProfile}>
              {isUpdatingProfile ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <Text style={style.startText}>Add More Info</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default CreatingProfileScreen;
