import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerLogoStyle: {
    width: isIOS ? hp(110) : hp(100),
    height: isIOS ? hp(26) : hp(24),
    marginTop: hp(29),
    marginLeft: wp(33),
    resizeMode: 'stretch',
  },
  signUpTextStyle: {
    color: colors.blue,
    textAlign: 'center',
    marginTop: isIOS ? hp(110) : hp(150),
    fontSize: fontSize(24),
    fontWeight: '700',
    marginBottom: isIOS ? wp(70) : wp(30),
    fontFamily: fontFamily.nunito400,
  },
  dropDownTextInputContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginLeft: isIOS ? hp(-17) : hp(-5),
    marginTop: isIOS ? hp(-350) : hp(-350),
  },
  inputContainer: {
    width: isIOS ? wp(180) : wp(190),
    marginTop: isIOS ? hp(0) : hp(-22),
    height: hp(50),
    marginLeft: -10,
  },
  boxStyles: {
    backgroundColor: 'white',
    borderColor: colors.blue,
    // paddingHorizontal: 5,
    height: isIOS ? hp(50) : hp(49),
    marginRight: isIOS ? wp(19) : wp(0),
    width: wp(80),
    marginLeft: 15,
  },
  inputStyles: {
    color: colors.black,
    // paddingVertical: isIOS ? hp(5) : hp(0),
    marginLeft: -12,
    paddingHorizontal: 2,
  },
  dropdownTextStyles: {
    color: colors.black,
  },
  continueWithTextStyle: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    marginTop: hp(100),
    textAlign: 'center',
    color: colors.black,
    fontWeight: '400',
    fontFamily: fontFamily.inter400,
  },
  socialMediaLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(30),
    marginBottom: hp(20),
  },
  socialMediaCircleStyle: {
    width: hp(44),
    height: hp(44),
    borderRadius: hp(50),
    borderColor: colors.lightGrayCircle,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoStyle: {
    height: hp(15),
    width: hp(15),
    resizeMode: 'contain',
  },
  socialMediaLogoContainers: {
    width: hp(44),
    height: hp(44),
    borderRadius: hp(50),
    borderColor: '#D4D4D4',
    borderWidth: 1,
    marginLeft: wp(20),
    marginRight: wp(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  privacyPolicyTextContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  privacyPolicyTextStyle: {
    color: colors.black,
    fontSize: fontSize(10),
    lineHeight: hp(15),
    fontWeight: '400',
    fontFamily: fontFamily.nunito400,
  },
  privacyPolicyHighLightTextStyle: {
    color: 'blue',
    fontSize: fontSize(10),
    lineHeight: hp(15),
    fontWeight: '400',
    fontFamily: fontFamily.nunito400,
  },
  bottomUnderLineStyle: {
    height: 2,
    backgroundColor: '#E1E1E1',
    marginVertical: wp(10),
    marginLeft: wp(50),
    marginRight: wp(50),
    marginTop: hp(25),
  },
  memberLoginTextContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp(25),
    // flex: 1,
    // justifyContent: 'flex-end',
  },
  loginTextStyle: {
    color: colors.black,
  },
  profileVectorStyle: {
    width: wp(16),
    height: hp(16),
    marginLeft: wp(10),
    top: 2,
    tintColor: colors.black,
  },
  gradientButtonContainerStyle: {
    marginTop: isIOS ? hp(90) : hp(70),
    width: isIOS ? hp(245) : hp(280),
    marginLeft: hp(-10),
  },
  inputTextContainer: {
    width: isIOS ? hp(270) : hp(270),
    height: hp(50),
    borderRadius: 0,

    // marginLeft: hp(-12),
  },
});

export default style;
