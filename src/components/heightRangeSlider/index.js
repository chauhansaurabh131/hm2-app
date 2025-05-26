import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';
import {style} from './style';

const {width: SCREEN_WIDTH} = Dimensions.get('window'); // Get device width

const HeightRangeSlider = ({
  initialRange,
  onSubmitRange,
  containerStyle,
  labelContainerStyle,
  rangeLabel,
  tittleLabel,
  tittleLabelText,
  trackStyle,
}) => {
  const [range, setRange] = useState(initialRange); // Default range values from parent

  // Sync local state with the parent prop when it changes
  useEffect(() => {
    setRange(initialRange);
  }, [initialRange]);

  const handleValuesChange = values => {
    const formattedValues = values.map(value => parseFloat(value.toFixed(1))); // Format to one decimal
    setRange(formattedValues);
    if (onSubmitRange) {
      onSubmitRange(formattedValues); // Update parent component with the latest range
    }
  };

  const CustomMarker = () => (
    <LinearGradient
      colors={['#0F52BA', '#BA0FA9']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1.3}}
      style={style.gradientMarker}
    />
  );

  return (
    <View style={[style.container, containerStyle]}>
      <View style={[style.labelContainer, labelContainerStyle]}>
        <Text style={[style.label, tittleLabel]}>{tittleLabelText}</Text>
        <Text style={[style.label, rangeLabel]}>
          {range[0]} - {range[1]}
        </Text>
      </View>
      <View style={{paddingHorizontal: 0, marginTop: -10}}>
        <MultiSlider
          values={[range[0], range[1]]}
          min={3.0}
          max={8.0}
          step={0.2} // Step size for decimal increments
          onValuesChange={handleValuesChange}
          selectedStyle={style.selectedStyle}
          unselectedStyle={style.unselectedStyle}
          customMarker={CustomMarker}
          containerStyle={style.sliderContainer}
          trackStyle={[style.trackStyle, trackStyle]}
          sliderLength={SCREEN_WIDTH - 40} // Full width minus padding
        />
      </View>
    </View>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     width: '90%', // Ensure full width
//   },
//   labelContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   label: {
//     fontSize: fontSize(18),
//     lineHeight: hp(27),
//     fontFamily: fontFamily.poppins400,
//     color: colors.black,
//   },
//   sliderContainer: {
//     alignSelf: 'center',
//   },
//   trackStyle: {
//     height: 1,
//     backgroundColor: '#d3d3d3', // Color of the track
//   },
//   selectedStyle: {
//     backgroundColor: '#0F52BA', // Active track color
//   },
//   unselectedStyle: {
//     backgroundColor: '#d3d3d3', // Inactive track color
//   },
//   gradientMarker: {
//     height: 16,
//     width: 16,
//     borderRadius: 8,
//   },
// });

export default HeightRangeSlider;
