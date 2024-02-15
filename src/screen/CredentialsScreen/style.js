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
    // backgroundColor: 'lightgreen',
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
  underLineHeaderStyle: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    // borderColor: 'red',
    marginTop: hp(12),
  },
  descriptionBodyUnderlineStyle: {
    width: '100%',
    height: 1,
    borderWidth: 1,
    borderColor: '#F2F2F2',
    marginTop: hp(18),
  },
  headingTittleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(31),
  },
  headingCredentialsImageStyle: {
    width: hp(17.29),
    height: hp(14),
    tintColor: colors.black,
  },
  headingCredentialsText: {
    marginLeft: wp(11),
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
  credentialBodyContainer: {
    flex: 1,
    marginHorizontal: wp(17),
    marginTop: hp(14),
    // backgroundColor: 'red',
  },

  bodyCredentialsTittleText: {
    fontFamily: fontFamily.poppins400,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    color: colors.black,
  },

  bodyFillFullContainer: {
    flexDirection: 'row',
    marginTop: hp(9),
    alignItems: 'center',
  },
  UserEmailTextStyle: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: '#8F8F8F',
    marginRight: wp(8),
  },
  checkIconStyle: {
    width: hp(14),
    height: hp(14),
    resizeMode: 'contain',
  },
  editImageContainer: {
    position: 'absolute',
    right: 5,
  },
  editImageStyle: {
    width: hp(13),
    height: hp(13),
    resizeMode: 'contain',
  },
});

export default style;
