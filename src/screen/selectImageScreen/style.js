import {Dimensions, StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    marginHorizontal: wp(18),
    // backgroundColor: 'orange',
  },
  imageHeaderContainer: {
    marginTop: hp(18),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelIconStyle: {
    width: hp(16),
    height: hp(16),
    resizeMode: 'contain',
  },
  profileLogoStyle: {
    width: hp(24),
    height: hp(24),
    resizeMode: 'stretch',
    borderRadius: 50,
    marginRight: 3,
  },

  subHeadingContainer: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp(20),
    marginBottom: hp(18),
  },
  subTextImageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  subTextTittleStyle: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  dropImageStyle: {
    width: wp(11.31),
    height: hp(6.71),
    resizeMode: 'contain',
    marginLeft: wp(10),
    top: 2,
  },
  nextArrowIconStyle: {
    width: hp(20),
    height: hp(20),
    resizeMode: 'contain',
    marginRight: 3,
    tintColor: colors.blue,
    transform: [{rotate: '180deg'}],
  },
  flatListContainer: {
    flex: 1,
  },
  contentContainerStyle: {
    paddingBottom: hp(10),
  },
  flatListImageContainer: {
    height: 200,
    borderRadius: 10,
    backgroundColor: 'grey',
    margin: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  selectedContainer: {
    position: 'absolute',
    top: 10,
    padding: 5,
    borderRadius: 5,
    right: 8,
  },
  selectIconStyle: {
    width: hp(12),
    height: hp(12),
  },
  videoImageContainer: {
    position: 'absolute',
    bottom: '30%',
    left: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 5,
  },
  videoIconStyle: {
    width: hp(25),
    height: hp(25),
  },
});

export default style;
