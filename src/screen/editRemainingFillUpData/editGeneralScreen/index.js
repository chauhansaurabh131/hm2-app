import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import AppColorLogo from '../../../components/appColorLogo';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import NewDropDownTextInput from '../../../components/newDropdownTextinput';
import FloatingLabelInput from '../../../components/FloatingLabelInput';
import {useDispatch, useSelector} from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import {style} from '../../adminProfileDetailsScreen/adminGeneralInformationScreen/style';
import LinearGradient from 'react-native-linear-gradient';
import {icons} from '../../../assets';
import {updateDetails} from '../../../actions/homeActions';

const EditGeneralScreen = ({navigation}) => {
  const {user} = useSelector(state => state.auth);

  console.log(' === var ===> ', user?.user?.writeBoutYourSelf);

  const apiDispatch = useDispatch();

  const [genderSelectedOption, genderSetSelectedOption] = useState('');
  const [maritalSelectedOption, maritalSetSelectedOption] = useState('');
  const [selectCaste, setSelectCaste] = useState('');
  const [selectReligion, setSelectReligion] = useState('');
  const [userHeight, setUserHeight] = useState('');
  const [userWeight, setUserWeight] = useState('');

  const [aboutText, setAboutText] = useState(
    user?.user?.writeBoutYourSelf || 'N/A',
  );

  const genderDropdownData = ['Male', 'Female'];
  const maritalDropdownData = ['Single', 'Never-married', 'Married'];
  const casteDropdownData = ['Rajput', 'Shah', 'Jain', 'Surti', 'Kathiawar'];
  const religionDropdownData = ['Hindu', 'Muslim', 'Sikh'];

  useEffect(() => {
    if (user?.user?.gender) {
      genderSetSelectedOption(user?.user?.gender); // Set gender value if available
    }
    if (user?.user?.maritalStatus) {
      maritalSetSelectedOption(user?.user?.maritalStatus); // Set marital status value if available
    }
    if (user?.user?.caste) {
      setSelectCaste(user?.user?.caste);
    }
    if (user?.user?.religion) {
      setSelectReligion(user?.user?.religion);
    }
    if (user?.user?.height) {
      setUserHeight(user?.user?.height);
    }
    if (user?.user?.weight) {
      setUserWeight(user?.user?.weight);
    }
    if (user?.user?.writeBoutYourSelf) {
      setAboutText(user?.user?.writeBoutYourSelf);
    }
  }, [
    user?.user?.gender,
    user?.user?.maritalStatus,
    user?.user?.caste,
    user?.user?.religion,
    user?.user?.height,
    user?.user?.weight,
    user?.user?.writeBoutYourSelf,
  ]);

  const aboutBottomSheetRef = useRef();

  // console.log(' === userHeight ===> ', userHeight);

  const getDropdownHeight = dropdownType => {
    switch (dropdownType) {
      case 'gender':
        return hp(150); // Set height for gender dropdown
      case 'marital':
        return hp(200); // Set height for marital status dropdown
      case 'caste':
        return hp(300); // Set height for caste dropdown
      case 'Religion':
        return hp(200); // Set height for caste dropdown
      default:
        return 300; // Default height
    }
  };

  const onSubmitPress = () => {
    navigation.goBack();

    apiDispatch(
      updateDetails(
        {
          writeBoutYourSelf: aboutText,
          // creatingProfileFor: creatingProfileFor,
          // gender: gender,
          // dateOfBirth: formattedDates,
          // birthTime: birthTime,
          // religion: religion,
          // height: height,
          // weight: weight,
          // maritalStatus: maritalStatus,
        },
        () => {
          navigation.goBack();
        },
      ),
    );
  };

  const onBackPress = () => {
    navigation.goBack();
  };

  const capitalizeFirstLetter = text => {
    if (!text) {
      return text;
    }
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const handleAboutTextChange = text => {
    setAboutText(text);
    // aboutBottomSheetRef.current.open();
  };

  // const handleAboutTextChange = text => {
  //   // Count words in the input text
  //   const wordArray = text.trim().split(/\s+/); // Split by spaces and handle multiple spaces
  //   const wordLimit = 150;
  //
  //   // Check if the word count is less than or equal to the limit
  //   if (wordArray.length <= wordLimit) {
  //     setAboutText(text); // Update text if the word count is within the limit
  //     // setWordCount(wordArray.length); // Update word count
  //   }
  // };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{marginHorizontal: 17, flex: 1}}>
        <AppColorLogo />
        <Text
          style={{
            color: colors.black,
            fontSize: fontSize(20),
            lineHeight: hp(30),
            fontFamily: fontFamily.poppins600,
            textAlign: 'center',
            marginTop: 10,
            marginBottom: 20,
          }}>
          General Details
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginTop: 10}}>
            <NewDropDownTextInput
              placeholder="Gender"
              dropdownData={genderDropdownData}
              onValueChange={genderSetSelectedOption}
              value={capitalizeFirstLetter(genderSelectedOption)}
              bottomSheetHeight={getDropdownHeight('gender')} // Dynamic height
            />

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Marital Status"
                dropdownData={maritalDropdownData}
                onValueChange={maritalSetSelectedOption}
                value={capitalizeFirstLetter(maritalSelectedOption)}
                bottomSheetHeight={getDropdownHeight('marital')} // Dynamic height
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Caste"
                dropdownData={casteDropdownData}
                onValueChange={setSelectCaste}
                value={capitalizeFirstLetter(selectCaste)}
                bottomSheetHeight={getDropdownHeight('caste')} // Dynamic height
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Religion"
                dropdownData={religionDropdownData}
                onValueChange={setSelectReligion}
                value={capitalizeFirstLetter(selectReligion)}
                bottomSheetHeight={getDropdownHeight('Religion')} // Dynamic height
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <FloatingLabelInput
                label="Height"
                value={userHeight.toString()}
                onChangeText={setUserHeight}
                showUnitText={'(ft/cm)'}
                showUnit={true}
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <FloatingLabelInput
                label="Weight"
                value={userWeight.toString()}
                onChangeText={setUserWeight}
                showUnitText={'(kg)'}
                showUnit={true}
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',

                  marginBottom: 5,
                }}>
                <Text
                  style={{
                    color: 'About Yourself',
                    fontSize: fontSize(14),
                    lineHeight: hp(21),
                    fontFamily: fontFamily.poppins400,
                  }}>
                  About Yourself
                </Text>
                <Image
                  source={icons.rightSideIcon}
                  style={{
                    width: hp(6),
                    height: hp(10),
                    resizeMode: 'contain',
                    marginRight: 15,
                    top: 30,
                  }}
                />
              </View>

              <TouchableOpacity
                onPress={() => {
                  aboutBottomSheetRef.current.open();
                }}>
                <Text
                  style={{
                    justifyContent: 'center',
                    fontSize: fontSize(20),
                    marginBottom: 10,
                    color: colors.black,
                    lineHeight: 30,
                    fontFamily: fontFamily.poppins500,
                  }}>
                  {aboutText?.split(' ').slice(0, 5).join(' ') +
                    (aboutText?.split(' ').length > 5 ? '...' : '') ||
                    'Write about yourself...'}
                </Text>

                <View
                  style={{
                    width: '100%',
                    height: 1.2,
                    backgroundColor: '#C0C0C0',
                    // backgroundColor: 'black',
                  }}
                />
              </TouchableOpacity>
            </View>

            <View style={{height: 150}} />
          </View>
        </ScrollView>

        {/*ABOUT US BOTTOM SHEET*/}
        <RBSheet
          ref={aboutBottomSheetRef}
          closeOnDragDown={true} // Allows drag to close
          closeOnPressMask={true} // Allows closing when clicking outside the sheet
          height={hp(400)} // Adjust height of Bottom Sheet
          customStyles={{
            draggableIcon: {
              backgroundColor: colors.gray,
            },
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}>
          <Text
            style={{
              marginHorizontal: 31,
              color: colors.black,
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins500,
              marginTop: hp(5),
            }}>
            Write About Yourself
          </Text>

          <View style={{backgroundColor: '#F7F7F7', marginTop: hp(15)}}>
            <TextInput
              value={aboutText}
              onChangeText={handleAboutTextChange} // Use handleAboutTextChange to limit word count
              multiline
              // editable={isEditing} // Disable editing when isEditing is false
              style={{
                marginHorizontal: 31,
                marginTop: hp(15),
                height: hp(200),
                textAlignVertical: 'top',
                marginBottom: 15,
                color: 'black',
                fontSize: fontSize(16),
                lineHeight: hp(24),
              }}
              placeholder="Type about yourself..."
              placeholderTextColor={colors.gray}
            />
          </View>
          {/*<Text*/}
          {/*  style={{*/}
          {/*    textAlign: 'right',*/}
          {/*    marginRight: hp(15),*/}
          {/*    marginTop: hp(18),*/}
          {/*    fontSize: fontSize(12),*/}
          {/*    lineHeight: hp(18),*/}
          {/*    fontFamily: fontFamily.poppins400,*/}
          {/*    color: colors.black,*/}
          {/*  }}>*/}
          {/*  150 Words*/}
          {/*</Text>*/}

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {
              aboutBottomSheetRef.current.close();
            }}>
            <LinearGradient
              colors={['#2D46B9', '#8D1D8D']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={{
                width: hp(122),
                height: hp(44),
                borderRadius: 50,
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: hp(32),
              }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Add
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </RBSheet>

        <View
          style={{
            flex: 1,
            position: 'absolute',
            bottom: 15,
            width: '100%',
            backgroundColor: 'white',
            height: 70,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 15,
            }}>
            <TouchableOpacity
              onPress={onBackPress}
              activeOpacity={0.7}
              style={{
                width: wp(133),
                height: hp(44),
                borderRadius: 25,
                borderWidth: 1,
                borderColor: colors.black,
                justifyContent: 'center',
              }}>
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
              onPress={onSubmitPress}
              style={{
                width: wp(176),
                height: hp(44),
                borderRadius: 30,
                backgroundColor: colors.black,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: colors.white,
                  fontSize: fontSize(16),
                  lineHeight: hp(24),
                  fontFamily: fontFamily.poppins400,
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default EditGeneralScreen;
