import React, {useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors} from '../../../utils/colors';
import {icons} from '../../../assets';
import {style} from './style';
import {useDispatch, useSelector} from 'react-redux';
import {updateDetails} from '../../../actions/homeActions';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from 'react-native-raw-bottom-sheet';

const AdminContactDetailsScreen = (...params) => {
  const userPersonalData = params[0];
  const apiDispatch = useDispatch();

  const [mobileNumber, setMobileNumber] = useState(
    userPersonalData?.mobileNumber || 'N/A',
  );
  const [homeNumber, setHomeNumber] = useState(
    userPersonalData?.homeMobileNumber || 'N/A',
  );
  const [email, setEmail] = useState(userPersonalData?.email || 'N/A');
  const [isEditing, setIsEditing] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);

  const refRBSheet = useRef();
  const refSecondRBSheet = useRef();
  const refHomeRBSheet = useRef();
  const refHomeSecondRBSheet = useRef();
  const refEmailRBSheet = useRef();
  const refEmailSecondRBSheet = useRef();
  const inputRefs = useRef([]);

  const handleSave = () => {
    // apiDispatch(
    //   updateDetails({
    //     mobileNumber: mobileNumber,
    //     homeMobileNumber: homeNumber,
    //     email: email,
    //   }),
    // );
    setIsEditing(false);
    // Save data to your backend or perform any other necessary action
  };

  const handleSaveMobile = () => {
    console.log('Saved mobile number:', mobileNumber);
    refRBSheet.current.close(); // Close the first BottomSheet after saving

    // Open the second BottomSheet after saving the mobile number
    refSecondRBSheet.current.open();
  };

  const handleSaveHome = () => {
    console.log('Saved mobile number:', mobileNumber);
    refHomeRBSheet.current.close(); // Close the first BottomSheet after saving

    // Open the second BottomSheet after saving the mobile number
    refHomeSecondRBSheet.current.open();
  };

  const handleEmailAddress = () => {
    console.log('Saved mobile number:', mobileNumber);
    refEmailRBSheet.current.close(); // Close the first BottomSheet after saving

    // Open the second BottomSheet after saving the mobile number
    refEmailSecondRBSheet.current.open();
  };

  const handleOtpChange = (value, index) => {
    if (/^[0-9]$/.test(value)) {
      const otpCopy = [...otp];
      otpCopy[index] = value;
      setOtp(otpCopy);

      if (value && index < 3) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === '') {
      const otpCopy = [...otp];
      otpCopy[index] = '';
      setOtp(otpCopy);

      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleVerify = () => {
    console.log('OTP Verified');
    setOtp(['', '', '', '']); // Clear OTP state after verification
    refSecondRBSheet.current.close(); // Close the second BottomSheet
  };

  const handleHomeVerify = () => {
    console.log('OTP Verified');
    setOtp(['', '', '', '']); // Clear OTP state after verification
    refHomeSecondRBSheet.current.close(); // Close the second BottomSheet
  };

  const handleEmailVerify = () => {
    console.log('OTP Verified');
    setOtp(['', '', '', '']); // Clear OTP state after verification
    refEmailSecondRBSheet.current.close(); // Close the second BottomSheet
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headingContainer}>
        {!isEditing ? (
          <Text style={style.headingText}>Contact Details</Text>
        ) : (
          <Text style={style.headingText}>Modify Contact Details</Text>
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
            <Text style={style.tittleText}>Mobile Number</Text>
            <Text style={style.subTittleText}>+91 {mobileNumber} </Text>

            <View style={style.subTittleContainer}>
              <Text style={style.tittleText}>Home Number</Text>
              <Text style={style.subTittleText}>+91 {homeNumber} </Text>
            </View>

            <View style={[style.subTittleContainer, {marginBottom: hp(25)}]}>
              <Text style={style.tittleText}>Email</Text>
              <Text style={style.subTittleText}>{email}</Text>
            </View>
          </View>
        ) : (
          <>
            <View style={style.bodyContainerStyle}>
              <Text style={style.tittleText}>Mobile Number</Text>
              <TouchableOpacity
                onPress={() => refRBSheet.current.open()}
                style={style.subTittleContainerStyle}>
                <Text style={style.subTittleText}>+91 {mobileNumber}</Text>

                <Image
                  source={icons.rightSideIcon}
                  style={style.rightSideIcon}
                />
              </TouchableOpacity>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Home Number</Text>

                <TouchableOpacity
                  onPress={() => refHomeRBSheet.current.open()}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>+91 {homeNumber}</Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={style.subTittleContainer}>
                <Text style={style.tittleText}>Email</Text>

                <TouchableOpacity
                  onPress={() => refEmailRBSheet.current.open()}
                  style={style.subTittleContainerStyle}>
                  <Text style={style.subTittleText}>{email}</Text>
                  <Image
                    source={icons.rightSideIcon}
                    style={style.rightSideIcon}
                  />
                </TouchableOpacity>

                {/* First BottomSheet - Update Mobile Number */}
                <RBSheet
                  ref={refRBSheet}
                  closeOnDragDown={true}
                  closeOnPressMask={true}
                  height={350} // Height of the BottomSheet
                  openDuration={250} // Duration for animation
                  customStyles={{
                    draggableIcon: {
                      backgroundColor: colors.gray,
                    },
                    container: {
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    },
                  }}>
                  <View style={{flex: 1, backgroundColor: 'white'}}>
                    <Text
                      style={{
                        marginHorizontal: 31,
                        color: colors.black,
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins500,
                        marginTop: hp(5),
                      }}>
                      Update Mobile Number
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
                          marginTop: hp(51),
                          width: '100%',
                        }}
                        value={mobileNumber}
                        onChangeText={setMobileNumber}
                        keyboardType="phone-pad"
                        placeholder="Enter Mobile Number"
                        placeholderTextColor={colors.gray}
                      />

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleSaveMobile}>
                        <LinearGradient
                          colors={['#0F52BA', '#8225AF']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 1.2}}
                          style={{
                            width: hp(162),
                            height: hp(44),
                            borderRadius: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginTop: hp(75),
                          }}>
                          <Text style={style.bottomSheetAddButtonText}>
                            Send OTP
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </RBSheet>

                {/* Second BottomSheet - Verify Mobile Number */}
                <RBSheet
                  ref={refSecondRBSheet}
                  height={hp(360)} // Height of the second BottomSheet
                  openDuration={250} // Duration for animation
                  customStyles={{
                    container: {
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    },
                  }}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'white',
                      paddingHorizontal: 25,
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins500,
                        marginBottom: hp(10),
                        marginTop: hp(27),
                        textAlign: 'center',
                        color: colors.black,
                      }}>
                      Verify Mobile Number
                    </Text>

                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#AEAEAE',
                        fontSize: fontSize(14),
                        lineHeight: hp(21),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      OTP sent on
                      <Text style={{color: 'black'}}> +91 {mobileNumber}</Text>
                    </Text>

                    {/*<View*/}
                    {/*  style={{*/}
                    {/*    width: '100%',*/}
                    {/*    height: 1,*/}
                    {/*    backgroundColor: '#E7E7E7',*/}
                    {/*    marginTop: hp(15),*/}
                    {/*  }}*/}
                    {/*/>*/}

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: wp(330),
                        height: hp(150),
                      }}>
                      {otp.map((digit, index) => (
                        <TextInput
                          key={index}
                          value={digit}
                          onChangeText={value => handleOtpChange(value, index)}
                          keyboardType="numeric"
                          maxLength={1}
                          secureTextEntry={false}
                          style={[
                            {
                              width: wp(60),
                              height: hp(50),
                              textAlign: 'center',
                              fontSize: fontSize(24),
                              borderBottomWidth: 1,
                              borderBottomColor: '#D9D9D9',
                              fontWeight: 'bold',
                            },
                            digit
                              ? {borderBottomColor: colors.black}
                              : {borderBottomColor: '#D9D9D9'},
                            digit ? {color: colors.black} : {color: '#D9D9D9'},
                          ]}
                          ref={ref => (inputRefs.current[index] = ref)}
                          placeholder="0"
                          placeholderTextColor="#D9D9D9"
                        />
                      ))}
                    </View>

                    <Text
                      style={{
                        top: -15,
                        textAlign: 'center',
                        color: '#A3A3A3',
                        fontSize: fontSize(14),
                        lineHeight: hp(21),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Resend in <Text style={{color: 'black'}}>48 Sec.</Text>
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handleVerify}>
                      <LinearGradient
                        colors={['#0F52BA', '#8225AF']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1.2}}
                        style={{
                          width: hp(162),
                          height: hp(44),
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                          marginTop: hp(40),
                        }}>
                        <Text style={style.bottomSheetAddButtonText}>
                          Verify
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </RBSheet>

                {/* First BottomSheet - Update Home Number */}
                <RBSheet
                  ref={refHomeRBSheet}
                  closeOnDragDown={true}
                  closeOnPressMask={true}
                  height={350} // Height of the BottomSheet
                  openDuration={250} // Duration for animation
                  customStyles={{
                    draggableIcon: {
                      backgroundColor: colors.gray,
                    },
                    container: {
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    },
                  }}>
                  <View style={{flex: 1, backgroundColor: 'white'}}>
                    <Text
                      style={{
                        marginHorizontal: 31,
                        color: colors.black,
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins500,
                        marginTop: hp(5),
                      }}>
                      Update Home Number
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
                          marginTop: hp(51),
                          width: '100%',
                        }}
                        value={homeNumber}
                        onChangeText={setHomeNumber}
                        keyboardType="phone-pad"
                        placeholder="Enter Home Number"
                        placeholderTextColor={colors.gray}
                      />

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleSaveHome}>
                        <LinearGradient
                          colors={['#0F52BA', '#8225AF']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 1.2}}
                          style={{
                            width: hp(162),
                            height: hp(44),
                            borderRadius: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginTop: hp(75),
                          }}>
                          <Text style={style.bottomSheetAddButtonText}>
                            Send OTP
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </RBSheet>

                {/* Second BottomSheet - Verify Home Number */}
                <RBSheet
                  ref={refHomeSecondRBSheet}
                  height={hp(360)} // Height of the second BottomSheet
                  openDuration={250} // Duration for animation
                  customStyles={{
                    container: {
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    },
                  }}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'white',
                      paddingHorizontal: 25,
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins500,
                        marginBottom: hp(10),
                        marginTop: hp(27),
                        textAlign: 'center',
                        color: colors.black,
                      }}>
                      Verify Home Number
                    </Text>

                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#AEAEAE',
                        fontSize: fontSize(14),
                        lineHeight: hp(21),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      OTP sent on
                      <Text style={{color: 'black'}}> +91 {homeNumber}</Text>
                    </Text>

                    {/*<View*/}
                    {/*  style={{*/}
                    {/*    width: '100%',*/}
                    {/*    height: 1,*/}
                    {/*    backgroundColor: '#E7E7E7',*/}
                    {/*    marginTop: hp(15),*/}
                    {/*  }}*/}
                    {/*/>*/}

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: wp(330),
                        height: hp(150),
                      }}>
                      {otp.map((digit, index) => (
                        <TextInput
                          key={index}
                          value={digit}
                          onChangeText={value => handleOtpChange(value, index)}
                          keyboardType="numeric"
                          maxLength={1}
                          secureTextEntry={false}
                          style={[
                            {
                              width: wp(60),
                              height: hp(50),
                              textAlign: 'center',
                              fontSize: fontSize(24),
                              borderBottomWidth: 1,
                              borderBottomColor: '#D9D9D9',
                              fontWeight: 'bold',
                            },
                            digit
                              ? {borderBottomColor: colors.black}
                              : {borderBottomColor: '#D9D9D9'},
                            digit ? {color: colors.black} : {color: '#D9D9D9'},
                          ]}
                          ref={ref => (inputRefs.current[index] = ref)}
                          placeholder="0"
                          placeholderTextColor="#D9D9D9"
                        />
                      ))}
                    </View>

                    <Text
                      style={{
                        top: -15,
                        textAlign: 'center',
                        color: '#A3A3A3',
                        fontSize: fontSize(14),
                        lineHeight: hp(21),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Resend in <Text style={{color: 'black'}}>48 Sec.</Text>
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handleHomeVerify}>
                      <LinearGradient
                        colors={['#0F52BA', '#8225AF']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1.2}}
                        style={{
                          width: hp(162),
                          height: hp(44),
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                          marginTop: hp(40),
                        }}>
                        <Text style={style.bottomSheetAddButtonText}>
                          Verify
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </RBSheet>

                {/* First BottomSheet - Update Email */}
                <RBSheet
                  ref={refEmailRBSheet}
                  closeOnDragDown={true}
                  closeOnPressMask={true}
                  height={350} // Height of the BottomSheet
                  openDuration={250} // Duration for animation
                  customStyles={{
                    draggableIcon: {
                      backgroundColor: colors.gray,
                    },
                    container: {
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    },
                  }}>
                  <View style={{flex: 1, backgroundColor: 'white'}}>
                    <Text
                      style={{
                        marginHorizontal: 31,
                        color: colors.black,
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins500,
                        marginTop: hp(5),
                      }}>
                      Update Email Address
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
                          marginTop: hp(51),
                          width: '100%',
                          color: colors.black,
                        }}
                        value={email}
                        onChangeText={setEmail}
                        // keyboardType="phone-pad"
                        placeholder="Enter Email Address"
                        placeholderTextColor={colors.gray}
                      />

                      <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={handleEmailAddress}>
                        <LinearGradient
                          colors={['#0F52BA', '#8225AF']}
                          start={{x: 0, y: 0}}
                          end={{x: 1, y: 1.2}}
                          style={{
                            width: hp(162),
                            height: hp(44),
                            borderRadius: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginTop: hp(75),
                          }}>
                          <Text style={style.bottomSheetAddButtonText}>
                            Send OTP
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </RBSheet>

                {/* Second BottomSheet - Verify Email Address */}
                <RBSheet
                  ref={refEmailSecondRBSheet}
                  height={hp(360)} // Height of the second BottomSheet
                  openDuration={250} // Duration for animation
                  customStyles={{
                    container: {
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                    },
                  }}>
                  <View
                    style={{
                      flex: 1,
                      backgroundColor: 'white',
                      paddingHorizontal: 25,
                    }}>
                    <Text
                      style={{
                        fontSize: fontSize(16),
                        lineHeight: hp(24),
                        fontFamily: fontFamily.poppins500,
                        marginBottom: hp(10),
                        marginTop: hp(27),
                        textAlign: 'center',
                        color: colors.black,
                      }}>
                      Verify Email
                    </Text>

                    <Text
                      style={{
                        textAlign: 'center',
                        color: '#AEAEAE',
                        fontSize: fontSize(14),
                        lineHeight: hp(21),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      OTP sent on
                      <Text style={{color: 'black'}}> {email}</Text>
                    </Text>

                    {/*<View*/}
                    {/*  style={{*/}
                    {/*    width: '100%',*/}
                    {/*    height: 1,*/}
                    {/*    backgroundColor: '#E7E7E7',*/}
                    {/*    marginTop: hp(15),*/}
                    {/*  }}*/}
                    {/*/>*/}

                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: wp(330),
                        height: hp(150),
                      }}>
                      {otp.map((digit, index) => (
                        <TextInput
                          key={index}
                          value={digit}
                          onChangeText={value => handleOtpChange(value, index)}
                          keyboardType="numeric"
                          maxLength={1}
                          secureTextEntry={false}
                          style={[
                            {
                              width: wp(60),
                              height: hp(50),
                              textAlign: 'center',
                              fontSize: fontSize(24),
                              borderBottomWidth: 1,
                              borderBottomColor: '#D9D9D9',
                              fontWeight: 'bold',
                            },
                            digit
                              ? {borderBottomColor: colors.black}
                              : {borderBottomColor: '#D9D9D9'},
                            digit ? {color: colors.black} : {color: '#D9D9D9'},
                          ]}
                          ref={ref => (inputRefs.current[index] = ref)}
                          placeholder="0"
                          placeholderTextColor="#D9D9D9"
                        />
                      ))}
                    </View>

                    <Text
                      style={{
                        top: -15,
                        textAlign: 'center',
                        color: '#A3A3A3',
                        fontSize: fontSize(14),
                        lineHeight: hp(21),
                        fontFamily: fontFamily.poppins400,
                      }}>
                      Resend in <Text style={{color: 'black'}}>48 Sec.</Text>
                    </Text>

                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={handleEmailVerify}>
                      <LinearGradient
                        colors={['#0F52BA', '#8225AF']}
                        start={{x: 0, y: 0}}
                        end={{x: 1, y: 1.2}}
                        style={{
                          width: hp(162),
                          height: hp(44),
                          borderRadius: 50,
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center',
                          marginTop: hp(40),
                        }}>
                        <Text style={style.bottomSheetAddButtonText}>
                          Verify
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </RBSheet>

                <TouchableOpacity activeOpacity={0.7} onPress={handleSave}>
                  <LinearGradient
                    colors={['#0F52BA', '#8225AF']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0.5}}
                    style={style.saveButtonContainer}>
                    <Text style={style.bottomSheetAddButtonText}>
                      Save Changes
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AdminContactDetailsScreen;
