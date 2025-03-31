import {StyleSheet} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

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
  headingCredentialsText: {
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
  optionBodyContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    height: hp(55),
    borderRadius: hp(14),
    justifyContent: 'center',
  },
  optionBodyTouchable: {
    height: '100%',
    borderRadius: hp(14),
    justifyContent: 'center',
  },
  optionBodyStyle: {
    marginHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },

  optionBodyText: {
    color: 'black',
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
  optionBodyRightIcon: {
    width: hp(6),
    height: hp(11),
    position: 'absolute',
    right: 2,
  },
  bodyContainer: {
    marginHorizontal: 18,
    marginTop: hp(20),
  },
  bodyTittle: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    marginBottom: hp(20),
  },
});

export default style;
