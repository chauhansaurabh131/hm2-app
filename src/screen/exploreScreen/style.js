import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    height: hp(122),
  },
  headerContainerTittleStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  customerHeaderLogo: {
    width: wp(96),
    height: hp(24),
    resizeMode: 'contain',
    marginTop: hp(14),
    marginLeft: wp(17),
  },
  profileLogoStyle: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    resizeMode: 'stretch',
    marginTop: hp(14),
    marginRight: wp(20),
  },
  flatListStatusBarStyle: {
    flexDirection: 'row',
    paddingHorizontal: wp(17),
    marginTop: hp(22),
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statusBarContainerStyle: {
    height: hp(50),
    flexDirection: 'row',
    borderRadius: 29,
    alignItems: 'center',
    marginRight: wp(10),
  },
  statusBarIconStyle: {
    width: hp(40),
    height: hp(40),
    borderRadius: 50,
    resizeMode: 'cover',
    marginLeft: wp(8),
    marginRight: wp(9),
  },
  statusBarTittleTextStyle: {
    color: colors.black,
    fontFamily: fontFamily.poppins400,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    marginRight: wp(13),
  },
  bodyContainer: {
    flex: 1,
    marginTop: hp(5),
    marginHorizontal: 17,
  },
  bodyTittleContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: hp(20),
  },
  exploreTextStyle: {
    fontSize: fontSize(20),
    lineHeight: hp(30),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  filterIconStyle: {
    width: hp(24),
    height: hp(24),
    resizeMode: 'contain',
  },
  bottomSheetContainer: {
    flex: 1,
    marginTop: hp(10),
  },
  bottomSheetExploreText: {
    color: colors.black,
    textAlign: 'center',
    fontSize: fontSize(18),
    lineHeight: hp(27),
    fontFamily: fontFamily.poppins400,
  },
  bottomSheetBodyContainer: {
    marginHorizontal: 26,
    marginTop: hp(34),
  },
  textInputBodyStyle: {
    width: '100%',
    height: hp(50),
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 15,
    paddingRight: 50,
  },
  textInputIconStyle: {
    position: 'absolute',
    right: 15,
    top: 17,
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
  bottomSheetBodyTittleFirstStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(29),
    marginBottom: hp(20),
  },
  distanceTextStyle: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  kiloMeterTextStyle: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: colors.blue,
  },
  bottomSheetBodyTittleSecondStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(29),
    marginBottom: hp(20),
  },
  ageTextStyle: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  ageFilterTextStyle: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins400,
    color: colors.blue,
  },
  BottomSheetButtonContainer: {
    width: '100%',
    marginTop: hp(39),
  },
  bottomTextStyle: {
    color: colors.white,
  },

  userImageStyle: {
    width: '100%',
    height: hp(449),
    borderRadius: 10,
    marginBottom: hp(13),
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 10,
    width: '100%',
    height: '40%',
    marginBottom: hp(13),
  },
  UserDetailsContainer: {
    position: 'absolute',
    bottom: 35,
    width: '100%',
    marginLeft: wp(21),
    // backgroundColor: 'grey',
    // backgroundColor: 'rgba(0,0,0,0.05)',
  },
  onlineBodyStyle: {
    width: wp(34.8),
    height: hp(12),
    borderRadius: 5,
    backgroundColor: '#24FF00',
    justifyContent: 'center',
  },
  bodyTextStyle: {
    color: colors.black,
    fontSize: fontSize(8),
    lineHeight: hp(12),
    textAlign: 'center',
  },
  userNameTextStyle: {
    color: colors.white,
    fontSize: fontSize(20),
    lineHeight: hp(30),
    fontFamily: fontFamily.poppins700,
  },
  userDetailsDescriptionContainer: {
    flexDirection: 'row',
  },
  userDetailsTextStyle: {
    color: colors.white,
    fontSize: fontSize(10),
    lineHeight: hp(14),
    fontFamily: fontFamily.poppins400,
    marginRight: wp(2),
  },

  verticalLineStyle: {
    width: hp(1),
    height: '100%',
    backgroundColor: colors.white,
    marginHorizontal: wp(5),
  },

  bottomImageContainer: {
    flexDirection: 'row',
    marginTop: hp(22),
  },
  ShareLikeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },
  dislikeIcon: {
    width: hp(40),
    height: hp(40),
    resizeMode: 'contain',
    marginRight: 20,
  },
  likeIcon: {
    width: hp(40),
    height: hp(40),
    resizeMode: 'contain',
    marginRight: 20,
  },
  starIcon: {
    width: hp(40),
    height: hp(40),
    resizeMode: 'contain',
    marginRight: 20,
  },
  shareIcon: {
    width: hp(40),
    height: hp(40),
    resizeMode: 'contain',
  },
});

export default style;
