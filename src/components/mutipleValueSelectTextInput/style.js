import {StyleSheet} from 'react-native';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

export const style = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textInput: {
    flex: 1,
    height: '100%',
    fontSize: fontSize(18),
    lineHeight: hp(27),
    fontFamily: fontFamily.poppins500,
    color: colors.black,
  },
  dropdownIcon: {
    height: 6,
    width: 10,
    tintColor: '#5F6368',
    transform: [{rotate: '-90deg'}],
    marginRight: 10,
  },
  bottomLine: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#C0C0C0',
    marginTop: hp(2),
  },
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  itemBox: {
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
  itemText: {
    fontSize: fontSize(16),
    lineHeight: hp(24),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  removeBtn: {
    marginLeft: 12,
    backgroundColor: '#5F6368',
    borderRadius: 12,
    width: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
