import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {fontSize, hp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import axios from 'axios';
import ProfileAvatar from '../../components/letterProfileComponent';

const AccountsScreen = ({navigation}) => {
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [kycData, setKycData] = useState(null); // State to hold KYC data
  const [planData, setPlanData] = useState(null);

  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userId = user?.user?.id;

  const userImage = user?.user?.profilePic;

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  useEffect(() => {
    const fetchPlanData = async () => {
      try {
        const token = user?.tokens?.access?.token;
        if (token) {
          const response = await axios.get(
            'https://stag.mntech.website/api/v1/user/user/checkPlan',
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          setPlanData(response.data);
          console.log('API Response:', response.data);
        } else {
          Alert.alert('Error', 'No access token found.');
        }
      } catch (error) {
        console.error('API Error:', error);
        Alert.alert('Error', 'Failed to fetch plan data.');
      } finally {
        console.log(' === err ===> ');
      }
    };

    fetchPlanData();
  }, []);

  const onPrivacyScreenHandle = () => {
    if (planData) {
      navigation.navigate('PrivacyScreen', {planData: planData.data}); // Pass data to Abc screen
    } else {
      Alert.alert('Error', 'No plan data available to pass.');
    }
  };

  // Function to fetch KYC details
  const fetchKycDetails = async () => {
    try {
      const response = await fetch(
        `https://stag.mntech.website/api/v1/user/kyc/by-user/${userId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`, // Use your auth token here
          },
        },
      );

      if (response.ok) {
        const result = await response.json();
        console.log('KYC Details:', result);

        // Save the last KYC details to state
        const kycDataArray = result?.data;
        if (kycDataArray && kycDataArray.length > 0) {
          setKycData(kycDataArray[kycDataArray.length - 1]); // Get the last item
        }
      } else {
        console.error('Failed to fetch KYC details');
        Toast.show({
          type: 'error',
          text1: 'Failed to Fetch KYC',
          text2: 'Could not retrieve KYC details.',
        });
      }
    } catch (error) {
      console.error('Error fetching KYC details:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while fetching KYC details.',
      });
    }
  };

  useFocusEffect(
    useCallback(() => {
      setTopModalVisible(false);
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      fetchKycDetails();
    }, []),
  );

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />

          {/*<TouchableOpacity activeOpacity={0.7} onPress={openTopSheetModal}>*/}
          <TouchableOpacity activeOpacity={0.7} onPress={openBottomSheet}>
            {userImage ? (
              <Image
                source={{uri: userImage}}
                style={style.profileImageStyle}
              />
            ) : (
              <ProfileAvatar
                firstName={user?.user?.firstName}
                lastName={user?.user?.lastName}
                textStyle={style.profileImageStyle}
                profileTexts={{fontSize: fontSize(10)}}
              />
            )}

            {/*<Image*/}
            {/*  source={userImage ? {uri: userImage} : images.empty_male_Image}*/}
            {/*  style={style.profileImageStyle}*/}
            {/*/>*/}
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <Text style={style.headerTittleStyle}>Account Setting</Text>
      </View>

      <View style={style.underLineHeaderStyle} />

      <HomeTopSheetComponent
        isVisible={topModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
      />

      {/*BODY*/}

      <ScrollView showsVerticalScrollIndicator={false}>
        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#F9FBFF"
          onPress={() => {
            navigation.navigate('CredentialsScreen');
          }}>
          <View style={style.bodyDescriptionStyle}>
            <View
            // activeOpacity={0.5}
            // onPress={() => {
            //   navigation.navigate('CredentialsScreen');
            // }}
            >
              <View style={style.bodyDescription}>
                <View style={{width: 25}}>
                  <Image
                    source={icons.logLogo}
                    style={style.credentialsIconStyle}
                  />
                </View>

                <Image
                  source={icons.rightSideIcon}
                  style={style.sideArrowImageStyle}
                />
                <View style={style.credentialTittleContainer}>
                  <Text style={style.credentialTittleText}>Login Info</Text>
                  <Text style={style.credentialDescriptionTextStyle}>
                    Manage your email, password, and account{'\n'}login
                    credentials. Helps keep your account{'\n'}secure and
                    updated.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>

        <View style={style.descriptionBodyUnderlineStyle} />

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#F9FBFF"
          onPress={() => {
            navigation.navigate('HideDeleteProfileScreen');
          }}>
          <View
            style={{
              marginHorizontal: 17,
              // backgroundColor: 'red',
              marginBottom: 15,
            }}>
            <View
              // activeOpacity={0.9}
              style={{marginTop: hp(16)}}
              // onPress={() => {
              //   navigation.navigate('HideDeleteProfileScreen');
              // }}
            >
              <View style={style.bodyDescription}>
                <View style={{width: 25}}>
                  <Image
                    source={icons.settingIcon}
                    style={style.deleteProfileIconStyle}
                  />
                </View>

                <Image
                  source={icons.rightSideIcon}
                  style={style.sideArrowImageStyle}
                />
                <View style={style.credentialTittleContainer}>
                  <Text style={style.credentialTittleText}>
                    Profile Visibility
                  </Text>
                  <Text style={style.credentialDescriptionTextStyle}>
                    Allows users to hide or delete their profile from{'\n'}
                    public view. Useful for maintaining privacy or{'\n'}
                    temporarily deactivating the account.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>

        <View style={style.descriptionBodyUnderlineStyle} />

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#F9FBFF"
          // onPress={() => {
          //   navigation.navigate('PrivacyScreen');
          // }}
          onPress={() => {
            onPrivacyScreenHandle();
          }}>
          <View style={{marginHorizontal: 17, marginBottom: 15}}>
            <View
              // activeOpacity={0.5}
              style={{marginTop: hp(16)}}
              // onPress={() => {
              //   navigation.navigate('PrivacyScreen');
              // }}
            >
              <View style={style.bodyDescription}>
                <View style={{width: 25}}>
                  <Image
                    source={icons.privacy_setting_icon}
                    style={style.privacyIconStyle}
                  />
                </View>

                <Image
                  source={icons.rightSideIcon}
                  style={style.sideArrowImageStyle}
                />
                <View style={style.credentialTittleContainer}>
                  <Text style={style.credentialTittleText}>
                    Privacy Setting
                  </Text>
                  <Text style={style.credentialDescriptionTextStyle}>
                    Control who can see your profile, activity,{'\n'}or contact
                    you. Adjust visibility and{'\n'}data-sharing preferences.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>

        <View style={style.descriptionBodyUnderlineStyle} />

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#F9FBFF"
          onPress={() => {
            navigation.navigate('TwoFactorAuthenticationScreen', {kycData});
          }}>
          <View style={{marginHorizontal: 17, marginBottom: 15}}>
            <View style={{marginTop: hp(16)}}>
              <View style={style.bodyDescription}>
                <View style={{width: 25}}>
                  <Image
                    source={icons.two_factor_icon}
                    style={style.emailSmsIconStyle}
                  />
                </View>

                <Image
                  source={icons.rightSideIcon}
                  style={style.sideArrowImageStyle}
                />
                <View style={style.credentialTittleContainer}>
                  <Text style={style.credentialTittleText}>Enable 2FA</Text>
                  <Text style={style.credentialDescriptionTextStyle}>
                    Activate two-factor authentication for added{'\n'}security.
                    Requires a second verification step{'\n'}during login.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>

        <View style={style.descriptionBodyUnderlineStyle} />

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#F9FBFF"
          onPress={() => {
            navigation.navigate('PlanScreen');
          }}>
          <View style={{marginHorizontal: 17, marginBottom: 15}}>
            <View
              // activeOpacity={0.5}
              style={{marginTop: hp(16)}}
              // onPress={() => {
              //   navigation.navigate('PlanScreen');
              // }}
            >
              <View style={style.bodyDescription}>
                <View style={{width: 25}}>
                  <Image
                    source={icons.plan_icon}
                    style={style.emailSmsIconStyle}
                  />
                </View>

                <Image
                  source={icons.rightSideIcon}
                  style={style.sideArrowImageStyle}
                />
                <View style={style.credentialTittleContainer}>
                  <Text style={style.credentialTittleText}>Plan Details</Text>
                  <Text style={style.credentialDescriptionTextStyle}>
                    View your subscription plan and renewal info.{'\n'}Upgrade
                    anytime for more features.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>

        <View style={style.descriptionBodyUnderlineStyle} />

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#F9FBFF"
          onPress={() => {
            navigation.navigate('KycDetailsScreen', {kycData});
          }}>
          <View style={{marginHorizontal: 17, marginBottom: 15}}>
            <View
              // activeOpacity={0.5}
              style={{marginTop: hp(16)}}
              // onPress={() => {
              //   navigation.navigate('KycDetailsScreen', {kycData});
              // }}
            >
              <View style={style.bodyDescription}>
                <View style={{width: 25}}>
                  <Image
                    source={icons.kyc_icon}
                    style={style.emailSmsIconStyle}
                  />
                </View>

                <Image
                  source={icons.rightSideIcon}
                  style={style.sideArrowImageStyle}
                />
                <View style={style.credentialTittleContainer}>
                  <Text style={style.credentialTittleText}>KYC Details</Text>
                  <Text style={style.credentialDescriptionTextStyle}>
                    Submit or update identity verification documents.{'\n'}
                    Ensures compliance and enhances platform trust.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>

        <View style={style.descriptionBodyUnderlineStyle} />

        <TouchableHighlight
          activeOpacity={0.6}
          underlayColor="#F9FBFF"
          onPress={() => {
            navigation.navigate('EmailSmsAlertScreen');
          }}>
          <View style={{marginHorizontal: 17, marginBottom: 15}}>
            <View
              // activeOpacity={0.5}
              style={{marginTop: hp(16)}}
              // onPress={() => {
              //   navigation.navigate('EmailSmsAlertScreen');
              // }}
            >
              <View style={style.bodyDescription}>
                <View style={{width: 25}}>
                  <Image
                    source={icons.notification_icon}
                    style={style.emailSmsIconStyle}
                  />
                </View>

                <Image
                  source={icons.rightSideIcon}
                  style={style.sideArrowImageStyle}
                />
                <View style={style.credentialTittleContainer}>
                  <Text style={style.credentialTittleText}>Notifications</Text>
                  <Text style={style.credentialDescriptionTextStyle}>
                    Manage how and when you receive alerts.{'\n'}Choose between
                    email, SMS, or app notifications.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>

        <View style={style.descriptionBodyUnderlineStyle} />

        <View style={{height: 50}} />
        {/*</View>*/}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountsScreen;
