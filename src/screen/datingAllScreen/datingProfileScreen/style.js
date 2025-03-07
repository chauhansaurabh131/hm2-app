import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headingTittleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(17),
  },
  profileLogoStyle: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    resizeMode: 'stretch',
    marginTop: hp(15),
  },
  bodyContainer: {
    flex: 1,
  },
  imageTextContainer: {
    position: 'absolute',
    bottom: 19,
    marginLeft: wp(17),
  },
  imageNameText: {
    color: colors.white,
    fontSize: fontSize(22),
    lineHeight: hp(36),
    fontFamily: fontFamily.poppins600,
  },
  imageSubTextTittle: {
    color: colors.white,
    fontSize: fontSize(12),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },
  profileLikeDislikeContainer: {
    marginHorizontal: wp(18),
    marginTop: hp(19),
  },
  profileLikeDislikeContainerBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileLikeDislikeSeparateContainer: {
    flexDirection: 'row',
  },
  likeProfileIcon: {
    width: hp(15.28),
    height: hp(13.67),
    marginRight: wp(8),
    resizeMode: 'contain',
    top: 2,
  },
  TittleTextStyle: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
  },
  subTittleTextStyle: {
    color: '#8B8B8B',
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
  },
  upArrowIcon: {
    width: hp(10),
    height: hp(10),
    marginRight: wp(8),
    resizeMode: 'contain',
    top: 3,
  },
  downArrowIcon: {
    width: hp(10),
    height: hp(10),
    marginRight: wp(8),
    transform: [{rotate: '180deg'}],
    resizeMode: 'contain',
    top: 3,
  },
  horizontalLine: {
    width: '100%',
    borderWidth: 0.7,
    borderColor: '#E2E2E2',
    marginTop: hp(16),
  },
  writeBoutYourSelfText: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    marginTop: hp(27),
    marginBottom: hp(27),
    marginHorizontal: hp(18),
  },
  backGroundSpace: {
    width: '100%',
    backgroundColor: '#F5F5F5',
    height: hp(4),
  },
  purposeContainer: {
    marginTop: hp(18),
    marginHorizontal: wp(17),
  },
  purposeContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  purposeTextStyle: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(27),
    fontFamily: fontFamily.poppins600,
    alignSelf: 'center',
  },
  editButton: {
    width: hp(44),
    height: hp(44),
    borderRadius: 50,
    resizeMode: 'contain',
  },
  interestContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  interestBody: {
    backgroundColor: '#F3F3F3',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 25,
  },
  interestText: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    color: colors.black,
    fontFamily: fontFamily.poppins500,
  },
  basicInfoText: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(27),
    fontFamily: fontFamily.poppins600,
  },
  subTittleText: {
    color: colors.gray,
    marginTop: hp(20),
  },
  TittleText: {
    color: colors.black,
    marginTop: hp(5),
    fontSize: fontSize(16),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
  },
  languageContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 10,
    marginRight: 10,
  },
});
