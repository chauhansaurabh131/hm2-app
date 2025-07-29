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
    marginTop: hp(100),
  },
  bodyHeightStyle: {
    marginTop: hp(60),
  },
  bodySpaceStyle: {
    marginTop: hp(30),
  },
  startButtonContainer: {
    width: '100%',
    height: hp(50),
    borderRadius: 50,
    backgroundColor: 'black',
    marginTop: hp(90),
    justifyContent: 'center',
    marginBottom: 50,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
});
