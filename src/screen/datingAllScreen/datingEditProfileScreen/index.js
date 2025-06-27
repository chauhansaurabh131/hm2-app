import React, {useState, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import RNBlobUtil from 'react-native-blob-util';
import {addProfilePicture, updateDetails} from '../../../actions/homeActions';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {ScrollView} from 'react-native-virtualized-view';
import {style} from './style';
import AppColorLogo from '../../../components/appColorLogo';
import {icons, images} from '../../../assets';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';

import ImageCropPicker from 'react-native-image-crop-picker';
import DateEditImageProfile from '../../../components/dateEditImageProfile';
import RBSheet from 'react-native-raw-bottom-sheet';
import DatePicker from 'react-native-date-picker';
import {colors} from '../../../utils/colors';
import LinearGradient from 'react-native-linear-gradient';
import ProfileAvatar from '../../../components/letterProfileComponent';
import NewProfileBottomSheet from '../../../components/newProfileBottomSheet';
import axios from 'axios';

const DatingEditProfileScreen = () => {
  const {user, isUpdatingProfile} = useSelector(state => state.auth);

  // console.log(' === var ===> ', user?.user?.id);

  console.log(' === isUpdatingProfile ===> ', isUpdatingProfile);
  // console.log(' === DatingEditProfileScreen ===> ', user?.user);

  const [aboutText, setAboutText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [selectedPurposes, setSelectedPurposes] = useState([]);
  const [open, setOpen] = useState(false); // State to manage the DatePicker modal
  const [selectedDate, setSelectedDate] = useState(
    user?.user?.dateOfBirth ? new Date(user.user.dateOfBirth) : new Date(),
  ); // State for the displayed date
  const [tempDate, setTempDate] = useState(selectedDate); // Temporary state for the DatePicker

  // State to store the selected country
  const [selectedCountry, setSelectedCountry] = useState(
    user?.user?.datingData[0]?.CurrentlyLiving || 'Not available',
  );
  const [selectedReligion, setSelectedReligion] = useState(
    user?.user?.religion || 'Not available',
  );
  const [selectedEthnicity, setSelectedEthnicity] = useState(
    user?.user?.datingData[0]?.Ethnicity || 'Not available',
  );
  const [selectedEducation, setSelectedEducation] = useState(
    user?.user?.datingData[0]?.educationLevel || 'Not available',
  );
  const [selectedOccupation, setSelectedOccupation] = useState(
    user?.user?.datingData[0]?.Occupation || 'Not available',
  );
  const [selectedAnnual, setSelectedAnnual] = useState(
    user?.user?.datingData[0]?.annualIncome || 'Not available',
  );
  const [selectedMotherTongue, setSelectedMotherTongue] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  const dispatch = useDispatch();
  const apiDispatch = useDispatch();
  const navigation = useNavigation();
  const bottomSheetRef = useRef();
  const currentlybottomSheetRef = useRef();
  const religionBottomSheetRef = useRef();
  const ethnicityBottomSheetRef = useRef();
  const educationBottomSheetRef = useRef();
  const OccupationBottomSheetRef = useRef();
  const AnnualBottomSheetRef = useRef();
  const motherTongueBottomSheetRef = useRef();
  const hobbiesBottomSheetRef = useRef();

  const screenWidth = Dimensions.get('window').width;
  const imageWidth = screenWidth / 3 - 10; // Divide screen width by 3 and add margin

  const topModalBottomSheetRef = useRef(null);

  const openTopBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  // Function to format the date
  const formatDate = date => {
    const day = date.getDate();
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const month = monthNames[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  // List of all country names
  const countries = [
    'India',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'China',
    'Japan',
    'Brazil',
    'Russia',
    'South Africa',
    'Mexico',
  ];

  // List of all Religion names
  const religion = [
    'Hindu',
    'Christianity',
    'Sikhism',
    'Buddhism',
    'Jainism',
    'Muslim',
  ];

  // List of all Ethnicity names
  const ethnicity = [
    'Indo-Aryan',
    'Dravidian',
    'Tibeto-Burman',
    'Mongoloid',
    'Adivasi',
  ];

  // List of all Education names
  const educationList = [
    'Software Engineer',
    'Civil Engineer',
    'Mechanical Engineer',
    'Electrical Engineer',
    'Dentist',
    'Lawyer',
    'Advocate',
    'Pharmacist',
    'Professor',
    'Graphic Designer',
  ];

  // List of all Occupation names
  const OccupationList = ['Job', 'Business', 'Job & Business'];

  // List of all AnnualList names
  const AnnualList = [
    'Above 1 Lacs',
    'Above 3 Lacs',
    'Above 5 Lacs',
    'Above 7 Lacs',
    'Above 9 Lacs',
  ];

  useEffect(() => {
    if (user?.user?.hobbies) {
      const hobbies =
        typeof user?.user?.hobbies === 'string'
          ? user?.user?.hobbies.split(',').map(item => item.trim()) // Split string into array and trim spaces
          : user?.user?.hobbies; // Ensure it's an array

      setSelectedHobbies(hobbies);
    }
  }, [user?.user?.hobbies]);

  const handleHobbiesSelectPurpose = purpose => {
    if (selectedHobbies.includes(purpose)) {
      setSelectedHobbies(selectedHobbies.filter(item => item !== purpose));
    } else {
      setSelectedHobbies([...selectedHobbies, purpose]);
    }
  };

  // Function to remove a selected purpose
  const handleHobbiesRemovePurpose = purpose => {
    setSelectedHobbies(selectedHobbies.filter(item => item !== purpose));
  };

  // Ensure that motherTongue is handled as an array
  useEffect(() => {
    if (user?.user?.motherTongue) {
      const motherTongues =
        typeof user?.user?.motherTongue === 'string'
          ? user?.user?.motherTongue.split(', ') // Split string into array
          : [user?.user?.motherTongue]; // Ensure it's an array

      setSelectedMotherTongue(motherTongues);
    }
  }, [user?.user?.motherTongue]);

  const handleMotherTongueSelectPurpose = purpose => {
    if (selectedMotherTongue.includes(purpose)) {
      setSelectedMotherTongue(
        selectedMotherTongue.filter(item => item !== purpose),
      );
    } else {
      setSelectedMotherTongue([...selectedMotherTongue, purpose]);
    }
  };

  // Function to remove a selected purpose
  const handleMotherTongueRemovePurpose = purpose => {
    setSelectedMotherTongue(
      selectedMotherTongue.filter(item => item !== purpose),
    );
  };

  // Function to open the bottom sheet
  const openAnnualBottomSheet = () => {
    AnnualBottomSheetRef.current.open();
  };

  // Function to select a Annual and update the state
  const handleAnnualLevel = educationData => {
    setSelectedAnnual(educationData); // Update the selected country
    AnnualBottomSheetRef.current.close(); // Close the bottom sheet
  };

  // Function to open the bottom sheet
  const openOccupationBottomSheet = () => {
    OccupationBottomSheetRef.current.open();
  };

  // Function to select a Occupation and update the state
  const handleOccupationLevel = OccupationData => {
    setSelectedOccupation(OccupationData); // Update the selected country
    OccupationBottomSheetRef.current.close(); // Close the bottom sheet
  };

  // Function to open the bottom sheet
  const openEducationBottomSheet = () => {
    educationBottomSheetRef.current.open();
  };

  // Function to select a Education and update the state
  const handleEducationLevel = educationData => {
    setSelectedEducation(educationData); // Update the selected country
    educationBottomSheetRef.current.close(); // Close the bottom sheet
  };

  // Function to open the bottom sheet
  const openEthnicityBottomSheet = () => {
    ethnicityBottomSheetRef.current.open();
  };

  // Function to select a Ethnicity and update the state
  const handleEthnicityReligion = ethnicityData => {
    setSelectedEthnicity(ethnicityData); // Update the selected country
    ethnicityBottomSheetRef.current.close(); // Close the bottom sheet
  };

  // Function to open the bottom sheet
  const openReligionBottomSheet = () => {
    religionBottomSheetRef.current.open();
  };

  // Function to select a religion and update the state
  const handleSelectReligion = religion => {
    setSelectedReligion(religion); // Update the selected country
    religionBottomSheetRef.current.close(); // Close the bottom sheet
  };

  // Function to open the bottom sheet
  const openBottomSheet = () => {
    currentlybottomSheetRef.current.open();
  };

  // Function to select a country and update the state
  const handleSelectCountry = country => {
    setSelectedCountry(country); // Update the selected country
    currentlybottomSheetRef.current.close(); // Close the bottom sheet
  };

  // Handle setting the date from DatePicker
  const handleSetDate = () => {
    setSelectedDate(tempDate); // Update the displayed date
    setOpen(false); // Close modal
  };

  const handleSelectPurpose = purpose => {
    if (selectedPurposes.includes(purpose)) {
      setSelectedPurposes(selectedPurposes.filter(item => item !== purpose));
    } else {
      setSelectedPurposes([...selectedPurposes, purpose]);
    }
  };

  // Function to handle removing a selected purpose
  const handleRemovePurpose = purpose => {
    setSelectedPurposes(selectedPurposes.filter(item => item !== purpose));
  };

  // State to hold selected images
  const [selectedImages, setSelectedImages] = useState(
    user?.user?.userProfilePic || [],
  );

  useEffect(() => {
    if (user?.user?.writeBoutYourSelf) {
      setAboutText(user.user.writeBoutYourSelf);
    }
  }, [user?.user?.writeBoutYourSelf]);

  useEffect(() => {
    if (user?.user?.datingData[0]?.interestedIn) {
      // console.log(' === var ===> ', user.user.datingData[0].interestedIn);
      const apiData = user.user.datingData[0].interestedIn;
      const mappedPurposes = apiData
        .map(item => {
          switch (item) {
            case 'looking-for-love':
              return 'Looking for Love';
            case 'movie-date':
              return 'Movie Date';
            case 'meet-new-friends':
              return 'Meet New Friends';
            case 'foodies':
              return 'Foodies';
            case 'travel-buddies':
              return 'Travel Buddies';
            case 'game-lover':
              return 'Game Lover';
            case 'chit-chat':
              return 'Chit-Chat';
            case 'adventurous':
              return 'Adventurous';
            default:
              return item;
          }
        })
        .filter(item => item !== null);
      setSelectedPurposes(mappedPurposes);
    }
  }, [user?.user?.datingData[0]?.interestedIn]);

  const handleImagePress = index => {
    setSelectedIndex(index === selectedIndex ? null : index); // Toggle selection
  };

  const userImage = user?.user?.profilePic;
  const dataWithAddBox = [...selectedImages, {addImageBox: true}];

  // Function to remove an image from the list
  // const removeImage = (indexToRemove, indexToRemoveItem) => {
  //   console.log(
  //     ' === indexToRemove___ ===> ',
  //     indexToRemove,
  //     indexToRemoveItem,
  //   );
  //   // setSelectedImages(
  //   //   selectedImages.filter((_, index) => index !== indexToRemove),
  //   // );
  // };

  // const removeImage = async (indexToRemove, imageItem) => {
  //   console.log(' === indexToRemove___ ===> ', indexToRemove, imageItem);
  //   console.log(' === user{{{ ===> ', user?.user?.profilePic);
  //   // console.log(' === imageItem+++ ===> ', imageItem?.url);
  //
  //   // If image has an _id (i.e. saved on the server), call delete API
  //   if ((imageItem?._id, imageItem?.name, imageItem?.url)) {
  //     try {
  //       const response = await axios.post(
  //         `https://stag.mntech.website/api/v1/user/user/delete-profile-image/${user?.user?.id}`,
  //         {
  //           profileImageUrl: imageItem?.url, // As per your curl example
  //           name: imageItem?.name,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${user?.tokens?.access?.token}`, // make sure accessToken is available in scope
  //             'Content-Type': 'application/json',
  //           },
  //         },
  //       );
  //       console.log('Image deleted successfully from server:', response.data);
  //       apiDispatch(updateDetails());
  //     } catch (error) {
  //       console.error('Error deleting image from server:', error);
  //       Alert.alert('Delete Failed', 'Could not delete image from server.');
  //       return; // Stop further action if API fails
  //     }
  //   }
  //
  //   // Now remove from local list
  //   setSelectedImages(prev =>
  //     prev.filter((_, index) => index !== indexToRemove),
  //   );
  // };

  const removeImage = async (indexToRemove, imageItem) => {
    console.log(' === indexToRemove___ ===> ', indexToRemove, imageItem);
    console.log(' === user{{{ ===> ', user?.user?.profilePic);

    const isProfileImage = imageItem?.url === user?.user?.profilePic;

    if (isProfileImage) {
      console.log(
        '🟡 Image is current profile picture. Clearing and deleting...',
      );

      // Step 1: Clear profilePic in Redux
      apiDispatch(updateDetails({profilePic: ''}));

      // Step 2: Wait a moment (simulate waiting for state update)
      setTimeout(async () => {
        try {
          const response = await axios.post(
            `https://stag.mntech.website/api/v1/user/user/delete-profile-image/${user?.user?.id}`,
            {
              profileImageUrl: imageItem?.url,
              name: imageItem?.name,
            },
            {
              headers: {
                Authorization: `Bearer ${user?.tokens?.access?.token}`,
                'Content-Type': 'application/json',
              },
            },
          );

          console.log('✅ Profile picture deleted from server:', response.data);
        } catch (error) {
          console.error('❌ Error deleting profile picture:', error);
          Alert.alert('Delete Failed', 'Could not delete image from server.');
        }
      }, 1000); // Wait 1 second
    } else if (imageItem?._id && imageItem?.name && imageItem?.url) {
      // For non-profile image deletion
      try {
        const response = await axios.post(
          `https://stag.mntech.website/api/v1/user/user/delete-profile-image/${user?.user?.id}`,
          {
            profileImageUrl: imageItem?.url,
            name: imageItem?.name,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.tokens?.access?.token}`,
              'Content-Type': 'application/json',
            },
          },
        );
        console.log('✅ Image deleted from server:', response.data);
        apiDispatch(updateDetails());
      } catch (error) {
        console.error('❌ Error deleting image from server:', error);
        Alert.alert('Delete Failed', 'Could not delete image from server.');
        return;
      }
    }

    // ✅ Always remove from UI
    setSelectedImages(prev =>
      prev.filter((_, index) => index !== indexToRemove),
    );
  };

  // Function to open the gallery and select multiple images
  const openGallery = () => {
    ImageCropPicker.openPicker({
      multiple: true, // Allow multiple image selection
      mediaType: 'photo', // Only allow photos
    })
      .then(images => {
        // Add selected images to the state
        const newImages = images.map(image => ({
          url: image.path, // Use the image path as the URL
        }));
        setSelectedImages([...selectedImages, ...newImages]);
      })
      .catch(error => {
        console.log('Error selecting images: ', error);
      });
  };

  const reversePurposeMap = {
    'Looking for Love': 'looking-for-love',
    'Movie Date': 'movie-date',
    'Meet New Friends': 'meet-new-friends',
    Foodies: 'foodies',
    'Travel Buddies': 'travel-buddies',
    'Game Lover': 'game-lover',
    'Chit-Chat': 'chit-chat',
    Adventurous: 'adventurous',
  };

  const convertToApiFormat = (displayPurposes = []) => {
    return displayPurposes.map(item => reversePurposeMap[item]).filter(Boolean); // Remove undefined values
  };

  const handleAddPress = () => {
    console.log(' === selectedDate ===> ', selectedDate);

    const motherTongueString = selectedMotherTongue.join(', ');

    const currentDatingData = user?.user?.datingData[0];

    console.log(' === selectedPurposes ===> ', selectedPurposes);

    const interestedSelectedPurposes = convertToApiFormat(selectedPurposes);
    console.log(' === interestedInApiFormat ===> ', interestedSelectedPurposes);

    const updatedDatingData = {
      ...currentDatingData,
      interestedIn: interestedSelectedPurposes,
      CurrentlyLiving: selectedCountry,
      Ethnicity: selectedEthnicity,
      educationLevel: selectedEducation,
      Occupation: selectedOccupation,
      annualIncome: selectedAnnual,
    };

    // Check if an image is selected
    if (selectedIndex !== null) {
      const selectedImagePath = selectedImages[selectedIndex]?.url;
      const fileName = selectedImagePath.split('/').pop();
      const fileExtension = fileName.split('.').pop().toLowerCase();
      const contentType = getContentType(fileExtension);

      // Check if the selected image is already on the server (S3 URL)
      if (selectedImagePath.startsWith('https://happymilan-user-images.s3')) {
        console.log('S3 bucket URL detected. No need to upload the image.');

        // Call writeBoutYourSelf API
        apiDispatch(
          updateDetails(
            {
              profilePic: selectedImagePath, // Use the S3 bucket path directly
              writeBoutYourSelf: aboutText,
            },
            () => {
              // Then call the interestedIn API after writeBoutYourSelf
              apiDispatch(
                updateDetails(
                  {datingData: [updatedDatingData]},
                  () => {
                    apiDispatch(
                      updateDetails(
                        {
                          dateOfBirth: selectedDate,
                        },

                        () => {
                          apiDispatch(
                            updateDetails({religion: selectedReligion}, () => {
                              apiDispatch(
                                updateDetails(
                                  {
                                    motherTongue: motherTongueString, // Send the string instead of array
                                  },
                                  () => {
                                    apiDispatch(
                                      updateDetails(
                                        {
                                          hobbies: selectedHobbies, // Send the string instead of array
                                        },
                                        () => {
                                          navigation.navigate('HomeTabs');
                                        },
                                      ),
                                    );
                                  },
                                ),
                              );
                            }),
                          );
                        },
                      ),
                    );
                  },
                  // navigation.navigate('HomeTabs'),
                ),
              );
            },
          ),
        );
      } else if (selectedImagePath.startsWith('file:///')) {
        // If the image is local, we need to upload it
        console.log('Local file path detected. Uploading image.');

        const callBack = async response => {
          try {
            const presignedUrl = response.data?.data?.url;

            console.log(' === presignedUrl ===> ', presignedUrl);

            const data = await RNBlobUtil.fetch(
              'PUT',
              presignedUrl,
              {
                'Content-Type': contentType,
                'x-amz-acl': 'public-read',
              },
              RNBlobUtil.wrap(selectedImagePath),
            );

            console.log('Image uploaded successfully:', data);

            // After image upload, call writeBoutYourSelf API
            apiDispatch(
              updateDetails(
                {
                  profilePic: presignedUrl.split('?')[0], // Use the uploaded image URL
                  writeBoutYourSelf: aboutText,
                },
                () => {
                  // Then call the interestedIn API after writeBoutYourSelf
                  apiDispatch(
                    updateDetails({datingData: [updatedDatingData]}, () =>
                      // navigation.navigate('HomeTabs'),
                      {
                        apiDispatch(
                          updateDetails(
                            {
                              dateOfBirth: selectedDate,
                            },
                            () => {
                              apiDispatch(
                                updateDetails(
                                  {religion: selectedReligion},
                                  () => {
                                    apiDispatch(
                                      updateDetails(
                                        {
                                          motherTongue: motherTongueString, // Send the string instead of array
                                        },
                                        () => {
                                          apiDispatch(
                                            updateDetails(
                                              {
                                                hobbies: selectedHobbies, // Send the string instead of array
                                              },
                                              () => {
                                                navigation.navigate('HomeTabs');
                                              },
                                            ),
                                          );
                                        },
                                      ),
                                    );
                                  },
                                ),
                              );
                            },
                          ),
                        );
                      },
                    ),
                  );
                },
              ),
            );
          } catch (err) {
            console.log(' === err ===> ', err);
          }
        };

        // Call the image upload API
        dispatch(
          addProfilePicture(
            {
              key: fileName,
              contentType: contentType,
              isProfilePic: true,
              profileType: 'profileImage',
            },
            callBack,
          ),
        );
      } else {
        console.log('Unknown image path format');
      }
    } else {
      console.log('No image selected. Calling writeBoutYourSelf API.');

      // If no image is selected, call the writeBoutYourSelf API directly
      apiDispatch(
        updateDetails(
          {
            writeBoutYourSelf: aboutText,
          },
          () => {
            // Then call the interestedIn API after writeBoutYourSelf
            apiDispatch(
              updateDetails({datingData: [updatedDatingData]}, () =>
                // navigation.navigate('HomeTabs'),
                {
                  apiDispatch(
                    updateDetails(
                      {
                        dateOfBirth: selectedDate,
                      },
                      () => {
                        apiDispatch(
                          updateDetails({religion: selectedReligion}, () => {
                            apiDispatch(
                              updateDetails(
                                {
                                  motherTongue: motherTongueString, // Send the string instead of array
                                },
                                () => {
                                  apiDispatch(
                                    updateDetails(
                                      {
                                        hobbies: selectedHobbies, // Send the string instead of array
                                      },
                                      () => {
                                        navigation.navigate('HomeTabs');
                                      },
                                    ),
                                  );
                                },
                              ),
                            );
                          }),
                        );
                      },
                    ),
                  );
                },
              ),
            );
          },
        ),
      );
    }
    // apiDispatch(updateDetails());
  };

  const getContentType = fileExtension => {
    switch (fileExtension) {
      case 'mp4':
        return 'video/mp4';
      case 'jpeg':
      case 'jpg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      default:
        return 'application/octet-stream';
    }
  };

  // const renderItem = ({item, index}) => {
  //   if (item.addImageBox) {
  //     // Render "Add Image" box
  //     return (
  //       <TouchableOpacity onPress={openGallery}>
  //         <View style={style.imageRenderImageAddContainer}>
  //           <Text style={style.imageRenderAddPlus}>+</Text>
  //         </View>
  //       </TouchableOpacity>
  //     );
  //   }
  //
  //   // Render profile picture with "X" button to remove the image
  //   return (
  //     <SafeAreaView style={style.renderCancelIconContainer}>
  //       <TouchableOpacity onPress={() => handleImagePress(index)}>
  //         <View style={style.renderImageContainer}>
  //           <Image
  //             source={{uri: item.url}}
  //             style={[
  //               style.renderImageStyle,
  //               selectedIndex === index
  //                 ? {borderColor: '#007bff', borderWidth: 3}
  //                 : null,
  //             ]}
  //             resizeMode="cover"
  //           />
  //
  //           {/* Checkmark overlay if image is selected */}
  //           {selectedIndex === index && (
  //             <View style={style.selectedImageWaterMarkContainer}>
  //               <Image
  //                 source={icons.check_gradient_icon}
  //                 style={style.selectedImageAddContainer}
  //               />
  //             </View>
  //           )}
  //
  //           {/* Remove Button (X) */}
  //           <TouchableOpacity
  //             onPress={() => removeImage(index, item)}
  //             style={style.imageRemoveButtonContainer}>
  //             <Image source={icons.delete_icon} style={style.removeIconStyle} />
  //           </TouchableOpacity>
  //         </View>
  //       </TouchableOpacity>
  //     </SafeAreaView>
  //   );
  // };

  const hasValidImage =
    user?.user?.profilePic &&
    user?.user?.profilePic !== 'null' &&
    user?.user?.profilePic.trim() !== '';

  return (
    <SafeAreaView style={style.container}>
      <View style={style.tittleContainer}>
        <AppColorLogo />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={openTopBottomSheet}
          style={{alignSelf: 'center'}}>
          {/*{userImage ? (*/}
          {/*  <Image source={{uri: userImage}} style={style.topProfileIcon} />*/}
          {/*) : (*/}
          {/*  <Image*/}
          {/*    source={images.empty_male_Image}*/}
          {/*    style={style.topProfileIcon}*/}
          {/*  />*/}
          {/*)}*/}

          {hasValidImage ? (
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.topProfileIcon}
            />
          ) : (
            <ProfileAvatar
              firstName={user?.user?.firstName || user?.user?.name}
              lastName={user?.user?.lastName}
              textStyle={style.topProfileIcon}
              profileTexts={{fontSize: fontSize(10)}}
            />
          )}
        </TouchableOpacity>
      </View>

      <View>
        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />
      </View>

      <View style={style.headerTittleContainer}>
        <Text style={style.editText}>Edit Profile</Text>

        <TouchableOpacity
          style={style.arrowContainer}
          onPress={() => navigation.goBack()}>
          <Image source={icons.back_arrow_icon} style={style.arrowIcon} />
        </TouchableOpacity>
      </View>

      {/*<Text style={style.headerSubText}>*/}
      {/*  Select Photo to{' '}*/}
      {/*  <Text style={style.textColor}>Set as profile picture</Text>*/}
      {/*</Text>*/}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.flatListContainer}>
          {/*<FlatList*/}
          {/*  data={dataWithAddBox}*/}
          {/*  keyExtractor={(item, index) => index.toString()}*/}
          {/*  renderItem={renderItem}*/}
          {/*  numColumns={3} // Display 3 images per row*/}
          {/*  contentContainerStyle={style.contentContainerStyle}*/}
          {/*/>*/}
        </View>

        <View
          style={{
            width: '100%',
            height: 8,
            backgroundColor: '#F5F5F5',
            marginTop: hp(15),
          }}
        />

        {/*<View style={{flex: 1}}>*/}
        <Text style={[style.editText, style.aboutTextContainer]}>
          About You
        </Text>
        <TextInput
          style={style.textInputContainer}
          multiline
          placeholder="Write about yourself..."
          value={aboutText}
          onChangeText={text => setAboutText(text)} // Update state on text change
        />
        {/*</View>*/}

        <View style={style.purposeContainer}>
          <View style={style.purposeTextContainer}>
            <Text style={style.editText}>Purpose</Text>
            <TouchableOpacity onPress={() => bottomSheetRef.current.open()}>
              <Image
                source={icons.rightSideIcon}
                style={style.purposeRightSideIcon}
              />
            </TouchableOpacity>
          </View>

          {/* Display selected purposes below the "Purpose" text */}
          <View style={{marginTop: 20}}>
            <View style={style.purposeSelectedContainer}>
              {selectedPurposes.length > 0 ? (
                selectedPurposes.map((purpose, index) => (
                  <View key={index} style={style.purposeSelectedContainerView}>
                    <Text style={style.purpose}>{purpose}</Text>
                    {/* Add X button to remove the selected purpose */}
                    <TouchableOpacity
                      style={style.purposeCancelContainer}
                      onPress={() => handleRemovePurpose(purpose)}>
                      <Text style={style.purposeCancelXIcon}>X</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={style.noPurposeText}>No purpose selected</Text>
              )}
            </View>
          </View>

          <RBSheet
            ref={bottomSheetRef}
            height={400}
            openDuration={250}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingHorizontal: 20,
              },
            }}>
            {/* Content inside the bottom sheet */}
            <View>
              <Text style={style.purposeBottomSheet}>Select Purpose</Text>
              <View style={style.bottomSheetLine} />
              {/* Add selectable options */}
              <TouchableOpacity
                onPress={() => handleSelectPurpose('Meet New Friends')}>
                <Text style={style.bottomSheetOptionText}>
                  Meet New Friends
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectPurpose('Looking for Love')}>
                <Text style={style.bottomSheetOptionText}>
                  Looking for Love
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectPurpose('Movie Date')}>
                <Text style={style.bottomSheetOptionText}>Movie Date</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleSelectPurpose('Foodies')}>
                <Text style={style.bottomSheetOptionText}>Foodies</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectPurpose('Travel Buddies')}>
                <Text style={style.bottomSheetOptionText}>Travel Buddies</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectPurpose('Game Lover')}>
                <Text style={style.bottomSheetOptionText}>Game Lover</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectPurpose('Chit-Chat')}>
                <Text style={style.bottomSheetOptionText}>Chit-Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectPurpose('Adventurous')}>
                <Text style={style.bottomSheetOptionText}>Adventurous</Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
        </View>

        <View
          style={{
            width: '100%',
            height: 8,
            backgroundColor: '#F5F5F5',
            marginTop: hp(15),
          }}
        />

        <View style={style.basicInfoContainer}>
          <Text style={style.editText}>Basic Info</Text>

          <View style={style.BODContainer}>
            <Text style={{color: '#5F6368'}}>Date of Birth</Text>
            <View style={style.dateContainer}>
              {/* Display the formatted date */}
              <Text style={style.dateStyle}>{formatDate(selectedDate)}</Text>

              {/* Image Touchable to trigger the DatePicker modal */}
              <TouchableOpacity onPress={() => setOpen(true)}>
                <Image
                  source={icons.rightSideIcon}
                  style={style.purposeRightSideIcon}
                />
              </TouchableOpacity>
            </View>

            <Text style={{color: '#5F6368', marginTop: 20}}>
              Currently Living
            </Text>

            <View style={style.dateContainer}>
              {/* Display the selected country */}
              <Text style={style.dateStyle}>{selectedCountry}</Text>
              <TouchableOpacity onPress={openBottomSheet}>
                <Image
                  source={icons.rightSideIcon}
                  style={style.purposeRightSideIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Bottom Sheet */}
            <RBSheet
              ref={currentlybottomSheetRef}
              height={350}
              openDuration={250}
              closeOnDragDown={true}
              customStyles={{
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
              }}>
              <View style={style.currentlyBottomSheetContainer}>
                <Text style={style.purposeBottomSheet}>Select Country</Text>
                <View style={style.bottomSheetLine} />

                {/* FlatList to render all country names */}
                <FlatList
                  data={countries}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={style.currentlyBottomSheetOption}
                      onPress={() => handleSelectCountry(item)}>
                      <Text style={style.bottomSheetOptionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </RBSheet>

            <View style={{marginTop: hp(20), flex: 1}}>
              <View style={style.dateContainer}>
                <Text style={style.dateStyle}>Language Spoken</Text>
                <TouchableOpacity
                  onPress={() => motherTongueBottomSheetRef.current.open()}>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.purposeRightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={{marginTop: 20}}>
                <View style={style.purposeSelectedContainer}>
                  {selectedMotherTongue.length > 0 ? (
                    selectedMotherTongue.map((purpose, index) => (
                      <View
                        key={index}
                        style={style.purposeSelectedContainerView}>
                        <Text style={style.purpose}>{purpose}</Text>
                        <TouchableOpacity
                          style={style.purposeCancelContainer}
                          onPress={() =>
                            handleMotherTongueRemovePurpose(purpose)
                          }>
                          <Text style={style.purposeCancelXIcon}>X</Text>
                        </TouchableOpacity>
                      </View>
                    ))
                  ) : (
                    <Text style={{color: 'grey'}}>No purpose selected</Text>
                  )}
                </View>
              </View>
            </View>
            {/* Bottom Sheet Component */}
            <RBSheet
              ref={motherTongueBottomSheetRef}
              height={400}
              openDuration={250}
              closeOnDragDown={true}
              closeOnPressMask={true}
              customStyles={{
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                  paddingHorizontal: 20,
                },
              }}>
              <View>
                <Text style={{fontSize: 18, fontFamily: fontFamily.poppins600}}>
                  Select Purpose
                </Text>
                <TouchableOpacity
                  onPress={() => handleMotherTongueSelectPurpose('Hindi')}>
                  <Text style={style.bottomSheetOptionText}>Hindi</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleMotherTongueSelectPurpose('Gujarati')}>
                  <Text style={style.bottomSheetOptionText}>Gujarati</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleMotherTongueSelectPurpose('English')}>
                  <Text style={style.bottomSheetOptionText}>English</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleMotherTongueSelectPurpose('Maharati')}>
                  <Text style={style.bottomSheetOptionText}>Maharati</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleMotherTongueSelectPurpose('Punjabi')}>
                  <Text style={style.bottomSheetOptionText}>Punjabi</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleMotherTongueSelectPurpose('Marvadi')}>
                  <Text style={style.bottomSheetOptionText}>Marvadi</Text>
                </TouchableOpacity>
              </View>
            </RBSheet>

            <Text style={{color: '#5F6368', marginTop: 20}}>Religion</Text>

            <View style={style.dateContainer}>
              {/* Display the selected Religion */}
              <Text style={style.dateStyle}>{selectedReligion}</Text>
              <TouchableOpacity onPress={openReligionBottomSheet}>
                <Image
                  source={icons.rightSideIcon}
                  style={style.purposeRightSideIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Bottom Sheet Religion */}
            <RBSheet
              ref={religionBottomSheetRef}
              height={300}
              openDuration={250}
              closeOnDragDown={true}
              customStyles={{
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
              }}>
              <View style={style.currentlyBottomSheetContainer}>
                <Text style={style.purposeBottomSheet}>Selected Religion</Text>

                {/* FlatList to render all country names */}
                <FlatList
                  data={religion}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={style.currentlyBottomSheetOption}
                      onPress={() => handleSelectReligion(item)}>
                      <Text style={style.bottomSheetOptionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </RBSheet>

            <Text style={{color: '#5F6368', marginTop: 20}}>Ethnicity</Text>

            <View style={style.dateContainer}>
              {/* Display the selected Religion */}
              <Text style={style.dateStyle}>{selectedEthnicity}</Text>
              <TouchableOpacity onPress={openEthnicityBottomSheet}>
                <Image
                  source={icons.rightSideIcon}
                  style={style.purposeRightSideIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Bottom Sheet Religion */}
            <RBSheet
              ref={ethnicityBottomSheetRef}
              height={370}
              openDuration={250}
              closeOnDragDown={true}
              customStyles={{
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
              }}>
              <View style={style.currentlyBottomSheetContainer}>
                <Text style={style.purposeBottomSheet}>Selected Ethnicity</Text>

                {/* FlatList to render all country names */}
                <FlatList
                  data={ethnicity}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={style.currentlyBottomSheetOption}
                      onPress={() => handleEthnicityReligion(item)}>
                      <Text style={style.bottomSheetOptionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </RBSheet>
          </View>

          {/* DatePicker Modal */}
          <Modal visible={open} transparent={true} animationType="fade">
            <View style={style.datePickerModal}>
              <View style={style.dateModalBody}>
                {/* Close Button */}
                <TouchableOpacity
                  style={style.dateModalCloseButtonContainer}
                  onPress={() => setOpen(false)}>
                  <Text style={style.dateModalCancelText}>X</Text>
                </TouchableOpacity>

                {/* DatePicker Component */}
                <View style={style.dateModalPicker}>
                  <DatePicker
                    date={tempDate}
                    mode="date"
                    onDateChange={setTempDate} // Update tempDate when user changes date
                    maximumDate={new Date()} // Ensure date doesn't exceed today
                  />
                </View>

                {/* Set Date Button */}
                <TouchableOpacity
                  style={style.dateModalSetDateButton}
                  onPress={handleSetDate}>
                  <Text style={style.modalSetDateText}>Set Date</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>

        <View
          style={{
            width: '100%',
            height: 8,
            backgroundColor: '#F5F5F5',
            marginTop: hp(15),
          }}
        />

        <View style={style.basicInfoContainer}>
          <Text style={style.editText}>Professional Details</Text>

          <View style={style.BODContainer}>
            <Text style={{color: '#5F6368'}}>Education Level</Text>

            <View style={style.dateContainer}>
              {/* Display the selected Religion */}
              <Text style={style.dateStyle}>{selectedEducation}</Text>
              <TouchableOpacity onPress={openEducationBottomSheet}>
                <Image
                  source={icons.rightSideIcon}
                  style={style.purposeRightSideIcon}
                />
              </TouchableOpacity>
            </View>

            {/* Bottom Sheet education */}
            <RBSheet
              ref={educationBottomSheetRef}
              height={370}
              openDuration={250}
              closeOnDragDown={true}
              customStyles={{
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
              }}>
              <View style={style.currentlyBottomSheetContainer}>
                <Text style={style.purposeBottomSheet}>Selected Education</Text>

                {/* FlatList to render all country names */}
                <FlatList
                  data={educationList}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      style={style.currentlyBottomSheetOption}
                      onPress={() => handleEducationLevel(item)}>
                      <Text style={style.bottomSheetOptionText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </RBSheet>

            <Text style={{color: '#5F6368', marginTop: 20}}>Occupation</Text>
            <View style={style.dateContainer}>
              {/* Display the selected Religion */}
              <Text style={style.dateStyle}>{selectedOccupation}</Text>
              <TouchableOpacity onPress={openOccupationBottomSheet}>
                <Image
                  source={icons.rightSideIcon}
                  style={style.purposeRightSideIcon}
                />
              </TouchableOpacity>

              <RBSheet
                ref={OccupationBottomSheetRef}
                height={370}
                openDuration={250}
                closeOnDragDown={true}
                customStyles={{
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                }}>
                <View style={style.currentlyBottomSheetContainer}>
                  <Text style={style.purposeBottomSheet}>
                    Selected Occupation
                  </Text>

                  {/* FlatList to render all country names */}
                  <FlatList
                    data={OccupationList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={style.currentlyBottomSheetOption}
                        onPress={() => handleOccupationLevel(item)}>
                        <Text style={style.bottomSheetOptionText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </RBSheet>
            </View>

            <Text style={{color: '#5F6368', marginTop: 20}}>Annual Income</Text>
            <View style={style.dateContainer}>
              {/* Display the selected Religion */}
              <Text style={style.dateStyle}>{selectedAnnual}</Text>
              <TouchableOpacity onPress={openAnnualBottomSheet}>
                <Image
                  source={icons.rightSideIcon}
                  style={style.purposeRightSideIcon}
                />
              </TouchableOpacity>

              <RBSheet
                ref={AnnualBottomSheetRef}
                height={370}
                openDuration={250}
                closeOnDragDown={true}
                customStyles={{
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                }}>
                <View style={style.currentlyBottomSheetContainer}>
                  <Text style={style.purposeBottomSheet}>
                    Selected Occupation
                  </Text>

                  {/* FlatList to render all country names */}
                  <FlatList
                    data={AnnualList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={style.currentlyBottomSheetOption}
                        onPress={() => handleAnnualLevel(item)}>
                        <Text style={style.bottomSheetOptionText}>{item}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              </RBSheet>
            </View>
          </View>
        </View>

        <View
          style={{
            width: '100%',
            height: 8,
            backgroundColor: '#F5F5F5',
            marginTop: hp(15),
          }}
        />

        <View style={style.hobbiesAndInterestContainer}>
          <Text style={style.editText}>Hobbies & Interest</Text>
          <TouchableOpacity
            onPress={() => hobbiesBottomSheetRef.current.open()}>
            <Image
              source={icons.rightSideIcon}
              style={style.purposeRightSideIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={{marginHorizontal: wp(17), marginTop: hp(5)}}>
          {/* Display each purpose in a separate box */}
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 10}}>
            {selectedHobbies.length > 0 ? (
              selectedHobbies.map((purpose, index) => (
                <View key={index} style={style.purposeSelectedContainerView}>
                  <Text style={style.purpose}>{purpose}</Text>
                  <TouchableOpacity
                    style={style.purposeCancelContainer}
                    onPress={() => handleHobbiesRemovePurpose(purpose)}>
                    <Text style={style.purposeCancelXIcon}>X</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={{color: 'grey'}}>No purpose selected</Text>
            )}
          </View>

          <RBSheet
            ref={hobbiesBottomSheetRef}
            height={400}
            openDuration={250}
            closeOnDragDown={true}
            closeOnPressMask={true}
            customStyles={{
              container: {
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                paddingHorizontal: 20,
              },
            }}>
            <View>
              <Text style={{fontSize: 18, fontFamily: fontFamily.poppins600}}>
                Select Purpose
              </Text>
              <TouchableOpacity
                onPress={() => handleHobbiesSelectPurpose('Writing')}>
                <Text style={style.bottomSheetOptionText}>Writing</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleHobbiesSelectPurpose('Play Instrument')}>
                <Text style={style.bottomSheetOptionText}>Play Instrument</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleHobbiesSelectPurpose('Game')}>
                <Text style={style.bottomSheetOptionText}>Game</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleHobbiesSelectPurpose('Movie')}>
                <Text style={style.bottomSheetOptionText}>Movie</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleHobbiesSelectPurpose('Sports')}>
                <Text style={style.bottomSheetOptionText}>Sports</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleHobbiesSelectPurpose('Running')}>
                <Text style={style.bottomSheetOptionText}>Running</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleHobbiesSelectPurpose('Cycling')}>
                <Text style={style.bottomSheetOptionText}>Cycling</Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
        </View>

        <View style={{height: 50}} />

        <TouchableOpacity
          onPress={handleAddPress}
          disabled={isUpdatingProfile}
          activeOpacity={0.7}
          style={style.saveButtonContainer}>
          <LinearGradient
            colors={['#0D4EB3', '#9413D0']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1.5}}
            style={style.saveButtonGradientContainer}>
            {isUpdatingProfile ? (
              <ActivityIndicator size="large" color="#FFFFFF" />
            ) : (
              <Text style={style.saveTextButton}>Save Changes</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DatingEditProfileScreen;
