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
    // backgroundColor: 'orange',
  },
  headingCredentialsImageStyle: {
    width: hp(14),
    height: hp(14),
    tintColor: colors.black,
  },
  headingCredentialsText: {
    // marginLeft: wp(12.8),
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins600,
    color: colors.black,
  },
  backButtonContainer: {
    position: 'absolute',
    right: 2,
    width: hp(24),
    height: hp(24),
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
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
    marginHorizontal: wp(17),
    marginTop: hp(14),
  },
  bodyTittleTextStyle: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
    color: colors.black,
    marginBottom: hp(8),
  },
  bodySubTittleTextStyle: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    marginTop: hp(4),
  },
  checkBoxTittleText: {
    marginLeft: wp(13),
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  checkBoxBodyContainer: {
    flexDirection: 'row',
    marginTop: hp(5),
    backgroundColor: 'orange',
  },
  checkBoxTextStyle: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
    width: wp(100),
    marginLeft: wp(10),
    alignSelf: 'center',
  },
  checkBoxBodyWrapContainer: {
    flexDirection: 'row',
    marginLeft: wp(15),
  },
});

export default style;
