import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  mobileNumberTextStyle: {
    // marginLeft: wp(25),
    color: colors.black,
    marginTop: hp(20),
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontWeight: '400',
    fontFamily: fontFamily.nunito400,
  },
  dropDownContainer: {
    flexDirection: 'row',
    marginTop: hp(10),
    justifyContent: 'space-between',
    // marginHorizontal: isIOS ? hp(22) : hp(15),
  },
  mobileNumberTextInputStyle: {
    width: wp(205),
    height: isIOS ? hp(47) : hp(53),
    marginTop: isIOS ? hp(8) : hp(-10),
  },
  homeNumberTextStyle: {
    // marginLeft: isIOS ? hp(22) : hp(18),
    color: colors.black,
    // marginTop: isIOS ? hp(15) : hp(-5),
    marginTop: hp(15),
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontWeight: '400',
    fontFamily: fontFamily.nunito400,
  },
  homeNumberTextInputContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(10),
    // marginHorizontal: isIOS ? hp(22) : hp(15),
  },
  homeNumberTextInputStyle: {
    width: wp(205),
    height: isIOS ? hp(47) : hp(53),
    marginTop: isIOS ? hp(8) : hp(-10),
  },
  emailTextStyle: {
    // marginLeft: isIOS ? hp(22) : hp(18),
    color: colors.black,
    // marginTop: isIOS ? hp(15) : hp(-5),
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontWeight: '400',
    fontFamily: fontFamily.nunito400,
    marginTop: hp(10),
  },
  emailTextInputStyle: {
    width: wp(339),
    marginLeft: isIOS ? hp(0) : hp(-15),
    marginTop: isIOS ? hp(10) : hp(-10),
  },
});

export default style;
