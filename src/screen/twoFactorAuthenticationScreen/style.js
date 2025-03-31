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
  switchWrapper: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#D6D6D6',
  },
  switch: {
    width: hp(50),
    height: hp(25),
    borderRadius: 15,
    justifyContent: 'center',
    position: 'relative',
  },
  circleContainer: {
    position: 'absolute',
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  bodyContainer: {
    flexDirection: 'row',
    marginHorizontal: 17,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bodyTittle: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
  },
  bodyOptionContainer: {
    marginHorizontal: 17,
    marginTop: hp(43),
  },
  optionBodyContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#EAEAEA',
    height: hp(80),
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
  optionBodyImage: {
    width: hp(20),
    height: hp(20),
    resizeMode: 'contain',
  },
  optionBodyText: {
    color: 'black',
    marginLeft: hp(23),
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
  },
  optionBodyRightIcon: {
    width: hp(6),
    height: hp(11),
    position: 'absolute',
    right: 2,
  },
});

export default style;
