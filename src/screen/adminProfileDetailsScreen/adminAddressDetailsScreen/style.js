import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp} from '../../../utils/helpers';

export const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    marginTop: hp(30),
    marginHorizontal: 17,
  },
  residencyContainer: {
    marginBottom: hp(15),
  },
  titleText: {
    fontSize: fontSize(14),
    lineHeight: hp(21),
    fontFamily: fontFamily.poppins500,
    color: colors.black,
  },
  textInputContainer: {
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
  subTittleText: {
    color: colors.black,
    fontSize: fontSize(18),
    lineHeight: hp(28),
    fontFamily: fontFamily.poppins600,
    marginTop: hp(2),
  },
  editButtonContainer: {
    position: 'absolute',
    right: 20,
    top: -45,
  },
  buttonContainer: {
    marginTop: hp(10),
    borderRadius: 25,
    backgroundColor: '#F0F9FF',
    width: hp(40),
    height: hp(40),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveIcon: {
    width: hp(15),
    height: hp(15),
    tintColor: colors.blue,
    // resizeMode: 'contain',
  },
  editIcon: {
    width: hp(15),
    height: hp(15),
    tintColor: colors.blue,
  },
});
