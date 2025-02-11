import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headingContainer: {
    marginHorizontal: 17,
    top: -20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headingText: {
    color: 'black',
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
  },
  editIconContainer: {
    width: hp(30),
    height: hp(30),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: hp(5),
  },
  editIcon: {
    tintColor: 'black',
    width: hp(16),
    height: hp(16),
  },
  horizontalLineOne: {
    width: '100%',
    height: 4,
    backgroundColor: '#F8F8F8',
  },
  bodyContainer: {
    marginTop: hp(19),
  },
  bodyContainerStyle: {
    marginHorizontal: 17,
  },
  tittleText: {
    fontSize: fontSize(14),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  tittleTexts: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
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
  subTittleContainer: {
    marginTop: hp(27),
  },
  subTittleContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightSideIcon: {
    width: hp(8),
    height: hp(15),
    marginRight: 8,
    tintColor: '#5F6368',
  },
  bottomSheetTittleText: {
    marginHorizontal: 31,
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
    marginTop: hp(5),
  },
  bottomSheetUnderLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#E7E7E7',
    marginTop: hp(15),
  },
  bottomSheetOptionText: {
    marginHorizontal: 31,
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
  },
});
