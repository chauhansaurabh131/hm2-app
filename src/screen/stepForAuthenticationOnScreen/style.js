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
  bodyContainer: {
    marginTop: hp(19),
    marginHorizontal: 18,
  },
  tittleCircle: {
    width: hp(22),
    height: hp(22),
    borderRadius: 50,
    backgroundColor: '#E3E3E3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tittleText: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    marginLeft: hp(16),
    top: 2,
  },
  tittleBody: {
    marginTop: hp(22),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  bodyImage: {
    width: hp(95),
    height: hp(28),
    resizeMode: 'contain',
  },
  textInputContainer: {
    width: '100%',
    height: hp(44),
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 25,
    fontSize: fontSize(16),
    paddingHorizontal: 10,
    marginTop: hp(36),
  },
  buttonContainer: {
    width: '100%',
    height: hp(44),
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: hp(18),
  },
  buttonText: {
    color: colors.white,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
});

export default style;
