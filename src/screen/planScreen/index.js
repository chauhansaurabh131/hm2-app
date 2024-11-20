import React, {useRef, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {style} from './style';
import {icons, images} from '../../assets';
import GradientText from '../../components/textGradientColor';
import LinearGradient from 'react-native-linear-gradient';
import CommonGradientButton from '../../components/commonGradientButton';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import {useSelector} from 'react-redux';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import NewProfileBottomSheet from '../../components/newProfileBottomSheet';

const PlanScreen = () => {
  const [topModalVisible, setTopModalVisible] = useState(false);

  const navigation = useNavigation();

  const {user} = useSelector(state => state.auth);
  const userImage = user?.user?.profilePic;

  const topModalBottomSheetRef = useRef(null);

  const openBottomSheet = () => {
    topModalBottomSheetRef.current.open();
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const openTopSheetModal = () => {
    toggleModal();
  };

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
            <Image
              source={userImage ? {uri: userImage} : images.empty_male_Image}
              style={style.profileImageStyle}
            />
          </TouchableOpacity>
        </View>

        <NewProfileBottomSheet bottomSheetRef={topModalBottomSheetRef} />

        <HomeTopSheetComponent
          isVisible={topModalVisible}
          onBackdropPress={toggleModal}
          onBackButtonPress={toggleModal}
        />

        <View style={style.headingTittleContainer}>
          {/*<Image*/}
          {/*  source={icons.notification_icon}*/}
          {/*  style={style.headingCredentialsImageStyle}*/}
          {/*/>*/}
          <Text style={style.headingCredentialsText}>Plan</Text>
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

      {/*BODY*/}

      <ScrollView>
        <View style={style.bodyBoxContainer}>
          <View style={style.boxStyle}>
            <Image
              source={images.plan_background_img}
              style={style.boxBackGroundImage}
            />
            <View style={style.imageTextContainer}>
              <Text style={style.currentPlanTextStyle}>
                You’re Current Plan
              </Text>

              <GradientText style={style.gradientColorText}>
                Silver - One Month Plan
              </GradientText>

              <Text style={style.yourPaidText}>You paid</Text>

              <Text style={style.priceText}>INR 599.00</Text>
            </View>

            <View style={style.imageBottomContainer}>
              <Text style={style.benefitText}>Benefits</Text>

              <View style={[style.descriptionTextContainer, {marginTop: 15}]}>
                <Image
                  source={icons.green_check_icon}
                  style={style.greenCheckIcon}
                />
                <Text style={style.descriptionText}>
                  Message to <Text style={style.textColor}>10 Profiles</Text>
                </Text>
              </View>

              <View style={style.descriptionTextContainer}>
                <Image
                  source={icons.green_check_icon}
                  style={style.greenCheckIcon}
                />
                <Text style={style.descriptionText}>
                  Send request to
                  <Text style={style.textColor}> 10 Profiles</Text>
                </Text>
              </View>

              <View style={style.descriptionTextContainer}>
                <Image
                  source={icons.green_check_icon}
                  style={style.greenCheckIcon}
                />
                <Text style={style.onlineText}>Online Support</Text>
              </View>

              <View style={style.planIssueContainer}>
                <View style={style.planIssueBody}>
                  <View>
                    <Text style={style.planTittle}>Date of Purchase</Text>
                    <Text style={style.issueTextStyle}>1st August 2024</Text>
                  </View>

                  <View>
                    <Text style={style.planTittle}>Status</Text>
                    <View style={style.leftContainerBody}>
                      <Text style={style.issueTextStyle}>Active</Text>
                      <Image
                        source={icons.green_check_icon}
                        style={style.checkIcon}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={style.planIssueContainer}>
                <View style={style.planIssueBody}>
                  <View>
                    <Text style={style.planTittle}>Payment Method</Text>
                    <Text style={style.issueTextStyle}>*****4533</Text>
                  </View>

                  <View>
                    <Text style={style.planTittle}>Auto Renewal</Text>
                    <View style={style.leftContainerBody}>
                      <Text style={style.issueTextStyle}>Disable</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={style.planIssueContainer}>
                <Text style={style.planTittle}>Date of Purchase</Text>
                <Text style={style.issueTextStyle}>1st August 2024</Text>
              </View>

              <View style={style.space} />
            </View>
          </View>

          <View style={style.notNowContainer}>
            <TouchableOpacity
              activeOpacity={0.7}
              // onPress={SelectSetDurationModalClose}
            >
              <LinearGradient
                colors={['#0D4EB3', '#9413D0']}
                style={style.gradientBorder}>
                <View style={style.gradientBorderTextContainer}>
                  <Text style={style.notNowText}>Not Now</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <CommonGradientButton
              // onPress={onHideProfilePress}
              buttonName={'Auto Renew'}
              containerStyle={style.autoRenewButton}
              buttonTextStyle={{
                fontSize: fontSize(14),
                lineHeight: hp(21),
                fontFamily: fontFamily.poppins400,
              }}
            />
          </View>
        </View>
        <View style={style.space} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PlanScreen;
