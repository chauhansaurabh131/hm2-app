import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainerTittleStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customerHeaderLogo: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
    marginTop: hp(14),
  },
  profileLogoStyle: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    resizeMode: 'cover',
    marginTop: hp(14),
    marginRight: wp(2),
  },
});

export default style;
