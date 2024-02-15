import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    width: '100%',
    height: hp(218),
  },
  headerTittleStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerLogoStyle: {
    width: hp(96),
    height: hp(24),
    resizeMode: 'stretch',
    marginTop: hp(14),
    marginLeft: wp(17),
  },
  profileImageStyle: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    marginTop: hp(14),
    marginRight: hp(18),
    resizeMode: 'stretch',
  },
  headerDescriptionContainer: {
    alignItems: 'center',
    marginTop: hp(50),
  },
  headerTittleTextStyle: {
    color: colors.white,
    fontSize: fontSize(20),
    lineHeight: hp(30),
    fontWeight: '600',
    marginBottom: hp(12),
  },
  headerTittleDescriptionTextStyle: {
    color: colors.white,
    fontSize: fontSize(10),
    lineHeight: hp(15),
    fontWeight: '400',
  },
});

export default style;
