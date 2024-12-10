import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {fontFamily, fontSize, hp} from '../../utils/helpers';

export const style = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#C0C0C0',
    width: '100%',
    height: hp(50),
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderLeftWidth: 0,
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: fontSize(18),
    lineHeight: hp(27),
    fontFamily: fontFamily.poppins500,
  },
  dropdownIcon: {
    height: 6,
    width: 10,
    tintColor: '#5F6368',
    transform: [{rotate: '-90deg'}],
    marginRight: 10,
  },
  selectedValuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: hp(21),
  },
  chip: {
    backgroundColor: '#F3F3F3',
    borderRadius: 25,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: hp(40),
  },
  chipText: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  removeChipButton: {
    marginLeft: 12,
    backgroundColor: '#5F6368',
    borderRadius: 12,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeChipText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  option: {
    marginHorizontal: 17,
  },
  optionText: {
    padding: 10,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamily.poppins500,
    color: colors.black,
  },
});
