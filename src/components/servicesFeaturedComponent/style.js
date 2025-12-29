import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  featuredHeadingText: {
    marginTop: hp(27),
    color: colors.pureBlack,
    fontSize: fontSize(14),
    fontFamily: fontFamily.poppins500,
    marginHorizontal: 17,
  },
  featuredBodyContainer: {
    marginTop: hp(26),
    alignItems: 'center',
  },
  animatedContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#EFEFEF',
    borderRadius: 15,
  },
  imageProfileContainer: {
    width: '100%',
    height: hp(167),
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
  },
  profileImage: {
    width: hp(50),
    height: hp(50),
    marginLeft: wp(17),
  },
});

export default style;
