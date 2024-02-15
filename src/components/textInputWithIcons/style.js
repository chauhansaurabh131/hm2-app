import {StyleSheet} from 'react-native';
import {hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const style = StyleSheet.create({
  inputContainer: {
    width: wp(270),
    height: hp(50),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 10,
    // paddingVertical: 10,
    paddingHorizontal: 15,
    alignSelf: 'center',
  },
  icon: {
    width: hp(17.5),
    height: hp(16),
    marginRight: 10,
    resizeMode: 'stretch',
  },
  secureIconStyle: {
    width: hp(18),
    height: hp(18),
    marginRight: 3,
    resizeMode: 'stretch',
  },
  input: {
    flex: 1,
    height: hp(40),
    color: colors.black,
  },
});

export default style;
