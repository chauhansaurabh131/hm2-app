import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {icons, images} from '../../assets';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {useSelector} from 'react-redux';
import {colors} from '../../utils/colors';
import {style} from './style';
import AgeRangeSlider from '../../components/ageRangeSlider';
import HeightRangeSlider from '../../components/heightRangeSlider';
import DropDownMutipleValueComponent from '../../components/DropDownMutipleValueComponent';
import LinearGradient from 'react-native-linear-gradient';
import GradientButton from '../../components/GradientButton';
import axios from 'axios';
import RBSheet from 'react-native-raw-bottom-sheet';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import DropdownComponentBottomSheet from '../../components/newDropDownMutipleValueBottomSheet';
import Toast from 'react-native-toast-message';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import Abc from '../abc';

const SearchFilterScreen = () => {
  const [ageSelectedRange, setAgeSelectedRange] = useState([22, 27]);
  const [heightSelectedRange, setHeightSelectedRange] = useState([4, 5.5]);
  const [maritalStatus, setMaritalStatus] = useState([]);
  const [religionStatus, setReligionStatus] = useState([]);
  const [motherTongueStatus, setMotherTongueStatus] = useState([]);
  const [countryLivingStatus, setCountryLivingStatus] = useState([]);
  const [cityLivingStatus, setCityLivingStatus] = useState([]);
  const [selectedToggle, setSelectedToggle] = useState('Yes');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [savedSearches, setSavedSearches] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [profileID, setProfileID] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // console.log(' === heightSelectedRange ===> ', heightSelectedRange);

  const bottomSheetRef = useRef();
  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const topModalBottomSheetRef = useRef(null);

  const openTopBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const ShowToast = () => {
    Toast.show({
      type: 'profileNotFound',
      text1: 'Profile Not Found',
      visibilityTime: 1000,
    });
  };

  const DeleteSearchData = () => {
    Toast.show({
      type: 'deleteSearchData',
      text1: 'Search deleted successfully.',
      visibilityTime: 1500,
    });
  };

  const toastConfig = {
    profileNotFound: ({text1}) => (
      <View
        style={{
          backgroundColor: '#333333', // Toast background color
          // padding: 10,
          borderRadius: 100,
          marginHorizontal: 20,
          marginTop: -25,
          width: wp(300),
          height: hp(55),
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white', // Toast text color
            fontSize: fontSize(16),
            textAlign: 'center',
            lineHeight: hp(24),
            fontFamily: fontFamily.poppins400,
          }}>
          {text1}
        </Text>
      </View>
    ),
    deleteSearchData: ({text1}) => (
      <View
        style={{
          backgroundColor: '#333333', // Toast background color
          // padding: 10,
          borderRadius: 100,
          marginHorizontal: 20,
          marginTop: -25,
          width: wp(300),
          height: hp(55),
          justifyContent: 'center',
        }}>
        <Text
          style={{
            color: 'white', // Toast text color
            fontSize: fontSize(16),
            textAlign: 'center',
            lineHeight: hp(24),
            fontFamily: fontFamily.poppins400,
          }}>
          {text1}
        </Text>
      </View>
    ),
  };

  // Fetch saved searches from the API
  const fetchSavedSearches = async () => {
    try {
      setLoading(true);
      console.log('Calling API to fetch saved searches...');
      const response = await axios.get(
        `https://stag.mntech.website/api/v1/user/search-history//get-by-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('API Response:', response.data);

      const apiData = response.data?.data; // Access the nested data object
      setSavedSearches(apiData?.results || []); // Set results array
      setTotalResults(apiData?.totalResults || 0); // Set totalResults
      setLoading(false);
    } catch (error) {
      console.error(
        'Error fetching saved searches:',
        error.response?.data || error.message,
      );
      setLoading(false);
    }
  };

  // Use useEffect to call the API when the screen loads
  // useEffect(() => {
  //   fetchSavedSearches();
  // }, []); // Empty dependency array ensures this runs only once when the component mounts
  useFocusEffect(
    useCallback(() => {
      console.log('Screen is focused, calling fetchSavedSearches...');
      fetchSavedSearches();

      // Optional cleanup function
      return () => {
        console.log('Screen is unfocused');
      };
    }, []),
  );

  const openBottomSheet = () => {
    bottomSheetRef.current.open();
  };

  const closeBottomSheet = () => {
    bottomSheetRef.current.close();
  };

  // const handleSavedSearchClick = item => {
  //   console.log('Selected Data:', item); // Log selected data
  //
  //   setMaritalStatus(item.maritalStatus);
  //
  //   closeBottomSheet(); // Close the bottom sheet
  // };

  const handleSavedSearchClick = item => {
    console.log('Selected Data:', item); // Log selected data

    // Map `value` to corresponding `label` for maritalStatus
    const mappedMaritalStatus = item.maritalStatus.map(value => {
      const found = dropdownData.find(
        option => option.label.toLowerCase() === value.toLowerCase(),
      );
      return found ? found.value : value; // Map to value or keep original
    });

    // Map `value` to corresponding `label` for religion
    const mappedReligionStatus = item.religion.map(value => {
      const found = religionData.find(
        option => option.label.toLowerCase() === value.toLowerCase(),
      );
      return found ? found.value : value; // Map to value or keep original
    });

    // Map `value` to corresponding `label` for motherTongue
    const mappedMotherTongueStatus = item.motherTongue.map(value => {
      const found = motherTongueData.find(
        option => option.label.toLowerCase() === value.toLowerCase(),
      );
      return found ? found.value : value; // Map to value or keep original
    });

    // Map `value` to corresponding `label` for countryLiving
    const mappedCountryLivingStatus = item.currentCountry.map(value => {
      const found = COUNTRY_LIST.find(
        option => option.label.toLowerCase() === value.toLowerCase(),
      );
      return found ? found.value : value; // Map to value or keep original
    });

    // Map `value` to corresponding `label` for cityLiving
    const mappedCityLivingStatus = item.currentCity.map(value => {
      const found = CurrentCity.find(
        option => option.label.toLowerCase() === value.toLowerCase(),
      );
      return found ? found.value : value; // Map to value or keep original
    });

    // Update states with mapped values
    setMaritalStatus(mappedMaritalStatus);
    setReligionStatus(mappedReligionStatus);
    setMotherTongueStatus(mappedMotherTongueStatus);
    setCountryLivingStatus(mappedCountryLivingStatus);
    setCityLivingStatus(mappedCityLivingStatus);

    // Update ranges
    setAgeSelectedRange([item.minAge.min, item.minAge.max]);
    setHeightSelectedRange([item.height.min, item.height.max]);

    closeBottomSheet(); // Close the bottom sheet
  };

  const handleSavedSearchDeleteClick = async item => {
    try {
      console.log('Deleting saved search:', item?._id);
      const response = await axios.delete(
        `https://stag.mntech.website/api/v1/user/search-history/${item?._id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log('Delete Response:', response.data);

      // Show an alert
      // Alert.alert('Success', 'Search deleted successfully.');
      DeleteSearchData();

      // Refresh the saved searches
      fetchSavedSearches();
      closeBottomSheet();
    } catch (error) {
      console.error(
        'Error deleting saved search:',
        error.response?.data || error.message,
      );
      Alert.alert('Error', 'Failed to delete search. Please try again.');
    }
  };

  const renderItem = ({item}) => {
    return (
      <View style={style.itemContainer}>
        <TouchableOpacity onPress={() => handleSavedSearchClick(item)}>
          <Text style={style.bottomSheetItem}>{item.saveSearch}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSavedSearchDeleteClick(item)}>
          <Image source={icons.delete_icon} style={style.deleteIcon} />
        </TouchableOpacity>
      </View>
    );
  };

  const saveSearch = async () => {
    if (!searchName.trim()) {
      console.log('Search name cannot be empty!');
      return;
    }

    const maritalStatusValues = maritalStatus.map(value => {
      const item = dropdownData.find(item => item.value === value);
      return item?.label.toLowerCase().replace(' ', '-');
    });

    const religionStatusValues = religionStatus.map(value => {
      const item = religionData.find(item => item.value === value);
      return item?.label.toLowerCase();
    });

    const motherTongueValues = motherTongueStatus.map(value => {
      const item = motherTongueData.find(item => item.value === value);
      return item?.label.toLowerCase();
    });

    const countryLivingValues = countryLivingStatus.map(value => {
      const item = COUNTRY_LIST.find(item => item.value === value);
      return item?.label.toLowerCase();
    });

    const cityLivingValues = cityLivingStatus.map(value => {
      const item = CurrentCity.find(item => item.value === value);
      return item?.label;
    });

    const requestData = {
      minAge: {
        min: ageSelectedRange[0],
        max: ageSelectedRange[1],
      },
      height: {
        min: heightSelectedRange[0],
        max: heightSelectedRange[1],
      },
      maritalStatus: maritalStatusValues,
      religion: religionStatusValues,
      motherTongue: motherTongueValues,
      currentCountry: countryLivingValues,
      currentCity: cityLivingValues,
      saveSearch: searchName,
    };

    try {
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/search-history/',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log('API Response:', response.data);

      // Reset all fields after a successful API call
      setAgeSelectedRange([18, 25]); // Reset age range
      setHeightSelectedRange([4, 8]); // Reset height range
      setMaritalStatus([]); // Reset marital status
      setReligionStatus([]); // Reset religion status
      setMotherTongueStatus([]); // Reset mother tongue
      setCountryLivingStatus([]); // Reset country living
      setCityLivingStatus([]); // Reset city living
      setSelectedToggle('Yes'); // Reset toggle
      setSearchName(''); // Reset search name

      // setModalVisible(false); // Close modal on success
      handleModalClose();
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
    }
  };

  // Function to handle modal close
  const handleModalClose = async () => {
    setModalVisible(false); // Close the modal
    console.log(
      'Modal has been closed, now checking Profile ID or calling the API',
    ); // Log message

    setIsLoading(true);

    // Check if profileID has a value
    if (profileID.trim()) {
      console.log('Searching for Profile ID:', profileID); // Log Profile ID

      try {
        // Call the API with profileID
        const response = await axios.get(
          `https://stag.mntech.website/api/v1/user/user/userUniqueId/${profileID.trim()}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // Replace with your valid token
            },
          },
        );

        console.log('Profile ID API Response:', response.data); // Log the API response
        // navigation.navigate('SearchUserDataScreen', {data: response.data}); // Navigate to the results screen
        navigation.navigate('SearchUserDataScreen', {
          data: response?.data?.data[0]?._id,
        }); // Navigate to the results screen
        // navigation.navigate('Abc', {data: response?.data?.data[0]?._id}); // Navigate to the results screen
        resetAllFields();
        setIsLoading(false);
      } catch (error) {
        console.error(
          'Profile ID API Error:',
          error.response?.data || error.message,
        );
        setIsLoading(false);
        ShowToast();
        // Alert.alert('Error', 'Failed to fetch user data by Profile ID'); // Show an alert in case of an error
      }
      // finally {
      //   setIsLoading(false);
      // }
      return; // Exit the function after handling profileID
    }

    // If profileID is empty, proceed with the API call
    const requestData = {
      minAge: ageSelectedRange[0],
      maxAge: ageSelectedRange[1],
      minHeight: heightSelectedRange[0],
      maxHeight: heightSelectedRange[1],
      maritalStatus: maritalStatus.map(value => {
        const item = dropdownData.find(option => option.value === value);
        return item?.label.toLowerCase().replace(' ', '-'); // Convert to lowercase and replace spaces with dashes
      }),
      religion: religionStatus.map(value => {
        const item = religionData.find(option => option.value === value);
        return item?.label.toLowerCase(); // Convert to lowercase
      }),
      motherTongue: motherTongueStatus.map(value => {
        const item = motherTongueData.find(option => option.value === value);
        return item?.label.toLowerCase(); // Convert to lowercase
      }),
      currentCountry: countryLivingStatus.map(value => {
        const item = COUNTRY_LIST.find(option => option.value === value);
        return item?.label.toLowerCase(); // Convert to lowercase
      }),
      currentCity: cityLivingStatus.map(value => {
        const item = CurrentCity.find(option => option.value === value);
        return item?.label.toLowerCase(); // Convert to lowercase
      }),
    };

    // console.log(' ===  ageSelectedRange[0] ===> ', ageSelectedRange[0]);
    // console.log(' ===  ageSelectedRange[1] ===> ', ageSelectedRange[1]);
    // console.log(' ===  heightSelectedRange[0] ===> ', heightSelectedRange[0]);
    // console.log(' ===  heightSelectedRange[1] ===> ', heightSelectedRange[1]);
    // console.log(' ===  maritalStatus ===> ', maritalStatus);
    // console.log(' ===  religionStatus ===> ', religionStatus);
    // console.log(' ===  motherTongueStatus ===> ', motherTongueStatus);
    // console.log(' ===  countryLivingStatus ===> ', countryLivingStatus);
    // console.log(' ===  cityLivingStatus ===> ', cityLivingStatus);

    console.log(' === requestData ===> ', requestData); // Log the request data

    try {
      const response = await axios.post(
        'https://stag.mntech.website/api/v1/user/search/search-user',
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Replace with your valid token
          },
        },
      );

      console.log('API Response:', response.data); // Log the API response
      // navigation.navigate('SearchUserDataScreen', {data: response.data}); // Navigate to the results screen
      navigation.navigate('SearchUserDataScreen', {data: requestData}); // Navigate to the results screen
      // navigation.navigate('Abc', {data: requestData}); // Navigate to the results screen

      // Reset all data after navigation
      resetAllFields();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('API Error:', error.response?.data || error.message);
      // Alert.alert('Error', 'Failed to call API'); // Show an alert in case of an error
      ShowToast();
    }
    // finally {
    //   setIsLoading(false);
    // }
  };

  // Helper function to reset all fields
  const resetAllFields = () => {
    setAgeSelectedRange([22, 27]); // Reset age range
    setHeightSelectedRange([4, 5.5]); // Reset height range
    setMaritalStatus([]); // Reset marital status
    setReligionStatus([]); // Reset religion status
    setMotherTongueStatus([]); // Reset mother tongue
    setCountryLivingStatus([]); // Reset country living
    setCityLivingStatus([]); // Reset city living
    setSelectedToggle('Yes'); // Reset toggle
    setSearchName(''); // Reset search name
    setProfileID('');
  };

  const onSearchPress = async () => {
    if (profileID.trim()) {
      handleModalClose();
    } else {
      setModalVisible(true);
    }
  };

  const dropdownData = [
    {label: 'Single', value: '1'},
    {label: 'Never-Married', value: '2'},
    {label: 'Married', value: '3'},
  ];

  const religionData = [
    {label: 'Hindu', value: '1'},
    {label: 'Muslim', value: '2'},
    {label: 'Sikh', value: '3'},
  ];

  const motherTongueData = [
    {label: 'Gujarati', value: '1'},
    {label: 'Hindi', value: '2'},
    {label: 'English', value: '3'},
  ];

  const COUNTRY_LIST = [
    {label: 'india', value: '1'},
    {label: 'canada', value: '2'},
    {label: 'us', value: '3'},
    {label: 'afghanistan', value: '4'},
    {label: 'china', value: '5'},
    {label: 'myanmar', value: '6'},
    {label: 'nepal', value: '7'},
    {label: 'sri-lanka', value: '8'},
    {label: 'pakistan', value: '9'},
  ];

  const CurrentCity = [
    {label: 'Bardoli', value: '1'},
    {label: 'Navsari', value: '2'},
    {label: 'Mandvi', value: '3'},
    {label: 'Valod', value: '4'},
    {label: 'Surat', value: '5'},
  ];

  const handleRangeSubmit = range => {
    setAgeSelectedRange(range); // Update the range in state
    // console.log(' === range ===> ', range);
  };

  const handleHeightRangeSubmit = range => {
    setHeightSelectedRange(range);
  };

  return (
    <SafeAreaView style={style.container}>
      <Image
        source={images.gradient_header_background_img}
        style={style.headerBackGroundImage}
      />

      <View style={style.headerBodyContainer}>
        <View style={style.headerLogoContainer}>
          <Image source={icons.headerIconWhite} style={style.appLogo} />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openTopBottomSheet}
            style={style.headerTopSheetImageContainer}>
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.profileLogo}
            />
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View style={style.headerSearchContainer}>
          <TextInput
            style={style.searchTextInput}
            placeholderTextColor={colors.white}
            placeholder={'Profile ID Search'}
            value={profileID} // Bind the state
            onChangeText={setProfileID} // Update the state on change
          />
          <Image source={icons.search_icon} style={style.searchIcon} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.advanceContainer}>
          <View style={style.advanceBodyContainer}>
            <Text style={style.advanceText}>Advance Search</Text>

            {totalResults > 0 && (
              <TouchableOpacity
                style={style.savedContainer}
                onPress={openBottomSheet}>
                <Text style={style.savedText}>{totalResults} Saved</Text>

                <Image
                  source={icons.rightSideIcon}
                  style={style.rightSideIcon}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={{width: '100%', height: 1, backgroundColor: '#E2E2E2'}} />

        <View
          style={{
            alignItems: 'center',
            marginTop: hp(25),
          }}>
          <AgeRangeSlider
            initialRange={ageSelectedRange} // Pass selected range from parent
            onSubmitRange={handleRangeSubmit} // Update parent when range changes
            tittleLabelText={'Age'}
            min={18}
            max={50}
          />
        </View>

        <View
          style={{
            alignItems: 'center',
            marginTop: hp(25),
          }}>
          <HeightRangeSlider
            initialRange={heightSelectedRange} // Pass the selected range from parent
            onSubmitRange={handleHeightRangeSubmit} // Update parent when range changes
            tittleLabelText={'Height (ft/cm)'}
          />
        </View>

        <View style={{marginHorizontal: 17, marginTop: hp(25)}}>
          <DropdownComponentBottomSheet
            data={dropdownData}
            height={50}
            searchPlaceholder={'Search Option'}
            placeholder={'Marital Status'}
            selectedItems={maritalStatus}
            setSelectedItems={setMaritalStatus}
            bottomSheetHeight={hp(200)}
            // placeholderStyle={{
            //   fontFamily: fontFamily.poppins500,
            //   fontSize: fontSize(16),
            //   lineHeight: hp(27),
            //   colors: 'black',
            // }}
          />

          <View style={{marginTop: hp(30)}}>
            <DropdownComponentBottomSheet
              data={religionData}
              height={50}
              searchPlaceholder={'Search Option'}
              placeholder={'Religion'}
              selectedItems={religionStatus}
              setSelectedItems={setReligionStatus}
              bottomSheetHeight={hp(200)}
            />
          </View>

          <View style={{marginTop: 30}}>
            <DropdownComponentBottomSheet
              data={motherTongueData}
              height={50}
              searchPlaceholder={'Search Option'}
              placeholder={'Mother Tongue'}
              selectedItems={motherTongueStatus}
              setSelectedItems={setMotherTongueStatus}
              bottomSheetHeight={hp(200)}
            />
          </View>

          <View style={{marginTop: 30}}>
            <DropdownComponentBottomSheet
              data={COUNTRY_LIST}
              height={50}
              searchPlaceholder={'Search Option'}
              placeholder={'Country Living'}
              selectedItems={countryLivingStatus}
              setSelectedItems={setCountryLivingStatus}
              bottomSheetHeight={hp(430)}
            />
          </View>

          <View style={{marginTop: 30}}>
            <DropdownComponentBottomSheet
              data={CurrentCity}
              height={50}
              searchPlaceholder={'Search Option'}
              placeholder={'City Living'}
              selectedItems={cityLivingStatus}
              setSelectedItems={setCityLivingStatus}
              bottomSheetHeight={hp(280)}
            />
          </View>

          <View style={style.ToggleContainer}>
            <View style={style.rowContainer}>
              {/* Label */}
              <Text style={style.label}>Profile with Photo</Text>

              {/* Toggle */}
              <View style={style.toggleContainer}>
                {/* Yes Button */}
                <TouchableOpacity
                  style={[
                    style.button,
                    selectedToggle === 'Yes'
                      ? style.activeButton
                      : style.inactiveButton,
                  ]}
                  onPress={() => setSelectedToggle('Yes')}>
                  {selectedToggle === 'Yes' ? (
                    <LinearGradient
                      colors={['#0D4EB3', '#9413D0']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={style.gradient}>
                      <Text style={style.activeText}>Yes</Text>
                    </LinearGradient>
                  ) : (
                    <Text style={style.inactiveText}>Yes</Text>
                  )}
                </TouchableOpacity>

                {/* No Button */}
                <TouchableOpacity
                  style={[
                    style.button,
                    selectedToggle === 'No'
                      ? style.activeButton
                      : style.inactiveButton,
                  ]}
                  onPress={() => setSelectedToggle('No')}>
                  {selectedToggle === 'No' ? (
                    <LinearGradient
                      colors={['#0D4EB3', '#9413D0']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={style.gradient}>
                      <Text style={style.activeText}>No</Text>
                    </LinearGradient>
                  ) : (
                    <Text style={style.inactiveText}>No</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <GradientButton
            buttonName={'Search'}
            onPress={onSearchPress}
            isLoading={isLoading}
            containerStyle={{
              width: '100%',
              borderRadius: 25,
              height: 50,
              marginTop: hp(30),
            }}
          />
        </View>

        <View style={{height: 50}} />
      </ScrollView>

      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="none"
        // onRequestClose={() => setModalVisible(false)}
        onRequestClose={handleModalClose}>
        <View style={style.modalOverlay}>
          <View style={style.modalContainer}>
            {/* Title */}
            <Text style={style.title}>Save Search</Text>
            {/* Subtitle */}
            <Text style={style.subtitle}>
              This search will be saved for future use.
            </Text>
            {/* Input */}
            <View style={style.textInputContainer}>
              <TextInput
                style={style.textInput}
                placeholder="Enter Search Name"
                placeholderTextColor="black"
                value={searchName}
                onChangeText={setSearchName}
              />
            </View>
            {/* Buttons */}
            <View style={style.buttonRow}>
              {/* Not Now Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                // onPress={() => setModalVisible(false)}
                onPress={handleModalClose}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  style={{
                    width: wp(136),
                    height: hp(50),
                    borderRadius: 50,
                    borderWidth: 1,
                    justifyContent: 'center',
                    borderColor: 'transparent',
                  }}>
                  <View
                    style={{
                      borderRadius: 50,
                      flex: 1,
                      backgroundColor: colors.white,
                      justifyContent: 'center',
                      margin: isIOS ? 0 : 1,
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        backgroundColor: 'transparent',
                        color: colors.black,
                        margin: 10,
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Not Now
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Continue Button */}
              <TouchableOpacity
                disabled={!searchName.trim()} // Disable if input is empty or whitespace
                // onPress={() => {
                //   console.log('Search Name:', searchName);
                //   setModalVisible(false);
                // }}
                onPress={saveSearch}>
                <LinearGradient
                  colors={
                    searchName.trim()
                      ? ['#0D4EB3', '#9413D0']
                      : ['#D3D3D3', '#D3D3D3']
                  } // Change color if disabled
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={[
                    style.gradientButton,
                    !searchName.trim() && style.disabledButton, // Add disabled style
                  ]}>
                  <Text
                    style={[
                      style.gradientButtonText,
                      !searchName.trim() && style.disabledButtonText, // Add disabled text style
                    ]}>
                    Continue
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Bottom Sheet */}
      <RBSheet
        ref={bottomSheetRef}
        height={300}
        openDuration={250}
        customStyles={{
          container: style.bottomSheetContainer,
        }}>
        <View style={style.bottomSheetContent}>
          <Text style={style.bottomSheetTitle}>Saved Search</Text>
          <View style={style.bottomSheetLine} />
          {loading ? (
            <Text
              style={{
                color: 'black',
                marginHorizontal: 17,
                marginTop: hp(24),
                textAlign: 'center',
                fontSize: fontSize(16),
              }}>
              Loading...
            </Text>
          ) : (
            <ScrollView
              style={{flex: 1}}
              contentContainerStyle={{paddingBottom: 20}}>
              <View style={{marginHorizontal: 30, marginTop: hp(24)}}>
                <FlatList
                  data={savedSearches}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => index.toString()}
                  ListEmptyComponent={
                    <Text style={{color: 'black'}}>
                      No saved searches found.
                    </Text>
                  }
                />
              </View>
            </ScrollView>
          )}
        </View>
      </RBSheet>

      <Toast config={toastConfig} />
    </SafeAreaView>
  );
};

export default SearchFilterScreen;
