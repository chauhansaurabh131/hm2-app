import {StyleSheet} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const style = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: hp(10),
    paddingVertical: hp(16),
    flexDirection: 'row',
    backgroundColor: colors.white,
    width: '65%',
    height: hp(60),
    alignSelf: 'center',
  },
  fontSize: fontSize(20),
  lineHeight: hp(24),
  fontFamily: fontFamily.bebesneue400,

  buttonTextStyle: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight:wp(24),
    fontFamily: fontFamily.nunito200,
  },
  rightArrowStyle: {
    width: wp(18),
    height: hp(19),
    resizeMode: 'contain',
    marginLeft: 68,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default style;
