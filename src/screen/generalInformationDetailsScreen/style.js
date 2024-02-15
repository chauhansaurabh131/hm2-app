import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, hp, wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainerStyle: {
    // backgroundColor: 'lightgreen',
    flex: 1,
    marginHorizontal: wp(18),
    marginTop: hp(8),
  },
  fillUpTextStyle: {
    color: colors.black,
    fontFamily: fontFamily.poppins400,
    fontSize: hp(12),
    lineHeight: hp(18),
    marginTop: hp(16),
  },
  textInputBodyStyle: {
    width: '100%',
    height: hp(50),
    borderWidth: 1,
    borderColor: colors.blue,
    padding: 15,
    borderRadius: 10,
    marginTop: hp(7),
  },
  selectedGenderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(5),
  },
  selectedGenderBodyStyle: {
    width: 105,
    height: 50,
    borderColor: colors.blue,
    borderRadius: 10,
    justifyContent: 'center',
  },
  selectedGenderGradientColorStyle: {
    flex: 1,
    borderRadius: 10,
    justifyContent: 'center',
  },
  DOBContainer: {
    width: '100%',
    height: hp(55),
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: hp(9),
  },
  DOBContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  DOBImageStyle: {
    width: hp(21.34),
    height: hp(24),
    marginLeft: wp(10),
    marginRight: wp(5),
    resizeMode: 'contain',
  },
  BOTContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: hp(9),
  },
  BOTContainerBody: {
    width: wp(103),
    height: hp(50),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.blue,
    textAlign: 'center',
  },
  descriptionContainer: {
    height: hp(90),
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 10,
    justifyContent: 'flex-start',
    marginTop: hp(12),
  },
});

export default style;
