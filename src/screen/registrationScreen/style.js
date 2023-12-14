import {StyleSheet} from 'react-native';
import {fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const style = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },

  headerLogoStyle: {
    width: wp(96),
    height: hp(24),
    marginTop: hp(29),
    marginLeft: wp(33),
  },
  signUpTextStyle: {
    color: colors.blue,
    fontStyle: 'Poppins',
    textAlign: 'center',
    marginTop: hp(190),
    fontSize: fontSize(24),
    fontWeight: '700',
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
});

export default style;
