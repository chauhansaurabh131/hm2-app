import {StyleSheet} from 'react-native';
import {colors} from '../../utils/colors';

const style = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: 'lightgreen',
    backgroundColor: colors.white,
  },
  bottomButtonsContainer: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: -10,
    marginBottom: 30,
    alignSelf: 'center',
    height: 70,
    backgroundColor: 'red',
    flex: 1,
  },
});

export default style;
