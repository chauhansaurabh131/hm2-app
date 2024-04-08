import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerBody: {
    marginHorizontal: 17,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(12),
  },
  headerLogoStyle: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
    marginTop: hp(2),
  },
  profileLogo: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    marginRight: hp(10.5),
    resizeMode: 'stretch',
    right: -7,
    marginTop: hp(2),
  },
  headerTittleContainer: {
    marginTop: hp(30),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(14),
  },
  headerTittleTextStyle: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },
  addPhotoContainer: {
    width: hp(40),
    height: hp(40),
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    marginRight: wp(5),
  },
  addPhotoImageStyle: {
    width: hp(11),
    height: hp(11),
    alignSelf: 'center',
    resizeMode: 'contain',
  },
  bodyContainer: {
    marginHorizontal: 17,
    marginTop: hp(11),
  },
  bodyHeadingTittleContainer: {
    flexDirection: 'row',
    marginTop: 21,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bodyTittleHeadingText: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(27),
    fontFamily: fontFamily.poppins500,
  },
  bodyTittleHeadingContainer: {
    flexDirection: 'row',
  },
  readTextNumberStyle: {
    marginRight: wp(37),
    textAlign: 'center',
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
  },
  readTextStyle: {
    marginRight: 37,
    fontSize: fontSize(8),
    lineHeight: hp(12),
    fontFamily: fontFamily.poppins500,
  },
  headingTittleStyle: {
    justifyContent: 'center',
  },
  heartNumberStyle: {
    marginRight: wp(15),
    textAlign: 'center',
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
  },
  heartTextStyle: {
    marginRight: wp(17),
    color: colors.black,
    fontSize: fontSize(8),
    lineHeight: hp(12),
    fontFamily: fontFamily.poppins500,
  },
  headingDescriptionTextStyle: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    marginTop: hp(23),
  },
  headingDescriptionStyle: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    marginTop: hp(10),
  },
  shareImageContainer: {
    marginTop: hp(30),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareIconStyle: {
    width: hp(15),
    height: hp(18),
    resizeMode: 'contain',
  },
  spaceStyle: {
    width: hp(39),
  },
  heartIconStyle: {
    width: hp(34),
    height: hp(34),
    resizeMode: 'contain',
  },
  userNameTextStyle: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(27),
    fontFamily: fontFamily.poppins500,
    marginTop: hp(30),
  },
  userDateTextStyle: {
    color: colors.lightGray,
  },
});

export default style;
