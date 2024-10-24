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
    resizeMode: 'cover',
  },
  userStoryContainer: {
    marginTop: hp(15),
    marginHorizontal: wp(17),
    height: hp(60),
  },
  userProfileImage: {
    width: '100%',
    height: hp(449),
    resizeMode: 'cover',
  },

  UserDetailsContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    // backgroundColor: 'rgba(0,0,0,0.2)',
    // marginRight: wp(17),
    height: 20,
    // backgroundColor: 'red',
  },
  onlineBodyStyle: {
    width: wp(34.8),
    height: hp(12),
    borderRadius: 5,
    backgroundColor: '#24FF00',
    justifyContent: 'center',
    marginRight: wp(18.16),
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

  profileLikeDislikeContainer: {
    // backgroundColor: 'green',
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
  bodyContainerStyle: {
    marginHorizontal: wp(18),
  },

  underLineStyle: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#E2E2E2',
    marginTop: hp(16),
  },

  bodyContainer: {
    flex: 1,
    marginHorizontal: wp(18),
    marginTop: hp(18),
  },
  descriptionBodyText: {
    color: colors.black,
    fontFamily: fontFamily.poppins400,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    marginTop: hp(19),
  },
  toggleButtonStyle: {
    alignItems: 'center',
  },
  toggleImageStyle: {
    width: 8,
    height: 8,
    marginTop: hp(20),
    tintColor: colors.blue,
  },
});

export default style;
