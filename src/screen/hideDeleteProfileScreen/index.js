import React, {Fragment, useEffect, useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import style from './style';
import {icons, images} from '../../assets';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

import {CurrentCity} from '../../utils/data';
import DropDownTextInputComponent from '../../components/DropDownTextInputComponent';
import CommonGradientButton from '../../components/commonGradientButton';

const HideDeleteProfileScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectDurationModal, setSelectDurationModal] = useState(false);

  const [hideButtonGradient, setHideButtonGradient] = useState(false);
  const [showButtonGradient, setShowButtonGradient] = useState(true);
  const [showText, setShowText] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleteButtonPressed, setIsDeleteButtonPressed] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);

  const SELECT_DURATION = [
    {label: '1 Week', value: '1'},
    {label: '2 Week', value: '2'},
    {label: '1 Month', value: '3'},
    {label: '3 Month', value: '4'},
    {label: '6 Month', value: '5'},
  ];

  const SELECT_REASON = [
    {label: 'Found My Match', value: '1'},
    {label: 'Wants to take a break', value: '2'},
    {label: 'Not Satisfied by matches', value: '3'},
    {label: 'Other Reason', value: '4'},
  ];

  // const handleBackdropPress = () => {
  //   setIsOpen(false);
  // };

  // const handleHidePress = () => {
  //   setHideButtonGradient(true);
  //   setShowButtonGradient(false);
  //   setShowText(true);
  // };

  // const handleShowPress = () => {
  //   setShowButtonGradient(true);
  //   setHideButtonGradient(false);
  //   setShowText(false);
  // };

  // const handleDeleteProfile = () => {
  //   setShowDeleteConfirmation(true);
  //   setIsDeleteButtonPressed(true);
  // };

  const handleDeleteButtonPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const selectSetDurationModalOPen = () => {
    setSelectDurationModal(true);
  };

  const SelectSetDurationModalClose = () => {
    setSelectDurationModal(false);
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={style.headerContainerView}>
        <View style={style.headerContainerStyle}>
          <Image
            source={images.happyMilanColorLogo}
            style={style.customerHeaderImage}
          />
          <Image
            source={images.profileDisplayImage}
            style={style.profileImageStyle}
          />
        </View>
        <View style={style.headingTittleContainer}>
          <Image
            source={icons.delete_Profile_icon}
            style={style.headingCredentialsImageStyle}
          />
          <Text style={style.headingCredentialsText}>Hide/Delete Profile</Text>
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

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={style.bodyContainerView}>
          <Text style={style.bodyTittleTextStyle}>Hide Profile</Text>

          <View style={style.tittleDescriptionTextContainer}>
            <Text style={style.tittleDescriptionTextStyle}>
              Taking this action makes your profile
            </Text>
            <Text style={style.tittleDescriptionTextStyle}>
              temporarily invisible. Invites or chats are
            </Text>
            <Text style={style.tittleDescriptionTextStyle}>inaccessible</Text>
          </View>

          <DropDownTextInputComponent
            data={SELECT_DURATION}
            placeholder={'Select Duration'}
            searchPlaceholder={'Search Select Duration'}
            height={55}
            placeholderStyle={{color: colors.black, marginLeft: 15}}
          />

          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <CommonGradientButton
              onPress={selectSetDurationModalOPen}
              buttonName={'Hide'}
              containerStyle={{
                width: wp(107),
                height: hp(50),
                marginTop: hp(15),
              }}
            />
          </View>

          <View style={style.descriptionBodyUnderlineStyleDropdown} />

          <View style={{marginTop: hp(19)}}>
            <Text style={style.bodyTittleTextStyle}>Delete Your Profile</Text>

            <Text
              style={[style.tittleDescriptionTextStyle, {marginTop: hp(9)}]}>
              You'll lose all profile details, Match interactions,
            </Text>
            <Text
              style={[
                style.tittleDescriptionTextStyle,
                {marginBottom: hp(16)},
              ]}>
              and paid memberships permanently.
            </Text>

            <DropDownTextInputComponent
              data={SELECT_REASON}
              placeholder={'Select Reason'}
              searchPlaceholder={'Search Select Reason'}
              height={55}
              placeholderStyle={{
                color: colors.black,
                marginLeft: hp(15),
              }}
            />

            <TouchableOpacity
              onPress={handleDeleteButtonPress}
              activeOpacity={0.7}
              style={{flex: 1, alignItems: 'flex-end', marginTop: hp(15)}}>
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                start={{x: 0, y: 0}}
                end={{x: 0.9, y: 0.7}}
                style={{
                  width: wp(107),
                  height: hp(50),
                  borderRadius: 10,
                  justifyContent: 'center',
                }}>
                <Text style={{color: colors.white, textAlign: 'center'}}>
                  Delete
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/*MODAL FOR DELETE*/}

      <View style={style.modalContainer}>
        <Modal
          animationType="none"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleModalClose}>
          <View style={style.modalBodyContainer}>
            <View style={style.modalBodyStyle}>
              <View style={style.modalTittleContainer}>
                <Text style={style.modalTittleText}>Are you sure want</Text>

                <Text style={style.modalTittleDescriptionText}>
                  Delete Your Profile?
                </Text>
              </View>

              <View style={style.modalButtonContainer}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleModalClose}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    style={{
                      width: wp(126),
                      height: hp(50),
                      borderRadius: 10,
                      borderWidth: 1,
                      justifyContent: 'center',
                      borderColor: 'transparent', // Set border color to transparent
                    }}>
                    <View
                      style={{
                        borderRadius: 10, // <-- Inner Border Radius
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
                          fontSize: fontSize(14),
                          lineHeight: hp(21),
                          fontFamily: fontFamily.poppins600,
                        }}>
                        Not Now
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleModalClose}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={style.confirmButtonStyle}>
                    <Text style={style.confirmButtonTextStyle}>Yes, Hide</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          animationType="none"
          transparent={true}
          visible={selectDurationModal}
          onRequestClose={SelectSetDurationModalClose}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}>
            <View
              style={{
                width: wp(340),
                height: hp(264),
                backgroundColor: 'white',
                padding: 20,
                borderRadius: 10,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fontSize(20),
                  lineHeight: hp(30),
                  color: colors.black,
                }}>
                Are you sure want
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: fontSize(14),
                  lineHeight: hp(21),
                  color: colors.black,
                  marginTop: hp(3),
                }}>
                Delete Your Profile?
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 50,
                  justifyContent: 'space-evenly',
                  // backgroundColor: 'grey',
                  // marginHorizontal: 34,
                }}>
                {/*<CommonGradientButton*/}
                {/*  buttonName={'not now'}*/}
                {/*  containerStyle={{width: wp(126), height: hp(50)}}*/}
                {/*/>*/}

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={SelectSetDurationModalClose}>
                  <LinearGradient
                    colors={['#0D4EB3', '#9413D0']}
                    style={{
                      width: wp(126),
                      height: hp(50),
                      borderRadius: 10,
                      borderWidth: 1,
                      justifyContent: 'center',
                      borderColor: 'transparent', // Set border color to transparent
                    }}>
                    <View
                      style={{
                        borderRadius: 10, // <-- Inner Border Radius
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
                          fontSize: fontSize(14),
                          lineHeight: hp(21),
                          fontFamily: fontFamily.poppins600,
                        }}>
                        Not Now
                      </Text>
                    </View>
                  </LinearGradient>
                </TouchableOpacity>

                <CommonGradientButton
                  onPress={SelectSetDurationModalClose}
                  buttonName={'Yes, Hide'}
                  containerStyle={{width: wp(126), height: hp(50)}}
                />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default HideDeleteProfileScreen;
