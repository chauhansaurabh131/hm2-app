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
    // marginTop: isIOS ? hp(110) : hp(150),
    fontSize: fontSize(24),
    fontWeight: '700',
    // marginBottom: isIOS ? wp(70) : wp(30),
    fontFamily: fontFamily.nunito400,
    marginBottom: hp(50),
    marginTop: hp(120),
  },
  verificationTextStyle: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    textAlign: 'center',
    fontFamily: fontFamily.nunito400,
    fontWeight: '400',
  },
  verificationEmailTextStyle: {
    color: colors.lightGray,
    textAlign: 'center',
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.inter400,
    fontWeight: '400',
  },
  textInputContainerStyle: {
    marginTop: isIOS ? hp(25) : hp(20),
  },
  validationTextStyle: {
    fontSize: fontSize(10),
    lineHeight: hp(15),
    // textAlign: 'center',
    color: colors.black,
    fontFamily: fontFamily.poppins400,
    marginTop: hp(19),
  },
  validationSecondTextStyle: {
    color: colors.black,
    fontSize: fontSize(10),
    lineHeight: hp(15),
    extAlign: 'center',
    fontFamily: fontFamily.poppins400,
  },
  passwordTextInputContainerStyle: {
    // marginTop: isIOS ? hp(10) : hp(-10),
  },
  gradientButtonContainerStyle: {
    marginTop: isIOS ? hp(20) : hp(2),
  },
  bottomUnderLineStyle: {
    height: 1,
    backgroundColor: '#E1E1E1',
    marginVertical: wp(10),
    // marginLeft: wp(50),
    marginRight: wp(50),
    marginTop: hp(85),
    width: '100%',
  },
  memberLoginTextContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp(45),
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
    resizeMode: 'stretch',
  },
  iconStyle: {width: hp(13.72), height: hp(17.62)},
});

export default style;
