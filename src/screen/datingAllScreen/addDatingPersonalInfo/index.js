import React, {useEffect, useReducer, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {colors} from '../../../utils/colors';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import DatingGeneralDetailsScreen from '../datingGeneralDetailsScreen';
import DatingLocationScreen from '../datingLocationScreen';
import DatingHobbiesScreen from '../datingHobbiesScreen';
import ImagePicker from 'react-native-image-crop-picker';
import {updateDetails} from '../../../actions/homeActions';

const NEXT_SCREEN = 'NEXT_SCREEN';
const NUMBER_SCREEN = 'NUMBER_SCREEN';
const BACK_SCREEN = 'BACK_SCREEN';

const phaseReducer = (state, action) => {
  switch (action.type) {
    case NEXT_SCREEN:
      return {
        activeIndex: state.activeIndex + 1,
      };
    case NUMBER_SCREEN:
      return {
        activeIndex: action.screenNumber,
      };
    case BACK_SCREEN:
      return {
        activeIndex: state.activeIndex - 1,
      };
    default:
      return state;
  }
};

const AddDatingPersonalInfo = ({navigation}) => {
  const phaseReducerInitialState = {
    activeIndex: 0,
  };

  const [selectedImages, setSelectedImages] = useState([]);

  const apiDispatch = useDispatch();

  const {user} = useSelector(state => state.auth);

  console.log(' === var ===> ', user?.user);

  // console.log(' === AddDatingPersonalInfo ===> ', user?.user);

  // console.log(
  //   ' === interestedIn ===> ',
  //   user?.user?.datingData[0]?.interestedIn,
  // );

  const [{activeIndex}, dispatch] = useReducer(
    phaseReducer,
    phaseReducerInitialState,
  );

  const PersonalInfoPhases = [
    {
      phaseName: 'General Details',
      Component: DatingGeneralDetailsScreen,
      icon: require('../../../assets/icons/profile_logo.png'),
    },
    {
      phaseName: 'Contact Details',
      Component: DatingLocationScreen,
      icon: require('../../../assets/icons/address_location_logo.png'),
    },

    {
      phaseName: 'Hobbies and Interest',
      Component: DatingHobbiesScreen,
      icon: require('../../../assets/icons/interner_logo.png'),
    },
  ];

  const RenderComp = PersonalInfoPhases[activeIndex].Component;

  const [genderSelectedOption, genderSetSelectedOption] = useState('');
  const [userHeight, setUserHeight] = useState('');
  const [languageSpoken, setLanguageSpoken] = useState('');
  const [religionSelectedOption, SetReligionSelectedOption] = useState('');
  const [ethnicityData, SetEthnicityData] = useState('');
  const [bio, setBio] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [UserEmail, setUserEmail] = useState('');
  const [currentLiving, setCurrentLiving] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [occupation, setOccupation] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [annualIncome, setAnnualIncome] = useState('');
  const [loading, setLoading] = useState(false);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  // console.log(' === loading ===> ', loading);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setIsKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const renderIcons = ({item, index, activeIndex, onPressIcon}) => {
    // const tintColor = () => (index <= activeIndex ? '#000000' : '#B0B0B0');
    const tintColor = () => (index <= activeIndex ? '#7148E4' : '#000000');

    return (
      <TouchableOpacity
        disabled={index > activeIndex + 1}
        activeOpacity={1}
        style={{
          marginTop: hp(15),
          marginHorizontal: 18,
        }}
        onPress={() => onPressIcon(index)}>
        <Image
          source={item.icon}
          style={{
            height: hp(16),
            width: hp(16),
            tintColor: tintColor(),
            // backgroundColor: 'red',
          }}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    );
  };

  const openGallery = () => {
    console.log(' === openGallery ===> ');
    ImagePicker.openPicker({
      multiple: true,
      mediaType: 'All',
    })
      .then(images => {
        const formattedImages = images.map(image => ({
          uri: image.path,
        }));
        setSelectedImages(formattedImages);
        navigation.navigate('SetProfilePictureScreen', {
          selectedImages: formattedImages,
          setSelectedImages, // Pass the setter function
        });
      })
      .catch(error => {
        console.log('Error opening gallery:', error);
      });
  };

  const navigateToScreen = screenNumber => {
    dispatch({type: NUMBER_SCREEN, screenNumber});
  };

  const navigateToBack = () => {
    if (activeIndex > 0) {
      dispatch({type: BACK_SCREEN});
    } else {
      navigation.navigate('DatingCreatingProfile');
      // navigation.navigate('CreatingProfileScreen', {selectedBox});
    }
  };

  const navigateToNext = () => {
    if (activeIndex === 0) {
      if (!genderSelectedOption) {
        return Toast.show({
          type: 'error',
          text1: 'Missing Information',
          text2: 'Please select your Gender.',
        });
      } else if (!userHeight) {
        return Toast.show({
          type: 'error',
          text1: 'Missing Information',
          text2: 'Please add your Height.',
        });
      } else if (!languageSpoken) {
        return Toast.show({
          type: 'error',
          text1: 'Missing Information',
          text2: 'Please add your language Spoken.',
        });
      } else if (!religionSelectedOption) {
        return Toast.show({
          type: 'error',
          text1: 'Missing Information',
          text2: 'Please add your religion.',
        });
      } else if (!ethnicityData) {
        return Toast.show({
          type: 'error',
          text1: 'Missing Information',
          text2: 'Please add your Ethnicity.',
        });
      } else if (!currentLiving) {
        return Toast.show({
          type: 'error',
          text1: 'Missing Information',
          text2: 'Please add your current Living.',
        });
      } else if (!educationLevel) {
        return Toast.show({
          type: 'error',
          text1: 'Missing Information',
          text2: 'Please add your Education.',
        });
      } else if (!occupation) {
        return Toast.show({
          type: 'error',
          text1: 'Missing Information',
          text2: 'Please add your Occupation.',
        });
      } else if (!annualIncome) {
        return Toast.show({
          type: 'error',
          text1: 'Missing Information',
          text2: 'Please add your Annual Income.',
        });
      }
    }
    setLoading(true);

    if (activeIndex === 0) {
      const numericSalary = parseInt(annualIncome.replace(/\D/g, ''), 10); // This removes all non-digit characters

      const updatedDatingData = {
        ...user?.user?.datingData[0], // Get existing datingData (like interestedIn)
        Ethnicity: ethnicityData, // Add new Ethnicity field
        CurrentlyLiving: currentLiving.toLowerCase(),
        educationLevel: educationLevel,
        Occupation: occupation.toLowerCase(),
        annualIncome: numericSalary,
      };

      const formattedGender = genderSelectedOption
        .toLowerCase()
        .split(' ')
        .map((word, index) =>
          index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join('');

      apiDispatch(
        updateDetails(
          {
            gender: formattedGender,
            height: userHeight,
            // motherTongue: motherTongueString.toLowerCase(),
            motherTongue: languageSpoken.toLowerCase(),
            religion: religionSelectedOption.toLowerCase(),
            datingData: [updatedDatingData],
            // writeBoutYourSelf: bio,
            annualIncome: numericSalary,
            isUserprofileCompletedForReq: true,
          },
          () => dispatch({type: NEXT_SCREEN}, setLoading(false)),
        ),
      );

      // dispatch({type: NEXT_SCREEN});
    } else if (activeIndex === 1) {
      const updatedDatingData = {
        ...user?.user?.datingData[0],
        CurrentlyLiving: currentLiving.toLowerCase(),
        educationLevel: educationLevel,
        Occupation: occupation.toLowerCase(),
        annualIncome: annualIncome,
      };

      console.log(' === activeIndex1 ===> ', mobileNumber, UserEmail);

      apiDispatch(
        updateDetails(
          {
            mobileNumber: mobileNumber,
            email: UserEmail,
            // datingData: [updatedDatingData],
          },
          () => dispatch({type: NEXT_SCREEN}, setLoading(false)),
        ),
      );
    } else if (activeIndex === 2) {
      const formatted = selectedItems
        .map(item => item.toLowerCase().replace(/\s+/g, '_'))
        .join(', ');

      const formatHobby = hobby => {
        if (!hobby) {
          return '';
        }
        return hobby.toLowerCase().replace(/\s+/g, '_');
      };

      const formattedItems = selectedItems.map(formatHobby);

      // console.log(' === var ===> ', formattedItems);

      apiDispatch(
        updateDetails(
          {
            // hobbies: selectedItems.map(item => item.label),
            hobbies: formatted,
          },
          // () => navigation.navigate('SetProfilePictureScreen'),
          () => setLoading(false),
          openGallery(),
        ),
      );
    }
    // }
  };

  const showSkip = activeIndex === 2;

  const handleSkip = () => {
    if (activeIndex === 2) {
      // 👈 Last screen skip action
      openGallery();
      // navigation.navigate('SetProfilePictureScreen');
    } else {
      // 👈 Normal skip → next screen
      dispatch({type: NEXT_SCREEN});
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      {/*<Image*/}
      {/*  source={images.happyMilanColorLogo}*/}
      {/*  style={{*/}
      {/*    width: wp(96),*/}
      {/*    height: hp(24),*/}
      {/*    resizeMode: 'stretch',*/}
      {/*    marginTop: hp(15),*/}
      {/*    marginLeft: wp(18),*/}
      {/*    marginBottom: hp(20),*/}
      {/*  }}*/}
      {/*/>*/}

      {/*<View*/}
      {/*  style={{*/}
      {/*    marginHorizontal: 17,*/}
      {/*  }}>*/}
      {/*  <Text*/}
      {/*    style={{*/}
      {/*      color: colors.black,*/}
      {/*      marginTop: hp(25),*/}
      {/*      textAlign: 'center',*/}
      {/*      fontSize: fontSize(20),*/}
      {/*      lineHeight: hp(30),*/}
      {/*      fontFamily: fontFamily.poppins600,*/}
      {/*    }}>*/}
      {/*    {PersonalInfoPhases[activeIndex].phaseName}*/}
      {/*  </Text>*/}
      {/*</View>*/}

      <View
        style={{
          height: 54,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        {/* CENTER TITLE */}
        <Text
          style={{
            textAlign: 'center',
            fontSize: fontSize(14),
            fontFamily: fontFamily.poppins600,
            color: colors.pureBlack,
          }}>
          {PersonalInfoPhases[activeIndex].phaseName}
        </Text>

        {/* RIGHT SIDE SKIP */}
        {showSkip && (
          <TouchableOpacity
            onPress={handleSkip}
            activeOpacity={0.7}
            style={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: [{translateY: -8}],
            }}>
            <Text
              style={{
                fontSize: fontSize(12),
                fontFamily: fontFamily.poppins400,
                color: '#7148E4',
              }}>
              Skip
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{height: hp(48)}}>
        <FlatList
          horizontal
          scrollEnabled={false}
          contentContainerStyle={{
            flex: 1,
            // height: hp(48),
            justifyContent: 'space-evenly',
            // justifyContent: 'space-between',
            // marginHorizontal: wp(70),
            // marginTop: hp(30),
            backgroundColor: '#F9F7FF',
          }}
          data={PersonalInfoPhases}
          renderItem={({item, index}) =>
            renderIcons({
              item,
              index,
              activeIndex,
              onPressIcon: navigateToScreen,
            })
          }
        />
      </View>

      {/*<View*/}
      {/*  style={{*/}
      {/*    marginHorizontal: 17,*/}
      {/*  }}>*/}
      {/*  <Text*/}
      {/*    style={{*/}
      {/*      color: colors.black,*/}
      {/*      marginTop: hp(37),*/}
      {/*      textAlign: 'center',*/}
      {/*      fontSize: fontSize(20),*/}
      {/*      lineHeight: hp(30),*/}
      {/*      fontFamily: fontFamily.poppins600,*/}
      {/*    }}>*/}
      {/*    {PersonalInfoPhases[activeIndex].phaseName}*/}
      {/*  </Text>*/}
      {/*</View>*/}

      {RenderComp && (
        <RenderComp
          genderSelectedOption={genderSelectedOption}
          genderSetSelectedOption={genderSetSelectedOption}
          userHeight={userHeight}
          setUserHeight={setUserHeight}
          setLanguageSpoken={setLanguageSpoken}
          languageSpoken={languageSpoken}
          religionSelectedOption={religionSelectedOption}
          SetReligionSelectedOption={SetReligionSelectedOption}
          ethnicityData={ethnicityData}
          SetEthnicityData={SetEthnicityData}
          bio={bio}
          setBio={setBio}
          mobileNumber={mobileNumber}
          setMobileNumber={setMobileNumber}
          UserEmail={UserEmail}
          setUserEmail={setUserEmail}
          currentLiving={currentLiving}
          setCurrentLiving={setCurrentLiving}
          educationLevel={educationLevel}
          setEducationLevel={setEducationLevel}
          occupation={occupation}
          setOccupation={setOccupation}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          annualIncome={annualIncome}
          setAnnualIncome={setAnnualIncome}
        />
      )}

      {!isKeyboardVisible && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 17,
            height: hp(87),
            alignItems: 'center',
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              width: wp(133),
              height: hp(44),
              borderRadius: hp(25),
              borderWidth: 1,
              borderColor: colors.black,
              justifyContent: 'center',
            }}
            onPress={navigateToBack}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: fontSize(16),
                lineHeight: hp(24),
                fontFamily: fontFamily.poppins400,
                color: colors.black,
              }}>
              Back
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={navigateToNext}
            style={{
              width: wp(176),
              height: hp(44),
              borderRadius: 30,
              backgroundColor: colors.black,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {loading ? (
              <ActivityIndicator size="large" color={colors.white} />
            ) : (
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                {/*Continue*/}
                {activeIndex === 2 ? 'Add Photos' : 'Save & Next'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}
      <Toast ref={ref => Toast.setRef(ref)} />
    </SafeAreaView>
  );
};

export default AddDatingPersonalInfo;
