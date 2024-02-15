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
    // marginBottom: isIOS ? wp(70) : wp(30),
    fontFamily: fontFamily.nunito400,
    marginBottom: hp(67),
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
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    width: '100%',
    textAlign: 'center',
  },
  resendTextStyle: {
    color: colors.black,
    fontFamily: fontFamily.inter400,
    fontWeight: '400',
    textAlign: 'center',
    fontSize: fontSize(12),
    lineHeight: hp(18),
    // marginTop: hp(130),
  },
  notNowTextStyle: {
    color: colors.blue,
    fontFamily: fontFamily.inter400,
    fontWeight: '400',
    textAlign: 'center',
    fontSize: fontSize(12),
    lineHeight: hp(18),
    textDecorationLine: 'underline',
    // marginTop: hp(30),
  },
  gradientButtonContainerStyle: {
    marginTop: hp(10),
  },

  bottomUnderLineStyle: {
    height: 1.5,
    backgroundColor: '#E1E1E1',
    marginVertical: wp(10),
    marginLeft: wp(50),
    marginRight: wp(50),
    marginTop: hp(120),
  },
  memberLoginTextContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    // marginTop: hp(25),
    position: 'absolute',
    bottom: 58,
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
  underLineContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(74),
  },
  line: {
    height: 1,
    width: 61,
    backgroundColor: 'black', // You can change the color as needed
    // marginHorizontal: 7,
  },
});

export default style;
