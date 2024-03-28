import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  Modal,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import style from './style';
import GradientText from '../../components/textGradientColor';
import {colors} from '../../utils/colors';
import GradientButton from '../../components/GradientButton';
import CustomHeaderLogo from '../../components/customHeaderLogo';

import LinearGradient from 'react-native-linear-gradient';
import {gif, icons, images} from '../../assets';
import StoryComponent from '../../components/storyComponent';
import HomeTopSheetComponent from '../../components/homeTopSheetComponent';
import PremiumMatchesFlatlistComponent from '../../components/premiumMatchesFlatlistComponent';
import {NEW_MATCHES, userData} from '../../utils/data';
import SuccessStoryFlatListComponent from '../../components/SuccessStoryFlatListComponent';
import {fontSize, hp, isIOS, wp} from '../../utils/helpers';
import FastImage from 'react-native-fast-image';
import CommonGradientButton from '../../components/commonGradientButton';
import GifImage from '@lowkey/react-native-gif';

const HomeScreen = ({navigation}) => {
  const [showModal, setShowModal] = useState(true);
  const [topModalVisible, setTopModalVisible] = useState(false);
  const [isCompleteModalVisible, setCompleteModalModalVisible] =
    useState(false);

  useEffect(() => {}, []);

  const closeWelcomeModal = () => {
    setShowModal(false);
  };

  const toggleModal = () => {
    setTopModalVisible(!topModalVisible);
  };

  const verificationModalToggle = () => {
    setCompleteModalModalVisible(false);
    navigation.navigate('GeneralInformationScreen');
  };

  const openTopSheetModal = () => {
    // Call toggleModal to show the top modal
    toggleModal();
  };

  const completeOpenModal = () => {
    setCompleteModalModalVisible(true);
  };

  return (
    <SafeAreaView style={style.container}>
      <View style={{marginHorizontal: 17}}>
        <View style={style.headerViewContainer}>
          {/*<CustomHeaderLogo headerImage={style.headerImageStyle} />*/}
          <Image
            source={images.happyMilanColorLogo}
            style={{
              width: wp(96),
              height: hp(24),
              resizeMode: 'contain',
              marginTop: hp(2),
            }}
          />

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={openTopSheetModal}
            style={style.headerTopSheetImageContainer}>
            <Image
              source={images.profileDisplayImage}
              style={style.headerTopSheetImageStyle}
            />
          </TouchableOpacity>
        </View>

        <View style={{marginTop: hp(15)}}>
          <StoryComponent />
        </View>

        <Modal
          visible={showModal}
          animationType="none"
          transparent
          presentationStyle="overFullScreen"
          onRequestClose={closeWelcomeModal}>
          <View style={style.modalContainer}>
            <View style={style.modalBodyContainer}>
              <GradientText style={style.modalHeadingText}>
                Congratulations
              </GradientText>

              {/*<FastImage*/}
              {/*  source={gif.congrats_modal}*/}
              {/*  style={{width: wp(150), height: hp(150)}}*/}
              {/*  // resizeMode={'stretch'}*/}
              {/*  resizeMode={FastImage.resizeMode.contain}*/}
              {/*/>*/}
              {/*<Image source={gif.congrats_modal} />*/}

              <View
                style={{
                  marginTop: 34,
                  alignItems: 'center',
                  // marginTop: -110,
                  // backgroundColor: 'green',
                }}>
                <Text style={style.modalSubTitleTextStyle}>
                  "New Beginnings, New Possibilities!
                </Text>
                <Text style={style.modalSubTitleTextStyle}>
                  Congratulations on Registering with
                </Text>
                <Text style={style.modalSubTitleTextStyle}>HappyMilan</Text>
              </View>

              {/*<GradientButton*/}
              {/*  buttonName={'Start Exploring'}*/}
              {/*  containerStyle={style.gradientButtonContainerStyle}*/}
              {/*  buttonTextStyle={{color: colors.white}}*/}
              {/*  onPress={closeWelcomeModal}*/}
              {/*/>*/}

              <CommonGradientButton
                buttonName={'Start Exploring'}
                onPress={closeWelcomeModal}
                containerStyle={{
                  width: wp(280),
                  height: hp(50),
                  marginTop: hp(50),
                }}
              />
            </View>
          </View>
        </Modal>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={style.cardContainer}>
            <LinearGradient
              colors={['#0D4EB3', '#9413D0']}
              start={{x: 0, y: 0}}
              end={{x: 0, y: 1.5}}
              style={style.cardBodyStyle}>
              <View style={style.cardViewStyle}>
                <Image
                  source={images.profileDisplayImage}
                  style={style.imageStyle}
                />
                <View style={style.cardTextContainer}>
                  <Text style={style.cardUserTextStyle}>Riya Shah</Text>

                  <View style={style.cardSubTittleContainer}>
                    <Text style={style.cardSubTittleTextStyle}>
                      HM 10000122
                    </Text>
                    <View style={style.cardCenterLineStyle} />
                    <Text style={style.cardSubTittleTextStyle}>
                      FREE Profile
                    </Text>
                  </View>

                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => {
                      navigation.navigate('Upgrader');
                    }}
                    style={style.cardButtonContainer}>
                    <View style={style.cardButtonBodyStyle}>
                      <View style={style.cardButtonTextContainer}>
                        <Text style={style.cardButtonTextStyle}>upgrade</Text>
                        <Image
                          source={icons.crownIcon}
                          style={style.cardButtonImageStyle}
                        />
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/*TOP SHEET*/}
          <HomeTopSheetComponent
            isVisible={topModalVisible}
            onBackdropPress={toggleModal}
            onBackButtonPress={toggleModal}
          />

          <View style={style.premiumTextContainer}>
            <Text style={style.premiumTextStyle}>Premium Matches</Text>
            <Text style={style.premiumTextsStyle}>110</Text>
          </View>

          {/*PREMIUM MATCHES COMPONENT*/}
          <View style={style.PremiumMatchesTextContainer}>
            <PremiumMatchesFlatlistComponent
              data={userData}
              isOnline
              shareButtonPress={completeOpenModal}
              // shareButtonPress={() => {
              //   console.log(' === var ===> ', 'press');
              // }}
            />
          </View>

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={style.showMeAllTextStyle}>Show Me All</Text>
          </TouchableOpacity>

          <View style={style.premiumTextContainer}>
            <Text style={style.premiumTextStyle}>New Matches</Text>
            <Text style={style.premiumTextsStyle}>42</Text>
          </View>

          {/*<NewMatchesFlatlistComponent />*/}
          <PremiumMatchesFlatlistComponent
            data={NEW_MATCHES}
            shareButtonPress={() => {
              console.log(' === var ===> ', 'New Matches Share Button Press');
            }}
          />

          <TouchableOpacity activeOpacity={0.7}>
            <Text style={style.showMeAllTextStyle}>Show Me All</Text>
          </TouchableOpacity>

          <View style={style.premiumTextContainer}>
            <Text style={style.premiumTextStyle}>Success Stories</Text>
          </View>

          <SuccessStoryFlatListComponent />

          {/*VERIFICATION MODAL OPEN */}

          <View style={style.verificationModalContainer}>
            {/*<Button title="Open Modal" onPress={openModal} />*/}

            <Modal
              visible={isCompleteModalVisible}
              animationType="none"
              transparent={true}
              // onBackdropPress={verificationModalToggle}
              // onBackdropPress={setCompleteModalModalVisible(false)}
              // onRequestClose={closeModal}
            >
              <View style={style.verificationModalContainerStyle}>
                <View style={style.verificationModalBodyStyle}>
                  <Text style={style.verificationModalHeadingStyle}>
                    Please complete your profile
                  </Text>
                  {/*<Button title="Close Modal" onPress={closeModal} />*/}

                  {/*<FastImage*/}
                  {/*  source={gif.verification_modal}*/}
                  {/*  style={{*/}
                  {/*    width: '80%',*/}
                  {/*    height: 150,*/}
                  {/*    marginLeft: 40,*/}
                  {/*  }}*/}
                  {/*  resizeMode={'stretch'}*/}
                  {/*/>*/}

                  <Image
                    source={gif.register_modal}
                    style={{height: 100, width: 100, backgroundColor: 'red'}}
                    resizeMode={'contain'}
                  />

                  {/*<FastImage*/}
                  {/*  source={gif.register_modal}*/}
                  {/*  style={{width: 150, height: 150}}*/}
                  {/*/>*/}

                  <View style={style.verificationDescriptionStyle}>
                    <Text style={style.verificationDescriptionText}>
                      A comprehensive profile enables us to provide
                    </Text>

                    <Text style={style.verificationDescriptionText}>
                      recise match recommendations, ensuring
                    </Text>

                    <Text style={style.verificationDescriptionText}>
                      that we deliver tailored results to you.
                    </Text>
                    {/*<GradientButton*/}
                    {/*  buttonName={'Let’s do it'}*/}
                    {/*  onPress={verificationModalToggle}*/}
                    {/*  containerStyle={{*/}
                    {/*    width: isIOS ? wp(270) : wp(250),*/}
                    {/*    height: hp(50),*/}
                    {/*    marginTop: hp(20),*/}
                    {/*  }}*/}
                    {/*  // containerStyle={style.gradientButtonContainerStyle}*/}
                    {/*  // buttonTextStyle={{color: colors.white}}*/}
                    {/*  // onPress={closeWelcomeModal}*/}
                    {/*/>*/}

                    <CommonGradientButton
                      buttonName={'Let’s do it'}
                      containerStyle={{
                        width: wp(270),
                        height: hp(50),
                        marginTop: hp(20),
                      }}
                      onPress={verificationModalToggle}
                    />
                  </View>
                </View>
              </View>
            </Modal>
          </View>

          <View style={{height: isIOS ? hp(150) : hp(120)}} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
