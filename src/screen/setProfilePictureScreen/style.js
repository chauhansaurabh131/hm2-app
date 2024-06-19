import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: wp(18),
  },
  appLogoStyle: {
    width: wp(96),
    height: hp(24),
    marginTop: hp(15),
    resizeMode: 'stretch',
  },
  tittleTextContainer: {
    flexDirection: 'row',
    marginTop: hp(45),
  },
  headingTextStyle: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
  subHeadingTextStyle: {
    color: colors.blue,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
  },
  addPhotoButtonStyle: {
    width: '100%',
    height: hp(50),
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGreyBorder,
    marginTop: hp(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoButtonTextStyle: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
  bottomButtonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  bottomButtonBodyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(10),
  },
  backButtonStyle: {
    width: wp(162),
    height: hp(50),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: colors.blue,
    justifyContent: 'center',
    marginBottom: 10,
  },
  backButtonTextStyle: {
    color: colors.black,
    textAlign: 'center',
    fontSize: hp(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
  laterButtonStyle: {
    width: wp(162),
    height: hp(50),
    marginBottom: 10,
    borderRadius: 50,
  },
});

export default style;
