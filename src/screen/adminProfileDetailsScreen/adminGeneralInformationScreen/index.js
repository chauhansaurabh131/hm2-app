import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {icons} from '../../../assets';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../../actions/homeActions';
import {style} from './style';
import {hp} from '../../../utils/helpers';
import {format} from 'date-fns';
import moment from 'moment';
import RBSheet from 'react-native-raw-bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import DatePicker from 'react-native-date-picker';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../../utils/colors';

const AdminGeneralInformationScreen = (...params) => {
  const userPersonalData = params[0];
  const apiDispatch = useDispatch();

  const {isUpdatingProfile} = useSelector(state => state.auth);

  const [isEditing, setIsEditing] = useState(false);
  const [aboutText, setAboutText] = useState(
    userPersonalData?.writeBoutYourSelf || '',
  );
  const [wordCount, setWordCount] = useState(0);
  const [creatingProfileFor, setCreatingProfileFor] = useState(
    userPersonalData?.creatingProfileFor || 'Select',
  );
  const [gender, setGender] = useState(userPersonalData?.gender || 'Select');
  const [dateOfBirth, setDateOfBirth] = useState(userPersonalData?.dateOfBirth);
  const [open, setOpen] = useState(false); // State to manage the DatePicker modal
  const [selectedDate, setSelectedDate] = useState(new Date()); // Selected date for the DatePicker
  const [birthTime, setBirthTime] = useState(
    userPersonalData?.birthTime
      ? new Date(userPersonalData?.birthTime)
      : new Date(),
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [religion, serReligion] = useState(userPersonalData?.religion);
  const [height, setHeight] = useState(userPersonalData?.height || '');
  const [weight, setWeight] = useState(userPersonalData?.weight || '');
  const [maritalStatus, setMaritalStatus] = useState(
    userPersonalData?.maritalStatus || '',
  );

  // Function to format the date to DD/MM/YYYY
  const formatDate = date => {
    if (!date) {
      return '';
    }

    // If the date is in ISO format, convert it to a Date object
    if (typeof date === 'string' && date.includes('T')) {
      date = new Date(date); // Convert ISO string to Date object
    }

    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
    const year = date.getFullYear();

    // Return the date in MM/DD/YYYY format
    return `${day}. ${month}. ${year}`;
  };

  const formatDates = date => {
    if (!date) {
      return '';
    }

    // If the date is in ISO format, convert it to a Date object
    if (typeof date === 'string' && date.includes('T')) {
      date = new Date(date); // Convert ISO string to Date object
    }

    const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits for month
    const year = date.getFullYear();

    // Return the date in MM/DD/YYYY format
    return `${month}. ${day}. ${year}`;
  };

  // Update formatted date with either dateOfBirth (ISO 8601 string) or selectedDate (Date object)
  const formattedDate = formatDate(
    dateOfBirth ? new Date(dateOfBirth) : selectedDate,
  );

  const formattedDates = formatDates(
    dateOfBirth ? new Date(dateOfBirth) : selectedDate,
  );

  const currentYear = new Date().getFullYear(); // Get the current year
  const maxDate = new Date(currentYear, 11, 31); // Set the maximum date to December 31 of the current year

  const handleSetDate = () => {
    // Get the date components
    const day = selectedDate.getDate().toString().padStart(2, '0'); // Ensure 2 digits for day
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
    const year = selectedDate.getFullYear().toString();

    const selectedFormattedDate = `${day}/${month}/${year}`;

    // Manually build the correct ISO string from the selected date
    const isoDate = new Date(`${year}-${month}-${day}T00:00:00.000Z`);

    console.log(' === isoDate ===> ', isoDate); // Log ISO formatted date

    setDateOfBirth(isoDate.toISOString()); // Store the ISO 8601 formatted date in state
    setOpen(false); // Close the modal
  };

  const formatTime = dateStr => {
    if (!dateStr) {
      return ''; // Return an empty string if no date is provided
    }

    const date = new Date(dateStr); // Create a Date object from the string
    return format(date, 'hh:mm a'); // Format it to hours:minutes AM/PM (12-hour format)
  };

  const handleConfirm = () => {
    const formattedTime = moment(selectedTime).format('hh:mm A'); // Format with AM/PM
    console.log(' === formattedTime ===> ', formattedTime);

    // Convert selected time into a full ISO string with the current date
    const now = new Date(); // Get the current date
    const newDate = moment(now).set({
      hour: selectedTime.getHours(),
      minute: selectedTime.getMinutes(),
      second: 0,
      millisecond: 0,
    });

    const isoString = newDate.toISOString(); // Convert the moment to an ISO string
    console.log(' === isoString ===> ', isoString); // Example: "2025-01-07T06:00:19.329Z"

    // Set the formatted ISO string (this can be sent to the server, saved in state, etc.)
    setBirthTime(isoString);
    setModalVisible(false);
  };

  const navigation = useNavigation();

  const aboutBottomSheetRef = useRef();
  const profileForBottomSheetRef = useRef();
  const genderBottomSheetRef = useRef();
  const religionBottomSheetRef = useRef();
  const heightBottomSheetRef = useRef();
  const weightBottomSheetRef = useRef();
  const maritalStatusBottomSheetRef = useRef();

  const openBottomSheet = () => {
    aboutBottomSheetRef.current.open();
  };

  const handleSelectProfile = profileType => {
    setCreatingProfileFor(profileType); // Update the state with the selected profile type
    profileForBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleSelectGender = profileType => {
    setGender(profileType); // Update the state with the selected profile type
    genderBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleSelectReligion = profileType => {
    serReligion(profileType); // Update the state with the selected profile type
    religionBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleSelectMaritalStatus = profileType => {
    setMaritalStatus(profileType); // Update the state with the selected profile type
    maritalStatusBottomSheetRef.current.close(); // Close the bottom sheet
  };

  // Function to handle Save action
  const handleSave = () => {
    console.log('Saved:', aboutText);
    apiDispatch(
      updateDetails(
        {
          writeBoutYourSelf: aboutText,
          creatingProfileFor: creatingProfileFor,
          gender: gender,
          dateOfBirth: formattedDates,
          birthTime: birthTime,
          religion: religion,
          height: height,
          weight: weight,
          maritalStatus: maritalStatus,
        },
        () => {
          setIsEditing(false);
        },
      ),
    );
  };

  useEffect(() => {
    // Ensure selectedTime is updated if birthTime changes
    if (birthTime && typeof birthTime === 'string') {
      setSelectedTime(moment(birthTime).toDate());
    }
  }, [birthTime]);

  const handleAboutTextChange = text => {
    // Count words in the input text
    const wordArray = text.trim().split(/\s+/); // Split by spaces and handle multiple spaces
    const wordLimit = 150;

    // Check if the word count is less than or equal to the limit
    if (wordArray.length <= wordLimit) {
      setAboutText(text); // Update text if the word count is within the limit
      setWordCount(wordArray.length); // Update word count
    }

    // If word count reaches 150, disable editing
    if (wordArray.length >= wordLimit) {
      setIsEditing(false); // Stop editing once word count reaches 150
    }
  };

  const capitalizeFirstLetter = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
    // return string;
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headingContainer}>
        {!isEditing ? (
          <Text style={style.headingText}>General Information</Text>
        ) : (
          <Text style={style.headingText}>Modify General Information</Text>
        )}

        {!isEditing && (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={style.editIconContainer}>
            <Image source={icons.new_edit_icon} style={style.editIcon} />
          </TouchableOpacity>
        )}
      </View>

      <View style={style.horizontalLineOne} />

      {/* Content based on edit mode */}
      <View style={style.bodyContainer}>
        {!isEditing ? (
          <View style={style.bodyContainerStyle}>
            <Text style={style.tittleText}>Date of Birth</Text>
            <Text style={style.subTittleText}>
              {formattedDate || 'Select Date'}{' '}
            </Text>

            <View style={style.subTittleContainer}>
              <Text style={style.tittleText}>Birth of Time</Text>
              <Text style={style.subTittleText}>
                {formatTime(birthTime) || 'Select Date'}{' '}
              </Text>
            </View>

            <View style={style.subTittleContainer}>
              <Text style={style.tittleText}>Religion</Text>
              <Text style={style.subTittleText}>
                {capitalizeFirstLetter(religion)}
              </Text>
            </View>

            <View style={style.subTittleContainer}>
              <Text style={style.tittleText}>Height</Text>
              <Text style={style.subTittleText}>{height} ft</Text>
            </View>

            <View style={style.subTittleContainer}>
              <Text style={style.tittleText}>Weight</Text>
              <Text style={style.subTittleText}>{weight} Kg</Text>
            </View>

            <View style={[style.subTittleContainer, {marginBottom: hp(25)}]}>
              <Text style={style.tittleText}>Marital Status</Text>
              <Text style={style.subTittleText}>
                {capitalizeFirstLetter(maritalStatus)}
              </Text>
            </View>
          </View>
        ) : (
          <>
            {/* If editing, display the "About You" and "Create Profile" sections */}

            <View style={style.bodyContainerStyle}>
              <Text style={style.tittleText}>Name</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ChangeNameRequestScreen');
                }}
                style={style.subTittleContainerStyle}>
                <Text style={style.subTittleText}>
                  {userPersonalData?.firstName || userPersonalData?.name}{' '}
                  {userPersonalData?.lastName || ' '}
                </Text>

                <Image
                  source={icons.rightSideIcon}
                  style={style.rightSideIcon}
                />
              </TouchableOpacity>
            </View>

            <View style={style.horizontalLineTwo} />

            <View style={style.bodyContainerStyle}>
              <Text style={style.tittleText}>About You</Text>

              <TouchableOpacity
                onPress={openBottomSheet}
                style={style.subTittleContainerStyle}>
                <Text style={style.subTittleText}>
                  {aboutText?.split(' ').slice(0, 5).join(' ') +
                    (aboutText?.split(' ').length > 5 ? '...' : '') ||
                    'Write about yourself...'}
                </Text>

                <Image
                  source={icons.rightSideIcon}
                  style={style.rightSideIcon}
                />
              </TouchableOpacity>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Create Profile for</Text>

                <TouchableOpacity
                  onPress={() => {
                    profileForBottomSheetRef.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>{creatingProfileFor}</Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Gender</Text>

                <TouchableOpacity
                  onPress={() => {
                    genderBottomSheetRef.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {capitalizeFirstLetter(gender)}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Date of Birth</Text>

                <TouchableOpacity
                  onPress={() => setOpen(true)}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {formattedDate || 'Select Date'}{' '}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Birth of Time</Text>

                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {formatTime(birthTime) || 'Select Date'}{' '}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Religion</Text>

                <TouchableOpacity
                  onPress={() => religionBottomSheetRef.current.open()}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {capitalizeFirstLetter(religion)}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Height</Text>

                <TouchableOpacity
                  onPress={() => heightBottomSheetRef.current.open()}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {height ? `${height} ft` : 'Select Height'}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Weight</Text>

                <TouchableOpacity
                  onPress={() => weightBottomSheetRef.current.open()}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {weight ? `${weight} kg` : 'Select weight'}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Marital Status</Text>

                <TouchableOpacity
                  onPress={() => maritalStatusBottomSheetRef.current.open()}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {capitalizeFirstLetter(maritalStatus)}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              {/*ABOUT US BOTTOM SHEET*/}
              <RBSheet
                ref={aboutBottomSheetRef}
                closeOnDragDown={true} // Allows drag to close
                closeOnPressMask={true} // Allows closing when clicking outside the sheet
                height={hp(430)} // Adjust height of Bottom Sheet
                customStyles={{
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                }}>
                <Text style={style.aboutBottomSheetTittleText}>
                  Write About Yourself
                </Text>

                <View style={style.aboutBottomSheetBody}>
                  <TextInput
                    value={aboutText}
                    onChangeText={handleAboutTextChange} // Use handleAboutTextChange to limit word count
                    multiline
                    editable={isEditing} // Disable editing when isEditing is false
                    style={style.aboutBottomSheetTextInput}
                    placeholder="Type about yourself..."
                    placeholderTextColor={colors.gray}
                  />
                </View>
                <Text style={style.aboutBottomSheetWord}>150 Words</Text>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    aboutBottomSheetRef.current.close();
                  }}>
                  <LinearGradient
                    colors={['#2D46B9', '#8D1D8D']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={style.bottomSheetAddButtonContainer}>
                    <Text style={style.bottomSheetAddButtonText}>Add</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </RBSheet>

              {/*PROFILE FOR BOTTOM SHEET*/}
              <RBSheet
                ref={profileForBottomSheetRef}
                closeOnDragDown={true} // Allows drag to close
                closeOnPressMask={true} // Allows closing when clicking outside the sheet
                height={hp(290)} // Adjust height of Bottom Sheet
                customStyles={{
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                }}>
                <Text style={style.bottomSheetTittleText}>
                  Select Create Profile for
                </Text>

                <View style={style.bottomSheetUnderLine} />

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectProfile('My Self')}>
                  <Text style={style.bottomSheetOptionText}>My Self</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectProfile('My Son')}>
                  <Text style={style.bottomSheetOptionText}>My Son</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectProfile('My Daughter')}>
                  <Text style={style.bottomSheetOptionText}>My Daughter</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectProfile('My Brother')}>
                  <Text style={style.bottomSheetOptionText}>My Brother</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectProfile('My Friend')}>
                  <Text style={style.bottomSheetOptionText}>My Friend</Text>
                </TouchableOpacity>
              </RBSheet>

              {/*GENDER BOTTOM SHEET*/}
              <RBSheet
                ref={genderBottomSheetRef}
                closeOnDragDown={true} // Allows drag to close
                closeOnPressMask={true} // Allows closing when clicking outside the sheet
                height={hp(180)} // Adjust height of Bottom Sheet
                customStyles={{
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                }}>
                <Text style={style.bottomSheetTittleText}>Select Gender</Text>

                <View style={style.bottomSheetUnderLine} />

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectGender('male')}>
                  <Text style={style.bottomSheetOptionText}>Male</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectGender('female')}>
                  <Text style={style.bottomSheetOptionText}>Female</Text>
                </TouchableOpacity>
              </RBSheet>

              {/*BIRTH OF DATE MODAL*/}
              <Modal visible={open} transparent={true} animationType="fade">
                <View style={style.BODModalContainer}>
                  <View style={style.BODBodyContainer}>
                    <TouchableOpacity
                      style={style.BODCancelButtonContainer}
                      onPress={() => setOpen(false)}>
                      <Text style={style.BODCancelText}>X</Text>
                    </TouchableOpacity>

                    <View style={{marginTop: 40}}>
                      <DatePicker
                        date={selectedDate} // Selected date
                        mode="date"
                        maximumDate={maxDate} // Prevent dates beyond the current year
                        onDateChange={setSelectedDate} // Update date in state when scrolling
                        textColor={'black'}
                      />
                    </View>

                    <TouchableOpacity
                      style={style.BODSetDateButton}
                      onPress={handleSetDate}>
                      <Text style={style.BODSetDateText}>Set Date</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>

              {/*BIRTH OF TIME MODAL*/}
              <Modal
                animationType="none"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}>
                <View style={style.BOTModalContainer}>
                  <View style={style.BOTModalBodyContainer}>
                    <Text style={style.BOTModalTittle}>Select Time</Text>

                    <DatePicker
                      mode="time"
                      date={selectedTime}
                      is24hour={false} // Use 12-hour format for AM/PM
                      onDateChange={setSelectedTime}
                      minuteInterval={1}
                      textColor={'black'}
                    />

                    <View style={style.BOTButtonContainer}>
                      <TouchableOpacity
                        style={style.BOTConfirmButtonContainer}
                        onPress={handleConfirm}>
                        <Text style={style.BOTConfirmText}>Confirm</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        style={style.BOTCancelButtonContainer}>
                        <Text style={style.BOTCancelText}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>

              {/*RELIGION BOTTOM SHEET*/}
              <RBSheet
                ref={religionBottomSheetRef}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={hp(220)}
                customStyles={{
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                }}>
                <Text style={style.bottomSheetTittleText}>Select Religion</Text>

                <View style={style.bottomSheetUnderLine} />

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectReligion('hindu')}>
                  <Text style={style.bottomSheetOptionText}>Hindu</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectReligion('muslim')}>
                  <Text style={style.bottomSheetOptionText}>Muslim</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectReligion('sikh')}>
                  <Text style={style.bottomSheetOptionText}>Sikh</Text>
                </TouchableOpacity>
              </RBSheet>

              {/*HEIGHT BOTTOM SHEET*/}
              <RBSheet
                ref={heightBottomSheetRef}
                closeOnDragDown={true} // Allows drag to close
                closeOnPressMask={true} // Allows closing when clicking outside the sheet
                height={hp(230)} // Adjust height of Bottom Sheet
                customStyles={{
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                }}>
                <Text style={style.bottomSheetTittleText}>Add Height</Text>

                <View style={style.bottomSheetUnderLine} />

                <View style={{marginHorizontal: 17, position: 'relative'}}>
                  <TextInput
                    value={height}
                    onChangeText={text => {
                      const numericValue = text.replace(/[^0-9.]/g, '');
                      const dotCount = (numericValue.match(/\./g) || []).length;

                      if (dotCount <= 1) {
                        setHeight(numericValue);
                      }
                    }}
                    keyboardType="numeric" // Only allow numeric input
                    style={style.bottomSheetHeightTextInput}
                    placeholder="Enter Height"
                    placeholderTextColor="#8B8B8B"
                  />

                  {/* 'ft' text inside the TextInput */}
                  <Text style={style.BottomSheetTextInputText}>ft</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  // onPress={handleConfirmBlock}
                  onPress={() => {
                    heightBottomSheetRef.current.close();
                  }}>
                  <LinearGradient
                    colors={['#2D46B9', '#8D1D8D']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={style.bottomSheetAddButtonContainer}>
                    <Text style={style.bottomSheetAddButtonText}>Add</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </RBSheet>

              {/*WEIGHT BOTTOM SHEET*/}
              <RBSheet
                ref={weightBottomSheetRef}
                closeOnDragDown={true} // Allows drag to close
                closeOnPressMask={true} // Allows closing when clicking outside the sheet
                height={hp(230)} // Adjust height of Bottom Sheet
                customStyles={{
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                }}>
                <Text style={style.bottomSheetTittleText}>Add Weight</Text>

                <View style={style.bottomSheetUnderLine} />

                <View style={{marginHorizontal: 17, position: 'relative'}}>
                  <TextInput
                    value={weight}
                    onChangeText={text => {
                      const numericValue = text.replace(/[^0-9.]/g, ''); // Remove non-numeric and non-dot characters
                      const dotCount = (numericValue.match(/\./g) || []).length; // Count the number of dots (decimal points)

                      if (dotCount <= 1) {
                        setWeight(numericValue);
                      }
                    }}
                    keyboardType="numeric" // Only allow numeric input
                    style={style.bottomSheetHeightTextInput}
                    placeholder="Enter Weight"
                    placeholderTextColor="#8B8B8B"
                  />

                  {/* 'Kg' text inside the TextInput */}
                  <Text style={style.BottomSheetTextInputText}>Kg</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    weightBottomSheetRef.current.close();
                  }}>
                  <LinearGradient
                    colors={['#2D46B9', '#8D1D8D']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={style.bottomSheetAddButtonContainer}>
                    <Text style={style.bottomSheetAddButtonText}>Add</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </RBSheet>

              {/*MARITAL STATUS BOTTOM SHEET*/}
              <RBSheet
                ref={maritalStatusBottomSheetRef}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={hp(220)}
                customStyles={{
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                }}>
                <Text style={style.bottomSheetTittleText}>
                  Select marital-Status
                </Text>

                <View style={style.bottomSheetUnderLine} />

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectMaritalStatus('single')}>
                  <Text style={style.bottomSheetOptionText}>Single</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectMaritalStatus('never-married')}>
                  <Text style={style.bottomSheetOptionText}>Never-Married</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectMaritalStatus('married')}>
                  <Text style={style.bottomSheetOptionText}>Married</Text>
                </TouchableOpacity>
              </RBSheet>

              <TouchableOpacity activeOpacity={0.7} onPress={handleSave}>
                <LinearGradient
                  colors={['#0F52BA', '#8225AF']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0.5}}
                  style={style.saveButtonContainer}>
                  {isUpdatingProfile ? (
                    <ActivityIndicator size="large" color={colors.white} />
                  ) : (
                    <Text style={style.bottomSheetAddButtonText}>
                      Save Changes
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdminGeneralInformationScreen;
