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
  headerImageAndIconStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(14),
  },
  logoStyle: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
  },
  profileIcon: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    resizeMode: 'stretch',
    marginRight: wp(2),
  },
  userDetailsContainer: {
    marginTop: hp(22),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  userProfileIcon: {
    width: hp(40),
    height: hp(40),
    borderRadius: 50,
    marginRight: wp(14),
  },
  detailsContainer: {
    flex: 1,
  },
  userNameTextStyle: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
    color: colors.black,
  },
  statusTextStyle: {
    fontSize: fontSize(8),
    lineHeight: hp(12),
    fontFamily: fontFamily.poppins500,
  },
  threeDotIcon: {
    width: hp(25),
    height: hp(24),
  },
});

export default style;
