import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainerView: {
    marginHorizontal: wp(17),
    marginTop: hp(14),
  },
  headerContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customerHeaderImage: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
  },
  profileImageStyle: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
  },
  headingTittleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(31),
  },
  headingCredentialsImageStyle: {
    width: hp(11),
    height: hp(14),
    resizeMode: 'contain',
  },
  headingCredentialsText: {
    // marginLeft: wp(12.8),
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
    color: colors.black,
  },
  backButtonContainer: {
    position: 'absolute',
    right: 2,
    width: hp(24),
    height: hp(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonIconStyle: {
    width: hp(14),
    height: hp(14),
  },
  underLineHeaderStyle: {
    width: '100%',
    marginTop: hp(12),
    height: 1,
    backgroundColor: '#E7E7E7',
  },
  bodyContainer: {
    // flex: 1,
    marginTop: hp(18),
    marginHorizontal: wp(17),
  },
  bodyTittleTextStyle: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
    color: colors.blue,
  },
  descriptionBodyUnderlineStyle: {
    width: '100%',
    // borderWidth: 0.7,
    // borderColor: '#E7E7E7',
    height: 0.7,
    backgroundColor: '#E7E7E7',
    marginTop: hp(20),
  },
});

export default style;
