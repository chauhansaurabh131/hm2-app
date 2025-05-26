import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, isIOS, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerBackGroundImage: {
    height: hp(128),
    width: '100%',
    resizeMode: 'cover',
  },
  headerBodyContainer: {
    position: 'absolute',
    width: '100%',
    marginTop: isIOS ? hp(60) : hp(12),
  },
  headerLogoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 17,
  },
  appLogo: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
    marginTop: hp(2),
  },
  headerTopSheetImageContainer: {
    alignSelf: 'center',
  },
  profileLogo: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    marginRight: hp(10.5),
    resizeMode: 'cover',
    right: -7,
    marginTop: hp(2),
  },
  headerSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 17,
    marginTop: hp(22),
    backgroundColor: '#112873',
    borderRadius: 100,
    paddingHorizontal: 20,
    // paddingTop: 5,
  },
  searchTextInput: {
    flex: 1,
    height: hp(50),
    color: colors.white,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    // backgroundColor: 'red',
  },
  searchIcon: {
    width: hp(16),
    height: hp(16),
    marginLeft: hp(10),
    tintColor: colors.white,
  },
  advanceContainer: {
    marginHorizontal: 17,
    marginTop: hp(21),
    marginBottom: hp(21),
  },
  advanceBodyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  advanceText: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(27),
    fontFamily: fontFamily.poppins500,
  },
  savedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedText: {
    fontSize: fontSize(16),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: '#5130C2',
  },
  rightSideIcon: {
    width: hp(6),
    height: hp(11),
    marginLeft: hp(14),
    tintColor: '#5F6368',
  },

  ToggleContainer: {
    flex: 1,
    marginTop: hp(35),
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'red',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: fontSize(16),
    color: colors.black,
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins500,
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 50,
    backgroundColor: '#F5F5F5',
    padding: 2,
  },
  button: {
    width: 80,
    height: 40,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  activeButton: {
    elevation: 3, // Adds a shadow for the active button
  },
  inactiveButton: {
    backgroundColor: '#F5F5F5',
  },
  gradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  activeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  inactiveText: {
    color: '#000000',
    fontWeight: '500',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    // fontSize: fontSize(20),
    fontSize: fontSize(20),
    lineHeight: hp(26),
    fontFamily: fontFamily.poppins500,
    color: colors.black,
  },
  subtitle: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  textInputContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: hp(50),
    borderWidth: 1,
    borderColor: '#CDCDCD',
    borderRadius: 100,
    marginBottom: 20,
    marginTop: hp(37),
  },
  textInput: {
    fontSize: fontSize(16),
    color: '#000000',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    padding: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: hp(15),
    marginBottom: hp(15),
  },
  gradientButton: {
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: hp(136),
    height: hp(50),
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.6, // Lower opacity for disabled state
  },
  gradientButtonText: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    color: colors.white,
  },
  disabledButtonText: {
    color: '#A9A9A9', // Light gray text for disabled state
  },

  // new
  bottomSheetContainer: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    // padding: 20,
  },
  bottomSheetContent: {
    flex: 1,
    // justifyContent: 'flex-start',
    // backgroundColor: 'orange',
  },
  bottomSheetTitle: {
    fontSize: fontSize(16),
    // marginBottom: 20,
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
    marginTop: hp(23),
    marginHorizontal: hp(30),
  },
  bottomSheetLine: {
    width: '100%',
    height: 0.7,
    backgroundColor: '#E7E7E7',
    marginTop: hp(21),
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    // backgroundColor: 'red',
  },
  bottomSheetItem: {
    fontSize: fontSize(16),
    marginBottom: 5,
    color: colors.black,
    lineHeight: hp(30),
    fontFamily: fontFamily.poppins400,
    // backgroundColor: 'orange',
    width: wp(250),
  },
  deleteIcon: {
    width: hp(16),
    height: hp(16),
    tintColor: '#5F6368',
    // marginRight: 5,
    resizeMode: 'contain',
  },
});

export default style;
