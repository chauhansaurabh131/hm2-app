import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {hp, isIOS, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerLogoStyle: {
    width: isIOS ? hp(110) : hp(100),
    height: isIOS ? hp(26) : hp(24),
    marginTop: hp(15),
    marginLeft: wp(33),
    resizeMode: 'stretch',
  },
  headerScreenLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBodyLogoStyle: {
    width: wp(48),
    height: hp(48),
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 10,
    backgroundColor: colors.blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    tintColor: 'white',
    height: hp(16),
    width: wp(16),
    resizeMode: 'stretch',
  },
});

export default style;
