import React, {useState} from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons} from '../../assets';
import TextInputSearchAndDropDowm from '../../components/textInputSearchAndDropDown';
import {Calendar} from 'react-native-calendars';
import {style} from './style';
import NewDropDownTextInput from '../../components/newDropdownTextinput';
import FloatingLabelInput from '../../components/FloatingLabelInput';

const GeneralInformationDetailsScreen = ({
  firstName,
  setFirstName,
  lastName,
  setLastName,
  selectedGender,
  setSelectedGender,
  selectedDate,
  setSelectedDate,
  selectHours,
  setSelectHours,
  selectMinutes,
  setSelectMinutes,
  selectSecond,
  setSelectSecond,
  selectReligion,

  selectCurrentCity,
  setSelectCurrentCity,
  selectCurrentLiving,
  setSelectCurrentLiving,
  addDescription,
  setAddDescription,
  firstNameError,
  lastNameError,
  caste,
  setCaste,
  genderSetSelectedOption,
  maritalSetSelectedOption,
  setSelectReligion,
  setSelectCaste,
  userHeight,
  setUserHeight,
  userWeight,
  setUserWeight,
}) => {
  const handleGenderSelection = gender => {
    setSelectedGender(gender);
  };

  const genderDropdownData = ['male', 'female'];

  const maritalDropdownData = ['single', 'never-married', 'married'];
  // const [maritalSelectedOption, maritalSetSelectedOption] = useState('');

  const casteDropdownData = ['rajput', 'shah', 'jain', 'surti', 'Kathiawar'];

  const religionDropdownData = ['hindu', 'muslim', 'sikh'];
  // const [religionSelectedOption, religionSetSelectedOption] = useState('');

  const [isCalendarVisible, setCalendarVisible] = useState(false);

  // const [userHeight, setUserHeight] = useState('');

  const handleCalendarSelect = date => {
    const selectedDateObject = new Date(date.dateString);
    setSelectedDate(selectedDateObject);
    setCalendarVisible(false);
  };

  const getGradientColors = gender => {
    if (selectedGender === gender) {
      return {
        colors: ['#0D4EB3', '#9413D0'],
        textColor: 'white',
      };
    }
    return {
      colors: ['transparent', 'transparent'],
      textColor: 'black',
    };
  };

  return (
    <SafeAreaView style={style.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/*<View style={style.bodyContainer}>*/}
        {/*  <Text*/}
        {/*    style={{*/}
        {/*      color: colors.black,*/}
        {/*      fontSize: fontSize(14),*/}
        {/*      lineHeight: hp(19),*/}
        {/*      fontFamily: fontFamily.poppins600,*/}
        {/*      marginTop: hp(16),*/}
        {/*    }}>*/}
        {/*    Give us your name as per ID*/}
        {/*  </Text>*/}

        {/*  <TextInput*/}
        {/*    placeholder={'First Name'}*/}
        {/*    value={firstName}*/}
        {/*    onChangeText={setFirstName}*/}
        {/*    placeholderTextColor={colors.black}*/}
        {/*    style={{*/}
        {/*      width: '100%',*/}
        {/*      height: hp(50),*/}
        {/*      borderWidth: 1,*/}
        {/*      borderColor: colors.lightGreyBorder,*/}
        {/*      padding: 15,*/}
        {/*      borderRadius: 10,*/}
        {/*      marginTop: hp(7),*/}
        {/*      paddingLeft: 16,*/}
        {/*      color: colors.black,*/}
        {/*    }}*/}
        {/*  />*/}

        {/*  {firstNameError ? (*/}
        {/*    <Text style={{color: 'red', marginBottom: hp(5), marginTop: hp(5)}}>*/}
        {/*      {firstNameError}*/}
        {/*    </Text>*/}
        {/*  ) : null}*/}

        {/*  <TextInput*/}
        {/*    placeholder={'Last Name'}*/}
        {/*    value={lastName}*/}
        {/*    onChangeText={setLastName}*/}
        {/*    placeholderTextColor={colors.black}*/}
        {/*    style={[*/}
        {/*      {*/}
        {/*        width: '100%',*/}
        {/*        height: hp(50),*/}
        {/*        borderWidth: 1,*/}
        {/*        borderColor: colors.lightGreyBorder,*/}
        {/*        padding: 15,*/}
        {/*        borderRadius: 10,*/}
        {/*        marginTop: hp(13),*/}
        {/*        paddingLeft: 16,*/}
        {/*        color: colors.black,*/}
        {/*      },*/}
        {/*    ]}*/}
        {/*  />*/}
        {/*  {lastNameError ? (*/}
        {/*    <Text style={{color: 'red', marginBottom: hp(5), marginTop: hp(5)}}>*/}
        {/*      {lastNameError}*/}
        {/*    </Text>*/}
        {/*  ) : null}*/}

        {/*  <Text*/}
        {/*    style={{*/}
        {/*      fontSize: hp(14),*/}
        {/*      lineHeight: hp(18),*/}
        {/*      marginTop: hp(16),*/}
        {/*      color: colors.black,*/}
        {/*      fontFamily: fontFamily.poppins600,*/}
        {/*    }}>*/}
        {/*    Gender*/}
        {/*  </Text>*/}

        {/*  <View*/}
        {/*    style={{*/}
        {/*      flexDirection: 'row',*/}
        {/*      justifyContent: 'space-between',*/}
        {/*      marginTop: hp(5),*/}
        {/*    }}>*/}
        {/*    {['Male', 'Female', 'Other'].map(gender => (*/}
        {/*      <TouchableOpacity*/}
        {/*        key={gender}*/}
        {/*        activeOpacity={0.5}*/}
        {/*        style={[*/}
        {/*          {*/}
        {/*            width: 105,*/}
        {/*            height: 50,*/}
        {/*            borderColor: colors.lightGreyBorder,*/}
        {/*            borderRadius: 10,*/}
        {/*            justifyContent: 'center',*/}
        {/*            color: colors.black,*/}
        {/*          },*/}
        {/*          {borderWidth: selectedGender === gender ? 0 : 1},*/}
        {/*        ]}*/}
        {/*        onPress={() => handleGenderSelection(gender)}>*/}
        {/*        <LinearGradient*/}
        {/*          colors={getGradientColors(gender).colors}*/}
        {/*          start={{x: 0, y: 0}}*/}
        {/*          end={{x: 1, y: 0}}*/}
        {/*          style={{*/}
        {/*            flex: 1,*/}
        {/*            borderRadius: 10,*/}
        {/*            justifyContent: 'center',*/}
        {/*          }}>*/}
        {/*          <Text*/}
        {/*            style={{*/}
        {/*              textAlign: 'center',*/}
        {/*              color: getGradientColors(gender).textColor,*/}
        {/*            }}>*/}
        {/*            {gender}*/}
        {/*          </Text>*/}
        {/*        </LinearGradient>*/}
        {/*      </TouchableOpacity>*/}
        {/*    ))}*/}
        {/*  </View>*/}

        {/*  <Text*/}
        {/*    style={{*/}
        {/*      fontSize: hp(14),*/}
        {/*      lineHeight: hp(18),*/}
        {/*      marginTop: hp(16),*/}
        {/*      color: colors.black,*/}
        {/*      fontFamily: fontFamily.poppins600,*/}
        {/*    }}>*/}
        {/*    Date of Birth*/}
        {/*  </Text>*/}

        {/*  <View*/}
        {/*    style={{*/}
        {/*      width: '100%',*/}
        {/*      height: hp(55),*/}
        {/*      borderWidth: 1,*/}
        {/*      borderColor: colors.lightGreyBorder,*/}
        {/*      borderRadius: 10,*/}
        {/*      flexDirection: 'row',*/}
        {/*      alignItems: 'center',*/}
        {/*      justifyContent: 'space-between',*/}
        {/*      paddingHorizontal: 10,*/}
        {/*      marginTop: hp(9),*/}
        {/*    }}>*/}
        {/*    <TextInput*/}
        {/*      value={*/}
        {/*        selectedDate ? selectedDate.toISOString().split('T')[0] : ''*/}
        {/*      }*/}
        {/*      placeholder={'18.08.1992'}*/}
        {/*      keyboardType={'numeric'}*/}
        {/*      placeholderTextColor={colors.black}*/}
        {/*      style={{flex: 1, color: colors.black}}*/}
        {/*      editable={false}*/}
        {/*    />*/}
        {/*    <TouchableOpacity*/}
        {/*      style={{flexDirection: 'row', alignItems: 'center'}}*/}
        {/*      onPress={() => setCalendarVisible(true)}>*/}
        {/*      <Image*/}
        {/*        source={icons.calendar_icon}*/}
        {/*        style={{*/}
        {/*          width: hp(21.34),*/}
        {/*          height: hp(24),*/}
        {/*          marginLeft: wp(10),*/}
        {/*          marginRight: wp(5),*/}
        {/*          resizeMode: 'contain',*/}
        {/*        }}*/}
        {/*      />*/}
        {/*    </TouchableOpacity>*/}
        {/*  </View>*/}

        {/*  <Modal*/}
        {/*    animationType="slide"*/}
        {/*    transparent={true}*/}
        {/*    visible={isCalendarVisible}*/}
        {/*    onRequestClose={() => setCalendarVisible(false)}>*/}
        {/*    <View*/}
        {/*      style={{*/}
        {/*        flex: 1,*/}
        {/*        justifyContent: 'center',*/}
        {/*        alignItems: 'center',*/}
        {/*        backgroundColor: 'rgba(0, 0, 0, 0.5)',*/}
        {/*      }}>*/}
        {/*      <View*/}
        {/*        style={{*/}
        {/*          backgroundColor: 'white',*/}
        {/*          borderRadius: 10,*/}
        {/*          padding: 20,*/}
        {/*        }}>*/}
        {/*        <Calendar*/}
        {/*          onDayPress={handleCalendarSelect}*/}
        {/*          markedDates={*/}
        {/*            selectedDate*/}
        {/*              ? {*/}
        {/*                  [selectedDate.toISOString().split('T')[0]]: {*/}
        {/*                    selected: true,*/}
        {/*                    disableTouchEvent: true,*/}
        {/*                  },*/}
        {/*                }*/}
        {/*              : {}*/}
        {/*          }*/}
        {/*        />*/}
        {/*        <TouchableOpacity*/}
        {/*          onPress={() => setCalendarVisible(false)}*/}
        {/*          style={{marginTop: 10}}>*/}
        {/*          <Text>Close</Text>*/}
        {/*        </TouchableOpacity>*/}
        {/*      </View>*/}
        {/*    </View>*/}
        {/*  </Modal>*/}

        {/*  <Text*/}
        {/*    style={{*/}
        {/*      fontSize: hp(14),*/}
        {/*      lineHeight: hp(18),*/}
        {/*      marginTop: hp(16),*/}
        {/*      color: colors.black,*/}
        {/*      fontFamily: fontFamily.poppins600,*/}
        {/*    }}>*/}
        {/*    Birth of Time*/}
        {/*  </Text>*/}

        {/*  <View*/}
        {/*    style={{*/}
        {/*      flexDirection: 'row',*/}
        {/*      justifyContent: 'space-between',*/}
        {/*      alignItems: 'center',*/}
        {/*      marginTop: hp(9),*/}
        {/*    }}>*/}
        {/*    <TextInput*/}
        {/*      value={selectHours}*/}
        {/*      onChangeText={setSelectHours}*/}
        {/*      placeholder={'HH'}*/}
        {/*      keyboardType={'numeric'}*/}
        {/*      maxLength={2}*/}
        {/*      placeholderTextColor={colors.black}*/}
        {/*      style={{*/}
        {/*        width: wp(103),*/}
        {/*        height: hp(50),*/}
        {/*        borderRadius: 10,*/}
        {/*        borderWidth: 1,*/}
        {/*        borderColor: colors.lightGreyBorder,*/}
        {/*        textAlign: 'center',*/}
        {/*        color: colors.black,*/}
        {/*      }}*/}
        {/*    />*/}

        {/*    <TextInput*/}
        {/*      value={selectMinutes}*/}
        {/*      onChangeText={setSelectMinutes}*/}
        {/*      placeholder={'MM'}*/}
        {/*      keyboardType={'numeric'}*/}
        {/*      maxLength={2}*/}
        {/*      placeholderTextColor={colors.black}*/}
        {/*      style={{*/}
        {/*        width: wp(103),*/}
        {/*        height: hp(50),*/}
        {/*        borderRadius: 10,*/}
        {/*        borderWidth: 1,*/}
        {/*        borderColor: colors.lightGreyBorder,*/}
        {/*        textAlign: 'center',*/}
        {/*        color: colors.black,*/}
        {/*      }}*/}
        {/*    />*/}

        {/*    <TextInput*/}
        {/*      value={selectSecond}*/}
        {/*      onChangeText={setSelectSecond}*/}
        {/*      placeholder={'SS'}*/}
        {/*      maxLength={2}*/}
        {/*      keyboardType={'numeric'}*/}
        {/*      placeholderTextColor={colors.black}*/}
        {/*      style={{*/}
        {/*        width: wp(103),*/}
        {/*        height: hp(50),*/}
        {/*        borderRadius: 10,*/}
        {/*        borderWidth: 1,*/}
        {/*        borderColor: colors.lightGreyBorder,*/}
        {/*        textAlign: 'center',*/}
        {/*        color: colors.black,*/}
        {/*        textAlignVertical: 'center',*/}
        {/*      }}*/}
        {/*    />*/}
        {/*  </View>*/}

        {/*  <Text*/}
        {/*    style={{*/}
        {/*      fontSize: hp(14),*/}
        {/*      lineHeight: hp(18),*/}
        {/*      marginTop: hp(16),*/}
        {/*      marginBottom: hp(9),*/}
        {/*      color: colors.black,*/}
        {/*      fontFamily: fontFamily.poppins600,*/}
        {/*    }}>*/}
        {/*    Religion*/}
        {/*  </Text>*/}

        {/*  <TextInputSearchAndDropDowm*/}
        {/*    placeholder={'Select'}*/}
        {/*    dropdownItems={['hindu', 'muslim', 'sikh']}*/}
        {/*    value={selectReligion}*/}
        {/*    onChangeText={setSelectReligion}*/}
        {/*  />*/}

        {/*  <Text*/}
        {/*    style={{*/}
        {/*      fontSize: hp(14),*/}
        {/*      lineHeight: hp(18),*/}
        {/*      marginTop: hp(16),*/}
        {/*      color: colors.black,*/}
        {/*      fontFamily: fontFamily.poppins600,*/}
        {/*      marginBottom: hp(9),*/}
        {/*    }}>*/}
        {/*    Caste / Sub Caste*/}
        {/*  </Text>*/}

        {/*  <TextInputSearchAndDropDowm*/}
        {/*    placeholder={'Select'}*/}
        {/*    dropdownItems={['patel', 'shah', 'soni']}*/}
        {/*    value={selectCaste}*/}
        {/*    onChangeText={setSelectCaste}*/}
        {/*  />*/}

        {/*  <Text*/}
        {/*    style={{*/}
        {/*      fontSize: hp(14),*/}
        {/*      lineHeight: hp(18),*/}
        {/*      marginTop: hp(16),*/}
        {/*      color: colors.black,*/}
        {/*      fontFamily: fontFamily.poppins600,*/}
        {/*    }}>*/}
        {/*    Write About Yourself*/}
        {/*  </Text>*/}

        {/*  <TextInput*/}
        {/*    numberOfLines={10}*/}
        {/*    value={addDescription}*/}
        {/*    onChangeText={setAddDescription}*/}
        {/*    multiline={true}*/}
        {/*    placeholderTextColor={colors.black}*/}
        {/*    style={{*/}
        {/*      height: hp(90),*/}
        {/*      borderWidth: 1,*/}
        {/*      borderColor: colors.lightGreyBorder,*/}
        {/*      borderRadius: 10,*/}
        {/*      justifyContent: 'flex-start',*/}
        {/*      marginTop: hp(12),*/}
        {/*      color: colors.black,*/}
        {/*      textAlignVertical: 'top',*/}
        {/*    }}*/}
        {/*  />*/}

        {/*  <View style={{marginBottom: 50}} />*/}
        {/*</View>*/}

        <View style={{marginHorizontal: wp(17)}}>
          <View style={{marginTop: 30}}>
            <NewDropDownTextInput
              placeholder="Gender"
              dropdownData={genderDropdownData}
              onValueChange={genderSetSelectedOption}
            />

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Marital Status"
                dropdownData={maritalDropdownData}
                onValueChange={maritalSetSelectedOption}
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Caste"
                dropdownData={casteDropdownData}
                onValueChange={setSelectCaste}
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <NewDropDownTextInput
                placeholder="Religion"
                dropdownData={religionDropdownData}
                onValueChange={setSelectReligion}
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <FloatingLabelInput
                label="Height"
                value={userHeight}
                onChangeText={setUserHeight}
                showUnitText={'CM'}
                showUnit={true}
              />
            </View>

            <View style={{marginTop: hp(37)}}>
              <FloatingLabelInput
                label="Weight"
                value={userWeight}
                onChangeText={setUserWeight}
                showUnitText={'KG'}
                showUnit={true}
              />
            </View>

            <View style={{height: 50}} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default GeneralInformationDetailsScreen;
