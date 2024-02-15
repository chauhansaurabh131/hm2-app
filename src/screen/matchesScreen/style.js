import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    // backgroundColor: 'lightgreen',
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
    marginRight: wp(18),
  },
  flatListStatusBarStyle: {
    // flexDirection: 'row',
    // marginLeft: wp(17),
    // marginRight: wp(17),
    // marginTop: hp(22),
    // // backgroundColor: 'red',
    flexDirection: 'row',
    paddingHorizontal: wp(17),
    marginTop: hp(22),
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  statusBarContainerStyle: {
    height: hp(50),
    flexDirection: 'row',
    // backgroundColor: selectedTab === item.id ? '#F0F9FF' : colors.white,
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
  containerBodyStyle: {
    flex: 1,
    marginHorizontal: wp(17),
    marginTop: hp(8),
    // backgroundColor: 'orange',
  },
  userImageStyle: {
    width: '100%',
    height: hp(449),
    borderRadius: 10,
    marginBottom: hp(13),
  },
  UserDetailsContainer: {
    position: 'absolute',
    bottom: 35,
    width: '100%',
    marginLeft: wp(21),
    // backgroundColor: 'grey',
    backgroundColor: 'rgba(0,0,0,0.05)',
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
  userDetailsDescriptionContainer: {
    flexDirection: 'row',
  },
  bottomImageContainer: {
    flexDirection: 'row',
    marginTop: hp(22),
  },
});

export default style;
