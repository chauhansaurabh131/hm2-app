import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    marginHorizontal: wp(17),
  },
  headingTextStyle: {
    fontSize: fontSize(20),
    lineHeight: hp(30),
    fontFamily: fontFamily.poppins600,
    color: colors.black,
    textAlign: 'center',
    marginTop: hp(75),
  },
  bodyHeightStyle: {
    marginTop: hp(80),
  },
  bodySpaceStyle: {
    marginTop: hp(37),
  },
  startButtonContainer: {
    width: '100%',
    height: hp(50),
    borderRadius: 50,
    backgroundColor: 'black',
    marginTop: hp(50),
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
});
