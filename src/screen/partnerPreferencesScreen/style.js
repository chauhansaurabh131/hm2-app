import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerBody: {
    marginHorizontal: wp(18),
    flex: 1,
  },
  headerImageStyle: {
    width: wp(96),
    height: hp(24),
    marginTop: hp(15),
    resizeMode: 'stretch',
    marginBottom: hp(15),
  },
  headerTittleContainer: {
    marginTop: hp(15),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(8),
  },
  partnerPreferencesTextStyle: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
  doItLaterTextStyle: {
    color: colors.blue,
    fontSize: fontSize(16),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },
  bodyTittleTextStyle: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    marginBottom: hp(3),
    marginTop: hp(15),
  },

  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(17),
  },
  backButtonContainer: {
    width: wp(162),
    height: hp(50),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.blue,
    justifyContent: 'center',
  },
  backButtonText: {
    color: colors.black,
    textAlign: 'center',
    fontSize: hp(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
  continueButtonContainer: {
    width: wp(162),
    height: hp(50),
  },
  bodyContainer: {
    marginTop: hp(19),
  },
  headerListBody: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chooseAgeText: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    marginBottom: hp(7),
  },
  chooseAgeContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  chooseAgeSpace: {
    marginRight: 10,
  },
  toText: {
    marginRight: 10,
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    alignSelf: 'center',
  },
  chooseHeightText: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    marginBottom: hp(7),
  },
  chooseHeightContainer: {
    flexDirection: 'row',
  },
  chooseHeightSpace: {
    marginRight: 10,
  },
});

export default style;
