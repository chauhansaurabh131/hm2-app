import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: colors.white,
  },
  textInputHeadingStyle: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontWeight: '400',
    fontFamily: fontFamily.nunito400,
  },
  textInputContainerStyle: {
    alignSelf: 'flex-start',
    marginLeft: isIOS ? hp(0) : hp(-20),
    marginTop: isIOS ? hp(5) : hp(-11),
  },
  inputContainer: {
    // width: wp(339),
    height: hp(50),
    width: '100%',
  },
  currentTextHeadingStyle: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontWeight: '400',
    fontFamily: fontFamily.nunito400,
    // marginTop: isIOS ? hp(15) : hp(2),
    marginTop: hp(15),
  },
  currentResidingTextHeadingStyle: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontWeight: '400',
    fontFamily: fontFamily.nunito400,
    marginTop: isIOS ? hp(15) : hp(15),
  },
  currentAddressTextHeadingStyle: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontWeight: 'bold',
    fontFamily: fontFamily.nunito700,
    marginTop: isIOS ? hp(15) : hp(15),
  },
  checkBoxContainer: {
    // width: wp(339),
    width: '100%',
    height: hp(55),
    borderWidth: 1,
    borderRadius: 10,
    borderColor: colors.blue,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: hp(10),
    marginTop: hp(15),
  },
  checkBoxTextStyle: {
    marginLeft: hp(10),
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontWeight: '400',
    fontFamily: fontFamily.nunito400,
  },
});

export default style;
