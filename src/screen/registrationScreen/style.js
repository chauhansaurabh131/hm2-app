import {StyleSheet} from 'react-native';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerLogoStyle: {
    width: isIOS ? wp(110) : wp(100),
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
    fontFamily: fontFamily.nunito400,
  },
  textInputStyle: {
    height: hp(50),
    width: wp(270),
    backgroundColor: colors.white,
    flexDirection: 'row',
    marginHorizontal: hp(15),
    borderWidth: 1.5,
    alignItems: 'center',
    borderRadius: hp(10),
    borderColor: colors.blue,
  },
  textInputContainerStyle: {
    // marginTop: isIOS ? hp(20) : hp(-20),
    // padding: 0,
    marginBottom: 20,
  },
  iconStyle: {
    with: hp(20.78),
    height: hp(16),
    resizeMode: 'contain',
  },
  gradientButtonContainerStyle: {
    // marginTop: isIOS ? hp(15) : hp(20),
  },
  continueWithTextStyle: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    marginTop: hp(23),
    textAlign: 'center',
    color: colors.black,
    fontWeight: '400',
    fontFamily: fontFamily.inter400,
  },
  socialMediaLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(21),
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
    height: hp(17.6),
    width: hp(17.6),
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
    height: 1.5,
    backgroundColor: '#E1E1E1',
    marginVertical: wp(10),
    marginLeft: wp(50),
    marginRight: wp(50),
    marginTop: hp(26),
  },
  memberLoginTextContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp(25),
  },
  loginTextStyle: {
    color: colors.black,
  },
  profileVectorStyle: {
    width: hp(16),
    height: hp(16),
    marginLeft: wp(10),
    top: 2,
    tintColor: colors.black,
  },
});

export default style;
