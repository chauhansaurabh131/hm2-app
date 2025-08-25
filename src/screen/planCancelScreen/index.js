import React, {useRef, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {style} from './style';
import {icons, images} from '../../assets';
import ProfileAvatar from '../../components/letterProfileComponent';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';
import {useSelector} from 'react-redux';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {colors} from '../../utils/colors';
import RBSheet from 'react-native-raw-bottom-sheet';
import GradientButton from '../../components/GradientButton';

const PlanCancelScreen = () => {
  const route = useRoute();
  const {planDetails} = route.params || {};
  const {user} = useSelector(state => state.auth);
  const accessToken = user?.tokens?.access?.token;
  const userImage = user?.user?.profilePic;

  const userPlanId = planDetails?.id;
  const planId = planDetails?.planId?.id;
  // console.log(' === planDetails ===> ', planDetails?.planId?.id);

  const [text, setText] = useState('');
  const [otherText, setOtherText] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const refRBSheet = useRef();

  // console.log(' === planDetails ===> ', planDetails);

  const navigation = useNavigation();

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const reasonMapping = {
    'Accidental purchase / wrong plan selected': 'accidental-purchase',
    'Changed mind before using premium features': 'changed-mind',
    'Technical issues after upgrade (could not access features)':
      'technical-issues',
    'Other (Please Specify)': 'other',
  };

  const truncateText = (str, limit = 45) => {
    if (!str) {
      return '';
    }
    return str.length > limit ? str.substring(0, limit) + '...' : str;
  };

  const handleSubmit = async () => {
    if (!text) {
      Alert.alert('Please select a reason');
      return;
    }

    setLoading(true);

    const slug = reasonMapping[text] || '';
    const body = {
      userPlanId,
      planId,
      cancellationReason: slug,
      hasRequested: true,
    };

    // if Other is selected, add otherReason
    if (isOtherSelected && otherText.trim()) {
      body.otherReason = otherText.trim();
    }

    try {
      const response = await fetch(
        'https://stag.mntech.website/api/v1/user/cancel-plan-request/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        },
      );

      const result = await response.json();
      console.log('Cancel Plan Response:', result);

      if (response.ok) {
        // Alert.alert('Success', 'Your request has been submitted successfully');
        console.log(
          ' === Success ===> ',
          'Your request has been submitted successfully',
        );
        setModalVisible(true);
        // navigation.goBack();
      } else {
        // Alert.alert('Error', result?.message || 'Something went wrong');
        console.log(
          ' === Error ===> ',
          result?.message || 'Something went wrong',
        );
      }
    } catch (error) {
      console.error('Cancel Plan Error:', error);
      // Alert.alert('Error', 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />
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
          </TouchableOpacity>
        </View>
        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <View style={style.headingTittleContainer}>
          <Text style={style.headingCredentialsText}>Plan </Text>
          <TouchableOpacity
            style={style.backButtonContainer}
            onPress={() => navigation.goBack()}>
            <Image
              source={icons.back_arrow_icon}
              style={style.backButtonIconStyle}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={style.underLineHeaderStyle} />

      <View style={style.bodyHeaderContainer}>
        <Text style={style.bodyHeaderTittle}>
          *You may cancel within 24–48 hours of purchase if no premium{'\n'}
          features are used. Refunds are processed only after verification{'\n'}
          and if within the eligible window.{' '}
        </Text>

        <TouchableOpacity>
          <Text style={style.faqTextTittle}>More FAQs</Text>
        </TouchableOpacity>
      </View>

      <View style={style.mainBodyContainer}>
        <Text style={style.reasonTextStyle}>
          Select the Reason for Cancellation
        </Text>

        <View style={style.inputContainer}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => refRBSheet.current.open()}>
            <TextInput
              style={style.input}
              placeholder="Select Reason"
              placeholderTextColor="#888"
              value={truncateText(text, 45)}
              editable={false}
            />
            <Image source={icons.drooDownLogo} style={style.icon} />
          </TouchableOpacity>

          {isOtherSelected && (
            <View style={[style.inputContainer, {marginTop: 26}]}>
              <TextInput
                style={style.bigInput}
                placeholder="Describe the reason"
                placeholderTextColor="#C2C2C2"
                value={otherText}
                onChangeText={setOtherText}
                multiline
                textAlignVertical="top"
              />
            </View>
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            // onPress={() => {
            //   const slug = reasonMapping[text] || '';
            //   if (isOtherSelected) {
            //     console.log('Selected Reason:', slug); // "other"
            //     console.log('Other Reason:', otherText);
            //   } else {
            //     console.log('Selected Reason:', slug);
            //   }
            // }}
            onPress={!text ? null : handleSubmit}
            disabled={!text}>
            <LinearGradient
              colors={!text ? ['#0D4EB3', '#9413D0'] : ['#0D4EB3', '#9413D0']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0.5}}
              style={{
                marginTop: hp(31),
                width: '100%',
                height: hp(44),
                borderRadius: 25,
                justifyContent: 'center',
                opacity: !text ? 0.6 : 1,
              }}>
              {loading ? (
                <ActivityIndicator size="large" color="#FFFFFF" />
              ) : (
                <Text
                  style={{
                    color: colors.white,
                    textAlign: 'center',
                    fontSize: fontSize(14),
                    lineHeight: hp(22),
                    fontFamily: fontFamily.poppins500,
                  }}>
                  Submit Request
                </Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* BottomSheet */}
        <RBSheet
          ref={refRBSheet}
          height={hp(310)}
          openDuration={250}
          customStyles={{
            container: {
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              backgroundColor: 'white',
            },
          }}>
          <View style={{marginTop: hp(23)}}>
            <Text
              style={{
                fontSize: fontSize(16),
                marginBottom: 20,
                marginHorizontal: 30,
                fontFamily: fontFamily.poppins400,
                color: colors.pureBlack,
              }}>
              Select Reason
            </Text>

            <View
              style={{width: '100%', backgroundColor: '#E7E7E7', height: 1}}
            />

            <View style={{marginHorizontal: 30, marginTop: hp(31)}}>
              <TouchableOpacity
                onPress={() => {
                  setText('Accidental purchase / wrong plan selected');
                  setIsOtherSelected(false);
                  refRBSheet.current.close();
                }}>
                <Text style={{color: colors.pureBlack, fontSize: fontSize(16)}}>
                  Accidental purchase / wrong plan selected
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setText('Changed mind before using premium features');
                  setIsOtherSelected(false);
                  refRBSheet.current.close();
                }}
                style={style.option}>
                <Text style={{color: colors.pureBlack, fontSize: fontSize(16)}}>
                  Changed mind before using premium features
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setText(
                    'Technical issues after upgrade (could not access features)',
                  );
                  setIsOtherSelected(false);
                  refRBSheet.current.close();
                }}
                style={style.option}>
                <Text style={{color: colors.pureBlack, fontSize: fontSize(16)}}>
                  Technical issues after upgrade (could not access features)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setText('Other (Please Specify)');
                  setOtherText('');
                  setIsOtherSelected(true);
                  refRBSheet.current.close();
                }}
                style={style.option}>
                <Text style={{color: colors.pureBlack, fontSize: fontSize(16)}}>
                  Other (Please Specify)
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </RBSheet>

        <Modal
          visible={modalVisible}
          animationType="none"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}>
          <View style={style.modalOverlay}>
            <View style={style.modalContainer}>
              <Text
                style={{
                  fontSize: fontSize(14),
                  lineHeight: hp(20),
                  color: colors.pureBlack,
                  textAlign: 'center',
                  fontFamily: fontFamily.poppins400,
                }}>
                Your cancellation request has been{'\n'}received and is under
                review. We will{'\n'}notify you once it’s processed.
              </Text>

              <GradientButton
                onPress={() => {
                  setModalVisible(false);
                  navigation.goBack();
                }}
                buttonName={'Ok'}
                containerStyle={{
                  width: wp(93),
                  height: hp(44),
                  borderRadius: 50,
                  marginTop: hp(20),
                  marginBottom: hp(5),
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default PlanCancelScreen;
