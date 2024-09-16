import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    marginTop: hp(60),
  },
  tittleContainer: {
    marginBottom: hp(15),
  },
  tittleTextStyle: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
    color: colors.black,
  },
  textInputStyle: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(28),
    fontFamily: fontFamily.poppins600,
    marginTop: hp(2),
    borderWidth: 1,
    borderColor: colors.gray,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  textInputTextStyle: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(28),
    fontFamily: fontFamily.poppins600,
    marginTop: hp(2),
  },
  buttonContainer: {
    position: 'absolute',
    right: 0,
  },
  buttonStyle: {
    marginTop: hp(10),
    borderRadius: 5,
    backgroundColor: '#F0F9FF',
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: 'ree',
  },
  editIcon: {
    width: 25,
    height: 25,
    tintColor: colors.blue,
  },
});
