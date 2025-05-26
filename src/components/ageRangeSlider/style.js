import {StyleSheet} from 'react-native';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

export const style = StyleSheet.create({
  container: {
    width: '90%', // Ensure full width
    // backgroundColor: 'red',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: fontSize(18),
    lineHeight: hp(27),
    fontFamily: fontFamily.poppins400,
    color: colors.black,
  },
  sliderContainer: {
    alignSelf: 'center',
  },
  trackStyle: {
    height: 1,
    backgroundColor: '#d3d3d3', // Color of the track
  },
  selectedStyle: {
    backgroundColor: '#0F52BA', // Active track color
  },
  unselectedStyle: {
    backgroundColor: '#d3d3d3', // Inactive track color
  },
  gradientMarker: {
    height: 16,
    width: 16,
    borderRadius: 8,
  },
});
