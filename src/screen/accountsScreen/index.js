import React, {useCallback, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import style from './style';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {icons, images} from '../../assets';
import {colors} from '../../utils/colors';
import navigations from '../../navigations';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {useFocusEffect} from '@react-navigation/native';

const AccountsScreen = ({navigation}) => {
  const [topModalVisible, setTopModalVisible] = useState(false);

  const toggleModal = () => {
    // console.log(' === toggleModal ===> ', topModalVisible);
    setTopModalVisible(!topModalVisible);
  };

  useFocusEffect(
    useCallback(() => {
      setTopModalVisible(false);
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

          <Image
            source={images.profileDisplayImage}
            style={style.profileImageStyle}
          />
        </View>

        <Text style={style.headerTittleStyle}>Account Setting</Text>
      </View>

      <View style={style.underLineHeaderStyle} />

      <HomeTopSheetComponent
        isVisible={topModalVisible}
        onBackdropPress={toggleModal}
        onBackButtonPress={toggleModal}
      />

      {/*BODY*/}

      <ScrollView>
        <View style={style.bodyDescriptionStyle}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => {
              navigation.navigate('CredentialsScreen');
            }}>
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
                <Text style={style.credentialTittleText}>Login Details</Text>
                <Text style={style.credentialDescriptionTextStyle}>
                  This menu lets users update and manage authentication{'\n'}
                  info for secure access
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={style.descriptionBodyUnderlineStyle} />

          <TouchableOpacity
            activeOpacity={0.5}
            style={{marginTop: hp(16)}}
            onPress={() => {
              navigation.navigate('HideDeleteProfileScreen');
            }}>
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
                <Text style={style.credentialTittleText}>Profile Setting</Text>
                <Text style={style.credentialDescriptionTextStyle}>
                  This menu enables users to conceal or delete their{'\n'}
                  profile from public visibility
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={style.descriptionBodyUnderlineStyle} />

          <TouchableOpacity
            activeOpacity={0.5}
            style={{marginTop: hp(16)}}
            onPress={() => {
              navigation.navigate('PrivacyScreen');
            }}>
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
                <Text style={style.credentialTittleText}>Privacy Setting</Text>
                <Text style={style.credentialDescriptionTextStyle}>
                  This menu enables users to conceal or delete their{'\n'}
                  profile from public visibility
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={style.descriptionBodyUnderlineStyle} />

          <TouchableOpacity
            activeOpacity={0.5}
            style={{marginTop: hp(16)}}
            onPress={() => {
              navigation.navigate('EmailSmsAlertScreen');
            }}>
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
                <Text style={style.credentialTittleText}>Notification</Text>
                <Text style={style.credentialDescriptionTextStyle}>
                  This menu enables users to conceal or delete their{'\n'}
                  profile from public visibility
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={style.descriptionBodyUnderlineStyle} />

          <TouchableOpacity
            activeOpacity={0.5}
            style={{marginTop: hp(16)}}
            onPress={() => {
              navigation.navigate('PlanScreen');
            }}>
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
                <Text style={style.credentialTittleText}>Plan</Text>
                <Text style={style.credentialDescriptionTextStyle}>
                  In this menu, you'll see the plan you've purchased and{'\n'}
                  the payment method used for the purchase.
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View style={style.descriptionBodyUnderlineStyle} />

          <TouchableOpacity
            activeOpacity={0.5}
            style={{marginTop: hp(16)}}
            onPress={() => {
              navigation.navigate('KycDetailsScreen');
            }}>
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
                  In this menu, you'll see the plan you've purchased and{'\n'}
                  the payment method used for the purchase.
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <View style={style.descriptionBodyUnderlineStyle} />

          <View style={{height: 50}} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AccountsScreen;
