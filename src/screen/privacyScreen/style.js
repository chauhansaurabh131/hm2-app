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
    marginLeft: wp(12.8),
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  backButtonContainer: {
    position: 'absolute',
    right: 2,
  },
  backButtonIconStyle: {
    width: hp(14),
    height: hp(14),
  },
  underLineHeaderStyle: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#F2F2F2',
    marginTop: hp(12),
  },
  bodyContainer: {
    flex: 1,
    marginTop: hp(14),
    marginHorizontal: wp(17),
  },
  bodyTittleTextStyle: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
    color: colors.black,
  },
  descriptionBodyUnderlineStyle: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#E7E7E7',
    marginTop: hp(28),
  },
});

export default style;
