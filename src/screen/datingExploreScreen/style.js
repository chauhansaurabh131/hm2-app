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
    width: wp(245),
    height: hp(40),
    borderRadius: 20,
    borderColor: '#F1F1F1',
    borderWidth: 1,
    alignItems: 'center',
  },
  activeButton: {
    borderRadius: 20,
    width: wp(123),
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
    width: wp(123),
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
    margin: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: wp(167),
    height: wp(160),
    resizeMode: 'contain',
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
    // alignItems: 'center',
    marginTop: hp(5),
  },
});
