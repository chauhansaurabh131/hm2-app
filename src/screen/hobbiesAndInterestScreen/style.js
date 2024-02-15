import {StyleSheet} from 'react-native';
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
  headingTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(15),
    alignItems: 'center',
  },
  headingTextStyle: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },
  headingTotalSelectedTextStyle: {
    color: colors.black,
    fontSize: fontSize(11),
    lineHeight: hp(16.5),
    fontFamily: fontFamily.poppins400,
  },
  funTextTittleStyle: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    marginTop: hp(10),
    marginBottom: hp(4),
  },
});

export default style;
