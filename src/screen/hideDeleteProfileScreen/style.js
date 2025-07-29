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
    width: hp(21.2),
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
  bodyContainerView: {
    flex: 1,
    marginHorizontal: wp(17),
    marginTop: hp(22),
  },
  bodyTittleTextStyle: {
    color: colors.black,
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
  },

  descriptionBodyUnderlineStyleDropdown: {
    width: '100%',
    borderWidth: 0.7,
    borderColor: '#E7E7E7',
    marginTop: hp(32),
  },

  deleteButtonStyle: {
    width: '100%',
    height: hp(50),
    borderRadius: 10,
    marginTop: hp(17),
    justifyContent: 'center',
    backgroundColor: colors.red,
  },

  dropDownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(18),
  },
  textInputBodyStyle: {
    width: '100%',
    height: hp(50),
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#F7F7F7',
    color: colors.black,
  },
  textInputImageView: {
    height: hp(30),
    width: hp(30),
    marginLeft: -40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInputImageStyle: {
    width: hp(10.36),
    height: hp(6),
  },
  dropDownBoxContainer: {
    position: 'absolute',
    width: wp(339),
    top: 70,
    left: wp(10),
    zIndex: 1,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  dropDownBoxContainerView: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },

  modalContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBodyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBodyStyle: {
    width: '90%',
    // height: hp(291),
    backgroundColor: 'white',
    // padding: 20,
    borderRadius: 20,
    justifyContent: 'center',
  },
  modalTittleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp(51),
  },
  modalTittleText: {
    fontSize: fontSize(24),
    lineHeight: hp(30),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
    marginTop: 5,
  },
  modalTittleDescriptionText: {
    fontSize: fontSize(18),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
    marginTop: hp(5),
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: hp(43),
    marginBottom: hp(39),
  },
  confirmButtonStyle: {
    width: hp(126),
    height: hp(50),
    borderRadius: 50,
    justifyContent: 'center',
  },
  confirmButtonTextStyle: {
    textAlign: 'center',
    color: colors.white,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
  },
  tittleDescriptionTextContainer: {
    marginTop: hp(16),
    marginBottom: hp(15),
  },
  tittleDescriptionTextStyle: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: '#7C7878',
  },
});

export default style;
