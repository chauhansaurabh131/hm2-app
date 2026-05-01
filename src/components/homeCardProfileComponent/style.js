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
    height: hp(138),
    borderRadius: hp(20),
    justifyContent: 'center',
  },
  cardViewStyle: {
    flexDirection: 'row',
  },
  imageStyle: {
    width: wp(93),
    height: hp(93),
    marginLeft: wp(23),
    borderRadius: hp(50),
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  cardTextContainer: {
    marginLeft: hp(25),
    // marginTop: hp(10),
    // width: '52%',
    alignSelf: 'center',
  },
  cardUserTextStyle: {
    fontSize: fontSize(20),
    lineHeight: hp(28),
    fontFamily: fontFamily.poppins500,
    color: colors.white,
  },
  cardSubTittleContainer: {
    flexDirection: 'row',
    marginTop: hp(3),
  },
  cardSubTittleTextStyle: {
    fontSize: fontSize(10),
    lineHeight: hp(18),
    fontFamily: fontFamily.poppins600,
    color: colors.white,
  },
  cardCenterLineStyle: {
    height: hp(12),
    marginLeft: hp(10),
    marginRight: hp(10),
    top: 3,
    width: hp(1),
    backgroundColor: '#BDA6FF',
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
