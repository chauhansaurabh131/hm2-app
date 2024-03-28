import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';
import {wp} from '../../utils/helpers';

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  bodyContainer: {
    marginHorizontal: 17,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default style;
