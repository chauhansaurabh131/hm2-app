import {StyleSheet} from 'react-native';
import {hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const style = StyleSheet.create({
  headerScreenLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(10),
    marginTop: hp(20),
  },
  headerBodyLogoStyle: {
    width: wp(48),
    height: hp(48),
    borderWidth: 0.5,
    borderColor: colors.lightWhite,
    borderRadius: 10,
    backgroundColor: colors.lightWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageStyle: {
    tintColor: colors.black,
    height: hp(16),
    width: hp(16.82),
    resizeMode: 'stretch',
  },
});

export default style;
