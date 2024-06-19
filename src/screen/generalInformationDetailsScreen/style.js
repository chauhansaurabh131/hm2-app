import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, hp, wp} from '../../utils/helpers';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: wp(18),
    marginTop: hp(8),
  },
  BodyTittleTextStyle: {
    fontSize: hp(14),
    lineHeight: hp(19),
    marginTop: hp(16),
    color: colors.black,
    fontFamily: fontFamily.poppins500,
  },
  fistNameTextInputStyle: {
    width: '100%',
    height: hp(50),
    borderWidth: 1,
    borderColor: colors.lightGreyBorder,
    padding: 15,
    borderRadius: 10,
    marginTop: hp(7),
    paddingLeft: 16,
    color: colors.black,
  },
  lastNameTextInputStyle: {
    width: '100%',
    height: hp(50),
    borderWidth: 1,
    borderColor: colors.lightGreyBorder,
    padding: 15,
    borderRadius: 10,
    marginTop: hp(13),
    paddingLeft: 16,
    color: colors.black,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(5),
  },
  BODContainer: {
    width: '100%',
    height: hp(55),
    borderWidth: 1,
    borderColor: colors.lightGreyBorder,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: hp(9),
  },
});
