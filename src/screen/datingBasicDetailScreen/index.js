import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Image,
  Keyboard,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import NewMultiSelectValueComponent from '../../components/newMultiSelectValueComponent';
import NewSelectValueComponent from '../../components/newSelectValueComponent';
import DOBComponent from '../../components/DOBComponent ';
import NewEnterSelectValueComponent from '../../components/newEnterSelectValueComponent';
import {updateDetails} from '../../actions/homeActions';
import {useDispatch} from 'react-redux';

const DatingBasicDetailScreen = () => {
  const [name, setName] = React.useState('');
  const [datingSelectedOption, setDatingSelectedOption] = useState([]);
  const [selectedGenderStatus, setSelectedGenderStatus] = useState('');
  const [dateOfBirth, setDateOfBirth] = React.useState('');
  const [selectedCityStatus, setSelectedCityStatus] = useState('');
  const [selectedReligionStatus, setSelectedReligionStatus] = useState('');
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
    'Meet New Friends',
    'Looking for Love',
    'Movie Date',
    'Foodies',
    'Travel Buddies',
    'Game Lover',
    'Chit-Chat',
    'Adventurous',
  ];

  const genderDropdownData = [
    'Male',
    'Female',
    'Non Binary',
    'prefer Not To Say',
    'Other',
  ];

  const ReligionData = [
    'Hindu',
    'Muslim',
    'Christian',
    'Sikh',
    'Buddhist',
    'Jain',
    'Islam',
    'Other',
  ];

  const isFormValid =
    name.trim() !== '' &&
    datingSelectedOption.length > 0 &&
    selectedGenderStatus !== '' &&
    dateOfBirth !== '' &&
    selectedReligionStatus !== '' &&
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

    const slugify = text =>
      text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-');

    const selectedSlugArray = datingSelectedOption.map(item => slugify(item));

    const [day, month, year] = dateOfBirth.split('/');
    const dob = new Date(`${year}-${month}-${day}`);

    const formattedGender = selectedGenderStatus
      .toLowerCase()
      .split(' ')
      .map((word, index) =>
        index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join('');

    const payload = {
      firstName: firstName,
      lastName: lastName,
      datingData: [
        {
          // interestedIn: selectedLabels,
          interestedIn: selectedSlugArray,
        },
      ],
      dateOfBirth: dob,
      gender: formattedGender,
      religion: selectedReligionStatus.toLowerCase(),
      CurrentlyLiving: selectedCityStatus.toLowerCase(),
      userProfileCompleted: true,
      // writeBoutYourSelf: description,
    };

    apiDispatch(
      updateDetails(
        payload,
        () => {
          setLoading(false);
          navigation.navigate('DatingNewPartnerPreferenceScreen');
        },
        () => {
          setLoading(false);
        },
      ),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View
        style={{
          height: hp(54),
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('NewStartExploreScreen')}
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
          <NewMultiSelectValueComponent
            title="I am looking for"
            value={datingSelectedOption} // 👈 ARRAY
            dropdownData={dropdownData}
            onValueChange={setDatingSelectedOption} // 👈 ARRAY SETTER
            bottomSheetHeight={hp(500)}
            showDivider={false}
            maxSelection={3}
          />
        </View>

        <View
          style={{
            width: '100%',
            height: hp(1),
            backgroundColor: '#E9E9E9',
            marginTop: hp(25),
          }}
        />

        <View style={{marginTop: hp(20)}}>
          <NewSelectValueComponent
            title="What’s Your Gender?"
            value={selectedGenderStatus}
            dropdownData={genderDropdownData}
            onValueChange={setSelectedGenderStatus}
            bottomSheetHeight={hp(300)}
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
            title="Religion"
            value={selectedReligionStatus}
            dropdownData={ReligionData}
            onValueChange={setSelectedReligionStatus}
            bottomSheetHeight={hp(450)}
            showDivider={false}
          />
        </View>

        <View style={{marginTop: hp(20)}}>
          <NewEnterSelectValueComponent
            title="What’s Your Current City?"
            value={selectedCityStatus}
            emptyText="Add"
            modalTitle="Current City"
            EnterModalPlaceholderTittle={'Enter Current City'}
            onValueChange={setSelectedCityStatus}
            showDivider={false}
          />
        </View>
      </ScrollView>

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

export default DatingBasicDetailScreen;
