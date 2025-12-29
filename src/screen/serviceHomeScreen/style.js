import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    marginTop: hp(15),
    marginHorizontal: wp(15),
  },
  searchContainer: {
    height: hp(40),
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: hp(50),
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  searchTextInput: {
    fontSize: fontSize(14),
    color: colors.pureBlack,
  },
  discoverTextContainer: {
    marginHorizontal: wp(13),
    marginTop: hp(34),
  },
  discoverTextStyle: {
    color: colors.pureBlack,
    fontSize: fontSize(14),
    fontFamily: fontFamily.poppins400,
  },
  discoverBodyContainer: {
    marginHorizontal: 14,
    marginTop: 20,
  },
  discoverWrapContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  discoverWrapStyle: {
    width: '30%',
    alignItems: 'center',
    marginBottom: hp(18),
  },
  discoverImageStyle: {
    width: '100%',
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: '#D6D6D6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  discoverIconStyle: {
    width: hp(45),
    height: hp(45),
    resizeMode: 'contain',
  },
  discoverIconLabel: {
    marginTop: hp(11),
    fontSize: fontSize(10),
    color: colors.pureBlack,
    fontFamily: fontFamily.poppins400,
  },
  horizontalOne: {
    width: '100%',
    height: 4,
    backgroundColor: '#F7F7F7',
    marginTop: hp(15),
  },
  horizontalTwo: {
    width: '100%',
    height: 4,
    backgroundColor: '#F7F7F7',
    marginTop: hp(38),
  },
});

export default style;
