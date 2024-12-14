import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  containerBody: {
    marginHorizontal: 17,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  profileLogo: {
    width: hp(24),
    height: hp(24),
    borderRadius: 50,
    marginRight: hp(10.5),
    resizeMode: 'stretch',
    right: -7,
    marginTop: hp(10),
  },
  headerTittleContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTittleTextStyle: {
    color: colors.black,
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
  },
  addPhotoContainer: {
    width: hp(40),
    height: hp(40),
    justifyContent: 'center',
  },
  addPhotoImageStyle: {
    width: hp(14),
    height: hp(14),
    alignSelf: 'center',
    resizeMode: 'contain',
    marginLeft: 5,
  },
  bodyContainer: {
    marginHorizontal: 17,
    marginTop: hp(22),
  },
  headingDescriptionTextStyle: {
    color: colors.black,
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
  },
  headerUnderLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#F2F2F2',
    marginTop: 5,
  },
  postedContainer: {
    flexDirection: 'row',
    marginTop: hp(2),
    alignItems: 'center',
  },
  postedNameText: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
    color: colors.black,
  },
  postedTimeText: {
    fontSize: fontSize(12),
    lineHeight: hp(16),
    fontFamily: fontFamily.poppins400,
    color: '#787878',
    marginLeft: 10,
    marginTop: 1,
  },
  bodyShareContainer: {
    marginTop: hp(28),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bodyShareContainers: {
    flexDirection: 'row',
  },
  viewsNumber: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins600,
    color: colors.black,
  },
  likeIconContainer: {
    width: hp(38),
    height: hp(38),
    resizeMode: 'contain',
    marginRight: wp(37),
  },
  shareIcon: {
    width: hp(38),
    height: hp(38),
    resizeMode: 'contain',
  },
  bodyUnderLine: {
    width: '100%',
    height: 4,
    backgroundColor: '#E7E7E7',
    marginTop: hp(30),
  },
});

export default style;
