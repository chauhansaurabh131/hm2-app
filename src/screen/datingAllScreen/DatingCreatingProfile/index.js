import React, {useState} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../../actions/homeActions';
import Toast from 'react-native-toast-message';
import {style} from './style';
import DOBTextInputComponent from '../../../components/DOBTextInputComponent';
import {icons} from '../../../assets';
import {fontSize, hp} from '../../../utils/helpers';
import NewMultiSelectValueComponent from '../../../components/newMultiSelectValueComponent';
import {colors} from '../../../utils/colors';

const DatingCreatingProfile = () => {
  const {user} = useSelector(state => state.auth);

  const [datingSelectedOption, setDatingSelectedOption] = useState([]);
  const [firstName, setFirstName] = useState(
    user?.user?.name || user?.user?.firstName || '',
  );
  const [lastName, setLastName] = useState(user?.user?.lastName || '');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [description, setDescription] = useState('');

  const dropdownData = [
    'Meet New Friends',
    'Looking for Love',
    'Movie Date',
    'Foodies',
    'Travel Buddies',
    'Game Lover',
    'Chit-Chat',
    'Adventurous',
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
    const [day, month, year] = dateOfBirth.split('/');
    const dob = new Date(`${year}-${month}-${day}`);

    if (datingSelectedOption.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Missing Information',
        text2: 'Please select an option.',
      });
      return;
    }

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

    if (!description.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Missing Description',
        text2: 'Please enter your Description.',
      });
      return;
    }

    // ✅ Age validation
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--; // adjust if birthday hasn’t occurred yet this year
    }

    // if (age < 18) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Age Restriction',
    //     text2: 'You must be at least 18 years old.',
    //   });
    //   return;
    // }

    const slugify = text =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

    const selectedSlugArray = datingSelectedOption.map(item => slugify(item));

    const payload = {
      datingData: [
        {
          // interestedIn: selectedLabels,
          interestedIn: selectedSlugArray,
        },
      ],
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dob,
      writeBoutYourSelf: description,
    };

    apiDispatch(
      updateDetails(payload, () => {
        navigation.navigate('AddDatingPersonalInfo');
      }),
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View
        style={{
          height: hp(54),
          justifyContent: 'center',
        }}>
        <Text style={style.headingTextStyle}>Profile Info</Text>
      </View>

      <View style={{marginTop: hp(10)}}>
        <NewMultiSelectValueComponent
          title="I am looking for"
          value={datingSelectedOption} // 👈 ARRAY
          dropdownData={dropdownData}
          onValueChange={setDatingSelectedOption} // 👈 ARRAY SETTER
          bottomSheetHeight={hp(500)}
        />
      </View>

      <View
        style={{
          // backgroundColor: 'skyblue',
          marginTop: hp(37),
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginHorizontal: 17,
        }}>
        <View style={{width: '45%'}}>
          <FloatingLabelInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
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

      <View style={{marginHorizontal: 17, marginTop: hp(8)}}>
        <View style={style.bodySpaceStyle}>
          <DOBTextInputComponent
            label="Date of Birth"
            value={dateOfBirth} // Bind the value to dateOfBirth state
            onChangeText={setDateOfBirth} // Set the onChangeText handler
            imageSource={icons.down_arrow_icon}
          />
        </View>
      </View>

      <View style={{marginHorizontal: 17}}>
        <Text
          style={{
            marginTop: hp(20),
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

      <View style={style.bodyContainer}>
        {/*<AppColorLogo />*/}

        <View style={style.bodyHeightStyle} />
      </View>

      <View style={{marginHorizontal: 17}}>
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
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default DatingCreatingProfile;
