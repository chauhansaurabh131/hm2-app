import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    marginHorizontal: wp(17),
  },
  headingText: {
    color: 'black',
    marginTop: hp(10),
    fontSize: fontSize(20),
    lineHeight: hp(30),
    fontFamily: fontFamily.poppins600,
    textAlign: 'center',
    marginBottom: hp(10),
  },
  bodyContainer: {
    marginHorizontal: wp(17),
    marginTop: hp(40),
  },
  headingSubText: {
    color: '#9A9A9A',
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins500,
  },
  ageContainer: {
    marginTop: hp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ageContainerStyle: {
    width: '45%',
  },
  headingSubTittleText: {
    color: '#9A9A9A',
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins500,
    marginTop: hp(17),
  },
  space: {
    height: hp(150),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(17),
    height: hp(87),
    alignItems: 'center',
  },
  backButtonContainer: {
    width: wp(133),
    height: hp(44),
    borderRadius: 25,
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: 'center',
  },
  backButtonText: {
    textAlign: 'center',
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  dashboardButton: {
    width: wp(176),
    height: hp(44),
    borderRadius: 30,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashboardText: {
    color: colors.white,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
});

export default style;
