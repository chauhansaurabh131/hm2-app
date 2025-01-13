import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    marginTop: hp(15),
    marginHorizontal: 17,
  },
  tittleText: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
    color: colors.black,
  },
  subTittleText: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(28),
    fontFamily: fontFamily.poppins600,
    marginTop: hp(2),
  },
  tittlesText: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
    color: colors.black,
    marginTop: hp(15),
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: hp(10),
  },
  hobbiesBody: {
    backgroundColor: '#F3F3F3',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hobbiesText: {
    color: colors.black,
    textTransform: 'capitalize',
    fontFamily: fontFamily.poppins500,
    fontSize: fontSize(16),
    lineHeight: hp(24),
  },
});
