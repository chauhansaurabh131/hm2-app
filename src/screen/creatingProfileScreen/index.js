import React, {useState} from 'react';
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
import {images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../actions/homeActions';
import style from './style';

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

  const navigation = useNavigation();
  const apiDispatch = useDispatch();

  const {isUpdatingProfile} = useSelector(state => state.auth);
  console.log(' === isUpdatingProfile ===> ', isUpdatingProfile);

  const formatSelectedOption = option => {
    return option
      .split(' ')
      .map(
        (word, index) =>
          index === 0
            ? word.toLowerCase() // Make the first word lowercase
            : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(), // Capitalize the first letter of subsequent words
      )
      .join('');
  };

  const onStartNowPress = () => {
    const formattedOption = formatSelectedOption(selectedOption);

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

    apiDispatch(
      updateDetails(
        {
          creatingProfileFor: formattedOption,
          firstName: firstName,
          lastName: lastName,
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
          />
        </View>

        <View style={style.spaceMarginStyle}>
          <FloatingLabelInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={style.spaceMarginStyle}>
          <FloatingLabelInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onStartNowPress}
          style={style.startButton}
          disabled={isUpdatingProfile} // Disable button while loading
        >
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
