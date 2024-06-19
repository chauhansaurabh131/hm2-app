import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerBody: {
    flex: 1,
    marginHorizontal: wp(18),
  },
  logoImageStyle: {
    width: wp(96),
    height: hp(24),
    marginTop: hp(15),
    resizeMode: 'stretch',
    marginBottom: hp(15),
  },
  headingContainer: {
    marginTop: hp(30),
    marginBottom: hp(39),
  },
  headingTextStyle: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
  },
  flatListImageContainer: {
    width: '33%',
    height: 106,
    position: 'relative',
    marginBottom: 10,
  },
  addButtonStyle: {
    width: hp(106),
    height: hp(106),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F1F1',
  },
  addButtonImageContainer: {
    width: hp(106),
    height: hp(106),
    borderRadius: 10,
    resizeMode: 'stretch',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  addButtonImageStyle: {
    width: hp(106),
    height: hp(106),
    borderRadius: 10,
    resizeMode: 'stretch',
  },
  selectedImageStyle: {
    width: 20,
    height: 20,
  },
  videoIconStyle: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    padding: 5,
    alignItems: 'center',
  },
  videoIcon: {
    width: 25,
    height: 25,
  },
  deleteIconContainer: {
    position: 'absolute',
    right: 17,
    top: 5,
  },
  deleteIconStyle: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0,0, 0.5)',
  },
  deleteIcon: {
    width: 6,
    height: 7,
    resizeMode: 'contain',
    right: 1,
  },
  bottomButtonContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: wp(18),
    paddingBottom: hp(20),
  },
  backButtonStyle: {
    width: wp(162),
    height: hp(50),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.blue,
    justifyContent: 'center',
    marginBottom: 10,
  },
  backButtonTextStyle: {
    color: colors.black,
    textAlign: 'center',
    fontSize: hp(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },
  continueButtonStyle: {
    width: wp(162),
    height: hp(50),
    marginBottom: 10,
  },
  continueTextStyle: {
    fontSize: hp(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },
});

export default style;
