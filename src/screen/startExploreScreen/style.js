import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    flex: 1,
    alignItems: 'center',
  },
  bodyHeadingText: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(27),
    fontFamily: fontFamily.nunito400,
    fontWeight: '400',
    marginBottom: hp(10),
    marginTop: hp(190),
  },
  boxContainer: {
    flexDirection: 'row',
    marginTop: hp(20),
  },
  boxMarriageStyle: {
    width: hp(132),
    height: hp(132),
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: hp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  logoStyle: {
    width: hp(33.27),
    height: hp(32),
    resizeMode: 'stretch',
  },
  boxDatingStyle: {
    width: hp(132),
    height: hp(132),
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: hp(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 15,
  },

  boxTextStyle: {
    marginTop: hp(5),
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.nunito400,
    fontWeight: '400',
  },
  buttonContainer: {
    // marginTop: isIOS ? hp(180) : hp(200),
    alignItems: 'center',
    position: 'absolute',
    bottom: 33,
  },
  buttonStyle: {
    height: wp(50),
    width: hp(290),
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: hp(10),
  },
  buttonTextStyle: {
    textAlign: 'center',
    color: colors.white,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
  selectedBox: {
    borderWidth: 0,
    borderColor: 'transparent',
  },
});

export default style;
