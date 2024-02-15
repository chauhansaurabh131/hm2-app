import {StyleSheet} from 'react-native';
import {create} from 'react-test-renderer';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerBodyStyle: {
    marginHorizontal: wp(17),
  },
  headingTittleText: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
    marginTop: hp(19),
  },
  textInputBodyStyle: {
    width: '100%',
    height: hp(50),
    borderColor: colors.blue,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: hp(7),
    padding: 10,
  },
  textInputDropdownTextTittleBodyStyle: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
    marginTop: hp(15),
    marginBottom: hp(12),
  },
  TittleTextStyle: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
    marginTop: hp(15),
  },
});

export default style;
