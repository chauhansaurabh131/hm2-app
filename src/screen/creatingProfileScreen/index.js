import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import NewDropDownTextInput from '../../components/newDropdownTextinput';
import FloatingLabelInput from '../../components/FloatingLabelInput';
import {images} from '../../assets';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const CreatingProfileScreen = () => {
  const dropdownData = ['MySelf', 'For My Son', 'For My Daughter'];
  const [selectedOption, setSelectedOption] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const onStartNowPress = () => {
    console.log(' === selected option ===> ', selectedOption);
    console.log(' === firstName ===> ', firstName);
    console.log(' === lastName ===> ', lastName);
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{marginHorizontal: wp(24)}}>
        <Image
          source={images.happyMilanColorLogo}
          style={{
            width: wp(96),
            height: hp(24),
            resizeMode: 'contain',
            marginTop: hp(15),
            marginLeft: wp(18),
            marginBottom: hp(20),
          }}
        />

        <Text
          style={{
            color: 'black',
            fontSize: fontSize(20),
            lineHeight: hp(30),
            fontFamily: fontFamily.poppins600,
            textAlign: 'center',
            marginTop: hp(90),
          }}>
          I’m creating profile for?
        </Text>

        <NewDropDownTextInput
          placeholder="Select an option"
          dropdownData={dropdownData}
          onValueChange={setSelectedOption}
        />

        <View style={{marginTop: hp(20)}}>
          <FloatingLabelInput
            label="First Name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>

        <View style={{marginTop: hp(20)}}>
          <FloatingLabelInput
            label="Last Name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onStartNowPress}
          style={{
            width: '100%',
            height: hp(50),
            borderRadius: 50,
            backgroundColor: 'black',
            marginTop: hp(50),
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: 'white',
              textAlign: 'center',
              fontSize: fontSize(16),
              lineHeight: hp(24),
              fontFamily: fontFamily.poppins400,
            }}>
            Start Now
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CreatingProfileScreen;
