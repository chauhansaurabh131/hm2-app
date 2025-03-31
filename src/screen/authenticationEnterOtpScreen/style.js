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
    alignItems: 'center',
    marginTop: hp(31),
  },
  headingCredentialsText: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
    color: colors.black,
  },
  underLineHeaderStyle: {
    width: '100%',
    marginTop: hp(12),
    height: 1,
    backgroundColor: '#E7E7E7',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp(330), // Adjust width to fit 6 input fields
    height: hp(150),
  },
  otpInput: {
    width: wp(40), // Adjust width for 6 inputs
    height: hp(50),
    textAlign: 'center',
    fontSize: fontSize(24),
    borderBottomWidth: 1,
    borderBottomColor: '#D9D9D9',
    fontWeight: 'bold',
  },
  activeInput: {
    borderBottomColor: colors.black,
  },
  inactiveInput: {
    borderBottomColor: '#D9D9D9',
  },
  digitStyle: {
    color: colors.black,
  },
  placeholderStyle: {
    color: '#D9D9D9',
  },
});

export default style;
