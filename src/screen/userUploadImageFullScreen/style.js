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
  userStoryContainer: {
    marginTop: hp(15),
    height: hp(60),
    // marginHorizontal: wp(17),
  },
});

export default style;
