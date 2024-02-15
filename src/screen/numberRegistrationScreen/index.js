import React, {useState} from 'react';
import {Image, SafeAreaView, Text, TouchableOpacity, View} from 'react-native';
import style from './style';
import {icons, images} from '../../assets';
import TextInput from '../../components/TextInput';
import {SelectList} from 'react-native-dropdown-select-list/index';
import {colors} from '../../utils/colors';
import GradientButton from '../../components/GradientButton';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {CurrentCity} from '../../utils/data';
import DropDownTextInputComponent from '../../components/DropDownTextInputComponent';
import TextInputWithDropDownComponent from '../../components/textInputWithDropDownComponent';
import {hp, isIOS, wp} from '../../utils/helpers';
import DemoScreen from '../demoScreen';
import CustomDropdown from '../demoScreen';
import MyTextInput from '../../components/TextInput';
import NumberRegistrationTextInput from '../../components/numberRegistrationTextInput';

const NumberRegistrationScreen = ({navigation}) => {
  const [selected, setSelected] = React.useState('');
  const options = ['+92', '+93', '+94', '+95', '+96'];
  const [selectedOption, setSelectedOption] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSelect = option => {
    setSelectedOption(option);
  };

  const data = [
    {key: '0', value: '+91', hidden: true}, // Hidden item
    {key: '1', value: '+92'},
    {key: '2', value: '+93'},
    {key: '3', value: '+94'},
    {key: '4', value: '+95'},
    {key: '5', value: '+96'},
    {key: '6', value: '+9'},
  ];

  return (
    <SafeAreaView style={style.container}>
      <Image
        source={images.happyMilanColorLogo}
        style={style.headerLogoStyle}
      />

      <Text style={style.signUpTextStyle}>Sign Up</Text>

      {/*<View*/}
      {/*  style={{*/}
      {/*    // backgroundColor: 'lightblue',*/}
      {/*    marginHorizontal: wp(35),*/}
      {/*    height: hp(250),*/}
      {/*  }}>*/}
      {/*<MyTextInput*/}
      {/*  IconNameDesign={icons.profileLogo}*/}
      {/*  placeholder={'Enter Your Name'}*/}
      {/*  editable={true}*/}
      {/*  iconSources*/}
      {/*  iconSource={icons.profileLogo}*/}
      {/*  inputContainer={style.inputTextContainer}*/}
      {/*/>*/}

      {/*<GradientButton*/}
      {/*  buttonName={'Send Code'}*/}
      {/*  containerStyle={[style.gradientButtonContainerStyle]}*/}
      {/*  buttonTextStyle={{color: colors.white}}*/}
      {/*  onPress={() => navigation.navigate('VerificationScreen')}*/}
      {/*/>*/}

      {/*<Text style={style.continueWithTextStyle}>or continue with</Text>*/}

      {/*<View style={style.socialMediaLogoContainer}>*/}
      {/*  <TouchableOpacity>*/}
      {/*    <View style={style.socialMediaCircleStyle}>*/}
      {/*      <Image source={icons.googleLogo} style={style.logoStyle} />*/}
      {/*    </View>*/}
      {/*  </TouchableOpacity>*/}

      {/*  <TouchableOpacity>*/}
      {/*    <View style={style.socialMediaLogoContainers}>*/}
      {/*      <Image source={icons.facebookLogo} style={style.logoStyle} />*/}
      {/*    </View>*/}
      {/*  </TouchableOpacity>*/}

      {/*  <TouchableOpacity>*/}
      {/*    <View*/}
      {/*      style={[*/}
      {/*        style.socialMediaCircleStyle,*/}
      {/*        {backgroundColor: colors.blue},*/}
      {/*      ]}>*/}
      {/*      <Image source={icons.whitePhoneLogo} style={style.logoStyle} />*/}
      {/*    </View>*/}
      {/*  </TouchableOpacity>*/}
      {/*</View>*/}

      {/*<View style={style.privacyPolicyTextContainer}>*/}
      {/*  <Text style={style.privacyPolicyTextStyle}>*/}
      {/*    By creating account, I Agee to Happy Milan{' '}*/}
      {/*  </Text>*/}

      {/*  <TouchableOpacity>*/}
      {/*    <Text style={style.privacyPolicyHighLightTextStyle}>Privacy</Text>*/}
      {/*  </TouchableOpacity>*/}
      {/*</View>*/}

      {/*<View style={style.privacyPolicyTextContainer}>*/}
      {/*  <TouchableOpacity>*/}
      {/*    <Text style={style.privacyPolicyHighLightTextStyle}>Policy </Text>*/}
      {/*  </TouchableOpacity>*/}
      {/*  <Text style={style.privacyPolicyTextStyle}>and </Text>*/}
      {/*  <TouchableOpacity>*/}
      {/*    <Text style={style.privacyPolicyHighLightTextStyle}>T&C</Text>*/}
      {/*  </TouchableOpacity>*/}
      {/*</View>*/}

      {/*<View style={style.bottomUnderLineStyle} />*/}

      {/*<View style={style.memberLoginTextContainer}>*/}
      {/*  <Text style={style.loginTextStyle}>Member Login</Text>*/}
      {/*  <TouchableOpacity*/}
      {/*    onPress={() => {*/}
      {/*      navigation.navigate('LoginScreen');*/}
      {/*    }}>*/}
      {/*    <Image*/}
      {/*      source={images.profileVectorLogo}*/}
      {/*      style={style.profileVectorStyle}*/}
      {/*    />*/}
      {/*  </TouchableOpacity>*/}
      {/*</View>*/}

      {/*<View style={style.dropDownTextInputContainer}>*/}
      {/*<SelectList*/}
      {/*  setSelected={val => setSelected(val)}*/}
      {/*  data={data}*/}
      {/*  save="value"*/}
      {/*  placeholder="+91"*/}
      {/*  boxStyles={style.boxStyles}*/}
      {/*  inputStyles={style.inputStyles}*/}
      {/*  dropdownTextStyles={style.dropdownTextStyles}*/}
      {/*  dropdownStyles={{backgroundColor: 'white'}}*/}
      {/*  search={false}*/}
      {/*/>*/}
      {/*<DemoScreen />*/}

      {/*  <TextInput*/}
      {/*    IconNameDesign={icons.profileLogo}*/}
      {/*    placeholder={'Enter Mobile Number'}*/}
      {/*    editable={true}*/}
      {/*    iconSource={icons.profileLogo}*/}
      {/*    inputContainer={style.inputContainer}*/}
      {/*    maxLength={10}*/}
      {/*    keyboardType={'number-pad'}*/}
      {/*  />*/}
      {/*</View>*/}

      {/*  <View*/}
      {/*    style={{*/}
      {/*      flexDirection: 'row',*/}
      {/*    }}>*/}
      {/*    /!*<DemoScreen />*!/*/}
      {/*    <CustomDropdown*/}
      {/*      options={options}*/}
      {/*      onSelect={handleSelect}*/}
      {/*      dropdownButton={{*/}
      {/*        marginLeft: isIOS ? hp(10) : wp(27),*/}
      {/*        marginTop: isIOS ? hp(0) : hp(-20),*/}
      {/*        marginRight: isIOS ? wp(41.5) : wp(9.5),*/}
      {/*      }}*/}
      {/*    />*/}
      {/*    /!*<View style={{width: wp(5)}} />*!/*/}
      {/*    <MyTextInput*/}
      {/*      IconNameDesign={icons.profileLogo}*/}
      {/*      placeholder={'Enter Your Number'}*/}
      {/*      editable={true}*/}
      {/*      inputContainer={{*/}
      {/*        width: wp(199),*/}
      {/*        borderRadius: 0,*/}
      {/*        marginLeft: isIOS ? hp(0) : hp(-20),*/}
      {/*        marginTop: isIOS ? hp(0) : hp(-40),*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </View>*/}
      {/*  <GradientButton*/}
      {/*    buttonName={'Send Code'}*/}
      {/*    // containerStyle={[style.gradientButtonContainerStyle]}*/}
      {/*    buttonTextStyle={{color: colors.white}}*/}
      {/*    onPress={() => navigation.navigate('VerificationScreen')}*/}
      {/*  />*/}
      {/*</View>*/}

      <NumberRegistrationTextInput
        onPress={() => navigation.navigate('VerificationScreen')}
      />

      <Text style={style.continueWithTextStyle}>or continue with</Text>

      <View style={style.socialMediaLogoContainer}>
        <TouchableOpacity>
          <View style={style.socialMediaCircleStyle}>
            <Image source={icons.googleLogo} style={style.logoStyle} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View style={style.socialMediaLogoContainers}>
            <Image source={icons.facebookLogo} style={style.logoStyle} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity>
          <View
            style={[
              style.socialMediaCircleStyle,
              {backgroundColor: colors.blue},
            ]}>
            <Image source={icons.whitePhoneLogo} style={style.logoStyle} />
          </View>
        </TouchableOpacity>
      </View>

      <View style={style.privacyPolicyTextContainer}>
        <Text style={style.privacyPolicyTextStyle}>
          By creating account, I Agee to Happy Milan{' '}
        </Text>

        <TouchableOpacity>
          <Text style={style.privacyPolicyHighLightTextStyle}>Privacy</Text>
        </TouchableOpacity>
      </View>

      <View style={style.privacyPolicyTextContainer}>
        <TouchableOpacity>
          <Text style={style.privacyPolicyHighLightTextStyle}>Policy </Text>
        </TouchableOpacity>
        <Text style={style.privacyPolicyTextStyle}>and </Text>
        <TouchableOpacity>
          <Text style={style.privacyPolicyHighLightTextStyle}>T&C</Text>
        </TouchableOpacity>
      </View>

      <View style={style.bottomUnderLineStyle} />

      <View style={style.memberLoginTextContainer}>
        <Text style={style.loginTextStyle}>Member Login</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('LoginScreen');
          }}>
          <Image
            source={images.profileVectorLogo}
            style={style.profileVectorStyle}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default NumberRegistrationScreen;
