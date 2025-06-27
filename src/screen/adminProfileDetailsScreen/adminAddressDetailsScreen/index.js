import React, {useState, useEffect, useRef} from 'react';
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
import {addressDetails} from '../../../actions/homeActions';
import {useDispatch, useSelector} from 'react-redux';
import {style} from './style';
import {hp} from '../../../utils/helpers';
import RBSheet from 'react-native-raw-bottom-sheet';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../../utils/colors';

const AdminAddressDetailsScreen = (...params) => {
  const userPersonalData = params[0];
  const apiDispatch = useDispatch();

  // console.log(
  //   ' === userPersonalData ===> ',
  //   userPersonalData?.address?.currentState,
  // );

  const {isAddressLoading} = useSelector(state => state.auth);

  const capitalizeFirstLetter = str =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : 'N/A';

  const [residingAddress, setResidingAddress] = useState(
    capitalizeFirstLetter(userPersonalData?.address?.currentResidenceAddress),
  );

  const [currentCountry, setCurrentCountry] = useState(
    capitalizeFirstLetter(userPersonalData?.address?.currentCountry),
  );

  const [currentState, setCurrentState] = useState(
    capitalizeFirstLetter(userPersonalData?.address?.currentState),
  );

  const [currentCity, setCurrentCity] = useState(
    capitalizeFirstLetter(userPersonalData?.address?.currentCity),
  );

  const [isEditing, setIsEditing] = useState(false);

  const currentAddressBottomSheetRef = useRef();
  const currentCountryBottomSheetRef = useRef();
  const currentStateBottomSheetRef = useRef();
  const currentCityBottomSheetRef = useRef();

  const openBottomSheet = () => {
    currentAddressBottomSheetRef.current.open();
  };

  const handleAboutTextChange = text => {
    setResidingAddress(text);
  };

  const handleSelectCuntry = profileType => {
    setCurrentCountry(profileType); // Update the state with the selected profile type
    currentCountryBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleSelectState = profileType => {
    setCurrentState(profileType); // Update the state with the selected profile type
    currentStateBottomSheetRef.current.close(); // Close the bottom sheet
  };

  const handleSave = () => {
    apiDispatch(
      addressDetails(
        {
          currentResidenceAddress: residingAddress,
          currentCountry: currentCountry,
          currentState: currentState,
          currentCity: currentCity,
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
          <Text style={style.headingText}>Location Details</Text>
        ) : (
          <Text style={style.headingText}>Modify Location Details</Text>
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
            {/*<Text style={style.tittleText}>Current Address</Text>*/}
            {/*/!*<Text style={style.subTittleText}>{residingAddress} </Text>*!/*/}
            {/*<Text style={style.subTittleText}>*/}
            {/*  {residingAddress?.split(' ').slice(0, 5).join(' ') +*/}
            {/*    (residingAddress?.split(' ').length > 5 ? '...' : '')}{' '}*/}
            {/*</Text>*/}

            <View style={style.tittleText}>
              <Text style={style.tittleText}>Country</Text>
              <Text style={style.subTittleText}>{currentCountry} </Text>
            </View>

            <View style={style.subTittleContainer}>
              <Text style={style.tittleText}>State</Text>
              <Text style={style.subTittleText}>{currentState} </Text>
            </View>

            <View style={[style.subTittleContainer, {marginBottom: hp(25)}]}>
              <Text style={style.tittleText}>City</Text>
              <Text style={style.subTittleText}>{currentCity} </Text>
            </View>
          </View>
        ) : (
          <>
            <View style={style.bodyContainerStyle}>
              {/*<Text style={style.tittleText}>Current Address</Text>*/}

              {/*<TouchableOpacity*/}
              {/*  onPress={openBottomSheet}*/}
              {/*  style={style.subTittleContainerStyle}>*/}
              {/*  <Text style={style.subTittleText}>*/}
              {/*    {residingAddress?.split(' ').slice(0, 5).join(' ') +*/}
              {/*      (residingAddress?.split(' ').length > 5 ? '...' : '') ||*/}
              {/*      'Write about yourself...'}*/}
              {/*  </Text>*/}

              {/*  <Image*/}
              {/*    source={icons.rightSideIcon}*/}
              {/*    style={style.rightSideIcon}*/}
              {/*  />*/}
              {/*</TouchableOpacity>*/}

              <View style={style.tittleText}>
                <Text style={style.tittleText}>Country</Text>

                <TouchableOpacity
                  onPress={() => {
                    currentCountryBottomSheetRef.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {capitalizeFirstLetter(currentCountry)}
                  </Text>
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
                    currentStateBottomSheetRef.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {capitalizeFirstLetter(currentState)}
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
                    currentCityBottomSheetRef.current.open();
                  }}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>
                    {capitalizeFirstLetter(currentCity)}
                  </Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/*CURRENT ADDRESS BOTTOM SHEET*/}
            <RBSheet
              ref={currentAddressBottomSheetRef}
              closeOnDragDown={true}
              closeOnPressMask={true}
              height={hp(450)}
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
                Modify Address
              </Text>

              <View style={style.aboutBottomSheetBody}>
                <TextInput
                  value={residingAddress}
                  onChangeText={handleAboutTextChange} // Use handleAboutTextChange to limit word count
                  multiline
                  editable={isEditing} // Disable editing when isEditing is false
                  style={style.aboutBottomSheetTextInput}
                  placeholder="Type about yourself..."
                  placeholderTextColor={colors.gray}
                />
              </View>
              <Text style={style.aboutBottomSheetWord}>
                *Your address will remain private unless you choose to
              </Text>
              <Text style={[style.aboutBottomSheetWord, {marginTop: 0}]}>
                display it to other users.
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  currentAddressBottomSheetRef.current.close();
                }}>
                <LinearGradient
                  colors={['#0F52BA', '#8225AF']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1.1}}
                  style={style.bottomSheetAddButtonContainer}>
                  <Text style={style.bottomSheetAddButtonText}>Add</Text>
                </LinearGradient>
              </TouchableOpacity>
            </RBSheet>

            {/*CURRENT COUNTRY BOTTOM SHEET*/}
            <RBSheet
              ref={currentCountryBottomSheetRef}
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
              <Text style={style.bottomSheetTittleText}>Select Country</Text>

              <View style={style.bottomSheetUnderLine} />

              <TouchableOpacity
                style={{marginTop: hp(15)}}
                onPress={() => handleSelectCuntry('india')}>
                <Text style={style.bottomSheetOptionText}>India</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginTop: hp(15)}}
                onPress={() => handleSelectCuntry('canada')}>
                <Text style={style.bottomSheetOptionText}>Canada</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginTop: hp(15)}}
                onPress={() => handleSelectCuntry('us')}>
                <Text style={style.bottomSheetOptionText}>US</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginTop: hp(15)}}
                onPress={() => handleSelectCuntry('afghanistan')}>
                <Text style={style.bottomSheetOptionText}>Afghanistan</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginTop: hp(15)}}
                onPress={() => handleSelectCuntry('china')}>
                <Text style={style.bottomSheetOptionText}>China</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginTop: hp(15)}}
                onPress={() => handleSelectCuntry('myanmar')}>
                <Text style={style.bottomSheetOptionText}>Myanmar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginTop: hp(15)}}
                onPress={() => handleSelectCuntry('nepal')}>
                <Text style={style.bottomSheetOptionText}>Nepal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginTop: hp(15)}}
                onPress={() => handleSelectCuntry('sri-lanka')}>
                <Text style={style.bottomSheetOptionText}>Sri-lanka</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{marginTop: hp(15)}}
                onPress={() => handleSelectCuntry('pakistan')}>
                <Text style={style.bottomSheetOptionText}>Pakistan</Text>
              </TouchableOpacity>
            </RBSheet>

            {/*CURRENT STATE BOTTOM SHEET*/}
            <RBSheet
              ref={currentStateBottomSheetRef}
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
              <Text style={style.bottomSheetTittleText}>Select Country</Text>

              <View style={style.bottomSheetUnderLine} />

              <ScrollView>
                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('gujarat')}>
                  <Text style={style.bottomSheetOptionText}>Gujarat</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('assam')}>
                  <Text style={style.bottomSheetOptionText}>Assam</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('andhra-pradesh')}>
                  <Text style={style.bottomSheetOptionText}>
                    Andhra-pradesh
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('arunachal-pradesh')}>
                  <Text style={style.bottomSheetOptionText}>
                    Arunachal-pradesh
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('bihar')}>
                  <Text style={style.bottomSheetOptionText}>Bihar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('chhattisgarh')}>
                  <Text style={style.bottomSheetOptionText}>Chhattisgarh</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('goa')}>
                  <Text style={style.bottomSheetOptionText}>Goa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('haryana')}>
                  <Text style={style.bottomSheetOptionText}>Haryana</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('himachal-pradesh')}>
                  <Text style={style.bottomSheetOptionText}>
                    Himachal-pradesh
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('jharkhand')}>
                  <Text style={style.bottomSheetOptionText}>jharkhand</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('karnataka')}>
                  <Text style={style.bottomSheetOptionText}>Karnataka</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('kerala')}>
                  <Text style={style.bottomSheetOptionText}>Kerala</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15)}}
                  onPress={() => handleSelectState('madhya-pradesh')}>
                  <Text style={style.bottomSheetOptionText}>
                    Madhya-pradesh
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{marginTop: hp(15), marginBottom: hp(30)}}
                  onPress={() => handleSelectState('maharashtra')}>
                  <Text style={style.bottomSheetOptionText}>Maharashtra</Text>
                </TouchableOpacity>
              </ScrollView>
            </RBSheet>

            {/*CURRENT CITY BOTTOM SHEET*/}
            <RBSheet
              ref={currentCityBottomSheetRef}
              closeOnDragDown={true} // Allows drag to close
              closeOnPressMask={true} // Allows closing when clicking outside the sheet
              height={hp(230)} // Adjust height of Bottom Sheet
              customStyles={{
                draggableIcon: {
                  backgroundColor: '#ffffff',
                },
                container: {
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
              }}>
              <Text style={style.bottomSheetTittleText}>Add City</Text>

              <View style={style.bottomSheetUnderLine} />

              <View style={{marginHorizontal: 17, position: 'relative'}}>
                <TextInput
                  value={currentCity}
                  onChangeText={text => {
                    setCurrentCity(text);
                  }}
                  // keyboardType="numeric" // Only allow numeric input
                  style={style.bottomSheetHeightTextInput}
                  placeholder="Enter City"
                  placeholderTextColor="#8B8B8B"
                />

                {/* 'ft' text inside the TextInput */}
                {/*<Text style={style.BottomSheetTextInputText}>ft</Text>*/}
              </View>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  currentCityBottomSheetRef.current.close();
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

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleSave}
              style={{marginHorizontal: 17}}>
              <LinearGradient
                colors={['#0F52BA', '#8225AF']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0.5}}
                style={style.saveButtonContainer}>
                {isAddressLoading ? (
                  <ActivityIndicator size="large" color={colors.white} />
                ) : (
                  <Text style={style.bottomSheetAddButtonText}>
                    Save Changes
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdminAddressDetailsScreen;
