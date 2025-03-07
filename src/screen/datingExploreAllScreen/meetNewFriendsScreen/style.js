import {StyleSheet} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';
import {colors} from '../../../utils/colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    marginHorizontal: wp(17),
  },
  headerBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(12),
  },
  appLogoStyle: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
    marginTop: hp(2),
  },
  dropDownTopImage: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    marginRight: hp(10.5),
    resizeMode: 'stretch',
    right: -7,
    marginTop: hp(2),
  },
  bodyContainer: {
    marginTop: hp(22),
    marginHorizontal: wp(17),
  },
  bodyContainerStyle: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  exploreText: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  filterContainer: {
    width: hp(28),
    height: hp(28),
    borderWidth: 1,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#CCCCCC',
    marginRight: 2,
  },
  filterIcon: {
    width: hp(18),
    height: hp(18),
    resizeMode: 'contain',
  },
  bottomSheetContainer: {
    flex: 1,
    marginTop: hp(10),
  },
  bottomSheetTittleText: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(27),
    fontFamily: fontFamily.poppins400,
    marginHorizontal: wp(27),
  },
  bottomSheetFilterContainer: {
    marginHorizontal: 26,
    marginTop: hp(34),
  },
  bottomSheetSearchTextInput: {
    width: '100%',
    height: hp(50),
    backgroundColor: '#F7F7F7',
    borderRadius: 25,
    padding: 15,
    paddingRight: 50,
  },
  searchIcon: {
    position: 'absolute',
    right: 15,
    top: 17,
    width: 15,
    height: 15,
    resizeMode: 'contain',
    tintColor: colors.black,
  },
  BottomSheetUnderLine: {
    width: '100%',
    borderWidth: 0.7,
    borderColor: '#EFEFEF',
    marginTop: hp(35),
  },
  bottomSheetBody: {
    marginHorizontal: wp(27),
    marginTop: hp(15),
  },
  ageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(29),
    marginBottom: hp(20),
  },
  ageTextStyle: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  ageTextSlider: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: colors.blue,
  },
  bottomSheetShowMeText: {
    color: colors.white,
  },
  BottomSheetButtonContainer: {
    width: '100%',
    marginTop: hp(30),
    borderRadius: 25,
  },
});

export default style;
