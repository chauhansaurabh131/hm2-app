import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  logoStyle: {
    width: isIOS ? wp(100) : wp(99),
    height: isIOS ? hp(22) : hp(24),
    marginLeft: wp(33),
    marginTop: isIOS ? hp(55) : hp(33),
  },
  coupleLogoStyle: {
    width: wp(307),
    height: hp(359),
    top: isIOS ? hp(40) : hp(39),
    marginLeft: wp(34),
  },
  intersectLogoStyle: {
    width: '100%',
    height: hp(73),
    top: wp(-32),
  },
  textDescriptionContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    top: -20,
    marginLeft: -60,
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
    resizeMode: 'stretch',
    top: isIOS ? hp(1) : hp(2),
  },

  memberLoginTextContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp(25),
  },
});

export default style;
