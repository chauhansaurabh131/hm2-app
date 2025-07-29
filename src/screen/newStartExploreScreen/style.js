import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  logoStyle: {
    marginTop: hp(29),
    marginLeft: wp(33),
    resizeMode: 'stretch',
    width: hp(96),
    height: hp(24),
  },
  backArrowStyle: {
    width: hp(20),
    height: hp(20),
    marginTop: hp(29),
    marginRight: wp(20),
    tintColor: colors.lightGray,
  },
  bodyContainerStyle: {
    flex: 1,
    marginHorizontal: wp(30),
  },
  tittleTextStyle: {
    color: colors.black,
    fontSize: fontSize(24),
    lineHeight: hp(36),
    fontFamily: fontFamily.poppins500,
    alignSelf: 'center',
    marginTop: hp(50),
    marginBottom: 70,
  },
  selectedBackGroundColorStyle: {
    width: '100%',
    height: hp(130),
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 14,
    marginTop: hp(40),
  },
  selectedSecondBackGroundStyle: {
    width: '100%',
    height: hp(130),
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 14,
    marginTop: hp(19),
  },
  buttonContainerStyle: {
    width: '100%',
    marginTop: hp(40),
  },
  boxContainer: {
    flex: 1,
    marginHorizontal: wp(17),
    marginVertical: hp(17),
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconStyle: {
    width: hp(29),
    height: hp(28),
  },
  rightSideIcon: {
    width: hp(6),
    height: hp(11),
    // tintColor: selected ? colors.white : '#5F6368',
  },
  boxTittleText: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
    marginTop: hp(12),
    // color: selected ? colors.white : colors.black, // Change title color based on selection
  },
  descriptionText: {
    fontSize: fontSize(10),
    lineHeight: hp(15),
    fontFamily: fontFamily.poppins400,
    marginTop: hp(8),
    // color: selected ? colors.white : colors.black, // Change description color based on selection
  },
  secondDescriptionText: {
    fontSize: fontSize(10),
    lineHeight: hp(15),
    fontFamily: fontFamily.poppins400,
    // color: selected ? colors.white : colors.black, // Change description color based on selection
  },
});
