import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerBody: {
    marginHorizontal: wp(24),
  },
  appLogoStyle: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
    marginTop: hp(15),
    marginBottom: hp(20),
  },
  tittleText: {
    color: 'black',
    fontSize: fontSize(20),
    lineHeight: hp(30),
    fontFamily: fontFamily.poppins600,
    textAlign: 'center',
    marginTop: hp(70),
  },
  bodyContainer: {
    marginTop: hp(55),
  },
  spaceMarginStyle: {
    marginTop: hp(37),
  },
  startButton: {
    width: '100%',
    height: hp(50),
    borderRadius: 50,
    backgroundColor: 'black',
    marginTop: hp(50),
    justifyContent: 'center',
    alignItems: 'center',
  },
  startText: {
    color: 'white',
    textAlign: 'center',
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
});

export default style;
