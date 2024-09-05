import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(14),
    // backgroundColor: 'lightblue',
  },
  customHeaderLogo: {
    width: wp(96),
    height: hp(24),
    marginLeft: wp(17),
    resizeMode: 'contain',
  },
  profileLogoStyle: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    marginRight: wp(17),
    resizeMode: 'contain',
  },
  userStoryContainer: {
    marginTop: hp(15),
    marginHorizontal: wp(17),
    height: hp(60),
  },
  userProfileImageStyle: {
    width: '100%',
    height: hp(449),
  },
  descriptionTextContainer: {
    marginHorizontal: wp(17),
    marginTop: hp(18),
  },
  descriptionTittleText: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
  },
  descriptionBodyText: {
    color: colors.black,
    fontFamily: fontFamily.poppins400,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    marginTop: hp(19),
  },
  UserDetailsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '90%',
    marginRight: wp(17),
    marginHorizontal: wp(17),
  },
  onlineBodyStyle: {
    width: wp(6),
    height: hp(6),
    borderRadius: 5,
    backgroundColor: '#24FF00',
    // justifyContent: 'center',
    marginLeft: wp(5),
    top: 15,
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
  bottomImageContainer: {
    flexDirection: 'row',
    marginTop: hp(22),
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
  imageBottomContainer: {
    flexDirection: 'row',
    marginTop: hp(22),
  },
  bottomImageStyle: {
    width: hp(20),
    height: hp(20),
    resizeMode: 'contain',
    marginRight: wp(22),
  },
  videoIconStyle: {
    width: hp(24.1),
    height: hp(20),
    resizeMode: 'contain',
  },
  likeIconContainer: {
    position: 'absolute',
    right: 0,
  },
  likeIconStyle: {
    width: hp(21.67),
    height: hp(20),
    resizeMode: 'contain',
  },
  imageIcon: {
    width: hp(20),
    height: hp(20),
    resizeMode: 'contain',
    marginRight: wp(22),
  },
  videoIcon: {
    width: hp(24.1),
    height: hp(20),
    resizeMode: 'contain',
  },
  startIconContainer: {
    marginLeft: wp(22),
  },
  starIcon: {
    width: hp(21.67),
    height: hp(20),
    resizeMode: 'contain',
  },
  likeSharContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
    // marginTop: -10,
    marginTop: 5,
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
  startIcon: {
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
  matchesText: {
    textAlign: 'center',
    fontSize: fontSize(10),
    lineHeight: hp(15),
    fontFamily: fontFamily.poppins400,
    color: colors.white,
  },
  matchesContainer: {
    width: hp(87),
    height: hp(24),
    borderRadius: 15,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
  },
});

export default style;
