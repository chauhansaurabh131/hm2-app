import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerBody: {
    marginTop: hp(15),
    marginHorizontal: 17,
  },
  detailTittleText: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
    color: colors.black,
  },
  DetailsAnswerText: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(28),
    fontFamily: fontFamily.poppins600,
    marginTop: hp(2),
  },
  DetailTittleSecondText: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
    color: colors.black,
    marginTop: hp(15),
  },
});
