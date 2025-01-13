import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';

export const styles = StyleSheet.create({
  hobbiesContainer: {
    // alignItems: 'center',
    // backgroundColor: 'red',
  },
  hobbyBox: {
    // backgroundColor: colors.lightGray, // Adjust this color as needed
    backgroundColor: '#F3F3F3', // Adjust this color as needed
    padding: wp(10),
    // margin: wp(2),
    borderRadius: 25,
    // justifyContent: 'center',
    // alignItems: 'center',
    // width: wp(90),
    width: 'auto',
    height: wp(42), // Ensure the box is square
    marginRight: 10,
    paddingHorizontal: 15,
  },
  hobbyText: {
    fontSize: fontSize(16),
    color: colors.black,
    textAlign: 'center',
    fontFamily: fontFamily.poppins400,
    lineHeight: hp(24),
  },
});

// export default style;
