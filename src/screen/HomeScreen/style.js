import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerViewContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(12),
  },
  headerImageStyle: {
    top: -15,
    left: -30,
  },
  headerTopSheetImageContainer: {
    alignSelf: 'center',
  },
  headerTopSheetImageStyle: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    marginRight: hp(10.5),
    resizeMode: 'stretch',
    right: -7,
    marginTop: hp(2),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(300, 300, 255, 0.5)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBodyContainer: {
    // backgroundColor: 'gray',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: hp(10),
    width: wp(340),
    height: hp(279),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeadingText: {
    fontSize: fontSize(24),
    lineHeight: hp(36),
    fontFamily: fontFamily.nunito700,
    fontWeight: '700',
    color: colors.blue,
  },
  modalSubTittleContainer: {marginTop: hp(50), alignItems: 'center'},
  modalSubTitleTextStyle: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(22),
    // fontFamily: fontFamily.inter400,
    fontFamily: 'Poppins',
    fontWeight: '700',
  },
  gradientButtonContainerStyle: {
    width: wp(280),
    height: hp(50),
    marginTop: hp(50),
  },
  cardContainer: {
    alignSelf: 'center',
    marginTop: hp(15),
    width: '100%',
  },
  cardBodyStyle: {
    // width: wp(341),
    // width: wp(370),
    width: '100%',
    height: hp(154),
    borderRadius: hp(10),
    justifyContent: 'center',
  },
  cardViewStyle: {
    flexDirection: 'row',
  },
  imageStyle: {
    width: wp(110),
    height: hp(136),
    marginLeft: wp(10),
    borderRadius: 5,
    resizeMode: 'stretch',
  },
  cardTextContainer: {
    marginLeft: hp(30),
    marginTop: hp(10),
  },
  cardUserTextStyle: {
    fontSize: fontSize(22),
    lineHeight: hp(33),
    fontWeight: '600',
    color: colors.white,
  },
  cardSubTittleContainer: {
    flexDirection: 'row',
  },
  cardSubTittleTextStyle: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontWeight: '400',
    color: colors.white,
  },
  cardCenterLineStyle: {
    height: hp(13),
    borderWidth: 0.9,
    borderColor: colors.white,
    marginLeft: hp(10),
    marginRight: hp(10),
    top: 3,
  },
  cardButtonContainer: {
    position: 'absolute',
    bottom: 15,
  },
  cardButtonBodyStyle: {
    height: hp(40),
    width: wp(124),
    borderRadius: hp(20),
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  cardButtonTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(18),
  },
  cardButtonTextStyle: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    color: colors.black,
    fontFamily: fontFamily.poppins600,
  },
  cardButtonImageStyle: {
    width: hp(18.88),
    height: hp(16),
    resizeMode: 'stretch',
  },
  premiumTextContainer: {
    // marginLeft: wp(30),
    flexDirection: 'row',
    marginTop: hp(34),
    // backgroundColor: 'red',
  },
  premiumTextStyle: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
    marginRight: hp(3),
  },
  premiumTextsStyle: {
    color: colors.blue,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontWeight: '600',
  },
  PremiumMatchesTextContainer: {
    marginTop: hp(10),
    // marginLeft: wp(16),
  },
  showMeAllTextStyle: {
    color: colors.black,
    textAlign: 'center',
    fontSize: fontSize(14),
    lineHeight: hp(16),
    fontWeight: fontFamily.poppins500,
    justifyContent: 'center',
  },

  // VERIFICATION MODAL CSS

  verificationModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verificationModalContainerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  verificationModalBodyStyle: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    width: wp(355),
    // width: '100%',
    // height: hp(416),
    alignItems: 'center',
    marginHorizontal: 17,
  },
  verificationModalHeadingStyle: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontWeight: '400',
    marginTop: hp(33),
  },
  verificationDescriptionStyle: {
    alignItems: 'center',
    marginTop: hp(26),
  },

  verificationDescriptionText: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontWeight: '400',
    fontFamily: fontFamily.poppins400,
  },
});

export default style;
