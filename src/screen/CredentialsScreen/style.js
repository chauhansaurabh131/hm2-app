import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainerView: {
    marginHorizontal: wp(17),
    // backgroundColor: 'lightgreen',
    marginTop: hp(14),
  },
  headerContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customerHeaderImage: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
  },
  profileImageStyle: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
  },
  underLineHeaderStyle: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    // borderColor: 'red',
    marginTop: hp(12),
  },
  descriptionBodyUnderlineStyle: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    marginTop: hp(18),
  },
  headingTittleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(31),
  },
  headingCredentialsImageStyle: {
    width: hp(17.29),
    height: hp(14),
    tintColor: colors.black,
  },
  headingCredentialsText: {
    marginLeft: wp(11),
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  backButtonContainer: {
    position: 'absolute',
    right: 2,
  },
  backButtonIconStyle: {
    width: hp(14),
    height: hp(14),
  },
  credentialBodyContainer: {
    flex: 1,
    marginHorizontal: wp(17),
    marginTop: hp(14),
    // backgroundColor: 'red',
  },

  bodyCredentialsTittleText: {
    fontFamily: fontFamily.poppins400,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    color: colors.black,
  },

  bodyFillFullContainer: {
    flexDirection: 'row',
    marginTop: hp(9),
    alignItems: 'center',
  },
  UserEmailTextStyle: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: '#8F8F8F',
    marginRight: wp(8),
  },
  checkIconStyle: {
    width: hp(14),
    height: hp(14),
    resizeMode: 'contain',
  },
  editImageContainer: {
    position: 'absolute',
    right: 5,
  },
  editImageStyle: {
    width: hp(13),
    height: hp(13),
    resizeMode: 'contain',
  },
  bottomSheetContainer: {
    flex: 1,
  },
  bottomSheetTittleText: {
    color: colors.blue,
    textAlign: 'center',
    fontSize: fontSize(22),
    lineHeight: hp(28),
    marginTop: hp(10),
  },
  bottomSheetBodyContainer: {
    flex: 1,
    marginHorizontal: wp(27),
  },
  bottomSheetBodyTitleText: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(22),
    marginTop: hp(20),
    fontFamily: fontFamily.poppins500,
  },
  textInputContainer: {
    width: '100%',
    height: hp(50),
    borderRadius: 5,
    borderColor: colors.gray,
    borderWidth: 1,
    padding: 10,
    marginTop: hp(10),
    color: colors.black,
  },
  bottomSheetButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: isIOS ? hp(40) : hp(50),
  },
  bottomSheetNotNowContainer: {
    width: wp(110),
    height: hp(50),
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: 'transparent',
  },
  notNowButtonContainer: {
    borderRadius: 10,
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    margin: isIOS ? 0 : 1,
  },
  notNowButtonTextStyle: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: colors.black,
    margin: 10,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
  },
  submitButtonContainer: {
    width: wp(178),
    height: hp(50),
    borderRadius: 10,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonTextStyle: {
    textAlign: 'center',
    color: colors.white,
    fontSize: fontSize(14),
    lineHeight: hp(21),
  },
  verificationTextStyle: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(22),
    marginTop: hp(20),
    fontFamily: fontFamily.poppins500,
    textAlign: 'center',
  },
  verificationSubTextStyle: {
    color: colors.gray,
    fontSize: fontSize(12),
    lineHeight: hp(22),
    marginTop: hp(5),
    fontFamily: fontFamily.poppins500,
    textAlign: 'center',
  },
  verificationBottomLineContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(80),
  },
  verificationLineStyle: {
    width: '20%',
    borderWidth: 1,
    borderColor: colors.black,
  },
  resendTextStyle: {
    color: colors.blue,
    fontSize: fontSize(14),
    lineHeight: hp(22),
    marginTop: hp(50),
    fontFamily: fontFamily.poppins500,
    textAlign: 'center',
  },
  conformIconStyle: {
    tintColor: colors.blue,
    alignSelf: 'center',
    width: 45,
    height: 45,
    marginTop: 100,
  },
  updateTextStyle: {
    textAlign: 'center',
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(28),
    fontFamily: fontFamily.poppins500,
    marginTop: hp(30),
  },
  okButtonContainer: {
    alignItems: 'center',
  },
  okButtonBodyStyle: {
    width: wp(80),
    height: hp(50),
    borderRadius: 10,
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(50),
  },
  okButtonTextStyle: {
    textAlign: 'center',
    color: colors.white,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
  },
});

export default style;
