import {StyleSheet} from 'react-native';
import {hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  customHeaderLogo: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
  },
  profileLogoStyle: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    marginRight: wp(3),
    resizeMode: 'stretch',
  },
  headerBody: {
    marginHorizontal: wp(17),
  },
  headerImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(14),
    marginBottom: hp(20),
  },
  cancelButton: {
    width: hp(44),
    height: hp(44),
    // backgroundColor: '#28272780',
    backgroundColor: colors.black,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: hp(17),
    // position: 'absolute',
    // bottom: 30,
    // alignSelf: 'center',
  },
  cancelIcon: {
    width: hp(16),
    height: hp(16),
    resizeMode: 'contain',
    tintColor: colors.white,
  },
});
export default style;
