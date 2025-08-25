import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

export const style = StyleSheet.create({
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
  bodyHeaderContainer: {
    backgroundColor: '#FFF9E4',
  },
  bodyHeaderTittle: {
    marginHorizontal: 17,
    fontSize: fontSize(10),
    fontFamily: fontFamily.poppins400,
    color: colors.pureBlack,
    marginTop: hp(13),
  },
  faqTextTittle: {
    marginHorizontal: 17,
    color: '#0F52BA',
    marginTop: hp(5),
    marginBottom: hp(12),
    fontSize: fontSize(11),
    fontFamily: fontFamily.poppins500,
  },
  mainBodyContainer: {
    marginHorizontal: 23,
    marginTop: hp(19),
  },
  reasonTextStyle: {
    color: colors.pureBlack,
    fontSize: fontSize(12),
    fontFamily: fontFamily.poppins500,
    lineHeight: hp(16),
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
    marginTop: 20,
  },
  input: {
    width: '100%',
    height: hp(44),
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    paddingHorizontal: 20,
    fontSize: fontSize(14),
    color: colors.pureBlack,
    paddingRight: 30,
  },
  icon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    width: 11,
    height: 6,
    resizeMode: 'contain',
    tintColor: 'black',
    transform: [{translateY: -3}],
  },
  option: {
    marginTop: hp(22),
  },
  bigInput: {
    height: hp(123), // big text box
    borderWidth: 1,
    borderColor: colors.pureBlack,
    borderRadius: 10,
    padding: 15,
    fontSize: fontSize(14),
    color: colors.pureBlack,
    backgroundColor: colors.white,
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
