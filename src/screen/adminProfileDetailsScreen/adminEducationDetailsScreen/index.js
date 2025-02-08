import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {icons} from '../../../assets';
import {style} from './style';
import {useDispatch, useSelector} from 'react-redux';
import {colors} from '../../../utils/colors';
import {educationDetails} from '../../../actions/homeActions';
import {hp} from '../../../utils/helpers';
import RBSheet from 'react-native-raw-bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';

const AdminEducationDetailsScreen = (...params) => {
  const userPersonalData = params[0];
  const apiDispatch = useDispatch();

  const {isEducationLoading} = useSelector(state => state.auth);

  const capitalizeFirstLetter = str =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : 'N/A';

  const [degree, setDegree] = useState(userPersonalData?.userEducation?.degree);

  const [college, setCollege] = useState(
    capitalizeFirstLetter(userPersonalData?.userEducation?.collage),
  );
  const [city, setCity] = useState(
    capitalizeFirstLetter(userPersonalData?.userEducation?.city),
  );
  const [state, setState] = useState(
    capitalizeFirstLetter(userPersonalData?.userEducation?.state),
  );
  const [country, setCountry] = useState(
    capitalizeFirstLetter(userPersonalData?.userEducation?.country),
  );
  const [isEditing, setIsEditing] = useState(false);

  const degreeBottomSheetRef = useRef();
  const collegeBottomSheetRef = useRef();
  const cityBottomSheetRef = useRef();
  const stateBottomSheetRef = useRef();
  const countryBottomSheetRef = useRef();

  const handleSelectDegree = profileType => {
    setDegree(profileType); // Update the state with the selected profile type
    degreeBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleSelectCity = profileType => {
    setCity(profileType); // Update the state with the selected profile type
    cityBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleSelectState = profileType => {
    setState(profileType); // Update the state with the selected profile type
    stateBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleSelectCountry = profileType => {
    setCountry(profileType); // Update the state with the selected profile type
    countryBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleSave = () => {
    apiDispatch(
      educationDetails(
        {
          degree: degree,
          collage: college,
          city: city,
          state: state,
          country: country,
        },
        () => {
          setIsEditing(false);
        },
      ),
    );
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headingContainer}>
        {!isEditing ? (
          <Text style={style.headingText}>Education Details</Text>
        ) : (
          <Text style={style.headingText}>Modify Education Details</Text>
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
            <Text style={style.tittleText}>Degree</Text>
            <Text style={style.subTittleText}>{degree}</Text>

            <View style={style.subTittleContainer}>
              <Text style={style.tittleText}>College / University</Text>
              {/*<Text style={style.subTittleText}>{college} </Text>*/}
              <Text style={style.subTittleText}>
                {college?.length > 30 ? college.slice(0, 30) + '...' : college}
              </Text>
            </View>

            <View style={style.subTittleContainer}>
              <Text style={style.tittleText}>City</Text>
              <Text style={style.subTittleText}>{city} </Text>
            </View>

            <View style={style.subTittleContainer}>
              <Text style={style.tittleText}>State</Text>
              <Text style={style.subTittleText}>{state} </Text>
            </View>

            <View style={[style.subTittleContainer, {marginBottom: hp(25)}]}>
              <Text style={style.tittleText}>Country</Text>
              <Text style={style.subTittleText}>{country} </Text>
            </View>
          </View>
        ) : (
          <>
            <View style={style.bodyContainerStyle}>
              <Text style={style.tittleText}>Degree</Text>

              <TouchableOpacity
                onPress={() => {
                  degreeBottomSheetRef.current.open();
                }}
                style={style.subTittleContainerStyle}>
                <Text style={style.subTittleText}>{degree}</Text>

                <Image
                  source={icons.rightSideIcon}
                  style={style.rightSideIcon}
                />
              </TouchableOpacity>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>College / University</Text>

                <TouchableOpacity
                  onPress={() => {
                    collegeBottomSheetRef.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {college?.length > 30
                      ? college.slice(0, 30) + '...'
                      : college}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>City</Text>

                <TouchableOpacity
                  onPress={() => {
                    cityBottomSheetRef.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>{city}</Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>State</Text>

                <TouchableOpacity
                  onPress={() => {
                    stateBottomSheetRef.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>{state}</Text>
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
                  <Text style={style.subTittleText}>{country}</Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              {/*DEGREE FOR BOTTOM SHEET*/}
              <RBSheet
                ref={degreeBottomSheetRef}
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
                <Text style={style.bottomSheetTittleText}>Select Degree</Text>

                <View style={style.bottomSheetUnderLine} />

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectDegree('BCA')}>
                  <Text style={style.bottomSheetOptionText}>BCA</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectDegree('MCA')}>
                  <Text style={style.bottomSheetOptionText}>MCA</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectDegree('B.Com')}>
                  <Text style={style.bottomSheetOptionText}>B.Com</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectDegree('M.Com')}>
                  <Text style={style.bottomSheetOptionText}>M.Com</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectDegree('B.Tech')}>
                  <Text style={style.bottomSheetOptionText}>B.Tech</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectDegree('M.Tech')}>
                  <Text style={style.bottomSheetOptionText}>M.Tech</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectDegree('BBA')}>
                  <Text style={style.bottomSheetOptionText}>BBA</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectDegree('MBA')}>
                  <Text style={style.bottomSheetOptionText}>MBA</Text>
                </TouchableOpacity>
              </RBSheet>

              {/*COLLEGE US BOTTOM SHEET*/}
              <RBSheet
                ref={collegeBottomSheetRef}
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
                  Enter Name College/University
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
                    value={college}
                    onChangeText={setCollege}
                    keyboardType="phone-pad"
                    placeholder="Enter College/University"
                    placeholderTextColor={colors.gray}
                  />
                </View>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    collegeBottomSheetRef.current.close();
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

              {/*COLLEGE CITY BOTTOM SHEET*/}
              <RBSheet
                ref={cityBottomSheetRef}
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
                  Select College City
                </Text>

                <View style={style.bottomSheetUnderLine} />

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectCity('Gandhinagar')}>
                  <Text style={style.bottomSheetOptionText}>Gandhinagar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectCity('Mehsana')}>
                  <Text style={style.bottomSheetOptionText}>Mehsana</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectCity('Himmatnagar')}>
                  <Text style={style.bottomSheetOptionText}>Himmatnagar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectCity('Kalol')}>
                  <Text style={style.bottomSheetOptionText}>Kalol</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectCity('Surat')}>
                  <Text style={style.bottomSheetOptionText}>Surat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectCity('Bardoli')}>
                  <Text style={style.bottomSheetOptionText}>Bardoli</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectCity('Navsari')}>
                  <Text style={style.bottomSheetOptionText}>Navsari</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectCity('Mandvi')}>
                  <Text style={style.bottomSheetOptionText}>Mandvi</Text>
                </TouchableOpacity>
              </RBSheet>

              {/*STATE CITY BOTTOM SHEET*/}
              <RBSheet
                ref={stateBottomSheetRef}
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
                  Select College State
                </Text>

                <View style={style.bottomSheetUnderLine} />

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('Gujarat')}>
                  <Text style={style.bottomSheetOptionText}>Gujarat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('Delhi')}>
                  <Text style={style.bottomSheetOptionText}>Delhi</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('Kolkata')}>
                  <Text style={style.bottomSheetOptionText}>Kolkata</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('Mumbai')}>
                  <Text style={style.bottomSheetOptionText}>Mumbai</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('Delhi')}>
                  <Text style={style.bottomSheetOptionText}>Delhi</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('Chhattisgarh')}>
                  <Text style={style.bottomSheetOptionText}>Chhattisgarh</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('Goa')}>
                  <Text style={style.bottomSheetOptionText}>Goa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('Andhra Pradesh')}>
                  <Text style={style.bottomSheetOptionText}>
                    Andhra Pradesh
                  </Text>
                </TouchableOpacity>
              </RBSheet>

              {/*COUNTRY FOR BOTTOM SHEET*/}
              <RBSheet
                ref={countryBottomSheetRef}
                closeOnDragDown={true} // Allows drag to close
                closeOnPressMask={true} // Allows closing when clicking outside the sheet
                height={hp(250)} // Adjust height of Bottom Sheet
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
                  Select College Country
                </Text>

                <View style={style.bottomSheetUnderLine} />

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectCountry('India')}>
                  <Text style={style.bottomSheetOptionText}>India</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectCountry('Sri-Lanka')}>
                  <Text style={style.bottomSheetOptionText}>Sri-Lanka</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectCountry('US')}>
                  <Text style={style.bottomSheetOptionText}>US</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectCountry('UK')}>
                  <Text style={style.bottomSheetOptionText}>UK</Text>
                </TouchableOpacity>
              </RBSheet>

              <TouchableOpacity activeOpacity={0.7} onPress={handleSave}>
                <LinearGradient
                  colors={['#0F52BA', '#8225AF']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0.5}}
                  style={style.saveButtonContainer}>
                  {isEducationLoading ? (
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

export default AdminEducationDetailsScreen;
