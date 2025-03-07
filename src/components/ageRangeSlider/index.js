import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import LinearGradient from 'react-native-linear-gradient';
import {fontFamily, fontSize, hp} from '../../utils/helpers';
import {colors} from '../../utils/colors';

const {width: SCREEN_WIDTH} = Dimensions.get('window'); // Get device width

const AgeRangeSlider = ({
  initialRange,
  onSubmitRange,
  containerStyle,
  labelContainerStyle,
  rangeLabel,
  tittleLabel,
  tittleLabelText,
  trackStyle,
  rangeDatalabel,
  min,
  max,
  hideRangeLabel,
}) => {
  const [ranges, setRanges] = useState(initialRange); // Default range values from parent

  // Sync local state with the parent prop when it changes
  useEffect(() => {
    setRanges(initialRange);
  }, [initialRange]);

  const handleValuesChange = values => {
    setRanges(values);
    if (onSubmitRange) {
      onSubmitRange(values); // Update parent component with the latest range
    }
  };

  const CustomMarker = () => (
    <LinearGradient
      colors={['#0F52BA', '#BA0FA9']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1.3}}
      style={styles.gradientMarker}
    />
  );

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.labelContainer, labelContainerStyle]}>
        <Text style={[styles.label, tittleLabel]}>{tittleLabelText}</Text>
        {!hideRangeLabel && ( // Condition to show/hide range label
          <Text style={[styles.label, rangeLabel]}>
            {ranges[0]} - {ranges[1]}
            {rangeDatalabel}
          </Text>
        )}
      </View>
      <View style={{paddingHorizontal: 0, marginTop: -10}}>
        <MultiSlider
          values={[ranges[0], ranges[1]]}
          // min={18}
          // max={50}
          min={min}
          max={max}
          step={1}
          onValuesChange={handleValuesChange}
          selectedStyle={styles.selectedStyle}
          unselectedStyle={styles.unselectedStyle}
          customMarker={CustomMarker}
          containerStyle={styles.sliderContainer}
          trackStyle={[styles.trackStyle, trackStyle]}
          sliderLength={SCREEN_WIDTH - 40} // Full width minus padding
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default AgeRangeSlider;
