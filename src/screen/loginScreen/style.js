import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerLogoStyle: {
    width: isIOS ? hp(110) : hp(99),
    height: isIOS ? hp(26) : hp(27),
    marginTop: hp(29),
    marginLeft: wp(33),
    resizeMode: 'stretch',
  },
  headingContainer: {
    alignItems: 'center',
    marginTop: hp(100),
    alignSelf: 'center',
  },
  headingTextStyle: {
    color: colors.blue,
    fontSize: fontSize(24),
    lineHeight: hp(36),
    fontWeight: '700',
    fontFamily: fontFamily.nunito400,
  },
  textInputStyle: {textAlign: 'center'},
  containerStyle: {
    marginTop: hp(50),
  },
  passwordContainerStyle: {
    marginTop: isIOS ? hp(20) : hp(-20),
  },
  gradientContainerStyle: {
    marginTop: isIOS ? hp(20) : hp(2),
  },
  orLoginTextStyle: {
    marginTop: hp(20),
    color: colors.black,
    textAlign: 'center',
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.nunito400,
  },
  socialMediaLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(20),
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
    height: hp(16),
    width: wp(16),
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
    marginTop: hp(22),
  },
  bottomTextContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp(35),
  },
  bottomTextStyle: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },
  signUpTextStyle: {
    color: colors.blue,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    top: isIOS ? hp(3) : hp(0),
  },
});

export default style;
