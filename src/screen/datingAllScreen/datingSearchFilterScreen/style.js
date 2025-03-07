import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';

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
});

export default style;
