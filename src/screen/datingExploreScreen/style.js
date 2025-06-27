import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    marginHorizontal: wp(17),
  },
  headersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(12),
  },
  logo: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
    marginTop: hp(2),
  },
  profileImage: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    marginRight: hp(10.5),
    resizeMode: 'stretch',
    right: -7,
    marginTop: hp(2),
  },
  buttonGroup: {
    flexDirection: 'row',
    alignSelf: 'center',
    // width: wp(245),
    width: '100%',
    height: hp(40),
    borderRadius: 20,
    borderColor: '#F1F1F1',
    borderWidth: 1,
    alignItems: 'center',
  },
  activeButton: {
    borderRadius: 20,
    width: wp(107),
    height: hp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeButtonText: {
    color: 'white',
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins500,
  },
  inactiveButton: {
    backgroundColor: 'transparent',
    borderRadius: 20,
    width: wp(124),
    height: hp(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  inactiveButtonText: {
    color: 'black',
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins500,
  },
  imageContainer: {
    flex: 1,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'orange',
  },
  image: {
    width: wp(172),
    height: wp(160),
    resizeMode: 'contain',
    marginTop: 2,
  },
  textContainer: {
    position: 'absolute',
    bottom: 22,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  text: {
    color: 'white',
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins700,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  row: {
    justifyContent: 'space-between',
  },
  flatListContentContainer: {
    paddingBottom: 70,
    marginTop: 10,
  },
  bodyContainer: {
    marginHorizontal: wp(17),
    marginTop: hp(17),
  },
  categoryBodyContainer: {
    marginTop: hp(5),
  },
  requestRenderContainer: {
    flexDirection: 'row',
    // alignItems: 'center',
    // marginBottom: hp(10),
    // backgroundColor: 'silver',
    marginTop: 10,
    // height: 'auto',
  },
  renderUserProfileImage: {
    width: hp(50),
    height: hp(50),
    borderRadius: 25,
    marginRight: wp(16),
    marginTop: hp(5),
  },
  requestRenderBodyContainer: {
    flex: 1,
    marginTop: hp(10),
    // backgroundColor: 'orange',
  },
  requestRenderNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  requestRenderName: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
    color: colors.black,
  },
  requestRenderRelative: {
    fontSize: fontSize(10),
    lineHeight: hp(15),
    fontFamily: fontFamily.poppins400,
    color: '#BEBDBD',
  },
  requestRenderOccupation: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
    top: 2,
    // backgroundColor: 'green',
  },
  requestRenderButtonContainer: {
    flexDirection: 'row',
    top: 10,
  },
  requestRenderButton: {
    width: hp(63),
    height: hp(34),
    resizeMode: 'contain',
  },
  threeDotBottomSheetBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  threeDotBottomSheetIcon: {
    width: hp(17),
    height: hp(17),
    resizeMode: 'contain',
    marginRight: hp(22),
  },
  threeDotBottomSheetTittleText: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  threeDotBottomSheetContainers: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: hp(20),
    // backgroundColor: 'silver',
  },
});
