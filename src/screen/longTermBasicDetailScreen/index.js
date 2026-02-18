import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Image,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TextInput,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import NewSelectValueComponent from '../../components/newSelectValueComponent';
import DOBComponent from '../../components/DOBComponent ';
import NewEnterSelectValueComponent from '../../components/newEnterSelectValueComponent';
import {useDispatch} from 'react-redux';
import {updateDetails} from '../../actions/homeActions';
import moment from 'moment-timezone';
import {month} from 'react-native-calendars/src/dateutils';

const LongTermBasicDetailScreen = () => {
  const [name, setName] = React.useState('');
  const [selectedProfileStatus, setSelectedProfileStatus] = React.useState('');
  const [selectedGenderStatus, setSelectedGenderStatus] = React.useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [selectedMaritalStatus, setSelectedMaritalStatus] = useState('');
  const [selectedCityStatus, setSelectedCityStatus] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  const apiDispatch = useDispatch();

  React.useEffect(() => {
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

  const genderDropdownData = [
    'Male',
    'Female',
    'Non Binary',
    'Prefer Not To Say',
    'Other',
  ];

  const isFormValid =
    name.trim() !== '' &&
    selectedProfileStatus !== '' &&
    selectedGenderStatus !== '' &&
    dateOfBirth !== '' &&
    selectedMaritalStatus !== '' &&
    selectedCityStatus !== '';

  const onAddPartnerPreferencePress = () => {
    if (loading) {
      return;
    }

    setLoading(true);

    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const nameParts = trimmedName.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' '); // Handles middle names also

    const formattedOption = selectedProfileStatus
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

    //GENDER DATA TO FIXED
    const formattedGender = selectedGenderStatus
      .toLowerCase()
      .split(' ')
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join('');

    // MARITAL DATA TO FIXED
    const formatMaritalOption = option => {
      if (!option) {
        return '';
      } // handle empty string case
      return option
        .toLowerCase()
        .replace(/[- ](.)/g, (_, char) => char.toUpperCase());
    };

    // const currentDate = moment().format('YYYY-MM-DD');

    // const combinedDateTime = moment(
    //   `${currentDate} ${birthOfTime}`,
    //   'YYYY-MM-DD hh:mm A',
    // );
    //
    // const [hours, minutes] = birthOfTime.split(':');
    // const birthDateTime = new Date();
    // birthDateTime.setHours(parseInt(hours, 10));
    // birthDateTime.setMinutes(parseInt(minutes, 10));
    // birthDateTime.setSeconds(0);

    apiDispatch(
      updateDetails(
        {
          firstName,
          lastName,
          gender: formattedGender,
          creatingProfileFor: formattedOption,
          dateOfBirth: dob,
          maritalStatus: formatMaritalOption(selectedMaritalStatus),
          currentCity: selectedCityStatus.toLowerCase(),
          userProfileCompleted: true,
        },
        // ✅ Success callback
        () => {
          setLoading(false);
          navigation.navigate('LongTermPartnerPreferenceScreen');
        },
        // ✅ Failure callback
        () => {
          setLoading(false);
        },
      ),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/* Header */}
      <View
        style={{
          height: hp(54),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: wp(15),
            height: '100%',
            justifyContent: 'center',
          }}>
          <Image
            source={icons.back_arrow_icon}
            style={{height: hp(16), width: hp(16)}}
          />
        </TouchableOpacity>

        <Text
          style={{
            color: colors.pureBlack,
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins600,
          }}>
          Basic Details!
        </Text>
      </View>

      {/* Banner Image */}
      <Image
        source={images.cartoon_couple_one}
        style={{
          width: '100%',
          height: '15%', // ⭐ Control banner height here
        }}
        resizeMode="stretch" // ⭐ IMPORTANT
      />

      {/* Form Content */}
      <ScrollView
        contentContainerStyle={{
          // paddingHorizontal: wp(17),
          paddingTop: hp(20),
          // backgroundColor: 'orange',
          marginHorizontal: 17,
        }}>
        <Text
          style={{
            fontSize: fontSize(14),
            color: '#757575',
            fontFamily: fontFamily.poppins400,
          }}>
          What's Your First and Last Name?
        </Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter Name Here"
          placeholderTextColor="#999"
          style={{
            marginTop: hp(10),
            height: hp(44),
            borderRadius: hp(10),
            borderWidth: 1,
            borderColor: '#D8D8D8',
            paddingHorizontal: wp(15),
            fontSize: fontSize(16),
            fontFamily: fontFamily.poppins400,
            color: colors.pureBlack,
          }}
        />

        <View style={{marginTop: hp(20)}}>
          <NewSelectValueComponent
            title="I’m creating profile?"
            value={selectedProfileStatus}
            dropdownData={dropdownData}
            onValueChange={setSelectedProfileStatus}
            bottomSheetHeight={hp(400)}
            showDivider={false}
          />
        </View>

        <View style={{marginTop: hp(20)}}>
          <NewSelectValueComponent
            title="What’s Your Gender?"
            value={selectedGenderStatus}
            dropdownData={genderDropdownData}
            onValueChange={setSelectedGenderStatus}
            bottomSheetHeight={hp(270)}
            showDivider={false}
          />
        </View>

        <View style={{marginTop: 20}}>
          <DOBComponent
            label="What’s your Date of Birth?"
            value={dateOfBirth}
            onChangeText={setDateOfBirth}
            imageSource={icons.drooDownLogo}
          />
        </View>

        <View style={{marginTop: hp(20)}}>
          <NewSelectValueComponent
            title="What’s Your Marital Status?"
            value={selectedMaritalStatus}
            dropdownData={['Single', 'Never-Married', 'Married', 'Divorcee']}
            onValueChange={setSelectedMaritalStatus}
            bottomSheetHeight={hp(250)}
            showDivider={false}
          />
        </View>

        <View style={{marginTop: hp(20)}}>
          <NewEnterSelectValueComponent
            title="Which city you live in now?"
            value={selectedCityStatus}
            emptyText="Add"
            modalTitle="Current City"
            EnterModalPlaceholderTittle={'Enter Current City'}
            onValueChange={setSelectedCityStatus}
            showDivider={false}
          />
        </View>

        {/* Add other form fields here */}

        <View style={{height: hp(100)}} />
      </ScrollView>

      {/* Bottom Button */}
      {!isKeyboardVisible && (
        <View
          style={{
            position: 'absolute',
            bottom: hp(20),
            width: '100%',
            alignItems: 'center',
            paddingHorizontal: wp(17),
          }}>
          <TouchableOpacity
            activeOpacity={isFormValid && !loading ? 0.7 : 1}
            disabled={!isFormValid || loading}
            onPress={onAddPartnerPreferencePress}
            style={{
              width: '100%',
              height: hp(45),
              borderRadius: hp(25),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: isFormValid ? '#7148E4' : '#EEE9FF',
            }}>
            {loading ? (
              <ActivityIndicator size="big" color="#FFF" />
            ) : (
              <>
                <Text
                  style={{
                    color: '#FFF',
                    fontSize: fontSize(14),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  Add Partner Preference
                </Text>

                <Image
                  source={icons.back_arrow_icon}
                  style={{
                    position: 'absolute',
                    right: wp(20),
                    transform: [{rotate: '180deg'}],
                    width: hp(16),
                    height: hp(16),
                    tintColor: colors.white,
                  }}
                />
              </>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default LongTermBasicDetailScreen;
