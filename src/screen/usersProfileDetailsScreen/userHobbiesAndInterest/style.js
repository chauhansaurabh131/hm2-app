import {StyleSheet} from 'react-native';
import {colors} from '../../../utils/colors';
import {fontFamily, fontSize, hp, wp} from '../../../utils/helpers';

export const styles = StyleSheet.create({
  hobbiesContainer: {
    // alignItems: 'center',
  },
  hobbyBox: {
    // backgroundColor: colors.lightGray, // Adjust this color as needed
    backgroundColor: '#E8E9EB', // Adjust this color as needed
    padding: wp(2),
    margin: wp(2),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: wp(90),
    height: wp(50), // Ensure the box is square
  },
  hobbyText: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'center',
  },
});

// export default style;
