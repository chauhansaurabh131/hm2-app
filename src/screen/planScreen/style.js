import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainerView: {
    marginHorizontal: wp(17),
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
  headingTittleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(31),
  },
  headingCredentialsImageStyle: {
    width: hp(14),
    height: hp(14),
    tintColor: colors.black,
  },
  headingCredentialsText: {
    // marginLeft: wp(12.8),
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins600,
    color: colors.black,
  },
  backButtonContainer: {
    position: 'absolute',
    right: 2,
    width: hp(24),
    height: hp(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonIconStyle: {
    width: hp(14),
    height: hp(14),
  },
  underLineHeaderStyle: {
    width: '100%',
    marginTop: hp(12),
    height: 1,
    backgroundColor: '#E7E7E7',
  },
  bodyBoxContainer: {
    flex: 1,
    marginHorizontal: wp(17),
    marginTop: hp(18),
  },
  boxStyle: {
    width: '100%',
    // height: hp(535),
    borderWidth: 1,
    borderRadius: 14,
    borderColor: '#E7E7E7',
  },
  boxBackGroundImage: {
    width: '100%',
    height: hp(130),
    borderTopRightRadius: 14,
    borderTopLeftRadius: 14,
  },
  imageTextContainer: {
    position: 'absolute',
    marginHorizontal: wp(17),
  },
  currentPlanTextStyle: {
    color: colors.black,
    marginTop: hp(19),
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
  },
  gradientColorText: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
    color: colors.blue,
  },
  yourPaidText: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    marginTop: hp(16),
  },
  priceText: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
  },
  imageBottomContainer: {
    marginHorizontal: wp(17),
  },
  benefitText: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins500,
    marginTop: hp(12),
  },
  descriptionTextContainer: {
    flexDirection: 'row',
    marginTop: hp(2),
    alignItems: 'center',
  },
  greenCheckIcon: {
    width: hp(14),
    height: hp(14),
    resizeMode: 'contain',
    marginRight: wp(16),
  },
  descriptionText: {
    // color: '#8F8F8F',
    color: colors.pureBlack,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },
  textColor: {
    color: '#0F52BA',
  },
  onlineText: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },
  planIssueContainer: {
    marginTop: hp(27),
  },
  planIssueBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: wp(50),
  },
  planTittle: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
  },
  issueTextStyle: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
  },
  checkIcon: {
    width: hp(14),
    height: hp(14),
    resizeMode: 'contain',
    marginLeft: wp(17),
  },

  leftContainerBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  space: {
    marginBottom: hp(26),
  },
  notNowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(21),
  },
  gradientBorder: {
    width: '100%',
    height: hp(44),
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: 'transparent',
  },
  gradientBorderTextContainer: {
    borderRadius: 50,
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    margin: isIOS ? 0 : 1.2,
  },
  notNowText: {
    textAlign: 'center',
    backgroundColor: 'transparent',
    color: colors.black,
    margin: 10,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
  },
  autoRenewButton: {
    width: wp(300),
    height: hp(44),
  },
});
