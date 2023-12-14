import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logoStyle: {
    width: wp(99),
    height: hp(24),
    marginTop: hp(29),
    marginLeft: wp(33),
  },
  coupleLogoStyle: {
    width: wp(307),
    height: hp(359),
    top: wp(30),
    marginLeft: wp(34),
    // backgroundColor: colors.black,
  },
  intersectLogoStyle: {
    width: '100%',
    height: hp(73),
    top: wp(-32),
    // backgroundColor: colors.red,
  },
  logoContainer: {
    // flex: 1,
    // backgroundColor :colors.red,
  },
  textDescriptionContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    top: -20,
    marginLeft: -60
  },
  textDescriptionStyle: {
    color: colors.white,
    fontSize: fontSize(22),
    lineHeight: wp(27),
    fontStyle: 'Montserrat',
    fontFamily: fontFamily.montserrat,
    fontWeight: 'bold',
  },

  loginTextStyle: {
    color: colors.white,
  },

  profileVectorStyle: {
    width: wp(16),
    height: hp(16),
    marginLeft: wp(10),
    top: 2,
  },

  memberLoginTextContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp(25),
  },
});

export default style;
