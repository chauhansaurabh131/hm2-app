import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.blue,
    borderRadius: hp(10),
    paddingVertical: hp(10),
    paddingHorizontal: hp(15),
    width: wp(270),
    height: hp(50),
    alignSelf: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: hp(16),
    textAlign: 'center',
    lineHeight: hp(24),
    fontFamily: fontFamily.montserrat,
  },
});

export default style;
