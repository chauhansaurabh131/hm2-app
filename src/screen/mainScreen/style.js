import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logoStyle: {
    // width: isIOS ? wp(100) : wp(99),
    // height: isIOS ? hp(22) : hp(24),
    // marginLeft: wp(33),
    // marginTop: isIOS ? hp(55) : hp(33),
    // resizeMode: 'stretch',
    // new
    width: wp(98.25),
    height: hp(24),
    marginTop: hp(29),
    marginLeft: wp(33),
  },
  coupleLogoStyle: {
    width: wp(307),
    height: hp(359.72),
    // top: isIOS ? hp(40) : hp(39),
    // marginLeft: wp(34),
    resizeMode: 'stretch',
  },
  intersectLogoStyle: {
    width: '100%',
    height: hp(73),
    top: wp(-70),
    resizeMode: 'stretch',
    // backgroundColor: 'green',
  },
  BodyContainer: {
    marginLeft: wp(70),
    // marginLeft: wp(36),
    // marginTop: hp(-35),
    width: 241,
    height: 81,
    // marginTop: -10,
  },
  buttonContainer: {
    width: 240,
    height: hp(60),
    backgroundColor: colors.white,
    borderRadius: hp(10),
    marginTop: hp(42),
    justifyContent: 'center',
  },
  buttonTextContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonTextStyle: {
    color: colors.black,
    marginLeft: hp(24),
    fontSize: fontSize(18),
    lineHeight: wp(24),
    fontFamily: fontFamily.nunito200,
  },
  buttonImageStyle: {
    width: wp(18),
    height: hp(19),
    resizeMode: 'contain',
    marginRight: hp(25),
    top: 3,
  },
  textDescriptionStyle: {
    color: colors.white,
    fontSize: fontSize(22),
    lineHeight: wp(26.82),
    // fontStyle: 'Montserrat',
    // fontFamily: fontFamily.montserrat,
    // fontWeight: '700',
    fontFamily: fontFamily.poppins600,
  },

  loginTextStyle: {
    color: colors.white,
  },

  profileVectorStyle: {
    width: hp(16),
    height: hp(16),
    marginLeft: wp(10),
    resizeMode: 'stretch',
    top: isIOS ? hp(1) : hp(2),
  },

  memberLoginTextContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    // marginTop: hp(25),
    position: 'absolute',
    bottom: 42,
  },
});

export default style;
