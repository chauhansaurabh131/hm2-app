import {StyleSheet} from 'react-native';
import {fontFamily, fontSize, hp, wp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

export const style = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginTop: 2,
  },
  cardContainer: {
    alignSelf: 'center',
    marginTop: hp(15),
    width: '100%',
  },
  cardBodyStyle: {
    // width: wp(341),
    // width: wp(370),
    width: '100%',
    height: hp(154),
    borderRadius: hp(10),
    justifyContent: 'center',
  },
  cardViewStyle: {
    flexDirection: 'row',
  },
  imageStyle: {
    width: wp(110),
    height: hp(136),
    marginLeft: wp(10),
    borderRadius: 5,
    resizeMode: 'cover',
  },
  cardTextContainer: {
    marginLeft: hp(30),
    marginTop: hp(10),
    width: '52%',
  },
  cardUserTextStyle: {
    fontSize: fontSize(20),
    lineHeight: hp(28),
    fontFamily: fontFamily.poppins500,
    color: colors.white,
  },
  cardSubTittleContainer: {
    flexDirection: 'row',
  },
  cardSubTittleTextStyle: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins400,
    color: colors.white,
  },
  cardCenterLineStyle: {
    height: hp(13),
    // borderWidth: 0.9,
    // borderColor: colors.white,
    marginLeft: hp(10),
    marginRight: hp(10),
    top: 3,
    width: 1,
    backgroundColor: colors.white,
  },
  cardButtonContainer: {
    position: 'absolute',
    bottom: 15,
  },
  cardButtonBodyStyle: {
    height: hp(40),
    width: wp(124),
    borderRadius: hp(20),
    backgroundColor: colors.white,
    justifyContent: 'center',
  },
  cardButtonTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp(18),
  },
  cardButtonTextStyle: {
    fontSize: fontSize(12),
    lineHeight: hp(18),
    color: colors.black,
    fontFamily: fontFamily.poppins500,
  },
  cardButtonImageStyle: {
    width: hp(18.88),
    height: hp(16),
    resizeMode: 'stretch',
  },
});
