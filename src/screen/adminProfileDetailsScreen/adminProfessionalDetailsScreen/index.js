import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {icons} from '../../../assets';
import {useDispatch, useSelector} from 'react-redux';
import {style} from './style';
import {professionalDetail} from '../../../actions/homeActions';
import {colors} from '../../../utils/colors';
import {hp} from '../../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';

const AdminProfessionalDetailsScreen = (...params) => {
  const userPersonalData = params[0];

  const apiDispatch = useDispatch();

  const {isSendRequestLoading} = useSelector(state => state.auth);

  const [loading, setLoading] = useState(false);

  // console.log(' === isSendRequestLoading ===> ', isSendRequestLoading);

  const capitalizeFirstLetter = str =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : '';

  const [currentDesignation, setCurrentDesignation] = useState(
    capitalizeFirstLetter(userPersonalData?.userProfessional?.jobTitle),
  );

  const [jobType, setJobType] = useState(
    capitalizeFirstLetter(userPersonalData?.userProfessional?.jobType),
  );
  const [companyName, setCompanyName] = useState(
    capitalizeFirstLetter(userPersonalData?.userProfessional?.companyName),
  );
  const [salary, setSalary] = useState(
    userPersonalData?.userProfessional?.currentSalary || 'N/A',
  );

  const [workCity, setWorkCity] = useState(
    capitalizeFirstLetter(userPersonalData?.userProfessional?.workCity),
  );
  const [workCountry, setWorkCountry] = useState(
    capitalizeFirstLetter(userPersonalData?.userProfessional?.workCountry),
  );
  const [isEditing, setIsEditing] = useState(false);

  const designationBottomSheetRef = useRef();
  const jobTypeBottomSheetRef = useRef();
  const nameBottomSheetRef = useRef();
  const salaryBottomSheetRef = useRef();
  const cityBottomSheetRef = useRef();
  const countryBottomSheetRef = useRef();

  const handleSelectJobType = profileType => {
    setJobType(profileType); // Update the state with the selected profile type
    jobTypeBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleSelectSalary = profileType => {
    setSalary(profileType); // Update the state with the selected profile type
    salaryBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleSelectCity = profileType => {
    setWorkCity(profileType); // Update the state with the selected profile type
    cityBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleSelectCountry = profileType => {
    setWorkCountry(profileType); // Update the state with the selected profile type
    countryBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleSave = () => {
    // console.log(' === handleSave ===> ', salary);

    setLoading(true);
    apiDispatch(
      professionalDetail(
        {
          jobTitle: currentDesignation,
          jobType: jobType,
          companyName: companyName,
          currentSalary: salary, // ✅ must be a number
          workCity: workCity,
          workCountry: workCountry,
        },
        () => {
          setLoading(false);
          setIsEditing(false);
        },
      ),
    );

    // Save data to your backend or perform any other necessary action
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headingContainer}>
        {!isEditing ? (
          <Text style={style.headingText}>Job Details</Text>
        ) : (
          <Text style={style.headingText}>Modify Job Details</Text>
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

      <View style={style.bodyContainer}>
        {!isEditing ? (
          <View style={style.bodyContainerStyle}>
            <Text style={style.tittleText}>Current Designation</Text>
            <Text style={style.subTittleText}>
              {currentDesignation || 'N/A'}{' '}
            </Text>

            <View style={style.subTittleContainer}>
              <Text style={style.tittleText}>Job Type</Text>
              <Text style={style.subTittleText}>{jobType || 'N/A'} </Text>
            </View>

            <View style={style.subTittleContainer}>
              <Text style={style.tittleText}>Company Name</Text>
              <Text style={style.subTittleText}>{companyName || 'N/A'} </Text>
            </View>

            <View style={style.subTittleContainer}>
              <Text style={style.tittleText}>Annual Salary</Text>
              <Text style={style.subTittleText}>
                {salary === 'N/A' ? salary : `${salary} Lac.`}{' '}
              </Text>
            </View>

            <View style={style.subTittleContainer}>
              <Text style={style.tittleText}>Work City</Text>
              <Text style={style.subTittleText}>{workCity || 'N/A'} </Text>
            </View>

            <View style={[style.subTittleContainer, {marginBottom: hp(25)}]}>
              <Text style={style.tittleText}>Country</Text>
              <Text style={style.subTittleText}>{workCountry || 'N/A'} </Text>
            </View>
          </View>
        ) : (
          <>
            <View style={style.bodyContainerStyle}>
              <Text style={style.tittleText}>Current Designation</Text>
              <TouchableOpacity
                onPress={() => {
                  designationBottomSheetRef.current.open();
                }}
                style={style.subTittleContainerStyle}>
                <Text style={style.subTittleText}>
                  {capitalizeFirstLetter(currentDesignation) || 'N/A'}
                </Text>

                <Image
                  source={icons.rightSideIcon}
                  style={style.rightSideIcon}
                />
              </TouchableOpacity>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Job Type</Text>

                <TouchableOpacity
                  onPress={() => {
                    jobTypeBottomSheetRef.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {capitalizeFirstLetter(jobType) || 'N/A'}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Company Name</Text>

                <TouchableOpacity
                  onPress={() => {
                    nameBottomSheetRef.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {capitalizeFirstLetter(companyName) || 'N/A'}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Annual Salary</Text>

                <TouchableOpacity
                  onPress={() => {
                    salaryBottomSheetRef.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {salary === 'N/A' ? salary : `${salary} Lac.`}{' '}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Work City</Text>

                <TouchableOpacity
                  onPress={() => {
                    cityBottomSheetRef.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {capitalizeFirstLetter(workCity) || 'N/A'}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Country</Text>

                <TouchableOpacity
                  onPress={() => {
                    countryBottomSheetRef.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {capitalizeFirstLetter(workCountry) || 'N/A'}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              {/*Designation FOR BOTTOM SHEET*/}
              <RBSheet
                ref={designationBottomSheetRef}
                closeOnDragDown={true} // Allows drag to close
                closeOnPressMask={true} // Allows closing when clicking outside the sheet
                height={hp(300)} // Adjust height of Bottom Sheet
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
                  Write Current Designation
                </Text>

                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E7E7E7',
                    marginTop: hp(15),
                  }}
                />

                <View style={{marginHorizontal: 25}}>
                  <TextInput
                    style={{
                      height: 50,
                      borderColor: 'black',
                      borderWidth: 1,
                      fontSize: 18,
                      borderRightWidth: 0,
                      borderLeftWidth: 0,
                      borderTopWidth: 0,
                      marginTop: hp(25),
                      width: '100%',
                      color: colors.black,
                    }}
                    value={currentDesignation}
                    onChangeText={setCurrentDesignation}
                    placeholder="Write Your  Designation"
                    placeholderTextColor={colors.gray}
                  />
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    designationBottomSheetRef.current.close();
                  }}>
                  <LinearGradient
                    colors={['#2D46B9', '#8D1D8D']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={[
                      style.bottomSheetAddButtonContainer,
                      {marginTop: hp(80)},
                    ]}>
                    <Text style={style.bottomSheetAddButtonText}>Add</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </RBSheet>

              {/*JOB TYPE FOR BOTTOM SHEET*/}
              <RBSheet
                ref={jobTypeBottomSheetRef}
                closeOnDragDown={true} // Allows drag to close
                closeOnPressMask={true} // Allows closing when clicking outside the sheet
                height={hp(260)} // Adjust height of Bottom Sheet
                customStyles={{
                  draggableIcon: {
                    backgroundColor: colors.gray,
                  },
                  container: {
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                }}>
                <Text style={style.bottomSheetTittleText}>Select Job Type</Text>

                <View style={style.bottomSheetUnderLine} />

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectJobType('government')}>
                  <Text style={style.bottomSheetOptionText}>Government</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectJobType('private')}>
                  <Text style={style.bottomSheetOptionText}>Private</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectJobType('retired')}>
                  <Text style={style.bottomSheetOptionText}>Retired</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectJobType('homemaker')}>
                  <Text style={style.bottomSheetOptionText}>Homemaker</Text>
                </TouchableOpacity>
              </RBSheet>

              {/*COMPANY NAME FOR BOTTOM SHEET*/}
              <RBSheet
                ref={nameBottomSheetRef}
                closeOnDragDown={true} // Allows drag to close
                closeOnPressMask={true} // Allows closing when clicking outside the sheet
                height={hp(300)} // Adjust height of Bottom Sheet
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
                  Write Company Name
                </Text>

                <View
                  style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#E7E7E7',
                    marginTop: hp(15),
                  }}
                />

                <View style={{marginHorizontal: 25}}>
                  <TextInput
                    style={{
                      height: 50,
                      borderColor: 'black',
                      borderWidth: 1,
                      fontSize: 18,
                      borderRightWidth: 0,
                      borderLeftWidth: 0,
                      borderTopWidth: 0,
                      marginTop: hp(25),
                      width: '100%',
                      color: colors.black,
                    }}
                    value={companyName}
                    onChangeText={setCompanyName}
                    placeholder="Write Company Name"
                    placeholderTextColor={colors.gray}
                  />
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    nameBottomSheetRef.current.close();
                  }}>
                  <LinearGradient
                    colors={['#2D46B9', '#8D1D8D']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={[
                      style.bottomSheetAddButtonContainer,
                      {marginTop: hp(80)},
                    ]}>
                    <Text style={style.bottomSheetAddButtonText}>Add</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </RBSheet>

              {/*SALARY FOR BOTTOM SHEET*/}
              <RBSheet
                ref={salaryBottomSheetRef}
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
                <Text style={style.bottomSheetTittleText}>
                  Select Annual Salary
                </Text>

                <View style={style.bottomSheetUnderLine} />

                <ScrollView>
                  <TouchableOpacity
                    style={{marginTop: hp(15)}}
                    onPress={() => handleSelectSalary('1')}>
                    <Text style={style.bottomSheetOptionText}>1 Lac.</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{marginTop: hp(15)}}
                    onPress={() => handleSelectSalary('2')}>
                    <Text style={style.bottomSheetOptionText}>2 Lac.</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{marginTop: hp(15)}}
                    onPress={() => handleSelectSalary('3')}>
                    <Text style={style.bottomSheetOptionText}>3 Lac.</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{marginTop: hp(15)}}
                    onPress={() => handleSelectSalary('5')}>
                    <Text style={style.bottomSheetOptionText}>5 Lac.</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{marginTop: hp(15)}}
                    onPress={() => handleSelectSalary('10')}>
                    <Text style={style.bottomSheetOptionText}>10 Lac.</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{marginTop: hp(15)}}
                    onPress={() => handleSelectSalary('15')}>
                    <Text style={style.bottomSheetOptionText}>15 Lac.</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{marginTop: hp(15)}}
                    onPress={() => handleSelectSalary('20')}>
                    <Text style={style.bottomSheetOptionText}>20 Lac.</Text>
                  </TouchableOpacity>
                </ScrollView>
              </RBSheet>

              {/*CITY FOR BOTTOM SHEET*/}
              <RBSheet
                ref={cityBottomSheetRef}
                closeOnDragDown={true} // Allows drag to close
                closeOnPressMask={true} // Allows closing when clicking outside the sheet
                height={hp(300)} // Adjust height of Bottom Sheet
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
                  Select Work City
                </Text>

                <View style={style.bottomSheetUnderLine} />

                {/*<TouchableOpacity*/}
                {/*  style={{marginTop: hp(15)}}*/}
                {/*  onPress={() => handleSelectCity('Gandhinagar')}>*/}
                {/*  <Text style={style.bottomSheetOptionText}>Gandhinagar</Text>*/}
                {/*</TouchableOpacity>*/}

                {/*<TouchableOpacity*/}
                {/*  style={{marginTop: hp(15)}}*/}
                {/*  onPress={() => handleSelectCity('Mehsana')}>*/}
                {/*  <Text style={style.bottomSheetOptionText}>Mehsana</Text>*/}
                {/*</TouchableOpacity>*/}

                {/*<TouchableOpacity*/}
                {/*  style={{marginTop: hp(15)}}*/}
                {/*  onPress={() => handleSelectCity('Himmatnagar')}>*/}
                {/*  <Text style={style.bottomSheetOptionText}>Himmatnagar</Text>*/}
                {/*</TouchableOpacity>*/}

                {/*<TouchableOpacity*/}
                {/*  style={{marginTop: hp(15)}}*/}
                {/*  onPress={() => handleSelectCity('Kalol')}>*/}
                {/*  <Text style={style.bottomSheetOptionText}>Kalol</Text>*/}
                {/*</TouchableOpacity>*/}

                {/*<TouchableOpacity*/}
                {/*  style={{marginTop: hp(15)}}*/}
                {/*  onPress={() => handleSelectCity('Surat')}>*/}
                {/*  <Text style={style.bottomSheetOptionText}>Surat</Text>*/}
                {/*</TouchableOpacity>*/}

                {/*<TouchableOpacity*/}
                {/*  style={{marginTop: hp(15)}}*/}
                {/*  onPress={() => handleSelectCity('Bardoli')}>*/}
                {/*  <Text style={style.bottomSheetOptionText}>Bardoli</Text>*/}
                {/*</TouchableOpacity>*/}

                {/*<TouchableOpacity*/}
                {/*  style={{marginTop: hp(15)}}*/}
                {/*  onPress={() => handleSelectCity('Navsari')}>*/}
                {/*  <Text style={style.bottomSheetOptionText}>Navsari</Text>*/}
                {/*</TouchableOpacity>*/}

                {/*<TouchableOpacity*/}
                {/*  style={{marginTop: hp(15)}}*/}
                {/*  onPress={() => handleSelectCity('Mandvi')}>*/}
                {/*  <Text style={style.bottomSheetOptionText}>Mandvi</Text>*/}
                {/*</TouchableOpacity>*/}

                <View style={{marginHorizontal: 25}}>
                  <TextInput
                    style={{
                      height: 50,
                      borderColor: 'black',
                      borderWidth: 1,
                      fontSize: 18,
                      borderRightWidth: 0,
                      borderLeftWidth: 0,
                      borderTopWidth: 0,
                      marginTop: hp(25),
                      width: '100%',
                      color: colors.black,
                    }}
                    value={workCity}
                    onChangeText={setWorkCity}
                    placeholder="Enter Work City"
                    placeholderTextColor={colors.gray}
                  />
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    cityBottomSheetRef.current.close();
                  }}>
                  <LinearGradient
                    colors={['#2D46B9', '#8D1D8D']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={[
                      style.bottomSheetAddButtonContainer,
                      {marginTop: hp(80)},
                    ]}>
                    <Text style={style.bottomSheetAddButtonText}>Add</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </RBSheet>

              {/*COUNTRY FOR BOTTOM SHEET*/}
              <RBSheet
                ref={countryBottomSheetRef}
                closeOnDragDown={true} // Allows drag to close
                closeOnPressMask={true} // Allows closing when clicking outside the sheet
                height={hp(150)} // Adjust height of Bottom Sheet
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
                  Select Work Country
                </Text>

                <View style={style.bottomSheetUnderLine} />

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectCountry('india')}>
                  <Text style={style.bottomSheetOptionText}>India</Text>
                </TouchableOpacity>
              </RBSheet>

              <TouchableOpacity activeOpacity={0.7} onPress={handleSave}>
                <LinearGradient
                  colors={['#7045EB', '#4819CB']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0.5}}
                  style={style.saveButtonContainer}>
                  {loading ? (
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

export default AdminProfessionalDetailsScreen;
