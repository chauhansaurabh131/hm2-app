import React, {useState} from 'react';
import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import style from './style';
import {icons, images} from '../../assets';
import {useNavigation} from '@react-navigation/native';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import NewTextInputWithDropDownComponents from '../../components/newTextInputWithDropDownComponents';
import {colors} from '../../utils/colors';

const HideDeleteProfileScreen = () => {
  const navigation = useNavigation();
  const [hideButtonGradient, setHideButtonGradient] = useState(true);
  const [showButtonGradient, setShowButtonGradient] = useState(false);
  const [showText, setShowText] = useState(true);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const dropdownItems = ['Option 1', 'Option 2', 'Option 3'];

  const handleHidePress = () => {
    setHideButtonGradient(true);
    setShowButtonGradient(false);
    setShowText(true); // Show the text when Hide button is pressed
    // Your hide functionality here
  };

  const handleShowPress = () => {
    setShowButtonGradient(true);
    setHideButtonGradient(false);
    setShowText(false); // Hide the text when Show button is pressed
    // Your show functionality here
  };

  const handleDeleteProfile = () => {
    setShowDeleteConfirmation(true); // Show delete confirmation text
  };

  const handleDeleteButtonPress = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
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

          <Text style={style.bodyTittleDescriptionText}>
            Your Profile is currently{' '}
            <Text style={style.bodyTittleDescriptionTexts}>Visible</Text>
          </Text>

          <View style={style.hideShowButtonContainer}>
            <TouchableOpacity onPress={handleHidePress} activeOpacity={0.7}>
              <LinearGradient
                colors={
                  hideButtonGradient
                    ? ['#0D4EB3', '#9413D0']
                    : ['#F7F7F7', '#F7F7F7']
                }
                start={{x: 0, y: 0}}
                end={{x: 1.1, y: 0}}
                style={style.ButtonStyle}>
                <Text
                  style={[
                    style.hideButtonTextStyle,
                    {color: hideButtonGradient ? 'white' : 'black'},
                  ]}>
                  Hide
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleShowPress}
              style={{marginLeft: wp(2)}}>
              <LinearGradient
                colors={
                  showButtonGradient
                    ? ['#0D4EB3', '#9413D0']
                    : ['#F7F7F7', '#F7F7F7']
                }
                start={{x: 0, y: 0}}
                end={{x: 1.1, y: 0}}
                style={style.ButtonStyle}>
                <Text
                  style={[
                    style.showButtonTextStyle,
                    {color: showButtonGradient ? 'white' : 'black'},
                  ]}>
                  Show
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Conditional rendering of text */}
          {showText && (
            <>
              <View style={style.descriptionBodyUnderlineStyle} />
              <Text style={style.hideTittleTextDescriptionStyle}>
                How long would you like to hide your Profile for?
              </Text>
              <Text style={style.hideTextDescriptionStyle}>
                Hiding your Profile will make it invisible temporarily.{' '}
                <Text>
                  Other members will not be able to send you Invitations
                </Text>
                <Text>or Messages or chat.</Text>
              </Text>

              {/*TEXT INPUT DROPDOWN*/}
              <View style={style.dropDownContainer}>
                <NewTextInputWithDropDownComponents
                  dropdownItems={dropdownItems}
                  placeholder="Select Duration"
                  editable={false}
                />
              </View>
            </>
          )}

          <View style={style.descriptionBodyUnderlineStyleDropdown} />

          <Text style={style.deleteProfileTextStyle}>Delete Your Profile</Text>

          <TouchableOpacity
            style={style.deleteButtonStyle}
            activeOpacity={0.7}
            onPress={handleDeleteProfile}>
            <Text style={style.deleteButtonTextStyle}>Delete My Profile</Text>
          </TouchableOpacity>

          {showDeleteConfirmation && (
            <>
              <Text style={style.deleteDescriptionText}>
                Let us know why you wish to delete your
              </Text>
              <Text style={[style.deleteDescriptionText, {marginTop: 0}]}>
                profile?
              </Text>

              <View style={{marginTop: hp(15)}}>
                <NewTextInputWithDropDownComponents
                  dropdownItems={dropdownItems}
                  placeholder="Found my Match on happymilan.com"
                  editable={false}
                />
              </View>

              <View
                style={[style.descriptionBodyUnderlineStyle, {marginTop: 19}]}
              />

              <TouchableOpacity
                style={style.processDeleteButtonContainer}
                activeOpacity={0.7}
                onPress={handleDeleteButtonPress}>
                <LinearGradient
                  colors={['#0D4EB3', '#9413D0']}
                  start={{x: 0, y: 0}}
                  end={{x: 1.1, y: 0}}
                  style={style.processDeleteButtonStyle}>
                  <Text style={style.processDeleteButtonText}>
                    Proceed to Delete
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              <View style={style.screenBottomSpace} />
            </>
          )}
        </View>
      </ScrollView>

      {/*MODAL*/}

      <View style={style.modalContainer}>
        <Modal
          animationType="slide"
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
                      width: wp(98),
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
                    <Text style={style.confirmButtonTextStyle}>Confirm</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default HideDeleteProfileScreen;
